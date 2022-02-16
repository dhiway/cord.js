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
  // IPublicIdentity,
  IStream,
  IStreamDetails,
  IContentStream,
  CompressedStream,
} from '@cord.network/api-types'
import { set_status, query, store } from './Stream.chain'
import * as StreamUtils from './Stream.utils'
// import Storage from '@cord.network/storage'
// import SchemaUtils from '../schema/Schema.utils'

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
    return query(identifier)
  }

  /**
   * [STATIC] [ASYNC] Revokes a stream stream Also available as an instance method.
   * @param identifier - The ID of the stream stream.
   * @param status - bool value to set the status of the  stream stream.
   * @returns A promise containing the unsigned SubmittableExtrinsic (submittable transaction).
   * @example ```javascript
   * Stream.revoke('0xd8024cdc147c4fa9221cd177', true).then(() => {
   *   // the stream status tx was created, sign and send it!
   *   ChainUtils.signAndSendTx(tx, identity);
   * });
   * ```
   */
  public static async set_status(
    identifier: string,
    creator: string,
    status: boolean
  ): Promise<SubmittableExtrinsic> {
    return set_status(identifier, creator, status)
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
   * @param creatorPublicIdentity - Public Identity of the creator, used to anchor the underlying stream.
   * @returns A new [[Stream]] object.
   * @example ```javascript
   * // create a complete new stream from the `StreamStream` and all other needed properties
   * Stream.fromContentAndPublicIdentity(request, issuerPublicIdentity);
   * ```
   */
  public static fromContentStreamProperties(
    content: IContentStream,
    cid: string
  ): Stream {
    return new Stream({
      id: StreamUtils.getStreamId(content.id),
      hash: content.contentHash,
      cid: cid,
      schema: content.content.schemaId,
      link: content.link,
      creator: content.creator,
      revoked: false,
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

  public id: IStream['id']
  public hash: IStream['hash']
  public cid: IStream['cid']
  public schema: IStream['schema']
  public link: IStream['link']
  public creator: IStream['creator']
  public revoked: IStream['revoked']

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
    this.id = stream.id
    this.hash = stream.hash
    this.cid = stream.cid
    this.schema = stream.schema
    this.link = stream.link
    this.creator = stream.creator
    this.revoked = stream.revoked
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
  public async store(): Promise<SubmittableExtrinsic> {
    return store(this)
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
  public async set_status(status: boolean): Promise<SubmittableExtrinsic> {
    return set_status(this.id, this.creator, status)
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
    identifier: string = stream.id
  ): Promise<boolean> {
    // Query stream by stream identifier. null if no stream is found on-chain for this hash
    const chainStream: StreamDetails | null = await Stream.query(identifier)
    return !!(
      chainStream !== null &&
      chainStream.creator === stream.creator &&
      chainStream.streamHash === stream.hash &&
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
  /**
   * Builds a new [[Stream]] instance.
   *
   * @param stream - The base object from which to create the stream.
   * @example ```javascript
   * // create an stream, e.g. to store it on-chain
   * const stream = new Stream(stream);
   * ```
   */

  public id: IStreamDetails['id']
  public streamHash: IStreamDetails['streamHash']
  public cid: IStreamDetails['cid']
  public parent_cid: IStreamDetails['parent_cid']
  public schema: IStreamDetails['schema']
  public link: IStreamDetails['link']
  public creator: IStreamDetails['creator']
  public block: IStreamDetails['block']
  public revoked: IStreamDetails['revoked']

  public constructor(details: IStreamDetails) {
    // StreamUtils.errorCheck(details)
    this.id = details.id
    this.streamHash = details.streamHash
    this.cid = details.cid
    this.parent_cid = details.parent_cid
    this.schema = details.schema
    this.link = details.link
    this.creator = details.creator
    this.block = details.block
    this.revoked = details.revoked
  }
}
