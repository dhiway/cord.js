import { HexString } from '@polkadot/util/types.js'
import type { ISchema } from './Schema.js'
import type { DidUri } from './DidDocument'
import type { IContents } from './Content.js'

export const REGISTRY_IDENT: number = 7101
export const REGISTRY_PREFIX: string = 'space:cord:'

export interface IRegistryMetaData {
  digest: HexString
  schema: ISchema['$id']
  creator: DidUri
  active: boolean
}

export interface IRegistryType {
  details: IContents
  schema: ISchema['$id']
  creator: DidUri
}

export interface IRegistry {
  identifier: string
  details: string
  meta: IRegistryMetaData
}

export interface IRegistryDetails {
  identifier: IRegistry['identifier']
  details: IRegistry['details']
  meta: IRegistry['meta']
}

/* eslint-disable no-bitwise */
export const Permission = {
  ASSERT: 1 << 0, // 0001
  ADMIN: 1 << 1, // 0010
} as const
export type PermissionType = (typeof Permission)[keyof typeof Permission]

export interface IRegistryAuthorization {
  identifier: IRegistry['identifier']
  delegate: DidUri
  schema: ISchema['$id'] | null
}

export interface IRegistryAuthorizationDetails {
  identifier: IRegistry['identifier']
  delegate: DidUri
  schema: ISchema['$id'] | null
  permissions: PermissionType[]
}
