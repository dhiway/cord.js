/**
 * @packageDocumentation
 * @module BalanceUtils
 */

import { BN } from '@polkadot/util'
import { formatBalance } from '@polkadot/util'
import type { BalanceOptions } from '@cord.network/api-types'

export const WAY_UNIT = new BN(1)

export function formatWayBalance(
  amount: BN,
  additionalOptions?: BalanceOptions
): string {
  const options = {
    decimals: 12,
    withSiFull: true,
    withUnit: 'WAY',
    ...additionalOptions,
  }
  return formatBalance(amount, options)
}

export function convertToTxUnit(balance: BN, power: number): BN {
  return new BN(balance).mul(new BN(10).pow(new BN(12 + power)))
}

export function asFemtoWay(balance: BN): BN {
  return convertToTxUnit(balance, 0)
}

export const TRANSACTION_FEE = convertToTxUnit(new BN(1), 0)

export default {
  WAY_UNIT,
  TRANSACTION_FEE,
  formatWayBalance,
  asFemtoWay,
  convertToTxUnit,
}
