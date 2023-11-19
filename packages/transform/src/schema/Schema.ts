/**
 * @packageDocumentation
 * @module Schema
 * @preferred
 *
 * This module provides functionalities for defining, validating, and manipulating
 * schemas within the Cord network. It includes a set of interfaces, types, and functions
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
 * import { ISchema, fromProperties } from './Schema';
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
  DidUri,
  HexString,
  IContent,
  ISchema,
  ISchemaMetadata,
  SchemaHash,
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
 * Serializes a given schema object for hashing or storing using CBOR encoding.
 *
 * This function is designed to standardize the representation of a schema object by
 * removing its `$id` property, if present, and then serializing it. This standardized
 * serialization is crucial for consistent hashing and comparison of schema objects,
 * as it ensures that the serialization output is not affected by the presence or
 * absence of an `$id` property. The serialization is done using CBOR (Concise Binary
 * Object Representation) encoding, which is a compact and efficient binary format.
 *
 * The process includes sorting the properties of the schema to ensure a deterministic
 * order, which is essential for consistent hashing. The sorted schema is then encoded
 * into a CBOR format and converted to a base64 string to facilitate easy storage and
 * transmission.
 *
 * @param schema - The schema object to be serialized. The schema can either include
 *   the `$id` property or be any schema object without `$id`. The `$id` property is
 *   disregarded during serialization to ensure consistency.
 * @returns - A base64 string representing the serialized CBOR encoding of the schema
 *   without the `$id` property. This string can be used for hashing, comparison, or
 *   storage.
 *
 * @example
 * ```typescript
 * const schema = { $id: 'schema:example', title: 'Example Schema', ... };
 * const serializedSchema = encodeCborSchema(schema);
 * console.log('Serialized Schema:', serializedSchema);
 * ```
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
 * Generates a hash for a given schema object.
 *
 * This function is used to create a unique hash value for a schema. It first serializes
 * the schema object (excluding the `$id` property if present) and then generates a hash
 * from this serialized string.
 *
 * @param schema - The schema object to be hashed.
 *   This can be a full schema object (including `$id`) or any schema object without `$id`.
 * @returns - The hash value of the schema as a hexadecimal string.
 */
export function getHashForSchema(
  schema: ISchema | Omit<ISchema, '$id'>
): SchemaHash {
  const encodedSchema = encodeCborSchema(schema)
  return Crypto.hashStr(encodedSchema)
}

/**
 * Validates an incoming schema object against a JSON schema model (draft-07).
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

/**
 * Validates the contents of a document against a specified schema.
 *
 * This function is designed to ensure that the contents of a document conform to a
 * predefined schema. It performs two key validations: first, it validates the schema
 * itself against a standard schema model to ensure the schema's structure is correct;
 * second, it validates the actual contents of the document against the provided schema.
 *
 * @param contents - The contents of the document to be validated.
 *   This is typically a JSON object representing the data structure of the document.
 * @param schema - The schema against which the document's contents are to be validated.
 *   This schema defines the expected structure, types, and constraints of the document's contents.
 * @param [messages] - An optional array to store error messages. If provided,
 *   validation errors will be pushed into this array.
 * @throws {SDKErrors.ObjectUnverifiableError} - Throws an error if the schema itself is invalid
 *   or if the document's contents do not conform to the schema. The error includes details
 *   about the validation failures.
 */
export function verifyContentAgainstSchema(
  contents: IContent['contents'],
  schema: ISchema,
  messages?: string[]
): void {
  verifyObjectAgainstSchema(schema, SchemaModel, messages)
  verifyObjectAgainstSchema(contents, schema, messages)
}

/**
 * Validates the structure of a given schema and checks for consistency in its identifier.
 *
 * This function serves two primary purposes: firstly, it validates the structure of the
 * provided schema against a predefined schema model, ensuring that the schema adheres to
 * the expected format and rules. Secondly, it verifies that the schema's identifier ($id)
 * is consistent with the expected identifier derived from the schema content and the creator's DID.
 *
 * @param input - The schema to be validated. This schema should conform to
 *   the structure defined by the ISchema interface.
 * @param creator - The decentralized identifier (DID) of the creator of the schema.
 *   This DID is used in generating the expected schema identifier for comparison.
 * @throws {SDKErrors.SchemaIdMismatchError} - Throws an error if the actual schema identifier
 *   does not match the expected identifier derived from the schema content and creator's DID.
 *   This ensures that the schema's identifier is both unique and correctly formatted.
 */
export function verifySchemaStructure(input: ISchema, creator: DidUri): void {
  verifyObjectAgainstSchema(input, SchemaModel)
  const uriFromSchema = getUriForSchema(input, creator)
  if (uriFromSchema.uri !== input.$id) {
    throw new SDKErrors.SchemaIdMismatchError(uriFromSchema.uri, input.$id)
  }
}

/**
 * Validates the structure of a given data input against a predefined schema model.
 *
 * @param input - The data input to be validated. This input should be structured
 *   according to the ISchema interface, which defines the expected format and rules for the data.
 * @throws {SDKErrors.ObjectUnverifiableError} - Throws an error if the data input does not
 *   conform to the schema model. This error includes details about the specific validation
 *   failures, aiding in diagnosing and correcting the structure of the input.
 */
export function verifyDataStructure(input: ISchema): void {
  verifyObjectAgainstSchema(input, SchemaModel)
}

/**
 * Validates the structure and content of a given data object against a primary schema and
 * a set of nested schemas. This function is essential for scenarios where data validation
 * needs to occur against multiple layers of schemas, ensuring both the top-level and
 * nested structures conform to their respective specifications.
 *
 * @param schema - The primary schema against which the top-level structure of
 *   the data object is validated. This schema defines the overall structure and rules
 *   that the data object must adhere to.
 * @param nestedSchemas - An array of nested schemas for validating the
 *   deeper structures within the data object. Each nested schema corresponds to a
 *   specific part of the data object's structure and defines rules for that part.
 * @param contents - The data object to be validated. This object
 *   should be structured according to the rules defined in the primary and nested schemas.
 * @param [messages] - An optional array to collect error messages. If provided,
 *   any validation errors will be added to this array, allowing for custom handling or
 *   logging of errors.
 * @throws {SDKErrors.ObjectUnverifiableError} - Throws an error if the data object does
 *   not conform to the primary or any of the nested schemas. This error includes details
 *   about the specific validation failures, aiding in diagnosing and correcting the
 *   structure of the data object.
 */
export function verifyContentAgainstNestedSchemas(
  schema: ISchema,
  nestedSchemas: ISchema[],
  contents: Record<string, any>,
  messages?: string[]
): void {
  verifyObjectAgainstSchema(schema, SchemaModel, messages)
  verifyObjectAgainstSchema(contents, schema, messages, nestedSchemas)
}

/**
 * Validates the metadata of a schema against a predefined metadata model. This function
 * ensures that the metadata associated with a schema adheres to specific standards and
 * formats as defined in the MetadataModel.
 *
 * @param metadata - The metadata object associated with a schema. This
 *   object contains various metadata fields (like title, description, etc.) that provide
 *   additional context and information about the schema.
 * @throws {SDKErrors.ObjectUnverifiableError} - Throws an error if the metadata does not
 *   conform to the MetadataModel. This error includes details about the specific validation
 *   failures, which helps in identifying and correcting issues in the metadata structure.
 */
export function verifySchemaMetadata(metadata: ISchemaMetadata): void {
  verifyObjectAgainstSchema(metadata, MetadataModel)
}

/**
 * Constructs a schema object from given properties, required fields, and other schema
 * attributes. This function is a key part of schema creation, allowing for the dynamic
 * generation of schemas based on specific requirements and attributes.
 *
 * @param title - The title of the schema. This is a descriptive name
 *   given to the schema for identification purposes.
 * @param properties - An object defining the properties of the
 *   schema. Each property in this object represents a field in the schema, along with its
 *   type and other attributes.
 * @param required - An array of strings that lists the names of
 *   properties that are required in the schema. This ensures that certain fields must be
 *   present in any data object validated against this schema.
 * @param schema
 * @param creator - The decentralized identifier (DID) of the creator of the
 *   schema. This is used to generate a unique identifier for the schema.
 * @returns - Returns a fully constructed schema object that can be used for
 *   validating data objects and other purposes.
 * @throws {SDKErrors.SchemaStructureError} - Throws an error if the constructed schema
 *   does not conform to the expected structure or standards. This ensures the integrity
 *   and validity of the created schema.
 */
export function getURIFromProperties(
  schema: ISchema,
  creator: DidUri
): { schema: ISchema; digest: HexString; creator: DidUri } {
  const { $id, ...uriSchema } = schema
  uriSchema.additionalProperties = false
  uriSchema.$schema = SchemaModelV1.$id

  const { uri, digest } = getUriForSchema(uriSchema, creator)

  const schemaType = {
    $id: uri,
    ...uriSchema,
  }

  verifySchemaStructure(schemaType, creator)
  return { schema: schemaType, digest, creator }
}

/**
 * Determines whether a given input conforms to the ISchema interface. This function
 * serves as a type guard, verifying if the input structure aligns with the expected
 * schema structure defined by ISchema.
 *
 * @param input - The input to be checked. This is an unknown type, which
 *   allows the function to be used in a variety of contexts where the type of the input
 *   is not predetermined.
 * @returns - Returns true if the input conforms to the ISchema interface,
 *   indicating that it has the expected structure and properties of a schema. Returns
 *   false otherwise.
 */
export function isISchema(input: unknown): input is ISchema {
  try {
    verifyDataStructure(input as ISchema)
  } catch (error) {
    return false
  }
  return true
}
