/**
 * @packageDocumentation
 * @module IStream
 */
import type { DidUri } from './DidDocument'
import type { ISchema } from './Schema.js'
import type { IDocument } from './Document.js'

export const STREAM_IDENTIFIER: number = 11992
export const STREAM_PREFIX: string = 'stream:cord:'
export type StreamId = string

export interface IStream {
  identifier: IDocument['identifier']
  streamHash: IDocument['documentHash']
  issuer: DidUri
  schema: ISchema['$id']
  registry: IDocument['registry'] | null
  revoked: boolean
}

export interface IStreamChain {
  streamHash: IDocument['documentHash']
  schema: ISchema['$id'] | null
}
