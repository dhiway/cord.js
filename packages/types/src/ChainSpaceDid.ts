import type { DidUri } from './DidDocument'
import { HexString } from './Imported.js'

export const SPACE_IDENT = 3390
export const SPACE_PREFIX = 'space:cord:'
export type SpaceUri = `${typeof SPACE_PREFIX}${string}`
export type SpaceId = string
export type SpaceDigest = HexString
export const AUTH_IDENT = 2092
export const AUTH_PREFIX = 'auth:cord:'
export type AuthorizationUri = `${typeof AUTH_PREFIX}${string}`
export type AuthorizationId = string

export interface ChainSpaceDetails {
  uri: SpaceUri
  authorizationUri: AuthorizationUri
}

export interface IChainSpace {
  uri: SpaceUri
  desc: string
  digest: SpaceDigest
  creatorUri: DidUri
  authorizationUri: AuthorizationUri
}

export interface ISpaceDetails {
  uri: SpaceUri
  creatorUri: DidUri
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
  uri: SpaceUri
  delegateUri: DidUri
  permission: PermissionType
  authorizationUri: AuthorizationUri
  delegatorUri: DidUri
}

export interface ISpaceAuthorizationDetails {
  uri: SpaceUri
  delegateUri: DidUri
  permission: PermissionType[]
}
