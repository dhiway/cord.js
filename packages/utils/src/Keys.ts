import { Keyring } from '@polkadot/keyring'
import {
    blake2AsU8a,
    keyExtractPath,
    keyFromPath,
    mnemonicGenerate,
    mnemonicToMiniSecret,
    ed25519PairFromSeed,
    sr25519PairFromSeed,
} from '@polkadot/util-crypto'

import { makeEncryptionKeypairFromSeed } from './Crypto';
import { CordKeyringPair, ICordKeyPair } from '@cord.network/types';

/**
 * It takes a mnemonic and returns a keypair that can be used for encryption
 * @param {string} mnemonic - The mnemonic that was generated in the previous step.
 * @returns A keypair for encryption.
 */
function generateKeyAgreement(mnemonic: string, type: string) {
    let secretKeyPair = ed25519PairFromSeed(mnemonicToMiniSecret(mnemonic));
    if (type === 'sr25519') {
	secretKeyPair = sr25519PairFromSeed(mnemonicToMiniSecret(mnemonic))
    }
    const { path } = keyExtractPath('//did//keyAgreement//0')
    const { secretKey } = keyFromPath(secretKeyPair, path, type === 'ed25519' ? 'ed25519' : (type === 'sr25519' ? 'sr25519' : 'ecdsa'))
    return makeEncryptionKeypairFromSeed(blake2AsU8a(secretKey))
}


/**
 * This function takes a mnemonic, creates an account from the mnemonic, and then derives four keypairs from
 * the account
 * @param mnemonic - A string of words that can be used to recover the keypairs.
 * @param keytype - type of key to generate, supports 'ed25519' (default) and 'sr25519' for now
 * @returns An object with 4 keyring pairs.
 */
export function generateKeypairs(mnemonic: string, keytype?: string): ICordKeyPair {
    if (!mnemonic) {
	mnemonic = mnemonicGenerate()
    }
    if (!keytype) {
        keytype = 'ed25519'
    }
    const keyring = new Keyring({
	ss58Format: 29,
	type: keytype === 'ed25519' ? 'ed25519' : (keytype === 'sr25519' ? 'sr25519' : 'ecdsa'),
    })

    const account = keyring.addFromMnemonic(mnemonic) as CordKeyringPair;

    const authentication = {
	...account.derive('//did//authentication//0'),
	type: keytype,
    } as CordKeyringPair

    const assertionMethod = {
	...account.derive('//did//assertion//0'),
	type: keytype,
    } as CordKeyringPair

    const capabilityDelegation = {
	...account.derive('//did//delegation//0'),
	type: keytype,
    } as CordKeyringPair

    const keyAgreement = generateKeyAgreement(mnemonic, keytype)

    return {
	authentication: authentication,
	keyAgreement: keyAgreement,
	assertionMethod: assertionMethod,
	capabilityDelegation: capabilityDelegation,
    }
}
