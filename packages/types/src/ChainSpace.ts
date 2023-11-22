import type { DidUri } from './DidDocument'
import { HexString } from './Imported.js'

export const SPACE_IDENT = 7101
export const SPACE_PREFIX = 'space:cord:'
export type SpaceId = string
export const AUTH_IDENT = 10447
export const AUTH_PREFIX = 'auth:cord:'
export type AuthorizationId = string

export interface ChainSpaceIdentifiers {
  uri: SpaceId
  authUri: AuthorizationId
}

export interface IChainSpace {
  uri: SpaceId
  digest: HexString
  creator: DidUri
  authorization: AuthorizationId
}

export interface ISpaceDetails {
  uri: SpaceId
  creator: DidUri
  txnCapacity: number
  txnUsage: number
  approved: boolean
  archive: boolean
}

/* eslint-disable no-bitwise */
export const Permission = {
  ASSERT: 1 << 0, // 0001
  DELEGATE: 1 << 1, // 0010
  ADMIN: 1 << 2, // 0100
} as const
export type PermissionType = (typeof Permission)[keyof typeof Permission]

export interface ISpaceAuthorization {
  space: SpaceId
  delegate: DidUri
  permission: PermissionType
  authorization: AuthorizationId
  delegator: DidUri
}

export interface ISpaceAuthorizationDetails {
  space: SpaceId
  delegate: DidUri
  permission: PermissionType[]
}
