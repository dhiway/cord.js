import type { HexString } from '@polkadot/util/types'
import type { DidUri } from './DidDocument'

export const SCHEMA_IDENTIFIER: number = 41
export const SCHEMA_PREFIX: string = 'schema:cord:'

export type InstanceType =
  | 'array'
  | 'boolean'
  | 'integer'
  | 'null'
  | 'number'
  | 'object'
  | 'string'

export interface ISchemaType {
  $id: string
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

export type SchemaId = string

export interface ISchema {
  identifier: string
  schemaHash: HexString
  controller: DidUri
  controllerSignature: string
  schema: ISchemaType
}
