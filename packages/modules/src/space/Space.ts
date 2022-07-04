/**
 * Schema.
 *
 * * A Space is a collection to hold schemas, stream, controllers and delegates
 *
 * @packageDocumentation
 * @module Space
 * @preferred
 */

import type { ISpace, ISpaceType } from '@cord.network/types'
import { Identifier, Crypto, DataUtils, SDKErrors } from '@cord.network/utils'
import { SPACE_IDENTIFIER, SPACE_PREFIX } from '@cord.network/types'
import { Identity } from '../identity/Identity.js'

/**
 *  Checks whether the input meets all the required criteria of an [[ISpace]] object.
 *  Throws on invalid input.
 *
 * @param input The potentially only partial [[IStream]].
 *
 */
export function verifyDataStructure(input: ISpace): void {
  if (!input.identifier) {
    throw new SDKErrors.ERROR_SPACE_ID_NOT_PROVIDED()
  } else DataUtils.validateId(input.identifier, 'Identifier')

  if (!input.spaceHash) {
    throw new SDKErrors.ERROR_SPACE_HASH_NOT_PROVIDED()
  } else DataUtils.validateHash(input.spaceHash, 'Space hash')

  if (!input.controller) {
    throw new SDKErrors.ERROR_SPACE_OWNER_NOT_PROVIDED()
  } else DataUtils.validateAddress(input.controller, 'Space controller')
}

/**
   * Creates a new [[Space]] from an [[ISpaceType]].
 
   *
   * @param space The request from which the [[Space]] should be generated.
   * @param controller The identity of the [[Space]] controller.
   * @returns An instance of [[Space]].
   */
export function fromSpaceProperties(
  spaceProperties: ISpaceType,
  controller: Identity
): ISpace {
  const spaceHash = Crypto.hashObjectAsHexStr(spaceProperties)
  const spaceId = Identifier.getIdentifier(
    spaceHash,
    SPACE_IDENTIFIER,
    SPACE_PREFIX
  )
  const space = {
    identifier: spaceId,
    spaceHash: spaceHash,
    space: {
      ...spaceProperties,
    },
    controller: controller.address,
    controllerSignature: controller.signStr(spaceHash),
  }
  verifyDataStructure(space)
  return space
}

/**
 *  Custom Type Guard to determine input being of type ISpace using the SpaceUtils errorCheck.
 *
 * @param input The potentially only partial ISpace.
 * @returns Boolean whether input is of type ISpace.
 */
export function isISpace(input: unknown): input is ISpace {
  try {
    verifyDataStructure(input as ISpace)
  } catch (error) {
    return false
  }
  return true
}
