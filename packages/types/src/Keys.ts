import type { CordKeyringPair, CordEncryptionKeypair } from './Address'

export interface ICordKeyPair {
  authentication: CordKeyringPair
  keyAgreement: CordEncryptionKeypair
  assertionMethod: CordKeyringPair
  capabilityDelegation: CordKeyringPair
}

