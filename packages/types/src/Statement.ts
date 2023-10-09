/**
 * @packageDocumentation
 * @module IStatement
 */
import type { DidUri } from './DidDocument'
import type { ISchema } from './Schema.js'
import type { IDocument } from './Document.js'

export const STATEMENT_IDENT: number = 8902
export const STATEMENT_PREFIX: string = 'statement:cord:'
export type StatementId = string

export interface IStatement {
  identifier: IDocument['identifier']
  statementHash: IDocument['documentHash']
  schema: ISchema['$id']
  registry: IDocument['registry']
}

export interface IAttest {
  identifier: IDocument['identifier']
  creator: DidUri
  revoked: boolean
}

export interface IStatementChain {
  statementHash: IDocument['documentHash']
  schema: ISchema['$id'] | null
}
