/**
 * @packageDocumentation
 * @module Registry/chain
 *
 * The Registry module provides a framework for creating and managing
 * a registry within the CORD blockchain, offering fine-grained
 * control through a permission system. It allows for the creation,
 * updating, archiving, restoring, and delegate management within the registry.
 *
 * ## Overview
 *
 * The Registry module enables the creation of a distinct registry on the
 * CORD blockchain, with its own governance rules. The registry can
 * be used to manage ecosystems or communities within the larger
 * blockchain network. It is identified by a unique `Ss58Identifier`
 * (e.g., `registry:cord:3xygo...`) and can be governed by appointed delegates.
 * The registry is managed within a namespace with its own delegates.
 *
 * ## Interface
 *
 * The module provides functions for managing the registry:
 *
 * - `dispatchCreateToChain`: Initializes a new registry with a unique identifier.
 * - `dispatchUpdateRegistryHashToChain`: Updates the registry with a new transaction hash and optional blob.
 * - `dispatchUpdateCreator`: Updates the creator address of the registry.
 * - `dispatchArchiveRegistryToChain`: Moves the registry to an archived state.
 * - `dispatchRestoreRegistryToChain`: Restores a previously archived registry to active status.
 * - `dispatchAddDelegateToChain`: Adds a delegate to the registry with specific permissions.
 * - `dispatchRemoveDelegateToChain`: Removes a delegate, revoking their permissions.
 *
 * ## Permissions
 *
 * The module implements a granular permission system using `RegistryPermissionVariant` (`Entry`, `Delegate`, `Admin`).
 * Delegates can be assigned roles to manage entries, add other delegates, or administer the registry.
 * Permissions are specified when adding delegates via `dispatchAddDelegateToChain`.
 *
 * ## Data Privacy
 *
 * The Registry module prioritizes data privacy, avoiding the storage of personal
 * or sensitive data directly on-chain. Instead, it manages references to off-chain
 * data (e.g., via `tx_hash`), ensuring compliance with privacy regulations.
 * Users and developers are responsible for managing off-chain data according to applicable laws.
 *
 */

import {
  CordKeyringPair,
  IRegistryTxHashUpdate,
  RegistryPermissionVariant,
  IRegistryCreate,
  RegistryId,
  SubmittableExtrinsic,
} from '@cord.network/types';

import { Chain } from '@cord.network/network';
import { SDKErrors } from '@cord.network/utils';

import { ConfigService } from '@cord.network/config';

/**
 * Prepares an extrinsic to create a new registry on the CORD blockchain.
 *
 * @param registryDetails - The details of the registry to create, including transaction hash, blob, and optional IDs.
 * @returns A promise that resolves to the prepared extrinsic.
 * @throws {SDKErrors.CordDispatchError} If the preparation fails.
 *
 * @example
 * ```typescript
 * const registryDetails = {
 *   tx_hash: '0x1234567890abcdef',
 *   blob: '{"key":"value"}',
 * };
 * const extrinsic = await prepareCreateExtrinsic(registryDetails);
 * ```
 */
export async function prepareCreateExtrinsic(
  registryDetails: IRegistryCreate,
): Promise<SubmittableExtrinsic> {
  try {
    const api = ConfigService.get('api');

    const extrinsic = api.tx.registry.create(
      registryDetails.tx_hash,
      registryDetails.blob,
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
 * Dispatches a transaction to create a new registry on the CORD blockchain.
 *
 * @param registryDetails - The details of the registry to create, including transaction hash and optional blob.
 * @param authorAccount - The keyring pair of the author creating the registry.
 * @returns A promise which resolves on create.
 * @throws {SDKErrors.CordDispatchError} If the transaction fails.
 *
 * @example
 * ```typescript
 * const registryDetails = {
 *   tx_hash: '0x1234567890abcdef',
 *   blob: '{"key":"value"}',
 * };
 * await dispatchCreateToChain(registryDetails, alice);
 * ```
 */
export async function dispatchCreateToChain(
  registryDetails: IRegistryCreate,
  authorAccount: CordKeyringPair
): Promise<void> {
  try {
    const extrinsic = await prepareCreateExtrinsic(registryDetails);
    
    await Chain.signAndSubmitTx(extrinsic, authorAccount);
    return;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${errorMessage}".`
    );
  }
}


/**
 * Prepares an extrinsic to update the transaction hash and optional blob of a registry.
 *
 * @param registryDetails - The details for updating the registry, including URI, transaction hash, and optional blob.
 * @returns A promise that resolves to the prepared extrinsic.
 * @throws {SDKErrors.CordDispatchError} If the preparation fails.
 *
 * @example
 * ```typescript
 * const registryDetails = {
 *   registryId '2L3xygo...',
 *   tx_hash: '0x456789abcdef',
 *   blob: '{"key":"newValue"}',
 * };
 * const extrinsic = await prepareUpdateExtrinsic(registryDetails);
 * ```
 */
export async function prepareUpdateExtrinsic(
  registryDetails: IRegistryTxHashUpdate,
): Promise<SubmittableExtrinsic> {
  try {
    const api = ConfigService.get('api');

    const extrinsic = api.tx.registry.updateRegistryHash(
      registryDetails.registryId,
      registryDetails.tx_hash,
      registryDetails.blob
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
 * Dispatches a transaction to update a registry's transaction hash and optional blob.
 *
 * @param registryDetails - The details for updating the registry, including URI, transaction hash, and optional blob.
 * @param authorAccount - The keyring pair of the author updating the registry.
 * @returns A promise that resolves when the transaction is submitted.
 * @throws {SDKErrors.CordDispatchError} If the transaction fails.
 *
 * @example
 * ```typescript
 * const registryDetails = {
 *   registryId: '2Ldhxygo...',
 *   tx_hash: '0x456789abcdef',
 *   blob: '{"key":"newValue"}',
 * };
 * await dispatchUpdateRegistryHashToChain(registryDetails, alice);
 * ```
 */
export async function dispatchUpdateRegistryHashToChain(
  registryDetails: IRegistryTxHashUpdate,
  authorAccount: CordKeyringPair
): Promise<void> {
  try {
    const extrinsic = await prepareUpdateExtrinsic(registryDetails);

    await Chain.signAndSubmitTx(extrinsic, authorAccount);
    return;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${errorMessage}".`
    );
  }
}

/**
 * Prepares an extrinsic to update the creator address of a registry.
 *
 * @param registryId - The identifier of the registry to update (e.g., '2Ldxygo...').
 * @param newCreatorAddress - The new creator's SS58 address.
 * @returns A promise that resolves to the prepared extrinsic.
 * @throws {SDKErrors.CordDispatchError} If the preparation fails.
 *
 * @example
 * ```typescript
 * const extrinsic = await prepareUpdateCreatorExtrinsic('registry:cord:3xygo...', '5FHne...');
 * ```
 */
export async function prepareUpdateCreatorExtrinsic(
  registryId: RegistryId,
  newCreatorAddress: string,
): Promise<SubmittableExtrinsic> {
  try {
    const api = ConfigService.get('api');

    const extrinsic = api.tx.registry.updateCreator(registryId, newCreatorAddress);

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
 * Dispatches a transaction to update the creator address of a registry.
 *
 * @param registryId - The identifier of the registry to update (e.g., '2Lxygo...').
 * @param newCreatorAddress - The new creator's SS58 address.
 * @param authorAccount - The keyring pair of the current author.
 * @returns A promise that resolves when the transaction is submitted.
 * @throws {SDKErrors.CordDispatchError} If the transaction fails.
 *
 * @example
 * ```typescript
 * await dispatchUpdateCreator('registry:cord:3xygo...', '5FHne...', alice);
 * ```
 */
export async function dispatchUpdateCreator(
  registryId: RegistryId,
  newCreatorAddress: string,
  authorAccount: CordKeyringPair
): Promise<string> {
  try {
    const extrinsic = await prepareUpdateCreatorExtrinsic(
      registryId,
      newCreatorAddress
    );

    await Chain.signAndSubmitTx(extrinsic, authorAccount);

    return registryId;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${errorMessage}".`
    );
  }
}


/**
 * Prepares an extrinsic to add a delegate to a registry with specified permissions.
 *
 * @param registryId - The identifier of the registry (e.g., '2Ldew3xygo...').
 * @param delegateAddress - The SS58 address of the delegate.
 * @param roles - A single RegistryPermissionVariant or array of variants ('Entry', 'Delegate', 'Admin').
 * @returns A promise that resolves to the prepared extrinsic.
 * @throws {SDKErrors.CordDispatchError} If the preparation fails.
 *
 * @example
 * ```typescript
 * const extrinsic = await prepareAddDelegateExtrinsic(
 *   'registry:cord:3xygo...',
 *   '5FHne...',
 *   [RegistryPermissionVariant.Entry, RegistryPermissionVariant.Delegate]
 * );
 * ```
 */
export async function prepareAddDelegateExtrinsic(
  registryId: RegistryId,
  delegateAddress: string,
  roles: RegistryPermissionVariant | RegistryPermissionVariant[],
): Promise<SubmittableExtrinsic> {  
  try {
    const api = ConfigService.get('api');

    const permissions = Array.isArray(roles) ? roles : [roles];
    const extrinsic = api.tx.registry.addDelegate(registryId, delegateAddress, permissions);

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
 * Dispatches a transaction to add a delegate to a registry with specified permissions.
 *
 * @param registryId - The identifier of the registry (e.g., '3xygo...').
 * @param delegateAddress - The SS58 address of the delegate.
 * @param roles - A single RegistryPermissionVariant or array of variants ('Entry', 'Delegate', 'Admin').
 * @param authorAccount - The keyring pair of the author.
 * @returns A promise that resolves when the transaction is submitted.
 * @throws {SDKErrors.CordDispatchError} If the transaction fails.
 *
 * @example
 * ```typescript
 * await dispatchAddDelegateToChain(
 *   '2Lwwd3xygo...',
 *   '5FHne...',
 *   [RegistryPermissionVariant.Entry, RegistryPermissionVariant.Delegate],
 *   alice
 * );
 * ```
 */
export async function dispatchAddDelegateToChain(
  registryId: RegistryId,
  delegateAddress: string,
  roles: RegistryPermissionVariant | RegistryPermissionVariant[],
  authorAccount: CordKeyringPair
): Promise<string> {
  try {
    const extrinsic = await prepareAddDelegateExtrinsic(
      registryId,
      delegateAddress,
      roles
    );

    await Chain.signAndSubmitTx(extrinsic, authorAccount);

    return registryId;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${errorMessage}".`
    );
  }
}


/**
 * Prepares an extrinsic to remove a delegate from a registry.
 *
 * @param registryId - The identifier of the registry (e.g., '2Ld3xygo...').
 * @param delegateAddress - The SS58 address of the delegate to remove.
 * @returns A promise that resolves to the prepared extrinsic.
 * @throws {SDKErrors.CordDispatchError} If the preparation fails.
 *
 * @example
 * ```typescript
 * const extrinsic = await prepareRemoveDelegateExtrinsic('registry:cord:3xygo...', '5FHne...');
 * ```
 */
export async function prepareRemoveDelegateExtrinsic(
  registryId: RegistryId,
  delegateAddress: string,
): Promise<SubmittableExtrinsic> {  
  try {
    const api = ConfigService.get('api');

    const extrinsic = api.tx.registry.removeDelegate(registryId, delegateAddress);

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
 * Dispatches a transaction to remove a delegate from a registry.
 *
 * @param registryId - The identifier of the registry (e.g., '2Lwd3xygo...').
 * @param delegateAddress - The SS58 address of the delegate to remove.
 * @param authorAccount - The keyring pair of the author.
 * @returns A promise that resolves when the transaction is submitted.
 * @throws {SDKErrors.CordDispatchError} If the transaction fails.
 *
 * @example
 * ```typescript
 * await dispatchRemoveDelegateToChain('registry:cord:3xygo...', '5FHne...', alice);
 * ```
 */
export async function dispatchRemoveDelegateToChain(
  registryId: RegistryId,
  delegateAddress: string,
  authorAccount: CordKeyringPair
): Promise<string> {
  try {
    const extrinsic = await prepareRemoveDelegateExtrinsic(
      registryId,
      delegateAddress
    );

    await Chain.signAndSubmitTx(extrinsic, authorAccount);

    return registryId;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${errorMessage}".`
    );
  }
}


/**
 * Prepares an extrinsic to archive a registry.
 *
 * @param registryId - The identifier of the registry to archive (e.g., '2Lwf3xygo...').
 * @returns A promise that resolves to the prepared extrinsic.
 * @throws {SDKErrors.CordDispatchError} If the preparation fails.
 *
 * @example
 * ```typescript
 * const extrinsic = await prepareArchiveRegistryExtrinsic('registry:cord:3xygo...');
 * ```
 */
export async function prepareArchiveRegistryExtrinsic(
  registryId: RegistryId,
): Promise<SubmittableExtrinsic> {
  try {
    const api = ConfigService.get('api');

    const extrinsic = api.tx.registry.archive(registryId);

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
 * Dispatches a transaction to archive a registry.
 *
 * @param registryId - The identifier of the registry to archive (e.g., '2Ledf3xygo...').
 * @param authorAccount - The keyring pair of the author.
 * @returns A promise that resolves when the transaction is submitted.
 * @throws {SDKErrors.CordDispatchError} If the transaction fails.
 *
 * @example
 * ```typescript
 * await dispatchArchiveRegistryToChain('registry:cord:3xygo...', alice);
 * ```
 */
export async function dispatchArchiveRegistryToChain(
  registryId: RegistryId,
  authorAccount: CordKeyringPair
): Promise<string> {
  try {
    const extrinsic = await prepareArchiveRegistryExtrinsic(registryId);

    await Chain.signAndSubmitTx(extrinsic, authorAccount);

    return registryId;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${errorMessage}".`
    );
  }
}


export async function prepareRestoreRegistryExtrinsic(
  registryId: RegistryId,
): Promise<SubmittableExtrinsic> {
  try {
    const api = ConfigService.get('api');

    const extrinsic = api.tx.registry.restore(registryId);

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
 * Dispatches a transaction to restore an archived registry.
 *
 * @param registryId - The identifier of the registry to restore (e.g., '2ldewxygo...').
 * @param authorAccount - The keyring pair of the author.
 * @returns A promise that resolves when the transaction is submitted.
 * @throws {SDKErrors.CordDispatchError} If the transaction fails.
 *
 * @example
 * ```typescript
 * await dispatchRestoreRegistryToChain('registry:cord:3xygo...', alice);
 * ```
 */
export async function dispatchRestoreRegistryToChain(
  registryId: RegistryId,
  authorAccount: CordKeyringPair
): Promise<string> {
  try {
    const extrinsic = await prepareRestoreRegistryExtrinsic(registryId);

    await Chain.signAndSubmitTx(extrinsic, authorAccount);

    return registryId;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${errorMessage}".`
    );
  }
}
