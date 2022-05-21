/**
 * @packageDocumentation
 * @module StreamUtils
 */

import type { IStream, CompressedStream, Hash } from '@cord.network/types'
import { DataUtils, SDKErrors } from '@cord.network/utils'
import { Identity } from '../identity/Identity.js'

/**
 *  Checks whether the input meets all the required criteria of an [[IStream]] object.
 *  Throws on invalid input.
 *
 * @param input The potentially only partial [[IStream]].
 *
 */
export function errorCheck(input: IStream): void {
  if (!input.streamId) {
    throw new SDKErrors.ERROR_STREAM_ID_NOT_PROVIDED()
  } else DataUtils.validateId(input.streamId)

  if (!input.streamHash) {
    throw new SDKErrors.ERROR_STREAM_HASH_NOT_PROVIDED()
  } else DataUtils.validateHash(input.streamHash, 'Stream hash')

  if (!input.schemaId) {
    throw new SDKErrors.ERROR_STREAM_SCHEMA_ID_NOT_PROVIDED()
  } else DataUtils.validateId(input.schemaId)

  if (input.linkId) {
    DataUtils.validateHash(input.linkId, 'Stream link')
  }

  // if (input.space) {
  //   DataUtils.validateHash(input.space, 'Stream Space')
  // }

  if (!input.issuer) {
    throw new SDKErrors.ERROR_STREAM_OWNER_NOT_PROVIDED()
  } else DataUtils.validateAddress(input.issuer, 'Stream controller')
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
    stream.issuer,
    stream.holder,
    stream.schemaId,
    stream.linkId,
    stream.issuerSignature,
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
    throw new SDKErrors.ERROR_DECOMPRESSION_ARRAY('Mark')
  }
  return {
    streamId: stream[0],
    streamHash: stream[1],
    issuer: stream[2],
    holder: stream[3],
    schemaId: stream[4],
    linkId: stream[5],
    issuerSignature: stream[6],
  }
}

export function sign(identity: Identity, txHash: Hash): string {
  return identity.signStr(txHash)
}
