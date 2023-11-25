/**
 * @packageDocumentation
 * @module ChainSpace/Chain
 *
 * The ChainSpace/Chain submodule of the CORD blockchain system provides an essential interface for
 * managing and interacting with Chain Spaces at a granular level. It bridges the high-level
 * abstractions of Chain Spaces with the intricate details of blockchain data structures,
 * facilitating direct interaction with the blockchain's lower-level mechanisms.
 *
 * This module is instrumental in creating, querying, and manipulating Chain Spaces and their
 * associated authorizations, ensuring a robust and decentralized management of these entities
 * within the CORD ecosystem.
 *
 * Key Functionalities:
 * - `dispatchToChain`: Creates and dispatches a new Chain Space to the blockchain. This function
 *   checks for pre-existing Chain Spaces to avoid duplicates and oversees the entire process of
 *   transaction construction, signing, and submission.
 * - `isChainSpaceStored`: Efficiently queries the blockchain to verify the existence of a Chain Space
 *   based on its unique URI, facilitating integrity checks and data validation.
 * - `isAuthorizationStored`: Ascertains the presence of specific authorizations on the blockchain,
 *   playing a key role in managing access controls and delegation mechanisms.
 * - `getUriForSpace`: Generates distinct URIs for Chain Spaces and their authorizations, leveraging
 *   space digest and creator URI for creating unique and identifiable Chain Space entities.
 * - `sudoApproveChainSpace`: Empowers administrators or superusers with sudo privileges to approve
 *   Chain Spaces, an essential function for overseeing and controlling space allocations.
 * - `getUriForAuthorization`: Constructs unique URIs for authorizations, essential for unambiguous
 *   referencing and tracking of authorization entities in the system.
 * - `dispatchDelegateAuthorization`: Facilitates the delegation of authorizations for Chain Spaces,
 *   encompassing the nuances of transaction preparation and execution.
 *
 * As a core component of the CORD blockchain's infrastructure, this module plays a pivotal role in
 * maintaining the efficiency, security, and decentralization of Chain Space management.
 */
/* eslint-disable no-bitwise */

import type {
  DidUri,
  SpaceId,
  ChainSpaceDetails,
  AuthorizationId,
  AccountId,
  H256,
  ISpaceDetails,
  Option,
  ISpaceAuthorization,
  PermissionType,
  IChainSpace,
  CordKeyringPair,
  SignExtrinsicCallback,
  SpaceDigest,
  AuthorizationUri,
  SpaceUri,
} from '@cord.network/types'
import { SDKErrors } from '@cord.network/utils'
import { uriToIdentifier, hashToUri } from '@cord.network/identifier'

import {
  SPACE_IDENT,
  SPACE_PREFIX,
  AUTH_IDENT,
  AUTH_PREFIX,
  blake2AsHex,
  Bytes,
  Permission,
} from '@cord.network/types'
import { ConfigService } from '@cord.network/config'
import * as Did from '@cord.network/did'
import type {
  PalletChainSpaceSpaceDetails,
  PalletChainSpaceSpaceAuthorization,
  PalletChainSpacePermissions,
} from '@cord.network/augment-api'
import { Chain } from '@cord.network/network'

/**
 * Checks the existence of a Chain Space on the CORD blockchain.
 *
 * This function queries the blockchain to determine whether a Chain Space with the given URI exists.
 * It returns `true` if the Chain Space exists and `false` otherwise.
 *
 * @param spaceUri - The URI of the Chain Space to be checked.
 * @returns - A promise that resolves to `true` if the Chain Space exists, or `false` otherwise.
 *
 * @throws {SDKErrors.CordQueryError} - Thrown when an error occurs during the query to the blockchain.
 */
export async function isChainSpaceStored(spaceUri: SpaceUri): Promise<boolean> {
  try {
    const api = ConfigService.get('api')
    const identifier = uriToIdentifier(spaceUri)
    const encoded = await api.query.chainSpace.spaces(identifier)

    return !encoded.isNone
  } catch (error) {
    throw new SDKErrors.CordQueryError(
      `Error querying the chain space: ${error}`
    )
  }
}

/**
 * Checks if a given authorization exists on the CORD blockchain.
 *
 * This function queries the blockchain to determine whether an authorization with the given ID exists.
 * It returns `true` if the authorization exists and `false` otherwise.
 *
 * @param authorizationUri - The AuthorizationId to check for existence on the blockchain.
 * @returns - A promise that resolves to `true` if the authorization exists, `false` otherwise.
 *
 * @throws {SDKErrors.CordQueryError} - Thrown when an error occurs during the query to the blockchain.
 */
export async function isAuthorizationStored(
  authorizationUri: AuthorizationUri
): Promise<boolean> {
  try {
    const api = ConfigService.get('api')
    const identifier = uriToIdentifier(authorizationUri)
    const encoded = await api.query.chainSpace.authorizations(identifier)

    return !encoded.isNone
  } catch (error) {
    throw new SDKErrors.CordQueryError(
      `Error querying authorization existence: ${error}`
    )
  }
}

/**
 * (Internal Function) - Generates unique URIs for a ChainSpace and its associated authorization based on the space digest and creator URI.
 * This internal function computes the ChainSpace URI and the authorization URI by hashing the space digest and
 * creator URI. These URIs serve as unique identifiers within the blockchain system.
 *
 * @param spaceDigest - The digest of the space, typically a hash value representing the
 *        content or configuration of the space.
 * @param creatorUri - The decentralized identifier (DID) URI of the creator of the space.
 *        This identifier contributes to the uniqueness of the generated URIs.
 *
 * @returns - A promise that resolves to an object containing two URIs:
 *          `uri`, which is the unique identifier for the ChainSpace, and `authUri`, which is the unique
 *          identifier for the associated authorization.
 *
 * The function operates by encoding the provided space digest and creator URI into binary format,
 * computing a BLAKE2 hash of the combined binary data, and then converting these hashes into URIs
 * using the `hashToUri` function. This process ensures unique and consistent identifiers for both
 * the ChainSpace and its authorization.
 *
 * @internal
 * Note: This function is part of the internal logic of the module and is not intended for external use.
 */
export async function getUriForSpace(
  spaceDigest: SpaceDigest,
  creatorUri: DidUri
): Promise<ChainSpaceDetails> {
  const api = ConfigService.get('api')
  const scaleEncodedSpaceDigest = api
    .createType<H256>('H256', spaceDigest)
    .toU8a()
  const scaleEncodedCreator = api
    .createType<AccountId>('AccountId', Did.toChain(creatorUri))
    .toU8a()
  const digest = blake2AsHex(
    Uint8Array.from([...scaleEncodedSpaceDigest, ...scaleEncodedCreator])
  )

  const chainSpaceUri = hashToUri(digest, SPACE_IDENT, SPACE_PREFIX) as SpaceUri
  const scaleEncodedAuthDigest = api
    .createType<Bytes>('Bytes', uriToIdentifier(chainSpaceUri))
    .toU8a()
  const scaleEncodedAuthDelegate = api
    .createType<AccountId>('AccountId', Did.toChain(creatorUri))
    .toU8a()

  const authDigest = blake2AsHex(
    Uint8Array.from([...scaleEncodedAuthDigest, ...scaleEncodedAuthDelegate])
  )

  const authorizationUri = hashToUri(
    authDigest,
    AUTH_IDENT,
    AUTH_PREFIX
  ) as AuthorizationUri

  const chainSpaceDetails = {
    uri: chainSpaceUri,
    authorizationUri,
  }

  return chainSpaceDetails
}

/**
 * Dispatches a ChainSpace creation transaction to the blockchain.
 *
 * This function is responsible for creating a new ChainSpace on the blockchain. It checks if the
 * ChainSpace with the given URI already exists on the chain. If it does not exist, the function
 * constructs and submits a transaction to create the ChainSpace. The transaction is authorized
 * by the creator and signed by the provided author account.
 *
 * @param chainSpace - The ChainSpace object containing the necessary information
 *        for creating the ChainSpace on the blockchain. This includes the URI, digest, and authorization.
 * @param creatorUri - The DID URI of the creator of the ChainSpace. This identifier is
 *        used to authorize the transaction.
 * @param authorAccount - The blockchain account used to sign and submit the transaction.
 * @param signCallback - A callback function that handles the signing of the transaction.
 *
 * @returns - A promise that resolves to an object
 *          containing the URI and authorization ID of the dispatched ChainSpace.
 *
 * @throws {SDKErrors.CordDispatchError} - Thrown when there is an error during the dispatch process,
 *         such as issues with constructing the transaction, signing, or submission to the blockchain.
 *
 * Example usage:
 * ```typescript
 * const chainSpace: IChainSpace = {
 *   // ... initialization of chainSpace properties ...
 * };
 * const creatorUri: DidUri = 'did:cord:creator_uri';
 * const authorAccount: CordKeyringPair = // ... initialization ...
 * const signCallback: SignExtrinsicCallback = // ... implementation ...
 *
 * try {
 *   const result = await dispatchToChain(chainSpace, creatorUri, authorAccount, signCallback);
 *   console.log('ChainSpace dispatched with URI:', result.uri);
 * } catch (error) {
 *   console.error('Error dispatching ChainSpace:', error);
 * }
 * ```
 */
export async function dispatchToChain(
  chainSpace: IChainSpace,
  creatorUri: DidUri,
  authorAccount: CordKeyringPair,
  signCallback: SignExtrinsicCallback
): Promise<{ uri: SpaceUri; authorization: AuthorizationUri }> {
  const returnObject = {
    uri: chainSpace.uri,
    authorization: chainSpace.authorizationUri,
  }

  try {
    const api = ConfigService.get('api')

    const exists = await isChainSpaceStored(chainSpace.uri)
    if (!exists) {
      const tx = api.tx.chainSpace.create(chainSpace.digest)
      const extrinsic = await Did.authorizeTx(
        creatorUri,
        tx,
        signCallback,
        authorAccount.address
      )

      await Chain.signAndSubmitTx(extrinsic, authorAccount)
    }

    return returnObject
  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${error}".`
    )
  }
}

/**
 * Approves a space in the blockchain system using a sudo (superuser do) operation.
 * This function is typically used by administrators or superusers to approve a space
 * with a specified capacity. It utilizes the `sudo` functionality to execute an operation
 * that would otherwise be restricted.
 *
 * @param authority - The superuser's blockchain account, which has the necessary
 *        permissions to perform sudo operations. This account is used to sign and submit the transaction.
 * @param spaceUri - The URI of the space that is being approved. This identifier
 *        is used to locate the space on the blockchain.
 * @param capacity - The capacity to be approved for the space. This value sets the limit
 *        or quota for the space's transaction capacity.
 *
 * @throws {SDKErrors.CordDispatchError} - Thrown when there is an error during the dispatch process,
 *         such as issues with constructing the transaction, signing, or submission to the blockchain.
 *
 * Example usage:
 * ```typescript
 * const authority: CordKeyringPair = // ... initialization ...
 * const spaceUri: IChainSpace['uri'] = 'space:example_uri';
 * const capacity: number = 100;
 *
 * try {
 *   await sudoApproveChainSpace(authority, spaceUri, capacity);
 *   console.log('Space approved successfully');
 * } catch (error) {
 *   console.error('Error approving space:', error);
 * }
 * ```.
 */
export async function sudoApproveChainSpace(
  authority: CordKeyringPair,
  spaceUri: SpaceUri,
  capacity: number
) {
  try {
    const api = ConfigService.get('api')
    const spaceId = uriToIdentifier(spaceUri)

    const tx = api.tx.chainSpace.approve(spaceId, capacity)
    const sudoExtrinsic = api.tx.sudo.sudo(tx)

    await Chain.signAndSubmitTx(sudoExtrinsic, authority)
  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain:"${error}".`
    )
  }
}

/**
 * (Internal Function) - Generates a unique URI for an authorization based on the space URI, delegate URI, and creator URI.
 * This is an internal function used to create a standardized and unique identifier for an authorization
 * within the system, ensuring that each authorization can be distinctly referenced.
 *
 * @param spaceUri - The URI of the space associated with the authorization. This identifier
 *        is used as part of the input for generating the unique authorization URI.
 * @param delegateUri - The decentralized identifier (DID) URI of the delegate involved in the
 *        authorization. It contributes to the uniqueness of the generated authorization URI.
 * @param creatorUri - The DID URI of the creator of the authorization. This identifier is
 *        also used to ensure the uniqueness of the authorization URI.
 *
 * @returns - A promise that resolves to the unique AuthorizationId, which
 *          serves as a standardized identifier for the authorization within the system.
 *
 * The function operates by encoding the provided URIs into a binary format and then combining them.
 * It then computes a BLAKE2 hash of the combined binary data, which is subsequently converted into
 * a URI format using `hashToUri`. This process ensures that each authorization has a distinct and
 * consistent identifier that can be used for referencing and retrieval within the blockchain system.
 *
 * @internal
 */
export async function getUriForAuthorization(
  spaceUri: SpaceId,
  delegateUri: DidUri,
  creatorUri: DidUri
): Promise<AuthorizationUri> {
  const api = ConfigService.get('api')

  const scaleEncodedSpaceId = api
    .createType<Bytes>('Bytes', uriToIdentifier(spaceUri))
    .toU8a()
  const scaleEncodedAuthDelegate = api
    .createType<AccountId>('AccountId', Did.toChain(delegateUri))
    .toU8a()
  const scaleEncodedAuthCreator = api
    .createType<AccountId>('AccountId', Did.toChain(creatorUri))
    .toU8a()

  const authDigest = blake2AsHex(
    Uint8Array.from([
      ...scaleEncodedSpaceId,
      ...scaleEncodedAuthDelegate,
      ...scaleEncodedAuthCreator,
    ])
  )

  const authorizationUri = hashToUri(
    authDigest,
    AUTH_IDENT,
    AUTH_PREFIX
  ) as AuthorizationUri

  return authorizationUri
}

/**
 * (Internal Function) - Constructs a transaction for delegate authorization based on the specified permission type.
 * This is an internal function used within the module to handle the creation of specific
 * transaction types for delegate authorization in the blockchain system.
 *
 * @param permission - The type of permission being granted, determining
 *        the specific transaction type to be created (e.g., addDelegate, addDelegator, addAdminDelegate).
 * @param spaceId - The identifier of the space to which the delegate authorization is being added.
 * @param delegateId - The decentralized identifier (DID) of the delegate receiving the authorization.
 * @param authId - The identifier of the specific authorization transaction being constructed.
 *
 * @returns The constructed transaction object, ready for signing and submission to the blockchain.
 *          The exact type of transaction depends on the provided permission.
 *
 * @throws {SDKErrors.InvalidPermissionError} - Thrown if an invalid permission type is provided, indicating
 *         a configuration or usage error within the module.
 *
 * @internal
 */
function dispatchDelegateAuthorizationTx(
  permission: PermissionType,
  spaceId: string,
  delegateId: string,
  authId: string
) {
  const api = ConfigService.get('api')

  switch (permission) {
    case Permission.ASSERT:
      return api.tx.chainSpace.addDelegate(spaceId, delegateId, authId)
    case Permission.DELEGATE:
      return api.tx.chainSpace.addDelegator(spaceId, delegateId, authId)
    case Permission.ADMIN:
      return api.tx.chainSpace.addAdminDelegate(spaceId, delegateId, authId)
    default:
      throw new SDKErrors.InvalidPermissionError(
        `Permission not valid:"${permission}".`
      )
  }
}

/**
 * Dispatches a delegate authorization transaction to the blockchain.
 *
 * This function is responsible for submitting a delegate authorization request to the blockchain.
 * It first checks if the authorization already exists on-chain. If it does not, the function
 * constructs and submits a transaction to authorize a delegate for a specific space.
 * The transaction is signed using the provided `authorAccount` and is authorized by the
 * `request.delegator` using the capabilityDelegation key.
 *
 * @param request - The space authorization request containing all the necessary
 *        information to dispatch the authorization. This includes the space ID, delegate DID, permission
 *        type, authorization ID, and delegator DID.
 * @param authorAccount - The blockchain account used to sign and submit the transaction.
 * @param authorizationUri - The URI of the authorization used for delegating permissions.
 * @param signCallback - A callback function that handles the signing of the transaction.
 *
 * @returns - A promise that resolves to the authorization ID once the transaction
 *          is successfully processed by the blockchain.
 *
 * @throws {SDKErrors.CordDispatchError} - Thrown when there's an error during the dispatch process, such as
 *         issues with constructing the transaction, signing, or submission to the blockchain.
 *
 * Example usage:
 * ```typescript
 * const request: ISpaceAuthorization = {
 *   // ... initialization of request properties ...
 * };
 * const authorAccount: CordKeyringPair = // ... initialization ...
 * const authorizationUri: AuthorizationId = // ... initialization ...
 * const signCallback: SignExtrinsicCallback = // ... implementation ...
 *
 * try {
 *   const authorizationId = await dispatchDelegateAuthorization(
 *     request,
 *     authorAccount,
 *     authorizationUri,
 *     signCallback
 *   );
 *   console.log('Authorization dispatched with ID:', authorizationId);
 * } catch (error) {
 *   console.error('Error dispatching authorization:', error);
 * }
 * ```
 */
export async function dispatchDelegateAuthorization(
  request: ISpaceAuthorization,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<AuthorizationId> {
  try {
    const spaceId = uriToIdentifier(request.uri)
    const delegateId = Did.toChain(request.delegateUri)
    const delegatorAuthId = uriToIdentifier(authorizationUri)

    console.log(request.permission, spaceId, delegateId, delegatorAuthId)

    const tx = dispatchDelegateAuthorizationTx(
      request.permission,
      spaceId,
      delegateId,
      delegatorAuthId
    )
    const extrinsic = await Did.authorizeTx(
      request.delegatorUri as DidUri,
      tx,
      signCallback,
      authorAccount.address
    )

    await Chain.signAndSubmitTx(extrinsic, authorAccount)

    return request.authorizationUri
  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error dispatching delegate authorization: ${error}`
    )
  }
}

/**
 * (Internal Function) - Decodes the details of a space from its blockchain-encoded representation.
 *
 * This internal function is used to translate space details stored on the blockchain
 * into a more application-friendly format defined by the `ISpaceDetails` interface.
 * It takes the blockchain-specific encoded data and converts it into a structured
 * object that is easier to work with within the application.
 *
 * @param encoded - The encoded space details
 *        retrieved from the blockchain. This data is typically in a format specific
 *        to the blockchain and needs to be decoded for application use.
 * @param spaceUri - The unique identifier of the space for which the details
 *        are being decoded. This URI is used to identify the correct space record on
 *        the blockchain.
 *
 * @returns - An `ISpaceDetails` object containing the decoded space details.
 *          This object includes fields such as the space URI, creator DID, transaction capacity,
 *          transaction usage, approval status, and archival status, making it easier to
 *          work with space data within the application.
 *
 * @internal
 */
function decodeSpaceDetailsfromChain(
  encoded: Option<PalletChainSpaceSpaceDetails>,
  spaceUri: SpaceUri
): ISpaceDetails {
  const chainStatement = encoded.unwrap()
  const decodedDetails: ISpaceDetails = {
    uri: spaceUri,
    creatorUri: Did.fromChain(chainStatement.creator),
    txnCapacity: chainStatement.txnCapacity.toNumber(),
    txnUsage: chainStatement.txnCount.toNumber(),
    approved: chainStatement.approved.valueOf(),
    archive: chainStatement.archive.valueOf(),
  }

  return decodedDetails
}

/**
 * Fetches space details from the blockchain based on a given space URI.
 *
 * This function queries CORD to retrieve details about a specific space.
 * It uses the provided `spaceUri` to fetch the corresponding space entry from the blockchain.
 * If the space details are found, they are decoded and returned. If no space is found
 * with the provided URI, an error is thrown.
 *
 * @param spaceUri - The unique identifier of the space to be fetched.
 *
 * @returns - A promise that resolves to the space details
 *          if found. The function throws an error if the space details could not be decoded
 *          or if the space is not found on the chain.
 *
 * @throws {SDKErrors.ChainSpaceMissingError} - Thrown when no space is found with the provided URI.
 * @throws {SDKErrors.CordFetchError} - Thrown when an error occurs during the fetching process,
 *         such as network issues or problems with querying the blockchain.
 *
 * Example usage:
 * ```typescript
 * const spaceUri = 'space:example_uri';
 * try {
 *   const spaceDetails = await fetchFromChain(spaceUri);
 *   console.log('Space Details:', spaceDetails);
 * } catch (error) {
 *   console.error('Error fetching space from chain:', error);
 * }
 * ```.
 */
export async function fetchFromChain(
  spaceUri: SpaceUri
): Promise<ISpaceDetails | null> {
  try {
    const api = ConfigService.get('api')
    const spaceId = uriToIdentifier(spaceUri)

    const spaceEntry = await api.query.chainSpace.spaces(spaceId)
    const spaceDetails = decodeSpaceDetailsfromChain(spaceEntry, spaceUri)

    if (spaceDetails === null) {
      throw new SDKErrors.ChainSpaceMissingError(
        `There is no chain space with the provided ID "${spaceUri}" present on the chain.`
      )
    }

    return spaceDetails
  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error occurred while fetching from the chain: ${error}`
    )
  }
}

/**
 * (Internal Function) - Decodes a numeric permission bitset from the blockchain into a `PermissionType`.
 *
 * This internal function interprets the encoded permission data from the blockchain
 * and translates it into a `PermissionType`, which is a numeric value representing
 * the combined set of permissions. The function checks for specific permissions
 * (ASSERT, DELEGATE, ADMIN) within the bitset and combines them into a single value
 * using bitwise operations.
 *
 * @param encoded - The encoded permission data from the blockchain.
 *        This typically comes in the form of a bitset where each bit represents a different permission.
 *
 * @returns - The combined permissions represented as a single numeric value.
 *          Each bit in this value corresponds to a specific permission, as defined in the `Permission` constant.
 *
 * Example:
 * A bitset value of `0b0000_0111` would translate to a `PermissionType` value
 * representing ASSERT, DELEGATE, and ADMIN permissions combined.
 *
 * @internal
 */
function authorizationPermissionsFromChain(
  encoded: PalletChainSpacePermissions
): PermissionType {
  const bitset = encoded.bits.toNumber()
  let permissions = 0

  // Combining permissions using bitwise operations
  if ((bitset & Permission.ASSERT) > 0) {
    permissions |= Permission.ASSERT
  }
  if ((bitset & Permission.DELEGATE) > 0) {
    permissions |= Permission.DELEGATE
  }
  if ((bitset & Permission.ADMIN) > 0) {
    permissions |= Permission.ADMIN
  }

  return permissions
}

/**
 * (Internal Function) - Decodes the details of a space authorization from its blockchain representation. This internal
 * function is used to translate the blockchain-specific data format into a more user-friendly
 * and application-oriented format defined by the `ISpaceAuthorization` interface.
 *
 * @param encoded - The encoded authorization details
 *        retrieved from the blockchain. This data is typically in a format specific to the blockchain
 *        and needs to be decoded for application use.
 * @param authorization - The specific authorization ID for which the details are
 *        being decoded. This ID is used to identify the correct authorization record on the blockchain.
 *
 * @param authorizationUri
 * @returns - Returns an `ISpaceAuthorization` object containing the decoded
 *          authorization details. This object includes fields such as the space ID, delegate DID,
 *          permissions, authorization ID, and delegator DID, making it easier to work with
 *          authorization data within the application.
 *
 * This function is essential for processing and utilizing authorization data within the system,
 * converting it from a blockchain-centric representation to a structured format that aligns with
 * the application's data models.
 *
 * @internal
 */
function decodeAuthorizationDetailsfromChain(
  encoded: Option<PalletChainSpaceSpaceAuthorization>,
  authorizationUri: AuthorizationUri
): ISpaceAuthorization {
  const chainAuth = encoded.unwrap()
  const decodedDetails: ISpaceAuthorization = {
    uri: chainAuth.spaceId.toString() as SpaceUri,
    delegateUri: Did.fromChain(chainAuth.delegate),
    permission: authorizationPermissionsFromChain(chainAuth.permissions),
    authorizationUri,
    delegatorUri: Did.fromChain(chainAuth.delegator),
  }
  return decodedDetails
}

/**
 * Fetches authorization details from CORD chain based on a given authorization ID.
 *
 * This function queries CORD to retrieve details about a specific authorization.
 * It uses the provided `authorization` ID to fetch the corresponding entry from the chain.
 * If the authorization details are found, they are decoded and returned. If no authorization
 * is found with the provided ID, an error is thrown.
 *
 * @param authorization - The unique identifier of the authorization to be fetched.
 *
 * @param authorizationUri
 * @returns A promise that resolves to the authorization details
 *          if found. The function returns `null` if the authorization details could not be decoded
 *          or if the authorization is not found on the chain.
 *
 * @throws {SDKErrors.AuthorizationMissingError} Thrown when no authorization is found with the provided ID.
 * @throws {SDKErrors.CordFetchError} Thrown when an error occurs during the fetching process,
 *         such as network issues or problems with querying the blockchain.
 *
 * Example usage:
 * ```typescript
 * const authorizationId = 'auth:cord:example_id';
 * try {
 *   const authorizationDetails = await fetchAuthorizationFromChain(authorizationId);
 *   console.log('Authorization Details:', authorizationDetails);
 * } catch (error) {
 *   console.error('Error fetching authorization:', error);
 * }
 * ```.
 */
export async function fetchAuthorizationFromChain(
  authorizationUri: AuthorizationUri
): Promise<ISpaceAuthorization | null> {
  try {
    const api = ConfigService.get('api')
    const authId = uriToIdentifier(authorizationUri)

    const authEntry = await api.query.chainSpace.authorizations(authId)
    const authDetails: ISpaceAuthorization =
      decodeAuthorizationDetailsfromChain(authEntry, authorizationUri)

    if (authDetails === null) {
      throw new SDKErrors.AuthorizationMissingError(
        `There is no authorization with the provided ID "${authorizationUri}" present on the chain.`
      )
    }

    return authDetails
  } catch (error) {
    throw new SDKErrors.CordFetchError(
      `Error occurred while fetching authorization: ${error}`
    )
  }
}
