import type { DidUri } from './DidDocument'
import { HexString } from './Imported.js'

export const NAMESPACE_IDENT = 12501;
export const NAMESPACE_PREFIX = 'namespace:cord:';
export type NamespaceUri = `${typeof NAMESPACE_PREFIX}${string}`;
export type NamespaceId = string;
export type NamespaceDigest = HexString;
export const NAMESPACEAUTH_IDENT = 13101;
export const NAMESPACEAUTH_PREFIX = 'namespaceauth:cord:';
export type NamespaceAuthorizationUri = `${typeof NAMESPACEAUTH_PREFIX}${string}`;
export type NamespaceAuthorizationId = string;

export interface NamespaceDetails {
    uri: NamespaceUri
    authorizationUri: NamespaceAuthorizationUri
}

export interface INamespaceCreate {
    uri: NamespaceUri
    creatorUri: DidUri
    digest: NamespaceDigest
    blob: string | null
    authorizationUri: NamespaceAuthorizationUri
}

/* eslint-disable no-bitwise */
export const NamespacePermission = {
  ASSERT: 1 << 0, // 0001
  DELEGATE: 1 << 1, // 0010
  ADMIN: 1 << 2, // 0100
} as const
export type NamespacePermissionType = (typeof NamespacePermission)[keyof typeof NamespacePermission]

export interface INamespaceAuthorization {
  uri: NamespaceUri
  authorizationUri: NamespaceAuthorizationUri
  delegateUri: DidUri
  permission: NamespacePermissionType
  delegatorUri: DidUri
}