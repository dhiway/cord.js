/**
 * @packageDocumentation
 * @module IContentStream
 */

import type { IMark, CompressedMark } from './Mark.js'
import type { IContent, CompressedContent } from './Content.js'

export type Hash = string

export type NonceHash = {
  hash: Hash
  nonce?: string
}

export interface IContentStream {
  content: IContent
  contentHashes: Hash[]
  contentNonceMap: Record<Hash, string>
  legitimations: IMark[]
  link: string | null
  space: string | null
  issuerSignature: string
  rootHash: Hash
  identifier: string
}

export type CompressedContentStream = [
  CompressedContent,
  IContentStream['contentHashes'],
  IContentStream['contentNonceMap'],
  IContentStream['issuerSignature'],
  IContentStream['link'] | null,
  IContentStream['space'] | null,
  CompressedMark[],
  IContentStream['rootHash'],
  IContentStream['identifier']
]
