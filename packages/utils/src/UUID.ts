/**
 * Universally unique identifiers (UUIDs) are needed in CORD to uniquely identify specific information.
 *
 * UUIDs are used for example in [[RequestForMark]] to generate hashes.
 *
 * @packageDocumentation
 * @module UUID
 */

import { v4 as uuid } from 'uuid'
import { hashStr } from './Crypto.js'

/**
 * Generates a H256 compliant UUID.
 *
 * @returns The hashed uuid.
 */
export function generateHex(): string {
  return hashStr(uuid())
}

/**
 * Generates a v4 UUID.
 *
 * @returns The v4 uuid.
 */
export function generate(): string {
  return uuid()
}
