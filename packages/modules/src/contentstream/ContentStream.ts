/**
 * A ContentStream represents [[Content]] which needs to be validated
 * and transformed.
 *
 * @packageDocumentation
 * @module ContentStream
 */

import type {
  IContentStream,
  CompressedContentStream,
  Hash,
  IContent,
  IMark,
} from '@cord.network/types'
import { Crypto, SDKErrors } from '@cord.network/utils'
import * as ContentUtils from '../content/Content.utils.js'
import { Mark } from '../mark/Mark.js'
import { Identity } from '../identity/Identity.js'
import * as ContentStreamUtils from './ContentStream.utils.js'
import { STREAM_IDENTIFIER, STREAM_PREFIX } from '@cord.network/types'
import { Identifier } from '@cord.network/utils'

function verifyCreatorSignature(content: IContentStream): boolean {
  return Crypto.verify(
    content.rootHash,
    content.issuerSignature,
    content.content.issuer
  )
}

function getHashRoot(leaves: Uint8Array[]): Uint8Array {
  const result = Crypto.u8aConcat(...leaves)
  return Crypto.hash(result)
}

export type Options = {
  legitimations?: Mark[]
  link?: IContentStream['link']
  space?: IContentStream['space']
}

export class ContentStream implements IContentStream {
  /**
   * [STATIC] Builds an instance of [[ContentStream]], from a simple object with the same properties.
   * Used for deserialization.
   *
   */
  public static fromRequest(content: IContentStream): ContentStream {
    return new ContentStream(content)
  }

  /**
   * [STATIC] Builds a new instance of [[ContentStream]], from a complete set of required parameters.
   *
   * @param content An `IContentStream` object the request for mark is built for.
   * @param identity The Holder's [[Identity]].
   * @param option Container for different options that can be passed to this method.
   * @param option.proofs Array of [[Mark]] objects.
   * @throws [[ERROR_IDENTITY_MISMATCH]] when streamInput's holder address does not match the supplied identity's address.
   * @returns A new [[ContentStream]] object.
   * @example ```javascript
   * const input = ContentStream.fromStreamAndIdentity(content, alice);
   * ```
   */
  public static fromContentProperties(
    content: IContent,
    issuer: Identity,
    { legitimations, link, space }: Options = {}
  ): ContentStream {
    if (content.issuer !== issuer.address) {
      throw new SDKErrors.ERROR_IDENTITY_MISMATCH()
    }

    const { hashes: contentHashes, nonceMap: contentNonceMap } =
      ContentUtils.hashContents(content)

    const rootHash = ContentStream.calculateRootHash({
      legitimations,
      contentHashes,
    })

    return new ContentStream({
      content,
      contentHashes,
      contentNonceMap,
      legitimations: legitimations || [],
      link,
      space,
      issuerSignature: ContentStream.sign(issuer, rootHash),
      rootHash,
      identifier: Identifier.getIdentifier(
        rootHash,
        STREAM_IDENTIFIER,
        STREAM_PREFIX
      ),
    })
  }

  /**
   * [STATIC] Update instance of [[ContentStream]], from a complete set of required parameters.
   *
   * @param content An `IContentStream` object the request for mark is built for.
   * @param identity The Holder's [[Identity]].
   * @param option Container for different options that can be passed to this method.
   * @param option.proofs Array of [[Mark]] objects.
   * @throws [[ERROR_IDENTITY_MISMATCH]] when streamInput's holder address does not match the supplied identity's address.
   * @returns A new [[ContentStream]] object.
   * @example ```javascript
   * const input = ContentStream.fromStreamAndIdentity(content, alice);
   * ```
   */
  public static updateContentProperties(
    content: IContentStream,
    issuer: Identity,
    { legitimations }: Options = {}
  ): ContentStream {
    if (content.content.issuer !== issuer.address) {
      throw new SDKErrors.ERROR_IDENTITY_MISMATCH()
    }
    let updateLegitimations = legitimations || content.legitimations

    const { hashes: contentHashes, nonceMap: contentNonceMap } =
      ContentUtils.hashContents(content.content)

    const rootHash = ContentStream.calculateRootHash({
      legitimations: updateLegitimations,
      contentHashes,
    })

    return new ContentStream({
      content: content.content,
      contentHashes,
      contentNonceMap,
      legitimations: legitimations || content.legitimations,
      link: content.link,
      issuerSignature: ContentStream.sign(issuer, rootHash),
      rootHash,
      identifier: content.identifier,
    })
  }

  /**
   * [STATIC] Custom Type Guard to determine input being of type IContentStream..
   *
   * @param input - A potentially only partial [[]].
   *
   * @returns  Boolean whether input is of type IContentStream.
   */
  public static isIMarkContent(input: unknown): input is IContentStream {
    try {
      ContentStreamUtils.errorCheck(input as IContentStream)
    } catch (error) {
      return false
    }
    return true
  }

  public content: IContent
  public contentHashes: string[]
  public contentNonceMap: Record<string, string>
  public legitimations: Mark[]
  public link: IContentStream['link']
  public space: IContentStream['space']
  public issuerSignature: string
  public rootHash: Hash
  public identifier: string

  /**
   * Builds a new [[ContentStream]] instance.
   *
   * @param requestForMarkInput - The base object from which to create the input.
   * @example ```javascript
   * // create a new request for mark
   * const reqForAtt = new ContentStream(requestForMarkInput);
   * ```
   */
  public constructor(contentStreamRequest: IContentStream) {
    ContentStreamUtils.errorCheck(contentStreamRequest)
    this.identifier = contentStreamRequest.identifier
    this.content = contentStreamRequest.content
    this.contentHashes = contentStreamRequest.contentHashes
    this.contentNonceMap = contentStreamRequest.contentNonceMap
    if (
      contentStreamRequest.legitimations &&
      Array.isArray(contentStreamRequest.legitimations) &&
      contentStreamRequest.legitimations.length
    ) {
      this.legitimations = contentStreamRequest.legitimations.map((proof) =>
        Mark.fromMark(proof)
      )
    } else {
      this.legitimations = []
    }
    this.rootHash = contentStreamRequest.rootHash
    this.link = contentStreamRequest.link
    this.space = contentStreamRequest.space
    this.issuerSignature = contentStreamRequest.issuerSignature
    this.verifySignature()
    this.verifyData()
  }

  /**
   * Removes [[Content] properties from the [[ContentStream]] object, provides anonymity and security when building the [[createPresentation]] method.
   *
   * @param properties - Properties to remove from the [[Stream]] object.
   * @throws [[ERROR_STREAM_HASHTREE_MISMATCH]] when a property which should be deleted wasn't found.
   * @example ```javascript
   * const rawStream = {
   *   name: 'Alice',
   *   age: 29,
   * };
   * const stream = Stream.fromMTypeAndStreamContents(mtype, rawStream, alice);
   * const reqForAtt = ContentStream.fromStreamAndIdentity({
   *   stream,
   *   identity: alice,
   * });
   * reqForAtt.removeStreamProperties(['name']);
   * // reqForAtt does not contain `name` in its streamHashTree and its stream marks anymore.
   * ```
   */
  public removeContentProperties(properties: string[]): void {
    properties.forEach((key) => {
      delete this.content.contents[key]
    })
    this.contentNonceMap = ContentUtils.hashContents(this.content, {
      nonces: this.contentNonceMap,
    }).nonceMap
  }

  /**
   * Verifies the data of the [[ContentStream]] object; used to check that the data was not tampered with, by checking the data against hashes.
   *
   * @param input - The [[ContentStream]] for which to verify data.
   * @returns Whether the data is valid.
   * @throws [[ERROR_STREAM_NONCE_MAP_MALFORMED]] when any key of the stream marks could not be found in the streamHashTree.
   * @throws [[ERROR_ROOT_HASH_UNVERIFIABLE]] or [[ERROR_SIGNATURE_UNVERIFIABLE]] when either the rootHash or the signature are not verifiable respectively.
   * @example ```javascript
   * const reqForAtt = ContentStream.fromStreamAndIdentity(stream, alice);
   * ContentStream.verifyData(reqForAtt); // returns true if the data is correct
   * ```
   */
  public static verifyData(input: IContentStream): boolean {
    // check stream hash
    if (!ContentStream.verifyRootHash(input)) {
      throw new SDKErrors.ERROR_ROOT_HASH_UNVERIFIABLE()
    }
    // check signature
    if (!ContentStream.verifySignature(input)) {
      throw new SDKErrors.ERROR_SIGNATURE_UNVERIFIABLE()
    }

    // verify properties against selective disclosure proof
    const verificationResult = ContentUtils.verifyDisclosedAttributes(
      input.content,
      {
        nonces: input.contentNonceMap,
        hashes: input.contentHashes,
      }
    )
    // TODO: how do we want to deal with multiple errors during stream verification?
    if (!verificationResult.verified)
      throw (
        verificationResult.errors[0] ||
        new SDKErrors.ERROR_CONTENT_UNVERIFIABLE()
      )

    // check proofs
    Mark.validateLegitimations(input.legitimations)

    return true
  }

  public verifyData(): boolean {
    return ContentStream.verifyData(this)
  }

  /**
   * Verifies the signature of the [[ContentStream]] object.
   *
   * @param input - [[ContentStream]] .
   * @returns Whether the signature is correct.
   * @example ```javascript
   * const reqForAtt = ContentStream.fromStreamAndIdentity({
   *   stream,
   *   identity: alice,
   * });
   * ContentStream.verifySignature(reqForAtt); // returns `true` if the signature is correct
   * ```
   */
  public static verifySignature(input: IContentStream): boolean {
    return verifyCreatorSignature(input)
  }

  public verifySignature(): boolean {
    return ContentStream.verifySignature(this)
  }

  public static verifyRootHash(input: IContentStream): boolean {
    return input.rootHash === ContentStream.calculateRootHash(input)
  }

  public verifyRootHash(): boolean {
    return ContentStream.verifyRootHash(this)
  }

  private static sign(identity: Identity, rootHash: Hash): string {
    // return identity.signStr(Crypto.hashStr(rootHash))
    return identity.signStr(rootHash)
  }

  private static getHashLeaves(
    contentHashes: Hash[],
    legitimations: IMark[]
  ): Uint8Array[] {
    const result: Uint8Array[] = []
    contentHashes.forEach((item) => {
      result.push(Crypto.coToUInt8(item))
    })
    if (legitimations) {
      legitimations.forEach((legitimation) => {
        result.push(Crypto.coToUInt8(legitimation.content.identifier))
      })
    }
    return result
  }

  /**
   * Compresses an [[ContentStream]] object.
   *
   * @returns An array that contains the same properties of an [[ContentStream]].
   */
  public compress(): CompressedContentStream {
    return ContentStreamUtils.compress(this)
  }

  /**
   * [STATIC] Builds an [[ContentStream]] from the decompressed array.
   *
   * @param reqForAtt The [[CompressedMarkContent]] that should get decompressed.
   * @returns A new [[ContentStream]] object.
   */
  public static decompress(
    requestForStream: CompressedContentStream
  ): ContentStream {
    const decompressedContentStream =
      ContentStreamUtils.decompress(requestForStream)
    return ContentStream.fromRequest(decompressedContentStream)
  }

  private static calculateRootHash(mark: Partial<IContentStream>): Hash {
    const hashes: Uint8Array[] = ContentStream.getHashLeaves(
      mark.contentHashes || [],
      mark.legitimations || []
    )
    const root: Uint8Array = getHashRoot(hashes)
    // return Crypto.u8aToHex(root)
    return Crypto.hashStr(root)
  }
}