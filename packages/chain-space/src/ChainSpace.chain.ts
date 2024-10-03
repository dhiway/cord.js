/**
 * @packageDocumentation
 * @module ChainSpace/Chain
 * @preferred
 *
 * The `ChainSpace/Chain` submodule is a vital component of the CORD SDK, facilitating direct interactions with
 * Chain Spaces on the CORD blockchain. This module bridges the high-level abstractions of Chain Spaces with the
 * underlying blockchain data structures, enabling the creation, querying, and manipulation of Chain Spaces and
 * their associated authorizations.
 *
 * Key functionalities include:
 * - Creation and dispatch of Chain Spaces to the blockchain.
 * - Querying the blockchain for the existence of Chain Spaces and authorizations.
 * - Generation of unique URIs for Chain Spaces and authorizations.
 * - Administration functions like sudo approvals for Chain Spaces.
 *
 * This module is essential for the structured management of Chain Spaces, offering robust and decentralized
 * control within the CORD ecosystem.
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
  SubmittableExtrinsic
} from '@cord.network/types'
import { SDKErrors, DecoderUtils } from '@cord.network/utils'
import {
  uriToIdentifier,
  hashToUri,
  identifierToUri,
} from '@cord.network/identifier'

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
 * @remarks
 * Queries the blockchain to determine if a Chain Space with the given URI exists, returning `true` if it does, and `false` otherwise.
 *
 * @example
 * ```typescript
 * const spaceUri = 'space:example_uri';
 * isChainSpaceStored(spaceUri).then(exists => {
 *   console.log(`Chain Space ${exists ? 'exists' : 'does not exist'} on the blockchain.`);
 * }).catch(error => {
 *   console.error('Error querying Chain Space existence:', error);
 * });
 * ```
 *
 * @param spaceUri - The URI of the Chain Space to be checked.
 * @returns A promise resolving to `true` if the Chain Space exists, or `false` otherwise.
 * @throws {SDKErrors.CordQueryError} - Thrown on error during the blockchain query.
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
 * @remarks
 * Queries the blockchain to verify the presence of an authorization, identified by the given URI.
 *
 * @example
 * ```typescript
 * const authorizationUri = 'auth:example_uri';
 * isAuthorizationStored(authorizationUri).then(exists => {
 *   console.log(`Authorization ${exists ? 'exists' : 'does not exist'} on the blockchain.`);
 * }).catch(error => {
 *   console.error('Error querying authorization existence:', error);
 * });
 * ```
 *
 * @param authorizationUri - The URI of the authorization to check.
 * @returns A promise resolving to `true` if the authorization exists, `false` otherwise.
 * @throws {SDKErrors.CordQueryError} - Thrown on error during the blockchain query.
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
 * Generates unique URIs for a ChainSpace and its associated authorization.
 *
 * @remarks
 * Utilizes the ChainSpace's digest and creator URI to create unique and identifiable URIs for the ChainSpace and its authorization.
 *
 * @example
 * ```typescript
 * const spaceDigest = 'example_digest';
 * const creatorUri = 'did:cord:creator_uri';
 * getUriForSpace(spaceDigest, creatorUri).then(({ uri, authorizationUri }) => {
 *   console.log(`ChainSpace URI: ${uri}, Authorization URI: ${authorizationUri}`);
 * }).catch(error => {
 *   console.error('Error generating URIs:', error);
 * });
 * ```
 *
 * @param spaceDigest - The digest representing the content or configuration of the ChainSpace.
 * @param creatorUri - The DID URI of the creator of the ChainSpace.
 * @returns A promise resolving to an object containing the ChainSpace URI and authorization URI.
 * @internal
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
    Uint8Array.from([...scaleEncodedAuthDigest, ...scaleEncodedAuthDelegate, ...scaleEncodedAuthDelegate])
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
 * Prepares the creation of a chain space extrinsic for later dispatch to the blockchain.
 * @param chainSpace - The ChainSpace object containing necessary information for creating the ChainSpace on the blockchain.
 * @param creatorUri - The DID URI of the creator, used to authorize the transaction.
 * @param signCallback - The callback function for signing the transaction.
 * @param authorAccount - The blockchain account used for signing and submitting the transaction.
 * @returns The prepared extrinsic ready for batch signing and submitting.
 */
export async function prepareCreateSpaceExtrinsic(
  chainSpace: IChainSpace,
  creatorUri: DidUri,
  signCallback: SignExtrinsicCallback,
  authorAccount: CordKeyringPair
): Promise<SubmittableExtrinsic> {
  try {
    const api = ConfigService.get('api')

    const tx = api.tx.chainSpace.create(chainSpace.digest)
    const extrinsic = await Did.authorizeTx(
      creatorUri,
      tx,
      signCallback,
      authorAccount.address
    )
    return extrinsic;


  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error preparing extrinsic for creation of chainspace: "${error}".`
    );
  }
}

/**
 * Dispatches a ChainSpace creation transaction to the CORD blockchain.
 *
 * @remarks
 * Responsible for creating a new ChainSpace on the blockchain. It first checks if the ChainSpace with the
 * given URI already exists to avoid duplicates. If not, it constructs and submits a transaction to create
 * the ChainSpace. The transaction requires authorization from the creator and is signed by the specified author account.
 *
 * @example
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
 *
 * @param chainSpace - The ChainSpace object containing necessary information for creating the ChainSpace on the blockchain.
 * @param creatorUri - The DID URI of the creator, used to authorize the transaction.
 * @param authorAccount - The blockchain account used for signing and submitting the transaction.
 * @param signCallback - The callback function for signing the transaction.
 * @returns A promise resolving to an object containing the ChainSpace URI and authorization ID.
 * @throws {SDKErrors.CordDispatchError} - Thrown when there's an error during the dispatch process.
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
    const exists = await isChainSpaceStored(chainSpace.uri)
    if (!exists) {
        const extrinsic = await prepareCreateSpaceExtrinsic(chainSpace, creatorUri, signCallback, authorAccount)
        await Chain.signAndSubmitTx(extrinsic, authorAccount)
        return returnObject
    }
    else{
      throw new SDKErrors.CordDispatchError(
        `Error dispatching to chain: Chainspace already exists.`
      )
    }
  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${error}".`
    )
  }
}

/**
 * Prepares the creation of a sub-space extrinsic for later dispatch to the blockchain.
 * @param chainSpace - The ChainSpace object containing necessary information for creating the ChainSpace on the blockchain.
 * @param authorAccount - The blockchain account used for signing and submitting the transaction.
 * @param parent - The chainspace under which the sub-space will be created.
 * @param count - The count of transactions permitted to be performed on the chain for the subspace.
 * @param creatorUri - The DID URI of the creator, used to authorize the transaction.
 * @returns The prepared extrinsic ready for batch signing and submitting.
 */
export async function prepareCreateSubSpaceExtrinsic(
  chainSpace: IChainSpace,
  authorAccount: CordKeyringPair,
  count: number,
  parent: SpaceUri,
  creatorUri: DidUri,
  signCallback: SignExtrinsicCallback
): Promise<SubmittableExtrinsic> {
  try {
    const api = ConfigService.get('api')

    const tx = api.tx.chainSpace.subspaceCreate(chainSpace.digest, count, parent?.replace('space:cord:', ''))
    const extrinsic = await Did.authorizeTx(
      creatorUri,
      tx,
      signCallback,
      authorAccount.address
    )

    return extrinsic;
  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error preparing extrinsic: "${error}".`
    )
  }
}

/**
 * Dispatches a Sub-ChainSpace creation transaction to the CORD blockchain.
 *
 * @remarks
 * Responsible for creating a new ChainSpace on the blockchain. It first checks if the ChainSpace with the
 * given URI already exists to avoid duplicates. If not, it constructs and submits a transaction to create
 * the ChainSpace. The transaction requires authorization from the creator and is signed by the specified author account.
 *
 * @example
 * ```typescript
 * const chainSpace: IChainSpace = {
 *   // ... initialization of chainSpace properties ...
 * };
 * const creatorUri: DidUri = 'did:cord:creator_uri';
 * const authorAccount: CordKeyringPair = // ... initialization ...
 * const signCallback: SignExtrinsicCallback = // ... implementation ...
 *
 * try {
 *   const result = await dispatchSubspaceCreateToChain(chainSpace, creatorUri, authorAccount, signCallback);
 *   console.log('ChainSpace dispatched with URI:', result.uri);
 * } catch (error) {
 *   console.error('Error dispatching ChainSpace:', error);
 * }
 * ```
 *
 * @param chainSpace - The ChainSpace object containing necessary information for creating the ChainSpace on the blockchain.
 * @param creatorUri - The DID URI of the creator, used to authorize the transaction.
 * @param authorAccount - The blockchain account used for signing and submitting the transaction.
 * @param signCallback - The callback function for signing the transaction.
 * @returns A promise resolving to an object containing the ChainSpace URI and authorization ID.
 * @throws {SDKErrors.CordDispatchError} - Thrown when there's an error during the dispatch process.
 */
export async function dispatchSubspaceCreateToChain(
  chainSpace: IChainSpace,
  creatorUri: DidUri,
  authorAccount: CordKeyringPair,
  count: number,
  parent: SpaceUri,
  signCallback: SignExtrinsicCallback
): Promise<{ uri: SpaceUri; authorization: AuthorizationUri }> {
  const returnObject = {
    uri: chainSpace.uri,
    authorization: chainSpace.authorizationUri,
  }

  try {
    
    const extrinsic = await prepareCreateSubSpaceExtrinsic(
      chainSpace,
      authorAccount,
      count,
      parent,
      creatorUri,
      signCallback
    )
    await Chain.signAndSubmitTx(extrinsic, authorAccount)

    return returnObject;
  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${error}".`
    )
  }
}



/**
 * Approves a ChainSpace on the CORD blockchain using sudo privileges.
 *
 * @remarks
 * Allows administrators or superusers to approve ChainSpaces, crucial for overseeing space allocations.
 *
 * @example
 * ```typescript
 * const authority = 'authority_account';
 * const spaceUri = 'space:example_uri';
 * const capacity = 100;
 * sudoApproveChainSpace(authority, spaceUri, capacity).then(() => {
 *   console.log('ChainSpace approved successfully');
 * }).catch(error => {
 *   console.error('Error approving ChainSpace:', error);
 * });
 * ```
 *
 * @param authority - The account with sudo privileges to approve the ChainSpace.
 * @param spaceUri - The URI of the ChainSpace to be approved.
 * @param capacity - The approved capacity for the ChainSpace.
 * @throws {SDKErrors.CordDispatchError} - Thrown on error during the dispatch process.
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
 * Generates a unique URI for an authorization within a ChainSpace.
 *
 * @remarks
 * Constructs a standardized URI for an authorization entity, ensuring unambiguous referencing within the system.
 *
 * @example
 * ```typescript
 * const spaceUri = 'space:example_uri';
 * const delegateUri = 'did:example:delegate_uri';
 * const creatorUri = 'did:example:creator_uri';
 * getUriForAuthorization(spaceUri, delegateUri, creatorUri).then(authorizationUri => {
 *   console.log(`Authorization URI: ${authorizationUri}`);
 * }).catch(error => {
 *   console.error('Error generating authorization URI:', error);
 * });
 * ```
 *
 * @param spaceUri - The URI of the ChainSpace.
 * @param delegateUri - The DID URI of the delegate involved in the authorization.
 * @param creatorUri - The DID URI of the creator of the authorization.
 * @returns A promise resolving to the unique authorization URI.
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
 * Dispatches a delegate authorization request to the CORD blockchain.
 *
 * @remarks
 * This function handles the submission of delegate authorization requests to the CORD blockchain. It manages
 * the process of transaction preparation, signing, and submission, facilitating the delegation of specific
 * permissions within a ChainSpace. The function ensures that the authorization is correctly dispatched to
 * the blockchain with the necessary signatures.
 *
 *
 * @param permission - The type of permission being granted.
 * @param spaceId - The identifier of the space to which the delegate authorization is being added.
 * @param delegateId - The decentralized identifier (DID) of the delegate receiving the authorization.
 * @param authId - The identifier of the specific authorization transaction being constructed.
 * @throws {SDKErrors.CordDispatchError} - Thrown when there's an error during the dispatch process.
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
 * Dispatches a delegate authorization transaction to the CORD blockchain.
 *
 * @remarks
 * This function manages the process of submitting a delegate authorization request to the blockchain. It checks if
 * the specified authorization already exists. If it does not, the function constructs and submits a transaction to
 * authorize a delegate for a specific space. The transaction is authorized by the delegator's DID and signed using
 * the provided blockchain account.
 *
 * @example
 * ```typescript
 * const request: ISpaceAuthorization = {
 *   uri: 'space:example_uri',
 *   delegateUri: 'did:example:delegateUri',
 *   permission: PermissionType.EXAMPLE_PERMISSION,
 *   authorizationUri: 'auth:example_uri',
 *   delegatorUri: 'did:example:creatorUri'
 * };
 * const authorAccount: CordKeyringPair = {  ...  };
 * const authorizationUri: AuthorizationUri = 'auth:example_uri';
 * const signCallback: SignExtrinsicCallback = (tx) => {  ...  };
 *
 * dispatchDelegateAuthorization(request, authorAccount, authorizationUri, signCallback)
 *   .then(authorizationId => {
 *     console.log('Authorization dispatched with ID:', authorizationId);
 *   })
 *   .catch(error => {
 *     console.error('Error dispatching authorization:', error);
 *   });
 * ```
 *
 * @param request - The space authorization request containing necessary information for dispatching the authorization.
 * @param authorAccount - The blockchain account used to sign and submit the transaction.
 * @param authorizationUri - The URI of the authorization used for delegating permissions.
 * @param signCallback - A callback function that handles the signing of the transaction.
 * @returns A promise resolving to the authorization ID after successful processing by the blockchain.
 * @throws {SDKErrors.CordDispatchError} - Thrown on error during the dispatch process.
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
 * Decodes the details of a space from its blockchain-encoded representation.
 *
 * @remarks
 * This internal function is pivotal for converting blockchain-specific encoded data into a structured
 * format that aligns with the `ISpaceDetails` interface. It is used to interpret and transform data
 * stored on the blockchain into a format that is more accessible and meaningful for application use.
 *
 * @param encoded - The blockchain-encoded representation of space details. This data is typically
 *        stored in a format specific to the blockchain and requires decoding to be used in applications.
 * @param spaceUri - The unique identifier (URI) of the space. This URI helps in identifying the correct
 *        space record on the blockchain for which details are to be decoded.
 *
 * @returns An `ISpaceDetails` object containing the decoded space details, including the space URI,
 *          creator's DID, transaction capacity, transaction usage, approval status, and archival status.
 *          This structured format simplifies interaction with space data within the application context.
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
 * @remarks
 * This function queries the CORD blockchain to retrieve details about a specific space, identified by the `spaceUri`.
 * It decodes the blockchain data into a more accessible format. If the space details are not found or cannot be decoded,
 * the function throws an error.
 *
 * @param spaceUri - The unique identifier (URI) of the space to be fetched.
 *
 * @returns A promise that resolves to the space details if found. The details include information such as
 *          the space URI, creator DID, transaction capacity, and other relevant data.
 *
 * @throws {SDKErrors.ChainSpaceMissingError} - Thrown when no space is found with the provided URI.
 * @throws {SDKErrors.CordFetchError} - Thrown when an error occurs during the fetching process.
 *
 * @example
 * ```typescript
 * const spaceUri = 'space:example_uri';
 * fetchFromChain(spaceUri)
 *   .then(spaceDetails => {
 *     console.log('Space Details:', spaceDetails);
 *   })
 *   .catch(error => {
 *     if (error instanceof SDKErrors.ChainSpaceMissingError) {
 *       console.error('Space not found:', spaceUri);
 *     } else {
 *       console.error('Error fetching space from chain:', error);
 *     }
 *   });
 * ```
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
 * Decodes a numeric permission bitset from the blockchain into a `PermissionType`.
 *
 * @remarks
 * This internal function is used for interpreting encoded permission data from the blockchain. It converts
 * the bitset representation of permissions into a `PermissionType`, a numeric value that aggregates
 * various permissions. The function identifies individual permissions like ASSERT, DELEGATE, and ADMIN
 * within the bitset and combines them using bitwise operations to form a single permission value.
 *
 * @param encoded - The blockchain-encoded permission data. This data is typically represented as a bitset,
 *        with each bit indicating the presence of a specific permission.
 *
 * @returns The aggregated `PermissionType` value, where each bit corresponds to a specific permission defined
 *          in the `Permission` constant. This numeric value encapsulates the combined set of permissions.
 *
 * @example
 * ```typescript
 * // Example bitset representing combined permissions
 * const encodedPermissions = { bits: 0b00000111 };
 * const permissionType = authorizationPermissionsFromChain(encodedPermissions);
 * console.log('Combined Permission Type:', permissionType);
 * // Output: Combined Permission Type: 7 (which includes ASSERT, DELEGATE, ADMIN)
 * ```
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
 * Decodes the details of a space authorization from its blockchain representation.
 *
 * @remarks
 * This internal function is crucial for translating blockchain-specific encoded data of space authorizations into
 * a more user-friendly and application-oriented format. It adheres to the `ISpaceAuthorization` interface, which
 * facilitates easier interaction with authorization data within applications. This process involves unwrapping the
 * encoded data and reformatting it into a structured object.
 *
 * @param encoded - The encoded authorization details retrieved from the blockchain, typically in a format unique
 *        to the blockchain that requires decoding for application use.
 * @param authorizationUri - The unique identifier for the authorization being decoded. This ID is essential for
 *        pinpointing the correct authorization record on the blockchain.
 *
 * @returns An `ISpaceAuthorization` object containing the decoded details of the space authorization. This object
 *          includes information such as the space URI, delegate DID, permissions granted, authorization ID, and
 *          delegator DID. The structured format of this object is tailored for easy integration and use within
 *          application workflows.
 *
 * @internal
 */
function decodeAuthorizationDetailsfromChain(
  encoded: Option<PalletChainSpaceSpaceAuthorization>,
  authorizationUri: AuthorizationUri
): ISpaceAuthorization {
  const chainAuth = encoded.unwrap()
  const decodedDetails: ISpaceAuthorization = {
    uri: identifierToUri(
      DecoderUtils.hexToString(chainAuth.spaceId.toString())
    ) as SpaceUri,
    delegateUri: Did.fromChain(chainAuth.delegate),
    permission: authorizationPermissionsFromChain(chainAuth.permissions),
    authorizationUri,
    delegatorUri: Did.fromChain(chainAuth.delegator),
  }
  return decodedDetails
}

/**
 * Fetches authorization details from the CORD chain based on a given authorization ID.
 *
 * @remarks
 * This function queries the CORD blockchain to retrieve details about a specific authorization, using the provided
 * authorization URI. It is designed to fetch and decode the authorization details stored on the blockchain. If the
 * authorization details are not found or cannot be decoded, the function throws an error.
 *
 * @param authorizationUri - The unique identifier (URI) of the authorization to be fetched.
 *
 * @returns A promise that resolves to the authorization details if found. These details are represented as an
 *          `ISpaceAuthorization` object, which includes information such as the space ID, delegate DID, permissions,
 *          authorization ID, and delegator DID. The function returns `null` if the authorization details are not found
 *          or cannot be decoded.
 *
 * @throws {SDKErrors.AuthorizationMissingError} - Thrown when no authorization is found with the provided ID.
 * @throws {SDKErrors.CordFetchError} - Thrown when an error occurs during the fetching process, such as issues with
 *         network connectivity or problems querying the blockchain.
 *
 * @example
 * ```typescript
 * const authorizationUri = 'auth:cord:example_id';
 * fetchAuthorizationFromChain(authorizationUri)
 *   .then(authorizationDetails => {
 *     console.log('Authorization Details:', authorizationDetails);
 *   })
 *   .catch(error => {
 *     if (error instanceof SDKErrors.AuthorizationMissingError) {
 *       console.error('Authorization not found:', authorizationUri);
 *     } else {
 *       console.error('Error fetching authorization:', error);
 *     }
 *   });
 * ```
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

/**
 * Prepares an update transaction capacity extrinsic for later dispatch to the blockchain.
 * @param spaceUri - The URI of the space to update transaction capacity.
 * @param new_capacity - The new capacity to be updated.
 * @param creatorUri - The DID URI of the creator, used to authorize the transaction.
 * @param signCallback - The callback function for signing the transaction.
 * @param authorAccount - The blockchain account used for signing and submitting the transaction.
 * @returns The prepared extrinsic ready for batch signing and submitting.
 */

export async function prepareUpdateTxCapacityExtrinsic(
  spaceUri: SpaceUri,
  new_capacity: number,
  creatorUri: DidUri,
  signCallback: SignExtrinsicCallback,
  authorAccount: CordKeyringPair
): Promise<SubmittableExtrinsic> {
  try {
    const api = ConfigService.get('api')

    const tx = api.tx.chainSpace.updateTransactionCapacitySub(spaceUri.replace('space:cord:', ''), new_capacity)    
    const extrinsic = await Did.authorizeTx(
      creatorUri,
      tx,
      signCallback,
      authorAccount.address
    )
    return extrinsic;


  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error preparing extrinsic: "${error}".`
    );
  }
}

/**
 * Dispatches a Sub-ChainSpace creation transaction to the CORD blockchain.
 *
 * @remarks
 * Responsible for creating a new ChainSpace on the blockchain. It first checks if the ChainSpace with the
 * given URI already exists to avoid duplicates. If not, it constructs and submits a transaction to create
 * the ChainSpace. The transaction requires authorization from the creator and is signed by the specified author account.
 *
 * @example
 * ```typescript
 * const chainSpace: IChainSpace = {
 *   // ... initialization of chainSpace properties ...
 * };
 * const creatorUri: DidUri = 'did:cord:creator_uri';
 * const authorAccount: CordKeyringPair = // ... initialization ...
 * const signCallback: SignExtrinsicCallback = // ... implementation ...
 *
 * try {
 *   const result = await dispatchSubspaceCreateToChain(chainSpace, creatorUri, authorAccount, signCallback);
 *   console.log('ChainSpace dispatched with URI:', result.uri);
 * } catch (error) {
 *   console.error('Error dispatching ChainSpace:', error);
 * }
 * ```
 *
 * @param chainSpace - The ChainSpace object containing necessary information for creating the ChainSpace on the blockchain.
 * @param creatorUri - The DID URI of the creator, used to authorize the transaction.
 * @param authorAccount - The blockchain account used for signing and submitting the transaction.
 * @param signCallback - The callback function for signing the transaction.
 * @returns A promise resolving to an object containing the ChainSpace URI and authorization ID.
 * @throws {SDKErrors.CordDispatchError} - Thrown when there's an error during the dispatch process.
 */
export async function dispatchUpdateTxCapacityToChain(
  space: SpaceUri,
  creatorUri: DidUri,
  authorAccount: CordKeyringPair,
  new_capacity: number,
  signCallback: SignExtrinsicCallback
): Promise<{ uri: SpaceUri; }> {
  const returnObject = {
    uri: space
  }

  try {
    const extrinsic = await prepareUpdateTxCapacityExtrinsic(space, new_capacity, creatorUri, signCallback, authorAccount)
    await Chain.signAndSubmitTx(extrinsic, authorAccount)

    return returnObject;
  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${error}".`
    )
  }
}

