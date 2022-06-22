/**
 * @packageDocumentation
 * @module IContentStream
 */

import type { HexString } from '@polkadot/util/types'
import type { ICredential, CompressedCredential } from './Credential.js'
import type { IContent, CompressedContent } from './Content.js'

export const DEFAULT_STREAM_VALIDITY: number = 99

export type Hash = HexString

export type NonceHash = {
  hash: Hash
  nonce?: string
}

export interface IContentStream {
  content: IContent
  contentHashes: Hash[]
  contentNonceMap: Record<Hash, string>
  legitimations: ICredential[]
  link: string | null
  space: string | null
  issuerSignature: string
  rootHash: Hash
  identifier: string
  issuanceDate: string
  expirationDate: string
}

export type CompressedContentStream = [
  CompressedContent,
  IContentStream['contentHashes'],
  IContentStream['contentNonceMap'],
  IContentStream['issuerSignature'],
  IContentStream['link'] | null,
  IContentStream['space'] | null,
  CompressedCredential[],
  IContentStream['rootHash'],
  IContentStream['identifier'],
  IContentStream['issuanceDate'],
  IContentStream['expirationDate']
]
