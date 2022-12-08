import type { BN } from '@polkadot/util'
import { AnyNumber } from '@polkadot/types/types/codec'

export type Balances = {
  free: BN
  reserved: BN
  miscFrozen: BN
  feeFrozen: BN
}

// Extracted options from polkadot/util
export interface BalanceOptions {
  decimals?: number
  forceUnit?: string
  withSi?: boolean
  withSiFull?: boolean
  withUnit?: boolean | string
  locale?: string
}

export type BalanceNumber = Exclude<AnyNumber, Uint8Array>

export type MetricPrefix =
  | 'pico'
  | 'nano'
  | 'micro'
  | 'milli'
  | 'centi'
  | 'WAY'
  | 'kilo'
  | 'mega'
  | 'mill'
  | 'giga'
  | 'bill'
  | 'tera'
  | 'tril'
  | 'peta'
  | 'exa'
  | 'zetta'
  | 'yotta'
