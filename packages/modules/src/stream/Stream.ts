// import type { SubmittableExtrinsic } from '@polkadot/api/promise/types'
import type {
  IStream,
  // IStreamDetails,
  IContentStream,
  CompressedStream,
} from '@cord.network/types'
// import { Identity } from '../identity/Identity.js'
import {
  DataUtils,
  // Crypto,
  // UUID,
  SDKErrors,
  Identifier,
} from '@cord.network/utils'
import { query } from './Stream.chain.js'
import { SCHEMA_PREFIX, STREAM_PREFIX, SPACE_PREFIX } from '@cord.network/types'

/**
 *  Checks whether the input meets all the required criteria of an [[IStream]] object.
 *  Throws on invalid input.
 *
 * @param input The potentially only partial [[IStreamDetail]].
 *  @throws [[ERROR_STREAM_ID_NOT_PROVIDED]], [[ERROR_STREAM_HASH_NOT_PROVIDED]], [[ERROR_STREAM_SCHEMA_ID_NOT_PROVIDED]] or [[ERROR_STREAM_OWNER_NOT_PROVIDED]] when input's streamIdentifier, streamHash, schemaIdentifier or issuer respectively do not exist.
 *
 */
export function verifyDataStructure(input: IStream): void {
  if (!input.identifier) {
    throw new SDKErrors.ERROR_STREAM_ID_NOT_PROVIDED()
  } else DataUtils.validateId(input.identifier, 'Stream Identiifier')

  if (!input.streamHash) {
    throw new SDKErrors.ERROR_STREAM_HASH_NOT_PROVIDED()
  } else DataUtils.validateHash(input.streamHash, 'Stream hash')

  if (!input.schema) {
    throw new SDKErrors.ERROR_STREAM_SCHEMA_ID_NOT_PROVIDED()
  } else DataUtils.validateId(input.schema, 'Schema Identifier')

  if (!input.issuer) {
    throw new SDKErrors.ERROR_STREAM_OWNER_NOT_PROVIDED()
  } else DataUtils.validateAddress(input.issuer, 'Stream controller')
}

/**
 * Builds a new instance of an [[Stream]], from a complete set of input required for an stream.
 *
 * @param content - The base request for stream.
 * @param creatorPublicIdentity - Public Identity of the issuer, used to anchor the underlying stream.
 * @returns A new [[Stream]] object.
 *
 */
export function fromContentStream(content: IContentStream): IStream {
  const link = content.link
    ? Identifier.getIdentifierKey(content.link, STREAM_PREFIX)
    : null
  const space = content.space
    ? Identifier.getIdentifierKey(content.space, SPACE_PREFIX)
    : null
  const stream = {
    identifier: Identifier.getIdentifierKey(content.identifier, STREAM_PREFIX),
    streamHash: content.rootHash,
    issuer: content.content.issuer,
    holder: content.content.holder,
    schema: Identifier.getIdentifierKey(content.content.schema, SCHEMA_PREFIX),
    link,
    space,
    issuerSignature: content.issuerSignature,
  }
  verifyDataStructure(stream)
  return stream
}

/**
 * Custom Type Guard to determine input being of type IStream using the StreamUtils errorCheck.
 *
 * @param input The potentially only partial IStream.
 * @returns Boolean whether input is of type IStream.
 */
export function isIStream(input: unknown): input is IStream {
  try {
    verifyDataStructure(input as IStream)
  } catch (error) {
    return false
  }
  return true
}

/**
 * Queries a stream from the chain and checks its validity.
 *
 * @param stream - The Stream to verify.
 * @param streamIdentifier - The Identifier that corresponds to the stream. Defaults to the
 * identifier for the stream onto which "verify" is called.
 * @returns A promise containing whether the stream is valid.
 *
 */
export async function checkValidity(
  stream: IStream,
  streamIdentifier: IStream['identifier'] = stream.identifier
): Promise<boolean> {
  verifyDataStructure(stream)
  // Query stream by identifier. null if no stream is found on-chain for this identifier
  const chainStream = await query(streamIdentifier)
  return !!(
    chainStream !== null &&
    chainStream.issuer === stream.issuer &&
    chainStream.holder === stream.holder &&
    chainStream.streamHash === stream.streamHash &&
    !chainStream.revoked
  )
}

/**
 * Compresses a [[Stream]] object into an array for storage and/or messaging.
 *
 * @param stream A [[Stream]] object that will be sorted and stripped for messaging or storage.
 * @returns An ordered array of an [[Stream]].
 */
export function compress(stream: IStream): CompressedStream {
  verifyDataStructure(stream)
  return [
    stream.identifier,
    stream.streamHash,
    stream.issuer,
    stream.holder,
    stream.schema,
    stream.link,
    stream.space,
    stream.issuerSignature,
  ]
}

/**
 * Decompresses a [[Stream]] from storage and/or message into an object.
 *
 * @param stream A compressed [[Stream]] array that is decompressed back into an object.
 * @throws [[ERROR_DECOMPRESSION_ARRAY]] when the attestation is not an array or its length is not equal to 5.
 *
 * @returns An object that has the same properties as an [[Attestation]].
 */
export function decompress(stream: CompressedStream): IStream {
  if (!Array.isArray(stream) || stream.length !== 8) {
    throw new SDKErrors.ERROR_DECOMPRESSION_ARRAY('Stream')
  }
  const decompressedStream = {
    identifier: stream[0],
    streamHash: stream[1],
    issuer: stream[2],
    holder: stream[3],
    schema: stream[4],
    link: stream[5],
    space: stream[6],
    issuerSignature: stream[7],
  }
  verifyDataStructure(decompressedStream)
  return decompressedStream
}

// export class Stream implements IStream {
//   /**
//    * [STATIC] [ASYNC] Queries the chain for a given stream entry, by `streamIdentifier`.
//    *
//    * @param streamIdentifier - The identifier of the stream.
//    * @returns A promise containing the [[Stream] or null.
//    *
//    */
//   public static async query(
//     streamIdentifier: IContentStream['identifier']
//   ): Promise<StreamDetails | null> {
//     return query(Identifier.getIdentifierKey(streamIdentifier, STREAM_PREFIX))
//   }

//   /**
//    * [STATIC] Builds an instance of [[Stream]], from a simple object with the same properties.
//    * Used for deserialization.
//    *
//    * @param streamInput - The base object from which to create the stream stream.
//    * @returns A new [[Stream]] object.
//    *
//    */
//   public static fromStream(streamInput: IStream): Stream {
//     return new Stream(streamInput)
//   }

//   /**
//    * [STATIC] Builds a new instance of an [[Stream]], from a complete set of input required for an stream.
//    *
//    * @param content - The base request for stream.
//    * @param creatorPublicIdentity - Public Identity of the issuer, used to anchor the underlying stream.
//    * @returns A new [[Stream]] object.
//    *
//    */
//   public static fromContentStream(content: IContentStream): Stream {
//     const link = content.link
//       ? Identifier.getIdentifierKey(content.link, STREAM_PREFIX)
//       : null
//     const space = content.space
//       ? Identifier.getIdentifierKey(content.space, SPACE_PREFIX)
//       : null
//     return new Stream({
//       identifier: Identifier.getIdentifierKey(
//         content.identifier,
//         STREAM_PREFIX
//       ),
//       streamHash: content.rootHash,
//       issuer: content.content.issuer,
//       holder: content.content.holder,
//       schema: Identifier.getIdentifierKey(
//         content.content.schema,
//         SCHEMA_PREFIX
//       ),
//       link,
//       space,
//       issuerSignature: content.issuerSignature,
//     })
//   }

//   public identifier: IStream['identifier']
//   public streamHash: IStream['streamHash']
//   public issuer: IStream['issuer']
//   public holder: IStream['holder'] | null
//   public schema: IStream['schema'] | null
//   public link: IStream['link'] | null
//   public space: IStream['space'] | null
//   public issuerSignature: IStream['issuerSignature'] | null
//   /**
//    * Builds a new [[Stream]] instance.
//    *
//    * @param stream - The base object from which to create the stream.
//    *
//    */
//   public constructor(stream: IStream) {
//     StreamUtils.errorCheck(stream)
//     this.identifier = stream.identifier
//     this.streamHash = stream.streamHash
//     this.issuer = stream.issuer
//     this.holder = stream.holder
//     this.schema = stream.schema
//     this.link = stream.link
//     this.space = stream.space
//     this.issuerSignature = stream.issuerSignature
//   }

//   /**
//    * [ASYNC]  Prepares an extrinsic to store a stream on chain.
//    * @returns A promise containing the unsigned SubmittableExtrinsic (submittable transaction).
//    *
//    */
//   public async create(): Promise<SubmittableExtrinsic> {
//     return create(this)
//   }

//   /**
//    * [ASYNC]  Prepares an extrinsic to update a stream on chain.
//    * @returns A promise containing the unsigned SubmittableExtrinsic (submittable transaction).
//    *
//    */
//   public async update(): Promise<SubmittableExtrinsic> {
//     return update(this)
//   }

//   /**
//    * [ASYNC] Prepares an extrinsic to revoked a stream on chain.
//    *
//    * @param controller - Identity of the transaction creator.
//    * @returns A promise containing the unsigned SubmittableExtrinsic (submittable transaction).
//    *
//    */
//   public async revoke(controller: Identity): Promise<SubmittableExtrinsic> {
//     const txId = UUID.generate()
//     const streamHash = this.streamHash
//     const hashVal = { txId, streamHash }
//     const txHash = Crypto.hashObjectAsHexStr(hashVal)
//     const txSignature = StreamUtils.sign(controller, txHash)
//     return revoke(
//       this.identifier,
//       controller.address,
//       txHash,
//       txSignature,
//       this.space
//     )
//   }

//   /**
//    * [ASYNC] Prepares an extrinsic to remove a stream anchored on the  chain.
//    * Note: This transaction can only be submitted by an owner of delegator of the space
//    * this stream is linked to.
//    *
//    * @returns A promise containing the unsigned SubmittableExtrinsic (submittable transaction).
//    *
//    */
//   public async removeSpaceStream(): Promise<SubmittableExtrinsic> {
//     if (!this.space) {
//       throw new SDKErrors.ERROR_SPACE_ID_NOT_PROVIDED()
//     } else return removeSpaceStream(this.identifier, this.space)
//   }

//   public async digest(
//     issuer: Identity,
//     digestHash: string
//   ): Promise<SubmittableExtrinsic> {
//     if (this.issuer !== issuer.address) {
//       throw new SDKErrors.ERROR_IDENTITY_MISMATCH()
//     }
//     const txId = UUID.generate()
//     const hashVal = { txId, digestHash }
//     const txHash = Crypto.hashObjectAsHexStr(hashVal)
//     const txSignature = StreamUtils.sign(issuer, txHash)
//     return digest(
//       Identifier.getIdentifierKey(this.identifier, STREAM_PREFIX),
//       issuer.address,
//       txHash,
//       txSignature
//     )
//   }

//   public async checkValidity(): Promise<boolean> {
//     return Stream.checkValidity(this)
//   }

//   /**
//    * Compresses an [[Stream]] object.
//    *
//    * @returns An array that contains the same properties of an [[Stream]].
//    */
//   public compress(): CompressedStream {
//     return StreamUtils.compress(this)
//   }

//   /**
//    * [STATIC] Builds an [[Stream]] from the compressed array.
//    *
//    * @param stream The [[CompressedStream]] that should get decompressed.
//    * @returns A new [[Stream]] object.
//    */
//   public static decompress(stream: CompressedStream): Stream {
//     const decompressedStream = StreamUtils.decompress(stream)
//     return Stream.fromStream(decompressedStream)
//   }
// }

// export class StreamDetails implements IStreamDetails {
//   public static fromStreamDetails(input: IStreamDetails): StreamDetails {
//     return new StreamDetails(input)
//   }

//   public static async checkValidity(
//     stream: IStreamDetails,
//     identifier: IStream['identifier'] = stream.identifier
//   ): Promise<boolean> {
//     // Query stream by stream identifier. null if no stream is found on-chain for this hash
//     const chainStream: StreamDetails | null = await Stream.query(identifier)
//     //TODO - add holder checks
//     return !!(
//       chainStream !== null &&
//       chainStream.issuer === stream.issuer &&
//       chainStream.streamHash === stream.streamHash &&
//       !chainStream.revoked
//     )
//   }

//   public async checkValidity(): Promise<boolean> {
//     return StreamDetails.checkValidity(this)
//   }

//   /**
//    * Builds a new [[Stream]] instance.
//    *
//    * @param stream - The base object from which to create the stream.
//    *
//    */

//   public identifier: IStreamDetails['identifier']
//   public streamHash: IStreamDetails['streamHash']
//   public issuer: IStreamDetails['issuer']
//   public holder: IStreamDetails['holder']
//   public schema: IStreamDetails['schema']
//   public link: IStreamDetails['link']
//   public space: IStreamDetails['space']
//   public revoked: IStreamDetails['revoked']

//   public constructor(details: IStreamDetails) {
//     // StreamUtils.errorCheck(details)
//     this.identifier = details.identifier
//     this.streamHash = details.streamHash
//     this.issuer = details.issuer
//     this.holder = details.holder
//     this.schema = details.schema
//     this.link = details.link
//     this.space = details.space
//     this.revoked = details.revoked
//   }
// }
