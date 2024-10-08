
/**
 * @packageDocumentation
 * @module Registries/chain
 *
 * The Registries module provides a framework for creating and managing
 * isolated registries within the CORD blockchain, offering fine-grained
 * control through a permission system. It allows for the creation,
 * status modification, and delegate management within these registries.
 *
 * ## Overview
 *
 * The Registries module enables the creation of distinct registries on the
 * CORD blockchain, each with its own governance rules. These registries can
 * be used to manage various ecosystems or communities within the larger
 * blockchain network. Each registry is identified by a unique identifier
 * and can be governed by appointed delegates.
 *
 * ## Interface
 *
 * The module provides various functions for managing registries:
 *
 * - `create`: Initializes a new registry with a unique identifier.
 * - `update`: Updates an existing registry with new information.
 * - `revoke`: Marks a registry as revoked, effectively deactivating it.
 * - `reinstate`: Reactivates a previously revoked registry.
 * - `archive`: Moves a registry to an archived state.
 * - `restore`: Restores a previously archived registry to active status.
 * - `addDelegate`: Adds a delegate to the registry with specific permissions.
 * - `addAdminDelegate`: Adds an administrative delegate to manage the registry.
 * - `addAuditDelegate`: Adds an audit delegate with auditing permissions.
 * - `removeDelegate`: Removes a delegate, revoking their permissions.
 *
 * ## Permissions
 *
 * This module implements a granular permission system to manage actions
 * that can be performed by delegates within a registry. Delegates can be
 * assigned roles such as admin or regular delegate, each with defined permissions.
 *
 * ## Data Privacy
 *
 * The Registries module prioritizes data privacy, avoiding the storage of personal
 * or sensitive data directly on-chain. Instead, it manages references to off-chain
 * data, ensuring compliance with privacy regulations. Users and developers are responsible
 * for managing off-chain data according to applicable laws and standards.
 *
 * ## Usage
 *
 * The Registries module can be leveraged by other modules (e.g., the Entries module)
 * to create compartmentalized, governed sections within the blockchain. This is useful
 * for applications requiring distinct governance models or privacy settings.
 *
 * ## Governance Integration
 *
 * The module integrates with on-chain governance tools, enabling registry
 * administrators and delegates to propose changes, vote on initiatives, and manage
 * registries in line with the collective decisions of its members.
 *
 * ## Examples
 *
 * - Create a registry for a community-driven project.
 * - Archive and restore a registry for future use.
 * - Revoke and reinstate registries based on inactivity or violations.
 * - Add delegates to a registry to ensure compliance with governance standards.
 */

import {
    CordKeyringPair,
} from '@cord.network/types'

import { Option } from '@polkadot/types';

import { Chain } from '@cord.network/network'

import { SDKErrors } from '@cord.network/utils'

import { ConfigService } from '@cord.network/config'

import { 
    IRegistryCreate, IRegistryUpdate,
    RegistryAuthorizationUri,
    RegistryUri, RegistryPermissionType,
    RegistryPermission, IRegistryAuthorization,
} from '@cord.network/types';

import {
  uriToIdentifier,
} from '@cord.network/identifier'

import type {
  PalletRegistriesRegistryAuthorization,
} from '@cord.network/augment-api'


/**
 * Checks whether a registry is stored in the CORD blockchain.
 *
 * This function queries the chain for the existence of a registry using the provided
 * registry URI. It returns `true` if the registry exists; otherwise, it returns `false`.
 *
 * @param registryUri - The URI of the registry to check for existence.
 * @returns A promise that resolves to a boolean indicating whether the registry exists.
 * @throws {SDKErrors.CordQueryError} If an error occurs while querying the chain space.
 *
 * @example
 * // Example: Checking if a registry exists
 * const registryExists = await isRegistryStored('space:cord:example_registry_uri');
 * console.log('Registry exists:', registryExists);
 */
export async function isRegistryStored(
    registryUri: RegistryUri
): Promise<boolean> {
  try {
    const api = ConfigService.get('api');
    const identifier = uriToIdentifier(registryUri);
    const encoded = await api.query.registries.registryInfo(identifier);

    return !encoded.isNone
  } catch (error) {
    throw new SDKErrors.CordQueryError(
      `Error querying the chain space: ${error}`
    )
  }
}


/**
 * Checks whether a registry authorization is stored in the CORD blockchain.
 *
 * This function queries the chain for the existence of a registry authorization
 * using the provided authorization URI. It returns `true` if the authorization exists;
 * otherwise, it returns `false`.
 *
 * @param authorizationUri - The URI of the registry authorization to check for existence.
 * @returns A promise that resolves to a boolean indicating whether the registry authorization exists.
 * @throws {SDKErrors.CordQueryError} If an error occurs while querying the chain space.
 *
 * @example
 * // Example: Checking if a registry authorization exists
 * const authorizationExists = await isRegistryAuthorizationStored('auth:cord:example_authorization_uri');
 * console.log('Authorization exists:', authorizationExists);
 *
 */
export async function isRegistryAuthorizationStored(
    authorizationUri: RegistryAuthorizationUri
): Promise<boolean> {
    try {
        const api = ConfigService.get('api')
        const identifier = uriToIdentifier(authorizationUri)
        const encoded = await api.query.registries.authorizations(identifier) as Option<PalletRegistriesRegistryAuthorization>;

        return !encoded.isNone
    } catch (error) {
        throw new SDKErrors.CordQueryError(
        `Error querying authorization existence: ${error}`
        )
    }
}


/**
 * Dispatches a request to create a new registry on the CORD blockchain.
 *
 * This function checks if a registry already exists at the specified URI. If it does,
 * an error is thrown. If the registry does not exist, it creates a new registry 
 * using the provided details and submits the transaction to the chain.
 *
 * @param registryDetails - An object containing the details required to create the registry, including:
 *   - `uri`: The unique identifier for the registry.
 *   - `authorizationUri`: The URI for the associated authorization.
 *   - `digest`: A hash representing the registry's content.
 *   - `schemaId`: The identifier for the schema used.
 *   - `blob`: Additional data related to the registry.
 * @param authorAccount - The account that will authorize the creation of the registry.
 * @returns A promise that resolves to an object containing the created registry's URI and its authorization URI.
 * @throws {SDKErrors.CordDispatchError} If the registry already exists or if an error occurs while dispatching to the chain.
 *
 * @example
 * // Example: Creating a new registry
 * const newRegistry = await dispatchCreateRegistryToChain({
 *     uri: 'registry:cord:example_registry_uri',
 *     authorizationUri: 'auth:cord:example_authorization_uri',
 *     digest: '0xabc123...',
 *     schemaId: 'schema:cord:example_schema_id',
 *     blob: 'Registry data blob'
 * }, authorAccount);
 * console.log('Created Registry URI:', newRegistry.uri);
 * 
 */
export async function dispatchCreateRegistryToChain(
    registryDetails: IRegistryCreate,
    authorAccount: CordKeyringPair
): Promise<{ uri: RegistryUri, authorizationUri: RegistryAuthorizationUri }> {
    const registryObj = {
        uri: registryDetails.uri,
        authorizationUri: registryDetails.authorizationUri
    }

    const registryExists = await isRegistryStored(registryDetails.uri);

    if (registryExists) {
        throw new SDKErrors.CordDispatchError(
            `Registry already exists at URI: "${registryDetails.uri}".`
        );
    }

    try {
        const api = ConfigService.get('api'); 
        const registryId = uriToIdentifier(registryDetails.uri);

        const extrinsic = api.tx.registries.create(
            registryId,
            registryDetails.digest,
            registryDetails.schemaId,
            registryDetails.blob
        );

        await Chain.signAndSubmitTx(extrinsic, authorAccount);

        return registryObj;
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : JSON.stringify(error);
        throw new SDKErrors.CordDispatchError(
            `Error dispatching to chain: "${errorMessage}".`
        );
    }
}


/**
 * Dispatches a request to update an existing registry on the CORD blockchain.
 *
 * This function checks if the specified registry exists. If it does not exist,
 * an error is thrown. If the registry is found, it updates the registry with
 * the new details provided and submits the transaction to the chain.
 *
 * @param registryDetails - An object containing the details required to update the registry, including:
 *   - `uri`: The unique identifier for the registry to be updated.
 *   - `authorizationUri`: The URI for the associated authorization.
 *   - `digest`: A hash representing the updated content of the registry.
 *   - `blob`: Additional data related to the registry update.
 * @param authorAccount - The account that will authorize the update of the registry.
 * @returns A promise that resolves to an object containing the updated registry's URI and its authorization URI.
 * @throws {SDKErrors.CordDispatchError} If the registry does not exist or if an error occurs while dispatching to the chain.
 *
 * @example
 * // Example: Updating an existing registry
 * const updatedRegistry = await dispatchUpdateRegistryToChain({
 *     uri: 'registry:cord:example_registry_uri',
 *     authorizationUri: 'auth:cord:example_authorization_uri',
 *     digest: '0xdef456...',
 *     blob: 'Updated registry data blob'
 * }, authorAccount);
 * console.log('Updated Registry URI:', updatedRegistry.uri);
 * 
 */
export async function dispatchUpdateRegistryToChain(
    registryDetails: IRegistryUpdate,
    authorAccount: CordKeyringPair,
): Promise<{ uri: RegistryUri, authorizationUri: RegistryAuthorizationUri }> {
    const registryObj = {
        uri: registryDetails.uri,
        authorizationUri: registryDetails.authorizationUri
    }

    const registryExists = await isRegistryStored(registryDetails.uri);

    if (!registryExists) {
        throw new SDKErrors.CordDispatchError(
            `Registry URI does not exist: "${registryDetails.uri}".`
        );
    }

    try {
        const api = ConfigService.get('api')

        const registryId = uriToIdentifier(registryDetails.uri);
        const authorizationId = uriToIdentifier(registryDetails.authorizationUri);
        
        const extrinsic = api.tx.registries.update(
            registryId,
            registryDetails.digest,
            registryDetails.blob,
            authorizationId,
        );

        await Chain.signAndSubmitTx(extrinsic, authorAccount);

        return registryObj
    } catch(error) {
        const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error)
        throw new SDKErrors.CordDispatchError(
        `Error dispatching to chain: "${errorMessage}".`
        )
    }
}


/**
 * Dispatches a request to revoke authorization for a specified registry on the CORD blockchain.
 *
 * This function checks if the specified registry exists. If it does not exist,
 * an error is thrown. If the registry is found, it revokes the specified authorization
 * and submits the transaction to the chain.
 *
 * @param registryUri - The URI of the registry for which the authorization is to be revoked.
 * @param authorizationUri - The URI of the authorization to be revoked.
 * @param authorAccount - The account that will authorize the revocation of the authorization.
 * @returns A promise that resolves to an object containing the revoked registry's URI and its authorization URI.
 * @throws {SDKErrors.CordDispatchError} If the registry does not exist or if an error occurs while dispatching to the chain.
 *
 * @example
 * // Example: Revoking authorization for a registry
 * const revokedAuthorization = await dispatchRevokeToChain(
 *     'registry:cord:example_registry_uri',
 *     'auth:cord:example_authorization_uri',
 *     authorAccount
 * );
 * console.log('Revoked Registry URI:', revokedAuthorization.uri);
 * 
 */
export async function dispatchRevokeToChain(
    registryUri: RegistryUri,
    authorizationUri: RegistryAuthorizationUri,
    authorAccount: CordKeyringPair,
): Promise<{ uri: RegistryUri, authorizationUri: RegistryAuthorizationUri }> {
    const registryObj = {
        uri: registryUri,
        authorizationUri: authorizationUri
    }

    const registryExists = await isRegistryStored(registryUri);

    if (!registryExists) {
        throw new SDKErrors.CordDispatchError(
            `Registry URI does not exist: "${registryUri}".`
        );
    }

    try {
        const api = ConfigService.get('api')

        const registryId = uriToIdentifier(registryUri);
        const authorizationId = uriToIdentifier(authorizationUri);
        
        const extrinsic = api.tx.registries.revoke(
            registryId,
            authorizationId,
        );

        await Chain.signAndSubmitTx(extrinsic, authorAccount);

        return registryObj
    } catch(error) {
        const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error)
        throw new SDKErrors.CordDispatchError(
        `Error dispatching to chain: "${errorMessage}".`
        )
    }
}


/**
 * Dispatches a request to reinstate authorization for a specified registry on the CORD blockchain.
 *
 * This function checks if the specified registry exists. If it does not exist,
 * an error is thrown. If the registry is found, it reinstates the specified authorization
 * and submits the transaction to the chain.
 *
 * @param registryUri - The URI of the registry for which the authorization is to be reinstated.
 * @param authorizationUri - The URI of the authorization to be reinstated.
 * @param authorAccount - The account that will authorize the reinstatement of the authorization.
 * @returns A promise that resolves to an object containing the reinstated registry's URI and its authorization URI.
 * @throws {SDKErrors.CordDispatchError} If the registry does not exist or if an error occurs while dispatching to the chain.
 *
 * @example
 * // Example: Reinstate authorization for a registry
 * const reinstatedAuthorization = await dispatchReinstateToChain(
 *     'registry:cord:example_registry_uri',
 *     'auth:cord:example_authorization_uri',
 *     authorAccount
 * );
 * console.log('Reinstated Registry URI:', reinstatedAuthorization.uri);
 *
 */
export async function dispatchReinstateToChain(
    registryUri: RegistryUri,
    authorizationUri: RegistryAuthorizationUri,
    authorAccount: CordKeyringPair,
): Promise<{ uri: RegistryUri, authorizationUri: RegistryAuthorizationUri }> {
    const registryObj = {
        uri: registryUri,
        authorizationUri: authorizationUri
    }

    const registryExists = await isRegistryStored(registryUri);

    if (!registryExists) {
        throw new SDKErrors.CordDispatchError(
            `Registry URI does not exist: "${registryUri}".`
        );
    }

    try {
        const api = ConfigService.get('api')

        const registryId = uriToIdentifier(registryUri);
        const authorizationId = uriToIdentifier(authorizationUri);
        
        const extrinsic = api.tx.registries.reinstate(
            registryId,
            authorizationId,
        );

        await Chain.signAndSubmitTx(extrinsic, authorAccount);

        return registryObj
    } catch(error) {
        const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error)
        throw new SDKErrors.CordDispatchError(
        `Error dispatching to chain: "${errorMessage}".`
        )
    }
}


/**
 * Dispatches a request to archive a specified registry on the CORD blockchain.
 *
 * This function checks if the specified registry exists. If it does not exist,
 * an error is thrown. If the registry is found, it archives the specified registry
 * and submits the transaction to the chain.
 *
 * @param registryUri - The URI of the registry to be archived.
 * @param authorizationUri - The URI of the authorization associated with the registry.
 * @param authorAccount - The account that will authorize the archiving of the registry.
 * @returns A promise that resolves to an object containing the archived registry's URI and its authorization URI.
 * @throws {SDKErrors.CordDispatchError} If the registry does not exist or if an error occurs while dispatching to the chain.
 *
 * @example
 * // Example: Archive a registry
 * const archivedRegistry = await dispatchArchiveToChain(
 *     'registry:cord:example_registry_uri',
 *     'auth:cord:example_authorization_uri',
 *     authorAccount
 * );
 * console.log('Archived Registry URI:', archivedRegistry.uri);
 * 
 */
export async function dispatchArchiveToChain(
    registryUri: RegistryUri,
    authorizationUri: RegistryAuthorizationUri,
    authorAccount: CordKeyringPair,
): Promise<{ uri: RegistryUri, authorizationUri: RegistryAuthorizationUri }> {
    const registryObj = {
        uri: registryUri,
        authorizationUri: authorizationUri
    }

    const registryExists = await isRegistryStored(registryUri);

    if (!registryExists) {
        throw new SDKErrors.CordDispatchError(
            `Registry URI does not exist: "${registryUri}".`
        );
    }

    try {
        const api = ConfigService.get('api')

        const registryId = uriToIdentifier(registryUri);
        const authorizationId = uriToIdentifier(authorizationUri);
        
        const extrinsic = api.tx.registries.archive(
            registryId,
            authorizationId,
        );

        await Chain.signAndSubmitTx(extrinsic, authorAccount);

        return registryObj
    } catch(error) {
        const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error)
        throw new SDKErrors.CordDispatchError(
        `Error dispatching to chain: "${errorMessage}".`
        )
    }
}


/**
 * Dispatches a request to restore a already archived registry on the CORD blockchain.
 *
 * This function checks if the specified registry exists. If it does not exist,
 * an error is thrown. If the registry is found, it restores the specified registry
 * and submits the transaction to the chain.
 *
 * @param registryUri - The URI of the registry to be restored.
 * @param authorizationUri - The URI of the authorization associated with the registry.
 * @param authorAccount - The account that will authorize the restoration of the registry.
 * @returns A promise that resolves to an object containing the restored registry's URI and its authorization URI.
 * @throws {SDKErrors.CordDispatchError} If the registry does not exist or if an error occurs while dispatching to the chain.
 *
 * @example
 * // Example: Restore a registry
 * const restoredRegistry = await dispatchRestoreToChain(
 *     'registry:cord:example_registry_uri',
 *     'auth:cord:example_authorization_uri',
 *     authorAccount
 * );
 * console.log('Restored Registry URI:', restoredRegistry.uri);
 * 
 */
export async function dispatchRestoreToChain(
    registryUri: RegistryUri,
    authorizationUri: RegistryAuthorizationUri,
    authorAccount: CordKeyringPair,
): Promise<{ uri: RegistryUri, authorizationUri: RegistryAuthorizationUri }> {
    const registryObj = {
        uri: registryUri,
        authorizationUri: authorizationUri
    }

    const registryExists = await isRegistryStored(registryUri);

    if (!registryExists) {
        throw new SDKErrors.CordDispatchError(
            `Registry URI does not exist: "${registryUri}".`
        );
    }

    try {
        const api = ConfigService.get('api')

        const registryId = uriToIdentifier(registryUri);
        const authorizationId = uriToIdentifier(authorizationUri);
        
        const extrinsic = api.tx.registries.restore(
            registryId,
            authorizationId,
        );

        await Chain.signAndSubmitTx(extrinsic, authorAccount);

        return registryObj
    } catch(error) {
        const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error)
        throw new SDKErrors.CordDispatchError(
        `Error dispatching to chain: "${errorMessage}".`
        )
    }
}


/**
 * Dispatches a transaction to add a delegate authorization for a specified registry.
 *
 * This function creates an extrinsic based on the provided permission type, which determines
 * the kind of authorization to be granted to the specified delegate for the given registry.
 * It throws an error if an invalid permission is provided.
 *
 * @param permission - The type of permission to grant to the delegate. Must be one of the
 *                     defined `RegistryPermission` values (e.g., ASSERT, DELEGATE, ADMIN).
 * @param registryId - The identifier of the registry to which the delegate is being added.
 * @param delegateId - The identifier of the delegate to be authorized.
 * @param authorizationId - The identifier of the authorization associated with the delegate.
 * @returns An extrinsic that can be signed and submitted to the chain.
 * @throws {SDKErrors.InvalidPermissionError} If the provided permission is not valid.
 *
 * @example
 * // Example: Dispatch a transaction to add a delegate authorization
 * const extrinsic = dispatchDelegateAuthorizationTx(
 *     RegistryPermission.ASSERT,
 *     'registryId123',
 *     'delegateId456',
 *     'authorizationId789'
 * );
 * console.log('Extrinsic to be dispatched:', extrinsic);
 * 
 */
function dispatchDelegateAuthorizationTx(
  permission: RegistryPermissionType,
  registryId: string,
  delegateId: string,
  authorizationId: string
) {
  const api = ConfigService.get('api')

  switch (permission) {
    case RegistryPermission.ASSERT:
      return api.tx.registries.addDelegate(registryId, delegateId, authorizationId)
    case RegistryPermission.DELEGATE:
      return api.tx.registries.addDelegator(registryId, delegateId, authorizationId)
    case RegistryPermission.ADMIN:
      return api.tx.registries.addAdminDelegate(registryId, delegateId, authorizationId)
    default:
      throw new SDKErrors.InvalidPermissionError(
        `Permission not valid:"${permission}".`
      )
  }
}


/**
 * Dispatches a transaction to authorize a delegate for a specified registry.
 *
 * This function checks the existence of the registry and the authorization for the delegator,
 * then constructs an extrinsic to add the delegate authorization with the given permission.
 * It submits the transaction to the chain and throws an error if any step fails.
 *
 * @param request - The authorization request object, containing the registry URI, delegate URI, and permission.
 * @param delegatorAuthorizationUri - The authorization URI of the delegator authorizing the action.
 * @param authorAccount - The account of the author who signs and submits the transaction.
 * @returns The `RegistryAuthorizationUri` after successfully dispatching the authorization.
 * @throws {SDKErrors.CordDispatchError} If the registry or authorization does not exist, or if there's an error during dispatch.
 *
 * @example
 * // Example: Dispatch a delegate authorization to the chain
 * const authorizationUri = await dispatchDelegateAuthorization(
 *     {
 *         uri: 'registryUri123',
 *         delegateUri: 'did:cord:3delegate123',
 *         permission: RegistryPermission.ADMIN
 *     },
 *     'delegatorAuthorizationUri456',
 *     authorAccount
 * );
 * console.log('Authorization dispatched with URI:', authorizationUri);
 * 
 */
export async function dispatchDelegateAuthorization(
  request: IRegistryAuthorization,
  delegatorAuthorizationUri: RegistryAuthorizationUri,
  authorAccount: CordKeyringPair,
): Promise<RegistryAuthorizationUri> {
  try {

    const registryExists = await isRegistryStored(request.uri);
    if (!registryExists) {
        throw new SDKErrors.CordDispatchError(
            `Registry URI does not exist: "${request.uri}".`
        );
    }

    const authorizationExists = await isRegistryAuthorizationStored(delegatorAuthorizationUri);
    if (!authorizationExists) {
        throw new SDKErrors.CordDispatchError(
            `Registry Authorization URI does not exist: "${delegatorAuthorizationUri}".`
        );
    }

    const registryId = uriToIdentifier(request.uri);
    const delegateId = request.delegateUri.replace("did:cord:3", "");
    const delegatorAuthorizationId = uriToIdentifier(delegatorAuthorizationUri);

    const extrinsic = dispatchDelegateAuthorizationTx(
      request.permission,
      registryId,
      delegateId,
      delegatorAuthorizationId,
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
 * Removes a delegate from a registry on the chain.
 *
 * This method is used to remove a delegate's authorization from a given registry. It checks whether the registry
 * and the provided authorization exist on-chain, constructs the required parameters, and dispatches the extrinsic
 * to the blockchain for execution.
 *
 * @async
 * @function
 * @param {RegistryUri} registryUri - The URI of the registry from which the delegate will be removed.
 * @param {RegistryAuthorizationUri} removeAuthorizationUri - The URI of the authorization to be removed (i.e., the delegate's authorization).
 * @param {RegistryAuthorizationUri} authorizationUri - The URI of the authorization of the account performing the removal (the caller's authorization).
 * @param {CordKeyringPair} authorAccount - The account key pair of the entity removing the delegate, used for signing the transaction.
 * 
 * @returns {Promise<{ uri: RegistryUri, removeAuthorizationUri: RegistryAuthorizationUri, authorizationUri: RegistryAuthorizationUri }>} 
 *          An object containing the URIs related to the registry and authorizations.
 *          - `uri`: The URI of the registry.
 *          - `removeAuthorizationUri`: The authorization URI of the delegate being removed.
 *          - `authorizationUri`: The authorization URI of the signer performing the removal.
 * 
 * @throws {SDKErrors.CordDispatchError}
 * - If the registry URI does not exist on-chain.
 * - If the authorization URI of the signer does not exist on-chain.
 * - If an error occurs while dispatching the transaction to the chain.
 * 
 * @example
 * ```typescript
 * const registryUri = 'did:cord:registry:3abc...';
 * const removeAuthorizationUri = 'did:cord:auth:3xyz...';
 * const authorizationUri = 'did:cord:auth:3signer...';
 * const authorAccount = keyring.addFromUri('//Alice');
 * 
 * dispatchRemoveDelegateToChain(registryUri, removeAuthorizationUri, authorizationUri, authorAccount)
 *   .then(result => {
 *     console.log('Delegate removed:', result);
 *   })
 *   .catch(error => {
 *     console.error('Error removing delegate:', error);
 *   });
 * ```
 *
 * @description
 * The function first verifies the existence of the registry and the signer’s authorization on the blockchain.
 * It then encodes the provided URIs into identifiers and submits a signed transaction to remove the delegate
 * from the registry. If the removal is successful, it returns an object with the registry URI and relevant authorization URIs.
 *
 */
export async function dispatchRemoveDelegateToChain(
    registryUri: RegistryUri,
    removeAuthorizationUri: RegistryAuthorizationUri,
    authorizationUri: RegistryAuthorizationUri,
    authorAccount: CordKeyringPair,
): Promise<{ 
    uri: RegistryUri,
    removeAuthorizationUri: RegistryAuthorizationUri,
    authorizationUri: RegistryAuthorizationUri
}> {
    const registryObj = {
        uri: registryUri,
        removeAuthorizationUri: removeAuthorizationUri,
        authorizationUri: authorizationUri,
    }

    const registryExists = await isRegistryStored(registryUri);

    if (!registryExists) {
        throw new SDKErrors.CordDispatchError(
            `Registry URI does not exist: "${registryUri}".`
        );
    }

    const authorizationExists = await isRegistryAuthorizationStored(authorizationUri);
    if (!authorizationExists) {
        throw new SDKErrors.CordDispatchError(
            `Registry remover Authorization URI does not exist: "${authorizationUri}".`
        );
    }

    try {
        const api = ConfigService.get('api')

        const registryId = uriToIdentifier(registryUri);
        const removeAuthorizationId = uriToIdentifier(removeAuthorizationUri);
        const authorizationId = uriToIdentifier(authorizationUri);
        
        const extrinsic = api.tx.registries.removeDelegate(
            registryId,
            removeAuthorizationId,
            authorizationId,
        );

        await Chain.signAndSubmitTx(extrinsic, authorAccount);

        return registryObj
    } catch(error) {
        const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error)
        throw new SDKErrors.CordDispatchError(
        `Error dispatching to chain: "${errorMessage}".`
        )
    }
}
