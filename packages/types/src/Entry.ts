import { HexString } from './Imported.js'
import { 
  RegistryId
} from './Registry.js'

export const ENTRY_PREFIX = 'entry:cord:';
export type EntryId = string;
export type EntryDigest = HexString;
export type EntryUri = `${typeof ENTRY_PREFIX}${string}`;

export interface IRegistryEntry {
  tx_hash: HexString
  blob: string | null
  registryId: RegistryId
}

export interface IRegistryEntryUpdate {
  tx_hash: HexString
  blob: string | null
  registryId: RegistryId
  registryEntryId: EntryId
}

export interface IRegistryEntryDetails {
  registryEntryId: EntryId
  tx_hash: HexString
  blob: string | null
  registryId: RegistryId
}

export interface IRegistryEntryStatus {
  registryEntryId: EntryId
  tx_hash: HexString
  blob: string | null
  registryId: RegistryId
  creatorAddress: string
  revoked: boolean
}

export interface IRegistryEntryChainStorage {
    registryEntryId: EntryId
    tx_hash: HexString
    revoked: boolean
    creator: string
    registryId: RegistryId
}
