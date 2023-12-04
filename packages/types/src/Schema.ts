import type { HexString } from './Imported.js'
import type { DidUri } from './DidDocument.js'
import { SpaceId } from './ChainSpace.js'

export const SCHEMA_IDENT = 7366
export const SCHEMA_PREFIX = 'schema:cord:'
export type SchemaUri = `${typeof SCHEMA_PREFIX}${string}`
export type SchemaId = string
export type SchemaDigest = HexString

export type InstanceType =
  | 'boolean'
  | 'integer'
  | 'number'
  | 'string'
  | 'array'
  | 'object'

interface TypePattern {
  type: InstanceType
}

interface StringPattern extends TypePattern {
  type: 'string'
  format?: 'date' | 'time' | 'uri'
  enum?: string[]
  minLength?: number
  maxLength?: number
}

interface NumberPattern extends TypePattern {
  type: 'integer' | 'number'
  enum?: number[]
  minimum?: number
  maximum?: number
}

interface BooleanPattern extends TypePattern {
  type: 'boolean'
}

interface RefPattern {
  $ref: string
}

interface ArrayPattern extends TypePattern {
  type: 'array'
  items: BooleanPattern | NumberPattern | StringPattern | RefPattern
  minItems?: number
  maxItems?: number
}

interface ObjectPattern extends TypePattern {
  type: 'object'
  properties: {
    [key: string]:
      | BooleanPattern
      | NumberPattern
      | StringPattern
      | ArrayPattern
      | ObjectPattern
      | RefPattern
  }
  required?: string[]
}

export interface ISchema {
  $id: SchemaUri
  $schema: string
  title: string
  properties: {
    [key: string]:
      | BooleanPattern
      | NumberPattern
      | StringPattern
      | ArrayPattern
      | ObjectPattern
      | RefPattern
  }
  type: 'object'
  required: string[]
  additionalProperties?: false
}

/**
 * The details of a Schema that are stored on chain.
 */
export interface ISchemaDetails {
  schema: ISchema
  digest: SchemaDigest
  spaceUri: SpaceId
  creatorUri: DidUri
}
