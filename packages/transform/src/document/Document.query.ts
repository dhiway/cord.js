import { ConfigService } from '@cord.network/config'
import type {
  IStatementStatus,
  StatementId,
  IStatementDetails,
  Option,
  Bytes,
  ApiPromise,
  HexString,
  AccountId32,
  SpaceUri,
  DocumentUri,
  StatementUri,
  StatementDigest,
  SchemaUri,
} from '@cord.network/types'
import {
  uriToIdentifier,
  documentUriToHex,
  identifierToUri,
} from '@cord.network/identifier'
import type { PalletStatementStatementDetails } from '@cord.network/augment-api'
import { DecoderUtils, SDKErrors } from '@cord.network/utils'
import { fromChain } from '@cord.network/did'

/**
 * Decodes the statement returned by `api.query.statement.statements()`.
 *
 * @param encoded Raw statement data from blockchain.
 * @param identifier The statement identifier.
 * @param stmtUri
 * @param stmtid
 * @param stmtId
 * @returns The statement.
 */
function decodeDocumentStatementDetails(
  encoded: Option<PalletStatementStatementDetails>,
  stmtId: StatementId
): IStatementDetails {
  const chainStatement = encoded.unwrap()
  const statement: IStatementDetails = {
    uri: identifierToUri(stmtId) as StatementUri,
    digest: chainStatement.digest.toHex(),
    spaceUri: identifierToUri(
      DecoderUtils.hexToString(chainStatement.space.toString())
    ) as SpaceUri,
    schemaUri:
      (identifierToUri(
        DecoderUtils.hexToString(chainStatement.schema.toString())
      ) as SchemaUri) || undefined,
  }
  return statement
}

async function fetchRevocationStatus(
  api: ApiPromise,
  statement: StatementId,
  digest: HexString
): Promise<boolean> {
  const elementStatus = await api.query.statement.revocationList(
    statement,
    digest
  )
  return !elementStatus.isEmpty && elementStatus.unwrap().revoked.valueOf()
}

/**
 * @param schemaId
 * @param api
 * @param statement
 */
async function fetchStatementDetails(
  api: ApiPromise,
  statement: StatementId
): Promise<IStatementDetails | null> {
  const statementId = uriToIdentifier(statement)

  const statementEntry = await api.query.statement.statements(statementId)
  const decodedDetails = decodeDocumentStatementDetails(
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
 * @param api
 * @param statement
 * @param digest
 * @param stmtUri
 * @param stmtid
 * @param stmtId
 * @param docUri
 * @param docDigest
 */
async function fetchStatementElementStatus(
  api: ApiPromise,
  stmtId: StatementId,
  docDigest?: HexString
): Promise<IStatementStatus | null> {
  const statementDetails = await fetchStatementDetails(api, stmtId)
  if (statementDetails === null) {
    throw new SDKErrors.StatementError(
      `There is no statement with the provided ID "${stmtId}" present on the chain.`
    )
  }

  const schemaUri =
    statementDetails.schemaUri !== undefined
      ? documentUriToHex(statementDetails.schemaUri)
      : undefined

  const digest: HexString =
    docDigest !== undefined
      ? docDigest
      : (statementDetails.digest as StatementDigest)

  const elementStatusDetails = await api.query.statement.entries(stmtId, digest)

  if (elementStatusDetails === null) {
    throw new SDKErrors.StatementError(
      `There is no statement entry with the provided ID "${stmtId}" present on the chain.`
    )
  }
  const elementChainCreator = (
    elementStatusDetails as Option<AccountId32>
  ).unwrap()
  const elementCreator = fromChain(elementChainCreator)

  const revoked = await fetchRevocationStatus(api, stmtId, digest)

  const statementStatus: IStatementStatus = {
    uri: identifierToUri(stmtId) as StatementUri,
    digest,
    spaceUri: identifierToUri(statementDetails.spaceUri),
    creatorUri: elementCreator,
    schemaUri,
    revoked,
  }

  return statementStatus
}

/**
 * @param statement
 * @param docUri
 * @param chainSpace
 * @param spaceUri
 */
export async function fetchDocumentElementStatus(
  docUri: DocumentUri,
  spaceUri: SpaceUri
): Promise<IStatementStatus | null> {
  const api = ConfigService.get('api')

  const digest = documentUriToHex(docUri)
  const spaceId = uriToIdentifier(spaceUri)

  const statementLookup = await api.query.statement.identifierLookup(
    digest,
    spaceId
  )

  let statementId: StatementId
  if (!statementLookup.isEmpty) {
    const stmtIdChain = (statementLookup as Option<Bytes>).unwrap()
    statementId = DecoderUtils.hexToString(stmtIdChain.toString())
  } else {
    throw new SDKErrors.StatementError(
      `No associated statement entry for the URI "${docUri}".`
    )
  }

  const statementDetails = await fetchStatementElementStatus(
    api,
    statementId,
    digest
  )
  if (statementDetails === null) {
    throw new SDKErrors.StatementError(
      `No statement with the provided ID "${statementId}" present on the chain.`
    )
  }

  return statementDetails
}
