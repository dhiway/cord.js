import {
  RatingEntryId,
  IRatingDispatch,
  AuthorizationUri,
  CordKeyringPair,
  SignExtrinsicCallback,
  AuthorizationId,
  RatingEntryUri,
} from '@cord.network/types'
import type { Option } from '@cord.network/types'
import type { PalletNetworkScoreRatingEntry } from '@cord.network/augment-api'

import * as Did from '@cord.network/did'
import { uriToIdentifier } from '@cord.network/identifier'
import { Chain } from '@cord.network/network'
import { ConfigService } from '@cord.network/config'
import { SDKErrors } from '@cord.network/utils'
import { verifySignature } from './Scoring.js'

// function decodeRatingValue(encodedRating: number, modulus = 10): number {
//   return encodedRating / modulus
// }

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
    console.log(exists, ratingEntry.entry.referenceId)

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
