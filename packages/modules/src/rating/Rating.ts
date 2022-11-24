/**
 * Rating.
 *
 * * The 'rating' here is focused on ONDC focused rating logic
 *
 * @packageDocumentation
 * @module Rating
 * @preferred
 */

import type { IRating, IRatingType } from '@cord.network/types'
import { Identifier, Crypto, DataUtils, SDKErrors } from '@cord.network/utils'
import { RATING_IDENTIFIER, RATING_PREFIX } from '@cord.network/types'
import { Identity } from '../identity/Identity.js'

/**
 *  Checks whether the input meets all the required criteria of an [[IRating]] object.
 *  Throws on invalid input.
 *
 * @param input The potentially only partial [[IRating]].
 *
 */
export function verifyDataStructure(input: IRating): void {
  if (!input.identifier) {
    throw new SDKErrors.ERROR_RATING_ID_NOT_PROVIDED()
  }
  DataUtils.validateId(
    Identifier.getIdentifierKey(input.identifier),
    'Identifier'
  )
  if (!input.ratingHash) {
    throw new SDKErrors.ERROR_RATING_HASH_NOT_PROVIDED()
  }
  DataUtils.validateHash(input.ratingHash, 'Rating hash')

  if (!input.controller) {
    throw new SDKErrors.ERROR_RATING_OWNER_NOT_PROVIDED()
  }
  DataUtils.validateAddress(input.controller, 'Rating controller')
}

/**
   * Creates a new [[Rating]] from an [[IRatingType]].
 
   *
   * @param rating The request from which the [[Rating]] should be generated.
   * @param controller The identity of the [[Rating]] controller.
   * @returns An instance of [[Rating]].
   */
export function fromRatingProperties(
  ratingProperties: IRatingType,
  controller: Identity,
): IRating {
  const ratingHash = Crypto.hashObjectAsHexStr(ratingProperties)
  const ratingId = Identifier.getIdentifier(
    ratingHash,
    RATING_IDENTIFIER,
    RATING_PREFIX
  )
  const rating = {
    identifier: ratingId,
    ratingHash: ratingHash,
    details: {
      ...ratingProperties,
    },
    controller: controller.address,
    controllerSignature: controller.signStr(ratingHash),
    rating: ratingProperties.rating,
    count: ratingProperties.count,
    entity: ratingProperties.entity,
  }
  verifyDataStructure(rating)
  return rating
}

/**
 *  Custom Type Guard to determine input being of type IRating using the RatingUtils errorCheck.
 *
 * @param input The potentially only partial IRating.
 * @returns Boolean whether input is of type IRating.
 */
export function isIRating(input: unknown): input is IRating {
  try {
    verifyDataStructure(input as IRating)
  } catch (error) {
    return false
  }
  return true
}
