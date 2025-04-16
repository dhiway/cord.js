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
  EntryUri,
  RegistryUri,
  DidUri,
  HexString,
  IRegistryEntry,
  IRegistryEntryUpdate,
} from "@cord.network/types";

import { SDKErrors } from '@cord.network/utils';

import { DataUtils } from '@cord.network/utils'

import { 
  fetchRegistryEntryDetailsFromChain 
} from "./Entry.chain";

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
 *   registryUri: 'registry:cord:3xygo...',
 * };
 * verifyRegistryEntry(entry);
 * console.log('✅ Entry verified');
 * ```
 */
export function verifyRegistryEntry(input: IRegistryEntry): void {
  if (!input.tx_hash) {
    throw new SDKErrors.InvalidInputError('Digest is required.');
  }

  // TODO:
	// The old way of calculating the identifier will not work.
	// So disable for now.
	//   checkIdentifier(input.registryUri);
	//   checkIdentifier(input.authorizationUri);
	//   checkIdentifier(input.creatorUri);

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
 * @param registryUri - The URI of the registry (e.g., `registry:cord:3xygo...`).
 * @param tx_hash - The hash of the entry’s content, or null if computed from `blob`.
 * @param blob - The optional serialized data for the entry, or null.
 * @returns A promise resolving to an `IRegistryEntry` object with the entry properties.
 * @throws {SDKErrors.InputContentsMalformedError} If neither `tx_hash` nor `blob` is provided, or if `tx_hash` is invalid.
 * @throws {SDKErrors.CordDispatchError} If entry validation fails.
 *
 * @example
 * ```typescript
 * const entry = await createEntriesProperties(
 *   'registry:cord:3xygo...',
 *   null,
 *   '{"key":"value"}'
 * );
 * console.log('✅ Entry Properties:', entry);
 * ```
 */
export async function createEntriesProperties(
  registryUri: RegistryUri,
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
    registryUri,
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
 * @param registryUri - The URI of the registry (e.g., `registry:cord:3xygo...`).
 * @param registryEntryUri - The URI of the entry to update (e.g., `entry:cord:abc123...`).
 * @param tx_hash - The new hash of the entry’s content, or null if computed from `blob`.
 * @param blob - The optional updated serialized data, or null.
 * @returns A promise resolving to an `IRegistryEntryUpdate` object with the updated properties.
 * @throws {SDKErrors.InputContentsMalformedError} If neither `tx_hash` nor `blob` is provided, or if `tx_hash` is invalid.
 * @throws {SDKErrors.CordDispatchError} If entry validation fails.
 *
 * @example
 * ```typescript
 * const updatedEntry = await updateEntriesProperties(
 *   'registry:cord:3xygo...',
 *   'entry:cord:abc123...',
 *   null,
 *   '{"key":"updated"}'
 * );
 * console.log('✅ Updated Properties:', updatedEntry);
 * ```
 */
export async function updateEntriesProperties(
  registryUri: RegistryUri,
  registryEntryUri: EntryUri,
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

  // TODO: Update below once the identifier calculation support is reached
  /* 
   * Update the entryUri to have newer digest as suffix 
   * Below `entryUri` is of type `entry:cord:IdDigest:entryDigest`
   */
  // const entryUri = updateRegistryEntryUri(
  //   registryEntryUri, digest
  // );
  
  const registryEntryObj = {
    tx_hash,
    blob,
    registryUri,
    registryEntryUri,
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
 * @param registryEntryUri - The URI of the entry to verify (e.g., `entry:cord:abc123...`).
 * @param tx_hash - The expected transaction hash associated with the entry.
 * @param creatorUri - Optional DID URI of the entry’s creator.
 * @param registryUri - Optional URI of the registry.
 * @returns A promise resolving to an object with `isValid` (boolean) and `message` (string) describing the verification result.
 * @throws {Error} If an unexpected error occurs during verification.
 *
 * @example
 * ```typescript
 * const result = await verifyAgainstInputProperties(
 *   'entry:cord:abc123...',
 *   '0x1234abcd...',
 *   'did:cord:3xygo...',
 *   'registry:cord:3xygo...'
 * );
 * console.log('✅', result.isValid, result.message);
 * ```
 */
export async function verifyAgainstInputProperties(
  registryEntryUri: EntryUri,
  tx_hash: HexString,
  creatorUri?: DidUri,
  registryUri?: RegistryUri,
): Promise<{ isValid: boolean; message: string }> {
  try {
    const registryEntryStatus = await fetchRegistryEntryDetailsFromChain(registryEntryUri);
    
    // TODO: Once the identifier calculation support is reached, can do like below
    // const registryEntryObj = uriToEntryIdAndDigest(registryEntryUri);
    // const entryUri = identifierToUri(registryEntryObj.identifier);

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
        message: `Registry Entry "${registryEntryUri}" Revoked.`,
      }
    }

    if (registryEntryUri !== registryEntryStatus.uri) {
      return {
        isValid: false,
        message: 'Registry Entry and Chain Entry URI details does not match.',
      }
    }

    if (creatorUri) {
      if (creatorUri !== registryEntryStatus.creatorUri) {
        return {
          isValid: false,
          message: 'Registry Entry and Digest creator does not match.',
        }
      }
    }

    if (registryUri) {
      if (registryUri !== registryEntryStatus.registryUri) {
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
