import {
  IRatingEntry,
  DidUri,
  RatingEntryId,
  blake2AsHex,
  RATING_IDENT,
  RATING_PREFIX,
  IRatingDispatch,
  AuthorizationUri,
  CordKeyringPair,
  SignExtrinsicCallback,
  AuthorizationId,
  RatingEntryUri,
} from '@cord.network/types'
import type {
  AccountId,
  H256,
  Bytes,
  SpaceId,
  HexString,
  Option,
} from '@cord.network/types'
import type { PalletNetworkScoreRatingEntry } from '@cord.network/augment-api'

import * as Did from '@cord.network/did'
import {
  hashToUri,
  // identifierToUri,
  uriToIdentifier,
} from '@cord.network/identifier'
import { Chain } from '@cord.network/network'
import { ConfigService } from '@cord.network/config'
import { SDKErrors, UUID, Crypto } from '@cord.network/utils'

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
    const encoded = (await api.query.score.ratingEntries(
      identifier
    )) as Option<PalletNetworkScoreRatingEntry>

    return !encoded.isNone
  } catch (error) {
    throw new SDKErrors.CordQueryError(
      `Error querying rating entries: ${error}`
    )
  }
}

/**
 * @param spaceDigest
 * @param entry
 * @param chainSpace
 * @param creatorUri
 */
export async function getUriForRatingEntry(
  entry: IRatingEntry,
  chainSpace: SpaceId,
  creatorUri: DidUri
): Promise<RatingEntryUri> {
  const api = ConfigService.get('api')
  const scaleEncodedRatingEntryDigest = api
    .createType<H256>('H256', entry.entryDigest)
    .toU8a()
  const scaleEncodedMessageId = api
    .createType<Bytes>('Bytes', entry.messageId)
    .toU8a()
  const scaleEncodedChainSpace = api
    .createType<Bytes>('Bytes', chainSpace)
    .toU8a()
  const scaleEncodedCreator = api
    .createType<AccountId>('AccountId', Did.toChain(creatorUri))
    .toU8a()
  const digest = blake2AsHex(
    Uint8Array.from([
      ...scaleEncodedRatingEntryDigest,
      ...scaleEncodedMessageId,
      ...scaleEncodedChainSpace,
      ...scaleEncodedCreator,
    ])
  )
  return hashToUri(digest, RATING_IDENT, RATING_PREFIX) as RatingEntryUri
}

/**
 * @param entry
 * @param entryUri
 * @param chainSpace
 * @param entryId
 * @param entryDigest
 * @param messageId
 * @param creatorUri
 * @param authUri
 */
export async function getUriForPartialRatingEntry(
  entryUri: RatingEntryUri,
  entryDigest: HexString,
  messageId: string,
  creatorUri: DidUri,
  authUri: AuthorizationUri
): Promise<RatingEntryUri> {
  const api = ConfigService.get('api')
  const scaleEncodedEntruUri = api.createType<Bytes>('Bytes', entryUri).toU8a()
  const scaleEncodedEntryDigest = api
    .createType<H256>('H256', entryDigest)
    .toU8a()
  const scaleEncodedMessageId = api
    .createType<Bytes>('Bytes', messageId)
    .toU8a()
  const scaleEncodedAuthUri = api.createType<Bytes>('Bytes', authUri).toU8a()
  const scaleEncodedCreator = api
    .createType<AccountId>('AccountId', Did.toChain(creatorUri))
    .toU8a()
  const digest = blake2AsHex(
    Uint8Array.from([
      ...scaleEncodedEntruUri,
      ...scaleEncodedEntryDigest,
      ...scaleEncodedMessageId,
      ...scaleEncodedAuthUri,
      ...scaleEncodedCreator,
    ])
  )
  return hashToUri(digest, RATING_IDENT, RATING_PREFIX) as RatingEntryUri
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

    const tx = api.tx.score.registerRating(
      ratingEntry.entry,
      ratingEntry.entryDigest,
      ratingEntry.messageId,
      authorizationId
    )

    const extrinsic = await Did.authorizeTx(
      ratingEntry.creatorUri,
      tx,
      signCallback,
      authorAccount.address
    )

    await Chain.signAndSubmitTx(extrinsic, authorAccount)

    return ratingEntry.entryUri
  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${error}".`
    )
  }
}

/**
 * @param ratingUri
 * @param creatorUri
 * @param messageId
 * @param authorAccount
 * @param authorizationUri
 * @param signCallback
 */
export async function dispatchAmendRatingToChain(
  ratingUri: RatingEntryUri,
  creatorUri: DidUri,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback,
  messageId?: string
): Promise<RatingEntryUri> {
  try {
    const api = ConfigService.get('api')

    const msgId = messageId || `msg-${UUID.generate()}`

    // const creator = Did.toChain(creatorUri)
    const ratingEntryDetails = {
      msgId,
      creatorUri,
      ratingUri,
      authorizationUri,
    }
    const entryDigest = Crypto.hashObjectAsHexStr(ratingEntryDetails)

    const ratingEntryUri = await getUriForPartialRatingEntry(
      ratingUri,
      entryDigest,
      msgId,
      creatorUri,
      authorizationUri
    )

    const exists = await isRatingStored(ratingEntryUri)
    if (!exists) {
      throw new SDKErrors.CordDispatchError(`Rating Entry not found on chain.`)
    }

    const authorizationId: AuthorizationId = uriToIdentifier(authorizationUri)
    const ratingEntryId: RatingEntryId = uriToIdentifier(ratingUri)

    const tx = api.tx.score.amendRating(
      ratingEntryId,
      msgId,
      entryDigest,
      authorizationId
    )

    const extrinsic = await Did.authorizeTx(
      creatorUri,
      tx,
      signCallback,
      authorAccount.address
    )

    await Chain.signAndSubmitTx(extrinsic, authorAccount)

    return ratingUri
  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${error}".`
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
  refEntryUri: RatingEntryUri,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<RatingEntryUri> {
  try {
    const api = ConfigService.get('api')
    const authorizationId: AuthorizationId = uriToIdentifier(authorizationUri)
    const refEntryId: RatingEntryId = uriToIdentifier(refEntryUri)

    const exists = await isRatingStored(ratingEntry.entryUri)
    if (exists) {
      return ratingEntry.entryUri
    }

    const tx = api.tx.score.reviseRating(
      ratingEntry.entry,
      ratingEntry.messageId,
      ratingEntry.entryDigest,
      refEntryId,
      authorizationId
    )

    const extrinsic = await Did.authorizeTx(
      ratingEntry.creatorUri,
      tx,
      signCallback,
      authorAccount.address
    )

    await Chain.signAndSubmitTx(extrinsic, authorAccount)

    return ratingEntry.entryUri
  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${error}".`
    )
  }
}

// /**
//  * @param scoreId
//  * @param scoreType
//  */
// export async function fetchJournalFromChain(
//   scoreId: string,
//   scoreType: RatingType
// ): Promise<IJournalContent | null> {
//   const api = ConfigService.get('api')
//   const cordScoreId = uriToIdentifier(scoreId)
//   const encodedScoreEntry = await api.query.score.journal(
//     cordScoreId,
//     scoreType
//   )
//   const decodedScoreEntry = fromChain(encodedScoreEntry)
//   if (decodedScoreEntry === null) {
//     throw new SDKErrors.ScoreMissingError(
//       `There is not a Score of type ${scoreType} with the provided ID "${scoreId}" on chain.`
//     )
//   } else return decodedScoreEntry
// }

// /**
//  * @param encodedEntry
//  */
// export function fromChain(encodedEntry: any): IJournalContent | null {
//   if (encodedEntry.isSome) {
//     const unwrapped = encodedEntry.unwrap()
//     return {
//       entity: unwrapped.entry.entity.toString(),
//       tid: JSON.stringify(unwrapped.entry.tid.toHuman()),
//       collector: unwrapped.entry.collector.toString(),
//       rating_type: unwrapped.entry.ratingType.toString(),
//       rating: parseInt(unwrapped.entry.rating.toString()) / SCORE_MODULUS,
//       entry_type: unwrapped.entry.entryType.toString(),
//       count: parseInt(unwrapped.entry.count.toString()),
//     }
//   }
//   return null
// }

// /**
//  * @param entityUri
//  * @param scoreType
//  */
// export async function fetchScore(
//   entityUri: string,
//   scoreType: RatingType
// ): Promise<IEntityScoreDetails> {
//   const api = ConfigService.get('api')
//   const encoded = await api.query.score.scores(entityUri, scoreType)
//   if (encoded.isSome) {
//     const decoded = encoded.unwrap()
//     return {
//       rating: JSON.parse(decoded.rating.toString()),
//       count: JSON.parse(decoded.count.toString()),
//     }
//   }
//   throw new SDKErrors.ScoreMissingError(
//     `There is not a Score of type ${scoreType} with the provided ID "${entityUri}" on chain.`
//   )
// }

// /**
//  * @param ratingData
//  * @param authorization
//  */
// export async function toChain(
//   /**
//    * This function rerturns the jornal creation extrinsic.
//    */
//   ratingData: IRatingData,
//   authorization: string
// ) {
//   const api = ConfigService.get('api')
//   const { ratingInput } = ratingData
//   const auth = uriToIdentifier(authorization)
//   try {
//     const journalCreationExtrinsic = await api.tx.score.addRating(
//       ratingInput,
//       auth
//     )
//     return journalCreationExtrinsic
//   } catch (e: any) {
//     return e.message
//   }
// }
