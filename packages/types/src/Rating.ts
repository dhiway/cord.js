/**
 * @packageDocumentation
 * @module ISpace
 */
import { HexString } from '@polkadot/util/types.js'
import type { IPublicIdentity } from './PublicIdentity.js'

export const RATING_IDENTIFIER: number = 101
export const RATING_PREFIX: string = 'rating:cord:'

export interface IRatingCore {
  rating: number
  count: number
}

export interface IRatingType {
  rating: IRatingCore
  entity: string
  seller_app: string
  buyer_app: string
}

export interface IRating {
  identifier: string
  ratingHash: HexString
  controller: IPublicIdentity['address']
  controllerSignature: string
  details: IRatingType
}

export interface IRatingDetails {
  identifier: IRating['identifier']
  ratingHash: IRating['ratingHash']
  controller: IPublicIdentity['address']
  details: IRating['details']
}
