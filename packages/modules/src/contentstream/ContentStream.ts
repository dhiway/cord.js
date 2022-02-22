/**
 * A ContentStream represents [[Content]] which needs to be validated.
 *
 * @packageDocumentation
 * @module ContentStream
 */

import type {
  IContentStream,
  CompressedContentStream,
  Hash,
  IContent,
  ICredential,
} from '@cord.network/types'
import { Crypto, SDKErrors, UUID } from '@cord.network/utils'
import * as ContentUtils from '../content/Content.utils'
import { Credential } from '../credential/Credential'
import Identity from '../identity/Identity'
import * as ContentStreamUtils from './ContentStream.utils'

function verifyHolderSignature(content: IContentStream): boolean {
  return Crypto.verify(
    content.contentHash,
    content.creatorSignature,
    content.creator
  )
}

function getHashRoot(leaves: Uint8Array[]): Uint8Array {
  const result = Crypto.u8aConcat(...leaves)
  return Crypto.hash(result)
}

export type Options = {
  proofs?: Credential[]
  holder?: IContentStream['holder']
  link?: IContentStream['link']
  nonceSalt?: string
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
   * @param option.proofs Array of [[Credential]] objects.
   * @throws [[ERROR_IDENTITY_MISMATCH]] when streamInput's holder address does not match the supplied identity's address.
   * @returns A new [[ContentStream]] object.
   * @example ```javascript
   * const input = ContentStream.fromStreamAndIdentity(content, alice);
   * ```
   */
  public static fromStreamContent(
    content: IContent,
    creator: Identity,
    { proofs, holder, link, nonceSalt }: Options = {}
  ): ContentStream {
    if (content.creator !== creator.address) {
      throw SDKErrors.ERROR_IDENTITY_MISMATCH()
    }

    const { hashes: contentHashes, nonceMap: contentNonceMap } =
      ContentUtils.hashContents(content, {
        nonceGenerator: (key: string) => nonceSalt || UUID.generate(),
      })

    const contentHash = ContentStream.calculateRootHash({
      proofs,
      contentHashes,
    })

    return new ContentStream({
      content,
      contentHashes,
      contentNonceMap,
      proofs: proofs || [],
      link,
      creatorSignature: ContentStream.sign(creator, contentHash),
      holder,
      creator: creator.address,
      contentHash,
      id: ContentStreamUtils.getIdForContent(contentHash),
    })
  }

  /**
   * [STATIC] Custom Type Guard to determine input being of type IContentStream..
   *
   * @param input - A potentially only partial [[]].
   *
   * @returns  Boolean whether input is of type IContentStream.
   */
  public static isIContentStream(input: unknown): input is IContentStream {
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
  public proofs: Credential[]
  public link: IContentStream['link']
  public creatorSignature: string
  public holder: IContentStream['holder']
  public creator: IContentStream['creator']
  public contentHash: Hash
  public id: string

  /**
   * Builds a new [[ContentStream]] instance.
   *
   * @param requestForMarkInput - The base object from which to create the input.
   * @example ```javascript
   * // create a new request for mark
   * const reqForAtt = new ContentStream(requestForMarkInput);
   * ```
   */
  public constructor(requestForContentStream: IContentStream) {
    ContentStreamUtils.errorCheck(requestForContentStream)
    this.id = requestForContentStream.id
    this.creator = requestForContentStream.creator
    this.holder = requestForContentStream.holder
    this.content = requestForContentStream.content
    this.contentHashes = requestForContentStream.contentHashes
    this.contentNonceMap = requestForContentStream.contentNonceMap
    if (
      requestForContentStream.proofs &&
      Array.isArray(requestForContentStream.proofs) &&
      requestForContentStream.proofs.length
    ) {
      this.proofs = requestForContentStream.proofs.map((proof) =>
        Credential.fromCredential(proof)
      )
    } else {
      this.proofs = []
    }
    this.creatorSignature = requestForContentStream.creatorSignature
    this.contentHash = requestForContentStream.contentHash
    this.link = requestForContentStream.link
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
      throw SDKErrors.ERROR_ROOT_HASH_UNVERIFIABLE()
    }
    // check signature
    if (!ContentStream.verifySignature(input)) {
      throw SDKErrors.ERROR_SIGNATURE_UNVERIFIABLE()
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
        verificationResult.errors[0] || SDKErrors.ERROR_CONTENT_UNVERIFIABLE()
      )

    // check proofs
    Credential.validateProofs(input.proofs)

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
    return verifyHolderSignature(input)
  }

  public verifySignature(): boolean {
    return ContentStream.verifySignature(this)
  }

  public static verifyRootHash(input: IContentStream): boolean {
    return input.contentHash === ContentStream.calculateRootHash(input)
  }

  public verifyRootHash(): boolean {
    return ContentStream.verifyRootHash(this)
  }

  private static sign(identity: Identity, rootHash: Hash): string {
    return identity.signStr(rootHash)
  }

  private static getHashLeaves(
    contentHashes: Hash[],
    proofs: ICredential[]
  ): Uint8Array[] {
    const result: Uint8Array[] = []
    contentHashes.forEach((item) => {
      result.push(Crypto.coToUInt8(item))
    })
    if (proofs) {
      proofs.forEach((proof) => {
        result.push(Crypto.coToUInt8(proof.content.id))
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
   * @param reqForAtt The [[CompressedContentStream]] that should get decompressed.
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
      mark.proofs || []
    )
    const root: Uint8Array = getHashRoot(hashes)
    return Crypto.u8aToHex(root)
  }
}
