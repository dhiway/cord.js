/**
 * @packageDocumentation
 * @module Schema/Chain
 
 * This file contains functions and types related to the interaction between the schema definitions and the blockchain.
 * It primarily deals with encoding and decoding schema data for blockchain storage and retrieval, as well as
 * validating and verifying schema integrity in the context of blockchain interactions.
 *
 * The `SchemaChain` module serves as a bridge between the account based schema definitions used within the application and their
 * representation on the blockchain. It provides functionalities to:
 * - Convert schema objects to a format suitable for blockchain storage (`toChain`).
 * - Fetch schema data from the blockchain and reconstruct it into usable schema objects (`fetchFromChain`, `fromChain`).
 * - Verify the existence and integrity of schemas on the blockchain (`isSchemaStored`).
 * - Generate and validate unique identifiers for schemas based on their content and creator (`getUriForSchema`).
 *
 * This module is crucial for ensuring that schemas are correctly stored, retrieved, and validated in a blockchain
 * environment. It encapsulates the complexities of handling blockchain-specific data encoding and decoding, allowing
 * other parts of the application to interact with schema data in a more abstract and convenient manner.
 *
 * The functions in this module are typically used in scenarios where schemas need to be registered, updated, or
 * queried from the blockchain, ensuring that the schema data remains consistent and verifiable across different
 * nodes in the network.
 */

import type {
  Bytes,
  Option,
  CordKeyringPair,
  SchemaUri,
} from '@cord.network/types'

import type { PalletSchemaSchemaEntry } from '@cord.network/augment-api'

import {
  SchemaDigest,
  ISchema,
  SCHEMA_PREFIX,
  SCHEMA_IDENT,
  blake2AsHex,
  ISchemaAccountsDetails,
  SchemaId,
} from '@cord.network/types'

import { ConfigService } from '@cord.network/config'
import { Chain } from '@cord.network/network'
import { SDKErrors, Cbor, Crypto } from '@cord.network/utils'

import {
  hashToUri,
  uriToIdentifier,
} from '@cord.network/identifier'

import {
    encodeCborSchema,
    verifyDataStructure
} from './Schema.js'


/**
 * Checks if a given schema is stored on the blockchain.
 * This function queries the blockchain to determine whether the specified schema exists in the blockchain storage.
 *
 * @param schema - The schema object (`ISchema`) to be checked. It must contain a valid `$id` property.
 *
 * @returns A promise that resolves to a boolean value. It returns `true` if the schema is stored on the blockchain,
 *          and `false` if it is not.
 *
 * @example
 * ```typescript
 * const stored = await isSchemaStored(mySchema);
 * if (stored) {
 *   console.log('Schema is stored on the blockchain.');
 * } else {
 *   console.log('Schema is not stored on the blockchain.');
 * }
 * ```
 */
export async function isSchemaStored(schema: ISchema): Promise<boolean> {
  const api = ConfigService.get('api');
  const identifier = uriToIdentifier(schema.$id);
  const encoded = await api.query.schema.schemas(identifier);

  return !encoded.isNone
}


/**
 * Asynchronously checks if a schema with the given URI exists on-chain.
 *
 * This function interacts with the blockchain using the configured API service to verify
 * the existence of a schema by querying the `schema` storage. It converts the
 * provided schema URI into an identifier, which is used to fetch the corresponding
 * schema entry. If an entry exists, the function returns `true`; otherwise, it returns `false`.
 *
 * ### Parameters:
 * @param schemaUri - The URI of the schema to be checked. This URI serves as the reference
 *                    to uniquely identify the schema on-chain.
 *
 * ### Returns:
 * @returns {Promise<boolean>} - A promise that resolves to:
 * - **`true`** if the schema exists on-chain.
 * - **`false`** if the schema does not exist or the query returns `None`.
 *
 * ### Example Usage:
 * ```typescript
 * const schemaUri = 'cord:schema:123456789';
 *
 * doesSchemaIdExists(schemaUri)
 *   .then(exists => {
 *     if (exists) {
 *       console.log('Schema exists on-chain.');
 *     } else {
 *       console.log('Schema not found.');
 *     }
 *   })
 *   .catch(error => console.error('Error checking schema existence:', error));
 * ```
 *
 * ### Internal Logic:
 * 1. **Fetching the API**: The function retrieves the blockchain API instance using the `ConfigService`.
 * 2. **Converting URI to Identifier**: The URI is converted into an identifier using `uriToIdentifier`.
 * 3. **Querying Blockchain Storage**: It queries the `schemas` storage in `schema` with the identifier.
 * 4. **Checking Existence**: If the query returns `None`, the schema does not exist; otherwise, it exists.
 *
 * ### Throws:
 * - Any error encountered while querying the blockchain API will be propagated as a rejected promise.
 *
 * ### Dependencies:
 * - **ConfigService**: Retrieves the blockchain API instance.
 * - **uriToIdentifier**: Converts schema URI into a blockchain-compatible identifier.
 */
export async function doesSchemaIdExists(schemaUri: SchemaUri): Promise<boolean> {
  const api = ConfigService.get('api');
  const identifier = uriToIdentifier(schemaUri);
  const encoded = await api.query.schema.schemas(identifier);

  return !encoded.isNone;
}


/**
 * (Internal Function) - Generates a unique URI for a given schema based on its serialized content.
 *
 * This function ensures each schema is uniquely identified and reliably retrievable using the generated URI.
 *
 * ### Functionality
 * - Uses CBOR encoding to serialize the schema for efficient processing.
 * - Cryptographically hashes the serialized schema using `blake2` hashing to ensure uniqueness.
 * - Encodes the schema with SCALE encoding for compatibility with Substrate-based systems.
 * - Generates a URI from the schema’s digest using network-specific identifiers and prefixes.
 *
 * ### Parameters
 * @param schema - The schema object or a version of it without the `$id` property.
 *                 It must conform to the `ISchema` interface used in the Cord network.
 *
 * ### Returns
 * @returns An object containing:
 * - `uri`: A string representing the unique URI of the schema within the Cord network.
 * - `digest`: A cryptographic hash of the schema's serialized content.
 *
 * ### Usage
 * This function is used internally to register and manage schemas, ensuring that each one is uniquely
 * identifiable within the Cord network using its URI.
 *
 * ### Throws
 * @throws {Error} If any part of the URI generation process fails, such as issues with schema serialization, etc.
 *
 * @example
 * const schema = { name: "Example Schema", properties: { id: "string" } };
 * const result = getUriForSchema(schema);
 * console.log(result.uri); // Unique schema URI
 */
export function getUriForSchema(
  schema: ISchema | Omit<ISchema, '$id'>,
): { uri: SchemaUri; digest: SchemaDigest } {
  const api = ConfigService.get('api')
  const serializedSchema = encodeCborSchema(schema)
  const digest = Crypto.hashStr(serializedSchema)

  const scaleEncodedSchema = api
    .createType<Bytes>('Bytes', serializedSchema)
    .toU8a()

  const IdDigest = blake2AsHex(
    Uint8Array.from([
      ...scaleEncodedSchema
    ])
  )
  const schemaUri = hashToUri(
    IdDigest,
    SCHEMA_IDENT,
    SCHEMA_PREFIX
  ) as SchemaUri

  return { uri: schemaUri, digest }
}


/**
 * Dispatches a schema to the blockchain for storage, ensuring its uniqueness, immutability,
 * and verifiability. This function encodes the schema, creates a blockchain transaction,
 * and submits it using the author's account for signing and submission.
 *
 * ### Functionality:
 * - **Checks for existing schema**: Verifies if the schema is already registered on the blockchain.
 * - **Encodes schema in CBOR**: Ensures schema data is serialized efficiently.
 * - **Creates and signs the extrinsic**: Uses the blockchain's `create` method for schema storage.
 * - **Transaction submission**: Signs and submits the extrinsic to the blockchain using the provided author's account.
 *
 * ### Parameters:
 * @param schema - An `ISchema` object representing the structured data definition for the Cord network.
 *                 This object defines the schema’s structure and requirements.
 * @param authorAccount - A `CordKeyringPair` representing the blockchain account of the author,
 *                        used to sign and submit the schema transaction.
 *
 * ### Returns:
 * @returns A promise that resolves to the unique schema ID (`SchemaId`) upon successful storage.
 *          If the schema is already stored, it returns the existing schema's `$id`.
 *
 * ### Throws:
 * @throws {SDKErrors.CordDispatchError} If an error occurs during the dispatch process, such as:
 * - Schema creation issues.
 * - Network connectivity problems.
 * - Transaction signing or submission failure.
 *
 * ### Example Usage:
 * ```typescript
 * async function exampleSchemaDispatch() {
 *   const schema = { title: 'Example Schema', properties: { id: { type: 'string' } } };
 *   const authorAccount = cord.createFromUri('//Alice'); // Example keyring pair
 *
 *   try {
 *     const schemaId = await dispatchToChain(schema, authorAccount);
 *     console.log('Schema dispatched with ID:', schemaId);
 *   } catch (error) {
 *     console.error('Error dispatching schema:', error);
 *   }
 * }
 *
 * exampleSchemaDispatch();
 * ```
 */
export async function dispatchToChain(
  schema: ISchema,
  authorAccount: CordKeyringPair,
): Promise<SchemaId> {
  try {
    const api = ConfigService.get('api')

    const exists = await isSchemaStored(schema)
    if (exists) {
      return schema.$id
    }

    const encodedSchema = encodeCborSchema(schema);
    const extrinsic = api.tx.schema.create(encodedSchema);

    await Chain.signAndSubmitTx(extrinsic, authorAccount)

    return schema.$id
  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${error}".`
    )
  }
}


/**
 * (Internal Function) - Fetches and reconstructs a schema object from the blockchain using its URI.
 * This function retrieves encoded schema data from the blockchain, decodes it, and constructs a structured
 * schema object.
 *
 * @param input - The raw input data in bytes, representing the encoded schema data on the blockchain.
 * @param schemaUri - The URI (`$id`) of the schema to be fetched, used to uniquely identify
 *                                     the schema on the blockchain.
 *
 * @returns The reconstructed schema object based on the blockchain data, adhering to the ISchema interface.
 *                    This object includes all the decoded properties and structure of the original schema.
 *
 * @throws {SDKErrors.SchemaError} Thrown when the input data cannot be decoded into a valid schema, or if the
 *                                 specified schema is not found on the blockchain. This error provides details
 *                                 about the nature of the decoding or retrieval issue.
 *
 * @internal
 */
function schemaInputFromChain(
  input: Bytes,
  schemaUri: ISchema['$id']
): ISchema {
  try {
    const base64Input = input.toUtf8()
    const binaryData = Buffer.from(base64Input, 'base64')

    const encoder = new Cbor.Encoder({ pack: true, useRecords: true })
    const decodedSchema = encoder.decode(binaryData)

    const reconstructedSchema: ISchema = {
      $id: schemaUri,
      ...decodedSchema,
    }
    // If throws if the input was a valid JSON but not a valid Schema.
    verifyDataStructure(reconstructedSchema)
    return reconstructedSchema
  } catch (cause) {
    throw new SDKErrors.SchemaError(
      `The provided payload cannot be parsed as a Schema: ${input.toHuman()}`,
      { cause }
    )
  }
}


/**
 * (Internal Function) - Converts a blockchain-encoded schema entry to a more readable and usable format.
 * This helper function is crucial within the schema retrieval process, particularly in the `fetchFromChain`
 * operation, where it translates schema data retrieved from the blockchain into a format suitable for
 * application use. It ensures the raw, encoded data from the blockchain is transformed into a format that
 * is compatible with the application's data structures.
 *
 * @param encodedEntry - The blockchain-encoded schema entry. It is
 *                       wrapped in an `Option` type to handle the possibility that the schema might not exist.
 * @param schemaUri - The URI (`$id`) of the schema being processed.
 *
 * @returns Returns an `ISchemaAccountsDetails` object containing the schema information
 *          if the schema exists on the blockchain. If the schema does not exist, it returns `null`.
 *
 * This function is vital for interpreting and converting blockchain-specific encoded schema data into
 * a structured and readable format, facilitating its use within the application.
 *
 * @internal
 */
function fromChain(
  encodedEntry: Option<PalletSchemaSchemaEntry>,
  schemaUri: ISchema['$id']
): ISchemaAccountsDetails | null {
  if (encodedEntry.isSome) {
    const unwrapped = encodedEntry.unwrap()
    const { schema, digest, creator } = unwrapped
    return {
      schema: schemaInputFromChain(schema, schemaUri),
      digest: digest.toHex() as SchemaDigest,

      // TODO: Check if there is any other way to do it.
      // Originally it is done as Did.fromChain(creator)
      creatorUri: `did:cord:3${creator}`,
    }
  }
  return null
}


/**
 * Retrieves schema details from the blockchain using a given schema ID. This function plays a crucial role
 * in accessing stored schemas within a blockchain environment. It queries the blockchain to fetch the schema
 * associated with the provided schema ID, facilitating the retrieval of schema information stored in an
 * immutable and secure manner.
 *
 * @param schemaUri - The unique identifier of the schema, formatted as a URI string.
 *        This ID is used to locate and retrieve the schema on the blockchain, ensuring accuracy in schema retrieval.
 *
 * @returns - A promise that resolves to the schema details (`ISchemaDetails`)
 *          if found on the blockchain. If the schema is not present, the promise resolves to `null`.
 *          This approach provides a straightforward method for accessing schema information by their unique identifiers.
 *
 * The function employs a `try-catch` block to handle any errors during the blockchain query process. If the
 * schema is not found or if an error occurs during fetching, appropriate exceptions are thrown to indicate
 * the issue.
 *
 * @throws {SDKErrors.SchemaError} - Thrown if the schema with the provided ID is not found on the blockchain,
 *         providing clarity in cases where the requested data is missing.
 * @throws {SDKErrors.CordFetchError} - Thrown in case of errors during the fetching process, such as network
 *         issues or problems with querying the blockchain.
 *
 * @example
 * ```typescript
 * async function getSchemaDetails(schemaUri: string) {
 *   try {
 *     const schemaDetails = await fetchFromChain(schemaUri);
 *     if (schemaDetails) {
 *       console.log('Fetched Schema Details:', schemaDetails);
 *     } else {
 *       console.log('Schema not found on the blockchain.');
 *     }
 *   } catch (error) {
 *     console.error('Error fetching schema:', error);
 *   }
 * }
 *
 * // Example usage
 * getSchemaDetails('your_schema_uri');
 * ```
 */
export async function fetchFromChain(
  schemaUri: ISchema['$id']
): Promise<ISchemaAccountsDetails | null> {
  try {
    const api = ConfigService.get('api')
    const cordSchemaId = uriToIdentifier(schemaUri)

    const schemaEntry = await api.query.schema.schemas(cordSchemaId)
    const decodedSchema = fromChain(schemaEntry, schemaUri)

    if (decodedSchema === null) {
      throw new SDKErrors.SchemaError(
        `There is not a Schema with the provided URI "${schemaUri}" on chain.`
      )
    }

    return decodedSchema
  } catch (error) {
    console.error('Error fetching schema from chain:', error)
    throw new SDKErrors.CordFetchError(
      `Error occurred while fetching schema from chain: ${error}`
    )
  }
}
