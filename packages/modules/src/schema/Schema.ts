/**
 * Schema.
 *
 * * A Schema is a description of the [[Stream]] data structure, based on [JSON Schema](http://json-schema.org/).
 * * Schemas are published and stored by the issuer.
 * * Permissioned users can use a Schema to create a new [[Stream]].
 *
 * @packageDocumentation
 * @module Schema
 * @preferred
 */

import type {
  DidUri,
  IContent,
  ISchema,
  ISchemaMetadata,
  SchemaHash,
} from '@cord.network/types'
import {
  Identifier,
  Crypto,
  JsonSchema,
  SDKErrors,
  jsonabc,
} from '@cord.network/utils'
import { SCHEMA_IDENT, SCHEMA_PREFIX } from '@cord.network/types'
import { ConfigService, cord_api_query } from '@cord.network/config'
import { Bytes } from '@polkadot/types'
import type { AccountId } from '@polkadot/types/interfaces'
import * as Did from '@cord.network/did'
import { blake2AsHex } from '@polkadot/util-crypto'
import { SchemaModel, MetadataModel, SchemaModelV1 } from './Schema.types.js'

/**
 * Utility for (re)creating Schema hashes. Sorts the schema and strips the $id property (which contains the Schema hash) before stringifying.
 *
 * @param schema The Schema (with or without $id).
 * @returns A deterministic JSON serialization of a Schema, omitting the $id property.
 */
export function serializeForHash(
  schema: ISchema | Omit<ISchema, '$id'>
): string {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { $id, ...schemaWithoutId } = schema as ISchema
  return Crypto.encodeObjectAsStr(schemaWithoutId)
}

/**
 * Calculates the Schema hash from schema properties.
 *
 * @param schema The Schema (with or without $id).
 * @returns Hash as hex string.
 */
export function getHashForSchema(
  schema: ISchema | Omit<ISchema, '$id'>
): SchemaHash {
  const serializedSchema = serializeForHash(schema)
  return Crypto.hashStr(serializedSchema)
}

/**
 * Calculates the schema $id by hashing it.
 *
 * @param schema  Schema for which to create the id.
 * @returns Schema id uri.
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
  return Identifier.hashToUri(digest, SCHEMA_IDENT, SCHEMA_PREFIX)
}

/**
 * Verifies data against schema or schema against metaschema.
 *
 * @param object Data to be verified against schema.
 * @param schema Schema to verify against.
 * @param messages Optional empty array. If passed, this receives all verification errors.
 * @returns Whether or not verification was successful.
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
 *  Verifies the structure of the provided IContent['contents'] with ISchema.
 *
 * @param contents IContent['contents'] to be verified against the schema.
 * @param schema ISchema to be verified against the [SchemaModel].
 * @param messages An array, which will be filled by schema errors.
 *
 */
export function verifyContentAganistSchema(
  contents: IContent['contents'],
  schema: ISchema,
  messages?: string[]
): void {
  verifyObjectAgainstSchema(schema, SchemaModel, messages)
  verifyObjectAgainstSchema(contents, schema, messages)
}

/**
 * Checks on the CORD blockchain whether a schema is registered.
 *
 * @param schema Schema data.
 */

export async function verifyStored(schema: ISchema): Promise<void> {
  const api = ConfigService.get('api')
  let encoded: any

  const identifier = Identifier.uriToIdentifier(schema.$id)
  encoded = await cord_api_query('schema', 'fetchSchema', identifier)

  if (!encoded) {
    encoded = await api.query.schema.schemas(identifier)
  }

  if (encoded.isNone)
    throw new SDKErrors.SchemaIdMissingError(
      `Schema with identifier ${identifier} is not registered on chain`
    )
}

/**
 * Checks whether the input meets all the required criteria of an ISchema object.
 * Throws on invalid input.
 *
 * @param input The ISchema object.
 */
export function verifySchemaStructure(input: ISchema, creator: DidUri): void {
  verifyObjectAgainstSchema(input, SchemaModel)
  const uriFromSchema = getUriForSchema(input, creator)
  if (uriFromSchema !== input.$id) {
    throw new SDKErrors.SchemaIdMismatchError(uriFromSchema, input.$id)
  }
}

/**
 * Checks whether the schema input meets all the required criteria of an ISchema object.
 * Throws on invalid input.
 *
 * @param input The ISchem object.
 */
export function verifyDataStructure(input: ISchema): void {
  verifyObjectAgainstSchema(input, SchemaModel)
}

/**
 * Validates an array of [[CType]]s against a [[Claim]].
 *
 * @param cType - A [[CType]] that has nested [[CType]]s inside.
 * @param nestedCTypes - An array of [[CType]] schemas.
 * @param claimContents - The contents of a [[Claim]] to be validated.
 * @param messages - Optional empty array. If passed, this receives all verification errors.
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
 * Checks a SchemaMetadata object.
 *
 * @param metadata [[ISchemaMetadata]] that is to be instantiated.
 */
export function verifySchemaMetadata(metadata: ISchemaMetadata): void {
  verifyObjectAgainstSchema(metadata, MetadataModel)
}

/**
 *  Creates a new [[ISchema]] object.
 *
 * @param title The new Schema's title as a string.
 * @param properties Key-value pairs describing the admissible atomic claims for a credential with this Schema. The value of each property is a json-schema (for example `{ "type": "number" }`) used to validate that property.
 * @param description A description of the Schema.
 * @param metadata Metadata for the Schema.
 * @returns A Schema object.
 */
export function fromProperties(
  title: ISchema['title'],
  properties: ISchema['properties'],
  required: ISchema['required'],
  creator: DidUri
): ISchema {
  const schema: Omit<ISchema, '$id'> = {
    properties,
    required,
    title,
    $schema: SchemaModelV1.$id,
    type: 'object',
  }
  schema.additionalProperties = false
  const schemaType = jsonabc.sortObj({
    ...schema,
    $id: getUriForSchema(schema, creator),
  })
  verifySchemaStructure(schemaType, creator)
  return schemaType
}

/**
 *  Custom Type Guard to determine input being of type ISchema.
 *
 * @param input The potentially only partial ISchema.
 * @returns Boolean whether input is of type ISchema.
 */
export function isISchema(input: unknown): input is ISchema {
  try {
    verifyDataStructure(input as ISchema)
  } catch (error) {
    return false
  }
  return true
}
