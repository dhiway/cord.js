import { ConfigService } from '@cord.network/config'
import type { Option } from '@polkadot/types'
import type {
  IStatementEntry,
  IStatementStatus,
  IDocument,
  StatementId,
  IStatementDetails,
  AccountId,
} from '@cord.network/types'
import * as Did from '@cord.network/did'
import type {
  PalletStatementStatementDetails,
  PalletStatementStatementPresentationDetails,
  PalletStatementStatementEntryStatus,
} from '@cord.network/augment-api'
import { DecoderUtils, Identifier, SDKErrors } from '@cord.network/utils'

const log = ConfigService.LoggingFactory.getLogger('Statement')

// /**
//  * Encodes the provided statement for use in `api.tx.statement.create()`.
//  *
//  * @param statement The Statement to translate for the blockchain.
//  * @param content
//  * @returns Encoded Statement.
//  */
// export function toChain(content: IStatement): IStatementChain {
//   const chainStatement = {
//     statementHash: content.statementHash,
//     schema: Identifier.uriToIdentifier(content.schema),
//   }
//   return chainStatement
// }

// /**
//  * Encodes the provided Statement['$id'] for use in `api.query.schema.schemas()`.
//  *
//  * @param schemaId The Schema id to translate for the blockchain.
//  * @param statementId
//  * @returns Encoded Schema id.
//  */
// export function idToChain(statementId: IStatement['identifier']): StatementId {
//   return Identifier.uriToIdentifier(statementId)
// }

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
    chainSpace: DecoderUtils.hexToString(chainStatement.registry.toString()),
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
  const statementId = Identifier.uriToIdentifier(statement)

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
 * @param digest
 */
export async function getStatementStatusfromChain(
  statementId: StatementId,
  digest?: IDocument['documentHash']
): Promise<IStatementStatus | null> {
  const api = ConfigService.get('api')

  const statementDetails = await getStatementDetailsfromChain(statementId)
  if (!statementDetails) {
    throw new SDKErrors.StatementError(
      `There is no statement with the provided ID "${statementId}" present on the chain.`
    )
  }

  // Use the provided digest or the one from statementDetails
  const effectiveDigest = digest || statementDetails.digest

  const elementStatusDetails = await api.query.statement.entries(
    statementId,
    effectiveDigest
  )

  if (elementStatusDetails.isEmpty) {
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
