import { HexString } from './Imported.js'
import { 
    RegistryAuthorizationUri,
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
  authorizationUri: RegistryAuthorizationUri
}

export interface IRegistryEntryDetails {
  uri: EntryUri
  digest: HexString
  blob: string | null
  authorizationUri: RegistryAuthorizationUri
}

export interface IRegistryEntryStatus {
  uri: EntryUri
  digest: HexString
  blob: string | null
  authorizationUri: RegistryAuthorizationUri
  creatorUri: DidUri
  revoked: boolean
}
