/**
 * @packageDocumentation
 * @module IMarkContent
 */

import type { IMark, CompressedMark } from './Mark.js'
import type { IContent, CompressedContent } from './Content.js'

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
  creatorSignature: string
  contentHash: Hash
  contentId: string
}

export type CompressedMarkContent = [
  CompressedContent,
  IMarkContent['contentHashes'],
  IMarkContent['contentNonceMap'],
  IMarkContent['creatorSignature'],
  IMarkContent['link'],
  CompressedMark[],
  IMarkContent['contentHash'],
  IMarkContent['contentId']
]
