import { SCORE_MODULUS, IJournalContent } from '@cord.network/types'
import { Crypto } from '@cord.network/utils'
import {
  SCORE_IDENT,
  SCORE_PREFIX,
} from '@cord.network/types'
import { Identifier } from '@cord.network/utils'


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


