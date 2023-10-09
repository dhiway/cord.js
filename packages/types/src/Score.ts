import { HexString } from '@polkadot/util/types.js'

export const SCORE_IDENTIFIER: number = 101
export const SCORE_PREFIX: string = 'score:cord:'
export const SCORE_MODULUS: number = 10
export const SCORE_IDENT: number = 11034

export enum ScoreType {
  overall = 'Overall',
  delivery = 'Delivery',
}
export enum EntryType {
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
  scoreType: ScoreType
  aggregate: {
    count: number
    score: number
  }
}

export interface IScoreAverageDetails {
  rating: number
  count: number
  average: number
}

export interface IScoreDetails {
  rating: number
  count: number
}
