/**
 * @packageDocumentation
 * @module ISchema
 */
import type { IPublicIdentity } from './PublicIdentity.js'
import type { HexString } from '@polkadot/util/types'

export const SCHEMA_IDENTIFIER: number = 33
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
    discoverable?: boolean
  }
  properties: {
    [key: string]: { $ref?: string; type?: InstanceType; format?: string }
  }
  type: 'object'
}

export type SchemaWithoutId = Omit<ISchemaType, '$id'>
export interface ISchema {
  identifier: string
  schemaHash: HexString
  controller: IPublicIdentity['address']
  controllerSignature: string
  space: string | null
  schema: ISchemaType
}

export type CompressedSchema = [
  ISchemaType['$id'],
  ISchemaType['$schema'],
  ISchemaType['$metadata'],
  ISchemaType['title'],
  ISchemaType['description'],
  ISchemaType['properties'],
  ISchemaType['type']
]

export type CompressedSchemaType = [
  ISchema['identifier'],
  ISchema['schemaHash'],
  ISchema['controller'],
  ISchema['controllerSignature'],
  ISchema['space'],
  CompressedSchema
]

export interface ISchemaDetails {
  identifier: ISchema['identifier']
  schemaHash: ISchema['schemaHash']
  controller: IPublicIdentity['address']
  space: string | null
  revoked: boolean
}
