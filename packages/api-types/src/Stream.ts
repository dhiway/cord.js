/**
 * @packageDocumentation
 * @module IStream
 */
import type { ISchema } from './Schema.js'
import type { IPublicIdentity } from './PublicIdentity.js'

export interface IStream {
  streamId: string
  streamHash: string
  creator: IPublicIdentity['address']
  holder?: IPublicIdentity['address'] | null
  schemaId: ISchema['schemaId']
  linkId?: string | null
  cid?: string | null
}

export type CompressedStream = [
  IStream['streamId'],
  IStream['streamHash'],
  IStream['creator'],
  IStream['holder'],
  IStream['schemaId'],
  IStream['linkId'],
  IStream['cid']
]

export interface IStreamDetails {
  streamId: IStream['streamId']
  streamHash: IStream['streamHash']
  creator: IPublicIdentity['address']
  holder: IPublicIdentity['address'] | null
  schemaId: ISchema['schemaId'] | null
  linkId: IStream['streamId'] | null
  parentHash?: string | null
  cid: string | null
  revoked: boolean
}
