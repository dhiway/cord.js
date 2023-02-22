/**
 * @packageDocumentation
 * @module IStream
 */
import type { DidUri } from './DidDocument'
import type { ISchema } from './Schema.js'
import type { ICredential } from './Credential.js'

export const STREAM_IDENTIFIER: number = 51
export const STREAM_PREFIX: string = 'stream:cord:'

export interface IStream {
  identifier: ICredential['identifier']
  streamHash: ICredential['rootHash']
  issuer: DidUri
  schema: ISchema['$id'] | null
  swarm: ICredential['swarm'] | null
  revoked: boolean
}
