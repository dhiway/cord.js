/**
 * @packageDocumentation
 * @module IStatement
 */
import type { DidUri } from './DidDocument'
import type { ISchema } from './Schema.js'
import type { IDocument } from './Document.js'

export const STATEMENT_IDENT = 8902
export const STATEMENT_PREFIX = 'statement:cord:'
export type StatementId = string

export interface IStatementEntry {
  statementHash: IDocument['documentHash']
  chainSpace: IDocument['chainSpace']
  schema: ISchema['$id'] | undefined
}

export interface IStatementDetails {
  identifier: StatementId
  digest: IDocument['documentHash']
  chainSpace: IDocument['chainSpace']
  schema: ISchema['$id'] | undefined
}

export interface IStatementStatus {
  identifier: StatementId
  digest: IDocument['documentHash']
  creator: DidUri
  chainSpace: IDocument['chainSpace']
  revoked: boolean
}
