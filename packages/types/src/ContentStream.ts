/**
 * @packageDocumentation
 * @module IContentStream
 */

import type { HexString } from '@polkadot/util/types'
import type { ICredential, CompressedCredential } from './Credential.js'
import type { IContent, CompressedContent } from './Content.js'
import type { IPublicIdentity } from './PublicIdentity.js'

export const DEFAULT_STREAM_VALIDITY: number = 99

export type Hash = HexString

export type NonceHash = {
  hash: Hash
  nonce?: string
}

export type AccountSignature = {
  keyId: IPublicIdentity['address']
  signature: string
}

export interface IContentStream {
  content: IContent
  contentHashes: Hash[]
  contentNonceMap: Record<Hash, string>
  evidenceIds: ICredential[]
  link: string | null
  space: string | null
  signatureProof?: AccountSignature & { challenge?: string }
  rootHash: Hash
  identifier: string
  issuanceDate: string
  expirationDate: string
}

export type CompressedContentStream = [
  CompressedContent,
  IContentStream['contentHashes'],
  IContentStream['contentNonceMap'],
  IContentStream['signatureProof'],
  IContentStream['link'] | null,
  IContentStream['space'] | null,
  CompressedCredential[],
  IContentStream['rootHash'],
  IContentStream['identifier'],
  IContentStream['issuanceDate'],
  IContentStream['expirationDate']
]
