import {
  RatingType,
  IEntityScoreDetails,
  SCORE_MODULUS,
  IJournalContent,
  IRatingData,
  DidUri,
  CordKeyringPair
} from '@cord.network/types'
import { ConfigService } from '@cord.network/config'
import { Identifier, SDKErrors } from '@cord.network/utils'
// import * as Chain from '@cord.network/network/src/chain/Chain'
import * as Chain from '../../../network/src/chain/Chain'
import * as Did from '@cord.network/did'

export async function fetchJournalFromChain(
  scoreId: string,
  scoreType: RatingType
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

export function fromChain(encodedEntry: any): IJournalContent | null {
  if (encodedEntry.isSome) {
    const unwrapped = encodedEntry.unwrap()
    return {
      entity: unwrapped.entry.entity.toString(),
      tid: JSON.stringify(unwrapped.entry.tid.toHuman()),
      collector: unwrapped.entry.collector.toString(),
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
  scoreType: RatingType
): Promise<IEntityScoreDetails> {
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

export async function toChain(
  ratingData: IRatingData,
  authorization: string,
  authorDid: DidUri,
  authorKeys: any,
  authorIdentity: CordKeyringPair
) {
  const api = ConfigService.get('api')
  const ratingInput = ratingData.ratingInput
  const identifier = ratingData.identifier
  const auth = Identifier.uriToIdentifier(authorization)
  try {
    const journalCreationExtrinsic = await api.tx.score.addRating(
      ratingInput,
      auth
    )
    const authorizedStreamTx = await Did.authorizeTx(
      authorDid,
      journalCreationExtrinsic,
      async ({ data } : any) => ({
        signature: authorKeys.assertionMethod.sign(data),
        keyType: authorKeys.assertionMethod.type,
      }),
      authorIdentity.address
    )
    await Chain.signAndSubmitTx(authorizedStreamTx, authorIdentity)
    return identifier
  } catch (e: any) {
    return e.message
  }
}
