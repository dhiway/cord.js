import * as Cord from '@cord.network/sdk'
import { naclSeal } from '@polkadot/util-crypto'

export function useEncryptionCallback({
  keyAgreement,
  keyAgreementUri,
}: {
  keyAgreement: Cord.CordEncryptionKeypair
  keyAgreementUri: Cord.DidResourceUri
}): Cord.EncryptCallback {
  return async function encryptCallback({
    data,
    peerPublicKey,
  }): Promise<Cord.EncryptResponseData> {
    const { sealed, nonce } = naclSeal(
      data,
      keyAgreement.secretKey,
      peerPublicKey
    )
    return {
      nonce,
      data: sealed,
      keyUri: keyAgreementUri,
    }
  }
}
