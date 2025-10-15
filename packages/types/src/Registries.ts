import type { DidUri } from './DidDocument.js'
import type { SchemaUri } from './SchemaDid.js';
import type { NamespaceAuthorizationUri } from './Namespace.js';

import { HexString } from './Imported.js'

export const REGISTRIES_IDENT = 9274;
export const REGISTRIES_PREFIX = 'registries:cord:';
export type RegistriesUri = `${typeof REGISTRIES_PREFIX}${string}`;
export type RegistriesId = string;
export type RegistriesDigest = HexString;
export const REGISTRYAUTH_IDENT = 10001;
export const REGISTRYAUTH_PREFIX = 'registriesauth:cord:';
export type RegistryAuthorizationUri = `${typeof REGISTRYAUTH_PREFIX}${string}`;
export type RegistryAuthorizationId = string;

export interface RegistriesDetails {
    uri: RegistriesUri
    authorizationUri: RegistryAuthorizationUri
}

export interface IRegistriesCreate {
    uri: RegistriesUri
    creatorUri: DidUri
    digest: RegistriesDigest
    blob: string | null
    schemaUri: SchemaUri | null
    authorizationUri: RegistryAuthorizationUri
    namespaceAuthorizationUri: NamespaceAuthorizationUri
}

export interface IRegistriesUpdate {
    uri: RegistriesUri
    creatorUri: DidUri
    digest: RegistriesDigest
    blob: string | null
    authorizationUri: RegistryAuthorizationUri
    namespaceAuthorizationUri: NamespaceAuthorizationUri
}

/* eslint-disable no-bitwise */
export const RegistriesPermission = {
  ASSERT: 1 << 0, // 0001
  DELEGATE: 1 << 1, // 0010
  ADMIN: 1 << 2, // 0100
} as const
export type RegistriesPermissionType = (typeof RegistriesPermission)[keyof typeof RegistriesPermission]

export interface IRegistryAuthorization {
  uri: RegistriesUri
  authorizationUri: RegistryAuthorizationUri
  delegateUri: DidUri
  permission: RegistriesPermissionType
  delegatorUri: DidUri
}

export interface IRegistryAuthorizationDetails {
  uri: RegistriesUri
  delegateUri: DidUri
  permission: RegistriesPermissionType[]
}
