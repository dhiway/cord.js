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
 * @param creatorUri - The DID URI of the creator. This is a decentralized identifier for the entity creating the ChainSpace.
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
  creatorUri: DidUri,
  chainSpaceDesc?: string
): Promise<IChainSpace> {
  const chainSpaceDescription =
    chainSpaceDesc || `ChainSpace v1.${UUID.generate()}`

  const chainSpaceHash = Crypto.hashStr(chainSpaceDescription)

  const { uri, authUri } = await getUriForSpace(chainSpaceHash, creatorUri)

  return {
    uri,
    digest: chainSpaceHash,
    creator: creatorUri,
    authorization: authUri,
  }
}

/**
 * Constructs an ISpaceAuthorization object for a given ChainSpace to authorize a delegate.
 *
 * This function is utilized to create an authorization structure within a specific ChainSpace. It assigns
 * a delegate to perform certain actions or access resources on behalf of the ChainSpace's creator or owner.
 * The function generates a unique authorization identifier and encapsulates all relevant details into an
 * ISpaceAuthorization object.
 *
 * @param spaceUri - The unique identifier (URI) of the ChainSpace for which the delegate is being authorized.
 * @param delegateUri - The decentralized identifier (DID) URI of the delegate. The delegate is the entity
 *        being granted permissions or roles within the ChainSpace.
 * @param permission - The type of permission being granted to the delegate.
 * @param creatorUri - The DID URI of the ChainSpace's admin or owner. This individual or entity is responsible
 *        for authorizing the delegate.
 *
 * @returns - A promise that resolves to an ISpaceAuthorization object containing details
 *          of the space, delegate, permission granted, the unique authorization identifier, and the delegator.
 *
 * Example usage:
 * ```typescript
 * const spaceAuthorization = await buildFromAuthorizationProperties(
 *   'space:example_uri',
 *   'did:example:delegateUri',
 *   PermissionType.EXAMPLE_PERMISSION,
 *   'did:example:creatorUri'
 * );
 * console.log('Authorization ID:', spaceAuthorization.authorization);
 * ```.
 */
export async function buildFromAuthorizationProperties(
  spaceUri: SpaceId,
  delegateUri: DidUri,
  permission: PermissionType,
  creatorUri: DidUri
): Promise<ISpaceAuthorization> {
  const authorizationId = await getUriForAuthorization(
    spaceUri,
    delegateUri,
    creatorUri
  )

  return {
    space: spaceUri,
    delegate: delegateUri,
    permission,
    authorization: authorizationId,
    delegator: creatorUri,
  }
}
