import {
    ScoreType,
    IScoreDetails,
    SCORE_MODULUS,
    IJournalContent,
  } from '@cord.network/types'
  import { ConfigService } from '@cord.network/config'
  import { Identifier, SDKErrors } from '@cord.network/utils'
  import * as Did from '@cord.network/did'
  
  export async function fetchJournalFromChain(
    scoreId: string,
    scoreType: ScoreType
  ): Promise<IJournalContent | null> {
    const api = ConfigService.get('api')
    const cordScoreId = Identifier.uriToIdentifier(scoreId)
    const encodedScoreEntry = await api.query.score.journal(
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
    encodedEntry: any
  ): IJournalContent | null {
    if (encodedEntry.isSome) {
      const unwrapped = encodedEntry.unwrap()
      return {
        entity: Did.fromChain(unwrapped.entry.entity),
        tid: JSON.stringify(unwrapped.entry.tid.toHuman()),
        collector: Did.fromChain(unwrapped.entry.collector),
        rating_type: unwrapped.entry.ratingType.toString(),
        rating: parseInt(unwrapped.entry.rating.toString()) / SCORE_MODULUS,
        entry_type: unwrapped.entry.entryType.toString(),
        count: parseInt(unwrapped.entry.count.toString()),
      }
    } else {
      return null
    }
  }
  
  export async function fetchScore(
    entityUri: string,
    scoreType: ScoreType
  ): Promise<IScoreDetails> {
    const api = ConfigService.get('api')
    const encoded = await api.query.score.scores(entityUri, scoreType)
    if (encoded.isSome) {
      const decoded = encoded.unwrap()
      return {
        rating: JSON.parse(decoded.rating.toString()),
        count: JSON.parse(decoded.count.toString()),
      }
    } else
      throw new SDKErrors.ScoreMissingError(
        `There is not a Score of type ${scoreType} with the provided ID "${entityUri}" on chain.`
      )
  }
  