import type { IStatementEntry, IDocument, HexString } from '@cord.network/types'
import { DataUtils, SDKErrors } from '@cord.network/utils'
import { Document } from '@cord.network/transform'

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
  DataUtils.verifyIsHex(input.digest, 256)
}

/**
 * @param statementHash
 * @param digest
 * @param chainSpace
 * @param schema
 */
export function fromProperties(
  digest: HexString,
  chainSpace: string,
  schema?: string
): IStatementEntry {
  const statement: IStatementEntry = {
    digest,
    chainSpace,
    schema: schema || undefined,
  }

  verifyDataStructure(statement)
  return statement
}

/**
 * Builds a new instance of an [[Statement]], from a complete set of input required for an statement.
 *
 * @param document - The base request for statement.
 * @returns A new [[Statement]] object.
 *
 */
export function fromDocument(document: IDocument): IStatementEntry {
  const statement = {
    digest: document.documentHash,
    chainSpace: document.chainSpace,
    schema: document.content.schemaId || undefined,
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
  document: IDocument
): void {
  const documentMismatch = document.documentHash !== statement.digest

  const schemaMismatch =
    statement.schema !== undefined &&
    document.content.schemaId !== statement.schema

  const chainSpaceMismatch = document.chainSpace !== statement.chainSpace

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
