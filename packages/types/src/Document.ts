import type { HexString } from './Imported.js'
import type { DidSignature } from './DidDocument'
import type { IContent } from './Content.js'
import type { SignCallback } from './CryptoCallbacks'
import { SpaceUri } from './ChainSpace.js'

export type Hash = HexString
export type DocumentUri = `doc:${string}`
export type DocumentId = string

export type NonceHash = {
  hash: Hash
  nonce?: string
}

export interface IDocumentContent extends IContent {
  issuanceDate: string
  expirationDate?: string
  spaceUri: SpaceUri
}

// TODO: Integrate Evidence layer
export interface IDocumentEvidence {
  type: string[]
  evidenceDocuments: string[]
  subjectPresence: string
  documentPresence: string
}

export interface IDocument {
  uri: DocumentUri
  content: IDocumentContent
  contentHashes: Hash[]
  contentNonceMap: Record<HexString, string>
  evidenceUri: IDocument[]
  issuerSignature: DidSignature
}

export type PartialDocument = Omit<
  IDocument,
  'contentHashes' | 'contentNonceMap'
>

export interface IDocumentUpdate {
  uri: DocumentUri
  content: IDocumentContent
  evidenceUri: IDocument[]
}

export interface IUpdatedDocument extends IDocument {
  parentUri: DocumentUri
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
