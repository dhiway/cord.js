/**
 * ChainSpace Creation and Delegation (Authorization) Module Chain Support functions.
 *
 * @packageDocumentation
 * @module ChainSpace
 */

import type {
  DidUri,
  SpaceId,
  ChainSpaceIdentifiers,
  AuthorizationId,
  AccountId,
  H256,
  ISpaceDetails,
  Option,
  ISpaceAuthorizationDetails,
  PermissionType,
} from '@cord.network/types'
import { Identifier, SDKErrors } from '@cord.network/utils'
import {
  SPACE_IDENT,
  SPACE_PREFIX,
  AUTHORIZATION_IDENT,
  AUTHORIZATION_PREFIX,
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

/**
 * Generates identifiers for a ChainSpace and its associated authorization.
 *
 * @param spaceDigest - The digest representing the ChainSpace content.
 * @param creator - The DID URI of the creator of the ChainSpace.
 * @returns A Promise resolving to an object containing the ChainSpace ID and Authorization ID.
 */
export async function createChainSpaceIdentifiers(
  spaceDigest: string,
  creator: DidUri
): Promise<ChainSpaceIdentifiers> {
  const api = ConfigService.get('api')
  const scaleEncodedSpaceDigest = api
    .createType<H256>('H256', spaceDigest)
    .toU8a()
  const scaleEncodedCreator = api
    .createType<AccountId>('AccountId', Did.toChain(creator))
    .toU8a()
  const digest = blake2AsHex(
    Uint8Array.from([...scaleEncodedSpaceDigest, ...scaleEncodedCreator])
  )

  const chainSpaceId: SpaceId = Identifier.hashToUri(
    digest,
    SPACE_IDENT,
    SPACE_PREFIX
  )

  const scaleEncodedAuthDigest = api
    .createType<Bytes>('Bytes', Identifier.uriToIdentifier(chainSpaceId))
    .toU8a()
  const scaleEncodedAuthDelegate = api
    .createType<AccountId>('AccountId', Did.toChain(creator))
    .toU8a()

  const authDigest = blake2AsHex(
    Uint8Array.from([...scaleEncodedAuthDigest, ...scaleEncodedAuthDelegate])
  )

  const authorizationId: AuthorizationId = Identifier.hashToUri(
    authDigest,
    AUTHORIZATION_IDENT,
    AUTHORIZATION_PREFIX
  )

  return { chainSpaceId, authorizationId }
}

/**
 * Generates an Authorization ID for a ChainSpace delegate.
 * This function is integral for establishing delegated access within a ChainSpace context.
 *
 * The resulting Authorization ID uniquely represents the delegated authority within the ChainSpace,
 * linking the delegate, the creator, and the specific ChainSpace ID in a secure and verifiable manner.
 *
 * @param chainSpaceId - The identifier of the ChainSpace for which the delegation is being created.
 * @param delegate - The DID URI of the delegate receiving authorization.
 * @param creator - The DID URI of the creator granting the authorization.
 * @returns A promise that resolves to the Authorization ID, uniquely representing the delegation within the ChainSpace.
 */
export async function createChainSpaceDelegateIdentifier(
  chainSpaceId: SpaceId,
  delegate: DidUri,
  creator: DidUri
): Promise<AuthorizationId> {
  const api = ConfigService.get('api')

  const scaleEncodedSpaceId = api
    .createType<Bytes>('Bytes', Identifier.uriToIdentifier(chainSpaceId))
    .toU8a()
  const scaleEncodedAuthDelegate = api
    .createType<AccountId>('AccountId', Did.toChain(delegate))
    .toU8a()
  const scaleEncodedAuthCreator = api
    .createType<AccountId>('AccountId', Did.toChain(creator))
    .toU8a()

  const authDigest = blake2AsHex(
    Uint8Array.from([
      ...scaleEncodedSpaceId,
      ...scaleEncodedAuthDelegate,
      ...scaleEncodedAuthCreator,
    ])
  )

  const authorizationId: AuthorizationId = Identifier.hashToUri(
    authDigest,
    AUTHORIZATION_IDENT,
    AUTHORIZATION_PREFIX
  )

  return authorizationId
}

/**
 * Decodes the details of a ChainSpace from its blockchain representation.
 * This function is essential for interpreting the on-chain data structure into a more readable and usable format.
 *
 * @param encoded - The encoded ChainSpace details as retrieved from the blockchain.
 * @param space - The identifier of the ChainSpace being decoded.
 * @returns An `ISpaceDetails` object containing the decoded details of the ChainSpace.
 */
function decodeSpaceDetailsfromChain(
  encoded: Option<PalletChainSpaceSpaceDetails>,
  space: SpaceId
): ISpaceDetails {
  const chainStatement = encoded.unwrap()
  const decodedDetails: ISpaceDetails = {
    identifier: space,
    creator: Did.fromChain(chainStatement.creator),
    txnCapacity: chainStatement.txnCapacity.toNumber(),
    txnUsage: chainStatement.txnCount.toNumber(),
    approved: chainStatement.approved.valueOf(),
    archive: chainStatement.archive.valueOf(),
  }

  return decodedDetails
}

/**
 * Retrieves and decodes the details of a specific ChainSpace from the blockchain.
 *
 * This function is key for applications that need to access and display ChainSpace information,
 * providing a bridge between the blockchain data and the application's user interface or business logic.
 *
 * @param chainSpace - The identifier of the ChainSpace for which details are being retrieved.
 * @returns A Promise that resolves to an `ISpaceDetails` object containing the ChainSpace details, or null if not found.
 * @throws `ChainSpaceMissingError` if the ChainSpace is not found on the blockchain.
 */
export async function getChainSpaceDetailsfromChain(
  chainSpace: SpaceId
): Promise<ISpaceDetails | null> {
  const api = ConfigService.get('api')
  const spaceId = Identifier.uriToIdentifier(chainSpace)

  const spaceEntry = await api.query.chainSpace.spaces(spaceId)
  const spaceDetails = decodeSpaceDetailsfromChain(spaceEntry, chainSpace)
  if (spaceDetails === null) {
    throw new SDKErrors.ChainSpaceMissingError(
      `There is no chain space with the provided ID "${chainSpace}" present on the chain.`
    )
  }
  return spaceDetails
}

/**
 * Converts encoded blockchain permissions into an array of `PermissionType`.
 * This function is essential for interpreting the permission data stored on the blockchain,
 * translating it into a more readable and usable format within the application.
 *
 * @param encoded - The encoded permissions from the blockchain, in a bitset format.
 * @returns An array of `PermissionType`, representing the permissions set in the encoded data.
 */
function authorizationPermissionsFromChain(
  encoded: PalletChainSpacePermissions
): PermissionType[] {
  const bitset = encoded.bits.toNumber()
  const permissions: PermissionType[] = []
  // eslint-disable-next-line no-bitwise
  if ((bitset & Permission.ASSERT) > 0) {
    permissions.push(Permission.ASSERT)
  }
  // eslint-disable-next-line no-bitwise
  if ((bitset & Permission.ADMIN) > 0) {
    permissions.push(Permission.ADMIN)
  }
  // eslint-disable-next-line no-bitwise
  if ((bitset & Permission.AUDIT) > 0) {
    permissions.push(Permission.AUDIT)
  }
  return permissions
}

/**
 * Decodes the details of a space authorization from its blockchain representation.
 *
 * @param encoded - The encoded authorization details from the blockchain.
 * @param authorization - The specific authorization ID being decoded.
 * @returns An `ISpaceAuthorizationDetails` object containing the decoded authorization details.
 */
export function decodeAuthorizationDetailsfromChain(
  encoded: Option<PalletChainSpaceSpaceAuthorization>,
  authorization: AuthorizationId
): ISpaceAuthorizationDetails {
  const chainAuth = encoded.unwrap()
  const decodedDetails: ISpaceAuthorizationDetails = {
    space: chainAuth.spaceId.toString(),
    delegate: Did.fromChain(chainAuth.delegate),
    permission: authorizationPermissionsFromChain(chainAuth.permissions),
  }
  return decodedDetails
}

/**
 * Retrieves and decodes the details of a specific authorization from the blockchain.
 *
 * @param authorization - The Authorization ID for which details are being retrieved.
 * @returns A promise that resolves to an `ISpaceDetails` object containing the decoded authorization details.
 * @throws `ChainSpaceMissingError` if no authorization is found for the provided ID.
 */
export async function getAuthorizationDetailsfromChain(
  authorization: AuthorizationId
): Promise<ISpaceDetails | null> {
  const api = ConfigService.get('api')
  const authId = Identifier.uriToIdentifier(authorization)

  const authEntry = await api.query.chainSpace.spaces(authId)
  const authDetails = decodeSpaceDetailsfromChain(authEntry, authorization)
  if (authDetails === null) {
    throw new SDKErrors.ChainSpaceMissingError(
      `There is no authorization with the provided ID "${authorization}}" present on the chain.`
    )
  }
  return authDetails
}

/**
 * Checks the existence of a Chain Space on CORD.
 *
 * @param chainSpace - The Chain Space ID to be checked.
 * @returns A promise that resolves to true if the Chain Space exists, or false otherwise.
 */
export async function isChainSpaceStored(
  chainSpace: SpaceId
): Promise<boolean> {
  const api = ConfigService.get('api')
  const identifier = Identifier.uriToIdentifier(chainSpace)
  const encoded = await api.query.chainSpace.spaces(identifier)

  return !encoded.isNone
}

/**
 * Checks if a given authorization exists on the blockchain.
 *
 * @param authorization - The AuthorizationId to check for existence.
 * @returns A Promise resolving to a boolean. `true` if the authorization exists, `false` otherwise.
 */
export async function isAuthorizationStored(
  authorization: AuthorizationId
): Promise<boolean> {
  const api = ConfigService.get('api')
  const identifier = Identifier.uriToIdentifier(authorization)
  const encoded = await api.query.chainSpace.authorizations(identifier)

  return !encoded.isNone
}
