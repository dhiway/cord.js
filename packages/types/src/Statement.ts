/**
 * @packageDocumentation
 * @module IStatement
 */
import type { SchemaUri } from './SchemaDid.js'
import { HexString } from './Imported.js'
import { SpaceUri } from './ChainSpaceDid.js'
import { StatementUri, StatementDigest } from './StatementDid.js'

export const STATEMENT_IDENT = 15501;

export interface IStatementEntryAccountType {
  elementUri: StatementUri
  digest: HexString
  creatorAddress: string
  spaceUri: SpaceUri
  schemaUri?: SchemaUri | undefined
}

export type PartialStatementEntryAccountType = Omit<IStatementEntryAccountType, 'schemaUri'>

export interface IStatementStatusAccountType {
  uri: StatementUri
  digest: StatementDigest
  spaceUri: string
  creatorAddress: string
  schemaUri?: string | undefined
  revoked: boolean
}
