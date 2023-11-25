import { ConfigService } from '@cord.network/config'
import type {
  IStatementStatus,
  IStatementDetails,
  Option,
  AccountId32,
  DidUri,
  CordKeyringPair,
  SignExtrinsicCallback,
  SpaceId,
  Bytes,
  AccountId,
  SpaceUri,
  AuthorizationUri,
  AuthorizationId,
  StatementUri,
  SchemaUri,
  IStatementEntry,
  HexString,
} from '@cord.network/types'
import * as Did from '@cord.network/did'
import {
  uriToIdentifier,
  documentUriToHex,
  buildStatementUri,
  identifierToUri,
  uriToStatementIdAndDigest,
} from '@cord.network/identifier'
import type { PalletStatementStatementDetails } from '@cord.network/augment-api'
import { DecoderUtils, SDKErrors } from '@cord.network/utils'
import { Chain } from '@cord.network/network'
import { blake2AsHex, H256 } from '@cord.network/types'
/**
 * @param schema
 * @param digest
 * @param space
 * @param docUri
 * @param spaceUri
 */
export async function isStatementStored(
  digest: HexString,
  spaceUri: SpaceId
): Promise<boolean> {
  const api = ConfigService.get('api')
  const space = uriToIdentifier(spaceUri)
  const encoded = await api.query.statement.identifierLookup(digest, space)

  return !encoded.isNone
}

/**
 * @param schema
 * @param digest
 * @param docUri
 * @param spaceUri
 * @param creator
 * @param space
 */
export function getUriForStatement(
  digest: HexString,
  spaceUri: SpaceUri,
  creator: DidUri
): StatementUri {
  const api = ConfigService.get('api')

  const scaleEncodedSchema = api.createType<H256>('H256', digest).toU8a()
  const scaleEncodedSpace = api
    .createType<Bytes>('Bytes', uriToIdentifier(spaceUri))
    .toU8a()
  const scaleEncodedCreator = api
    .createType<AccountId>('AccountId', Did.toChain(creator))
    .toU8a()
  const IdDigest = blake2AsHex(
    Uint8Array.from([
      ...scaleEncodedSchema,
      ...scaleEncodedSpace,
      ...scaleEncodedCreator,
    ])
  )
  const statementUri = buildStatementUri(IdDigest, digest)

  return statementUri
}

/**
 * @param schema
 * @param document
 * @param stmtEntry
 * @param creator
 * @param authorAccount
 * @param authorization
 * @param authorizationUri
 * @param signCallback
 */
export async function dispatchRegisterToChain(
  stmtEntry: IStatementEntry,
  creator: DidUri,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<StatementUri> {
  try {
    const api = ConfigService.get('api')

    const authorizationId: AuthorizationId = uriToIdentifier(authorizationUri)

    const schemaId =
      stmtEntry.schemaUri !== undefined
        ? stmtEntry.schemaUri && uriToIdentifier(stmtEntry.schemaUri)
        : undefined

    const stmtUri = getUriForStatement(
      stmtEntry.digest,
      stmtEntry.spaceUri,
      creator
    )
    const exists = await isStatementStored(stmtEntry.digest, stmtEntry.spaceUri)

    if (exists) {
      return stmtUri
    }

    const tx = schemaId
      ? api.tx.statement.register(stmtEntry.digest, authorizationId, schemaId)
      : api.tx.statement.register(stmtEntry.digest, authorizationId, null)

    const extrinsic = await Did.authorizeTx(
      creator,
      tx,
      signCallback,
      authorAccount.address
    )

    await Chain.signAndSubmitTx(extrinsic, authorAccount)

    return stmtUri
  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${error}".`
    )
  }
}

/**
 * Decodes the statement returned by `api.query.statement.statements()`.
 *
 * @param encoded Raw statement data from blockchain.
 * @param identifier The statement identifier.
 * @param docUri
 * @param stmtUri
 * @returns The statement.
 */
export function decodeStatementDetailsfromChain(
  encoded: Option<PalletStatementStatementDetails>,
  identifier: string
): IStatementDetails {
  const chainStatement = encoded.unwrap()
  const statement: IStatementDetails = {
    uri: identifierToUri(identifier) as StatementUri,
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

/**
 * @param schemaId
 * @param statement
 * @param identifier
 */
export async function getStatementDetailsfromChain(
  identifier: string
): Promise<IStatementDetails | null> {
  const api = ConfigService.get('api')
  const statementId = uriToIdentifier(identifier)

  const statementEntry = await api.query.statement.statements(statementId)
  const decodedDetails = decodeStatementDetailsfromChain(
    statementEntry,
    identifier
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
 * @param stmtUri
 * @param docUri
 */
export async function getStatementStatusfromChain(
  stmtUri: StatementUri
): Promise<IStatementStatus | null> {
  const api = ConfigService.get('api')
  const { identifier, digest } = uriToStatementIdAndDigest(stmtUri)

  const statementDetails = await getStatementDetailsfromChain(identifier)
  if (statementDetails === null) {
    throw new SDKErrors.StatementError(
      `There is no statement with the provided ID "${identifier}" present on the chain.`
    )
  }

  const schemaUri =
    statementDetails.schemaUri !== undefined
      ? documentUriToHex(statementDetails.schemaUri)
      : undefined

  const elementStatusDetails = await api.query.statement.entries(
    identifier,
    digest
  )

  if (elementStatusDetails === null) {
    throw new SDKErrors.StatementError(
      `There is no entry with the provided ID "${identifier}" and digest "${digest}" present on the chain.`
    )
  }

  const elementChainCreator = (
    elementStatusDetails as Option<AccountId32>
  ).unwrap()
  const elementCreator = Did.fromChain(elementChainCreator)

  const elementStatus = await api.query.statement.revocationList(
    identifier,
    digest
  )

  let revoked = false
  if (!elementStatus.isEmpty) {
    const encodedStatus = elementStatus.unwrap()
    revoked = encodedStatus.revoked.valueOf()
  }

  const statementStatus: IStatementStatus = {
    uri: statementDetails.uri,
    digest,
    spaceUri: identifierToUri(statementDetails.spaceUri),
    creatorUri: elementCreator,
    schemaUri,
    revoked,
  }

  return statementStatus
}
