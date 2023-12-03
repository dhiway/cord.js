import {
  RatingEntryId,
  IRatingDispatch,
  AuthorizationUri,
  CordKeyringPair,
  SignExtrinsicCallback,
  AuthorizationId,
  RatingEntryUri,
  IRatingChainStatus,
  IRatingChainEntryDetails,
  RatingTypeOf,
  EntityTypeOf,
  EntryTypeOf,
  IAggregateScore,
} from '@cord.network/types'
import type { Option } from '@cord.network/types'
import type {
  PalletNetworkScoreRatingEntry,
  PalletNetworkScoreEntityTypeOf,
  PalletNetworkScoreRatingTypeOf,
  PalletNetworkScoreEntryTypeOf,
  PalletNetworkScoreAggregatedEntryOf,
} from '@cord.network/augment-api'

import * as Did from '@cord.network/did'
import { uriToIdentifier, identifierToUri } from '@cord.network/identifier'
import { Chain } from '@cord.network/network'
import { ConfigService } from '@cord.network/config'
import { SDKErrors, DecoderUtils, DataUtils } from '@cord.network/utils'
import { verifySignature } from './Scoring.js'

/**
 * @param spaceUri
 * @param ratingUri
 */
export async function isRatingStored(
  ratingUri: RatingEntryUri
): Promise<boolean> {
  try {
    const api = ConfigService.get('api')
    const identifier = uriToIdentifier(ratingUri)
    const encoded = (await api.query.networkScore.ratingEntries(
      identifier
    )) as Option<PalletNetworkScoreRatingEntry>

    return !encoded.isNone
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error)
    throw new SDKErrors.CordQueryError(
      `Error querying rating entries: ${errorMessage}`
    )
  }
}

/**
 * @param stmtEntry
 * @param creatorUri
 * @param ratingEntry
 * @param authorAccount
 * @param authorizationUri
 * @param signCallback
 */
export async function dispatchRatingToChain(
  ratingEntry: IRatingDispatch,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<RatingEntryUri> {
  try {
    const api = ConfigService.get('api')
    const authorizationId: AuthorizationId = uriToIdentifier(authorizationUri)
    const exists = await isRatingStored(ratingEntry.entryUri)
    if (exists) {
      return ratingEntry.entryUri
    }

    const tx = api.tx.networkScore.registerRating(
      ratingEntry.entry,
      ratingEntry.entryDigest,
      ratingEntry.messageId,
      authorizationId
    )

    const extrinsic = await Did.authorizeTx(
      ratingEntry.authorUri,
      tx,
      signCallback,
      authorAccount.address
    )

    await Chain.signAndSubmitTx(extrinsic, authorAccount)

    return ratingEntry.entryUri
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error)
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${errorMessage}".`
    )
  }
}

/**
 * @param ratingUri
 * @param ratingEntry
 * @param creatorUri
 * @param messageId
 * @param authorAccount
 * @param authorizationUri
 * @param signCallback
 */
export async function dispatchRevokeRatingToChain(
  ratingEntry: IRatingDispatch,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<RatingEntryUri> {
  try {
    const api = ConfigService.get('api')
    verifySignature(
      ratingEntry.entryDigest,
      ratingEntry.authorSignature,
      Did.getDidUri(ratingEntry.authorUri)
    )

    const authorizationId: AuthorizationId = uriToIdentifier(authorizationUri)

    const exists = await isRatingStored(
      ratingEntry.entry.referenceId as RatingEntryUri
    )

    if (!exists) {
      throw new SDKErrors.CordDispatchError(`Rating Entry not found on chain.`)
    }

    const ratingEntryId: RatingEntryId = uriToIdentifier(
      ratingEntry.entry.referenceId
    )

    const tx = api.tx.networkScore.revokeRating(
      ratingEntryId,
      ratingEntry.messageId,
      ratingEntry.entryDigest,
      authorizationId
    )

    const extrinsic = await Did.authorizeTx(
      ratingEntry.authorUri,
      tx,
      signCallback,
      authorAccount.address
    )

    await Chain.signAndSubmitTx(extrinsic, authorAccount)

    return ratingEntry.entryUri
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error)
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${errorMessage}".`
    )
  }
}

/**
 * @param ratingEntry
 * @param refEntry
 * @param refEntryUri
 * @param authorAccount
 * @param authorizationUri
 * @param signCallback
 */
export async function dispatchReviseRatingToChain(
  ratingEntry: IRatingDispatch,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<RatingEntryUri> {
  try {
    const api = ConfigService.get('api')
    const authorizationId: AuthorizationId = uriToIdentifier(authorizationUri)
    const refEntryId: RatingEntryId = uriToIdentifier(
      ratingEntry.entry.referenceId
    )

    const exists = await isRatingStored(ratingEntry.entryUri)
    if (exists) {
      return ratingEntry.entryUri
    }

    const tx = api.tx.networkScore.reviseRating(
      ratingEntry.entry,
      ratingEntry.entryDigest,
      ratingEntry.messageId,
      refEntryId,
      authorizationId
    )

    const extrinsic = await Did.authorizeTx(
      ratingEntry.authorUri,
      tx,
      signCallback,
      authorAccount.address
    )

    await Chain.signAndSubmitTx(extrinsic, authorAccount)

    return ratingEntry.entryUri
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error)
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${errorMessage}".`
    )
  }
}

// Helper function to extract the index from the Rust enum representation
function extractEnumIndex(enumObject: { index: number }): number {
  return enumObject.index
}
// TypeScript Enum Mappings
const EntityTypeMapping: Record<number, EntityTypeOf> = {
  0: EntityTypeOf.retail,
  1: EntityTypeOf.logistic,
}

const RatingTypeMapping: Record<number, RatingTypeOf> = {
  0: RatingTypeOf.overall,
  1: RatingTypeOf.delivery,
}

const EntryTypeMapping: Record<number, EntryTypeOf> = {
  0: EntryTypeOf.credit,
  1: EntryTypeOf.debit,
}

// Decoding Functions
function decodeEntityType(
  encodedType: PalletNetworkScoreEntityTypeOf
): EntityTypeOf {
  const index = extractEnumIndex(encodedType)
  return EntityTypeMapping[index]
}

function decodeRatingType(
  encodedType: PalletNetworkScoreRatingTypeOf
): RatingTypeOf {
  const index = extractEnumIndex(encodedType)
  return RatingTypeMapping[index]
}

function decodeEntryType(
  encodedType: PalletNetworkScoreEntryTypeOf
): EntryTypeOf {
  const index = extractEnumIndex(encodedType)
  return EntryTypeMapping[index]
}

function decodeRatingValue(encodedRating: number, modulus = 10): number {
  return encodedRating / modulus
}

function decodeEntryDetailsfromChain(
  encoded: Option<PalletNetworkScoreRatingEntry>,
  stmtUri: RatingEntryUri,
  timeZone = 'GMT'
): IRatingChainStatus {
  const chainEntry = encoded.unwrap()
  const encodedEntry = chainEntry.entry
  const decodedEntry: IRatingChainEntryDetails = {
    entityUid: DecoderUtils.hexToString(encodedEntry.entityUid.toString()),
    providerUid: DecoderUtils.hexToString(encodedEntry.providerUid.toString()),
    entityType: decodeEntityType(encodedEntry.entityType),
    ratingType: decodeRatingType(encodedEntry.ratingType),
    countOfTxn: encodedEntry.countOfTxn.toNumber(),
    totalRating: decodeRatingValue(encodedEntry.totalEncodedRating.toNumber()),
  }
  let referenceId: RatingEntryUri | undefined
  if (chainEntry.referenceId.isSome) {
    referenceId = identifierToUri(
      DecoderUtils.hexToString(chainEntry.referenceId.unwrap().toString())
    ) as RatingEntryUri
  }

  const decodedDetails: IRatingChainStatus = {
    entryUri: identifierToUri(stmtUri) as RatingEntryUri,
    entry: decodedEntry,
    digest: chainEntry.digest.toHex(),
    messageId: DecoderUtils.hexToString(chainEntry.messageId.toString()),
    space: identifierToUri(
      DecoderUtils.hexToString(chainEntry.space.toString())
    ),
    creatorUri: Did.fromChain(chainEntry.creatorId),
    entryType: decodeEntryType(chainEntry.entryType),
    referenceId,
    createdAt: DataUtils.convertUnixTimeToDateTime(
      chainEntry.createdAt.toNumber(),
      timeZone
    ),
  }

  return decodedDetails
}

/**
 * @param stmtUri
 * @param ratingUri
 * @param timeZone
 */
export async function fetchRatingDetailsfromChain(
  ratingUri: RatingEntryUri,
  timeZone = 'GMT'
): Promise<IRatingChainStatus | null> {
  const api = ConfigService.get('api')
  const rtngId = uriToIdentifier(ratingUri)

  const chainEntry = await api.query.networkScore.ratingEntries(rtngId)
  if (chainEntry.isNone) {
    return null
  }

  const entryDetails = decodeEntryDetailsfromChain(
    chainEntry,
    ratingUri,
    timeZone
  )

  return entryDetails
}

/**
 * @param entity
 * @param ratingType
 */
export async function fetchEntityAggregateScorefromChain(
  entity: string,
  ratingType?: RatingTypeOf
): Promise<IAggregateScore[] | null> {
  const api = ConfigService.get('api')
  const decodedEntries: IAggregateScore[] = []

  if (ratingType !== undefined) {
    const specificItem = await api.query.networkScore.aggregateScores(
      entity,
      ratingType
    )
    if (!specificItem.isNone) {
      const value: PalletNetworkScoreAggregatedEntryOf = specificItem.unwrap()
      decodedEntries.push({
        entityUid: entity,
        ratingType: ratingType.toString() as RatingTypeOf,
        countOfTxn: value.countOfTxn.toNumber(),
        totalRating: decodeRatingValue(value.totalEncodedRating.toNumber()),
      })
    }
  } else {
    const entries = await api.query.networkScore.aggregateScores.entries(entity)
    entries.forEach(([compositeKey, optionValue]) => {
      if (!optionValue.isNone) {
        const value: PalletNetworkScoreAggregatedEntryOf = optionValue.unwrap()
        const [decodedEntityUri, decodedRatingType] = compositeKey.args
        decodedEntries.push({
          entityUid: DecoderUtils.hexToString(decodedEntityUri.toString()),
          ratingType: decodeRatingType(decodedRatingType),
          countOfTxn: value.countOfTxn.toNumber(),
          totalRating: decodeRatingValue(value.totalEncodedRating.toNumber()),
        })
      }
    })
  }
  return decodedEntries.length > 0 ? decodedEntries : null
}
