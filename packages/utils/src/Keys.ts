import {
  blake2AsU8a,
  CordKeyringPair,
  ICordKeyPair,
  Keyring,
  mnemonicGenerate,
} from '@cord.network/types'

import { makeEncryptionKeypairFromSeed } from './Crypto.js'

function normalizeKeyType(type = 'ed25519'): 'ed25519' | 'sr25519' | 'ecdsa' {
  if (type === 'sr25519' || type === 'ecdsa') {
    return type
  }

  return 'ed25519'
}

function generateKeyAgreement(
  account: CordKeyringPair
) {
  const keyAgreementPair = account.derive('//did//keyAgreement//0') as CordKeyringPair
  return makeEncryptionKeypairFromSeed(blake2AsU8a(keyAgreementPair.secretKey))
}

/**
 * This function takes a mnemonic, creates an account from the mnemonic, and then derives four keypairs from
 * the account
 * @param mnemonic - A string of words that can be used to recover the keypairs.
 * @param keytype - type of key to generate, supports 'ed25519' (default), 'sr25519', and 'ecdsa'
 * @returns An object with 4 keyring pairs.
 */
export function generateKeypairs(
  mnemonic: string,
  keytype?: string
): ICordKeyPair {
  const normalizedMnemonic = mnemonic || mnemonicGenerate()
  const normalizedKeyType = normalizeKeyType(keytype)
  const keyring = new Keyring({
    ss58Format: 29,
    type: normalizedKeyType,
  })

  const account = keyring.addFromMnemonic(normalizedMnemonic) as CordKeyringPair

  const authentication = {
    ...account.derive('//did//authentication//0'),
    type: normalizedKeyType,
  } as CordKeyringPair

  const assertionMethod = {
    ...account.derive('//did//assertion//0'),
    type: normalizedKeyType,
  } as CordKeyringPair

  const capabilityDelegation = {
    ...account.derive('//did//delegation//0'),
    type: normalizedKeyType,
  } as CordKeyringPair

  const keyAgreement = generateKeyAgreement(account)

  return {
    authentication,
    keyAgreement,
    assertionMethod,
    capabilityDelegation,
  }
}
