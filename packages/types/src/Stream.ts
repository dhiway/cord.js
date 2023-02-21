import type { HexString } from '@polkadot/util/types'
import type { DidSignature } from './DidDocument'
import type { IContent } from './Content.js'

export type Hash = HexString

export type NonceHash = {
  hash: Hash
  nonce?: string
}

export interface IStream {
  content: IContent
  contentHashes: Hash[]
  contentNonceMap: Record<Hash, string>
  evidenceIds: IStream[]
  link: string | null
  space: string | null
  rootHash: Hash
  identifier: string
}

export interface IStreamPresentation extends IStream {
  claimerSignature: DidSignature & { challenge?: string }
}

export interface CordPublishedStreamV1 {
  credential: IStream
  metadata?: {
    label?: string
    blockNumber?: number
    txHash?: HexString
  }
}

export type CordPublishedStreamCollectionV1 = CordPublishedStreamV1[]

export const CordPublishedStreamCollectionV1Type =
  'CordPublishedStreamCollectionV1'
