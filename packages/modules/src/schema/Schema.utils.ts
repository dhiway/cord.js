/**
 * @packageDocumentation
 * @module SchemaUtils
 */

import Ajv from 'ajv'
import type {
  ISchema,
  IContent,
  CompressedSchema,
  CompressedSchemaType,
} from '@cord.network/api-types'
import { jsonabc, Crypto, DataUtils, SDKErrors } from '@cord.network/utils'
import { getOwner } from './Schema.chain'
import { SchemaModel, SchemaWrapperModel } from './TypeSchema'

export function verifySchemaProperties(
  object: Record<string, unknown>,
  schema: Record<string, unknown>,
  messages?: string[]
): boolean {
  const ajv = new Ajv()
  ajv.addMetaSchema(SchemaModel)
  const result = ajv.validate(schema, object)
  if (!result && ajv.errors) {
    if (messages) {
      ajv.errors.forEach((error: Ajv.ErrorObject) => {
        if (typeof error.message === 'string') {
          messages.push(error.message)
        }
      })
    }
  }
  return !!result
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
  return typeof (await getOwner(schema.id)) === 'string'
}

export async function verifyOwner(schema: ISchema): Promise<boolean> {
  const creator = await getOwner(schema.id)
  return creator ? creator === schema.creator : false
}

type schemaPropsForHashing = {
  $schema: ISchema['schema']['$schema']
  properties: ISchema['schema']['properties']
  name: ISchema['schema']['name']
  type: ISchema['schema']['type']
}

export function getHashForSchema(schema: schemaPropsForHashing): string {
  const hashVal = {
    $schema: schema.$schema,
    properties: schema.properties,
    name: schema.name,
    type: schema.type,
  }
  return Crypto.hashObjectAsStr(hashVal)
}

export function getIdForSchema(hash: string): string {
  return getIdWithPrefix(Crypto.hashObjectAsStr(hash))
}

export function getIdWithPrefix(hash: string): string {
  return `cord:schema:${hash}`
}

export function getSchemaId(id: string): string {
  return id.split('cord:schema:').join('')
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
  if (!input.schema || getHashForSchema(input.schema) !== input.hash) {
    throw SDKErrors.ERROR_HASH_MALFORMED(input.hash, 'Schema')
  }
  if (getSchemaId(getIdForSchema(input.hash)) !== input.schema.$id) {
    throw SDKErrors.ERROR_SCHEMA_ID_NOT_MATCHING(
      getIdForSchema(input.hash),
      input.schema.$id
    )
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
    !typeSchema.name ||
    !typeSchema.properties ||
    !typeSchema.type
  ) {
    throw SDKErrors.ERROR_COMPRESS_OBJECT(typeSchema, 'TypeSchema')
  }
  const sortedTypeSchema = jsonabc.sortObj(typeSchema)
  return [
    sortedTypeSchema.$id,
    sortedTypeSchema.$schema,
    sortedTypeSchema.name,
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
  if (!Array.isArray(typeSchema) || typeSchema.length !== 5) {
    throw SDKErrors.ERROR_DECOMPRESSION_ARRAY('typeSchema')
  }
  return {
    $id: typeSchema[0],
    $schema: typeSchema[1],
    name: typeSchema[2],
    properties: typeSchema[3],
    type: typeSchema[4],
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
    schema.cid,
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
  if (!Array.isArray(schema) || schema.length !== 8) {
    throw SDKErrors.ERROR_DECOMPRESSION_ARRAY('Schema')
  }
  return {
    id: schema[0],
    hash: schema[1],
    version: schema[2],
    creator: schema[3],
    cid: schema[4],
    parent: schema[5],
    permissioned: schema[6],
    schema: decompressSchema(schema[7]),
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
  const ajv = new Ajv()
  ajv.addMetaSchema(SchemaModel)
  const validate = ajv.addSchema(nestedSchemas).compile(schema)
  const result = validate(streamContents)
  if (!result && ajv.errors) {
    if (messages) {
      ajv.errors.forEach((error: Ajv.ErrorObject) => {
        if (typeof error.message === 'string') {
          messages.push(error.message)
        }
      })
    }
  }
  return !!result
}
