/**
 * @packageDocumentation
 * @module IMarkContent
 */

import type { IMark, CompressedMark } from './Mark.js'
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
  proofs: IMark[]
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
  CompressedMark[],
  IMarkContent['contentHash'],
  IMarkContent['contentId']
]
