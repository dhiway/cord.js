import { BN } from '@cord.network/types'
import type {
  BalanceNumber,
  BalanceOptions,
  MetricPrefix,
} from '@cord.network/types'

export const WAY_UNIT = new BN(1)

export const Prefixes = new Map<MetricPrefix, number>([
  ['pico', -12],
  ['nano', -9],
  ['micro', -6],
  ['milli', -3],
  ['centi', -2],
  ['WAY', 0],
  ['kilo', 3],
  ['mega', 6],
  ['mill', 6],
  ['giga', 9],
  ['bill', 9],
  ['tera', 12],
  ['tril', 12],
  ['peta', 15],
  ['exa', 18],
  ['zetta', 21],
  ['yotta', 24],
])

function formatScaledValue(
  value: BN,
  decimals: number,
  locale?: string
): string {
  const divisor = new BN(10).pow(new BN(decimals))
  const integer = value.div(divisor).toString()
  const fraction = value.mod(divisor).toString().padStart(decimals, '0')
  const trimmedFraction = fraction.replace(/0+$/, '')
  const localizedInteger = new Intl.NumberFormat(locale).format(Number(integer))

  return trimmedFraction.length > 0
    ? `${localizedInteger}.${trimmedFraction}`
    : localizedInteger
}

function getDisplayUnit(
  value: BN,
  options: BalanceOptions
): [MetricPrefix, number] {
  const forced = options.forceUnit as MetricPrefix | undefined
  if (forced && Prefixes.has(forced)) {
    return [forced, Prefixes.get(forced) as number]
  }

  if (!options.withSi && !options.withSiFull) {
    return ['WAY', 0]
  }

  const ordered = [...Prefixes.entries()].sort((left, right) => left[1] - right[1])
  const absolute = value.abs()

  for (let index = ordered.length - 1; index >= 0; index -= 1) {
    const [prefix, power] = ordered[index]
    const threshold = new BN(10).pow(new BN(power + 12))
    if (!absolute.isZero() && absolute.gte(threshold)) {
      return [prefix, power]
    }
  }

  return ['WAY', 0]
}

/**
 * Formats the provided pico-WAY balance into a human-readable string.
 */
export function formatWayBalance(
  amount: BalanceNumber,
  additionalOptions: BalanceOptions = {}
): string {
  const value = new BN(balanceNumberToString(amount))
  const [prefix, power] = getDisplayUnit(value, additionalOptions)
  const decimals = 12 + power
  const formatted = formatScaledValue(value.abs(), decimals, additionalOptions.locale)
  const sign = value.isNeg() ? '-' : ''
  const unit = additionalOptions.withUnit === false ? '' : ` ${prefix === 'WAY' ? '' : prefix}${typeof additionalOptions.withUnit === 'string' ? additionalOptions.withUnit : 'WAY'}`

  return `${sign}${formatted}${unit}`.trim()
}

/**
 * Converts balance from WAY denomination to base unit.
 */
export function convertToTxUnit(balance: BN, power: number): BN {
  return new BN(balance).mul(new BN(10).pow(new BN(12 + power)))
}

export const TRANSACTION_FEE = convertToTxUnit(new BN(125), -9)

export function balanceNumberToString(input: BalanceNumber): string {
  if (typeof input === 'string') {
    if (!input.match(/^-?\d*\.?\d+$/)) {
      throw new Error('not a string representation of number')
    }
    return input
  }
  if (
    typeof input === 'number' ||
    typeof input === 'bigint' ||
    input instanceof BN
  ) {
    return input.toString()
  }
  throw new Error('could not convert to String')
}

/**
 * Converts the given [[BalanceNumber]] to the pico WAY equivalent.
 */
export function toPicoWay(
  input: BalanceNumber,
  unit: MetricPrefix = 'WAY'
): BN {
  const stringRepresentation = balanceNumberToString(input)

  if (!Prefixes.has(unit)) {
    throw new Error('Unknown metric prefix')
  }

  const unitVal = Prefixes.get(unit) as number
  const negative = stringRepresentation.startsWith('-')
  const [integer, fraction] = negative
    ? stringRepresentation.substring(1).split('.')
    : stringRepresentation.split('.')

  if (fraction && fraction.length > unitVal + 12) {
    throw new Error(
      `Too many decimal places: input with unit ${unit} and value ${stringRepresentation} exceeds the ${
        unitVal + 12
      } possible decimal places by ${fraction.length - unitVal + 12}`
    )
  }

  const fractionBN = fraction
    ? convertToTxUnit(new BN(fraction), unitVal - fraction.length)
    : new BN(0)
  const resultingBN = convertToTxUnit(new BN(integer), unitVal).add(fractionBN)

  return resultingBN.mul(new BN(negative ? -1 : 1))
}

/**
 * Converts the given [[BalanceNumber]] to a localized human-readable balance.
 */
export function fromPicoWay(
  input: BalanceNumber,
  decimals = 4,
  options: BalanceOptions = {}
): string {
  const inputBN = new BN(balanceNumberToString(input))
  const formatted = formatWayBalance(inputBN, { ...options, locale: 'en', withSiFull: true })
  const [number, ...rest] = formatted.split(' ')
  const localeNumber = new Intl.NumberFormat(options.locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(number))

  return `${localeNumber} ${rest.join(' ')}`.trim()
}
