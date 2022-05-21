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
  if (!input.identifier) {
    throw new SDKErrors.ERROR_STREAM_ID_NOT_PROVIDED()
  } else DataUtils.validateId(input.identifier)

  if (!input.streamHash) {
    throw new SDKErrors.ERROR_STREAM_HASH_NOT_PROVIDED()
  } else DataUtils.validateHash(input.streamHash, 'Stream hash')

  if (!input.schema) {
    throw new SDKErrors.ERROR_STREAM_SCHEMA_ID_NOT_PROVIDED()
  } else DataUtils.validateId(input.schema)

  if (input.link) {
    DataUtils.validateId(input.link)
  }

  if (input.space) {
    DataUtils.validateId(input.space)
  }

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
 *  Decompresses an [[Mark]] from storage and/or message into an object.
 *
 * @param stream A compressed [[Mark]] array that is decompressed back into an object.
 * @throws [[ERROR_DECOMPRESSION_ARRAY]] when the stream is not an array or its length is not equal to 5.
 *
 * @returns An object that has the same properties as an [[Mark]].
 */

export function decompress(stream: CompressedStream): IStream {
  if (!Array.isArray(stream) || stream.length !== 8) {
    throw new SDKErrors.ERROR_DECOMPRESSION_ARRAY('Mark')
  }
  return {
    identifier: stream[0],
    streamHash: stream[1],
    issuer: stream[2],
    holder: stream[3],
    schema: stream[4],
    link: stream[5],
    space: stream[6],
    issuerSignature: stream[7],
  }
}

export function sign(identity: Identity, txHash: Hash): string {
  return identity.signStr(txHash)
}
