/**
 * A [[Stream]] creates a sharable stream. [[Stream]]s are **written on the CORD chain** and are **revocable**.
 * The [[Stream]] streams can be used as the base for [[Link]] streams.
 *
 * @packageDocumentation
 * @module Stream
 * @preferred
 */

import type { SubmittableExtrinsic } from '@polkadot/api/promise/types'
import type {
  IStream,
  IStreamDetails,
  IContentStream,
  CompressedStream,
} from '@cord.network/types'
import { Identity } from '../identity/Identity.js'
import { Crypto, UUID, SDKErrors, Identifier } from '@cord.network/utils'
import {
  revoke,
  removeSpaceStream,
  query,
  create,
  update,
  digest,
} from './Stream.chain.js'
import * as StreamUtils from './Stream.utils.js'
import { SCHEMA_PREFIX, STREAM_PREFIX, SPACE_PREFIX } from '@cord.network/types'

export class Stream implements IStream {
  /**
   * [STATIC] [ASYNC] Queries the chain for a given stream entry, by `identifier`.
   *
   * @param identifier - The identifier of the stream.
   * @returns A promise containing the [[StreamStream] or null.
   * @example ```javascript
   * Stream.query('0xd8024cdc147c4fa9221cd177').then((stream) => {
   *   // now we can for example revoke `stream`
   * });
   * ```
   */
  public static async query(identifier: string): Promise<StreamDetails | null> {
    return query(Identifier.getIdentifierKey(identifier, STREAM_PREFIX))
  }

  /**
   * [STATIC] Builds an instance of [[StreamStream]], from a simple object with the same properties.
   * Used for deserialization.
   *
   * @param input - The base object from which to create the stream stream.
   * @returns A new [[Stream]] object.
   * @example ```javascript
   * // create a Stream stream object, so we can call methods on it (`serialized` is a serialized Stream object )
   * Stream.fromStream(JSON.parse(serialized));
   * ```
   */
  public static fromStream(input: IStream): Stream {
    return new Stream(input)
  }

  /**
   * [STATIC] Builds a new instance of an [[Stream]], from a complete set of input required for an stream.
   *
   * @param content - The base request for stream.
   * @param link - ID of the [[Space]] this [[Journal]] is linked to.
   * @param creatorPublicIdentity - Public Identity of the issuer, used to anchor the underlying stream.
   * @returns A new [[Stream]] object.
   * @example ```javascript
   * // create a complete new stream from the `StreamStream` and all other needed properties
   * Stream.fromContentAndPublicIdentity(request, issuerPublicIdentity);
   * ```
   */
  public static fromContentStreamProperties(content: IContentStream): Stream {
    const link = content.link
      ? Identifier.getIdentifierKey(content.link, STREAM_PREFIX)
      : null
    const space = content.space
      ? Identifier.getIdentifierKey(content.space, SPACE_PREFIX)
      : null
    return new Stream({
      identifier: Identifier.getIdentifierKey(
        content.identifier,
        STREAM_PREFIX
      ),
      streamHash: content.rootHash,
      issuer: content.content.issuer,
      holder: content.content.holder,
      schema: Identifier.getIdentifierKey(
        content.content.schema,
        SCHEMA_PREFIX
      ),
      link,
      space,
      issuerSignature: content.issuerSignature,
    })
  }

  /**
   *  [STATIC] Custom Type Guard to determine input being of type IStream using the StreamUtils errorCheck.
   *
   * @param input The potentially only partial IStream.
   * @returns Boolean whether input is of type IStream.
   */
  public static isIStream(input: unknown): input is IStream {
    try {
      StreamUtils.errorCheck(input as IStream)
    } catch (error) {
      return false
    }
    return true
  }

  public identifier: IStream['identifier']
  public streamHash: IStream['streamHash']
  public issuer: IStream['issuer']
  public holder?: IStream['holder'] | null | undefined
  public schema: IStream['schema']
  public link?: IStream['link'] | null | undefined
  public space?: IStream['space'] | null | undefined
  public issuerSignature: IStream['issuerSignature']
  /**
   * Builds a new [[Stream]] instance.
   *
   * @param stream - The base object from which to create the stream.
   * @example ```javascript
   * // create an stream, e.g. to store it on-chain
   * const stream = new Stream(stream);
   * ```
   */
  public constructor(stream: IStream) {
    StreamUtils.errorCheck(stream)
    this.identifier = stream.identifier
    this.streamHash = stream.streamHash
    this.issuer = stream.issuer
    this.holder = stream.holder
    this.schema = stream.schema
    this.link = stream.link
    this.space = stream.space
    this.issuerSignature = stream.issuerSignature
  }

  /**
   * [ASYNC] Stores the stream on chain.
   * @param cid - The IPFS CID of the stream stream.
   * @returns A promise containing the unsigned SubmittableExtrinsic (submittable transaction).
   * @example ```javascript
   * // Use `store` to store an stream on chain, and to create an `StreamedStream` upon success:
   * stream.store(cid).then(() => {
   *   // the stream store tx was successfully prepared, so now we can sign and send it and subsequently create an `StreamedStream`.
   * });
   * ```
   */
  public async create(): Promise<SubmittableExtrinsic> {
    return create(this)
  }

  public async update(): Promise<SubmittableExtrinsic> {
    return update(this)
  }

  /**
   * [ASYNC] Set status (active/revoked) a journal stream.
   *
   * @param status - bool value to set the status of the  journal stream.
   * @returns A promise containing the unsigned SubmittableExtrinsic (submittable transaction).
   * @example ```javascript
   * stream.set_status(false).then((tx) => {
   *   // the stream entry status tx was created, sign and send it!
   *   ChainUtils.signAndSendTx(tx, identity);
   * });
   * ```
   */
  public async revoke(controller: Identity): Promise<SubmittableExtrinsic> {
    const txId = UUID.generate()
    const streamHash = this.streamHash
    const hashVal = { txId, streamHash }
    const txHash = Crypto.hashObjectAsStr(hashVal)
    const txSignature = StreamUtils.sign(controller, txHash)
    return revoke(
      this.identifier,
      controller.address,
      txHash,
      txSignature,
      this.space
    )
  }

  /**
   * [ASYNC] Set status (active/revoked) a journal stream.
   *
   * @param status - bool value to set the status of the  journal stream.
   * @returns A promise containing the unsigned SubmittableExtrinsic (submittable transaction).
   * @example ```javascript
   * stream.set_status(false).then((tx) => {
   *   // the stream entry status tx was created, sign and send it!
   *   ChainUtils.signAndSendTx(tx, identity);
   * });
   * ```
   */
  public async removeSpaceStream(): Promise<SubmittableExtrinsic> {
    if (!this.space) {
      throw new SDKErrors.ERROR_SPACE_ID_NOT_PROVIDED()
    } else return removeSpaceStream(this.identifier, this.space)
  }

  public async digest(
    issuer: Identity,
    digestHash: string
  ): Promise<SubmittableExtrinsic> {
    if (this.issuer !== issuer.address) {
      throw new SDKErrors.ERROR_IDENTITY_MISMATCH()
    }
    const txId = UUID.generate()
    const hashVal = { txId, digestHash }
    const txHash = Crypto.hashObjectAsStr(hashVal)
    const txSignature = StreamUtils.sign(issuer, txHash)
    return digest(
      Identifier.getIdentifierKey(this.identifier, STREAM_PREFIX),
      issuer.address,
      txHash,
      txSignature
    )
  }

  /**
   * [STATIC] [ASYNC] Queries an stream from the chain and checks its validity.
   *
   * @param stream - The Stream to verify.
   * @param identifier - The ID that corresponds to the stream to check. Defaults to the streamHash for the stream onto which "verify" is called.
   * @returns A promise containing whether the stream is valid.
   * @example ```javascript
   * Stream.checkValidity(stream).then((isVerified) => {
   *   // `isVerified` is true if the stream is verified, false otherwise
   * });
   * ```
   */
  public static async checkValidity(
    stream: IStream,
    identifier: string = stream.identifier
  ): Promise<boolean> {
    // Query stream by stream identifier. null if no stream is found on-chain for this hash
    const chainStream: StreamDetails | null = await Stream.query(identifier)
    //TODO - add holder checks
    return !!(
      chainStream !== null &&
      chainStream.issuer === stream.issuer &&
      chainStream.streamHash === stream.streamHash &&
      !chainStream.revoked
    )
  }

  public async checkValidity(): Promise<boolean> {
    return Stream.checkValidity(this)
  }

  /**
   * Compresses an [[Stream]] object.
   *
   * @returns An array that contains the same properties of an [[Stream]].
   */
  public compress(): CompressedStream {
    return StreamUtils.compress(this)
  }

  /**
   * [STATIC] Builds an [[Stream]] from the compressed array.
   *
   * @param stream The [[CompressedStream]] that should get decompressed.
   * @returns A new [[Stream]] object.
   */
  public static decompress(stream: CompressedStream): Stream {
    const decompressedStream = StreamUtils.decompress(stream)
    return Stream.fromStream(decompressedStream)
  }
}

export class StreamDetails implements IStreamDetails {
  public static fromStreamDetails(input: IStreamDetails): StreamDetails {
    return new StreamDetails(input)
  }

  public static async checkValidity(
    stream: IStreamDetails,
    identifier: string = stream.identifier
  ): Promise<boolean> {
    // Query stream by stream identifier. null if no stream is found on-chain for this hash
    const chainStream: StreamDetails | null = await Stream.query(identifier)
    //TODO - add holder checks
    return !!(
      chainStream !== null &&
      chainStream.issuer === stream.issuer &&
      chainStream.streamHash === stream.streamHash &&
      !chainStream.revoked
    )
  }

  public async checkValidity(): Promise<boolean> {
    return StreamDetails.checkValidity(this)
  }

  /**
   * Builds a new [[Stream]] instance.
   *
   * @param stream - The base object from which to create the stream.
   *
   */

  public identifier: IStreamDetails['identifier']
  public streamHash: IStreamDetails['streamHash']
  public issuer: IStreamDetails['issuer']
  public holder: IStreamDetails['holder']
  public schema: IStreamDetails['schema']
  public link: IStreamDetails['link']
  public space: IStreamDetails['space']
  public revoked: IStreamDetails['revoked']

  public constructor(details: IStreamDetails) {
    // StreamUtils.errorCheck(details)
    this.identifier = details.identifier
    this.streamHash = details.streamHash
    this.issuer = details.issuer
    this.holder = details.holder
    this.schema = details.schema
    this.link = details.link
    this.space = details.space
    this.revoked = details.revoked
  }
}
