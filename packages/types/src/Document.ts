import type { HexString } from '@polkadot/util/types'
import type { DidSignature } from './DidDocument'
import type { IContent } from './Content.js'
import type { IRegistryAuthorization } from './Registry'

export type Hash = HexString

export type NonceHash = {
  hash: Hash
  nonce?: string
}

export interface IDocument {
  content: IContent
  contentHashes: Hash[]
  contentNonceMap: Record<Hash, string>
  evidenceIds: IDocument[]
  authorization: IRegistryAuthorization['identifier'] | null
  registry: string | null
  documentHash: Hash
  identifier: string
}

export interface IDocumentPresentation extends IDocument {
  holderSignature: DidSignature & { challenge?: string }
}

export interface CordPublishedDocument {
  document: IDocument
  metadata?: {
    template?: string
    label?: string
    blockNumber?: number
  }
}

export type CordPublishedDocumentCollection = CordPublishedDocument[]

export const CordPublishedDocumentCollectionType =
  'CordPublishedDocumentCollection'
