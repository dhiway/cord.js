import * as Cord from '@cord.network/sdk'
import { naclOpen } from '@polkadot/util-crypto'

export function useDecryptionCallback(
  keyAgreement: Cord.CordEncryptionKeypair
): Cord.DecryptCallback {
  return async function decryptCallback({
    data,
    nonce,
    peerPublicKey,
  }): Promise<Cord.DecryptResponseData> {
    const decrypted = naclOpen(
      data,
      nonce,
      peerPublicKey,
      keyAgreement.secretKey
    )

    if (!decrypted) {
      throw new Error('Failed to decrypt with given key')
    }

    return {
      data: decrypted,
    }
  }
}
