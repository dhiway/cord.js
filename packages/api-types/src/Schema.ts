/**
 * @packageDocumentation
 * @module ISchema
 */
import type { IPublicIdentity } from './PublicIdentity.js'

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
  creator: IPublicIdentity['address']
  schema: ISchemaType
  parent?: string
  permissioned: boolean
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
  ISchema['creator'],
  ISchema['parent'],
  ISchema['permissioned'],
  CompressedSchema
]

export interface ISchemaDetails {
  schemaId: ISchema['schemaId']
  schemaHash: ISchema['schemaHash']
  version: ISchema['version']
  creator: IPublicIdentity['address']
  cid?: string | null
  parent: ISchema['parent'] | null
  permissioned: ISchema['permissioned']
  revoked: boolean
}
