/**
 * @packageDocumentation
 * @module IStatement
 */
import type { SchemaUri } from './Schema.js'
import { DidUri } from './DidDocument.js'
import { HexString } from './Imported.js'
import { SpaceUri } from './ChainSpace.js'

export const STATEMENT_IDENT = 8902
export const STATEMENT_PREFIX = 'stmt:cord:'
export type StatementUri = `${typeof STATEMENT_PREFIX}${string}`
export type StatementId = string
export type StatementDigest = HexString

export interface IStatementEntry {
  element: StatementUri
  digest: HexString
  spaceUri: SpaceUri
  schemaUri?: SchemaUri | undefined
}

export interface IStatementDetails {
  uri: StatementUri
  digest: StatementDigest
  spaceUri: SpaceUri
  schemaUri?: SchemaUri | undefined
}

export interface IStatementStatus {
  uri: StatementUri
  digest: StatementDigest
  spaceUri: string
  creatorUri: DidUri
  schemaUri?: string | undefined
  revoked: boolean
}
