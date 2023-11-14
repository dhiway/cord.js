import type { HexString } from '@polkadot/util/types'
import { base58Decode, base58Encode, blake2AsU8a } from '@polkadot/util-crypto'
import { assert, u8aConcat, u8aToU8a, stringToU8a } from '@polkadot/util'
import {
  IPublicIdentity,
  SCHEMA_PREFIX,
  SPACE_PREFIX,
  STATEMENT_PREFIX,
  SCORE_PREFIX,
  AUTHORIZATION_PREFIX,
  ACCOUNT_IDENTIFIER_PREFIX,
  SPACE_IDENT,
  SCHEMA_IDENT,
  STATEMENT_IDENT,
  SCORE_IDENTIFIER,
  AUTHORIZATION_IDENT,
} from '@cord.network/types'

const defaults = {
  allowedDecodedLengths: [1, 2, 4, 8, 32, 33],
  allowedEncodedLengths: [3, 4, 6, 10, 35, 36, 37, 38],
}

const IDFR_PREFIX = stringToU8a('CRDIDFR')

const VALID_IDENTS = new Set([
  SPACE_IDENT,
  SCHEMA_IDENT,
  STATEMENT_IDENT,
  SCORE_IDENTIFIER,
  AUTHORIZATION_IDENT,
])

const VALID_PREFIXES = [
  SPACE_PREFIX,
  SCHEMA_PREFIX,
  STATEMENT_PREFIX,
  SCORE_PREFIX,
  AUTHORIZATION_PREFIX,
  ACCOUNT_IDENTIFIER_PREFIX,
]

function pphash(key: Uint8Array): Uint8Array {
  return blake2AsU8a(u8aConcat(IDFR_PREFIX, key), 512)
}

/* eslint-disable no-bitwise */
function checkIdentifierChecksum(
  decoded: Uint8Array
): [boolean, number, number, number] {
  // Determine the length of the identifier (1 or 2 bytes based on the 7th bit)
  const iDfrLength = (decoded[0] & 0b0100_0000) !== 0 ? 2 : 1

  // Decode the identifier from the first 1 or 2 bytes
  let iDfrDecoded = decoded[0]
  if (iDfrLength === 2) {
    // Combine the bits from the first two bytes to form the identifier
    iDfrDecoded =
      ((decoded[0] & 0b0011_1111) << 2) |
      (decoded[1] >> 6) |
      ((decoded[1] & 0b0011_1111) << 8)
  }

  // Check if the length indicates a content hash (34/35 bytes + prefix)
  const isContentHash = [34 + iDfrLength, 35 + iDfrLength].includes(
    decoded.length
  )
  const length = decoded.length - (isContentHash ? 2 : 1)

  // Calculate the hash for checksum verification
  const hash = pphash(decoded.subarray(0, length))

  // Validate the checksum
  const isValid =
    (decoded[0] & 0b1000_0000) === 0 &&
    ![46, 47].includes(decoded[0]) &&
    (isContentHash
      ? decoded[decoded.length - 2] === hash[0] &&
        decoded[decoded.length - 1] === hash[1]
      : decoded[decoded.length - 1] === hash[0])

  return [isValid, length, iDfrLength, iDfrDecoded]
}

/* eslint-disable no-bitwise */
function encodeIdentifier(
  key: HexString | Uint8Array | string,
  iDPrefix: number
): string {
  assert(key, 'Invalid key string passed')

  // Decode the key to Uint8Array, allowing re-encoding of an identifier
  const u8a = u8aToU8a(key)

  // Validate the identifier prefix
  assert(
    iDPrefix >= 0 && iDPrefix <= 16383 && ![46, 47].includes(iDPrefix),
    'Out of range IdentifierFormat specified'
  )

  // Validate the length of the decoded key
  assert(
    defaults.allowedDecodedLengths.includes(u8a.length),
    () =>
      `Expected a valid key to convert, with length ${defaults.allowedDecodedLengths.join(
        ', '
      )}`
  )

  // Prepare the input with the identifier prefix
  const input = u8aConcat(
    iDPrefix < 64
      ? [iDPrefix]
      : [
          // eslint-disable-next-line no-bitwise
          ((iDPrefix & 0b0000_0000_1111_1100) >> 2) | 0b0100_0000,
          // eslint-disable-next-line no-bitwise
          (iDPrefix >> 8) | ((iDPrefix & 0b0000_0000_0000_0011) << 6),
        ],
    u8a
  )

  // Encode the input with base58, including the checksum
  return base58Encode(
    u8aConcat(
      input,
      pphash(input).subarray(0, [32, 33].includes(u8a.length) ? 2 : 1)
    )
  )
}

/**
 * @param identifier
 * @param digest
 * @param iDPrefix
 */
export function hashToIdentifier(
  digest: HexString | Uint8Array | string,
  iDPrefix: number
): string {
  assert(digest, 'Invalid digest')
  const id = encodeIdentifier(digest, iDPrefix)
  return id
}

/**
 * @param identifier
 * @param digest
 * @param iDPrefix
 * @param prefix
 */
export function hashToUri(
  digest: HexString | Uint8Array | string,
  iDPrefix: number,
  prefix: string
): string {
  assert(digest, 'Invalid digest')
  const id = encodeIdentifier(digest, iDPrefix)
  return `${prefix}${id}`
}

/**
 * @param identifier
 * @param digest
 * @param iDPrefix
 * @param prefix
 */
export function hashToElementUri(
  digest: HexString | Uint8Array | string,
  iDPrefix: number,
  prefix: string
): string {
  assert(digest, 'Invalid digest')
  const id = encodeIdentifier(digest, iDPrefix)
  return `${prefix}${id}:${digest}`
}

/**
 * @param identifier
 * @param uri
 */
export function uriToIdentifier(uri: string | null | undefined): string {
  console.log(uri)
  assert(uri, 'Invalid URI string passed')

  const foundPrefix = VALID_PREFIXES.find((prefix) => uri!.startsWith(prefix))
  if (foundPrefix) {
    return uri!.split(foundPrefix).join('')
  }

  throw new Error(`Invalid URI ${uri}`)
}

/**
 * @param address
 * @param identifier
 * @name checkIdentifier
 * @summary Validates an identifier.
 * @description
 * From the provided input, validate that the address is a valid input.
 */
export function checkIdentifier(
  identifier: HexString | string
): [boolean, string | null] {
  let decoded

  try {
    decoded = base58Decode(identifier)
  } catch (error) {
    return [false, (error as Error).message]
  }

  const [isValid, , , idfrDecoded] = checkIdentifierChecksum(decoded)

  if (VALID_IDENTS.has(idfrDecoded)) {
    if (!defaults.allowedEncodedLengths.includes(decoded.length)) {
      return [false, 'Invalid decoded identifier length']
    }
    return [isValid, isValid ? null : 'Invalid decoded identifier checksum']
  }

  return [false, `Prefix mismatch, found ${idfrDecoded}`]
}

/**
 * Creates Account Identifier from Fetches Account Address.
 *
 * @param address Account address to derive it's identifier.
 *
 * @returns The Address identifier from the Account Address.
 */
export function getAccountIdentifierFromAddress(
  address: IPublicIdentity['address']
): string {
  return address.startsWith(ACCOUNT_IDENTIFIER_PREFIX)
    ? address
    : ACCOUNT_IDENTIFIER_PREFIX + address
}

/**
 * Fetches Account Address from Identifier.
 *
 * @param address Account identifier to derive it's address from.
 * @throws When the identifier is not prefixed with the defined ACCOUNT_IDENTIFIER_PREFIX.
 * @throws [[ERROR_INVALID_ID_PREFIX]].
 *
 * @returns The Address derived from the Account Identifier.
 */
export function getAccountAddressFromIdentifier(
  address: string
): IPublicIdentity['address'] {
  return address.split(ACCOUNT_IDENTIFIER_PREFIX).join('')
}
