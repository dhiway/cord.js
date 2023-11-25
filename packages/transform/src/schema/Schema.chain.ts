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
  AuthorizationId,
  SpaceId,
  SchemaUri,
} from '@cord.network/types'
import type { PalletSchemaSchemaEntry } from '@cord.network/augment-api'
import {
  SchemaDigest,
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
import { SDKErrors, Cbor, Crypto, DecoderUtils } from '@cord.network/utils'
import {
  hashToUri,
  uriToIdentifier,
  identifierToUri,
} from '@cord.network/identifier'
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
 * (Internal Function) - Generates a unique URI for a given schema based on its content, the creator's DID, and the associated space.
 * This URI serves as a unique identifier for the schema within the Cord network.
 *
 * The function utilizes the content of the schema, the creator's DID, and the space identifier to produce a unique identifier.
 * This process is crucial to ensure that each schema can be uniquely identified and retrieved within the Cord network, providing
 * a consistent and reliable way to access schema data.
 *
 * @param schema - The schema object or a version of the schema object without the `$id` property.
 *                 The schema object should conform to the ISchema interface.
 * @param creator - A decentralized identifier (DID) URI of the schema creator. This DID should be a valid identifier within the Cord network.
 * @param space - An identifier for the space (context or category) to which the schema belongs. This helps in categorizing
 *                 and organizing schemas within the network.
 *
 * @returns An object containing the schema's unique URI and its digest. The `uri` is a string representing
 *          the unique URI of the schema, and `digest` is a cryptographic hash of the schema, space identifier, and creator's DID.
 *
 * This function is integral to the process of registering schemas on the Cord network, ensuring unique identification and retrievability
 * of each schema using its URI.
 *
 * @internal
 * @throws {Error} Throws an error if the URI generation process fails, indicating an issue with schema data, space, or creator's DID.
 */
export function getUriForSchema(
  schema: ISchema | Omit<ISchema, '$id'>,
  creator: DidUri,
  space: SpaceId
): { uri: SchemaUri; digest: SchemaDigest } {
  const api = ConfigService.get('api')
  const serializedSchema = encodeCborSchema(schema)
  const digest = Crypto.hashStr(serializedSchema)

  const scaleEncodedSchema = api
    .createType<Bytes>('Bytes', serializedSchema)
    .toU8a()
  const scaleEncodedSpace = api
    .createType<Bytes>('Bytes', uriToIdentifier(space))
    .toU8a()
  const scaleEncodedCreator = api
    .createType<AccountId>('AccountId', Did.toChain(creator))
    .toU8a()
  const IdDigest = blake2AsHex(
    Uint8Array.from([
      ...scaleEncodedSchema,
      ...scaleEncodedSpace,
      ...scaleEncodedCreator,
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
 * Dispatches a schema to the blockchain for storage and tracking. This function handles
 * the submission of a schema object to the blockchain, ensuring its uniqueness, immutability,
 * and verifiability in a decentralized environment. It involves encoding the schema, signing
 * the transaction using the author's blockchain account, and employing the creator's DID for
 * identity verification. The function also requires an authorization ID for transaction
 * permissioning and a callback function for signing the transaction (extrinsic).
 *
 * @param schema - The schema object, typically representing a structured data format
 *        defining data requirements.
 * @param creator - The decentralized identifier (DID) URI representing the digital
 *        identity of the creator.
 * @param authorAccount - The blockchain account of the author, used for.
 * @param authorization - A unique identifier for authorization purposes,
 *        authenticating and signing the transaction.
 *        often associated with specific permissions.
 * @param signCallback - A callback function that handles the signing
 *        of the blockchain transaction (extrinsic).
 * @returns A promise that resolves to the unique ID of the dispatched schema
 *          upon successful processing by the blockchain.
 *
 * The function employs a try-catch block to handle potential errors during the dispatch process,
 * such as issues with transaction creation or network failures. In case of an error, it throws
 * an informative exception.
 *
 * @example
 * ```typescript
 * async function exampleSchemaDispatch() {
 *   // Initialize schema data and necessary parameters
 *   const schema = { schema data };
 *   const authorAccount = { author's blockchain account };
 *   const creator = 'did:cord:example';
 *   const authorization = 'authorization-id';
 *   const signCallback = (tx: any) => { /* signing logic };
 *
 *   try {
 *     const schemaId = await dispatchToChain(schema, authorAccount, creator, authorization, signCallback);
 *     console.log('Schema dispatched with ID:', schemaId);
 *   } catch (error) {
 *     console.error('Error dispatching schema:', error);
 *   }
 * }
 *
 * // Example usage
 * exampleSchemaDispatch();
 * ```
 */
export async function dispatchToChain(
  schema: ISchema,
  creator: DidUri,
  authorAccount: CordKeyringPair,
  authorization: AuthorizationId,
  signCallback: SignExtrinsicCallback
): Promise<SchemaId> {
  try {
    const api = ConfigService.get('api')

    const exists = await isSchemaStored(schema)
    if (exists) {
      return schema.$id
    }

    const authorizationId = uriToIdentifier(authorization)

    const encodedSchema = encodeCborSchema(schema)
    const tx = api.tx.schema.create(encodedSchema, authorizationId)
    const extrinsic = await Did.authorizeTx(
      creator,
      tx,
      signCallback,
      authorAccount.address
    )

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
 * @returns Returns an `ISchemaDetails` object containing the schema information
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
): ISchemaDetails | null {
  if (encodedEntry.isSome) {
    const unwrapped = encodedEntry.unwrap()
    const { schema, digest, creator, space } = unwrapped
    return {
      schema: schemaInputFromChain(schema, schemaUri),
      digest: digest.toHex() as SchemaDigest,
      spaceUri: identifierToUri(DecoderUtils.hexToString(space.toString())),
      creatorUri: Did.fromChain(creator),
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
): Promise<ISchemaDetails | null> {
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
