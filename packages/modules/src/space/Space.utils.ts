/**
 * @packageDocumentation
 * @module SUtils
 */

import type { ISpace } from '@cord.network/types'
import { DataUtils, SDKErrors } from '@cord.network/utils'

/**
 *  Checks whether the input meets all the required criteria of an [[ISpace]] object.
 *  Throws on invalid input.
 *
 * @param input The potentially only partial [[IStream]].
 *
 */
export function errorCheck(input: ISpace): void {
  if (!input.identifier) {
    throw new SDKErrors.ERROR_SPACE_ID_NOT_PROVIDED()
  } else DataUtils.validateId(input.identifier)

  if (!input.spaceHash) {
    throw new SDKErrors.ERROR_SPACE_HASH_NOT_PROVIDED()
  } else DataUtils.validateHash(input.spaceHash, 'Space hash')

  if (!input.controller) {
    throw new SDKErrors.ERROR_SPACE_OWNER_NOT_PROVIDED()
  } else DataUtils.validateAddress(input.controller, 'Space controller')
}
