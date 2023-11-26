import type {
  IStatementEntry,
  HexString,
  SchemaUri,
  SpaceUri,
  DidUri,
  StatementUri,
} from '@cord.network/types'
import { DataUtils, SDKErrors } from '@cord.network/utils'
import { checkIdentifier, updateStatementUri } from '@cord.network/identifier'
import {
  getUriForStatement,
  fetchStatementStatusfromChain,
} from './Statement.chain.js'

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
 * @param schema
 * @param spaceUri
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
 * @param stmtUri
 * @param digest
 * @param spaceUri
 * @param creatorUri
 * @param schemaUri
 */
export function buildFromUpdateProperties(
  stmtUri: StatementUri,
  digest: HexString,
  spaceUri: SpaceUri,
  creatorUri: DidUri,
  schemaUri?: SchemaUri
): IStatementEntry {
  const statementUri = updateStatementUri(stmtUri, digest)

  const statement = {
    elementUri: statementUri,
    digest,
    creatorUri,
    spaceUri,
    schemaUri: schemaUri || undefined,
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
 * @param document
 * @param root0
 * @param root0.trustedIssuerUris
 * @param stmtUri
 * @param digest
 * @param creator
 * @param spaceuri
 * @param schemaUri
 */
export async function verifyAgainstProperties(
  stmtUri: StatementUri,
  digest: HexString,
  creator?: DidUri,
  spaceuri?: SpaceUri,
  schemaUri?: SchemaUri
): Promise<{ isValid: boolean; message: string }> {
  // try {
  console.log(stmtUri)
  const statementStatus = await fetchStatementStatusfromChain(stmtUri)

  if (!statementStatus) {
    return {
      isValid: false,
      message: `Statement details for "${digest}" not found.`,
    }
  }

  if (digest !== statementStatus.digest) {
    return {
      isValid: false,
      message: 'Digest does not match with Statement Digest.',
    }
  }

  if (statementStatus?.revoked) {
    return {
      isValid: false,
      message: `Statement "${stmtUri}" Revoked.`,
    }
  }

  if (creator) {
    if (creator !== statementStatus.creatorUri) {
      return {
        isValid: false,
        message: 'Statement and Digest creator does not match.',
      }
    }
  }

  if (spaceuri) {
    if (spaceuri !== statementStatus.spaceUri) {
      return {
        isValid: false,
        message: 'Statement and Digest space details does not match.',
      }
    }
  }

  if (schemaUri) {
    if (schemaUri !== statementStatus.schemaUri) {
      return {
        isValid: false,
        message: 'Statement and Digest schema details does not match.',
      }
    }
  }

  return {
    isValid: true,
    message:
      'Digest properties provided are valid and matches the statement details.',
  }
  // } catch (error) {
  //   if (error instanceof Error) {
  //     return {
  //       isValid: false,
  //       message: `Error verifying properties: ${error}`,
  //     }
  //   }
  //   return {
  //     isValid: false,
  //     message: 'An unknown error occurred while verifying the properties.',
  //   }
  // }
}
