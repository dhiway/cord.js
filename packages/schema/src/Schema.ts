/**
 * @packageDocumentation
 * @module Schema
 * @preferred
 *
 * This module provides functionalities for defining, validating, and manipulating
 * schemas within the Cord network with account based ops. It includes a set of interfaces, types, and functions
 * that collectively enable the creation, verification, and management of structured
 * data schemas. These schemas are used to ensure data consistency, integrity, and
 * compliance with predefined formats across the network.
 *
 * Key Features:
 * - Schema Definition: Define the structure of data using a set of predefined types
 *   and interfaces, including support for nested objects, arrays, and references.
 * - Schema Validation: Validate data objects against defined schemas to ensure they
 *   meet the required structure and data types, enhancing data integrity and reliability.
 * - Schema Serialization: Convert schema definitions into serialized formats for
 *   storage or transmission, and deserialize them back into structured objects.
 * - Schema Versioning: Manage different versions of schemas, allowing for backward
 *   compatibility and evolution of data structures over time.
 * - Nested Schema Support: Handle complex data structures with nested schemas,
 *   enabling the representation of intricate data models.
 *
 * Example:
 * ```
 * import { ISchema, fromProperties } from './SchemaAccounts';
 *
 * // Define a simple schema
 * const userSchema = fromProperties(
 *   'UserSchema',
 *   {
 *     name: { type: 'string' },
 *     age: { type: 'integer' },
 *   },
 *   ['name', 'age'],
 *   'creatorId'
 * );
 *
 * // Validate an object against the schema
 * try {
 *   verifyObjectAgainstSchema({ name: 'Alice', age: 30 }, userSchema);
 *   console.log('Validation successful');
 * } catch (error) {
 *   console.error('Validation failed', error);
 * }
 * ```
 *
 * This module is a cornerstone in ensuring that data transformation using te SDK is
 * structured, reliable, and adheres to defined standards, thereby facilitating
 * consistent and predictable interactions across the network.
 */

import type {
  ISchema,
  ISchemaAccountsDetails,
  ISchemaMetadata,
  SchemaDigest,
  DidUri,
} from '@cord.network/types'
import {
  Crypto,
  JsonSchema,
  SDKErrors,
  jsonabc,
  Cbor,
} from '@cord.network/utils'
import { SchemaModel, MetadataModel, SchemaModelV1 } from './Schema.types.js'
import { getUriForSchema } from './Schema.chain.js'


/**
 * (Internal Function) - Serializes a given schema object using CBOR encoding for consistent
 * hashing, comparison, or storage. This ensures a standardized representation by ignoring
 * the `$id` field (if present) and sorting the schema properties deterministically.
 *
 * ### Functionality:
 * - **Removes `$id`**: Strips the `$id` field from the schema to ensure consistent serialization.
 * - **Sorts properties**: Uses a deterministic sorting algorithm to guarantee the same encoding
 *   for logically identical schemas, crucial for hashing.
 * - **CBOR Encoding**: Encodes the sorted schema in CBOR (Concise Binary Object Representation),
 *   a compact binary format suitable for storage and transmission.
 * - **Base64 Conversion**: Converts the encoded schema to a Base64 string, facilitating
 *   storage, transmission, and hashing.
 *
 * ### Parameters:
 * @param schema - The schema object to be serialized. It can include or exclude the `$id` field,
 *                 as this field is ignored during serialization for consistency.
 *
 * ### Returns:
 * @returns A Base64 string representing the serialized CBOR encoding of the schema (without the `$id` field).
 *          This string can be used for hashing, comparison, or storage.
 *
 * ### Example Usage:
 * ```typescript
 * const schema = {
 *   title: 'Example Schema',
 *   properties: { name: { type: 'string' }, age: { type: 'number' } },
 *   $id: 'schema-id'
 * };
 *
 * const encodedSchema = encodeCborSchema(schema);
 * console.log('Encoded CBOR Schema:', encodedSchema);
 * ```
 *
 * ### Internal Usage:
 * This function is primarily intended for internal use, where schema objects need to be hashed
 * or compared without being affected by non-functional fields like `$id`.
 */
export function encodeCborSchema(
  schema: ISchema | Omit<ISchema, '$id'>
): string {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { $id, ...schemaWithoutId } = schema as ISchema
  const sortedSchema = jsonabc.sortObj(schemaWithoutId)

  const encoder = new Cbor.Encoder({ pack: true, useRecords: true })

  const encodedSchema = encoder.encode(sortedSchema)
  const cborSchema = encodedSchema.toString('base64')

  return cborSchema
}


/**
 * (Internal Function) - Generates a hash for a given schema object.
 *
 * This function is used to create a unique hash value for a schema. It first serializes
 * the schema object (excluding the `$id` property if present) and then generates a hash
 * from this serialized string.
 *
 * @internal
 * @param schema - The schema object to be hashed.
 *   This can be a full schema object (including `$id`) or any schema object without `$id`.
 * @returns - The hash value of the schema as a hexadecimal string.
 */
export function getHashForSchema(
  schema: ISchema | Omit<ISchema, '$id'>
): SchemaDigest {
  const encodedSchema = encodeCborSchema(schema)
  return Crypto.hashStr(encodedSchema)
}


/**
 * (Internal Function) - Validates an incoming schema object against a JSON schema model (draft-07).
 *
 * This function takes an object and a JSON schema, then uses a JSON Schema Validator
 * to determine if the object conforms to the schema. It supports validation against
 * complex schemas that may include references to other schemas. If the object does not
 * conform to the schema, the function throws an error with details about the validation
 * failures.
 *
 * @param object - The object to be validated against the schema.
 * @param schema - The JSON schema to validate the object against.
 * @param [messages] - An optional array to store error messages. If provided,
 *   validation errors will be pushed into this array.
 * @param [referencedSchemas] - An optional array of additional schemas
 *   that might be referenced in the main schema. This is useful for complex schemas that
 *   include references to other schemas.
 * @throws {SDKErrors.ObjectUnverifiableError} - Throws an error if the object does not
 *   conform to the schema. The error includes details about the validation failures.
 *
 * @internal
 */
export function verifyObjectAgainstSchema(
  object: Record<string, any>,
  schema: JsonSchema.Schema,
  messages?: string[],
  referencedSchemas?: JsonSchema.Schema[]
): void {
  const validator = new JsonSchema.Validator(schema, '7', false)

  if (referencedSchemas) {
    referencedSchemas.forEach((i) => validator.addSchema(i))
  }
  const { valid, errors } = validator.validate(object)
  if (valid === true) return
  if (messages) {
    errors.forEach((error) => {
      messages.push(error.error)
    })
  }
  throw new SDKErrors.ObjectUnverifiableError(
    'JSON schema verification failed for object',
    { cause: errors }
  )
}


// /**
//  * (Internal Function) - Validates the contents of a document against a specified schema.
//  *
//  * This function is designed to ensure that the contents of a document conform to a
//  * predefined schema. It performs two key validations: first, it validates the schema
//  * itself against a standard schema model to ensure the schema's structure is correct;
//  * second, it validates the actual contents of the document against the provided schema.
//  *
//  * @param contents - The contents of the document to be validated.
//  *   This is typically a JSON object representing the data structure of the document.
//  * @param schema - The schema against which the document's contents are to be validated.
//  *   This schema defines the expected structure, types, and constraints of the document's contents.
//  * @param [messages] - An optional array to store error messages. If provided,
//  *   validation errors will be pushed into this array.
//  * @throws {SDKErrors.ObjectUnverifiableError} - Throws an error if the schema itself is invalid
//  *   or if the document's contents do not conform to the schema. The error includes details
//  *   about the validation failures.
//  *
//  * @internal
//  */
// export function verifyContentAgainstSchema(
//   contents: string,
//   schema: ISchema,
//   messages?: string[]
// ): void {
//   verifyObjectAgainstSchema(schema, SchemaModel, messages)
//   verifyObjectAgainstSchema(contents, schema, messages)
// }


/**
 * (Internal Function) - Validates the structure and identifier of a schema to ensure consistency
 * and correctness within the Cord network.
 *
 * ### Functionality:
 * 1. **Schema Structure Validation**: The function checks that the provided schema conforms to the
 *    expected format as defined by `SchemaModel`. This ensures the schema's structure adheres to
 *    required standards.
 * 2. **Identifier Validation**: The schema's `$id` (identifier) is verified against a URI generated
 *    using the schema's content, the creator's DID, and the space identifier. This ensures the uniqueness
 *    and correctness of the schema’s identifier within the network.
 *
 * ### Parameters:
 * @param input - The schema object to validate. It must comply with the `ISchema` interface
 *                structure, including a valid `$id` property.
 * @param creator - The decentralized identifier (DID) of the schema's creator. This DID
 *                  contributes to the URI generation, ensuring traceability of the creator.
 *
 * ### Throws:
 * @throws {SDKErrors.SchemaIdMismatchError} - If the actual `$id` of the schema does not match the
 *         expected URI generated using the schema's content, creator's DID, and space identifier.
 *         This error ensures the schema’s identifier is accurate and prevents conflicts in schema
 *         identification.
 *
 * ### Example Usage:
 * ```typescript
 * try {
 *   verifySchemaStructure(schemaObject);
 *   console.log('Schema is valid and consistent.');
 * } catch (error) {
 *   console.error('Schema validation failed:', error);
 * }
 * ```
 *
 * ### Internal Usage:
 * This function plays a critical role in maintaining data integrity and preventing inconsistencies
 * in schema management by ensuring that every schema’s identifier is correctly derived from its content
 * and metadata.
 */
export function verifySchemaStructure(
  input: ISchema,
): void {
  verifyObjectAgainstSchema(input, SchemaModel)
  const uriFromSchema = getUriForSchema(input)
  if (uriFromSchema.uri !== input.$id) {
    throw new SDKErrors.SchemaIdMismatchError(uriFromSchema.uri, input.$id)
  }
}


/**
 * (Internal Function) - Validates the structure of a given data input against a predefined schema model.
 *
 * @param input - The data input to be validated. This input should be structured
 *   according to the ISchema interface, which defines the expected format and rules for the data.
 * @throws {SDKErrors.ObjectUnverifiableError} - Throws an error if the data input does not
 *   conform to the schema model. This error includes details about the specific validation
 *   failures, aiding in diagnosing and correcting the structure of the input.
 *
 * @internal
 */
export function verifyDataStructure(input: ISchema): void {
  verifyObjectAgainstSchema(input, SchemaModel)
}


/**
 * (Internal Function) - Validates the metadata of a schema against a predefined metadata model. This function
 * ensures that the metadata associated with a schema adheres to specific standards and
 * formats as defined in the MetadataModel.
 *
 * @param metadata - The metadata object associated with a schema. This
 *   object contains various metadata fields (like title, description, etc.) that provide
 *   additional context and information about the schema.
 * @throws {SDKErrors.ObjectUnverifiableError} - Throws an error if the metadata does not
 *   conform to the MetadataModel. This error includes details about the specific validation
 *   failures, which helps in identifying and correcting issues in the metadata structure.
 *
 * @internal
 */
export function verifySchemaMetadata(metadata: ISchemaMetadata): void {
  verifyObjectAgainstSchema(metadata, MetadataModel)
}


/**
 * Constructs a schema object from specified properties, assigning unique identifiers and ensuring
 * compliance with schema standards. This function simplifies schema creation by generating a structured
 * schema with the appropriate metadata, making it ready for use in validation, storage, or transmission.
 *
 * ### Functionality:
 * 1. **Schema Creation and Metadata Assignment**: The input properties are used to construct the schema object,
 *    with additional metadata like `$schema` and `additionalProperties` flags set according to `SchemaModelV1`.
 * 2. **URI and Digest Generation**: A unique URI and digest are computed for the schema content using `getUriForSchema`.
 *    This ensures the schema is uniquely identifiable and tamper-proof.
 * 3. **DID-based Traceability**: The creator's address is converted into a DID-compliant URI (`did:cord:3<address>`),
 *    facilitating traceability.
 * 4. **Schema Verification**: The constructed schema is verified for structure and consistency using `verifySchemaStructure`.
 *
 * ### Parameters:
 * @param schema - An object defining the structure, properties, and constraints of the schema. It
 *                 conforms to the `ISchema` interface and serves as the foundation for the final schema object.
 * @param creatorAddress - The blockchain address of the schema's creator. This address is formatted into
 *                         a DID URI, ensuring the creator's identity is associated with the schema.
 *
 * ### Returns:
 * @returns {ISchemaAccountsDetails} - An object containing:
 * - **schema**: The finalized schema object, including all properties, constraints, and a unique URI.
 * - **digest**: A cryptographic digest of the schema, ensuring data integrity.
 * - **creatorUri**: The creator's DID URI, enabling identity tracking.
 *
 * ### Throws:
 * @throws {SDKErrors.SchemaStructureError} - If the constructed schema does not meet the required standards or structure,
 *         ensuring integrity and compliance.
 *
 * ### Example Usage:
 * ```typescript
 * const properties = {
 *   title: 'Person',
 *   type: 'object',
 *   properties: {
 *     name: { type: 'string' },
 *     age: { type: 'integer' },
 *   },
 *   required: ['name']
 * };
 * const creatorAddress = '5F3sa2TJ...';  // Example address
 *
 * try {
 *   const { schema, digest, creatorUri } = buildFromProperties(properties, creatorAddress);
 *   console.log('Constructed Schema:', schema);
 *   console.log('Schema Digest:', digest);
 *   console.log('Creator URI:', creatorUri);
 * } catch (error) {
 *   console.error('Error constructing schema:', error);
 * }
 * ```
 *
 * ### Internal Logic:
 * 1. **Setting Schema Metadata**: Ensures `additionalProperties` is false and `$schema` points to `SchemaModelV1`.
 * 2. **Generating URI and Digest**: Uses `getUriForSchema` to derive the URI and digest.
 * 3. **Verifying Schema**: Calls `verifySchemaStructure` to ensure the schema’s correctness.
 */
export function buildFromProperties(
  schema: ISchema,
  creatorAddress: string
): ISchemaAccountsDetails {
  const { $id, ...uriSchema } = schema;

  uriSchema.additionalProperties = false;
  uriSchema.$schema = SchemaModelV1.$id;

  const { uri, digest } = getUriForSchema(uriSchema);

  const schemaType = {
    $id: uri,
    ...uriSchema,
  }

  const creatorUri = `did:cord:3${creatorAddress}` as DidUri;

  const schemaDetails: ISchemaAccountsDetails = {
    schema: schemaType,
    digest,
    creatorUri,
  }

  verifySchemaStructure(schemaType);
  return schemaDetails
}


/**
 * (Internal Helper Function) - Determines whether a given input conforms to the ISchema interface. This function
 * serves as a type guard, verifying if the input structure aligns with the expected
 * schema structure defined by ISchema.
 *
 * @param input - The input to be checked. This is an unknown type, which
 *   allows the function to be used in a variety of contexts where the type of the input
 *   is not predetermined.
 * @returns - Returns true if the input conforms to the ISchema interface,
 *   indicating that it has the expected structure and properties of a schema. Returns
 *   false otherwise.
 *
 * @internal
 */
export function isISchema(input: unknown): input is ISchema {
  try {
    verifyDataStructure(input as ISchema)
  } catch (error) {
    return false
  }
  return true
}
