import type { HexString } from '@polkadot/util/types'
import type { DidSignature } from './DidDocument'
import type { IContent } from './Content.js'

export type Hash = HexString

export type NonceHash = {
  hash: Hash
  nonce?: string
}

export interface ICredential {
  content: IContent
  contentHashes: Hash[]
  contentNonceMap: Record<Hash, string>
  evidenceIds: ICredential[]
  swarm: string | null
  rootHash: Hash
  identifier: string
}

export interface ICredentialPresentation extends ICredential {
  claimerSignature: DidSignature & { challenge?: string }
}

export interface CordPublishedStreamV1 {
  credential: ICredential
  metadata?: {
    label?: string
    blockNumber?: number
    txHash?: HexString
  }
}

export type CordPublishedStreamCollectionV1 = CordPublishedStreamV1[]

export const CordPublishedStreamCollectionV1Type =
  'CordPublishedStreamCollectionV1'
