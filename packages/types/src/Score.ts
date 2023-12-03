import { HexString } from '@polkadot/util/types.js'
import { SpaceId, SpaceUri } from './ChainSpace.js'
import { DidUri, DidSignature } from './DidDocument.js'
import { CordAddress } from './Address.js'

export const RATING_IDENT = 6077
export const RATING_PREFIX = 'rating:cord:'
export type RatingEntryUri = `${typeof RATING_PREFIX}${string}`
export type RatingEntryId = string

export enum RatingTypeOf {
  overall = 'Overall',
  delivery = 'Delivery',
}

export enum EntityTypeOf {
  retail = 'Retail',
  logistic = 'Logistic',
}

export enum EntryTypeOf {
  credit = 'Credit',
  debit = 'Debit',
}

export interface IRatingContent {
  entityUid: string
  entityId: string
  providerUid: string
  providerId: string
  entityType: EntityTypeOf
  ratingType: RatingTypeOf
  referenceId?: string
  countOfTxn: number
  totalRating: number
}

export interface IRatingTransformed {
  entityUid: string
  entityId: string
  providerUid: string
  providerId: string
  providerDid: CordAddress
  entityType: EntityTypeOf
  ratingType: RatingTypeOf
  referenceId?: string
  countOfTxn: number
  totalEncodedRating: number
}

export interface IRatingEntry {
  entry: IRatingTransformed
  messageId: string
  referenceId?: RatingEntryUri
  entryDigest: HexString
  providerSignature: DidSignature
}

export type RatingPartialEntry = Omit<IRatingEntry, 'entry'>

export type IRatingChainEntry = Omit<
  IRatingTransformed,
  'providerId' | 'entityId'
>

export interface IRatingRevokeEntry {
  entry: RatingPartialEntry
  entityUid: string
  providerDid: DidUri
}

export interface IRatingDispatch {
  entryUri: RatingEntryUri
  entry: IRatingChainEntry
  chainSpace: SpaceUri
  messageId: string
  entryDigest: HexString
  authorUri: DidUri
  authorSignature: DidSignature
}

export interface IAggregateScore {
  entityUid: string
  ratingType: RatingTypeOf
  countOfTxn: number
  totalRating: number
}

export type IRatingChainEntryDetails = Omit<
  IRatingContent,
  'providerId' | 'entityId' | 'providerDid' | 'referenceId'
>
export interface IRatingChainStatus {
  entryUri: RatingEntryUri
  entry: IRatingChainEntryDetails
  digest: HexString
  messageId: string
  space: SpaceId
  creatorUri: DidUri
  entryType: EntryTypeOf
  referenceId?: RatingEntryUri
  createdAt: string
}
