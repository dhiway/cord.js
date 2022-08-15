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

/**
 *  Checks whether the input meets all the required criteria of an [[ISpace]] object.
 *  Throws on invalid input.
 *
 * @param input The potentially only partial [[IStream]].
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
   * Creates a new [[Space]] from an [[ISpaceType]].

   *
   * @param space The request from which the [[Space]] should be generated.
   * @param controller The identity of the [[Space]] controller.
   * @returns An instance of [[Space]].
   */
export function fromMetaProperties(
  identifier: string,
  metaEntry: string,
  controller: Identity
): IMetaDetails {
  const entryHash = Crypto.hashObjectAsHexStr(metaEntry)

  const entryDetails = {
    identifier: identifier,
    meta: metaEntry,
    metaHash: entryHash,
    controller: controller.address,
    controllerSignature: controller.signStr(entryHash),
  }
  verifyDataStructure(entryDetails)
  return entryDetails
}

/**
 *  Custom Type Guard to determine input being of type ISpace using the SpaceUtils errorCheck.
 *
 * @param input The potentially only partial ISpace.
 * @returns Boolean whether input is of type ISpace.
 */
export function isMetaEntry(input: unknown): input is IMetaDetails {
  try {
    verifyDataStructure(input as IMetaDetails)
  } catch (error) {
    return false
  }
  return true
}
