import { HexString } from './Imported.js'
import { DidUri }  from './DidDocument.js'
import { 
  RegistryUri
} from './Registry.js'

export const ENTRY_PREFIX = 'entry:cord:';
export type EntryUri = `${typeof ENTRY_PREFIX}${string}`;
export type EntryId = string;
export type EntryDigest = HexString;

export interface IRegistryEntry {
  tx_hash: HexString
  blob: string | null
  registryUri: RegistryUri
}

export interface IRegistryEntryUpdate {
  tx_hash: HexString
  blob: string | null
  registryUri: RegistryUri
  registryEntryUri: EntryUri
}

export interface IRegistryEntryDetails {
  uri: EntryUri
  tx_hash: HexString
  blob: string | null
  registryUri: RegistryUri
}

export interface IRegistryEntryStatus {
  uri: EntryUri
  tx_hash: HexString
  blob: string | null
  registryUri: RegistryUri
  creatorUri: DidUri
  revoked: boolean
}

export interface IRegistryEntryChainStorage {
    uri: EntryUri
    tx_hash: HexString
    revoked: boolean
    creatorUri: DidUri
    registryUri: RegistryUri
}
