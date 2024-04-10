/**
 * @packageDocumentation
 * @module NetworkScore/Chain
 *
 * Network Scoring Chain Interface Module.
 *
 * This module provides a comprehensive set of functions to interact with a blockchain-based rating system.
 * It allows users to fetch, dispatch, revise, and revoke rating entries from a blockchain, as well as
 * to fetch aggregated scores for entities. The module is designed to interact with a specific blockchain
 * API and utilizes a set of internal utility functions to decode and handle blockchain data.
 *
 * Key Features:
 * - Fetching rating details: Retrieve detailed information about specific ratings stored on the blockchain.
 * - Dispatching ratings: Submit new ratings to the blockchain, ensuring they are recorded and stored securely.
 * - Revoking ratings: Remove existing ratings from the blockchain, used in cases where ratings are no longer valid or relevant.
 * - Revising ratings: Update the details of existing ratings on the blockchain.
 * - Aggregating scores: Gather and decode aggregate score data for entities, useful for analytics and overviews.
 *
 * The module relies on a set of decoding functions to translate blockchain-encoded data into readable formats and
 * handles various aspects of rating data management, including verification of signatures, conversion of time zones,
 * and mapping of entity and rating types. It is designed to be used in systems that require robust and secure
 * management of rating data on a blockchain infrastructure.
 *
 * Usage of this module typically involves initializing the blockchain API connection, followed by calling the
 * appropriate functions as per the application's needs. It is a critical component for applications that integrate
 * with blockchain technologies for transparent, immutable, and reliable rating systems.
 */

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
  EntryTypeOf,
  IAggregateScore,
} from '@cord.network/types'
import type { Option } from '@cord.network/types'
import type {
  PalletNetworkScoreRatingEntry,
  PalletNetworkScoreRatingTypeOf,
  PalletNetworkScoreEntryTypeOf,
  PalletNetworkScoreAggregatedEntryOf,
} from '@cord.network/augment-api'

import * as Did from '@cord.network/did'
import { uriToIdentifier, identifierToUri } from '@cord.network/identifier'
import { Chain } from '@cord.network/network'
import { ConfigService } from '@cord.network/config'
import { SDKErrors, DecoderUtils, DataUtils } from '@cord.network/utils'

/**
 * Checks if a specific rating is stored in the blockchain.
 *
 * This asynchronous function is used to determine whether a particular rating, identified by its URI,
 * is stored in the blockchain. It queries the blockchain using a provided rating URI to verify the existence
 * of the rating. This function is essential for validation processes where the presence of a rating in the blockchain
 * needs to be confirmed. It is commonly used in scenarios where the integrity and existence of ratings are crucial,
 * such as in verifying claims or during audits.
 *
 * @param ratingUri - The URI of the rating entry to be checked. This URI is used to identify the rating in the blockchain.
 *
 * @returns - A promise that resolves to a boolean value:
 *    - `true` if the rating is found in the blockchain.
 *    - `false` if the rating is not found.
 *
 * @throws {SDKErrors.CordQueryError} - Thrown if there's an error during the querying process,
 *                                      such as network issues or problems with the query construction.
 *
 * @example
 * // Example usage of the function
 * const ratingUri = 'ratingUri123';
 *
 * try {
 *   const isStored = await isRatingStored(ratingUri);
 *   console.log('Is the rating stored?', isStored);
 * } catch (error) {
 *   console.error('Error checking if rating is stored:', error);
 * }
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
 * Dispatches a rating entry to the blockchain.
 *
 * This asynchronous function is responsible for dispatching a rating entry to the blockchain. It first checks if the
 * rating entry already exists on the blockchain. If it does, the function simply returns the existing entry's URI.
 * If the rating entry is not already stored, the function proceeds to dispatch it to the blockchain. This involves creating
 * and signing a transaction to register the rating, and then submitting this transaction to the blockchain. The function
 * is essential for ensuring that ratings are correctly and securely recorded in the blockchain environment.
 *
 * @param ratingEntry - The rating entry object that needs to be dispatched. This includes the entry's details and its unique URI.
 * @param authorAccount - The blockchain account of the author, used for signing the transaction.
 * @param authorizationUri - The URI that provides authorization context for the rating entry dispatch.
 * @param signCallback - A callback function for signing the extrinsic (blockchain transaction).
 *
 * @returns - A promise that resolves to the URI of the rating entry. If the entry was already on the chain, it returns the existing URI.
 *
 * @throws {SDKErrors.CordDispatchError} - Thrown if there's an error during the dispatch process, such as issues with signing, transaction creation, or submission.
 *
 * @example
 * // Example usage of the function
 * const ratingEntry = {
 *   // ... rating entry properties ...
 * };
 * const authorAccount = { /* ... author's blockchain account ... *\/ };
 * const authorizationUri = 'authUri123';
 * const signCallback = async (/* ... parameters ... *\/) => { /* ... signing logic ... *\/ };
 *
 * try {
 *   const entryUri = await dispatchRatingToChain(ratingEntry, authorAccount, authorizationUri, signCallback);
 *   console.log('Dispatched Rating Entry URI:', entryUri);
 * } catch (error) {
 *   console.error('Error dispatching rating to chain:', error);
 * }
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
 * Dispatches a request to revoke a rating entry from the blockchain.
 *
 * This asynchronous function is utilized to revoke an existing rating entry from the blockchain.
 * It first verifies the signature of the rating entry to ensure its authenticity and integrity.
 * Then, it checks if the rating entry actually exists on the blockchain. If the entry does not exist,
 * it throws an error. Otherwise, it proceeds to create a transaction to revoke the rating, signs the transaction,
 * and submits it to the blockchain. This function is crucial for maintaining the accuracy and relevancy of
 * the rating data on the blockchain, allowing for the removal of ratings when necessary.
 *
 * @param ratingEntry - The rating entry object that is to be revoked.
 *                                        Includes details like the entry digest and the author's signature.
 * @param authorAccount - The blockchain account of the author, used for transaction signing.
 * @param authorizationUri - The URI providing the authorization context for the revocation.
 * @param signCallback - A callback function for signing the extrinsic (blockchain transaction).
 *
 * @returns - A promise that resolves to the URI of the revoked rating entry.
 *
 * @throws {SDKErrors.CordDispatchError} - Thrown if there's an error during the dispatch process,
 *                                         such as a non-existent rating entry, issues with signing, or submission failures.
 *
 * @example
 * // Example usage of the function
 * const ratingEntry = {
 *   // ... properties of the rating entry to be revoked ...
 * };
 * const authorAccount = { /* ... author's blockchain account ... *\/ };
 * const authorizationUri = 'authUri123';
 * const signCallback = async (/* ... parameters ... *\/) => { /* ... signing logic ... *\/ };
 *
 * try {
 *   const entryUri = await dispatchRevokeRatingToChain(ratingEntry, authorAccount, authorizationUri, signCallback);
 *   console.log('Revoked Rating Entry URI:', entryUri);
 * } catch (error) {
 *   console.error('Error dispatching revocation to chain:', error);
 * }
 */
export async function dispatchRevokeRatingToChain(
  ratingEntry: IRatingDispatch,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<RatingEntryUri> {
  try {
    const api = ConfigService.get('api')

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
 * Dispatches a request to revise an existing rating entry on the blockchain.
 *
 * This asynchronous function handles the process of revising a rating entry that is already stored on the blockchain.
 * It first checks whether the specified rating entry exists on the blockchain. If it does, the function simply returns
 * the existing entry's URI. If the rating entry is not stored, it proceeds to dispatch a revised version of the rating
 * to the blockchain. This involves creating and signing a transaction for the revised rating, and then submitting this
 * transaction to the blockchain. This function is essential for ensuring that ratings on the blockchain can be updated
 * to maintain their accuracy and relevance over time.
 *
 * @param ratingEntry - The revised rating entry object to be dispatched.
 *                                        It includes the entry's details and its unique URI.
 * @param authorAccount - The blockchain account of the author, used for signing the transaction.
 * @param authorizationUri - The URI that provides authorization context for the rating revision dispatch.
 * @param signCallback - A callback function for signing the extrinsic (blockchain transaction).
 *
 * @returns - A promise that resolves to the URI of the revised rating entry.
 *                                      If the entry was already on the chain, it returns the existing URI.
 *
 * @throws {SDKErrors.CordDispatchError} - Thrown if there's an error during the dispatch process, such as issues with signing,
 *                                         transaction creation, or submission.
 *
 * @example
 * // Example usage of the function
 * const revisedRatingEntry = {
 *   // ... revised rating entry properties ...
 * };
 * const authorAccount = { /* ... author's blockchain account ... *\/ };
 * const authorizationUri = 'authUri123';
 * const signCallback = async (/* ... parameters ... *\/) => { /* ... signing logic ... *\/ };
 *
 * try {
 *   const entryUri = await dispatchReviseRatingToChain(revisedRatingEntry, authorAccount, authorizationUri, signCallback);
 *   console.log('Revised Rating Entry URI:', entryUri);
 * } catch (error) {
 *   console.error('Error dispatching revised rating to chain:', error);
 * }
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

/**
 * Extracts the index from a Rust enum representation.
 *
 * This function takes an object representing a Rust enum (with an 'index' property) and returns the index value.
 * This is a utility function used in decoding processes where Rust enums are represented in JavaScript/TypeScript
 * and an index is needed to map to the correct type.
 *
 * @param enumObject - The object representing the Rust enum, must have an 'index' property.
 * @param enumObject.index
 * @returns - The index value of the enum.
 *
 * @internal
 */
function extractEnumIndex(enumObject: { index: number }): number {
  return enumObject.index
}

// TypeScript Enum Mappings
const RatingTypeMapping: Record<number, RatingTypeOf> = {
  0: RatingTypeOf.overall,
  1: RatingTypeOf.delivery,
}

const EntryTypeMapping: Record<number, EntryTypeOf> = {
  0: EntryTypeOf.credit,
  1: EntryTypeOf.debit,
}

/**
 * Decodes an encoded rating type to its corresponding RatingTypeOf value.
 *
 * This function decodes the rating type from its encoded form to a RatingTypeOf value, using a predefined mapping.
 * It's used in processes where the rating type is received in an encoded format and needs to be converted for usability.
 *
 * @param encodedType - The encoded rating type.
 * @returns - The decoded rating type.
 *
 * @internal
 */
function decodeRatingType(
  encodedType: PalletNetworkScoreRatingTypeOf
): RatingTypeOf {
  const index = extractEnumIndex(encodedType)
  return RatingTypeMapping[index]
}

/**
 * Decodes an encoded entry type to its corresponding EntryTypeOf value.
 *
 * This function is utilized for decoding the entry type from its encoded form to an EntryTypeOf value,
 * following a predefined mapping. This is necessary in scenarios where the entry type is received in an encoded format.
 *
 * @param encodedType - The encoded entry type.
 * @returns - The decoded entry type.
 *
 * @internal
 */
function decodeEntryType(
  encodedType: PalletNetworkScoreEntryTypeOf
): EntryTypeOf {
  const index = extractEnumIndex(encodedType)
  return EntryTypeMapping[index]
}

/**
 * Decodes an encoded rating value.
 *
 * This function decodes a numeric rating value from its encoded form. It divides the encoded rating by a modulus
 * (default is 10) to return the actual rating value. This is useful in converting ratings from a scaled or encoded format
 * to a human-readable format.
 *
 * @param encodedRating - The encoded rating value.
 * @param [modulus=10] - The modulus to be used for decoding (default is 10).
 * @returns - The decoded rating value.
 *
 * @internal
 */
function decodeRatingValue(encodedRating: number, modulus = 10): number {
  return encodedRating / modulus
}

/**
 * Decodes detailed information of a rating entry from its encoded blockchain representation.
 *
 * This function is responsible for translating the encoded rating entry data retrieved from the blockchain
 * into a more readable and structured format (IRatingChainStatus). It extracts various pieces of information
 * from the encoded entry, such as entity UID, provider UID, and rating type, and decodes them using utility
 * functions. The function also handles conditional data like reference IDs and converts timestamps into
 * a readable datetime format based on the specified timezone.
 *
 * @param encoded - The encoded rating entry data as retrieved from the blockchain.
 * @param stmtUri - The URI of the statement associated with the rating entry.
 * @param [timeZone='GMT'] - The timezone to use for converting timestamp data (default is 'GMT').
 *
 * @returns - The decoded rating entry details in a structured format.
 *
 * @internal
 */
function decodeEntryDetailsfromChain(
  encoded: Option<PalletNetworkScoreRatingEntry>,
  stmtUri: RatingEntryUri,
  timeZone = 'GMT'
): IRatingChainStatus {
  const chainEntry = encoded.unwrap()
  const encodedEntry = chainEntry.entry
  const decodedEntry: IRatingChainEntryDetails = {
    entityId: DecoderUtils.hexToString(encodedEntry.entityId.toString()),
    providerId: DecoderUtils.hexToString(encodedEntry.providerId.toString()),
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
 * Fetches and decodes the details of a specific rating entry from the blockchain.
 *
 * This asynchronous function is designed to retrieve a rating entry from the blockchain using its URI.
 * It translates the blockchain's encoded rating entry into a more readable and structured format.
 * If the rating entry is found, it decodes the details using the `decodeEntryDetailsfromChain` function.
 * If the entry does not exist on the blockchain, the function returns null. This function is crucial
 * for retrieving and interpreting rating data stored on the blockchain, making it accessible and usable
 * for further processing or display.
 *
 * @param ratingUri - The URI of the rating entry to be fetched from the blockchain.
 * @param [timeZone='GMT'] - The timezone to be used for date and time conversions (default is 'GMT').
 *
 * @returns - A promise that resolves to the decoded rating entry details or null if not found.
 *
 * @example
 * // Example usage of the function
 * const ratingUri = 'ratingUri123';
 *
 * fetchRatingDetailsfromChain(ratingUri, 'GMT')
 *   .then(entryDetails => {
 *     if (entryDetails) {
 *       console.log('Rating Entry Details:', entryDetails);
 *     } else {
 *       console.log('Rating Entry not found on the chain.');
 *     }
 *   })
 *   .catch(error => {
 *     console.error('Error fetching rating details:', error);
 *   });
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
 * Fetches and aggregates scores for a specific entity from the blockchain.
 *
 * This asynchronous function retrieves aggregate score data for a given entity from the blockchain.
 * If a specific rating type is provided, it fetches the aggregate score for that rating type. Otherwise,
 * it fetches aggregate scores across all rating types. The function decodes the retrieved data into a readable
 * and structured format (IAggregateScore). This function is crucial for analyzing and presenting an overview
 * of how an entity is rated across different parameters or overall.
 *
 * @param entity - The identifier of the entity for which aggregate scores are to be fetched.
 * @param [ratingType] - (Optional) The specific rating type to fetch the aggregate score for.
 *
 * @returns - A promise that resolves to an array of aggregate score objects, or null if no data is found.
 *
 * @example
 * // Example usage of the function to fetch aggregate scores for a specific entity and rating type
 * const entityId = 'entity123';
 * const ratingType = RatingTypeOf.overall;
 *
 * fetchEntityAggregateScorefromChain(entityId, ratingType)
 *   .then(aggregateScores => {
 *     if (aggregateScores) {
 *       console.log('Aggregate Scores:', aggregateScores);
 *     } else {
 *       console.log('No aggregate scores found for the specified entity and rating type.');
 *     }
 *   })
 *   .catch(error => {
 *     console.error('Error fetching aggregate scores:', error);
 *   });
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
        entityId: entity,
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
          entityId: DecoderUtils.hexToString(decodedEntityUri.toString()),
          ratingType: decodeRatingType(decodedRatingType),
          countOfTxn: value.countOfTxn.toNumber(),
          totalRating: decodeRatingValue(value.totalEncodedRating.toNumber()),
        })
      }
    })
  }
  return decodedEntries.length > 0 ? decodedEntries : null
}
