import * as Cord from '@cord.network/sdk'

/**
 * `createAccount` creates a new account from a mnemonic
 * @param mnemonic - The mnemonic phrase to use to generate the account. If not provided, a new
 * mnemonic will be generated.
 * @returns An object with two properties: account and mnemonic.
 */
export function createAccount(
  mnemonic = Cord.Utils.Crypto.mnemonicGenerate()
): {
  account: Cord.CordKeyringPair
  mnemonic: string
} {
  const keyring = new Cord.Utils.Keyring({
    ss58Format: 29,
    type: 'ed25519',
  })
  return {
    account: keyring.addFromMnemonic(mnemonic) as Cord.CordKeyringPair,
    mnemonic,
  }
}
