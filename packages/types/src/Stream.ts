/**
 * @packageDocumentation
 * @module IStream
 */
import type { ISchema } from './Schema.js'
import type { IPublicIdentity } from './PublicIdentity.js'
import type { IContentStream } from './ContentStream.js'

export const STREAM_IDENTIFIER: number = 43
export const STREAM_PREFIX: string = 'stream:cord:'

export interface IStream {
  identifier: IContentStream['identifier']
  streamHash: IContentStream['rootHash']
  issuer: IPublicIdentity['address']
  holder: IPublicIdentity['address'] | null
  schema: ISchema['identifier'] | null
  link: IContentStream['link'] | null
  space: IContentStream['space'] | null
  signatureProof?: IContentStream['signatureProof'] | null
}

export type CompressedStream = [
  IStream['identifier'],
  IStream['streamHash'],
  IStream['issuer'],
  IStream['holder'],
  IStream['schema'],
  IStream['link'],
  IStream['space'],
  IStream['signatureProof']
]

export interface IStreamDetails {
  identifier: IStream['identifier']
  streamHash: IStream['streamHash']
  issuer: IPublicIdentity['address']
  holder: IPublicIdentity['address'] | null
  schema: string | null
  link: IStream['link'] | null
  space: IStream['space'] | null
  revoked: boolean
}

export type CompressedStreamDetails = [
  IStreamDetails['identifier'],
  IStreamDetails['streamHash'],
  IStreamDetails['issuer'],
  IStreamDetails['holder'],
  IStreamDetails['schema'],
  IStreamDetails['link'],
  IStreamDetails['space'],
  IStreamDetails['revoked']
]
