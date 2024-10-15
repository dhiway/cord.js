/**
 * @packageDocumentation
 * @module Entries
 * @preferred
 *
 * The `Entries` module is part of the CORD SDK, providing essential functionality for creating and managing
 * registry entries within the CORD blockchain. Entries represent records or claims that are registered within
 * a registry and are critical for organizing decentralized data in a structured way.
 *
 * The `Entries` module ensures that new entries can be created, updated, revoked, and reinstated, maintaining
 * a flexible, transparent, and secure record-keeping system.
 *
 * These below functionalities enable the decentralized management of entries on the CORD blockchain, ensuring that records
 * are securely stored, verified, and managed across different registries.
 *
 * @example
 * ```typescript
 * // Example: Creating properties for a new entry
 * const entryProperties = await createEntryProperties(
 *   '5F3s...',         // creatorAddress
 *   '0x23...',         // digest
 *   'schemaId123',     // schemaId
 *   '{"key":"value"}'  // blob
 * );
 * console.log('Entry Properties:', entryProperties);
 * ```
 * 
 */

import { 
  encodeStringifiedBlobToCbor,
  getDigestFromRawData,
  isBlobSerialized
} from "@cord.network/registries";

import { 
  EntryUri,
  AccountId,
  H256,
  RegistryUri,
  Bytes,
  DidUri,
  HexString,
  EntryDigest,
  RegistryAuthorizationUri,
  IRegistryEntry,
  blake2AsHex,
} from "@cord.network/types";

import { 
  SDKErrors,
  DataUtils,
 } from '@cord.network/utils';

import {
  uriToIdentifier,
  updateRegistryEntryUri,
  buildRegistryEntryUri,
  checkIdentifier,
} from '@cord.network/identifier';

import { ConfigService } from '@cord.network/config';


/**
 * Generates a URI for a registry entry based on its digest, registry URI, and creator's address.
 *
 * This function computes the unique URI for a registry entry by hashing the combination of the
 * entry digest, registry URI identifier, and creator's address. It uses the BLAKE2 hashing algorithm
 * to ensure a unique and secure identifier for the entry. The resulting hash is then formatted into
 * a URI using a predefined entry identifier and prefix.
 *
 * @param {EntryDigest} entryDigest - The digest representing the data of the registry entry.
 * @param {RegistryUri} registryUri - The URI of the registry that the entry belongs to.
 * @param {string} creatorAddress - The address (in SS58 format) of the account that created the registry entry.
 * 
 * @returns {Promise<EntryUri>} - A promise that resolves to the computed `EntryUri` for the registry entry.
 * 
 * @example
 * ```typescript
 * const entryDigest = '0x123...'; // Entry digest (H256 hash)
 * const registryUri = 'registryUri123'; // Registry URI
 * const creatorAddress = '5F3s...'; // Creator's SS58 address
 * 
 * const entryUri = await getUriForRegistryEntry(entryDigest, registryUri, creatorAddress);
 * console.log('Generated Entry URI:', entryUri);
 * ```
 * 
 * @remarks
 * This function makes use of the BLAKE2 hashing algorithm to combine the entry's digest, registry ID,
 * and creator's address into a unique URI for the entry. The resulting hash is then converted to a URI
 * using the `hashToUri` function.
 * 
 */
export async function getUriForRegistryEntry(
  entryDigest: EntryDigest,
  registryUri: RegistryUri,
  creatorAddress: string
): Promise<EntryUri> {
  const api = ConfigService.get('api')
  const scaleEncodedRegistryDigest = api
    .createType<H256>('H256', entryDigest)
    .toU8a()
  const scaleEncodedRegistryId = api
    .createType<Bytes>('Bytes', uriToIdentifier(registryUri))
    .toU8a()
  const scaleEncodedCreator = api
    .createType<AccountId>('AccountId', creatorAddress)
    .toU8a()
  const IdDigest = blake2AsHex(
    Uint8Array.from([
      ...scaleEncodedRegistryDigest,
      ...scaleEncodedRegistryId,
      ...scaleEncodedCreator
    ])
  );
  
  // Below `entryUri` is of type `entry:cord:IdDigest:entryDigest`
  const entryUri = buildRegistryEntryUri(IdDigest, entryDigest) as EntryUri;

  return entryUri;
}


/**
 * Verifies the integrity of the given IRegistryEntry object.
 *
 * @remarks
 * This function ensures that the input conforms to the expected data structure
 * by checking required fields, identifiers, and digest format.
 *
 * @param input - The IRegistryEntry object to verify.
 * @throws {SDKErrors.RegistryEntryError} If any required field is missing or invalid.
 */
export function verifyRegistryEntry(input: IRegistryEntry): void {
  if (!input.digest) {
    throw new SDKErrors.InvalidInputError('Digest is required.');
  }

  checkIdentifier(input.registryUri);
  checkIdentifier(input.authorizationUri);
  checkIdentifier(input.creatorUri);

  DataUtils.verifyIsHex(input.digest, 256);

  if (input.blob !== null && typeof input.blob !== 'string') {
    throw new SDKErrors.InvalidInputError('Blob must be a string or null.');
  }
}


/**
 * Constructs the properties required to create a registry entry in the CORD blockchain.
 *
 * This function prepares the necessary data for creating a new registry entry, including 
 * the creator's address, the entry's digest, and an optional serialized and CBOR-encoded blob. 
 * It validates the input, ensuring either a digest or a blob is provided, processes the blob 
 * if necessary, and computes a unique URI for the registry entry. The function returns an 
 * object containing all the properties needed for dispatching the entry to the blockchain.
 *
 * @param {string} creatorAddress - The SS58 address of the account that will create the registry entry.
 * @param {HexString | null} digest - A precomputed digest (hash) of the registry entry, if available.
 * @param {string | null} blob - The blob (serialized data) to be associated with the registry entry, if available.
 * @param {RegistryUri} registryUri - The URI of the registry to which the entry belongs.
 * @param {RegistryAuthorizationUri} authorizationUri - The URI for the authorization properties within the registry.
 * 
 * @returns {Promise<IRegistryEntry>} - A promise that resolves to an `IRegistryEntry` object containing the properties of the new registry entry.
 * 
 * @throws {SDKErrors.InputContentsMalformedError} - If neither `digest` nor `blob` are provided, or if the digest is invalid.
 *
 * @example
 * ```typescript
 * // Example: Creating properties for a registry entry with a blob
 * const entryProperties = await CreateEntriesProperties(
 *   '5F3s...',        // Creator's SS58 address
 *   null,             // Digest is null, will be generated from blob
 *   '{"key":"value"}',// Blob data
 *   'registryUri123', // Registry URI
 *   'authUri456'      // Authorization URI
 * );
 * console.log('Registry Entry Properties:', entryProperties);
 *
 * // Example: Creating properties with a precomputed digest
 * const entryPropertiesWithDigest = await CreateEntriesProperties(
 *   '5F3s...',          // Creator's SS58 address
 *   '0x123...',         // Precomputed digest
 *   '{"key":"value"}',  // Optional blob
 *   'registryUri123',   // Registry URI
 *   'authUri456'        // Authorization URI
 * );
 * console.log('Registry Entry Properties with Digest:', entryPropertiesWithDigest);
 * ```
 *
 * @remarks
 * - If both a `digest` and `blob` are provided, the blob will be serialized (if necessary) and encoded in CBOR format.
 * - If only a `blob` is provided, the digest is computed from the raw blob data.
 * - The `entryUri` is computed by hashing the registry URI, digest, and creator's address using the `getUriForRegistryEntry` function.
 * - The `creatorUri` is constructed as a DID using the creator's address.
 *
 */
export async function createEntriesProperties(
  creatorAddress: string,
  registryUri: RegistryUri,
  authorizationUri: RegistryAuthorizationUri,
  digest: HexString | null = null,
  blob: string | null = null,
): Promise<IRegistryEntry> {
  
  if (!digest && !blob) {
    throw new SDKErrors.InputContentsMalformedError(
      `Either 'digest' or 'blob' must be provided. Both cannot be null.`
    );
  }

  /* Construct digest from serialized blob if digest is absent */
  if (!digest && blob) {
    const isASerializedBlob = await isBlobSerialized(blob);
    if (!isASerializedBlob) {
      blob = JSON.stringify(blob); 
    }
    
    digest = await getDigestFromRawData(blob); 

    /* Encode the serialized 'blob' in CBOR before dispatch to chain */
    blob = await encodeStringifiedBlobToCbor(blob);
  } 

  /* Process the blob to be serialized and CBOR encoded if digest is present */
  else if (digest && blob) {
    const isASerializedBlob = await isBlobSerialized(blob);
    if (!isASerializedBlob){
      blob = JSON.stringify(blob);
    }

    /* Encode the 'blob' in CBOR before dispatch to chain */
    blob = await encodeStringifiedBlobToCbor(blob);
  }

  if (!digest) {
    throw new SDKErrors.InputContentsMalformedError(
      `Digest cannot be empty.`
    );
  }

  const entryUri = await getUriForRegistryEntry(
    digest as HexString,
    registryUri,
    creatorAddress
  )

  // TODO:
  // Revisit if use of creatorUri as below is correct.
  const creatorUri = `did:cord:3${creatorAddress}` as DidUri;
  
  const registryEntryObj = {
    uri: entryUri,
    creatorUri,
    digest,
    blob,
    registryUri,
    authorizationUri,
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
 * Updates the properties of a registry entry by validating and processing 
 * the provided digest or blob. If the blob is present and not serialized, 
 * it is serialized and encoded using CBOR. If the digest is absent, it 
 * is computed from the serialized blob. The function returns an updated 
 * registry entry object with the new URI, digest, and processed blob.
 *
 * @param {EntryUri} registryEntryUri - The original URI of the registry entry to update.
 * @param {string} creatorAddress - The creator's address, which is used to generate a DID URI.
 * @param {RegistryUri} registryUri - The URI of the registry associated with the entry.
 * @param {RegistryAuthorizationUri} authorizationUri - The authorization URI associated with the registry entry.
 * @param {HexString | null} [digest=null] - The optional hash of the blob. If not provided, it will be computed from the blob.
 * @param {string | null} [blob=null] - The optional blob data. If provided, it will be serialized and encoded if needed.
 * 
 * @throws {SDKErrors.InputContentsMalformedError} - Thrown if both `digest` and `blob` are `null` or if `digest` is missing after processing.
 * @throws {SDKErrors.CordDispatchError} - Thrown if the registry entry object fails validation.
 * 
 * @returns {Promise<IRegistryEntry>} - A promise that resolves to the updated registry entry object with the new URI, digest, and processed blob.
 *
 */
export async function updateEntriesProperties(
  registryEntryUri: EntryUri,
  creatorAddress: string,
  registryUri: RegistryUri,
  authorizationUri: RegistryAuthorizationUri,
  digest: HexString | null = null,
  blob: string | null = null,
): Promise<IRegistryEntry> {
  
  if (!digest && !blob) {
    throw new SDKErrors.InputContentsMalformedError(
      `Either 'digest' or 'blob' must be provided. Both cannot be null.`
    );
  }

  /* Construct digest from serialized blob if digest is absent */
  if (!digest && blob) {
    const isASerializedBlob = await isBlobSerialized(blob);
    if (!isASerializedBlob) {
      blob = JSON.stringify(blob); 
    }
    
    digest = await getDigestFromRawData(blob); 

    /* Encode the serialized 'blob' in CBOR before dispatch to chain */
    blob = await encodeStringifiedBlobToCbor(blob);
  } 

  /* Process the blob to be serialized and CBOR encoded if digest is present */
  else if (digest && blob) {
    const isASerializedBlob = await isBlobSerialized(blob);
    if (!isASerializedBlob){
      blob = JSON.stringify(blob);
    }

    /* Encode the 'blob' in CBOR before dispatch to chain */
    blob = await encodeStringifiedBlobToCbor(blob);
  }

  if (!digest) {
    throw new SDKErrors.InputContentsMalformedError(
      `Digest cannot be empty.`
    );
  }

  /* 
   * Update the entryUri to have newer digest as suffix 
   * Below `entryUri` is of type `entry:cord:IdDigest:entryDigest`
   */
  const entryUri = updateRegistryEntryUri(
    registryEntryUri, digest
  );

  // TODO:
  // Revisit if use of creatorUri as below is correct.
  const creatorUri = `did:cord:3${creatorAddress}` as DidUri;
  
  const registryEntryObj = {
    uri: entryUri,
    creatorUri,
    digest,
    blob,
    registryUri,
    authorizationUri,
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
