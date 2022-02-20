/**
 * @packageDocumentation
 * @module IMarkContent
 */

import type { ICredential, CompressedCredential } from './Credential.js'
import type { IContent, CompressedContent } from './Content.js'
import type { IPublicIdentity } from './PublicIdentity.js'

export type Hash = string

export type NonceHash = {
  hash: Hash
  nonce?: string
}

export interface IMarkContent {
  content: IContent
  contentHashes: Hash[]
  contentNonceMap: Record<Hash, string>
  proofs: ICredential[]
  link?: string
  holder?: IPublicIdentity['address']
  creator: IPublicIdentity['address']
  creatorSignature: string
  contentHash: Hash
  contentId: string
}

export type CompressedMarkContent = [
  CompressedContent,
  IMarkContent['contentHashes'],
  IMarkContent['contentNonceMap'],
  IMarkContent['creatorSignature'],
  IMarkContent['holder'],
  IMarkContent['creator'],
  IMarkContent['link'],
  CompressedCredential[],
  IMarkContent['contentHash'],
  IMarkContent['contentId']
]
