import * as Cord from '@cord.network/sdk'

export async function revokeCredential(
  issuer: Cord.DidUri,
  submitterAccount: Cord.CordKeyringPair,
  signCallback: Cord.SignExtrinsicCallback,
  credential: Cord.ICredential,
  shouldRemove = false
): Promise<void> {
  const api = Cord.ConfigService.get('api')
  const chainIdentifier = Cord.Stream.idToChain(credential.identifier)
  const tx = shouldRemove
    ? api.tx.stream.remove(chainIdentifier, null)
    : api.tx.stream.revoke(chainIdentifier, null)

  const authorizedTx = await Cord.Did.authorizeTx(
    issuer,
    tx,
    signCallback,
    submitterAccount.address
  )

  // Submit the tx.
  await Cord.Chain.signAndSubmitTx(authorizedTx, submitterAccount)
}
