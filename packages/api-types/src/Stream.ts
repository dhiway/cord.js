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
  issuer: IPublicIdentity['address']
  holder?: IPublicIdentity['address'] | null
  schemaId: ISchema['schemaId']
  linkId?: string | null
  issuerSignature: string
}

export type CompressedStream = [
  IStream['streamId'],
  IStream['streamHash'],
  IStream['issuer'],
  IStream['holder'],
  IStream['schemaId'],
  IStream['linkId'],
  IStream['issuerSignature']
]

export interface IStreamDetails {
  streamId: IStream['streamId']
  streamHash: IStream['streamHash']
  issuer: IPublicIdentity['address']
  holder: IPublicIdentity['address'] | null
  schemaId: ISchema['schemaId'] | null
  linkId: IStream['streamId'] | null
  spaceId: string | null
  revoked: boolean
}

export type CompressedStreamDetails = [
  IStreamDetails['streamId'],
  IStreamDetails['streamHash'],
  IStreamDetails['issuer'],
  IStreamDetails['holder'],
  IStreamDetails['schemaId'],
  IStreamDetails['linkId'],
  IStreamDetails['spaceId'],
  IStreamDetails['revoked']
]
