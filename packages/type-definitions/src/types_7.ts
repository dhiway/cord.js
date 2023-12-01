import type { RegistryTypes } from '@polkadot/types/types'

export const types7: RegistryTypes = {
  // Chain Types
  IdentifierOf: 'Vec<u8>',
  StatementIdOf: 'IdentifierOf',
  StatementDigestOf: 'Hash',
  SchemaIdOf: 'IdentifierOf',
  SchemaDigestOf: 'Hash',
  SwarmIdOf: 'IdentifierOf',

  // Statements
  CreatorOf: 'AccountId',
  StatementEntry: {
    digest: 'StatementDigestOf',
    creator: 'CreatorOf',
    schema: 'Option<SchemaIdOf>',
    linked: 'Option<StatementIdOf>',
    swarm: 'Option<SwarmIdOf>',
    revoked: 'bool',
    counter: 'u64',
  },
  StatementCommitOf: {
    _enum: ['Genesis', 'Update', 'Status'],
  },
  StatementCommit: {
    commit: 'StatementCommitOf',
    digest: 'StatementDigestOf',
    block: 'BlockNumber',
  },

  // DIDs
  KeyIdOf: 'Hash',
  DidIdentifierOf: 'AccountId',
  AccountIdentifierOf: 'AccountId',
  DidCallableOf: 'Call',

  DidVerificationKey: {
    _enum: {
      Ed25519: '[u8; 32]',
      Sr25519: '[u8; 32]',
    },
  },
  DidEncryptionKey: {
    _enum: {
      X25519: '[u8; 32]',
    },
  },
  DidPublicKey: {
    _enum: {
      PublicVerificationKey: 'DidVerificationKey',
      PublicEncryptionKey: 'DidEncryptionKey',
    },
  },
  DidVerificationKeyRelationship: {
    _enum: [
      'Authentication',
      'CapabilityDelegation',
      'CapabilityInvocation',
      'AssertionMethod',
    ],
  },
  DidSignature: {
    _enum: {
      Ed25519: 'Ed25519Signature',
      Sr25519: 'Sr25519Signature',
    },
  },
  StorageError: {
    _enum: {
      DidAlreadyPresent: 'Null',
      DidNotPresent: 'Null',
      DidKeyNotPresent: 'DidVerificationKeyRelationship',
      KeyNotPresent: 'Null',
      CurrentlyActiveKey: 'Null',
      MaxPublicKeysPerDidExceeded: 'Null',
      MaxTotalKeyAgreementKeysExceeded: 'Null',
      DidAlreadyDeleted: 'Null',
    },
  },
  SignatureError: {
    _enum: [
      'InvalidSignatureFormat',
      'InvalidSignature',
      'InvalidNonce',
      'TransactionExpired',
    ],
  },
  KeyError: {
    _enum: ['InvalidVerificationKeyFormat', 'InvalidEncryptionKeyFormat'],
  },
  InputError: {
    _enum: [
      'MaxKeyAgreementKeysLimitExceeded',
      'MaxVerificationKeysToRemoveLimitExceeded',
    ],
  },
  DidPublicKeyDetails: {
    key: 'DidPublicKey',
    blockNumber: 'BlockNumber',
  },
  DidNewKeyAgreementKeys:
    'BoundedBTreeSet<DidEncryptionKey, MaxNewKeyAgreementKeys>',
  DidKeyAgreementKeys: 'BoundedBTreeSet<KeyIdOf, MaxTotalKeyAgreementKeys>',
  DidVerificationKeysToRevoke:
    'BoundedBTreeSet<KeyIdOf, MaxVerificationKeysToRevoke>',
  MaxNewKeyAgreementKeys: 'u32',
  MaxTotalKeyAgreementKeys: 'u32',
  MaxVerificationKeysToRevoke: 'u32',
  MaxPublicKeysPerDid: 'u32',
  DidPublicKeyMap:
    'BoundedBTreeMap<KeyIdOf, DidPublicKeyDetails, MaxPublicKeysPerDid>',
  DidCreationDetails: {
    did: 'DidIdentifierOf',
    submitter: 'AccountId',
    newKeyAgreementKey: 'DidEncryptionKey',
    newAssertionKey: 'Option<DidVerificationKey>',
    newDelegationKey: 'Option<DidVerificationKey>',
  },
  DidDetails: {
    authenticationKey: 'KeyIdOf',
    keyAgreementKeys: 'DidKeyAgreementKeys',
    capabilityDelegationKey: 'Option<KeyIdOf>',
    assertionMethodKey: 'Option<KeyIdOf>',
    publicKeys: 'DidPublicKeyMap',
    lastTxCounter: 'u64',
  },

  DidDeletionOperation: {
    did: 'DidIdentifierOf',
    txCounter: 'u64',
  },
  DidAuthorizedCallOperation: {
    did: 'DidIdentifierOf',
    txCounter: 'u64',
    call: 'DidCallableOf',
    blockNumber: 'BlockNumber',
    submitter: 'AccountId',
  },
}
