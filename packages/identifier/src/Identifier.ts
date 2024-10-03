/**
 * @packageDocumentation
 * @module Identifier
 * @preferred
 *
 * The `Identifier` module in the CORD SDK provides a collection of functions to handle, transform, and validate
 * different types of identifiers used within the CORD blockchain ecosystem. These identifiers include account addresses,
 * statement URIs, and digest strings, among others. The module ensures that these identifiers conform to specific
 * formats and standards required for correct operation and integration with the CORD blockchain.
 *
 * Key functionalities:
 * - Transforming and validating identifiers and URIs.
 * - Converting between different identifier formats.
 * - Generating unique identifiers from digests and other inputs.
 * - Ensuring consistency and correctness in the format of blockchain-related identifiers.
 *
 * This module plays a crucial role in maintaining the integrity and standardization of identifiers across various
 * operations and transactions in the CORD blockchain. It provides essential utilities for developers working with
 * blockchain data, enabling them to focus on core functionalities while relying on this module for identifier management.
 *
 * Example usage:
 * ```typescript
 * import { uriToStatementIdAndDigest, elementUriToStatementUri } from 'identifier-module-path';
 *
 * // Convert an element URI to a statement URI
 * const elementUri = 'stmt:cord:1234:abcd';
 * const statementUri = elementUriToStatementUri(elementUri);
 * console.log('Statement URI:', statementUri);
 *
 * // Extract identifier and digest from a statement URI
 * const extracted = uriToStatementIdAndDigest(statementUri);
 * console.log('Extracted Identifier:', extracted.identifier);
 * console.log('Extracted Digest:', extracted.digest);
 * ```
 *
 * The `Identifier` module is an integral part of the CORD SDK, offering reliable and standardized procedures for
 * handling identifiers, ensuring seamless interoperability and consistent data management within the blockchain environment.
 */

import type {
  HexString,
  StatementDigest,
  StatementUri,
} from '@cord.network/types'
import {
  base58Decode,
  base58Encode,
  blake2AsU8a,
  IPublicIdentity,
  SCHEMA_PREFIX,
  SPACE_PREFIX,
  STATEMENT_PREFIX,
  RATING_PREFIX,
  ASSET_PREFIX,
  AUTH_PREFIX,
  ACCOUNT_IDENT,
  ACCOUNT_PREFIX,
  SPACE_IDENT,
  SCHEMA_IDENT,
  STATEMENT_IDENT,
  RATING_IDENT,
  ASSET_IDENT,
  ASSET_INSTANCE_IDENT,
  AUTH_IDENT,
  assert,
  u8aConcat,
  u8aToU8a,
  stringToU8a,
  REGISTRY_IDENT,
  REGISTRY_PREFIX,
  REGISTRYAUTH_IDENT,
  REGISTRYAUTH_PREFIX,
} from '@cord.network/types'
import { SDKErrors } from '@cord.network/utils'

const defaults = {
  allowedDecodedLengths: [1, 2, 4, 8, 32, 33],
  allowedEncodedLengths: [3, 4, 6, 10, 35, 36, 37, 38],
}

const IDFR_PREFIX = stringToU8a('CRDIDFR')

const VALID_IDENTS = new Set([
  SPACE_IDENT,
  SCHEMA_IDENT,
  STATEMENT_IDENT,
  RATING_IDENT,
  AUTH_IDENT,
  ACCOUNT_IDENT,
  ASSET_IDENT,
  ASSET_INSTANCE_IDENT,
  REGISTRY_IDENT,
  REGISTRYAUTH_IDENT,
])

const VALID_PREFIXES = [
  SPACE_PREFIX,
  SCHEMA_PREFIX,
  STATEMENT_PREFIX,
  RATING_PREFIX,
  AUTH_PREFIX,
  ACCOUNT_PREFIX,
  ASSET_PREFIX,
  REGISTRY_PREFIX,
  REGISTRYAUTH_PREFIX,
]

const IDENT_TO_PREFIX_MAP = new Map([
  [SPACE_IDENT, SPACE_PREFIX],
  [SCHEMA_IDENT, SCHEMA_PREFIX],
  [STATEMENT_IDENT, STATEMENT_PREFIX],
  [RATING_IDENT, RATING_PREFIX],
  [AUTH_IDENT, AUTH_PREFIX],
  [ACCOUNT_IDENT, ACCOUNT_PREFIX],
  [ASSET_IDENT, ASSET_PREFIX],
  [ASSET_INSTANCE_IDENT, ASSET_PREFIX],
  [REGISTRY_IDENT, REGISTRY_PREFIX],
  [REGISTRYAUTH_IDENT, REGISTRYAUTH_PREFIX]
])

/**
 * Performs a post-processed hash on a given key.
 *
 * @remarks
 * This function applies the Blake2 hashing algorithm to a concatenated array of a predefined prefix and the input key.
 * The output is a 512-bit hash, used for various cryptographic and data integrity checks.
 *
 * @param key - The input data to be hashed, represented as a Uint8Array.
 * @returns A Uint8Array representing the 512-bit hash of the input key.
 *
 * @internal
 */
function pphash(key: Uint8Array): Uint8Array {
  return blake2AsU8a(u8aConcat(IDFR_PREFIX, key), 512)
}

/**
 * Checks the checksum and decodes information from a given identifier.
 *
 * @remarks
 * This function decodes and validates an identifier, extracting information such as the identifier length,
 * its decoded value, and whether it represents a content hash. It also verifies the integrity of the identifier
 * using a checksum validation process.
 *
 * @param decoded - The decoded identifier represented as a Uint8Array.
 * @returns A tuple containing the validity of the identifier, its length, the identifier length, and its decoded value.
 *
 * @internal
 */
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

/**
 * Encodes a given key with a specified identifier prefix into a base58 encoded string.
 *
 * @remarks
 * This function encodes a provided key (in various formats) using a given identifier prefix, and then
 * converts it into a base58 encoded string with an appended checksum. The identifier prefix is
 * incorporated into the encoding to differentiate between various types of data.
 *
 * @param key - The key to be encoded, which can be a hex string, Uint8Array, or a regular string.
 * @param iDPrefix - The identifier prefix, a number that must be within the range of 0 to 16383 and
 *        not equal to 46 or 47. This prefix is used to classify the type of data being encoded.
 * @returns A base58 encoded string representing the encoded key with the identifier prefix and checksum.
 *
 * @throws Assert errors if the key is invalid, the identifier prefix is out of range, or the key's
 *         length is not within the allowed decoded lengths.
 *
 * @internal
 */
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
 * Converts a digest to a unique identifier using a specified identifier prefix.
 *
 * @param digest - The input digest to be encoded, which can be a hex string, Uint8Array, or a regular string.
 * @param iDPrefix - The identifier prefix, a numerical value used to classify the type of data being encoded.
 * @returns A string representing the encoded identifier.
 *
 * @example
 * ```typescript
 * const digest = '0x1234...'; // Hex string or Uint8Array or regular string
 * const identifier = hashToIdentifier(digest, 29);
 * console.log('Identifier:', identifier);
 * ```
 *
 * @throws Assert error if the digest is invalid.
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
 * Converts a digest to a URI using a specified identifier prefix and a predefined prefix string.
 *
 * @param digest - The input digest to be encoded.
 * @param iDPrefix - The identifier prefix, used to classify the type of data being encoded.
 * @param prefix - A predefined string prefix to be appended before the encoded identifier.
 * @returns A string representing the URI constructed from the digest and identifier prefix.
 *
 * @example
 * ```typescript
 * const digest = '0x1234...';
 * const uri = hashToUri(digest, 29, 'example:');
 * console.log('URI:', uri);
 * ```
 *
 * @throws Assert error if the digest is invalid.
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
 * Converts a digest to an element URI using a specified identifier prefix and a predefined prefix string.
 *
 * @param digest - The input digest to be encoded.
 * @param iDPrefix - The identifier prefix, used to classify the type of data being encoded.
 * @param prefix - A predefined string prefix to be appended before the encoded identifier and digest.
 * @returns A string representing the element URI constructed from the digest, identifier prefix, and predefined prefix.
 *
 * @example
 * ```typescript
 * const digest = '0x1234...';
 * const elementUri = hashToElementUri(digest, 42, 'element:');
 * console.log('Element URI:', elementUri);
 * ```
 *
 * @throws Assert error if the digest is invalid.
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
 * Validates an identifier by decoding and checking its integrity.
 *
 * @remarks
 * This function takes an identifier, typically encoded in base58 format, and performs a series of checks to validate it.
 * These checks include decoding the identifier, verifying its checksum, length, and prefix against predefined standards.
 *
 * @param identifier - The identifier to be validated, provided as a HexString or a regular string.
 * @returns A tuple where the first element is a boolean indicating the validity of the identifier,
 *          and the second element is a string containing an error message if the identifier is invalid.
 *
 * @example
 * ```typescript
 * const identifier = 'base58EncodedIdentifier';
 * const [isValid, error] = checkIdentifier(identifier);
 * if (isValid) {
 *   console.log('Identifier is valid');
 * } else {
 *   console.error('Invalid identifier:', error);
 * }
 * ```
 *
 * @description
 * The function attempts to decode the given identifier from its base58 format. If the decoding fails,
 * it returns false along with the error message. It then checks the identifier's checksum, length, and prefix.
 * If these checks pass, the function confirms the identifier's validity. Otherwise, it returns false with an
 * appropriate error message describing the failure reason.
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
 * Validates the format and structure of an identifier, checking its prefix and overall validity.
 *
 * @remarks
 * This function assesses whether the provided input is a valid identifier, conforming to specific format and encoding rules.
 * It checks if the input starts with any known valid prefixes and, if found, strips the prefix before further validation.
 * The function then employs `checkIdentifier` to perform a comprehensive validation of the identifier.
 *
 * @param input - The identifier to be validated, provided as a HexString or a regular string.
 * @returns A tuple where the first element is a boolean indicating the overall validity of the identifier,
 *          and the second element is a string containing an error message if the identifier is invalid.
 *
 * @example
 * ```typescript
 * const input = 'prefix1234Base58EncodedString';
 * const [isValid, error] = isValidIdentifier(input);
 * if (isValid) {
 *   console.log('Valid identifier');
 * } else {
 *   console.error('Invalid identifier:', error);
 * }
 * ```
 *
 * @description
 * The function first checks if the input begins with any known valid prefixes, such as specific string constants
 * that might denote the type or category of the identifier. If such a prefix is found, it is removed from the input.
 * The sanitized input (without the prefix) is then passed to `checkIdentifier` for detailed validation, including
 * base58 decoding and checksum verification. The result of this validation process is returned, indicating whether
 * the input is a valid identifier and providing details about any detected errors.
 */
export function isValidIdentifier(
  input: HexString | string
): [boolean, string | null] {
  let identifier = input
  const foundPrefix = VALID_PREFIXES.find((prefix) => input.startsWith(prefix))
  if (foundPrefix) {
    identifier = input.split(foundPrefix).join('')
  }
  const [isValid, errorMessage] = checkIdentifier(identifier)

  return [isValid, errorMessage]
}

/**
 * Converts a URI to a valid identifier by checking its format and stripping known prefixes.
 *
 * @remarks
 * This function processes a URI and transforms it into a valid identifier. It validates the URI's format,
 * checks for known prefixes, and ensures the resulting string conforms to identifier standards.
 *
 * @param uri - The URI to be converted into an identifier. Can be a string, null, or undefined.
 * @returns The validated identifier as a string.
 *
 * @example
 * ```typescript
 * const uri = 'prefix:identifierString';
 * try {
 *   const identifier = uriToIdentifier(uri);
 *   console.log('Valid Identifier:', identifier);
 * } catch (error) {
 *   console.error('Error:', error);
 * }
 * ```
 *
 * @throws {SDKErrors.InvalidURIError} If the input is not a string or is empty.
 * @throws {SDKErrors.InvalidIdentifierError} If the processed identifier is invalid, with a detailed error message.
 *
 * @description
 * The function first checks if the input is a valid string. If not, it throws an `InvalidURIError`. It then
 * searches for known valid prefixes in the URI. If found, these prefixes are removed, leaving only the core identifier.
 * This identifier is then validated using `checkIdentifier`, ensuring it adheres to the required format and checksum rules.
 * If validation fails, an `InvalidIdentifierError` is thrown, indicating the specific reason for the failure.
 */
export function uriToIdentifier(uri: string | null | undefined): string {
  if (typeof uri !== 'string' || !uri) {
    throw new SDKErrors.InvalidURIError('URI must be a non-empty string.')
  }

  let identifier = uri
  const foundPrefix = VALID_PREFIXES.find((prefix) => uri.startsWith(prefix))
  if (foundPrefix) {
    identifier = uri.split(foundPrefix).join('')
  }
  const [isValid, errorMessage] = checkIdentifier(identifier)
  if (!isValid) {
    throw new SDKErrors.InvalidIdentifierError(
      errorMessage || `Invalid identifier: ${uri}`
    )
  }

  return identifier
}

/**
 * Transforms a given identifier into a URI by appending a relevant prefix, if necessary.
 *
 * @remarks
 * This function takes a string identifier, validates it, and converts it into a URI by appending a suitable prefix.
 * It also checks if the identifier already has a valid prefix and, if so, returns it unchanged.
 *
 * @param identifier - The identifier string to be transformed into a URI.
 * @returns A string representing the URI constructed from the identifier.
 *
 * @example
 * ```typescript
 * const identifier = 'base58EncodedIdentifier';
 * try {
 *   const uri = identifierToUri(identifier);
 *   console.log('URI:', uri);
 * } catch (error) {
 *   console.error('Error:', error);
 * }
 * ```
 *
 * @throws Error if the input is not a non-empty string, if the identifier's checksum is invalid,
 *        if the identifier is unrecognized, or if there is an error during decoding.
 *
 * @description
 * The function first checks if the input is a valid non-empty string. If the identifier already starts with a known
 * prefix, it is returned as is. Otherwise, the function decodes the identifier and checks its checksum. If valid, it
 * retrieves the corresponding prefix for the identifier from a mapping. An error is thrown if the checksum is invalid,
 * the prefix is not found, or there's an issue in decoding. The function then concatenates the prefix and identifier
 * to form the URI and returns it.
 */
export function identifierToUri(identifier: string): string {
  if (typeof identifier !== 'string' || identifier.length === 0) {
    throw new Error('Input must be a non-empty string.')
  }
  // Check if the input is already a URI
  const existingPrefix = VALID_PREFIXES.find((prefix) =>
    identifier.startsWith(prefix)
  )
  if (existingPrefix !== undefined) {
    return identifier // Return as is, since it's already a URI
  }

  // Attempt to decode the identifier and extract the prefix
  let decoded
  let ident
  try {
    decoded = base58Decode(identifier)
    const [isValid, , , idfrDecoded] = checkIdentifierChecksum(decoded)
    if (!isValid) {
      throw new Error('Invalid decoded identifier checksum')
    }

    ident = idfrDecoded
    const prefix = IDENT_TO_PREFIX_MAP.get(ident)
    if (!prefix) {
      throw new Error(`Invalid or unrecognized identifier: ${ident}`)
    }

    // Construct and return the URI
    return `${prefix}${identifier}`
  } catch (error) {
    throw new Error(`Error decoding identifier: ${(error as Error).message}`)
  }
}

/**
 * Creates an account identifier from a given account address.
 *
 * @remarks
 * This function takes an account address and appends a predefined prefix (if not already present)
 * to generate a standardized account identifier. It ensures that all account identifiers
 * have a consistent format.
 *
 * @param address - The account address used to derive the identifier.
 * @returns The account identifier, which is the address prefixed with a standard identifier prefix.
 *
 * @example
 * ```typescript
 * const accountAddress = '0x1234...';
 * const identifier = getAccountIdentifierFromAddress(accountAddress);
 * console.log('Account Identifier:', identifier);
 * ```
 */
export function getAccountIdentifierFromAddress(
  address: IPublicIdentity['address']
): string {
  return address.startsWith(ACCOUNT_PREFIX) ? address : ACCOUNT_PREFIX + address
}

/**
 * Derives an account address from a given account identifier.
 *
 * @remarks
 * This function extracts the actual account address from an identifier by removing the standard prefix.
 * It assumes that the identifier begins with a predefined prefix and strips it to retrieve the original address.
 *
 * @param address - The account identifier from which to derive the address.
 * @returns The original account address, derived by removing the standard prefix from the identifier.
 *
 * @example
 * ```typescript
 * const accountIdentifier = 'prefix0x1234...';
 * try {
 *   const accountAddress = getAccountAddressFromIdentifier(accountIdentifier);
 *   console.log('Account Address:', accountAddress);
 * } catch (error) {
 *   console.error('Error:', error);
 * }
 * ```
 *
 * @throws Error if the identifier does not start with the defined `ACCOUNT_PREFIX`.
 * @throws [[ERROR_INVALID_ID_PREFIX]] if the identifier prefix is invalid.
 */
export function getAccountAddressFromIdentifier(
  address: string
): IPublicIdentity['address'] {
  return address.split(ACCOUNT_PREFIX).join('')
}

/**
 * Constructs a statement URI from given hexadecimal string digests.
 *
 * @remarks
 * This function generates a standardized URI for a statement by combining a hashed identifier digest
 * and another digest. The identifier digest is first converted to a URI with a specific prefix, and
 * then concatenated with the sliced second digest to form the complete statement URI.
 *
 * @param idDigest - A hexadecimal string representing the identifier digest. Must start with '0x'.
 * @param digest - Another hexadecimal string representing the statement's content digest. Must also start with '0x'.
 * @returns A `StatementUri` representing the combined URI for the statement.
 *
 * @example
 * ```typescript
 * const idDigest = '0x1234...';
 * const digest = '0xabcd...';
 * const statementUri = buildStatementUri(idDigest, digest);
 * console.log('Statement URI:', statementUri);
 * ```
 *
 * @throws {SDKErrors.InvalidInputError} If either `idDigest` or `digest` does not start with '0x'.
 *
 * @description
 * The function first checks if both input parameters start with '0x' as required for hexadecimal digests.
 * It then uses the `hashToUri` function to convert `idDigest` to a URI with a specified identifier and prefix.
 * The `digest` is then sliced to remove its '0x' prefix and concatenated with the identifier URI to form
 * the final statement URI, which is returned as a `StatementUri` type.
 */
export function buildStatementUri(
  idDigest: HexString,
  digest: HexString
): StatementUri {
  if (!digest.startsWith('0x') || !idDigest.startsWith('0x')) {
    throw new SDKErrors.InvalidInputError('Digest must start with 0x')
  }
  const prefix = hashToUri(idDigest, STATEMENT_IDENT, STATEMENT_PREFIX)
  const suffix = digest.slice(2)

  const statementUri = `${prefix}:${suffix}` as StatementUri
  return statementUri
}

/**
 * Updates the digest component of a given statement URI with a new digest.
 *
 * @remarks
 * This function modifies an existing statement URI by replacing its digest with a new provided digest.
 * It ensures that the URI retains its original structure and prefix, while only the digest part is updated.
 *
 * @param stmtUri - The original statement URI that needs to be updated. It should follow the format 'stmt:cord:<identifier>:<digest>'.
 * @param digest - The new hexadecimal string digest to be inserted into the statement URI. Must start with '0x'.
 * @returns The updated statement URI, now containing the new digest.
 *
 * @example
 * ```typescript
 * const originalUri = 'stmt:cord:1234:abcd';
 * const newDigest = '0x5678...';
 * const updatedUri = updateStatementUri(originalUri, newDigest);
 * console.log('Updated Statement URI:', updatedUri);
 * ```
 *
 * @throws {SDKErrors.InvalidIdentifierError} If the `stmtUri` does not follow the expected format.
 * @throws {SDKErrors.InvalidInputError} If the new `digest` does not start with '0x'.
 *
 * @description
 * The function first splits the original `stmtUri` and verifies its structure, ensuring it has the correct prefix ('stmt:cord').
 * If the format is invalid, it throws an `InvalidIdentifierError`. It then checks if the new `digest` starts with '0x',
 * throwing an `InvalidInputError` if it doesn't. After validation, it constructs the updated URI using the unchanged parts
 * from the original URI and the new digest (with the '0x' prefix removed). This updated URI is then returned.
 */
export function updateStatementUri(
  stmtUri: StatementUri,
  digest: HexString
): StatementUri {
  const parts = stmtUri.split(':')

  if (parts[0] !== 'stmt' || parts[1] !== 'cord') {
    throw new SDKErrors.InvalidIdentifierError('Invalid statementUri format')
  }

  if (!digest.startsWith('0x')) {
    throw new SDKErrors.InvalidInputError('Digest must start with 0x')
  }
  const suffix = digest.slice(2)

  const statementUri = `stmt:cord:${parts[2]}:${suffix}` as StatementUri
  return statementUri
}

/**
 * Extracts the statement identifier and digest from a given statement URI.
 *
 * @remarks
 * This function parses a statement URI and separates it into its constituent identifier and digest components.
 * It expects the URI to conform to a specific format and structure.
 *
 * @param statementUri - The statement URI to be parsed. Expected format: 'stmt:cord:<identifier>:<digest>'.
 * @returns An object containing the extracted identifier and digest from the statement URI.
 *
 * @example
 * ```typescript
 * const statementUri = 'stmt:cord:1234:abcd';
 * const { identifier, digest } = uriToStatementIdAndDigest(statementUri);
 * console.log('Identifier:', identifier, 'Digest:', digest);
 * ```
 *
 * @throws {SDKErrors.InvalidIdentifierError} If the `statementUri` does not follow the expected format.
 *
 * @description
 * The function splits the `statementUri` string by the colon (:) delimiter and checks if it conforms to the expected format.
 * If the format is valid, it extracts the identifier and suffix (digest) parts. The digest is then prefixed with '0x' to form
 * the correct statement digest. The function returns an object containing both the identifier and the formatted digest.
 */
export function uriToStatementIdAndDigest(statementUri: StatementUri): {
  identifier: string
  digest: StatementDigest
} {
  const parts = statementUri.split(':')

  if (parts.length !== 4 || parts[0] !== 'stmt' || parts[1] !== 'cord') {
    throw new SDKErrors.InvalidIdentifierError('Invalid statementUri format')
  }

  const identifier = parts[2]
  const suffix = parts[3]

  const digest = `0x${suffix}` as StatementDigest

  return { identifier, digest }
}

/**
 * Converts a given element URI to a statement URI.
 *
 * @remarks
 * This function processes an element URI and reformats it to construct a corresponding statement URI.
 * It expects the element URI to follow a specific format and extracts the relevant part to create the statement URI.
 *
 * @param statementUri - The element URI to be converted. Expected format: 'stmt:cord:<identifier>:<digest>'.
 * @returns A statement URI derived from the element URI, excluding the digest component.
 *
 * @example
 * ```typescript
 * const elementUri = 'stmt:cord:1234:abcd';
 * const statementId = elementUriToStatementUri(elementUri);
 * console.log('Statement URI:', statementId);
 * ```
 *
 * @throws {SDKErrors.InvalidIdentifierError} If the `statementUri` does not conform to the required format.
 *
 * @description
 * The function splits the `statementUri` and validates its structure against the expected format. If valid, it
 * constructs a new statement URI using only the 'stmt:cord:<identifier>' part, effectively discarding the digest part.
 * The new statement URI is then returned.
 */
export function elementUriToStatementUri(
  statementUri: StatementUri
): StatementUri {
  const parts = statementUri.split(':')

  if (parts.length !== 4 || parts[0] !== 'stmt' || parts[1] !== 'cord') {
    throw new SDKErrors.InvalidIdentifierError('Invalid statementUri format')
  }

  const identifier = parts[2]
  const statementId = `stmt:cord:${identifier}` as StatementUri

  return statementId
}
