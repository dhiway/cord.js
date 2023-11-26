import type {
  IStatementEntry,
  IDocument,
  HexString,
  SchemaUri,
  SpaceUri,
  DidUri,
  PartialDocument,
} from '@cord.network/types'
import { DataUtils, SDKErrors } from '@cord.network/utils'
import { Document } from '@cord.network/transform'
import {
  checkIdentifier,
  documentUriToHex,
  updateStatementUri,
} from '@cord.network/identifier'
import { getUriForStatement } from './Statement.chain.js'

/**
 *  Checks whether the input meets all the required criteria of an [[IStatement]] object.
 *  Throws on invalid input.
 *
 * @param input The potentially only partial [[IStatement]].
 *
 */
export function verifyDataStructure(input: IStatementEntry): void {
  if (!input.digest) {
    throw new SDKErrors.StatementHashMissingError()
  }

  checkIdentifier(input.spaceUri)
  if (input.schemaUri) {
    checkIdentifier(input.schemaUri)
  }

  DataUtils.verifyIsHex(input.digest, 256)
}

/**
 * @param statementHash
 * @param digest
 * @param chainSpace
 * @param docUri
 * @param schema
 * @param spaceUri
 * @param creator
 * @param creatorUri
 * @param schemaUri
 */
export function buildFromProperties(
  digest: HexString,
  spaceUri: SpaceUri,
  creatorUri: DidUri,
  schemaUri?: SchemaUri
): IStatementEntry {
  const stmtUri = getUriForStatement(digest, spaceUri, creatorUri)

  const statement: IStatementEntry = {
    elementUri: stmtUri,
    digest,
    creatorUri,
    spaceUri,
    schemaUri: schemaUri || undefined,
  }

  verifyDataStructure(statement)
  return statement
}

/**
 * Builds a new instance of an [[Statement]], from a complete set of input required for an statement.
 *
 * @param document - The base request for statement.
 * @param creator
 * @param creatorUri
 * @returns A new [[Statement]] object.
 *
 */
export function buildFromDocumentProperties(
  document: IDocument | PartialDocument,
  creatorUri: DidUri
): {
  statementDetails: IStatementEntry
  document: IDocument | PartialDocument
} {
  const digest = documentUriToHex(document.uri)
  const stmtUri = getUriForStatement(
    digest,
    document.content.spaceUri,
    creatorUri
  )
  const updatedDocument = { ...document }
  updatedDocument.elementUri = stmtUri

  const statement = {
    elementUri: stmtUri,
    digest,
    creatorUri,
    spaceUri: document.content.spaceUri,
    schemaUri: document.content.schemaUri || undefined,
  }
  verifyDataStructure(statement)
  return { statementDetails: statement, document: updatedDocument }
}

/**
 * @param document
 * @param creator
 * @param creatorUri
 */
export function buildFromUpdateProperties(
  document: IDocument | PartialDocument,
  creatorUri: DidUri
): {
  statementDetails: IStatementEntry
  document: IDocument | PartialDocument
} {
  console.log('Build From Update', document, document.uri)
  const digest = documentUriToHex(document.uri)
  const stmtUri = updateStatementUri(document.elementUri!, digest)
  const updatedDocument = { ...document }
  updatedDocument.elementUri = stmtUri

  const statement = {
    elementUri: stmtUri,
    digest,
    creatorUri,
    spaceUri: document.content.spaceUri,
    schemaUri: document.content.schemaUri || undefined,
  }
  verifyDataStructure(statement)
  return { statementDetails: statement, document: updatedDocument }
}

/**
 * Custom Type Guard to determine input being of type IStatement using the StatementUtils errorCheck.
 *
 * @param input The potentially only partial IStatement.
 * @returns Boolean whether input is of type IStatement.
 */
export function isIStatement(input: unknown): input is IStatementEntry {
  try {
    verifyDataStructure(input as IStatementEntry)
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
  statement: IStatementEntry,
  document: IDocument | PartialDocument
): void {
  const documentMismatch = documentUriToHex(document.uri) !== statement.digest

  const schemaMismatch =
    statement.schemaUri !== undefined &&
    document.content.schemaUri !== statement.schemaUri

  const chainSpaceMismatch = document.content.spaceUri !== statement.spaceUri

  if (documentMismatch || schemaMismatch || chainSpaceMismatch) {
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
