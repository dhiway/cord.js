import { mnemonicGenerate } from '@polkadot/util-crypto'

import * as Cord from '@cord.network/sdk'

export function createAccount(mnemonic = mnemonicGenerate()): {
  account: Cord.CordKeyringPair
  mnemonic: string
} {
  const keyring = new Cord.Utils.Keyring({
    ss58Format: 29,
    type: 'sr25519',
  })
  return {
    account: keyring.addFromMnemonic(mnemonic) as Cord.CordKeyringPair,
    mnemonic,
  }
}
