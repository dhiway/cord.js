/**
 * @packageDocumentation
 * @module Schema/Chain
 *
 * This file contains functions and types related to the interaction between the schema definitions and the blockchain.
 * It primarily deals with encoding and decoding schema data for blockchain storage and retrieval, as well as
 * validating and verifying schema integrity in the context of blockchain interactions.
 *
 * The `SchemaChain` module serves as a bridge between the schema definitions used within the application and their
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

import type { Bytes, Option, AccountId } from '@cord.network/types'
import type { PalletSchemaSchemaEntry } from '@cord.network/augment-api'
import {
  SchemaHash,
  DidUri,
  ISchema,
  SCHEMA_PREFIX,
  SCHEMA_IDENT,
  blake2AsHex,
  ISchemaDetails,
} from '@cord.network/types'

import { ConfigService } from '@cord.network/config'
import * as Did from '@cord.network/did'
import { SDKErrors } from '@cord.network/utils'
import { hashToUri, uriToIdentifier } from '@cord.network/identifier'
import { serializeForHash, verifyDataStructure } from './Schema.js'

/**
 * Generates a unique URI for a given schema based on its content and the creator's DID.
 * This URI serves as a unique identifier for the schema within the Cord network.
 *
 * @param schema - The schema object or a version of the schema object without the `$id` property.
 *                 This schema object is defined according to the ISchema interface.
 * @param creator - A decentralized identifier (DID) URI of the schema creator.
 *                  This DID should be a valid identifier within the Cord network.
 *
 * @returns A string representing the unique URI of the schema.
 *
 * The function operates as follows:
 * 1. Retrieves the network API configuration using `ConfigService.get('api')`.
 * 2. Serializes the schema object into a string format using `serializeForHash`.
 * 3. Encodes the serialized schema and the creator's DID into SCALE (Simple Concatenated Aggregate Little-Endian)
 *    format, which is a binary encoding format used in CORD.
 * 4. Concatenates the SCALE-encoded schema and creator DID and computes a BLAKE2 hash of the result.
 * 5. Converts the hash into a URI using the `Identifier.hashToUri` function, incorporating the schema identifier
 *    prefix and the schema identification number.
 *
 * This function is crucial for registering schemas on the Cord network, ensuring that each schema
 * can be uniquely identified and retrieved using its URI.
 */
export function getUriForSchema(
  schema: ISchema | Omit<ISchema, '$id'>,
  creator: DidUri
): ISchema['$id'] {
  const api = ConfigService.get('api')
  const serializedSchema = serializeForHash(schema)
  const scaleEncodedSchema = api
    .createType<Bytes>('Bytes', serializedSchema)
    .toU8a()
  const scaleEncodedCreator = api
    .createType<AccountId>('AccountId', Did.toChain(creator))
    .toU8a()
  const digest = blake2AsHex(
    Uint8Array.from([...scaleEncodedSchema, ...scaleEncodedCreator])
  )
  return hashToUri(digest, SCHEMA_IDENT, SCHEMA_PREFIX)
}

/**
 * Serializes a given schema for on-chain storage or interaction.
 * This function prepares the schema data in a format suitable for use with blockchain transactions.
 *
 * @param schema - The schema object defined according to the ISchema interface.
 *                 This schema object contains the structure and rules for data validation.
 *
 * @returns A string representing the serialized schema.
 */
export function toChain(schema: ISchema): string {
  return serializeForHash(schema)
}

/**
 * Reconstructs a schema object from its blockchain-encoded representation.
 * This function is used to convert the raw, encoded schema data retrieved from the blockchain into a structured schema object.
 *
 * @param input - The blockchain-encoded schema data, represented as a `Bytes` object.
 * @param schemaId - The identifier (`$id`) of the schema being processed.
 *
 * @returns A reconstructed `ISchema` object.
 *
 * The function operates as follows:
 * 1. Attempts to parse the `input` (encoded schema data) as a JSON object.
 *    - If the parsing fails, it indicates that the input is not valid JSON, and an error is thrown.
 * 2. Constructs the full schema identifier (`$id`) by combining the schema prefix with the provided `schemaId`.
 * 3. Creates a new `ISchema` object by merging the parsed JSON object with the reconstructed schema identifier.
 * 4. Validates the reconstructed schema object to ensure it conforms to the expected schema structure.
 *    - If the validation fails, it indicates that the parsed JSON is not a valid schema, and an error is thrown.
 * 5. Returns the validated and reconstructed `ISchema` object.
 *
 * This function is essential for decoding and validating schema data retrieved from the blockchain. It ensures that
 * the encoded data is not only a valid JSON but also conforms to the expected schema structure, making it usable
 * within the application.
 *
 * @throws `SchemaError` if the input cannot be parsed as a valid JSON or if it does not conform to the schema structure.
 *
 * @example
 * ```typescript
 * const encodedSchemaData = await api.query.schema.schemas(schemaId);
 * const schema = schemaInputFromChain(encodedSchemaData, schemaId);
 * console.log('Reconstructed Schema:', schema);
 * ```
 */
function schemaInputFromChain(input: Bytes, schemaId: ISchema['$id']): ISchema {
  try {
    // Throws on invalid JSON input. Schema is expected to be a valid JSON document.
    const reconstructedObject = JSON.parse(input.toUtf8())
    const reconstructedSchemaId = `${SCHEMA_PREFIX}${schemaId}`

    const reconstructedSchema: ISchema = {
      ...reconstructedObject,
      $id: reconstructedSchemaId,
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
 * Converts a blockchain-encoded schema entry to a more readable and usable format.
 * This function is used to interpret and translate schema data retrieved from the blockchain into a format
 * that can be easily used within the application.
 *
 * @param encodedEntry - The blockchain-encoded schema entry, wrapped in an `Option` type to handle
 *                       the possibility of non-existence.
 * @param schemaId - The identifier (`$id`) of the schema being processed.
 *
 * @returns An `ISchemaDetails` object if the schema exists on the blockchain, or `null` if it does not.
 *
 * The function operates as follows:
 * 1. Checks if the `encodedEntry` contains a value (i.e., if the schema exists on the blockchain).
 * 2. If it exists, unwraps the `Option` type to access the actual schema entry.
 * 3. Extracts the schema data, digest (hash), and creator information from the unwrapped entry.
 * 4. Converts the schema data from the blockchain format to a more usable format using `schemaInputFromChain`.
 * 5. Constructs and returns an `ISchemaDetails` object containing the readable schema, its hash, and the creator's DID.
 * 6. If the schema does not exist on the blockchain (i.e., `encodedEntry.isSome` is false), returns `null`.
 *
 * This function is crucial for retrieving and utilizing schema information from the blockchain. It ensures that
 * the raw, encoded data from the blockchain is transformed into a format that is consistent with the application's
 * data structures and is easy to work with.
 *
 * @example
 * ```typescript
 * const encodedEntry = await api.query.schema.schemas(schemaId);
 * const schemaDetails = fromChain(encodedEntry, schemaId);
 * if (schemaDetails) {
 *   console.log('Schema details:', schemaDetails);
 * } else {
 *   console.log('Schema not found on the blockchain.');
 * }
 * ```
 */
export function fromChain(
  encodedEntry: Option<PalletSchemaSchemaEntry>,
  schemaId: ISchema['$id']
): ISchemaDetails | null {
  if (encodedEntry.isSome) {
    const unwrapped = encodedEntry.unwrap()
    const { schema, digest, creator } = unwrapped
    return {
      schema: schemaInputFromChain(schema, schemaId),
      schemaHash: digest.toHex() as SchemaHash,
      creator: Did.fromChain(creator),
    }
  }
  return null
}

/**
 * Retrieves schema details from the blockchain using a given schema ID.
 * This function queries the blockchain to fetch the schema associated with the provided schema ID.
 *
 * @param schemaId - The unique identifier of the schema, formatted as a URI string.
 *                   This ID is used to locate the schema on the blockchain.
 *
 * @returns A promise that resolves to the schema details (`ISchemaDetails`) if found, or null if not found.
 *
 * The function operates as follows:
 * 1. Utilizes the `ConfigService` to access the blockchain API.
 * 2. Converts the schema URI to a blockchain-compatible identifier using `Identifier.uriToIdentifier`.
 * 3. Queries the blockchain for the schema using the `api.query.schema.schemas` method.
 * 4. Decodes the schema entry from the blockchain format to the application format using `fromChain`.
 * 5. If the schema is not found on the blockchain, it throws a `SchemaError`.
 *
 * @throws SDKErrors.SchemaError if the schema with the provided ID is not found on the blockchain.
 */
export async function fetchFromChain(
  schemaId: ISchema['$id']
): Promise<ISchemaDetails | null> {
  const api = ConfigService.get('api')
  const cordSchemaId = uriToIdentifier(schemaId)

  const schemaEntry = await api.query.schema.schemas(cordSchemaId)
  const decodedSchema = fromChain(schemaEntry, schemaId)
  if (decodedSchema === null) {
    throw new SDKErrors.SchemaError(
      `There is not a Schema with the provided ID "${schemaId}" on chain.`
    )
  }

  return decodedSchema
}

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
  const api = ConfigService.get('api')
  const identifier = uriToIdentifier(schema.$id)
  const encoded = await api.query.schema.schemas(identifier)

  return !encoded.isNone
}
