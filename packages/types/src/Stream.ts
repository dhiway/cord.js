/**
 * @packageDocumentation
 * @module IStream
 */
import type { DidUri } from './DidDocument'
import type { ISchema } from './Schema.js'
import type { ICredential } from './Credential.js'

export const STREAM_IDENTIFIER: number = 11992
export const STREAM_PREFIX: string = 'stream:cord:'
export type StreamId = string

export interface IStream {
  identifier: ICredential['identifier']
  streamHash: ICredential['rootHash']
  issuer: DidUri
  schema: ISchema['$id']
  registry: ICredential['registry'] | null
  revoked: boolean
}

export interface IStreamChain {
  streamHash: ICredential['rootHash']
  schema: ISchema['$id'] | null
}
