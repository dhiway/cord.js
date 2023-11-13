/**
 * ChainSpace Creation and Delegation (Authorization) Module.
 *
 * @packageDocumentation
 * @module ChainSpace
 * @preferred
 *
 * This module forms part of the CORD Network's ChainSpace system, focusing on the creation and management of ChainSpaces and their delegations.
 * It provides essential functionalities to create new ChainSpaces and to manage delegate authorizations within these spaces.
 * The module leverages decentralized identifiers (DIDs) to ensure secure and verifiable interactions within the CORD environment.
 *
 * Key Features:
 * - `createChainSpace`: Generates a new ChainSpace with a unique identifier and authorization ID, based on the creator's DID URI.
 *   This function is crucial for initiating a new ChainSpace where data or assets can be managed securely.
 *
 * - `createChainSpaceDelegate`: Facilitates the creation of delegate authorizations within a ChainSpace.
 *   This function is used to grant permissions to a delegate, allowing them to act within the ChainSpace on behalf of the creator.
 *
 * These functions are integral to the CORD Network's approach to decentralized identity and access management,
 * enabling users to create and manage secure, blockchain-based spaces for data and asset control.
 *
 * Usage of this module is primarily intended for applications that require robust identity verification and authorization mechanisms,
 * particularly in contexts where secure management of digital assets or data is critical.
 */

import type {
  DidUri,
  SpaceId,
  IChainSpace,
  ISpaceAuthorization,
} from '@cord.network/types'
import { Crypto, UUID } from '@cord.network/utils'
import {
  createChainSpaceIdentifiers,
  createChainSpaceDelegateIdentifier,
} from './ChainSpace.chain.js'

/**
 * Creates a new ChainSpace object.
 *
 * ChainSpace is a conceptual space in the CORD blockchain where specific data or assets are stored and managed.
 * This function generates a unique ChainSpace identifier and an authorization identifier based on the provided creator's DID URI.
 * Users can optionally provide their own ChainSpace description. If not provided, a default description with a unique UUID is used.
 *
 * @param creator - The DID URI of the creator. This is a decentralized identifier for the entity creating the ChainSpace.
 * @param chainSpaceDesc - (Optional) A custom description to represent the ChainSpace. If not provided, a default description is generated.
 * @returns A promise that resolves to an IChainSpace object.
 *
 * The IChainSpace object includes:
 * - `identifier`: A unique identifier for the ChainSpace, derived from its hash.
 * - `digest`: The hash of the ChainSpace string, serving as a unique content identifier.
 * - `creator`: The DID URI of the creator, passed as a parameter.
 * - `authorization`: An identifier for authorization purposes, linked to this specific ChainSpace.
 *
 * Example usage:
 * ```.
 * const chainSpace = await createChainSpace('did:example:123');
 * console.log(chainSpace.identifier); // Outputs the ChainSpace identifier.
 *
 * const customChainSpace = await createChainSpace('did:example:456', 'MyCustomChainSpace');
 * console.log(customChainSpace.identifier); // Outputs the identifier for the custom ChainSpace
 * ```.
 *
 */
export async function createChainSpace(
  creator: DidUri,
  chainSpaceDesc?: string
): Promise<IChainSpace> {
  // Use the provided chainSpaceString or generate a unique one
  const chainSpaceDescription =
    chainSpaceDesc || `ChainSpace v1.${UUID.generatev4()}`

  // Create a hash of the ChainSpace string to serve as a unique identifier
  const chainSpaceHash = Crypto.hashStr(chainSpaceDescription)

  // Generate the ChainSpace and authorization identifiers
  const { chainSpaceId, authorizationId } = await createChainSpaceIdentifiers(
    chainSpaceHash,
    creator
  )

  // Return the ChainSpace object with its identifier, hash, creator, and authorization ID
  return {
    identifier: chainSpaceId,
    digest: chainSpaceHash,
    creator,
    authorization: authorizationId,
  }
}

/**
 * Creates a delegate authorization for a given ChainSpace.
 *
 * This function is used to authorize a delegate within a specific ChainSpace, allowing the delegate to perform actions or access resources within that space on behalf of the creator.
 *
 * @param chainSpace - The identifier of the ChainSpace for which the delegate is being authorized.
 * @param delegate - The DID URI of the delegate being authorized. This is a decentralized identifier for the entity that is being given certain permissions or roles within the ChainSpace.
 * @param creator - The DID URI of the admin or owner of the ChainSpace. This entity is authorizing the delegate.
 * @returns A promise that resolves to an ISpaceAuthorization object.
 *
 * The ISpaceAuthorization object includes:
 * - `chainSpace`: The identifier of the ChainSpace involved.
 * - `delegate`: The DID URI of the delegate.
 * - `authorization`: A unique identifier for this specific authorization.
 * - `delegator`: The DID URI of the creator or owner who is granting the authorization.
 *
 * Example usage:
 * ```.
 * const spaceAuthorization = await createChainSpaceDelegate('space-123', 'did:example:delegate', 'did:example:creator');
 * console.log(spaceAuthorization.authorization); // Outputs the authorization identifier
 * ```.
 *
 */
export async function createChainSpaceDelegate(
  chainSpace: SpaceId,
  delegate: DidUri,
  creator: DidUri
): Promise<ISpaceAuthorization> {
  // Generate the authorization identifier for the delegate within the ChainSpace
  const authorizationId = await createChainSpaceDelegateIdentifier(
    chainSpace,
    delegate,
    creator
  )

  // Return the space authorization object with ChainSpace, delegate, authorization ID, and delegator
  return {
    chainSpace,
    delegate,
    authorization: authorizationId,
    delegator: creator,
  }
}
