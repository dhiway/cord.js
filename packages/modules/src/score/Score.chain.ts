/**
 * @packageDocumentation
 * @module Rating
 */

// import { Option, Struct, Vec, u8 } from '@polkadot/types'
// import type { AccountId, Hash } from '@polkadot/types/interfaces'
import type {
  IJournal,
  IJournalContent,
  IScoreAggregateDetails,
  IScoreAverageDetails,
  // IPublicIdentity,
  SubmittableExtrinsic,
} from '@cord.network/types'
import { DecoderUtils } from '@cord.network/utils'
import { ConfigService } from '@cord.network/config'
import { ChainApiConnection } from '@cord.network/network'
import { Option, Struct, u32 } from '@polkadot/types'

const log = ConfigService.LoggingFactory.getLogger('Registry')

/**
 * Generate the extrinsic to create the [[IRating]].
 *
 * @param entry The rating entry to anchor on the chain.
 * @returns The [[SubmittableExtrinsic]] for the `create` call.
 */

export async function entries(
  journalEntry: IJournal
): Promise<SubmittableExtrinsic> {
  const api = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Create tx for 'rating'`)
  const scoreParams = {
    entry: journalEntry.entry,
    digest: journalEntry.digest,
    signature: journalEntry.entitySignature,
  }
  console.dir(scoreParams, { depth: null, colors: true })
  return api.tx.score.entries(scoreParams)
}

export interface AnchoredScoreDetails extends Struct {
  readonly count: u32
  readonly score: u32
}

function decodeStream(
  encodedScore: Option<AnchoredScoreDetails>,
  entityIdentifier: IJournalContent['entity'],
  scoreType: IJournalContent['scoreType']
): IScoreAggregateDetails | null {
  DecoderUtils.assertCodecIsType(encodedScore, [
    'Option<PalletScoreScoresScoreEntry>',
  ])
  if (encodedScore.isSome) {
    const anchoredStream = encodedScore.unwrap()
    const score: IScoreAggregateDetails = {
      entity: entityIdentifier,
      scoreType: scoreType,
      aggregate: {
        count: Number(anchoredStream.count.valueOf()),
        score: parseFloat(
          (Number(anchoredStream.score.valueOf()) / 10).toFixed(2)
        ),
      },
    }
    return score
  }
  return null
}

function decodeAverageScore(
  encodedScore: Option<AnchoredScoreDetails>,
  entityIdentifier: IJournalContent['entity'],
  scoreType: IJournalContent['scoreType']
): IScoreAverageDetails | null {
  DecoderUtils.assertCodecIsType(encodedScore, [
    'Option<PalletScoreScoresScoreEntry>',
  ])
  if (encodedScore.isSome) {
    const anchoredStream = encodedScore.unwrap()
    let encodedScoreBase = parseFloat(
      (Number(anchoredStream.score.valueOf()) / 10).toFixed(2)
    )
    let encodedScoreCount = parseFloat(
      Number(anchoredStream.count.valueOf()).toFixed(2)
    )
    let averageScore = parseFloat(
      (encodedScoreBase / encodedScoreCount).toFixed(2)
    )

    // parseFloat((737 / 1070).toFixed(2))

    const score: IScoreAverageDetails = {
      entity: entityIdentifier,
      scoreType: scoreType,
      average: {
        count: encodedScoreCount,
        score: averageScore,
      },
    }
    return score
  }
  return null
}

/**
 * Query a stream from the chain, returning the SCALE encoded value.
 *
 * @param streamIdentifier The Identifier of the stream anchored.
 * @returns An Option wrapping scale encoded stream data.
 */
export async function queryRaw(
  entityIdentifier: IJournalContent['entity'],
  scoreType: IJournalContent['scoreType']
): Promise<Option<AnchoredScoreDetails>> {
  const api = await ChainApiConnection.getConnectionOrConnect()
  const result = await api.query.score.scores<Option<AnchoredScoreDetails>>(
    entityIdentifier,
    scoreType
  )
  return result
}

/**
 * Query a stream from the chain.
 *
 * @param streamIdentifier The Identifier of the stream anchored.
 * @returns Either the retrieved [[Stream]] or null.
 */
export async function query(
  entityIdentifier: IJournalContent['entity'],
  scoreType: IJournalContent['scoreType']
): Promise<IScoreAggregateDetails | null> {
  const encoded = await queryRaw(entityIdentifier, scoreType)
  return decodeStream(encoded, entityIdentifier, scoreType)
}

/**
 * Query a stream from the chain.
 *
 * @param streamIdentifier The Identifier of the stream anchored.
 * @returns Either the retrieved [[Stream]] or null.
 */
export async function queryAverage(
  entityIdentifier: IJournalContent['entity'],
  scoreType: IJournalContent['scoreType']
): Promise<IScoreAverageDetails | null> {
  const encoded = await queryRaw(entityIdentifier, scoreType)
  return decodeAverageScore(encoded, entityIdentifier, scoreType)
}
