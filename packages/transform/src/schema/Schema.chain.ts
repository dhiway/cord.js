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

import type {
  Bytes,
  Option,
  AccountId,
  CordKeyringPair,
  SignExtrinsicCallback,
  HexString,
} from '@cord.network/types'
import type { PalletSchemaSchemaEntry } from '@cord.network/augment-api'
import {
  SchemaHash,
  DidUri,
  ISchema,
  SCHEMA_PREFIX,
  SCHEMA_IDENT,
  blake2AsHex,
  ISchemaDetails,
  SchemaId,
} from '@cord.network/types'

import { ConfigService } from '@cord.network/config'
import { Chain } from '@cord.network/network'
import * as Did from '@cord.network/did'
import { SDKErrors, Cbor, Crypto } from '@cord.network/utils'
import { hashToUri, uriToIdentifier } from '@cord.network/identifier'
import { encodeCborSchema, verifyDataStructure } from './Schema.js'

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
): { uri: ISchema['$id']; digest: HexString } {
  const api = ConfigService.get('api')
  const serializedSchema = encodeCborSchema(schema)
  const digest = Crypto.hashStr(serializedSchema)

  const scaleEncodedSchema = api
    .createType<Bytes>('Bytes', serializedSchema)
    .toU8a()
  const scaleEncodedCreator = api
    .createType<AccountId>('AccountId', Did.toChain(creator))
    .toU8a()
  const IdDigest = blake2AsHex(
    Uint8Array.from([...scaleEncodedSchema, ...scaleEncodedCreator])
  )
  const schemaUri = hashToUri(IdDigest, SCHEMA_IDENT, SCHEMA_PREFIX)

  return { uri: schemaUri, digest }
}

// /**
//  * Serializes a given schema for on-chain storage or interaction.
//  * This function prepares the schema data in a format suitable for use with blockchain transactions.
//  *
//  * @param schema - The schema object defined according to the ISchema interface.
//  *                 This schema object contains the structure and rules for data validation.
//  *
//  * @returns A string representing the serialized schema.
//  */
// export function toChain(schema: ISchema): string {
//   return serializeForHash(schema)
// }

/**
 * @param schema
 * @param authorAccount
 * @param creator
 * @param signCallback
 */
export async function storeSchema(
  schema: ISchema,
  authorAccount: CordKeyringPair,
  creator: DidUri,
  signCallback: SignExtrinsicCallback
): Promise<SchemaId> {
  const api = ConfigService.get('api')

  const exists = await isSchemaStored(schema)
  if (exists) {
    return schema.$id
  }

  const encodedSchema = encodeCborSchema(schema)
  const tx = api.tx.schema.create(encodedSchema)
  const extrinsic = await Did.authorizeTx(
    creator,
    tx,
    signCallback,
    authorAccount.address
  )

  await Chain.signAndSubmitTx(extrinsic, authorAccount)

  return schema.$id
}

/**
 * Fetches and reconstructs a schema object from the blockchain using its URI.
 * This function retrieves schema data that has been encoded and stored on the blockchain,
 * decodes it, and constructs a structured schema object.
 *
 * @param input
 * @param schemaUri - The URI (`$id`) of the schema to be fetched.
 *
 * @returns A Promise that resolves to an `ISchemaDetails` object representing the schema details.
 *          If the schema is not found on the blockchain, the function throws an error.
 *
 * The function operates as follows:
 * 1. Initializes the blockchain API connection using the `ConfigService`.
 * 2. Converts the `schemaUri` to a blockchain-specific identifier.
 * 3. Queries the blockchain for the schema data associated with the identifier.
 * 4. Invokes a private function `schemaInputFromChain` to decode the retrieved schema data
 *    from its blockchain-encoded representation to a structured `ISchema` object.
 * 5. Validates and returns the decoded `ISchemaDetails` object.
 *    - If no schema is found with the provided URI, or if decoding/validation fails,
 *      an error is thrown indicating the issue.
 *
 * This function is essential for interacting with the blockchain to retrieve and decode
 * schema data. It abstracts the complexities of blockchain communication and data decoding,
 * providing a straightforward interface for accessing schema information.
 *
 * @throws `SchemaError` if the schema is not found on the blockchain or if there is an issue
 *         with decoding or validating the schema.
 *
 * @example
 * ```typescript
 * try {
 *   const schemaUri = 'your_schema_uri';
 *   const schemaDetails = await fetchFromChain(schemaUri);
 *   console.log('Fetched Schema Details:', schemaDetails);
 * } catch (error) {
 *   console.error(error);
 * }
 * ```
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

    console.log(decodedSchema)
    // const reconstructedSchemaId = `${SCHEMA_PREFIX}${schemaId}`
    const reconstructedSchema: ISchema = {
      $id: schemaUri,
      ...decodedSchema,
    }
    console.log(reconstructedSchema)
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
 * This helper function is used within `fetchFromChain` to interpret and translate schema data
 * retrieved from the blockchain into a format that can be easily used within the application.
 *
 * @param encodedEntry - The blockchain-encoded schema entry, wrapped in an `Option` type to handle
 *                       the possibility of non-existence.
 * @param schemaUri - The URI (`$id`) of the schema being processed.
 *
 * @returns An `ISchemaDetails` object if the schema exists on the blockchain, or `null` if it does not.
 *
 * The function operates as follows:
 * 1. Checks if the `encodedEntry` contains a value (i.e., if the schema exists on the blockchain).
 *    - If `encodedEntry.isSome` is true, it proceeds with processing the entry.
 *    - If false, it indicates the schema does not exist on the blockchain, and the function returns `null`.
 * 2. Unwraps the `Option` type to access the actual schema entry.
 * 3. Extracts the schema data, digest (hash), and creator information from the unwrapped entry.
 * 4. Utilizes the private function `schemaInputFromChain` to convert the schema data from the blockchain format
 *    to a structured `ISchema` object using the provided `schemaUri`.
 * 5. Constructs and returns an `ISchemaDetails` object containing the decoded schema, its hash, and the creator's DID.
 *
 * This function plays a critical role in `fetchFromChain` by ensuring that the raw, encoded data from the blockchain
 * is transformed into a format that aligns with the application's data structures and is easy to work with.
 *
 * @example
 * ```typescript
 * const encodedEntry = await api.query.schema.schemas(schemaUri);
 * const schemaDetails = fromChain(encodedEntry, schemaUri);
 * if (schemaDetails) {
 *   console.log('Schema details:', schemaDetails);
 * } else {
 *   console.log('Schema not found on the blockchain.');
 * }
 * ```
 */
function fromChain(
  encodedEntry: Option<PalletSchemaSchemaEntry>,
  schemaUri: ISchema['$id']
): ISchemaDetails | null {
  if (encodedEntry.isSome) {
    const unwrapped = encodedEntry.unwrap()
    const { schema, digest, creator } = unwrapped
    return {
      schema: schemaInputFromChain(schema, schemaUri),
      digest: digest.toHex() as SchemaHash,
      creator: Did.fromChain(creator),
    }
  }
  return null
}

/**
 * Retrieves schema details from the blockchain using a given schema ID.
 * This function queries the blockchain to fetch the schema associated with the provided schema ID.
 *
 * @param schemaUri - The unique identifier of the schema, formatted as a URI string.
 *                    This ID is used to locate the schema on the blockchain.
 *
 * @returns A promise that resolves to the schema details (`ISchemaDetails`) if found, or null if not found.
 *
 * The function operates as follows:
 * 1. Utilizes the `ConfigService` to access the blockchain API.
 *    - This service provides the necessary configuration and API connection to interact with the blockchain.
 * 2. Converts the schema URI to a blockchain-compatible identifier using `Identifier.uriToIdentifier`.
 *    - This step is essential to translate the schema URI into a format recognized by the blockchain.
 * 3. Queries the blockchain for the schema using the `api.query.schema.schemas` method.
 *    - This blockchain query retrieves the raw, encoded schema data associated with the given identifier.
 * 4. Decodes the schema entry from the blockchain format to the application format using `fromChain`.
 *    - The `fromChain` helper function is responsible for decoding the blockchain-encoded data into a structured `ISchema` object.
 *    - It ensures the schema data is not only valid but also conforms to the expected structure for use within the application.
 * 5. If the schema is not found on the blockchain, it throws a `SchemaError`.
 *    - This error handling provides clear feedback when a requested schema does not exist on the blockchain, helping to avoid data inconsistency issues.
 *
 * @throws SDKErrors.SchemaError if the schema with the provided ID is not found on the blockchain.
 * @example
 * ```typescript
 * try {
 *   const schemaUri = 'your_schema_uri';
 *   const schemaDetails = await fetchFromChain(schemaUri);s
 *   console.log('Fetched Schema Details:', schemaDetails);
 * } catch (error) {
 *   console.error('Error fetching schema:', error);
 * }
 * ```
 */
export async function fetchFromChain(
  schemaUri: ISchema['$id']
): Promise<ISchemaDetails | null> {
  const api = ConfigService.get('api')
  const cordSchemaId = uriToIdentifier(schemaUri)

  const schemaEntry = await api.query.schema.schemas(cordSchemaId)
  const decodedSchema = fromChain(schemaEntry, schemaUri)
  if (decodedSchema === null) {
    throw new SDKErrors.SchemaError(
      `There is not a Schema with the provided ID "${schemaUri}" on chain.`
    )
  }

  return decodedSchema
}
