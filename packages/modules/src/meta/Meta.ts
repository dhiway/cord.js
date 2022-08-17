/**
 * Schema.
 *
 * * A Registry is a collection of entries grouped by space.
 *
 * @packageDocumentation
 * @module Registry
 * @preferred
 */

import type { IMetaDetails } from '@cord.network/types'
import { Identifier, Crypto, DataUtils, SDKErrors } from '@cord.network/utils'
import { Identity } from '../identity/Identity.js'
import { HexString } from '@polkadot/util/types'

/**
 *  Checks whether the input meets all the required criteria of an [[IMetaDetails]] object.
 *  Throws on invalid input.
 *
 * @param input The potentially only partial [[IMetaDetails]].
 *
 */
export function verifyDataStructure(input: IMetaDetails): void {
  if (!input.identifier) {
    throw new SDKErrors.ERROR_IDENTIFIER_TYPE()
  } else
    DataUtils.validateId(
      Identifier.getIdentifierKey(input.identifier),
      'Identifier'
    )

  if (!input.metaHash) {
    throw new SDKErrors.ERROR_HASH_MALFORMED()
  } else DataUtils.validateHash(input.metaHash, 'Meta hash')

  if (!input.controller) {
    throw new SDKErrors.ERROR_ADDRESS_TYPE()
  } else DataUtils.validateAddress(input.controller, 'Meta controller')
}

/**
   * Creates a new [[IMetaDetails]] from associated params.

   *
   * @param identifier The identifier to attach metadata.
   * @param metaEntry The metadata 
   * @param controller The identity of the identifier controller.
   * @returns An instance of [[IMetaDetails]].
   */
export function fromMetaProperties(
  identifier: string,
  metaEntry: string,
  controller: Identity
): IMetaDetails {
  const entryHash = Crypto.hashObjectAsHexStr(metaEntry)
  const metaHexUInt8 = Crypto.coToUInt8(metaEntry, true)
  const metaHex: HexString = Crypto.u8aToHex(metaHexUInt8)

  const entryDetails = {
    identifier: identifier,
    meta: metaHex,
    metaHash: entryHash,
    controller: controller.address,
    controllerSignature: controller.signStr(entryHash),
  }
  verifyDataStructure(entryDetails)
  return entryDetails
}

/**
 *  Custom Type Guard to determine input being of type IMetaDetails.
 *
 * @param input The potentially only partial IMetaDetails.
 * @returns Boolean whether input is of type IMetaDetails.
 */
export function isMetaEntry(input: unknown): input is IMetaDetails {
  try {
    verifyDataStructure(input as IMetaDetails)
  } catch (error) {
    return false
  }
  return true
}
