import { HexString } from './Imported.js'
import { 
    RegistryAuthorizationUri, RegistryUri
} from './Registries.js'
import type { DidUri } from './DidDocument'

export const ENTRY_IDENT = 9944;
export const ENTRY_PREFIX = 'entry:cord:';
export type EntryUri = `${typeof ENTRY_PREFIX}${string}`;
export type EntryId = string;
export type EntryDigest = HexString;

export interface IRegistryEntry {
  uri: EntryUri
  creatorUri: DidUri
  digest: HexString
  blob: string | null
  registryUri: RegistryUri
  authorizationUri: RegistryAuthorizationUri
}

export interface IRegistryEntryDetails {
  uri: EntryUri
  digest: HexString
  blob: string | null
  registryUri: RegistryUri
  authorizationUri: RegistryAuthorizationUri
}

export interface IRegistryEntryStatus {
  uri: EntryUri
  digest: HexString
  blob: string | null
  registryUri: RegistryUri
  authorizationUri: RegistryAuthorizationUri
  creatorUri: DidUri
  revoked: boolean
}

export interface IRegistryEntryChainStorage {
    uri: EntryUri
    digest: HexString
    revoked: boolean
    creatorUri: DidUri
    registryUri: RegistryUri
}
