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
   * Lookup9: frame_support::dispatch::PerDispatchClass<sp_weights::weight_v2::Weight>
   **/
  FrameSupportDispatchPerDispatchClassWeight: {
    normal: 'SpWeightsWeightV2Weight',
    operational: 'SpWeightsWeightV2Weight',
    mandatory: 'SpWeightsWeightV2Weight'
  },
  /**
   * Lookup10: sp_weights::weight_v2::Weight
   **/
  SpWeightsWeightV2Weight: {
    refTime: 'Compact<u64>',
    proofSize: 'Compact<u64>'
  },
  /**
   * Lookup15: sp_runtime::generic::digest::Digest
   **/
  SpRuntimeDigest: {
    logs: 'Vec<SpRuntimeDigestDigestItem>'
  },
  /**
   * Lookup17: sp_runtime::generic::digest::DigestItem
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
   * Lookup20: frame_system::EventRecord<cord_runtime::RuntimeEvent, primitive_types::H256>
   **/
  FrameSystemEventRecord: {
    phase: 'FrameSystemPhase',
    event: 'Event',
    topics: 'Vec<H256>'
  },
  /**
   * Lookup22: frame_system::pallet::Event<T>
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
        hash_: 'H256',
      },
      UpgradeAuthorized: {
        codeHash: 'H256',
        checkVersion: 'bool'
      }
    }
  },
  /**
   * Lookup23: frame_support::dispatch::DispatchInfo
   **/
  FrameSupportDispatchDispatchInfo: {
    weight: 'SpWeightsWeightV2Weight',
    class: 'FrameSupportDispatchDispatchClass',
    paysFee: 'FrameSupportDispatchPays'
  },
  /**
   * Lookup24: frame_support::dispatch::DispatchClass
   **/
  FrameSupportDispatchDispatchClass: {
    _enum: ['Normal', 'Operational', 'Mandatory']
  },
  /**
   * Lookup25: frame_support::dispatch::Pays
   **/
  FrameSupportDispatchPays: {
    _enum: ['Yes', 'No']
  },
  /**
   * Lookup26: sp_runtime::DispatchError
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
   * Lookup27: sp_runtime::ModuleError
   **/
  SpRuntimeModuleError: {
    index: 'u8',
    error: '[u8;4]'
  },
  /**
   * Lookup28: sp_runtime::TokenError
   **/
  SpRuntimeTokenError: {
    _enum: ['FundsUnavailable', 'OnlyProvider', 'BelowMinimum', 'CannotCreate', 'UnknownAsset', 'Frozen', 'Unsupported', 'CannotCreateHold', 'NotExpendable', 'Blocked']
  },
  /**
   * Lookup29: sp_arithmetic::ArithmeticError
   **/
  SpArithmeticArithmeticError: {
    _enum: ['Underflow', 'Overflow', 'DivisionByZero']
  },
  /**
   * Lookup30: sp_runtime::TransactionalError
   **/
  SpRuntimeTransactionalError: {
    _enum: ['LimitReached', 'NoLayer']
  },
  /**
   * Lookup31: pallet_utility::pallet::Event
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
   * Lookup34: cord_authority_membership::pallet::Event<T>
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
   * Lookup36: pallet_indices::pallet::Event<T>
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
   * Lookup37: pallet_balances::pallet::Event<T, I>
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
        amount: 'u128',
      },
      TotalIssuanceForced: {
        _alias: {
          new_: 'new',
        },
        old: 'u128',
        new_: 'u128'
      }
    }
  },
  /**
   * Lookup38: frame_support::traits::tokens::misc::BalanceStatus
   **/
  FrameSupportTokensMiscBalanceStatus: {
    _enum: ['Free', 'Reserved']
  },
  /**
   * Lookup39: pallet_session::pallet::Event
   **/
  PalletSessionEvent: {
    _enum: {
      NewSession: {
        sessionIndex: 'u32'
      }
    }
  },
  /**
   * Lookup40: pallet_collective::pallet::Event<T, I>
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
   * Lookup41: pallet_membership::pallet::Event<T, I>
   **/
  PalletMembershipEvent: {
    _enum: ['MemberAdded', 'MemberRemoved', 'MembersSwapped', 'MembersReset', 'KeyChanged', 'Dummy']
  },
  /**
   * Lookup44: pallet_grandpa::pallet::Event
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
   * Lookup47: sp_consensus_grandpa::app::Public
   **/
  SpConsensusGrandpaAppPublic: '[u8;32]',
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
  PalletImOnlineSr25519AppSr25519Public: '[u8;32]',
  /**
   * Lookup52: cord_runtime::entities::ValidatorFullIdentification
   **/
  CordRuntimeEntitiesValidatorFullIdentification: 'Null',
  /**
   * Lookup53: pallet_offences::pallet::Event
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
   * Lookup55: pallet_identity::pallet::Event<T>
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
        registrarIndex: 'u32',
      },
      RegistrarRemoved: {
        registrar: 'AccountId32',
      },
      SubIdentityAdded: {
        sub: 'AccountId32',
        main: 'AccountId32',
      },
      SubIdentityRemoved: {
        sub: 'AccountId32',
        main: 'AccountId32',
      },
      SubIdentityRevoked: {
        sub: 'AccountId32',
        main: 'AccountId32',
      },
      AuthorityAdded: {
        authority: 'AccountId32',
      },
      AuthorityRemoved: {
        authority: 'AccountId32',
      },
      UsernameSet: {
        who: 'AccountId32',
        username: 'Bytes',
      },
      UsernameQueued: {
        who: 'AccountId32',
        username: 'Bytes',
        expiration: 'u32',
      },
      PreapprovalExpired: {
        whose: 'AccountId32',
      },
      PrimaryUsernameSet: {
        who: 'AccountId32',
        username: 'Bytes',
      },
      DanglingUsernameRemoved: {
        who: 'AccountId32',
        username: 'Bytes'
      }
    }
  },
  /**
   * Lookup57: pallet_scheduler::pallet::Event<T>
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
      RetrySet: {
        task: '(u32,u32)',
        id: 'Option<[u8;32]>',
        period: 'u32',
        retries: 'u8',
      },
      RetryCancelled: {
        task: '(u32,u32)',
        id: 'Option<[u8;32]>',
      },
      CallUnavailable: {
        task: '(u32,u32)',
        id: 'Option<[u8;32]>',
      },
      PeriodicFailed: {
        task: '(u32,u32)',
        id: 'Option<[u8;32]>',
      },
      RetryFailed: {
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
   * Lookup60: pallet_preimage::pallet::Event<T>
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
   * Lookup61: pallet_multisig::pallet::Event<T>
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
   * Lookup62: pallet_multisig::Timepoint<BlockNumber>
   **/
  PalletMultisigTimepoint: {
    height: 'u32',
    index: 'u32'
  },
  /**
   * Lookup63: pallet_node_authorization::pallet::Event<T>
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
   * Lookup67: pallet_network_membership::pallet::Event<T>
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
   * Lookup68: pallet_did::pallet::Event<T>
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
   * Lookup69: pallet_schema::pallet::Event<T>
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
   * Lookup72: pallet_chain_space::pallet::Event<T>
   **/
  PalletChainSpaceEvent: {
    _enum: {
      Authorization: {
        space: 'Bytes',
        authorization: 'Bytes',
        delegate: 'AccountId32',
      },
      Deauthorization: {
        space: 'Bytes',
        authorization: 'Bytes',
      },
      Create: {
        space: 'Bytes',
        creator: 'AccountId32',
        authorization: 'Bytes',
      },
      Approve: {
        space: 'Bytes',
      },
      Archive: {
        space: 'Bytes',
        authority: 'AccountId32',
      },
      Restore: {
        space: 'Bytes',
        authority: 'AccountId32',
      },
      Revoke: {
        space: 'Bytes',
      },
      ApprovalRevoke: {
        space: 'Bytes',
      },
      ApprovalRestore: {
        space: 'Bytes',
      },
      UpdateCapacity: {
        space: 'Bytes',
      },
      ResetUsage: {
        space: 'Bytes'
      }
    }
  },
  /**
   * Lookup73: pallet_statement::pallet::Event<T>
   **/
  PalletStatementEvent: {
    _enum: {
      Register: {
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
      PartialRemoval: {
        identifier: 'Bytes',
        removed: 'u32',
        author: 'AccountId32',
      },
      PresentationAdded: {
        identifier: 'Bytes',
        digest: 'H256',
        author: 'AccountId32',
      },
      PresentationRemoved: {
        identifier: 'Bytes',
        digest: 'H256',
        author: 'AccountId32',
      },
      RegisterBatch: {
        successful: 'u32',
        failed: 'u32',
        indices: 'Vec<u16>',
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
   * Lookup79: pallet_network_score::pallet::Event<T>
   **/
  PalletNetworkScoreEvent: {
    _enum: {
      RatingEntryAdded: {
        identifier: 'Bytes',
        entity: 'Bytes',
        provider: 'AccountId32',
        creator: 'AccountId32',
      },
      RatingEntryRevoked: {
        identifier: 'Bytes',
        entity: 'Bytes',
        provider: 'AccountId32',
        creator: 'AccountId32',
      },
      RatingEntryRevised: {
        identifier: 'Bytes',
        entity: 'Bytes',
        provider: 'AccountId32',
        creator: 'AccountId32',
      },
      AggregateScoreUpdated: {
        entity: 'Bytes'
      }
    }
  },
  /**
   * Lookup81: pallet_asset::pallet::Event<T>
   **/
  PalletAssetEvent: {
    _enum: {
      Create: {
        identifier: 'Bytes',
        issuer: 'AccountId32',
      },
      Issue: {
        identifier: 'Bytes',
        instance: 'Bytes',
      },
      Transfer: {
        identifier: 'Bytes',
        instance: 'Bytes',
        from: 'AccountId32',
        to: 'AccountId32',
      },
      StatusChange: {
        identifier: 'Bytes',
        instance: 'Option<Bytes>',
        status: 'PalletAssetAssetStatusOf'
      }
    }
  },
  /**
   * Lookup83: pallet_asset::types::AssetStatusOf
   **/
  PalletAssetAssetStatusOf: {
    _enum: ['ACTIVE', 'INACTIVE', 'EXPIRED']
  },
  /**
   * Lookup84: pallet_remark::pallet::Event<T>
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
   * Lookup85: pallet_witness::pallet::Event<T>
   **/
  PalletWitnessEvent: {
    _enum: {
      Create: {
        identifier: 'Bytes',
        creator: 'AccountId32',
      },
      Witness: {
        identifier: 'Bytes',
        signer: 'AccountId32',
        currentWitnessCount: 'u32',
        requiredWitnessCount: 'u32',
        status: 'PalletWitnessWitnessStatusOf',
        comment: 'Bytes',
      },
      DocumentWitnessComplete: {
        identifier: 'Bytes'
      }
    }
  },
  /**
   * Lookup87: pallet_witness::types::WitnessStatusOf
   **/
  PalletWitnessWitnessStatusOf: {
    _enum: ['WITNESSAPRROVALPENDING', 'WITNESSAPPROVALCOMPLETE']
  },
  /**
   * Lookup88: pallet_sudo::pallet::Event<T>
   **/
  PalletSudoEvent: {
    _enum: {
      Sudid: {
        sudoResult: 'Result<Null, SpRuntimeDispatchError>',
      },
      KeyChanged: {
        _alias: {
          new_: 'new',
        },
        old: 'Option<AccountId32>',
        new_: 'AccountId32',
      },
      KeyRemoved: 'Null',
      SudoAsDone: {
        sudoResult: 'Result<Null, SpRuntimeDispatchError>'
      }
    }
  },
  /**
   * Lookup90: frame_system::Phase
   **/
  FrameSystemPhase: {
    _enum: {
      ApplyExtrinsic: 'u32',
      Finalization: 'Null',
      Initialization: 'Null'
    }
  },
  /**
   * Lookup93: frame_system::LastRuntimeUpgradeInfo
   **/
  FrameSystemLastRuntimeUpgradeInfo: {
    specVersion: 'Compact<u32>',
    specName: 'Text'
  },
  /**
   * Lookup96: frame_system::CodeUpgradeAuthorization<T>
   **/
  FrameSystemCodeUpgradeAuthorization: {
    codeHash: 'H256',
    checkVersion: 'bool'
  },
  /**
   * Lookup97: frame_system::pallet::Call<T>
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
        remark: 'Bytes',
      },
      __Unused8: 'Null',
      authorize_upgrade: {
        codeHash: 'H256',
      },
      authorize_upgrade_without_checks: {
        codeHash: 'H256',
      },
      apply_authorized_upgrade: {
        code: 'Bytes'
      }
    }
  },
  /**
   * Lookup101: frame_system::limits::BlockWeights
   **/
  FrameSystemLimitsBlockWeights: {
    baseBlock: 'SpWeightsWeightV2Weight',
    maxBlock: 'SpWeightsWeightV2Weight',
    perClass: 'FrameSupportDispatchPerDispatchClassWeightsPerClass'
  },
  /**
   * Lookup102: frame_support::dispatch::PerDispatchClass<frame_system::limits::WeightsPerClass>
   **/
  FrameSupportDispatchPerDispatchClassWeightsPerClass: {
    normal: 'FrameSystemLimitsWeightsPerClass',
    operational: 'FrameSystemLimitsWeightsPerClass',
    mandatory: 'FrameSystemLimitsWeightsPerClass'
  },
  /**
   * Lookup103: frame_system::limits::WeightsPerClass
   **/
  FrameSystemLimitsWeightsPerClass: {
    baseExtrinsic: 'SpWeightsWeightV2Weight',
    maxExtrinsic: 'Option<SpWeightsWeightV2Weight>',
    maxTotal: 'Option<SpWeightsWeightV2Weight>',
    reserved: 'Option<SpWeightsWeightV2Weight>'
  },
  /**
   * Lookup105: frame_system::limits::BlockLength
   **/
  FrameSystemLimitsBlockLength: {
    max: 'FrameSupportDispatchPerDispatchClassU32'
  },
  /**
   * Lookup106: frame_support::dispatch::PerDispatchClass<T>
   **/
  FrameSupportDispatchPerDispatchClassU32: {
    normal: 'u32',
    operational: 'u32',
    mandatory: 'u32'
  },
  /**
   * Lookup107: sp_weights::RuntimeDbWeight
   **/
  SpWeightsRuntimeDbWeight: {
    read: 'u64',
    write: 'u64'
  },
  /**
   * Lookup108: sp_version::RuntimeVersion
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
   * Lookup113: frame_system::pallet::Error<T>
   **/
  FrameSystemError: {
    _enum: ['InvalidSpecName', 'SpecVersionNeedsToIncrease', 'FailedToExtractRuntimeVersion', 'NonDefaultComposite', 'NonZeroRefCount', 'CallFiltered', 'MultiBlockMigrationsOngoing', 'NothingAuthorized', 'Unauthorized']
  },
  /**
   * Lookup114: pallet_utility::pallet::Call<T>
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
   * Lookup117: pallet_babe::pallet::Call<T>
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
   * Lookup118: sp_consensus_slots::EquivocationProof<sp_runtime::generic::header::Header<Number, Hash>, sp_consensus_babe::app::Public>
   **/
  SpConsensusSlotsEquivocationProof: {
    offender: 'SpConsensusBabeAppPublic',
    slot: 'u64',
    firstHeader: 'SpRuntimeHeader',
    secondHeader: 'SpRuntimeHeader'
  },
  /**
   * Lookup119: sp_runtime::generic::header::Header<Number, Hash>
   **/
  SpRuntimeHeader: {
    parentHash: 'H256',
    number: 'Compact<u32>',
    stateRoot: 'H256',
    extrinsicsRoot: 'H256',
    digest: 'SpRuntimeDigest'
  },
  /**
   * Lookup120: sp_consensus_babe::app::Public
   **/
  SpConsensusBabeAppPublic: '[u8;32]',
  /**
   * Lookup122: sp_session::MembershipProof
   **/
  SpSessionMembershipProof: {
    session: 'u32',
    trieNodes: 'Vec<Bytes>',
    validatorCount: 'u32'
  },
  /**
   * Lookup123: sp_consensus_babe::digests::NextConfigDescriptor
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
   * Lookup125: sp_consensus_babe::AllowedSlots
   **/
  SpConsensusBabeAllowedSlots: {
    _enum: ['PrimarySlots', 'PrimaryAndSecondaryPlainSlots', 'PrimaryAndSecondaryVRFSlots']
  },
  /**
   * Lookup126: pallet_timestamp::pallet::Call<T>
   **/
  PalletTimestampCall: {
    _enum: {
      set: {
        now: 'Compact<u64>'
      }
    }
  },
  /**
   * Lookup127: cord_authority_membership::pallet::Call<T>
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
   * Lookup128: pallet_indices::pallet::Call<T>
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
   * Lookup132: pallet_balances::pallet::Call<T, I>
   **/
  PalletBalancesCall: {
    _enum: {
      transfer_allow_death: {
        dest: 'MultiAddress',
        value: 'Compact<u128>',
      },
      __Unused1: 'Null',
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
      __Unused7: 'Null',
      force_set_balance: {
        who: 'MultiAddress',
        newFree: 'Compact<u128>',
      },
      force_adjust_total_issuance: {
        direction: 'PalletBalancesAdjustmentDirection',
        delta: 'Compact<u128>'
      }
    }
  },
  /**
   * Lookup134: pallet_balances::types::AdjustmentDirection
   **/
  PalletBalancesAdjustmentDirection: {
    _enum: ['Increase', 'Decrease']
  },
  /**
   * Lookup135: pallet_session::pallet::Call<T>
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
   * Lookup136: cord_runtime::SessionKeys
   **/
  CordRuntimeSessionKeys: {
    grandpa: 'SpConsensusGrandpaAppPublic',
    babe: 'SpConsensusBabeAppPublic',
    imOnline: 'PalletImOnlineSr25519AppSr25519Public',
    authorityDiscovery: 'SpAuthorityDiscoveryAppPublic'
  },
  /**
   * Lookup137: sp_authority_discovery::app::Public
   **/
  SpAuthorityDiscoveryAppPublic: '[u8;32]',
  /**
   * Lookup138: pallet_collective::pallet::Call<T, I>
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
   * Lookup139: pallet_membership::pallet::Call<T, I>
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
   * Lookup142: pallet_grandpa::pallet::Call<T>
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
   * Lookup143: sp_consensus_grandpa::EquivocationProof<primitive_types::H256, N>
   **/
  SpConsensusGrandpaEquivocationProof: {
    setId: 'u64',
    equivocation: 'SpConsensusGrandpaEquivocation'
  },
  /**
   * Lookup144: sp_consensus_grandpa::Equivocation<primitive_types::H256, N>
   **/
  SpConsensusGrandpaEquivocation: {
    _enum: {
      Prevote: 'FinalityGrandpaEquivocationPrevote',
      Precommit: 'FinalityGrandpaEquivocationPrecommit'
    }
  },
  /**
   * Lookup145: finality_grandpa::Equivocation<sp_consensus_grandpa::app::Public, finality_grandpa::Prevote<primitive_types::H256, N>, sp_consensus_grandpa::app::Signature>
   **/
  FinalityGrandpaEquivocationPrevote: {
    roundNumber: 'u64',
    identity: 'SpConsensusGrandpaAppPublic',
    first: '(FinalityGrandpaPrevote,SpConsensusGrandpaAppSignature)',
    second: '(FinalityGrandpaPrevote,SpConsensusGrandpaAppSignature)'
  },
  /**
   * Lookup146: finality_grandpa::Prevote<primitive_types::H256, N>
   **/
  FinalityGrandpaPrevote: {
    targetHash: 'H256',
    targetNumber: 'u32'
  },
  /**
   * Lookup147: sp_consensus_grandpa::app::Signature
   **/
  SpConsensusGrandpaAppSignature: '[u8;64]',
  /**
   * Lookup150: finality_grandpa::Equivocation<sp_consensus_grandpa::app::Public, finality_grandpa::Precommit<primitive_types::H256, N>, sp_consensus_grandpa::app::Signature>
   **/
  FinalityGrandpaEquivocationPrecommit: {
    roundNumber: 'u64',
    identity: 'SpConsensusGrandpaAppPublic',
    first: '(FinalityGrandpaPrecommit,SpConsensusGrandpaAppSignature)',
    second: '(FinalityGrandpaPrecommit,SpConsensusGrandpaAppSignature)'
  },
  /**
   * Lookup151: finality_grandpa::Precommit<primitive_types::H256, N>
   **/
  FinalityGrandpaPrecommit: {
    targetHash: 'H256',
    targetNumber: 'u32'
  },
  /**
   * Lookup153: pallet_im_online::pallet::Call<T>
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
   * Lookup154: pallet_im_online::Heartbeat<BlockNumber>
   **/
  PalletImOnlineHeartbeat: {
    blockNumber: 'u32',
    sessionIndex: 'u32',
    authorityIndex: 'u32',
    validatorsLen: 'u32'
  },
  /**
   * Lookup155: pallet_im_online::sr25519::app_sr25519::Signature
   **/
  PalletImOnlineSr25519AppSr25519Signature: '[u8;64]',
  /**
   * Lookup156: pallet_identity::pallet::Call<T>
   **/
  PalletIdentityCall: {
    _enum: {
      add_registrar: {
        account: 'MultiAddress',
      },
      set_identity: {
        info: 'PalletIdentityLegacyIdentityInfo',
      },
      set_subs: {
        subs: 'Vec<(AccountId32,Data)>',
      },
      clear_identity: 'Null',
      request_judgement: {
        registrar: 'AccountId32',
      },
      cancel_request: {
        registrar: 'AccountId32',
      },
      set_account_id: {
        _alias: {
          new_: 'new',
        },
        new_: 'MultiAddress',
      },
      set_fields: {
        fields: 'u64',
      },
      provide_judgement: {
        target: 'MultiAddress',
        judgement: 'PalletIdentityJudgement',
        identity: 'H256',
      },
      kill_identity: {
        target: 'MultiAddress',
      },
      add_sub: {
        sub: 'MultiAddress',
        data: 'Data',
      },
      rename_sub: {
        sub: 'MultiAddress',
        data: 'Data',
      },
      remove_sub: {
        sub: 'MultiAddress',
      },
      quit_sub: 'Null',
      add_username_authority: {
        authority: 'MultiAddress',
        suffix: 'Bytes',
        allocation: 'u32',
      },
      remove_username_authority: {
        authority: 'MultiAddress',
      },
      set_username_for: {
        who: 'MultiAddress',
        username: 'Bytes',
        signature: 'Option<SpRuntimeMultiSignature>',
      },
      accept_username: {
        username: 'Bytes',
      },
      remove_expired_approval: {
        username: 'Bytes',
      },
      set_primary_username: {
        username: 'Bytes',
      },
      remove_dangling_username: {
        username: 'Bytes',
      },
      remove_registrar: {
        account: 'MultiAddress'
      }
    }
  },
  /**
   * Lookup157: pallet_identity::legacy::IdentityInfo<FieldLimit>
   **/
  PalletIdentityLegacyIdentityInfo: {
    additional: 'Vec<(Data,Data)>',
    display: 'Data',
    legal: 'Data',
    web: 'Data',
    email: 'Data',
    image: 'Data'
  },
  /**
   * Lookup192: pallet_identity::types::Judgement
   **/
  PalletIdentityJudgement: {
    _enum: ['Unknown', 'Requested', 'Reasonable', 'KnownGood', 'OutOfDate', 'LowQuality', 'Erroneous']
  },
  /**
   * Lookup194: sp_runtime::MultiSignature
   **/
  SpRuntimeMultiSignature: {
    _enum: {
      Ed25519: '[u8;64]',
      Sr25519: '[u8;64]',
      Ecdsa: '[u8;65]'
    }
  },
  /**
   * Lookup196: pallet_scheduler::pallet::Call<T>
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
        call: 'Call',
      },
      set_retry: {
        task: '(u32,u32)',
        retries: 'u8',
        period: 'u32',
      },
      set_retry_named: {
        id: '[u8;32]',
        retries: 'u8',
        period: 'u32',
      },
      cancel_retry: {
        task: '(u32,u32)',
      },
      cancel_retry_named: {
        id: '[u8;32]'
      }
    }
  },
  /**
   * Lookup198: pallet_preimage::pallet::Call<T>
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
        hash_: 'H256',
      },
      ensure_updated: {
        hashes: 'Vec<H256>'
      }
    }
  },
  /**
   * Lookup199: pallet_multisig::pallet::Call<T>
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
   * Lookup201: pallet_node_authorization::pallet::Call<T>
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
   * Lookup202: pallet_runtime_upgrade::pallet::Call<T>
   **/
  PalletRuntimeUpgradeCall: {
    _enum: {
      set_code: {
        code: 'Bytes'
      }
    }
  },
  /**
   * Lookup203: pallet_network_membership::pallet::Call<T>
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
   * Lookup204: pallet_did::pallet::Call<T>
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
   * Lookup205: pallet_did::did_details::DidCreationDetails<sp_core::crypto::AccountId32, sp_core::crypto::AccountId32, cord_runtime::MaxNewKeyAgreementKeys, pallet_did::service_endpoints::DidEndpoint<T>>
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
   * Lookup206: cord_runtime::MaxNewKeyAgreementKeys
   **/
  CordRuntimeMaxNewKeyAgreementKeys: 'Null',
  /**
   * Lookup207: pallet_did::service_endpoints::DidEndpoint<T>
   **/
  PalletDidServiceEndpointsDidEndpoint: {
    id: 'Bytes',
    serviceTypes: 'Vec<Bytes>',
    urls: 'Vec<Bytes>'
  },
  /**
   * Lookup216: pallet_did::did_details::DidEncryptionKey
   **/
  PalletDidDidDetailsDidEncryptionKey: {
    _enum: {
      X25519: '[u8;32]'
    }
  },
  /**
   * Lookup220: pallet_did::did_details::DidVerificationKey<sp_core::crypto::AccountId32>
   **/
  PalletDidDidDetailsDidVerificationKey: {
    _enum: {
      Ed25519: '[u8;32]',
      Sr25519: '[u8;32]',
      Ecdsa: '[u8;33]',
      Account: 'AccountId32'
    }
  },
  /**
   * Lookup223: pallet_did::did_details::DidSignature
   **/
  PalletDidDidDetailsDidSignature: {
    _enum: {
      Ed25519: '[u8;64]',
      Sr25519: '[u8;64]',
      Ecdsa: '[u8;65]'
    }
  },
  /**
   * Lookup224: pallet_did::did_details::DidAuthorizedCallOperation<sp_core::crypto::AccountId32, cord_runtime::RuntimeCall, BlockNumber, sp_core::crypto::AccountId32, TxCounter>
   **/
  PalletDidDidDetailsDidAuthorizedCallOperation: {
    did: 'AccountId32',
    txCounter: 'u64',
    call: 'Call',
    blockNumber: 'u32',
    submitter: 'AccountId32'
  },
  /**
   * Lookup225: pallet_schema::pallet::Call<T>
   **/
  PalletSchemaCall: {
    _enum: {
      create: {
        txSchema: 'Bytes',
        authorization: 'Bytes'
      }
    }
  },
  /**
   * Lookup227: pallet_chain_space::pallet::Call<T>
   **/
  PalletChainSpaceCall: {
    _enum: {
      add_delegate: {
        spaceId: 'Bytes',
        delegate: 'AccountId32',
        authorization: 'Bytes',
      },
      add_admin_delegate: {
        spaceId: 'Bytes',
        delegate: 'AccountId32',
        authorization: 'Bytes',
      },
      add_delegator: {
        spaceId: 'Bytes',
        delegate: 'AccountId32',
        authorization: 'Bytes',
      },
      remove_delegate: {
        spaceId: 'Bytes',
        removeAuthorization: 'Bytes',
        authorization: 'Bytes',
      },
      create: {
        spaceCode: 'H256',
      },
      approve: {
        spaceId: 'Bytes',
        txnCapacity: 'u64',
      },
      archive: {
        spaceId: 'Bytes',
        authorization: 'Bytes',
      },
      restore: {
        spaceId: 'Bytes',
        authorization: 'Bytes',
      },
      update_transaction_capacity: {
        spaceId: 'Bytes',
        newTxnCapacity: 'u64',
      },
      reset_transaction_count: {
        spaceId: 'Bytes',
      },
      approval_revoke: {
        spaceId: 'Bytes',
      },
      approval_restore: {
        spaceId: 'Bytes',
      },
      subspace_create: {
        spaceCode: 'H256',
        count: 'u64',
        spaceId: 'Bytes',
      },
      update_transaction_capacity_sub: {
        spaceId: 'Bytes',
        newTxnCapacity: 'u64'
      }
    }
  },
  /**
   * Lookup228: pallet_statement::pallet::Call<T>
   **/
  PalletStatementCall: {
    _enum: {
      register: {
        digest: 'H256',
        authorization: 'Bytes',
        schemaId: 'Option<Bytes>',
      },
      update: {
        statementId: 'Bytes',
        newStatementDigest: 'H256',
        authorization: 'Bytes',
      },
      revoke: {
        statementId: 'Bytes',
        authorization: 'Bytes',
      },
      restore: {
        statementId: 'Bytes',
        authorization: 'Bytes',
      },
      remove: {
        statementId: 'Bytes',
        authorization: 'Bytes',
      },
      register_batch: {
        digests: 'Vec<H256>',
        authorization: 'Bytes',
        schemaId: 'Option<Bytes>',
      },
      add_presentation: {
        statementId: 'Bytes',
        presentationDigest: 'H256',
        presentationType: 'PalletStatementPresentationTypeOf',
        authorization: 'Bytes',
      },
      remove_presentation: {
        statementId: 'Bytes',
        presentationDigest: 'H256',
        authorization: 'Bytes'
      }
    }
  },
  /**
   * Lookup229: pallet_statement::types::PresentationTypeOf
   **/
  PalletStatementPresentationTypeOf: {
    _enum: ['Other', 'PDF', 'JPEG', 'PNG', 'GIF', 'TXT', 'SVG', 'JSON', 'DOCX', 'XLSX', 'PPTX', 'MP3', 'MP4', 'XML']
  },
  /**
   * Lookup230: pallet_did_name::pallet::Call<T>
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
   * Lookup231: pallet_network_score::pallet::Call<T>
   **/
  PalletNetworkScoreCall: {
    _enum: {
      register_rating: {
        entry: 'PalletNetworkScoreRatingInputEntry',
        digest: 'H256',
        messageId: 'Bytes',
        authorization: 'Bytes',
      },
      revoke_rating: {
        entryIdentifier: 'Bytes',
        messageId: 'Bytes',
        digest: 'H256',
        authorization: 'Bytes',
      },
      revise_rating: {
        entry: 'PalletNetworkScoreRatingInputEntry',
        digest: 'H256',
        messageId: 'Bytes',
        debitRefId: 'Bytes',
        authorization: 'Bytes'
      }
    }
  },
  /**
   * Lookup232: pallet_network_score::types::RatingInputEntry<bounded_collections::bounded_vec::BoundedVec<T, S>, sp_core::crypto::AccountId32, pallet_network_score::types::RatingTypeOf>
   **/
  PalletNetworkScoreRatingInputEntry: {
    entityId: 'Bytes',
    providerId: 'Bytes',
    countOfTxn: 'u64',
    totalEncodedRating: 'u64',
    ratingType: 'PalletNetworkScoreRatingTypeOf',
    providerDid: 'AccountId32'
  },
  /**
   * Lookup233: pallet_network_score::types::RatingTypeOf
   **/
  PalletNetworkScoreRatingTypeOf: {
    _enum: ['Overall', 'Delivery']
  },
  /**
   * Lookup234: pallet_asset::pallet::Call<T>
   **/
  PalletAssetCall: {
    _enum: {
      create: {
        entry: 'PalletAssetAssetInputEntry',
        digest: 'H256',
        authorization: 'Bytes',
      },
      issue: {
        entry: 'PalletAssetAssetIssuanceEntry',
        digest: 'H256',
        authorization: 'Bytes',
      },
      transfer: {
        entry: 'PalletAssetAssetTransferEntry',
        digest: 'H256',
      },
      status_change: {
        assetId: 'Bytes',
        instanceId: 'Option<Bytes>',
        newStatus: 'PalletAssetAssetStatusOf',
      },
      vc_create: {
        assetQty: 'u64',
        digest: 'H256',
        authorization: 'Bytes',
      },
      vc_issue: {
        entry: 'PalletAssetAssetIssuanceEntry',
        digest: 'H256',
        authorization: 'Bytes',
      },
      vc_transfer: {
        entry: 'PalletAssetAssetTransferEntry',
        digest: 'H256',
      },
      vc_status_change: {
        assetId: 'Bytes',
        instanceId: 'Option<Bytes>',
        newStatus: 'PalletAssetAssetStatusOf'
      }
    }
  },
  /**
   * Lookup235: pallet_asset::types::AssetInputEntry<bounded_collections::bounded_vec::BoundedVec<T, S>, pallet_asset::types::AssetTypeOf, bounded_collections::bounded_vec::BoundedVec<T, S>, bounded_collections::bounded_vec::BoundedVec<T, S>>
   **/
  PalletAssetAssetInputEntry: {
    assetType: 'PalletAssetAssetTypeOf',
    assetDesc: 'Bytes',
    assetQty: 'u64',
    assetValue: 'u32',
    assetTag: 'Bytes',
    assetMeta: 'Bytes'
  },
  /**
   * Lookup236: pallet_asset::types::AssetTypeOf
   **/
  PalletAssetAssetTypeOf: {
    _enum: ['ART', 'BOND', 'MF']
  },
  /**
   * Lookup237: pallet_asset::types::AssetIssuanceEntry<cord_identifier::curi::Ss58Identifier, sp_core::crypto::AccountId32>
   **/
  PalletAssetAssetIssuanceEntry: {
    assetId: 'Bytes',
    assetOwner: 'AccountId32',
    assetIssuanceQty: 'Option<u64>'
  },
  /**
   * Lookup239: pallet_asset::types::AssetTransferEntry<cord_identifier::curi::Ss58Identifier, cord_identifier::curi::Ss58Identifier, sp_core::crypto::AccountId32>
   **/
  PalletAssetAssetTransferEntry: {
    assetId: 'Bytes',
    assetInstanceId: 'Bytes',
    assetOwner: 'AccountId32',
    newAssetOwner: 'AccountId32'
  },
  /**
   * Lookup240: pallet_remark::pallet::Call<T>
   **/
  PalletRemarkCall: {
    _enum: {
      store: {
        remark: 'Bytes'
      }
    }
  },
  /**
   * Lookup241: pallet_witness::pallet::Call<T>
   **/
  PalletWitnessCall: {
    _enum: {
      create: {
        identifier: 'Bytes',
        digest: 'H256',
        witnessCount: 'u32',
        authorization: 'Bytes',
      },
      witness: {
        identifier: 'Bytes',
        digest: 'H256',
        comment: 'Bytes'
      }
    }
  },
  /**
   * Lookup242: pallet_sudo::pallet::Call<T>
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
        call: 'Call',
      },
      remove_key: 'Null'
    }
  },
  /**
   * Lookup243: cord_runtime::OriginCaller
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
      __Unused14: 'Null',
      __Unused15: 'Null',
      __Unused16: 'Null',
      __Unused17: 'Null',
      __Unused18: 'Null',
      __Unused19: 'Null',
      Council: 'PalletCollectiveRawOrigin',
      __Unused21: 'Null',
      TechnicalCommittee: 'PalletCollectiveRawOrigin',
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
      Did: 'PalletDidOriginDidRawOrigin'
    }
  },
  /**
   * Lookup244: frame_support::dispatch::RawOrigin<sp_core::crypto::AccountId32>
   **/
  FrameSupportDispatchRawOrigin: {
    _enum: {
      Root: 'Null',
      Signed: 'AccountId32',
      None: 'Null'
    }
  },
  /**
   * Lookup245: pallet_collective::RawOrigin<sp_core::crypto::AccountId32, I>
   **/
  PalletCollectiveRawOrigin: {
    _enum: {
      Members: '(u32,u32)',
      Member: 'AccountId32',
      _Phantom: 'Null'
    }
  },
  /**
   * Lookup247: pallet_did::origin::DidRawOrigin<sp_core::crypto::AccountId32, sp_core::crypto::AccountId32>
   **/
  PalletDidOriginDidRawOrigin: {
    id: 'AccountId32',
    submitter: 'AccountId32'
  },
  /**
   * Lookup248: sp_core::Void
   **/
  SpCoreVoid: 'Null',
  /**
   * Lookup249: pallet_utility::pallet::Error<T>
   **/
  PalletUtilityError: {
    _enum: ['TooManyCalls']
  },
  /**
   * Lookup256: sp_consensus_babe::digests::PreDigest
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
   * Lookup257: sp_consensus_babe::digests::PrimaryPreDigest
   **/
  SpConsensusBabeDigestsPrimaryPreDigest: {
    authorityIndex: 'u32',
    slot: 'u64',
    vrfSignature: 'SpCoreSr25519VrfVrfSignature'
  },
  /**
   * Lookup258: sp_core::sr25519::vrf::VrfSignature
   **/
  SpCoreSr25519VrfVrfSignature: {
    preOutput: '[u8;32]',
    proof: '[u8;64]'
  },
  /**
   * Lookup259: sp_consensus_babe::digests::SecondaryPlainPreDigest
   **/
  SpConsensusBabeDigestsSecondaryPlainPreDigest: {
    authorityIndex: 'u32',
    slot: 'u64'
  },
  /**
   * Lookup260: sp_consensus_babe::digests::SecondaryVRFPreDigest
   **/
  SpConsensusBabeDigestsSecondaryVRFPreDigest: {
    authorityIndex: 'u32',
    slot: 'u64',
    vrfSignature: 'SpCoreSr25519VrfVrfSignature'
  },
  /**
   * Lookup261: sp_consensus_babe::BabeEpochConfiguration
   **/
  SpConsensusBabeBabeEpochConfiguration: {
    c: '(u64,u64)',
    allowedSlots: 'SpConsensusBabeAllowedSlots'
  },
  /**
   * Lookup265: pallet_babe::pallet::Error<T>
   **/
  PalletBabeError: {
    _enum: ['InvalidEquivocationProof', 'InvalidKeyOwnershipProof', 'DuplicateOffenceReport', 'InvalidConfiguration']
  },
  /**
   * Lookup266: cord_authority_membership::pallet::Error<T>
   **/
  CordAuthorityMembershipError: {
    _enum: ['MemberAlreadyIncoming', 'MemberAlreadyExists', 'MemberAlreadyOutgoing', 'MemberNotFound', 'MemberBlackListed', 'SessionKeysNotAdded', 'MemberNotBlackListed', 'NetworkMembershipNotFound']
  },
  /**
   * Lookup268: pallet_indices::pallet::Error<T>
   **/
  PalletIndicesError: {
    _enum: ['NotAssigned', 'NotOwner', 'InUse', 'NotTransfer', 'Permanent']
  },
  /**
   * Lookup270: pallet_balances::types::BalanceLock<Balance>
   **/
  PalletBalancesBalanceLock: {
    id: '[u8;8]',
    amount: 'u128',
    reasons: 'PalletBalancesReasons'
  },
  /**
   * Lookup271: pallet_balances::types::Reasons
   **/
  PalletBalancesReasons: {
    _enum: ['Fee', 'Misc', 'All']
  },
  /**
   * Lookup274: pallet_balances::types::ReserveData<ReserveIdentifier, Balance>
   **/
  PalletBalancesReserveData: {
    id: '[u8;8]',
    amount: 'u128'
  },
  /**
   * Lookup277: pallet_balances::types::IdAmount<cord_runtime::RuntimeHoldReason, Balance>
   **/
  PalletBalancesIdAmountRuntimeHoldReason: {
    id: 'CordRuntimeRuntimeHoldReason',
    amount: 'u128'
  },
  /**
   * Lookup278: cord_runtime::RuntimeHoldReason
   **/
  CordRuntimeRuntimeHoldReason: {
    _enum: {
      __Unused0: 'Null',
      __Unused1: 'Null',
      __Unused2: 'Null',
      __Unused3: 'Null',
      __Unused4: 'Null',
      __Unused5: 'Null',
      __Unused6: 'Null',
      __Unused7: 'Null',
      __Unused8: 'Null',
      __Unused9: 'Null',
      __Unused10: 'Null',
      __Unused11: 'Null',
      __Unused12: 'Null',
      __Unused13: 'Null',
      __Unused14: 'Null',
      __Unused15: 'Null',
      __Unused16: 'Null',
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
      Preimage: 'PalletPreimageHoldReason'
    }
  },
  /**
   * Lookup279: pallet_preimage::pallet::HoldReason
   **/
  PalletPreimageHoldReason: {
    _enum: ['Preimage']
  },
  /**
   * Lookup282: pallet_balances::types::IdAmount<cord_runtime::RuntimeFreezeReason, Balance>
   **/
  PalletBalancesIdAmountRuntimeFreezeReason: {
    id: 'CordRuntimeRuntimeFreezeReason',
    amount: 'u128'
  },
  /**
   * Lookup283: cord_runtime::RuntimeFreezeReason
   **/
  CordRuntimeRuntimeFreezeReason: 'Null',
  /**
   * Lookup285: pallet_balances::pallet::Error<T, I>
   **/
  PalletBalancesError: {
    _enum: ['VestingBalance', 'LiquidityRestrictions', 'InsufficientBalance', 'ExistentialDeposit', 'Expendability', 'ExistingVestingSchedule', 'DeadAccount', 'TooManyReserves', 'TooManyHolds', 'TooManyFreezes', 'IssuanceDeactivated', 'DeltaZero']
  },
  /**
   * Lookup290: sp_core::crypto::KeyTypeId
   **/
  SpCoreCryptoKeyTypeId: '[u8;4]',
  /**
   * Lookup291: pallet_session::pallet::Error<T>
   **/
  PalletSessionError: {
    _enum: ['InvalidProof', 'NoAssociatedValidatorId', 'DuplicatedKey', 'NoKeys', 'NoAccount']
  },
  /**
   * Lookup293: pallet_collective::Votes<sp_core::crypto::AccountId32, BlockNumber>
   **/
  PalletCollectiveVotes: {
    index: 'u32',
    threshold: 'u32',
    ayes: 'Vec<AccountId32>',
    nays: 'Vec<AccountId32>',
    end: 'u32'
  },
  /**
   * Lookup294: pallet_collective::pallet::Error<T, I>
   **/
  PalletCollectiveError: {
    _enum: ['NotMember', 'DuplicateProposal', 'ProposalMissing', 'WrongIndex', 'DuplicateVote', 'AlreadyInitialized', 'TooEarly', 'TooManyProposals', 'WrongProposalWeight', 'WrongProposalLength', 'PrimeAccountNotMember']
  },
  /**
   * Lookup296: pallet_membership::pallet::Error<T, I>
   **/
  PalletMembershipError: {
    _enum: ['AlreadyMember', 'NotMember', 'TooManyMembers']
  },
  /**
   * Lookup299: pallet_grandpa::StoredState<N>
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
   * Lookup300: pallet_grandpa::StoredPendingChange<N, Limit>
   **/
  PalletGrandpaStoredPendingChange: {
    scheduledAt: 'u32',
    delay: 'u32',
    nextAuthorities: 'Vec<(SpConsensusGrandpaAppPublic,u64)>',
    forced: 'Option<u32>'
  },
  /**
   * Lookup303: pallet_grandpa::pallet::Error<T>
   **/
  PalletGrandpaError: {
    _enum: ['PauseFailed', 'ResumeFailed', 'ChangePending', 'TooSoon', 'InvalidKeyOwnershipProof', 'InvalidEquivocationProof', 'DuplicateOffenceReport']
  },
  /**
   * Lookup307: pallet_im_online::pallet::Error<T>
   **/
  PalletImOnlineError: {
    _enum: ['InvalidKey', 'DuplicatedHeartbeat']
  },
  /**
   * Lookup310: sp_staking::offence::OffenceDetails<sp_core::crypto::AccountId32, Offender>
   **/
  SpStakingOffenceOffenceDetails: {
    offender: '(AccountId32,CordRuntimeEntitiesValidatorFullIdentification)',
    reporters: 'Vec<AccountId32>'
  },
  /**
   * Lookup314: pallet_identity::types::Registration<sp_core::crypto::AccountId32, MaxJudgements, pallet_identity::legacy::IdentityInfo<FieldLimit>>
   **/
  PalletIdentityRegistration: {
    judgements: 'Vec<(AccountId32,PalletIdentityJudgement)>',
    info: 'PalletIdentityLegacyIdentityInfo'
  },
  /**
   * Lookup322: pallet_identity::types::RegistrarInfo<sp_core::crypto::AccountId32, IdField>
   **/
  PalletIdentityRegistrarInfo: {
    account: 'AccountId32',
    fields: 'u64'
  },
  /**
   * Lookup324: pallet_identity::types::AuthorityProperties<bounded_collections::bounded_vec::BoundedVec<T, S>>
   **/
  PalletIdentityAuthorityProperties: {
    suffix: 'Bytes',
    allocation: 'u32'
  },
  /**
   * Lookup327: pallet_identity::pallet::Error<T>
   **/
  PalletIdentityError: {
    _enum: ['TooManySubAccounts', 'NotFound', 'RegistrarNotFound', 'RegistrarAlreadyExists', 'NotNamed', 'EmptyIndex', 'NoIdentity', 'StickyJudgement', 'JudgementGiven', 'InvalidJudgement', 'InvalidIndex', 'InvalidTarget', 'TooManyFields', 'TooManyRegistrars', 'AlreadyClaimed', 'NotSub', 'NotOwned', 'JudgementForDifferentIdentity', 'JudgementPaymentFailed', 'InvalidSuffix', 'NotUsernameAuthority', 'NoAllocation', 'InvalidSignature', 'RequiresSignature', 'InvalidUsername', 'UsernameTaken', 'NoUsername', 'NotExpired']
  },
  /**
   * Lookup330: pallet_scheduler::Scheduled<Name, frame_support::traits::preimages::Bounded<cord_runtime::RuntimeCall, sp_runtime::traits::BlakeTwo256>, BlockNumber, cord_runtime::OriginCaller, sp_core::crypto::AccountId32>
   **/
  PalletSchedulerScheduled: {
    maybeId: 'Option<[u8;32]>',
    priority: 'u8',
    call: 'FrameSupportPreimagesBounded',
    maybePeriodic: 'Option<(u32,u32)>',
    origin: 'CordRuntimeOriginCaller'
  },
  /**
   * Lookup331: frame_support::traits::preimages::Bounded<cord_runtime::RuntimeCall, sp_runtime::traits::BlakeTwo256>
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
   * Lookup332: sp_runtime::traits::BlakeTwo256
   **/
  SpRuntimeBlakeTwo256: 'Null',
  /**
   * Lookup334: pallet_scheduler::RetryConfig<Period>
   **/
  PalletSchedulerRetryConfig: {
    totalRetries: 'u8',
    remaining: 'u8',
    period: 'u32'
  },
  /**
   * Lookup335: pallet_scheduler::pallet::Error<T>
   **/
  PalletSchedulerError: {
    _enum: ['FailedToSchedule', 'NotFound', 'TargetBlockNumberInPast', 'RescheduleNoChange', 'Named']
  },
  /**
   * Lookup336: pallet_preimage::OldRequestStatus<sp_core::crypto::AccountId32, Balance>
   **/
  PalletPreimageOldRequestStatus: {
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
   * Lookup339: pallet_preimage::RequestStatus<sp_core::crypto::AccountId32, frame_support::traits::tokens::fungible::HoldConsideration<A, F, R, D>>
   **/
  PalletPreimageRequestStatus: {
    _enum: {
      Unrequested: {
        ticket: '(AccountId32,u128)',
        len: 'u32',
      },
      Requested: {
        maybeTicket: 'Option<(AccountId32,u128)>',
        count: 'u32',
        maybeLen: 'Option<u32>'
      }
    }
  },
  /**
   * Lookup344: pallet_preimage::pallet::Error<T>
   **/
  PalletPreimageError: {
    _enum: ['TooBig', 'AlreadyNoted', 'NotAuthorized', 'NotNoted', 'Requested', 'NotRequested', 'TooMany', 'TooFew']
  },
  /**
   * Lookup346: pallet_multisig::Multisig<BlockNumber, Balance, sp_core::crypto::AccountId32, MaxApprovals>
   **/
  PalletMultisigMultisig: {
    when: 'PalletMultisigTimepoint',
    deposit: 'u128',
    depositor: 'AccountId32',
    approvals: 'Vec<AccountId32>'
  },
  /**
   * Lookup348: pallet_multisig::pallet::Error<T>
   **/
  PalletMultisigError: {
    _enum: ['MinimumThreshold', 'AlreadyApproved', 'NoApprovalsNeeded', 'TooFewSignatories', 'TooManySignatories', 'SignatoriesOutOfOrder', 'SenderInSignatories', 'NotFound', 'NotOwner', 'NoTimepoint', 'WrongTimepoint', 'UnexpectedTimepoint', 'MaxWeightTooLow', 'AlreadyStored']
  },
  /**
   * Lookup351: pallet_node_authorization::types::NodeInfo<bounded_collections::bounded_vec::BoundedVec<T, S>, sp_core::crypto::AccountId32>
   **/
  PalletNodeAuthorizationNodeInfo: {
    id: 'Bytes',
    owner: 'AccountId32'
  },
  /**
   * Lookup353: pallet_node_authorization::pallet::Error<T>
   **/
  PalletNodeAuthorizationError: {
    _enum: ['NodeIdTooLong', 'PeerIdTooLong', 'TooManyNodes', 'AlreadyJoined', 'NotExist', 'AlreadyClaimed', 'NotOwner', 'PermissionDenied', 'InvalidUtf8', 'InvalidNodeIdentifier', 'AlreadyConnected']
  },
  /**
   * Lookup355: cord_identifier::types::IdentifierTypeOf
   **/
  CordIdentifierIdentifierTypeOf: {
    _enum: ['Asset', 'Auth', 'ChainSpace', 'Did', 'Rating', 'Registry', 'Statement', 'Schema', 'Template', 'Witness']
  },
  /**
   * Lookup357: cord_identifier::types::EventEntry<cord_identifier::types::CallTypeOf>
   **/
  CordIdentifierEventEntry: {
    action: 'CordIdentifierCallTypeOf',
    location: 'CordIdentifierTimepoint'
  },
  /**
   * Lookup358: cord_identifier::types::CallTypeOf
   **/
  CordIdentifierCallTypeOf: {
    _enum: ['Archive', 'Authorization', 'Capacity', 'CouncilRevoke', 'CouncilRestore', 'Deauthorization', 'Approved', 'Genesis', 'Update', 'Revoke', 'Restore', 'Remove', 'PartialRemove', 'PresentationAdded', 'PresentationRemoved', 'Rotate', 'Usage', 'Transfer', 'Debit', 'Credit', 'Issue']
  },
  /**
   * Lookup359: cord_identifier::types::Timepoint
   **/
  CordIdentifierTimepoint: {
    height: 'u32',
    index: 'u32'
  },
  /**
   * Lookup361: cord_identifier::pallet::Error<T>
   **/
  CordIdentifierError: {
    _enum: ['MaxEventsHistoryExceeded']
  },
  /**
   * Lookup362: pallet_network_membership::types::MemberData<BlockNumber>
   **/
  PalletNetworkMembershipMemberData: {
    expireOn: 'u32'
  },
  /**
   * Lookup364: pallet_network_membership::pallet::Error<T>
   **/
  PalletNetworkMembershipError: {
    _enum: ['MembershipNotFound', 'MembershipAlreadyAcquired', 'MembershipRenewalAlreadyRequested', 'OriginNotAuthorized', 'MembershipRequestRejected', 'MembershipExpired', 'MaxMembersExceededForTheBlock']
  },
  /**
   * Lookup365: pallet_did::did_details::DidDetails<T>
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
   * Lookup370: pallet_did::did_details::DidPublicKeyDetails<BlockNumber, sp_core::crypto::AccountId32>
   **/
  PalletDidDidDetailsDidPublicKeyDetails: {
    key: 'PalletDidDidDetailsDidPublicKey',
    blockNumber: 'u32'
  },
  /**
   * Lookup371: pallet_did::did_details::DidPublicKey<sp_core::crypto::AccountId32>
   **/
  PalletDidDidDetailsDidPublicKey: {
    _enum: {
      PublicVerificationKey: 'PalletDidDidDetailsDidVerificationKey',
      PublicEncryptionKey: 'PalletDidDidDetailsDidEncryptionKey'
    }
  },
  /**
   * Lookup376: pallet_did::pallet::Error<T>
   **/
  PalletDidError: {
    _enum: ['InvalidSignatureFormat', 'InvalidSignature', 'AlreadyExists', 'NotFound', 'VerificationKeyNotFound', 'InvalidNonce', 'UnsupportedDidAuthorizationCall', 'InvalidDidAuthorizationCall', 'MaxNewKeyAgreementKeysLimitExceeded', 'MaxPublicKeysExceeded', 'MaxKeyAgreementKeysExceeded', 'BadDidOrigin', 'TransactionExpired', 'AlreadyDeleted', 'MaxNumberOfServicesExceeded', 'MaxServiceIdLengthExceeded', 'MaxServiceTypeLengthExceeded', 'MaxNumberOfTypesPerServiceExceeded', 'MaxServiceUrlLengthExceeded', 'MaxNumberOfUrlsPerServiceExceeded', 'ServiceAlreadyExists', 'ServiceNotFound', 'InvalidServiceEncoding', 'MaxStoredEndpointsCountExceeded', 'Internal']
  },
  /**
   * Lookup377: pallet_schema::types::SchemaEntry<bounded_collections::bounded_vec::BoundedVec<T, S>, primitive_types::H256, sp_core::crypto::AccountId32, cord_identifier::curi::Ss58Identifier>
   **/
  PalletSchemaSchemaEntry: {
    schema: 'Bytes',
    digest: 'H256',
    creator: 'AccountId32',
    space: 'Bytes'
  },
  /**
   * Lookup378: pallet_schema::pallet::Error<T>
   **/
  PalletSchemaError: {
    _enum: ['SchemaAlreadyAnchored', 'SchemaNotFound', 'InvalidIdentifierLength', 'UnableToPayFees', 'CreatorNotFound', 'MaxEncodedSchemaLimitExceeded', 'EmptyTransaction']
  },
  /**
   * Lookup379: pallet_chain_space::types::SpaceDetails<primitive_types::H256, sp_core::crypto::AccountId32, StatusOf, cord_identifier::curi::Ss58Identifier>
   **/
  PalletChainSpaceSpaceDetails: {
    code: 'H256',
    creator: 'AccountId32',
    txnCapacity: 'u64',
    txnReserve: 'u64',
    txnCount: 'u64',
    approved: 'bool',
    archive: 'bool',
    parent: 'Bytes'
  },
  /**
   * Lookup380: pallet_chain_space::types::SpaceAuthorization<cord_identifier::curi::Ss58Identifier, sp_core::crypto::AccountId32, pallet_chain_space::types::Permissions>
   **/
  PalletChainSpaceSpaceAuthorization: {
    spaceId: 'Bytes',
    delegate: 'AccountId32',
    permissions: 'PalletChainSpacePermissions',
    delegator: 'AccountId32'
  },
  /**
   * Lookup381: pallet_chain_space::types::Permissions
   **/
  PalletChainSpacePermissions: {
    bits: 'u32'
  },
  /**
   * Lookup383: pallet_chain_space::pallet::Error<T>
   **/
  PalletChainSpaceError: {
    _enum: ['SpaceAlreadyAnchored', 'SpaceNotFound', 'UnauthorizedOperation', 'InvalidIdentifier', 'InvalidIdentifierLength', 'InvalidIdentifierPrefix', 'ArchivedSpace', 'SpaceNotArchived', 'SpaceDelegatesLimitExceeded', 'EmptyTransaction', 'DelegateAlreadyAdded', 'AuthorizationNotFound', 'DelegateNotFound', 'SpaceAlreadyApproved', 'SpaceNotApproved', 'CapacityLimitExceeded', 'CapacityLessThanUsage', 'TypeCapacityOverflow']
  },
  /**
   * Lookup384: pallet_statement::types::StatementDetails<primitive_types::H256, cord_identifier::curi::Ss58Identifier, cord_identifier::curi::Ss58Identifier>
   **/
  PalletStatementStatementDetails: {
    digest: 'H256',
    space: 'Bytes',
    schema: 'Option<Bytes>'
  },
  /**
   * Lookup386: pallet_statement::types::StatementPresentationDetails<sp_core::crypto::AccountId32, pallet_statement::types::PresentationTypeOf, primitive_types::H256, cord_identifier::curi::Ss58Identifier>
   **/
  PalletStatementStatementPresentationDetails: {
    creator: 'AccountId32',
    presentationType: 'PalletStatementPresentationTypeOf',
    digest: 'H256',
    space: 'Bytes'
  },
  /**
   * Lookup387: pallet_statement::types::StatementEntryStatus<sp_core::crypto::AccountId32, StatusOf>
   **/
  PalletStatementStatementEntryStatus: {
    creator: 'AccountId32',
    revoked: 'bool'
  },
  /**
   * Lookup389: pallet_statement::pallet::Error<T>
   **/
  PalletStatementError: {
    _enum: ['StatementAlreadyAnchored', 'StatementNotFound', 'UnauthorizedOperation', 'StatementEntryNotFound', 'StatementRevoked', 'StatementNotRevoked', 'StatementLinkNotFound', 'StatementLinkRevoked', 'InvalidSignature', 'HashAlreadyAnchored', 'ExpiredSignature', 'InvalidStatementIdentifier', 'InvalidIdentifierLength', 'StatementSpaceMismatch', 'DigestHashAlreadyAnchored', 'InvalidTransactionHash', 'MetadataLimitExceeded', 'MetadataAlreadySet', 'MetadataNotFound', 'TooManyDelegates', 'TooManyDelegatesToRemove', 'AuthorizationDetailsNotFound', 'MaxStatementActivitiesExceeded', 'AttestationNotFound', 'MaxDigestLimitExceeded', 'BulkTransactionFailed', 'AssociateDigestAlreadyAnchored', 'PresentationDigestAlreadyAnchored', 'PresentationNotFound', 'StatementDigestAlreadyAnchored']
  },
  /**
   * Lookup390: pallet_did_name::did_name::DidNameOwnership<sp_core::crypto::AccountId32, BlockNumber>
   **/
  PalletDidNameDidNameDidNameOwnership: {
    owner: 'AccountId32',
    registeredAt: 'u32'
  },
  /**
   * Lookup391: pallet_did_name::pallet::Error<T>
   **/
  PalletDidNameError: {
    _enum: ['InsufficientFunds', 'AlreadyExists', 'NotFound', 'OwnerAlreadyExists', 'OwnerNotFound', 'Banned', 'NotBanned', 'AlreadyBanned', 'NotAuthorized', 'NameTooShort', 'NameExceedsMaxLength', 'NamePrefixTooShort', 'NamePrefixTooLong', 'InvalidSuffix', 'SuffixTooLong', 'InvalidFormat']
  },
  /**
   * Lookup392: pallet_network_score::types::RatingEntry<bounded_collections::bounded_vec::BoundedVec<T, S>, sp_core::crypto::AccountId32, pallet_network_score::types::RatingTypeOf, cord_identifier::curi::Ss58Identifier, primitive_types::H256, bounded_collections::bounded_vec::BoundedVec<T, S>, cord_identifier::curi::Ss58Identifier, sp_core::crypto::AccountId32, pallet_network_score::types::EntryTypeOf, Moment>
   **/
  PalletNetworkScoreRatingEntry: {
    entry: 'PalletNetworkScoreRatingInputEntry',
    digest: 'H256',
    messageId: 'Bytes',
    space: 'Bytes',
    creatorId: 'AccountId32',
    entryType: 'PalletNetworkScoreEntryTypeOf',
    referenceId: 'Option<Bytes>',
    createdAt: 'u64'
  },
  /**
   * Lookup393: pallet_network_score::types::EntryTypeOf
   **/
  PalletNetworkScoreEntryTypeOf: {
    _enum: ['Credit', 'Debit']
  },
  /**
   * Lookup395: pallet_network_score::types::AggregatedEntryOf
   **/
  PalletNetworkScoreAggregatedEntryOf: {
    countOfTxn: 'u64',
    totalEncodedRating: 'u64'
  },
  /**
   * Lookup397: pallet_network_score::pallet::Error<T>
   **/
  PalletNetworkScoreError: {
    _enum: ['UnauthorizedOperation', 'InvalidIdentifierLength', 'InvalidDigest', 'InvalidSignature', 'InvalidRatingIdentifier', 'MessageIdAlreadyExists', 'InvalidRatingValue', 'TooManyJournalEntries', 'InvalidEntitySignature', 'DigestAlreadyAnchored', 'RatingIdentifierAlreadyAdded', 'InvalidRatingType', 'RatingIdentifierNotFound', 'ReferenceIdentifierNotFound', 'ReferenceNotDebitIdentifier', 'EntityMismatch', 'SpaceMismatch']
  },
  /**
   * Lookup398: pallet_asset::types::AssetEntry<bounded_collections::bounded_vec::BoundedVec<T, S>, pallet_asset::types::AssetTypeOf, pallet_asset::types::AssetStatusOf, sp_core::crypto::AccountId32, bounded_collections::bounded_vec::BoundedVec<T, S>, bounded_collections::bounded_vec::BoundedVec<T, S>, BlockNumber>
   **/
  PalletAssetAssetEntry: {
    assetDetail: 'PalletAssetAssetInputEntry',
    assetIssuance: 'u64',
    assetStatus: 'PalletAssetAssetStatusOf',
    assetIssuer: 'AccountId32',
    createdAt: 'u32'
  },
  /**
   * Lookup399: pallet_asset::types::VCAssetEntry<pallet_asset::types::AssetStatusOf, sp_core::crypto::AccountId32, BlockNumber, primitive_types::H256>
   **/
  PalletAssetVcAssetEntry: {
    digest: 'H256',
    assetIssuance: 'u64',
    assetStatus: 'PalletAssetAssetStatusOf',
    assetIssuer: 'AccountId32',
    assetQty: 'u64',
    createdAt: 'u32'
  },
  /**
   * Lookup403: pallet_asset::types::AssetDistributionEntry<bounded_collections::bounded_vec::BoundedVec<T, S>, pallet_asset::types::AssetTypeOf, pallet_asset::types::AssetStatusOf, sp_core::crypto::AccountId32, bounded_collections::bounded_vec::BoundedVec<T, S>, bounded_collections::bounded_vec::BoundedVec<T, S>, BlockNumber, cord_identifier::curi::Ss58Identifier>
   **/
  PalletAssetAssetDistributionEntry: {
    assetInstanceDetail: 'PalletAssetAssetInputEntry',
    assetInstanceParent: 'Bytes',
    assetInstanceStatus: 'PalletAssetAssetStatusOf',
    assetInstanceIssuer: 'AccountId32',
    assetInstanceOwner: 'AccountId32',
    createdAt: 'u32'
  },
  /**
   * Lookup404: pallet_asset::types::VCAssetDistributionEntry<pallet_asset::types::AssetStatusOf, sp_core::crypto::AccountId32, primitive_types::H256, BlockNumber, cord_identifier::curi::Ss58Identifier>
   **/
  PalletAssetVcAssetDistributionEntry: {
    assetQty: 'u64',
    assetInstanceParent: 'Bytes',
    digest: 'H256',
    assetInstanceStatus: 'PalletAssetAssetStatusOf',
    assetInstanceIssuer: 'AccountId32',
    assetInstanceOwner: 'AccountId32',
    createdAt: 'u32'
  },
  /**
   * Lookup405: pallet_asset::pallet::Error<T>
   **/
  PalletAssetError: {
    _enum: ['UnauthorizedOperation', 'InvalidIdentifierLength', 'InvalidDigest', 'InvalidSignature', 'AssetIdAlreadyExists', 'InvalidAssetValue', 'InvalidAssetQty', 'InvalidAssetType', 'InvalidAssetStatus', 'AssetIdNotFound', 'AssetNotActive', 'InstanceNotActive', 'OverIssuanceLimit', 'DistributionLimitExceeded', 'AssetInstanceNotFound', 'AssetInSameState']
  },
  /**
   * Lookup406: pallet_remark::pallet::Error<T>
   **/
  PalletRemarkError: {
    _enum: ['Empty', 'BadContext']
  },
  /**
   * Lookup407: pallet_witness::types::WitnessEntry<sp_core::crypto::AccountId32, primitive_types::H256, pallet_witness::types::WitnessStatusOf, BlockNumber>
   **/
  PalletWitnessWitnessEntry: {
    witnessCreator: 'AccountId32',
    digest: 'H256',
    requiredWitnessCount: 'u32',
    currentWitnessCount: 'u32',
    witnessStatus: 'PalletWitnessWitnessStatusOf',
    createdAt: 'u32'
  },
  /**
   * Lookup408: pallet_witness::types::WitnessSignersEntry<bounded_collections::bounded_vec::BoundedVec<sp_core::crypto::AccountId32, S>, BlockNumber>
   **/
  PalletWitnessWitnessSignersEntry: {
    witnesses: 'Vec<AccountId32>',
    createdAt: 'u32'
  },
  /**
   * Lookup410: pallet_witness::pallet::Error<T>
   **/
  PalletWitnessError: {
    _enum: ['InvalidIdentifierLength', 'UnauthorizedOperation', 'DocumentIdNotFound', 'InvalidWitnessCount', 'MaxWitnessCountReached', 'DocumentIdAlreadyExists', 'DocumentIdAlreadyApproved', 'WitnessSignerCannotBeSameAsWitnessCreator', 'SignerIsAlreadyAWitness', 'DocumentDigestHasChanged']
  },
  /**
   * Lookup411: pallet_sudo::pallet::Error<T>
   **/
  PalletSudoError: {
    _enum: ['RequireSudo']
  },
  /**
   * Lookup414: pallet_network_membership::CheckNetworkMembership<T>
   **/
  PalletNetworkMembershipCheckNetworkMembership: 'Null',
  /**
   * Lookup415: frame_system::extensions::check_non_zero_sender::CheckNonZeroSender<T>
   **/
  FrameSystemExtensionsCheckNonZeroSender: 'Null',
  /**
   * Lookup416: frame_system::extensions::check_spec_version::CheckSpecVersion<T>
   **/
  FrameSystemExtensionsCheckSpecVersion: 'Null',
  /**
   * Lookup417: frame_system::extensions::check_tx_version::CheckTxVersion<T>
   **/
  FrameSystemExtensionsCheckTxVersion: 'Null',
  /**
   * Lookup418: frame_system::extensions::check_genesis::CheckGenesis<T>
   **/
  FrameSystemExtensionsCheckGenesis: 'Null',
  /**
   * Lookup421: frame_system::extensions::check_nonce::CheckNonce<T>
   **/
  FrameSystemExtensionsCheckNonce: 'Compact<u32>',
  /**
   * Lookup422: frame_system::extensions::check_weight::CheckWeight<T>
   **/
  FrameSystemExtensionsCheckWeight: 'Null',
  /**
   * Lookup423: cord_runtime::Runtime
   **/
  CordRuntimeRuntime: 'Null'
};
