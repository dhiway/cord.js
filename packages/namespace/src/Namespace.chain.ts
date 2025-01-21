
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
} from '@cord.network/types';

import {
  uriToIdentifier,
} from '@cord.network/identifier'
import { PalletNamespaceNameSpaceDetails } from '@cord.network/augment-api';


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
