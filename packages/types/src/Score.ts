import { U32 } from '@polkadot/types'
import { HexString } from '@polkadot/util/types.js'

export const SCORE_IDENTIFIER: number = 101
export const SCORE_PREFIX: string = 'score:cord:'
export const SCORE_MULTIPLIER: number = 10
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
  requestor: string
  rating_type: ScoreType
  rating: U32
  entry_type: EntryType
  count: U32
}

export interface IratingInput {
  entry: IJournalContent,
  digest: string,
  creator: string,
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
  entity: IJournalContent['entity']
  scoreType: ScoreType
  average: {
    count: number
    score: number
  }
}
