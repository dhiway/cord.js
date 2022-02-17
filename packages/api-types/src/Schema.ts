/**
 * @packageDocumentation
 * @module ISchemaEnvelope
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
export interface ISchemaEnvelope {
  id: string
  hash: string
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
  ISchemaEnvelope['id'],
  ISchemaEnvelope['hash'],
  ISchemaEnvelope['version'],
  ISchemaEnvelope['creator'],
  ISchemaEnvelope['parent'],
  ISchemaEnvelope['permissioned'],
  CompressedSchema
]

export interface ISchemaDetails {
  id: ISchemaEnvelope['id']
  schema_hash: ISchemaEnvelope['hash']
  version: ISchemaEnvelope['version']
  creator: IPublicIdentity['address']
  cid?: string | null
  parent: ISchemaEnvelope['parent'] | null
  permissioned: ISchemaEnvelope['permissioned']
  revoked: boolean
}
