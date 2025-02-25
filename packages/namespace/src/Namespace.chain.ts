
/**
 * @packageDocumentation
 * @module Namespace/chain
 *
 * The Namespace module provides a framework for creating and managing
 * isolated namespaces within the CORD blockchain, offering fine-grained
 * control through a permission system. It allows for the creation,
 * status modification, and delegate management within these namespaces.
 * Within this namespace, users can create and manage registries, which are
 * used to store and manage entries in a structured manner.
 *
 * ## Overview
 *
 * The Namespace module enables the creation of distinct namespaces on the
 * CORD blockchain, each with its own governance rules. These namespaces can
 * be used to manage various ecosystems or communities within the larger
 * blockchain network. Each namespace is identified by a unique identifier
 * and can be governed by appointed delegates.
 *
 * ## Interface
 *
 * The module provides various functions for managing namespaces:
 *
 * - `create`: Initializes a new namespace with a unique identifier.
 *
 * ## Permissions
 *
 * This module implements a granular permission system to manage actions
 * that can be performed by delegates within a namespace. Delegates can be
 * assigned roles such as admin or regular delegate, each with defined permissions.
 *
 * ## Usage
 *
 * The Namespace module can be leveraged by other modules (e.g., the Registries & Entries module)
 * to create compartmentalized, governed sections within the blockchain. This is useful
 * for applications requiring distinct governance models or privacy settings.
 *
 * ## Governance Integration
 *
 * The module integrates with on-chain governance tools, enabling namespace
 * administrators and delegates to propose changes, vote on initiatives, and manage
 * registries in line with the collective decisions of its members.
 *
 * ## Examples
 *
 * - Create a namespace to maintain a namespace of various types.
 * - Archive and restore a namespace for future use.
 * - Revoke and reinstate namespace based on inactivity or violations.
 * - Add delegates to a namespace to ensure compliance with governance standards & use this 
 *  to manage the namespace & namespace too.
 */

import {
    CordKeyringPair,
} from '@cord.network/types'

import { Option } from '@polkadot/types';

import { Chain } from '@cord.network/network'

import { SDKErrors } from '@cord.network/utils'

import { ConfigService } from '@cord.network/config'

import { 
    INamespaceCreate, 
    NamespaceAuthorizationUri,
    NamespaceUri,
    NamespacePermissionType,
    NamespacePermission,
    INamespaceAuthorization
} from '@cord.network/types';

import {
  uriToIdentifier,
} from '@cord.network/identifier'
import { PalletNamespaceNameSpaceAuthorization, PalletNamespaceNameSpaceDetails } from '@cord.network/augment-api';


/**
 * Checks if a namespace is stored on the CORD blockchain.
 *
 * This function queries the blockchain to verify whether a namespace with the given URI 
 * exists. It converts the URI to an identifier and checks the corresponding entry in the
 * namespace storage. If the namespace exists, it returns `true`; otherwise, it returns `false`.
 *
 * @param namespaceUri - The URI of the namespace to check.
 * @returns A promise that resolves to `true` if the namespace exists, or `false` if it does not.
 * @throws {SDKErrors.CordQueryError} If an error occurs while querying the namespace storage.
 *
 * @example
 * // Example: Checking if a namespace exists
 * const namespaceExists = await isNamespaceStored('namespace:cord:example_namespace_uri');
 * console.log('Namespace exists:', namespaceExists);
 */
export async function isNamespaceStored(
    namespaceUri: NamespaceUri
): Promise<boolean> {
  try {
    const api = ConfigService.get('api');
    const identifier = uriToIdentifier(namespaceUri);
    const encoded = await api.query.nameSpace.nameSpaces(identifier) as Option<PalletNamespaceNameSpaceDetails>;

    return !encoded.isNone
  } catch (error) {
    throw new SDKErrors.CordQueryError(
      `Error querying the namespace storage: ${error}`
    )
  }
}


/**
 * Dispatches a request to create a new namespace on the CORD blockchain.
 *
 * This function checks if a namespace already exists at the specified URI. If it does,
 * an error is thrown. If the namespace does not exist, it creates a new namespace using 
 * the provided details and submits the transaction to the chain.
 *
 * @param namespaceDetails - An object containing the details required to create the namespace, including:
 *   - `uri`: The unique identifier for the namespace.
 *   - `authorizationUri`: The URI for the associated authorization.
 *   - `digest`: A hash representing the namespace's content (optional).
 *   - `blob`: Additional data related to the namespace (optional).
 * @param authorAccount - The account that will authorize the creation of the namespace.
 * @returns A promise that resolves to an object containing the created namespace's `uri` and `authorizationUri`.
 * @throws {SDKErrors.CordDispatchError} If the namespace already exists or if an error occurs while dispatching to the chain.
 *
 * @example
 * // Example: Creating a new namespace
 * const newNamespace = await dispatchCreateToChain({
 *     uri: 'namespace:cord:example_namespace_uri',
 *     authorizationUri: 'auth:cord:example_authorization_uri',
 *     digest: '0xabc123...', // Optional
 *     blob: 'Namespace data blob' // Optional
 * }, authorAccount);
 * console.log('Created Namespace URI:', newNamespace.uri);
 */
export async function dispatchCreateToChain(
    namespaceDetails: INamespaceCreate,
    authorAccount: CordKeyringPair
): Promise<{ uri: NamespaceUri, authorizationUri: NamespaceAuthorizationUri }> {
    const namespaceObj = {
        uri: namespaceDetails.uri,
        authorizationUri: namespaceDetails.authorizationUri
    }

    const namespaceExists = await isNamespaceStored(namespaceDetails.uri);

    if (namespaceExists) {
        throw new SDKErrors.CordDispatchError(
            `Namespace already exists at URI: "${namespaceDetails.uri}".`
        );
    }

    try {
        const api = ConfigService.get('api'); 

        const extrinsic = api.tx.nameSpace.create(
            namespaceDetails.digest,
            namespaceDetails.blob
        );

        await Chain.signAndSubmitTx(extrinsic, authorAccount);

        return namespaceObj;
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : JSON.stringify(error);
        throw new SDKErrors.CordDispatchError(
            `Error dispatching to chain: "${errorMessage}".`
        );
    }
}

/**
 * Dispatches a transaction to add a delegate authorization for a specified namespace.
 *
 * This function creates an extrinsic based on the provided permission type, which determines
 * the kind of authorization to be granted to the specified delegate for the given namespace.
 * It throws an error if an invalid permission is provided.
 *
 * @param permission - The type of permission to grant to the delegate. Must be one of the
 *                     defined `NamespacePermissionType` values (e.g., ASSERT, DELEGATE, ADMIN).
 * @param namespaceId - The identifier of the namespace to which the delegate is being added.
 * @param delegateId - The identifier of the delegate to be authorized.
 * @param authorizationId - The identifier of the authorization associated with the delegate.
 * @returns An extrinsic that can be signed and submitted to the chain.
 * @throws {SDKErrors.InvalidPermissionError} If the provided permission is not valid.
 *
 * @example
 * // Example: Dispatch a transaction to add a delegate authorization
 * const extrinsic = dispatchDelegateAuthorizationTx(
 *     NamespacePermission.ASSERT,
 *     'namespaceId123',
 *     'delegateId456',
 *     'authorizationId789'
 * );
 * console.log('Extrinsic to be dispatched:', extrinsic);
 * 
 */
function dispatchDelegateAuthorizationTx(
  permission: NamespacePermissionType,
  namespaceId: string,
  delegateId: string,
  authorizationId: string
) {
  const api = ConfigService.get('api')

  switch (permission) {
    case NamespacePermission.ASSERT:
      return api.tx.nameSpace.addDelegate(
        namespaceId, 
        delegateId, 
        authorizationId
    )
    case NamespacePermission.DELEGATE:
      return api.tx.nameSpace.addDelegator(
        namespaceId, 
        delegateId, 
        authorizationId
    )
    case NamespacePermission.ADMIN:
      return api.tx.nameSpace.addAdminDelegate(
        namespaceId, 
        delegateId, 
        authorizationId
    )
    default:
      throw new SDKErrors.InvalidPermissionError(
        `Permission not valid:"${permission}".`
      )
  }
}

/**
 * Dispatches a transaction to authorize a delegate for a specified namespace.
 *
 * This function checks the existence of the namespace and the authorization for the delegator,
 * then constructs an extrinsic to add the delegate authorization with the given permission.
 * It submits the transaction to the chain and throws an error if any step fails.
 *
 * @param request - The authorization request object, containing the namespace URI, delegate URI, and permission.
 * @param namespaceAuthorizationUri`: The URI for the associated namespace authorization. 
 * @param authorAccount - The account of the author who signs and submits the transaction.
 * @returns The `NamespaceAuthorizationUri` after successfully dispatching the authorization.
 * @throws {SDKErrors.CordDispatchError} If the namespace or authorization does not exist, or if there's an error during dispatch.
 *
 * @example
 * // Example: Dispatch a delegate authorization to the chain
 * const authorizationUri = await dispatchDelegateAuthorization(
 *     {
 *         uri: 'namespaceUri123',
 *         delegateUri: 'did:cord:3delegate123',
 *         permission: NamespacePermission.ADMIN
 *     },
 *     'namespaceAuthUri123',
 *     authorAccount
 * );
 * console.log('Authorization dispatched with URI:', authorizationUri);
 * 
 */
export async function dispatchDelegateAuthorization(
  request: INamespaceAuthorization,
  namespaceAuthorizationUri: NamespaceAuthorizationUri,
  authorAccount: CordKeyringPair,
): Promise<NamespaceAuthorizationUri> {
  try {

    const namespaceExists = await isNamespaceStored(request.uri);
    if (!namespaceExists) {
        throw new SDKErrors.CordDispatchError(
            `Namespace URI does not exist: "${request.uri}".`
        );
    }

    const authorizationExists = await isNamespaceAuthorizationStored(namespaceAuthorizationUri);
    if (!authorizationExists) {
        throw new SDKErrors.CordDispatchError(
            `Namespace Authorization URI does not exist: "${namespaceAuthorizationUri}".`
        );
    }

    const nameSpaceId = uriToIdentifier(request.uri);
    const delegateId = request.delegateUri.replace("did:cord:3", "");
    const namespaceAuthorizationId = uriToIdentifier(namespaceAuthorizationUri);

    const extrinsic = dispatchDelegateAuthorizationTx(
      request.permission,
      nameSpaceId,
      delegateId,
      namespaceAuthorizationId,
    )

    await Chain.signAndSubmitTx(extrinsic, authorAccount)

    return request.authorizationUri
  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error dispatching delegate authorization: ${JSON.stringify(error)}`
    )
  }
}

/**
 * Checks whether a namespace authorization is stored in the CORD blockchain.
 *
 * This function queries the chain for the existence of a namespace authorization
 * using the provided authorization URI. It returns `true` if the authorization exists;
 * otherwise, it returns `false`.
 *
 * @param authorizationUri - The URI of the namespace authorization to check for existence.
 * @returns A promise that resolves to a boolean indicating whether the namespace authorization exists.
 * @throws {SDKErrors.CordQueryError} If an error occurs while querying the namespace storage.
 *
 * @example
 * // Example: Checking if a namespace authorization exists
 * const authorizationExists = await isNamespaceAuthorizationStored('auth:cord:example_authorization_uri');
 * console.log('Authorization exists:', authorizationExists);
 *
 */
export async function isNamespaceAuthorizationStored(
    authorizationUri: NamespaceAuthorizationUri
): Promise<boolean> {
    try {
        const api = ConfigService.get('api')
        const identifier = uriToIdentifier(authorizationUri)
        const encoded = await api.query.nameSpace.authorizations(identifier) as Option<PalletNamespaceNameSpaceAuthorization>;

        return !encoded.isNone
    } catch (error) {
        throw new SDKErrors.CordQueryError(
        `Error querying authorization existence: ${error}`
        )
    }
}
