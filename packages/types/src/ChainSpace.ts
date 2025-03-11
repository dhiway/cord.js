export const SPACE_IDENT = 14901;
export const AUTH_IDENT = 14201;

import { SpaceUri, PermissionType, AuthorizationUri, SpaceDigest,
 }   from './ChainSpaceDid.js'

export interface ISpaceAuthorizationAccountType {
  uri: SpaceUri
  delegateAddress: string
  permission: PermissionType
  authorizationUri: AuthorizationUri
  creatorAddress: string
}

export interface ISpaceAuthorizationDetailsAccountType {
  uri: SpaceUri
  delegateAddress: string
  permission: PermissionType[]
}

export interface IChainSpaceAccountType {
  uri: SpaceUri
  desc: string
  digest: SpaceDigest
  creatorAddress: string
  authorizationUri: AuthorizationUri
}

export interface ISpaceDetailsAccountType {
  uri: SpaceUri
  creatorAddress: string
  txnCapacity: number
  txnUsage: number
  approved: boolean
  archive: boolean
}