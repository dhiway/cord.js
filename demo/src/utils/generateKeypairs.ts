import * as Cord from '@cord.network/sdk'
import {
  blake2AsU8a,
  keyExtractPath,
  keyFromPath,
  mnemonicGenerate,
  mnemonicToMiniSecret,
  sr25519PairFromSeed,
} from '@polkadot/util-crypto'
import { createAccount } from './createAccount'

function generateKeyAgreement(mnemonic: string) {
  const secretKeyPair = sr25519PairFromSeed(mnemonicToMiniSecret(mnemonic))
  const { path } = keyExtractPath('//did//keyAgreement//0')
  const { secretKey } = keyFromPath(secretKeyPair, path, 'sr25519')
  return Cord.Utils.Crypto.makeEncryptionKeypairFromSeed(blake2AsU8a(secretKey))
}

export function generateKeypairs(mnemonic = mnemonicGenerate()) {
  const { account } = createAccount(mnemonic)

  const authentication = {
    ...account.derive('//did//0'),
    type: 'sr25519',
  } as Cord.CordKeyringPair

  const assertionMethod = {
    ...account.derive('//did//assertion//0'),
    type: 'sr25519',
  } as Cord.CordKeyringPair

  const capabilityDelegation = {
    ...account.derive('//did//delegation//0'),
    type: 'sr25519',
  } as Cord.CordKeyringPair

  const keyAgreement = generateKeyAgreement(mnemonic)

  return {
    authentication: authentication,
    keyAgreement: keyAgreement,
    assertionMethod: assertionMethod,
    capabilityDelegation: capabilityDelegation,
  }
}
