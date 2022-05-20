/**
 * @packageDocumentation
 * @module MarkUtils
 */

import type { IMark, CompressedMark } from '@cord.network/types'
import { SDKErrors } from '@cord.network/utils'
import * as StreamDetailUtils from '../stream/StreamDetails.utils.js'
import * as MarkContentUtils from '../markcontent/MarkContent.utils.js'
import { Mark } from './Mark.js'

/**
 *  Checks whether the input meets all the required criteria of an IMarkedStream object.
 *  Throws on invalid input.
 *
 * @param input The potentially only partial IMarkedStream.
 * @throws [[ERROR_MARK_NOT_PROVIDED]] or [[ERROR_RFA_NOT_PROVIDED]] when input's mark and request respectively do not exist.
 * @throws [[ERROR_STREAM_UNVERIFIABLE]] when input's data could not be verified.
 *
 */
export function errorCheck(input: IMark): void {
  if (input.content) {
    StreamDetailUtils.errorCheck(input.content)
  } else throw SDKErrors.ERROR_MARK_NOT_PROVIDED()

  if (input.request) {
    MarkContentUtils.errorCheck(input.request)
  } else throw SDKErrors.ERROR_RFA_NOT_PROVIDED()

  if (!Mark.verifyData(input as IMark)) {
    throw SDKErrors.ERROR_STREAM_UNVERIFIABLE()
  }
}

/**
 *  Compresses an [[MarkedStream]] object into an array for storage and/or messaging.
 *
 * @param markedStream An [[MarkedStream]] that will be sorted and stripped for messaging or storage.
 *
 * @returns An ordered array of an [[MarkedStream]] that comprises of an [[Mark]] and [[RequestForMark]] arrays.
 */

export function compress(stream: IMark): CompressedMark {
  errorCheck(stream)

  return [
    MarkContentUtils.compress(stream.request),
    StreamDetailUtils.compress(stream.content),
  ]
}

/**
 *  Decompresses an [[MarkedStream]] array from storage and/or message into an object.
 *
 * @param markedStream A compressed [[Mark]] and [[RequestForMark]] array that is reverted back into an object.
 * @throws [[ERROR_DECOMPRESSION_ARRAY]] when markedStream is not an Array or it's length is unequal 2.
 *
 * @returns An object that has the same properties as an [[MarkedStream]].
 */

export function decompress(stream: CompressedMark): IMark {
  if (!Array.isArray(stream) || stream.length !== 2) {
    throw SDKErrors.ERROR_DECOMPRESSION_ARRAY('Cord Mark')
  }
  return {
    request: MarkContentUtils.decompress(stream[0]),
    content: StreamDetailUtils.decompress(stream[1]),
  }
}
