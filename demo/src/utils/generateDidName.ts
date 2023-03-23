import * as Cord from '@cord.network/sdk'

export async function createDidName(
  did: Cord.DidUri,
  submitterAccount: Cord.CordKeyringPair,
  name: Cord.Did.DidName,
  signCallback: Cord.SignExtrinsicCallback
): Promise<void> {
  const api = Cord.ConfigService.get('api')

  const didNameClaimTx = api.tx.didNames.register(name)
  const authorizedDidNameClaimTx = await Cord.Did.authorizeTx(
    did,
    didNameClaimTx,
    signCallback,
    submitterAccount.address
  )
  await Cord.Chain.signAndSubmitTx(authorizedDidNameClaimTx, submitterAccount)
}
