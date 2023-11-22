import { ConfigService } from '@cord.network/config'
import type {
  IStatementStatus,
  IDocument,
  StatementId,
  IStatementDetails,
  Option,
} from '@cord.network/types'
import * as Did from '@cord.network/did'
import { uriToIdentifier } from '@cord.network/identifier'
import type { PalletStatementStatementDetails } from '@cord.network/augment-api'
import { DecoderUtils, SDKErrors } from '@cord.network/utils'

/**
 * Decodes the statement returned by `api.query.statement.statements()`.
 *
 * @param encoded Raw statement data from blockchain.
 * @param identifier The statement identifier.
 * @returns The statement.
 */
export function decodeStatementDetailsfromChain(
  encoded: Option<PalletStatementStatementDetails>,
  identifier: IDocument['identifier']
): IStatementDetails {
  const chainStatement = encoded.unwrap()
  const statement: IStatementDetails = {
    identifier,
    digest: chainStatement.digest.toHex(),
    chainSpace: DecoderUtils.hexToString(chainStatement.space.toString()),
    schema:
      DecoderUtils.hexToString(chainStatement.schema.toString()) || undefined,
  }
  return statement
}

/**
 * @param schemaId
 * @param statement
 */
export async function getStatementDetailsfromChain(
  statement: StatementId
): Promise<IStatementDetails | null> {
  const api = ConfigService.get('api')
  const statementId = uriToIdentifier(statement)

  const statementEntry = await api.query.statement.statements(statementId)
  const decodedDetails = decodeStatementDetailsfromChain(
    statementEntry,
    statementId
  )
  if (decodedDetails === null) {
    throw new SDKErrors.StatementError(
      `There is no statement with the provided ID "${statementId}" present on the chain.`
    )
  }

  return decodedDetails
}

/**
 * @param statementId
 * @param statement
 * @param digest
 */
export async function getStatementStatusfromChain(
  statement: StatementId,
  digest?: IDocument['documentHash']
): Promise<IStatementStatus | null> {
  const api = ConfigService.get('api')
  const statementId = uriToIdentifier(statement)

  const statementDetails = await getStatementDetailsfromChain(statementId)
  if (statementDetails === null) {
    throw new SDKErrors.StatementError(
      `There is no statement with the provided ID "${statementId}" present on the chain.`
    )
  }

  // Use the provided digest or the one from statementDetails
  const effectiveDigest = digest || statementDetails.digest

  const elementStatusDetails = await api.query.statement.entries(
    uriToIdentifier(statementId),
    effectiveDigest
  )

  if (elementStatusDetails === null) {
    throw new SDKErrors.StatementError(
      `There is no statement entry with the provided ID "${statementId}" present on the chain.`
    )
  }

  const elementChainCreator = elementStatusDetails.unwrap()
  const elementCreator = Did.fromChain(elementChainCreator)

  const elementStatus = await api.query.statement.revocationList(
    statementId,
    effectiveDigest
  )

  let revoked = false
  if (!elementStatus.isEmpty) {
    const encodedStatus = elementStatus.unwrap()
    revoked = encodedStatus.revoked.valueOf()
  }

  const statementStatus: IStatementStatus = {
    identifier: statementId,
    digest: effectiveDigest,
    creator: elementCreator,
    chainSpace: statementDetails.chainSpace,
    revoked,
  }

  return statementStatus
}
