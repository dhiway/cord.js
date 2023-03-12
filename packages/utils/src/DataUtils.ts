/* eslint-disable import/prefer-default-export */
/**
 * @packageDocumentation
 * @module DataUtils
 */

/**
 * Dummy comment needed for correct doc display, do not remove.
 */
import { isHex } from '@polkadot/util'
import type { CordAddress } from '@cord.network/types'
import { checkAddress } from '@polkadot/util-crypto'
import * as SDKErrors from './SDKErrors.js'
import { checkIdentifier } from './Identifier.js'
import { ss58Format } from './ss58Format.js'

/**
 *  Validates the format of the given blake2b hash via regex.
 *
 * @param hash Hash string to validate for correct Format.
 * @param name Contextual name of the address, e.g. "stream owner".
 * @throws [[ERROR_HASH_TYPE]] when hash not of type string or of invalid Format.
 *
 * @returns Boolean whether the given hash string checks out against the Format.
 */
export function validateId(id: string, name: string): boolean {
  if (typeof id !== 'string') {
    throw new SDKErrors.IdentifierInvalidError(id)
  }
  if (!checkIdentifier(id)) {
    throw new SDKErrors.IdentifierInvalidError(id)
  }
  return true
}

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

// re-exporting isHex
export { isHex } from '@polkadot/util'

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
