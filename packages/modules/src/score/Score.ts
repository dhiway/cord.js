/**
 * Rating.
 *
 * * The 'rating' here is focused on ONDC focused rating logic
 *
 * @packageDocumentation
 * @module Rating
 * @preferred
 */

import type { IJournal, IJournalContent } from '@cord.network/types'
import { Identifier, Crypto, DataUtils, SDKErrors } from '@cord.network/utils'
import { SCORE_IDENTIFIER, SCORE_PREFIX } from '@cord.network/types'
import { Identity } from '../identity/Identity.js'
// import { BN } from 'bn.js'

/**
 *  Checks whether the input meets all the required criteria of an [[IScore]] object.
 *  Throws on invalid input.
 *
 * @param input The potentially only partial [[IScore]].
 *
 */
export function verifyDataStructure(input: IJournal): void {
  if (!input.identifier) {
    throw new SDKErrors.ERROR_RATING_ID_NOT_PROVIDED()
  }
  DataUtils.validateId(
    Identifier.getIdentifierKey(input.identifier),
    'Identifier'
  )
  if (!input.digest) {
    throw new SDKErrors.ERROR_RATING_HASH_NOT_PROVIDED()
  }
  DataUtils.validateHash(input.digest, 'Rating hash')

  // if (!input.controller) {
  //   throw new SDKErrors.ERROR_RATING_OWNER_NOT_PROVIDED()
  // }
  // DataUtils.validateAddress(input.controller, 'Rating controller')
}

/**
   * Creates a new [[Rating]] from an [[IRatingType]].
 
   *
   * @param rating The request from which the [[Rating]] should be generated.
   * @param controller The identity of the [[Rating]] controller.
   * @returns An instance of [[Rating]].
   */
export function fromJournalProperties(
  journalProperties: IJournalContent,
  controller: Identity
): IJournal {
  let journalScore = Number(journalProperties.score.toFixed(1)) * 10
  journalProperties.score = journalScore
  const journalHash = Crypto.hashObjectAsHexStr(journalProperties)

  const journalId = Identifier.getIdentifier(
    journalHash,
    SCORE_IDENTIFIER,
    SCORE_PREFIX
  )
  const journal = {
    identifier: journalId,
    entry: {
      ...journalProperties,
    },
    digest: journalHash,
    entitySignature: controller.signStr(journalHash),
  }
  verifyDataStructure(journal)
  return journal
}

// /**
//  *  Custom Type Guard to determine input being of type IRating using the RatingUtils errorCheck.
//  *
//  * @param input The potentially only partial IRating.
//  * @returns Boolean whether input is of type IRating.
//  */
// export function isIRating(input: unknown): input is IRating {
//   try {
//     verifyDataStructure(input as IRating)
//   } catch (error) {
//     return false
//   }
//   return true
// }
