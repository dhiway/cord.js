import type {
  OverrideBundleDefinition,
  RegistryTypes,
} from '@polkadot/types/types'

export const types02: RegistryTypes = {
  // Runtime
  AccountInfo: 'AccountInfoWithTripleRefCount',
  Address: 'MultiAddress',
  AmountOf: 'i128',
  Balance: 'u128',
  LookupSource: 'MultiAddress',
  IdentifierOf: 'Text',
  IdOf: 'Hash',
  HashOf: 'Hash',
  StatusOf: 'bool',
  //Stream
  StreamDetails: {
    streamHash: 'HashOf',
    cid: 'Option<IdentifierOf>',
    parent_cid: 'Option<IdentifierOf>',
    schema: 'Option<IdOf>',
    link: 'Option<IdOf>',
    creator: 'CordAccountOf',
    block: 'BlockNumber',
    revoked: 'bool',
  },
  StreamCommit: {
    hash: 'HashOf',
    cid: 'Option<IdentifierOf>',
    block: 'BlockNumber',
    commit: 'StreamCommitOf',
  },
  StreamCommitOf: {
    _enum: ['Create', 'Update', 'Status'],
  },
  StreamLink: {
    identifier: 'IdOf',
    creator: 'CordAccountOf',
  },

  // Schema
  SchemaDetails: {
    hash: 'HashOf',
    cid: 'Option<IdentifierOf>',
    parent_cid: 'Option<IdentifierOf>',
    creator: 'CordAccountOf',
    block: 'BlockNumber',
    permissioned: 'bool',
    revoked: 'bool',
  },
  SchemaCommit: {
    hash: 'HashOf',
    cid: 'Option<IdentifierOf>',
    block: 'BlockNumber',
    commit: 'SchemaCommitOf',
  },
  SchemaCommitOf: {
    _enum: [
      'Genesis',
      'Update',
      'Delegate',
      'RevokeDelegation',
      'Permission',
      'Status',
    ],
  },
  // Registrar
  RegistrarDetails: {
    block: 'BlockNumber',
    revoked: 'bool',
  },
  TxVerifiedOf: {
    tx_hash: 'HashOf',
    ptx_verified: 'bool',
  },
  CordAccountOf: 'AccountId',
  DidIdentifierOf: 'AccountId',
  AccountIdentifierOf: 'AccountId',
  BlockNumberOf: 'BlockNumber',
  signedExtensions: {
    NixAccount: 'AccountId',
  },
}

export const typeBundleForPolkadot: OverrideBundleDefinition = {
  types: [
    {
      minmax: [2, undefined],
      types: types02,
    },
  ],
}
