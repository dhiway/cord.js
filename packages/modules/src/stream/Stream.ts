import type {
  IStream,
  IContentStream,
  CompressedStream,
} from '@cord.network/types'
import { DataUtils, SDKErrors, Identifier } from '@cord.network/utils'
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
  const schema = content.content.schema
    ? Identifier.getIdentifierKey(content.content.schema, SCHEMA_PREFIX)
    : null
  const stream = {
    identifier: Identifier.getIdentifierKey(content.identifier, STREAM_PREFIX),
    streamHash: content.rootHash,
    issuer: content.content.issuer,
    holder: content.content.holder,
    schema,
    link,
    space,
    signatureProof: content.signatureProof,
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
    stream.signatureProof,
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
    signature: stream[7],
  }
  verifyDataStructure(decompressedStream)
  return decompressedStream
}
