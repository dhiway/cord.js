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
  DecoderUtils,
} from '@cord.network/utils';


import {
    IRegistriesEntry as IRegistryEntry,
    EntryUri,
    CordKeyringPair,
    encodeAddress,
    Option,
    RegistryAuthorizationUri,
    IRegistriesEntryChainStorage as IRegistryEntryChainStorage,
    RegistriesUri as RegistryUri,
    DidUri,
    CordAddress
} from '@cord.network/types';

import { Chain } from '@cord.network/network';

import { ConfigService } from '@cord.network/config'

import type {
  PalletEntriesRegistryEntryDetails,
} from '@cord.network/augment-api'

import {
  uriToIdentifier,
  uriToEntryIdAndDigest,
  identifierToUri,
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


/**
 * Revokes a registry entry on the blockchain by dispatching an extrinsic.
 * Ensures that the registry entry exists before attempting revocation.
 *
 * @param {EntryUri} registryEntryUri - The URI that identifies the registry entry to revoke.
 * @param {RegistryAuthorizationUri} authorizationUri - The URI identifying the authorization for revocation.
 * @param {CordKeyringPair} authorAccount - The account that signs and submits the transaction.
 * 
 * @returns {Promise<EntryUri>} - Resolves to the same `EntryUri` if revocation succeeds.
 *
 * @throws {SDKErrors.CordDispatchError} - Throws if the registry entry does not exist or if an error occurs during dispatch.
 *
 * @example
 * try {
 *   const revokedEntryUri = await dispatchRevokeToChain(
 *     'entry-uri',
 *     'authorization-uri',
 *     authorAccount
 *   );
 *   console.log(`Successfully revoked: ${revokedEntryUri}`);
 * } catch (error) {
 *   console.error(`Revocation failed: ${error.message}`);
 * }
 */
export async function dispatchRevokeEntryToChain(
    registryEntryUri: EntryUri,
    authorizationUri: RegistryAuthorizationUri,
    authorAccount: CordKeyringPair,
): Promise<EntryUri> {

    const registryEntryObj = uriToEntryIdAndDigest(registryEntryUri);

    const registryEntryId = registryEntryObj.identifier;
    const authorizationId = uriToIdentifier(authorizationUri);

    const registryEntryExists = await isRegistryEntryStored(registryEntryId);
    if (!registryEntryExists) {
      throw new SDKErrors.CordDispatchError(
        `Registry Entry does not exists at URI: "${registryEntryUri}".`
      );
    }

    try {
        const api = ConfigService.get('api')

        const extrinsic = api.tx.entries.revoke(
            registryEntryId,
            authorizationId,
        );

        await Chain.signAndSubmitTx(extrinsic, authorAccount);

        return registryEntryUri
    } catch(error) {
        const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error)
        throw new SDKErrors.CordDispatchError(
        `Error dispatching to chain: "${errorMessage}".`
        )
    }
}


/**
 * Reinstates a previously revoked registry entry on the blockchain.
 * Validates the existence of the registry entry before attempting the reinstatement.
 *
 * @param {EntryUri} registryEntryUri - The URI that identifies the registry entry to reinstate.
 * @param {RegistryAuthorizationUri} authorizationUri - The URI used to authorize the reinstatement.
 * @param {CordKeyringPair} authorAccount - The account used to sign and submit the reinstatement transaction.
 * 
 * @returns {Promise<EntryUri>} - Resolves to the same `EntryUri` if the reinstatement succeeds.
 *
 * @throws {SDKErrors.CordDispatchError} - Throws if the registry entry does not exist or an error occurs during the transaction.
 *
 * @example
 * try {
 *   const reinstatedEntryUri = await dispatchReinstateToChain(
 *     'entry-uri',
 *     'authorization-uri',
 *     authorAccount
 *   );
 *   console.log(`Successfully reinstated: ${reinstatedEntryUri}`);
 * } catch (error) {
 *   console.error(`Reinstatement failed: ${error.message}`);
 * }
 */
export async function dispatchReinstateEntryToChain(
    registryEntryUri: EntryUri,
    authorizationUri: RegistryAuthorizationUri,
    authorAccount: CordKeyringPair,
): Promise<EntryUri> {

    const registryEntryObj = uriToEntryIdAndDigest(registryEntryUri);

    const registryEntryId = registryEntryObj.identifier;
    const authorizationId = uriToIdentifier(authorizationUri);

    const registryEntryExists = await isRegistryEntryStored(registryEntryId);
    if (!registryEntryExists) {
      throw new SDKErrors.CordDispatchError(
        `Registry Entry does not exists at URI: "${registryEntryUri}".`
      );
    }

    try {
        const api = ConfigService.get('api')

        const extrinsic = api.tx.entries.reinstate(
            registryEntryId,
            authorizationId,
        );

        await Chain.signAndSubmitTx(extrinsic, authorAccount);

        return registryEntryUri
    } catch(error) {
        const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error)
        throw new SDKErrors.CordDispatchError(
        `Error dispatching to chain: "${errorMessage}".`
        )
    }
}


/**
 * Decodes the registry entry details from the blockchain state.
 * This function takes an optional encoded entry and an identifier,
 * then extracts and formats the relevant properties into a structured object.
 *
 * @param {Option<PalletEntriesRegistryEntryDetails>} encoded - 
 * The optional encoded data from the blockchain representing the registry entry details. 
 * It may contain the entry details or be `None`.
 * 
 * @param {string} identifier - 
 * The identifier used to generate the URI for the registry entry.
 *
 * @returns {IRegistryEntryChainStorage | null} 
 * - Returns an object containing the decoded registry entry details structured as `IRegistryEntryChainStorage`.
 * - If the encoded data is `None`, returns `null`.
 * 
 * @example
 * // Example Usage:
 * const encodedEntryDetails = ... // fetched from the blockchain
 * const identifier = "someIdentifier";
 * 
 * const registryEntry = decodeRegistryEntryDetailsFromChain(encodedEntryDetails, identifier);
 * console.log(registryEntry); // Outputs the decoded registry entry details.
 *
 */
export function decodeRegistryEntryDetailsFromChain(
  encoded: Option<PalletEntriesRegistryEntryDetails>,
  identifier: string
): IRegistryEntryChainStorage | null {
  if (encoded.isNone) {
    return null; 
  }

  const chainRegistryEntry = encoded.unwrap(); 

  /* 
   * Below code block encodes the data from the chain present in raw
   * to its respective formats.
   */
  const registryEntry: IRegistryEntryChainStorage = {
    uri: identifierToUri(identifier) as EntryUri,
    digest: chainRegistryEntry.digest.toHex() as IRegistryEntryChainStorage['digest'],
    revoked: chainRegistryEntry.revoked.valueOf(),
    creatorUri: `did:cord:3${encodeAddress(chainRegistryEntry.creator, 29)}` as DidUri,
    registryUri: identifierToUri(
      DecoderUtils.hexToString(chainRegistryEntry.registryId.toString())
    ) as RegistryUri
  };

  return registryEntry;
}


/**
 * Retrieves the details of a registry entry from the blockchain using the provided identifier.
 * This asynchronous function queries the blockchain for the registry entry associated with
 * the specified identifier and decodes the details into a structured format.
 *
 * @param {string} identifier - 
 * The identifier used to query the registry entry from the blockchain.
 *
 * @returns {Promise<IRegistryEntryChainStorage | null>} 
 * - Returns a promise that resolves to an object containing the decoded registry entry details
 * structured as `IRegistryEntryChainStorage`.
 * - If no entry is found, it throws an error.
 * 
 * @throws {SDKErrors.CordFetchError} 
 * Throws an error if there is no registry entry associated with the provided identifier.
 * 
 * @example
 * // Example Usage:
 * const identifier = "someIdentifier";
 * 
 * try {
 *   const entryDetails = await getDetailsfromChain(identifier);
 *   console.log(entryDetails); // Outputs the registry entry details.
 * } catch (error) {
 *   console.error(error.message); // Handle the error accordingly.
 * }
 * 
 */
export async function getDetailsfromChain(
  identifier: string
): Promise<IRegistryEntryChainStorage | null> {
  const api = ConfigService.get('api');
  const registryEntryId = uriToIdentifier(identifier);

  const registryEntry = await api.query.entries.registryEntries(registryEntryId);

  const decodedDetails = decodeRegistryEntryDetailsFromChain(registryEntry, identifier);

  if (!decodedDetails) {
    throw new SDKErrors.CordFetchError(
      `There is no registry entry with the provided ID "${registryEntryId}" present on the chain.`
    );
  }

  return decodedDetails;
}


/**
 * Fetches the registry entry details from the blockchain using the specified entry URI.
 * This asynchronous function converts the entry URI into its corresponding identifier,
 * retrieves the details of the registry entry from the blockchain, and returns them in a
 * structured format.
 *
 * @param {EntryUri} registryEntryUri - 
 * The URI of the registry entry for which details are to be fetched.
 *
 * @returns {Promise<IRegistryEntryChainStorage>} 
 * - Returns a promise that resolves to an object containing the decoded registry entry details
 * structured as `IRegistryEntryChainStorage`.
 * 
 * @throws {SDKErrors.CordFetchError} 
 * Throws an error if no registry entry is found associated with the provided URI.
 * 
 * @example
 * // Example Usage:
 * const registryEntryUri = "someEntryUri";
 * 
 * try {
 *   const entryDetails = await fetchRegistryEntryDetailsFromChain(registryEntryUri);
 *   console.log(entryDetails); // Outputs the registry entry details.
 * } catch (error) {
 *   console.error(error.message); // Handle the error accordingly.
 * }
 * 
 */
export async function fetchRegistryEntryDetailsFromChain(
  registryEntryUri: EntryUri
): Promise<IRegistryEntryChainStorage> {
  const registryEntryObj = uriToEntryIdAndDigest(registryEntryUri);

  const entryDetails = await getDetailsfromChain(registryEntryObj.identifier);

  if (!entryDetails) {
    throw new SDKErrors.CordFetchError(
      `There is no registry entry with the provided ID "${registryEntryObj.identifier}" present on the chain.`
    );
  }

  return entryDetails;
}


/**
 * Dispatches an extrinsic to update the ownership of a registry entry on the blockchain.
 * This function sends an on-chain transaction to transfer ownership of a specified registry
 * entry to a new owner, using the provided authorization identifiers.
 *
 * @param {EntryUri} registryEntryUri - 
 * The URI of the registry entry for which ownership is being updated.
 * 
 * @param {RegistryAuthorizationUri} authorizationUri - 
 * The URI of the authorization linked to the current owner of the registry entry.
 *
 * @param {CordAddress} newOwnerAccount - 
 * The address of the new owner to whom ownership is being transferred.
 * 
 * @param {RegistryAuthorizationUri} newOwnerAuthorizationUri - 
 * The URI of the authorization linked to the new owner.
 *
 * @param {CordKeyringPair} authorAccount - 
 * The account of the current owner or authorized delegate, used to authorize and sign the transaction.
 * 
 * @returns {Promise<EntryUri>} 
 * - Returns a promise that resolves to the URI of the registry entry after successfully updating ownership.
 * 
 * @throws {SDKErrors.CordDispatchError} 
 * Throws an error if the registry entry does not exist or if there is any issue while dispatching the extrinsic to the chain.
 * 
 * @example
 * // Example Usage:
 * const registryEntryUri = "someEntryUri";
 * const authorizationUri = "someAuthorizationUri";
 * const newOwnerAccount = "5Dw8p5aZxtLKLDBnYP5r9ePNSwD7FozknBhXtXaV4awZ6kfK";
 * const newOwnerAuthorizationUri = "newOwnerAuthorizationUri";
 * const authorAccount = authorKeyringPair;
 * 
 * try {
 *   const updatedUri = await dispatchUpdateOwnershipToChain(
 *     registryEntryUri,
 *     authorizationUri,
 *     newOwnerAccount,
 *     newOwnerAuthorizationUri,
 *     authorAccount
 *   );
 *   console.log(updatedUri); // Outputs the updated registry entry URI.
 * } catch (error) {
 *   console.error(error.message); // Handle the error accordingly.
 * }
 * 
 */
export async function dispatchUpdateOwnershipToChain(
  registryEntryUri: EntryUri,
  authorizationUri: RegistryAuthorizationUri,
  newOwnerAccount:  CordAddress,
  newOwnerAuthorizationUri: RegistryAuthorizationUri,
  authorAccount: CordKeyringPair,
): Promise<EntryUri> {
  try {

    const api = ConfigService.get('api');
    const registryEntryObj = uriToEntryIdAndDigest(registryEntryUri);

    const registryEntryId = registryEntryObj.identifier;
    const authorizationId = uriToIdentifier(authorizationUri);
    const newOwnerAuthorizationId = uriToIdentifier(newOwnerAuthorizationUri);

    const registryEntryExists = await isRegistryEntryStored(registryEntryId);
    if (!registryEntryExists) {
      throw new SDKErrors.CordDispatchError(
        `Registry Entry does not exists at URI: "${registryEntryUri}".`
      );
    }

    const extrinsic = api.tx.entries.updateOwnership(
        registryEntryId,
        authorizationId,
        newOwnerAccount,
        newOwnerAuthorizationId,
    );

    await Chain.signAndSubmitTx(extrinsic, authorAccount);
    return registryEntryUri;
} catch (error) {
    const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
        `Error dispatching to chain: "${JSON.stringify(errorMessage)}".`
    );
  }
}
