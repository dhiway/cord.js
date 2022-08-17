/**
 * @packageDocumentation
 * @module ISpace
 */
import { HexString } from '@polkadot/util/types.js'
import type { IPublicIdentity } from './PublicIdentity.js'
import type { ISchema } from './Schema.js'

export const SPACE_IDENTIFIER: number = 31
export const SPACE_PREFIX: string = 'space:cord:'

export interface ISpaceType {
  title: string
  description: string
}

export interface ISpace {
  identifier: string
  spaceHash: HexString
  schema: ISchema['identifier'] | null
  controller: IPublicIdentity['address']
  controllerSignature: string
  details: ISpaceType
}

export interface ISpaceDetails {
  identifier: ISpace['identifier']
  spaceHash: ISpace['spaceHash']
  schema: ISpace['schema'] | null
  controller: IPublicIdentity['address']
  archived: boolean
  meta: boolean
}
