/**
 * @packageDocumentation
 * @module IStream
 */
import type { ISchemaEnvelope } from './Schema.js'
import type { IPublicIdentity } from './PublicIdentity.js'

export interface IStream {
  id: string
  hash: string
  cid: string
  schema: ISchemaEnvelope['id']
  link?: string
  creator: IPublicIdentity['address']
  revoked: boolean
}

export type CompressedStream = [
  IStream['id'],
  IStream['hash'],
  IStream['cid'],
  IStream['schema'],
  IStream['link'],
  IStream['creator'],
  IStream['revoked']
]

export interface IStreamDetails {
  id: IStream['id']
  streamHash: IStream['hash']
  cid: string | null
  parent_cid: string | null
  schema: ISchemaEnvelope['id'] | null
  link: IStream['id'] | null
  creator: IPublicIdentity['address']
  block: string
  revoked: boolean
}

export interface IStreamLinks {
  id: IStream['id']
  creator: IPublicIdentity['address']
}

export enum StreamCommitOf {
  Genesis,
  Update,
  StatusChange,
}
export interface IStreamCommits {
  streamHash: IStream['hash']
  cid: string | null
  block: string
  commit: StreamCommitOf
}
