import { HexString } from '@polkadot/util/types.js'
import { SpaceUri } from './ChainSpace.js'
import { DidUri } from './DidDocument.js'

export const RATING_IDENT = 11034
export const RATING_PREFIX = 'rating:cord:'
export type RatingEntryUri = `${typeof RATING_PREFIX}${string}`
export type RatingEntryId = string

export enum RatingTypeOf {
  overall = 'Overall',
  delivery = 'Delivery',
}

export enum EntityTypeOf {
  overall = 'Retail',
  delivery = 'Logistic',
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
  countOfTxn: number
  totalRating: number
  entityType: EntityTypeOf
  ratingType: RatingTypeOf
}

export interface IRatingTransformed {
  entityUid: string
  entityId: string
  providerUid: string
  providerId: string
  countOfTxn: number
  totalEncodedRating: number
  entityType: EntityTypeOf
  ratingType: RatingTypeOf
}

export interface IRatingEntry {
  entry: IRatingTransformed
  messageId: string
  entryDigest: HexString
}

export type IRatingChainEntry = Omit<
  IRatingTransformed,
  'providerId' | 'entityId'
>

export interface IRatingDispatch {
  entryUri: RatingEntryUri
  entry: IRatingChainEntry
  chainSpace: SpaceUri
  messageId: string
  entryDigest: HexString
  creatorUri: DidUri
}

// export interface IRatingEntryDetails {
//   ratingEntry: IRatingChainEntry
//   entryDigest: HexString
//   messageId: string
//   chainSpace: SpaceUri
//   creatorUri: DidUri
//   entryType: EntryTypeOf
//   referenceId?: RatingEntryUri
//   createdAt: Bl
//   entity: string
//   tid: string
//   collector: string
//   ratingType: string
//   rating: number
//   entryType: string
//   count: number
// }

// export interface IRatingInput {
//   entry: IJournalContent
//   digest: string
//   creator: string
// }

// export interface IRatingData {
//   ratingInput: IRatingInput
//   identifier: string
// }

// export interface IJournal {
//   identifier: string
//   entry: IJournalContent
//   digest: HexString
//   entitySignature: string
// }

// export interface IJournalDetails {
//   identifier: IJournal['identifier']
//   entry: IJournal['entry']
//   digest: IJournal['digest']
// }

// export interface IScoreAggregateDetails {
//   entity: IJournalContent['entity']
//   RatingType: RatingType
//   aggregate: {
//     count: number
//     score: number
//   }
// }

// export interface IEntityScoreDetails {
//   rating: number
//   count: number
// }
