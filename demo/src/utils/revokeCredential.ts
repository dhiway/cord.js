import * as Cord from '@cord.network/sdk'

/**
 * It revokes or remove a statement from CORD
 * @param issuer - The DID of the issuer.
 * @param authorAccount - The account that will be used to sign and submit the extrinsic.
 * @param signCallback - A callback function that will be called when the transaction needs to be
 * signed.
 * @param document - The document to revoke.
 * @param [shouldRemove=false] - If true, the credential will be removed from the blockchain. If false,
 * the credential will be revoked.
 */
export async function revokeCredential(
  issuer: Cord.DidUri,
  authorAccount: Cord.CordKeyringPair,
  signCallback: Cord.SignExtrinsicCallback,
  document: Cord.IDocument,
  authorization: Cord.AuthorizationId
): Promise<void> {
  const api = Cord.ConfigService.get('api')
  const chainIdentifier = Cord.Identifier.uriToIdentifier(document.identifier)
  const authorizationId = Cord.Identifier.uriToIdentifier(authorization)

  const tx = api.tx.statement.revoke(chainIdentifier, authorizationId)

  const authorizedTx = await Cord.Did.authorizeTx(
    issuer,
    tx,
    signCallback,
    authorAccount.address
  )

  // Submit the tx.
  await Cord.Chain.signAndSubmitTx(authorizedTx, authorAccount)
}
