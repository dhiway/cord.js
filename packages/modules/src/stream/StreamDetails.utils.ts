/**
 * @packageDocumentation
 * @module StreamDetailUtils
 */

import type {
  IStreamDetails,
  CompressedStreamDetails,
} from '@cord.network/api-types'
import { DataUtils, SDKErrors } from '@cord.network/utils'

/**
 *  Checks whether the input meets all the required criteria of an [[IStreamDetail]] object.
 *  Throws on invalid input.
 *
 * @param input The potentially only partial [[IStreamDetail]].
 *
 */
export function errorCheck(input: IStreamDetails): void {
  if (!input.streamId) {
    throw SDKErrors.ERROR_MARK_ID_NOT_PROVIDED()
  } else DataUtils.validateId(input.streamId)

  if (!input.streamHash) {
    throw SDKErrors.ERROR_MARK_HASH_NOT_PROVIDED()
  } else DataUtils.validateHash(input.streamHash, 'Stream hash')

  if (!input.schemaId) {
    throw SDKErrors.ERROR_MARK_SCHEMA_ID_NOT_PROVIDED()
  } else DataUtils.validateId(input.schemaId)

  if (!input.controller) {
    throw SDKErrors.ERROR_MARK_CREATOR_NOT_PROVIDED()
  } else DataUtils.validateAddress(input.controller, 'Stream controller')
}

/**
 *  Compresses an [[Mark]] object into an array for storage and/or messaging.
 *
 * @param stream An [[Mark]] object that will be sorted and stripped for messaging or storage.
 *
 * @returns An ordered array of an [[Mark]].
 */

export function compress(stream: IStreamDetails): CompressedStreamDetails {
  errorCheck(stream)
  return [
    stream.streamId,
    stream.streamHash,
    stream.controller,
    stream.holder,
    stream.schemaId,
    stream.linkId,
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

export function decompress(stream: CompressedStreamDetails): IStreamDetails {
  if (!Array.isArray(stream) || stream.length !== 7) {
    throw SDKErrors.ERROR_DECOMPRESSION_ARRAY('Mark')
  }
  return {
    streamId: stream[0],
    streamHash: stream[1],
    controller: stream[2],
    holder: stream[3],
    schemaId: stream[4],
    linkId: stream[5],
    revoked: stream[6],
  }
}
