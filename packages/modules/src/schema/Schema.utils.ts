/**
 * @packageDocumentation
 * @module SchemaUtils
 */

import type {
  ISchema,
  IContent,
  CompressedSchema,
  CompressedSchemaType,
  SchemaWithoutId,
} from '@cord.network/api-types'
import {
  jsonabc,
  Crypto,
  DataUtils,
  SDKErrors,
  JsonSchema,
} from '@cord.network/utils'
import { getOwner } from './Schema.chain.js'
import { SchemaModel, SchemaWrapperModel } from './TypeSchema.js'

export function verifySchemaProperties(
  object: Record<string, unknown>,
  schema: Record<string, unknown>,
  messages?: string[]
): boolean {
  const validator = new JsonSchema.Validator(schema, '7', false)
  if (schema.$id !== SchemaModel.$id) {
    validator.addSchema(SchemaModel)
  }
  const result = validator.validate(object)
  if (!result.valid && messages) {
    result.errors.forEach((error: any) => {
      messages.push(error.error)
    })
  }
  return result.valid
}

export function verifySchema(
  object: Record<string, any>,
  schema: Record<string, any>
): boolean {
  return verifySchemaProperties(object, schema)
}

/**
 *  Verifies the structure of the provided IStream['contents'] with ISchema['schema'].
 *
 * @param streamContents IStream['contents'] to be verified against the schema.
 * @param schema ISchema['schema'] to be verified against the [SchemaModel].
 * @throws [[ERROR_OBJECT_MALFORMED]] when schema does not correspond to the SchemaModel.
 *
 * @returns Boolean whether both streamContents and schema could be verified.
 */
export function verifyContentProperties(
  contents: IContent['contents'],
  schema: ISchema['schema']
): boolean {
  if (!verifySchema(schema, SchemaModel)) {
    throw SDKErrors.ERROR_OBJECT_MALFORMED()
  }
  return verifySchema(contents, schema)
}

export async function verifyStored(schema: ISchema): Promise<boolean> {
  return typeof (await getOwner(schema.hash)) === 'string'
}

export async function verifyOwner(schema: ISchema): Promise<boolean> {
  const creator = await getOwner(schema.hash)
  return creator ? creator === schema.creator : false
}

export function getSchemaPropertiesForHash(
  schemaType: SchemaWithoutId | ISchema['schema']
): Partial<ISchema['schema']> {
  const schemaWithoutId: Partial<ISchema['schema']> =
    '$id' in schemaType
      ? (schemaType as ISchema['schema'])
      : (schemaType as SchemaWithoutId)
  const shallowCopy = { ...schemaWithoutId }
  delete shallowCopy.$id
  return shallowCopy
}

export function getHashForSchema(
  schema: SchemaWithoutId | ISchema['schema']
): string {
  const prepSchema = getSchemaPropertiesForHash(schema)
  return Crypto.hashObjectAsStr(prepSchema)
}

/**
 *  Checks whether the input meets all the required criteria of an ISchema object.
 *  Throws on invalid input.
 *
 * @param input The potentially only partial ISchema.
 * @throws [[ERROR_OBJECT_MALFORMED]] when input does not correspond to either it's schema, or the SchemaWrapperModel.
 * @throws [[ERROR_HASH_MALFORMED]] when the input's hash does not match the hash calculated from ISchema's schema.
 * @throws [[ERROR_MTYPE_OWNER_TYPE]] when the input's owner is not of type string or null.
 *
 */
export function errorCheck(input: ISchema): void {
  if (!verifySchema(input, SchemaWrapperModel)) {
    throw SDKErrors.ERROR_OBJECT_MALFORMED()
  }
  console.log(input.schema, getHashForSchema(input.schema))
  if (!input.schema || getHashForSchema(input.schema) !== input.hash) {
    throw SDKErrors.ERROR_HASH_MALFORMED(input.hash, 'Schema')
  }
  if (
    typeof input.creator === 'string'
      ? !DataUtils.validateAddress(input.creator, 'Schema creator')
      : !(input.creator === null)
  ) {
    throw SDKErrors.ERROR_SCHEMA_CONTROLLER_TYPE()
  }
}

/**
 *  Compresses a [[Schema]] for storage and/or messaging.
 *
 * @param typeSchema A [[Schema]] object that will be sorted and stripped for messaging or storage.
 * @throws [[ERROR_COMPRESS_OBJECT]] when any of the four required properties of the typeSchema are missing.
 *
 * @returns An ordered array of a [[SchemaType]] schema.
 */

export function compressSchema(
  typeSchema: ISchema['schema']
): CompressedSchema {
  if (
    !typeSchema.$id ||
    !typeSchema.$schema ||
    !typeSchema.$metadata ||
    !typeSchema.title ||
    !typeSchema.description ||
    !typeSchema.properties ||
    !typeSchema.type
  ) {
    throw SDKErrors.ERROR_COMPRESS_OBJECT(typeSchema, 'TypeSchema')
  }
  const sortedTypeSchema = jsonabc.sortObj(typeSchema)
  return [
    sortedTypeSchema.$id,
    sortedTypeSchema.$schema,
    sortedTypeSchema.$metadata,
    sortedTypeSchema.title,
    sortedTypeSchema.description,
    sortedTypeSchema.properties,
    sortedTypeSchema.type,
  ]
}

/**
 *  Decompresses a schema of a [[Schema]] from storage and/or message.
 *
 * @param typeSchema A compressed [[Schema]] array that is reverted back into an object.
 * @throws [[ERROR_DECOMPRESSION_ARRAY]] when either the typeSchema is not an Array or it's length is not equal to the defined length of 5.
 *
 * @returns An object that has the same properties as a [[Schema]].
 */

export function decompressSchema(
  typeSchema: CompressedSchema
): ISchema['schema'] {
  if (!Array.isArray(typeSchema) || typeSchema.length !== 7) {
    throw SDKErrors.ERROR_DECOMPRESSION_ARRAY('typeSchema')
  }
  return {
    $id: typeSchema[0],
    $schema: typeSchema[1],
    $metadata: typeSchema[2],
    title: typeSchema[3],
    description: typeSchema[4],
    properties: typeSchema[5],
    type: typeSchema[6],
  }
}

/**
 *  Compresses a [[Schema]] for storage and/or messaging.
 *
 * @param schema [[Schema]] object that will be sorted and stripped for messaging or storage.
 *
 * @returns An ordered array of a [[Schema]].
 */

export function compress(schema: ISchema): CompressedSchemaType {
  errorCheck(schema)
  return [
    schema.id,
    schema.hash,
    schema.version,
    schema.creator,
    schema.parent,
    schema.permissioned,
    compressSchema(schema.schema),
  ]
}

/**
 *  Decompresses a [[Schema]] from storage and/or message.
 *
 * @param schema A compressed [[Schema]] array that is reverted back into an object.
 * @throws [[ERROR_DECOMPRESSION_ARRAY]] when either the schema is not an Array or it's length is not equal to the defined length of 4.
 *
 * @returns An object that has the same properties as a [[Schema]].
 */

export function decompress(schema: CompressedSchemaType): ISchema {
  if (!Array.isArray(schema) || schema.length !== 7) {
    throw SDKErrors.ERROR_DECOMPRESSION_ARRAY('Schema')
  }
  return {
    id: schema[0],
    hash: schema[1],
    version: schema[2],
    creator: schema[3],
    parent: schema[4],
    permissioned: schema[5],
    schema: decompressSchema(schema[6]),
  }
}

/**
 * Validates an array of [[Schema]s against a [[Stream]].
 *
 * @param schema - A [[Schema]] that has nested [[Schema]]s inside.
 * @param nestedSchemas - An array of [[Schema]]s.
 * @param streamContents - The contents of a [[Stream]] to be validated.
 * @param messages
 *
 * @returns Whether the contents is valid.
 */

export function validateNestedSchemas(
  schema: ISchema['schema'],
  nestedSchemas: Array<ISchema['schema']>,
  streamContents: Record<string, any>,
  messages?: string[]
): boolean {
  const validator = new JsonSchema.Validator(schema, '7', false)
  nestedSchemas.forEach((schema) => {
    validator.addSchema(schema)
  })
  validator.addSchema(SchemaModel)
  const result = validator.validate(streamContents)
  if (!result.valid && messages) {
    result.errors.forEach((error) => {
      messages.push(error.error)
    })
  }
  return result.valid
}
