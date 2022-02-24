/**
 * @packageDocumentation
 * @module StreamUtils
 */

import type { IStream, CompressedStream } from '@cord.network/api-types'
import { DataUtils, SDKErrors } from '@cord.network/utils'

/**
 *  Checks whether the input meets all the required criteria of an [[IStream]] object.
 *  Throws on invalid input.
 *
 * @param input The potentially only partial [[IStream]].
 *
 */
export function errorCheck(input: IStream): void {
  if (!input.streamId) {
    throw SDKErrors.ERROR_MARK_ID_NOT_PROVIDED()
  } else DataUtils.validateHash(input.streamId, 'Stream ID')

  if (!input.streamHash) {
    throw SDKErrors.ERROR_MARK_HASH_NOT_PROVIDED()
  } else DataUtils.validateHash(input.streamHash, 'Stream hash')

  if (!input.schemaId) {
    throw SDKErrors.ERROR_MARK_SCHEMA_ID_NOT_PROVIDED()
  } else DataUtils.validateHash(input.schemaId, 'Schema link')

  if (!input.creator) {
    throw SDKErrors.ERROR_MARK_CREATOR_NOT_PROVIDED()
  } else DataUtils.validateAddress(input.creator, 'Stream controller')
}

/**
 *  Compresses an [[Mark]] object into an array for storage and/or messaging.
 *
 * @param stream An [[Mark]] object that will be sorted and stripped for messaging or storage.
 *
 * @returns An ordered array of an [[Mark]].
 */

export function compress(stream: IStream): CompressedStream {
  errorCheck(stream)
  return [
    stream.streamId,
    stream.streamHash,
    stream.creator,
    stream.holder,
    stream.schemaId,
    stream.linkId,
    stream.cid,
  ]
}

/**
 *  Decompresses an [[Mark]] from storage and/or message into an object.
 *
 * @param stream A compressed [[Mark]] array that is decompressed back into an object.
 * @throws [[ERROR_DECOMPRESSION_ARRAY]] when the stream is not an array or its length is not equal to 5.
 *
 * @returns An object that has the same properties as an [[Mark]].
 */

export function decompress(stream: CompressedStream): IStream {
  if (!Array.isArray(stream) || stream.length !== 7) {
    throw SDKErrors.ERROR_DECOMPRESSION_ARRAY('Mark')
  }
  return {
    streamId: stream[0],
    streamHash: stream[1],
    creator: stream[2],
    holder: stream[3],
    schemaId: stream[4],
    linkId: stream[5],
    cid: stream[6],
  }
}

// export function getIdForStream(hash: string): string {
//   return getIdForStream(Crypto.hashObjectAsStr(hash))
// }

// export function getIdWithPrefix(hash: string): string {
//   return `stream:cord:${hash}`
// }

// export function getStreamId(identifier: string): string {
//   return identifier.split('stream:cord').join('')
// }

// export function getLinkId(
//   identifier: string | null | undefined
// ): string | null | undefined {
//   if (identifier) {
//     return identifier.split('stream:cord').join('')
//   } else {
//     return undefined
//   }
// }
