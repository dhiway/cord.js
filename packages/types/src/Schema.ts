import type { HexString } from '@polkadot/util/types'

export const SCHEMA_IDENTIFIER: number = 8902
export const SCHEMA_PREFIX: string = 'schema:cord:'
export type SchemaId = string
export type SchemaHash = HexString

export type InstanceType =
  | 'array'
  | 'boolean'
  | 'integer'
  | 'null'
  | 'number'
  | 'object'
  | 'string'

export interface ISchema {
  $id: SchemaId
  $schema: string
  title: string
  properties: {
    [key: string]: { type: InstanceType; format?: string } | { $ref: string }
  }
  type: 'object'
  additionalProperties?: false
}
