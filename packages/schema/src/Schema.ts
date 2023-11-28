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
  ISchema,
  ISchemaDetails,
  ISchemaMetadata,
  SchemaDigest,
  SpaceId,
  SpaceUri,
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
 * (Internal Function) - Serializes a given schema object for hashing or storing using CBOR encoding.
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
 * @internal
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
 * (Internal Function) - Validates the structure of a given schema and checks for consistency in its identifier.
 *
 * This function performs two critical checks: firstly, it validates the structure of the provided schema
 * against a predefined schema model (SchemaModel), ensuring adherence to the expected format and rules.
 * Secondly, it verifies that the schema's identifier ($id) is consistent with an identifier generated
 * from the schema's content, the creator's DID, and the provided space identifier. This ensures that
 * each schema is uniquely and correctly identified, maintaining integrity in schema management.
 *
 * @param input - The schema to be validated. This schema should conform to the structure
 *                          defined by the ISchema interface.
 * @param creator - The decentralized identifier (DID) of the creator of the schema.
 *                          This DID is used in conjunction with the schema content and space identifier
 *                          to generate the expected schema identifier.
 * @param space - An identifier for the space (context or category) associated with the schema.
 *                         This parameter is part of the criteria for generating the expected schema identifier.
 *
 * @throws {SDKErrors.SchemaIdMismatchError} Throws an error if the actual schema identifier ($id) does not
 *         match the expected identifier derived from the schema content, creator's DID, and space identifier.
 *         This check is crucial to ensure that each schema's identifier is both unique and correctly formatted,
 *         avoiding conflicts and inconsistencies in schema identification.
 *
 * @internal
 */
export function verifySchemaStructure(
  input: ISchema,
  creator: DidUri,
  space: SpaceId
): void {
  verifyObjectAgainstSchema(input, SchemaModel)
  const uriFromSchema = getUriForSchema(input, creator, space)
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
 * Constructs a schema object from specified properties, required fields, and other schema attributes.
 * This function is pivotal in dynamically generating schemas based on specific requirements and attributes,
 * facilitating the creation of structured and standardized schema objects.
 *
 * @param schema - An object defining the properties, required fields, and other attributes of the schema.
 *        This includes the structure and data types for each field within the schema, providing the blueprint
 *        for the schema's format and content.
 * @param space - An identifier for the space (context or category) within which the schema is created.
 *        This categorization aids in organizing and managing schemas, particularly in diverse and complex systems.
 * @param creator - The decentralized identifier (DID) of the creator of the schema. This DID is used
 *        to generate a unique identifier for the schema, ensuring its uniqueness and traceability within the system.
 *
 * @param spaceUri
 * @param creatorUri
 * @returns - A fully constructed schema object including the schema itself, its cryptographic
 *          digest, the space identifier, and the creator's DID. This object can be utilized for data validation
 *          and various other purposes, serving as a cornerstone in data structuring and management.
 *
 * @throws {SDKErrors.SchemaStructureError} - If the constructed schema fails to conform to the expected structure
 *         or standards. This error ensures the integrity and compliance of the schema with predefined models.
 *
 * @example
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
 * const creatorDid = 'did:example:creator';
 * const spaceId = 'exampleSpaceId';
 *
 * try {
 *   const { schema, digest, space, creator } = buildFromProperties(properties, creatorDid, spaceId);
 *   console.log('Constructed Schema:', schema);
 *   console.log('Schema Digest:', digest);
 *   console.log('Space ID:', space);
 *   console.log('Creator DID:', creator);
 * } catch (error) {
 *   console.error('Error constructing schema:', error);
 * }
 * ```
 */
export function buildFromProperties(
  schema: ISchema,
  spaceUri: SpaceUri,
  creatorUri: DidUri
): ISchemaDetails {
  const { $id, ...uriSchema } = schema
  uriSchema.additionalProperties = false
  uriSchema.$schema = SchemaModelV1.$id

  const { uri, digest } = getUriForSchema(uriSchema, creatorUri, spaceUri)

  const schemaType = {
    $id: uri,
    ...uriSchema,
  }

  const schemaDetails: ISchemaDetails = {
    schema: schemaType,
    digest,
    spaceUri,
    creatorUri,
  }
  verifySchemaStructure(schemaType, creatorUri, spaceUri)
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
