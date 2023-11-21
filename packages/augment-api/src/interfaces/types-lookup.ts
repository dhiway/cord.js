// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/types/lookup';

import type { Data } from '@polkadot/types';
import type { BTreeMap, BTreeSet, Bytes, Compact, Enum, Null, Option, Result, Set, Struct, Text, U8aFixed, Vec, bool, u128, u16, u32, u64, u8 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { OpaquePeerId } from '@polkadot/types/interfaces/imOnline';
import type { AccountId32, Call, H256, MultiAddress } from '@polkadot/types/interfaces/runtime';
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

  /** @name FrameSupportDispatchPerDispatchClassWeight (8) */
  interface FrameSupportDispatchPerDispatchClassWeight extends Struct {
    readonly normal: SpWeightsWeightV2Weight;
    readonly operational: SpWeightsWeightV2Weight;
    readonly mandatory: SpWeightsWeightV2Weight;
  }

  /** @name SpWeightsWeightV2Weight (9) */
  interface SpWeightsWeightV2Weight extends Struct {
    readonly refTime: Compact<u64>;
    readonly proofSize: Compact<u64>;
  }

  /** @name SpRuntimeDigest (14) */
  interface SpRuntimeDigest extends Struct {
    readonly logs: Vec<SpRuntimeDigestDigestItem>;
  }

  /** @name SpRuntimeDigestDigestItem (16) */
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

  /** @name FrameSystemEventRecord (19) */
  interface FrameSystemEventRecord extends Struct {
    readonly phase: FrameSystemPhase;
    readonly event: Event;
    readonly topics: Vec<H256>;
  }

  /** @name FrameSystemEvent (21) */
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
    readonly type: 'ExtrinsicSuccess' | 'ExtrinsicFailed' | 'CodeUpdated' | 'NewAccount' | 'KilledAccount' | 'Remarked';
  }

  /** @name FrameSupportDispatchDispatchInfo (22) */
  interface FrameSupportDispatchDispatchInfo extends Struct {
    readonly weight: SpWeightsWeightV2Weight;
    readonly class: FrameSupportDispatchDispatchClass;
    readonly paysFee: FrameSupportDispatchPays;
  }

  /** @name FrameSupportDispatchDispatchClass (23) */
  interface FrameSupportDispatchDispatchClass extends Enum {
    readonly isNormal: boolean;
    readonly isOperational: boolean;
    readonly isMandatory: boolean;
    readonly type: 'Normal' | 'Operational' | 'Mandatory';
  }

  /** @name FrameSupportDispatchPays (24) */
  interface FrameSupportDispatchPays extends Enum {
    readonly isYes: boolean;
    readonly isNo: boolean;
    readonly type: 'Yes' | 'No';
  }

  /** @name SpRuntimeDispatchError (25) */
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

  /** @name SpRuntimeModuleError (26) */
  interface SpRuntimeModuleError extends Struct {
    readonly index: u8;
    readonly error: U8aFixed;
  }

  /** @name SpRuntimeTokenError (27) */
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

  /** @name SpArithmeticArithmeticError (28) */
  interface SpArithmeticArithmeticError extends Enum {
    readonly isUnderflow: boolean;
    readonly isOverflow: boolean;
    readonly isDivisionByZero: boolean;
    readonly type: 'Underflow' | 'Overflow' | 'DivisionByZero';
  }

  /** @name SpRuntimeTransactionalError (29) */
  interface SpRuntimeTransactionalError extends Enum {
    readonly isLimitReached: boolean;
    readonly isNoLayer: boolean;
    readonly type: 'LimitReached' | 'NoLayer';
  }

  /** @name PalletSchedulerEvent (30) */
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
    readonly isPermanentlyOverweight: boolean;
    readonly asPermanentlyOverweight: {
      readonly task: ITuple<[u32, u32]>;
      readonly id: Option<U8aFixed>;
    } & Struct;
    readonly type: 'Scheduled' | 'Canceled' | 'Dispatched' | 'CallUnavailable' | 'PeriodicFailed' | 'PermanentlyOverweight';
  }

  /** @name PalletIndicesEvent (35) */
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

  /** @name PalletBalancesEvent (36) */
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
    readonly type: 'Endowed' | 'DustLost' | 'Transfer' | 'BalanceSet' | 'Reserved' | 'Unreserved' | 'ReserveRepatriated' | 'Deposit' | 'Withdraw' | 'Slashed' | 'Minted' | 'Burned' | 'Suspended' | 'Restored' | 'Upgraded' | 'Issued' | 'Rescinded' | 'Locked' | 'Unlocked' | 'Frozen' | 'Thawed';
  }

  /** @name FrameSupportTokensMiscBalanceStatus (37) */
  interface FrameSupportTokensMiscBalanceStatus extends Enum {
    readonly isFree: boolean;
    readonly isReserved: boolean;
    readonly type: 'Free' | 'Reserved';
  }

  /** @name CordAuthorityMembershipEvent (38) */
  interface CordAuthorityMembershipEvent extends Enum {
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
    readonly type: 'IncomingAuthorities' | 'OutgoingAuthorities' | 'MemberAdded' | 'MemberGoOffline' | 'MemberGoOnline' | 'MemberRemoved' | 'MemberWhiteList';
  }

  /** @name PalletOffencesEvent (40) */
  interface PalletOffencesEvent extends Enum {
    readonly isOffence: boolean;
    readonly asOffence: {
      readonly kind: U8aFixed;
      readonly timeslot: Bytes;
    } & Struct;
    readonly type: 'Offence';
  }

  /** @name PalletSessionEvent (42) */
  interface PalletSessionEvent extends Enum {
    readonly isNewSession: boolean;
    readonly asNewSession: {
      readonly sessionIndex: u32;
    } & Struct;
    readonly type: 'NewSession';
  }

  /** @name PalletGrandpaEvent (43) */
  interface PalletGrandpaEvent extends Enum {
    readonly isNewAuthorities: boolean;
    readonly asNewAuthorities: {
      readonly authoritySet: Vec<ITuple<[SpConsensusGrandpaAppPublic, u64]>>;
    } & Struct;
    readonly isPaused: boolean;
    readonly isResumed: boolean;
    readonly type: 'NewAuthorities' | 'Paused' | 'Resumed';
  }

  /** @name SpConsensusGrandpaAppPublic (46) */
  interface SpConsensusGrandpaAppPublic extends SpCoreEd25519Public {}

  /** @name SpCoreEd25519Public (47) */
  interface SpCoreEd25519Public extends U8aFixed {}

  /** @name PalletImOnlineEvent (48) */
  interface PalletImOnlineEvent extends Enum {
    readonly isHeartbeatReceived: boolean;
    readonly asHeartbeatReceived: {
      readonly authorityId: PalletImOnlineSr25519AppSr25519Public;
    } & Struct;
    readonly isAllGood: boolean;
    readonly isSomeOffline: boolean;
    readonly asSomeOffline: {
      readonly offline: Vec<ITuple<[AccountId32, CordRuntimeEntitiesValidatorFullIdentification]>>;
    } & Struct;
    readonly type: 'HeartbeatReceived' | 'AllGood' | 'SomeOffline';
  }

  /** @name PalletImOnlineSr25519AppSr25519Public (49) */
  interface PalletImOnlineSr25519AppSr25519Public extends SpCoreSr25519Public {}

  /** @name SpCoreSr25519Public (50) */
  interface SpCoreSr25519Public extends U8aFixed {}

  /** @name CordRuntimeEntitiesValidatorFullIdentification (53) */
  type CordRuntimeEntitiesValidatorFullIdentification = Null;

  /** @name PalletPreimageEvent (54) */
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

  /** @name PalletCollectiveEvent (55) */
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

  /** @name PalletMembershipEvent (57) */
  interface PalletMembershipEvent extends Enum {
    readonly isMemberAdded: boolean;
    readonly isMemberRemoved: boolean;
    readonly isMembersSwapped: boolean;
    readonly isMembersReset: boolean;
    readonly isKeyChanged: boolean;
    readonly isDummy: boolean;
    readonly type: 'MemberAdded' | 'MemberRemoved' | 'MembersSwapped' | 'MembersReset' | 'KeyChanged' | 'Dummy';
  }

  /** @name PalletNodeAuthorizationEvent (60) */
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

  /** @name PalletUtilityEvent (64) */
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

  /** @name PalletMultisigEvent (65) */
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

  /** @name PalletMultisigTimepoint (66) */
  interface PalletMultisigTimepoint extends Struct {
    readonly height: u32;
    readonly index: u32;
  }

  /** @name PalletRemarkEvent (67) */
  interface PalletRemarkEvent extends Enum {
    readonly isStored: boolean;
    readonly asStored: {
      readonly sender: AccountId32;
      readonly contentHash: H256;
    } & Struct;
    readonly type: 'Stored';
  }

  /** @name PalletIdentityEvent (68) */
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
    readonly type: 'IdentitySet' | 'IdentityCleared' | 'IdentityKilled' | 'JudgementRequested' | 'JudgementUnrequested' | 'JudgementGiven' | 'RegistrarAdded' | 'RegistrarRemoved';
  }

  /** @name PalletNetworkMembershipEvent (69) */
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

  /** @name PalletDidEvent (70) */
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

  /** @name PalletSchemaEvent (71) */
  interface PalletSchemaEvent extends Enum {
    readonly isCreated: boolean;
    readonly asCreated: {
      readonly identifier: Bytes;
      readonly creator: AccountId32;
    } & Struct;
    readonly type: 'Created';
  }

  /** @name PalletChainSpaceEvent (74) */
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

  /** @name PalletStatementEvent (75) */
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

  /** @name PalletDidNameEvent (78) */
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

  /** @name PalletScoreEvent (81) */
  interface PalletScoreEvent extends Enum {
    readonly isJournalEntry: boolean;
    readonly asJournalEntry: {
      readonly identifier: Bytes;
      readonly entity: AccountId32;
      readonly author: AccountId32;
    } & Struct;
    readonly isAggregateUpdated: boolean;
    readonly asAggregateUpdated: {
      readonly entity: AccountId32;
    } & Struct;
    readonly type: 'JournalEntry' | 'AggregateUpdated';
  }

  /** @name PalletSudoEvent (82) */
  interface PalletSudoEvent extends Enum {
    readonly isSudid: boolean;
    readonly asSudid: {
      readonly sudoResult: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly isKeyChanged: boolean;
    readonly asKeyChanged: {
      readonly oldSudoer: Option<AccountId32>;
    } & Struct;
    readonly isSudoAsDone: boolean;
    readonly asSudoAsDone: {
      readonly sudoResult: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly type: 'Sudid' | 'KeyChanged' | 'SudoAsDone';
  }

  /** @name FrameSystemPhase (84) */
  interface FrameSystemPhase extends Enum {
    readonly isApplyExtrinsic: boolean;
    readonly asApplyExtrinsic: u32;
    readonly isFinalization: boolean;
    readonly isInitialization: boolean;
    readonly type: 'ApplyExtrinsic' | 'Finalization' | 'Initialization';
  }

  /** @name FrameSystemLastRuntimeUpgradeInfo (87) */
  interface FrameSystemLastRuntimeUpgradeInfo extends Struct {
    readonly specVersion: Compact<u32>;
    readonly specName: Text;
  }

  /** @name FrameSystemCall (90) */
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
    readonly type: 'Remark' | 'SetHeapPages' | 'SetCode' | 'SetCodeWithoutChecks' | 'SetStorage' | 'KillStorage' | 'KillPrefix' | 'RemarkWithEvent';
  }

  /** @name FrameSystemLimitsBlockWeights (94) */
  interface FrameSystemLimitsBlockWeights extends Struct {
    readonly baseBlock: SpWeightsWeightV2Weight;
    readonly maxBlock: SpWeightsWeightV2Weight;
    readonly perClass: FrameSupportDispatchPerDispatchClassWeightsPerClass;
  }

  /** @name FrameSupportDispatchPerDispatchClassWeightsPerClass (95) */
  interface FrameSupportDispatchPerDispatchClassWeightsPerClass extends Struct {
    readonly normal: FrameSystemLimitsWeightsPerClass;
    readonly operational: FrameSystemLimitsWeightsPerClass;
    readonly mandatory: FrameSystemLimitsWeightsPerClass;
  }

  /** @name FrameSystemLimitsWeightsPerClass (96) */
  interface FrameSystemLimitsWeightsPerClass extends Struct {
    readonly baseExtrinsic: SpWeightsWeightV2Weight;
    readonly maxExtrinsic: Option<SpWeightsWeightV2Weight>;
    readonly maxTotal: Option<SpWeightsWeightV2Weight>;
    readonly reserved: Option<SpWeightsWeightV2Weight>;
  }

  /** @name FrameSystemLimitsBlockLength (98) */
  interface FrameSystemLimitsBlockLength extends Struct {
    readonly max: FrameSupportDispatchPerDispatchClassU32;
  }

  /** @name FrameSupportDispatchPerDispatchClassU32 (99) */
  interface FrameSupportDispatchPerDispatchClassU32 extends Struct {
    readonly normal: u32;
    readonly operational: u32;
    readonly mandatory: u32;
  }

  /** @name SpWeightsRuntimeDbWeight (100) */
  interface SpWeightsRuntimeDbWeight extends Struct {
    readonly read: u64;
    readonly write: u64;
  }

  /** @name SpVersionRuntimeVersion (101) */
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

  /** @name FrameSystemError (106) */
  interface FrameSystemError extends Enum {
    readonly isInvalidSpecName: boolean;
    readonly isSpecVersionNeedsToIncrease: boolean;
    readonly isFailedToExtractRuntimeVersion: boolean;
    readonly isNonDefaultComposite: boolean;
    readonly isNonZeroRefCount: boolean;
    readonly isCallFiltered: boolean;
    readonly type: 'InvalidSpecName' | 'SpecVersionNeedsToIncrease' | 'FailedToExtractRuntimeVersion' | 'NonDefaultComposite' | 'NonZeroRefCount' | 'CallFiltered';
  }

  /** @name PalletSchedulerScheduled (109) */
  interface PalletSchedulerScheduled extends Struct {
    readonly maybeId: Option<U8aFixed>;
    readonly priority: u8;
    readonly call: FrameSupportPreimagesBounded;
    readonly maybePeriodic: Option<ITuple<[u32, u32]>>;
    readonly origin: CordRuntimeOriginCaller;
  }

  /** @name FrameSupportPreimagesBounded (110) */
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

  /** @name PalletSchedulerCall (112) */
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
    readonly type: 'Schedule' | 'Cancel' | 'ScheduleNamed' | 'CancelNamed' | 'ScheduleAfter' | 'ScheduleNamedAfter';
  }

  /** @name PalletBabeCall (114) */
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

  /** @name SpConsensusSlotsEquivocationProof (115) */
  interface SpConsensusSlotsEquivocationProof extends Struct {
    readonly offender: SpConsensusBabeAppPublic;
    readonly slot: u64;
    readonly firstHeader: SpRuntimeHeader;
    readonly secondHeader: SpRuntimeHeader;
  }

  /** @name SpRuntimeHeader (116) */
  interface SpRuntimeHeader extends Struct {
    readonly parentHash: H256;
    readonly number: Compact<u32>;
    readonly stateRoot: H256;
    readonly extrinsicsRoot: H256;
    readonly digest: SpRuntimeDigest;
  }

  /** @name SpConsensusBabeAppPublic (117) */
  interface SpConsensusBabeAppPublic extends SpCoreSr25519Public {}

  /** @name SpSessionMembershipProof (119) */
  interface SpSessionMembershipProof extends Struct {
    readonly session: u32;
    readonly trieNodes: Vec<Bytes>;
    readonly validatorCount: u32;
  }

  /** @name SpConsensusBabeDigestsNextConfigDescriptor (120) */
  interface SpConsensusBabeDigestsNextConfigDescriptor extends Enum {
    readonly isV1: boolean;
    readonly asV1: {
      readonly c: ITuple<[u64, u64]>;
      readonly allowedSlots: SpConsensusBabeAllowedSlots;
    } & Struct;
    readonly type: 'V1';
  }

  /** @name SpConsensusBabeAllowedSlots (122) */
  interface SpConsensusBabeAllowedSlots extends Enum {
    readonly isPrimarySlots: boolean;
    readonly isPrimaryAndSecondaryPlainSlots: boolean;
    readonly isPrimaryAndSecondaryVRFSlots: boolean;
    readonly type: 'PrimarySlots' | 'PrimaryAndSecondaryPlainSlots' | 'PrimaryAndSecondaryVRFSlots';
  }

  /** @name PalletTimestampCall (123) */
  interface PalletTimestampCall extends Enum {
    readonly isSet: boolean;
    readonly asSet: {
      readonly now: Compact<u64>;
    } & Struct;
    readonly type: 'Set';
  }

  /** @name PalletIndicesCall (124) */
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

  /** @name PalletBalancesCall (128) */
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
    readonly type: 'TransferAllowDeath' | 'ForceTransfer' | 'TransferKeepAlive' | 'TransferAll' | 'ForceUnreserve' | 'UpgradeAccounts' | 'ForceSetBalance';
  }

  /** @name CordAuthorityMembershipCall (130) */
  interface CordAuthorityMembershipCall extends Enum {
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

  /** @name PalletSessionCall (131) */
  interface PalletSessionCall extends Enum {
    readonly isSetKeys: boolean;
    readonly asSetKeys: {
      readonly keys_: CordRuntimeSessionKeys;
      readonly proof: Bytes;
    } & Struct;
    readonly isPurgeKeys: boolean;
    readonly type: 'SetKeys' | 'PurgeKeys';
  }

  /** @name CordRuntimeSessionKeys (132) */
  interface CordRuntimeSessionKeys extends Struct {
    readonly grandpa: SpConsensusGrandpaAppPublic;
    readonly babe: SpConsensusBabeAppPublic;
    readonly imOnline: PalletImOnlineSr25519AppSr25519Public;
    readonly authorityDiscovery: SpAuthorityDiscoveryAppPublic;
    readonly mixnet: SpMixnetAppPublic;
  }

  /** @name SpAuthorityDiscoveryAppPublic (133) */
  interface SpAuthorityDiscoveryAppPublic extends SpCoreSr25519Public {}

  /** @name SpMixnetAppPublic (134) */
  interface SpMixnetAppPublic extends SpCoreSr25519Public {}

  /** @name PalletGrandpaCall (135) */
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

  /** @name SpConsensusGrandpaEquivocationProof (136) */
  interface SpConsensusGrandpaEquivocationProof extends Struct {
    readonly setId: u64;
    readonly equivocation: SpConsensusGrandpaEquivocation;
  }

  /** @name SpConsensusGrandpaEquivocation (137) */
  interface SpConsensusGrandpaEquivocation extends Enum {
    readonly isPrevote: boolean;
    readonly asPrevote: FinalityGrandpaEquivocationPrevote;
    readonly isPrecommit: boolean;
    readonly asPrecommit: FinalityGrandpaEquivocationPrecommit;
    readonly type: 'Prevote' | 'Precommit';
  }

  /** @name FinalityGrandpaEquivocationPrevote (138) */
  interface FinalityGrandpaEquivocationPrevote extends Struct {
    readonly roundNumber: u64;
    readonly identity: SpConsensusGrandpaAppPublic;
    readonly first: ITuple<[FinalityGrandpaPrevote, SpConsensusGrandpaAppSignature]>;
    readonly second: ITuple<[FinalityGrandpaPrevote, SpConsensusGrandpaAppSignature]>;
  }

  /** @name FinalityGrandpaPrevote (139) */
  interface FinalityGrandpaPrevote extends Struct {
    readonly targetHash: H256;
    readonly targetNumber: u32;
  }

  /** @name SpConsensusGrandpaAppSignature (140) */
  interface SpConsensusGrandpaAppSignature extends SpCoreEd25519Signature {}

  /** @name SpCoreEd25519Signature (141) */
  interface SpCoreEd25519Signature extends U8aFixed {}

  /** @name FinalityGrandpaEquivocationPrecommit (144) */
  interface FinalityGrandpaEquivocationPrecommit extends Struct {
    readonly roundNumber: u64;
    readonly identity: SpConsensusGrandpaAppPublic;
    readonly first: ITuple<[FinalityGrandpaPrecommit, SpConsensusGrandpaAppSignature]>;
    readonly second: ITuple<[FinalityGrandpaPrecommit, SpConsensusGrandpaAppSignature]>;
  }

  /** @name FinalityGrandpaPrecommit (145) */
  interface FinalityGrandpaPrecommit extends Struct {
    readonly targetHash: H256;
    readonly targetNumber: u32;
  }

  /** @name PalletImOnlineCall (147) */
  interface PalletImOnlineCall extends Enum {
    readonly isHeartbeat: boolean;
    readonly asHeartbeat: {
      readonly heartbeat: PalletImOnlineHeartbeat;
      readonly signature: PalletImOnlineSr25519AppSr25519Signature;
    } & Struct;
    readonly type: 'Heartbeat';
  }

  /** @name PalletImOnlineHeartbeat (148) */
  interface PalletImOnlineHeartbeat extends Struct {
    readonly blockNumber: u32;
    readonly sessionIndex: u32;
    readonly authorityIndex: u32;
    readonly validatorsLen: u32;
  }

  /** @name PalletImOnlineSr25519AppSr25519Signature (149) */
  interface PalletImOnlineSr25519AppSr25519Signature extends SpCoreSr25519Signature {}

  /** @name SpCoreSr25519Signature (150) */
  interface SpCoreSr25519Signature extends U8aFixed {}

  /** @name PalletPreimageCall (151) */
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

  /** @name PalletCollectiveCall (152) */
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

  /** @name PalletMembershipCall (153) */
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

  /** @name PalletNodeAuthorizationCall (156) */
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

  /** @name PalletRuntimeUpgradeCall (157) */
  interface PalletRuntimeUpgradeCall extends Enum {
    readonly isSetCode: boolean;
    readonly asSetCode: {
      readonly code: Bytes;
    } & Struct;
    readonly type: 'SetCode';
  }

  /** @name PalletUtilityCall (158) */
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
      readonly asOrigin: CordRuntimeOriginCaller;
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

  /** @name CordRuntimeOriginCaller (160) */
  interface CordRuntimeOriginCaller extends Enum {
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

  /** @name FrameSupportDispatchRawOrigin (161) */
  interface FrameSupportDispatchRawOrigin extends Enum {
    readonly isRoot: boolean;
    readonly isSigned: boolean;
    readonly asSigned: AccountId32;
    readonly isNone: boolean;
    readonly type: 'Root' | 'Signed' | 'None';
  }

  /** @name PalletCollectiveRawOrigin (162) */
  interface PalletCollectiveRawOrigin extends Enum {
    readonly isMembers: boolean;
    readonly asMembers: ITuple<[u32, u32]>;
    readonly isMember: boolean;
    readonly asMember: AccountId32;
    readonly isPhantom: boolean;
    readonly type: 'Members' | 'Member' | 'Phantom';
  }

  /** @name PalletDidOriginDidRawOrigin (164) */
  interface PalletDidOriginDidRawOrigin extends Struct {
    readonly id: AccountId32;
    readonly submitter: AccountId32;
  }

  /** @name SpCoreVoid (165) */
  type SpCoreVoid = Null;

  /** @name PalletMultisigCall (166) */
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

  /** @name PalletRemarkCall (168) */
  interface PalletRemarkCall extends Enum {
    readonly isStore: boolean;
    readonly asStore: {
      readonly remark: Bytes;
    } & Struct;
    readonly type: 'Store';
  }

  /** @name PalletIdentityCall (169) */
  interface PalletIdentityCall extends Enum {
    readonly isAddRegistrar: boolean;
    readonly asAddRegistrar: {
      readonly account: MultiAddress;
    } & Struct;
    readonly isSetIdentity: boolean;
    readonly asSetIdentity: {
      readonly info: PalletIdentitySimpleIdentityInfo;
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
      readonly fields: PalletIdentityBitFlags;
    } & Struct;
    readonly isProvideJudgement: boolean;
    readonly asProvideJudgement: {
      readonly target: MultiAddress;
      readonly judgement: PalletIdentityJudgement;
      readonly digest: H256;
    } & Struct;
    readonly isKillIdentity: boolean;
    readonly asKillIdentity: {
      readonly target: MultiAddress;
    } & Struct;
    readonly isRemoveRegistrar: boolean;
    readonly asRemoveRegistrar: {
      readonly account: MultiAddress;
    } & Struct;
    readonly type: 'AddRegistrar' | 'SetIdentity' | 'ClearIdentity' | 'RequestJudgement' | 'CancelRequest' | 'SetAccountId' | 'SetFields' | 'ProvideJudgement' | 'KillIdentity' | 'RemoveRegistrar';
  }

  /** @name PalletIdentitySimpleIdentityInfo (170) */
  interface PalletIdentitySimpleIdentityInfo extends Struct {
    readonly additional: Vec<ITuple<[Data, Data]>>;
    readonly display: Data;
    readonly legal: Data;
    readonly web: Data;
    readonly email: Data;
  }

  /** @name PalletIdentityBitFlags (203) */
  interface PalletIdentityBitFlags extends Set {
    readonly isDisplay: boolean;
    readonly isLegal: boolean;
    readonly isWeb: boolean;
    readonly isEmail: boolean;
  }

  /** @name PalletIdentitySimpleIdentityField (204) */
  interface PalletIdentitySimpleIdentityField extends Enum {
    readonly isDisplay: boolean;
    readonly isLegal: boolean;
    readonly isWeb: boolean;
    readonly isEmail: boolean;
    readonly type: 'Display' | 'Legal' | 'Web' | 'Email';
  }

  /** @name PalletIdentityJudgement (205) */
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

  /** @name PalletMixnetCall (206) */
  interface PalletMixnetCall extends Enum {
    readonly isRegister: boolean;
    readonly asRegister: {
      readonly registration: PalletMixnetRegistration;
      readonly signature: SpMixnetAppSignature;
    } & Struct;
    readonly type: 'Register';
  }

  /** @name PalletMixnetRegistration (207) */
  interface PalletMixnetRegistration extends Struct {
    readonly blockNumber: u32;
    readonly sessionIndex: u32;
    readonly authorityIndex: u32;
    readonly mixnode: PalletMixnetBoundedMixnode;
  }

  /** @name PalletMixnetBoundedMixnode (208) */
  interface PalletMixnetBoundedMixnode extends Struct {
    readonly kxPublic: U8aFixed;
    readonly peerId: U8aFixed;
    readonly externalAddresses: Vec<Bytes>;
  }

  /** @name SpMixnetAppSignature (212) */
  interface SpMixnetAppSignature extends SpCoreSr25519Signature {}

  /** @name PalletNetworkMembershipCall (213) */
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

  /** @name PalletDidCall (214) */
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

  /** @name PalletDidDidDetailsDidCreationDetails (215) */
  interface PalletDidDidDetailsDidCreationDetails extends Struct {
    readonly did: AccountId32;
    readonly submitter: AccountId32;
    readonly newKeyAgreementKeys: BTreeSet<PalletDidDidDetailsDidEncryptionKey>;
    readonly newAssertionKey: Option<PalletDidDidDetailsDidVerificationKey>;
    readonly newDelegationKey: Option<PalletDidDidDetailsDidVerificationKey>;
    readonly newServiceDetails: Vec<PalletDidServiceEndpointsDidEndpoint>;
  }

  /** @name CordRuntimeMaxNewKeyAgreementKeys (216) */
  type CordRuntimeMaxNewKeyAgreementKeys = Null;

  /** @name PalletDidServiceEndpointsDidEndpoint (217) */
  interface PalletDidServiceEndpointsDidEndpoint extends Struct {
    readonly id: Bytes;
    readonly serviceTypes: Vec<Bytes>;
    readonly urls: Vec<Bytes>;
  }

  /** @name PalletDidDidDetailsDidEncryptionKey (226) */
  interface PalletDidDidDetailsDidEncryptionKey extends Enum {
    readonly isX25519: boolean;
    readonly asX25519: U8aFixed;
    readonly type: 'X25519';
  }

  /** @name PalletDidDidDetailsDidVerificationKey (230) */
  interface PalletDidDidDetailsDidVerificationKey extends Enum {
    readonly isEd25519: boolean;
    readonly asEd25519: SpCoreEd25519Public;
    readonly isSr25519: boolean;
    readonly asSr25519: SpCoreSr25519Public;
    readonly isEcdsa: boolean;
    readonly asEcdsa: SpCoreEcdsaPublic;
    readonly isAccount: boolean;
    readonly asAccount: AccountId32;
    readonly type: 'Ed25519' | 'Sr25519' | 'Ecdsa' | 'Account';
  }

  /** @name SpCoreEcdsaPublic (231) */
  interface SpCoreEcdsaPublic extends U8aFixed {}

  /** @name PalletDidDidDetailsDidSignature (234) */
  interface PalletDidDidDetailsDidSignature extends Enum {
    readonly isEd25519: boolean;
    readonly asEd25519: SpCoreEd25519Signature;
    readonly isSr25519: boolean;
    readonly asSr25519: SpCoreSr25519Signature;
    readonly isEcdsa: boolean;
    readonly asEcdsa: SpCoreEcdsaSignature;
    readonly type: 'Ed25519' | 'Sr25519' | 'Ecdsa';
  }

  /** @name SpCoreEcdsaSignature (235) */
  interface SpCoreEcdsaSignature extends U8aFixed {}

  /** @name PalletDidDidDetailsDidAuthorizedCallOperation (237) */
  interface PalletDidDidDetailsDidAuthorizedCallOperation extends Struct {
    readonly did: AccountId32;
    readonly txCounter: u64;
    readonly call: Call;
    readonly blockNumber: u32;
    readonly submitter: AccountId32;
  }

  /** @name PalletSchemaCall (238) */
  interface PalletSchemaCall extends Enum {
    readonly isCreate: boolean;
    readonly asCreate: {
      readonly txSchema: Bytes;
      readonly authorization: Bytes;
    } & Struct;
    readonly type: 'Create';
  }

  /** @name PalletChainSpaceCall (240) */
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
    readonly isAddAuditDelegate: boolean;
    readonly asAddAuditDelegate: {
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
    readonly type: 'AddDelegate' | 'AddAdminDelegate' | 'AddAuditDelegate' | 'RemoveDelegate' | 'Create' | 'Approve' | 'Archive' | 'Restore' | 'UpdateTransactionCapacity' | 'ResetTransactionCount' | 'ApprovalRevoke' | 'ApprovalRestore';
  }

  /** @name PalletStatementCall (241) */
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

  /** @name PalletStatementPresentationTypeOf (243) */
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

  /** @name PalletDidNameCall (244) */
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

  /** @name PalletScoreCall (245) */
  interface PalletScoreCall extends Enum {
    readonly isAddRating: boolean;
    readonly asAddRating: {
      readonly journal: PalletScoreRatingInput;
      readonly authorization: Bytes;
    } & Struct;
    readonly type: 'AddRating';
  }

  /** @name PalletScoreRatingInput (246) */
  interface PalletScoreRatingInput extends Struct {
    readonly entry: PalletScoreRatingEntryDetails;
    readonly digest: H256;
    readonly creator: AccountId32;
  }

  /** @name PalletScoreRatingEntryDetails (247) */
  interface PalletScoreRatingEntryDetails extends Struct {
    readonly entity: AccountId32;
    readonly tid: Bytes;
    readonly collector: AccountId32;
    readonly ratingType: PalletScoreRatingTypeOf;
    readonly rating: u32;
    readonly entryType: PalletScoreRatingEntryType;
    readonly count: u32;
  }

  /** @name PalletScoreRatingTypeOf (249) */
  interface PalletScoreRatingTypeOf extends Enum {
    readonly isOverall: boolean;
    readonly isDelivery: boolean;
    readonly type: 'Overall' | 'Delivery';
  }

  /** @name PalletScoreRatingEntryType (250) */
  interface PalletScoreRatingEntryType extends Enum {
    readonly isCredit: boolean;
    readonly isDebit: boolean;
    readonly type: 'Credit' | 'Debit';
  }

  /** @name PalletSudoCall (251) */
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
    readonly type: 'Sudo' | 'SudoUncheckedWeight' | 'SetKey' | 'SudoAs';
  }

  /** @name SpRuntimeBlakeTwo256 (252) */
  type SpRuntimeBlakeTwo256 = Null;

  /** @name PalletSchedulerError (254) */
  interface PalletSchedulerError extends Enum {
    readonly isFailedToSchedule: boolean;
    readonly isNotFound: boolean;
    readonly isTargetBlockNumberInPast: boolean;
    readonly isRescheduleNoChange: boolean;
    readonly isNamed: boolean;
    readonly type: 'FailedToSchedule' | 'NotFound' | 'TargetBlockNumberInPast' | 'RescheduleNoChange' | 'Named';
  }

  /** @name SpConsensusBabeDigestsPreDigest (261) */
  interface SpConsensusBabeDigestsPreDigest extends Enum {
    readonly isPrimary: boolean;
    readonly asPrimary: SpConsensusBabeDigestsPrimaryPreDigest;
    readonly isSecondaryPlain: boolean;
    readonly asSecondaryPlain: SpConsensusBabeDigestsSecondaryPlainPreDigest;
    readonly isSecondaryVRF: boolean;
    readonly asSecondaryVRF: SpConsensusBabeDigestsSecondaryVRFPreDigest;
    readonly type: 'Primary' | 'SecondaryPlain' | 'SecondaryVRF';
  }

  /** @name SpConsensusBabeDigestsPrimaryPreDigest (262) */
  interface SpConsensusBabeDigestsPrimaryPreDigest extends Struct {
    readonly authorityIndex: u32;
    readonly slot: u64;
    readonly vrfSignature: SpCoreSr25519VrfVrfSignature;
  }

  /** @name SpCoreSr25519VrfVrfSignature (263) */
  interface SpCoreSr25519VrfVrfSignature extends Struct {
    readonly output: U8aFixed;
    readonly proof: U8aFixed;
  }

  /** @name SpConsensusBabeDigestsSecondaryPlainPreDigest (264) */
  interface SpConsensusBabeDigestsSecondaryPlainPreDigest extends Struct {
    readonly authorityIndex: u32;
    readonly slot: u64;
  }

  /** @name SpConsensusBabeDigestsSecondaryVRFPreDigest (265) */
  interface SpConsensusBabeDigestsSecondaryVRFPreDigest extends Struct {
    readonly authorityIndex: u32;
    readonly slot: u64;
    readonly vrfSignature: SpCoreSr25519VrfVrfSignature;
  }

  /** @name SpConsensusBabeBabeEpochConfiguration (266) */
  interface SpConsensusBabeBabeEpochConfiguration extends Struct {
    readonly c: ITuple<[u64, u64]>;
    readonly allowedSlots: SpConsensusBabeAllowedSlots;
  }

  /** @name PalletBabeError (270) */
  interface PalletBabeError extends Enum {
    readonly isInvalidEquivocationProof: boolean;
    readonly isInvalidKeyOwnershipProof: boolean;
    readonly isDuplicateOffenceReport: boolean;
    readonly isInvalidConfiguration: boolean;
    readonly type: 'InvalidEquivocationProof' | 'InvalidKeyOwnershipProof' | 'DuplicateOffenceReport' | 'InvalidConfiguration';
  }

  /** @name PalletIndicesError (272) */
  interface PalletIndicesError extends Enum {
    readonly isNotAssigned: boolean;
    readonly isNotOwner: boolean;
    readonly isInUse: boolean;
    readonly isNotTransfer: boolean;
    readonly isPermanent: boolean;
    readonly type: 'NotAssigned' | 'NotOwner' | 'InUse' | 'NotTransfer' | 'Permanent';
  }

  /** @name PalletBalancesBalanceLock (274) */
  interface PalletBalancesBalanceLock extends Struct {
    readonly id: U8aFixed;
    readonly amount: u128;
    readonly reasons: PalletBalancesReasons;
  }

  /** @name PalletBalancesReasons (275) */
  interface PalletBalancesReasons extends Enum {
    readonly isFee: boolean;
    readonly isMisc: boolean;
    readonly isAll: boolean;
    readonly type: 'Fee' | 'Misc' | 'All';
  }

  /** @name PalletBalancesReserveData (278) */
  interface PalletBalancesReserveData extends Struct {
    readonly id: U8aFixed;
    readonly amount: u128;
  }

  /** @name PalletBalancesIdAmountRuntimeHoldReason (281) */
  interface PalletBalancesIdAmountRuntimeHoldReason extends Struct {
    readonly id: CordRuntimeRuntimeHoldReason;
    readonly amount: u128;
  }

  /** @name CordRuntimeRuntimeHoldReason (282) */
  interface CordRuntimeRuntimeHoldReason extends Enum {
    readonly isPreimage: boolean;
    readonly asPreimage: PalletPreimageHoldReason;
    readonly type: 'Preimage';
  }

  /** @name PalletPreimageHoldReason (283) */
  interface PalletPreimageHoldReason extends Enum {
    readonly isPreimage: boolean;
    readonly type: 'Preimage';
  }

  /** @name PalletBalancesIdAmountRuntimeFreezeReason (286) */
  interface PalletBalancesIdAmountRuntimeFreezeReason extends Struct {
    readonly id: CordRuntimeRuntimeFreezeReason;
    readonly amount: u128;
  }

  /** @name CordRuntimeRuntimeFreezeReason (287) */
  type CordRuntimeRuntimeFreezeReason = Null;

  /** @name PalletBalancesError (289) */
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
    readonly type: 'VestingBalance' | 'LiquidityRestrictions' | 'InsufficientBalance' | 'ExistentialDeposit' | 'Expendability' | 'ExistingVestingSchedule' | 'DeadAccount' | 'TooManyReserves' | 'TooManyHolds' | 'TooManyFreezes';
  }

  /** @name CordAuthorityMembershipError (290) */
  interface CordAuthorityMembershipError extends Enum {
    readonly isMemberAlreadyIncoming: boolean;
    readonly isMemberAlreadyExists: boolean;
    readonly isMemberAlreadyOutgoing: boolean;
    readonly isMemberNotFound: boolean;
    readonly isMemberBlackListed: boolean;
    readonly isSessionKeysNotAdded: boolean;
    readonly isMemberNotBlackListed: boolean;
    readonly isNetworkMembershipNotFound: boolean;
    readonly type: 'MemberAlreadyIncoming' | 'MemberAlreadyExists' | 'MemberAlreadyOutgoing' | 'MemberNotFound' | 'MemberBlackListed' | 'SessionKeysNotAdded' | 'MemberNotBlackListed' | 'NetworkMembershipNotFound';
  }

  /** @name SpStakingOffenceOffenceDetails (291) */
  interface SpStakingOffenceOffenceDetails extends Struct {
    readonly offender: ITuple<[AccountId32, CordRuntimeEntitiesValidatorFullIdentification]>;
    readonly reporters: Vec<AccountId32>;
  }

  /** @name SpCoreCryptoKeyTypeId (297) */
  interface SpCoreCryptoKeyTypeId extends U8aFixed {}

  /** @name PalletSessionError (298) */
  interface PalletSessionError extends Enum {
    readonly isInvalidProof: boolean;
    readonly isNoAssociatedValidatorId: boolean;
    readonly isDuplicatedKey: boolean;
    readonly isNoKeys: boolean;
    readonly isNoAccount: boolean;
    readonly type: 'InvalidProof' | 'NoAssociatedValidatorId' | 'DuplicatedKey' | 'NoKeys' | 'NoAccount';
  }

  /** @name PalletGrandpaStoredState (299) */
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

  /** @name PalletGrandpaStoredPendingChange (300) */
  interface PalletGrandpaStoredPendingChange extends Struct {
    readonly scheduledAt: u32;
    readonly delay: u32;
    readonly nextAuthorities: Vec<ITuple<[SpConsensusGrandpaAppPublic, u64]>>;
    readonly forced: Option<u32>;
  }

  /** @name PalletGrandpaError (303) */
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

  /** @name PalletImOnlineError (307) */
  interface PalletImOnlineError extends Enum {
    readonly isInvalidKey: boolean;
    readonly isDuplicatedHeartbeat: boolean;
    readonly type: 'InvalidKey' | 'DuplicatedHeartbeat';
  }

  /** @name PalletPreimageOldRequestStatus (310) */
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

  /** @name PalletPreimageRequestStatus (313) */
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

  /** @name PalletPreimageError (319) */
  interface PalletPreimageError extends Enum {
    readonly isTooBig: boolean;
    readonly isAlreadyNoted: boolean;
    readonly isNotAuthorized: boolean;
    readonly isNotNoted: boolean;
    readonly isRequested: boolean;
    readonly isNotRequested: boolean;
    readonly isTooMany: boolean;
    readonly isTooFew: boolean;
    readonly type: 'TooBig' | 'AlreadyNoted' | 'NotAuthorized' | 'NotNoted' | 'Requested' | 'NotRequested' | 'TooMany' | 'TooFew';
  }

  /** @name PalletCollectiveVotes (321) */
  interface PalletCollectiveVotes extends Struct {
    readonly index: u32;
    readonly threshold: u32;
    readonly ayes: Vec<AccountId32>;
    readonly nays: Vec<AccountId32>;
    readonly end: u32;
  }

  /** @name PalletCollectiveError (322) */
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

  /** @name PalletMembershipError (324) */
  interface PalletMembershipError extends Enum {
    readonly isAlreadyMember: boolean;
    readonly isNotMember: boolean;
    readonly isTooManyMembers: boolean;
    readonly type: 'AlreadyMember' | 'NotMember' | 'TooManyMembers';
  }

  /** @name PalletNodeAuthorizationNodeInfo (329) */
  interface PalletNodeAuthorizationNodeInfo extends Struct {
    readonly id: Bytes;
    readonly owner: AccountId32;
  }

  /** @name PalletNodeAuthorizationError (331) */
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

  /** @name PalletUtilityError (332) */
  interface PalletUtilityError extends Enum {
    readonly isTooManyCalls: boolean;
    readonly type: 'TooManyCalls';
  }

  /** @name PalletMultisigMultisig (334) */
  interface PalletMultisigMultisig extends Struct {
    readonly when: PalletMultisigTimepoint;
    readonly deposit: u128;
    readonly depositor: AccountId32;
    readonly approvals: Vec<AccountId32>;
  }

  /** @name PalletMultisigError (336) */
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

  /** @name PalletRemarkError (337) */
  interface PalletRemarkError extends Enum {
    readonly isEmpty: boolean;
    readonly isBadContext: boolean;
    readonly type: 'Empty' | 'BadContext';
  }

  /** @name PalletIdentityRegistration (338) */
  interface PalletIdentityRegistration extends Struct {
    readonly judgements: Vec<ITuple<[AccountId32, PalletIdentityJudgement]>>;
    readonly info: PalletIdentitySimpleIdentityInfo;
  }

  /** @name PalletIdentityRegistrarInfo (344) */
  interface PalletIdentityRegistrarInfo extends Struct {
    readonly account: AccountId32;
    readonly fields: PalletIdentityBitFlags;
  }

  /** @name PalletIdentityError (346) */
  interface PalletIdentityError extends Enum {
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
    readonly isJudgementForDifferentIdentity: boolean;
    readonly isJudgementPaymentFailed: boolean;
    readonly type: 'NotFound' | 'RegistrarNotFound' | 'RegistrarAlreadyExists' | 'NotNamed' | 'EmptyIndex' | 'NoIdentity' | 'StickyJudgement' | 'JudgementGiven' | 'InvalidJudgement' | 'InvalidIndex' | 'InvalidTarget' | 'TooManyFields' | 'TooManyRegistrars' | 'AlreadyClaimed' | 'JudgementForDifferentIdentity' | 'JudgementPaymentFailed';
  }

  /** @name CordIdentifierIdentifierTypeOf (348) */
  interface CordIdentifierIdentifierTypeOf extends Enum {
    readonly isAsset: boolean;
    readonly isAuth: boolean;
    readonly isDid: boolean;
    readonly isRegistry: boolean;
    readonly isStatement: boolean;
    readonly isSchema: boolean;
    readonly isTemplate: boolean;
    readonly type: 'Asset' | 'Auth' | 'Did' | 'Registry' | 'Statement' | 'Schema' | 'Template';
  }

  /** @name CordIdentifierEventEntry (350) */
  interface CordIdentifierEventEntry extends Struct {
    readonly action: CordIdentifierCallTypeOf;
    readonly location: CordIdentifierTimepoint;
  }

  /** @name CordIdentifierCallTypeOf (351) */
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
    readonly type: 'Archive' | 'Authorization' | 'Capacity' | 'CouncilRevoke' | 'CouncilRestore' | 'Deauthorization' | 'Approved' | 'Genesis' | 'Update' | 'Revoke' | 'Restore' | 'Remove' | 'PartialRemove' | 'PresentationAdded' | 'PresentationRemoved' | 'Rotate' | 'Usage';
  }

  /** @name CordIdentifierTimepoint (352) */
  interface CordIdentifierTimepoint extends Struct {
    readonly height: u32;
    readonly index: u32;
  }

  /** @name CordIdentifierError (354) */
  interface CordIdentifierError extends Enum {
    readonly isMaxEventsHistoryExceeded: boolean;
    readonly type: 'MaxEventsHistoryExceeded';
  }

  /** @name PalletNetworkMembershipMemberData (355) */
  interface PalletNetworkMembershipMemberData extends Struct {
    readonly expireOn: u32;
  }

  /** @name PalletNetworkMembershipError (357) */
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

  /** @name PalletDidDidDetails (358) */
  interface PalletDidDidDetails extends Struct {
    readonly authenticationKey: H256;
    readonly keyAgreementKeys: BTreeSet<H256>;
    readonly delegationKey: Option<H256>;
    readonly assertionKey: Option<H256>;
    readonly publicKeys: BTreeMap<H256, PalletDidDidDetailsDidPublicKeyDetails>;
    readonly lastTxCounter: u64;
  }

  /** @name PalletDidDidDetailsDidPublicKeyDetails (363) */
  interface PalletDidDidDetailsDidPublicKeyDetails extends Struct {
    readonly key: PalletDidDidDetailsDidPublicKey;
    readonly blockNumber: u32;
  }

  /** @name PalletDidDidDetailsDidPublicKey (364) */
  interface PalletDidDidDetailsDidPublicKey extends Enum {
    readonly isPublicVerificationKey: boolean;
    readonly asPublicVerificationKey: PalletDidDidDetailsDidVerificationKey;
    readonly isPublicEncryptionKey: boolean;
    readonly asPublicEncryptionKey: PalletDidDidDetailsDidEncryptionKey;
    readonly type: 'PublicVerificationKey' | 'PublicEncryptionKey';
  }

  /** @name PalletDidError (369) */
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

  /** @name PalletSchemaSchemaEntry (370) */
  interface PalletSchemaSchemaEntry extends Struct {
    readonly schema: Bytes;
    readonly digest: H256;
    readonly creator: AccountId32;
    readonly space: Bytes;
  }

  /** @name PalletSchemaError (371) */
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

  /** @name PalletChainSpaceSpaceDetails (372) */
  interface PalletChainSpaceSpaceDetails extends Struct {
    readonly code: H256;
    readonly creator: AccountId32;
    readonly txnCapacity: u64;
    readonly txnCount: u64;
    readonly approved: bool;
    readonly archive: bool;
  }

  /** @name PalletChainSpaceSpaceAuthorization (373) */
  interface PalletChainSpaceSpaceAuthorization extends Struct {
    readonly spaceId: Bytes;
    readonly delegate: AccountId32;
    readonly permissions: PalletChainSpacePermissions;
    readonly delegator: AccountId32;
  }

  /** @name PalletChainSpacePermissions (374) */
  interface PalletChainSpacePermissions extends Struct {
    readonly bits: u32;
  }

  /** @name PalletChainSpaceError (376) */
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
    readonly isTypeCapacityOverflow: boolean;
    readonly type: 'SpaceAlreadyAnchored' | 'SpaceNotFound' | 'UnauthorizedOperation' | 'InvalidIdentifier' | 'InvalidIdentifierLength' | 'InvalidIdentifierPrefix' | 'ArchivedSpace' | 'SpaceNotArchived' | 'SpaceDelegatesLimitExceeded' | 'EmptyTransaction' | 'DelegateAlreadyAdded' | 'AuthorizationNotFound' | 'DelegateNotFound' | 'SpaceAlreadyApproved' | 'SpaceNotApproved' | 'CapacityLimitExceeded' | 'CapacityLessThanUsage' | 'TypeCapacityOverflow';
  }

  /** @name PalletStatementStatementDetails (377) */
  interface PalletStatementStatementDetails extends Struct {
    readonly digest: H256;
    readonly space: Bytes;
    readonly schema: Option<Bytes>;
  }

  /** @name PalletStatementStatementPresentationDetails (379) */
  interface PalletStatementStatementPresentationDetails extends Struct {
    readonly creator: AccountId32;
    readonly presentationType: PalletStatementPresentationTypeOf;
    readonly digest: H256;
    readonly space: Bytes;
  }

  /** @name PalletStatementStatementEntryStatus (380) */
  interface PalletStatementStatementEntryStatus extends Struct {
    readonly creator: AccountId32;
    readonly revoked: bool;
  }

  /** @name PalletStatementError (382) */
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

  /** @name PalletDidNameDidNameDidNameOwnership (383) */
  interface PalletDidNameDidNameDidNameOwnership extends Struct {
    readonly owner: AccountId32;
    readonly registeredAt: u32;
  }

  /** @name PalletDidNameError (384) */
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

  /** @name PalletScoreRatingEntry (386) */
  interface PalletScoreRatingEntry extends Struct {
    readonly entry: PalletScoreRatingEntryDetails;
    readonly digest: H256;
    readonly createdAt: u32;
    readonly space: Bytes;
    readonly creator: AccountId32;
  }

  /** @name PalletScoreScoreEntry (388) */
  interface PalletScoreScoreEntry extends Struct {
    readonly count: u32;
    readonly rating: u32;
  }

  /** @name PalletScoreError (390) */
  interface PalletScoreError extends Enum {
    readonly isInvalidIdentifierLength: boolean;
    readonly isInvalidDigest: boolean;
    readonly isInvalidSignature: boolean;
    readonly isInvalidRatingIdentifier: boolean;
    readonly isTransactionAlreadyRated: boolean;
    readonly isInvalidRatingValue: boolean;
    readonly isTooManyJournalEntries: boolean;
    readonly isInvalidEntitySignature: boolean;
    readonly isDigestAlreadyAnchored: boolean;
    readonly isCountCannotBeZero: boolean;
    readonly isRatingCannotBeZero: boolean;
    readonly type: 'InvalidIdentifierLength' | 'InvalidDigest' | 'InvalidSignature' | 'InvalidRatingIdentifier' | 'TransactionAlreadyRated' | 'InvalidRatingValue' | 'TooManyJournalEntries' | 'InvalidEntitySignature' | 'DigestAlreadyAnchored' | 'CountCannotBeZero' | 'RatingCannotBeZero';
  }

  /** @name PalletSudoError (391) */
  interface PalletSudoError extends Enum {
    readonly isRequireSudo: boolean;
    readonly type: 'RequireSudo';
  }

  /** @name SpRuntimeMultiSignature (393) */
  interface SpRuntimeMultiSignature extends Enum {
    readonly isEd25519: boolean;
    readonly asEd25519: SpCoreEd25519Signature;
    readonly isSr25519: boolean;
    readonly asSr25519: SpCoreSr25519Signature;
    readonly isEcdsa: boolean;
    readonly asEcdsa: SpCoreEcdsaSignature;
    readonly type: 'Ed25519' | 'Sr25519' | 'Ecdsa';
  }

  /** @name PalletNetworkMembershipCheckNetworkMembership (395) */
  type PalletNetworkMembershipCheckNetworkMembership = Null;

  /** @name FrameSystemExtensionsCheckNonZeroSender (396) */
  type FrameSystemExtensionsCheckNonZeroSender = Null;

  /** @name FrameSystemExtensionsCheckSpecVersion (397) */
  type FrameSystemExtensionsCheckSpecVersion = Null;

  /** @name FrameSystemExtensionsCheckTxVersion (398) */
  type FrameSystemExtensionsCheckTxVersion = Null;

  /** @name FrameSystemExtensionsCheckGenesis (399) */
  type FrameSystemExtensionsCheckGenesis = Null;

  /** @name FrameSystemExtensionsCheckNonce (402) */
  interface FrameSystemExtensionsCheckNonce extends Compact<u32> {}

  /** @name FrameSystemExtensionsCheckWeight (403) */
  type FrameSystemExtensionsCheckWeight = Null;

  /** @name CordRuntimeRuntime (404) */
  type CordRuntimeRuntime = Null;

} // declare module
