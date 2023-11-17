import * as Cord from '@cord.network/sdk'

/**
 * It creates a statement object on the blockchain
 * @param issuer - The DID of the issuer of the document
 * @param authorAccount - The account that will be used to sign the extrinsic.
 * @param signCallback - A callback function that signs the extrinsic.
 * @param document - The document to be referenced by the statement
 */
export async function createStatement(
  document: Cord.IDocument,
  issuer: Cord.DidUri,
  authorization: Cord.AuthorizationId,
  authorAccount: Cord.CordKeyringPair,
  signCallback: Cord.SignExtrinsicCallback
): Promise<void> {
  const api = Cord.ConfigService.get('api')

  // Create a statement object
  const statementDetails = Cord.Statement.fromDocument(document)
  const authorizationId = Cord.Identifier.uriToIdentifier(authorization)
  const schemaId = Cord.Identifier.uriToIdentifier(document.content.schemaId)
  // To create a statement without a schema, use the following line instead:
  // const schemaId = null
  // make sure the registry is not linked with a schema for this to work
  const statementTx = api.tx.statement.register(
    statementDetails.digest,
    authorizationId,
    schemaId
  )

  const authorizedStatementTx = await Cord.Did.authorizeTx(
    issuer,
    statementTx,
    signCallback,
    authorAccount.address
  )
  await Cord.Chain.signAndSubmitTx(authorizedStatementTx, authorAccount)
}
