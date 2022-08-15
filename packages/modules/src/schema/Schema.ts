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
  IContent,
  ISchema,
  SchemaWithoutId,
  ISchemaMetadata,
  CompressedSchemaType,
  CompressedSchema,
} from '@cord.network/types'
import {
  Identifier,
  Crypto,
  JsonSchema,
  SDKErrors,
  DataUtils,
  jsonabc,
} from '@cord.network/utils'
import { isStored, getOwner } from './Schema.chain.js'
import { SCHEMA_IDENTIFIER, SCHEMA_PREFIX } from '@cord.network/types'
import { Identity } from '../identity/Identity.js'
import { HexString } from '@polkadot/util/types'
import {
  SchemaModel,
  SchemaWrapperModel,
  MetadataModel,
} from './Schema.types.js'
/**
 * Utility for (re)creating schema hashes. For this, the $id property needs to be stripped from the schemaType.
 *
 * @param schemaType The Schema (with or without $id).
 * @returns Schema without the $id property.
 */

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

/**
 * Calculates the Schema hash from schema properties.
 *
 * @param schema The Schema (with or without $id).
 * @returns Hash as hex string.
 */

export function getHashForSchema(
  schema: SchemaWithoutId | ISchema['schema']
): HexString {
  const prepSchema = getSchemaPropertiesForHash(schema)
  return Crypto.hashObjectAsHexStr(prepSchema)
}

/**
 * Verifies data against schema or schema against metaschema.
 *
 * @param object Data to be verified against schema.
 * @param schema Schema to verify against.
 * @param messages Optional empty array. If passed, this receives all verification errors.
 * @returns Whether or not verification was successful.
 */
export function verifyObjectWithSchema(
  object: Record<string, any>,
  schema: Record<string, any>,
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

/**
 *  Verifies the structure of the provided IContent['contents'] with ISchema['schema'].
 *
 * @param contents IStream['contents'] to be verified against the schema.
 * @param schema ISchema['schema'] to be verified against the [SchemaModel].
 * @throws [[ERROR_OBJECT_MALFORMED]] when schema does not correspond to the SchemaModel.
 *
 * @returns Boolean whether both streamContents and schema could be verified.
 */
export function verifyContentWithSchema(
  contents: IContent['contents'],
  schema: ISchema['schema'],
  messages?: string[]
): boolean {
  if (!verifyObjectWithSchema(schema, SchemaModel)) {
    throw new SDKErrors.ERROR_OBJECT_MALFORMED()
  }
  return verifyObjectWithSchema(contents, schema, messages)
}

export async function verifyStored(schema: ISchema): Promise<boolean> {
  return isStored(schema.identifier)
}

export async function verifyOwner(schema: ISchema): Promise<boolean> {
  const issuer = await getOwner(schema.identifier)
  return issuer ? issuer === schema.controller : false
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
export function verifyDataStructure(input: ISchema): void {
  if (!verifyObjectWithSchema(input, SchemaWrapperModel)) {
    throw new SDKErrors.ERROR_OBJECT_MALFORMED()
  }
  if (!input.schema || getHashForSchema(input.schema) !== input.schemaHash) {
    throw new SDKErrors.ERROR_HASH_MALFORMED(input.schemaHash, 'Schema')
  }
  if (
    typeof input.controller === 'string'
      ? !DataUtils.validateAddress(input.controller, 'Schema issuer')
      : !(input.controller === null)
  ) {
    throw new SDKErrors.ERROR_SCHEMA_OWNER_TYPE()
  }
  if (!input.identifier) {
    throw new SDKErrors.ERROR_SCHEMA_IDENTIFIER_NOT_PROVIDED()
  }
  DataUtils.validateId(
    Identifier.getIdentifierKey(input.identifier),
    'Identifier'
  )
  if (
    Identifier.getIdentifier(
      input.schemaHash,
      SCHEMA_IDENTIFIER,
      SCHEMA_PREFIX
    ) !== input.schema.$id
  ) {
    throw new SDKErrors.ERROR_SCHEMA_ID_NOT_MATCHING(
      Identifier.getIdentifier(
        input.schemaHash,
        SCHEMA_IDENTIFIER,
        SCHEMA_PREFIX
      ),
      input.schema.$id
    )
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

export function verifyContentWithNestedSchemas(
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

/**
 * Checks a SchemaMetadata object.
 *
 * @param metadata [[ISchemaMetadata]] that is to be instantiated.
 * @throws [[ERROR_OBJECT_MALFORMED]] when metadata is not verifiable with the MetadataModel.
 */
export function verifySchemaMetadata(metadata: ISchemaMetadata): void {
  if (!verifyObjectWithSchema(metadata, MetadataModel)) {
    throw new SDKErrors.ERROR_OBJECT_MALFORMED()
  }
}

/**
 *  Creates a new [[Schema]] from an [[ISchemaType]].
 *
 * @param schema The JSON schema from which the [[Schema]] should be generated.
 * @param controller The public SS58 address of the issuer of the [[Schema]].
 * @returns An instance of [[Schema]].
 */
export function fromSchemaProperties(
  schema: ISchema['schema'],
  controller: Identity
): ISchema {
  const schemaHash = getHashForSchema(schema)
  const schemaIdentifier = Identifier.getIdentifier(
    schemaHash,
    SCHEMA_IDENTIFIER,
    SCHEMA_PREFIX
  )
  const newSchema = {
    identifier: schemaIdentifier,
    schemaHash: schemaHash,
    schema: {
      ...schema,
      $id: schemaIdentifier,
    },
    controller: controller.address,
    controllerSignature: controller.signStr(schemaHash),
  }
  verifyDataStructure(newSchema)
  return newSchema
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

/**
 * Compresses a [[Schema]] schema for storage and/or messaging.
 *
 * @param typeSchema A [[Schema]] schema object that will be sorted and stripped for messaging or storage.
 * @throws [[ERROR_COMPRESS_OBJECT]] when any of the four required properties of the cTypeSchema are missing.
 *
 * @returns An ordered array of a [[Schema]].
 */
export function compressSchema(
  typeSchema: ISchema['schema']
): CompressedSchemaType {
  if (
    !typeSchema.$id ||
    !typeSchema.$schema ||
    !typeSchema.title ||
    !typeSchema.properties ||
    !typeSchema.type
  ) {
    throw new SDKErrors.ERROR_COMPRESS_OBJECT(typeSchema, 'typeSchema')
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
 * Decompresses a [[Schema]] from storage and/or message.
 *
 * @param typeSchema A compressed [[Schema]] schema array that is reverted back into an object.
 * @throws [[ERROR_DECOMPRESSION_ARRAY]] when either the typeSchema is not an Array or it's length is not equal to the defined length of 7.
 *
 * @returns An object that has the same properties as a [[Schema]].
 */
export function decompressSchema(
  typeSchema: CompressedSchemaType
): ISchema['schema'] {
  if (!Array.isArray(typeSchema) || typeSchema.length !== 7) {
    throw new SDKErrors.ERROR_DECOMPRESSION_ARRAY('typeSchema')
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
 * Compresses an [[Schema]] object for storage and/or messaging..
 * @param schema [[Schema]] object that will be sorted and stripped for messaging or storage.
 *
 * @returns An array that contains the same properties of an [[Schema]].
 */
export function compress(schema: ISchema): CompressedSchema {
  verifyDataStructure(schema)
  return [
    schema.identifier,
    schema.schemaHash,
    schema.controller,
    schema.controllerSignature,
    compressSchema(schema.schema),
  ]
}

/**
 *  Builds a [[Schema]] from the decompressed array.
 *
 * @param schema The [[CompressedSchema]] that should get decompressed.
 * @throws [[ERROR_DECOMPRESSION_ARRAY]] when either the Schema is not an Array or it's length is not equal to the defined length of 7.

 * @returns  An object that has the same properties as a [[Schema]].
 */
export function decompress(schema: CompressedSchema): ISchema {
  if (!Array.isArray(schema) || schema.length !== 5) {
    throw new SDKErrors.ERROR_DECOMPRESSION_ARRAY('Schema')
  }
  const decompressedSchema = {
    identifier: schema[0],
    schemaHash: schema[1],
    controller: schema[2],
    controllerSignature: schema[3],
    schema: decompressSchema(schema[4]),
  }
  verifyDataStructure(decompressedSchema)
  return decompressedSchema
}
