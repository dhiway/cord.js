import type { KeyringPair } from './CompatKeyring.js'
import type { BoxKeyPair } from 'tweetnacl'
import type { AnyNumber, HexString, Index } from './CompatTypes.js'
import type { SubmittableExtrinsic } from './PolkadotApiCompat.js'

export const ACCOUNT_IDENT = 29
export const ACCOUNT_PREFIX = 'id:cord:'

export interface IIdentity {
  readonly signKeyringPair: KeyringPair
  readonly seed: Uint8Array
  readonly seedAsHex: string
  readonly signPublicKeyAsHex: string
  readonly boxKeyPair: BoxKeyPair
  address: KeyringPair['address']
  serviceAddress?: string
  signSubmittableExtrinsic(
    submittableExtrinsic: SubmittableExtrinsic,
    nonce: AnyNumber | Index,
    tip?: AnyNumber
  ): Promise<SubmittableExtrinsic>
}

export interface SignProps {
  txSignature: string
  txHash: HexString
}
