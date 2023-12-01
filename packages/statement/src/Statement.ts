/**
 * @packageDocumentation
 * @module Statement
 * @preferred
 *
 * The `Statement` module is a fundamental part of the CORD SDK, offering a suite of functionalities for creating, managing,
 * and interacting with statements on the CORD blockchain. These statements represent specific claims or records
 * anchored on the blockchain, serving various use cases like attestations, records, and verifiable claims.
 *
 * Key functionalities include:
 * - `buildFromProperties`: Creates a new statement entry on the blockchain with specified properties like digest, space URI, and creator URI. It's instrumental in generating a new blockchain record or claim.
 * - `buildFromUpdateProperties`: Updates an existing statement entry with new properties, ensuring that the statements remain up-to-date and relevant.
 * - `verifyAgainstProperties`: Asynchronously verifies the properties of a statement against provided parameters, crucial for validating the integrity and authenticity of statement entries.
 *
 * These features are vital in ensuring that statements on the CORD blockchain are created, updated, and verified efficiently, maintaining their relevance and reliability in various applications.
 *
 * @example
 * ```typescript
 * // Example: Creating a new statement entry
 * const newStatement = buildFromProperties('0x123...', 'space:cord:example_uri', 'did:cord:creator_uri');
 * console.log('New Statement URI:', newStatement.elementUri);
 *
 * // Example: Verifying an existing statement entry
 * verifyAgainstProperties('stmt:cord:example_uri', '0x123...', 'did:cord:creator_uri')
 *   .then(verificationResult => console.log('Verification result:', verificationResult))
 *   .catch(error => console.error('Verification error:', error));
 * ```
 */

import type {
  IStatementEntry,
  HexString,
  SchemaUri,
  SpaceUri,
  DidUri,
  StatementUri,
  PartialStatementEntry,
} from '@cord.network/types'
import { DataUtils, SDKErrors } from '@cord.network/utils'
import { checkIdentifier, updateStatementUri } from '@cord.network/identifier'
import {
  getUriForStatement,
  fetchStatementDetailsfromChain,
} from './Statement.chain.js'

/**
 * Verifies the data structure of a given statement entry.
 *
 * @remarks
 * This function is designed to validate the integrity of a `IStatementEntry` object. It checks the presence of essential
 * fields and verifies that they conform to expected formats and standards. The function throws specific errors if any
 * validations fail, ensuring that only correctly structured statement entries are processed.
 *
 * @param input - The `IStatementEntry` object to be validated. This includes fields like `digest`, `spaceUri`, and optionally `schemaUri`.
 *
 * @example
 * ```typescript
 * try {
 *   const statementEntry: IStatementEntry = {
 *     digest: '0x1234...',
 *     spaceUri: 'space:cord:example_uri',
 *     schemaUri: 'schema:cord:example_uri'
 *   };
 *   verifyDataStructure(statementEntry);
 * } catch (error) {
 *   console.error('Data structure verification Pfailed:', error);
 * }
 * ```
 *
 * @throws {SDKErrors.StatementHashMissingError} If the `digest` field is missing from the input.
 * @throws {SDKErrors.InvalidIdentifierError} If `spaceUri` or `schemaUri` do not conform to the expected identifier format.
 * @throws {Error} From `DataUtils.verifyIsHex` if `digest` is not a valid hexadecimal string of 256 bits.
 *
 * @description
 * The function first checks if the `digest` field is present in the `input`. If not, it throws a `StatementHashMissingError`.
 * Next, it validates the `spaceUri` using the `checkIdentifier` function. If `schemaUri` is provided, it is also validated
 * using the same function. Finally, the `digest` field is checked to ensure it is a valid 256-bit hexadecimal string.
 * Any deviations from these standards result in the corresponding errors being thrown.
 *
 * @internal
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
 * Constructs a `IStatementEntry` object from given properties.
 *
 * @remarks
 * This function creates a statement entry in the CORD blockchain system. It takes various identifiers and
 * assembles them into a structured object that conforms to the `IStatementEntry` interface. It also ensures
 * that the created object adheres to the required data structure through validation.
 *
 * @param digest - The hexadecimal string representing the digest of the statement.
 * @param spaceUri - The URI of the ChainSpace associated with the statement.
 * @param creatorUri - The DID URI of the statement's creator.
 * @param schemaUri - (Optional) The URI of the schema linked to the statement. Defaults to `undefined` if not provided.
 * @returns A fully constructed `IStatementEntry` object.
 *
 * @example
 * ```typescript
 * const digest = '0x123...';
 * const spaceUri = 'space:cord:example_uri';
 * const creatorUri = 'did:cord:creator_uri';
 * const schemaUri = 'schema:cord:schema_uri';
 * const statementEntry = buildFromProperties(digest, spaceUri, creatorUri, schemaUri);
 * console.log('Statement Entry:', statementEntry);
 * ```
 *
 * @throws Various errors from `verifyDataStructure` if the created statement entry does not meet the validation criteria.
 *
 * @description
 * The function first calls `getUriForStatement` to generate a statement URI using the provided `digest`, `spaceUri`, and `creatorUri`.
 * It then assembles these properties, along with the optional `schemaUri`, into an object conforming to the `IStatementEntry` interface.
 * The `verifyDataStructure` function is subsequently called to validate the integrity and structure of the created statement entry.
 * If validation passes, the function returns the constructed `IStatementEntry` object.
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
 * Constructs an updated `IStatementEntry` object using the provided properties.
 *
 * @remarks
 * This function is used for updating an existing statement entry in the CORD blockchain system. It takes a statement URI and other identifiers to form a new statement entry, ensuring that the updated object adheres to the required data structure.
 *
 * @param stmtUri - The existing URI of the statement that is being updated.
 * @param digest - The new hexadecimal string representing the digest of the statement.
 * @param spaceUri - The URI of the ChainSpace associated with the statement.
 * @param creatorUri - The DID URI of the statement's creator.
 * @param schemaUri - (Optional) The URI of the schema linked to the statement. Defaults to `undefined` if not provided.
 * @returns A newly constructed `IStatementEntry` object reflecting the updates.
 *
 * @example
 * ```typescript
 * const existingStmtUri = 'stmt:cord:example_uri';
 * const newDigest = '0x456...';
 * const spaceUri = 'space:cord:example_uri';
 * const creatorUri = 'did:cord:creator_uri';
 * const schemaUri = 'schema:cord:schema_uri';
 * const updatedStatementEntry = buildFromUpdateProperties(existingStmtUri, newDigest, spaceUri, creatorUri, schemaUri);
 * console.log('Updated Statement Entry:', updatedStatementEntry);
 * ```
 *
 * @throws Various errors from `verifyDataStructure` if the created statement entry does not meet the validation criteria.
 *
 * @description
 * The function first calls `updateStatementUri` to update the statement URI using the provided `stmtUri` and `digest`.
 * It then constructs a statement entry by combining the updated `statementUri`, along with the `digest`, `spaceUri`, `creatorUri`, and optionally `schemaUri`, forming an object that conforms to the `IStatementEntry` interface.
 * The `verifyDataStructure` function is then invoked to validate the integrity and structure of the newly constructed statement entry.
 * If validation is successful, the function returns the updated `IStatementEntry` object.
 */
export function buildFromUpdateProperties(
  stmtUri: StatementUri,
  digest: HexString,
  spaceUri: SpaceUri,
  creatorUri: DidUri
): PartialStatementEntry {
  const statementUri = updateStatementUri(stmtUri, digest)
  // TODO fetch on-chain data and compare the update inputs
  const statement = {
    elementUri: statementUri,
    digest,
    creatorUri,
    spaceUri,
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
 * Verifies a statement's properties against provided parameters.
 *
 * @remarks
 * This asynchronous function checks if the provided statement URI, digest, and other optional properties match the corresponding entry in the blockchain. It's used to validate the integrity and accuracy of statement entries.
 *
 * @param stmtUri - The URI of the statement to be verified.
 * @param digest - The hexadecimal string representing the digest of the statement.
 * @param creator - (Optional) The DID URI of the statement's creator for verification.
 * @param spaceuri - (Optional) The URI of the ChainSpace associated with the statement for verification.
 * @param schemaUri - (Optional) The URI of the schema linked to the statement for verification.
 * @returns A promise that resolves to an object with `isValid` flag and `message`. The `isValid` flag indicates whether the verification was successful, and the `message` provides details or error information.
 *
 * @example
 * ```typescript
 * const stmtUri = 'stmt:cord:example_uri';
 * const digest = '0x123...';
 * const creatorUri = 'did:cord:creator_uri';
 * const spaceUri = 'space:cord:example_uri';
 * const schemaUri = 'schema:cord:schema_uri';
 * verifyAgainstProperties(stmtUri, digest, creatorUri, spaceUri, schemaUri)
 *   .then(result => {
 *     console.log('Verification result:', result);
 *   })
 *   .catch(error => {
 *     console.error('Error in verification:', error);
 * });
 * ```
 *
 * @throws Various errors if there's a problem fetching the statement status from the blockchain or if an unexpected error occurs.
 *
 * @description
 * The function begins by fetching the statement status from the blockchain using the provided `stmtUri`. It then compares the `digest`, `creator`, `spaceuri`, and `schemaUri` with the fetched statement details. If any of these properties do not match or if the statement is revoked, the function returns an object indicating the verification failure with an appropriate message. If all properties match and the statement is not revoked, it returns an object indicating successful verification.
 */
export async function verifyAgainstProperties(
  stmtUri: StatementUri,
  digest: HexString,
  creator?: DidUri,
  spaceuri?: SpaceUri,
  schemaUri?: SchemaUri
): Promise<{ isValid: boolean; message: string }> {
  try {
    const statementStatus = await fetchStatementDetailsfromChain(stmtUri)

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
  } catch (error) {
    if (error instanceof Error) {
      return {
        isValid: false,
        message: `Error verifying properties: ${error}`,
      }
    }
    return {
      isValid: false,
      message: 'An unknown error occurred while verifying the properties.',
    }
  }
}
