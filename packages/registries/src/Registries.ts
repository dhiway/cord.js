/**
 * @packageDocumentation
 * @module Registries
 * @preferred
 *
 * The `Registries` module is a crucial component of the CORD SDK, providing a robust set of functionalities for 
 * creating, updating, and managing registries on the CORD blockchain. Registries serve as structured containers 
 * for various claims or records, facilitating the organization and retrieval of information securely and efficiently.
 *
 * Key functionalities include:
 * - `registryCreateProperties`: Constructs properties for a new registry, including the registry URI, creator URI, 
 *   digest, and optionally serialized and CBOR-encoded blob. This function is essential for initiating new 
 *   registries with specified attributes.
 * - `registryUpdateProperties`: Generates properties to update an existing registry, enabling modifications to 
 *   the registry's content while maintaining its integrity. It allows for updating the registry with new digests 
 *   and blobs as needed.
 * - `registryAuthorizationProperties`: Creates authorization properties for a delegate within a specified registry, 
 *   detailing the permissions granted by the delegator. This function is pivotal for managing access control 
 *   within the registry framework.
 *
 * These functionalities are integral to the efficient management of registries on the CORD blockchain, 
 * ensuring that they are created, updated, and authorized properly while upholding data integrity and security.
 *
 * @example
 * ```typescript
 * // Example: Creating properties for a new registry
 * const registryProperties = await registryCreateProperties(
 *   '5F3s...',        // creatorAddress
 *   null,             // digest
 *   'schemaId123',   // schemaId
 *   '{"key":"value"}'// blob
 * );
 * console.log('Registry Properties:', registryProperties);
 *
 * // Example: Updating properties of an existing registry
 * const updateProperties = await registryUpdateProperties(
 *   'registryUri123', // registryUri
 *   'authUri456',    // authorizationUri
 *   '5F3s...',        // creatorAddress
 *   null,             // digest
 *   '{"key":"newValue"}' // blob
 * );
 * console.log('Updated Registry Properties:', updateProperties);
 *
 * // Example: Creating authorization properties for a registry
 * const authorizationProperties = await registryAuthorizationProperties(
 *   'registryUri123', // registryUri
 *   '5F3s...',        // delegateAddress
 *   'delegate',       // permission
 *   '5F3x...'         // delegatorAddress
 * );
 * console.log('Authorization Properties:', authorizationProperties);
 * ```
 */

import type {
  Bytes,
  DidUri,
  HexString,
  IRegistryAuthorization,
  IRegistryCreate,
  IRegistryUpdate,
  RegistryPermissionType,
} from '@cord.network/types';

import { SDKErrors, Cbor } from '@cord.network/utils';

import type {
  RegistryDetails,
  AccountId,
  H256,
  RegistryDigest,
  RegistryAuthorizationUri,
  RegistryUri,
} from '@cord.network/types';

import {
  uriToIdentifier,
  hashToUri,
} from '@cord.network/identifier';

import {
  REGISTRY_IDENT,
  REGISTRY_PREFIX,
  REGISTRYAUTH_IDENT,
  REGISTRYAUTH_PREFIX,
  blake2AsHex,
} from '@cord.network/types'

import { ConfigService } from '@cord.network/config';

/**
 * Computes a Blake2 H256 hash digest from the provided raw data (blob).
 *
 * This function verifies if the input blob is serialized before hashing it.
 *
 * @param {string} blob - The raw data input for which the digest needs to be calculated. 
 *                        This should be a serialized string.
 * 
 * @returns {Promise<string>} A promise that resolves to the computed digest of the blob,
 *                            represented as a hexadecimal string.
 * 
 * @throws {SDKErrors.InputContentsMalformedError} Throws an error if the blob is not serialized.
 *
 * ## Usage Example:
 * ```typescript
 * const rawData = '{"key": "value"}'; // Example raw data
 * try {
 *   const digest = await getDigestFromRawData(rawData);
 *   console.log(`Computed Digest: ${digest}`); // Logs the computed digest
 * } catch (error) {
 *   console.error(error.message); // Handles any errors thrown
 * }
 * ```
 *
 * This function first checks whether the provided blob is serialized. If not, it throws an error.
 * Once confirmed, it encodes the blob into a byte array and calculates the Blake2 hash digest,
 * returning the result as a hexadecimal string.
 */
export async function getDigestFromRawData (
  blob: string
) {

  const isASerializedBlob = await isBlobSerialized(blob);
  if (!isASerializedBlob) {
    throw new SDKErrors.InputContentsMalformedError(
      `Input 'blob' is not serialized.`
    );
  }

  const api = ConfigService.get('api')
  const scaleEncodedRawData = api
    .createType<Bytes>('Bytes', blob)
    .toU8a()
  const registryDigest = blake2AsHex(
    Uint8Array.from([
      ...scaleEncodedRawData
    ]));

  return registryDigest
}


/**
 * Generates a URI for authorization based on the provided registry URI,
 * delegate address, and creator address.
 *
 * This function computes a unique authorization URI by creating a digest
 * from the registry identifier, the delegate's address, and the creator's address.
 *
 * @param {RegistryUri} registryUri - The URI of the registry for which authorization is requested.
 * 
 * @param {string} delegateAddress - The address of the delegate for whom the authorization URI is generated.
 * 
 * @param {string} creatorAddress - The address of the creator of the registry, used for authentication.
 * 
 * @returns {Promise<RegistryAuthorizationUri>} A promise that resolves to the generated 
 *                                              authorization URI for the specified registry.
 * 
 * ## Usage Example:
 * ```typescript
 * const registryUri = 'some-registry-uri'; // Example registry URI
 * const delegateAddress = 'some-delegate-address'; // Delegate address
 * const creatorAddress = 'some-creator-address'; // Creator address
 * 
 * try {
 *   const authorizationUri = await getUriForAuthorization(registryUri, delegateAddress, creatorAddress);
 *   console.log(`Authorization URI: ${authorizationUri}`); // Logs the generated authorization URI
 * } catch (error) {
 *   console.error(error); 
 * }
 * ```
 *
 * This function first encodes the registry identifier and addresses into byte arrays, 
 * then calculates the Blake2 hash digest of the combined data to create a unique authorization URI.
 */
export async function getUriForAuthorization(
  registryUri: RegistryUri,
  delegateAddress: string,
  creatorAddress: string
): Promise<RegistryAuthorizationUri> {
  const api = ConfigService.get('api')

  const scaleEncodedRegistryId = api
    .createType<Bytes>('Bytes', uriToIdentifier(registryUri))
    .toU8a()
  const scaleEncodedAuthDelegate = api
    .createType<AccountId>('AccountId', delegateAddress)
    .toU8a()
  const scaleEncodedAuthCreator = api
    .createType<AccountId>('AccountId', creatorAddress)
    .toU8a()

  const authDigest = blake2AsHex(
    Uint8Array.from([
      ...scaleEncodedRegistryId,
      ...scaleEncodedAuthDelegate,
      ...scaleEncodedAuthCreator,
    ])
  )

  const authorizationUri = hashToUri(
    authDigest,
    REGISTRYAUTH_IDENT,
    REGISTRYAUTH_PREFIX
  ) as RegistryAuthorizationUri

  return authorizationUri
}


/**
 * Generates URIs for a registry based on its digest and the creator's address.
 *
 * @param {RegistryDigest} registryDigest - The unique digest of the registry, used for identification.
 * @param {string} creatorAddress - The address of the creator of the registry, represented as a string.
 * 
 * @returns {Promise<RegistryDetails>} A promise that resolves to an object containing the URIs:
 * - `uri`: The unique URI for the registry.
 * - `authorizationUri`: The URI for authorization related to the registry.
 *
 * @throws {Error} Throws an error if URI generation fails or if the API call encounters an issue.
 *
 * ## Usage Example:
 * ```typescript
 * const registryDetails = await getUriForRegistry(registryDigest, creatorAddress);
 * console.log(registryDetails.uri); // Logs the registry URI
 * console.log(registryDetails.authorizationUri); // Logs the authorization URI
 * ```
 *
 * This function constructs a unique registry URI by combining the scale-encoded registry digest
 * with the creator's address, hashes them using Blake2, and formats the result into a URI structure.
 * It also constructs an authorization URI to manage access and permissions related to the registry.
 */
export async function getUriForRegistry(
  registryDigest: RegistryDigest,
  creatorAddress: string
): Promise<RegistryDetails> {
  const api = ConfigService.get('api')
  const scaleEncodedRegistryDigest = api
    .createType<H256>('H256', registryDigest)
    .toU8a()
  const scaleEncodedCreator = api
    .createType<AccountId>('AccountId', creatorAddress)
    .toU8a()
  const digest = blake2AsHex(
    Uint8Array.from([...scaleEncodedRegistryDigest, ...scaleEncodedCreator])
  )

  const registryUri = hashToUri(digest, REGISTRY_IDENT, REGISTRY_PREFIX) as RegistryUri
  
  const authorizationUri = await getUriForAuthorization(
    registryUri,
    creatorAddress, 
    creatorAddress
  );

  const registryUris = {
    uri: registryUri,
    authorizationUri,
  }

  return registryUris
}


/**
 * Checks if the provided blob is serialized.
 *
 * This function attempts to parse the input `blob` as JSON. If parsing is successful,
 * it indicates that the blob is serialized. If the input is not a string or cannot be 
 * parsed as JSON, it returns false.
 *
 * @param blob - The input data to check for serialization. This can be of any type.
 * 
 * @returns A promise that resolves to a boolean value:
 *          - `true` if the blob is a valid JSON string and is serialized.
 *          - `false` if the blob is not a string or if it cannot be parsed as JSON.
 *
 * @throws {Error} If the input is not a string and cannot be parsed.
 */
export async function isBlobSerialized(
  blob: any
): Promise<boolean> {
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
 * 
 * @returns A promise that resolves to a base64-encoded string of the CBOR representation of the input blob.
 *
 * @throws {SDKErrors.InputContentsMalformedError} If the input blob is not a valid serialized string.
 *
 * @example
 * const cborBlob = await encodeStringifiedBlobToCbor('{"key": "value"}');
 * // cborBlob will contain the base64-encoded CBOR representation of the input blob.
 */
export async function encodeStringifiedBlobToCbor(
  blob: string
): Promise<string> {
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
 * 
 * @returns A promise that resolves to the original stringified blob.
 *
 * @throws {Error} If decoding fails due to invalid CBOR format or other issues.
 *
 * @example
 * const stringifiedBlob = await decodeCborToStringifiedBlob('base64EncodedCborBlob');
 * // stringifiedBlob will contain the original stringified blob that was encoded.
 */
export async function decodeCborToStringifiedBlob(
  cborBlob: string
): Promise<string> {
  const decodedBuffer = Buffer.from(cborBlob, 'base64');
  const decodedBlob = Cbor.decode(decodedBuffer);

  return decodedBlob;
}


/**
 * Creates properties for a new registry, including the registry URI, creator URI, 
 * digest, and the optionally serialized and CBOR-encoded blob.
 *
 * This function requires either a digest or a blob to generate the registry properties. 
 * If a blob is provided without a digest, the digest will be computed from the serialized 
 * blob. The blob will be CBOR-encoded before dispatching to the blockchain. 
 * 
 * If only digest is provided, it will be dispatched as is into CORD Registry.
 * 
 * If both `digest` and `blob` are provided, the function will:
 * - Validate the `blob` for serialization.
 * - Encode the `blob` in CBOR before dispatching it.
 * - Use the existing `digest` as-is for the registry creation process,
 *   without computing a new digest from the `blob`.
 *
 * @param creatorAddress - The address of the creator initiating the registry creation.
 * @param digest - An optional hex string representing the digest. If not provided, it will 
 * be computed from the blob.
 * @param schemaId - An optional string representing the schema ID for the registry.
 * @param blob - An optional string representing the data to be stored in the registry.
 * 
 * @returns A promise that resolves to an object containing the properties of the registry, 
 * including the URI, creator URI, digest, blob, schema ID, and authorization URI.
 * 
 * @throws {SDKErrors.InputContentsMalformedError} If neither digest nor blob is provided, 
 * or if the digest is empty after processing.
 * 
 * @example
 * const registryProperties = await registryCreateProperties(
 *   '5F3s...', // creatorAddress
 *   null,      // digest
 *   'schemaId123', // schemaId
 *   '{"key":"value"}' // blob
 * );
 * // registryProperties will contain the created registry properties.
 *
 */
// TODO: Validate schemaId is a valid data-format and schemaId exists.
export async function registryCreateProperties(
  creatorAddress: string,
  digest: HexString | null = null,
  schemaId: string | null = null,
  blob: string | null = null, 
): Promise<IRegistryCreate> {
  
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

  /* Process the blob to be serialized and CBOR encoded is digest is present */
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

  const { uri, authorizationUri } = await getUriForRegistry(
    digest as HexString,
    creatorAddress
  )

  // TODO:
  // Revisit if use of creatorUri as below is correct.
  const creatorUri = `did:cord:3${creatorAddress}` as DidUri;
  
  return {
    uri,
    creatorUri,
    digest,
    blob,
    schemaId,
    authorizationUri,
  }
}


/**
 * Updates properties for an existing registry, including the registry URI, 
 * creator URI, digest, and optionally serialized and CBOR-encoded blob.
 *
 * This function requires either a digest or a blob to update the registry properties. 
 * If a blob is provided without a digest, the digest will be computed from the serialized 
 * blob. The blob will be CBOR-encoded before dispatching to the blockchain. 
 * 
 * If only digest is provided, it will be dispatched as-is into CORD Registry.
 * 
 * If both `digest` and `blob` are provided, the function will:
 * - Validate the `blob` for serialization.
 * - Encode the `blob` in CBOR before dispatching it.
 * - Use the existing `digest` as-is for the registry update process,
 *   without computing a new digest from the `blob`.
 *
 * @param registryUri - The URI of the registry to be updated.
 * @param authorizationUri - The authorization URI for the registry update.
 * @param creatorAddress - The address of the creator initiating the registry update.
 * @param digest - An optional hex string representing the digest. If not provided, it will 
 * be computed from the blob.
 * @param blob - An optional string representing the data to be stored in the registry.
 * 
 * @returns A promise that resolves to an object containing the updated properties of the registry, 
 * including the URI, creator URI, digest, blob, and authorization URI.
 * 
 * @throws {SDKErrors.InputContentsMalformedError} If neither digest nor blob is provided, 
 * or if the digest is empty after processing.
 * 
 * @example
 * const updatedRegistryProperties = await registryUpdateProperties(
 *   'registryUri',        // registryUri
 *   'authorizationUri',   // authorizationUri
 *   '5F3s...',            // creatorAddress
 *   null,                 // digest
 *   '{"key":"newValue"}' // blob
 * );
 * // updatedRegistryProperties will contain the updated registry properties.
 *
 */
export async function registryUpdateProperties(
  registryUri: RegistryUri,
  authorizationUri: RegistryAuthorizationUri,
  creatorAddress: string,
  digest: HexString | null = null,
  blob: string | null = null, 
): Promise<IRegistryUpdate> {
  
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

    /* Encode the 'blob' in CBOR before dispatch to chain */
    blob = await encodeStringifiedBlobToCbor(blob);
  } 

  /* Process the blob to be serialized and CBOR encoded is digest is present */
  else if (digest && blob) {
    const isASerializedBlob = await isBlobSerialized(blob);
    if (!isASerializedBlob) {
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

  // TODO:
  // Revisit if use of creatorUri as below is correct.
  const creatorUri = `did:cord:3${creatorAddress}` as DidUri;
  
  return {
    uri: registryUri,
    creatorUri,
    digest,
    blob,
    authorizationUri,
  }
}


/**
 * Creates properties for registry authorization, including URIs for the registry, 
 * delegate, and delegator, as well as the associated permission for the authorization.
 *
 * This function constructs the authorization properties required for a delegate 
 * to act on behalf of a registrant in a specified registry. It generates the 
 * delegate and delegator URIs and retrieves the authorization URI for the 
 * specified registry.
 * 
 * @param registryUri - The URI of the registry for which authorization is being created.
 * @param delegateAddress - The address of the delegate who will be granted permissions.
 * @param permission - The type of permission being granted to the delegate in the registry.
 * @param delegatorAddress - The address of the delegator who is granting the permission to the delegate.
 * 
 * @returns A promise that resolves to an object containing the properties of the registry 
 * authorization, including the registry URI, authorization URI, delegate URI, permission type, 
 * and delegator URI.
 * 
 * @throws {SDKErrors.InputContentsMalformedError} If any input parameter is malformed or invalid.
 * 
 * @example
 * const authorizationProperties = await registryAuthorizationProperties(
 *   'registryUri123', // registryUri
 *   '5F3s...',        // delegateAddress
 *   'delegate',       // permission
 *   '5F3x...'         // delegatorAddress
 * );
 * // authorizationProperties will contain the created registry authorization properties.
 *
 */
export async function registryAuthorizationProperties(
  registryUri: RegistryUri,
  delegateAddress: string,
  permission: RegistryPermissionType,
  delegatorAddress: string,
): Promise<IRegistryAuthorization> {
  
  // TOOD: Revisit below did-abstraction.
  const delegateUri = `did:cord:3${delegateAddress}` as DidUri;
  const delegatorUri = `did:cord:3${delegatorAddress}` as DidUri;
  
  const delegateAuthorizationUri = await getUriForAuthorization(
    registryUri,
    delegateAddress, 
    delegatorAddress
  );

  return {
    uri: registryUri,
    authorizationUri: delegateAuthorizationUri,
    delegateUri: delegateUri,
    permission,
    delegatorUri: delegatorUri,
  }
}

// TODO:
// Check if there is a requirement of validating, 
// the digest generated from the blob and incoming digest are same.
// That way there would not be any discreprencies b/w blob and digest.