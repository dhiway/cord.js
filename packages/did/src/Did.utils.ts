import { blake2AsU8a, encodeAddress } from '@polkadot/util-crypto'

import {
  DidResourceUri,
  DidUri,
  DidVerificationKey,
  CordAddress,
  UriFragment,
} from '@cord.network/types'
import { DataUtils, SDKErrors, ss58Format } from '@cord.network/utils'

// The latest version for DIDs.
const DID_LATEST_VERSION = 1

// NOTICE: The following regex patterns must be kept in sync with DidUri type in @cord.network/types

// Matches the following DIDs
// - did:cord:<cord_address>
// - did:cord:<cord_address>#<fragment>
const CORD_DID_REGEX =
  /^did:cord:(?<address>3[1-9a-km-zA-HJ-NP-Z]{47})(?<fragment>#[^#\n]+)?$/

type IDidParsingResult = {
  did: DidUri
  version: number
  type: 'full'
  address: CordAddress
  fragment?: UriFragment
  authKeyTypeEncoding?: string
  encodedDetails?: string
}

/**
 * Parses a CORD DID uri and returns the information contained within in a structured form.
 *
 * @param didUri A CORD DID uri as a string.
 * @returns Object containing information extracted from the DID uri.
 */
export function parse(didUri: DidUri | DidResourceUri): IDidParsingResult {
  const matches = CORD_DID_REGEX.exec(didUri)?.groups

  if (matches) {
    const { version: versionString, fragment } = matches
    const address = matches.address as CordAddress
    const version = versionString
      ? parseInt(versionString, 10)
      : DID_LATEST_VERSION
    return {
      did: didUri.replace(fragment || '', '') as DidUri,
      version,
      type: 'full',
      address,
      fragment: fragment === '#' ? undefined : (fragment as UriFragment),
    }
  }

  throw new SDKErrors.InvalidDidFormatError(didUri)
}

/**
 * Returns true if both didA and didB refer to the same DID subject, i.e., whether they have the same identifier as specified in the method spec.
 *
 * @param didA A CORD DID uri as a string.
 * @param didB A second CORD DID uri as a string.
 * @returns Whether didA and didB refer to the same DID subject.
 */
export function isSameSubject(didA: DidUri, didB: DidUri): boolean {
  return parse(didA).address === parse(didB).address
}

export type EncodedVerificationKey =
  | { sr25519: Uint8Array }
  | { ed25519: Uint8Array }
  | { ecdsa: Uint8Array }

export type EncodedEncryptionKey = { x25519: Uint8Array }

export type EncodedKey = EncodedVerificationKey | EncodedEncryptionKey

export type EncodedSignature = EncodedVerificationKey

/**
 * Checks that a string (or other input) is a valid CORD DID uri with or without a URI fragment.
 * Throws otherwise.
 *
 * @param input Arbitrary input.
 * @param expectType `ResourceUri` if the URI is expected to have a fragment (following '#'), `Did` if it is expected not to have one. Default allows both.
 */
export function validateUri(
  input: unknown,
  expectType?: 'Did' | 'ResourceUri'
): void {
  if (typeof input !== 'string') {
    throw new TypeError(`DID string expected, got ${typeof input}`)
  }
  const { address, fragment } = parse(input as DidUri)

  if (
    fragment &&
    (expectType === 'Did' ||
      // for backwards compatibility with previous implementations, `false` maps to `Did` while `true` maps to `undefined`.
      (typeof expectType === 'boolean' && expectType === false))
  ) {
    throw new SDKErrors.DidError(
      'Expected a CORD DidUri but got a DidResourceUri (containing a #fragment)'
    )
  }

  if (!fragment && expectType === 'ResourceUri') {
    throw new SDKErrors.DidError(
      'Expected a CORD DidResourceUri (containing a #fragment) but got a DidUri'
    )
  }

  DataUtils.verifyCordAddress(address)
}

/**
 * Internal: derive the address part of the DID when it is created from authentication key.
 *
 * @param input The authentication key.
 * @param input.publicKey The public key.
 * @param input.type The type of the key.
 * @returns The expected address of the DID.
 */
export function getAddressByKey({
  publicKey,
  type,
}: Pick<DidVerificationKey, 'publicKey' | 'type'>): CordAddress {
  if (type === 'ed25519' || type === 'sr25519') {
    return encodeAddress(publicKey, ss58Format)
  }

  // Otherwise it’s ecdsa.
  // Taken from https://github.com/polkadot-js/common/blob/master/packages/keyring/src/pair/index.ts#L44
  const address = publicKey.length > 32 ? blake2AsU8a(publicKey) : publicKey
  return encodeAddress(address, ss58Format)
}

/**
 * Builds the URI an accountswill have after it’s stored on the blockchain.
 *
 * @param didOrAddress The URI of the account. Internally it’s used with the DID "address" as well.
 * @param version The version of the DID URI to use.
 * @returns The expected DID URI.
 */
export function getDidUri(didOrAddress: DidUri | CordAddress): DidUri {
  const address = DataUtils.isCordAddress(didOrAddress)
    ? didOrAddress
    : parse(didOrAddress as DidUri).address
  return `did:cord:${address}` as DidUri
}

/**
 * Builds the URI of a DID if it is created with the authentication key provided.
 *
 * @param key The key that will be used as DID authentication key.
 * @returns The expected DID URI.
 */
export function getDidUriFromKey(
  key: Pick<DidVerificationKey, 'publicKey' | 'type'>
): DidUri {
  const address = getAddressByKey(key)
  return getDidUri(address)
}
