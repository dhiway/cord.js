import { IJournalContent, ScoreType } from '@cord.network/types'
import { ConfigService } from '@cord.network/config'
import { Identifier, SDKErrors } from '@cord.network/utils'
import type { PalletScoringScoreEntry } from '@cord.network/augment-api'
import type { Option } from '@polkadot/types'
import * as Did from '@cord.network/did'

export async function fetchJournalFromChain(
  scoreId: string,
  scoreType: ScoreType
): Promise<IJournalContent | null> {
  const api = ConfigService.get('api')
  const cordScoreId = Identifier.uriToIdentifier(scoreId)
  const encodedScoreEntry = await api.query.scoring.journal(
    cordScoreId,
    scoreType
  )
  const decodedScoreEntry = fromChain(encodedScoreEntry)
  if (decodedScoreEntry === null) {
    throw new SDKErrors.ScoreMissingError(
      `There is not a Score of type ${scoreType} with the provided ID "${scoreId}" on chain.`
    )
  } else return decodedScoreEntry
}

export function fromChain(
  encodedEntry: Option<PalletScoringScoreEntry>
): any | null {
  if (encodedEntry.isSome) {
    const unwrapped = encodedEntry.unwrap()
    return {
      entity: Did.fromChain(unwrapped.entry.entity),
      tid: unwrapped.entry.tid.toHuman(),
      collector: Did.fromChain(unwrapped.entry.collector),
      rating_type: unwrapped.entry.ratingType.toString(),
      rating: parseInt(unwrapped.entry.rating.toString()),
      entry_type: unwrapped.entry.entryType.toString(),
      count: parseInt(unwrapped.entry.count.toString()),
    }
  } else {
    return null
  }
}
