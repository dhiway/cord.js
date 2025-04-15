import { HexString } from './Imported.js'

export const REGISTRY_PREFIX = 'registry:cord:';
export type RegistryUri = `${typeof REGISTRY_PREFIX}${string}`;
export type RegistryId = string;
export type RegistryDigest = HexString;

export interface RegistryDetails {
    uri: RegistryUri
    // authorizationUri: RegistryAuthorizationUri
}

export interface IRegistryCreate {
    tx_hash: RegistryDigest
    blob: string | null
    docId: string | null
    docAuthorId: string | null
    docNodeId: string | null
}

export interface IRegistryTxHashUpdate {
    registryUri: RegistryUri
    tx_hash: RegistryDigest
    blob: string | null
}

export interface IRegistryCreator {
    uri: RegistryUri
    newCreatorAddress: string
}

export enum RegistryPermissionVariant {
  Entry = 'Entry',
  Delegate = 'Delegate',
  Admin = 'Admin'
}