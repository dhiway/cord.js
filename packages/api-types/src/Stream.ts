/**
 * @packageDocumentation
 * @module IStream
 */
import type { ISchema } from './Schema.js'
import type { IPublicIdentity } from './PublicIdentity.js'

export const STREAM_IDENTIFIER: number = 43
export const STREAM_PREFIX: string = 'stream:cord:'

export interface IStream {
  streamId: string
  streamHash: string
  creator: IPublicIdentity['address']
  holder?: IPublicIdentity['address'] | null
  schemaId: ISchema['id']
  linkId?: string | null
  signature: string
}

export type CompressedStream = [
  IStream['streamId'],
  IStream['streamHash'],
  IStream['creator'],
  IStream['holder'],
  IStream['schemaId'],
  IStream['linkId'],
  IStream['signature']
]

export interface IStreamDetails {
  streamId: IStream['streamId']
  streamHash: IStream['streamHash']
  controller: IPublicIdentity['address']
  holder: IPublicIdentity['address'] | null
  schemaId: ISchema['id'] | null
  linkId: IStream['streamId'] | null
  revoked: boolean
}

export type CompressedStreamDetails = [
  IStreamDetails['streamId'],
  IStreamDetails['streamHash'],
  IStreamDetails['controller'],
  IStreamDetails['holder'],
  IStreamDetails['schemaId'],
  IStreamDetails['linkId'],
  IStreamDetails['revoked']
]
