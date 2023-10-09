import { SCORE_MODULUS, IJournalContent } from '@cord.network/types'
import { Crypto } from '@cord.network/utils'
import {
  SCORE_IDENT,
  SCORE_PREFIX,
  ScoreType,
  IScoreAverageDetails,
} from '@cord.network/types'
import { Identifier } from '@cord.network/utils'
import { fetchScore } from './Scoring.chain'

export function adjustAndRoundRating(rating: number): number {
  rating = Math.round(rating * SCORE_MODULUS)
  return rating
}

export function ComputeActualRating(rating: number): number {
  return rating / SCORE_MODULUS
}

export function ComputeAverageRating(rating: number, count: number): number {
  return rating / count
}

export function generateDigestFromJournalContent(
  journalContent: IJournalContent
) {
  const digest = Crypto.hash(JSON.stringify(journalContent))
  const hexDigest = Crypto.u8aToHex(digest)
  return hexDigest
}

export function getUriForScore(journalContent: IJournalContent) {
  const scoreDigest = generateDigestFromJournalContent(journalContent)
  return Identifier.hashToUri(scoreDigest, SCORE_IDENT, SCORE_PREFIX)
}

export async function fetchAverageScore(
  entityUri: string,
  scoreType: ScoreType
): Promise<IScoreAverageDetails> {
  const pertialEntityUri = entityUri.split('did:cord:').join('')
  const decodedScoreEntry = await fetchScore(pertialEntityUri, scoreType)

  const actualRating = ComputeActualRating(decodedScoreEntry.rating)
  const averageRating = ComputeAverageRating(
    actualRating,
    decodedScoreEntry.count
  )
  return {
    rating: actualRating,
    count: decodedScoreEntry.count,
    average: averageRating,
  }
}
