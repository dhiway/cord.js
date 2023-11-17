import * as Cord from '@cord.network/sdk'

/**
 * It creates a statement object on the blockchain
 * @param issuer - The DID of the issuer of the document
 * @param authorAccount - The account that will be used to sign the extrinsic.
 * @param signCallback - A callback function that signs the extrinsic.
 * @param document - The document to be referenced by the statement
 */
export async function updateStatement(
  document: Cord.IDocument,
  issuer: Cord.DidUri,
  authorization: Cord.AuthorizationId,
  authorAccount: Cord.CordKeyringPair,
  signCallback: Cord.SignExtrinsicCallback
): Promise<void> {
  const api = Cord.ConfigService.get('api')

  // Create a statement object
  const statementDetails = Cord.Statement.fromDocument(document)
  const statementId = Cord.Identifier.uriToIdentifier(document.identifier)
  const authorizationId = Cord.Identifier.uriToIdentifier(authorization)

  const statementTx = api.tx.statement.update(
    statementId,
    statementDetails.digest,
    authorizationId
  )

  const authorizedStatementTx = await Cord.Did.authorizeTx(
    issuer,
    statementTx,
    signCallback,
    authorAccount.address
  )
  await Cord.Chain.signAndSubmitTx(authorizedStatementTx, authorAccount)
}
