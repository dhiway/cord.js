import type {
  IMark,
  CompressedMark,
  CompressedContentStream,
  IContentStream,
  ISchema,
} from '@cord.network/types'
import { DataUtils, SDKErrors } from '@cord.network/utils'
import * as MarkUtils from '../mark/Mark.utils.js'
import * as ContentUtils from '../content/Content.utils.js'
import { ContentStream } from './ContentStream.js'
import * as SchemaUtils from '../schema/Schema.utils.js'

/**
 *  Checks whether the input meets all the required criteria of an IContentStream object.
 *  Throws on invalid input.
 *
 * @param input - A potentially only partial [[IContentStream]].
 *
 */
export function errorCheck(input: IContentStream): void {
  if (!input.content) {
    throw new SDKErrors.ERROR_CONTENT_NOT_PROVIDED()
  } else {
    ContentUtils.errorCheck(input.content)
  }
  if (!input.legitimations && !Array.isArray(input.legitimations)) {
    throw new SDKErrors.ERROR_LEGITIMATIONS_NOT_PROVIDED()
  }
  if (!input.contentNonceMap) {
    throw new SDKErrors.ERROR_CONTENT_NONCE_MAP_NOT_PROVIDED()
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
    throw new SDKErrors.ERROR_CONTENT_NONCE_MAP_MALFORMED()
  }
  ContentStream.verifyData(input as IContentStream)
}

/**
 *  Compresses [[CordMark]]s which are made up from an [[Mark]] and [[ContentStream]] for storage and/or message.
 *
 * @param leg An array of [[Mark]] and [[ContentStream]] objects.
 *
 * @returns An ordered array of [[CordMark]]s.
 */

export function compressProof(leg: IMark[]): CompressedMark[] {
  return leg.map(MarkUtils.compress)
}

/**
 *  Decompresses [[CordMark]]s which are an [[Mark]] and [[ContentStream]] from storage and/or message.
 *
 * @param leg A compressed [[Mark]] and [[ContentStream]] array that is reverted back into an object.
 *
 * @returns An object that has the same properties as an [[CordMark]].
 */

function decompressProof(leg: CompressedMark[]): IMark[] {
  return leg.map(MarkUtils.decompress)
}

/**
 *  Compresses a [[ContentStream]] for storage and/or messaging.
 *
 * @param contentStream A [[ContentStream]] object that will be sorted and stripped for messaging or storage.
 *
 * @returns An ordered array of a [[CompressedContentStream]].
 */

export function compress(
  contentStream: IContentStream
): CompressedContentStream {
  errorCheck(contentStream)
  return [
    ContentUtils.compress(contentStream.content),
    contentStream.contentHashes,
    contentStream.contentNonceMap,
    contentStream.issuerSignature,
    contentStream.link,
    contentStream.space,
    compressProof(contentStream.legitimations),
    contentStream.rootHash,
    contentStream.identifier,
  ]
}

/**
 *  Decompresses a [[ContentStream]] from storage and/or message.
 *
 * @param contentStream A compressed [[ContentStream]] array that is reverted back into an object.
 * @throws [[ERROR_DECOMPRESSION_ARRAY]] when contentStream is not an Array and it's length is not equal to the defined length of 9.
 *
 * @returns An object that has the same properties as a [[ContentStream]].
 */

export function decompress(
  contentStream: CompressedContentStream
): IContentStream {
  if (!Array.isArray(contentStream) || contentStream.length !== 9) {
    throw new SDKErrors.ERROR_DECOMPRESSION_ARRAY('Request for Stream Content')
  }
  return {
    content: ContentUtils.decompress(contentStream[0]),
    contentHashes: contentStream[1],
    contentNonceMap: contentStream[2],
    issuerSignature: contentStream[3],
    link: contentStream[4],
    space: contentStream[5],
    legitimations: decompressProof(contentStream[6]),
    rootHash: contentStream[7],
    identifier: contentStream[8],
  }
}

/**
 *  Checks the [[ContentStream]] with a given [[SchemaType]] to check if the claim meets the [[schema]] structure.
 *
 * @param contentStream A [[ContentStream]] object of an attested claim used for verification.
 * @param schema A [[Schema]] to verify the [[Content]] structure.
 *
 * @returns A boolean if the [[Content]] structure in the [[Mark]] is valid.
 */

export function verifyStructure(
  contentStream: IContentStream,
  schema: ISchema
): boolean {
  try {
    errorCheck(contentStream)
  } catch {
    return false
  }
  return SchemaUtils.verifyContentProperties(
    contentStream.content.contents,
    schema.schema
  )
}
