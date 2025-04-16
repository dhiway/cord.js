import { HexString } from './Imported.js'
import { 
    RegistryAuthorizationUri, RegistriesUri
} from './Registries.js'
import type { DidUri } from './DidDocument'

export const ENTRIES_IDENT = 9944;
export const ENTRIES_PREFIX = 'entry:cord:';
export type EntriesUri = `${typeof ENTRIES_PREFIX}${string}`;
export type EntriesId = string;
export type EntriesDigest = HexString;

export interface IRegistriesEntry {
  uri: EntriesUri
  creatorUri: DidUri
  digest: HexString
  blob: string | null
  registryUri: RegistriesUri
  authorizationUri: RegistryAuthorizationUri
}

export interface IRegistriesEntryDetails {
  uri: EntriesUri
  digest: HexString
  blob: string | null
  registryUri: RegistriesUri
  authorizationUri: RegistryAuthorizationUri
}

export interface IRegistriesEntryStatus {
  uri: EntriesUri
  digest: HexString
  blob: string | null
  registryUri: RegistriesUri
  authorizationUri: RegistryAuthorizationUri
  creatorUri: DidUri
  revoked: boolean
}

export interface IRegistriesEntryChainStorage {
    uri: EntriesUri
    digest: HexString
    revoked: boolean
    creatorUri: DidUri
    registryUri: RegistriesUri
}
