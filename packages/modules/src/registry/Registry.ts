/**
 * Schema.
 *
 * * A Registry is a collection of entries grouped by space.
 *
 * @packageDocumentation
 * @module Registry
 * @preferred
 */

import type { IRegistryEntry, IEntry } from '@cord.network/types'
import { Identifier, Crypto, DataUtils, SDKErrors } from '@cord.network/utils'
import { REGISTRY_IDENTIFIER, REGISTRY_PREFIX } from '@cord.network/types'
import { Identity } from '../identity/Identity.js'

/**
 *  Checks whether the input meets all the required criteria of an [[ISpace]] object.
 *  Throws on invalid input.
 *
 * @param input The potentially only partial [[IStream]].
 *
 */
export function verifyDataStructure(input: IRegistryEntry): void {
  if (!input.identifier) {
    throw new SDKErrors.ERROR_SPACE_ID_NOT_PROVIDED()
  } else DataUtils.validateId(input.identifier, 'Identifier')

  if (!input.entryHash) {
    throw new SDKErrors.ERROR_SPACE_HASH_NOT_PROVIDED()
  } else DataUtils.validateHash(input.entryHash, 'Entry hash')

  if (!input.entry.controller) {
    throw new SDKErrors.ERROR_SPACE_OWNER_NOT_PROVIDED()
  } else DataUtils.validateAddress(input.entry.controller, 'Entry controller')
}

/**
   * Creates a new [[Space]] from an [[ISpaceType]].
 
   *
   * @param space The request from which the [[Space]] should be generated.
   * @param controller The identity of the [[Space]] controller.
   * @returns An instance of [[Space]].
   */
export function fromSpaceProperties(
  entryProperties: IEntry,
  controller: Identity
): IRegistryEntry {
  const entryHash = Crypto.hashObjectAsHexStr(entryProperties)
  const entryId = Identifier.getIdentifier(
    entryHash,
    REGISTRY_IDENTIFIER,
    REGISTRY_PREFIX
  )
  const entryDetails = {
    identifier: entryId,
    entry: {
      ...entryProperties,
    },
    entryHash: entryHash,
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
export function isRegistryEntry(input: unknown): input is IRegistryEntry {
  try {
    verifyDataStructure(input as IRegistryEntry)
  } catch (error) {
    return false
  }
  return true
}
