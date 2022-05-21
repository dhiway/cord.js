/**
 * @packageDocumentation
 * @module ISpace
 */
import type { IPublicIdentity } from './PublicIdentity.js'

export const SPACE_IDENTIFIER: number = 13
export const SPACE_PREFIX: string = 'space:cord:'

export interface ISpaceType {
  title: string
  description: string
}

export interface ISpace {
  identifier: string
  spaceHash: string
  controller: IPublicIdentity['address']
  controllerSignature: string
  space: ISpaceType
}

export interface ISpaceDetails {
  identifier: ISpace['identifier']
  spaceHash: ISpace['spaceHash']
  controller: IPublicIdentity['address']
  archived: boolean
}
