/**
 * @packageDocumentation
 * @module IJournalContent
 */

import type { ICredential, CompressedCredential } from './Credential'
import type { IContent, CompressedContent } from './Content'
import type { IPublicIdentity } from './PublicIdentity'

export type Hash = string

export type NonceHash = {
  hash: Hash
  nonce?: string
}

export interface IContentStream {
  content: IContent
  contentHashes: Hash[]
  contentNonceMap: Record<Hash, string>
  proofs: ICredential[]
  link?: string
  holder?: IPublicIdentity['address']
  creator: IPublicIdentity['address']
  creatorSignature: string
  contentHash: Hash
  id: string
}

export type CompressedContentStream = [
  CompressedContent,
  IContentStream['contentHashes'],
  IContentStream['contentNonceMap'],
  IContentStream['creatorSignature'],
  IContentStream['holder'],
  IContentStream['creator'],
  IContentStream['link'],
  CompressedCredential[],
  IContentStream['contentHash'],
  IContentStream['id']
]
