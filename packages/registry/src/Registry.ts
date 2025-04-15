/**
 * @packageDocumentation
 * @module Registry
 * @preferred
 *
 * The `Registry` module is a crucial component of the CORD SDK, providing a robust set of functionalities for
 * creating, updating, and managing a registry on the CORD blockchain. A registry serves as a structured container
 * for various claims or records, facilitating the organization and retrieval of information securely and efficiently.
 *
 * Key functionalities include:
 * - `registryCreateProperties`: Constructs properties for a new registry, including the transaction hash, document ID,
 *   document author ID, document node ID, and optionally a serialized and CBOR-encoded blob. This function is essential
 *   for initiating a new registry with specified attributes.
 * - `registryUpdateHashProperties`: Generates properties to update an existing registry, enabling modifications to
 *   the registry's content while maintaining its integrity. It allows for updating the registry with new transaction
 *   hashes and blobs as needed.
 *
 * These functionalities are integral to the efficient management of a registry on the CORD blockchain,
 * ensuring that it is created, updated, and (in future) authorized properly while upholding data integrity and security.
 *
 * @example
 * ```typescript
 * // Example: Creating properties for a new registry
 * const registryProperties = await registryCreateProperties(
 *   '0x123...',       // tx_hash
 *   '{"key":"value"}', // blob
 *   'doc123',         // docId
 *   'author456',      // docAuthorId
 *   'node789'         // docNodeId
 * );
 * console.log('Registry Properties:', registryProperties);
 *
 * // Example: Updating properties of an existing registry
 * const updateProperties = await registryUpdateHashProperties(
 *   'registry:cord:3xygo...', // registryUri
 *   '0x456...',              // tx_hash
 *   '{"key":"newValue"}'     // blob
 * );
 * console.log('Updated Registry Properties:', updateProperties);
 *
 * // Example: Creating authorization properties (not implemented)
 * // const authorizationProperties = await registryAuthorizationProperties(
 * //   'registry:cord:3xygo...', // registryUri
 * //   '5FHne...',              // delegateAddress
 * //   'Delegate',              // permission
 * //   '5Grwv...'               // delegatorAddress
 * // );
 * // console.log('Authorization Properties:', authorizationProperties);
 * ```
 */

import type {
  HexString,
  IRegistryCreate,
  IRegistryTxHashUpdate,
  RegistryUri,
} from '@cord.network/types';

import { SDKErrors, Cbor } from '@cord.network/utils';

import { blake2AsHex } from '@cord.network/types';

/**
 * Computes a Blake2 H256 hash digest from the provided raw data (blob).
 *
 * This function verifies if the input blob is serialized before hashing it.
 *
 * @param blob - The raw data input for which the digest needs to be calculated.
 *               This should be a serialized string.
 * @returns A promise that resolves to the computed digest of the blob,
 *          represented as a hexadecimal string.
 * @throws {SDKErrors.InputContentsMalformedError} If the blob is not serialized.
 *
 * @example
 * ```typescript
 * const rawData = '{"key": "value"}';
 * try {
 *   const digest = await getDigestFromRawData(rawData);
 *   console.log(`Computed Digest: ${digest}`);
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
export async function getDigestFromRawData(blob: string) {
  const isASerializedBlob = await isBlobSerialized(blob);
  if (!isASerializedBlob) {
    throw new SDKErrors.InputContentsMalformedError(
      `Input 'blob' is not serialized.`
    );
  }

  const registryDigest = blake2AsHex(blob);

  return registryDigest;
}

/**
 * Checks if the provided blob is serialized.
 *
 * This function attempts to parse the input `blob` as JSON. If parsing is successful,
 * it indicates that the blob is serialized. If the input is not a string or cannot be
 * parsed as JSON, it returns false.
 *
 * @param blob - The input data to check for serialization. This can be of any type.
 * @returns A promise that resolves to a boolean value:
 *          - `true` if the blob is a valid JSON string and is serialized.
 *          - `false` if the blob is not a string or if it cannot be parsed as JSON.
 */
export async function isBlobSerialized(blob: any): Promise<boolean> {
  try {
    if (typeof blob === 'string') {
      JSON.parse(blob);
      return true;
    }
  } catch (e) {
    return false;
  }

  return false;
}

/**
 * Encodes a stringified blob into CBOR format.
 *
 * This function takes a string representing a serialized blob, validates its
 * serialization, and then encodes it into the CBOR format. The resulting CBOR
 * blob is returned as a base64-encoded string.
 *
 * @param blob - A string representing the serialized blob that needs to be encoded.
 * @returns A promise that resolves to a base64-encoded string of the CBOR representation of the input blob.
 * @throws {SDKErrors.InputContentsMalformedError} If the input blob is not a valid serialized string.
 *
 * @example
 * ```typescript
 * const cborBlob = await encodeStringifiedBlobToCbor('{"key": "value"}');
 * console.log(cborBlob);
 * ```
 */
export async function encodeStringifiedBlobToCbor(blob: string): Promise<string> {
  const isASerializedBlob = await isBlobSerialized(blob);
  if (!isASerializedBlob) {
    throw new SDKErrors.InputContentsMalformedError(
      `Input 'blob' is not serialized.`
    );
  }

  const encoder = new Cbor.Encoder({ pack: true, useRecords: true });
  const encodedBlob = encoder.encode(blob);
  const cborBlob = encodedBlob.toString('base64');

  return cborBlob;
}

/**
 * Decodes a CBOR-encoded blob from a base64 string back to a stringified blob.
 *
 * This function takes a base64-encoded string representing a CBOR blob,
 * decodes it to a buffer, and then decodes the buffer to retrieve the
 * original stringified blob.
 *
 * @param cborBlob - A base64-encoded string representing the CBOR blob to decode.
 * @returns A promise that resolves to the original stringified blob.
 * @throws {Error} If decoding fails due to invalid CBOR format or other issues.
 *
 * @example
 * ```typescript
 * const stringifiedBlob = await decodeCborToStringifiedBlob('base64EncodedCborBlob');
 * console.log(stringifiedBlob);
 * ```
 */
export async function decodeCborToStringifiedBlob(cborBlob: string): Promise<string> {
  const decodedBuffer = Buffer.from(cborBlob, 'base64');
  const decodedBlob = Cbor.decode(decodedBuffer);

  return decodedBlob;
}

/**
 * Creates properties for a new registry, including the transaction hash, document ID,
 * document author ID, document node ID, and optionally a serialized and CBOR-encoded blob.
 *
 * This function requires either a transaction hash or a blob to generate the registry properties.
 * If a blob is provided without a transaction hash, the hash will be computed from the serialized
 * blob. The blob will be CBOR-encoded before dispatching to the blockchain.
 *
 * If only a transaction hash is provided, it will be dispatched as-is into the CORD Registry.
 *
 * If both `tx_hash` and `blob` are provided, the function will:
 * - Validate the `blob` for serialization.
 * - Encode the `blob` in CBOR before dispatching it.
 * - Use the existing `tx_hash` as-is for the registry creation process,
 *   without computing a new hash from the `blob`.
 *
 * @param tx_hash - A hex string representing the transaction hash.
 * @param blob - An optional string representing the data to be stored in the registry.
 * @param docId - An optional string representing the cyra document ID for the registry.
 * @param docAuthorId - An optional string representing the cyra document author ID.
 * @param docNodeId - An optional string representing the cyra document node ID.
 * @returns A promise that resolves to an object containing the properties of the registry,
 *          including the transaction hash, blob, document ID, author ID, and node ID.
 * @throws {SDKErrors.InputContentsMalformedError} If neither transaction hash nor blob is provided,
 *          or if the transaction hash is empty after processing.
 *
 * @example
 * ```typescript
 * const registryProperties = await registryCreateProperties(
 *   '0x123...',       // tx_hash
 *   '{"key":"value"}', // blob
 *   'doc123',         // docId
 *   'author456',      // docAuthorId
 *   'node789'         // docNodeId
 * );
 * console.log(registryProperties);
 * ```
 */
export async function registryCreateProperties(
  tx_hash: HexString,
  blob: string | null = null,
  docId: string | null = null,
  docAuthorId: string | null = null,
  docNodeId: string | null = null
): Promise<IRegistryCreate> {
  if (!tx_hash && !blob) {
    throw new SDKErrors.InputContentsMalformedError(
      `Either 'tx_hash' or 'blob' must be provided. Both cannot be null.`
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
  } else if (tx_hash && blob) {
    /* Process the blob to be serialized and CBOR encoded if digest is present */
    const isASerializedBlob = await isBlobSerialized(blob);
    if (!isASerializedBlob) {
      blob = JSON.stringify(blob);
    }

    /* Encode the 'blob' in CBOR before dispatch to chain */
    blob = await encodeStringifiedBlobToCbor(blob);
  }

  if (!tx_hash) {
    throw new SDKErrors.InputContentsMalformedError(`Digest cannot be empty.`);
  }

  return {
    tx_hash,
    blob,
    docId,
    docAuthorId,
    docNodeId,
  };
}

/**
 * Generates properties to update an existing registry with a new transaction hash and optional blob.
 *
 * This function requires either a transaction hash or a blob to generate the update properties.
 * If a blob is provided without a transaction hash, the hash will be computed from the serialized
 * blob. The blob will be CBOR-encoded before dispatching to the blockchain.
 *
 * If only a transaction hash is provided, it will be dispatched as-is into the CORD Registry.
 *
 * If both `tx_hash` and `blob` are provided, the function will:
 * - Validate the `blob` for serialization.
 * - Encode the `blob` in CBOR before dispatching it.
 * - Use the existing `tx_hash` as-is for the registry update process,
 *   without computing a new hash from the `blob`.
 *
 * @param registryUri - The URI of the registry to update (e.g., 'registry:cord:3xygo...').
 * @param tx_hash - A hex string representing the new transaction hash.
 * @param blob - An optional string representing the new data to be stored in the registry.
 * @returns A promise that resolves to an object containing the registry URI, transaction hash, and blob.
 * @throws {SDKErrors.InputContentsMalformedError} If neither transaction hash nor blob is provided,
 *          or if the transaction hash is empty after processing.
 *
 * @example
 * ```typescript
 * const updateProperties = await registryUpdateHashProperties(
 *   'registry:cord:3xygo...', // registryUri
 *   '0x456...',              // tx_hash
 *   '{"key":"newValue"}'     // blob
 * );
 * console.log(updateProperties);
 * ```
 */
export async function registryUpdateHashProperties(
  registryUri: RegistryUri,
  tx_hash: HexString,
  blob: string | null = null
): Promise<IRegistryTxHashUpdate> {
  if (!tx_hash && !blob) {
    throw new SDKErrors.InputContentsMalformedError(
      `Either 'tx_hash' or 'blob' must be provided. Both cannot be null.`
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
  } else if (tx_hash && blob) {
    /* Process the blob to be serialized and CBOR encoded if digest is present */
    const isASerializedBlob = await isBlobSerialized(blob);
    if (!isASerializedBlob) {
      blob = JSON.stringify(blob);
    }

    /* Encode the 'blob' in CBOR before dispatch to chain */
    blob = await encodeStringifiedBlobToCbor(blob);
  }

  if (!tx_hash) {
    throw new SDKErrors.InputContentsMalformedError(`Digest cannot be empty.`);
  }

  return {
    registryUri,
    tx_hash,
    blob,
  };
}
