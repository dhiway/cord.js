import type { HexString } from '@polkadot/util/types'

export const SCHEMA_IDENTIFIER: number = 41
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
  description: string
  $metadata: {
    version?: string
  }
  properties: {
    [key: string]: { $ref?: string; type?: InstanceType; format?: string }
  }
  type: 'object'
}
