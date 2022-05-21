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
  link?: string
  space?: string
  issuerSignature: string
  rootHash: Hash
  identifier: string
}

export type CompressedContentStream = [
  CompressedContent,
  IContentStream['contentHashes'],
  IContentStream['contentNonceMap'],
  IContentStream['issuerSignature'],
  IContentStream['link'] | undefined,
  IContentStream['space'] | undefined,
  CompressedMark[],
  IContentStream['rootHash'],
  IContentStream['identifier']
]
