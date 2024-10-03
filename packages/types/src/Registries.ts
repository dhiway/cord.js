import type { DidUri } from './DidDocument'
import { HexString } from './Imported.js'

export const REGISTRY_IDENT = 9274;
export const REGISTRY_PREFIX = 'registry:cord:';
export type RegistryUri = `${typeof REGISTRY_PREFIX}${string}`;
export type RegistryId = string;
export type RegistryDigest = HexString;
export const REGISTRYAUTH_IDENT = 10001;
export const REGISTRYAUTH_PREFIX = 'registryauth:cord:';
export type RegistryAuthorizationUri = `${typeof REGISTRYAUTH_PREFIX}${string}`;
export type RegistryAuthorizationId = string;

export interface RegistryDetails {
    uri: RegistryUri
    authorizationUri: RegistryAuthorizationUri
}

// TODO: Fix schemaId once schema-acc pallet becomes active
// TODO: Handle creatorUri as Did.
export interface IRegistryCreate {
    uri: RegistryUri
    creatorUri: DidUri
    digest: RegistryDigest
    blob: string | null
    schemaId: string | null 
    authorizationUri: RegistryAuthorizationUri
}

export interface IRegistryUpdate {
    uri: RegistryUri
    creatorUri: DidUri
    digest: RegistryDigest
    blob: string | null
    authorizationUri: RegistryAuthorizationUri
}

/* eslint-disable no-bitwise */
export const RegistryPermission = {
  ASSERT: 1 << 0, // 0001
  DELEGATE: 1 << 1, // 0010
  ADMIN: 1 << 2, // 0100
} as const
export type RegistryPermissionType = (typeof RegistryPermission)[keyof typeof RegistryPermission]

export interface IRegistryAuthorization {
  uri: RegistryUri
  authorizationUri: RegistryAuthorizationUri
  delegateUri: DidUri
  permission: RegistryPermissionType
  delegatorUri: DidUri
}

export interface IRegistryAuthorizationDetails {
  uri: RegistryUri
  delegateUri: DidUri
  permission: RegistryPermissionType[]
}
