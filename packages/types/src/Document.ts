import type { HexString } from './Imported.js'
import type { DidSignature } from './DidDocument'
import type { IContent } from './Content.js'
import type { SignCallback } from './CryptoCallbacks'

export type Hash = HexString

export type NonceHash = {
  hash: Hash
  nonce?: string
}

export type DocumentMetaData = {
  templates?: string[]
  labels?: string[]
}

export interface IDocument {
  identifier: string
  content: IContent
  contentHashes: Hash[]
  contentNonceMap: Record<Hash, string>
  evidenceIds: IDocument[]
  chainSpace: string
  issuanceDate: string
  validFrom?: string
  validUntil?: string
  documentHash: Hash
  issuerSignature: DidSignature
  metadata: DocumentMetaData
}

export interface IDocumentPresentation extends IDocument {
  selectiveAttributes: string[]
  holderSignature: DidSignature & { challenge?: string }
}

export interface PresentationOptions {
  document: IDocument
  signCallback: SignCallback
  selectedAttributes?: string[]
  challenge?: string
}
