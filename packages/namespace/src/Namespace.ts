/**
 * @packageDocumentation
 * @module Namespace
 * @preferred
 *
 * The `Namespce` module is a crucial component of the CORD SDK, providing a robust set of functionalities for 
 * creating, updating, and managing namespaces on the CORD blockchain. Namespace serve as structured containers 
 * for various claims or records, facilitating the organization and retrieval of information securely and efficiently.
 *
 * Key functionalities include:
 * - `namespaceCreateProperties`: Constructs properties for a new namespace, including the namespace URI, creator URI, 
 *   digest, and optionally serialized and CBOR-encoded blob. This function is essential for initiating new 
 *   registries with specified attributes.

 * These functionalities are integral to the efficient management of namespaces on the CORD blockchain, 
 * ensuring that they are created, updated, and authorized properly while upholding data integrity and security.
 *
 * @example
 * ```typescript
 * // Example: Creating properties for a new namespace
 * const namespaceProperties = await namespaceCreateProperties(
 *   '5F3s...',        // creatorAddress
 *   null,             // digest
 *   '{"key":"value"}'// blob
 * );
 * console.log('namespace Properties:', namespaceProperties);
 *
 * // Example: Updating properties of an existing namespace
 * const updateProperties = await namespaceUpdateProperties(
 *   'namespaceUri123', // namespaceUri
 *   'authUri456',      // authorizationUri
 *   '5F3s...',         // creatorAddress
 *   null,              // digest
 *   '{"key":"newValue"}' // blob
 * );
 * console.log('Updated Namespace Properties:', updateProperties);
 *
 * // Example: Creating authorization properties for a namespace.
 * const authorizationProperties = await namespaceAuthorizationProperties(
 *   'namespaceUri123', // namespaceUri
 *   '5F3s...',         // delegateAddress
 *   'delegate',        // permission
 *   '5F3x...'          // delegatorAddress
 * );
 * console.log('Authorization Properties:', authorizationProperties);
 * ```
 */

import type {
  Bytes,
  DidUri,
  HexString,
  INamespaceCreate,
} from '@cord.network/types';

import { SDKErrors, Cbor } from '@cord.network/utils';

import type {
  NamespaceDetails,
  AccountId,
  H256,
  NamespaceDigest,
  NamespaceAuthorizationUri,
  NamespaceUri,
} from '@cord.network/types';

import {
  uriToIdentifier,
  hashToUri,
} from '@cord.network/identifier';

import {
  NAMESPACE_IDENT,
  NAMESPACE_PREFIX,
  NAMESPACEAUTH_IDENT,
  NAMESPACEAUTH_PREFIX,
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

  const namespaceDigest = blake2AsHex(blob);

  return namespaceDigest
}


/**
 * Generates a URI for authorization based on the provided namespace URI,
 * delegate address, and creator address.
 *
 * This function computes a unique authorization URI by creating a digest
 * from the namespace identifier, the delegate's address, and the creator's address.
 *
 * @param {NamespaceUri} namespaceUri - The URI of the namespace for which authorization is requested.
 * 
 * @param {string} delegateAddress - The address of the delegate for whom the authorization URI is generated.
 * 
 * @param {string} creatorAddress - The address of the creator of the namespace, used for authentication.
 * 
 * @returns {Promise<NamespaceAuthorizationUri>} A promise that resolves to the generated 
 *                                              authorization URI for the specified namespace.
 * 
 * ## Usage Example:
 * ```typescript
 * const namespaceUri = 'some-namespace-uri'; // Example namespace URI
 * const delegateAddress = 'some-delegate-address'; // Delegate address
 * const creatorAddress = 'some-creator-address'; // Creator address
 * 
 * try {
 *   const authorizationUri = await getUriForAuthorization(namespaceUri, delegateAddress, creatorAddress);
 *   console.log(`Authorization URI: ${authorizationUri}`); // Logs the generated authorization URI
 * } catch (error) {
 *   console.error(error); 
 * }
 * ```
 *
 * This function first encodes the namespace identifier and addresses into byte arrays, 
 * then calculates the Blake2 hash digest of the combined data to create a unique authorization URI.
 */
export async function getUriForAuthorization(
  namespaceUri: NamespaceUri,
  delegateAddress: string,
  creatorAddress: string
): Promise<NamespaceAuthorizationUri> {
  const api = ConfigService.get('api')

  const scaleEncodedNamespaceId = api
    .createType<Bytes>('Bytes', uriToIdentifier(namespaceUri))
    .toU8a()
  const scaleEncodedAuthDelegate = api
    .createType<AccountId>('AccountId', delegateAddress)
    .toU8a()
  const scaleEncodedAuthCreator = api
    .createType<AccountId>('AccountId', creatorAddress)
    .toU8a()

  const authDigest = blake2AsHex(
    Uint8Array.from([
      ...scaleEncodedNamespaceId,
      ...scaleEncodedAuthDelegate,
      ...scaleEncodedAuthCreator,
    ])
  )

  const authorizationUri = hashToUri(
    authDigest,
    NAMESPACEAUTH_IDENT,
    NAMESPACEAUTH_PREFIX
  ) as NamespaceAuthorizationUri

  return authorizationUri
}


/**
 * Generates URIs for a namespace based on its digest and the creator's address.
 *
 * @param {NamespaceDigest} namespaceDigest - The unique digest of the namespace, used for identification.
 * @param {string} creatorAddress - The address of the creator of the namespace, represented as a string.
 * 
 * @returns {Promise<NamespaceDetails>} A promise that resolves to an object containing the URIs:
 * - `uri`: The unique URI for the namespace.
 * - `authorizationUri`: The URI for authorization related to the namespace.
 *
 * @throws {Error} Throws an error if URI generation fails or if the API call encounters an issue.
 *
 * ## Usage Example:
 * ```typescript
 * const namespaceDetails = await getUriForNamespace(namespaceDigest, creatorAddress);
 * console.log(namespaceDetails.uri); // Logs the Namespace URI
 * console.log(namespaceDetails.authorizationUri); // Logs the authorization URI
 * ```
 *
 * This function constructs a unique namespace URI by combining the scale-encoded namespace digest
 * with the creator's address, hashes them using Blake2, and formats the result into a URI structure.
 * It also constructs an authorization URI to manage access and permissions related to the namespace.
 */
export async function getUriForNamespace(
  namespaceDigest: NamespaceDigest,
  creatorAddress: string
): Promise<NamespaceDetails> {
  const api = ConfigService.get('api')
  const scaleEncodedNamespaceDigest = api
    .createType<H256>('H256', namespaceDigest)
    .toU8a()
  const scaleEncodedCreator = api
    .createType<AccountId>('AccountId', creatorAddress)
    .toU8a()
  const digest = blake2AsHex(
    Uint8Array.from([...scaleEncodedNamespaceDigest, ...scaleEncodedCreator])
  )

  const namespaceUri = hashToUri(digest, NAMESPACE_IDENT, NAMESPACE_PREFIX) as NamespaceUri
  
  const authorizationUri = await getUriForAuthorization(
    namespaceUri,
    creatorAddress, 
    creatorAddress
  );

  const namespaceUris = {
    uri: namespaceUri,
    authorizationUri,
  }

  return namespaceUris
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
 * Creates properties for a new namespace, including the namespace URI, creator URI, 
 * digest, and the optionally serialized and CBOR-encoded blob.
 *
 * This function requires either a digest or a blob to generate the namespace properties. 
 * If a blob is provided without a digest, the digest will be computed from the serialized 
 * blob. The blob will be CBOR-encoded before dispatching to the blockchain. 
 * 
 * If only digest is provided, it will be dispatched as is into CORD Namespace.
 * 
 * If both `digest` and `blob` are provided, the function will:
 * - Validate the `blob` for serialization.
 * - Encode the `blob` in CBOR before dispatching it.
 * - Use the existing `digest` as-is for the namespace creation process,
 *   without computing a new digest from the `blob`.
 *
 * @param creatorAddress - The address of the creator initiating the namespace creation.
 * @param digest - An optional hex string representing the digest. If not provided, it will 
 * be computed from the blob.
 * @param blob - An optional string representing the data to be stored in the namespace.
 * 
 * @returns A promise that resolves to an object containing the properties of the namespace, 
 * including the URI, creator URI, digest, blob, and authorization URI.
 * 
 * @throws {SDKErrors.InputContentsMalformedError} If neither digest nor blob is provided, 
 * or if the digest is empty after processing.
 * 
 * @example
 * const namespaceProperties = await namespaceCreateProperties(
 *   '5F3s...', // creatorAddress
 *   null,      // digest
 *   '{"key":"value"}' // blob
 * );
 * // namespaceProperties will contain the created namespace properties.
 *
 */
// TODO: Validate schemaId is a valid data-format and schemaId exists.
export async function namespaceCreateProperties(
  creatorAddress: string,
  digest: HexString | null = null,
  blob: string | null = null, 
): Promise<INamespaceCreate> {
  
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

  const { uri, authorizationUri } = await getUriForNamespace(
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
    authorizationUri,
  }
}
