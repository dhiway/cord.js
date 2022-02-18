/**
 * @packageDocumentation
 * @module ContentStreamUtils
 */

import type {
  ICredential,
  CompressedCredential,
  CompressedContentStream,
  IContentStream,
} from '@cord.network/api-types'
import { Crypto, DataUtils, SDKErrors } from '@cord.network/utils'
import * as CredentialUtils from '../credential/Credential.utils.js'
import * as ContentUtils from '../content/Content.utils.js'
import { ContentStream } from './ContentStream.js'

/**
 *  Checks whether the input meets all the required criteria of an IContentStream object.
 *  Throws on invalid input.
 *
 * @param input - A potentially only partial [[IContentStream]].
 *
 */
export function errorCheck(input: IContentStream): void {
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
  ContentStream.verifyData(input as IContentStream)
}

/**
 *  Compresses [[CordMark]]s which are made up from an [[Mark]] and [[ContentStream]] for storage and/or message.
 *
 * @param leg An array of [[Mark]] and [[ContentStream]] objects.
 *
 * @returns An ordered array of [[CordMark]]s.
 */

export function compressProof(leg: ICredential[]): CompressedCredential[] {
  return leg.map(CredentialUtils.compress)
}

/**
 *  Decompresses [[CordMark]]s which are an [[Mark]] and [[ContentStream]] from storage and/or message.
 *
 * @param leg A compressed [[Mark]] and [[ContentStream]] array that is reverted back into an object.
 *
 * @returns An object that has the same properties as an [[CordMark]].
 */

function decompressProof(leg: CompressedCredential[]): ICredential[] {
  return leg.map(CredentialUtils.decompress)
}

/**
 *  Compresses a [[ContentStream]] for storage and/or messaging.
 *
 * @param contentStream A [[ContentStream]] object that will be sorted and stripped for messaging or storage.
 *
 * @returns An ordered array of a [[ContentStream]].
 */

export function compress(
  contentStream: IContentStream
): CompressedContentStream {
  errorCheck(contentStream)
  return [
    ContentUtils.compress(contentStream.content),
    contentStream.contentHashes,
    contentStream.contentNonceMap,
    contentStream.creatorSignature,
    contentStream.holder,
    contentStream.creator,
    contentStream.link,
    compressProof(contentStream.proofs),
    contentStream.contentHash,
    contentStream.contentId,
  ]
}

/**
 *  Decompresses a [[ContentStream]] from storage and/or message.
 *
 * @param contentStream A compressed [[ContentStream]] array that is reverted back into an object.
 * @throws [[ERROR_DECOMPRESSION_ARRAY]] when reqForAtt is not an Array and it's length is not equal to the defined length of 8.
 *
 * @returns An object that has the same properties as a [[ContentStream]].
 */

export function decompress(
  contentStream: CompressedContentStream
): IContentStream {
  if (!Array.isArray(contentStream) || contentStream.length !== 10) {
    throw SDKErrors.ERROR_DECOMPRESSION_ARRAY('Request for Stream Content')
  }
  return {
    content: ContentUtils.decompress(contentStream[0]),
    contentHashes: contentStream[1],
    contentNonceMap: contentStream[2],
    creatorSignature: contentStream[3],
    holder: contentStream[4],
    creator: contentStream[5],
    link: contentStream[6],
    proofs: decompressProof(contentStream[7]),
    contentHash: contentStream[8],
    contentId: contentStream[9],
  }
}

export function getIdForContent(hash: string, holder?: string): string {
  const hashVal = {
    hash,
    holder,
  }
  return getIdWithPrefix(Crypto.hashObjectAsStr(hashVal))
}

export function getIdWithPrefix(hash: string): string {
  return `cord:stream:${hash}`
}
