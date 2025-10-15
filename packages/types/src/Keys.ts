import type { CordKeyringPair, CordEncryptionKeypair } from './Address.js'

export interface ICordKeyPair {
  authentication: CordKeyringPair
  keyAgreement: CordEncryptionKeypair
  assertionMethod: CordKeyringPair
  capabilityDelegation: CordKeyringPair
}

