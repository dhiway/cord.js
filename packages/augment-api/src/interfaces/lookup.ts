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
   * Lookup20: frame_system::EventRecord<cord_loom_runtime::RuntimeEvent, primitive_types::H256>
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
   * Lookup34: authority_membership::pallet::Event<T>
   **/
  AuthorityMembershipEvent: {
    _enum: {
      IncomingAuthorities: 'Vec<AccountId32>',
      OutgoingAuthorities: 'Vec<AccountId32>',
      MemberAdded: 'AccountId32',
      MemberGoOffline: 'AccountId32',
      MemberGoOnline: 'AccountId32',
      MemberRemoved: 'AccountId32',
      MemberWhiteList: 'AccountId32',
      MemberDisconnected: 'AccountId32',
      MemberBlacklistedRemoved: 'AccountId32'
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
   * Lookup40: pallet_transaction_payment::pallet::Event<T>
   **/
  PalletTransactionPaymentEvent: {
    _enum: {
      TransactionFeePaid: {
        who: 'AccountId32',
        actualFee: 'u128',
        tip: 'u128'
      }
    }
  },
  /**
   * Lookup41: pallet_treasury::pallet::Event<T, I>
   **/
  PalletTreasuryEvent: {
    _enum: {
      Spending: {
        budgetRemaining: 'u128',
      },
      Awarded: {
        proposalIndex: 'u32',
        award: 'u128',
        account: 'AccountId32',
      },
      Burnt: {
        burntFunds: 'u128',
      },
      Rollover: {
        rolloverBalance: 'u128',
      },
      Deposit: {
        value: 'u128',
      },
      SpendApproved: {
        proposalIndex: 'u32',
        amount: 'u128',
        beneficiary: 'AccountId32',
      },
      UpdatedInactive: {
        reactivated: 'u128',
        deactivated: 'u128',
      },
      AssetSpendApproved: {
        index: 'u32',
        assetKind: 'Null',
        amount: 'u128',
        beneficiary: 'AccountId32',
        validFrom: 'u32',
        expireAt: 'u32',
      },
      AssetSpendVoided: {
        index: 'u32',
      },
      Paid: {
        index: 'u32',
        paymentId: 'Null',
      },
      PaymentFailed: {
        index: 'u32',
        paymentId: 'Null',
      },
      SpendProcessed: {
        index: 'u32'
      }
    }
  },
  /**
   * Lookup42: pallet_collective::pallet::Event<T, I>
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
   * Lookup43: pallet_membership::pallet::Event<T, I>
   **/
  PalletMembershipEvent: {
    _enum: ['MemberAdded', 'MemberRemoved', 'MembersSwapped', 'MembersReset', 'KeyChanged', 'Dummy']
  },
  /**
   * Lookup46: pallet_grandpa::pallet::Event
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
   * Lookup49: sp_consensus_grandpa::app::Public
   **/
  SpConsensusGrandpaAppPublic: '[u8;32]',
  /**
   * Lookup50: pallet_im_online::pallet::Event<T>
   **/
  PalletImOnlineEvent: {
    _enum: {
      HeartbeatReceived: {
        authorityId: 'PalletImOnlineSr25519AppSr25519Public',
      },
      AllGood: 'Null',
      SomeOffline: {
        offline: 'Vec<(AccountId32,Null)>'
      }
    }
  },
  /**
   * Lookup51: pallet_im_online::sr25519::app_sr25519::Public
   **/
  PalletImOnlineSr25519AppSr25519Public: '[u8;32]',
  /**
   * Lookup54: pallet_offences::pallet::Event
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
   * Lookup56: pallet_identity::pallet::Event<T>
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
   * Lookup58: pallet_scheduler::pallet::Event<T>
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
   * Lookup61: pallet_preimage::pallet::Event<T>
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
   * Lookup62: pallet_multisig::pallet::Event<T>
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
   * Lookup63: pallet_multisig::Timepoint<BlockNumber>
   **/
  PalletMultisigTimepoint: {
    height: 'u32',
    index: 'u32'
  },
  /**
   * Lookup64: pallet_node_authorization::pallet::Event<T>
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
   * Lookup68: pallet_assets::pallet::Event<T, I>
   **/
  PalletAssetsEvent: {
    _enum: {
      Created: {
        assetId: 'u32',
        creator: 'AccountId32',
        owner: 'AccountId32',
      },
      Issued: {
        assetId: 'u32',
        owner: 'AccountId32',
        amount: 'u128',
      },
      Transferred: {
        assetId: 'u32',
        from: 'AccountId32',
        to: 'AccountId32',
        amount: 'u128',
      },
      Burned: {
        assetId: 'u32',
        owner: 'AccountId32',
        balance: 'u128',
      },
      TeamChanged: {
        assetId: 'u32',
        issuer: 'AccountId32',
        admin: 'AccountId32',
        freezer: 'AccountId32',
      },
      OwnerChanged: {
        assetId: 'u32',
        owner: 'AccountId32',
      },
      Frozen: {
        assetId: 'u32',
        who: 'AccountId32',
      },
      Thawed: {
        assetId: 'u32',
        who: 'AccountId32',
      },
      AssetFrozen: {
        assetId: 'u32',
      },
      AssetThawed: {
        assetId: 'u32',
      },
      AccountsDestroyed: {
        assetId: 'u32',
        accountsDestroyed: 'u32',
        accountsRemaining: 'u32',
      },
      ApprovalsDestroyed: {
        assetId: 'u32',
        approvalsDestroyed: 'u32',
        approvalsRemaining: 'u32',
      },
      DestructionStarted: {
        assetId: 'u32',
      },
      Destroyed: {
        assetId: 'u32',
      },
      ForceCreated: {
        assetId: 'u32',
        owner: 'AccountId32',
      },
      MetadataSet: {
        assetId: 'u32',
        name: 'Bytes',
        symbol: 'Bytes',
        decimals: 'u8',
        isFrozen: 'bool',
      },
      MetadataCleared: {
        assetId: 'u32',
      },
      ApprovedTransfer: {
        assetId: 'u32',
        source: 'AccountId32',
        delegate: 'AccountId32',
        amount: 'u128',
      },
      ApprovalCancelled: {
        assetId: 'u32',
        owner: 'AccountId32',
        delegate: 'AccountId32',
      },
      TransferredApproved: {
        assetId: 'u32',
        owner: 'AccountId32',
        delegate: 'AccountId32',
        destination: 'AccountId32',
        amount: 'u128',
      },
      AssetStatusChanged: {
        assetId: 'u32',
      },
      AssetMinBalanceChanged: {
        assetId: 'u32',
        newMinBalance: 'u128',
      },
      Touched: {
        assetId: 'u32',
        who: 'AccountId32',
        depositor: 'AccountId32',
      },
      Blocked: {
        assetId: 'u32',
        who: 'AccountId32',
      },
      Deposited: {
        assetId: 'u32',
        who: 'AccountId32',
        amount: 'u128',
      },
      Withdrawn: {
        assetId: 'u32',
        who: 'AccountId32',
        amount: 'u128'
      }
    }
  },
  /**
   * Lookup70: pallet_contracts::pallet::Event<T>
   **/
  PalletContractsEvent: {
    _enum: {
      Instantiated: {
        deployer: 'AccountId32',
        contract: 'AccountId32',
      },
      Terminated: {
        contract: 'AccountId32',
        beneficiary: 'AccountId32',
      },
      CodeStored: {
        codeHash: 'H256',
        depositHeld: 'u128',
        uploader: 'AccountId32',
      },
      ContractEmitted: {
        contract: 'AccountId32',
        data: 'Bytes',
      },
      CodeRemoved: {
        codeHash: 'H256',
        depositReleased: 'u128',
        remover: 'AccountId32',
      },
      ContractCodeUpdated: {
        contract: 'AccountId32',
        newCodeHash: 'H256',
        oldCodeHash: 'H256',
      },
      Called: {
        caller: 'PalletContractsOrigin',
        contract: 'AccountId32',
      },
      DelegateCalled: {
        contract: 'AccountId32',
        codeHash: 'H256',
      },
      StorageDepositTransferredAndHeld: {
        from: 'AccountId32',
        to: 'AccountId32',
        amount: 'u128',
      },
      StorageDepositTransferredAndReleased: {
        from: 'AccountId32',
        to: 'AccountId32',
        amount: 'u128'
      }
    }
  },
  /**
   * Lookup71: pallet_contracts::Origin<cord_loom_runtime::Runtime>
   **/
  PalletContractsOrigin: {
    _enum: {
      Root: 'Null',
      Signed: 'AccountId32'
    }
  },
  /**
   * Lookup72: cord_loom_runtime::Runtime
   **/
  CordLoomRuntimeRuntime: 'Null',
  /**
   * Lookup73: pallet_network_membership::pallet::Event<T>
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
   * Lookup74: pallet_did::pallet::Event<T>
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
   * Lookup75: pallet_schema::pallet::Event<T>
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
   * Lookup78: pallet_chain_space::pallet::Event<T>
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
   * Lookup79: pallet_statement::pallet::Event<T>
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
   * Lookup82: pallet_did_name::pallet::Event<T>
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
   * Lookup85: pallet_network_score::pallet::Event<T>
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
   * Lookup87: pallet_asset_conversion::pallet::Event<T>
   **/
  PalletAssetConversionEvent: {
    _enum: {
      PoolCreated: {
        creator: 'AccountId32',
        poolId: '(FrameSupportTokensFungibleUnionOfNativeOrWithId,FrameSupportTokensFungibleUnionOfNativeOrWithId)',
        poolAccount: 'AccountId32',
        lpToken: 'u32',
      },
      LiquidityAdded: {
        who: 'AccountId32',
        mintTo: 'AccountId32',
        poolId: '(FrameSupportTokensFungibleUnionOfNativeOrWithId,FrameSupportTokensFungibleUnionOfNativeOrWithId)',
        amount1Provided: 'u128',
        amount2Provided: 'u128',
        lpToken: 'u32',
        lpTokenMinted: 'u128',
      },
      LiquidityRemoved: {
        who: 'AccountId32',
        withdrawTo: 'AccountId32',
        poolId: '(FrameSupportTokensFungibleUnionOfNativeOrWithId,FrameSupportTokensFungibleUnionOfNativeOrWithId)',
        amount1: 'u128',
        amount2: 'u128',
        lpToken: 'u32',
        lpTokenBurned: 'u128',
        withdrawalFee: 'Permill',
      },
      SwapExecuted: {
        who: 'AccountId32',
        sendTo: 'AccountId32',
        amountIn: 'u128',
        amountOut: 'u128',
        path: 'Vec<(FrameSupportTokensFungibleUnionOfNativeOrWithId,u128)>',
      },
      SwapCreditExecuted: {
        amountIn: 'u128',
        amountOut: 'u128',
        path: 'Vec<(FrameSupportTokensFungibleUnionOfNativeOrWithId,u128)>',
      },
      Touched: {
        poolId: '(FrameSupportTokensFungibleUnionOfNativeOrWithId,FrameSupportTokensFungibleUnionOfNativeOrWithId)',
        who: 'AccountId32'
      }
    }
  },
  /**
   * Lookup89: frame_support::traits::tokens::fungible::union_of::NativeOrWithId<AssetId>
   **/
  FrameSupportTokensFungibleUnionOfNativeOrWithId: {
    _enum: {
      Native: 'Null',
      WithId: 'u32'
    }
  },
  /**
   * Lookup93: pallet_remark::pallet::Event<T>
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
   * Lookup94: pallet_registries::pallet::Event<T>
   **/
  PalletRegistriesEvent: {
    _enum: {
      Authorization: {
        registryId: 'Bytes',
        authorization: 'Bytes',
        delegate: 'AccountId32',
      },
      Deauthorization: {
        registryId: 'Bytes',
        authorization: 'Bytes',
      },
      Create: {
        registryId: 'Bytes',
        creator: 'AccountId32',
        authorization: 'Bytes',
      },
      Revoke: {
        registryId: 'Bytes',
        authority: 'AccountId32',
      },
      Reinstate: {
        registryId: 'Bytes',
        authority: 'AccountId32',
      },
      Update: {
        registryId: 'Bytes',
        updater: 'AccountId32',
        authorization: 'Bytes',
      },
      Archive: {
        registryId: 'Bytes',
        authority: 'AccountId32',
      },
      Restore: {
        registryId: 'Bytes',
        authority: 'AccountId32'
      }
    }
  },
  /**
   * Lookup95: pallet_entries::pallet::Event<T>
   **/
  PalletEntriesEvent: {
    _enum: {
      RegistryEntryCreated: {
        creator: 'AccountId32',
        registryId: 'Bytes',
        registryEntryId: 'Bytes',
      },
      RegistryEntryUpdated: {
        updater: 'AccountId32',
        registryEntryId: 'Bytes',
      },
      RegistryEntryRevoked: {
        updater: 'AccountId32',
        registryEntryId: 'Bytes',
      },
      RegistryEntryReinstated: {
        updater: 'AccountId32',
        registryEntryId: 'Bytes'
      }
    }
  },
  /**
   * Lookup96: pallet_root_testing::pallet::Event<T>
   **/
  PalletRootTestingEvent: {
    _enum: ['DefensiveTestCall']
  },
  /**
   * Lookup97: pallet_sudo::pallet::Event<T>
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
   * Lookup99: frame_system::Phase
   **/
  FrameSystemPhase: {
    _enum: {
      ApplyExtrinsic: 'u32',
      Finalization: 'Null',
      Initialization: 'Null'
    }
  },
  /**
   * Lookup102: frame_system::LastRuntimeUpgradeInfo
   **/
  FrameSystemLastRuntimeUpgradeInfo: {
    specVersion: 'Compact<u32>',
    specName: 'Text'
  },
  /**
   * Lookup105: frame_system::CodeUpgradeAuthorization<T>
   **/
  FrameSystemCodeUpgradeAuthorization: {
    codeHash: 'H256',
    checkVersion: 'bool'
  },
  /**
   * Lookup106: frame_system::pallet::Call<T>
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
   * Lookup110: frame_system::limits::BlockWeights
   **/
  FrameSystemLimitsBlockWeights: {
    baseBlock: 'SpWeightsWeightV2Weight',
    maxBlock: 'SpWeightsWeightV2Weight',
    perClass: 'FrameSupportDispatchPerDispatchClassWeightsPerClass'
  },
  /**
   * Lookup111: frame_support::dispatch::PerDispatchClass<frame_system::limits::WeightsPerClass>
   **/
  FrameSupportDispatchPerDispatchClassWeightsPerClass: {
    normal: 'FrameSystemLimitsWeightsPerClass',
    operational: 'FrameSystemLimitsWeightsPerClass',
    mandatory: 'FrameSystemLimitsWeightsPerClass'
  },
  /**
   * Lookup112: frame_system::limits::WeightsPerClass
   **/
  FrameSystemLimitsWeightsPerClass: {
    baseExtrinsic: 'SpWeightsWeightV2Weight',
    maxExtrinsic: 'Option<SpWeightsWeightV2Weight>',
    maxTotal: 'Option<SpWeightsWeightV2Weight>',
    reserved: 'Option<SpWeightsWeightV2Weight>'
  },
  /**
   * Lookup114: frame_system::limits::BlockLength
   **/
  FrameSystemLimitsBlockLength: {
    max: 'FrameSupportDispatchPerDispatchClassU32'
  },
  /**
   * Lookup115: frame_support::dispatch::PerDispatchClass<T>
   **/
  FrameSupportDispatchPerDispatchClassU32: {
    normal: 'u32',
    operational: 'u32',
    mandatory: 'u32'
  },
  /**
   * Lookup116: sp_weights::RuntimeDbWeight
   **/
  SpWeightsRuntimeDbWeight: {
    read: 'u64',
    write: 'u64'
  },
  /**
   * Lookup117: sp_version::RuntimeVersion
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
   * Lookup122: frame_system::pallet::Error<T>
   **/
  FrameSystemError: {
    _enum: ['InvalidSpecName', 'SpecVersionNeedsToIncrease', 'FailedToExtractRuntimeVersion', 'NonDefaultComposite', 'NonZeroRefCount', 'CallFiltered', 'MultiBlockMigrationsOngoing', 'NothingAuthorized', 'Unauthorized']
  },
  /**
   * Lookup123: pallet_utility::pallet::Call<T>
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
        asOrigin: 'CordLoomRuntimeOriginCaller',
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
   * Lookup126: pallet_babe::pallet::Call<T>
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
   * Lookup127: sp_consensus_slots::EquivocationProof<sp_runtime::generic::header::Header<Number, Hash>, sp_consensus_babe::app::Public>
   **/
  SpConsensusSlotsEquivocationProof: {
    offender: 'SpConsensusBabeAppPublic',
    slot: 'u64',
    firstHeader: 'SpRuntimeHeader',
    secondHeader: 'SpRuntimeHeader'
  },
  /**
   * Lookup128: sp_runtime::generic::header::Header<Number, Hash>
   **/
  SpRuntimeHeader: {
    parentHash: 'H256',
    number: 'Compact<u32>',
    stateRoot: 'H256',
    extrinsicsRoot: 'H256',
    digest: 'SpRuntimeDigest'
  },
  /**
   * Lookup129: sp_consensus_babe::app::Public
   **/
  SpConsensusBabeAppPublic: '[u8;32]',
  /**
   * Lookup131: sp_session::MembershipProof
   **/
  SpSessionMembershipProof: {
    session: 'u32',
    trieNodes: 'Vec<Bytes>',
    validatorCount: 'u32'
  },
  /**
   * Lookup132: sp_consensus_babe::digests::NextConfigDescriptor
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
   * Lookup134: sp_consensus_babe::AllowedSlots
   **/
  SpConsensusBabeAllowedSlots: {
    _enum: ['PrimarySlots', 'PrimaryAndSecondaryPlainSlots', 'PrimaryAndSecondaryVRFSlots']
  },
  /**
   * Lookup135: pallet_timestamp::pallet::Call<T>
   **/
  PalletTimestampCall: {
    _enum: {
      set: {
        now: 'Compact<u64>'
      }
    }
  },
  /**
   * Lookup136: authority_membership::pallet::Call<T>
   **/
  AuthorityMembershipCall: {
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
   * Lookup137: pallet_indices::pallet::Call<T>
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
   * Lookup141: pallet_balances::pallet::Call<T, I>
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
        delta: 'Compact<u128>',
      },
      burn: {
        value: 'Compact<u128>',
        keepAlive: 'bool'
      }
    }
  },
  /**
   * Lookup143: pallet_balances::types::AdjustmentDirection
   **/
  PalletBalancesAdjustmentDirection: {
    _enum: ['Increase', 'Decrease']
  },
  /**
   * Lookup144: pallet_session::pallet::Call<T>
   **/
  PalletSessionCall: {
    _enum: {
      set_keys: {
        _alias: {
          keys_: 'keys',
        },
        keys_: 'CordLoomRuntimeSessionKeys',
        proof: 'Bytes',
      },
      purge_keys: 'Null'
    }
  },
  /**
   * Lookup145: cord_loom_runtime::SessionKeys
   **/
  CordLoomRuntimeSessionKeys: {
    grandpa: 'SpConsensusGrandpaAppPublic',
    babe: 'SpConsensusBabeAppPublic',
    imOnline: 'PalletImOnlineSr25519AppSr25519Public',
    authorityDiscovery: 'SpAuthorityDiscoveryAppPublic'
  },
  /**
   * Lookup146: sp_authority_discovery::app::Public
   **/
  SpAuthorityDiscoveryAppPublic: '[u8;32]',
  /**
   * Lookup147: pallet_treasury::pallet::Call<T, I>
   **/
  PalletTreasuryCall: {
    _enum: {
      __Unused0: 'Null',
      __Unused1: 'Null',
      __Unused2: 'Null',
      spend_local: {
        amount: 'Compact<u128>',
        beneficiary: 'MultiAddress',
      },
      remove_approval: {
        proposalId: 'Compact<u32>',
      },
      spend: {
        assetKind: 'Null',
        amount: 'Compact<u128>',
        beneficiary: 'MultiAddress',
        validFrom: 'Option<u32>',
      },
      payout: {
        index: 'u32',
      },
      check_status: {
        index: 'u32',
      },
      void_spend: {
        index: 'u32'
      }
    }
  },
  /**
   * Lookup150: pallet_collective::pallet::Call<T, I>
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
   * Lookup151: pallet_membership::pallet::Call<T, I>
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
   * Lookup154: pallet_grandpa::pallet::Call<T>
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
   * Lookup155: sp_consensus_grandpa::EquivocationProof<primitive_types::H256, N>
   **/
  SpConsensusGrandpaEquivocationProof: {
    setId: 'u64',
    equivocation: 'SpConsensusGrandpaEquivocation'
  },
  /**
   * Lookup156: sp_consensus_grandpa::Equivocation<primitive_types::H256, N>
   **/
  SpConsensusGrandpaEquivocation: {
    _enum: {
      Prevote: 'FinalityGrandpaEquivocationPrevote',
      Precommit: 'FinalityGrandpaEquivocationPrecommit'
    }
  },
  /**
   * Lookup157: finality_grandpa::Equivocation<sp_consensus_grandpa::app::Public, finality_grandpa::Prevote<primitive_types::H256, N>, sp_consensus_grandpa::app::Signature>
   **/
  FinalityGrandpaEquivocationPrevote: {
    roundNumber: 'u64',
    identity: 'SpConsensusGrandpaAppPublic',
    first: '(FinalityGrandpaPrevote,SpConsensusGrandpaAppSignature)',
    second: '(FinalityGrandpaPrevote,SpConsensusGrandpaAppSignature)'
  },
  /**
   * Lookup158: finality_grandpa::Prevote<primitive_types::H256, N>
   **/
  FinalityGrandpaPrevote: {
    targetHash: 'H256',
    targetNumber: 'u32'
  },
  /**
   * Lookup159: sp_consensus_grandpa::app::Signature
   **/
  SpConsensusGrandpaAppSignature: '[u8;64]',
  /**
   * Lookup162: finality_grandpa::Equivocation<sp_consensus_grandpa::app::Public, finality_grandpa::Precommit<primitive_types::H256, N>, sp_consensus_grandpa::app::Signature>
   **/
  FinalityGrandpaEquivocationPrecommit: {
    roundNumber: 'u64',
    identity: 'SpConsensusGrandpaAppPublic',
    first: '(FinalityGrandpaPrecommit,SpConsensusGrandpaAppSignature)',
    second: '(FinalityGrandpaPrecommit,SpConsensusGrandpaAppSignature)'
  },
  /**
   * Lookup163: finality_grandpa::Precommit<primitive_types::H256, N>
   **/
  FinalityGrandpaPrecommit: {
    targetHash: 'H256',
    targetNumber: 'u32'
  },
  /**
   * Lookup165: pallet_im_online::pallet::Call<T>
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
   * Lookup166: pallet_im_online::Heartbeat<BlockNumber>
   **/
  PalletImOnlineHeartbeat: {
    blockNumber: 'u32',
    sessionIndex: 'u32',
    authorityIndex: 'u32',
    validatorsLen: 'u32'
  },
  /**
   * Lookup167: pallet_im_online::sr25519::app_sr25519::Signature
   **/
  PalletImOnlineSr25519AppSr25519Signature: '[u8;64]',
  /**
   * Lookup168: pallet_identity::pallet::Call<T>
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
   * Lookup169: pallet_identity::legacy::IdentityInfo<FieldLimit>
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
   * Lookup204: pallet_identity::types::Judgement
   **/
  PalletIdentityJudgement: {
    _enum: ['Unknown', 'Requested', 'Reasonable', 'KnownGood', 'OutOfDate', 'LowQuality', 'Erroneous']
  },
  /**
   * Lookup206: sp_runtime::MultiSignature
   **/
  SpRuntimeMultiSignature: {
    _enum: {
      Ed25519: '[u8;64]',
      Sr25519: '[u8;64]',
      Ecdsa: '[u8;65]'
    }
  },
  /**
   * Lookup208: pallet_scheduler::pallet::Call<T>
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
   * Lookup210: pallet_preimage::pallet::Call<T>
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
   * Lookup211: pallet_multisig::pallet::Call<T>
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
   * Lookup213: pallet_node_authorization::pallet::Call<T>
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
   * Lookup214: pallet_runtime_upgrade::pallet::Call<T>
   **/
  PalletRuntimeUpgradeCall: {
    _enum: {
      set_code: {
        code: 'Bytes'
      }
    }
  },
  /**
   * Lookup215: pallet_assets::pallet::Call<T, I>
   **/
  PalletAssetsCall: {
    _enum: {
      create: {
        id: 'Compact<u32>',
        admin: 'MultiAddress',
        minBalance: 'u128',
      },
      force_create: {
        id: 'Compact<u32>',
        owner: 'MultiAddress',
        isSufficient: 'bool',
        minBalance: 'Compact<u128>',
      },
      start_destroy: {
        id: 'Compact<u32>',
      },
      destroy_accounts: {
        id: 'Compact<u32>',
      },
      destroy_approvals: {
        id: 'Compact<u32>',
      },
      finish_destroy: {
        id: 'Compact<u32>',
      },
      mint: {
        id: 'Compact<u32>',
        beneficiary: 'MultiAddress',
        amount: 'Compact<u128>',
      },
      burn: {
        id: 'Compact<u32>',
        who: 'MultiAddress',
        amount: 'Compact<u128>',
      },
      transfer: {
        id: 'Compact<u32>',
        target: 'MultiAddress',
        amount: 'Compact<u128>',
      },
      transfer_keep_alive: {
        id: 'Compact<u32>',
        target: 'MultiAddress',
        amount: 'Compact<u128>',
      },
      force_transfer: {
        id: 'Compact<u32>',
        source: 'MultiAddress',
        dest: 'MultiAddress',
        amount: 'Compact<u128>',
      },
      freeze: {
        id: 'Compact<u32>',
        who: 'MultiAddress',
      },
      thaw: {
        id: 'Compact<u32>',
        who: 'MultiAddress',
      },
      freeze_asset: {
        id: 'Compact<u32>',
      },
      thaw_asset: {
        id: 'Compact<u32>',
      },
      transfer_ownership: {
        id: 'Compact<u32>',
        owner: 'MultiAddress',
      },
      set_team: {
        id: 'Compact<u32>',
        issuer: 'MultiAddress',
        admin: 'MultiAddress',
        freezer: 'MultiAddress',
      },
      set_metadata: {
        id: 'Compact<u32>',
        name: 'Bytes',
        symbol: 'Bytes',
        decimals: 'u8',
      },
      clear_metadata: {
        id: 'Compact<u32>',
      },
      force_set_metadata: {
        id: 'Compact<u32>',
        name: 'Bytes',
        symbol: 'Bytes',
        decimals: 'u8',
        isFrozen: 'bool',
      },
      force_clear_metadata: {
        id: 'Compact<u32>',
      },
      force_asset_status: {
        id: 'Compact<u32>',
        owner: 'MultiAddress',
        issuer: 'MultiAddress',
        admin: 'MultiAddress',
        freezer: 'MultiAddress',
        minBalance: 'Compact<u128>',
        isSufficient: 'bool',
        isFrozen: 'bool',
      },
      approve_transfer: {
        id: 'Compact<u32>',
        delegate: 'MultiAddress',
        amount: 'Compact<u128>',
      },
      cancel_approval: {
        id: 'Compact<u32>',
        delegate: 'MultiAddress',
      },
      force_cancel_approval: {
        id: 'Compact<u32>',
        owner: 'MultiAddress',
        delegate: 'MultiAddress',
      },
      transfer_approved: {
        id: 'Compact<u32>',
        owner: 'MultiAddress',
        destination: 'MultiAddress',
        amount: 'Compact<u128>',
      },
      touch: {
        id: 'Compact<u32>',
      },
      refund: {
        id: 'Compact<u32>',
        allowBurn: 'bool',
      },
      set_min_balance: {
        id: 'Compact<u32>',
        minBalance: 'u128',
      },
      touch_other: {
        id: 'Compact<u32>',
        who: 'MultiAddress',
      },
      refund_other: {
        id: 'Compact<u32>',
        who: 'MultiAddress',
      },
      block: {
        id: 'Compact<u32>',
        who: 'MultiAddress'
      }
    }
  },
  /**
   * Lookup217: pallet_contracts::pallet::Call<T>
   **/
  PalletContractsCall: {
    _enum: {
      call_old_weight: {
        dest: 'MultiAddress',
        value: 'Compact<u128>',
        gasLimit: 'Compact<u64>',
        storageDepositLimit: 'Option<Compact<u128>>',
        data: 'Bytes',
      },
      instantiate_with_code_old_weight: {
        value: 'Compact<u128>',
        gasLimit: 'Compact<u64>',
        storageDepositLimit: 'Option<Compact<u128>>',
        code: 'Bytes',
        data: 'Bytes',
        salt: 'Bytes',
      },
      instantiate_old_weight: {
        value: 'Compact<u128>',
        gasLimit: 'Compact<u64>',
        storageDepositLimit: 'Option<Compact<u128>>',
        codeHash: 'H256',
        data: 'Bytes',
        salt: 'Bytes',
      },
      upload_code: {
        code: 'Bytes',
        storageDepositLimit: 'Option<Compact<u128>>',
        determinism: 'PalletContractsWasmDeterminism',
      },
      remove_code: {
        codeHash: 'H256',
      },
      set_code: {
        dest: 'MultiAddress',
        codeHash: 'H256',
      },
      call: {
        dest: 'MultiAddress',
        value: 'Compact<u128>',
        gasLimit: 'SpWeightsWeightV2Weight',
        storageDepositLimit: 'Option<Compact<u128>>',
        data: 'Bytes',
      },
      instantiate_with_code: {
        value: 'Compact<u128>',
        gasLimit: 'SpWeightsWeightV2Weight',
        storageDepositLimit: 'Option<Compact<u128>>',
        code: 'Bytes',
        data: 'Bytes',
        salt: 'Bytes',
      },
      instantiate: {
        value: 'Compact<u128>',
        gasLimit: 'SpWeightsWeightV2Weight',
        storageDepositLimit: 'Option<Compact<u128>>',
        codeHash: 'H256',
        data: 'Bytes',
        salt: 'Bytes',
      },
      migrate: {
        weightLimit: 'SpWeightsWeightV2Weight'
      }
    }
  },
  /**
   * Lookup219: pallet_contracts::wasm::Determinism
   **/
  PalletContractsWasmDeterminism: {
    _enum: ['Enforced', 'Relaxed']
  },
  /**
   * Lookup220: pallet_network_membership::pallet::Call<T>
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
   * Lookup221: pallet_did::pallet::Call<T>
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
   * Lookup222: pallet_did::did_details::DidCreationDetails<sp_core::crypto::AccountId32, sp_core::crypto::AccountId32, cord_loom_runtime::MaxNewKeyAgreementKeys, pallet_did::service_endpoints::DidEndpoint<T>>
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
   * Lookup223: cord_loom_runtime::MaxNewKeyAgreementKeys
   **/
  CordLoomRuntimeMaxNewKeyAgreementKeys: 'Null',
  /**
   * Lookup224: pallet_did::service_endpoints::DidEndpoint<T>
   **/
  PalletDidServiceEndpointsDidEndpoint: {
    id: 'Bytes',
    serviceTypes: 'Vec<Bytes>',
    urls: 'Vec<Bytes>'
  },
  /**
   * Lookup233: pallet_did::did_details::DidEncryptionKey
   **/
  PalletDidDidDetailsDidEncryptionKey: {
    _enum: {
      X25519: '[u8;32]'
    }
  },
  /**
   * Lookup237: pallet_did::did_details::DidVerificationKey<sp_core::crypto::AccountId32>
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
   * Lookup240: pallet_did::did_details::DidSignature
   **/
  PalletDidDidDetailsDidSignature: {
    _enum: {
      Ed25519: '[u8;64]',
      Sr25519: '[u8;64]',
      Ecdsa: '[u8;65]'
    }
  },
  /**
   * Lookup241: pallet_did::did_details::DidAuthorizedCallOperation<sp_core::crypto::AccountId32, cord_loom_runtime::RuntimeCall, BlockNumber, sp_core::crypto::AccountId32, TxCounter>
   **/
  PalletDidDidDetailsDidAuthorizedCallOperation: {
    did: 'AccountId32',
    txCounter: 'u64',
    call: 'Call',
    blockNumber: 'u32',
    submitter: 'AccountId32'
  },
  /**
   * Lookup242: pallet_schema::pallet::Call<T>
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
   * Lookup244: pallet_chain_space::pallet::Call<T>
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
        count: 'Option<u64>',
        spaceId: 'Bytes',
      },
      update_transaction_capacity_sub: {
        spaceId: 'Bytes',
        newTxnCapacity: 'u64'
      }
    }
  },
  /**
   * Lookup246: pallet_statement::pallet::Call<T>
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
   * Lookup248: pallet_statement::types::PresentationTypeOf
   **/
  PalletStatementPresentationTypeOf: {
    _enum: ['Other', 'PDF', 'JPEG', 'PNG', 'GIF', 'TXT', 'SVG', 'JSON', 'DOCX', 'XLSX', 'PPTX', 'MP3', 'MP4', 'XML']
  },
  /**
   * Lookup249: pallet_did_name::pallet::Call<T>
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
   * Lookup250: pallet_network_score::pallet::Call<T>
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
   * Lookup251: pallet_network_score::types::RatingInputEntry<bounded_collections::bounded_vec::BoundedVec<T, S>, sp_core::crypto::AccountId32, pallet_network_score::types::RatingTypeOf>
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
   * Lookup252: pallet_network_score::types::RatingTypeOf
   **/
  PalletNetworkScoreRatingTypeOf: {
    _enum: ['Overall', 'Delivery']
  },
  /**
   * Lookup253: pallet_asset_conversion::pallet::Call<T>
   **/
  PalletAssetConversionCall: {
    _enum: {
      create_pool: {
        asset1: 'FrameSupportTokensFungibleUnionOfNativeOrWithId',
        asset2: 'FrameSupportTokensFungibleUnionOfNativeOrWithId',
      },
      add_liquidity: {
        asset1: 'FrameSupportTokensFungibleUnionOfNativeOrWithId',
        asset2: 'FrameSupportTokensFungibleUnionOfNativeOrWithId',
        amount1Desired: 'u128',
        amount2Desired: 'u128',
        amount1Min: 'u128',
        amount2Min: 'u128',
        mintTo: 'AccountId32',
      },
      remove_liquidity: {
        asset1: 'FrameSupportTokensFungibleUnionOfNativeOrWithId',
        asset2: 'FrameSupportTokensFungibleUnionOfNativeOrWithId',
        lpTokenBurn: 'u128',
        amount1MinReceive: 'u128',
        amount2MinReceive: 'u128',
        withdrawTo: 'AccountId32',
      },
      swap_exact_tokens_for_tokens: {
        path: 'Vec<FrameSupportTokensFungibleUnionOfNativeOrWithId>',
        amountIn: 'u128',
        amountOutMin: 'u128',
        sendTo: 'AccountId32',
        keepAlive: 'bool',
      },
      swap_tokens_for_exact_tokens: {
        path: 'Vec<FrameSupportTokensFungibleUnionOfNativeOrWithId>',
        amountOut: 'u128',
        amountInMax: 'u128',
        sendTo: 'AccountId32',
        keepAlive: 'bool',
      },
      touch: {
        asset1: 'FrameSupportTokensFungibleUnionOfNativeOrWithId',
        asset2: 'FrameSupportTokensFungibleUnionOfNativeOrWithId'
      }
    }
  },
  /**
   * Lookup255: pallet_remark::pallet::Call<T>
   **/
  PalletRemarkCall: {
    _enum: {
      store: {
        remark: 'Bytes'
      }
    }
  },
  /**
   * Lookup256: pallet_registries::pallet::Call<T>
   **/
  PalletRegistriesCall: {
    _enum: {
      add_delegate: {
        registryId: 'Bytes',
        delegate: 'AccountId32',
        authorization: 'Bytes',
      },
      add_admin_delegate: {
        registryId: 'Bytes',
        delegate: 'AccountId32',
        authorization: 'Bytes',
      },
      add_delegator: {
        registryId: 'Bytes',
        delegate: 'AccountId32',
        authorization: 'Bytes',
      },
      remove_delegate: {
        registryId: 'Bytes',
        removeAuthorization: 'Bytes',
        authorization: 'Bytes',
      },
      create: {
        registryId: 'Bytes',
        digest: 'H256',
        schemaId: 'Option<Bytes>',
        blob: 'Option<Bytes>',
      },
      __Unused5: 'Null',
      revoke: {
        registryId: 'Bytes',
        authorization: 'Bytes',
      },
      reinstate: {
        registryId: 'Bytes',
        authorization: 'Bytes',
      },
      update: {
        registryId: 'Bytes',
        digest: 'H256',
        blob: 'Option<Bytes>',
        authorization: 'Bytes',
      },
      archive: {
        registryId: 'Bytes',
        authorization: 'Bytes',
      },
      restore: {
        registryId: 'Bytes',
        authorization: 'Bytes'
      }
    }
  },
  /**
   * Lookup261: pallet_entries::pallet::Call<T>
   **/
  PalletEntriesCall: {
    _enum: {
      create: {
        registryEntryId: 'Bytes',
        authorization: 'Bytes',
        digest: 'H256',
        blob: 'Option<Bytes>',
      },
      update: {
        registryEntryId: 'Bytes',
        authorization: 'Bytes',
        digest: 'H256',
        blob: 'Option<Bytes>',
      },
      revoke: {
        registryEntryId: 'Bytes',
        authorization: 'Bytes',
      },
      reinstate: {
        registryEntryId: 'Bytes',
        authorization: 'Bytes'
      }
    }
  },
  /**
   * Lookup264: pallet_root_testing::pallet::Call<T>
   **/
  PalletRootTestingCall: {
    _enum: {
      fill_block: {
        ratio: 'Perbill',
      },
      trigger_defensive: 'Null'
    }
  },
  /**
   * Lookup266: pallet_sudo::pallet::Call<T>
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
   * Lookup267: cord_loom_runtime::OriginCaller
   **/
  CordLoomRuntimeOriginCaller: {
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
   * Lookup268: frame_support::dispatch::RawOrigin<sp_core::crypto::AccountId32>
   **/
  FrameSupportDispatchRawOrigin: {
    _enum: {
      Root: 'Null',
      Signed: 'AccountId32',
      None: 'Null'
    }
  },
  /**
   * Lookup269: pallet_collective::RawOrigin<sp_core::crypto::AccountId32, I>
   **/
  PalletCollectiveRawOrigin: {
    _enum: {
      Members: '(u32,u32)',
      Member: 'AccountId32',
      _Phantom: 'Null'
    }
  },
  /**
   * Lookup271: pallet_did::origin::DidRawOrigin<sp_core::crypto::AccountId32, sp_core::crypto::AccountId32>
   **/
  PalletDidOriginDidRawOrigin: {
    id: 'AccountId32',
    submitter: 'AccountId32'
  },
  /**
   * Lookup272: sp_core::Void
   **/
  SpCoreVoid: 'Null',
  /**
   * Lookup273: pallet_utility::pallet::Error<T>
   **/
  PalletUtilityError: {
    _enum: ['TooManyCalls']
  },
  /**
   * Lookup280: sp_consensus_babe::digests::PreDigest
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
   * Lookup281: sp_consensus_babe::digests::PrimaryPreDigest
   **/
  SpConsensusBabeDigestsPrimaryPreDigest: {
    authorityIndex: 'u32',
    slot: 'u64',
    vrfSignature: 'SpCoreSr25519VrfVrfSignature'
  },
  /**
   * Lookup282: sp_core::sr25519::vrf::VrfSignature
   **/
  SpCoreSr25519VrfVrfSignature: {
    preOutput: '[u8;32]',
    proof: '[u8;64]'
  },
  /**
   * Lookup283: sp_consensus_babe::digests::SecondaryPlainPreDigest
   **/
  SpConsensusBabeDigestsSecondaryPlainPreDigest: {
    authorityIndex: 'u32',
    slot: 'u64'
  },
  /**
   * Lookup284: sp_consensus_babe::digests::SecondaryVRFPreDigest
   **/
  SpConsensusBabeDigestsSecondaryVRFPreDigest: {
    authorityIndex: 'u32',
    slot: 'u64',
    vrfSignature: 'SpCoreSr25519VrfVrfSignature'
  },
  /**
   * Lookup285: sp_consensus_babe::BabeEpochConfiguration
   **/
  SpConsensusBabeBabeEpochConfiguration: {
    c: '(u64,u64)',
    allowedSlots: 'SpConsensusBabeAllowedSlots'
  },
  /**
   * Lookup289: pallet_babe::pallet::Error<T>
   **/
  PalletBabeError: {
    _enum: ['InvalidEquivocationProof', 'InvalidKeyOwnershipProof', 'DuplicateOffenceReport', 'InvalidConfiguration']
  },
  /**
   * Lookup290: authority_membership::pallet::Error<T>
   **/
  AuthorityMembershipError: {
    _enum: ['MemberAlreadyIncoming', 'MemberAlreadyExists', 'MemberAlreadyOutgoing', 'MemberNotFound', 'MemberBlackListed', 'SessionKeysNotAdded', 'MemberNotBlackListed', 'NetworkMembershipNotFound', 'TooLowAuthorityCount']
  },
  /**
   * Lookup292: pallet_indices::pallet::Error<T>
   **/
  PalletIndicesError: {
    _enum: ['NotAssigned', 'NotOwner', 'InUse', 'NotTransfer', 'Permanent']
  },
  /**
   * Lookup294: pallet_balances::types::BalanceLock<Balance>
   **/
  PalletBalancesBalanceLock: {
    id: '[u8;8]',
    amount: 'u128',
    reasons: 'PalletBalancesReasons'
  },
  /**
   * Lookup295: pallet_balances::types::Reasons
   **/
  PalletBalancesReasons: {
    _enum: ['Fee', 'Misc', 'All']
  },
  /**
   * Lookup298: pallet_balances::types::ReserveData<ReserveIdentifier, Balance>
   **/
  PalletBalancesReserveData: {
    id: '[u8;8]',
    amount: 'u128'
  },
  /**
   * Lookup301: frame_support::traits::tokens::misc::IdAmount<cord_loom_runtime::RuntimeHoldReason, Balance>
   **/
  FrameSupportTokensMiscIdAmountRuntimeHoldReason: {
    id: 'CordLoomRuntimeRuntimeHoldReason',
    amount: 'u128'
  },
  /**
   * Lookup302: cord_loom_runtime::RuntimeHoldReason
   **/
  CordLoomRuntimeRuntimeHoldReason: {
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
      Preimage: 'PalletPreimageHoldReason',
      __Unused33: 'Null',
      __Unused34: 'Null',
      __Unused35: 'Null',
      __Unused36: 'Null',
      __Unused37: 'Null',
      Contracts: 'PalletContractsHoldReason'
    }
  },
  /**
   * Lookup303: pallet_preimage::pallet::HoldReason
   **/
  PalletPreimageHoldReason: {
    _enum: ['Preimage']
  },
  /**
   * Lookup304: pallet_contracts::pallet::HoldReason
   **/
  PalletContractsHoldReason: {
    _enum: ['CodeUploadDepositReserve', 'StorageDepositReserve']
  },
  /**
   * Lookup307: frame_support::traits::tokens::misc::IdAmount<cord_loom_runtime::RuntimeFreezeReason, Balance>
   **/
  FrameSupportTokensMiscIdAmountRuntimeFreezeReason: {
    id: 'CordLoomRuntimeRuntimeFreezeReason',
    amount: 'u128'
  },
  /**
   * Lookup308: cord_loom_runtime::RuntimeFreezeReason
   **/
  CordLoomRuntimeRuntimeFreezeReason: 'Null',
  /**
   * Lookup310: pallet_balances::pallet::Error<T, I>
   **/
  PalletBalancesError: {
    _enum: ['VestingBalance', 'LiquidityRestrictions', 'InsufficientBalance', 'ExistentialDeposit', 'Expendability', 'ExistingVestingSchedule', 'DeadAccount', 'TooManyReserves', 'TooManyHolds', 'TooManyFreezes', 'IssuanceDeactivated', 'DeltaZero']
  },
  /**
   * Lookup315: sp_core::crypto::KeyTypeId
   **/
  SpCoreCryptoKeyTypeId: '[u8;4]',
  /**
   * Lookup316: pallet_session::pallet::Error<T>
   **/
  PalletSessionError: {
    _enum: ['InvalidProof', 'NoAssociatedValidatorId', 'DuplicatedKey', 'NoKeys', 'NoAccount']
  },
  /**
   * Lookup318: pallet_transaction_payment::Releases
   **/
  PalletTransactionPaymentReleases: {
    _enum: ['V1Ancient', 'V2']
  },
  /**
   * Lookup319: pallet_treasury::Proposal<sp_core::crypto::AccountId32, Balance>
   **/
  PalletTreasuryProposal: {
    proposer: 'AccountId32',
    value: 'u128',
    beneficiary: 'AccountId32',
    bond: 'u128'
  },
  /**
   * Lookup321: pallet_treasury::SpendStatus<AssetKind, AssetBalance, sp_core::crypto::AccountId32, BlockNumber, PaymentId>
   **/
  PalletTreasurySpendStatus: {
    assetKind: 'Null',
    amount: 'u128',
    beneficiary: 'AccountId32',
    validFrom: 'u32',
    expireAt: 'u32',
    status: 'PalletTreasuryPaymentState'
  },
  /**
   * Lookup322: pallet_treasury::PaymentState<Id>
   **/
  PalletTreasuryPaymentState: {
    _enum: {
      Pending: 'Null',
      Attempted: {
        id: 'Null',
      },
      Failed: 'Null'
    }
  },
  /**
   * Lookup323: frame_support::PalletId
   **/
  FrameSupportPalletId: '[u8;8]',
  /**
   * Lookup324: pallet_treasury::pallet::Error<T, I>
   **/
  PalletTreasuryError: {
    _enum: ['InvalidIndex', 'TooManyApprovals', 'InsufficientPermission', 'ProposalNotApproved', 'FailedToConvertBalance', 'SpendExpired', 'EarlyPayout', 'AlreadyAttempted', 'PayoutError', 'NotAttempted', 'Inconclusive']
  },
  /**
   * Lookup327: pallet_collective::Votes<sp_core::crypto::AccountId32, BlockNumber>
   **/
  PalletCollectiveVotes: {
    index: 'u32',
    threshold: 'u32',
    ayes: 'Vec<AccountId32>',
    nays: 'Vec<AccountId32>',
    end: 'u32'
  },
  /**
   * Lookup328: pallet_collective::pallet::Error<T, I>
   **/
  PalletCollectiveError: {
    _enum: ['NotMember', 'DuplicateProposal', 'ProposalMissing', 'WrongIndex', 'DuplicateVote', 'AlreadyInitialized', 'TooEarly', 'TooManyProposals', 'WrongProposalWeight', 'WrongProposalLength', 'PrimeAccountNotMember']
  },
  /**
   * Lookup330: pallet_membership::pallet::Error<T, I>
   **/
  PalletMembershipError: {
    _enum: ['AlreadyMember', 'NotMember', 'TooManyMembers']
  },
  /**
   * Lookup333: pallet_grandpa::StoredState<N>
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
   * Lookup334: pallet_grandpa::StoredPendingChange<N, Limit>
   **/
  PalletGrandpaStoredPendingChange: {
    scheduledAt: 'u32',
    delay: 'u32',
    nextAuthorities: 'Vec<(SpConsensusGrandpaAppPublic,u64)>',
    forced: 'Option<u32>'
  },
  /**
   * Lookup336: pallet_grandpa::pallet::Error<T>
   **/
  PalletGrandpaError: {
    _enum: ['PauseFailed', 'ResumeFailed', 'ChangePending', 'TooSoon', 'InvalidKeyOwnershipProof', 'InvalidEquivocationProof', 'DuplicateOffenceReport']
  },
  /**
   * Lookup340: pallet_im_online::pallet::Error<T>
   **/
  PalletImOnlineError: {
    _enum: ['InvalidKey', 'DuplicatedHeartbeat']
  },
  /**
   * Lookup343: sp_staking::offence::OffenceDetails<sp_core::crypto::AccountId32, Offender>
   **/
  SpStakingOffenceOffenceDetails: {
    offender: '(AccountId32,Null)',
    reporters: 'Vec<AccountId32>'
  },
  /**
   * Lookup347: pallet_identity::types::Registration<sp_core::crypto::AccountId32, MaxJudgements, pallet_identity::legacy::IdentityInfo<FieldLimit>>
   **/
  PalletIdentityRegistration: {
    judgements: 'Vec<(AccountId32,PalletIdentityJudgement)>',
    info: 'PalletIdentityLegacyIdentityInfo'
  },
  /**
   * Lookup355: pallet_identity::types::RegistrarInfo<sp_core::crypto::AccountId32, IdField>
   **/
  PalletIdentityRegistrarInfo: {
    account: 'AccountId32',
    fields: 'u64'
  },
  /**
   * Lookup357: pallet_identity::types::AuthorityProperties<bounded_collections::bounded_vec::BoundedVec<T, S>>
   **/
  PalletIdentityAuthorityProperties: {
    suffix: 'Bytes',
    allocation: 'u32'
  },
  /**
   * Lookup360: pallet_identity::pallet::Error<T>
   **/
  PalletIdentityError: {
    _enum: ['TooManySubAccounts', 'NotFound', 'RegistrarNotFound', 'RegistrarAlreadyExists', 'NotNamed', 'EmptyIndex', 'NoIdentity', 'StickyJudgement', 'JudgementGiven', 'InvalidJudgement', 'InvalidIndex', 'InvalidTarget', 'TooManyFields', 'TooManyRegistrars', 'AlreadyClaimed', 'NotSub', 'NotOwned', 'JudgementForDifferentIdentity', 'JudgementPaymentFailed', 'InvalidSuffix', 'NotUsernameAuthority', 'NoAllocation', 'InvalidSignature', 'RequiresSignature', 'InvalidUsername', 'UsernameTaken', 'NoUsername', 'NotExpired']
  },
  /**
   * Lookup363: pallet_scheduler::Scheduled<Name, frame_support::traits::preimages::Bounded<cord_loom_runtime::RuntimeCall, sp_runtime::traits::BlakeTwo256>, BlockNumber, cord_loom_runtime::OriginCaller, sp_core::crypto::AccountId32>
   **/
  PalletSchedulerScheduled: {
    maybeId: 'Option<[u8;32]>',
    priority: 'u8',
    call: 'FrameSupportPreimagesBounded',
    maybePeriodic: 'Option<(u32,u32)>',
    origin: 'CordLoomRuntimeOriginCaller'
  },
  /**
   * Lookup364: frame_support::traits::preimages::Bounded<cord_loom_runtime::RuntimeCall, sp_runtime::traits::BlakeTwo256>
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
   * Lookup365: sp_runtime::traits::BlakeTwo256
   **/
  SpRuntimeBlakeTwo256: 'Null',
  /**
   * Lookup367: pallet_scheduler::RetryConfig<Period>
   **/
  PalletSchedulerRetryConfig: {
    totalRetries: 'u8',
    remaining: 'u8',
    period: 'u32'
  },
  /**
   * Lookup368: pallet_scheduler::pallet::Error<T>
   **/
  PalletSchedulerError: {
    _enum: ['FailedToSchedule', 'NotFound', 'TargetBlockNumberInPast', 'RescheduleNoChange', 'Named']
  },
  /**
   * Lookup369: pallet_preimage::OldRequestStatus<sp_core::crypto::AccountId32, Balance>
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
   * Lookup372: pallet_preimage::RequestStatus<sp_core::crypto::AccountId32, frame_support::traits::tokens::fungible::HoldConsideration<A, F, R, D, Fp>>
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
   * Lookup377: pallet_preimage::pallet::Error<T>
   **/
  PalletPreimageError: {
    _enum: ['TooBig', 'AlreadyNoted', 'NotAuthorized', 'NotNoted', 'Requested', 'NotRequested', 'TooMany', 'TooFew', 'NoCost']
  },
  /**
   * Lookup379: pallet_multisig::Multisig<BlockNumber, Balance, sp_core::crypto::AccountId32, MaxApprovals>
   **/
  PalletMultisigMultisig: {
    when: 'PalletMultisigTimepoint',
    deposit: 'u128',
    depositor: 'AccountId32',
    approvals: 'Vec<AccountId32>'
  },
  /**
   * Lookup381: pallet_multisig::pallet::Error<T>
   **/
  PalletMultisigError: {
    _enum: ['MinimumThreshold', 'AlreadyApproved', 'NoApprovalsNeeded', 'TooFewSignatories', 'TooManySignatories', 'SignatoriesOutOfOrder', 'SenderInSignatories', 'NotFound', 'NotOwner', 'NoTimepoint', 'WrongTimepoint', 'UnexpectedTimepoint', 'MaxWeightTooLow', 'AlreadyStored']
  },
  /**
   * Lookup384: pallet_node_authorization::types::NodeInfo<bounded_collections::bounded_vec::BoundedVec<T, S>, sp_core::crypto::AccountId32>
   **/
  PalletNodeAuthorizationNodeInfo: {
    id: 'Bytes',
    owner: 'AccountId32'
  },
  /**
   * Lookup386: pallet_node_authorization::pallet::Error<T>
   **/
  PalletNodeAuthorizationError: {
    _enum: ['NodeIdTooLong', 'PeerIdTooLong', 'TooManyNodes', 'AlreadyJoined', 'NotExist', 'AlreadyClaimed', 'NotOwner', 'PermissionDenied', 'InvalidUtf8', 'InvalidNodeIdentifier', 'AlreadyConnected']
  },
  /**
   * Lookup387: pallet_assets::types::AssetDetails<Balance, sp_core::crypto::AccountId32, DepositBalance>
   **/
  PalletAssetsAssetDetails: {
    owner: 'AccountId32',
    issuer: 'AccountId32',
    admin: 'AccountId32',
    freezer: 'AccountId32',
    supply: 'u128',
    deposit: 'u128',
    minBalance: 'u128',
    isSufficient: 'bool',
    accounts: 'u32',
    sufficients: 'u32',
    approvals: 'u32',
    status: 'PalletAssetsAssetStatus'
  },
  /**
   * Lookup388: pallet_assets::types::AssetStatus
   **/
  PalletAssetsAssetStatus: {
    _enum: ['Live', 'Frozen', 'Destroying']
  },
  /**
   * Lookup389: pallet_assets::types::AssetAccount<Balance, DepositBalance, Extra, sp_core::crypto::AccountId32>
   **/
  PalletAssetsAssetAccount: {
    balance: 'u128',
    status: 'PalletAssetsAccountStatus',
    reason: 'PalletAssetsExistenceReason',
    extra: 'Null'
  },
  /**
   * Lookup390: pallet_assets::types::AccountStatus
   **/
  PalletAssetsAccountStatus: {
    _enum: ['Liquid', 'Frozen', 'Blocked']
  },
  /**
   * Lookup391: pallet_assets::types::ExistenceReason<Balance, sp_core::crypto::AccountId32>
   **/
  PalletAssetsExistenceReason: {
    _enum: {
      Consumer: 'Null',
      Sufficient: 'Null',
      DepositHeld: 'u128',
      DepositRefunded: 'Null',
      DepositFrom: '(AccountId32,u128)'
    }
  },
  /**
   * Lookup393: pallet_assets::types::Approval<Balance, DepositBalance>
   **/
  PalletAssetsApproval: {
    amount: 'u128',
    deposit: 'u128'
  },
  /**
   * Lookup394: pallet_assets::types::AssetMetadata<DepositBalance, bounded_collections::bounded_vec::BoundedVec<T, S>>
   **/
  PalletAssetsAssetMetadata: {
    deposit: 'u128',
    name: 'Bytes',
    symbol: 'Bytes',
    decimals: 'u8',
    isFrozen: 'bool'
  },
  /**
   * Lookup396: pallet_assets::pallet::Error<T, I>
   **/
  PalletAssetsError: {
    _enum: ['BalanceLow', 'NoAccount', 'NoPermission', 'Unknown', 'Frozen', 'InUse', 'BadWitness', 'MinBalanceZero', 'UnavailableConsumer', 'BadMetadata', 'Unapproved', 'WouldDie', 'AlreadyExists', 'NoDeposit', 'WouldBurn', 'LiveAsset', 'AssetNotLive', 'IncorrectStatus', 'NotFrozen', 'CallbackFailed', 'BadAssetId']
  },
  /**
   * Lookup399: pallet_contracts::wasm::CodeInfo<T>
   **/
  PalletContractsWasmCodeInfo: {
    owner: 'AccountId32',
    deposit: 'Compact<u128>',
    refcount: 'Compact<u64>',
    determinism: 'PalletContractsWasmDeterminism',
    codeLen: 'u32'
  },
  /**
   * Lookup400: pallet_contracts::storage::ContractInfo<T>
   **/
  PalletContractsStorageContractInfo: {
    trieId: 'Bytes',
    codeHash: 'H256',
    storageBytes: 'u32',
    storageItems: 'u32',
    storageByteDeposit: 'u128',
    storageItemDeposit: 'u128',
    storageBaseDeposit: 'u128',
    delegateDependencies: 'BTreeMap<H256, u128>'
  },
  /**
   * Lookup405: pallet_contracts::storage::DeletionQueueManager<T>
   **/
  PalletContractsStorageDeletionQueueManager: {
    insertCounter: 'u32',
    deleteCounter: 'u32'
  },
  /**
   * Lookup407: pallet_contracts::schedule::Schedule<T>
   **/
  PalletContractsSchedule: {
    limits: 'PalletContractsScheduleLimits',
    instructionWeights: 'PalletContractsScheduleInstructionWeights'
  },
  /**
   * Lookup408: pallet_contracts::schedule::Limits
   **/
  PalletContractsScheduleLimits: {
    eventTopics: 'u32',
    memoryPages: 'u32',
    subjectLen: 'u32',
    payloadLen: 'u32',
    runtimeMemory: 'u32'
  },
  /**
   * Lookup409: pallet_contracts::schedule::InstructionWeights<T>
   **/
  PalletContractsScheduleInstructionWeights: {
    base: 'u32'
  },
  /**
   * Lookup410: pallet_contracts::Environment<T>
   **/
  PalletContractsEnvironment: {
    _alias: {
      hash_: 'hash'
    },
    accountId: 'PalletContractsEnvironmentTypeAccountId32',
    balance: 'PalletContractsEnvironmentTypeU128',
    hash_: 'PalletContractsEnvironmentTypeH256',
    hasher: 'PalletContractsEnvironmentTypeBlakeTwo256',
    timestamp: 'PalletContractsEnvironmentTypeU64',
    blockNumber: 'PalletContractsEnvironmentTypeU32'
  },
  /**
   * Lookup411: pallet_contracts::EnvironmentType<sp_core::crypto::AccountId32>
   **/
  PalletContractsEnvironmentTypeAccountId32: 'Null',
  /**
   * Lookup412: pallet_contracts::EnvironmentType<T>
   **/
  PalletContractsEnvironmentTypeU128: 'Null',
  /**
   * Lookup413: pallet_contracts::EnvironmentType<primitive_types::H256>
   **/
  PalletContractsEnvironmentTypeH256: 'Null',
  /**
   * Lookup414: pallet_contracts::EnvironmentType<sp_runtime::traits::BlakeTwo256>
   **/
  PalletContractsEnvironmentTypeBlakeTwo256: 'Null',
  /**
   * Lookup415: pallet_contracts::EnvironmentType<T>
   **/
  PalletContractsEnvironmentTypeU64: 'Null',
  /**
   * Lookup416: pallet_contracts::EnvironmentType<T>
   **/
  PalletContractsEnvironmentTypeU32: 'Null',
  /**
   * Lookup418: pallet_contracts::pallet::Error<T>
   **/
  PalletContractsError: {
    _enum: ['InvalidSchedule', 'InvalidCallFlags', 'OutOfGas', 'OutputBufferTooSmall', 'TransferFailed', 'MaxCallDepthReached', 'ContractNotFound', 'CodeTooLarge', 'CodeNotFound', 'CodeInfoNotFound', 'OutOfBounds', 'DecodingFailed', 'ContractTrapped', 'ValueTooLarge', 'TerminatedWhileReentrant', 'InputForwarded', 'RandomSubjectTooLong', 'TooManyTopics', 'NoChainExtension', 'XCMDecodeFailed', 'DuplicateContract', 'TerminatedInConstructor', 'ReentranceDenied', 'StateChangeDenied', 'StorageDepositNotEnoughFunds', 'StorageDepositLimitExhausted', 'CodeInUse', 'ContractReverted', 'CodeRejected', 'Indeterministic', 'MigrationInProgress', 'NoMigrationPerformed', 'MaxDelegateDependenciesReached', 'DelegateDependencyNotFound', 'DelegateDependencyAlreadyExists', 'CannotAddSelfAsDelegateDependency', 'OutOfTransientStorage']
  },
  /**
   * Lookup420: cord_identifier::types::IdentifierTypeOf
   **/
  CordIdentifierIdentifierTypeOf: {
    _enum: ['Asset', 'Auth', 'ChainSpace', 'Did', 'Rating', 'Registry', 'Statement', 'Schema', 'Template', 'Registries', 'Entries', 'RegistryAuthorization']
  },
  /**
   * Lookup422: cord_identifier::types::EventEntry<cord_identifier::types::CallTypeOf>
   **/
  CordIdentifierEventEntry: {
    action: 'CordIdentifierCallTypeOf',
    location: 'CordIdentifierTimepoint'
  },
  /**
   * Lookup423: cord_identifier::types::CallTypeOf
   **/
  CordIdentifierCallTypeOf: {
    _enum: ['Archive', 'Authorization', 'Capacity', 'CouncilRevoke', 'CouncilRestore', 'Deauthorization', 'Approved', 'Genesis', 'Update', 'Revoke', 'Restore', 'Remove', 'PartialRemove', 'PresentationAdded', 'PresentationRemoved', 'Rotate', 'Usage', 'Transfer', 'Debit', 'Credit', 'Issue', 'Reinstate']
  },
  /**
   * Lookup424: cord_identifier::types::Timepoint
   **/
  CordIdentifierTimepoint: {
    height: 'u32',
    index: 'u32'
  },
  /**
   * Lookup426: cord_identifier::pallet::Error<T>
   **/
  CordIdentifierError: {
    _enum: ['MaxEventsHistoryExceeded']
  },
  /**
   * Lookup427: pallet_network_membership::types::MemberData<BlockNumber>
   **/
  PalletNetworkMembershipMemberData: {
    expireOn: 'u32'
  },
  /**
   * Lookup429: pallet_network_membership::pallet::Error<T>
   **/
  PalletNetworkMembershipError: {
    _enum: ['MembershipNotFound', 'MembershipAlreadyAcquired', 'MembershipRenewalAlreadyRequested', 'OriginNotAuthorized', 'MembershipRequestRejected', 'MembershipExpired', 'MaxMembersExceededForTheBlock']
  },
  /**
   * Lookup430: pallet_did::did_details::DidDetails<T>
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
   * Lookup435: pallet_did::did_details::DidPublicKeyDetails<BlockNumber, sp_core::crypto::AccountId32>
   **/
  PalletDidDidDetailsDidPublicKeyDetails: {
    key: 'PalletDidDidDetailsDidPublicKey',
    blockNumber: 'u32'
  },
  /**
   * Lookup436: pallet_did::did_details::DidPublicKey<sp_core::crypto::AccountId32>
   **/
  PalletDidDidDetailsDidPublicKey: {
    _enum: {
      PublicVerificationKey: 'PalletDidDidDetailsDidVerificationKey',
      PublicEncryptionKey: 'PalletDidDidDetailsDidEncryptionKey'
    }
  },
  /**
   * Lookup441: pallet_did::pallet::Error<T>
   **/
  PalletDidError: {
    _enum: ['InvalidSignatureFormat', 'InvalidSignature', 'AlreadyExists', 'NotFound', 'VerificationKeyNotFound', 'InvalidNonce', 'UnsupportedDidAuthorizationCall', 'InvalidDidAuthorizationCall', 'MaxNewKeyAgreementKeysLimitExceeded', 'MaxPublicKeysExceeded', 'MaxKeyAgreementKeysExceeded', 'BadDidOrigin', 'TransactionExpired', 'AlreadyDeleted', 'MaxNumberOfServicesExceeded', 'MaxServiceIdLengthExceeded', 'MaxServiceTypeLengthExceeded', 'MaxNumberOfTypesPerServiceExceeded', 'MaxServiceUrlLengthExceeded', 'MaxNumberOfUrlsPerServiceExceeded', 'ServiceAlreadyExists', 'ServiceNotFound', 'InvalidServiceEncoding', 'MaxStoredEndpointsCountExceeded', 'Internal']
  },
  /**
   * Lookup442: pallet_schema::types::SchemaEntry<bounded_collections::bounded_vec::BoundedVec<T, S>, primitive_types::H256, sp_core::crypto::AccountId32, cord_identifier::curi::Ss58Identifier>
   **/
  PalletSchemaSchemaEntry: {
    schema: 'Bytes',
    digest: 'H256',
    creator: 'AccountId32',
    space: 'Bytes'
  },
  /**
   * Lookup443: pallet_schema::pallet::Error<T>
   **/
  PalletSchemaError: {
    _enum: ['SchemaAlreadyAnchored', 'SchemaNotFound', 'InvalidIdentifierLength', 'UnableToPayFees', 'CreatorNotFound', 'MaxEncodedSchemaLimitExceeded', 'EmptyTransaction']
  },
  /**
   * Lookup444: pallet_chain_space::types::SpaceDetails<primitive_types::H256, sp_core::crypto::AccountId32, StatusOf, cord_identifier::curi::Ss58Identifier>
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
   * Lookup445: pallet_chain_space::types::SpaceAuthorization<cord_identifier::curi::Ss58Identifier, sp_core::crypto::AccountId32, pallet_chain_space::types::Permissions>
   **/
  PalletChainSpaceSpaceAuthorization: {
    spaceId: 'Bytes',
    delegate: 'AccountId32',
    permissions: 'PalletChainSpacePermissions',
    delegator: 'AccountId32'
  },
  /**
   * Lookup446: pallet_chain_space::types::Permissions
   **/
  PalletChainSpacePermissions: {
    bits: 'u32'
  },
  /**
   * Lookup448: pallet_chain_space::pallet::Error<T>
   **/
  PalletChainSpaceError: {
    _enum: ['SpaceAlreadyAnchored', 'SpaceNotFound', 'UnauthorizedOperation', 'InvalidIdentifier', 'InvalidIdentifierLength', 'InvalidIdentifierPrefix', 'ArchivedSpace', 'SpaceNotArchived', 'SpaceDelegatesLimitExceeded', 'EmptyTransaction', 'DelegateAlreadyAdded', 'AuthorizationNotFound', 'DelegateNotFound', 'SpaceAlreadyApproved', 'SpaceNotApproved', 'CapacityLimitExceeded', 'CapacityLessThanUsage', 'CapacityValueMissing', 'TypeCapacityOverflow']
  },
  /**
   * Lookup449: pallet_statement::types::StatementDetails<primitive_types::H256, cord_identifier::curi::Ss58Identifier, cord_identifier::curi::Ss58Identifier>
   **/
  PalletStatementStatementDetails: {
    digest: 'H256',
    space: 'Bytes',
    schema: 'Option<Bytes>'
  },
  /**
   * Lookup451: pallet_statement::types::StatementPresentationDetails<sp_core::crypto::AccountId32, pallet_statement::types::PresentationTypeOf, primitive_types::H256, cord_identifier::curi::Ss58Identifier>
   **/
  PalletStatementStatementPresentationDetails: {
    creator: 'AccountId32',
    presentationType: 'PalletStatementPresentationTypeOf',
    digest: 'H256',
    space: 'Bytes'
  },
  /**
   * Lookup452: pallet_statement::types::StatementEntryStatus<sp_core::crypto::AccountId32, StatusOf>
   **/
  PalletStatementStatementEntryStatus: {
    creator: 'AccountId32',
    revoked: 'bool'
  },
  /**
   * Lookup454: pallet_statement::pallet::Error<T>
   **/
  PalletStatementError: {
    _enum: ['StatementAlreadyAnchored', 'StatementNotFound', 'UnauthorizedOperation', 'StatementEntryNotFound', 'StatementRevoked', 'StatementNotRevoked', 'StatementLinkNotFound', 'StatementLinkRevoked', 'InvalidSignature', 'HashAlreadyAnchored', 'ExpiredSignature', 'InvalidStatementIdentifier', 'InvalidIdentifierLength', 'StatementSpaceMismatch', 'DigestHashAlreadyAnchored', 'InvalidTransactionHash', 'MetadataLimitExceeded', 'MetadataAlreadySet', 'MetadataNotFound', 'TooManyDelegates', 'TooManyDelegatesToRemove', 'AuthorizationDetailsNotFound', 'MaxStatementActivitiesExceeded', 'AttestationNotFound', 'MaxDigestLimitExceeded', 'BulkTransactionFailed', 'AssociateDigestAlreadyAnchored', 'PresentationDigestAlreadyAnchored', 'PresentationNotFound', 'StatementDigestAlreadyAnchored']
  },
  /**
   * Lookup455: pallet_did_name::did_name::DidNameOwnership<sp_core::crypto::AccountId32, BlockNumber>
   **/
  PalletDidNameDidNameDidNameOwnership: {
    owner: 'AccountId32',
    registeredAt: 'u32'
  },
  /**
   * Lookup456: pallet_did_name::pallet::Error<T>
   **/
  PalletDidNameError: {
    _enum: ['InsufficientFunds', 'AlreadyExists', 'NotFound', 'OwnerAlreadyExists', 'OwnerNotFound', 'Banned', 'NotBanned', 'AlreadyBanned', 'NotAuthorized', 'NameTooShort', 'NameExceedsMaxLength', 'NamePrefixTooShort', 'NamePrefixTooLong', 'InvalidSuffix', 'SuffixTooLong', 'InvalidFormat']
  },
  /**
   * Lookup457: pallet_network_score::types::RatingEntry<bounded_collections::bounded_vec::BoundedVec<T, S>, sp_core::crypto::AccountId32, pallet_network_score::types::RatingTypeOf, cord_identifier::curi::Ss58Identifier, primitive_types::H256, bounded_collections::bounded_vec::BoundedVec<T, S>, cord_identifier::curi::Ss58Identifier, sp_core::crypto::AccountId32, pallet_network_score::types::EntryTypeOf, Moment>
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
   * Lookup458: pallet_network_score::types::EntryTypeOf
   **/
  PalletNetworkScoreEntryTypeOf: {
    _enum: ['Credit', 'Debit']
  },
  /**
   * Lookup460: pallet_network_score::types::AggregatedEntryOf
   **/
  PalletNetworkScoreAggregatedEntryOf: {
    countOfTxn: 'u64',
    totalEncodedRating: 'u64'
  },
  /**
   * Lookup462: pallet_network_score::pallet::Error<T>
   **/
  PalletNetworkScoreError: {
    _enum: ['UnauthorizedOperation', 'InvalidIdentifierLength', 'InvalidDigest', 'InvalidSignature', 'InvalidRatingIdentifier', 'MessageIdAlreadyExists', 'InvalidRatingValue', 'TooManyJournalEntries', 'InvalidEntitySignature', 'DigestAlreadyAnchored', 'RatingIdentifierAlreadyAdded', 'InvalidRatingType', 'RatingIdentifierNotFound', 'ReferenceIdentifierNotFound', 'ReferenceNotDebitIdentifier', 'EntityMismatch', 'SpaceMismatch']
  },
  /**
   * Lookup463: pallet_asset_conversion::types::PoolInfo<PoolAssetId>
   **/
  PalletAssetConversionPoolInfo: {
    lpToken: 'u32'
  },
  /**
   * Lookup464: pallet_asset_conversion::pallet::Error<T>
   **/
  PalletAssetConversionError: {
    _enum: ['InvalidAssetPair', 'PoolExists', 'WrongDesiredAmount', 'AmountOneLessThanMinimal', 'AmountTwoLessThanMinimal', 'ReserveLeftLessThanMinimal', 'AmountOutTooHigh', 'PoolNotFound', 'Overflow', 'AssetOneDepositDidNotMeetMinimum', 'AssetTwoDepositDidNotMeetMinimum', 'AssetOneWithdrawalDidNotMeetMinimum', 'AssetTwoWithdrawalDidNotMeetMinimum', 'OptimalAmountLessThanDesired', 'InsufficientLiquidityMinted', 'ZeroLiquidity', 'ZeroAmount', 'ProvidedMinimumNotSufficientForSwap', 'ProvidedMaximumNotSufficientForSwap', 'InvalidPath', 'NonUniquePath', 'IncorrectPoolAssetId', 'BelowMinimum']
  },
  /**
   * Lookup465: pallet_remark::pallet::Error<T>
   **/
  PalletRemarkError: {
    _enum: ['Empty', 'BadContext']
  },
  /**
   * Lookup466: pallet_registries::types::RegistryDetails<sp_core::crypto::AccountId32, StatusOf, primitive_types::H256>
   **/
  PalletRegistriesRegistryDetails: {
    creator: 'AccountId32',
    revoked: 'bool',
    archived: 'bool',
    digest: 'H256'
  },
  /**
   * Lookup467: pallet_registries::types::RegistryAuthorization<cord_identifier::curi::Ss58Identifier, sp_core::crypto::AccountId32, pallet_registries::types::Permissions>
   **/
  PalletRegistriesRegistryAuthorization: {
    registryId: 'Bytes',
    delegate: 'AccountId32',
    permissions: 'PalletRegistriesPermissions',
    delegator: 'AccountId32'
  },
  /**
   * Lookup468: pallet_registries::types::Permissions
   **/
  PalletRegistriesPermissions: {
    bits: 'u32'
  },
  /**
   * Lookup470: pallet_registries::pallet::Error<T>
   **/
  PalletRegistriesError: {
    _enum: ['RegistryAlreadyAnchored', 'RegistryNotFound', 'UnauthorizedOperation', 'InvalidIdentifier', 'InvalidIdentifierLength', 'RegistryDelegatesLimitExceeded', 'DelegateAlreadyAdded', 'AuthorizationNotFound', 'DelegateNotFound', 'RegistryNotRevoked', 'RegistryAlreadyRevoked', 'RegistryRevoked', 'RegistryNotArchived', 'RegistryAlreadyArchived', 'RegistryArchived']
  },
  /**
   * Lookup471: pallet_entries::types::RegistryEntryDetails<primitive_types::H256, StatusOf, sp_core::crypto::AccountId32, cord_identifier::curi::Ss58Identifier>
   **/
  PalletEntriesRegistryEntryDetails: {
    digest: 'H256',
    revoked: 'bool',
    creator: 'AccountId32',
    registryId: 'Bytes'
  },
  /**
   * Lookup472: pallet_entries::pallet::Error<T>
   **/
  PalletEntriesError: {
    _enum: ['InvalidIdentifierLength', 'InvalidRegistryEntryIdentifier', 'UnauthorizedOperation', 'RegistryEntryIdentifierAlreadyExists', 'RegistryEntryIdentifierDoesNotExist', 'RegistryEntryNotRevoked']
  },
  /**
   * Lookup473: pallet_sudo::pallet::Error<T>
   **/
  PalletSudoError: {
    _enum: ['RequireSudo']
  },
  /**
   * Lookup476: pallet_network_membership::CheckNetworkMembership<T>
   **/
  PalletNetworkMembershipCheckNetworkMembership: 'Null',
  /**
   * Lookup477: frame_system::extensions::check_non_zero_sender::CheckNonZeroSender<T>
   **/
  FrameSystemExtensionsCheckNonZeroSender: 'Null',
  /**
   * Lookup478: frame_system::extensions::check_spec_version::CheckSpecVersion<T>
   **/
  FrameSystemExtensionsCheckSpecVersion: 'Null',
  /**
   * Lookup479: frame_system::extensions::check_tx_version::CheckTxVersion<T>
   **/
  FrameSystemExtensionsCheckTxVersion: 'Null',
  /**
   * Lookup480: frame_system::extensions::check_genesis::CheckGenesis<T>
   **/
  FrameSystemExtensionsCheckGenesis: 'Null',
  /**
   * Lookup483: frame_system::extensions::check_nonce::CheckNonce<T>
   **/
  FrameSystemExtensionsCheckNonce: 'Compact<u32>',
  /**
   * Lookup484: frame_system::extensions::check_weight::CheckWeight<T>
   **/
  FrameSystemExtensionsCheckWeight: 'Null',
  /**
   * Lookup485: pallet_transaction_payment::ChargeTransactionPayment<T>
   **/
  PalletTransactionPaymentChargeTransactionPayment: 'Compact<u128>'
};
