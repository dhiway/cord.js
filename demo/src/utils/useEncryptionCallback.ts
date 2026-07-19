import * as Cord from '@cord.network/sdk'
import nacl from 'tweetnacl'

/**
 * It takes a keyAgreement and keyAgreementUri and returns a function that takes a data and
 * peerPublicKey and returns a nonce, data, and keyUri
 * @param  - `keyAgreement` is the keypair that will be used to encrypt the data.
 * @returns A function that takes an object with two properties: data and peerPublicKey.
 */
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
    const nonce = nacl.randomBytes(nacl.box.nonceLength)
    const sealed = nacl.box(data, nonce, peerPublicKey, keyAgreement.secretKey)
    return {
      nonce,
      data: sealed,
      keyUri: keyAgreementUri,
    }
  }
}
