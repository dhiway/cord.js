/**
 * @packageDocumentation
 * @module IScore
 */
import { HexString } from '@polkadot/util/types.js'
import type { IPublicIdentity } from './PublicIdentity.js'

export const SCORE_IDENTIFIER: number = 101
export const SCORE_PREFIX: string = 'score:cord:'

export enum ScoreType {
  overall = 'overall',
  delivery = 'delivery',
}

export interface IJournalContent {
  entity: IPublicIdentity['address']
  uid: string
  tid: string
  collector: IPublicIdentity['address']
  requestor: IPublicIdentity['address']
  scoreType: ScoreType
  score: number
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
