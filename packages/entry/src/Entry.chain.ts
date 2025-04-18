/**
 * @packageDocumentation
 * @module Entry/chain
 *
 * The Entries module, a crucial part of the Decentralized Directory (DeDir) system on the CORD blockchain,
 * provides a framework for managing decentralized entries or records within registries. It enables the creation,
 * updating, revocation, reinstatement, and ownership transfer of entries in a transparent and trustless manner,
 * ensuring that registries are managed in a decentralized environment. The Registry module manages governance
 * and delegation for these registries.
 *
 * ## Overview
 *
 * The Entries module allows for the creation and modification of individual registry entries, each representing
 * a unique record within a registry, identified by a URI (e.g., `entry:cord:abc123...`). These entries can be
 * updated, revoked, reinstated, or transferred through a permissioned system. The decentralized nature of this
 * module ensures trust, transparency, and immutability for registry entries on the CORD blockchain.
 *
 * ## Interface
 *
 * The Entries module provides the following functions for managing registry entries:
 *
 * - `isRegistryEntryStored`: Checks if a registry entry exists on-chain.
 * - `dispatchCreateEntryToChain`: Creates a new registry entry in a decentralized registry.
 * - `dispatchUpdateEntryToChain`: Updates an existing registry entry with new data.
 * - `dispatchRevokeEntryToChain`: Revokes a registry entry, marking it as inactive or invalid.
 * - `dispatchReinstateEntryToChain`: Restores a revoked registry entry to an active state.
 * - `dispatchUpdateOwnershipToChain`: Transfers ownership of a registry entry to a new account.
 * - `decodeRegistryEntryDetailsFromChain`: Decodes on-chain entry data into a structured format.
 * - `getDetailsfromChain`: Retrieves entry details by identifier.
 * - `fetchRegistryEntryDetailsFromChain`: Fetches entry details by URI.
 *
 * ## Usage
 *
 * The Entries module integrates with the Registry module to offer a decentralized directory management system.
 * It can be used in various applications requiring transparent and decentralized record management, such as
 * credential registries, asset tracking, or any system needing immutable and auditable records.
 *
 * ## Examples
 *
 * - Create an entry for a verifiable credential in a decentralized identity registry.
 * - Update an entry’s metadata for an asset in a supply chain registry.
 * - Revoke an entry that is no longer valid or relevant.
 * - Reinstate an entry after resolving governance issues.
 * - Transfer ownership of a digital asset to a new account.
 */
import { 
  SDKErrors,
  DecoderUtils,
} from '@cord.network/utils';


import {
    IRegistryEntry,
    IRegistryEntryUpdate,
    CordKeyringPair,
    Option,
    IRegistryEntryChainStorage,
    EntryId,
    RegistryId,
    CordAddress,
    SubmittableExtrinsic
} from '@cord.network/types';

import { Chain } from '@cord.network/network';

import { ConfigService } from '@cord.network/config'

import type {
  PalletEntryRegistryEntryDetails,
} from '@cord.network/augment-api'

/**
 * Checks whether a registry entry exists on the CORD blockchain.
 *
 * Queries the chain using the provided registry entry identifier to determine if an entry is stored.
 *
 * @param registryEntryId - The identifier of the registry entry to check (without `entry:cord:` prefix).
 * @returns A promise resolving to `true` if the entry exists, `false` otherwise.
 * @throws {SDKErrors.CordQueryError} If an error occurs while querying the blockchain.
 *
 * @example
 * ```typescript
 * const exists = await isRegistryEntryStored('abc123');
 * console.log(`Entry exists: ${exists}`); // true or false
 * ```
 */
export async function isRegistryEntryStored(
  registryEntryId: string
): Promise<boolean> {
  try {
    const api = ConfigService.get('api');
    const encoded = await api.query.entry.registryEntries(registryEntryId) as Option<PalletEntryRegistryEntryDetails>;

    return !encoded.isNone
  } catch (error) {
    throw new SDKErrors.CordQueryError(
      `Error querying the registry-entry: ${error}`
    )
  }
}


/**
 * Prepares a transaction to create a new registry entry on the CORD blockchain.
 *
 * Constructs an extrinsic using the provided registry entry details, including the registry ID,
 * transaction hash, and optional blob data.
 *
 * @param registryEntryDetails - The details of the entry to create.
 * @param registryEntryDetails.registryId - The identifier of the registry (e.g., `2Ld3xygo...`).
 * @param registryEntryDetails.tx_hash - The hash of the entry’s content.
 * @param registryEntryDetails.blob - Optional serialized content for the entry.
 * @returns A promise resolving to the prepared extrinsic for submission.
 * @throws {SDKErrors.CordDispatchError} If an error occurs while preparing the extrinsic.
 *
 * @example
 * ```typescript
 * const entryDetails = {
 *   '2Lwed3xygo...',
 *   tx_hash: '0x1234abcd...',
 *   blob: '{"data":"example"}',
 * };
 * const extrinsic = await prepareCreateExtrinsic(entryDetails);
 * console.log(extrinsic); // Prepared extrinsic for submission
 * ```
 */
export async function prepareCreateExtrinsic(
  registryEntryDetails: IRegistryEntry,
): Promise<SubmittableExtrinsic> {
  try {
    const api = ConfigService.get('api'); 

    const extrinsic = api.tx.entry.create(
        registryEntryDetails.registryId,
        registryEntryDetails.tx_hash,
        registryEntryDetails.blob
    );

    return extrinsic;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
      `Error preparing extrinsic: "${errorMessage}".`
    );
  }
}


/**
 * Dispatches a transaction to create a new registry entry on the CORD blockchain.
 *
 * Creates a new entry within a specified registry, storing its transaction hash and optional blob data.
 *
 * @param registryEntryDetails - The details of the entry to create.
 * @param registryEntryDetails.registryId - The identifier of the registry (e.g., `2Lewf3xygo...`).
 * @param registryEntryDetails.tx_hash - The hash of the entry’s content.
 * @param registryEntryDetails.blob - Optional serialized content for the entry.
 * @param authorAccount - The keyring pair of the account authorizing the transaction.
 * @returns A promise that resolves when the transaction is submitted successfully.
 * @throws {SDKErrors.CordDispatchError} If the transaction fails or is invalid.
 *
 * @example
 * ```typescript
 * const entryDetails = {
 *   registryId: '2Lddw3xygo...',
 *   tx_hash: '0x1234abcd...',
 *   blob: '{"data":"example"}',
 * };
 * await dispatchCreateEntryToChain(entryDetails, authorAccount);
 * console.log('✅ Entry created');
 * ```
 */
export async function dispatchCreateEntryToChain(
  registryEntryDetails: IRegistryEntry,
  authorAccount: CordKeyringPair
): Promise<void> {
  try {
    const extrinsic = await prepareCreateExtrinsic(registryEntryDetails);

    await Chain.signAndSubmitTx(extrinsic, authorAccount);
} catch (error) {
    const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
        `Error dispatching to chain: "${errorMessage}".`
    );
  }
}


/**
 * Prepares a transaction to update an existing registry entry on the CORD blockchain.
 *
 * Constructs an extrinsic using the provided registry entry details, including the registry ID,
 * transaction hash, and optional blob data.
 *
 * @param registryEntryDetails - The details of the entry to update.
 * @param registryEntryDetails.registryEntryId - The identifier of the entry to update (e.g., `2Lwdabc123...`).
 * @param registryEntryDetails.registryId - The identifier of the registry (e.g., `2Lsd3xygo...`).
 * @param registryEntryDetails.tx_hash - The new hash of the entry’s content.
 * @param registryEntryDetails.blob - Optional updated serialized content.
 * @returns A promise resolving to the prepared extrinsic for submission.
 * @throws {SDKErrors.CordDispatchError} If an error occurs while preparing the extrinsic.
 *
 * @example
 * ```typescript
 * const updateDetails = {
 *   registryEntryId: '2Kwdabc123...',
 *   registryId: '2Lwdjh3xygo...',
 *   tx_hash: '0x5678efgh...',
 *   blob: '{"data":"updated"}',
 * };
 * const extrinsic = await prepareUpdateExtrinsic(updateDetails);
 * console.log(extrinsic); // Prepared extrinsic for submission
 * ```
 */
export async function prepareUpdateExtrinsic(
  registryEntryDetails: IRegistryEntryUpdate,
): Promise<SubmittableExtrinsic> {
  try {
    const api = ConfigService.get('api'); 

    const registryEntryExists = await isRegistryEntryStored(registryEntryDetails.registryEntryId);
    if (!registryEntryExists) {
      throw new SDKErrors.CordDispatchError(
        `Registry Entry does not exists at URI: "${registryEntryDetails.registryEntryId}".`
      );
    }

    const extrinsic = api.tx.entry.update(
        registryEntryDetails.registryId,
        registryEntryDetails.registryEntryId,
        registryEntryDetails.tx_hash,
        registryEntryDetails.blob,
    );
    
    return extrinsic;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
      `Error preparing extrinsic: "${errorMessage}".`
    );
  }
}


/**
 * Dispatches a transaction to update an existing registry entry on the CORD blockchain.
 *
 * Verifies the entry exists before updating its transaction hash and optional blob data.
 *
 * @param registryEntryDetails - The details for updating the entry.
 * @param registryEntryDetails.registryEntryId - The identifier of the entry to update (e.g., `2Lwdbabc123...`).
 * @param registryEntryDetails.registryId - The URI of the registry (e.g., `2Lwqd3xygo...`).
 * @param registryEntryDetails.tx_hash - The new hash of the entry’s content.
 * @param registryEntryDetails.blob - Optional updated serialized content.
 * @param authorAccount - The keyring pair of the account authorizing the transaction.
 * @returns A promise that resolves when the transaction is submitted successfully.
 * @throws {SDKErrors.CordDispatchError} If the entry doesn’t exist or the transaction fails.
 *
 * @example
 * ```typescript
 * const updateDetails = {
 *   registryEntryId: '2Lddabc123...',
 *   registryId: '2Lwdk3xygo...',
 *   tx_hash: '0x5678efgh...',
 *   blob: '{"data":"updated"}',
 * };
 * await dispatchUpdateEntryToChain(updateDetails, authorAccount);
 * console.log('✅ Entry updated');
 * ```
 */
export async function dispatchUpdateEntryToChain(
  registryEntryDetails: IRegistryEntryUpdate,
  authorAccount: CordKeyringPair
): Promise<void> {
  try {
    const extrinsic = await prepareUpdateExtrinsic(registryEntryDetails);

    await Chain.signAndSubmitTx(extrinsic, authorAccount);
  } catch (error) {
    const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
        `Error dispatching to chain: "${errorMessage}".`
    );
  }
}


/**
 * Prepares a transaction to revoke a registry entry on the CORD blockchain.
 *
 * Constructs an extrinsic using the provided registry and entry URIs.
 *
 * @param registryId - The identifier of the registry containing the entry (e.g., `2Ldwedxygo...`).
 * @param registryEntryId - The identifier of the entry to revoke (e.g., `2Lwedabc123...`).
 * @returns A promise resolving to the prepared extrinsic for submission.
 * @throws {SDKErrors.CordDispatchError} If an error occurs while preparing the extrinsic.
 *
 * @example
 * ```typescript
 * const extrinsic = await prepareRevokeEntryExtrinsic(
 *   '2Kska3xygo...',
 *   '2Kedjbc123...'
 * );
 * console.log(extrinsic); // Prepared extrinsic for submission
 * ```
 */
export async function prepareRevokeEntryExtrinsic(
  registryId: RegistryId,
  registryEntryId: EntryId,
): Promise<SubmittableExtrinsic> {
  try {
    const registryEntryExists = await isRegistryEntryStored(registryEntryId);
    if (!registryEntryExists) {
      throw new SDKErrors.CordDispatchError(
        `Registry Entry does not exists at URI: "${registryEntryId}".`
      );
    }

    const api = ConfigService.get('api')

    const extrinsic = api.tx.entry.revoke(
        registryId,
        registryEntryId,
    );

    return extrinsic;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
      `Error preparing extrinsic: "${errorMessage}".`
    );
  }
}


/**
 * Dispatches a transaction to revoke a registry entry on the CORD blockchain.
 *
 * Marks an entry as inactive or invalid, ensuring it exists before revocation.
 *
 * @param registryId - The identifier of the registry containing the entry (e.g., `2Lwfe3xygo...`).
 * @param registryEntryId - The identifier of the entry to revoke (e.g., `2Lweabc123...`).
 * @param authorAccount - The keyring pair of the account authorizing the transaction.
 * @returns A promise that resolves when the transaction is submitted successfully.
 * @throws {SDKErrors.CordDispatchError} If the entry doesn’t exist or the transaction fails.
 * @example
 * ```typescript
 * await dispatchRevokeEntryToChain(
 *   'registry:cord:3xygo...',
 *   'entry:cord:abc123...',
 *   authorAccount
 * );
 * console.log('✅ Entry revoked');
 * ```
 */
export async function dispatchRevokeEntryToChain(
    registryId: RegistryId,
    registryEntryId: EntryId,
    authorAccount: CordKeyringPair,
): Promise<void> {
    try {
      const extrinsic = await prepareRevokeEntryExtrinsic(
        registryId,
        registryEntryId
      );

      await Chain.signAndSubmitTx(extrinsic, authorAccount);
    } catch(error) {
        const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error)
        throw new SDKErrors.CordDispatchError(
        `Error dispatching to chain: "${errorMessage}".`
        )
    }
}


/**
 * Prepares a transaction to reinstate a previously revoked registry entry on the CORD blockchain.
 *
 * Constructs an extrinsic using the provided registry and entry URIs.
 *
 * @param registryId - The identifier of the registry containing the entry (e.g., `2Lqwek3xygo...`).
 * @param registryEntryId - The identifier of the entry to reinstate (e.g., `2JKdwabc123...`).
 * @returns A promise resolving to the prepared extrinsic for submission.
 * @throws {SDKErrors.CordDispatchError} If an error occurs while preparing the extrinsic.
 *
 * @example
 * ```typescript
 * const extrinsic = await prepareReinstateEntryExtrinsic(
 *   '2bWEb3xygo...',
 *   '2JHVabc123...'
 * );
 * console.log(extrinsic); // Prepared extrinsic for submission
 * ```
 */
export async function prepareReinstateEntryExtrinsic(
  registryId: RegistryId,
  registryEntryId: EntryId,
): Promise<SubmittableExtrinsic> {
  try {

    const registryEntryExists = await isRegistryEntryStored(registryEntryId);
    if (!registryEntryExists) {
      throw new SDKErrors.CordDispatchError(
        `Registry Entry does not exists at URI: "${registryEntryId}".`
      );
    }

    const api = ConfigService.get('api')

    const extrinsic = api.tx.entry.reinstate(
        registryId,
        registryEntryId,
    );

    return extrinsic;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
      `Error preparing extrinsic: "${errorMessage}".`
    );
  }
}


/**
 * Dispatches a transaction to reinstate a previously revoked registry entry on the CORD blockchain.
 *
 * Restores an entry to active status, ensuring it exists before reinstatement.
 *
 * @param registryId - The identifier of the registry containing the entry (e.g., `2Lwde3xygo...`).
 * @param registryEntryId - The identifier of the entry to reinstate (e.g., `2Kwfjhabc123...`).
 * @param authorAccount - The keyring pair of the account authorizing the transaction.
 * @returns A promise that resolves when the transaction is submitted successfully.
 * @throws {SDKErrors.CordDispatchError} If the entry doesn’t exist or the transaction fails.
 *
 * @example
 * ```typescript
 * await dispatchReinstateEntryToChain(
 *   '2Kwe3xygo...',
 *   '2wefhjabc123...',
 *   authorAccount
 * );
 * console.log('✅ Entry reinstated');
 * ```
 */
export async function dispatchReinstateEntryToChain(
    registryId: RegistryId,
    registryEntryId: EntryId,
    authorAccount: CordKeyringPair,
): Promise<void> {
  try {
    const extrinsic = await prepareReinstateEntryExtrinsic(
      registryId,
      registryEntryId
    );

    await Chain.signAndSubmitTx(extrinsic, authorAccount);
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
 *
 * Takes an optional encoded entry and an identifier, then extracts and formats the relevant properties
 * into a structured object containing the entry’s URI, transaction hash, revocation status, creator,
 * and registry URI.
 *
 * @param encoded - The optional encoded data from the blockchain, containing entry details or `None`.
 * @param registryEntryId - The identifier used to generate the entry’s id
 * @returns The decoded entry details as `IRegistryEntryChainStorage`, or `null` if `encoded` is `None`.
 *
 * @example
 * ```typescript
 * const encoded = await api.query.entry.registryEntries('abc123');
 * const details = decodeRegistryEntryDetailsFromChain(encoded, 'abc123');
 * console.log(details); // { uri: 'entry:cord:abc123...', tx_hash: '0x...', ... }
 * ```
 */
export function decodeRegistryEntryDetailsFromChain(
  encoded: Option<PalletEntryRegistryEntryDetails>,
  registryEntryId: string
): IRegistryEntryChainStorage | null {
  if (encoded.isNone) {
    return null; 
  }

  const chainRegistryEntry = encoded.unwrap(); 
  const registryId = DecoderUtils.hexToString(chainRegistryEntry.registryId.toString());

  /* 
   * Below code block encodes the data from the chain present in raw
   * to its respective formats.
   */
  const registryEntry: IRegistryEntryChainStorage = {
    registryEntryId: registryEntryId,
    tx_hash: chainRegistryEntry.txHash.toHex(),
    revoked: chainRegistryEntry.revoked.valueOf(),
    creator: chainRegistryEntry.creator.toHuman() as string,
    registryId: registryId
  };

  return registryEntry;
}


/**
 * Retrieves the details of a registry entry from the blockchain using the provided identifier.
 *
 * Queries the blockchain for the registry entry associated with the specified identifier and decodes
 * the details into a structured format.
 *
 * @param registryEntryId - The identifier used to query the entry (without `entry:cord:` prefix).
 * @returns A promise resolving to the decoded entry details as `IRegistryEntryChainStorage`, or `null` if not found.
 * @throws {SDKErrors.CordFetchError} If no entry exists for the provided identifier.
 *
 * @example
 * ```typescript
 * const details = await getDetailsfromChain('abc123');
 * console.log(details); // { uri: 'entry:cord:abc123...', tx_hash: '0x...', ... }
 * ```
 */
export async function getDetailsfromChain(
  registryEntryId: string
): Promise<IRegistryEntryChainStorage | null> {
  const api = ConfigService.get('api');

  const registryEntry = await api.query.entry.registryEntries(registryEntryId);

  const decodedDetails = decodeRegistryEntryDetailsFromChain(registryEntry, registryEntryId);

  if (!decodedDetails) {
    throw new SDKErrors.CordFetchError(
      `There is no registry entry with the provided ID "${registryEntryId}" present on the chain.`
    );
  }

  return decodedDetails;
}


/**
 * Fetches the registry entry details from the blockchain using the specified entry URI.
 *
 * Converts the entry URI into its corresponding identifier, retrieves the details from the blockchain,
 * and returns them in a structured format.
 *
 * @param registryEntryId - The id of the entry to fetch
 * @returns A promise resolving to the decoded entry details as `IRegistryEntryChainStorage`.
 * @throws {SDKErrors.CordFetchError} If no entry exists for the provided URI.
 *
 */
export async function fetchRegistryEntryDetailsFromChain(
  registryEntryId: EntryId
): Promise<IRegistryEntryChainStorage> {
  const entryDetails = await getDetailsfromChain(registryEntryId);

  if (!entryDetails) {
    throw new SDKErrors.CordFetchError(
      `There is no registry entry with the provided ID "${registryEntryId}" present on the chain.`
    );
  }

  return entryDetails;
}


/**
 * Prepares a transaction to update the ownership of a registry entry on the CORD blockchain.
 *
 * Constructs an extrinsic using the provided registry and entry URIs, along with the new owner account.
 *
 * @param registryId - The id of the registry containing the entry
 * @param registryEntryId - The id of the entry to update 
 * @param newOwnerAccount - The SS58 address of the new owner (e.g., `5FHne...`).
 * @returns A promise resolving to the prepared extrinsic for submission.
 * @throws {SDKErrors.CordDispatchError} If an error occurs while preparing the extrinsic.
 *
 * @example
 * ```typescript
 * const extrinsic = await prepareUpdateOwnershipExtrinsic(
 *   '2Lwd3xygo...',
 *   '123gwd...',
 *   '3FHneW46xGXzs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
 * );
 * console.log(extrinsic); // Prepared extrinsic for submission
 * ```
 */
export async function prepareUpdateOwnershipExtrinsic(
  registryId: RegistryId,
  registryEntryId: EntryId,
  newOwnerAccount: CordAddress,
): Promise<SubmittableExtrinsic> {
  try {
    const api = ConfigService.get('api');

    const registryEntryExists = await isRegistryEntryStored(registryEntryId);
    if (!registryEntryExists) {
      throw new SDKErrors.CordDispatchError(
        `Registry Entry does not exists at URI: "${registryEntryId}".`
      );
    }

    const extrinsic = api.tx.entry.updateOwnership(
        registryId,
        registryEntryId,
        newOwnerAccount,
    );

    return extrinsic;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
      `Error preparing extrinsic: "${errorMessage}".`
    );
  }
}


/**
 * Dispatches a transaction to update the ownership of a registry entry on the CORD blockchain.
 *
 * Transfers ownership to a new account, ensuring the entry exists before proceeding.
 *
 * @param registryId - The id of the registry containing the entry
 * @param registryEntryId - The id of the entry to update
 * @param newOwnerAccount - The SS58 address of the new owner (e.g., `5FHne...`).
 * @param authorAccount - The keyring pair of the account authorizing the transaction.
 * @returns A promise that resolves when the transaction is submitted successfully.
 * @throws {SDKErrors.CordDispatchError} If the entry doesn’t exist or the transaction fails.
 *
 * @example
 * ```typescript
 * await dispatchUpdateOwnershipToChain(
 *   'registry:cord:3xygo...',
 *   'entry:cord:abc123...',
 *   '5FHneW46xGXzs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
 *   authorAccount
 * );
 * console.log('✅ Ownership updated');
 * ```
 */
export async function dispatchUpdateOwnershipToChain(
  registryId: RegistryId,
  registryEntryId: EntryId,
  newOwnerAccount:  CordAddress,
  authorAccount: CordKeyringPair,
): Promise<void> {
  try {
    const extrinsic = await prepareUpdateOwnershipExtrinsic(
      registryId,
      registryEntryId,
      newOwnerAccount
    );

    await Chain.signAndSubmitTx(extrinsic, authorAccount);
} catch (error) {
    const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
        `Error dispatching to chain: "${JSON.stringify(errorMessage)}".`
    );
  }
}
