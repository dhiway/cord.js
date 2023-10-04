import { SCORE_MULTIPLIER, IJournalContent } from '@cord.network/types'
import { Crypto } from '@cord.network/utils'
import { HexString, SCORE_IDENT, SCORE_PREFIX } from '@cord.network/types'
import { Identifier } from '@cord.network/utils'
import { ConfigService } from '@cord.network/config'
import type { H256 } from '@polkadot/types/interfaces'
import { getHashRoot } from '../document/Document'

export function adjustAndRoundRating(rating: number) {
  rating = Math.round(rating * SCORE_MULTIPLIER)
  return rating
}

export function generateRootHashFromContent(journalContent: IJournalContent) {
  const hashes = []
  hashes.push(Crypto.coToUInt8(journalContent.entity))
  hashes.push(Crypto.coToUInt8(journalContent.tid))
  hashes.push(Crypto.coToUInt8(journalContent.collector))
  hashes.push(Crypto.coToUInt8(journalContent.rating_type))
  hashes.push(Crypto.coToUInt8(journalContent.rating.toString()))
  hashes.push(Crypto.coToUInt8(journalContent.entry_type))
  hashes.push(Crypto.coToUInt8(journalContent.count.toString()))
  const root = getHashRoot(hashes)
  const digest = Crypto.u8aToHex(root)
  return digest
}

export function getUriForScore(scoreDigest: HexString) {
  const api = ConfigService.get('api')
  const scaleEncodedDigest = api.createType<H256>('H256', scoreDigest).toU8a()
  return Identifier.hashToUri(scaleEncodedDigest, SCORE_IDENT, SCORE_PREFIX)
}
