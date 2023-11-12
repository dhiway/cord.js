import type { DidUri } from './DidDocument'
import { HexString } from './Imported.js'

export const SPACE_IDENT = 7101
export const SPACE_PREFIX = 'space:cord:'
export type SpaceId = string
export const AUTHORIZATION_IDENT = 10447
export const AUTHORIZATION_PREFIX = 'auth:cord:'
export type AuthorizationId = string

export interface ChainSpaceIdentifiers {
  chainSpaceId: SpaceId
  authorizationId: AuthorizationId
}

export interface IChainSpace {
  identifier: SpaceId
  digest: HexString
  creator: DidUri
  authorization: string
}

export interface ISpaceDetails {
  identifier: SpaceId
  creator: DidUri
  txnCapacity: number
  txnUsage: number
  approved: boolean
  archive: boolean
}

/* eslint-disable no-bitwise */
export const Permission = {
  ASSERT: 1 << 0, // 0001
  ADMIN: 1 << 1, // 0010
  AUDIT: 1 << 2, // 0100
} as const
export type PermissionType = (typeof Permission)[keyof typeof Permission]

export interface ISpaceAuthorization {
  space: SpaceId
  delegate: DidUri
  permission: PermissionType
  delegator: DidUri
}

export interface ISpaceAuthorizationDetails {
  space: SpaceId
  delegate: DidUri
  permission: PermissionType
}
