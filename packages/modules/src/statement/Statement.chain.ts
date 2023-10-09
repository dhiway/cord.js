import { ConfigService } from '@cord.network/config'
import type { Option } from '@polkadot/types'
import type {
  IStatement,
  IAttest,
  IDocument,
  IStatementChain,
  StatementId,
} from '@cord.network/types'
import * as Did from '@cord.network/did'
import type { PalletStatementStatementEntry, PalletStatementAttestationDetails } from '@cord.network/augment-api'
import { DecoderUtils, Identifier } from '@cord.network/utils'

const log = ConfigService.LoggingFactory.getLogger('Statement')

/**
 * Encodes the provided statement for use in `api.tx.statement.create()`.
 *
 * @param statement The Statement to translate for the blockchain.
 * @returns Encoded Statement.
 */
export function toChain(content: IStatement): IStatementChain {
  const chainStatement = {
    statementHash: content.statementHash,
    schema: Identifier.uriToIdentifier(content.schema),
  }
  return chainStatement
}

/**
 * Encodes the provided Statement['$id'] for use in `api.query.schema.schemas()`.
 *
 * @param schemaId The Schema id to translate for the blockchain.
 * @returns Encoded Schema id.
 */
export function idToChain(statementId: IStatement['identifier']): StatementId {
  return Identifier.uriToIdentifier(statementId)
}

/**
 * Decodes the statement returned by `api.query.statement.statements()`.
 *
 * @param encoded Raw statement data from blockchain.
 * @param identifier The statement identifier.
 * @returns The statement.
 */
export function fromChain(
  encoded: Option<PalletStatementStatementEntry>,
  identifier: IDocument['identifier']
): IStatement {
  const chainStatement = encoded.unwrap()
  const statement: IStatement = {
    identifier,
    statementHash: chainStatement.digest.toHex(),
    schema: DecoderUtils.hexToString(chainStatement.schema.toString()),
    registry: DecoderUtils.hexToString(chainStatement.registry.toString()) || null,
  }
  log.info(`Decoded statement: ${JSON.stringify(statement)}`)
  return statement
}

export function fromChainAttest(
  encoded: Option<PalletStatementAttestationDetails>,
  identifier: IDocument['identifier']
): IAttest {
  const chainStatement = encoded.unwrap()
  const statement: IAttest = {
      identifier,
      creator: Did.fromChain(chainStatement.creator),
      revoked: chainStatement.revoked.valueOf()
  }
  log.info(`Decoded statement: ${JSON.stringify(statement)}`)
  return statement
}

