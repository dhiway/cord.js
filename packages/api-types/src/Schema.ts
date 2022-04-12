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
  id: string
  hash: string
  version: string
  issuer: IPublicIdentity['address']
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
  ISchema['id'],
  ISchema['hash'],
  ISchema['version'],
  ISchema['issuer'],
  ISchema['parent'],
  ISchema['permissioned'],
  CompressedSchema
]

export interface ISchemaDetails {
  id: ISchema['id']
  hash: ISchema['hash']
  version: ISchema['version']
  issuer: IPublicIdentity['address']
  cid?: string | null
  parent: ISchema['parent'] | null
  permissioned: ISchema['permissioned']
  revoked: boolean
}
