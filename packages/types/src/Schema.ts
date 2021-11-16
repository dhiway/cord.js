/**
 * @packageDocumentation
 * @module ISchema
 */
import type { IPublicIdentity } from './PublicIdentity'

export interface ISchemaType {
  $id: string
  $schema: string
  name: string
  properties: {
    [key: string]: { $ref?: string; type?: string; format?: string }
  }
  type: 'object'
}

export type SchemaWithoutId = Omit<ISchemaType, '$id'>
export interface ISchema {
  id: string
  hash: string
  creator: IPublicIdentity['address']
  schema: ISchemaType
  permissioned: boolean
  revoked: boolean
}

export type CompressedSchema = [
  ISchemaType['$id'],
  ISchemaType['$schema'],
  ISchemaType['name'],
  ISchemaType['properties'],
  ISchemaType['type']
]

export type CompressedSchemaType = [
  ISchema['id'],
  ISchema['hash'],
  ISchema['creator'],
  ISchema['permissioned'],
  ISchema['revoked'],
  CompressedSchema
]

export interface ISchemaDetails {
  id: string
  schema_hash: ISchema['hash']
  cid: string | null
  pcid: string | null
  creator: IPublicIdentity['address']
  block: string
  permissioned: boolean
  revoked: boolean
}
