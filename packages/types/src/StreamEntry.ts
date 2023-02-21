/**
 * @packageDocumentation
 * @module IStream
 */
import type { DidUri } from './DidDocument'
import type { ISchema } from './Schema.js'
import type { IStream } from './Stream.js'

export const STREAM_IDENTIFIER: number = 51
export const STREAM_PREFIX: string = 'stream:cord:'

export interface IStreamEntry {
  identifier: IStream['identifier']
  streamHash: IStream['rootHash']
  issuer: DidUri
  schema: ISchema['identifier'] | null
  linked: IStream['link'] | null
  swarm: IStream['space'] | null
  revoked: boolean
}
