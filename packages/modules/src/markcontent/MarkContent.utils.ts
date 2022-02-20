/**
 * @packageDocumentation
 * @module MarkContentUtils
 */

import type {
  ICredential,
  CompressedCredential,
  CompressedMarkContent,
  IMarkContent,
} from '@cord.network/api-types'
import { Crypto, DataUtils, SDKErrors } from '@cord.network/utils'
import * as CredentialUtils from '../credential/Credential.utils.js'
import * as ContentUtils from '../content/Content.utils.js'
import { MarkContent } from './MarkContent.js'

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
  if (!input.proofs && !Array.isArray(input.proofs)) {
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

export function compressProof(leg: ICredential[]): CompressedCredential[] {
  return leg.map(CredentialUtils.compress)
}

/**
 *  Decompresses [[CordMark]]s which are an [[Mark]] and [[MarkContent]] from storage and/or message.
 *
 * @param leg A compressed [[Mark]] and [[MarkContent]] array that is reverted back into an object.
 *
 * @returns An object that has the same properties as an [[CordMark]].
 */

function decompressProof(leg: CompressedCredential[]): ICredential[] {
  return leg.map(CredentialUtils.decompress)
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
    markContent.creatorSignature,
    markContent.holder,
    markContent.creator,
    markContent.link,
    compressProof(markContent.proofs),
    markContent.contentHash,
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
  if (!Array.isArray(markContent) || markContent.length !== 10) {
    throw SDKErrors.ERROR_DECOMPRESSION_ARRAY('Request for Stream Content')
  }
  return {
    content: ContentUtils.decompress(markContent[0]),
    contentHashes: markContent[1],
    contentNonceMap: markContent[2],
    creatorSignature: markContent[3],
    holder: markContent[4],
    creator: markContent[5],
    link: markContent[6],
    proofs: decompressProof(markContent[7]),
    contentHash: markContent[8],
    contentId: markContent[9],
  }
}

export function getIdForContent(
  hash: IMarkContent['contentHash'],
  creator: IMarkContent['creator']
): string {
  return getIdWithPrefix(Crypto.hashObjectAsStr({ hash, creator }))
}

export function getIdWithPrefix(hash: string): string {
  return `cord:stream:${hash}`
}
