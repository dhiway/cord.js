/**
 * @packageDocumentation
 * @module IStream
 */
import type { DidUri } from './DidDocument'
import type { ISchema } from './Schema.js'
import type { IDocument } from './Document.js'

export const STREAM_IDENT: number = 8902
export const STREAM_PREFIX: string = 'stream:cord:'
export type StreamId = string

export interface IStream {
  identifier: IDocument['identifier']
  streamHash: IDocument['documentHash']
  schema: ISchema['$id']
  registry: IDocument['registry']
}

export interface IAttest {
  identifier: IDocument['identifier']
  creator: DidUri
  revoked: boolean
}

export interface IStreamChain {
  streamHash: IDocument['documentHash']
  schema: ISchema['$id'] | null
}
