import * as Cord from '@cord.network/sdk'
import { naclOpen } from '@polkadot/util-crypto'

/**
 * It takes a keypair and returns a function that takes an encrypted message and returns the decrypted
 * message
 * @param keyAgreement - Cord.CordEncryptionKeypair
 * @returns A function that takes an object with data, nonce, and peerPublicKey properties and returns
 * a promise that resolves to an object with a data property.
 */
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
