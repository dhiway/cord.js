/**
 * @packageDocumentation
 * @module IRegistry
 */
import { HexString } from '@polkadot/util/types.js'
import type { IPublicIdentity } from './PublicIdentity.js'

export const REGISTRY_IDENTIFIER: number = 51
export const REGISTRY_PREFIX: string = 'registry:cord:'

export interface IEntry {
  entryDetails: string
  space: string
  controller: IPublicIdentity['address']
}

export interface IRegistryEntry {
  identifier: string
  entry: IEntry
  entryHash: HexString
  controllerSignature: string
}

export interface IRegistryEntryDetails {
  identifier: IRegistryEntry['identifier']
  entryHash: IRegistryEntry['entryHash']
  controller: IPublicIdentity['address']
  space: IRegistryEntry['entry']['space']
  revoked: boolean
  metadata: boolean
}

export interface IRegistryMetadataEntry {
  identifier: IRegistryEntry['identifier']
  controller: IPublicIdentity['address']
  metadata: string
  metaHash: IRegistryEntry['entryHash']
}
