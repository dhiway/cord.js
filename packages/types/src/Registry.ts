import { HexString } from './Imported.js'

export const REGISTRY_PREFIX = 'registry:cord:';
export type RegistryUri = `${typeof REGISTRY_PREFIX}${string}`;
export type RegistryId = string;
export type RegistryDigest = HexString;

export interface RegistryDetails {
    registryId: RegistryId
}

export interface IRegistryCreate {
    tx_hash: RegistryDigest
    blob: string | null
}

export interface IRegistryTxHashUpdate {
    registryId: RegistryId
    tx_hash: RegistryDigest
    blob: string | null
}

export enum RegistryPermissionVariant {
  Entry = 'Entry',
  Delegate = 'Delegate',
  Admin = 'Admin'
}