import * as Cord from '@cord.network/sdk'

/**
 * It creates a DID name for a DID
 * @param did - The DID of the DID owner
 * @param submitterAccount - The account that will be used to sign and submit the extrinsic.
 * @param name - The name you want to register.
 * @param signCallback - A callback function that will be called when the transaction needs to be
 * signed.
 */
export async function createDidName(
  did: Cord.DidUri,
  submitterAccount: Cord.CordKeyringPair,
  name: Cord.Did.DidName,
  signCallback: Cord.SignExtrinsicCallback
): Promise<void> {
  const api = Cord.ConfigService.get('api')

  console.log('Did - ', did, name)
  const didNameClaimTx = api.tx.didName.register(name)
  const authorizedDidNameClaimTx = await Cord.Did.authorizeTx(
    did,
    didNameClaimTx,
    signCallback,
    submitterAccount.address
  )
  await Cord.Chain.signAndSubmitTx(authorizedDidNameClaimTx, submitterAccount)
}
