import { HexString } from '@polkadot/util/types.js'

export const SCORE_IDENTIFIER: number = 101
export const SCORE_PREFIX: string = 'score:cord:'
export const SCORE_MODULUS: number = 10
export const SCORE_IDENT: number = 11034
export const MAX_SCORE_PER_ENTRY: number = 50

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
  rating_type: string
  rating: number
  entry_type: string
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
