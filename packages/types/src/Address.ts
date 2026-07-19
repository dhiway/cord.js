import type { HexString, Prefix } from './CompatTypes.js'
import type { KeyringPair } from './CompatKeyring.js'

export interface CordEncryptionKeypair {
  secretKey: Uint8Array
  publicKey: Uint8Array
  type: 'x25519'
}

export interface CordKeyringPair extends KeyringPair {
  address: `3${string}`
  type: Exclude<KeyringPair['type'], 'ethereum'>
}

/// A CORD-chain specific address.
export type CordAddress = CordKeyringPair['address']

export type EncodeAddress = (
  key: HexString | Uint8Array | string,
  ss58Format?: Prefix
) => string
