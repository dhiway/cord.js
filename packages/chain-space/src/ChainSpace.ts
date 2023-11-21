/**
 * @packageDocumentation
 * @module ChainSpace
 * @preferred
 *
 * This module provides functionalities for creating and managing ChainSpaces within the CORD blockchain ecosystem.
 * A ChainSpace is a conceptual space on the CORD blockchain, designated for specific data or assets,
 * managed and accessed under defined rules and permissions.
 *
 * The primary functionalities of this module include:
 *
 * - `createChainSpace`: A function to create a new ChainSpace. This involves generating a unique identifier
 *   for the ChainSpace and an authorization identifier, which are derived from the creator's DID URI and
 *   an optional custom description. The ChainSpace thus created serves as a distinct environment or namespace
 *   within the CORD blockchain where specific data or assets can be stored and managed under the creator's governance.
 *
 * - `createChainSpaceDelegate`: A function to authorize a delegate within a ChainSpace. This is crucial for scenarios
 *   where the creator or owner of a ChainSpace needs to delegate certain permissions or roles to another entity.
 *   The function facilitates this by creating a delegate authorization, allowing the delegate to perform actions
 *   or access resources within the ChainSpace on behalf of the creator.
 *
 * These functionalities are essential for maintaining the integrity and structured access control of data and assets
 * within the CORD blockchain. By enabling the creation of distinct ChainSpaces and the delegation of specific
 * permissions within them, this module plays a critical role in the decentralized governance and management
 * of resources in the CORD ecosystem.
 *
 * Example usage:
 * ```typescript
 * // Creating a new ChainSpace
 * const newChainSpace = await createChainSpace('did:cord:creator');
 * console.log(newChainSpace.identifier); // Outputs the unique identifier of the new ChainSpace
 *
 * // Authorizing a delegate in a ChainSpace
 * const spaceAuthorization = await createChainSpaceDelegate('space-123', 'did:cord:delegate', 'did:cord:creator');
 * console.log(spaceAuthorization.authorization); // Outputs the authorization identifier for the delegate
 * ```
 *
 * This module is integral for developers and entities interacting with the CORD blockchain, providing them
 * with the tools to establish and manage their own dedicated spaces within the blockchain network,
 * along with the capability to securely delegate responsibilities within these spaces.
 */

import type {
  DidUri,
  SpaceId,
  IChainSpace,
  ISpaceAuthorization,
  PermissionType,
} from '@cord.network/types'
import { Crypto, UUID } from '@cord.network/utils'
import { getUriForSpace, getUriForAuthorization } from './ChainSpace.chain.js'

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
export async function buildFromProperties(
  creator: DidUri,
  chainSpaceDesc?: string
): Promise<IChainSpace> {
  // Use the provided chainSpaceString or generate a unique one
  const chainSpaceDescription =
    chainSpaceDesc || `ChainSpace v1.${UUID.generate()}`

  console.log(chainSpaceDescription)
  // Create a hash of the ChainSpace string to serve as a unique identifier
  const chainSpaceHash = Crypto.hashStr(chainSpaceDescription)

  // Generate the ChainSpace and authorization identifiers
  const { chainSpaceId, authorizationId } = await getUriForSpace(
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
 * @param permission
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
export async function buildFromAuthorizationProperties(
  chainSpace: SpaceId,
  delegate: DidUri,
  permission: PermissionType,
  creator: DidUri
): Promise<ISpaceAuthorization> {
  const authorizationId = await getUriForAuthorization(
    chainSpace,
    delegate,
    creator
  )

  return {
    chainSpace,
    delegate,
    permission,
    authorization: authorizationId,
    delegator: creator,
  }
}
