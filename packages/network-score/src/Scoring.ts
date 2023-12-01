import {
  IRatingContent,
  IRatingTransformed,
  IRatingEntry,
  EntityTypeOf,
  RatingTypeOf,
  DidUri,
  IRatingChainEntry,
  IRatingDispatch,
  RatingEntryUri,
  SpaceUri,
} from '@cord.network/types'
import { Crypto, SDKErrors, UUID } from '@cord.network/utils'
import { getUriForRatingEntry } from './Scoring.chain.js'

function validateRatingContent(
  ratingContent: IRatingContent | IRatingTransformed
): void {
  const allFieldsFilled = Object.entries(ratingContent).every(
    ([key, value]) => {
      if (value === undefined || value === null || value === '') {
        throw new SDKErrors.RatingContentError(
          `Field '${key}' cannot be empty.`
        )
      }
      return true
    }
  )

  if (!allFieldsFilled) {
    throw new SDKErrors.RatingContentError('All fields must be filled.')
  }

  if ('totalRating' in ratingContent) {
    if (ratingContent.totalRating > ratingContent.countOfTxn * 5) {
      throw new SDKErrors.RatingContentError(
        `Total rating cannot exceed ${ratingContent.countOfTxn * 5}.`
      )
    }
  } else if (ratingContent.totalEncodedRating > ratingContent.countOfTxn * 50) {
    throw new SDKErrors.RatingContentError(
      `Total encoded rating cannot exceed ${ratingContent.countOfTxn * 50}.`
    )
  }

  if (!Object.values(EntityTypeOf).includes(ratingContent.entityType)) {
    throw new SDKErrors.RatingContentError(
      `Invalid entityType: ${ratingContent.entityType}.`
    )
  }

  if (!Object.values(RatingTypeOf).includes(ratingContent.ratingType)) {
    throw new SDKErrors.RatingContentError(
      `Invalid ratingType: ${ratingContent.ratingType}.`
    )
  }
}

function encodeRatingValue(totalRating: number, modulus = 10): number {
  return Math.round(totalRating * modulus)
}

/**
 * @param entry
 * @param messageId
 */
export async function buildFromContentProperties(
  entry: IRatingContent,
  messageId?: string
): Promise<IRatingEntry> {
  try {
    validateRatingContent(entry)

    const msgId = messageId || `msg-${UUID.generate()}`

    const entryTransform: IRatingTransformed = {
      ...entry,
      totalEncodedRating: encodeRatingValue(entry.totalRating),
    }

    const ratingEntry = { entryTransform, msgId }
    const entryDigest = Crypto.hashObjectAsHexStr(ratingEntry)

    const transformedEntry: IRatingEntry = {
      entry: entryTransform,
      messageId: msgId,
      entryDigest,
    }

    return transformedEntry
  } catch (error) {
    throw new SDKErrors.RatingContentError(
      `Rating content transformation error: "${error}".`
    )
  }
}

/**
 * @param entry
 * @param messageId
 * @param rating
 * @param chainSpace
 * @param creatorUri
 */
export async function buildFromRatingProperties(
  rating: IRatingEntry,
  chainSpace: SpaceUri,
  creatorUri: DidUri
): Promise<{ uri: RatingEntryUri; details: IRatingDispatch }> {
  try {
    validateRatingContent(rating.entry)

    if (
      !chainSpace ||
      !creatorUri ||
      !rating.messageId ||
      !rating.entryDigest
    ) {
      throw new SDKErrors.RatingPropertiesError(
        'Required fields cannot be empty.'
      )
    }

    if (!/^0x[0-9a-fA-F]+$/.test(rating.entryDigest)) {
      throw new SDKErrors.RatingPropertiesError(
        'Invalid HexString for entryDigest.'
      )
    }
    const partialRating: IRatingChainEntry = {
      ...rating.entry,
    }

    const ratingUri = await getUriForRatingEntry(rating, chainSpace, creatorUri)

    const ratingEntry: IRatingDispatch = {
      entryUri: ratingUri,
      entry: partialRating,
      chainSpace,
      messageId: rating.messageId,
      entryDigest: rating.entryDigest,
      creatorUri,
    }

    return { uri: ratingUri, details: ratingEntry }
  } catch (error) {
    throw new SDKErrors.RatingPropertiesError(
      `Rating content transformation error: "${error}".`
    )
  }
}

/**
 * @param rating
 * @param chainSpace
 * @param creatorUri
 */
export async function buildFromAmendRatingProperties(
  rating: IRatingEntry,
  chainSpace: SpaceUri,
  creatorUri: DidUri
): Promise<{ uri: RatingEntryUri; details: IRatingDispatch }> {
  try {
    validateRatingContent(rating.entry)

    if (
      !chainSpace ||
      !creatorUri ||
      !rating.messageId ||
      !rating.entryDigest
    ) {
      throw new SDKErrors.RatingPropertiesError(
        'Required fields cannot be empty.'
      )
    }

    if (!/^0x[0-9a-fA-F]+$/.test(rating.entryDigest)) {
      throw new SDKErrors.RatingPropertiesError(
        'Invalid HexString for entryDigest.'
      )
    }
    const partialRating: IRatingChainEntry = {
      ...rating.entry,
    }

    const ratingUri = await getUriForRatingEntry(rating, chainSpace, creatorUri)

    const ratingEntry: IRatingDispatch = {
      entryUri: ratingUri,
      entry: partialRating,
      chainSpace,
      messageId: rating.messageId,
      entryDigest: rating.entryDigest,
      creatorUri,
    }

    return { uri: ratingUri, details: ratingEntry }
  } catch (error) {
    throw new SDKErrors.RatingPropertiesError(
      `Rating content transformation error: "${error}".`
    )
  }
}

// /**
//  * @param journalContent
//  */
// export function transformRatingEntry(
//   journalContent: IJournalContent
// ): IJournalContent {
//   journalContent.rating = base10Encode(journalContent.rating)
//   verifyScoreStructure(journalContent)
//   return journalContent
// }

// /**
//  * @param rating
//  */
// export function computeActualRating(rating: number): number {
//   return rating / SCORE_MODULUS
// }

// /**
//  * @param rating
//  * @param count
//  */
// export function computeAverageRating(rating: number, count: number): number {
//   return rating / count
// }

// /**
//  * @param journalContent
//  */
// export function generateDigestFromJournalContent(
//   journalContent: IJournalContent
// ) {
//   const derivedObjectForHash: object = {
//     entity: journalContent.entity,
//     tid: journalContent.tid,
//     entry_type: journalContent.entry_type,
//     rating_type: journalContent.rating_type,
//   }
//   const digest = Crypto.hash(JSON.stringify(derivedObjectForHash))
//   const hexDigest = Crypto.u8aToHex(digest)
//   return hexDigest
// }

// /**
//  * @param journalContent
//  */
// export function getUriForScore(journalContent: IJournalContent) {
//   const scoreDigest = generateDigestFromJournalContent(journalContent)
//   return hashToUri(scoreDigest, SCORE_IDENT, SCORE_PREFIX)
// }

// /**
//  * @param journalContent
//  * @param creator
//  */
// export function transformRatingEntryToInput(
//   journalContent: IJournalContent,
//   creator: CordAddress
// ): IRatingInput {
//   const digest = generateDigestFromJournalContent(journalContent)
//   const ratingInput: IRatingInput = {
//     entry: journalContent,
//     digest,
//     creator,
//   }
//   return ratingInput
// }

// /**
//  * @param journalContent
//  * @param creator
//  */
// export function fromRatingEntry(
//   journalContent: IJournalContent,
//   creator: CordAddress
// ): IRatingData {
//   verifyScoreStructure(journalContent)
//   const ratingInput = transformRatingEntryToInput(journalContent, creator)
//   const { entry } = ratingInput
//   const scoreIdentifier = getUriForScore(entry)
//   const ratingType =
//     ratingInput.entry.rating_type === 'Overall'
//       ? RatingType.overall
//       : RatingType.delivery
//   verifyStoredEntry(scoreIdentifier, ratingType)
//   return {
//     ratingInput,
//     identifier: scoreIdentifier,
//   }
// }

// /**
//  * @param input
//  */
// export function verifyScoreStructure(input: IJournalContent) {
//   if (input.collector) {
//     if (typeof input.collector !== 'string')
//       throw new SDKErrors.ScoreCollectorTypeMissMatchError()
//   } else {
//     throw new SDKErrors.ScoreCollectorMissingError()
//   }

//   if (input.entity) {
//     if (typeof input.entity !== 'string')
//       throw new SDKErrors.ScoreEntityTypeMissMatchError()
//   } else {
//     throw new SDKErrors.ScoreEntityMissingError()
//   }

//   if (input.tid) {
//     if (typeof input.tid !== 'string')
//       throw new SDKErrors.ScoreTidTypeMissMatchError()
//   } else {
//     throw new SDKErrors.ScoreTidMissingError()
//   }

//   if (input.entry_type) {
//     if (
//       !(
//         input.entry_type === RatingEntry.credit ||
//         input.entry_type === RatingEntry.debit
//       )
//     )
//       throw new SDKErrors.ScoreRatingEntryTypeMissMatchError()
//   } else {
//     throw new SDKErrors.ScoreRatingEntryTypeMissingError()
//   }

//   if (input.count) {
//     if (typeof input.count !== 'number')
//       throw new SDKErrors.ScoreCountTypeMissMatchError()
//   } else {
//     throw new SDKErrors.ScoreCountMissingError()
//   }

//   if (input.rating) {
//     if (typeof input.rating !== 'number')
//       throw new SDKErrors.RatingInputTypeMissMatchError()
//     if (input.rating > input.count * MAX_SCORE_PER_ENTRY)
//       throw new SDKErrors.RatingExceedsMaxValueError()
//   } else {
//     throw new SDKErrors.ScoreRatingMissingError()
//   }

//   if (input.rating_type) {
//     if (
//       !(
//         input.rating_type === RatingType.overall ||
//         input.rating_type === RatingType.delivery
//       )
//     )
//       throw new SDKErrors.ScoreRatingTypeMissMatchError()
//   } else {
//     throw new SDKErrors.ScoreRatingTypeMissingError()
//   }
// }

// /**
//  * @param scoreIdentifier
//  * @param RatingType
//  */
// export async function verifyStoredEntry(
//   scoreIdentifier: string,
//   RatingType: RatingType
// ) {
//   const api = ConfigService.get('api')
//   const encodedScoreEntry = await api.query.score.journal(
//     scoreIdentifier.replace('score:cord:', ''),
//     RatingType
//   )
//   if (encodedScoreEntry.isSome) {
//     throw new SDKErrors.ScoreEntryAlreadyPresentError()
//   }
// }
