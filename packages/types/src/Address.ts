import type { Prefix } from '@polkadot/util-crypto/address/types'
import type { HexString } from '@polkadot/util/types'
import '@polkadot/keyring' // TS needs this for the augmentation below
import type { KeyringPair } from './index.js'

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

declare module '@polkadot/keyring' {
  function encodeAddress(
    key: HexString | Uint8Array | string,
    ss58Format?: Prefix
  ): string
  function encodeAddress(
    key: HexString | Uint8Array | string,
    ss58Format?: 29
  ): CordAddress
}
