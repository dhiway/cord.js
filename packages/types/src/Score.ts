import { HexString } from '@polkadot/util/types.js'
import { SpaceId, SpaceUri } from './ChainSpace.js'
import { DidUri } from './DidDocument.js'
import { CordAddress } from './Address.js'

export const RATING_IDENT = 6077
export const RATING_PREFIX = 'rating:cord:'
export type RatingEntryUri = `${typeof RATING_PREFIX}${string}`
export type RatingEntryId = string

export enum RatingTypeOf {
  overall = 'Overall',
  delivery = 'Delivery',
}

export enum EntryTypeOf {
  credit = 'Credit',
  debit = 'Debit',
}

export interface IRatingContent {
  entity_id: string
  entity_name: string
  provider_id: string
  rating_type: RatingTypeOf
  reference_id?: string
  count_of_txn: number
  total_rating: number
}

export interface IRatingTransformed {
  entity_id: string
  entity_name: string
  provider_id: string
  provider_did: CordAddress
  rating_type: RatingTypeOf
  reference_id?: string
  count_of_txn: number
  total_encoded_rating: number
}

export interface IRatingEntry {
  entry: IRatingTransformed
  message_id: string
  reference_id?: RatingEntryUri
  entry_digest: HexString
}

export type RatingPartialEntry = Omit<IRatingEntry, 'entry'>

export type IRatingChainEntry = Omit<
  IRatingTransformed,
  'provider_id' | 'entity_id'
>

export interface IRatingRevokeEntry {
  entry: RatingPartialEntry
  entity_id: string
  provider_did: DidUri
}

export interface IRatingDispatch {
  entryUri: RatingEntryUri
  entry: IRatingChainEntry
  chainSpace: SpaceUri
  message_id: string
  entry_digest: HexString
  authorUri: DidUri
}

export interface IAggregateScore {
  entity_id: string
  rating_type: RatingTypeOf
  count_of_txn: number
  total_rating: number
}

export type IRatingChainEntryDetails = Omit<
  IRatingContent,
  'provider_id' | 'entity_id' | 'provider_did' | 'reference_id'
>
export interface IRatingChainStatus {
  entryUri: RatingEntryUri
  entry: IRatingChainEntryDetails
  digest: HexString
  message_id: string
  space: SpaceId
  creatorUri: DidUri
  reference_id?: RatingEntryUri
  createdAt: string
}
