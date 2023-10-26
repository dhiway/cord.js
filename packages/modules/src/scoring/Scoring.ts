import {
  SCORE_MODULUS,
  IJournalContent,
  IRatingInput,
  CordAddress,
} from '@cord.network/types'
import { Crypto } from '@cord.network/utils'
import {
  SCORE_IDENT,
  SCORE_PREFIX,
  RatingEntry,
  RatingType,
  MAX_SCORE_PER_ENTRY,
  IRatingData,
} from '@cord.network/types'
import { Identifier, SDKErrors } from '@cord.network/utils'
import { ConfigService } from '@cord.network/config'

export function base10Encode(rating: number): number {
  rating = Math.round(rating * SCORE_MODULUS)
  return rating
}

export function transformRatingEntry(
  journalContent: IJournalContent
): IJournalContent {
  journalContent.rating = base10Encode(journalContent.rating)
  verifyScoreStructure(journalContent)
  return journalContent
}

export function computeActualRating(rating: number): number {
  return rating / SCORE_MODULUS
}

export function computeAverageRating(rating: number, count: number): number {
  return rating / count
}

export function generateDigestFromJournalContent(
  journalContent: IJournalContent
) {
  const derivedObjectForHash: object = {
    entity: journalContent.entity,
    tid: journalContent.tid,
    entry_type: journalContent.entry_type,
    rating_type: journalContent.rating_type,
  }
  const digest = Crypto.hash(JSON.stringify(derivedObjectForHash))
  const hexDigest = Crypto.u8aToHex(digest)
  return hexDigest
}

export function getUriForScore(journalContent: IJournalContent) {
  const scoreDigest = generateDigestFromJournalContent(journalContent)
  return Identifier.hashToUri(scoreDigest, SCORE_IDENT, SCORE_PREFIX)
}

export function transformRatingEntryToInput(
  journalContent: IJournalContent,
  creator: CordAddress
): IRatingInput {
  const digest = generateDigestFromJournalContent(journalContent)
  const ratingInput: IRatingInput = {
    entry: journalContent,
    digest: digest,
    creator: creator,
  }
  return ratingInput
}

export function fromRatingEntry(
  journalContent: IJournalContent,
  creator: CordAddress
): IRatingData {
  verifyScoreStructure(journalContent)
  const ratingInput = transformRatingEntryToInput(journalContent, creator)
  const entry = ratingInput.entry
  const scoreIdentifier = getUriForScore(entry)
  const ratingType =
    ratingInput.entry.rating_type === 'Overall'
      ? RatingType.overall
      : RatingType.delivery
  verifyStoredEntry(scoreIdentifier, ratingType)
  return {
    ratingInput: ratingInput,
    identifier: scoreIdentifier,
  }
}

export function verifyScoreStructure(input: IJournalContent) {
  if (input.collector) {
    if (typeof input.collector != 'string')
      throw new SDKErrors.ScoreCollectorTypeMissMatchError()
  } else {
    throw new SDKErrors.ScoreCollectorMissingError()
  }

  if (input.entity) {
    if (typeof input.entity != 'string')
      throw new SDKErrors.ScoreEntityTypeMissMatchError()
  } else {
    throw new SDKErrors.ScoreEntityMissingError()
  }

  if (input.tid) {
    if (typeof input.tid != 'string')
      throw new SDKErrors.ScoreTidTypeMissMatchError()
  } else {
    throw new SDKErrors.ScoreTidMissingError()
  }

  if (input.entry_type) {
    if (
      !(
        input.entry_type === RatingEntry.credit ||
        input.entry_type === RatingEntry.debit
      )
    )
      throw new SDKErrors.ScoreRatingEntryTypeMissMatchError()
  } else {
    throw new SDKErrors.ScoreRatingEntryTypeMissingError()
  }

  if (input.count) {
    if (typeof input.count != 'number')
      throw new SDKErrors.ScoreCountTypeMissMatchError()
  } else {
    throw new SDKErrors.ScoreCountMissingError()
  }

  if (input.rating) {
    if (typeof input.rating != 'number')
      throw new SDKErrors.RatingInputTypeMissMatchError()
    if (input.rating > input.count * MAX_SCORE_PER_ENTRY)
      throw new SDKErrors.RatingExceedsMaxValueError()
  } else {
    throw new SDKErrors.ScoreRatingMissingError()
  }

  if (input.rating_type) {
    if (
      !(
        input.rating_type === RatingType.overall ||
        input.rating_type === RatingType.delivery
      )
    )
      throw new SDKErrors.ScoreRatingTypeMissMatchError()
  } else {
    throw new SDKErrors.ScoreRatingTypeMissingError()
  }
}

export async function verifyStoredEntry(
  scoreIdentifier: string,
  RatingType: RatingType
) {
  const api = ConfigService.get('api')
  const encodedScoreEntry = await api.query.score.journal(
    scoreIdentifier.replace('score:cord:', ''),
    RatingType
  )
  if (encodedScoreEntry.isSome) {
    throw new SDKErrors.ScoreEntryAlreadyPresentError()
  }
}
