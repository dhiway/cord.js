/**
 * @packageDocumentation
 * @module DIDUtils
 */

import type { Option, Struct, u8, Vec } from '@polkadot/types'
import type { IPublicIdentity } from '@cord.network/types'
import { Crypto, DecoderUtils, SDKErrors } from '@cord.network/utils'
import type { Hash } from '@polkadot/types/interfaces'
import { hexToString } from '@polkadot/util'
import { Identity } from '../identity/Identity.js'
import {
  CONTEXT,
  IDENTIFIER_PREFIX,
  // ACCOUNT_IDENTIFIER_PREFIX,
  IDid,
  IDidDocument,
  IDidDocumentSigned,
  KEY_TYPE_AUTHENTICATION,
  KEY_TYPE_ENCRYPTION,
  KEY_TYPE_SIGNATURE,
  SERVICE_DWAY_MESSAGING,
} from './Did.js'

export interface IEncodedDidRecord extends Struct {
  readonly signKey: Hash
  readonly boxKey: Hash
  readonly docRef: Option<Vec<u8>>
}

export function decodeDid(
  identifier: string,
  encoded: Option<IEncodedDidRecord>
): IDid | null {
  DecoderUtils.assertCodecIsType(encoded, ['Option<DidRecord>'])
  if (encoded.isSome) {
    const did = encoded.unwrap()
    const documentStore = did.docRef.isSome
      ? hexToString(did.docRef.unwrap().toHex())
      : null
    return {
      identifier,
      publicSigningKey: did.signKey.toHex(),
      publicBoxKey: did.boxKey.toHex(),
      documentStore,
    }
  }

  return null
}

export function getIdentifierFromAddress(
  address: IPublicIdentity['address']
): IDid['identifier'] {
  return address.startsWith(IDENTIFIER_PREFIX)
    ? address
    : IDENTIFIER_PREFIX + address
}

/**
 * Fetches the root of this delegation node.
 *
 * @param identifier IDid identifier to derive it's address from.
 * @throws When the identifier is not prefixed with the defined Cord IDENTIFIER_PREFIX.
 * @throws [[ERROR_INVALID_DID_PREFIX]].
 *
 * @returns The Address derived from the IDid Identifier.
 */
export function getAddressFromIdentifier(
  identifier: IDid['identifier']
): IPublicIdentity['address'] {
  if (!identifier.startsWith(IDENTIFIER_PREFIX)) {
    throw new SDKErrors.ERROR_INVALID_DID_PREFIX(identifier)
  }
  return identifier.substr(IDENTIFIER_PREFIX.length)
}

export function createDefaultDidDocument(
  identifier: string,
  publicBoxKey: string,
  publicSigningKey: string,
  cordServiceEndpoint?: string
): IDidDocument {
  return {
    id: identifier,
    '@context': CONTEXT,
    authentication: [
      {
        type: KEY_TYPE_AUTHENTICATION,
        publicKey: [`${identifier}#key-1`],
      },
    ],
    publicKey: [
      {
        id: `${identifier}#key-1`,
        type: KEY_TYPE_SIGNATURE,
        controller: identifier,
        publicKeyHex: publicSigningKey,
      },
      {
        id: `${identifier}#key-2`,
        type: KEY_TYPE_ENCRYPTION,
        controller: identifier,
        publicKeyHex: publicBoxKey,
      },
    ],
    service: cordServiceEndpoint
      ? [
          {
            type: SERVICE_DWAY_MESSAGING,
            serviceEndpoint: cordServiceEndpoint,
          },
        ]
      : [],
  }
}

/**
 * Verifies the signature of a [[IDidDocumentSigned]].
 *
 * @param didDocument [[IDidDocumentSigned]] to verify it's signature.
 * @param identifier IDid identifier to match the IDidDocumentSigned id and to verify the signature with.
 * @throws When didDocument and it's signature as well as the identifier are missing.
 * @throws When identifier does not match didDocument's id.
 * @throws [[ERROR_DID_IDENTIFIER_MISMATCH]].
 *
 * @returns The Address derived from the IDid Identifier.
 */
export function verifyDidDocumentSignature(
  didDocument: IDidDocumentSigned,
  identifier: IDid['identifier']
): boolean {
  if (!didDocument || !didDocument.signature || !identifier) {
    throw new Error(
      `Missing data for verification (either didDocument, didDocumentHash, signature, or address is missing):\n
          didDocument:\n
          ${didDocument}\n
          signature:\n
          ${didDocument.signature}\n
          address:\n
          ${identifier}\n
          `
    )
  }
  const { id } = didDocument
  if (identifier !== id) {
    throw new SDKErrors.ERROR_DID_IDENTIFIER_MISMATCH(identifier, id)
  }
  const { signature, ...unsignedDidDocument } = didDocument
  return Crypto.verify(
    Crypto.hashObjectAsHexStr(unsignedDidDocument),
    signature,
    getAddressFromIdentifier(identifier)
  )
}

export function signDidDocument(
  didDocument: IDidDocument,
  identity: Identity
): IDidDocumentSigned {
  const didDocumentHash = Crypto.hashObjectAsHexStr(didDocument)
  return {
    ...didDocument,
    signature: identity.signStr(didDocumentHash),
  }
}
