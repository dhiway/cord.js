// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

/* eslint-disable sort-keys */

export default {
  /**
   * Lookup3: frame_system::AccountInfo<Nonce, pallet_balances::types::AccountData<Balance>>
   **/
  FrameSystemAccountInfo: {
    nonce: 'u32',
    consumers: 'u32',
    providers: 'u32',
    sufficients: 'u32',
    data: 'PalletBalancesAccountData'
  },
  /**
   * Lookup5: pallet_balances::types::AccountData<Balance>
   **/
  PalletBalancesAccountData: {
    free: 'u128',
    reserved: 'u128',
    frozen: 'u128',
    flags: 'u128'
  },
  /**
   * Lookup8: frame_support::dispatch::PerDispatchClass<sp_weights::weight_v2::Weight>
   **/
  FrameSupportDispatchPerDispatchClassWeight: {
    normal: 'SpWeightsWeightV2Weight',
    operational: 'SpWeightsWeightV2Weight',
    mandatory: 'SpWeightsWeightV2Weight'
  },
  /**
   * Lookup9: sp_weights::weight_v2::Weight
   **/
  SpWeightsWeightV2Weight: {
    refTime: 'Compact<u64>',
    proofSize: 'Compact<u64>'
  },
  /**
   * Lookup14: sp_runtime::generic::digest::Digest
   **/
  SpRuntimeDigest: {
    logs: 'Vec<SpRuntimeDigestDigestItem>'
  },
  /**
   * Lookup16: sp_runtime::generic::digest::DigestItem
   **/
  SpRuntimeDigestDigestItem: {
    _enum: {
      Other: 'Bytes',
      __Unused1: 'Null',
      __Unused2: 'Null',
      __Unused3: 'Null',
      Consensus: '([u8;4],Bytes)',
      Seal: '([u8;4],Bytes)',
      PreRuntime: '([u8;4],Bytes)',
      __Unused7: 'Null',
      RuntimeEnvironmentUpdated: 'Null'
    }
  },
  /**
   * Lookup19: frame_system::EventRecord<cord_runtime::RuntimeEvent, primitive_types::H256>
   **/
  FrameSystemEventRecord: {
    phase: 'FrameSystemPhase',
    event: 'Event',
    topics: 'Vec<H256>'
  },
  /**
   * Lookup21: frame_system::pallet::Event<T>
   **/
  FrameSystemEvent: {
    _enum: {
      ExtrinsicSuccess: {
        dispatchInfo: 'FrameSupportDispatchDispatchInfo',
      },
      ExtrinsicFailed: {
        dispatchError: 'SpRuntimeDispatchError',
        dispatchInfo: 'FrameSupportDispatchDispatchInfo',
      },
      CodeUpdated: 'Null',
      NewAccount: {
        account: 'AccountId32',
      },
      KilledAccount: {
        account: 'AccountId32',
      },
      Remarked: {
        _alias: {
          hash_: 'hash',
        },
        sender: 'AccountId32',
        hash_: 'H256'
      }
    }
  },
  /**
   * Lookup22: frame_support::dispatch::DispatchInfo
   **/
  FrameSupportDispatchDispatchInfo: {
    weight: 'SpWeightsWeightV2Weight',
    class: 'FrameSupportDispatchDispatchClass',
    paysFee: 'FrameSupportDispatchPays'
  },
  /**
   * Lookup23: frame_support::dispatch::DispatchClass
   **/
  FrameSupportDispatchDispatchClass: {
    _enum: ['Normal', 'Operational', 'Mandatory']
  },
  /**
   * Lookup24: frame_support::dispatch::Pays
   **/
  FrameSupportDispatchPays: {
    _enum: ['Yes', 'No']
  },
  /**
   * Lookup25: sp_runtime::DispatchError
   **/
  SpRuntimeDispatchError: {
    _enum: {
      Other: 'Null',
      CannotLookup: 'Null',
      BadOrigin: 'Null',
      Module: 'SpRuntimeModuleError',
      ConsumerRemaining: 'Null',
      NoProviders: 'Null',
      TooManyConsumers: 'Null',
      Token: 'SpRuntimeTokenError',
      Arithmetic: 'SpArithmeticArithmeticError',
      Transactional: 'SpRuntimeTransactionalError',
      Exhausted: 'Null',
      Corruption: 'Null',
      Unavailable: 'Null',
      RootNotAllowed: 'Null'
    }
  },
  /**
   * Lookup26: sp_runtime::ModuleError
   **/
  SpRuntimeModuleError: {
    index: 'u8',
    error: '[u8;4]'
  },
  /**
   * Lookup27: sp_runtime::TokenError
   **/
  SpRuntimeTokenError: {
    _enum: ['FundsUnavailable', 'OnlyProvider', 'BelowMinimum', 'CannotCreate', 'UnknownAsset', 'Frozen', 'Unsupported', 'CannotCreateHold', 'NotExpendable', 'Blocked']
  },
  /**
   * Lookup28: sp_arithmetic::ArithmeticError
   **/
  SpArithmeticArithmeticError: {
    _enum: ['Underflow', 'Overflow', 'DivisionByZero']
  },
  /**
   * Lookup29: sp_runtime::TransactionalError
   **/
  SpRuntimeTransactionalError: {
    _enum: ['LimitReached', 'NoLayer']
  },
  /**
   * Lookup30: pallet_scheduler::pallet::Event<T>
   **/
  PalletSchedulerEvent: {
    _enum: {
      Scheduled: {
        when: 'u32',
        index: 'u32',
      },
      Canceled: {
        when: 'u32',
        index: 'u32',
      },
      Dispatched: {
        task: '(u32,u32)',
        id: 'Option<[u8;32]>',
        result: 'Result<Null, SpRuntimeDispatchError>',
      },
      CallUnavailable: {
        task: '(u32,u32)',
        id: 'Option<[u8;32]>',
      },
      PeriodicFailed: {
        task: '(u32,u32)',
        id: 'Option<[u8;32]>',
      },
      PermanentlyOverweight: {
        task: '(u32,u32)',
        id: 'Option<[u8;32]>'
      }
    }
  },
  /**
   * Lookup35: pallet_indices::pallet::Event<T>
   **/
  PalletIndicesEvent: {
    _enum: {
      IndexAssigned: {
        who: 'AccountId32',
        index: 'u32',
      },
      IndexFreed: {
        index: 'u32',
      },
      IndexFrozen: {
        index: 'u32',
        who: 'AccountId32'
      }
    }
  },
  /**
   * Lookup36: pallet_balances::pallet::Event<T, I>
   **/
  PalletBalancesEvent: {
    _enum: {
      Endowed: {
        account: 'AccountId32',
        freeBalance: 'u128',
      },
      DustLost: {
        account: 'AccountId32',
        amount: 'u128',
      },
      Transfer: {
        from: 'AccountId32',
        to: 'AccountId32',
        amount: 'u128',
      },
      BalanceSet: {
        who: 'AccountId32',
        free: 'u128',
      },
      Reserved: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Unreserved: {
        who: 'AccountId32',
        amount: 'u128',
      },
      ReserveRepatriated: {
        from: 'AccountId32',
        to: 'AccountId32',
        amount: 'u128',
        destinationStatus: 'FrameSupportTokensMiscBalanceStatus',
      },
      Deposit: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Withdraw: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Slashed: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Minted: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Burned: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Suspended: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Restored: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Upgraded: {
        who: 'AccountId32',
      },
      Issued: {
        amount: 'u128',
      },
      Rescinded: {
        amount: 'u128',
      },
      Locked: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Unlocked: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Frozen: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Thawed: {
        who: 'AccountId32',
        amount: 'u128'
      }
    }
  },
  /**
   * Lookup37: frame_support::traits::tokens::misc::BalanceStatus
   **/
  FrameSupportTokensMiscBalanceStatus: {
    _enum: ['Free', 'Reserved']
  },
  /**
   * Lookup38: cord_authority_membership::pallet::Event<T>
   **/
  CordAuthorityMembershipEvent: {
    _enum: {
      IncomingAuthorities: 'Vec<AccountId32>',
      OutgoingAuthorities: 'Vec<AccountId32>',
      MemberAdded: 'AccountId32',
      MemberGoOffline: 'AccountId32',
      MemberGoOnline: 'AccountId32',
      MemberRemoved: 'AccountId32',
      MemberWhiteList: 'AccountId32'
    }
  },
  /**
   * Lookup40: pallet_offences::pallet::Event
   **/
  PalletOffencesEvent: {
    _enum: {
      Offence: {
        kind: '[u8;16]',
        timeslot: 'Bytes'
      }
    }
  },
  /**
   * Lookup42: pallet_session::pallet::Event
   **/
  PalletSessionEvent: {
    _enum: {
      NewSession: {
        sessionIndex: 'u32'
      }
    }
  },
  /**
   * Lookup43: pallet_grandpa::pallet::Event
   **/
  PalletGrandpaEvent: {
    _enum: {
      NewAuthorities: {
        authoritySet: 'Vec<(SpConsensusGrandpaAppPublic,u64)>',
      },
      Paused: 'Null',
      Resumed: 'Null'
    }
  },
  /**
   * Lookup46: sp_consensus_grandpa::app::Public
   **/
  SpConsensusGrandpaAppPublic: 'SpCoreEd25519Public',
  /**
   * Lookup47: sp_core::ed25519::Public
   **/
  SpCoreEd25519Public: '[u8;32]',
  /**
   * Lookup48: pallet_im_online::pallet::Event<T>
   **/
  PalletImOnlineEvent: {
    _enum: {
      HeartbeatReceived: {
        authorityId: 'PalletImOnlineSr25519AppSr25519Public',
      },
      AllGood: 'Null',
      SomeOffline: {
        offline: 'Vec<(AccountId32,CordRuntimeEntitiesValidatorFullIdentification)>'
      }
    }
  },
  /**
   * Lookup49: pallet_im_online::sr25519::app_sr25519::Public
   **/
  PalletImOnlineSr25519AppSr25519Public: 'SpCoreSr25519Public',
  /**
   * Lookup50: sp_core::sr25519::Public
   **/
  SpCoreSr25519Public: '[u8;32]',
  /**
   * Lookup53: cord_runtime::entities::ValidatorFullIdentification
   **/
  CordRuntimeEntitiesValidatorFullIdentification: 'Null',
  /**
   * Lookup54: pallet_preimage::pallet::Event<T>
   **/
  PalletPreimageEvent: {
    _enum: {
      Noted: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
      },
      Requested: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
      },
      Cleared: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256'
      }
    }
  },
  /**
   * Lookup55: pallet_collective::pallet::Event<T, I>
   **/
  PalletCollectiveEvent: {
    _enum: {
      Proposed: {
        account: 'AccountId32',
        proposalIndex: 'u32',
        proposalHash: 'H256',
        threshold: 'u32',
      },
      Voted: {
        account: 'AccountId32',
        proposalHash: 'H256',
        voted: 'bool',
        yes: 'u32',
        no: 'u32',
      },
      Approved: {
        proposalHash: 'H256',
      },
      Disapproved: {
        proposalHash: 'H256',
      },
      Executed: {
        proposalHash: 'H256',
        result: 'Result<Null, SpRuntimeDispatchError>',
      },
      MemberExecuted: {
        proposalHash: 'H256',
        result: 'Result<Null, SpRuntimeDispatchError>',
      },
      Closed: {
        proposalHash: 'H256',
        yes: 'u32',
        no: 'u32'
      }
    }
  },
  /**
   * Lookup57: pallet_membership::pallet::Event<T, I>
   **/
  PalletMembershipEvent: {
    _enum: ['MemberAdded', 'MemberRemoved', 'MembersSwapped', 'MembersReset', 'KeyChanged', 'Dummy']
  },
  /**
   * Lookup60: pallet_node_authorization::pallet::Event<T>
   **/
  PalletNodeAuthorizationEvent: {
    _enum: {
      NodeAdded: {
        nodeId: 'Bytes',
        who: 'AccountId32',
      },
      NodeRemoved: {
        nodeId: 'Bytes',
      },
      NodeSwapped: {
        removed: 'Bytes',
        added: 'Bytes',
      },
      NodesReset: {
        nodes: 'Vec<(OpaquePeerId,AccountId32)>',
      },
      NodeClaimed: {
        peerId: 'OpaquePeerId',
        who: 'AccountId32',
      },
      ClaimRemoved: {
        peerId: 'OpaquePeerId',
        who: 'AccountId32',
      },
      NodeTransferred: {
        nodeId: 'Bytes',
        target: 'AccountId32',
      },
      ConnectionsAdded: {
        nodeId: 'Bytes',
        connection: 'Bytes',
      },
      ConnectionsRemoved: {
        nodeId: 'Bytes',
        connection: 'Bytes'
      }
    }
  },
  /**
   * Lookup64: pallet_utility::pallet::Event
   **/
  PalletUtilityEvent: {
    _enum: {
      BatchInterrupted: {
        index: 'u32',
        error: 'SpRuntimeDispatchError',
      },
      BatchCompleted: 'Null',
      BatchCompletedWithErrors: 'Null',
      ItemCompleted: 'Null',
      ItemFailed: {
        error: 'SpRuntimeDispatchError',
      },
      DispatchedAs: {
        result: 'Result<Null, SpRuntimeDispatchError>'
      }
    }
  },
  /**
   * Lookup65: pallet_multisig::pallet::Event<T>
   **/
  PalletMultisigEvent: {
    _enum: {
      NewMultisig: {
        approving: 'AccountId32',
        multisig: 'AccountId32',
        callHash: '[u8;32]',
      },
      MultisigApproval: {
        approving: 'AccountId32',
        timepoint: 'PalletMultisigTimepoint',
        multisig: 'AccountId32',
        callHash: '[u8;32]',
      },
      MultisigExecuted: {
        approving: 'AccountId32',
        timepoint: 'PalletMultisigTimepoint',
        multisig: 'AccountId32',
        callHash: '[u8;32]',
        result: 'Result<Null, SpRuntimeDispatchError>',
      },
      MultisigCancelled: {
        cancelling: 'AccountId32',
        timepoint: 'PalletMultisigTimepoint',
        multisig: 'AccountId32',
        callHash: '[u8;32]'
      }
    }
  },
  /**
   * Lookup66: pallet_multisig::Timepoint<BlockNumber>
   **/
  PalletMultisigTimepoint: {
    height: 'u32',
    index: 'u32'
  },
  /**
   * Lookup67: pallet_remark::pallet::Event<T>
   **/
  PalletRemarkEvent: {
    _enum: {
      Stored: {
        sender: 'AccountId32',
        contentHash: 'H256'
      }
    }
  },
  /**
   * Lookup68: pallet_identity::pallet::Event<T>
   **/
  PalletIdentityEvent: {
    _enum: {
      IdentitySet: {
        who: 'AccountId32',
      },
      IdentityCleared: {
        who: 'AccountId32',
      },
      IdentityKilled: {
        who: 'AccountId32',
      },
      JudgementRequested: {
        who: 'AccountId32',
        registrar: 'AccountId32',
        digest: 'H256',
      },
      JudgementUnrequested: {
        who: 'AccountId32',
        registrar: 'AccountId32',
      },
      JudgementGiven: {
        target: 'AccountId32',
        registrar: 'AccountId32',
      },
      RegistrarAdded: {
        registrar: 'AccountId32',
      },
      RegistrarRemoved: {
        registrar: 'AccountId32'
      }
    }
  },
  /**
   * Lookup69: pallet_network_membership::pallet::Event<T>
   **/
  PalletNetworkMembershipEvent: {
    _enum: {
      MembershipAcquired: {
        member: 'AccountId32',
      },
      MembershipExpired: {
        member: 'AccountId32',
      },
      MembershipRenewed: {
        member: 'AccountId32',
      },
      MembershipRevoked: {
        member: 'AccountId32',
      },
      MembershipRenewalRequested: {
        member: 'AccountId32'
      }
    }
  },
  /**
   * Lookup70: pallet_did::pallet::Event<T>
   **/
  PalletDidEvent: {
    _enum: {
      Created: {
        author: 'AccountId32',
        identifier: 'AccountId32',
      },
      Updated: {
        identifier: 'AccountId32',
      },
      Deleted: {
        identifier: 'AccountId32',
      },
      CallDispatched: {
        identifier: 'AccountId32',
        result: 'Result<Null, SpRuntimeDispatchError>'
      }
    }
  },
  /**
   * Lookup71: pallet_schema::pallet::Event<T>
   **/
  PalletSchemaEvent: {
    _enum: {
      Created: {
        identifier: 'Bytes',
        creator: 'AccountId32'
      }
    }
  },
  /**
   * Lookup74: pallet_registry::pallet::Event<T>
   **/
  PalletRegistryEvent: {
    _enum: {
      AddAuthorization: {
        _alias: {
          registry_: 'registry',
        },
        registry_: 'Bytes',
        authorization: 'Bytes',
        delegate: 'AccountId32',
      },
      RemoveAuthorization: {
        _alias: {
          registry_: 'registry',
        },
        registry_: 'Bytes',
        authorization: 'Bytes',
      },
      Create: {
        _alias: {
          registry_: 'registry',
        },
        registry_: 'Bytes',
        creator: 'AccountId32',
      },
      Update: {
        _alias: {
          registry_: 'registry',
        },
        registry_: 'Bytes',
        authority: 'AccountId32',
      },
      Archive: {
        _alias: {
          registry_: 'registry',
        },
        registry_: 'Bytes',
        authority: 'AccountId32',
      },
      Restore: {
        _alias: {
          registry_: 'registry',
        },
        registry_: 'Bytes',
        authority: 'AccountId32'
      }
    }
  },
  /**
   * Lookup75: pallet_stream::pallet::Event<T>
   **/
  PalletStreamEvent: {
    _enum: {
      Create: {
        identifier: 'Bytes',
        digest: 'H256',
        author: 'AccountId32',
      },
      Update: {
        identifier: 'Bytes',
        digest: 'H256',
        author: 'AccountId32',
      },
      Revoke: {
        identifier: 'Bytes',
        author: 'AccountId32',
      },
      Restore: {
        identifier: 'Bytes',
        author: 'AccountId32',
      },
      Remove: {
        identifier: 'Bytes',
        author: 'AccountId32',
      },
      Digest: {
        identifier: 'Bytes',
        digest: 'H256',
        author: 'AccountId32'
      }
    }
  },
  /**
   * Lookup76: pallet_did_name::pallet::Event<T>
   **/
  PalletDidNameEvent: {
    _enum: {
      DidNameRegistered: {
        owner: 'AccountId32',
        name: 'Bytes',
      },
      DidNameReleased: {
        owner: 'AccountId32',
        name: 'Bytes',
      },
      DidNameBanned: {
        name: 'Bytes',
      },
      DidNameUnbanned: {
        name: 'Bytes'
      }
    }
  },
  /**
   * Lookup79: pallet_unique::pallet::Event<T>
   **/
  PalletUniqueEvent: {
    _enum: {
      Create: {
        identifier: 'Bytes',
        digest: 'Bytes',
        author: 'AccountId32',
      },
      Revoke: {
        identifier: 'Bytes',
        author: 'AccountId32',
      },
      Update: {
        identifier: 'Bytes',
        digest: 'Bytes',
        author: 'AccountId32',
      },
      Remove: {
        identifier: 'Bytes',
        author: 'AccountId32'
      }
    }
  },
  /**
   * Lookup81: pallet_score::pallet::Event<T>
   **/
  PalletScoreEvent: {
    _enum: {
      JournalEntry: {
        identifier: 'Bytes',
        entity: 'AccountId32',
        author: 'AccountId32',
      },
      AggregateUpdated: {
        entity: 'AccountId32'
      }
    }
  },
  /**
   * Lookup82: pallet_sudo::pallet::Event<T>
   **/
  PalletSudoEvent: {
    _enum: {
      Sudid: {
        sudoResult: 'Result<Null, SpRuntimeDispatchError>',
      },
      KeyChanged: {
        oldSudoer: 'Option<AccountId32>',
      },
      SudoAsDone: {
        sudoResult: 'Result<Null, SpRuntimeDispatchError>'
      }
    }
  },
  /**
   * Lookup84: frame_system::Phase
   **/
  FrameSystemPhase: {
    _enum: {
      ApplyExtrinsic: 'u32',
      Finalization: 'Null',
      Initialization: 'Null'
    }
  },
  /**
   * Lookup87: frame_system::LastRuntimeUpgradeInfo
   **/
  FrameSystemLastRuntimeUpgradeInfo: {
    specVersion: 'Compact<u32>',
    specName: 'Text'
  },
  /**
   * Lookup90: frame_system::pallet::Call<T>
   **/
  FrameSystemCall: {
    _enum: {
      remark: {
        remark: 'Bytes',
      },
      set_heap_pages: {
        pages: 'u64',
      },
      set_code: {
        code: 'Bytes',
      },
      set_code_without_checks: {
        code: 'Bytes',
      },
      set_storage: {
        items: 'Vec<(Bytes,Bytes)>',
      },
      kill_storage: {
        _alias: {
          keys_: 'keys',
        },
        keys_: 'Vec<Bytes>',
      },
      kill_prefix: {
        prefix: 'Bytes',
        subkeys: 'u32',
      },
      remark_with_event: {
        remark: 'Bytes'
      }
    }
  },
  /**
   * Lookup94: frame_system::limits::BlockWeights
   **/
  FrameSystemLimitsBlockWeights: {
    baseBlock: 'SpWeightsWeightV2Weight',
    maxBlock: 'SpWeightsWeightV2Weight',
    perClass: 'FrameSupportDispatchPerDispatchClassWeightsPerClass'
  },
  /**
   * Lookup95: frame_support::dispatch::PerDispatchClass<frame_system::limits::WeightsPerClass>
   **/
  FrameSupportDispatchPerDispatchClassWeightsPerClass: {
    normal: 'FrameSystemLimitsWeightsPerClass',
    operational: 'FrameSystemLimitsWeightsPerClass',
    mandatory: 'FrameSystemLimitsWeightsPerClass'
  },
  /**
   * Lookup96: frame_system::limits::WeightsPerClass
   **/
  FrameSystemLimitsWeightsPerClass: {
    baseExtrinsic: 'SpWeightsWeightV2Weight',
    maxExtrinsic: 'Option<SpWeightsWeightV2Weight>',
    maxTotal: 'Option<SpWeightsWeightV2Weight>',
    reserved: 'Option<SpWeightsWeightV2Weight>'
  },
  /**
   * Lookup98: frame_system::limits::BlockLength
   **/
  FrameSystemLimitsBlockLength: {
    max: 'FrameSupportDispatchPerDispatchClassU32'
  },
  /**
   * Lookup99: frame_support::dispatch::PerDispatchClass<T>
   **/
  FrameSupportDispatchPerDispatchClassU32: {
    normal: 'u32',
    operational: 'u32',
    mandatory: 'u32'
  },
  /**
   * Lookup100: sp_weights::RuntimeDbWeight
   **/
  SpWeightsRuntimeDbWeight: {
    read: 'u64',
    write: 'u64'
  },
  /**
   * Lookup101: sp_version::RuntimeVersion
   **/
  SpVersionRuntimeVersion: {
    specName: 'Text',
    implName: 'Text',
    authoringVersion: 'u32',
    specVersion: 'u32',
    implVersion: 'u32',
    apis: 'Vec<([u8;8],u32)>',
    transactionVersion: 'u32',
    stateVersion: 'u8'
  },
  /**
   * Lookup107: frame_system::pallet::Error<T>
   **/
  FrameSystemError: {
    _enum: ['InvalidSpecName', 'SpecVersionNeedsToIncrease', 'FailedToExtractRuntimeVersion', 'NonDefaultComposite', 'NonZeroRefCount', 'CallFiltered']
  },
  /**
   * Lookup110: pallet_scheduler::Scheduled<Name, frame_support::traits::preimages::Bounded<cord_runtime::RuntimeCall>, BlockNumber, cord_runtime::OriginCaller, sp_core::crypto::AccountId32>
   **/
  PalletSchedulerScheduled: {
    maybeId: 'Option<[u8;32]>',
    priority: 'u8',
    call: 'FrameSupportPreimagesBounded',
    maybePeriodic: 'Option<(u32,u32)>',
    origin: 'CordRuntimeOriginCaller'
  },
  /**
   * Lookup111: frame_support::traits::preimages::Bounded<cord_runtime::RuntimeCall>
   **/
  FrameSupportPreimagesBounded: {
    _enum: {
      Legacy: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
      },
      Inline: 'Bytes',
      Lookup: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
        len: 'u32'
      }
    }
  },
  /**
   * Lookup113: pallet_scheduler::pallet::Call<T>
   **/
  PalletSchedulerCall: {
    _enum: {
      schedule: {
        when: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'Call',
      },
      cancel: {
        when: 'u32',
        index: 'u32',
      },
      schedule_named: {
        id: '[u8;32]',
        when: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'Call',
      },
      cancel_named: {
        id: '[u8;32]',
      },
      schedule_after: {
        after: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'Call',
      },
      schedule_named_after: {
        id: '[u8;32]',
        after: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'Call'
      }
    }
  },
  /**
   * Lookup115: pallet_babe::pallet::Call<T>
   **/
  PalletBabeCall: {
    _enum: {
      report_equivocation: {
        equivocationProof: 'SpConsensusSlotsEquivocationProof',
        keyOwnerProof: 'SpSessionMembershipProof',
      },
      report_equivocation_unsigned: {
        equivocationProof: 'SpConsensusSlotsEquivocationProof',
        keyOwnerProof: 'SpSessionMembershipProof',
      },
      plan_config_change: {
        config: 'SpConsensusBabeDigestsNextConfigDescriptor'
      }
    }
  },
  /**
   * Lookup116: sp_consensus_slots::EquivocationProof<sp_runtime::generic::header::Header<Number, Hash>, sp_consensus_babe::app::Public>
   **/
  SpConsensusSlotsEquivocationProof: {
    offender: 'SpConsensusBabeAppPublic',
    slot: 'u64',
    firstHeader: 'SpRuntimeHeader',
    secondHeader: 'SpRuntimeHeader'
  },
  /**
   * Lookup117: sp_runtime::generic::header::Header<Number, Hash>
   **/
  SpRuntimeHeader: {
    parentHash: 'H256',
    number: 'Compact<u32>',
    stateRoot: 'H256',
    extrinsicsRoot: 'H256',
    digest: 'SpRuntimeDigest'
  },
  /**
   * Lookup118: sp_consensus_babe::app::Public
   **/
  SpConsensusBabeAppPublic: 'SpCoreSr25519Public',
  /**
   * Lookup120: sp_session::MembershipProof
   **/
  SpSessionMembershipProof: {
    session: 'u32',
    trieNodes: 'Vec<Bytes>',
    validatorCount: 'u32'
  },
  /**
   * Lookup121: sp_consensus_babe::digests::NextConfigDescriptor
   **/
  SpConsensusBabeDigestsNextConfigDescriptor: {
    _enum: {
      __Unused0: 'Null',
      V1: {
        c: '(u64,u64)',
        allowedSlots: 'SpConsensusBabeAllowedSlots'
      }
    }
  },
  /**
   * Lookup123: sp_consensus_babe::AllowedSlots
   **/
  SpConsensusBabeAllowedSlots: {
    _enum: ['PrimarySlots', 'PrimaryAndSecondaryPlainSlots', 'PrimaryAndSecondaryVRFSlots']
  },
  /**
   * Lookup124: pallet_timestamp::pallet::Call<T>
   **/
  PalletTimestampCall: {
    _enum: {
      set: {
        now: 'Compact<u64>'
      }
    }
  },
  /**
   * Lookup125: pallet_indices::pallet::Call<T>
   **/
  PalletIndicesCall: {
    _enum: {
      claim: {
        index: 'u32',
      },
      transfer: {
        _alias: {
          new_: 'new',
        },
        new_: 'MultiAddress',
        index: 'u32',
      },
      free: {
        index: 'u32',
      },
      force_transfer: {
        _alias: {
          new_: 'new',
        },
        new_: 'MultiAddress',
        index: 'u32',
        freeze: 'bool',
      },
      freeze: {
        index: 'u32'
      }
    }
  },
  /**
   * Lookup129: pallet_balances::pallet::Call<T, I>
   **/
  PalletBalancesCall: {
    _enum: {
      transfer_allow_death: {
        dest: 'MultiAddress',
        value: 'Compact<u128>',
      },
      set_balance_deprecated: {
        who: 'MultiAddress',
        newFree: 'Compact<u128>',
        oldReserved: 'Compact<u128>',
      },
      force_transfer: {
        source: 'MultiAddress',
        dest: 'MultiAddress',
        value: 'Compact<u128>',
      },
      transfer_keep_alive: {
        dest: 'MultiAddress',
        value: 'Compact<u128>',
      },
      transfer_all: {
        dest: 'MultiAddress',
        keepAlive: 'bool',
      },
      force_unreserve: {
        who: 'MultiAddress',
        amount: 'u128',
      },
      upgrade_accounts: {
        who: 'Vec<AccountId32>',
      },
      transfer: {
        dest: 'MultiAddress',
        value: 'Compact<u128>',
      },
      force_set_balance: {
        who: 'MultiAddress',
        newFree: 'Compact<u128>'
      }
    }
  },
  /**
   * Lookup131: cord_authority_membership::pallet::Call<T>
   **/
  CordAuthorityMembershipCall: {
    _enum: {
      nominate: {
        candidate: 'AccountId32',
      },
      remove: {
        candidate: 'AccountId32',
      },
      remove_member_from_blacklist: {
        candidate: 'AccountId32',
      },
      go_offline: 'Null',
      go_online: 'Null'
    }
  },
  /**
   * Lookup132: pallet_session::pallet::Call<T>
   **/
  PalletSessionCall: {
    _enum: {
      set_keys: {
        _alias: {
          keys_: 'keys',
        },
        keys_: 'CordRuntimeSessionKeys',
        proof: 'Bytes',
      },
      purge_keys: 'Null'
    }
  },
  /**
   * Lookup133: cord_runtime::SessionKeys
   **/
  CordRuntimeSessionKeys: {
    grandpa: 'SpConsensusGrandpaAppPublic',
    babe: 'SpConsensusBabeAppPublic',
    imOnline: 'PalletImOnlineSr25519AppSr25519Public',
    authorityDiscovery: 'SpAuthorityDiscoveryAppPublic'
  },
  /**
   * Lookup134: sp_authority_discovery::app::Public
   **/
  SpAuthorityDiscoveryAppPublic: 'SpCoreSr25519Public',
  /**
   * Lookup135: pallet_grandpa::pallet::Call<T>
   **/
  PalletGrandpaCall: {
    _enum: {
      report_equivocation: {
        equivocationProof: 'SpConsensusGrandpaEquivocationProof',
        keyOwnerProof: 'SpSessionMembershipProof',
      },
      report_equivocation_unsigned: {
        equivocationProof: 'SpConsensusGrandpaEquivocationProof',
        keyOwnerProof: 'SpSessionMembershipProof',
      },
      note_stalled: {
        delay: 'u32',
        bestFinalizedBlockNumber: 'u32'
      }
    }
  },
  /**
   * Lookup136: sp_consensus_grandpa::EquivocationProof<primitive_types::H256, N>
   **/
  SpConsensusGrandpaEquivocationProof: {
    setId: 'u64',
    equivocation: 'SpConsensusGrandpaEquivocation'
  },
  /**
   * Lookup137: sp_consensus_grandpa::Equivocation<primitive_types::H256, N>
   **/
  SpConsensusGrandpaEquivocation: {
    _enum: {
      Prevote: 'FinalityGrandpaEquivocationPrevote',
      Precommit: 'FinalityGrandpaEquivocationPrecommit'
    }
  },
  /**
   * Lookup138: finality_grandpa::Equivocation<sp_consensus_grandpa::app::Public, finality_grandpa::Prevote<primitive_types::H256, N>, sp_consensus_grandpa::app::Signature>
   **/
  FinalityGrandpaEquivocationPrevote: {
    roundNumber: 'u64',
    identity: 'SpConsensusGrandpaAppPublic',
    first: '(FinalityGrandpaPrevote,SpConsensusGrandpaAppSignature)',
    second: '(FinalityGrandpaPrevote,SpConsensusGrandpaAppSignature)'
  },
  /**
   * Lookup139: finality_grandpa::Prevote<primitive_types::H256, N>
   **/
  FinalityGrandpaPrevote: {
    targetHash: 'H256',
    targetNumber: 'u32'
  },
  /**
   * Lookup140: sp_consensus_grandpa::app::Signature
   **/
  SpConsensusGrandpaAppSignature: 'SpCoreEd25519Signature',
  /**
   * Lookup141: sp_core::ed25519::Signature
   **/
  SpCoreEd25519Signature: '[u8;64]',
  /**
   * Lookup144: finality_grandpa::Equivocation<sp_consensus_grandpa::app::Public, finality_grandpa::Precommit<primitive_types::H256, N>, sp_consensus_grandpa::app::Signature>
   **/
  FinalityGrandpaEquivocationPrecommit: {
    roundNumber: 'u64',
    identity: 'SpConsensusGrandpaAppPublic',
    first: '(FinalityGrandpaPrecommit,SpConsensusGrandpaAppSignature)',
    second: '(FinalityGrandpaPrecommit,SpConsensusGrandpaAppSignature)'
  },
  /**
   * Lookup145: finality_grandpa::Precommit<primitive_types::H256, N>
   **/
  FinalityGrandpaPrecommit: {
    targetHash: 'H256',
    targetNumber: 'u32'
  },
  /**
   * Lookup147: pallet_im_online::pallet::Call<T>
   **/
  PalletImOnlineCall: {
    _enum: {
      heartbeat: {
        heartbeat: 'PalletImOnlineHeartbeat',
        signature: 'PalletImOnlineSr25519AppSr25519Signature'
      }
    }
  },
  /**
   * Lookup148: pallet_im_online::Heartbeat<BlockNumber>
   **/
  PalletImOnlineHeartbeat: {
    blockNumber: 'u32',
    sessionIndex: 'u32',
    authorityIndex: 'u32',
    validatorsLen: 'u32'
  },
  /**
   * Lookup149: pallet_im_online::sr25519::app_sr25519::Signature
   **/
  PalletImOnlineSr25519AppSr25519Signature: 'SpCoreSr25519Signature',
  /**
   * Lookup150: sp_core::sr25519::Signature
   **/
  SpCoreSr25519Signature: '[u8;64]',
  /**
   * Lookup151: pallet_preimage::pallet::Call<T>
   **/
  PalletPreimageCall: {
    _enum: {
      note_preimage: {
        bytes: 'Bytes',
      },
      unnote_preimage: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
      },
      request_preimage: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
      },
      unrequest_preimage: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256'
      }
    }
  },
  /**
   * Lookup152: pallet_collective::pallet::Call<T, I>
   **/
  PalletCollectiveCall: {
    _enum: {
      set_members: {
        newMembers: 'Vec<AccountId32>',
        prime: 'Option<AccountId32>',
        oldCount: 'u32',
      },
      execute: {
        proposal: 'Call',
        lengthBound: 'Compact<u32>',
      },
      propose: {
        threshold: 'Compact<u32>',
        proposal: 'Call',
        lengthBound: 'Compact<u32>',
      },
      vote: {
        proposal: 'H256',
        index: 'Compact<u32>',
        approve: 'bool',
      },
      __Unused4: 'Null',
      disapprove_proposal: {
        proposalHash: 'H256',
      },
      close: {
        proposalHash: 'H256',
        index: 'Compact<u32>',
        proposalWeightBound: 'SpWeightsWeightV2Weight',
        lengthBound: 'Compact<u32>'
      }
    }
  },
  /**
   * Lookup153: pallet_membership::pallet::Call<T, I>
   **/
  PalletMembershipCall: {
    _enum: {
      add_member: {
        who: 'MultiAddress',
      },
      remove_member: {
        who: 'MultiAddress',
      },
      swap_member: {
        remove: 'MultiAddress',
        add: 'MultiAddress',
      },
      reset_members: {
        members: 'Vec<AccountId32>',
      },
      change_key: {
        _alias: {
          new_: 'new',
        },
        new_: 'MultiAddress',
      },
      set_prime: {
        who: 'MultiAddress',
      },
      clear_prime: 'Null'
    }
  },
  /**
   * Lookup156: pallet_node_authorization::pallet::Call<T>
   **/
  PalletNodeAuthorizationCall: {
    _enum: {
      add_well_known_node: {
        nodeId: 'Bytes',
        owner: 'MultiAddress',
      },
      remove_well_known_node: {
        nodeId: 'Bytes',
      },
      swap_well_known_node: {
        removeId: 'Bytes',
        addId: 'Bytes',
      },
      transfer_node: {
        nodeId: 'Bytes',
        owner: 'MultiAddress',
      },
      add_connection: {
        nodeId: 'Bytes',
        connectionId: 'Bytes',
      },
      remove_connection: {
        nodeId: 'Bytes',
        connectionId: 'Bytes'
      }
    }
  },
  /**
   * Lookup157: pallet_runtime_upgrade::pallet::Call<T>
   **/
  PalletRuntimeUpgradeCall: {
    _enum: {
      set_code: {
        code: 'Bytes'
      }
    }
  },
  /**
   * Lookup158: pallet_utility::pallet::Call<T>
   **/
  PalletUtilityCall: {
    _enum: {
      batch: {
        calls: 'Vec<Call>',
      },
      as_derivative: {
        index: 'u16',
        call: 'Call',
      },
      batch_all: {
        calls: 'Vec<Call>',
      },
      dispatch_as: {
        asOrigin: 'CordRuntimeOriginCaller',
        call: 'Call',
      },
      force_batch: {
        calls: 'Vec<Call>',
      },
      with_weight: {
        call: 'Call',
        weight: 'SpWeightsWeightV2Weight'
      }
    }
  },
  /**
   * Lookup160: cord_runtime::OriginCaller
   **/
  CordRuntimeOriginCaller: {
    _enum: {
      system: 'FrameSupportDispatchRawOrigin',
      __Unused1: 'Null',
      __Unused2: 'Null',
      __Unused3: 'Null',
      Void: 'SpCoreVoid',
      __Unused5: 'Null',
      __Unused6: 'Null',
      __Unused7: 'Null',
      __Unused8: 'Null',
      __Unused9: 'Null',
      __Unused10: 'Null',
      __Unused11: 'Null',
      __Unused12: 'Null',
      __Unused13: 'Null',
      Council: 'PalletCollectiveRawOrigin',
      __Unused15: 'Null',
      TechnicalCommittee: 'PalletCollectiveRawOrigin',
      __Unused17: 'Null',
      __Unused18: 'Null',
      __Unused19: 'Null',
      __Unused20: 'Null',
      __Unused21: 'Null',
      __Unused22: 'Null',
      __Unused23: 'Null',
      __Unused24: 'Null',
      __Unused25: 'Null',
      __Unused26: 'Null',
      __Unused27: 'Null',
      __Unused28: 'Null',
      __Unused29: 'Null',
      __Unused30: 'Null',
      __Unused31: 'Null',
      __Unused32: 'Null',
      __Unused33: 'Null',
      __Unused34: 'Null',
      __Unused35: 'Null',
      __Unused36: 'Null',
      __Unused37: 'Null',
      __Unused38: 'Null',
      __Unused39: 'Null',
      __Unused40: 'Null',
      __Unused41: 'Null',
      __Unused42: 'Null',
      __Unused43: 'Null',
      __Unused44: 'Null',
      __Unused45: 'Null',
      __Unused46: 'Null',
      __Unused47: 'Null',
      __Unused48: 'Null',
      __Unused49: 'Null',
      __Unused50: 'Null',
      __Unused51: 'Null',
      __Unused52: 'Null',
      __Unused53: 'Null',
      __Unused54: 'Null',
      __Unused55: 'Null',
      __Unused56: 'Null',
      __Unused57: 'Null',
      __Unused58: 'Null',
      __Unused59: 'Null',
      __Unused60: 'Null',
      __Unused61: 'Null',
      __Unused62: 'Null',
      __Unused63: 'Null',
      __Unused64: 'Null',
      __Unused65: 'Null',
      __Unused66: 'Null',
      __Unused67: 'Null',
      __Unused68: 'Null',
      __Unused69: 'Null',
      __Unused70: 'Null',
      __Unused71: 'Null',
      __Unused72: 'Null',
      __Unused73: 'Null',
      __Unused74: 'Null',
      __Unused75: 'Null',
      __Unused76: 'Null',
      __Unused77: 'Null',
      __Unused78: 'Null',
      __Unused79: 'Null',
      __Unused80: 'Null',
      __Unused81: 'Null',
      __Unused82: 'Null',
      __Unused83: 'Null',
      __Unused84: 'Null',
      __Unused85: 'Null',
      __Unused86: 'Null',
      __Unused87: 'Null',
      __Unused88: 'Null',
      __Unused89: 'Null',
      __Unused90: 'Null',
      __Unused91: 'Null',
      __Unused92: 'Null',
      __Unused93: 'Null',
      __Unused94: 'Null',
      __Unused95: 'Null',
      __Unused96: 'Null',
      __Unused97: 'Null',
      __Unused98: 'Null',
      __Unused99: 'Null',
      __Unused100: 'Null',
      __Unused101: 'Null',
      Did: 'PalletDidOriginDidRawOrigin'
    }
  },
  /**
   * Lookup161: frame_support::dispatch::RawOrigin<sp_core::crypto::AccountId32>
   **/
  FrameSupportDispatchRawOrigin: {
    _enum: {
      Root: 'Null',
      Signed: 'AccountId32',
      None: 'Null'
    }
  },
  /**
   * Lookup162: pallet_collective::RawOrigin<sp_core::crypto::AccountId32, I>
   **/
  PalletCollectiveRawOrigin: {
    _enum: {
      Members: '(u32,u32)',
      Member: 'AccountId32',
      _Phantom: 'Null'
    }
  },
  /**
   * Lookup164: pallet_did::origin::DidRawOrigin<sp_core::crypto::AccountId32, sp_core::crypto::AccountId32>
   **/
  PalletDidOriginDidRawOrigin: {
    id: 'AccountId32',
    submitter: 'AccountId32'
  },
  /**
   * Lookup165: sp_core::Void
   **/
  SpCoreVoid: 'Null',
  /**
   * Lookup166: pallet_multisig::pallet::Call<T>
   **/
  PalletMultisigCall: {
    _enum: {
      as_multi_threshold_1: {
        otherSignatories: 'Vec<AccountId32>',
        call: 'Call',
      },
      as_multi: {
        threshold: 'u16',
        otherSignatories: 'Vec<AccountId32>',
        maybeTimepoint: 'Option<PalletMultisigTimepoint>',
        call: 'Call',
        maxWeight: 'SpWeightsWeightV2Weight',
      },
      approve_as_multi: {
        threshold: 'u16',
        otherSignatories: 'Vec<AccountId32>',
        maybeTimepoint: 'Option<PalletMultisigTimepoint>',
        callHash: '[u8;32]',
        maxWeight: 'SpWeightsWeightV2Weight',
      },
      cancel_as_multi: {
        threshold: 'u16',
        otherSignatories: 'Vec<AccountId32>',
        timepoint: 'PalletMultisigTimepoint',
        callHash: '[u8;32]'
      }
    }
  },
  /**
   * Lookup168: pallet_remark::pallet::Call<T>
   **/
  PalletRemarkCall: {
    _enum: {
      store: {
        remark: 'Bytes'
      }
    }
  },
  /**
   * Lookup169: pallet_identity::pallet::Call<T>
   **/
  PalletIdentityCall: {
    _enum: {
      add_registrar: {
        account: 'MultiAddress',
      },
      set_identity: {
        info: 'PalletIdentityIdentityInfo',
      },
      clear_identity: 'Null',
      request_judgement: {
        registrar: 'AccountId32',
      },
      cancel_request: {
        registrar: 'AccountId32',
      },
      provide_judgement: {
        target: 'MultiAddress',
        judgement: 'PalletIdentityJudgement',
        digest: 'H256',
      },
      kill_identity: {
        target: 'MultiAddress',
      },
      remove_registrar: {
        account: 'MultiAddress'
      }
    }
  },
  /**
   * Lookup170: pallet_identity::types::IdentityInfo<FieldLimit>
   **/
  PalletIdentityIdentityInfo: {
    additional: 'Vec<(Data,Data)>',
    display: 'Data',
    legal: 'Data',
    web: 'Data',
    email: 'Data'
  },
  /**
   * Lookup203: pallet_identity::types::Judgement
   **/
  PalletIdentityJudgement: {
    _enum: ['Unknown', 'Requested', 'Reasonable', 'KnownGood', 'OutOfDate', 'LowQuality', 'Erroneous']
  },
  /**
   * Lookup204: pallet_network_membership::pallet::Call<T>
   **/
  PalletNetworkMembershipCall: {
    _enum: {
      nominate: {
        member: 'AccountId32',
        expires: 'bool',
      },
      renew: {
        member: 'AccountId32',
      },
      revoke: {
        member: 'AccountId32'
      }
    }
  },
  /**
   * Lookup205: pallet_did::pallet::Call<T>
   **/
  PalletDidCall: {
    _enum: {
      create: {
        details: 'PalletDidDidDetailsDidCreationDetails',
        signature: 'PalletDidDidDetailsDidSignature',
      },
      set_authentication_key: {
        newKey: 'PalletDidDidDetailsDidVerificationKey',
      },
      set_delegation_key: {
        newKey: 'PalletDidDidDetailsDidVerificationKey',
      },
      remove_delegation_key: 'Null',
      set_assertion_key: {
        newKey: 'PalletDidDidDetailsDidVerificationKey',
      },
      remove_assertion_key: 'Null',
      add_key_agreement_key: {
        newKey: 'PalletDidDidDetailsDidEncryptionKey',
      },
      remove_key_agreement_key: {
        keyId: 'H256',
      },
      add_service_endpoint: {
        serviceEndpoint: 'PalletDidServiceEndpointsDidEndpoint',
      },
      remove_service_endpoint: {
        serviceId: 'Bytes',
      },
      delete: {
        endpointsToRemove: 'u32',
      },
      __Unused11: 'Null',
      submit_did_call: {
        didCall: 'PalletDidDidDetailsDidAuthorizedCallOperation',
        signature: 'PalletDidDidDetailsDidSignature',
      },
      __Unused13: 'Null',
      __Unused14: 'Null',
      dispatch_as: {
        didIdentifier: 'AccountId32',
        call: 'Call',
      },
      create_from_account: {
        authenticationKey: 'PalletDidDidDetailsDidVerificationKey'
      }
    }
  },
  /**
   * Lookup206: pallet_did::did_details::DidCreationDetails<sp_core::crypto::AccountId32, sp_core::crypto::AccountId32, cord_runtime::MaxNewKeyAgreementKeys, pallet_did::service_endpoints::DidEndpoint<T>>
   **/
  PalletDidDidDetailsDidCreationDetails: {
    did: 'AccountId32',
    submitter: 'AccountId32',
    newKeyAgreementKeys: 'BTreeSet<PalletDidDidDetailsDidEncryptionKey>',
    newAssertionKey: 'Option<PalletDidDidDetailsDidVerificationKey>',
    newDelegationKey: 'Option<PalletDidDidDetailsDidVerificationKey>',
    newServiceDetails: 'Vec<PalletDidServiceEndpointsDidEndpoint>'
  },
  /**
   * Lookup207: cord_runtime::MaxNewKeyAgreementKeys
   **/
  CordRuntimeMaxNewKeyAgreementKeys: 'Null',
  /**
   * Lookup208: pallet_did::service_endpoints::DidEndpoint<T>
   **/
  PalletDidServiceEndpointsDidEndpoint: {
    id: 'Bytes',
    serviceTypes: 'Vec<Bytes>',
    urls: 'Vec<Bytes>'
  },
  /**
   * Lookup217: pallet_did::did_details::DidEncryptionKey
   **/
  PalletDidDidDetailsDidEncryptionKey: {
    _enum: {
      X25519: '[u8;32]'
    }
  },
  /**
   * Lookup221: pallet_did::did_details::DidVerificationKey<sp_core::crypto::AccountId32>
   **/
  PalletDidDidDetailsDidVerificationKey: {
    _enum: {
      Ed25519: 'SpCoreEd25519Public',
      Sr25519: 'SpCoreSr25519Public',
      Ecdsa: 'SpCoreEcdsaPublic',
      Account: 'AccountId32'
    }
  },
  /**
   * Lookup222: sp_core::ecdsa::Public
   **/
  SpCoreEcdsaPublic: '[u8;33]',
  /**
   * Lookup225: pallet_did::did_details::DidSignature
   **/
  PalletDidDidDetailsDidSignature: {
    _enum: {
      Ed25519: 'SpCoreEd25519Signature',
      Sr25519: 'SpCoreSr25519Signature',
      Ecdsa: 'SpCoreEcdsaSignature'
    }
  },
  /**
   * Lookup226: sp_core::ecdsa::Signature
   **/
  SpCoreEcdsaSignature: '[u8;65]',
  /**
   * Lookup228: pallet_did::did_details::DidAuthorizedCallOperation<sp_core::crypto::AccountId32, cord_runtime::RuntimeCall, BlockNumber, sp_core::crypto::AccountId32, TxCounter>
   **/
  PalletDidDidDetailsDidAuthorizedCallOperation: {
    did: 'AccountId32',
    txCounter: 'u64',
    call: 'Call',
    blockNumber: 'u32',
    submitter: 'AccountId32'
  },
  /**
   * Lookup229: pallet_schema::pallet::Call<T>
   **/
  PalletSchemaCall: {
    _enum: {
      create: {
        txSchema: 'Bytes'
      }
    }
  },
  /**
   * Lookup231: pallet_registry::pallet::Call<T>
   **/
  PalletRegistryCall: {
    _enum: {
      add_admin_delegate: {
        registryId: 'Bytes',
        delegate: 'AccountId32',
      },
      add_delegate: {
        registryId: 'Bytes',
        delegate: 'AccountId32',
      },
      remove_delegate: {
        registryId: 'Bytes',
        authorizationId: 'Bytes',
      },
      create: {
        txRegistry: 'Bytes',
        txSchema: 'Option<Bytes>',
      },
      update: {
        txRegistry: 'Bytes',
        registryId: 'Bytes',
      },
      archive: {
        registryId: 'Bytes',
      },
      restore: {
        registryId: 'Bytes'
      }
    }
  },
  /**
   * Lookup234: pallet_stream::pallet::Call<T>
   **/
  PalletStreamCall: {
    _enum: {
      create: {
        streamDigest: 'H256',
        authorization: 'Bytes',
        schemaId: 'Option<Bytes>',
      },
      update: {
        streamId: 'Bytes',
        streamDigest: 'H256',
        authorization: 'Bytes',
      },
      revoke: {
        streamId: 'Bytes',
        authorization: 'Bytes',
      },
      restore: {
        streamId: 'Bytes',
        authorization: 'Bytes',
      },
      remove: {
        streamId: 'Bytes',
        authorization: 'Bytes',
      },
      digest: {
        streamId: 'Bytes',
        streamDigest: 'H256',
        authorization: 'Bytes'
      }
    }
  },
  /**
   * Lookup235: pallet_did_name::pallet::Call<T>
   **/
  PalletDidNameCall: {
    _enum: {
      register: {
        name: 'Bytes',
      },
      release: 'Null',
      __Unused2: 'Null',
      ban: {
        name: 'Bytes',
      },
      unban: {
        name: 'Bytes'
      }
    }
  },
  /**
   * Lookup236: pallet_unique::pallet::Call<T>
   **/
  PalletUniqueCall: {
    _enum: {
      create: {
        uniqueTxn: 'Bytes',
        authorization: 'Option<Bytes>',
      },
      update: {
        uniqueId: 'Bytes',
        uniqueTxn: 'Bytes',
        authorization: 'Option<Bytes>',
      },
      revoke: {
        uniqueTxn: 'Bytes',
        authorization: 'Bytes',
      },
      remove: {
        uniqueId: 'Bytes',
        authorization: 'Option<Bytes>'
      }
    }
  },
  /**
   * Lookup237: pallet_score::pallet::Call<T>
   **/
  PalletScoreCall: {
    _enum: {
      add_rating: {
        journal: 'PalletScoreRatingInput',
        authorization: 'Bytes'
      }
    }
  },
  /**
   * Lookup238: pallet_score::types::RatingInput<pallet_score::types::RatingEntryDetails<sp_core::crypto::AccountId32, bounded_collections::bounded_vec::BoundedVec<T, S>, sp_core::crypto::AccountId32, pallet_score::types::RatingTypeOf, RatingOf, pallet_score::types::RatingEntryType, CountOf>, primitive_types::H256, sp_core::crypto::AccountId32>
   **/
  PalletScoreRatingInput: {
    entry: 'PalletScoreRatingEntryDetails',
    digest: 'H256',
    creator: 'AccountId32'
  },
  /**
   * Lookup239: pallet_score::types::RatingEntryDetails<sp_core::crypto::AccountId32, bounded_collections::bounded_vec::BoundedVec<T, S>, sp_core::crypto::AccountId32, pallet_score::types::RatingTypeOf, RatingOf, pallet_score::types::RatingEntryType, CountOf>
   **/
  PalletScoreRatingEntryDetails: {
    entity: 'AccountId32',
    tid: 'Bytes',
    collector: 'AccountId32',
    ratingType: 'PalletScoreRatingTypeOf',
    rating: 'u32',
    entryType: 'PalletScoreRatingEntryType',
    count: 'u32'
  },
  /**
   * Lookup241: pallet_score::types::RatingTypeOf
   **/
  PalletScoreRatingTypeOf: {
    _enum: ['Overall', 'Delivery']
  },
  /**
   * Lookup242: pallet_score::types::RatingEntryType
   **/
  PalletScoreRatingEntryType: {
    _enum: ['Credit', 'Debit']
  },
  /**
   * Lookup243: pallet_sudo::pallet::Call<T>
   **/
  PalletSudoCall: {
    _enum: {
      sudo: {
        call: 'Call',
      },
      sudo_unchecked_weight: {
        call: 'Call',
        weight: 'SpWeightsWeightV2Weight',
      },
      set_key: {
        _alias: {
          new_: 'new',
        },
        new_: 'MultiAddress',
      },
      sudo_as: {
        who: 'MultiAddress',
        call: 'Call'
      }
    }
  },
  /**
   * Lookup246: pallet_scheduler::pallet::Error<T>
   **/
  PalletSchedulerError: {
    _enum: ['FailedToSchedule', 'NotFound', 'TargetBlockNumberInPast', 'RescheduleNoChange', 'Named']
  },
  /**
   * Lookup253: sp_consensus_babe::digests::PreDigest
   **/
  SpConsensusBabeDigestsPreDigest: {
    _enum: {
      __Unused0: 'Null',
      Primary: 'SpConsensusBabeDigestsPrimaryPreDigest',
      SecondaryPlain: 'SpConsensusBabeDigestsSecondaryPlainPreDigest',
      SecondaryVRF: 'SpConsensusBabeDigestsSecondaryVRFPreDigest'
    }
  },
  /**
   * Lookup254: sp_consensus_babe::digests::PrimaryPreDigest
   **/
  SpConsensusBabeDigestsPrimaryPreDigest: {
    authorityIndex: 'u32',
    slot: 'u64',
    vrfSignature: 'SpCoreSr25519VrfVrfSignature'
  },
  /**
   * Lookup255: sp_core::sr25519::vrf::VrfSignature
   **/
  SpCoreSr25519VrfVrfSignature: {
    output: '[u8;32]',
    proof: '[u8;64]'
  },
  /**
   * Lookup256: sp_consensus_babe::digests::SecondaryPlainPreDigest
   **/
  SpConsensusBabeDigestsSecondaryPlainPreDigest: {
    authorityIndex: 'u32',
    slot: 'u64'
  },
  /**
   * Lookup257: sp_consensus_babe::digests::SecondaryVRFPreDigest
   **/
  SpConsensusBabeDigestsSecondaryVRFPreDigest: {
    authorityIndex: 'u32',
    slot: 'u64',
    vrfSignature: 'SpCoreSr25519VrfVrfSignature'
  },
  /**
   * Lookup258: sp_consensus_babe::BabeEpochConfiguration
   **/
  SpConsensusBabeBabeEpochConfiguration: {
    c: '(u64,u64)',
    allowedSlots: 'SpConsensusBabeAllowedSlots'
  },
  /**
   * Lookup262: pallet_babe::pallet::Error<T>
   **/
  PalletBabeError: {
    _enum: ['InvalidEquivocationProof', 'InvalidKeyOwnershipProof', 'DuplicateOffenceReport', 'InvalidConfiguration']
  },
  /**
   * Lookup264: pallet_indices::pallet::Error<T>
   **/
  PalletIndicesError: {
    _enum: ['NotAssigned', 'NotOwner', 'InUse', 'NotTransfer', 'Permanent']
  },
  /**
   * Lookup266: pallet_balances::types::BalanceLock<Balance>
   **/
  PalletBalancesBalanceLock: {
    id: '[u8;8]',
    amount: 'u128',
    reasons: 'PalletBalancesReasons'
  },
  /**
   * Lookup267: pallet_balances::types::Reasons
   **/
  PalletBalancesReasons: {
    _enum: ['Fee', 'Misc', 'All']
  },
  /**
   * Lookup270: pallet_balances::types::ReserveData<ReserveIdentifier, Balance>
   **/
  PalletBalancesReserveData: {
    id: '[u8;8]',
    amount: 'u128'
  },
  /**
   * Lookup274: cord_runtime::RuntimeHoldReason
   **/
  CordRuntimeRuntimeHoldReason: 'Null',
  /**
   * Lookup277: pallet_balances::types::IdAmount<Id, Balance>
   **/
  PalletBalancesIdAmount: {
    id: 'Null',
    amount: 'u128'
  },
  /**
   * Lookup279: pallet_balances::pallet::Error<T, I>
   **/
  PalletBalancesError: {
    _enum: ['VestingBalance', 'LiquidityRestrictions', 'InsufficientBalance', 'ExistentialDeposit', 'Expendability', 'ExistingVestingSchedule', 'DeadAccount', 'TooManyReserves', 'TooManyHolds', 'TooManyFreezes']
  },
  /**
   * Lookup280: cord_authority_membership::pallet::Error<T>
   **/
  CordAuthorityMembershipError: {
    _enum: ['MemberAlreadyIncoming', 'MemberAlreadyExists', 'MemberAlreadyOutgoing', 'MemberNotFound', 'MemberBlackListed', 'SessionKeysNotAdded', 'MemberNotBlackListed', 'NetworkMembershipNotFound']
  },
  /**
   * Lookup281: sp_staking::offence::OffenceDetails<sp_core::crypto::AccountId32, Offender>
   **/
  SpStakingOffenceOffenceDetails: {
    offender: '(AccountId32,CordRuntimeEntitiesValidatorFullIdentification)',
    reporters: 'Vec<AccountId32>'
  },
  /**
   * Lookup287: sp_core::crypto::KeyTypeId
   **/
  SpCoreCryptoKeyTypeId: '[u8;4]',
  /**
   * Lookup288: pallet_session::pallet::Error<T>
   **/
  PalletSessionError: {
    _enum: ['InvalidProof', 'NoAssociatedValidatorId', 'DuplicatedKey', 'NoKeys', 'NoAccount']
  },
  /**
   * Lookup289: pallet_grandpa::StoredState<N>
   **/
  PalletGrandpaStoredState: {
    _enum: {
      Live: 'Null',
      PendingPause: {
        scheduledAt: 'u32',
        delay: 'u32',
      },
      Paused: 'Null',
      PendingResume: {
        scheduledAt: 'u32',
        delay: 'u32'
      }
    }
  },
  /**
   * Lookup290: pallet_grandpa::StoredPendingChange<N, Limit>
   **/
  PalletGrandpaStoredPendingChange: {
    scheduledAt: 'u32',
    delay: 'u32',
    nextAuthorities: 'Vec<(SpConsensusGrandpaAppPublic,u64)>',
    forced: 'Option<u32>'
  },
  /**
   * Lookup293: pallet_grandpa::pallet::Error<T>
   **/
  PalletGrandpaError: {
    _enum: ['PauseFailed', 'ResumeFailed', 'ChangePending', 'TooSoon', 'InvalidKeyOwnershipProof', 'InvalidEquivocationProof', 'DuplicateOffenceReport']
  },
  /**
   * Lookup297: pallet_im_online::pallet::Error<T>
   **/
  PalletImOnlineError: {
    _enum: ['InvalidKey', 'DuplicatedHeartbeat']
  },
  /**
   * Lookup300: pallet_preimage::RequestStatus<sp_core::crypto::AccountId32, Balance>
   **/
  PalletPreimageRequestStatus: {
    _enum: {
      Unrequested: {
        deposit: '(AccountId32,u128)',
        len: 'u32',
      },
      Requested: {
        deposit: 'Option<(AccountId32,u128)>',
        count: 'u32',
        len: 'Option<u32>'
      }
    }
  },
  /**
   * Lookup305: pallet_preimage::pallet::Error<T>
   **/
  PalletPreimageError: {
    _enum: ['TooBig', 'AlreadyNoted', 'NotAuthorized', 'NotNoted', 'Requested', 'NotRequested']
  },
  /**
   * Lookup307: pallet_collective::Votes<sp_core::crypto::AccountId32, BlockNumber>
   **/
  PalletCollectiveVotes: {
    index: 'u32',
    threshold: 'u32',
    ayes: 'Vec<AccountId32>',
    nays: 'Vec<AccountId32>',
    end: 'u32'
  },
  /**
   * Lookup308: pallet_collective::pallet::Error<T, I>
   **/
  PalletCollectiveError: {
    _enum: ['NotMember', 'DuplicateProposal', 'ProposalMissing', 'WrongIndex', 'DuplicateVote', 'AlreadyInitialized', 'TooEarly', 'TooManyProposals', 'WrongProposalWeight', 'WrongProposalLength', 'PrimeAccountNotMember']
  },
  /**
   * Lookup310: pallet_membership::pallet::Error<T, I>
   **/
  PalletMembershipError: {
    _enum: ['AlreadyMember', 'NotMember', 'TooManyMembers']
  },
  /**
   * Lookup315: pallet_node_authorization::types::NodeInfo<bounded_collections::bounded_vec::BoundedVec<T, S>, sp_core::crypto::AccountId32>
   **/
  PalletNodeAuthorizationNodeInfo: {
    id: 'Bytes',
    owner: 'AccountId32'
  },
  /**
   * Lookup317: pallet_node_authorization::pallet::Error<T>
   **/
  PalletNodeAuthorizationError: {
    _enum: ['NodeIdTooLong', 'PeerIdTooLong', 'TooManyNodes', 'AlreadyJoined', 'NotExist', 'AlreadyClaimed', 'NotOwner', 'PermissionDenied', 'InvalidUtf8', 'InvalidNodeIdentifier', 'AlreadyConnected']
  },
  /**
   * Lookup318: pallet_utility::pallet::Error<T>
   **/
  PalletUtilityError: {
    _enum: ['TooManyCalls']
  },
  /**
   * Lookup320: pallet_multisig::Multisig<BlockNumber, Balance, sp_core::crypto::AccountId32, MaxApprovals>
   **/
  PalletMultisigMultisig: {
    when: 'PalletMultisigTimepoint',
    deposit: 'u128',
    depositor: 'AccountId32',
    approvals: 'Vec<AccountId32>'
  },
  /**
   * Lookup322: pallet_multisig::pallet::Error<T>
   **/
  PalletMultisigError: {
    _enum: ['MinimumThreshold', 'AlreadyApproved', 'NoApprovalsNeeded', 'TooFewSignatories', 'TooManySignatories', 'SignatoriesOutOfOrder', 'SenderInSignatories', 'NotFound', 'NotOwner', 'NoTimepoint', 'WrongTimepoint', 'UnexpectedTimepoint', 'MaxWeightTooLow', 'AlreadyStored']
  },
  /**
   * Lookup323: pallet_remark::pallet::Error<T>
   **/
  PalletRemarkError: {
    _enum: ['Empty', 'BadContext']
  },
  /**
   * Lookup324: pallet_identity::types::Registration<sp_core::crypto::AccountId32, MaxJudgements, MaxAdditionalFields>
   **/
  PalletIdentityRegistration: {
    judgements: 'Vec<(AccountId32,PalletIdentityJudgement)>',
    info: 'PalletIdentityIdentityInfo'
  },
  /**
   * Lookup329: pallet_identity::pallet::Error<T>
   **/
  PalletIdentityError: {
    _enum: ['NotFound', 'RegistrarNotFound', 'RegistrarAlreadyExists', 'NotNamed', 'EmptyIndex', 'NoIdentity', 'StickyJudgement', 'JudgementGiven', 'InvalidJudgement', 'InvalidTarget', 'TooManyFields', 'TooManyRegistrars', 'AlreadyClaimed', 'JudgementForDifferentIdentity', 'JudgementPaymentFailed']
  },
  /**
   * Lookup330: pallet_network_membership::types::MemberData<BlockNumber>
   **/
  PalletNetworkMembershipMemberData: {
    expireOn: 'u32'
  },
  /**
   * Lookup332: pallet_network_membership::pallet::Error<T>
   **/
  PalletNetworkMembershipError: {
    _enum: ['MembershipNotFound', 'MembershipAlreadyAcquired', 'MembershipRenewalAlreadyRequested', 'OriginNotAuthorized', 'MembershipRequestRejected', 'MembershipExpired', 'MaxMembersExceededForTheBlock']
  },
  /**
   * Lookup333: pallet_did::did_details::DidDetails<T>
   **/
  PalletDidDidDetails: {
    authenticationKey: 'H256',
    keyAgreementKeys: 'BTreeSet<H256>',
    delegationKey: 'Option<H256>',
    assertionKey: 'Option<H256>',
    publicKeys: 'BTreeMap<H256, PalletDidDidDetailsDidPublicKeyDetails>',
    lastTxCounter: 'u64'
  },
  /**
   * Lookup338: pallet_did::did_details::DidPublicKeyDetails<BlockNumber, sp_core::crypto::AccountId32>
   **/
  PalletDidDidDetailsDidPublicKeyDetails: {
    key: 'PalletDidDidDetailsDidPublicKey',
    blockNumber: 'u32'
  },
  /**
   * Lookup339: pallet_did::did_details::DidPublicKey<sp_core::crypto::AccountId32>
   **/
  PalletDidDidDetailsDidPublicKey: {
    _enum: {
      PublicVerificationKey: 'PalletDidDidDetailsDidVerificationKey',
      PublicEncryptionKey: 'PalletDidDidDetailsDidEncryptionKey'
    }
  },
  /**
   * Lookup344: pallet_did::pallet::Error<T>
   **/
  PalletDidError: {
    _enum: ['InvalidSignatureFormat', 'InvalidSignature', 'AlreadyExists', 'NotFound', 'VerificationKeyNotFound', 'InvalidNonce', 'UnsupportedDidAuthorizationCall', 'InvalidDidAuthorizationCall', 'MaxNewKeyAgreementKeysLimitExceeded', 'MaxPublicKeysExceeded', 'MaxKeyAgreementKeysExceeded', 'BadDidOrigin', 'TransactionExpired', 'AlreadyDeleted', 'MaxNumberOfServicesExceeded', 'MaxServiceIdLengthExceeded', 'MaxServiceTypeLengthExceeded', 'MaxNumberOfTypesPerServiceExceeded', 'MaxServiceUrlLengthExceeded', 'MaxNumberOfUrlsPerServiceExceeded', 'ServiceAlreadyExists', 'ServiceNotFound', 'InvalidServiceEncoding', 'MaxStoredEndpointsCountExceeded', 'Internal']
  },
  /**
   * Lookup345: pallet_schema::types::SchemaEntry<bounded_collections::bounded_vec::BoundedVec<T, S>, primitive_types::H256, sp_core::crypto::AccountId32, BlockNumber>
   **/
  PalletSchemaSchemaEntry: {
    schema: 'Bytes',
    digest: 'H256',
    creator: 'AccountId32',
    createdAt: 'u32'
  },
  /**
   * Lookup346: pallet_schema::pallet::Error<T>
   **/
  PalletSchemaError: {
    _enum: ['SchemaAlreadyAnchored', 'SchemaNotFound', 'InvalidIdentifierLength', 'UnableToPayFees', 'CreatorNotFound', 'MaxEncodedSchemaLimitExceeded', 'EmptyTransaction']
  },
  /**
   * Lookup347: pallet_registry::types::RegistryEntry<bounded_collections::bounded_vec::BoundedVec<T, S>, primitive_types::H256, cord_primitives::curi::Ss58Identifier, sp_core::crypto::AccountId32, StatusOf>
   **/
  PalletRegistryRegistryEntry: {
    details: 'Bytes',
    digest: 'H256',
    schema: 'Option<Bytes>',
    creator: 'AccountId32',
    archive: 'bool'
  },
  /**
   * Lookup348: pallet_registry::types::RegistryAuthorization<cord_primitives::curi::Ss58Identifier, sp_core::crypto::AccountId32, cord_primitives::curi::Ss58Identifier, pallet_registry::types::Permissions>
   **/
  PalletRegistryRegistryAuthorization: {
    registryId: 'Bytes',
    delegate: 'AccountId32',
    schema: 'Option<Bytes>',
    permissions: 'PalletRegistryPermissions'
  },
  /**
   * Lookup349: pallet_registry::types::Permissions
   **/
  PalletRegistryPermissions: {
    bits: 'u32'
  },
  /**
   * Lookup352: pallet_registry::types::RegistryCommit<pallet_registry::types::RegistryCommitActionOf, primitive_types::H256, sp_core::crypto::AccountId32, BlockNumber>
   **/
  PalletRegistryRegistryCommit: {
    commit: 'PalletRegistryRegistryCommitActionOf',
    digest: 'H256',
    committedBy: 'AccountId32',
    createdAt: 'u32'
  },
  /**
   * Lookup353: pallet_registry::types::RegistryCommitActionOf
   **/
  PalletRegistryRegistryCommitActionOf: {
    _enum: ['Genesis', 'Authorization', 'Deauthorization', 'Update', 'Archive', 'Restore']
  },
  /**
   * Lookup355: pallet_registry::pallet::Error<T>
   **/
  PalletRegistryError: {
    _enum: ['RegistryAlreadyAnchored', 'RegistryNotFound', 'UnauthorizedOperation', 'InvalidIdentifier', 'InvalidIdentifierLength', 'InvalidIdentifierPrefix', 'ArchivedRegistry', 'RegistryNotArchived', 'TooManyRegistryEntries', 'MaxEncodedRegistryLimitExceeded', 'RegistryAuthoritiesLimitExceeded', 'MaxRegistryCommitsExceeded', 'EmptyTransaction', 'InvalidSchema', 'SchemaNotFound', 'DelegateAlreadyAdded', 'AuthorizationNotFound', 'RegistrySchemaMismatch']
  },
  /**
   * Lookup356: pallet_stream::types::StreamEntry<primitive_types::H256, sp_core::crypto::AccountId32, cord_primitives::curi::Ss58Identifier, cord_primitives::curi::Ss58Identifier, StatusOf>
   **/
  PalletStreamStreamEntry: {
    _alias: {
      registry_: 'registry'
    },
    digest: 'H256',
    creator: 'AccountId32',
    schema: 'Option<Bytes>',
    registry_: 'Bytes',
    revoked: 'bool'
  },
  /**
   * Lookup358: pallet_stream::types::StreamCommit<pallet_stream::types::StreamCommitActionOf, primitive_types::H256, sp_core::crypto::AccountId32, BlockNumber>
   **/
  PalletStreamStreamCommit: {
    commit: 'PalletStreamStreamCommitActionOf',
    digest: 'H256',
    committedBy: 'AccountId32',
    createdAt: 'PalletStreamTimepoint'
  },
  /**
   * Lookup359: pallet_stream::types::StreamCommitActionOf
   **/
  PalletStreamStreamCommitActionOf: {
    _enum: ['Genesis', 'Update', 'Revoke', 'Restore', 'Remove', 'Digest']
  },
  /**
   * Lookup360: pallet_stream::types::Timepoint<BlockNumber>
   **/
  PalletStreamTimepoint: {
    height: 'u32',
    index: 'u32'
  },
  /**
   * Lookup362: pallet_stream::pallet::Error<T>
   **/
  PalletStreamError: {
    _enum: ['StreamAlreadyAnchored', 'StreamNotFound', 'RevokedStream', 'StreamNotRevoked', 'UnauthorizedOperation', 'StreamLinkNotFound', 'StreamLinkRevoked', 'InvalidSignature', 'HashAlreadyAnchored', 'ExpiredSignature', 'InvalidStreamIdentifier', 'InvalidIdentifierLength', 'StreamSpaceMismatch', 'DigestHashAlreadyAnchored', 'InvalidTransactionHash', 'MetadataLimitExceeded', 'MetadataAlreadySet', 'MetadataNotFound', 'TooManyDelegates', 'TooManyDelegatesToRemove', 'AuthorizationDetailsNotFound', 'MaxStreamCommitsExceeded']
  },
  /**
   * Lookup363: pallet_did_name::did_name::DidNameOwnership<sp_core::crypto::AccountId32, BlockNumber>
   **/
  PalletDidNameDidNameDidNameOwnership: {
    owner: 'AccountId32',
    registeredAt: 'u32'
  },
  /**
   * Lookup364: pallet_did_name::pallet::Error<T>
   **/
  PalletDidNameError: {
    _enum: ['InsufficientFunds', 'AlreadyExists', 'NotFound', 'OwnerAlreadyExists', 'OwnerNotFound', 'Banned', 'NotBanned', 'AlreadyBanned', 'NotAuthorized', 'NameTooShort', 'NameExceedsMaxLength', 'NamePrefixTooShort', 'NamePrefixTooLong', 'InvalidSuffix', 'SuffixTooLong', 'InvalidFormat']
  },
  /**
   * Lookup365: pallet_unique::types::UniqueEntry<bounded_collections::bounded_vec::BoundedVec<T, S>, sp_core::crypto::AccountId32, Option<cord_primitives::curi::Ss58Identifier>, StatusOf>
   **/
  PalletUniqueUniqueEntry: {
    _alias: {
      registry_: 'registry'
    },
    digest: 'Bytes',
    creator: 'AccountId32',
    registry_: 'Option<Option<Bytes>>',
    revoked: 'bool'
  },
  /**
   * Lookup368: pallet_unique::types::UniqueCommit<pallet_unique::types::UniqueCommitActionOf, bounded_collections::bounded_vec::BoundedVec<T, S>, sp_core::crypto::AccountId32, BlockNumber>
   **/
  PalletUniqueUniqueCommit: {
    commit: 'PalletUniqueUniqueCommitActionOf',
    digest: 'Bytes',
    committedBy: 'AccountId32',
    createdAt: 'PalletUniqueTimepoint'
  },
  /**
   * Lookup369: pallet_unique::types::UniqueCommitActionOf
   **/
  PalletUniqueUniqueCommitActionOf: {
    _enum: ['Genesis', 'Update', 'Revoke', 'Restore', 'Remove']
  },
  /**
   * Lookup370: pallet_unique::types::Timepoint<BlockNumber>
   **/
  PalletUniqueTimepoint: {
    height: 'u32',
    index: 'u32'
  },
  /**
   * Lookup372: pallet_unique::pallet::Error<T>
   **/
  PalletUniqueError: {
    _enum: ['UniqueAlreadyAnchored', 'UniqueNotFound', 'RevokedUnique', 'UniqueNotRevoked', 'UnauthorizedOperation', 'UniqueLinkNotFound', 'UniqueLinkRevoked', 'InvalidSignature', 'HashAlreadyAnchored', 'ExpiredSignature', 'InvalidUniqueIdentifier', 'UniqueSpaceMismatch', 'DigestHashAlreadyAnchored', 'InvalidTransactionHash', 'MetadataLimitExceeded', 'MetadataAlreadySet', 'MetadataNotFound', 'TooManyDelegates', 'TooManyDelegatesToRemove', 'AuthorizationDetailsNotFound', 'MaxUniqueCommitsExceeded', 'InvalidIdentifierLength', 'RegistryIdMismatch', 'MaxEncodedLimitExceeded', 'EmptyTransaction']
  },
  /**
   * Lookup374: pallet_score::types::RatingEntry<pallet_score::types::RatingEntryDetails<sp_core::crypto::AccountId32, bounded_collections::bounded_vec::BoundedVec<T, S>, sp_core::crypto::AccountId32, pallet_score::types::RatingTypeOf, RatingOf, pallet_score::types::RatingEntryType, CountOf>, primitive_types::H256, BlockNumber, cord_primitives::curi::Ss58Identifier, sp_core::crypto::AccountId32>
   **/
  PalletScoreRatingEntry: {
    _alias: {
      registry_: 'registry'
    },
    entry: 'PalletScoreRatingEntryDetails',
    digest: 'H256',
    createdAt: 'u32',
    registry_: 'Bytes',
    creator: 'AccountId32'
  },
  /**
   * Lookup376: pallet_score::types::ScoreEntry<CountOf, RatingOf>
   **/
  PalletScoreScoreEntry: {
    count: 'u32',
    rating: 'u32'
  },
  /**
   * Lookup378: pallet_score::pallet::Error<T>
   **/
  PalletScoreError: {
    _enum: ['InvalidIdentifierLength', 'InvalidDigest', 'InvalidSignature', 'InvalidRatingIdentifier', 'TransactionAlreadyRated', 'InvalidRatingValue', 'TooManyJournalEntries', 'InvalidEntitySignature', 'DigestAlreadyAnchored', 'CountCannotBeZero', 'RatingCannotBeZero']
  },
  /**
   * Lookup379: pallet_sudo::pallet::Error<T>
   **/
  PalletSudoError: {
    _enum: ['RequireSudo']
  },
  /**
   * Lookup381: sp_runtime::MultiSignature
   **/
  SpRuntimeMultiSignature: {
    _enum: {
      Ed25519: 'SpCoreEd25519Signature',
      Sr25519: 'SpCoreSr25519Signature',
      Ecdsa: 'SpCoreEcdsaSignature'
    }
  },
  /**
   * Lookup383: pallet_network_membership::CheckNetworkMembership<T>
   **/
  PalletNetworkMembershipCheckNetworkMembership: 'Null',
  /**
   * Lookup384: frame_system::extensions::check_non_zero_sender::CheckNonZeroSender<T>
   **/
  FrameSystemExtensionsCheckNonZeroSender: 'Null',
  /**
   * Lookup385: frame_system::extensions::check_spec_version::CheckSpecVersion<T>
   **/
  FrameSystemExtensionsCheckSpecVersion: 'Null',
  /**
   * Lookup386: frame_system::extensions::check_tx_version::CheckTxVersion<T>
   **/
  FrameSystemExtensionsCheckTxVersion: 'Null',
  /**
   * Lookup387: frame_system::extensions::check_genesis::CheckGenesis<T>
   **/
  FrameSystemExtensionsCheckGenesis: 'Null',
  /**
   * Lookup390: frame_system::extensions::check_nonce::CheckNonce<T>
   **/
  FrameSystemExtensionsCheckNonce: 'Compact<u32>',
  /**
   * Lookup391: frame_system::extensions::check_weight::CheckWeight<T>
   **/
  FrameSystemExtensionsCheckWeight: 'Null',
  /**
   * Lookup392: cord_runtime::Runtime
   **/
  CordRuntimeRuntime: 'Null'
};
