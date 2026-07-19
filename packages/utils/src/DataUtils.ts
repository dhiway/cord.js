/* eslint-disable import/prefer-default-export */
/**
 * @packageDocumentation
 * @module DataUtils
 */

/**
 * Dummy comment needed for correct doc display, do not remove.
 */
import { isHex, checkAddress } from '@cord.network/types'
import type { CordAddress } from '@cord.network/types'
import * as SDKErrors from './SDKErrors.js'
import { ss58Format } from './ss58Format.js'

/**
 * @param obj
 * @param prefix
 */
export function flattenObject(
  obj: Record<string, any>,
  prefix = ''
): Record<string, any> {
  const flatObject: Record<string, any> = {}

  Object.keys(obj).forEach((key) => {
    const newKey = `${prefix}${key}`

    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      const deeper = flattenObject(obj[key], `${newKey}.`)
      Object.assign(flatObject, { [newKey]: obj[key] }, deeper)
    } else {
      flatObject[newKey] = obj[key]
    }
  })

  return flatObject
}

function extractKeyPartFromStatement(statement: string): string | null {
  try {
    const obj = JSON.parse(statement)
    const keys = Object.keys(obj)
    if (keys.length > 0) {
      // Always retain 'issuer' and 'holder'
      if (keys[0] === 'issuer' || keys[0] === 'holder') return keys[0]

      const parts = keys[0].split('#')
      return parts.length > 1 ? parts[1] : null
    }
    return null
  } catch (error) {
    return null // If parsing fails, return null
  }
}

/**
 * @param statements
 * @param selectedAttributes
 */
export function filterStatements(
  statements: string[],
  selectedAttributes: string[]
): string[] {
  return statements.filter((statement) => {
    const keyPart = extractKeyPartFromStatement(statement)
    if (!keyPart) return false // Omit if key extraction fails

    // Always include 'issuer' and 'holder'
    if (keyPart === 'issuer' || keyPart === 'holder') return true

    return selectedAttributes.includes(keyPart)
  })
}

// /**
//  *  Validates the format of the given blake2b hash via regex.
//  *
//  * @param hash Hash string to validate for correct Format.
//  * @param id
//  * @param name Contextual name of the address, e.g. "stream owner".
//  * @throws [[ERROR_HASH_TYPE]] when hash not of type string or of invalid Format.
//  *
//  * @returns Boolean whether the given hash string checks out against the Format.
//  */
// export function validateId(id: string, name: string): boolean {
//   if (typeof id !== 'string') {
//     throw new SDKErrors.IdentifierInvalidError(id)
//   }
//   if (!checkIdentifier(id)) {
//     throw new SDKErrors.IdentifierInvalidError(id)
//   }
//   return true
// }

/**
 * Verifies a given address string against the External Address Format (SS58) with our Prefix of 29.
 *
 * @param input Address string to validate for correct Format.
 */
export function verifyCordAddress(input: unknown): void {
  if (typeof input !== 'string') {
    throw new SDKErrors.AddressTypeError()
  }
  if (!checkAddress(input, ss58Format)[0]) {
    throw new SDKErrors.AddressInvalidError(input)
  }
}

/**
 * Type guard to check whether input is an SS58 address with our prefix of 29.
 *
 * @param input Address string to validate for correct format.
 * @returns True if input is a CordAddress, false otherwise.
 */
export function isCordAddress(input: unknown): input is CordAddress {
  try {
    verifyCordAddress(input)
    return true
  } catch {
    return false
  }
}

// Re-exported from the shared compatibility types package.

/**
 * Validates the format of a hex string via regex.
 *
 * @param input Hex string to validate for correct format.
 * @param bitLength Expected length of hex in bits.
 */
export function verifyIsHex(input: unknown, bitLength?: number): void {
  if (!isHex(input, bitLength)) {
    throw new SDKErrors.HashMalformedError(
      typeof input === 'string' ? input : undefined
    )
  }
}

/**
 * @param unixTime
 * @param timeZone
 */
export function convertUnixTimeToDateTime(
  unixTime: number,
  timeZone: string
): string {
  const date = new Date(unixTime)
  const options: Intl.DateTimeFormatOptions = {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  }

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date)
  // const milliseconds = date.getMilliseconds().toString().padStart(3, '0')

  // return `${formattedDate}.${milliseconds}`
  return `${formattedDate}`
}

/**
 * @param dateTimeStr
 */
export function convertDateTimeToUnixTime(dateTimeStr: string): number {
  // Note: The dateTimeStr format should match the output of convertUnixTimeToDateTime
  const date = new Date(dateTimeStr)

  return date.getTime()
}

/**
 * Trims a specified prefix from an input string and returns the remaining part.
 * If the prefix is not present, returns the original string.
 *
 * @param input - The input string to process (e.g., 'registry:cord:abcd').
 * @param prefix - The prefix to remove (e.g., 'registry:cord:').
 * @returns The string with the prefix removed (e.g., 'abcd'), or the original string if the prefix is not found.
 * @throws {Error} If the input or prefix is empty or not a string.
 * @example
 * trimPrefix('registry:cord:abcd', 'registry:cord:') // Returns 'abcd'
 * trimPrefix('did:cord:xyz', 'did:cord:') // Returns 'xyz'
 * trimPrefix('abcd', 'registry:cord:') // Returns 'abcd'
 */
export function trimPrefix(input: string, prefix: string): string {
  if (typeof input !== 'string' || typeof prefix !== 'string') {
    throw new Error('Input and prefix must be strings');
  }
  if (!input || !prefix) {
    throw new Error('Input and prefix cannot be empty');
  }
  if (input.startsWith(prefix)) {
    return input.slice(prefix.length);
  }
  return input;
}
