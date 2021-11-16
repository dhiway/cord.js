/**
 * @packageDocumentation
 * @module StreamUtils
 */

import type { IStream, CompressedStream } from '@cord.network/types'
import { Crypto, DataUtils, SDKErrors } from '@cord.network/utils'

/**
 *  Checks whether the input meets all the required criteria of an [[IStream]] object.
 *  Throws on invalid input.
 *
 * @param input The potentially only partial [[IStream]].
 *
 */
export function errorCheck(input: IStream): void {
  if (!input.id) {
    throw SDKErrors.ERROR_MARK_ID_NOT_PROVIDED()
  } else DataUtils.validateHash(input.id, 'Stream ID')

  if (!input.hash) {
    throw SDKErrors.ERROR_MARK_HASH_NOT_PROVIDED()
  } else DataUtils.validateHash(input.hash, 'Stream hash')

  if (!input.schema) {
    throw SDKErrors.ERROR_MARK_SCHEMA_ID_NOT_PROVIDED()
  } else DataUtils.validateHash(input.schema, 'Schema link')

  //TODO: Fix this
  // if (!input.link) {
  //   throw SDKErrors.ERROR_MARK_JOURNAL_ID_NOT_PROVIDED()
  // } else DataUtils.validateHash(input.link, 'Mark link')

  if (!input.creator) {
    throw SDKErrors.ERROR_MARK_CREATOR_NOT_PROVIDED()
  } else DataUtils.validateAddress(input.creator, 'Stream controller')

  if (typeof input.revoked !== 'boolean') {
    throw SDKErrors.ERROR_MARK_REVOCATION_BIT_MISSING()
  }
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
    stream.id,
    stream.hash,
    stream.cid,
    stream.schema,
    stream.link,
    stream.creator,
    stream.revoked,
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
    id: stream[0],
    hash: stream[1],
    cid: stream[2],
    schema: stream[3],
    link: stream[4],
    creator: stream[5],
    revoked: stream[6],
  }
}

export function getIdForStream(hash: string): string {
  return getIdForStream(Crypto.hashObjectAsStr(hash))
}

export function getIdWithPrefix(hash: string): string {
  return `cord:stream:${hash}`
}

export function getStreamId(identifier: string): string {
  return identifier.split('cord:stream:').join('')
}

/**
 * Convert from hex to string
 * @param hex Hex string with prefix `0x`
 * @returns With string back
 */
export function hexToString(hex: string): string {
  return Buffer.from(hex.substring(2), 'hex').toString()
}

export default {
  decompress,
  compress,
  errorCheck,
  getIdForStream,
  getIdWithPrefix,
  getStreamId,
  hexToString,
}
