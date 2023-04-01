import type { HexString } from '@polkadot/util/types'

export const SCHEMA_IDENT: number = 1424
export const SCHEMA_PREFIX: string = 'schema:cord:'
export type SchemaId = string
export type SchemaHash = HexString

export type InstanceType = 'boolean' | 'integer' | 'number' | 'string' | 'array'

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

export interface ISchema {
  $id: SchemaId
  $schema: string
  title: string
  properties: {
    [key: string]:
      | BooleanPattern
      | NumberPattern
      | StringPattern
      | ArrayPattern
      | RefPattern
  }
  type: 'object'
  additionalProperties?: false
}
