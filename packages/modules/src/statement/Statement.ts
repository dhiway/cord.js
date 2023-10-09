import type { IStatement, IDocument } from '@cord.network/types'
import { DataUtils, SDKErrors } from '@cord.network/utils'
//import * as Did from '@cord.network/did'
import * as Document from '../document/index.js'

/**
 *  Checks whether the input meets all the required criteria of an [[IStatement]] object.
 *  Throws on invalid input.
 *
 * @param input The potentially only partial [[IStatement]].
 *
 */
export function verifyDataStructure(input: IStatement): void {
  if (!input.identifier) {
    throw new SDKErrors.IdentifierMissingError()
  }
  DataUtils.validateId(input.identifier, 'Statement Identiifier')
  if (!input.schema) {
    throw new SDKErrors.SchemaMissingError()
  }
  DataUtils.validateId(input.schema, 'Schema Identifier')

  if (!input.statementHash) {
    throw new SDKErrors.StatementHashMissingError()
  }
  DataUtils.verifyIsHex(input.statementHash, 256)

    /*
  if (!input.issuer) {
    throw new SDKErrors.IssuerMissingError()
  }
  Did.validateUri(input.issuer, 'Did')

  if (typeof input.revoked !== 'boolean') {
    throw new SDKErrors.RevokedTypeError()
    }
    */
}

/**
 * Builds a new instance of an [[Statement]], from a complete set of input required for an statement.
 *
 * @param document - The base request for statement.
 * @returns A new [[Statement]] object.
 *
 */
export function fromDocument(document: IDocument): IStatement {
  const statement = {
    identifier: document.identifier,
    statementHash: document.documentHash,
    schema: document.content.schemaId,
    authorization: document.authorization,
    registry: document.registry,
  }
  verifyDataStructure(statement)
  return statement
}

/**
 * Custom Type Guard to determine input being of type IStatement using the StatementUtils errorCheck.
 *
 * @param input The potentially only partial IStatement.
 * @returns Boolean whether input is of type IStatement.
 */
export function isIStatement(input: unknown): input is IStatement {
  try {
    verifyDataStructure(input as IStatement)
  } catch (error) {
    return false
  }
  return true
}

/**
 * Verifies whether the data of the given attestation matches the one from the corresponding credential. It is valid if:
 * * the [[Credential]] object has valid data (see [[Credential.verifyDataIntegrity]]);
 * and
 * * the hash of the [[Credential]] object, and the hash of the [[Statement]].
 *
 * @param statement - The statement to verify.
 * @param document - The document to verify against.
 */
export function verifyAgainstDocument(
  statement: IStatement,
  document: IDocument
): void {
  const schemaMismatch = document.content.schemaId !== statement.schema
  const documentMismatch = document.documentHash !== statement.statementHash
  if (documentMismatch || schemaMismatch) {
    throw new SDKErrors.CredentialUnverifiableError(
      `Some attributes of the statement diverge from the credential: ${[
        'schemaId',
        'statementHash',
      ]
        .filter((_, i) => [schemaMismatch, documentMismatch][i])
        .join(', ')}`
    )
  }
  Document.verifyDataIntegrity(document)
}
