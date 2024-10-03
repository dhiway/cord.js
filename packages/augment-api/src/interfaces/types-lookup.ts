// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/types/lookup';

import type { Data } from '@polkadot/types';
import type { BTreeMap, BTreeSet, Bytes, Compact, Enum, Null, Option, Result, Struct, Text, U8aFixed, Vec, bool, u128, u16, u32, u64, u8 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { OpaquePeerId } from '@polkadot/types/interfaces/imOnline';
import type { AccountId32, Call, H256, MultiAddress, Perbill, Permill } from '@polkadot/types/interfaces/runtime';
import type { Event } from '@polkadot/types/interfaces/system';

declare module '@polkadot/types/lookup' {
  /** @name FrameSystemAccountInfo (3) */
  interface FrameSystemAccountInfo extends Struct {
    readonly nonce: u32;
    readonly consumers: u32;
    readonly providers: u32;
    readonly sufficients: u32;
    readonly data: PalletBalancesAccountData;
  }

  /** @name PalletBalancesAccountData (5) */
  interface PalletBalancesAccountData extends Struct {
    readonly free: u128;
    readonly reserved: u128;
    readonly frozen: u128;
    readonly flags: u128;
  }

  /** @name FrameSupportDispatchPerDispatchClassWeight (9) */
  interface FrameSupportDispatchPerDispatchClassWeight extends Struct {
    readonly normal: SpWeightsWeightV2Weight;
    readonly operational: SpWeightsWeightV2Weight;
    readonly mandatory: SpWeightsWeightV2Weight;
  }

  /** @name SpWeightsWeightV2Weight (10) */
  interface SpWeightsWeightV2Weight extends Struct {
    readonly refTime: Compact<u64>;
    readonly proofSize: Compact<u64>;
  }

  /** @name SpRuntimeDigest (15) */
  interface SpRuntimeDigest extends Struct {
    readonly logs: Vec<SpRuntimeDigestDigestItem>;
  }

  /** @name SpRuntimeDigestDigestItem (17) */
  interface SpRuntimeDigestDigestItem extends Enum {
    readonly isOther: boolean;
    readonly asOther: Bytes;
    readonly isConsensus: boolean;
    readonly asConsensus: ITuple<[U8aFixed, Bytes]>;
    readonly isSeal: boolean;
    readonly asSeal: ITuple<[U8aFixed, Bytes]>;
    readonly isPreRuntime: boolean;
    readonly asPreRuntime: ITuple<[U8aFixed, Bytes]>;
    readonly isRuntimeEnvironmentUpdated: boolean;
    readonly type: 'Other' | 'Consensus' | 'Seal' | 'PreRuntime' | 'RuntimeEnvironmentUpdated';
  }

  /** @name FrameSystemEventRecord (20) */
  interface FrameSystemEventRecord extends Struct {
    readonly phase: FrameSystemPhase;
    readonly event: Event;
    readonly topics: Vec<H256>;
  }

  /** @name FrameSystemEvent (22) */
  interface FrameSystemEvent extends Enum {
    readonly isExtrinsicSuccess: boolean;
    readonly asExtrinsicSuccess: {
      readonly dispatchInfo: FrameSupportDispatchDispatchInfo;
    } & Struct;
    readonly isExtrinsicFailed: boolean;
    readonly asExtrinsicFailed: {
      readonly dispatchError: SpRuntimeDispatchError;
      readonly dispatchInfo: FrameSupportDispatchDispatchInfo;
    } & Struct;
    readonly isCodeUpdated: boolean;
    readonly isNewAccount: boolean;
    readonly asNewAccount: {
      readonly account: AccountId32;
    } & Struct;
    readonly isKilledAccount: boolean;
    readonly asKilledAccount: {
      readonly account: AccountId32;
    } & Struct;
    readonly isRemarked: boolean;
    readonly asRemarked: {
      readonly sender: AccountId32;
      readonly hash_: H256;
    } & Struct;
    readonly isUpgradeAuthorized: boolean;
    readonly asUpgradeAuthorized: {
      readonly codeHash: H256;
      readonly checkVersion: bool;
    } & Struct;
    readonly type: 'ExtrinsicSuccess' | 'ExtrinsicFailed' | 'CodeUpdated' | 'NewAccount' | 'KilledAccount' | 'Remarked' | 'UpgradeAuthorized';
  }

  /** @name FrameSupportDispatchDispatchInfo (23) */
  interface FrameSupportDispatchDispatchInfo extends Struct {
    readonly weight: SpWeightsWeightV2Weight;
    readonly class: FrameSupportDispatchDispatchClass;
    readonly paysFee: FrameSupportDispatchPays;
  }

  /** @name FrameSupportDispatchDispatchClass (24) */
  interface FrameSupportDispatchDispatchClass extends Enum {
    readonly isNormal: boolean;
    readonly isOperational: boolean;
    readonly isMandatory: boolean;
    readonly type: 'Normal' | 'Operational' | 'Mandatory';
  }

  /** @name FrameSupportDispatchPays (25) */
  interface FrameSupportDispatchPays extends Enum {
    readonly isYes: boolean;
    readonly isNo: boolean;
    readonly type: 'Yes' | 'No';
  }

  /** @name SpRuntimeDispatchError (26) */
  interface SpRuntimeDispatchError extends Enum {
    readonly isOther: boolean;
    readonly isCannotLookup: boolean;
    readonly isBadOrigin: boolean;
    readonly isModule: boolean;
    readonly asModule: SpRuntimeModuleError;
    readonly isConsumerRemaining: boolean;
    readonly isNoProviders: boolean;
    readonly isTooManyConsumers: boolean;
    readonly isToken: boolean;
    readonly asToken: SpRuntimeTokenError;
    readonly isArithmetic: boolean;
    readonly asArithmetic: SpArithmeticArithmeticError;
    readonly isTransactional: boolean;
    readonly asTransactional: SpRuntimeTransactionalError;
    readonly isExhausted: boolean;
    readonly isCorruption: boolean;
    readonly isUnavailable: boolean;
    readonly isRootNotAllowed: boolean;
    readonly type: 'Other' | 'CannotLookup' | 'BadOrigin' | 'Module' | 'ConsumerRemaining' | 'NoProviders' | 'TooManyConsumers' | 'Token' | 'Arithmetic' | 'Transactional' | 'Exhausted' | 'Corruption' | 'Unavailable' | 'RootNotAllowed';
  }

  /** @name SpRuntimeModuleError (27) */
  interface SpRuntimeModuleError extends Struct {
    readonly index: u8;
    readonly error: U8aFixed;
  }

  /** @name SpRuntimeTokenError (28) */
  interface SpRuntimeTokenError extends Enum {
    readonly isFundsUnavailable: boolean;
    readonly isOnlyProvider: boolean;
    readonly isBelowMinimum: boolean;
    readonly isCannotCreate: boolean;
    readonly isUnknownAsset: boolean;
    readonly isFrozen: boolean;
    readonly isUnsupported: boolean;
    readonly isCannotCreateHold: boolean;
    readonly isNotExpendable: boolean;
    readonly isBlocked: boolean;
    readonly type: 'FundsUnavailable' | 'OnlyProvider' | 'BelowMinimum' | 'CannotCreate' | 'UnknownAsset' | 'Frozen' | 'Unsupported' | 'CannotCreateHold' | 'NotExpendable' | 'Blocked';
  }

  /** @name SpArithmeticArithmeticError (29) */
  interface SpArithmeticArithmeticError extends Enum {
    readonly isUnderflow: boolean;
    readonly isOverflow: boolean;
    readonly isDivisionByZero: boolean;
    readonly type: 'Underflow' | 'Overflow' | 'DivisionByZero';
  }

  /** @name SpRuntimeTransactionalError (30) */
  interface SpRuntimeTransactionalError extends Enum {
    readonly isLimitReached: boolean;
    readonly isNoLayer: boolean;
    readonly type: 'LimitReached' | 'NoLayer';
  }

  /** @name PalletUtilityEvent (31) */
  interface PalletUtilityEvent extends Enum {
    readonly isBatchInterrupted: boolean;
    readonly asBatchInterrupted: {
      readonly index: u32;
      readonly error: SpRuntimeDispatchError;
    } & Struct;
    readonly isBatchCompleted: boolean;
    readonly isBatchCompletedWithErrors: boolean;
    readonly isItemCompleted: boolean;
    readonly isItemFailed: boolean;
    readonly asItemFailed: {
      readonly error: SpRuntimeDispatchError;
    } & Struct;
    readonly isDispatchedAs: boolean;
    readonly asDispatchedAs: {
      readonly result: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly type: 'BatchInterrupted' | 'BatchCompleted' | 'BatchCompletedWithErrors' | 'ItemCompleted' | 'ItemFailed' | 'DispatchedAs';
  }

  /** @name AuthorityMembershipEvent (34) */
  interface AuthorityMembershipEvent extends Enum {
    readonly isIncomingAuthorities: boolean;
    readonly asIncomingAuthorities: Vec<AccountId32>;
    readonly isOutgoingAuthorities: boolean;
    readonly asOutgoingAuthorities: Vec<AccountId32>;
    readonly isMemberAdded: boolean;
    readonly asMemberAdded: AccountId32;
    readonly isMemberGoOffline: boolean;
    readonly asMemberGoOffline: AccountId32;
    readonly isMemberGoOnline: boolean;
    readonly asMemberGoOnline: AccountId32;
    readonly isMemberRemoved: boolean;
    readonly asMemberRemoved: AccountId32;
    readonly isMemberWhiteList: boolean;
    readonly asMemberWhiteList: AccountId32;
    readonly isMemberDisconnected: boolean;
    readonly asMemberDisconnected: AccountId32;
    readonly isMemberBlacklistedRemoved: boolean;
    readonly asMemberBlacklistedRemoved: AccountId32;
    readonly type: 'IncomingAuthorities' | 'OutgoingAuthorities' | 'MemberAdded' | 'MemberGoOffline' | 'MemberGoOnline' | 'MemberRemoved' | 'MemberWhiteList' | 'MemberDisconnected' | 'MemberBlacklistedRemoved';
  }

  /** @name PalletIndicesEvent (36) */
  interface PalletIndicesEvent extends Enum {
    readonly isIndexAssigned: boolean;
    readonly asIndexAssigned: {
      readonly who: AccountId32;
      readonly index: u32;
    } & Struct;
    readonly isIndexFreed: boolean;
    readonly asIndexFreed: {
      readonly index: u32;
    } & Struct;
    readonly isIndexFrozen: boolean;
    readonly asIndexFrozen: {
      readonly index: u32;
      readonly who: AccountId32;
    } & Struct;
    readonly type: 'IndexAssigned' | 'IndexFreed' | 'IndexFrozen';
  }

  /** @name PalletBalancesEvent (37) */
  interface PalletBalancesEvent extends Enum {
    readonly isEndowed: boolean;
    readonly asEndowed: {
      readonly account: AccountId32;
      readonly freeBalance: u128;
    } & Struct;
    readonly isDustLost: boolean;
    readonly asDustLost: {
      readonly account: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isTransfer: boolean;
    readonly asTransfer: {
      readonly from: AccountId32;
      readonly to: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isBalanceSet: boolean;
    readonly asBalanceSet: {
      readonly who: AccountId32;
      readonly free: u128;
    } & Struct;
    readonly isReserved: boolean;
    readonly asReserved: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isUnreserved: boolean;
    readonly asUnreserved: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isReserveRepatriated: boolean;
    readonly asReserveRepatriated: {
      readonly from: AccountId32;
      readonly to: AccountId32;
      readonly amount: u128;
      readonly destinationStatus: FrameSupportTokensMiscBalanceStatus;
    } & Struct;
    readonly isDeposit: boolean;
    readonly asDeposit: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isWithdraw: boolean;
    readonly asWithdraw: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isSlashed: boolean;
    readonly asSlashed: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isMinted: boolean;
    readonly asMinted: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isBurned: boolean;
    readonly asBurned: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isSuspended: boolean;
    readonly asSuspended: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isRestored: boolean;
    readonly asRestored: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isUpgraded: boolean;
    readonly asUpgraded: {
      readonly who: AccountId32;
    } & Struct;
    readonly isIssued: boolean;
    readonly asIssued: {
      readonly amount: u128;
    } & Struct;
    readonly isRescinded: boolean;
    readonly asRescinded: {
      readonly amount: u128;
    } & Struct;
    readonly isLocked: boolean;
    readonly asLocked: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isUnlocked: boolean;
    readonly asUnlocked: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isFrozen: boolean;
    readonly asFrozen: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isThawed: boolean;
    readonly asThawed: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isTotalIssuanceForced: boolean;
    readonly asTotalIssuanceForced: {
      readonly old: u128;
      readonly new_: u128;
    } & Struct;
    readonly type: 'Endowed' | 'DustLost' | 'Transfer' | 'BalanceSet' | 'Reserved' | 'Unreserved' | 'ReserveRepatriated' | 'Deposit' | 'Withdraw' | 'Slashed' | 'Minted' | 'Burned' | 'Suspended' | 'Restored' | 'Upgraded' | 'Issued' | 'Rescinded' | 'Locked' | 'Unlocked' | 'Frozen' | 'Thawed' | 'TotalIssuanceForced';
  }

  /** @name FrameSupportTokensMiscBalanceStatus (38) */
  interface FrameSupportTokensMiscBalanceStatus extends Enum {
    readonly isFree: boolean;
    readonly isReserved: boolean;
    readonly type: 'Free' | 'Reserved';
  }

  /** @name PalletSessionEvent (39) */
  interface PalletSessionEvent extends Enum {
    readonly isNewSession: boolean;
    readonly asNewSession: {
      readonly sessionIndex: u32;
    } & Struct;
    readonly type: 'NewSession';
  }

  /** @name PalletTransactionPaymentEvent (40) */
  interface PalletTransactionPaymentEvent extends Enum {
    readonly isTransactionFeePaid: boolean;
    readonly asTransactionFeePaid: {
      readonly who: AccountId32;
      readonly actualFee: u128;
      readonly tip: u128;
    } & Struct;
    readonly type: 'TransactionFeePaid';
  }

  /** @name PalletTreasuryEvent (41) */
  interface PalletTreasuryEvent extends Enum {
    readonly isSpending: boolean;
    readonly asSpending: {
      readonly budgetRemaining: u128;
    } & Struct;
    readonly isAwarded: boolean;
    readonly asAwarded: {
      readonly proposalIndex: u32;
      readonly award: u128;
      readonly account: AccountId32;
    } & Struct;
    readonly isBurnt: boolean;
    readonly asBurnt: {
      readonly burntFunds: u128;
    } & Struct;
    readonly isRollover: boolean;
    readonly asRollover: {
      readonly rolloverBalance: u128;
    } & Struct;
    readonly isDeposit: boolean;
    readonly asDeposit: {
      readonly value: u128;
    } & Struct;
    readonly isSpendApproved: boolean;
    readonly asSpendApproved: {
      readonly proposalIndex: u32;
      readonly amount: u128;
      readonly beneficiary: AccountId32;
    } & Struct;
    readonly isUpdatedInactive: boolean;
    readonly asUpdatedInactive: {
      readonly reactivated: u128;
      readonly deactivated: u128;
    } & Struct;
    readonly isAssetSpendApproved: boolean;
    readonly asAssetSpendApproved: {
      readonly index: u32;
      readonly assetKind: Null;
      readonly amount: u128;
      readonly beneficiary: AccountId32;
      readonly validFrom: u32;
      readonly expireAt: u32;
    } & Struct;
    readonly isAssetSpendVoided: boolean;
    readonly asAssetSpendVoided: {
      readonly index: u32;
    } & Struct;
    readonly isPaid: boolean;
    readonly asPaid: {
      readonly index: u32;
      readonly paymentId: Null;
    } & Struct;
    readonly isPaymentFailed: boolean;
    readonly asPaymentFailed: {
      readonly index: u32;
      readonly paymentId: Null;
    } & Struct;
    readonly isSpendProcessed: boolean;
    readonly asSpendProcessed: {
      readonly index: u32;
    } & Struct;
    readonly type: 'Spending' | 'Awarded' | 'Burnt' | 'Rollover' | 'Deposit' | 'SpendApproved' | 'UpdatedInactive' | 'AssetSpendApproved' | 'AssetSpendVoided' | 'Paid' | 'PaymentFailed' | 'SpendProcessed';
  }

  /** @name PalletCollectiveEvent (42) */
  interface PalletCollectiveEvent extends Enum {
    readonly isProposed: boolean;
    readonly asProposed: {
      readonly account: AccountId32;
      readonly proposalIndex: u32;
      readonly proposalHash: H256;
      readonly threshold: u32;
    } & Struct;
    readonly isVoted: boolean;
    readonly asVoted: {
      readonly account: AccountId32;
      readonly proposalHash: H256;
      readonly voted: bool;
      readonly yes: u32;
      readonly no: u32;
    } & Struct;
    readonly isApproved: boolean;
    readonly asApproved: {
      readonly proposalHash: H256;
    } & Struct;
    readonly isDisapproved: boolean;
    readonly asDisapproved: {
      readonly proposalHash: H256;
    } & Struct;
    readonly isExecuted: boolean;
    readonly asExecuted: {
      readonly proposalHash: H256;
      readonly result: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly isMemberExecuted: boolean;
    readonly asMemberExecuted: {
      readonly proposalHash: H256;
      readonly result: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly isClosed: boolean;
    readonly asClosed: {
      readonly proposalHash: H256;
      readonly yes: u32;
      readonly no: u32;
    } & Struct;
    readonly type: 'Proposed' | 'Voted' | 'Approved' | 'Disapproved' | 'Executed' | 'MemberExecuted' | 'Closed';
  }

  /** @name PalletMembershipEvent (43) */
  interface PalletMembershipEvent extends Enum {
    readonly isMemberAdded: boolean;
    readonly isMemberRemoved: boolean;
    readonly isMembersSwapped: boolean;
    readonly isMembersReset: boolean;
    readonly isKeyChanged: boolean;
    readonly isDummy: boolean;
    readonly type: 'MemberAdded' | 'MemberRemoved' | 'MembersSwapped' | 'MembersReset' | 'KeyChanged' | 'Dummy';
  }

  /** @name PalletGrandpaEvent (46) */
  interface PalletGrandpaEvent extends Enum {
    readonly isNewAuthorities: boolean;
    readonly asNewAuthorities: {
      readonly authoritySet: Vec<ITuple<[SpConsensusGrandpaAppPublic, u64]>>;
    } & Struct;
    readonly isPaused: boolean;
    readonly isResumed: boolean;
    readonly type: 'NewAuthorities' | 'Paused' | 'Resumed';
  }

  /** @name SpConsensusGrandpaAppPublic (49) */
  interface SpConsensusGrandpaAppPublic extends U8aFixed {}

  /** @name PalletImOnlineEvent (50) */
  interface PalletImOnlineEvent extends Enum {
    readonly isHeartbeatReceived: boolean;
    readonly asHeartbeatReceived: {
      readonly authorityId: PalletImOnlineSr25519AppSr25519Public;
    } & Struct;
    readonly isAllGood: boolean;
    readonly isSomeOffline: boolean;
    readonly asSomeOffline: {
      readonly offline: Vec<ITuple<[AccountId32, Null]>>;
    } & Struct;
    readonly type: 'HeartbeatReceived' | 'AllGood' | 'SomeOffline';
  }

  /** @name PalletImOnlineSr25519AppSr25519Public (51) */
  interface PalletImOnlineSr25519AppSr25519Public extends U8aFixed {}

  /** @name PalletOffencesEvent (54) */
  interface PalletOffencesEvent extends Enum {
    readonly isOffence: boolean;
    readonly asOffence: {
      readonly kind: U8aFixed;
      readonly timeslot: Bytes;
    } & Struct;
    readonly type: 'Offence';
  }

  /** @name PalletIdentityEvent (56) */
  interface PalletIdentityEvent extends Enum {
    readonly isIdentitySet: boolean;
    readonly asIdentitySet: {
      readonly who: AccountId32;
    } & Struct;
    readonly isIdentityCleared: boolean;
    readonly asIdentityCleared: {
      readonly who: AccountId32;
    } & Struct;
    readonly isIdentityKilled: boolean;
    readonly asIdentityKilled: {
      readonly who: AccountId32;
    } & Struct;
    readonly isJudgementRequested: boolean;
    readonly asJudgementRequested: {
      readonly who: AccountId32;
      readonly registrar: AccountId32;
    } & Struct;
    readonly isJudgementUnrequested: boolean;
    readonly asJudgementUnrequested: {
      readonly who: AccountId32;
      readonly registrar: AccountId32;
    } & Struct;
    readonly isJudgementGiven: boolean;
    readonly asJudgementGiven: {
      readonly target: AccountId32;
      readonly registrar: AccountId32;
    } & Struct;
    readonly isRegistrarAdded: boolean;
    readonly asRegistrarAdded: {
      readonly registrarIndex: u32;
    } & Struct;
    readonly isRegistrarRemoved: boolean;
    readonly asRegistrarRemoved: {
      readonly registrar: AccountId32;
    } & Struct;
    readonly isSubIdentityAdded: boolean;
    readonly asSubIdentityAdded: {
      readonly sub: AccountId32;
      readonly main: AccountId32;
    } & Struct;
    readonly isSubIdentityRemoved: boolean;
    readonly asSubIdentityRemoved: {
      readonly sub: AccountId32;
      readonly main: AccountId32;
    } & Struct;
    readonly isSubIdentityRevoked: boolean;
    readonly asSubIdentityRevoked: {
      readonly sub: AccountId32;
      readonly main: AccountId32;
    } & Struct;
    readonly isAuthorityAdded: boolean;
    readonly asAuthorityAdded: {
      readonly authority: AccountId32;
    } & Struct;
    readonly isAuthorityRemoved: boolean;
    readonly asAuthorityRemoved: {
      readonly authority: AccountId32;
    } & Struct;
    readonly isUsernameSet: boolean;
    readonly asUsernameSet: {
      readonly who: AccountId32;
      readonly username: Bytes;
    } & Struct;
    readonly isUsernameQueued: boolean;
    readonly asUsernameQueued: {
      readonly who: AccountId32;
      readonly username: Bytes;
      readonly expiration: u32;
    } & Struct;
    readonly isPreapprovalExpired: boolean;
    readonly asPreapprovalExpired: {
      readonly whose: AccountId32;
    } & Struct;
    readonly isPrimaryUsernameSet: boolean;
    readonly asPrimaryUsernameSet: {
      readonly who: AccountId32;
      readonly username: Bytes;
    } & Struct;
    readonly isDanglingUsernameRemoved: boolean;
    readonly asDanglingUsernameRemoved: {
      readonly who: AccountId32;
      readonly username: Bytes;
    } & Struct;
    readonly type: 'IdentitySet' | 'IdentityCleared' | 'IdentityKilled' | 'JudgementRequested' | 'JudgementUnrequested' | 'JudgementGiven' | 'RegistrarAdded' | 'RegistrarRemoved' | 'SubIdentityAdded' | 'SubIdentityRemoved' | 'SubIdentityRevoked' | 'AuthorityAdded' | 'AuthorityRemoved' | 'UsernameSet' | 'UsernameQueued' | 'PreapprovalExpired' | 'PrimaryUsernameSet' | 'DanglingUsernameRemoved';
  }

  /** @name PalletSchedulerEvent (58) */
  interface PalletSchedulerEvent extends Enum {
    readonly isScheduled: boolean;
    readonly asScheduled: {
      readonly when: u32;
      readonly index: u32;
    } & Struct;
    readonly isCanceled: boolean;
    readonly asCanceled: {
      readonly when: u32;
      readonly index: u32;
    } & Struct;
    readonly isDispatched: boolean;
    readonly asDispatched: {
      readonly task: ITuple<[u32, u32]>;
      readonly id: Option<U8aFixed>;
      readonly result: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly isRetrySet: boolean;
    readonly asRetrySet: {
      readonly task: ITuple<[u32, u32]>;
      readonly id: Option<U8aFixed>;
      readonly period: u32;
      readonly retries: u8;
    } & Struct;
    readonly isRetryCancelled: boolean;
    readonly asRetryCancelled: {
      readonly task: ITuple<[u32, u32]>;
      readonly id: Option<U8aFixed>;
    } & Struct;
    readonly isCallUnavailable: boolean;
    readonly asCallUnavailable: {
      readonly task: ITuple<[u32, u32]>;
      readonly id: Option<U8aFixed>;
    } & Struct;
    readonly isPeriodicFailed: boolean;
    readonly asPeriodicFailed: {
      readonly task: ITuple<[u32, u32]>;
      readonly id: Option<U8aFixed>;
    } & Struct;
    readonly isRetryFailed: boolean;
    readonly asRetryFailed: {
      readonly task: ITuple<[u32, u32]>;
      readonly id: Option<U8aFixed>;
    } & Struct;
    readonly isPermanentlyOverweight: boolean;
    readonly asPermanentlyOverweight: {
      readonly task: ITuple<[u32, u32]>;
      readonly id: Option<U8aFixed>;
    } & Struct;
    readonly type: 'Scheduled' | 'Canceled' | 'Dispatched' | 'RetrySet' | 'RetryCancelled' | 'CallUnavailable' | 'PeriodicFailed' | 'RetryFailed' | 'PermanentlyOverweight';
  }

  /** @name PalletPreimageEvent (61) */
  interface PalletPreimageEvent extends Enum {
    readonly isNoted: boolean;
    readonly asNoted: {
      readonly hash_: H256;
    } & Struct;
    readonly isRequested: boolean;
    readonly asRequested: {
      readonly hash_: H256;
    } & Struct;
    readonly isCleared: boolean;
    readonly asCleared: {
      readonly hash_: H256;
    } & Struct;
    readonly type: 'Noted' | 'Requested' | 'Cleared';
  }

  /** @name PalletMultisigEvent (62) */
  interface PalletMultisigEvent extends Enum {
    readonly isNewMultisig: boolean;
    readonly asNewMultisig: {
      readonly approving: AccountId32;
      readonly multisig: AccountId32;
      readonly callHash: U8aFixed;
    } & Struct;
    readonly isMultisigApproval: boolean;
    readonly asMultisigApproval: {
      readonly approving: AccountId32;
      readonly timepoint: PalletMultisigTimepoint;
      readonly multisig: AccountId32;
      readonly callHash: U8aFixed;
    } & Struct;
    readonly isMultisigExecuted: boolean;
    readonly asMultisigExecuted: {
      readonly approving: AccountId32;
      readonly timepoint: PalletMultisigTimepoint;
      readonly multisig: AccountId32;
      readonly callHash: U8aFixed;
      readonly result: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly isMultisigCancelled: boolean;
    readonly asMultisigCancelled: {
      readonly cancelling: AccountId32;
      readonly timepoint: PalletMultisigTimepoint;
      readonly multisig: AccountId32;
      readonly callHash: U8aFixed;
    } & Struct;
    readonly type: 'NewMultisig' | 'MultisigApproval' | 'MultisigExecuted' | 'MultisigCancelled';
  }

  /** @name PalletMultisigTimepoint (63) */
  interface PalletMultisigTimepoint extends Struct {
    readonly height: u32;
    readonly index: u32;
  }

  /** @name PalletNodeAuthorizationEvent (64) */
  interface PalletNodeAuthorizationEvent extends Enum {
    readonly isNodeAdded: boolean;
    readonly asNodeAdded: {
      readonly nodeId: Bytes;
      readonly who: AccountId32;
    } & Struct;
    readonly isNodeRemoved: boolean;
    readonly asNodeRemoved: {
      readonly nodeId: Bytes;
    } & Struct;
    readonly isNodeSwapped: boolean;
    readonly asNodeSwapped: {
      readonly removed: Bytes;
      readonly added: Bytes;
    } & Struct;
    readonly isNodesReset: boolean;
    readonly asNodesReset: {
      readonly nodes: Vec<ITuple<[OpaquePeerId, AccountId32]>>;
    } & Struct;
    readonly isNodeClaimed: boolean;
    readonly asNodeClaimed: {
      readonly peerId: OpaquePeerId;
      readonly who: AccountId32;
    } & Struct;
    readonly isClaimRemoved: boolean;
    readonly asClaimRemoved: {
      readonly peerId: OpaquePeerId;
      readonly who: AccountId32;
    } & Struct;
    readonly isNodeTransferred: boolean;
    readonly asNodeTransferred: {
      readonly nodeId: Bytes;
      readonly target: AccountId32;
    } & Struct;
    readonly isConnectionsAdded: boolean;
    readonly asConnectionsAdded: {
      readonly nodeId: Bytes;
      readonly connection: Bytes;
    } & Struct;
    readonly isConnectionsRemoved: boolean;
    readonly asConnectionsRemoved: {
      readonly nodeId: Bytes;
      readonly connection: Bytes;
    } & Struct;
    readonly type: 'NodeAdded' | 'NodeRemoved' | 'NodeSwapped' | 'NodesReset' | 'NodeClaimed' | 'ClaimRemoved' | 'NodeTransferred' | 'ConnectionsAdded' | 'ConnectionsRemoved';
  }

  /** @name PalletAssetsEvent (68) */
  interface PalletAssetsEvent extends Enum {
    readonly isCreated: boolean;
    readonly asCreated: {
      readonly assetId: u32;
      readonly creator: AccountId32;
      readonly owner: AccountId32;
    } & Struct;
    readonly isIssued: boolean;
    readonly asIssued: {
      readonly assetId: u32;
      readonly owner: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isTransferred: boolean;
    readonly asTransferred: {
      readonly assetId: u32;
      readonly from: AccountId32;
      readonly to: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isBurned: boolean;
    readonly asBurned: {
      readonly assetId: u32;
      readonly owner: AccountId32;
      readonly balance: u128;
    } & Struct;
    readonly isTeamChanged: boolean;
    readonly asTeamChanged: {
      readonly assetId: u32;
      readonly issuer: AccountId32;
      readonly admin: AccountId32;
      readonly freezer: AccountId32;
    } & Struct;
    readonly isOwnerChanged: boolean;
    readonly asOwnerChanged: {
      readonly assetId: u32;
      readonly owner: AccountId32;
    } & Struct;
    readonly isFrozen: boolean;
    readonly asFrozen: {
      readonly assetId: u32;
      readonly who: AccountId32;
    } & Struct;
    readonly isThawed: boolean;
    readonly asThawed: {
      readonly assetId: u32;
      readonly who: AccountId32;
    } & Struct;
    readonly isAssetFrozen: boolean;
    readonly asAssetFrozen: {
      readonly assetId: u32;
    } & Struct;
    readonly isAssetThawed: boolean;
    readonly asAssetThawed: {
      readonly assetId: u32;
    } & Struct;
    readonly isAccountsDestroyed: boolean;
    readonly asAccountsDestroyed: {
      readonly assetId: u32;
      readonly accountsDestroyed: u32;
      readonly accountsRemaining: u32;
    } & Struct;
    readonly isApprovalsDestroyed: boolean;
    readonly asApprovalsDestroyed: {
      readonly assetId: u32;
      readonly approvalsDestroyed: u32;
      readonly approvalsRemaining: u32;
    } & Struct;
    readonly isDestructionStarted: boolean;
    readonly asDestructionStarted: {
      readonly assetId: u32;
    } & Struct;
    readonly isDestroyed: boolean;
    readonly asDestroyed: {
      readonly assetId: u32;
    } & Struct;
    readonly isForceCreated: boolean;
    readonly asForceCreated: {
      readonly assetId: u32;
      readonly owner: AccountId32;
    } & Struct;
    readonly isMetadataSet: boolean;
    readonly asMetadataSet: {
      readonly assetId: u32;
      readonly name: Bytes;
      readonly symbol: Bytes;
      readonly decimals: u8;
      readonly isFrozen: bool;
    } & Struct;
    readonly isMetadataCleared: boolean;
    readonly asMetadataCleared: {
      readonly assetId: u32;
    } & Struct;
    readonly isApprovedTransfer: boolean;
    readonly asApprovedTransfer: {
      readonly assetId: u32;
      readonly source: AccountId32;
      readonly delegate: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isApprovalCancelled: boolean;
    readonly asApprovalCancelled: {
      readonly assetId: u32;
      readonly owner: AccountId32;
      readonly delegate: AccountId32;
    } & Struct;
    readonly isTransferredApproved: boolean;
    readonly asTransferredApproved: {
      readonly assetId: u32;
      readonly owner: AccountId32;
      readonly delegate: AccountId32;
      readonly destination: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isAssetStatusChanged: boolean;
    readonly asAssetStatusChanged: {
      readonly assetId: u32;
    } & Struct;
    readonly isAssetMinBalanceChanged: boolean;
    readonly asAssetMinBalanceChanged: {
      readonly assetId: u32;
      readonly newMinBalance: u128;
    } & Struct;
    readonly isTouched: boolean;
    readonly asTouched: {
      readonly assetId: u32;
      readonly who: AccountId32;
      readonly depositor: AccountId32;
    } & Struct;
    readonly isBlocked: boolean;
    readonly asBlocked: {
      readonly assetId: u32;
      readonly who: AccountId32;
    } & Struct;
    readonly isDeposited: boolean;
    readonly asDeposited: {
      readonly assetId: u32;
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isWithdrawn: boolean;
    readonly asWithdrawn: {
      readonly assetId: u32;
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly type: 'Created' | 'Issued' | 'Transferred' | 'Burned' | 'TeamChanged' | 'OwnerChanged' | 'Frozen' | 'Thawed' | 'AssetFrozen' | 'AssetThawed' | 'AccountsDestroyed' | 'ApprovalsDestroyed' | 'DestructionStarted' | 'Destroyed' | 'ForceCreated' | 'MetadataSet' | 'MetadataCleared' | 'ApprovedTransfer' | 'ApprovalCancelled' | 'TransferredApproved' | 'AssetStatusChanged' | 'AssetMinBalanceChanged' | 'Touched' | 'Blocked' | 'Deposited' | 'Withdrawn';
  }

  /** @name PalletContractsEvent (70) */
  interface PalletContractsEvent extends Enum {
    readonly isInstantiated: boolean;
    readonly asInstantiated: {
      readonly deployer: AccountId32;
      readonly contract: AccountId32;
    } & Struct;
    readonly isTerminated: boolean;
    readonly asTerminated: {
      readonly contract: AccountId32;
      readonly beneficiary: AccountId32;
    } & Struct;
    readonly isCodeStored: boolean;
    readonly asCodeStored: {
      readonly codeHash: H256;
      readonly depositHeld: u128;
      readonly uploader: AccountId32;
    } & Struct;
    readonly isContractEmitted: boolean;
    readonly asContractEmitted: {
      readonly contract: AccountId32;
      readonly data: Bytes;
    } & Struct;
    readonly isCodeRemoved: boolean;
    readonly asCodeRemoved: {
      readonly codeHash: H256;
      readonly depositReleased: u128;
      readonly remover: AccountId32;
    } & Struct;
    readonly isContractCodeUpdated: boolean;
    readonly asContractCodeUpdated: {
      readonly contract: AccountId32;
      readonly newCodeHash: H256;
      readonly oldCodeHash: H256;
    } & Struct;
    readonly isCalled: boolean;
    readonly asCalled: {
      readonly caller: PalletContractsOrigin;
      readonly contract: AccountId32;
    } & Struct;
    readonly isDelegateCalled: boolean;
    readonly asDelegateCalled: {
      readonly contract: AccountId32;
      readonly codeHash: H256;
    } & Struct;
    readonly isStorageDepositTransferredAndHeld: boolean;
    readonly asStorageDepositTransferredAndHeld: {
      readonly from: AccountId32;
      readonly to: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isStorageDepositTransferredAndReleased: boolean;
    readonly asStorageDepositTransferredAndReleased: {
      readonly from: AccountId32;
      readonly to: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly type: 'Instantiated' | 'Terminated' | 'CodeStored' | 'ContractEmitted' | 'CodeRemoved' | 'ContractCodeUpdated' | 'Called' | 'DelegateCalled' | 'StorageDepositTransferredAndHeld' | 'StorageDepositTransferredAndReleased';
  }

  /** @name PalletContractsOrigin (71) */
  interface PalletContractsOrigin extends Enum {
    readonly isRoot: boolean;
    readonly isSigned: boolean;
    readonly asSigned: AccountId32;
    readonly type: 'Root' | 'Signed';
  }

  /** @name CordLoomRuntimeRuntime (72) */
  type CordLoomRuntimeRuntime = Null;

  /** @name PalletNetworkMembershipEvent (73) */
  interface PalletNetworkMembershipEvent extends Enum {
    readonly isMembershipAcquired: boolean;
    readonly asMembershipAcquired: {
      readonly member: AccountId32;
    } & Struct;
    readonly isMembershipExpired: boolean;
    readonly asMembershipExpired: {
      readonly member: AccountId32;
    } & Struct;
    readonly isMembershipRenewed: boolean;
    readonly asMembershipRenewed: {
      readonly member: AccountId32;
    } & Struct;
    readonly isMembershipRevoked: boolean;
    readonly asMembershipRevoked: {
      readonly member: AccountId32;
    } & Struct;
    readonly isMembershipRenewalRequested: boolean;
    readonly asMembershipRenewalRequested: {
      readonly member: AccountId32;
    } & Struct;
    readonly type: 'MembershipAcquired' | 'MembershipExpired' | 'MembershipRenewed' | 'MembershipRevoked' | 'MembershipRenewalRequested';
  }

  /** @name PalletDidEvent (74) */
  interface PalletDidEvent extends Enum {
    readonly isCreated: boolean;
    readonly asCreated: {
      readonly author: AccountId32;
      readonly identifier: AccountId32;
    } & Struct;
    readonly isUpdated: boolean;
    readonly asUpdated: {
      readonly identifier: AccountId32;
    } & Struct;
    readonly isDeleted: boolean;
    readonly asDeleted: {
      readonly identifier: AccountId32;
    } & Struct;
    readonly isCallDispatched: boolean;
    readonly asCallDispatched: {
      readonly identifier: AccountId32;
      readonly result: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly type: 'Created' | 'Updated' | 'Deleted' | 'CallDispatched';
  }

  /** @name PalletSchemaEvent (75) */
  interface PalletSchemaEvent extends Enum {
    readonly isCreated: boolean;
    readonly asCreated: {
      readonly identifier: Bytes;
      readonly creator: AccountId32;
    } & Struct;
    readonly type: 'Created';
  }

  /** @name PalletChainSpaceEvent (78) */
  interface PalletChainSpaceEvent extends Enum {
    readonly isAuthorization: boolean;
    readonly asAuthorization: {
      readonly space: Bytes;
      readonly authorization: Bytes;
      readonly delegate: AccountId32;
    } & Struct;
    readonly isDeauthorization: boolean;
    readonly asDeauthorization: {
      readonly space: Bytes;
      readonly authorization: Bytes;
    } & Struct;
    readonly isCreate: boolean;
    readonly asCreate: {
      readonly space: Bytes;
      readonly creator: AccountId32;
      readonly authorization: Bytes;
    } & Struct;
    readonly isApprove: boolean;
    readonly asApprove: {
      readonly space: Bytes;
    } & Struct;
    readonly isArchive: boolean;
    readonly asArchive: {
      readonly space: Bytes;
      readonly authority: AccountId32;
    } & Struct;
    readonly isRestore: boolean;
    readonly asRestore: {
      readonly space: Bytes;
      readonly authority: AccountId32;
    } & Struct;
    readonly isRevoke: boolean;
    readonly asRevoke: {
      readonly space: Bytes;
    } & Struct;
    readonly isApprovalRevoke: boolean;
    readonly asApprovalRevoke: {
      readonly space: Bytes;
    } & Struct;
    readonly isApprovalRestore: boolean;
    readonly asApprovalRestore: {
      readonly space: Bytes;
    } & Struct;
    readonly isUpdateCapacity: boolean;
    readonly asUpdateCapacity: {
      readonly space: Bytes;
    } & Struct;
    readonly isResetUsage: boolean;
    readonly asResetUsage: {
      readonly space: Bytes;
    } & Struct;
    readonly type: 'Authorization' | 'Deauthorization' | 'Create' | 'Approve' | 'Archive' | 'Restore' | 'Revoke' | 'ApprovalRevoke' | 'ApprovalRestore' | 'UpdateCapacity' | 'ResetUsage';
  }

  /** @name PalletStatementEvent (79) */
  interface PalletStatementEvent extends Enum {
    readonly isRegister: boolean;
    readonly asRegister: {
      readonly identifier: Bytes;
      readonly digest: H256;
      readonly author: AccountId32;
    } & Struct;
    readonly isUpdate: boolean;
    readonly asUpdate: {
      readonly identifier: Bytes;
      readonly digest: H256;
      readonly author: AccountId32;
    } & Struct;
    readonly isRevoke: boolean;
    readonly asRevoke: {
      readonly identifier: Bytes;
      readonly author: AccountId32;
    } & Struct;
    readonly isRestore: boolean;
    readonly asRestore: {
      readonly identifier: Bytes;
      readonly author: AccountId32;
    } & Struct;
    readonly isRemove: boolean;
    readonly asRemove: {
      readonly identifier: Bytes;
      readonly author: AccountId32;
    } & Struct;
    readonly isPartialRemoval: boolean;
    readonly asPartialRemoval: {
      readonly identifier: Bytes;
      readonly removed: u32;
      readonly author: AccountId32;
    } & Struct;
    readonly isPresentationAdded: boolean;
    readonly asPresentationAdded: {
      readonly identifier: Bytes;
      readonly digest: H256;
      readonly author: AccountId32;
    } & Struct;
    readonly isPresentationRemoved: boolean;
    readonly asPresentationRemoved: {
      readonly identifier: Bytes;
      readonly digest: H256;
      readonly author: AccountId32;
    } & Struct;
    readonly isRegisterBatch: boolean;
    readonly asRegisterBatch: {
      readonly successful: u32;
      readonly failed: u32;
      readonly indices: Vec<u16>;
      readonly author: AccountId32;
    } & Struct;
    readonly type: 'Register' | 'Update' | 'Revoke' | 'Restore' | 'Remove' | 'PartialRemoval' | 'PresentationAdded' | 'PresentationRemoved' | 'RegisterBatch';
  }

  /** @name PalletDidNameEvent (82) */
  interface PalletDidNameEvent extends Enum {
    readonly isDidNameRegistered: boolean;
    readonly asDidNameRegistered: {
      readonly owner: AccountId32;
      readonly name: Bytes;
    } & Struct;
    readonly isDidNameReleased: boolean;
    readonly asDidNameReleased: {
      readonly owner: AccountId32;
      readonly name: Bytes;
    } & Struct;
    readonly isDidNameBanned: boolean;
    readonly asDidNameBanned: {
      readonly name: Bytes;
    } & Struct;
    readonly isDidNameUnbanned: boolean;
    readonly asDidNameUnbanned: {
      readonly name: Bytes;
    } & Struct;
    readonly type: 'DidNameRegistered' | 'DidNameReleased' | 'DidNameBanned' | 'DidNameUnbanned';
  }

  /** @name PalletNetworkScoreEvent (85) */
  interface PalletNetworkScoreEvent extends Enum {
    readonly isRatingEntryAdded: boolean;
    readonly asRatingEntryAdded: {
      readonly identifier: Bytes;
      readonly entity: Bytes;
      readonly provider: AccountId32;
      readonly creator: AccountId32;
    } & Struct;
    readonly isRatingEntryRevoked: boolean;
    readonly asRatingEntryRevoked: {
      readonly identifier: Bytes;
      readonly entity: Bytes;
      readonly provider: AccountId32;
      readonly creator: AccountId32;
    } & Struct;
    readonly isRatingEntryRevised: boolean;
    readonly asRatingEntryRevised: {
      readonly identifier: Bytes;
      readonly entity: Bytes;
      readonly provider: AccountId32;
      readonly creator: AccountId32;
    } & Struct;
    readonly isAggregateScoreUpdated: boolean;
    readonly asAggregateScoreUpdated: {
      readonly entity: Bytes;
    } & Struct;
    readonly type: 'RatingEntryAdded' | 'RatingEntryRevoked' | 'RatingEntryRevised' | 'AggregateScoreUpdated';
  }

  /** @name PalletAssetConversionEvent (87) */
  interface PalletAssetConversionEvent extends Enum {
    readonly isPoolCreated: boolean;
    readonly asPoolCreated: {
      readonly creator: AccountId32;
      readonly poolId: ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]>;
      readonly poolAccount: AccountId32;
      readonly lpToken: u32;
    } & Struct;
    readonly isLiquidityAdded: boolean;
    readonly asLiquidityAdded: {
      readonly who: AccountId32;
      readonly mintTo: AccountId32;
      readonly poolId: ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]>;
      readonly amount1Provided: u128;
      readonly amount2Provided: u128;
      readonly lpToken: u32;
      readonly lpTokenMinted: u128;
    } & Struct;
    readonly isLiquidityRemoved: boolean;
    readonly asLiquidityRemoved: {
      readonly who: AccountId32;
      readonly withdrawTo: AccountId32;
      readonly poolId: ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]>;
      readonly amount1: u128;
      readonly amount2: u128;
      readonly lpToken: u32;
      readonly lpTokenBurned: u128;
      readonly withdrawalFee: Permill;
    } & Struct;
    readonly isSwapExecuted: boolean;
    readonly asSwapExecuted: {
      readonly who: AccountId32;
      readonly sendTo: AccountId32;
      readonly amountIn: u128;
      readonly amountOut: u128;
      readonly path: Vec<ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, u128]>>;
    } & Struct;
    readonly isSwapCreditExecuted: boolean;
    readonly asSwapCreditExecuted: {
      readonly amountIn: u128;
      readonly amountOut: u128;
      readonly path: Vec<ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, u128]>>;
    } & Struct;
    readonly isTouched: boolean;
    readonly asTouched: {
      readonly poolId: ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]>;
      readonly who: AccountId32;
    } & Struct;
    readonly type: 'PoolCreated' | 'LiquidityAdded' | 'LiquidityRemoved' | 'SwapExecuted' | 'SwapCreditExecuted' | 'Touched';
  }

  /** @name FrameSupportTokensFungibleUnionOfNativeOrWithId (89) */
  interface FrameSupportTokensFungibleUnionOfNativeOrWithId extends Enum {
    readonly isNative: boolean;
    readonly isWithId: boolean;
    readonly asWithId: u32;
    readonly type: 'Native' | 'WithId';
  }

  /** @name PalletRemarkEvent (93) */
  interface PalletRemarkEvent extends Enum {
    readonly isStored: boolean;
    readonly asStored: {
      readonly sender: AccountId32;
      readonly contentHash: H256;
    } & Struct;
    readonly type: 'Stored';
  }

  /** @name PalletRegistriesEvent (94) */
  interface PalletRegistriesEvent extends Enum {
    readonly isAuthorization: boolean;
    readonly asAuthorization: {
      readonly registryId: Bytes;
      readonly authorization: Bytes;
      readonly delegate: AccountId32;
    } & Struct;
    readonly isDeauthorization: boolean;
    readonly asDeauthorization: {
      readonly registryId: Bytes;
      readonly authorization: Bytes;
    } & Struct;
    readonly isCreate: boolean;
    readonly asCreate: {
      readonly registryId: Bytes;
      readonly creator: AccountId32;
      readonly authorization: Bytes;
    } & Struct;
    readonly isRevoke: boolean;
    readonly asRevoke: {
      readonly registryId: Bytes;
      readonly authority: AccountId32;
    } & Struct;
    readonly isReinstate: boolean;
    readonly asReinstate: {
      readonly registryId: Bytes;
      readonly authority: AccountId32;
    } & Struct;
    readonly isUpdate: boolean;
    readonly asUpdate: {
      readonly registryId: Bytes;
      readonly updater: AccountId32;
      readonly authorization: Bytes;
    } & Struct;
    readonly isArchive: boolean;
    readonly asArchive: {
      readonly registryId: Bytes;
      readonly authority: AccountId32;
    } & Struct;
    readonly isRestore: boolean;
    readonly asRestore: {
      readonly registryId: Bytes;
      readonly authority: AccountId32;
    } & Struct;
    readonly type: 'Authorization' | 'Deauthorization' | 'Create' | 'Revoke' | 'Reinstate' | 'Update' | 'Archive' | 'Restore';
  }

  /** @name PalletEntriesEvent (95) */
  interface PalletEntriesEvent extends Enum {
    readonly isRegistryEntryCreated: boolean;
    readonly asRegistryEntryCreated: {
      readonly creator: AccountId32;
      readonly registryId: Bytes;
      readonly registryEntryId: Bytes;
    } & Struct;
    readonly isRegistryEntryUpdated: boolean;
    readonly asRegistryEntryUpdated: {
      readonly updater: AccountId32;
      readonly registryEntryId: Bytes;
    } & Struct;
    readonly isRegistryEntryRevoked: boolean;
    readonly asRegistryEntryRevoked: {
      readonly updater: AccountId32;
      readonly registryEntryId: Bytes;
    } & Struct;
    readonly isRegistryEntryReinstated: boolean;
    readonly asRegistryEntryReinstated: {
      readonly updater: AccountId32;
      readonly registryEntryId: Bytes;
    } & Struct;
    readonly type: 'RegistryEntryCreated' | 'RegistryEntryUpdated' | 'RegistryEntryRevoked' | 'RegistryEntryReinstated';
  }

  /** @name PalletRootTestingEvent (96) */
  interface PalletRootTestingEvent extends Enum {
    readonly isDefensiveTestCall: boolean;
    readonly type: 'DefensiveTestCall';
  }

  /** @name PalletSudoEvent (97) */
  interface PalletSudoEvent extends Enum {
    readonly isSudid: boolean;
    readonly asSudid: {
      readonly sudoResult: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly isKeyChanged: boolean;
    readonly asKeyChanged: {
      readonly old: Option<AccountId32>;
      readonly new_: AccountId32;
    } & Struct;
    readonly isKeyRemoved: boolean;
    readonly isSudoAsDone: boolean;
    readonly asSudoAsDone: {
      readonly sudoResult: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly type: 'Sudid' | 'KeyChanged' | 'KeyRemoved' | 'SudoAsDone';
  }

  /** @name FrameSystemPhase (99) */
  interface FrameSystemPhase extends Enum {
    readonly isApplyExtrinsic: boolean;
    readonly asApplyExtrinsic: u32;
    readonly isFinalization: boolean;
    readonly isInitialization: boolean;
    readonly type: 'ApplyExtrinsic' | 'Finalization' | 'Initialization';
  }

  /** @name FrameSystemLastRuntimeUpgradeInfo (102) */
  interface FrameSystemLastRuntimeUpgradeInfo extends Struct {
    readonly specVersion: Compact<u32>;
    readonly specName: Text;
  }

  /** @name FrameSystemCodeUpgradeAuthorization (105) */
  interface FrameSystemCodeUpgradeAuthorization extends Struct {
    readonly codeHash: H256;
    readonly checkVersion: bool;
  }

  /** @name FrameSystemCall (106) */
  interface FrameSystemCall extends Enum {
    readonly isRemark: boolean;
    readonly asRemark: {
      readonly remark: Bytes;
    } & Struct;
    readonly isSetHeapPages: boolean;
    readonly asSetHeapPages: {
      readonly pages: u64;
    } & Struct;
    readonly isSetCode: boolean;
    readonly asSetCode: {
      readonly code: Bytes;
    } & Struct;
    readonly isSetCodeWithoutChecks: boolean;
    readonly asSetCodeWithoutChecks: {
      readonly code: Bytes;
    } & Struct;
    readonly isSetStorage: boolean;
    readonly asSetStorage: {
      readonly items: Vec<ITuple<[Bytes, Bytes]>>;
    } & Struct;
    readonly isKillStorage: boolean;
    readonly asKillStorage: {
      readonly keys_: Vec<Bytes>;
    } & Struct;
    readonly isKillPrefix: boolean;
    readonly asKillPrefix: {
      readonly prefix: Bytes;
      readonly subkeys: u32;
    } & Struct;
    readonly isRemarkWithEvent: boolean;
    readonly asRemarkWithEvent: {
      readonly remark: Bytes;
    } & Struct;
    readonly isAuthorizeUpgrade: boolean;
    readonly asAuthorizeUpgrade: {
      readonly codeHash: H256;
    } & Struct;
    readonly isAuthorizeUpgradeWithoutChecks: boolean;
    readonly asAuthorizeUpgradeWithoutChecks: {
      readonly codeHash: H256;
    } & Struct;
    readonly isApplyAuthorizedUpgrade: boolean;
    readonly asApplyAuthorizedUpgrade: {
      readonly code: Bytes;
    } & Struct;
    readonly type: 'Remark' | 'SetHeapPages' | 'SetCode' | 'SetCodeWithoutChecks' | 'SetStorage' | 'KillStorage' | 'KillPrefix' | 'RemarkWithEvent' | 'AuthorizeUpgrade' | 'AuthorizeUpgradeWithoutChecks' | 'ApplyAuthorizedUpgrade';
  }

  /** @name FrameSystemLimitsBlockWeights (110) */
  interface FrameSystemLimitsBlockWeights extends Struct {
    readonly baseBlock: SpWeightsWeightV2Weight;
    readonly maxBlock: SpWeightsWeightV2Weight;
    readonly perClass: FrameSupportDispatchPerDispatchClassWeightsPerClass;
  }

  /** @name FrameSupportDispatchPerDispatchClassWeightsPerClass (111) */
  interface FrameSupportDispatchPerDispatchClassWeightsPerClass extends Struct {
    readonly normal: FrameSystemLimitsWeightsPerClass;
    readonly operational: FrameSystemLimitsWeightsPerClass;
    readonly mandatory: FrameSystemLimitsWeightsPerClass;
  }

  /** @name FrameSystemLimitsWeightsPerClass (112) */
  interface FrameSystemLimitsWeightsPerClass extends Struct {
    readonly baseExtrinsic: SpWeightsWeightV2Weight;
    readonly maxExtrinsic: Option<SpWeightsWeightV2Weight>;
    readonly maxTotal: Option<SpWeightsWeightV2Weight>;
    readonly reserved: Option<SpWeightsWeightV2Weight>;
  }

  /** @name FrameSystemLimitsBlockLength (114) */
  interface FrameSystemLimitsBlockLength extends Struct {
    readonly max: FrameSupportDispatchPerDispatchClassU32;
  }

  /** @name FrameSupportDispatchPerDispatchClassU32 (115) */
  interface FrameSupportDispatchPerDispatchClassU32 extends Struct {
    readonly normal: u32;
    readonly operational: u32;
    readonly mandatory: u32;
  }

  /** @name SpWeightsRuntimeDbWeight (116) */
  interface SpWeightsRuntimeDbWeight extends Struct {
    readonly read: u64;
    readonly write: u64;
  }

  /** @name SpVersionRuntimeVersion (117) */
  interface SpVersionRuntimeVersion extends Struct {
    readonly specName: Text;
    readonly implName: Text;
    readonly authoringVersion: u32;
    readonly specVersion: u32;
    readonly implVersion: u32;
    readonly apis: Vec<ITuple<[U8aFixed, u32]>>;
    readonly transactionVersion: u32;
    readonly stateVersion: u8;
  }

  /** @name FrameSystemError (122) */
  interface FrameSystemError extends Enum {
    readonly isInvalidSpecName: boolean;
    readonly isSpecVersionNeedsToIncrease: boolean;
    readonly isFailedToExtractRuntimeVersion: boolean;
    readonly isNonDefaultComposite: boolean;
    readonly isNonZeroRefCount: boolean;
    readonly isCallFiltered: boolean;
    readonly isMultiBlockMigrationsOngoing: boolean;
    readonly isNothingAuthorized: boolean;
    readonly isUnauthorized: boolean;
    readonly type: 'InvalidSpecName' | 'SpecVersionNeedsToIncrease' | 'FailedToExtractRuntimeVersion' | 'NonDefaultComposite' | 'NonZeroRefCount' | 'CallFiltered' | 'MultiBlockMigrationsOngoing' | 'NothingAuthorized' | 'Unauthorized';
  }

  /** @name PalletUtilityCall (123) */
  interface PalletUtilityCall extends Enum {
    readonly isBatch: boolean;
    readonly asBatch: {
      readonly calls: Vec<Call>;
    } & Struct;
    readonly isAsDerivative: boolean;
    readonly asAsDerivative: {
      readonly index: u16;
      readonly call: Call;
    } & Struct;
    readonly isBatchAll: boolean;
    readonly asBatchAll: {
      readonly calls: Vec<Call>;
    } & Struct;
    readonly isDispatchAs: boolean;
    readonly asDispatchAs: {
      readonly asOrigin: CordLoomRuntimeOriginCaller;
      readonly call: Call;
    } & Struct;
    readonly isForceBatch: boolean;
    readonly asForceBatch: {
      readonly calls: Vec<Call>;
    } & Struct;
    readonly isWithWeight: boolean;
    readonly asWithWeight: {
      readonly call: Call;
      readonly weight: SpWeightsWeightV2Weight;
    } & Struct;
    readonly type: 'Batch' | 'AsDerivative' | 'BatchAll' | 'DispatchAs' | 'ForceBatch' | 'WithWeight';
  }

  /** @name PalletBabeCall (126) */
  interface PalletBabeCall extends Enum {
    readonly isReportEquivocation: boolean;
    readonly asReportEquivocation: {
      readonly equivocationProof: SpConsensusSlotsEquivocationProof;
      readonly keyOwnerProof: SpSessionMembershipProof;
    } & Struct;
    readonly isReportEquivocationUnsigned: boolean;
    readonly asReportEquivocationUnsigned: {
      readonly equivocationProof: SpConsensusSlotsEquivocationProof;
      readonly keyOwnerProof: SpSessionMembershipProof;
    } & Struct;
    readonly isPlanConfigChange: boolean;
    readonly asPlanConfigChange: {
      readonly config: SpConsensusBabeDigestsNextConfigDescriptor;
    } & Struct;
    readonly type: 'ReportEquivocation' | 'ReportEquivocationUnsigned' | 'PlanConfigChange';
  }

  /** @name SpConsensusSlotsEquivocationProof (127) */
  interface SpConsensusSlotsEquivocationProof extends Struct {
    readonly offender: SpConsensusBabeAppPublic;
    readonly slot: u64;
    readonly firstHeader: SpRuntimeHeader;
    readonly secondHeader: SpRuntimeHeader;
  }

  /** @name SpRuntimeHeader (128) */
  interface SpRuntimeHeader extends Struct {
    readonly parentHash: H256;
    readonly number: Compact<u32>;
    readonly stateRoot: H256;
    readonly extrinsicsRoot: H256;
    readonly digest: SpRuntimeDigest;
  }

  /** @name SpConsensusBabeAppPublic (129) */
  interface SpConsensusBabeAppPublic extends U8aFixed {}

  /** @name SpSessionMembershipProof (131) */
  interface SpSessionMembershipProof extends Struct {
    readonly session: u32;
    readonly trieNodes: Vec<Bytes>;
    readonly validatorCount: u32;
  }

  /** @name SpConsensusBabeDigestsNextConfigDescriptor (132) */
  interface SpConsensusBabeDigestsNextConfigDescriptor extends Enum {
    readonly isV1: boolean;
    readonly asV1: {
      readonly c: ITuple<[u64, u64]>;
      readonly allowedSlots: SpConsensusBabeAllowedSlots;
    } & Struct;
    readonly type: 'V1';
  }

  /** @name SpConsensusBabeAllowedSlots (134) */
  interface SpConsensusBabeAllowedSlots extends Enum {
    readonly isPrimarySlots: boolean;
    readonly isPrimaryAndSecondaryPlainSlots: boolean;
    readonly isPrimaryAndSecondaryVRFSlots: boolean;
    readonly type: 'PrimarySlots' | 'PrimaryAndSecondaryPlainSlots' | 'PrimaryAndSecondaryVRFSlots';
  }

  /** @name PalletTimestampCall (135) */
  interface PalletTimestampCall extends Enum {
    readonly isSet: boolean;
    readonly asSet: {
      readonly now: Compact<u64>;
    } & Struct;
    readonly type: 'Set';
  }

  /** @name AuthorityMembershipCall (136) */
  interface AuthorityMembershipCall extends Enum {
    readonly isNominate: boolean;
    readonly asNominate: {
      readonly candidate: AccountId32;
    } & Struct;
    readonly isRemove: boolean;
    readonly asRemove: {
      readonly candidate: AccountId32;
    } & Struct;
    readonly isRemoveMemberFromBlacklist: boolean;
    readonly asRemoveMemberFromBlacklist: {
      readonly candidate: AccountId32;
    } & Struct;
    readonly isGoOffline: boolean;
    readonly isGoOnline: boolean;
    readonly type: 'Nominate' | 'Remove' | 'RemoveMemberFromBlacklist' | 'GoOffline' | 'GoOnline';
  }

  /** @name PalletIndicesCall (137) */
  interface PalletIndicesCall extends Enum {
    readonly isClaim: boolean;
    readonly asClaim: {
      readonly index: u32;
    } & Struct;
    readonly isTransfer: boolean;
    readonly asTransfer: {
      readonly new_: MultiAddress;
      readonly index: u32;
    } & Struct;
    readonly isFree: boolean;
    readonly asFree: {
      readonly index: u32;
    } & Struct;
    readonly isForceTransfer: boolean;
    readonly asForceTransfer: {
      readonly new_: MultiAddress;
      readonly index: u32;
      readonly freeze: bool;
    } & Struct;
    readonly isFreeze: boolean;
    readonly asFreeze: {
      readonly index: u32;
    } & Struct;
    readonly type: 'Claim' | 'Transfer' | 'Free' | 'ForceTransfer' | 'Freeze';
  }

  /** @name PalletBalancesCall (141) */
  interface PalletBalancesCall extends Enum {
    readonly isTransferAllowDeath: boolean;
    readonly asTransferAllowDeath: {
      readonly dest: MultiAddress;
      readonly value: Compact<u128>;
    } & Struct;
    readonly isForceTransfer: boolean;
    readonly asForceTransfer: {
      readonly source: MultiAddress;
      readonly dest: MultiAddress;
      readonly value: Compact<u128>;
    } & Struct;
    readonly isTransferKeepAlive: boolean;
    readonly asTransferKeepAlive: {
      readonly dest: MultiAddress;
      readonly value: Compact<u128>;
    } & Struct;
    readonly isTransferAll: boolean;
    readonly asTransferAll: {
      readonly dest: MultiAddress;
      readonly keepAlive: bool;
    } & Struct;
    readonly isForceUnreserve: boolean;
    readonly asForceUnreserve: {
      readonly who: MultiAddress;
      readonly amount: u128;
    } & Struct;
    readonly isUpgradeAccounts: boolean;
    readonly asUpgradeAccounts: {
      readonly who: Vec<AccountId32>;
    } & Struct;
    readonly isForceSetBalance: boolean;
    readonly asForceSetBalance: {
      readonly who: MultiAddress;
      readonly newFree: Compact<u128>;
    } & Struct;
    readonly isForceAdjustTotalIssuance: boolean;
    readonly asForceAdjustTotalIssuance: {
      readonly direction: PalletBalancesAdjustmentDirection;
      readonly delta: Compact<u128>;
    } & Struct;
    readonly isBurn: boolean;
    readonly asBurn: {
      readonly value: Compact<u128>;
      readonly keepAlive: bool;
    } & Struct;
    readonly type: 'TransferAllowDeath' | 'ForceTransfer' | 'TransferKeepAlive' | 'TransferAll' | 'ForceUnreserve' | 'UpgradeAccounts' | 'ForceSetBalance' | 'ForceAdjustTotalIssuance' | 'Burn';
  }

  /** @name PalletBalancesAdjustmentDirection (143) */
  interface PalletBalancesAdjustmentDirection extends Enum {
    readonly isIncrease: boolean;
    readonly isDecrease: boolean;
    readonly type: 'Increase' | 'Decrease';
  }

  /** @name PalletSessionCall (144) */
  interface PalletSessionCall extends Enum {
    readonly isSetKeys: boolean;
    readonly asSetKeys: {
      readonly keys_: CordLoomRuntimeSessionKeys;
      readonly proof: Bytes;
    } & Struct;
    readonly isPurgeKeys: boolean;
    readonly type: 'SetKeys' | 'PurgeKeys';
  }

  /** @name CordLoomRuntimeSessionKeys (145) */
  interface CordLoomRuntimeSessionKeys extends Struct {
    readonly grandpa: SpConsensusGrandpaAppPublic;
    readonly babe: SpConsensusBabeAppPublic;
    readonly imOnline: PalletImOnlineSr25519AppSr25519Public;
    readonly authorityDiscovery: SpAuthorityDiscoveryAppPublic;
  }

  /** @name SpAuthorityDiscoveryAppPublic (146) */
  interface SpAuthorityDiscoveryAppPublic extends U8aFixed {}

  /** @name PalletTreasuryCall (147) */
  interface PalletTreasuryCall extends Enum {
    readonly isSpendLocal: boolean;
    readonly asSpendLocal: {
      readonly amount: Compact<u128>;
      readonly beneficiary: MultiAddress;
    } & Struct;
    readonly isRemoveApproval: boolean;
    readonly asRemoveApproval: {
      readonly proposalId: Compact<u32>;
    } & Struct;
    readonly isSpend: boolean;
    readonly asSpend: {
      readonly assetKind: Null;
      readonly amount: Compact<u128>;
      readonly beneficiary: MultiAddress;
      readonly validFrom: Option<u32>;
    } & Struct;
    readonly isPayout: boolean;
    readonly asPayout: {
      readonly index: u32;
    } & Struct;
    readonly isCheckStatus: boolean;
    readonly asCheckStatus: {
      readonly index: u32;
    } & Struct;
    readonly isVoidSpend: boolean;
    readonly asVoidSpend: {
      readonly index: u32;
    } & Struct;
    readonly type: 'SpendLocal' | 'RemoveApproval' | 'Spend' | 'Payout' | 'CheckStatus' | 'VoidSpend';
  }

  /** @name PalletCollectiveCall (150) */
  interface PalletCollectiveCall extends Enum {
    readonly isSetMembers: boolean;
    readonly asSetMembers: {
      readonly newMembers: Vec<AccountId32>;
      readonly prime: Option<AccountId32>;
      readonly oldCount: u32;
    } & Struct;
    readonly isExecute: boolean;
    readonly asExecute: {
      readonly proposal: Call;
      readonly lengthBound: Compact<u32>;
    } & Struct;
    readonly isPropose: boolean;
    readonly asPropose: {
      readonly threshold: Compact<u32>;
      readonly proposal: Call;
      readonly lengthBound: Compact<u32>;
    } & Struct;
    readonly isVote: boolean;
    readonly asVote: {
      readonly proposal: H256;
      readonly index: Compact<u32>;
      readonly approve: bool;
    } & Struct;
    readonly isDisapproveProposal: boolean;
    readonly asDisapproveProposal: {
      readonly proposalHash: H256;
    } & Struct;
    readonly isClose: boolean;
    readonly asClose: {
      readonly proposalHash: H256;
      readonly index: Compact<u32>;
      readonly proposalWeightBound: SpWeightsWeightV2Weight;
      readonly lengthBound: Compact<u32>;
    } & Struct;
    readonly type: 'SetMembers' | 'Execute' | 'Propose' | 'Vote' | 'DisapproveProposal' | 'Close';
  }

  /** @name PalletMembershipCall (151) */
  interface PalletMembershipCall extends Enum {
    readonly isAddMember: boolean;
    readonly asAddMember: {
      readonly who: MultiAddress;
    } & Struct;
    readonly isRemoveMember: boolean;
    readonly asRemoveMember: {
      readonly who: MultiAddress;
    } & Struct;
    readonly isSwapMember: boolean;
    readonly asSwapMember: {
      readonly remove: MultiAddress;
      readonly add: MultiAddress;
    } & Struct;
    readonly isResetMembers: boolean;
    readonly asResetMembers: {
      readonly members: Vec<AccountId32>;
    } & Struct;
    readonly isChangeKey: boolean;
    readonly asChangeKey: {
      readonly new_: MultiAddress;
    } & Struct;
    readonly isSetPrime: boolean;
    readonly asSetPrime: {
      readonly who: MultiAddress;
    } & Struct;
    readonly isClearPrime: boolean;
    readonly type: 'AddMember' | 'RemoveMember' | 'SwapMember' | 'ResetMembers' | 'ChangeKey' | 'SetPrime' | 'ClearPrime';
  }

  /** @name PalletGrandpaCall (154) */
  interface PalletGrandpaCall extends Enum {
    readonly isReportEquivocation: boolean;
    readonly asReportEquivocation: {
      readonly equivocationProof: SpConsensusGrandpaEquivocationProof;
      readonly keyOwnerProof: SpSessionMembershipProof;
    } & Struct;
    readonly isReportEquivocationUnsigned: boolean;
    readonly asReportEquivocationUnsigned: {
      readonly equivocationProof: SpConsensusGrandpaEquivocationProof;
      readonly keyOwnerProof: SpSessionMembershipProof;
    } & Struct;
    readonly isNoteStalled: boolean;
    readonly asNoteStalled: {
      readonly delay: u32;
      readonly bestFinalizedBlockNumber: u32;
    } & Struct;
    readonly type: 'ReportEquivocation' | 'ReportEquivocationUnsigned' | 'NoteStalled';
  }

  /** @name SpConsensusGrandpaEquivocationProof (155) */
  interface SpConsensusGrandpaEquivocationProof extends Struct {
    readonly setId: u64;
    readonly equivocation: SpConsensusGrandpaEquivocation;
  }

  /** @name SpConsensusGrandpaEquivocation (156) */
  interface SpConsensusGrandpaEquivocation extends Enum {
    readonly isPrevote: boolean;
    readonly asPrevote: FinalityGrandpaEquivocationPrevote;
    readonly isPrecommit: boolean;
    readonly asPrecommit: FinalityGrandpaEquivocationPrecommit;
    readonly type: 'Prevote' | 'Precommit';
  }

  /** @name FinalityGrandpaEquivocationPrevote (157) */
  interface FinalityGrandpaEquivocationPrevote extends Struct {
    readonly roundNumber: u64;
    readonly identity: SpConsensusGrandpaAppPublic;
    readonly first: ITuple<[FinalityGrandpaPrevote, SpConsensusGrandpaAppSignature]>;
    readonly second: ITuple<[FinalityGrandpaPrevote, SpConsensusGrandpaAppSignature]>;
  }

  /** @name FinalityGrandpaPrevote (158) */
  interface FinalityGrandpaPrevote extends Struct {
    readonly targetHash: H256;
    readonly targetNumber: u32;
  }

  /** @name SpConsensusGrandpaAppSignature (159) */
  interface SpConsensusGrandpaAppSignature extends U8aFixed {}

  /** @name FinalityGrandpaEquivocationPrecommit (162) */
  interface FinalityGrandpaEquivocationPrecommit extends Struct {
    readonly roundNumber: u64;
    readonly identity: SpConsensusGrandpaAppPublic;
    readonly first: ITuple<[FinalityGrandpaPrecommit, SpConsensusGrandpaAppSignature]>;
    readonly second: ITuple<[FinalityGrandpaPrecommit, SpConsensusGrandpaAppSignature]>;
  }

  /** @name FinalityGrandpaPrecommit (163) */
  interface FinalityGrandpaPrecommit extends Struct {
    readonly targetHash: H256;
    readonly targetNumber: u32;
  }

  /** @name PalletImOnlineCall (165) */
  interface PalletImOnlineCall extends Enum {
    readonly isHeartbeat: boolean;
    readonly asHeartbeat: {
      readonly heartbeat: PalletImOnlineHeartbeat;
      readonly signature: PalletImOnlineSr25519AppSr25519Signature;
    } & Struct;
    readonly type: 'Heartbeat';
  }

  /** @name PalletImOnlineHeartbeat (166) */
  interface PalletImOnlineHeartbeat extends Struct {
    readonly blockNumber: u32;
    readonly sessionIndex: u32;
    readonly authorityIndex: u32;
    readonly validatorsLen: u32;
  }

  /** @name PalletImOnlineSr25519AppSr25519Signature (167) */
  interface PalletImOnlineSr25519AppSr25519Signature extends U8aFixed {}

  /** @name PalletIdentityCall (168) */
  interface PalletIdentityCall extends Enum {
    readonly isAddRegistrar: boolean;
    readonly asAddRegistrar: {
      readonly account: MultiAddress;
    } & Struct;
    readonly isSetIdentity: boolean;
    readonly asSetIdentity: {
      readonly info: PalletIdentityLegacyIdentityInfo;
    } & Struct;
    readonly isSetSubs: boolean;
    readonly asSetSubs: {
      readonly subs: Vec<ITuple<[AccountId32, Data]>>;
    } & Struct;
    readonly isClearIdentity: boolean;
    readonly isRequestJudgement: boolean;
    readonly asRequestJudgement: {
      readonly registrar: AccountId32;
    } & Struct;
    readonly isCancelRequest: boolean;
    readonly asCancelRequest: {
      readonly registrar: AccountId32;
    } & Struct;
    readonly isSetAccountId: boolean;
    readonly asSetAccountId: {
      readonly new_: MultiAddress;
    } & Struct;
    readonly isSetFields: boolean;
    readonly asSetFields: {
      readonly fields: u64;
    } & Struct;
    readonly isProvideJudgement: boolean;
    readonly asProvideJudgement: {
      readonly target: MultiAddress;
      readonly judgement: PalletIdentityJudgement;
      readonly identity: H256;
    } & Struct;
    readonly isKillIdentity: boolean;
    readonly asKillIdentity: {
      readonly target: MultiAddress;
    } & Struct;
    readonly isAddSub: boolean;
    readonly asAddSub: {
      readonly sub: MultiAddress;
      readonly data: Data;
    } & Struct;
    readonly isRenameSub: boolean;
    readonly asRenameSub: {
      readonly sub: MultiAddress;
      readonly data: Data;
    } & Struct;
    readonly isRemoveSub: boolean;
    readonly asRemoveSub: {
      readonly sub: MultiAddress;
    } & Struct;
    readonly isQuitSub: boolean;
    readonly isAddUsernameAuthority: boolean;
    readonly asAddUsernameAuthority: {
      readonly authority: MultiAddress;
      readonly suffix: Bytes;
      readonly allocation: u32;
    } & Struct;
    readonly isRemoveUsernameAuthority: boolean;
    readonly asRemoveUsernameAuthority: {
      readonly authority: MultiAddress;
    } & Struct;
    readonly isSetUsernameFor: boolean;
    readonly asSetUsernameFor: {
      readonly who: MultiAddress;
      readonly username: Bytes;
      readonly signature: Option<SpRuntimeMultiSignature>;
    } & Struct;
    readonly isAcceptUsername: boolean;
    readonly asAcceptUsername: {
      readonly username: Bytes;
    } & Struct;
    readonly isRemoveExpiredApproval: boolean;
    readonly asRemoveExpiredApproval: {
      readonly username: Bytes;
    } & Struct;
    readonly isSetPrimaryUsername: boolean;
    readonly asSetPrimaryUsername: {
      readonly username: Bytes;
    } & Struct;
    readonly isRemoveDanglingUsername: boolean;
    readonly asRemoveDanglingUsername: {
      readonly username: Bytes;
    } & Struct;
    readonly isRemoveRegistrar: boolean;
    readonly asRemoveRegistrar: {
      readonly account: MultiAddress;
    } & Struct;
    readonly type: 'AddRegistrar' | 'SetIdentity' | 'SetSubs' | 'ClearIdentity' | 'RequestJudgement' | 'CancelRequest' | 'SetAccountId' | 'SetFields' | 'ProvideJudgement' | 'KillIdentity' | 'AddSub' | 'RenameSub' | 'RemoveSub' | 'QuitSub' | 'AddUsernameAuthority' | 'RemoveUsernameAuthority' | 'SetUsernameFor' | 'AcceptUsername' | 'RemoveExpiredApproval' | 'SetPrimaryUsername' | 'RemoveDanglingUsername' | 'RemoveRegistrar';
  }

  /** @name PalletIdentityLegacyIdentityInfo (169) */
  interface PalletIdentityLegacyIdentityInfo extends Struct {
    readonly additional: Vec<ITuple<[Data, Data]>>;
    readonly display: Data;
    readonly legal: Data;
    readonly web: Data;
    readonly email: Data;
    readonly image: Data;
  }

  /** @name PalletIdentityJudgement (204) */
  interface PalletIdentityJudgement extends Enum {
    readonly isUnknown: boolean;
    readonly isRequested: boolean;
    readonly isReasonable: boolean;
    readonly isKnownGood: boolean;
    readonly isOutOfDate: boolean;
    readonly isLowQuality: boolean;
    readonly isErroneous: boolean;
    readonly type: 'Unknown' | 'Requested' | 'Reasonable' | 'KnownGood' | 'OutOfDate' | 'LowQuality' | 'Erroneous';
  }

  /** @name SpRuntimeMultiSignature (206) */
  interface SpRuntimeMultiSignature extends Enum {
    readonly isEd25519: boolean;
    readonly asEd25519: U8aFixed;
    readonly isSr25519: boolean;
    readonly asSr25519: U8aFixed;
    readonly isEcdsa: boolean;
    readonly asEcdsa: U8aFixed;
    readonly type: 'Ed25519' | 'Sr25519' | 'Ecdsa';
  }

  /** @name PalletSchedulerCall (208) */
  interface PalletSchedulerCall extends Enum {
    readonly isSchedule: boolean;
    readonly asSchedule: {
      readonly when: u32;
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>;
      readonly priority: u8;
      readonly call: Call;
    } & Struct;
    readonly isCancel: boolean;
    readonly asCancel: {
      readonly when: u32;
      readonly index: u32;
    } & Struct;
    readonly isScheduleNamed: boolean;
    readonly asScheduleNamed: {
      readonly id: U8aFixed;
      readonly when: u32;
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>;
      readonly priority: u8;
      readonly call: Call;
    } & Struct;
    readonly isCancelNamed: boolean;
    readonly asCancelNamed: {
      readonly id: U8aFixed;
    } & Struct;
    readonly isScheduleAfter: boolean;
    readonly asScheduleAfter: {
      readonly after: u32;
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>;
      readonly priority: u8;
      readonly call: Call;
    } & Struct;
    readonly isScheduleNamedAfter: boolean;
    readonly asScheduleNamedAfter: {
      readonly id: U8aFixed;
      readonly after: u32;
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>;
      readonly priority: u8;
      readonly call: Call;
    } & Struct;
    readonly isSetRetry: boolean;
    readonly asSetRetry: {
      readonly task: ITuple<[u32, u32]>;
      readonly retries: u8;
      readonly period: u32;
    } & Struct;
    readonly isSetRetryNamed: boolean;
    readonly asSetRetryNamed: {
      readonly id: U8aFixed;
      readonly retries: u8;
      readonly period: u32;
    } & Struct;
    readonly isCancelRetry: boolean;
    readonly asCancelRetry: {
      readonly task: ITuple<[u32, u32]>;
    } & Struct;
    readonly isCancelRetryNamed: boolean;
    readonly asCancelRetryNamed: {
      readonly id: U8aFixed;
    } & Struct;
    readonly type: 'Schedule' | 'Cancel' | 'ScheduleNamed' | 'CancelNamed' | 'ScheduleAfter' | 'ScheduleNamedAfter' | 'SetRetry' | 'SetRetryNamed' | 'CancelRetry' | 'CancelRetryNamed';
  }

  /** @name PalletPreimageCall (210) */
  interface PalletPreimageCall extends Enum {
    readonly isNotePreimage: boolean;
    readonly asNotePreimage: {
      readonly bytes: Bytes;
    } & Struct;
    readonly isUnnotePreimage: boolean;
    readonly asUnnotePreimage: {
      readonly hash_: H256;
    } & Struct;
    readonly isRequestPreimage: boolean;
    readonly asRequestPreimage: {
      readonly hash_: H256;
    } & Struct;
    readonly isUnrequestPreimage: boolean;
    readonly asUnrequestPreimage: {
      readonly hash_: H256;
    } & Struct;
    readonly isEnsureUpdated: boolean;
    readonly asEnsureUpdated: {
      readonly hashes: Vec<H256>;
    } & Struct;
    readonly type: 'NotePreimage' | 'UnnotePreimage' | 'RequestPreimage' | 'UnrequestPreimage' | 'EnsureUpdated';
  }

  /** @name PalletMultisigCall (211) */
  interface PalletMultisigCall extends Enum {
    readonly isAsMultiThreshold1: boolean;
    readonly asAsMultiThreshold1: {
      readonly otherSignatories: Vec<AccountId32>;
      readonly call: Call;
    } & Struct;
    readonly isAsMulti: boolean;
    readonly asAsMulti: {
      readonly threshold: u16;
      readonly otherSignatories: Vec<AccountId32>;
      readonly maybeTimepoint: Option<PalletMultisigTimepoint>;
      readonly call: Call;
      readonly maxWeight: SpWeightsWeightV2Weight;
    } & Struct;
    readonly isApproveAsMulti: boolean;
    readonly asApproveAsMulti: {
      readonly threshold: u16;
      readonly otherSignatories: Vec<AccountId32>;
      readonly maybeTimepoint: Option<PalletMultisigTimepoint>;
      readonly callHash: U8aFixed;
      readonly maxWeight: SpWeightsWeightV2Weight;
    } & Struct;
    readonly isCancelAsMulti: boolean;
    readonly asCancelAsMulti: {
      readonly threshold: u16;
      readonly otherSignatories: Vec<AccountId32>;
      readonly timepoint: PalletMultisigTimepoint;
      readonly callHash: U8aFixed;
    } & Struct;
    readonly type: 'AsMultiThreshold1' | 'AsMulti' | 'ApproveAsMulti' | 'CancelAsMulti';
  }

  /** @name PalletNodeAuthorizationCall (213) */
  interface PalletNodeAuthorizationCall extends Enum {
    readonly isAddWellKnownNode: boolean;
    readonly asAddWellKnownNode: {
      readonly nodeId: Bytes;
      readonly owner: MultiAddress;
    } & Struct;
    readonly isRemoveWellKnownNode: boolean;
    readonly asRemoveWellKnownNode: {
      readonly nodeId: Bytes;
    } & Struct;
    readonly isSwapWellKnownNode: boolean;
    readonly asSwapWellKnownNode: {
      readonly removeId: Bytes;
      readonly addId: Bytes;
    } & Struct;
    readonly isTransferNode: boolean;
    readonly asTransferNode: {
      readonly nodeId: Bytes;
      readonly owner: MultiAddress;
    } & Struct;
    readonly isAddConnection: boolean;
    readonly asAddConnection: {
      readonly nodeId: Bytes;
      readonly connectionId: Bytes;
    } & Struct;
    readonly isRemoveConnection: boolean;
    readonly asRemoveConnection: {
      readonly nodeId: Bytes;
      readonly connectionId: Bytes;
    } & Struct;
    readonly type: 'AddWellKnownNode' | 'RemoveWellKnownNode' | 'SwapWellKnownNode' | 'TransferNode' | 'AddConnection' | 'RemoveConnection';
  }

  /** @name PalletRuntimeUpgradeCall (214) */
  interface PalletRuntimeUpgradeCall extends Enum {
    readonly isSetCode: boolean;
    readonly asSetCode: {
      readonly code: Bytes;
    } & Struct;
    readonly type: 'SetCode';
  }

  /** @name PalletAssetsCall (215) */
  interface PalletAssetsCall extends Enum {
    readonly isCreate: boolean;
    readonly asCreate: {
      readonly id: Compact<u32>;
      readonly admin: MultiAddress;
      readonly minBalance: u128;
    } & Struct;
    readonly isForceCreate: boolean;
    readonly asForceCreate: {
      readonly id: Compact<u32>;
      readonly owner: MultiAddress;
      readonly isSufficient: bool;
      readonly minBalance: Compact<u128>;
    } & Struct;
    readonly isStartDestroy: boolean;
    readonly asStartDestroy: {
      readonly id: Compact<u32>;
    } & Struct;
    readonly isDestroyAccounts: boolean;
    readonly asDestroyAccounts: {
      readonly id: Compact<u32>;
    } & Struct;
    readonly isDestroyApprovals: boolean;
    readonly asDestroyApprovals: {
      readonly id: Compact<u32>;
    } & Struct;
    readonly isFinishDestroy: boolean;
    readonly asFinishDestroy: {
      readonly id: Compact<u32>;
    } & Struct;
    readonly isMint: boolean;
    readonly asMint: {
      readonly id: Compact<u32>;
      readonly beneficiary: MultiAddress;
      readonly amount: Compact<u128>;
    } & Struct;
    readonly isBurn: boolean;
    readonly asBurn: {
      readonly id: Compact<u32>;
      readonly who: MultiAddress;
      readonly amount: Compact<u128>;
    } & Struct;
    readonly isTransfer: boolean;
    readonly asTransfer: {
      readonly id: Compact<u32>;
      readonly target: MultiAddress;
      readonly amount: Compact<u128>;
    } & Struct;
    readonly isTransferKeepAlive: boolean;
    readonly asTransferKeepAlive: {
      readonly id: Compact<u32>;
      readonly target: MultiAddress;
      readonly amount: Compact<u128>;
    } & Struct;
    readonly isForceTransfer: boolean;
    readonly asForceTransfer: {
      readonly id: Compact<u32>;
      readonly source: MultiAddress;
      readonly dest: MultiAddress;
      readonly amount: Compact<u128>;
    } & Struct;
    readonly isFreeze: boolean;
    readonly asFreeze: {
      readonly id: Compact<u32>;
      readonly who: MultiAddress;
    } & Struct;
    readonly isThaw: boolean;
    readonly asThaw: {
      readonly id: Compact<u32>;
      readonly who: MultiAddress;
    } & Struct;
    readonly isFreezeAsset: boolean;
    readonly asFreezeAsset: {
      readonly id: Compact<u32>;
    } & Struct;
    readonly isThawAsset: boolean;
    readonly asThawAsset: {
      readonly id: Compact<u32>;
    } & Struct;
    readonly isTransferOwnership: boolean;
    readonly asTransferOwnership: {
      readonly id: Compact<u32>;
      readonly owner: MultiAddress;
    } & Struct;
    readonly isSetTeam: boolean;
    readonly asSetTeam: {
      readonly id: Compact<u32>;
      readonly issuer: MultiAddress;
      readonly admin: MultiAddress;
      readonly freezer: MultiAddress;
    } & Struct;
    readonly isSetMetadata: boolean;
    readonly asSetMetadata: {
      readonly id: Compact<u32>;
      readonly name: Bytes;
      readonly symbol: Bytes;
      readonly decimals: u8;
    } & Struct;
    readonly isClearMetadata: boolean;
    readonly asClearMetadata: {
      readonly id: Compact<u32>;
    } & Struct;
    readonly isForceSetMetadata: boolean;
    readonly asForceSetMetadata: {
      readonly id: Compact<u32>;
      readonly name: Bytes;
      readonly symbol: Bytes;
      readonly decimals: u8;
      readonly isFrozen: bool;
    } & Struct;
    readonly isForceClearMetadata: boolean;
    readonly asForceClearMetadata: {
      readonly id: Compact<u32>;
    } & Struct;
    readonly isForceAssetStatus: boolean;
    readonly asForceAssetStatus: {
      readonly id: Compact<u32>;
      readonly owner: MultiAddress;
      readonly issuer: MultiAddress;
      readonly admin: MultiAddress;
      readonly freezer: MultiAddress;
      readonly minBalance: Compact<u128>;
      readonly isSufficient: bool;
      readonly isFrozen: bool;
    } & Struct;
    readonly isApproveTransfer: boolean;
    readonly asApproveTransfer: {
      readonly id: Compact<u32>;
      readonly delegate: MultiAddress;
      readonly amount: Compact<u128>;
    } & Struct;
    readonly isCancelApproval: boolean;
    readonly asCancelApproval: {
      readonly id: Compact<u32>;
      readonly delegate: MultiAddress;
    } & Struct;
    readonly isForceCancelApproval: boolean;
    readonly asForceCancelApproval: {
      readonly id: Compact<u32>;
      readonly owner: MultiAddress;
      readonly delegate: MultiAddress;
    } & Struct;
    readonly isTransferApproved: boolean;
    readonly asTransferApproved: {
      readonly id: Compact<u32>;
      readonly owner: MultiAddress;
      readonly destination: MultiAddress;
      readonly amount: Compact<u128>;
    } & Struct;
    readonly isTouch: boolean;
    readonly asTouch: {
      readonly id: Compact<u32>;
    } & Struct;
    readonly isRefund: boolean;
    readonly asRefund: {
      readonly id: Compact<u32>;
      readonly allowBurn: bool;
    } & Struct;
    readonly isSetMinBalance: boolean;
    readonly asSetMinBalance: {
      readonly id: Compact<u32>;
      readonly minBalance: u128;
    } & Struct;
    readonly isTouchOther: boolean;
    readonly asTouchOther: {
      readonly id: Compact<u32>;
      readonly who: MultiAddress;
    } & Struct;
    readonly isRefundOther: boolean;
    readonly asRefundOther: {
      readonly id: Compact<u32>;
      readonly who: MultiAddress;
    } & Struct;
    readonly isBlock: boolean;
    readonly asBlock: {
      readonly id: Compact<u32>;
      readonly who: MultiAddress;
    } & Struct;
    readonly type: 'Create' | 'ForceCreate' | 'StartDestroy' | 'DestroyAccounts' | 'DestroyApprovals' | 'FinishDestroy' | 'Mint' | 'Burn' | 'Transfer' | 'TransferKeepAlive' | 'ForceTransfer' | 'Freeze' | 'Thaw' | 'FreezeAsset' | 'ThawAsset' | 'TransferOwnership' | 'SetTeam' | 'SetMetadata' | 'ClearMetadata' | 'ForceSetMetadata' | 'ForceClearMetadata' | 'ForceAssetStatus' | 'ApproveTransfer' | 'CancelApproval' | 'ForceCancelApproval' | 'TransferApproved' | 'Touch' | 'Refund' | 'SetMinBalance' | 'TouchOther' | 'RefundOther' | 'Block';
  }

  /** @name PalletContractsCall (217) */
  interface PalletContractsCall extends Enum {
    readonly isCallOldWeight: boolean;
    readonly asCallOldWeight: {
      readonly dest: MultiAddress;
      readonly value: Compact<u128>;
      readonly gasLimit: Compact<u64>;
      readonly storageDepositLimit: Option<Compact<u128>>;
      readonly data: Bytes;
    } & Struct;
    readonly isInstantiateWithCodeOldWeight: boolean;
    readonly asInstantiateWithCodeOldWeight: {
      readonly value: Compact<u128>;
      readonly gasLimit: Compact<u64>;
      readonly storageDepositLimit: Option<Compact<u128>>;
      readonly code: Bytes;
      readonly data: Bytes;
      readonly salt: Bytes;
    } & Struct;
    readonly isInstantiateOldWeight: boolean;
    readonly asInstantiateOldWeight: {
      readonly value: Compact<u128>;
      readonly gasLimit: Compact<u64>;
      readonly storageDepositLimit: Option<Compact<u128>>;
      readonly codeHash: H256;
      readonly data: Bytes;
      readonly salt: Bytes;
    } & Struct;
    readonly isUploadCode: boolean;
    readonly asUploadCode: {
      readonly code: Bytes;
      readonly storageDepositLimit: Option<Compact<u128>>;
      readonly determinism: PalletContractsWasmDeterminism;
    } & Struct;
    readonly isRemoveCode: boolean;
    readonly asRemoveCode: {
      readonly codeHash: H256;
    } & Struct;
    readonly isSetCode: boolean;
    readonly asSetCode: {
      readonly dest: MultiAddress;
      readonly codeHash: H256;
    } & Struct;
    readonly isCall: boolean;
    readonly asCall: {
      readonly dest: MultiAddress;
      readonly value: Compact<u128>;
      readonly gasLimit: SpWeightsWeightV2Weight;
      readonly storageDepositLimit: Option<Compact<u128>>;
      readonly data: Bytes;
    } & Struct;
    readonly isInstantiateWithCode: boolean;
    readonly asInstantiateWithCode: {
      readonly value: Compact<u128>;
      readonly gasLimit: SpWeightsWeightV2Weight;
      readonly storageDepositLimit: Option<Compact<u128>>;
      readonly code: Bytes;
      readonly data: Bytes;
      readonly salt: Bytes;
    } & Struct;
    readonly isInstantiate: boolean;
    readonly asInstantiate: {
      readonly value: Compact<u128>;
      readonly gasLimit: SpWeightsWeightV2Weight;
      readonly storageDepositLimit: Option<Compact<u128>>;
      readonly codeHash: H256;
      readonly data: Bytes;
      readonly salt: Bytes;
    } & Struct;
    readonly isMigrate: boolean;
    readonly asMigrate: {
      readonly weightLimit: SpWeightsWeightV2Weight;
    } & Struct;
    readonly type: 'CallOldWeight' | 'InstantiateWithCodeOldWeight' | 'InstantiateOldWeight' | 'UploadCode' | 'RemoveCode' | 'SetCode' | 'Call' | 'InstantiateWithCode' | 'Instantiate' | 'Migrate';
  }

  /** @name PalletContractsWasmDeterminism (219) */
  interface PalletContractsWasmDeterminism extends Enum {
    readonly isEnforced: boolean;
    readonly isRelaxed: boolean;
    readonly type: 'Enforced' | 'Relaxed';
  }

  /** @name PalletNetworkMembershipCall (220) */
  interface PalletNetworkMembershipCall extends Enum {
    readonly isNominate: boolean;
    readonly asNominate: {
      readonly member: AccountId32;
      readonly expires: bool;
    } & Struct;
    readonly isRenew: boolean;
    readonly asRenew: {
      readonly member: AccountId32;
    } & Struct;
    readonly isRevoke: boolean;
    readonly asRevoke: {
      readonly member: AccountId32;
    } & Struct;
    readonly type: 'Nominate' | 'Renew' | 'Revoke';
  }

  /** @name PalletDidCall (221) */
  interface PalletDidCall extends Enum {
    readonly isCreate: boolean;
    readonly asCreate: {
      readonly details: PalletDidDidDetailsDidCreationDetails;
      readonly signature: PalletDidDidDetailsDidSignature;
    } & Struct;
    readonly isSetAuthenticationKey: boolean;
    readonly asSetAuthenticationKey: {
      readonly newKey: PalletDidDidDetailsDidVerificationKey;
    } & Struct;
    readonly isSetDelegationKey: boolean;
    readonly asSetDelegationKey: {
      readonly newKey: PalletDidDidDetailsDidVerificationKey;
    } & Struct;
    readonly isRemoveDelegationKey: boolean;
    readonly isSetAssertionKey: boolean;
    readonly asSetAssertionKey: {
      readonly newKey: PalletDidDidDetailsDidVerificationKey;
    } & Struct;
    readonly isRemoveAssertionKey: boolean;
    readonly isAddKeyAgreementKey: boolean;
    readonly asAddKeyAgreementKey: {
      readonly newKey: PalletDidDidDetailsDidEncryptionKey;
    } & Struct;
    readonly isRemoveKeyAgreementKey: boolean;
    readonly asRemoveKeyAgreementKey: {
      readonly keyId: H256;
    } & Struct;
    readonly isAddServiceEndpoint: boolean;
    readonly asAddServiceEndpoint: {
      readonly serviceEndpoint: PalletDidServiceEndpointsDidEndpoint;
    } & Struct;
    readonly isRemoveServiceEndpoint: boolean;
    readonly asRemoveServiceEndpoint: {
      readonly serviceId: Bytes;
    } & Struct;
    readonly isDelete: boolean;
    readonly asDelete: {
      readonly endpointsToRemove: u32;
    } & Struct;
    readonly isSubmitDidCall: boolean;
    readonly asSubmitDidCall: {
      readonly didCall: PalletDidDidDetailsDidAuthorizedCallOperation;
      readonly signature: PalletDidDidDetailsDidSignature;
    } & Struct;
    readonly isDispatchAs: boolean;
    readonly asDispatchAs: {
      readonly didIdentifier: AccountId32;
      readonly call: Call;
    } & Struct;
    readonly isCreateFromAccount: boolean;
    readonly asCreateFromAccount: {
      readonly authenticationKey: PalletDidDidDetailsDidVerificationKey;
    } & Struct;
    readonly type: 'Create' | 'SetAuthenticationKey' | 'SetDelegationKey' | 'RemoveDelegationKey' | 'SetAssertionKey' | 'RemoveAssertionKey' | 'AddKeyAgreementKey' | 'RemoveKeyAgreementKey' | 'AddServiceEndpoint' | 'RemoveServiceEndpoint' | 'Delete' | 'SubmitDidCall' | 'DispatchAs' | 'CreateFromAccount';
  }

  /** @name PalletDidDidDetailsDidCreationDetails (222) */
  interface PalletDidDidDetailsDidCreationDetails extends Struct {
    readonly did: AccountId32;
    readonly submitter: AccountId32;
    readonly newKeyAgreementKeys: BTreeSet<PalletDidDidDetailsDidEncryptionKey>;
    readonly newAssertionKey: Option<PalletDidDidDetailsDidVerificationKey>;
    readonly newDelegationKey: Option<PalletDidDidDetailsDidVerificationKey>;
    readonly newServiceDetails: Vec<PalletDidServiceEndpointsDidEndpoint>;
  }

  /** @name CordLoomRuntimeMaxNewKeyAgreementKeys (223) */
  type CordLoomRuntimeMaxNewKeyAgreementKeys = Null;

  /** @name PalletDidServiceEndpointsDidEndpoint (224) */
  interface PalletDidServiceEndpointsDidEndpoint extends Struct {
    readonly id: Bytes;
    readonly serviceTypes: Vec<Bytes>;
    readonly urls: Vec<Bytes>;
  }

  /** @name PalletDidDidDetailsDidEncryptionKey (233) */
  interface PalletDidDidDetailsDidEncryptionKey extends Enum {
    readonly isX25519: boolean;
    readonly asX25519: U8aFixed;
    readonly type: 'X25519';
  }

  /** @name PalletDidDidDetailsDidVerificationKey (237) */
  interface PalletDidDidDetailsDidVerificationKey extends Enum {
    readonly isEd25519: boolean;
    readonly asEd25519: U8aFixed;
    readonly isSr25519: boolean;
    readonly asSr25519: U8aFixed;
    readonly isEcdsa: boolean;
    readonly asEcdsa: U8aFixed;
    readonly isAccount: boolean;
    readonly asAccount: AccountId32;
    readonly type: 'Ed25519' | 'Sr25519' | 'Ecdsa' | 'Account';
  }

  /** @name PalletDidDidDetailsDidSignature (240) */
  interface PalletDidDidDetailsDidSignature extends Enum {
    readonly isEd25519: boolean;
    readonly asEd25519: U8aFixed;
    readonly isSr25519: boolean;
    readonly asSr25519: U8aFixed;
    readonly isEcdsa: boolean;
    readonly asEcdsa: U8aFixed;
    readonly type: 'Ed25519' | 'Sr25519' | 'Ecdsa';
  }

  /** @name PalletDidDidDetailsDidAuthorizedCallOperation (241) */
  interface PalletDidDidDetailsDidAuthorizedCallOperation extends Struct {
    readonly did: AccountId32;
    readonly txCounter: u64;
    readonly call: Call;
    readonly blockNumber: u32;
    readonly submitter: AccountId32;
  }

  /** @name PalletSchemaCall (242) */
  interface PalletSchemaCall extends Enum {
    readonly isCreate: boolean;
    readonly asCreate: {
      readonly txSchema: Bytes;
      readonly authorization: Bytes;
    } & Struct;
    readonly type: 'Create';
  }

  /** @name PalletChainSpaceCall (244) */
  interface PalletChainSpaceCall extends Enum {
    readonly isAddDelegate: boolean;
    readonly asAddDelegate: {
      readonly spaceId: Bytes;
      readonly delegate: AccountId32;
      readonly authorization: Bytes;
    } & Struct;
    readonly isAddAdminDelegate: boolean;
    readonly asAddAdminDelegate: {
      readonly spaceId: Bytes;
      readonly delegate: AccountId32;
      readonly authorization: Bytes;
    } & Struct;
    readonly isAddDelegator: boolean;
    readonly asAddDelegator: {
      readonly spaceId: Bytes;
      readonly delegate: AccountId32;
      readonly authorization: Bytes;
    } & Struct;
    readonly isRemoveDelegate: boolean;
    readonly asRemoveDelegate: {
      readonly spaceId: Bytes;
      readonly removeAuthorization: Bytes;
      readonly authorization: Bytes;
    } & Struct;
    readonly isCreate: boolean;
    readonly asCreate: {
      readonly spaceCode: H256;
    } & Struct;
    readonly isApprove: boolean;
    readonly asApprove: {
      readonly spaceId: Bytes;
      readonly txnCapacity: u64;
    } & Struct;
    readonly isArchive: boolean;
    readonly asArchive: {
      readonly spaceId: Bytes;
      readonly authorization: Bytes;
    } & Struct;
    readonly isRestore: boolean;
    readonly asRestore: {
      readonly spaceId: Bytes;
      readonly authorization: Bytes;
    } & Struct;
    readonly isUpdateTransactionCapacity: boolean;
    readonly asUpdateTransactionCapacity: {
      readonly spaceId: Bytes;
      readonly newTxnCapacity: u64;
    } & Struct;
    readonly isResetTransactionCount: boolean;
    readonly asResetTransactionCount: {
      readonly spaceId: Bytes;
    } & Struct;
    readonly isApprovalRevoke: boolean;
    readonly asApprovalRevoke: {
      readonly spaceId: Bytes;
    } & Struct;
    readonly isApprovalRestore: boolean;
    readonly asApprovalRestore: {
      readonly spaceId: Bytes;
    } & Struct;
    readonly isSubspaceCreate: boolean;
    readonly asSubspaceCreate: {
      readonly spaceCode: H256;
      readonly count: Option<u64>;
      readonly spaceId: Bytes;
    } & Struct;
    readonly isUpdateTransactionCapacitySub: boolean;
    readonly asUpdateTransactionCapacitySub: {
      readonly spaceId: Bytes;
      readonly newTxnCapacity: u64;
    } & Struct;
    readonly type: 'AddDelegate' | 'AddAdminDelegate' | 'AddDelegator' | 'RemoveDelegate' | 'Create' | 'Approve' | 'Archive' | 'Restore' | 'UpdateTransactionCapacity' | 'ResetTransactionCount' | 'ApprovalRevoke' | 'ApprovalRestore' | 'SubspaceCreate' | 'UpdateTransactionCapacitySub';
  }

  /** @name PalletStatementCall (246) */
  interface PalletStatementCall extends Enum {
    readonly isRegister: boolean;
    readonly asRegister: {
      readonly digest: H256;
      readonly authorization: Bytes;
      readonly schemaId: Option<Bytes>;
    } & Struct;
    readonly isUpdate: boolean;
    readonly asUpdate: {
      readonly statementId: Bytes;
      readonly newStatementDigest: H256;
      readonly authorization: Bytes;
    } & Struct;
    readonly isRevoke: boolean;
    readonly asRevoke: {
      readonly statementId: Bytes;
      readonly authorization: Bytes;
    } & Struct;
    readonly isRestore: boolean;
    readonly asRestore: {
      readonly statementId: Bytes;
      readonly authorization: Bytes;
    } & Struct;
    readonly isRemove: boolean;
    readonly asRemove: {
      readonly statementId: Bytes;
      readonly authorization: Bytes;
    } & Struct;
    readonly isRegisterBatch: boolean;
    readonly asRegisterBatch: {
      readonly digests: Vec<H256>;
      readonly authorization: Bytes;
      readonly schemaId: Option<Bytes>;
    } & Struct;
    readonly isAddPresentation: boolean;
    readonly asAddPresentation: {
      readonly statementId: Bytes;
      readonly presentationDigest: H256;
      readonly presentationType: PalletStatementPresentationTypeOf;
      readonly authorization: Bytes;
    } & Struct;
    readonly isRemovePresentation: boolean;
    readonly asRemovePresentation: {
      readonly statementId: Bytes;
      readonly presentationDigest: H256;
      readonly authorization: Bytes;
    } & Struct;
    readonly type: 'Register' | 'Update' | 'Revoke' | 'Restore' | 'Remove' | 'RegisterBatch' | 'AddPresentation' | 'RemovePresentation';
  }

  /** @name PalletStatementPresentationTypeOf (248) */
  interface PalletStatementPresentationTypeOf extends Enum {
    readonly isOther: boolean;
    readonly isPdf: boolean;
    readonly isJpeg: boolean;
    readonly isPng: boolean;
    readonly isGif: boolean;
    readonly isTxt: boolean;
    readonly isSvg: boolean;
    readonly isJson: boolean;
    readonly isDocx: boolean;
    readonly isXlsx: boolean;
    readonly isPptx: boolean;
    readonly isMp3: boolean;
    readonly isMp4: boolean;
    readonly isXml: boolean;
    readonly type: 'Other' | 'Pdf' | 'Jpeg' | 'Png' | 'Gif' | 'Txt' | 'Svg' | 'Json' | 'Docx' | 'Xlsx' | 'Pptx' | 'Mp3' | 'Mp4' | 'Xml';
  }

  /** @name PalletDidNameCall (249) */
  interface PalletDidNameCall extends Enum {
    readonly isRegister: boolean;
    readonly asRegister: {
      readonly name: Bytes;
    } & Struct;
    readonly isRelease: boolean;
    readonly isBan: boolean;
    readonly asBan: {
      readonly name: Bytes;
    } & Struct;
    readonly isUnban: boolean;
    readonly asUnban: {
      readonly name: Bytes;
    } & Struct;
    readonly type: 'Register' | 'Release' | 'Ban' | 'Unban';
  }

  /** @name PalletNetworkScoreCall (250) */
  interface PalletNetworkScoreCall extends Enum {
    readonly isRegisterRating: boolean;
    readonly asRegisterRating: {
      readonly entry: PalletNetworkScoreRatingInputEntry;
      readonly digest: H256;
      readonly messageId: Bytes;
      readonly authorization: Bytes;
    } & Struct;
    readonly isRevokeRating: boolean;
    readonly asRevokeRating: {
      readonly entryIdentifier: Bytes;
      readonly messageId: Bytes;
      readonly digest: H256;
      readonly authorization: Bytes;
    } & Struct;
    readonly isReviseRating: boolean;
    readonly asReviseRating: {
      readonly entry: PalletNetworkScoreRatingInputEntry;
      readonly digest: H256;
      readonly messageId: Bytes;
      readonly debitRefId: Bytes;
      readonly authorization: Bytes;
    } & Struct;
    readonly type: 'RegisterRating' | 'RevokeRating' | 'ReviseRating';
  }

  /** @name PalletNetworkScoreRatingInputEntry (251) */
  interface PalletNetworkScoreRatingInputEntry extends Struct {
    readonly entityId: Bytes;
    readonly providerId: Bytes;
    readonly countOfTxn: u64;
    readonly totalEncodedRating: u64;
    readonly ratingType: PalletNetworkScoreRatingTypeOf;
    readonly providerDid: AccountId32;
  }

  /** @name PalletNetworkScoreRatingTypeOf (252) */
  interface PalletNetworkScoreRatingTypeOf extends Enum {
    readonly isOverall: boolean;
    readonly isDelivery: boolean;
    readonly type: 'Overall' | 'Delivery';
  }

  /** @name PalletAssetConversionCall (253) */
  interface PalletAssetConversionCall extends Enum {
    readonly isCreatePool: boolean;
    readonly asCreatePool: {
      readonly asset1: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly asset2: FrameSupportTokensFungibleUnionOfNativeOrWithId;
    } & Struct;
    readonly isAddLiquidity: boolean;
    readonly asAddLiquidity: {
      readonly asset1: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly asset2: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly amount1Desired: u128;
      readonly amount2Desired: u128;
      readonly amount1Min: u128;
      readonly amount2Min: u128;
      readonly mintTo: AccountId32;
    } & Struct;
    readonly isRemoveLiquidity: boolean;
    readonly asRemoveLiquidity: {
      readonly asset1: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly asset2: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly lpTokenBurn: u128;
      readonly amount1MinReceive: u128;
      readonly amount2MinReceive: u128;
      readonly withdrawTo: AccountId32;
    } & Struct;
    readonly isSwapExactTokensForTokens: boolean;
    readonly asSwapExactTokensForTokens: {
      readonly path: Vec<FrameSupportTokensFungibleUnionOfNativeOrWithId>;
      readonly amountIn: u128;
      readonly amountOutMin: u128;
      readonly sendTo: AccountId32;
      readonly keepAlive: bool;
    } & Struct;
    readonly isSwapTokensForExactTokens: boolean;
    readonly asSwapTokensForExactTokens: {
      readonly path: Vec<FrameSupportTokensFungibleUnionOfNativeOrWithId>;
      readonly amountOut: u128;
      readonly amountInMax: u128;
      readonly sendTo: AccountId32;
      readonly keepAlive: bool;
    } & Struct;
    readonly isTouch: boolean;
    readonly asTouch: {
      readonly asset1: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly asset2: FrameSupportTokensFungibleUnionOfNativeOrWithId;
    } & Struct;
    readonly type: 'CreatePool' | 'AddLiquidity' | 'RemoveLiquidity' | 'SwapExactTokensForTokens' | 'SwapTokensForExactTokens' | 'Touch';
  }

  /** @name PalletRemarkCall (255) */
  interface PalletRemarkCall extends Enum {
    readonly isStore: boolean;
    readonly asStore: {
      readonly remark: Bytes;
    } & Struct;
    readonly type: 'Store';
  }

  /** @name PalletRegistriesCall (256) */
  interface PalletRegistriesCall extends Enum {
    readonly isAddDelegate: boolean;
    readonly asAddDelegate: {
      readonly registryId: Bytes;
      readonly delegate: AccountId32;
      readonly authorization: Bytes;
    } & Struct;
    readonly isAddAdminDelegate: boolean;
    readonly asAddAdminDelegate: {
      readonly registryId: Bytes;
      readonly delegate: AccountId32;
      readonly authorization: Bytes;
    } & Struct;
    readonly isAddDelegator: boolean;
    readonly asAddDelegator: {
      readonly registryId: Bytes;
      readonly delegate: AccountId32;
      readonly authorization: Bytes;
    } & Struct;
    readonly isRemoveDelegate: boolean;
    readonly asRemoveDelegate: {
      readonly registryId: Bytes;
      readonly removeAuthorization: Bytes;
      readonly authorization: Bytes;
    } & Struct;
    readonly isCreate: boolean;
    readonly asCreate: {
      readonly registryId: Bytes;
      readonly digest: H256;
      readonly schemaId: Option<Bytes>;
      readonly blob: Option<Bytes>;
    } & Struct;
    readonly isRevoke: boolean;
    readonly asRevoke: {
      readonly registryId: Bytes;
      readonly authorization: Bytes;
    } & Struct;
    readonly isReinstate: boolean;
    readonly asReinstate: {
      readonly registryId: Bytes;
      readonly authorization: Bytes;
    } & Struct;
    readonly isUpdate: boolean;
    readonly asUpdate: {
      readonly registryId: Bytes;
      readonly digest: H256;
      readonly blob: Option<Bytes>;
      readonly authorization: Bytes;
    } & Struct;
    readonly isArchive: boolean;
    readonly asArchive: {
      readonly registryId: Bytes;
      readonly authorization: Bytes;
    } & Struct;
    readonly isRestore: boolean;
    readonly asRestore: {
      readonly registryId: Bytes;
      readonly authorization: Bytes;
    } & Struct;
    readonly type: 'AddDelegate' | 'AddAdminDelegate' | 'AddDelegator' | 'RemoveDelegate' | 'Create' | 'Revoke' | 'Reinstate' | 'Update' | 'Archive' | 'Restore';
  }

  /** @name PalletEntriesCall (261) */
  interface PalletEntriesCall extends Enum {
    readonly isCreate: boolean;
    readonly asCreate: {
      readonly registryEntryId: Bytes;
      readonly authorization: Bytes;
      readonly digest: H256;
      readonly blob: Option<Bytes>;
    } & Struct;
    readonly isUpdate: boolean;
    readonly asUpdate: {
      readonly registryEntryId: Bytes;
      readonly authorization: Bytes;
      readonly digest: H256;
      readonly blob: Option<Bytes>;
    } & Struct;
    readonly isRevoke: boolean;
    readonly asRevoke: {
      readonly registryEntryId: Bytes;
      readonly authorization: Bytes;
    } & Struct;
    readonly isReinstate: boolean;
    readonly asReinstate: {
      readonly registryEntryId: Bytes;
      readonly authorization: Bytes;
    } & Struct;
    readonly type: 'Create' | 'Update' | 'Revoke' | 'Reinstate';
  }

  /** @name PalletRootTestingCall (264) */
  interface PalletRootTestingCall extends Enum {
    readonly isFillBlock: boolean;
    readonly asFillBlock: {
      readonly ratio: Perbill;
    } & Struct;
    readonly isTriggerDefensive: boolean;
    readonly type: 'FillBlock' | 'TriggerDefensive';
  }

  /** @name PalletSudoCall (266) */
  interface PalletSudoCall extends Enum {
    readonly isSudo: boolean;
    readonly asSudo: {
      readonly call: Call;
    } & Struct;
    readonly isSudoUncheckedWeight: boolean;
    readonly asSudoUncheckedWeight: {
      readonly call: Call;
      readonly weight: SpWeightsWeightV2Weight;
    } & Struct;
    readonly isSetKey: boolean;
    readonly asSetKey: {
      readonly new_: MultiAddress;
    } & Struct;
    readonly isSudoAs: boolean;
    readonly asSudoAs: {
      readonly who: MultiAddress;
      readonly call: Call;
    } & Struct;
    readonly isRemoveKey: boolean;
    readonly type: 'Sudo' | 'SudoUncheckedWeight' | 'SetKey' | 'SudoAs' | 'RemoveKey';
  }

  /** @name CordLoomRuntimeOriginCaller (267) */
  interface CordLoomRuntimeOriginCaller extends Enum {
    readonly isSystem: boolean;
    readonly asSystem: FrameSupportDispatchRawOrigin;
    readonly isVoid: boolean;
    readonly isCouncil: boolean;
    readonly asCouncil: PalletCollectiveRawOrigin;
    readonly isTechnicalCommittee: boolean;
    readonly asTechnicalCommittee: PalletCollectiveRawOrigin;
    readonly isDid: boolean;
    readonly asDid: PalletDidOriginDidRawOrigin;
    readonly type: 'System' | 'Void' | 'Council' | 'TechnicalCommittee' | 'Did';
  }

  /** @name FrameSupportDispatchRawOrigin (268) */
  interface FrameSupportDispatchRawOrigin extends Enum {
    readonly isRoot: boolean;
    readonly isSigned: boolean;
    readonly asSigned: AccountId32;
    readonly isNone: boolean;
    readonly type: 'Root' | 'Signed' | 'None';
  }

  /** @name PalletCollectiveRawOrigin (269) */
  interface PalletCollectiveRawOrigin extends Enum {
    readonly isMembers: boolean;
    readonly asMembers: ITuple<[u32, u32]>;
    readonly isMember: boolean;
    readonly asMember: AccountId32;
    readonly isPhantom: boolean;
    readonly type: 'Members' | 'Member' | 'Phantom';
  }

  /** @name PalletDidOriginDidRawOrigin (271) */
  interface PalletDidOriginDidRawOrigin extends Struct {
    readonly id: AccountId32;
    readonly submitter: AccountId32;
  }

  /** @name SpCoreVoid (272) */
  type SpCoreVoid = Null;

  /** @name PalletUtilityError (273) */
  interface PalletUtilityError extends Enum {
    readonly isTooManyCalls: boolean;
    readonly type: 'TooManyCalls';
  }

  /** @name SpConsensusBabeDigestsPreDigest (280) */
  interface SpConsensusBabeDigestsPreDigest extends Enum {
    readonly isPrimary: boolean;
    readonly asPrimary: SpConsensusBabeDigestsPrimaryPreDigest;
    readonly isSecondaryPlain: boolean;
    readonly asSecondaryPlain: SpConsensusBabeDigestsSecondaryPlainPreDigest;
    readonly isSecondaryVRF: boolean;
    readonly asSecondaryVRF: SpConsensusBabeDigestsSecondaryVRFPreDigest;
    readonly type: 'Primary' | 'SecondaryPlain' | 'SecondaryVRF';
  }

  /** @name SpConsensusBabeDigestsPrimaryPreDigest (281) */
  interface SpConsensusBabeDigestsPrimaryPreDigest extends Struct {
    readonly authorityIndex: u32;
    readonly slot: u64;
    readonly vrfSignature: SpCoreSr25519VrfVrfSignature;
  }

  /** @name SpCoreSr25519VrfVrfSignature (282) */
  interface SpCoreSr25519VrfVrfSignature extends Struct {
    readonly preOutput: U8aFixed;
    readonly proof: U8aFixed;
  }

  /** @name SpConsensusBabeDigestsSecondaryPlainPreDigest (283) */
  interface SpConsensusBabeDigestsSecondaryPlainPreDigest extends Struct {
    readonly authorityIndex: u32;
    readonly slot: u64;
  }

  /** @name SpConsensusBabeDigestsSecondaryVRFPreDigest (284) */
  interface SpConsensusBabeDigestsSecondaryVRFPreDigest extends Struct {
    readonly authorityIndex: u32;
    readonly slot: u64;
    readonly vrfSignature: SpCoreSr25519VrfVrfSignature;
  }

  /** @name SpConsensusBabeBabeEpochConfiguration (285) */
  interface SpConsensusBabeBabeEpochConfiguration extends Struct {
    readonly c: ITuple<[u64, u64]>;
    readonly allowedSlots: SpConsensusBabeAllowedSlots;
  }

  /** @name PalletBabeError (289) */
  interface PalletBabeError extends Enum {
    readonly isInvalidEquivocationProof: boolean;
    readonly isInvalidKeyOwnershipProof: boolean;
    readonly isDuplicateOffenceReport: boolean;
    readonly isInvalidConfiguration: boolean;
    readonly type: 'InvalidEquivocationProof' | 'InvalidKeyOwnershipProof' | 'DuplicateOffenceReport' | 'InvalidConfiguration';
  }

  /** @name AuthorityMembershipError (290) */
  interface AuthorityMembershipError extends Enum {
    readonly isMemberAlreadyIncoming: boolean;
    readonly isMemberAlreadyExists: boolean;
    readonly isMemberAlreadyOutgoing: boolean;
    readonly isMemberNotFound: boolean;
    readonly isMemberBlackListed: boolean;
    readonly isSessionKeysNotAdded: boolean;
    readonly isMemberNotBlackListed: boolean;
    readonly isNetworkMembershipNotFound: boolean;
    readonly isTooLowAuthorityCount: boolean;
    readonly type: 'MemberAlreadyIncoming' | 'MemberAlreadyExists' | 'MemberAlreadyOutgoing' | 'MemberNotFound' | 'MemberBlackListed' | 'SessionKeysNotAdded' | 'MemberNotBlackListed' | 'NetworkMembershipNotFound' | 'TooLowAuthorityCount';
  }

  /** @name PalletIndicesError (292) */
  interface PalletIndicesError extends Enum {
    readonly isNotAssigned: boolean;
    readonly isNotOwner: boolean;
    readonly isInUse: boolean;
    readonly isNotTransfer: boolean;
    readonly isPermanent: boolean;
    readonly type: 'NotAssigned' | 'NotOwner' | 'InUse' | 'NotTransfer' | 'Permanent';
  }

  /** @name PalletBalancesBalanceLock (294) */
  interface PalletBalancesBalanceLock extends Struct {
    readonly id: U8aFixed;
    readonly amount: u128;
    readonly reasons: PalletBalancesReasons;
  }

  /** @name PalletBalancesReasons (295) */
  interface PalletBalancesReasons extends Enum {
    readonly isFee: boolean;
    readonly isMisc: boolean;
    readonly isAll: boolean;
    readonly type: 'Fee' | 'Misc' | 'All';
  }

  /** @name PalletBalancesReserveData (298) */
  interface PalletBalancesReserveData extends Struct {
    readonly id: U8aFixed;
    readonly amount: u128;
  }

  /** @name FrameSupportTokensMiscIdAmountRuntimeHoldReason (301) */
  interface FrameSupportTokensMiscIdAmountRuntimeHoldReason extends Struct {
    readonly id: CordLoomRuntimeRuntimeHoldReason;
    readonly amount: u128;
  }

  /** @name CordLoomRuntimeRuntimeHoldReason (302) */
  interface CordLoomRuntimeRuntimeHoldReason extends Enum {
    readonly isPreimage: boolean;
    readonly asPreimage: PalletPreimageHoldReason;
    readonly isContracts: boolean;
    readonly asContracts: PalletContractsHoldReason;
    readonly type: 'Preimage' | 'Contracts';
  }

  /** @name PalletPreimageHoldReason (303) */
  interface PalletPreimageHoldReason extends Enum {
    readonly isPreimage: boolean;
    readonly type: 'Preimage';
  }

  /** @name PalletContractsHoldReason (304) */
  interface PalletContractsHoldReason extends Enum {
    readonly isCodeUploadDepositReserve: boolean;
    readonly isStorageDepositReserve: boolean;
    readonly type: 'CodeUploadDepositReserve' | 'StorageDepositReserve';
  }

  /** @name FrameSupportTokensMiscIdAmountRuntimeFreezeReason (307) */
  interface FrameSupportTokensMiscIdAmountRuntimeFreezeReason extends Struct {
    readonly id: CordLoomRuntimeRuntimeFreezeReason;
    readonly amount: u128;
  }

  /** @name CordLoomRuntimeRuntimeFreezeReason (308) */
  type CordLoomRuntimeRuntimeFreezeReason = Null;

  /** @name PalletBalancesError (310) */
  interface PalletBalancesError extends Enum {
    readonly isVestingBalance: boolean;
    readonly isLiquidityRestrictions: boolean;
    readonly isInsufficientBalance: boolean;
    readonly isExistentialDeposit: boolean;
    readonly isExpendability: boolean;
    readonly isExistingVestingSchedule: boolean;
    readonly isDeadAccount: boolean;
    readonly isTooManyReserves: boolean;
    readonly isTooManyHolds: boolean;
    readonly isTooManyFreezes: boolean;
    readonly isIssuanceDeactivated: boolean;
    readonly isDeltaZero: boolean;
    readonly type: 'VestingBalance' | 'LiquidityRestrictions' | 'InsufficientBalance' | 'ExistentialDeposit' | 'Expendability' | 'ExistingVestingSchedule' | 'DeadAccount' | 'TooManyReserves' | 'TooManyHolds' | 'TooManyFreezes' | 'IssuanceDeactivated' | 'DeltaZero';
  }

  /** @name SpCoreCryptoKeyTypeId (315) */
  interface SpCoreCryptoKeyTypeId extends U8aFixed {}

  /** @name PalletSessionError (316) */
  interface PalletSessionError extends Enum {
    readonly isInvalidProof: boolean;
    readonly isNoAssociatedValidatorId: boolean;
    readonly isDuplicatedKey: boolean;
    readonly isNoKeys: boolean;
    readonly isNoAccount: boolean;
    readonly type: 'InvalidProof' | 'NoAssociatedValidatorId' | 'DuplicatedKey' | 'NoKeys' | 'NoAccount';
  }

  /** @name PalletTransactionPaymentReleases (318) */
  interface PalletTransactionPaymentReleases extends Enum {
    readonly isV1Ancient: boolean;
    readonly isV2: boolean;
    readonly type: 'V1Ancient' | 'V2';
  }

  /** @name PalletTreasuryProposal (319) */
  interface PalletTreasuryProposal extends Struct {
    readonly proposer: AccountId32;
    readonly value: u128;
    readonly beneficiary: AccountId32;
    readonly bond: u128;
  }

  /** @name PalletTreasurySpendStatus (321) */
  interface PalletTreasurySpendStatus extends Struct {
    readonly assetKind: Null;
    readonly amount: u128;
    readonly beneficiary: AccountId32;
    readonly validFrom: u32;
    readonly expireAt: u32;
    readonly status: PalletTreasuryPaymentState;
  }

  /** @name PalletTreasuryPaymentState (322) */
  interface PalletTreasuryPaymentState extends Enum {
    readonly isPending: boolean;
    readonly isAttempted: boolean;
    readonly asAttempted: {
      readonly id: Null;
    } & Struct;
    readonly isFailed: boolean;
    readonly type: 'Pending' | 'Attempted' | 'Failed';
  }

  /** @name FrameSupportPalletId (323) */
  interface FrameSupportPalletId extends U8aFixed {}

  /** @name PalletTreasuryError (324) */
  interface PalletTreasuryError extends Enum {
    readonly isInvalidIndex: boolean;
    readonly isTooManyApprovals: boolean;
    readonly isInsufficientPermission: boolean;
    readonly isProposalNotApproved: boolean;
    readonly isFailedToConvertBalance: boolean;
    readonly isSpendExpired: boolean;
    readonly isEarlyPayout: boolean;
    readonly isAlreadyAttempted: boolean;
    readonly isPayoutError: boolean;
    readonly isNotAttempted: boolean;
    readonly isInconclusive: boolean;
    readonly type: 'InvalidIndex' | 'TooManyApprovals' | 'InsufficientPermission' | 'ProposalNotApproved' | 'FailedToConvertBalance' | 'SpendExpired' | 'EarlyPayout' | 'AlreadyAttempted' | 'PayoutError' | 'NotAttempted' | 'Inconclusive';
  }

  /** @name PalletCollectiveVotes (327) */
  interface PalletCollectiveVotes extends Struct {
    readonly index: u32;
    readonly threshold: u32;
    readonly ayes: Vec<AccountId32>;
    readonly nays: Vec<AccountId32>;
    readonly end: u32;
  }

  /** @name PalletCollectiveError (328) */
  interface PalletCollectiveError extends Enum {
    readonly isNotMember: boolean;
    readonly isDuplicateProposal: boolean;
    readonly isProposalMissing: boolean;
    readonly isWrongIndex: boolean;
    readonly isDuplicateVote: boolean;
    readonly isAlreadyInitialized: boolean;
    readonly isTooEarly: boolean;
    readonly isTooManyProposals: boolean;
    readonly isWrongProposalWeight: boolean;
    readonly isWrongProposalLength: boolean;
    readonly isPrimeAccountNotMember: boolean;
    readonly type: 'NotMember' | 'DuplicateProposal' | 'ProposalMissing' | 'WrongIndex' | 'DuplicateVote' | 'AlreadyInitialized' | 'TooEarly' | 'TooManyProposals' | 'WrongProposalWeight' | 'WrongProposalLength' | 'PrimeAccountNotMember';
  }

  /** @name PalletMembershipError (330) */
  interface PalletMembershipError extends Enum {
    readonly isAlreadyMember: boolean;
    readonly isNotMember: boolean;
    readonly isTooManyMembers: boolean;
    readonly type: 'AlreadyMember' | 'NotMember' | 'TooManyMembers';
  }

  /** @name PalletGrandpaStoredState (333) */
  interface PalletGrandpaStoredState extends Enum {
    readonly isLive: boolean;
    readonly isPendingPause: boolean;
    readonly asPendingPause: {
      readonly scheduledAt: u32;
      readonly delay: u32;
    } & Struct;
    readonly isPaused: boolean;
    readonly isPendingResume: boolean;
    readonly asPendingResume: {
      readonly scheduledAt: u32;
      readonly delay: u32;
    } & Struct;
    readonly type: 'Live' | 'PendingPause' | 'Paused' | 'PendingResume';
  }

  /** @name PalletGrandpaStoredPendingChange (334) */
  interface PalletGrandpaStoredPendingChange extends Struct {
    readonly scheduledAt: u32;
    readonly delay: u32;
    readonly nextAuthorities: Vec<ITuple<[SpConsensusGrandpaAppPublic, u64]>>;
    readonly forced: Option<u32>;
  }

  /** @name PalletGrandpaError (336) */
  interface PalletGrandpaError extends Enum {
    readonly isPauseFailed: boolean;
    readonly isResumeFailed: boolean;
    readonly isChangePending: boolean;
    readonly isTooSoon: boolean;
    readonly isInvalidKeyOwnershipProof: boolean;
    readonly isInvalidEquivocationProof: boolean;
    readonly isDuplicateOffenceReport: boolean;
    readonly type: 'PauseFailed' | 'ResumeFailed' | 'ChangePending' | 'TooSoon' | 'InvalidKeyOwnershipProof' | 'InvalidEquivocationProof' | 'DuplicateOffenceReport';
  }

  /** @name PalletImOnlineError (340) */
  interface PalletImOnlineError extends Enum {
    readonly isInvalidKey: boolean;
    readonly isDuplicatedHeartbeat: boolean;
    readonly type: 'InvalidKey' | 'DuplicatedHeartbeat';
  }

  /** @name SpStakingOffenceOffenceDetails (343) */
  interface SpStakingOffenceOffenceDetails extends Struct {
    readonly offender: ITuple<[AccountId32, Null]>;
    readonly reporters: Vec<AccountId32>;
  }

  /** @name PalletIdentityRegistration (347) */
  interface PalletIdentityRegistration extends Struct {
    readonly judgements: Vec<ITuple<[AccountId32, PalletIdentityJudgement]>>;
    readonly info: PalletIdentityLegacyIdentityInfo;
  }

  /** @name PalletIdentityRegistrarInfo (355) */
  interface PalletIdentityRegistrarInfo extends Struct {
    readonly account: AccountId32;
    readonly fields: u64;
  }

  /** @name PalletIdentityAuthorityProperties (357) */
  interface PalletIdentityAuthorityProperties extends Struct {
    readonly suffix: Bytes;
    readonly allocation: u32;
  }

  /** @name PalletIdentityError (360) */
  interface PalletIdentityError extends Enum {
    readonly isTooManySubAccounts: boolean;
    readonly isNotFound: boolean;
    readonly isRegistrarNotFound: boolean;
    readonly isRegistrarAlreadyExists: boolean;
    readonly isNotNamed: boolean;
    readonly isEmptyIndex: boolean;
    readonly isNoIdentity: boolean;
    readonly isStickyJudgement: boolean;
    readonly isJudgementGiven: boolean;
    readonly isInvalidJudgement: boolean;
    readonly isInvalidIndex: boolean;
    readonly isInvalidTarget: boolean;
    readonly isTooManyFields: boolean;
    readonly isTooManyRegistrars: boolean;
    readonly isAlreadyClaimed: boolean;
    readonly isNotSub: boolean;
    readonly isNotOwned: boolean;
    readonly isJudgementForDifferentIdentity: boolean;
    readonly isJudgementPaymentFailed: boolean;
    readonly isInvalidSuffix: boolean;
    readonly isNotUsernameAuthority: boolean;
    readonly isNoAllocation: boolean;
    readonly isInvalidSignature: boolean;
    readonly isRequiresSignature: boolean;
    readonly isInvalidUsername: boolean;
    readonly isUsernameTaken: boolean;
    readonly isNoUsername: boolean;
    readonly isNotExpired: boolean;
    readonly type: 'TooManySubAccounts' | 'NotFound' | 'RegistrarNotFound' | 'RegistrarAlreadyExists' | 'NotNamed' | 'EmptyIndex' | 'NoIdentity' | 'StickyJudgement' | 'JudgementGiven' | 'InvalidJudgement' | 'InvalidIndex' | 'InvalidTarget' | 'TooManyFields' | 'TooManyRegistrars' | 'AlreadyClaimed' | 'NotSub' | 'NotOwned' | 'JudgementForDifferentIdentity' | 'JudgementPaymentFailed' | 'InvalidSuffix' | 'NotUsernameAuthority' | 'NoAllocation' | 'InvalidSignature' | 'RequiresSignature' | 'InvalidUsername' | 'UsernameTaken' | 'NoUsername' | 'NotExpired';
  }

  /** @name PalletSchedulerScheduled (363) */
  interface PalletSchedulerScheduled extends Struct {
    readonly maybeId: Option<U8aFixed>;
    readonly priority: u8;
    readonly call: FrameSupportPreimagesBounded;
    readonly maybePeriodic: Option<ITuple<[u32, u32]>>;
    readonly origin: CordLoomRuntimeOriginCaller;
  }

  /** @name FrameSupportPreimagesBounded (364) */
  interface FrameSupportPreimagesBounded extends Enum {
    readonly isLegacy: boolean;
    readonly asLegacy: {
      readonly hash_: H256;
    } & Struct;
    readonly isInline: boolean;
    readonly asInline: Bytes;
    readonly isLookup: boolean;
    readonly asLookup: {
      readonly hash_: H256;
      readonly len: u32;
    } & Struct;
    readonly type: 'Legacy' | 'Inline' | 'Lookup';
  }

  /** @name SpRuntimeBlakeTwo256 (365) */
  type SpRuntimeBlakeTwo256 = Null;

  /** @name PalletSchedulerRetryConfig (367) */
  interface PalletSchedulerRetryConfig extends Struct {
    readonly totalRetries: u8;
    readonly remaining: u8;
    readonly period: u32;
  }

  /** @name PalletSchedulerError (368) */
  interface PalletSchedulerError extends Enum {
    readonly isFailedToSchedule: boolean;
    readonly isNotFound: boolean;
    readonly isTargetBlockNumberInPast: boolean;
    readonly isRescheduleNoChange: boolean;
    readonly isNamed: boolean;
    readonly type: 'FailedToSchedule' | 'NotFound' | 'TargetBlockNumberInPast' | 'RescheduleNoChange' | 'Named';
  }

  /** @name PalletPreimageOldRequestStatus (369) */
  interface PalletPreimageOldRequestStatus extends Enum {
    readonly isUnrequested: boolean;
    readonly asUnrequested: {
      readonly deposit: ITuple<[AccountId32, u128]>;
      readonly len: u32;
    } & Struct;
    readonly isRequested: boolean;
    readonly asRequested: {
      readonly deposit: Option<ITuple<[AccountId32, u128]>>;
      readonly count: u32;
      readonly len: Option<u32>;
    } & Struct;
    readonly type: 'Unrequested' | 'Requested';
  }

  /** @name PalletPreimageRequestStatus (372) */
  interface PalletPreimageRequestStatus extends Enum {
    readonly isUnrequested: boolean;
    readonly asUnrequested: {
      readonly ticket: ITuple<[AccountId32, u128]>;
      readonly len: u32;
    } & Struct;
    readonly isRequested: boolean;
    readonly asRequested: {
      readonly maybeTicket: Option<ITuple<[AccountId32, u128]>>;
      readonly count: u32;
      readonly maybeLen: Option<u32>;
    } & Struct;
    readonly type: 'Unrequested' | 'Requested';
  }

  /** @name PalletPreimageError (377) */
  interface PalletPreimageError extends Enum {
    readonly isTooBig: boolean;
    readonly isAlreadyNoted: boolean;
    readonly isNotAuthorized: boolean;
    readonly isNotNoted: boolean;
    readonly isRequested: boolean;
    readonly isNotRequested: boolean;
    readonly isTooMany: boolean;
    readonly isTooFew: boolean;
    readonly isNoCost: boolean;
    readonly type: 'TooBig' | 'AlreadyNoted' | 'NotAuthorized' | 'NotNoted' | 'Requested' | 'NotRequested' | 'TooMany' | 'TooFew' | 'NoCost';
  }

  /** @name PalletMultisigMultisig (379) */
  interface PalletMultisigMultisig extends Struct {
    readonly when: PalletMultisigTimepoint;
    readonly deposit: u128;
    readonly depositor: AccountId32;
    readonly approvals: Vec<AccountId32>;
  }

  /** @name PalletMultisigError (381) */
  interface PalletMultisigError extends Enum {
    readonly isMinimumThreshold: boolean;
    readonly isAlreadyApproved: boolean;
    readonly isNoApprovalsNeeded: boolean;
    readonly isTooFewSignatories: boolean;
    readonly isTooManySignatories: boolean;
    readonly isSignatoriesOutOfOrder: boolean;
    readonly isSenderInSignatories: boolean;
    readonly isNotFound: boolean;
    readonly isNotOwner: boolean;
    readonly isNoTimepoint: boolean;
    readonly isWrongTimepoint: boolean;
    readonly isUnexpectedTimepoint: boolean;
    readonly isMaxWeightTooLow: boolean;
    readonly isAlreadyStored: boolean;
    readonly type: 'MinimumThreshold' | 'AlreadyApproved' | 'NoApprovalsNeeded' | 'TooFewSignatories' | 'TooManySignatories' | 'SignatoriesOutOfOrder' | 'SenderInSignatories' | 'NotFound' | 'NotOwner' | 'NoTimepoint' | 'WrongTimepoint' | 'UnexpectedTimepoint' | 'MaxWeightTooLow' | 'AlreadyStored';
  }

  /** @name PalletNodeAuthorizationNodeInfo (384) */
  interface PalletNodeAuthorizationNodeInfo extends Struct {
    readonly id: Bytes;
    readonly owner: AccountId32;
  }

  /** @name PalletNodeAuthorizationError (386) */
  interface PalletNodeAuthorizationError extends Enum {
    readonly isNodeIdTooLong: boolean;
    readonly isPeerIdTooLong: boolean;
    readonly isTooManyNodes: boolean;
    readonly isAlreadyJoined: boolean;
    readonly isNotExist: boolean;
    readonly isAlreadyClaimed: boolean;
    readonly isNotOwner: boolean;
    readonly isPermissionDenied: boolean;
    readonly isInvalidUtf8: boolean;
    readonly isInvalidNodeIdentifier: boolean;
    readonly isAlreadyConnected: boolean;
    readonly type: 'NodeIdTooLong' | 'PeerIdTooLong' | 'TooManyNodes' | 'AlreadyJoined' | 'NotExist' | 'AlreadyClaimed' | 'NotOwner' | 'PermissionDenied' | 'InvalidUtf8' | 'InvalidNodeIdentifier' | 'AlreadyConnected';
  }

  /** @name PalletAssetsAssetDetails (387) */
  interface PalletAssetsAssetDetails extends Struct {
    readonly owner: AccountId32;
    readonly issuer: AccountId32;
    readonly admin: AccountId32;
    readonly freezer: AccountId32;
    readonly supply: u128;
    readonly deposit: u128;
    readonly minBalance: u128;
    readonly isSufficient: bool;
    readonly accounts: u32;
    readonly sufficients: u32;
    readonly approvals: u32;
    readonly status: PalletAssetsAssetStatus;
  }

  /** @name PalletAssetsAssetStatus (388) */
  interface PalletAssetsAssetStatus extends Enum {
    readonly isLive: boolean;
    readonly isFrozen: boolean;
    readonly isDestroying: boolean;
    readonly type: 'Live' | 'Frozen' | 'Destroying';
  }

  /** @name PalletAssetsAssetAccount (389) */
  interface PalletAssetsAssetAccount extends Struct {
    readonly balance: u128;
    readonly status: PalletAssetsAccountStatus;
    readonly reason: PalletAssetsExistenceReason;
    readonly extra: Null;
  }

  /** @name PalletAssetsAccountStatus (390) */
  interface PalletAssetsAccountStatus extends Enum {
    readonly isLiquid: boolean;
    readonly isFrozen: boolean;
    readonly isBlocked: boolean;
    readonly type: 'Liquid' | 'Frozen' | 'Blocked';
  }

  /** @name PalletAssetsExistenceReason (391) */
  interface PalletAssetsExistenceReason extends Enum {
    readonly isConsumer: boolean;
    readonly isSufficient: boolean;
    readonly isDepositHeld: boolean;
    readonly asDepositHeld: u128;
    readonly isDepositRefunded: boolean;
    readonly isDepositFrom: boolean;
    readonly asDepositFrom: ITuple<[AccountId32, u128]>;
    readonly type: 'Consumer' | 'Sufficient' | 'DepositHeld' | 'DepositRefunded' | 'DepositFrom';
  }

  /** @name PalletAssetsApproval (393) */
  interface PalletAssetsApproval extends Struct {
    readonly amount: u128;
    readonly deposit: u128;
  }

  /** @name PalletAssetsAssetMetadata (394) */
  interface PalletAssetsAssetMetadata extends Struct {
    readonly deposit: u128;
    readonly name: Bytes;
    readonly symbol: Bytes;
    readonly decimals: u8;
    readonly isFrozen: bool;
  }

  /** @name PalletAssetsError (396) */
  interface PalletAssetsError extends Enum {
    readonly isBalanceLow: boolean;
    readonly isNoAccount: boolean;
    readonly isNoPermission: boolean;
    readonly isUnknown: boolean;
    readonly isFrozen: boolean;
    readonly isInUse: boolean;
    readonly isBadWitness: boolean;
    readonly isMinBalanceZero: boolean;
    readonly isUnavailableConsumer: boolean;
    readonly isBadMetadata: boolean;
    readonly isUnapproved: boolean;
    readonly isWouldDie: boolean;
    readonly isAlreadyExists: boolean;
    readonly isNoDeposit: boolean;
    readonly isWouldBurn: boolean;
    readonly isLiveAsset: boolean;
    readonly isAssetNotLive: boolean;
    readonly isIncorrectStatus: boolean;
    readonly isNotFrozen: boolean;
    readonly isCallbackFailed: boolean;
    readonly isBadAssetId: boolean;
    readonly type: 'BalanceLow' | 'NoAccount' | 'NoPermission' | 'Unknown' | 'Frozen' | 'InUse' | 'BadWitness' | 'MinBalanceZero' | 'UnavailableConsumer' | 'BadMetadata' | 'Unapproved' | 'WouldDie' | 'AlreadyExists' | 'NoDeposit' | 'WouldBurn' | 'LiveAsset' | 'AssetNotLive' | 'IncorrectStatus' | 'NotFrozen' | 'CallbackFailed' | 'BadAssetId';
  }

  /** @name PalletContractsWasmCodeInfo (399) */
  interface PalletContractsWasmCodeInfo extends Struct {
    readonly owner: AccountId32;
    readonly deposit: Compact<u128>;
    readonly refcount: Compact<u64>;
    readonly determinism: PalletContractsWasmDeterminism;
    readonly codeLen: u32;
  }

  /** @name PalletContractsStorageContractInfo (400) */
  interface PalletContractsStorageContractInfo extends Struct {
    readonly trieId: Bytes;
    readonly codeHash: H256;
    readonly storageBytes: u32;
    readonly storageItems: u32;
    readonly storageByteDeposit: u128;
    readonly storageItemDeposit: u128;
    readonly storageBaseDeposit: u128;
    readonly delegateDependencies: BTreeMap<H256, u128>;
  }

  /** @name PalletContractsStorageDeletionQueueManager (405) */
  interface PalletContractsStorageDeletionQueueManager extends Struct {
    readonly insertCounter: u32;
    readonly deleteCounter: u32;
  }

  /** @name PalletContractsSchedule (407) */
  interface PalletContractsSchedule extends Struct {
    readonly limits: PalletContractsScheduleLimits;
    readonly instructionWeights: PalletContractsScheduleInstructionWeights;
  }

  /** @name PalletContractsScheduleLimits (408) */
  interface PalletContractsScheduleLimits extends Struct {
    readonly eventTopics: u32;
    readonly memoryPages: u32;
    readonly subjectLen: u32;
    readonly payloadLen: u32;
    readonly runtimeMemory: u32;
  }

  /** @name PalletContractsScheduleInstructionWeights (409) */
  interface PalletContractsScheduleInstructionWeights extends Struct {
    readonly base: u32;
  }

  /** @name PalletContractsEnvironment (410) */
  interface PalletContractsEnvironment extends Struct {
    readonly accountId: PalletContractsEnvironmentTypeAccountId32;
    readonly balance: PalletContractsEnvironmentTypeU128;
    readonly hash_: PalletContractsEnvironmentTypeH256;
    readonly hasher: PalletContractsEnvironmentTypeBlakeTwo256;
    readonly timestamp: PalletContractsEnvironmentTypeU64;
    readonly blockNumber: PalletContractsEnvironmentTypeU32;
  }

  /** @name PalletContractsEnvironmentTypeAccountId32 (411) */
  type PalletContractsEnvironmentTypeAccountId32 = Null;

  /** @name PalletContractsEnvironmentTypeU128 (412) */
  type PalletContractsEnvironmentTypeU128 = Null;

  /** @name PalletContractsEnvironmentTypeH256 (413) */
  type PalletContractsEnvironmentTypeH256 = Null;

  /** @name PalletContractsEnvironmentTypeBlakeTwo256 (414) */
  type PalletContractsEnvironmentTypeBlakeTwo256 = Null;

  /** @name PalletContractsEnvironmentTypeU64 (415) */
  type PalletContractsEnvironmentTypeU64 = Null;

  /** @name PalletContractsEnvironmentTypeU32 (416) */
  type PalletContractsEnvironmentTypeU32 = Null;

  /** @name PalletContractsError (418) */
  interface PalletContractsError extends Enum {
    readonly isInvalidSchedule: boolean;
    readonly isInvalidCallFlags: boolean;
    readonly isOutOfGas: boolean;
    readonly isOutputBufferTooSmall: boolean;
    readonly isTransferFailed: boolean;
    readonly isMaxCallDepthReached: boolean;
    readonly isContractNotFound: boolean;
    readonly isCodeTooLarge: boolean;
    readonly isCodeNotFound: boolean;
    readonly isCodeInfoNotFound: boolean;
    readonly isOutOfBounds: boolean;
    readonly isDecodingFailed: boolean;
    readonly isContractTrapped: boolean;
    readonly isValueTooLarge: boolean;
    readonly isTerminatedWhileReentrant: boolean;
    readonly isInputForwarded: boolean;
    readonly isRandomSubjectTooLong: boolean;
    readonly isTooManyTopics: boolean;
    readonly isNoChainExtension: boolean;
    readonly isXcmDecodeFailed: boolean;
    readonly isDuplicateContract: boolean;
    readonly isTerminatedInConstructor: boolean;
    readonly isReentranceDenied: boolean;
    readonly isStateChangeDenied: boolean;
    readonly isStorageDepositNotEnoughFunds: boolean;
    readonly isStorageDepositLimitExhausted: boolean;
    readonly isCodeInUse: boolean;
    readonly isContractReverted: boolean;
    readonly isCodeRejected: boolean;
    readonly isIndeterministic: boolean;
    readonly isMigrationInProgress: boolean;
    readonly isNoMigrationPerformed: boolean;
    readonly isMaxDelegateDependenciesReached: boolean;
    readonly isDelegateDependencyNotFound: boolean;
    readonly isDelegateDependencyAlreadyExists: boolean;
    readonly isCannotAddSelfAsDelegateDependency: boolean;
    readonly isOutOfTransientStorage: boolean;
    readonly type: 'InvalidSchedule' | 'InvalidCallFlags' | 'OutOfGas' | 'OutputBufferTooSmall' | 'TransferFailed' | 'MaxCallDepthReached' | 'ContractNotFound' | 'CodeTooLarge' | 'CodeNotFound' | 'CodeInfoNotFound' | 'OutOfBounds' | 'DecodingFailed' | 'ContractTrapped' | 'ValueTooLarge' | 'TerminatedWhileReentrant' | 'InputForwarded' | 'RandomSubjectTooLong' | 'TooManyTopics' | 'NoChainExtension' | 'XcmDecodeFailed' | 'DuplicateContract' | 'TerminatedInConstructor' | 'ReentranceDenied' | 'StateChangeDenied' | 'StorageDepositNotEnoughFunds' | 'StorageDepositLimitExhausted' | 'CodeInUse' | 'ContractReverted' | 'CodeRejected' | 'Indeterministic' | 'MigrationInProgress' | 'NoMigrationPerformed' | 'MaxDelegateDependenciesReached' | 'DelegateDependencyNotFound' | 'DelegateDependencyAlreadyExists' | 'CannotAddSelfAsDelegateDependency' | 'OutOfTransientStorage';
  }

  /** @name CordIdentifierIdentifierTypeOf (420) */
  interface CordIdentifierIdentifierTypeOf extends Enum {
    readonly isAsset: boolean;
    readonly isAuth: boolean;
    readonly isChainSpace: boolean;
    readonly isDid: boolean;
    readonly isRating: boolean;
    readonly isRegistry: boolean;
    readonly isStatement: boolean;
    readonly isSchema: boolean;
    readonly isTemplate: boolean;
    readonly isRegistries: boolean;
    readonly isEntries: boolean;
    readonly isRegistryAuthorization: boolean;
    readonly type: 'Asset' | 'Auth' | 'ChainSpace' | 'Did' | 'Rating' | 'Registry' | 'Statement' | 'Schema' | 'Template' | 'Registries' | 'Entries' | 'RegistryAuthorization';
  }

  /** @name CordIdentifierEventEntry (422) */
  interface CordIdentifierEventEntry extends Struct {
    readonly action: CordIdentifierCallTypeOf;
    readonly location: CordIdentifierTimepoint;
  }

  /** @name CordIdentifierCallTypeOf (423) */
  interface CordIdentifierCallTypeOf extends Enum {
    readonly isArchive: boolean;
    readonly isAuthorization: boolean;
    readonly isCapacity: boolean;
    readonly isCouncilRevoke: boolean;
    readonly isCouncilRestore: boolean;
    readonly isDeauthorization: boolean;
    readonly isApproved: boolean;
    readonly isGenesis: boolean;
    readonly isUpdate: boolean;
    readonly isRevoke: boolean;
    readonly isRestore: boolean;
    readonly isRemove: boolean;
    readonly isPartialRemove: boolean;
    readonly isPresentationAdded: boolean;
    readonly isPresentationRemoved: boolean;
    readonly isRotate: boolean;
    readonly isUsage: boolean;
    readonly isTransfer: boolean;
    readonly isDebit: boolean;
    readonly isCredit: boolean;
    readonly isIssue: boolean;
    readonly isReinstate: boolean;
    readonly type: 'Archive' | 'Authorization' | 'Capacity' | 'CouncilRevoke' | 'CouncilRestore' | 'Deauthorization' | 'Approved' | 'Genesis' | 'Update' | 'Revoke' | 'Restore' | 'Remove' | 'PartialRemove' | 'PresentationAdded' | 'PresentationRemoved' | 'Rotate' | 'Usage' | 'Transfer' | 'Debit' | 'Credit' | 'Issue' | 'Reinstate';
  }

  /** @name CordIdentifierTimepoint (424) */
  interface CordIdentifierTimepoint extends Struct {
    readonly height: u32;
    readonly index: u32;
  }

  /** @name CordIdentifierError (426) */
  interface CordIdentifierError extends Enum {
    readonly isMaxEventsHistoryExceeded: boolean;
    readonly type: 'MaxEventsHistoryExceeded';
  }

  /** @name PalletNetworkMembershipMemberData (427) */
  interface PalletNetworkMembershipMemberData extends Struct {
    readonly expireOn: u32;
  }

  /** @name PalletNetworkMembershipError (429) */
  interface PalletNetworkMembershipError extends Enum {
    readonly isMembershipNotFound: boolean;
    readonly isMembershipAlreadyAcquired: boolean;
    readonly isMembershipRenewalAlreadyRequested: boolean;
    readonly isOriginNotAuthorized: boolean;
    readonly isMembershipRequestRejected: boolean;
    readonly isMembershipExpired: boolean;
    readonly isMaxMembersExceededForTheBlock: boolean;
    readonly type: 'MembershipNotFound' | 'MembershipAlreadyAcquired' | 'MembershipRenewalAlreadyRequested' | 'OriginNotAuthorized' | 'MembershipRequestRejected' | 'MembershipExpired' | 'MaxMembersExceededForTheBlock';
  }

  /** @name PalletDidDidDetails (430) */
  interface PalletDidDidDetails extends Struct {
    readonly authenticationKey: H256;
    readonly keyAgreementKeys: BTreeSet<H256>;
    readonly delegationKey: Option<H256>;
    readonly assertionKey: Option<H256>;
    readonly publicKeys: BTreeMap<H256, PalletDidDidDetailsDidPublicKeyDetails>;
    readonly lastTxCounter: u64;
  }

  /** @name PalletDidDidDetailsDidPublicKeyDetails (435) */
  interface PalletDidDidDetailsDidPublicKeyDetails extends Struct {
    readonly key: PalletDidDidDetailsDidPublicKey;
    readonly blockNumber: u32;
  }

  /** @name PalletDidDidDetailsDidPublicKey (436) */
  interface PalletDidDidDetailsDidPublicKey extends Enum {
    readonly isPublicVerificationKey: boolean;
    readonly asPublicVerificationKey: PalletDidDidDetailsDidVerificationKey;
    readonly isPublicEncryptionKey: boolean;
    readonly asPublicEncryptionKey: PalletDidDidDetailsDidEncryptionKey;
    readonly type: 'PublicVerificationKey' | 'PublicEncryptionKey';
  }

  /** @name PalletDidError (441) */
  interface PalletDidError extends Enum {
    readonly isInvalidSignatureFormat: boolean;
    readonly isInvalidSignature: boolean;
    readonly isAlreadyExists: boolean;
    readonly isNotFound: boolean;
    readonly isVerificationKeyNotFound: boolean;
    readonly isInvalidNonce: boolean;
    readonly isUnsupportedDidAuthorizationCall: boolean;
    readonly isInvalidDidAuthorizationCall: boolean;
    readonly isMaxNewKeyAgreementKeysLimitExceeded: boolean;
    readonly isMaxPublicKeysExceeded: boolean;
    readonly isMaxKeyAgreementKeysExceeded: boolean;
    readonly isBadDidOrigin: boolean;
    readonly isTransactionExpired: boolean;
    readonly isAlreadyDeleted: boolean;
    readonly isMaxNumberOfServicesExceeded: boolean;
    readonly isMaxServiceIdLengthExceeded: boolean;
    readonly isMaxServiceTypeLengthExceeded: boolean;
    readonly isMaxNumberOfTypesPerServiceExceeded: boolean;
    readonly isMaxServiceUrlLengthExceeded: boolean;
    readonly isMaxNumberOfUrlsPerServiceExceeded: boolean;
    readonly isServiceAlreadyExists: boolean;
    readonly isServiceNotFound: boolean;
    readonly isInvalidServiceEncoding: boolean;
    readonly isMaxStoredEndpointsCountExceeded: boolean;
    readonly isInternal: boolean;
    readonly type: 'InvalidSignatureFormat' | 'InvalidSignature' | 'AlreadyExists' | 'NotFound' | 'VerificationKeyNotFound' | 'InvalidNonce' | 'UnsupportedDidAuthorizationCall' | 'InvalidDidAuthorizationCall' | 'MaxNewKeyAgreementKeysLimitExceeded' | 'MaxPublicKeysExceeded' | 'MaxKeyAgreementKeysExceeded' | 'BadDidOrigin' | 'TransactionExpired' | 'AlreadyDeleted' | 'MaxNumberOfServicesExceeded' | 'MaxServiceIdLengthExceeded' | 'MaxServiceTypeLengthExceeded' | 'MaxNumberOfTypesPerServiceExceeded' | 'MaxServiceUrlLengthExceeded' | 'MaxNumberOfUrlsPerServiceExceeded' | 'ServiceAlreadyExists' | 'ServiceNotFound' | 'InvalidServiceEncoding' | 'MaxStoredEndpointsCountExceeded' | 'Internal';
  }

  /** @name PalletSchemaSchemaEntry (442) */
  interface PalletSchemaSchemaEntry extends Struct {
    readonly schema: Bytes;
    readonly digest: H256;
    readonly creator: AccountId32;
    readonly space: Bytes;
  }

  /** @name PalletSchemaError (443) */
  interface PalletSchemaError extends Enum {
    readonly isSchemaAlreadyAnchored: boolean;
    readonly isSchemaNotFound: boolean;
    readonly isInvalidIdentifierLength: boolean;
    readonly isUnableToPayFees: boolean;
    readonly isCreatorNotFound: boolean;
    readonly isMaxEncodedSchemaLimitExceeded: boolean;
    readonly isEmptyTransaction: boolean;
    readonly type: 'SchemaAlreadyAnchored' | 'SchemaNotFound' | 'InvalidIdentifierLength' | 'UnableToPayFees' | 'CreatorNotFound' | 'MaxEncodedSchemaLimitExceeded' | 'EmptyTransaction';
  }

  /** @name PalletChainSpaceSpaceDetails (444) */
  interface PalletChainSpaceSpaceDetails extends Struct {
    readonly code: H256;
    readonly creator: AccountId32;
    readonly txnCapacity: u64;
    readonly txnReserve: u64;
    readonly txnCount: u64;
    readonly approved: bool;
    readonly archive: bool;
    readonly parent: Bytes;
  }

  /** @name PalletChainSpaceSpaceAuthorization (445) */
  interface PalletChainSpaceSpaceAuthorization extends Struct {
    readonly spaceId: Bytes;
    readonly delegate: AccountId32;
    readonly permissions: PalletChainSpacePermissions;
    readonly delegator: AccountId32;
  }

  /** @name PalletChainSpacePermissions (446) */
  interface PalletChainSpacePermissions extends Struct {
    readonly bits: u32;
  }

  /** @name PalletChainSpaceError (448) */
  interface PalletChainSpaceError extends Enum {
    readonly isSpaceAlreadyAnchored: boolean;
    readonly isSpaceNotFound: boolean;
    readonly isUnauthorizedOperation: boolean;
    readonly isInvalidIdentifier: boolean;
    readonly isInvalidIdentifierLength: boolean;
    readonly isInvalidIdentifierPrefix: boolean;
    readonly isArchivedSpace: boolean;
    readonly isSpaceNotArchived: boolean;
    readonly isSpaceDelegatesLimitExceeded: boolean;
    readonly isEmptyTransaction: boolean;
    readonly isDelegateAlreadyAdded: boolean;
    readonly isAuthorizationNotFound: boolean;
    readonly isDelegateNotFound: boolean;
    readonly isSpaceAlreadyApproved: boolean;
    readonly isSpaceNotApproved: boolean;
    readonly isCapacityLimitExceeded: boolean;
    readonly isCapacityLessThanUsage: boolean;
    readonly isCapacityValueMissing: boolean;
    readonly isTypeCapacityOverflow: boolean;
    readonly type: 'SpaceAlreadyAnchored' | 'SpaceNotFound' | 'UnauthorizedOperation' | 'InvalidIdentifier' | 'InvalidIdentifierLength' | 'InvalidIdentifierPrefix' | 'ArchivedSpace' | 'SpaceNotArchived' | 'SpaceDelegatesLimitExceeded' | 'EmptyTransaction' | 'DelegateAlreadyAdded' | 'AuthorizationNotFound' | 'DelegateNotFound' | 'SpaceAlreadyApproved' | 'SpaceNotApproved' | 'CapacityLimitExceeded' | 'CapacityLessThanUsage' | 'CapacityValueMissing' | 'TypeCapacityOverflow';
  }

  /** @name PalletStatementStatementDetails (449) */
  interface PalletStatementStatementDetails extends Struct {
    readonly digest: H256;
    readonly space: Bytes;
    readonly schema: Option<Bytes>;
  }

  /** @name PalletStatementStatementPresentationDetails (451) */
  interface PalletStatementStatementPresentationDetails extends Struct {
    readonly creator: AccountId32;
    readonly presentationType: PalletStatementPresentationTypeOf;
    readonly digest: H256;
    readonly space: Bytes;
  }

  /** @name PalletStatementStatementEntryStatus (452) */
  interface PalletStatementStatementEntryStatus extends Struct {
    readonly creator: AccountId32;
    readonly revoked: bool;
  }

  /** @name PalletStatementError (454) */
  interface PalletStatementError extends Enum {
    readonly isStatementAlreadyAnchored: boolean;
    readonly isStatementNotFound: boolean;
    readonly isUnauthorizedOperation: boolean;
    readonly isStatementEntryNotFound: boolean;
    readonly isStatementRevoked: boolean;
    readonly isStatementNotRevoked: boolean;
    readonly isStatementLinkNotFound: boolean;
    readonly isStatementLinkRevoked: boolean;
    readonly isInvalidSignature: boolean;
    readonly isHashAlreadyAnchored: boolean;
    readonly isExpiredSignature: boolean;
    readonly isInvalidStatementIdentifier: boolean;
    readonly isInvalidIdentifierLength: boolean;
    readonly isStatementSpaceMismatch: boolean;
    readonly isDigestHashAlreadyAnchored: boolean;
    readonly isInvalidTransactionHash: boolean;
    readonly isMetadataLimitExceeded: boolean;
    readonly isMetadataAlreadySet: boolean;
    readonly isMetadataNotFound: boolean;
    readonly isTooManyDelegates: boolean;
    readonly isTooManyDelegatesToRemove: boolean;
    readonly isAuthorizationDetailsNotFound: boolean;
    readonly isMaxStatementActivitiesExceeded: boolean;
    readonly isAttestationNotFound: boolean;
    readonly isMaxDigestLimitExceeded: boolean;
    readonly isBulkTransactionFailed: boolean;
    readonly isAssociateDigestAlreadyAnchored: boolean;
    readonly isPresentationDigestAlreadyAnchored: boolean;
    readonly isPresentationNotFound: boolean;
    readonly isStatementDigestAlreadyAnchored: boolean;
    readonly type: 'StatementAlreadyAnchored' | 'StatementNotFound' | 'UnauthorizedOperation' | 'StatementEntryNotFound' | 'StatementRevoked' | 'StatementNotRevoked' | 'StatementLinkNotFound' | 'StatementLinkRevoked' | 'InvalidSignature' | 'HashAlreadyAnchored' | 'ExpiredSignature' | 'InvalidStatementIdentifier' | 'InvalidIdentifierLength' | 'StatementSpaceMismatch' | 'DigestHashAlreadyAnchored' | 'InvalidTransactionHash' | 'MetadataLimitExceeded' | 'MetadataAlreadySet' | 'MetadataNotFound' | 'TooManyDelegates' | 'TooManyDelegatesToRemove' | 'AuthorizationDetailsNotFound' | 'MaxStatementActivitiesExceeded' | 'AttestationNotFound' | 'MaxDigestLimitExceeded' | 'BulkTransactionFailed' | 'AssociateDigestAlreadyAnchored' | 'PresentationDigestAlreadyAnchored' | 'PresentationNotFound' | 'StatementDigestAlreadyAnchored';
  }

  /** @name PalletDidNameDidNameDidNameOwnership (455) */
  interface PalletDidNameDidNameDidNameOwnership extends Struct {
    readonly owner: AccountId32;
    readonly registeredAt: u32;
  }

  /** @name PalletDidNameError (456) */
  interface PalletDidNameError extends Enum {
    readonly isInsufficientFunds: boolean;
    readonly isAlreadyExists: boolean;
    readonly isNotFound: boolean;
    readonly isOwnerAlreadyExists: boolean;
    readonly isOwnerNotFound: boolean;
    readonly isBanned: boolean;
    readonly isNotBanned: boolean;
    readonly isAlreadyBanned: boolean;
    readonly isNotAuthorized: boolean;
    readonly isNameTooShort: boolean;
    readonly isNameExceedsMaxLength: boolean;
    readonly isNamePrefixTooShort: boolean;
    readonly isNamePrefixTooLong: boolean;
    readonly isInvalidSuffix: boolean;
    readonly isSuffixTooLong: boolean;
    readonly isInvalidFormat: boolean;
    readonly type: 'InsufficientFunds' | 'AlreadyExists' | 'NotFound' | 'OwnerAlreadyExists' | 'OwnerNotFound' | 'Banned' | 'NotBanned' | 'AlreadyBanned' | 'NotAuthorized' | 'NameTooShort' | 'NameExceedsMaxLength' | 'NamePrefixTooShort' | 'NamePrefixTooLong' | 'InvalidSuffix' | 'SuffixTooLong' | 'InvalidFormat';
  }

  /** @name PalletNetworkScoreRatingEntry (457) */
  interface PalletNetworkScoreRatingEntry extends Struct {
    readonly entry: PalletNetworkScoreRatingInputEntry;
    readonly digest: H256;
    readonly messageId: Bytes;
    readonly space: Bytes;
    readonly creatorId: AccountId32;
    readonly entryType: PalletNetworkScoreEntryTypeOf;
    readonly referenceId: Option<Bytes>;
    readonly createdAt: u64;
  }

  /** @name PalletNetworkScoreEntryTypeOf (458) */
  interface PalletNetworkScoreEntryTypeOf extends Enum {
    readonly isCredit: boolean;
    readonly isDebit: boolean;
    readonly type: 'Credit' | 'Debit';
  }

  /** @name PalletNetworkScoreAggregatedEntryOf (460) */
  interface PalletNetworkScoreAggregatedEntryOf extends Struct {
    readonly countOfTxn: u64;
    readonly totalEncodedRating: u64;
  }

  /** @name PalletNetworkScoreError (462) */
  interface PalletNetworkScoreError extends Enum {
    readonly isUnauthorizedOperation: boolean;
    readonly isInvalidIdentifierLength: boolean;
    readonly isInvalidDigest: boolean;
    readonly isInvalidSignature: boolean;
    readonly isInvalidRatingIdentifier: boolean;
    readonly isMessageIdAlreadyExists: boolean;
    readonly isInvalidRatingValue: boolean;
    readonly isTooManyJournalEntries: boolean;
    readonly isInvalidEntitySignature: boolean;
    readonly isDigestAlreadyAnchored: boolean;
    readonly isRatingIdentifierAlreadyAdded: boolean;
    readonly isInvalidRatingType: boolean;
    readonly isRatingIdentifierNotFound: boolean;
    readonly isReferenceIdentifierNotFound: boolean;
    readonly isReferenceNotDebitIdentifier: boolean;
    readonly isEntityMismatch: boolean;
    readonly isSpaceMismatch: boolean;
    readonly type: 'UnauthorizedOperation' | 'InvalidIdentifierLength' | 'InvalidDigest' | 'InvalidSignature' | 'InvalidRatingIdentifier' | 'MessageIdAlreadyExists' | 'InvalidRatingValue' | 'TooManyJournalEntries' | 'InvalidEntitySignature' | 'DigestAlreadyAnchored' | 'RatingIdentifierAlreadyAdded' | 'InvalidRatingType' | 'RatingIdentifierNotFound' | 'ReferenceIdentifierNotFound' | 'ReferenceNotDebitIdentifier' | 'EntityMismatch' | 'SpaceMismatch';
  }

  /** @name PalletAssetConversionPoolInfo (463) */
  interface PalletAssetConversionPoolInfo extends Struct {
    readonly lpToken: u32;
  }

  /** @name PalletAssetConversionError (464) */
  interface PalletAssetConversionError extends Enum {
    readonly isInvalidAssetPair: boolean;
    readonly isPoolExists: boolean;
    readonly isWrongDesiredAmount: boolean;
    readonly isAmountOneLessThanMinimal: boolean;
    readonly isAmountTwoLessThanMinimal: boolean;
    readonly isReserveLeftLessThanMinimal: boolean;
    readonly isAmountOutTooHigh: boolean;
    readonly isPoolNotFound: boolean;
    readonly isOverflow: boolean;
    readonly isAssetOneDepositDidNotMeetMinimum: boolean;
    readonly isAssetTwoDepositDidNotMeetMinimum: boolean;
    readonly isAssetOneWithdrawalDidNotMeetMinimum: boolean;
    readonly isAssetTwoWithdrawalDidNotMeetMinimum: boolean;
    readonly isOptimalAmountLessThanDesired: boolean;
    readonly isInsufficientLiquidityMinted: boolean;
    readonly isZeroLiquidity: boolean;
    readonly isZeroAmount: boolean;
    readonly isProvidedMinimumNotSufficientForSwap: boolean;
    readonly isProvidedMaximumNotSufficientForSwap: boolean;
    readonly isInvalidPath: boolean;
    readonly isNonUniquePath: boolean;
    readonly isIncorrectPoolAssetId: boolean;
    readonly isBelowMinimum: boolean;
    readonly type: 'InvalidAssetPair' | 'PoolExists' | 'WrongDesiredAmount' | 'AmountOneLessThanMinimal' | 'AmountTwoLessThanMinimal' | 'ReserveLeftLessThanMinimal' | 'AmountOutTooHigh' | 'PoolNotFound' | 'Overflow' | 'AssetOneDepositDidNotMeetMinimum' | 'AssetTwoDepositDidNotMeetMinimum' | 'AssetOneWithdrawalDidNotMeetMinimum' | 'AssetTwoWithdrawalDidNotMeetMinimum' | 'OptimalAmountLessThanDesired' | 'InsufficientLiquidityMinted' | 'ZeroLiquidity' | 'ZeroAmount' | 'ProvidedMinimumNotSufficientForSwap' | 'ProvidedMaximumNotSufficientForSwap' | 'InvalidPath' | 'NonUniquePath' | 'IncorrectPoolAssetId' | 'BelowMinimum';
  }

  /** @name PalletRemarkError (465) */
  interface PalletRemarkError extends Enum {
    readonly isEmpty: boolean;
    readonly isBadContext: boolean;
    readonly type: 'Empty' | 'BadContext';
  }

  /** @name PalletRegistriesRegistryDetails (466) */
  interface PalletRegistriesRegistryDetails extends Struct {
    readonly creator: AccountId32;
    readonly revoked: bool;
    readonly archived: bool;
    readonly digest: H256;
  }

  /** @name PalletRegistriesRegistryAuthorization (467) */
  interface PalletRegistriesRegistryAuthorization extends Struct {
    readonly registryId: Bytes;
    readonly delegate: AccountId32;
    readonly permissions: PalletRegistriesPermissions;
    readonly delegator: AccountId32;
  }

  /** @name PalletRegistriesPermissions (468) */
  interface PalletRegistriesPermissions extends Struct {
    readonly bits: u32;
  }

  /** @name PalletRegistriesError (470) */
  interface PalletRegistriesError extends Enum {
    readonly isRegistryAlreadyAnchored: boolean;
    readonly isRegistryNotFound: boolean;
    readonly isUnauthorizedOperation: boolean;
    readonly isInvalidIdentifier: boolean;
    readonly isInvalidIdentifierLength: boolean;
    readonly isRegistryDelegatesLimitExceeded: boolean;
    readonly isDelegateAlreadyAdded: boolean;
    readonly isAuthorizationNotFound: boolean;
    readonly isDelegateNotFound: boolean;
    readonly isRegistryNotRevoked: boolean;
    readonly isRegistryAlreadyRevoked: boolean;
    readonly isRegistryRevoked: boolean;
    readonly isRegistryNotArchived: boolean;
    readonly isRegistryAlreadyArchived: boolean;
    readonly isRegistryArchived: boolean;
    readonly type: 'RegistryAlreadyAnchored' | 'RegistryNotFound' | 'UnauthorizedOperation' | 'InvalidIdentifier' | 'InvalidIdentifierLength' | 'RegistryDelegatesLimitExceeded' | 'DelegateAlreadyAdded' | 'AuthorizationNotFound' | 'DelegateNotFound' | 'RegistryNotRevoked' | 'RegistryAlreadyRevoked' | 'RegistryRevoked' | 'RegistryNotArchived' | 'RegistryAlreadyArchived' | 'RegistryArchived';
  }

  /** @name PalletEntriesRegistryEntryDetails (471) */
  interface PalletEntriesRegistryEntryDetails extends Struct {
    readonly digest: H256;
    readonly revoked: bool;
    readonly creator: AccountId32;
    readonly registryId: Bytes;
  }

  /** @name PalletEntriesError (472) */
  interface PalletEntriesError extends Enum {
    readonly isInvalidIdentifierLength: boolean;
    readonly isInvalidRegistryEntryIdentifier: boolean;
    readonly isUnauthorizedOperation: boolean;
    readonly isRegistryEntryIdentifierAlreadyExists: boolean;
    readonly isRegistryEntryIdentifierDoesNotExist: boolean;
    readonly isRegistryEntryNotRevoked: boolean;
    readonly type: 'InvalidIdentifierLength' | 'InvalidRegistryEntryIdentifier' | 'UnauthorizedOperation' | 'RegistryEntryIdentifierAlreadyExists' | 'RegistryEntryIdentifierDoesNotExist' | 'RegistryEntryNotRevoked';
  }

  /** @name PalletSudoError (473) */
  interface PalletSudoError extends Enum {
    readonly isRequireSudo: boolean;
    readonly type: 'RequireSudo';
  }

  /** @name PalletNetworkMembershipCheckNetworkMembership (476) */
  type PalletNetworkMembershipCheckNetworkMembership = Null;

  /** @name FrameSystemExtensionsCheckNonZeroSender (477) */
  type FrameSystemExtensionsCheckNonZeroSender = Null;

  /** @name FrameSystemExtensionsCheckSpecVersion (478) */
  type FrameSystemExtensionsCheckSpecVersion = Null;

  /** @name FrameSystemExtensionsCheckTxVersion (479) */
  type FrameSystemExtensionsCheckTxVersion = Null;

  /** @name FrameSystemExtensionsCheckGenesis (480) */
  type FrameSystemExtensionsCheckGenesis = Null;

  /** @name FrameSystemExtensionsCheckNonce (483) */
  interface FrameSystemExtensionsCheckNonce extends Compact<u32> {}

  /** @name FrameSystemExtensionsCheckWeight (484) */
  type FrameSystemExtensionsCheckWeight = Null;

  /** @name PalletTransactionPaymentChargeTransactionPayment (485) */
  interface PalletTransactionPaymentChargeTransactionPayment extends Compact<u128> {}

} // declare module
