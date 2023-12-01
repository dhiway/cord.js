import type { KeyringPair } from '@polkadot/keyring/types'
import type { SubmittableExtrinsic } from '@polkadot/api/promise/types'
import type { BoxKeyPair } from 'tweetnacl'
import type { Index } from '@polkadot/types/interfaces'
import { AnyNumber } from '@polkadot/types/types'
import { HexString } from '@polkadot/util/types.js'

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
