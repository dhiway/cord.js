/**
 * @packageDocumentation
 * @module ChainSpace
 * @preferred
 *
 * The `ChainSpace` module, a key component of the CORD SDK, offers functionalities for creating and managing
 * distinct spaces within the CORD blockchain, known as ChainSpaces. These ChainSpaces are designed as specific
 * areas on the blockchain, each dedicated to particular data or assets, and operate under well-defined rules
 * and permissions.
 *
 * Key functionalities include:
 * - `createChainSpace`: This function generates a new ChainSpace, equipping it with a unique identifier and
 *   authorization identifier. It's essential for establishing a distinct space on the blockchain for specific
 *   data or asset management.
 * - `createChainSpaceDelegate`: This function facilitates the authorization of a delegate within a ChainSpace.
 *   It enables the delegate to perform certain actions on behalf of the ChainSpace's creator, ensuring controlled
 *   delegation within these blockchain spaces.
 *
 * These features play a crucial role in maintaining a structured and secure approach to resource management on the
 * CORD blockchain, upholding data integrity and facilitating controlled access.
 *
 * @example
 * ```typescript
 * // Example: Creating a new ChainSpace
 * const newChainSpace = await createChainSpace('did:cord:creator');
 * console.log('New ChainSpace Identifier:', newChainSpace.uri);
 *
 * // Example: Authorizing a delegate in a ChainSpace
 * const delegateAuthorization = await createChainSpaceDelegate('space:example_uri', 'did:cord:delegate', 'did:cord:creator');
 * console.log('Delegate Authorization ID:', delegateAuthorization.authorizationUri);
 * ```
 */

import type {
  DidUri,
  IChainSpace,
  ISpaceAuthorization,
  PermissionType,
  SpaceUri,
  AuthorizationUri,
} from '@cord.network/types'
import { Crypto, UUID } from '@cord.network/utils'
import { getUriForSpace, getUriForAuthorization } from './ChainSpace.chain.js'

/**
 * Creates a new ChainSpace object in the CORD blockchain.
 *
 * @remarks
 * This function is designed to create a distinct ChainSpace on the CORD blockchain. A ChainSpace is a conceptual area
 * within the blockchain, designated for managing specific data or assets under defined rules and permissions.
 * The function generates a unique identifier and an authorization identifier for the new ChainSpace, based on the
 * creator's DID URI and an optional custom description.
 *
 * @param creatorUri - The decentralized identifier (DID) URI of the entity creating the ChainSpace.
 * @param chainSpaceDesc - (Optional) A custom description to represent the ChainSpace. If not provided, a default
 *        description is generated, incorporating a unique UUID.
 * @returns A promise that resolves to an IChainSpace object, encompassing the ChainSpace's identifier, description, hash digest,
 *          creator's DID, and authorization URI.
 *
 * @example
 * ```typescript
 * const creatorUri = 'did:cord:creator';
 * const customDesc = 'MyCustomChainSpace';
 *
 * buildFromProperties(creatorUri, customDesc).then(chainSpace => {
 *   console.log('Created ChainSpace URI:', chainSpace.uri);
 * }).catch(error => {
 *   console.error('Error creating ChainSpace:', error);
 * });
 * ```
 */
export async function buildFromProperties(
  creatorUri: DidUri,
  chainSpaceDesc?: string
): Promise<IChainSpace> {
  const chainSpaceDescription =
    chainSpaceDesc || `ChainSpace v1.${UUID.generate()}`

  const chainSpaceHash = Crypto.hashStr(chainSpaceDescription)

  const { uri, authorizationUri } = await getUriForSpace(
    chainSpaceHash,
    creatorUri
  )

  return {
    uri,
    desc: chainSpaceDescription,
    digest: chainSpaceHash,
    creatorUri,
    authorizationUri,
  }
}

/**
 * Authorizes a delegate within a ChainSpace, allowing them to perform actions on behalf of the creator.
 *
 * @remarks
 * This function facilitates the delegation of permissions or roles to another entity within a specific ChainSpace.
 * It is instrumental in managing the decentralized governance and control within the ChainSpace, enabling
 * the ChainSpace's creator or owner to grant specific permissions to a delegate.
 *
 * @param spaceUri - The unique identifier (URI) of the ChainSpace for which the delegation is being set up.
 * @param delegateUri - The decentralized identifier (DID) URI of the delegate, the entity being authorized.
 * @param permission - The type of permission being granted to the delegate, defining their role and actions within the ChainSpace.
 * @param creatorUri - The DID URI of the ChainSpace's creator or owner, responsible for authorizing the delegate.
 * @returns A promise that resolves to an ISpaceAuthorization object, encapsulating the details of the granted authorization.
 *
 * @example
 * ```typescript
 * const spaceUri = 'space:example_uri';
 * const delegateUri = 'did:example:delegateUri';
 * const permission = PermissionType.EXAMPLE_PERMISSION;
 * const creatorUri = 'did:example:creatorUri';
 *
 * buildFromAuthorizationProperties(spaceUri, delegateUri, permission, creatorUri)
 *   .then(spaceAuth => {
 *     console.log('Authorization URI:', spaceAuth.authorizationUri);
 *   })
 *   .catch(error => {
 *     console.error('Error creating authorization:', error);
 *   });
 * ```
 */
export async function buildFromAuthorizationProperties(
  spaceUri: SpaceUri,
  delegateUri: DidUri,
  permission: PermissionType,
  creatorUri: DidUri
): Promise<ISpaceAuthorization> {
  const authorizationUri = (await getUriForAuthorization(
    spaceUri,
    delegateUri,
    creatorUri
  )) as AuthorizationUri

  return {
    uri: spaceUri,
    delegateUri,
    permission,
    authorizationUri,
    delegatorUri: creatorUri,
  }
}
