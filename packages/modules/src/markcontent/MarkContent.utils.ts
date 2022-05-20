/**
 * @packageDocumentation
 * @module MarkContentUtils
 */

import type {
  IMark,
  CompressedMark,
  CompressedMarkContent,
  IMarkContent,
  ISchema,
} from '@cord.network/types'
import { DataUtils, SDKErrors } from '@cord.network/utils'
import * as MarkUtils from '../mark/Mark.utils.js'
import * as ContentUtils from '../content/Content.utils.js'
import { MarkContent } from './MarkContent.js'
import * as SchemaUtils from '../schema/Schema.utils.js'

/**
 *  Checks whether the input meets all the required criteria of an IMarkContent object.
 *  Throws on invalid input.
 *
 * @param input - A potentially only partial [[IMarkContent]].
 *
 */
export function errorCheck(input: IMarkContent): void {
  if (!input.content) {
    throw SDKErrors.ERROR_MARK_STREAM_NOT_PROVIDED()
  } else {
    ContentUtils.errorCheck(input.content)
  }
  if (!input.legitimations && !Array.isArray(input.legitimations)) {
    throw SDKErrors.ERROR_PROOFS_NOT_PROVIDED()
  }
  if (!input.contentNonceMap) {
    throw SDKErrors.ERROR_STREAM_NONCE_MAP_NOT_PROVIDED()
  }
  if (
    typeof input.contentNonceMap !== 'object' ||
    Object.entries(input.contentNonceMap).some(
      ([digest, nonce]) =>
        !digest ||
        !DataUtils.validateHash(digest, 'statement digest') ||
        typeof nonce !== 'string' ||
        !nonce
    )
  ) {
    throw SDKErrors.ERROR_STREAM_NONCE_MAP_MALFORMED()
  }
  MarkContent.verifyData(input as IMarkContent)
}

/**
 *  Compresses [[CordMark]]s which are made up from an [[Mark]] and [[MarkContent]] for storage and/or message.
 *
 * @param leg An array of [[Mark]] and [[MarkContent]] objects.
 *
 * @returns An ordered array of [[CordMark]]s.
 */

export function compressProof(leg: IMark[]): CompressedMark[] {
  return leg.map(MarkUtils.compress)
}

/**
 *  Decompresses [[CordMark]]s which are an [[Mark]] and [[MarkContent]] from storage and/or message.
 *
 * @param leg A compressed [[Mark]] and [[MarkContent]] array that is reverted back into an object.
 *
 * @returns An object that has the same properties as an [[CordMark]].
 */

function decompressProof(leg: CompressedMark[]): IMark[] {
  return leg.map(MarkUtils.decompress)
}

/**
 *  Compresses a [[MarkContent]] for storage and/or messaging.
 *
 * @param markContent A [[MarkContent]] object that will be sorted and stripped for messaging or storage.
 *
 * @returns An ordered array of a [[MarkContent]].
 */

export function compress(markContent: IMarkContent): CompressedMarkContent {
  errorCheck(markContent)
  return [
    ContentUtils.compress(markContent.content),
    markContent.contentHashes,
    markContent.contentNonceMap,
    markContent.issuerSignature,
    markContent.link,
    compressProof(markContent.legitimations),
    markContent.rootHash,
    markContent.contentId,
  ]
}

/**
 *  Decompresses a [[MarkContent]] from storage and/or message.
 *
 * @param markContent A compressed [[MarkContent]] array that is reverted back into an object.
 * @throws [[ERROR_DECOMPRESSION_ARRAY]] when reqForAtt is not an Array and it's length is not equal to the defined length of 8.
 *
 * @returns An object that has the same properties as a [[MarkContent]].
 */

export function decompress(markContent: CompressedMarkContent): IMarkContent {
  if (!Array.isArray(markContent) || markContent.length !== 8) {
    throw SDKErrors.ERROR_DECOMPRESSION_ARRAY('Request for Stream Content')
  }
  return {
    content: ContentUtils.decompress(markContent[0]),
    contentHashes: markContent[1],
    contentNonceMap: markContent[2],
    issuerSignature: markContent[3],
    link: markContent[4],
    legitimations: decompressProof(markContent[5]),
    rootHash: markContent[6],
    contentId: markContent[7],
  }
}

/**
 *  Checks the [[MarkContent]] with a given [[SchemaType]] to check if the claim meets the [[schema]] structure.
 *
 * @param markContent A [[MarkContent]] object of an attested claim used for verification.
 * @param schema A [[Schema]] to verify the [[Content]] structure.
 *
 * @returns A boolean if the [[Content]] structure in the [[Mark]] is valid.
 */

export function verifyStructure(
  markContent: IMarkContent,
  schema: ISchema
): boolean {
  errorCheck(markContent)
  return SchemaUtils.verifyContentProperties(
    markContent.content.contents,
    schema.schema
  )
}
