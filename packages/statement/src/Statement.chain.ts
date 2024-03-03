/**
 * @packageDocumentation
 * @module Statement/Chain
 *
 * The `Statement/Chain` submodule is a crucial part of the CORD blockchain's statement management system.
 * It focuses on the interactions with the blockchain, specifically handling the storage, retrieval,
 * and manipulation of statement data directly on-chain. This submodule provides a bridge between the high-level
 * statement functionalities and the lower-level blockchain operations, enabling efficient and secure management
 * of statement data within the CORD ecosystem.
 *
 * Key functionalities of the `Statement/Chain` submodule include:
 * - `dispatchRegisterToChain`: Submits a new statement registration request to the blockchain.
 * - `dispatchUpdateToChain`: Handles the submission of statement updates to the blockchain.
 * - `dispatchRevokeToChain`: Manages the revocation of statements on the blockchain.
 * - `dispatchRestoreToChain`: Facilitates the restoration of previously revoked statements.
 * - `fetchStatementDetailsfromChain`: Retrieves the current status of a statement from the blockchain.
 *
 * This submodule plays a pivotal role in maintaining the integrity, authenticity, and traceability of statements
 * on the CORD blockchain, ensuring that they are managed in a decentralized and transparent manner.
 *
 * @example
 * ```typescript
 * // Example: Registering a new statement on the blockchain
 * const statementEntry = // ... statement entry ...
 * const creatorUri = 'did:cord:creator_uri';
 * const authorAccount = // ... account info ...
 * const authorizationUri = 'auth:cord:example_uri';
 * const signCallback = // ... sign function ...
 * dispatchRegisterToChain(statementEntry, creatorUri, authorAccount, authorizationUri, signCallback)
 *   .then(uri => console.log(`Statement registered with URI: ${uri}`))
 *   .catch(error => console.error(`Error registering statement: ${error}`));
 *
 * // Example: Fetching statement status from the blockchain
 * const statementUri = 'stmt:cord:example_uri';
 * fetchStatementStatusfromChain(statementUri)
 *   .then(status => console.log(`Statement status: ${status}`))
 *   .catch(error => console.error(`Error fetching statement status: ${error}`));
 * ```
 */
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
  SubmittableExtrinsic,
} from '@cord.network/types'
import * as Did from '@cord.network/did'
import {
  uriToIdentifier,
  buildStatementUri,
  identifierToUri,
  uriToStatementIdAndDigest,
} from '@cord.network/identifier'
import type { PalletStatementStatementDetails } from '@cord.network/augment-api'
import { DecoderUtils, SDKErrors } from '@cord.network/utils'
import { Chain } from '@cord.network/network'
import { blake2AsHex, H256 } from '@cord.network/types'

/**
 * Checks if a statement is stored on the CORD blockchain.
 *
 * @remarks
 * This function queries the blockchain to determine whether a statement with a given digest and space URI exists.
 * It returns `true` if the statement exists and `false` otherwise. This is useful for verifying the presence of
 * a specific statement on the blockchain, aiding in data integrity checks and validations.
 *
 * @param digest - The hexadecimal string representing the digest of the statement to check.
 * @param spaceUri - The unique identifier of the space where the statement is expected to be stored.
 * @returns A promise that resolves to `true` if the statement is stored, or `false` otherwise.
 *
 * @example
 * ```typescript
 * const digest = '0x1234abcd...';
 * const spaceUri = 'space:cord:example_uri';
 *
 * isStatementStored(digest, spaceUri)
 *   .then(isStored => {
 *     if (isStored) {
 *       console.log('Statement is stored on the blockchain.');
 *     } else {
 *       console.log('Statement not found.');
 *     }
 *   })
 *   .catch(error => console.error('Error querying the blockchain:', error));
 * ```
 *
 * @internal
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
 * Generates a unique URI for a statement based on its digest, space URI, and creator URI.
 *
 * @remarks
 * This function constructs a statement URI by combining the provided digest with the identifiers
 * of the space and the creator. It's a crucial function for creating a standard and unique identifier
 * for statements on the CORD blockchain.
 *
 * @param digest - The hexadecimal string representing the digest of the statement.
 * @param spaceUri - The unique identifier of the space related to the statement.
 * @param creatorUri - The decentralized identifier (DID) URI of the creator of the statement.
 * @returns The unique URI that represents the statement on the blockchain.
 *
 * @example
 * ```typescript
 * const digest = '0x1234abcd...';
 * const spaceUri = 'space:cord:example_uri';
 * const creatorUri = 'did:cord:creator_uri';
 *
 * const statementUri = getUriForStatement(digest, spaceUri, creatorUri);
 * console.log('Statement URI:', statementUri);
 * ```
 *
 * @internal
 */
export function getUriForStatement(
  digest: HexString,
  spaceUri: SpaceUri,
  creatorUri: DidUri
): StatementUri {
  const api = ConfigService.get('api')

  const scaleEncodedSchema = api.createType<H256>('H256', digest).toU8a()
  const scaleEncodedSpace = api
    .createType<Bytes>('Bytes', uriToIdentifier(spaceUri))
    .toU8a()
  const scaleEncodedCreator = api
    .createType<AccountId>('AccountId', Did.toChain(creatorUri))
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
 * This function dispatches a statement entry to a blockchain after preparing the extrinsic
 * and signing it.
 *
 * @remarks
 * This function is responsible for registering a new statement on the blockchain.
 * It checks if the statement with the given digest and space URI already exists on the chain.
 * If it does not exist, the function constructs and submits a transaction to register the statement.
 * The transaction is authorized by the creator and signed by the provided author account.
 *
 * @param stmtEntry - The statement entry object containing the necessary information
 *        for registering the statement on the blockchain. This includes the digest, element URI,
 *        creator URI, space URI, and optionally a schema URI.
 * @param creatorUri - The DID URI of the creator of the statement. This identifier is
 *        used to authorize the transaction.
 * @param authorAccount - The blockchain account used to sign and submit the transaction.
 * @param authorizationUri - The URI of the authorization used for the statement.
 * @param signCallback - A callback function that handles the signing of the transaction.
 * @returns The element URI of the registered statement.
 *
 * @throws {SDKErrors.CordDispatchError} - Thrown when there is an error during the dispatch process,
 *         such as issues with constructing the transaction, signing, or submission to the blockchain.
 *
 * @example
 * ```typescript
 * const stmtEntry = {
 *   // ... initialization of statement properties ...
 * };
 * const creatorUri = 'did:cord:creator_uri';
 * const authorAccount = // ... initialization ...
 * const authorizationUri = 'auth:cord:example_uri';
 * const signCallback = // ... implementation ...
 *
 * dispatchRegisterToChain(stmtEntry, creatorUri, authorAccount, authorizationUri, signCallback)
 *   .then(statementUri => {
 *     console.log('Statement registered with URI:', statementUri);
 *   })
 *   .catch(error => {
 *     console.error('Error dispatching statement to chain:', error);
 *   });
 * ```
 */
export async function dispatchRegisterToChain(
  stmtEntry: IStatementEntry,
  creatorUri: DidUri,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<StatementUri> {
  try {
    const tx = await prepareExtrinsicToRegister(
      stmtEntry,
      creatorUri,
      authorAccount,
      authorizationUri,
      signCallback
    )

    await Chain.signAndSubmitTx(tx, authorAccount)

    return stmtEntry.elementUri
  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${error}".`
    )
  }
}

/**
 * This function prepares and returns a SubmittableExtrinsic for registering a statement on
 * the blockchain.
 * @param {IStatementEntry} stmtEntry - The `stmtEntry` parameter is an object of type
 * `IStatementEntry`, which contains information about a statement entry.
 *
 * @param {DidUri} creatorUri - The `creatorUri` parameter is a URI that identifies the creator of the
 * statement entry. It is used to authorize the transaction when preparing the extrinsic.
 *
 * @param {CordKeyringPair} authorAccount - The `authorAccount` parameter in the `prepareExtrinsic`
 * function is of type `CordKeyringPair`. It represents the keyring pair used for signing the extrinsic
 * transaction. This keyring pair contains the cryptographic key pair necessary for signing and
 * verifying messages in the Corda network.
 *
 * @param {AuthorizationUri} authorizationUri - The `authorizationUri` parameter in the
 * `prepareExtrinsic` function is a URI that represents the authorization needed for the statement
 * entry. It is used to identify and retrieve the authorization details required for registering the
 * statement on the chain.
 *
 * @param {SignExtrinsicCallback} signCallback - The `signCallback` parameter in the `prepareExtrinsic`
 * function is a callback function that is used to sign the extrinsic transaction before it is
 * submitted to the blockchain. This function typically takes care of the signing process using the
 * private key of the account that is authorizing the transaction. It is
 *
 * @returns A `SubmittableExtrinsic` is being returned from the `prepareExtrinsic` function.
 */
export async function prepareExtrinsicToRegister(
  stmtEntry: IStatementEntry,
  creatorUri: DidUri,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<SubmittableExtrinsic> {
  try {
    const api = ConfigService.get('api')
    const authorizationId: AuthorizationId = uriToIdentifier(authorizationUri)
    const schemaId =
      stmtEntry.schemaUri !== undefined
        ? stmtEntry.schemaUri && uriToIdentifier(stmtEntry.schemaUri)
        : undefined

    const exists = await isStatementStored(stmtEntry.digest, stmtEntry.spaceUri)

    if (exists) {
      throw new SDKErrors.DuplicateStatementError(
        `The statement is already anchored in the chain\nIdentifier: ${stmtEntry.elementUri}`
      )
    }

    const tx = schemaId
      ? api.tx.statement.register(stmtEntry.digest, authorizationId, schemaId)
      : api.tx.statement.register(stmtEntry.digest, authorizationId, null)

    const extrinsic = await Did.authorizeTx(
      creatorUri,
      tx,
      signCallback,
      authorAccount.address
    )

    return extrinsic
  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error returning extrinsic: "${error}".`
    )
  }
}

/**
 * Dispatches a statement update transaction to the CORD blockchain.
 *
 * @remarks
 * This function is used to update an existing statement on the blockchain.
 * It first checks if the statement with the given digest and space URI already exists.
 * If it does, the function constructs and submits a transaction to update the statement.
 * The transaction is authorized by the creator and signed by the provided author account.
 *
 * @param stmtEntry - The statement entry object containing the necessary information
 *        for updating the statement on the blockchain. This includes the digest, element URI,
 *        creator URI, space URI, and optionally a schema URI.
 * @param creatorUri - The DID URI of the creator of the statement. This identifier is
 *        used to authorize the transaction.
 * @param authorAccount - The blockchain account used to sign and submit the transaction.
 * @param authorizationUri - The URI of the authorization used for the statement.
 * @param signCallback - A callback function that handles the signing of the transaction.
 * @returns The element URI of the updated statement.
 *
 * @throws {SDKErrors.CordDispatchError} - Thrown when there is an error during the dispatch process,
 *         such as issues with constructing the transaction, signing, or submission to the blockchain.
 *
 * @example
 * ```typescript
 * const stmtEntry = {
 *   // ... initialization of statement properties ...
 * };
 * const creatorUri = 'did:cord:creator_uri';
 * const authorAccount = // ... initialization ...
 * const authorizationUri = 'auth:cord:example_uri';
 * const signCallback = // ... implementation ...
 *
 * dispatchUpdateToChain(stmtEntry, creatorUri, authorAccount, authorizationUri, signCallback)
 *   .then(statementUri => {
 *     console.log('Statement updated with URI:', statementUri);
 *   })
 *   .catch(error => {
 *     console.error('Error dispatching statement update to chain:', error);
 *   });
 * ```
 */
export async function dispatchUpdateToChain(
  stmtEntry: IStatementEntry,
  creatorUri: DidUri,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<StatementUri> {
  try {
    const api = ConfigService.get('api')
    const authorizationId: AuthorizationId = uriToIdentifier(authorizationUri)

    const exists = await isStatementStored(stmtEntry.digest, stmtEntry.spaceUri)

    if (exists) {
      return stmtEntry.elementUri
    }

    const stmtIdDigest = uriToStatementIdAndDigest(stmtEntry.elementUri)
    const tx = api.tx.statement.update(
      stmtIdDigest.identifier,
      stmtEntry.digest,
      authorizationId
    )

    const extrinsic = await Did.authorizeTx(
      creatorUri,
      tx,
      signCallback,
      authorAccount.address
    )

    await Chain.signAndSubmitTx(extrinsic, authorAccount)

    return stmtEntry.elementUri
  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${error}".`
    )
  }
}

/**
 * This function dispatches a revocation transaction to a blockchain network after preparing
 * the necessary extrinsic data.
 * @param {StatementUri} statementUri - The `statementUri` parameter represents the URI of the
 * statement that you want to revoke on the chain.
 *
 * @param {DidUri} creatorUri - The `creatorUri` parameter in the `dispatchRevokeToChain` function is a
 * URI that identifies the creator of a statement. It is used to specify the creator of the statement
 * that is being revoked on the blockchain.
 *
 * @param {CordKeyringPair} authorAccount - The `authorAccount` parameter in the
 * `dispatchRevokeToChain` function is a `CordKeyringPair` object representing the account of the
 * author who is revoking the statement. This object typically contains the public key, private key,
 * and other account information needed to sign and submit transactions
 *
 * @param {AuthorizationUri} authorizationUri - The `authorizationUri` parameter in the
 * `dispatchRevokeToChain` function is a Uniform Resource Identifier (URI) that specifies the location
 * or identifier of the authorization being revoked. It is used to identify the specific authorization
 * that is being revoked in the context of the operation being performed.
 *
 * @param {SignExtrinsicCallback} signCallback - The `signCallback` parameter in the
 * `dispatchRevokeToChain` function is a callback function that is used to sign the extrinsic before
 * submitting it to the chain. This callback function typically takes care of signing the transaction
 * using the private key of the account associated with the author of the statement.
 */
export async function dispatchRevokeToChain(
  statementUri: StatementUri,
  creatorUri: DidUri,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<void> {
  try {
    const tx = await prepareExtrinsicToRevoke(
      statementUri,
      creatorUri,
      authorAccount,
      authorizationUri,
      signCallback
    )

    await Chain.signAndSubmitTx(tx, authorAccount)
  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${error}".`
    )
  }
}

/**
 * Dispatches a statement revocation transaction to the CORD blockchain.
 *
 * @remarks
 * This function is responsible for revoking an existing statement on the blockchain.
 * It constructs and submits a transaction to revoke the statement identified by the given URI.
 * The transaction is authorized by the creator and signed by the provided author account.
 *
 * @param statementUri - The URI of the statement to be revoked.
 * @param creatorUri - The DID URI of the creator of the statement. This identifier is
 *        used to authorize the transaction.
 * @param authorAccount - The blockchain account used to sign and submit the transaction.
 * @param authorizationUri - The URI of the authorization used for the statement.
 * @param signCallback - A callback function that handles the signing of the transaction.
 * @returns A promise that resolves once the transaction is successfully processed.
 *
 * @throws {SDKErrors.CordDispatchError} - Thrown when there is an error during the dispatch process,
 *         such as issues with constructing the transaction, signing, or submission to the blockchain.
 *
 * @example
 * ```typescript
 * const statementUri = 'stmt:cord:example_uri';
 * const creatorUri = 'did:cord:creator_uri';
 * const authorAccount = // ... initialization ...
 * const authorizationUri = 'auth:cord:example_uri';
 * const signCallback = // ... implementation ...
 *
 * dispatchRevokeToChain(statementUri, creatorUri, authorAccount, authorizationUri, signCallback)
 *   .then(() => {
 *     console.log('Statement successfully revoked.');
 *   })
 *   .catch(error => {
 *     console.error('Error dispatching statement revocation to chain:', error);
 *   });
 * ```
 */
export async function prepareExtrinsicToRevoke(
  statementUri: StatementUri,
  creatorUri: DidUri,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<SubmittableExtrinsic> {
  try {
    const api = ConfigService.get('api')
    const authorizationId: AuthorizationId = uriToIdentifier(authorizationUri)

    const stmtIdDigest = uriToStatementIdAndDigest(statementUri)
    const stmtId = stmtIdDigest.identifier

    const tx = api.tx.statement.revoke(stmtId, authorizationId)

    const extrinsic = await Did.authorizeTx(
      creatorUri,
      tx,
      signCallback,
      authorAccount.address
    )

    return extrinsic
  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error returning extrinsic:: "${error}".`
    )
  }
}

/**
 * Dispatches a statement restoration transaction to the CORD blockchain.
 *
 * @remarks
 * This function is responsible for restoring a previously revoked statement on the blockchain.
 * It constructs and submits a transaction to restore the statement identified by the given URI.
 * The transaction is authorized by the creator and signed by the provided author account.
 *
 * @param statementUri - The URI of the statement to be restored.
 * @param creatorUri - The DID URI of the creator of the statement. This identifier is
 *        used to authorize the transaction.
 * @param authorAccount - The blockchain account used to sign and submit the transaction.
 * @param authorizationUri - The URI of the authorization used for the statement.
 * @param signCallback - A callback function that handles the signing of the transaction.
 * @returns A promise that resolves once the transaction is successfully processed.
 *
 * @throws {SDKErrors.CordDispatchError} - Thrown when there is an error during the dispatch process,
 *         such as issues with constructing the transaction, signing, or submission to the blockchain.
 *
 * @example
 * ```typescript
 * const statementUri = 'stmt:cord:example_uri';
 * const creatorUri = 'did:cord:creator_uri';
 * const authorAccount = // ... initialization ...
 * const authorizationUri = 'auth:cord:example_uri';
 * const signCallback = // ... implementation ...
 *
 * dispatchRestoreToChain(statementUri, creatorUri, authorAccount, authorizationUri, signCallback)
 *   .then(() => {
 *     console.log('Statement successfully restored.');
 *   })
 *   .catch(error => {
 *     console.error('Error dispatching statement restoration to chain:', error);
 *   });
 * ```
 */
export async function dispatchRestoreToChain(
  statementUri: StatementUri,
  creatorUri: DidUri,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<void> {
  try {
    const api = ConfigService.get('api')
    const authorizationId: AuthorizationId = uriToIdentifier(authorizationUri)

    const stmtIdDigest = uriToStatementIdAndDigest(statementUri)
    const stmtId = stmtIdDigest.identifier

    const tx = api.tx.statement.restore(stmtId, authorizationId)

    const extrinsic = await Did.authorizeTx(
      creatorUri,
      tx,
      signCallback,
      authorAccount.address
    )

    await Chain.signAndSubmitTx(extrinsic, authorAccount)
  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${error}".`
    )
  }
}

/**
 * Decodes statement details from their blockchain-encoded format.
 *
 * @remarks
 * This function is utilized to transform blockchain-specific encoded data of a statement into a more accessible format,
 * conforming to the `IStatementDetails` interface. It decodes the statement's details, including its digest, space URI, and schema URI.
 *
 * @param encoded - The encoded data of the statement, retrieved directly from the blockchain.
 * @param identifier - The identifier of the statement, used to construct its URI.
 * @returns An `IStatementDetails` object containing the decoded details of the statement.
 *
 * @example
 * ```typescript
 * const encodedData = // ... blockchain response ...
 * const statementIdentifier = 'example_identifier';
 * const statementDetails = decodeStatementDetailsfromChain(encodedData, statementIdentifier);
 * console.log('Decoded Statement Details:', statementDetails);
 * ```
 *
 * @internal
 */
export function decodeStatementDetailsfromChain(
  encoded: Option<PalletStatementStatementDetails>,
  identifier: string
): IStatementDetails {
  const chainStatement = encoded.unwrap()
  const schemaDetails =
    DecoderUtils.hexToString(chainStatement.schema.toString()) || undefined

  const schemaUri =
    schemaDetails !== undefined
      ? (identifierToUri(schemaDetails) as SchemaUri)
      : undefined

  const statement: IStatementDetails = {
    uri: identifierToUri(identifier) as StatementUri,
    digest: chainStatement.digest.toHex(),
    spaceUri: identifierToUri(
      DecoderUtils.hexToString(chainStatement.space.toString())
    ) as SpaceUri,
    schemaUri,
  }
  return statement
}

/**
 * Retrieves detailed state information of a statement from the CORD blockchain.
 *
 * @remarks
 * This internal function fetches and decodes the details of a statement, identified by its unique identifier, from the blockchain.
 * It returns the detailed information of the statement, including its digest, space URI, and schema URI.
 *
 * @param identifier - The unique identifier of the statement whose details are being fetched.
 * @returns A promise that resolves to an `IStatementDetails` object containing detailed information about the statement,
 *          or `null` if the statement is not found.
 *
 * @throws {SDKErrors.StatementError} - Thrown when no statement with the provided identifier is found on the blockchain.
 *
 * @example
 * ```typescript
 * const statementId = 'example_identifier';
 * getDetailsfromChain(statementId)
 *   .then(statementDetails => {
 *     console.log('Statement Details:', statementDetails);
 *   })
 *   .catch(error => {
 *     console.error('Error fetching statement details from chain:', error);
 *   });
 * ```
 *
 * @internal
 */
export async function getDetailsfromChain(
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
 * Fetches the state of a statement element from the CORD blockchain.
 *
 * @remarks
 * This function queries the blockchain to retrieve the current state of a statement,
 * identified by its URI. It returns comprehensive details about the statement, including its
 * digest, space URI, creator URI, schema URI (if applicable), and revocation status.
 *
 * @param stmtUri - The URI of the statement whose status is being fetched.
 * @returns A promise that resolves to an `IStatementStatus` object containing the statement's details,
 *          or `null` if the statement is not found.
 *
 * @throws {SDKErrors.StatementError} - Thrown when the statement or its entry is not found on the blockchain.
 *
 * @example
 * ```typescript
 * const statementUri = 'stmt:cord:example_uri';
 * fetchStatementStatusfromChain(statementUri)
 *   .then(statementStatus => {
 *     console.log('Statement Status:', statementStatus);
 *   })
 *   .catch(error => {
 *     console.error('Error fetching statement status from chain:', error);
 *   });
 * ```
 */
export async function fetchStatementDetailsfromChain(
  stmtUri: StatementUri
): Promise<IStatementStatus | null> {
  const api = ConfigService.get('api')
  const { identifier, digest } = uriToStatementIdAndDigest(stmtUri)

  const statementDetails = await getDetailsfromChain(identifier)
  if (statementDetails === null) {
    throw new SDKErrors.StatementError(
      `There is no statement with the provided ID "${identifier}" present on the chain.`
    )
  }

  const schemaUri =
    statementDetails.schemaUri !== undefined
      ? identifierToUri(statementDetails.schemaUri)
      : undefined

  const spaceUri = identifierToUri(statementDetails.spaceUri)

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
    spaceUri,
    creatorUri: elementCreator,
    schemaUri,
    revoked,
  }

  return statementStatus
}
