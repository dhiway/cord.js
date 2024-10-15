/**
 * @packageDocumentation
 * @module Entries/chain
 *
 * The Entries module, a crucial part of the `DeDir (Decentralized Directory)`, provides a framework for 
 * managing decentralized entries or records within registries on the CORD blockchain. It enables 
 * the creation, updating, revocation, and reinstatement of entries in a transparent and trustless manner, 
 * ensuring that registries are managed in a decentralized environment. The Registries module manages 
 * governance and delegation for these registries.
 *
 * ## Overview
 *
 * The Entries module allows for the creation and modification of individual registry entries, each 
 * representing a unique record within a registry. These entries can be updated, revoked, or reinstated 
 * through a permissioned system. The decentralized nature of this module ensures trust, transparency, 
 * and immutability for registry entries on the CORD blockchain.
 *
 * ## Interface
 *
 * The Entries module provides several functions for managing registry entries:
 *
 * - `dispatchCreateEntryToChain`: Creates a new registry entry in a decentralized registry.
 * - `dispatchUpdateEntryToChain`: Updates an existing registry entry with new data.
 * - `dispatchRevokeEntryToChain`: Revokes a registry entry, marking it as inactive or invalid.
 * - `dispatchReinstateEntryToChain`: Restores a revoked registry entry to an active state.
 *
 * ## Usage
 *
 * The Entries module integrates with the Registries module to offer a decentralized directory 
 * management system. It can be used in various applications requiring transparent and decentralized 
 * record management, such as credential registries, asset tracking, or any system needing immutable 
 * and auditable records.
 * 
 * ## Examples
 *
 * - Create an entry for a verifiable credential in a decentralized identity registry.
 * - Revoke an entry that is no longer valid or relevant.
 * - Reinstate an entry after resolving governance issues or discrepancies.
 * 
 */
import { 
  SDKErrors,
} from '@cord.network/utils';


import {
    IRegistryEntry,
    EntryUri,
    CordKeyringPair,
} from '@cord.network/types';

import { Chain } from '@cord.network/network';

import { Option } from '@polkadot/types';

import { ConfigService } from '@cord.network/config'

import type {
  PalletEntriesRegistryEntryDetails,
} from '@cord.network/augment-api'

import {
  uriToIdentifier,
  uriToEntryIdAndDigest,
} from '@cord.network/identifier'

export async function isRegistryEntryStored(
  registryEntryId: string
): Promise<boolean> {
  try {
    const api = ConfigService.get('api');
    const encoded = await api.query.entries.registryEntries(registryEntryId) as Option<PalletEntriesRegistryEntryDetails>;

    return !encoded.isNone
  } catch (error) {
    throw new SDKErrors.CordQueryError(
      `Error querying the registry-entry: ${error}`
    )
  }
}


/**
 * Dispatches the creation of a new registry entry to the CORD blockchain by submitting an extrinsic.
 * 
 * This method constructs and submits an `entries.create` extrinsic to the CORD blockchain, allowing
 * for the creation of a new registry entry. It takes the details of the entry, such as the registry entry URI,
 * authorization URI, digest, and blob, and signs the transaction using the provided author account.
 *
 * @param {IRegistryEntry} registryEntryDetails - The details of the registry entry to be created, including the URI, authorization URI, digest, and blob.
 * @param {CordKeyringPair} authorAccount - The account (keyring pair) that will be used to sign and submit the extrinsic to the blockchain.
 * 
 * @returns {Promise<EntryUri>} - A promise that resolves to the URI of the created registry entry if the transaction is successful.
 * 
 * @throws {SDKErrors.CordDispatchError} - Throws an error if the transaction fails or encounters an issue during submission.
 * 
 * @example
 * ```typescript
 * const registryEntryDetails = {
 *   uri: 'entryUri123',
 *   authorizationUri: 'authUri456',
 *   digest: '0x123...',
 *   blob: '{"key": "value"}'
 * };
 * 
 * const authorAccount = await CordKeyring.createFromUri('//Alice');
 * 
 * try {
 *   const entryUri = await dispatchCreateEntryToChain(registryEntryDetails, authorAccount);
 *   console.log('Registry Entry created with URI:', entryUri);
 * } catch (error) {
 *   console.error('Error creating registry entry:', error);
 * }
 * ```
 */
export async function dispatchCreateEntryToChain(
  registryEntryDetails: IRegistryEntry,
  authorAccount: CordKeyringPair
): Promise<EntryUri> {
  try {
    const api = ConfigService.get('api'); 

    const registryEntryObj = uriToEntryIdAndDigest(registryEntryDetails.uri);

    const registryEntryId = registryEntryObj.identifier;
    const authorizationId = uriToIdentifier(registryEntryDetails.authorizationUri);

    const registryEntryExists = await isRegistryEntryStored(registryEntryId);
    if (registryEntryExists) {
      throw new SDKErrors.CordDispatchError(
        `Registry Entry already exists at URI: "${registryEntryDetails.uri}".`
      );
    }

    const extrinsic = api.tx.entries.create(
        registryEntryId,
        authorizationId,
        registryEntryDetails.digest,
        registryEntryDetails.blob,
    );

    await Chain.signAndSubmitTx(extrinsic, authorAccount);
    return registryEntryDetails.uri;
} catch (error) {
    const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
        `Error dispatching to chain: "${errorMessage}".`
    );
  }
}


/**
 * Dispatches an update operation for a registry entry to the blockchain. 
 * The function verifies the existence of the entry on-chain and submits an extrinsic 
 * to update it with the provided digest and blob values. 
 * 
 * It ensures that the registry entry exists before proceeding with the update and handles 
 * errors related to on-chain operations by throwing relevant exceptions.
 *
 * @param {IRegistryEntry} registryEntryDetails - An object containing the registry entry's details:
 *  - `uri`: The URI identifying the registry entry to be updated.
 *  - `digest`: A hash representing the contents of the blob associated with the entry.
 *  - `blob`: The optional serialized content associated with the registry entry.
 *  - `authorizationUri`: The URI authorizing the update.
 *  - `registryUri`: The URI identifying the registry to which the entry belongs.
 *  - `creatorUri`: The DID URI of the account that initially created the registry entry.
 *
 * @param {CordKeyringPair} authorAccount - The keypair of the account authorized to sign 
 * and submit the transaction.
 *
 * @throws {SDKErrors.CordDispatchError} - Thrown if:
 *  - The registry entry does not exist on-chain.
 *  - An error occurs during the transaction dispatch or validation.
 *
 * @returns {Promise<EntryUri>} - A promise that resolves to the URI of the successfully updated 
 * registry entry.
 * 
 */
export async function dispatchUpdateEntryToChain(
  registryEntryDetails: IRegistryEntry,
  authorAccount: CordKeyringPair
): Promise<EntryUri> {
  try {
    const api = ConfigService.get('api'); 

    const registryEntryObj = uriToEntryIdAndDigest(registryEntryDetails.uri);

    const registryEntryId = registryEntryObj.identifier;
    const authorizationId = uriToIdentifier(registryEntryDetails.authorizationUri);

    const registryEntryExists = await isRegistryEntryStored(registryEntryId);
    if (!registryEntryExists) {
      throw new SDKErrors.CordDispatchError(
        `Registry Entry does not exists at URI: "${registryEntryDetails.uri}".`
      );
    }

    const extrinsic = api.tx.entries.update(
        registryEntryId,
        authorizationId,
        registryEntryDetails.digest,
        registryEntryDetails.blob,
    );

    await Chain.signAndSubmitTx(extrinsic, authorAccount);
    return registryEntryDetails.uri;
  } catch (error) {
    const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
        `Error dispatching to chain: "${errorMessage}".`
    );
  }
}
