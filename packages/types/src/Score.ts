import { HexString } from '@polkadot/util/types.js'

export const SCORE_IDENT = 11034
export const SCORE_PREFIX = 'score:cord:'
export const SCORE_MODULUS = 10
export const MAX_SCORE_PER_ENTRY = 50

export enum RatingType {
  overall = 'Overall',
  delivery = 'Delivery',
}
export enum RatingEntry {
  credit = 'Credit',
  debit = 'Debit',
}

export interface IJournalContent {
  entity: string
  tid: string
  collector: string
  ratingType: string
  rating: number
  entryType: string
  count: number
}

export interface IRatingInput {
  entry: IJournalContent
  digest: string
  creator: string
}

export interface IRatingData {
  ratingInput: IRatingInput
  identifier: string
}

export interface IJournal {
  identifier: string
  entry: IJournalContent
  digest: HexString
  entitySignature: string
}

export interface IJournalDetails {
  identifier: IJournal['identifier']
  entry: IJournal['entry']
  digest: IJournal['digest']
}

export interface IScoreAggregateDetails {
  entity: IJournalContent['entity']
  RatingType: RatingType
  aggregate: {
    count: number
    score: number
  }
}

export interface IEntityScoreDetails {
  rating: number
  count: number
}
