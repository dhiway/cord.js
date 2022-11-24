/**
 * @packageDocumentation
 * @module ISpace
 */
import { HexString } from '@polkadot/util/types.js'
import type { IPublicIdentity } from './PublicIdentity.js'

export const RATING_IDENTIFIER: number = 101
export const RATING_PREFIX: string = 'rating:cord:'

export interface IRatingType {
  title: string
  description: string
  rating: number
  count: number
  entity: string
}

export interface IRating {
  identifier: string
  ratingHash: HexString
  controller: IPublicIdentity['address']
  controllerSignature: string
  details: IRatingType
  rating: number
  count: number
  entity: string
}

export interface IRatingDetails {
  identifier: IRating['identifier']
  ratingHash: IRating['ratingHash']
  controller: IPublicIdentity['address']
  entity: IRating['entity']
  rating: IRating['rating']
  count: IRating['count']
}
