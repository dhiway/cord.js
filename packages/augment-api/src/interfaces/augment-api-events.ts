// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/events';

import type { ApiTypes, AugmentedEvent } from '@polkadot/api-base/types';
import type { Bytes, Null, Option, Result, U8aFixed, Vec, bool, u128, u16, u32, u64, u8 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { OpaquePeerId } from '@polkadot/types/interfaces/imOnline';
import type { AccountId32, H256 } from '@polkadot/types/interfaces/runtime';
import type { FrameSupportDispatchDispatchInfo, FrameSupportTokensMiscBalanceStatus, PalletAssetAssetStatusOf, PalletImOnlineSr25519AppSr25519Public, PalletMultisigTimepoint, SpConsensusGrandpaAppPublic, SpRuntimeDispatchError } from '@polkadot/types/lookup';

export type __AugmentedEvent<ApiType extends ApiTypes> = AugmentedEvent<ApiType>;

declare module '@polkadot/api-base/types/events' {
  interface AugmentedEvents<ApiType extends ApiTypes> {
    asset: {
      /**
       * A new asset entry has been added.
       * \[asset entry identifier, issuer\]
       **/
      Create: AugmentedEvent<ApiType, [identifier: Bytes, issuer: AccountId32], { identifier: Bytes, issuer: AccountId32 }>;
      /**
       * A new asset entry has been added.
       * \[asset entry identifier, instance identifier\]
       **/
      Issue: AugmentedEvent<ApiType, [identifier: Bytes, instance: Bytes], { identifier: Bytes, instance: Bytes }>;
      /**
       * An asset (or instance) entry has a new Status now
       * \[asset entry identifier, optional instance identifier, new status\]
       **/
      StatusChange: AugmentedEvent<ApiType, [identifier: Bytes, instance: Option<Bytes>, status: PalletAssetAssetStatusOf], { identifier: Bytes, instance: Option<Bytes>, status: PalletAssetAssetStatusOf }>;
      /**
       * A asset has been transfered.
       * \[asset entry identifier, instance identifier, owner, beneficiary,
       * \]
       **/
      Transfer: AugmentedEvent<ApiType, [identifier: Bytes, instance: Bytes, from: AccountId32, to: AccountId32], { identifier: Bytes, instance: Bytes, from: AccountId32, to: AccountId32 }>;
    };
    authorityMembership: {
      /**
       * List of members who will enter the set of authorities at the next
       * session. [Vec<member_id>]
       **/
      IncomingAuthorities: AugmentedEvent<ApiType, [Vec<AccountId32>]>;
      /**
       * A member will be added to the authority membership.
       **/
      MemberAdded: AugmentedEvent<ApiType, [AccountId32]>;
      /**
       * A member will leave the set of authorities in 2 sessions.
       **/
      MemberGoOffline: AugmentedEvent<ApiType, [AccountId32]>;
      /**
       * A member will enter the set of authorities in 2 sessions.
       **/
      MemberGoOnline: AugmentedEvent<ApiType, [AccountId32]>;
      /**
       * this member will be removed from the authority set in 2 sessions.
       **/
      MemberRemoved: AugmentedEvent<ApiType, [AccountId32]>;
      /**
       * A member has been removed from the blacklist.
       **/
      MemberWhiteList: AugmentedEvent<ApiType, [AccountId32]>;
      /**
       * List of members who will leave the set of authorities at the next
       * session. [Vec<member_id>]
       **/
      OutgoingAuthorities: AugmentedEvent<ApiType, [Vec<AccountId32>]>;
    };
    balances: {
      /**
       * A balance was set by root.
       **/
      BalanceSet: AugmentedEvent<ApiType, [who: AccountId32, free: u128], { who: AccountId32, free: u128 }>;
      /**
       * Some amount was burned from an account.
       **/
      Burned: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Some amount was deposited (e.g. for transaction fees).
       **/
      Deposit: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * An account was removed whose balance was non-zero but below ExistentialDeposit,
       * resulting in an outright loss.
       **/
      DustLost: AugmentedEvent<ApiType, [account: AccountId32, amount: u128], { account: AccountId32, amount: u128 }>;
      /**
       * An account was created with some free balance.
       **/
      Endowed: AugmentedEvent<ApiType, [account: AccountId32, freeBalance: u128], { account: AccountId32, freeBalance: u128 }>;
      /**
       * Some balance was frozen.
       **/
      Frozen: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Total issuance was increased by `amount`, creating a credit to be balanced.
       **/
      Issued: AugmentedEvent<ApiType, [amount: u128], { amount: u128 }>;
      /**
       * Some balance was locked.
       **/
      Locked: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Some amount was minted into an account.
       **/
      Minted: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Total issuance was decreased by `amount`, creating a debt to be balanced.
       **/
      Rescinded: AugmentedEvent<ApiType, [amount: u128], { amount: u128 }>;
      /**
       * Some balance was reserved (moved from free to reserved).
       **/
      Reserved: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Some balance was moved from the reserve of the first account to the second account.
       * Final argument indicates the destination balance type.
       **/
      ReserveRepatriated: AugmentedEvent<ApiType, [from: AccountId32, to: AccountId32, amount: u128, destinationStatus: FrameSupportTokensMiscBalanceStatus], { from: AccountId32, to: AccountId32, amount: u128, destinationStatus: FrameSupportTokensMiscBalanceStatus }>;
      /**
       * Some amount was restored into an account.
       **/
      Restored: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Some amount was removed from the account (e.g. for misbehavior).
       **/
      Slashed: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Some amount was suspended from an account (it can be restored later).
       **/
      Suspended: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Some balance was thawed.
       **/
      Thawed: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * The `TotalIssuance` was forcefully changed.
       **/
      TotalIssuanceForced: AugmentedEvent<ApiType, [old: u128, new_: u128], { old: u128, new_: u128 }>;
      /**
       * Transfer succeeded.
       **/
      Transfer: AugmentedEvent<ApiType, [from: AccountId32, to: AccountId32, amount: u128], { from: AccountId32, to: AccountId32, amount: u128 }>;
      /**
       * Some balance was unlocked.
       **/
      Unlocked: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Some balance was unreserved (moved from reserved to free).
       **/
      Unreserved: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * An account was upgraded.
       **/
      Upgraded: AugmentedEvent<ApiType, [who: AccountId32], { who: AccountId32 }>;
      /**
       * Some amount was withdrawn from the account (e.g. for transaction fees).
       **/
      Withdraw: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
    };
    chainSpace: {
      /**
       * A space approval has been restored.
       * \[space identifier, \]
       **/
      ApprovalRestore: AugmentedEvent<ApiType, [space: Bytes], { space: Bytes }>;
      /**
       * A space approval has been revoked.
       * \[space identifier, \]
       **/
      ApprovalRevoke: AugmentedEvent<ApiType, [space: Bytes], { space: Bytes }>;
      /**
       * A new chain space has been approved.
       * \[space identifier \]
       **/
      Approve: AugmentedEvent<ApiType, [space: Bytes], { space: Bytes }>;
      /**
       * A space has been archived.
       * \[space identifier,  authority\]
       **/
      Archive: AugmentedEvent<ApiType, [space: Bytes, authority: AccountId32], { space: Bytes, authority: AccountId32 }>;
      /**
       * A new space authorization has been added.
       * \[space identifier, authorization,  delegate\]
       **/
      Authorization: AugmentedEvent<ApiType, [space: Bytes, authorization: Bytes, delegate: AccountId32], { space: Bytes, authorization: Bytes, delegate: AccountId32 }>;
      /**
       * A new chain space has been created.
       * \[space identifier, creator, authorization\]
       **/
      Create: AugmentedEvent<ApiType, [space: Bytes, creator: AccountId32, authorization: Bytes], { space: Bytes, creator: AccountId32, authorization: Bytes }>;
      /**
       * A space authorization has been removed.
       * \[space identifier, authorization, ]
       **/
      Deauthorization: AugmentedEvent<ApiType, [space: Bytes, authorization: Bytes], { space: Bytes, authorization: Bytes }>;
      /**
       * A chain space usage has been reset.
       * \[space identifier \]
       **/
      ResetUsage: AugmentedEvent<ApiType, [space: Bytes], { space: Bytes }>;
      /**
       * A space has been restored.
       * \[space identifier,  authority\]
       **/
      Restore: AugmentedEvent<ApiType, [space: Bytes, authority: AccountId32], { space: Bytes, authority: AccountId32 }>;
      /**
       * A space has been restored.
       * \[space identifier, \]
       **/
      Revoke: AugmentedEvent<ApiType, [space: Bytes], { space: Bytes }>;
      /**
       * A chain space capacity has been updated.
       * \[space identifier \]
       **/
      UpdateCapacity: AugmentedEvent<ApiType, [space: Bytes], { space: Bytes }>;
    };
    council: {
      /**
       * A motion was approved by the required threshold.
       **/
      Approved: AugmentedEvent<ApiType, [proposalHash: H256], { proposalHash: H256 }>;
      /**
       * A proposal was closed because its threshold was reached or after its
       * duration was up.
       **/
      Closed: AugmentedEvent<ApiType, [proposalHash: H256, yes: u32, no: u32], { proposalHash: H256, yes: u32, no: u32 }>;
      /**
       * A motion was not approved by the required threshold.
       **/
      Disapproved: AugmentedEvent<ApiType, [proposalHash: H256], { proposalHash: H256 }>;
      /**
       * A motion was executed; result will be `Ok` if it returned without
       * error.
       **/
      Executed: AugmentedEvent<ApiType, [proposalHash: H256, result: Result<Null, SpRuntimeDispatchError>], { proposalHash: H256, result: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * A single member did some action; result will be `Ok` if it returned
       * without error.
       **/
      MemberExecuted: AugmentedEvent<ApiType, [proposalHash: H256, result: Result<Null, SpRuntimeDispatchError>], { proposalHash: H256, result: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * A motion (given hash) has been proposed (by given account) with a
       * threshold (given `MemberCount`).
       **/
      Proposed: AugmentedEvent<ApiType, [account: AccountId32, proposalIndex: u32, proposalHash: H256, threshold: u32], { account: AccountId32, proposalIndex: u32, proposalHash: H256, threshold: u32 }>;
      /**
       * A motion (given hash) has been voted on by given account, leaving
       * a tally (yes votes and no votes given respectively as
       * `MemberCount`).
       **/
      Voted: AugmentedEvent<ApiType, [account: AccountId32, proposalHash: H256, voted: bool, yes: u32, no: u32], { account: AccountId32, proposalHash: H256, voted: bool, yes: u32, no: u32 }>;
    };
    councilMembership: {
      /**
       * Phantom member, never used.
       **/
      Dummy: AugmentedEvent<ApiType, []>;
      /**
       * One of the members' keys changed.
       **/
      KeyChanged: AugmentedEvent<ApiType, []>;
      /**
       * The given member was added; see the transaction for who.
       **/
      MemberAdded: AugmentedEvent<ApiType, []>;
      /**
       * The given member was removed; see the transaction for who.
       **/
      MemberRemoved: AugmentedEvent<ApiType, []>;
      /**
       * The membership was reset; see the transaction for who the new set
       * is.
       **/
      MembersReset: AugmentedEvent<ApiType, []>;
      /**
       * Two members were swapped; see the transaction for who.
       **/
      MembersSwapped: AugmentedEvent<ApiType, []>;
    };
    did: {
      /**
       * A DID-authorised call has been executed.
       * \[DID caller, dispatch result\]
       **/
      CallDispatched: AugmentedEvent<ApiType, [identifier: AccountId32, result: Result<Null, SpRuntimeDispatchError>], { identifier: AccountId32, result: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * A new DID has been created.
       * \[transaction signer, DID identifier\]
       **/
      Created: AugmentedEvent<ApiType, [author: AccountId32, identifier: AccountId32], { author: AccountId32, identifier: AccountId32 }>;
      /**
       * A DID has been deleted.
       * \[DID identifier\]
       **/
      Deleted: AugmentedEvent<ApiType, [identifier: AccountId32], { identifier: AccountId32 }>;
      /**
       * A DID has been updated.
       * \[DID identifier\]
       **/
      Updated: AugmentedEvent<ApiType, [identifier: AccountId32], { identifier: AccountId32 }>;
    };
    didName: {
      /**
       * A name has been banned.
       **/
      DidNameBanned: AugmentedEvent<ApiType, [name: Bytes], { name: Bytes }>;
      /**
       * A new name has been claimed.
       **/
      DidNameRegistered: AugmentedEvent<ApiType, [owner: AccountId32, name: Bytes], { owner: AccountId32, name: Bytes }>;
      /**
       * A name has been released.
       **/
      DidNameReleased: AugmentedEvent<ApiType, [owner: AccountId32, name: Bytes], { owner: AccountId32, name: Bytes }>;
      /**
       * A name has been unbanned.
       **/
      DidNameUnbanned: AugmentedEvent<ApiType, [name: Bytes], { name: Bytes }>;
    };
    grandpa: {
      /**
       * New authority set has been applied.
       **/
      NewAuthorities: AugmentedEvent<ApiType, [authoritySet: Vec<ITuple<[SpConsensusGrandpaAppPublic, u64]>>], { authoritySet: Vec<ITuple<[SpConsensusGrandpaAppPublic, u64]>> }>;
      /**
       * Current authority set has been paused.
       **/
      Paused: AugmentedEvent<ApiType, []>;
      /**
       * Current authority set has been resumed.
       **/
      Resumed: AugmentedEvent<ApiType, []>;
    };
    identity: {
      /**
       * A username authority was added.
       **/
      AuthorityAdded: AugmentedEvent<ApiType, [authority: AccountId32], { authority: AccountId32 }>;
      /**
       * A username authority was removed.
       **/
      AuthorityRemoved: AugmentedEvent<ApiType, [authority: AccountId32], { authority: AccountId32 }>;
      /**
       * A dangling username (as in, a username corresponding to an account that has removed its
       * identity) has been removed.
       **/
      DanglingUsernameRemoved: AugmentedEvent<ApiType, [who: AccountId32, username: Bytes], { who: AccountId32, username: Bytes }>;
      /**
       * A name was cleared, and the given balance returned.
       **/
      IdentityCleared: AugmentedEvent<ApiType, [who: AccountId32], { who: AccountId32 }>;
      /**
       * A name was removed and the given balance slashed.
       **/
      IdentityKilled: AugmentedEvent<ApiType, [who: AccountId32], { who: AccountId32 }>;
      /**
       * A name was set or reset (which will remove all judgements).
       **/
      IdentitySet: AugmentedEvent<ApiType, [who: AccountId32], { who: AccountId32 }>;
      /**
       * A judgement was given by a registrar.
       **/
      JudgementGiven: AugmentedEvent<ApiType, [target: AccountId32, registrar: AccountId32], { target: AccountId32, registrar: AccountId32 }>;
      /**
       * A judgement was asked from a registrar.
       **/
      JudgementRequested: AugmentedEvent<ApiType, [who: AccountId32, registrar: AccountId32], { who: AccountId32, registrar: AccountId32 }>;
      /**
       * A judgement request was retracted.
       **/
      JudgementUnrequested: AugmentedEvent<ApiType, [who: AccountId32, registrar: AccountId32], { who: AccountId32, registrar: AccountId32 }>;
      /**
       * A queued username passed its expiration without being claimed and was removed.
       **/
      PreapprovalExpired: AugmentedEvent<ApiType, [whose: AccountId32], { whose: AccountId32 }>;
      /**
       * A username was set as a primary and can be looked up from `who`.
       **/
      PrimaryUsernameSet: AugmentedEvent<ApiType, [who: AccountId32, username: Bytes], { who: AccountId32, username: Bytes }>;
      /**
       * A registrar was added.
       **/
      RegistrarAdded: AugmentedEvent<ApiType, [registrarIndex: u32], { registrarIndex: u32 }>;
      /**
       * A registrar was removed.
       **/
      RegistrarRemoved: AugmentedEvent<ApiType, [registrar: AccountId32], { registrar: AccountId32 }>;
      /**
       * A sub-identity was added to an identity and the deposit paid.
       **/
      SubIdentityAdded: AugmentedEvent<ApiType, [sub: AccountId32, main: AccountId32], { sub: AccountId32, main: AccountId32 }>;
      /**
       * A sub-identity was removed from an identity and the deposit freed.
       **/
      SubIdentityRemoved: AugmentedEvent<ApiType, [sub: AccountId32, main: AccountId32], { sub: AccountId32, main: AccountId32 }>;
      /**
       * A sub-identity was cleared, and the given deposit repatriated from the
       * main identity account to the sub-identity account.
       **/
      SubIdentityRevoked: AugmentedEvent<ApiType, [sub: AccountId32, main: AccountId32], { sub: AccountId32, main: AccountId32 }>;
      /**
       * A username was queued, but `who` must accept it prior to `expiration`.
       **/
      UsernameQueued: AugmentedEvent<ApiType, [who: AccountId32, username: Bytes, expiration: u32], { who: AccountId32, username: Bytes, expiration: u32 }>;
      /**
       * A username was set for `who`.
       **/
      UsernameSet: AugmentedEvent<ApiType, [who: AccountId32, username: Bytes], { who: AccountId32, username: Bytes }>;
    };
    imOnline: {
      /**
       * At the end of the session, no offence was committed.
       **/
      AllGood: AugmentedEvent<ApiType, []>;
      /**
       * A new heartbeat was received from `AuthorityId`.
       **/
      HeartbeatReceived: AugmentedEvent<ApiType, [authorityId: PalletImOnlineSr25519AppSr25519Public], { authorityId: PalletImOnlineSr25519AppSr25519Public }>;
      /**
       * At the end of the session, at least one validator was found to be offline.
       **/
      SomeOffline: AugmentedEvent<ApiType, [offline: Vec<ITuple<[AccountId32, Null]>>], { offline: Vec<ITuple<[AccountId32, Null]>> }>;
    };
    indices: {
      /**
       * A account index was assigned.
       **/
      IndexAssigned: AugmentedEvent<ApiType, [who: AccountId32, index: u32], { who: AccountId32, index: u32 }>;
      /**
       * A account index has been freed up (unassigned).
       **/
      IndexFreed: AugmentedEvent<ApiType, [index: u32], { index: u32 }>;
      /**
       * A account index has been frozen to its current account ID.
       **/
      IndexFrozen: AugmentedEvent<ApiType, [index: u32, who: AccountId32], { index: u32, who: AccountId32 }>;
    };
    multisig: {
      /**
       * A multisig operation has been approved by someone.
       **/
      MultisigApproval: AugmentedEvent<ApiType, [approving: AccountId32, timepoint: PalletMultisigTimepoint, multisig: AccountId32, callHash: U8aFixed], { approving: AccountId32, timepoint: PalletMultisigTimepoint, multisig: AccountId32, callHash: U8aFixed }>;
      /**
       * A multisig operation has been cancelled.
       **/
      MultisigCancelled: AugmentedEvent<ApiType, [cancelling: AccountId32, timepoint: PalletMultisigTimepoint, multisig: AccountId32, callHash: U8aFixed], { cancelling: AccountId32, timepoint: PalletMultisigTimepoint, multisig: AccountId32, callHash: U8aFixed }>;
      /**
       * A multisig operation has been executed.
       **/
      MultisigExecuted: AugmentedEvent<ApiType, [approving: AccountId32, timepoint: PalletMultisigTimepoint, multisig: AccountId32, callHash: U8aFixed, result: Result<Null, SpRuntimeDispatchError>], { approving: AccountId32, timepoint: PalletMultisigTimepoint, multisig: AccountId32, callHash: U8aFixed, result: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * A new multisig operation has begun.
       **/
      NewMultisig: AugmentedEvent<ApiType, [approving: AccountId32, multisig: AccountId32, callHash: U8aFixed], { approving: AccountId32, multisig: AccountId32, callHash: U8aFixed }>;
    };
    networkMembership: {
      /**
       * A membership was acquired
       **/
      MembershipAcquired: AugmentedEvent<ApiType, [member: AccountId32], { member: AccountId32 }>;
      /**
       * A membership expired
       **/
      MembershipExpired: AugmentedEvent<ApiType, [member: AccountId32], { member: AccountId32 }>;
      /**
       * A membership renew request
       **/
      MembershipRenewalRequested: AugmentedEvent<ApiType, [member: AccountId32], { member: AccountId32 }>;
      /**
       * A membership was renewed
       **/
      MembershipRenewed: AugmentedEvent<ApiType, [member: AccountId32], { member: AccountId32 }>;
      /**
       * A membership was revoked
       **/
      MembershipRevoked: AugmentedEvent<ApiType, [member: AccountId32], { member: AccountId32 }>;
    };
    networkScore: {
      /**
       * Aggregate scores has been updated.
       * \[entity identifier\]
       **/
      AggregateScoreUpdated: AugmentedEvent<ApiType, [entity: Bytes], { entity: Bytes }>;
      /**
       * A new rating entry has been added.
       * \[rating entry identifier, entity, provider, creator\]
       **/
      RatingEntryAdded: AugmentedEvent<ApiType, [identifier: Bytes, entity: Bytes, provider: AccountId32, creator: AccountId32], { identifier: Bytes, entity: Bytes, provider: AccountId32, creator: AccountId32 }>;
      /**
       * A rating entry has been revised (after amend).
       * \[rating entry identifier, entity, creator \]
       **/
      RatingEntryRevised: AugmentedEvent<ApiType, [identifier: Bytes, entity: Bytes, provider: AccountId32, creator: AccountId32], { identifier: Bytes, entity: Bytes, provider: AccountId32, creator: AccountId32 }>;
      /**
       * A rating entry has been amended.
       * \[rating entry identifier, entity, creator\]
       **/
      RatingEntryRevoked: AugmentedEvent<ApiType, [identifier: Bytes, entity: Bytes, provider: AccountId32, creator: AccountId32], { identifier: Bytes, entity: Bytes, provider: AccountId32, creator: AccountId32 }>;
    };
    nodeAuthorization: {
      /**
       * The given claim was removed by its owner.
       **/
      ClaimRemoved: AugmentedEvent<ApiType, [peerId: OpaquePeerId, who: AccountId32], { peerId: OpaquePeerId, who: AccountId32 }>;
      /**
       * The allowed connections were added to a node.
       **/
      ConnectionsAdded: AugmentedEvent<ApiType, [nodeId: Bytes, connection: Bytes], { nodeId: Bytes, connection: Bytes }>;
      /**
       * The allowed connections were removed from a node.
       **/
      ConnectionsRemoved: AugmentedEvent<ApiType, [nodeId: Bytes, connection: Bytes], { nodeId: Bytes, connection: Bytes }>;
      /**
       * The given well known node was added.
       **/
      NodeAdded: AugmentedEvent<ApiType, [nodeId: Bytes, who: AccountId32], { nodeId: Bytes, who: AccountId32 }>;
      /**
       * The given node was claimed by a user.
       **/
      NodeClaimed: AugmentedEvent<ApiType, [peerId: OpaquePeerId, who: AccountId32], { peerId: OpaquePeerId, who: AccountId32 }>;
      /**
       * The given well known node was removed.
       **/
      NodeRemoved: AugmentedEvent<ApiType, [nodeId: Bytes], { nodeId: Bytes }>;
      /**
       * The given well known nodes were reset.
       **/
      NodesReset: AugmentedEvent<ApiType, [nodes: Vec<ITuple<[OpaquePeerId, AccountId32]>>], { nodes: Vec<ITuple<[OpaquePeerId, AccountId32]>> }>;
      /**
       * The given well known node was swapped; first item was removed,
       * the latter was added.
       **/
      NodeSwapped: AugmentedEvent<ApiType, [removed: Bytes, added: Bytes], { removed: Bytes, added: Bytes }>;
      /**
       * The node was transferred to another account.
       **/
      NodeTransferred: AugmentedEvent<ApiType, [nodeId: Bytes, target: AccountId32], { nodeId: Bytes, target: AccountId32 }>;
    };
    offences: {
      /**
       * There is an offence reported of the given `kind` happened at the
       * `session_index` and (kind-specific) time slot. This event is not
       * deposited for duplicate slashes. \[kind, timeslot\].
       **/
      Offence: AugmentedEvent<ApiType, [kind: U8aFixed, timeslot: Bytes], { kind: U8aFixed, timeslot: Bytes }>;
    };
    preimage: {
      /**
       * A preimage has ben cleared.
       **/
      Cleared: AugmentedEvent<ApiType, [hash_: H256], { hash_: H256 }>;
      /**
       * A preimage has been noted.
       **/
      Noted: AugmentedEvent<ApiType, [hash_: H256], { hash_: H256 }>;
      /**
       * A preimage has been requested.
       **/
      Requested: AugmentedEvent<ApiType, [hash_: H256], { hash_: H256 }>;
    };
    remark: {
      /**
       * Stored data off chain.
       **/
      Stored: AugmentedEvent<ApiType, [sender: AccountId32, contentHash: H256], { sender: AccountId32, contentHash: H256 }>;
    };
    scheduler: {
      /**
       * The call for the provided hash was not found so the task has been aborted.
       **/
      CallUnavailable: AugmentedEvent<ApiType, [task: ITuple<[u32, u32]>, id: Option<U8aFixed>], { task: ITuple<[u32, u32]>, id: Option<U8aFixed> }>;
      /**
       * Canceled some task.
       **/
      Canceled: AugmentedEvent<ApiType, [when: u32, index: u32], { when: u32, index: u32 }>;
      /**
       * Dispatched some task.
       **/
      Dispatched: AugmentedEvent<ApiType, [task: ITuple<[u32, u32]>, id: Option<U8aFixed>, result: Result<Null, SpRuntimeDispatchError>], { task: ITuple<[u32, u32]>, id: Option<U8aFixed>, result: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * The given task was unable to be renewed since the agenda is full at that block.
       **/
      PeriodicFailed: AugmentedEvent<ApiType, [task: ITuple<[u32, u32]>, id: Option<U8aFixed>], { task: ITuple<[u32, u32]>, id: Option<U8aFixed> }>;
      /**
       * The given task can never be executed since it is overweight.
       **/
      PermanentlyOverweight: AugmentedEvent<ApiType, [task: ITuple<[u32, u32]>, id: Option<U8aFixed>], { task: ITuple<[u32, u32]>, id: Option<U8aFixed> }>;
      /**
       * Cancel a retry configuration for some task.
       **/
      RetryCancelled: AugmentedEvent<ApiType, [task: ITuple<[u32, u32]>, id: Option<U8aFixed>], { task: ITuple<[u32, u32]>, id: Option<U8aFixed> }>;
      /**
       * The given task was unable to be retried since the agenda is full at that block or there
       * was not enough weight to reschedule it.
       **/
      RetryFailed: AugmentedEvent<ApiType, [task: ITuple<[u32, u32]>, id: Option<U8aFixed>], { task: ITuple<[u32, u32]>, id: Option<U8aFixed> }>;
      /**
       * Set a retry configuration for some task.
       **/
      RetrySet: AugmentedEvent<ApiType, [task: ITuple<[u32, u32]>, id: Option<U8aFixed>, period: u32, retries: u8], { task: ITuple<[u32, u32]>, id: Option<U8aFixed>, period: u32, retries: u8 }>;
      /**
       * Scheduled some task.
       **/
      Scheduled: AugmentedEvent<ApiType, [when: u32, index: u32], { when: u32, index: u32 }>;
    };
    schema: {
      /**
       * A new schema has been created.
       * \[schema identifier, digest, author\]
       **/
      Created: AugmentedEvent<ApiType, [identifier: Bytes, creator: AccountId32], { identifier: Bytes, creator: AccountId32 }>;
    };
    session: {
      /**
       * New session has happened. Note that the argument is the session index, not the
       * block number as the type might suggest.
       **/
      NewSession: AugmentedEvent<ApiType, [sessionIndex: u32], { sessionIndex: u32 }>;
    };
    statement: {
      /**
       * A statement identifier has been removed.
       * \[statement identifier,  controller\]
       **/
      PartialRemoval: AugmentedEvent<ApiType, [identifier: Bytes, removed: u32, author: AccountId32], { identifier: Bytes, removed: u32, author: AccountId32 }>;
      /**
       * A statement digest has been added.
       * \[statement identifier, digest, controller\]
       **/
      PresentationAdded: AugmentedEvent<ApiType, [identifier: Bytes, digest: H256, author: AccountId32], { identifier: Bytes, digest: H256, author: AccountId32 }>;
      /**
       * A statement digest has been added.
       * \[statement identifier, digest, controller\]
       **/
      PresentationRemoved: AugmentedEvent<ApiType, [identifier: Bytes, digest: H256, author: AccountId32], { identifier: Bytes, digest: H256, author: AccountId32 }>;
      /**
       * A new statement identifier has been registered.
       * \[statement identifier, statement digest, controller\]
       **/
      Register: AugmentedEvent<ApiType, [identifier: Bytes, digest: H256, author: AccountId32], { identifier: Bytes, digest: H256, author: AccountId32 }>;
      /**
       * A statement batch has been processed.
       * \[successful count, failed count, failed indices,
       * controller]
       **/
      RegisterBatch: AugmentedEvent<ApiType, [successful: u32, failed: u32, indices: Vec<u16>, author: AccountId32], { successful: u32, failed: u32, indices: Vec<u16>, author: AccountId32 }>;
      /**
       * A statement identifier has been removed.
       * \[statement identifier,  controller\]
       **/
      Remove: AugmentedEvent<ApiType, [identifier: Bytes, author: AccountId32], { identifier: Bytes, author: AccountId32 }>;
      /**
       * A statement identifier status has been restored.
       * \[statement identifier, controller\]
       **/
      Restore: AugmentedEvent<ApiType, [identifier: Bytes, author: AccountId32], { identifier: Bytes, author: AccountId32 }>;
      /**
       * A statement identifier status has been revoked.
       * \[statement identifier, controller\]
       **/
      Revoke: AugmentedEvent<ApiType, [identifier: Bytes, author: AccountId32], { identifier: Bytes, author: AccountId32 }>;
      /**
       * A statement identifier has been updated.
       * \[statement identifier, digest, controller\]
       **/
      Update: AugmentedEvent<ApiType, [identifier: Bytes, digest: H256, author: AccountId32], { identifier: Bytes, digest: H256, author: AccountId32 }>;
    };
    sudo: {
      /**
       * The sudo key has been updated.
       **/
      KeyChanged: AugmentedEvent<ApiType, [old: Option<AccountId32>, new_: AccountId32], { old: Option<AccountId32>, new_: AccountId32 }>;
      /**
       * The key was permanently removed.
       **/
      KeyRemoved: AugmentedEvent<ApiType, []>;
      /**
       * A sudo call just took place.
       **/
      Sudid: AugmentedEvent<ApiType, [sudoResult: Result<Null, SpRuntimeDispatchError>], { sudoResult: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * A [sudo_as](Pallet::sudo_as) call just took place.
       **/
      SudoAsDone: AugmentedEvent<ApiType, [sudoResult: Result<Null, SpRuntimeDispatchError>], { sudoResult: Result<Null, SpRuntimeDispatchError> }>;
    };
    system: {
      /**
       * `:code` was updated.
       **/
      CodeUpdated: AugmentedEvent<ApiType, []>;
      /**
       * An extrinsic failed.
       **/
      ExtrinsicFailed: AugmentedEvent<ApiType, [dispatchError: SpRuntimeDispatchError, dispatchInfo: FrameSupportDispatchDispatchInfo], { dispatchError: SpRuntimeDispatchError, dispatchInfo: FrameSupportDispatchDispatchInfo }>;
      /**
       * An extrinsic completed successfully.
       **/
      ExtrinsicSuccess: AugmentedEvent<ApiType, [dispatchInfo: FrameSupportDispatchDispatchInfo], { dispatchInfo: FrameSupportDispatchDispatchInfo }>;
      /**
       * An account was reaped.
       **/
      KilledAccount: AugmentedEvent<ApiType, [account: AccountId32], { account: AccountId32 }>;
      /**
       * A new account was created.
       **/
      NewAccount: AugmentedEvent<ApiType, [account: AccountId32], { account: AccountId32 }>;
      /**
       * On on-chain remark happened.
       **/
      Remarked: AugmentedEvent<ApiType, [sender: AccountId32, hash_: H256], { sender: AccountId32, hash_: H256 }>;
      /**
       * An upgrade was authorized.
       **/
      UpgradeAuthorized: AugmentedEvent<ApiType, [codeHash: H256, checkVersion: bool], { codeHash: H256, checkVersion: bool }>;
    };
    technicalCommittee: {
      /**
       * A motion was approved by the required threshold.
       **/
      Approved: AugmentedEvent<ApiType, [proposalHash: H256], { proposalHash: H256 }>;
      /**
       * A proposal was closed because its threshold was reached or after its
       * duration was up.
       **/
      Closed: AugmentedEvent<ApiType, [proposalHash: H256, yes: u32, no: u32], { proposalHash: H256, yes: u32, no: u32 }>;
      /**
       * A motion was not approved by the required threshold.
       **/
      Disapproved: AugmentedEvent<ApiType, [proposalHash: H256], { proposalHash: H256 }>;
      /**
       * A motion was executed; result will be `Ok` if it returned without
       * error.
       **/
      Executed: AugmentedEvent<ApiType, [proposalHash: H256, result: Result<Null, SpRuntimeDispatchError>], { proposalHash: H256, result: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * A single member did some action; result will be `Ok` if it returned
       * without error.
       **/
      MemberExecuted: AugmentedEvent<ApiType, [proposalHash: H256, result: Result<Null, SpRuntimeDispatchError>], { proposalHash: H256, result: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * A motion (given hash) has been proposed (by given account) with a
       * threshold (given `MemberCount`).
       **/
      Proposed: AugmentedEvent<ApiType, [account: AccountId32, proposalIndex: u32, proposalHash: H256, threshold: u32], { account: AccountId32, proposalIndex: u32, proposalHash: H256, threshold: u32 }>;
      /**
       * A motion (given hash) has been voted on by given account, leaving
       * a tally (yes votes and no votes given respectively as
       * `MemberCount`).
       **/
      Voted: AugmentedEvent<ApiType, [account: AccountId32, proposalHash: H256, voted: bool, yes: u32, no: u32], { account: AccountId32, proposalHash: H256, voted: bool, yes: u32, no: u32 }>;
    };
    technicalMembership: {
      /**
       * Phantom member, never used.
       **/
      Dummy: AugmentedEvent<ApiType, []>;
      /**
       * One of the members' keys changed.
       **/
      KeyChanged: AugmentedEvent<ApiType, []>;
      /**
       * The given member was added; see the transaction for who.
       **/
      MemberAdded: AugmentedEvent<ApiType, []>;
      /**
       * The given member was removed; see the transaction for who.
       **/
      MemberRemoved: AugmentedEvent<ApiType, []>;
      /**
       * The membership was reset; see the transaction for who the new set
       * is.
       **/
      MembersReset: AugmentedEvent<ApiType, []>;
      /**
       * Two members were swapped; see the transaction for who.
       **/
      MembersSwapped: AugmentedEvent<ApiType, []>;
    };
    utility: {
      /**
       * Batch of dispatches completed fully with no error.
       **/
      BatchCompleted: AugmentedEvent<ApiType, []>;
      /**
       * Batch of dispatches completed but has errors.
       **/
      BatchCompletedWithErrors: AugmentedEvent<ApiType, []>;
      /**
       * Batch of dispatches did not complete fully. Index of first failing dispatch given, as
       * well as the error.
       **/
      BatchInterrupted: AugmentedEvent<ApiType, [index: u32, error: SpRuntimeDispatchError], { index: u32, error: SpRuntimeDispatchError }>;
      /**
       * A call was dispatched.
       **/
      DispatchedAs: AugmentedEvent<ApiType, [result: Result<Null, SpRuntimeDispatchError>], { result: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * A single item within a Batch of dispatches has completed with no error.
       **/
      ItemCompleted: AugmentedEvent<ApiType, []>;
      /**
       * A single item within a Batch of dispatches has completed with error.
       **/
      ItemFailed: AugmentedEvent<ApiType, [error: SpRuntimeDispatchError], { error: SpRuntimeDispatchError }>;
    };
  } // AugmentedEvents
} // declare module
