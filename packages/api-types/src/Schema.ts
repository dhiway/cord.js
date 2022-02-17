/**
 * @packageDocumentation
 * @module ISchema
 */
import type { IPublicIdentity } from './PublicIdentity'

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
  $metadata: {
    slug?: string
    version?: string
    icon?: string
    discoverable?: boolean
  }
  title: string
  description: string
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
  creator: IPublicIdentity['address']
  schema: ISchemaType
  cid?: string
  parent?: string
  permissioned: boolean
}

export type CompressedSchema = [
  ISchemaType['$id'],
  ISchemaType['$schema'],
  ISchemaType['title'],
  ISchemaType['properties'],
  ISchemaType['type']
]

export type CompressedSchemaType = [
  ISchema['id'],
  ISchema['hash'],
  ISchema['version'],
  ISchema['creator'],
  ISchema['cid'],
  ISchema['parent'],
  ISchema['permissioned'],
  CompressedSchema
]

export interface ISchemaDetails {
  version: ISchema['version']
  id: ISchema['id']
  schema_hash: ISchema['hash']
  creator: IPublicIdentity['address']
  cid: ISchema['cid'] | null
  parent: ISchema['parent'] | null
  permissioned: ISchema['permissioned']
  revoked: boolean
}
