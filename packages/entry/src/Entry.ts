/**
 * @packageDocumentation
 * @module Entry
 * @preferred
 *
 * The `Entries` module is part of the CORD SDK, providing essential functionality for creating and managing
 * registry entries within the CORD blockchain. Entries represent records or claims registered within a
 * registry, critical for organizing decentralized data in a structured, secure, and transparent way.
 *
 * This module supports creating, updating, revoking, reinstating, and verifying registry entries, ensuring
 * a flexible and trustless record-keeping system. It integrates with chain operations to store and validate
 * entries, making it suitable for applications like credential management, asset tracking, and identity systems.
 *
 * ## Interface
 *
 * - `verifyRegistryEntry`: Validates the structure and format of a registry entry.
 * - `createEntriesProperties`: Prepares properties for creating a new registry entry.
 * - `updateEntriesProperties`: Constructs properties for updating an existing entry.
 * - `verifyAgainstInputProperties`: Verifies entry properties against on-chain data.
 *
 * @example
 * ```typescript
 * // Example: Creating properties for a new entry
 * const entryProperties = await createEntriesProperties(
 *   'registry:cord:3xygo...',
 *   null,
 *   '{"key":"value"}'
 * );
 * console.log('✅ Entry Properties:', entryProperties);
 * ```
 */
import { 
  encodeStringifiedBlobToCbor,
  getDigestFromRawData,
  isBlobSerialized
} from "@cord.network/registry";

import { 
  EntryId,
  RegistryId,
  HexString,
  IRegistryEntry,
  IRegistryEntryUpdate,
} from "@cord.network/types";

import { SDKErrors } from '@cord.network/utils';

import { DataUtils } from '@cord.network/utils'

import { 
  fetchRegistryEntryDetailsFromChain 
} from "./Entry.chain.js";

/**
 * Verifies the integrity of the given IRegistryEntry object.
 *
 * Ensures that the input conforms to the expected data structure by checking required fields,
 * such as the transaction hash (`tx_hash`) and the format of the optional blob.
 *
 * @param input - The IRegistryEntry object to verify.
 * @throws {SDKErrors.RegistryEntryError} If the `tx_hash` is missing or invalid, or if `blob` is not a string or null.
 *
 * @example
 * ```typescript
 * const entry = {
 *   tx_hash: '0x1234abcd...',
 *   blob: '{"key":"value"}',
 *   registryUri: '2Lwdxygo...',
 * };
 * verifyRegistryEntry(entry);
 * console.log('✅ Entry verified');
 * ```
 */
export function verifyRegistryEntry(input: IRegistryEntry): void {
  if (!input.tx_hash) {
    throw new SDKErrors.InvalidInputError('Digest is required.');
  }

  DataUtils.verifyIsHex(input.tx_hash, 256);

  if (input.blob !== null && typeof input.blob !== 'string') {
    throw new SDKErrors.InvalidInputError('Blob must be a string or null.');
  }
}


/**
 * Constructs the properties required to create a registry entry in the CORD blockchain.
 *
 * Prepares the data for a new registry entry, including the registry URI, transaction hash,
 * and optional blob. If no `tx_hash` is provided, it computes one from the blob. The blob,
 * if present, is serialized and encoded in CBOR format for chain dispatch.
 *
 * @param registryId - The id of the registry
 * @param tx_hash - The hash of the entry’s content, or null if computed from `blob`.
 * @param blob - The optional serialized data for the entry, or null.
 * @returns A promise resolving to an `IRegistryEntry` object with the entry properties.
 * @throws {SDKErrors.InputContentsMalformedError} If neither `tx_hash` nor `blob` is provided, or if `tx_hash` is invalid.
 * @throws {SDKErrors.CordDispatchError} If entry validation fails.
 *
 * @example
 * ```typescript
 * const entry = await createEntriesProperties(
 *   '2Lwed3xygo...',
 *   null,
 *   '{"key":"value"}'
 * );
 * console.log('✅ Entry Properties:', entry);
 * ```
 */
export async function createEntriesProperties(
  registryId: RegistryId,
  tx_hash: HexString | null = null,
  blob: string | null = null,
): Promise<IRegistryEntry> {
  
  if (!tx_hash && !blob) {
    throw new SDKErrors.InputContentsMalformedError(
      `Either 'digest' or 'blob' must be provided. Both cannot be null.`
    );
  }

  /* Construct digest from serialized blob if digest is absent */
  if (!tx_hash && blob) {
    const isASerializedBlob = await isBlobSerialized(blob);
    if (!isASerializedBlob) {
      blob = JSON.stringify(blob); 
    }
    
    tx_hash = await getDigestFromRawData(blob); 

    /* Encode the serialized 'blob' in CBOR before dispatch to chain */
    blob = await encodeStringifiedBlobToCbor(blob);
  } 

  /* Process the blob to be serialized and CBOR encoded if digest is present */
  else if (tx_hash && blob) {
    const isASerializedBlob = await isBlobSerialized(blob);
    if (!isASerializedBlob){
      blob = JSON.stringify(blob);
    }

    /* Encode the 'blob' in CBOR before dispatch to chain */
    blob = await encodeStringifiedBlobToCbor(blob);
  }

  if (!tx_hash) {
    throw new SDKErrors.InputContentsMalformedError(
      `Digest cannot be empty.`
    );
  }
  
  const registryEntryObj = {
    tx_hash,
    blob,
    registryId,
  };

  /* Process the entry object before dispatch */
  try {
    verifyRegistryEntry(registryEntryObj);
  } catch (error) {
    const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
        `Validating Registry Entry Failed!"${errorMessage}".`
    );
  }

  return registryEntryObj
}


/**
 * Constructs the properties required to update a registry entry in the CORD blockchain.
 *
 * Prepares data for updating an existing entry, including the registry URI, entry URI,
 * transaction hash, and optional blob. If no `tx_hash` is provided, it computes one from
 * the blob. The blob, if present, is serialized and encoded in CBOR format.
 *
 * @param registryId - The identifier of the registry
 * @param registryEntryId - The identifier of the entry to update 
 * @param tx_hash - The new hash of the entry’s content, or null if computed from `blob`.
 * @param blob - The optional updated serialized data, or null.
 * @returns A promise resolving to an `IRegistryEntryUpdate` object with the updated properties.
 * @throws {SDKErrors.InputContentsMalformedError} If neither `tx_hash` nor `blob` is provided, or if `tx_hash` is invalid.
 * @throws {SDKErrors.CordDispatchError} If entry validation fails.
 *
 * @example
 * ```typescript
 * const updatedEntry = await updateEntriesProperties(
 *   '2hwdw3xygo...',
 *   '2Lqewdabc123...',
 *   null,
 *   '{"key":"updated"}'
 * );
 * console.log('✅ Updated Properties:', updatedEntry);
 * ```
 */
export async function updateEntriesProperties(
  registryId: RegistryId,
  registryEntryId: EntryId,
  tx_hash: HexString | null = null,
  blob: string | null = null,
): Promise<IRegistryEntryUpdate> {
  
  if (!tx_hash && !blob) {
    throw new SDKErrors.InputContentsMalformedError(
      `Either 'digest' or 'blob' must be provided. Both cannot be null.`
    );
  }

  /* Construct digest from serialized blob if digest is absent */
  if (!tx_hash && blob) {
    const isASerializedBlob = await isBlobSerialized(blob);
    if (!isASerializedBlob) {
      blob = JSON.stringify(blob); 
    }
    
    tx_hash = await getDigestFromRawData(blob); 

    /* Encode the serialized 'blob' in CBOR before dispatch to chain */
    blob = await encodeStringifiedBlobToCbor(blob);
  } 

  /* Process the blob to be serialized and CBOR encoded if digest is present */
  else if (tx_hash && blob) {
    const isASerializedBlob = await isBlobSerialized(blob);
    if (!isASerializedBlob){
      blob = JSON.stringify(blob);
    }

    /* Encode the 'blob' in CBOR before dispatch to chain */
    blob = await encodeStringifiedBlobToCbor(blob);
  }

  if (!tx_hash) {
    throw new SDKErrors.InputContentsMalformedError(
      `Digest cannot be empty.`
    );
  }
  
  const registryEntryObj = {
    tx_hash,
    blob,
    registryId,
    registryEntryId,
  };

  /* Process the entry object before dispatch */
  try {
    verifyRegistryEntry(registryEntryObj);
  } catch (error) {
    const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
        `Validating Registry Entry Failed!"${errorMessage}".`
    );
  }

  return registryEntryObj
}


/**
 * Verifies the input properties of a registry entry URI against its on-chain details.
 *
 * Ensures that the provided transaction hash, and optional creator URI and registry URI,
 * match the data stored on the blockchain. Also checks if the entry is revoked or if URIs mismatch.
 *
 * @param registryEntryId - The id of the entry to verify.
 * @param tx_hash - The expected transaction hash associated with the entry.
 * @param creatorAddress - Optional address of the entry’s creator profile id.
 * @param registryId - Optional id of the registry.
 * @returns A promise resolving to an object with `isValid` (boolean) and `message` (string) describing the verification result.
 * @throws {Error} If an unexpected error occurs during verification.
 *
 * @example
 * ```typescript
 * const result = await verifyAgainstInputProperties(
 *   '2Lwedabc123...',
 *   '0x1234abcd...',
 *   '2wed3xygo...',
 *   '3HJB3xygo...'
 * );
 * console.log('✅', result.isValid, result.message);
 * ```
 */
export async function verifyAgainstInputProperties(
  registryEntryId: EntryId,
  tx_hash: HexString,
  creator?: string,
  registryId?: RegistryId,
): Promise<{ isValid: boolean; message: string }> {
  try {
    const registryEntryStatus = await fetchRegistryEntryDetailsFromChain(registryEntryId);

    if (!registryEntryStatus) {
      return {
        isValid: false,
        message: `Registry Entry details for "${tx_hash}" not found.`,
      }
    }
    
    if (tx_hash !== registryEntryStatus.tx_hash) {
      return {
        isValid: false,
        message: 'Digest does not match with Registry Entry Digest.',
      }
    }

    if (registryEntryStatus?.revoked) {
      return {
        isValid: false,
        message: `Registry Entry "${registryEntryId}" Revoked.`,
      }
    }

    if (registryEntryId !== registryEntryStatus.registryEntryId) {
      return {
        isValid: false,
        message: 'Registry Entry and Chain Entry URI details does not match.',
      }
    }

    if (creator) {
      if (creator !== registryEntryStatus.creator) {
        return {
          isValid: false,
          message: 'Registry Entry and Digest creator does not match.',
        }
      }
    }

    if (registryId) {
      if (registryId !== registryEntryStatus.registryId) {
        return {
          isValid: false,
          message: 'Registry URI and Chain Registry URI does not match.',
        }
      }
    }

    return {
      isValid: true,
      message:
        'Digest properties provided are valid and matches the registry entry details.',
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        isValid: false,
        message: `Error verifying properties: ${error}`,
      }
    }
    return {
      isValid: false,
      message: 'An unknown error occurred while verifying the properties.',
    }
  }
}
