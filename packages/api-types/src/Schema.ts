/**
 * @packageDocumentation
 * @module ISchema
 */
import type { IPublicIdentity } from './PublicIdentity.js'

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
  schemaId: string
  schemaHash: string
  version: string
  controller: IPublicIdentity['address']
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
  ISchema['schemaId'],
  ISchema['schemaHash'],
  ISchema['version'],
  ISchema['controller'],
  CompressedSchema
]

export interface ISchemaDetails {
  schemaId: ISchema['schemaId']
  schemaHash: ISchema['schemaHash']
  controller: IPublicIdentity['address']
  spaceid?: string | null
  revoked: boolean
}
