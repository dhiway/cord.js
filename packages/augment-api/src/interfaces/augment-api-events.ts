// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/events';

import type { ApiTypes, AugmentedEvent } from '@polkadot/api-base/types';
import type { Bytes, Null, Option, Result, U8aFixed, Vec, bool, u128, u16, u32, u64, u8 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { OpaquePeerId } from '@polkadot/types/interfaces/imOnline';
import type { AccountId32, H256, Permill } from '@polkadot/types/interfaces/runtime';
import type { FrameSupportDispatchDispatchInfo, FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensMiscBalanceStatus, PalletContractsOrigin, PalletImOnlineSr25519AppSr25519Public, PalletMultisigTimepoint, SpConsensusGrandpaAppPublic, SpRuntimeDispatchError } from '@polkadot/types/lookup';

export type __AugmentedEvent<ApiType extends ApiTypes> = AugmentedEvent<ApiType>;

declare module '@polkadot/api-base/types/events' {
  interface AugmentedEvents<ApiType extends ApiTypes> {
    assetConversion: {
      /**
       * A successful call of the `AddLiquidity` extrinsic will create this event.
       **/
      LiquidityAdded: AugmentedEvent<ApiType, [who: AccountId32, mintTo: AccountId32, poolId: ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]>, amount1Provided: u128, amount2Provided: u128, lpToken: u32, lpTokenMinted: u128], { who: AccountId32, mintTo: AccountId32, poolId: ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]>, amount1Provided: u128, amount2Provided: u128, lpToken: u32, lpTokenMinted: u128 }>;
      /**
       * A successful call of the `RemoveLiquidity` extrinsic will create this event.
       **/
      LiquidityRemoved: AugmentedEvent<ApiType, [who: AccountId32, withdrawTo: AccountId32, poolId: ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]>, amount1: u128, amount2: u128, lpToken: u32, lpTokenBurned: u128, withdrawalFee: Permill], { who: AccountId32, withdrawTo: AccountId32, poolId: ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]>, amount1: u128, amount2: u128, lpToken: u32, lpTokenBurned: u128, withdrawalFee: Permill }>;
      /**
       * A successful call of the `CreatePool` extrinsic will create this event.
       **/
      PoolCreated: AugmentedEvent<ApiType, [creator: AccountId32, poolId: ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]>, poolAccount: AccountId32, lpToken: u32], { creator: AccountId32, poolId: ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]>, poolAccount: AccountId32, lpToken: u32 }>;
      /**
       * Assets have been converted from one to another.
       **/
      SwapCreditExecuted: AugmentedEvent<ApiType, [amountIn: u128, amountOut: u128, path: Vec<ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, u128]>>], { amountIn: u128, amountOut: u128, path: Vec<ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, u128]>> }>;
      /**
       * Assets have been converted from one to another. Both `SwapExactTokenForToken`
       * and `SwapTokenForExactToken` will generate this event.
       **/
      SwapExecuted: AugmentedEvent<ApiType, [who: AccountId32, sendTo: AccountId32, amountIn: u128, amountOut: u128, path: Vec<ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, u128]>>], { who: AccountId32, sendTo: AccountId32, amountIn: u128, amountOut: u128, path: Vec<ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, u128]>> }>;
      /**
       * Pool has been touched in order to fulfill operational requirements.
       **/
      Touched: AugmentedEvent<ApiType, [poolId: ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]>, who: AccountId32], { poolId: ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]>, who: AccountId32 }>;
    };
    assets: {
      /**
       * Accounts were destroyed for given asset.
       **/
      AccountsDestroyed: AugmentedEvent<ApiType, [assetId: u32, accountsDestroyed: u32, accountsRemaining: u32], { assetId: u32, accountsDestroyed: u32, accountsRemaining: u32 }>;
      /**
       * An approval for account `delegate` was cancelled by `owner`.
       **/
      ApprovalCancelled: AugmentedEvent<ApiType, [assetId: u32, owner: AccountId32, delegate: AccountId32], { assetId: u32, owner: AccountId32, delegate: AccountId32 }>;
      /**
       * Approvals were destroyed for given asset.
       **/
      ApprovalsDestroyed: AugmentedEvent<ApiType, [assetId: u32, approvalsDestroyed: u32, approvalsRemaining: u32], { assetId: u32, approvalsDestroyed: u32, approvalsRemaining: u32 }>;
      /**
       * (Additional) funds have been approved for transfer to a destination account.
       **/
      ApprovedTransfer: AugmentedEvent<ApiType, [assetId: u32, source: AccountId32, delegate: AccountId32, amount: u128], { assetId: u32, source: AccountId32, delegate: AccountId32, amount: u128 }>;
      /**
       * Some asset `asset_id` was frozen.
       **/
      AssetFrozen: AugmentedEvent<ApiType, [assetId: u32], { assetId: u32 }>;
      /**
       * The min_balance of an asset has been updated by the asset owner.
       **/
      AssetMinBalanceChanged: AugmentedEvent<ApiType, [assetId: u32, newMinBalance: u128], { assetId: u32, newMinBalance: u128 }>;
      /**
       * An asset has had its attributes changed by the `Force` origin.
       **/
      AssetStatusChanged: AugmentedEvent<ApiType, [assetId: u32], { assetId: u32 }>;
      /**
       * Some asset `asset_id` was thawed.
       **/
      AssetThawed: AugmentedEvent<ApiType, [assetId: u32], { assetId: u32 }>;
      /**
       * Some account `who` was blocked.
       **/
      Blocked: AugmentedEvent<ApiType, [assetId: u32, who: AccountId32], { assetId: u32, who: AccountId32 }>;
      /**
       * Some assets were destroyed.
       **/
      Burned: AugmentedEvent<ApiType, [assetId: u32, owner: AccountId32, balance: u128], { assetId: u32, owner: AccountId32, balance: u128 }>;
      /**
       * Some asset class was created.
       **/
      Created: AugmentedEvent<ApiType, [assetId: u32, creator: AccountId32, owner: AccountId32], { assetId: u32, creator: AccountId32, owner: AccountId32 }>;
      /**
       * Some assets were deposited (e.g. for transaction fees).
       **/
      Deposited: AugmentedEvent<ApiType, [assetId: u32, who: AccountId32, amount: u128], { assetId: u32, who: AccountId32, amount: u128 }>;
      /**
       * An asset class was destroyed.
       **/
      Destroyed: AugmentedEvent<ApiType, [assetId: u32], { assetId: u32 }>;
      /**
       * An asset class is in the process of being destroyed.
       **/
      DestructionStarted: AugmentedEvent<ApiType, [assetId: u32], { assetId: u32 }>;
      /**
       * Some asset class was force-created.
       **/
      ForceCreated: AugmentedEvent<ApiType, [assetId: u32, owner: AccountId32], { assetId: u32, owner: AccountId32 }>;
      /**
       * Some account `who` was frozen.
       **/
      Frozen: AugmentedEvent<ApiType, [assetId: u32, who: AccountId32], { assetId: u32, who: AccountId32 }>;
      /**
       * Some assets were issued.
       **/
      Issued: AugmentedEvent<ApiType, [assetId: u32, owner: AccountId32, amount: u128], { assetId: u32, owner: AccountId32, amount: u128 }>;
      /**
       * Metadata has been cleared for an asset.
       **/
      MetadataCleared: AugmentedEvent<ApiType, [assetId: u32], { assetId: u32 }>;
      /**
       * New metadata has been set for an asset.
       **/
      MetadataSet: AugmentedEvent<ApiType, [assetId: u32, name: Bytes, symbol_: Bytes, decimals: u8, isFrozen: bool], { assetId: u32, name: Bytes, symbol: Bytes, decimals: u8, isFrozen: bool }>;
      /**
       * The owner changed.
       **/
      OwnerChanged: AugmentedEvent<ApiType, [assetId: u32, owner: AccountId32], { assetId: u32, owner: AccountId32 }>;
      /**
       * The management team changed.
       **/
      TeamChanged: AugmentedEvent<ApiType, [assetId: u32, issuer: AccountId32, admin: AccountId32, freezer: AccountId32], { assetId: u32, issuer: AccountId32, admin: AccountId32, freezer: AccountId32 }>;
      /**
       * Some account `who` was thawed.
       **/
      Thawed: AugmentedEvent<ApiType, [assetId: u32, who: AccountId32], { assetId: u32, who: AccountId32 }>;
      /**
       * Some account `who` was created with a deposit from `depositor`.
       **/
      Touched: AugmentedEvent<ApiType, [assetId: u32, who: AccountId32, depositor: AccountId32], { assetId: u32, who: AccountId32, depositor: AccountId32 }>;
      /**
       * Some assets were transferred.
       **/
      Transferred: AugmentedEvent<ApiType, [assetId: u32, from: AccountId32, to: AccountId32, amount: u128], { assetId: u32, from: AccountId32, to: AccountId32, amount: u128 }>;
      /**
       * An `amount` was transferred in its entirety from `owner` to `destination` by
       * the approved `delegate`.
       **/
      TransferredApproved: AugmentedEvent<ApiType, [assetId: u32, owner: AccountId32, delegate: AccountId32, destination: AccountId32, amount: u128], { assetId: u32, owner: AccountId32, delegate: AccountId32, destination: AccountId32, amount: u128 }>;
      /**
       * Some assets were withdrawn from the account (e.g. for transaction fees).
       **/
      Withdrawn: AugmentedEvent<ApiType, [assetId: u32, who: AccountId32, amount: u128], { assetId: u32, who: AccountId32, amount: u128 }>;
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
       * A member is added to the blacklist and is scheduled for removal in 2 sessions due to
       * non-availability.
       **/
      MemberBlacklistedRemoved: AugmentedEvent<ApiType, [AccountId32]>;
      /**
       * A member is scheduled for removal in 2 sessions due to non-availability.
       **/
      MemberDisconnected: AugmentedEvent<ApiType, [AccountId32]>;
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
    contracts: {
      /**
       * A contract was called either by a plain account or another contract.
       * 
       * # Note
       * 
       * Please keep in mind that like all events this is only emitted for successful
       * calls. This is because on failure all storage changes including events are
       * rolled back.
       **/
      Called: AugmentedEvent<ApiType, [caller: PalletContractsOrigin, contract: AccountId32], { caller: PalletContractsOrigin, contract: AccountId32 }>;
      /**
       * A code with the specified hash was removed.
       **/
      CodeRemoved: AugmentedEvent<ApiType, [codeHash: H256, depositReleased: u128, remover: AccountId32], { codeHash: H256, depositReleased: u128, remover: AccountId32 }>;
      /**
       * Code with the specified hash has been stored.
       **/
      CodeStored: AugmentedEvent<ApiType, [codeHash: H256, depositHeld: u128, uploader: AccountId32], { codeHash: H256, depositHeld: u128, uploader: AccountId32 }>;
      /**
       * A contract's code was updated.
       **/
      ContractCodeUpdated: AugmentedEvent<ApiType, [contract: AccountId32, newCodeHash: H256, oldCodeHash: H256], { contract: AccountId32, newCodeHash: H256, oldCodeHash: H256 }>;
      /**
       * A custom event emitted by the contract.
       **/
      ContractEmitted: AugmentedEvent<ApiType, [contract: AccountId32, data: Bytes], { contract: AccountId32, data: Bytes }>;
      /**
       * A contract delegate called a code hash.
       * 
       * # Note
       * 
       * Please keep in mind that like all events this is only emitted for successful
       * calls. This is because on failure all storage changes including events are
       * rolled back.
       **/
      DelegateCalled: AugmentedEvent<ApiType, [contract: AccountId32, codeHash: H256], { contract: AccountId32, codeHash: H256 }>;
      /**
       * Contract deployed by address at the specified address.
       **/
      Instantiated: AugmentedEvent<ApiType, [deployer: AccountId32, contract: AccountId32], { deployer: AccountId32, contract: AccountId32 }>;
      /**
       * Some funds have been transferred and held as storage deposit.
       **/
      StorageDepositTransferredAndHeld: AugmentedEvent<ApiType, [from: AccountId32, to: AccountId32, amount: u128], { from: AccountId32, to: AccountId32, amount: u128 }>;
      /**
       * Some storage deposit funds have been transferred and released.
       **/
      StorageDepositTransferredAndReleased: AugmentedEvent<ApiType, [from: AccountId32, to: AccountId32, amount: u128], { from: AccountId32, to: AccountId32, amount: u128 }>;
      /**
       * Contract has been removed.
       * 
       * # Note
       * 
       * The only way for a contract to be removed and emitting this event is by calling
       * `seal_terminate`.
       **/
      Terminated: AugmentedEvent<ApiType, [contract: AccountId32, beneficiary: AccountId32], { contract: AccountId32, beneficiary: AccountId32 }>;
    };
    council: {
      /**
       * A motion was approved by the required threshold.
       **/
      Approved: AugmentedEvent<ApiType, [proposalHash: H256], { proposalHash: H256 }>;
      /**
       * A proposal was closed because its threshold was reached or after its duration was up.
       **/
      Closed: AugmentedEvent<ApiType, [proposalHash: H256, yes: u32, no: u32], { proposalHash: H256, yes: u32, no: u32 }>;
      /**
       * A motion was not approved by the required threshold.
       **/
      Disapproved: AugmentedEvent<ApiType, [proposalHash: H256], { proposalHash: H256 }>;
      /**
       * A motion was executed; result will be `Ok` if it returned without error.
       **/
      Executed: AugmentedEvent<ApiType, [proposalHash: H256, result: Result<Null, SpRuntimeDispatchError>], { proposalHash: H256, result: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * A single member did some action; result will be `Ok` if it returned without error.
       **/
      MemberExecuted: AugmentedEvent<ApiType, [proposalHash: H256, result: Result<Null, SpRuntimeDispatchError>], { proposalHash: H256, result: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * A motion (given hash) has been proposed (by given account) with a threshold (given
       * `MemberCount`).
       **/
      Proposed: AugmentedEvent<ApiType, [account: AccountId32, proposalIndex: u32, proposalHash: H256, threshold: u32], { account: AccountId32, proposalIndex: u32, proposalHash: H256, threshold: u32 }>;
      /**
       * A motion (given hash) has been voted on by given account, leaving
       * a tally (yes votes and no votes given respectively as `MemberCount`).
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
    entries: {
      /**
       * A new registry entry has been created.
       * \[creator, registry_identifier, registry_entry_identifier\]
       **/
      RegistryEntryCreated: AugmentedEvent<ApiType, [creator: AccountId32, registryId: Bytes, registryEntryId: Bytes], { creator: AccountId32, registryId: Bytes, registryEntryId: Bytes }>;
      /**
       * A existing registry entry has been reinstated.
       * \[updater, registry_enrtry_identifier\]
       **/
      RegistryEntryReinstated: AugmentedEvent<ApiType, [updater: AccountId32, registryEntryId: Bytes], { updater: AccountId32, registryEntryId: Bytes }>;
      /**
       * A existing registry entry has been revoked.
       * \[updater, registry_entry_identifier\]
       **/
      RegistryEntryRevoked: AugmentedEvent<ApiType, [updater: AccountId32, registryEntryId: Bytes], { updater: AccountId32, registryEntryId: Bytes }>;
      /**
       * A existing registry entry has been updated.
       * \[updater, registry_entry_identifier\]
       **/
      RegistryEntryUpdated: AugmentedEvent<ApiType, [updater: AccountId32, registryEntryId: Bytes], { updater: AccountId32, registryEntryId: Bytes }>;
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
    poolAssets: {
      /**
       * Accounts were destroyed for given asset.
       **/
      AccountsDestroyed: AugmentedEvent<ApiType, [assetId: u32, accountsDestroyed: u32, accountsRemaining: u32], { assetId: u32, accountsDestroyed: u32, accountsRemaining: u32 }>;
      /**
       * An approval for account `delegate` was cancelled by `owner`.
       **/
      ApprovalCancelled: AugmentedEvent<ApiType, [assetId: u32, owner: AccountId32, delegate: AccountId32], { assetId: u32, owner: AccountId32, delegate: AccountId32 }>;
      /**
       * Approvals were destroyed for given asset.
       **/
      ApprovalsDestroyed: AugmentedEvent<ApiType, [assetId: u32, approvalsDestroyed: u32, approvalsRemaining: u32], { assetId: u32, approvalsDestroyed: u32, approvalsRemaining: u32 }>;
      /**
       * (Additional) funds have been approved for transfer to a destination account.
       **/
      ApprovedTransfer: AugmentedEvent<ApiType, [assetId: u32, source: AccountId32, delegate: AccountId32, amount: u128], { assetId: u32, source: AccountId32, delegate: AccountId32, amount: u128 }>;
      /**
       * Some asset `asset_id` was frozen.
       **/
      AssetFrozen: AugmentedEvent<ApiType, [assetId: u32], { assetId: u32 }>;
      /**
       * The min_balance of an asset has been updated by the asset owner.
       **/
      AssetMinBalanceChanged: AugmentedEvent<ApiType, [assetId: u32, newMinBalance: u128], { assetId: u32, newMinBalance: u128 }>;
      /**
       * An asset has had its attributes changed by the `Force` origin.
       **/
      AssetStatusChanged: AugmentedEvent<ApiType, [assetId: u32], { assetId: u32 }>;
      /**
       * Some asset `asset_id` was thawed.
       **/
      AssetThawed: AugmentedEvent<ApiType, [assetId: u32], { assetId: u32 }>;
      /**
       * Some account `who` was blocked.
       **/
      Blocked: AugmentedEvent<ApiType, [assetId: u32, who: AccountId32], { assetId: u32, who: AccountId32 }>;
      /**
       * Some assets were destroyed.
       **/
      Burned: AugmentedEvent<ApiType, [assetId: u32, owner: AccountId32, balance: u128], { assetId: u32, owner: AccountId32, balance: u128 }>;
      /**
       * Some asset class was created.
       **/
      Created: AugmentedEvent<ApiType, [assetId: u32, creator: AccountId32, owner: AccountId32], { assetId: u32, creator: AccountId32, owner: AccountId32 }>;
      /**
       * Some assets were deposited (e.g. for transaction fees).
       **/
      Deposited: AugmentedEvent<ApiType, [assetId: u32, who: AccountId32, amount: u128], { assetId: u32, who: AccountId32, amount: u128 }>;
      /**
       * An asset class was destroyed.
       **/
      Destroyed: AugmentedEvent<ApiType, [assetId: u32], { assetId: u32 }>;
      /**
       * An asset class is in the process of being destroyed.
       **/
      DestructionStarted: AugmentedEvent<ApiType, [assetId: u32], { assetId: u32 }>;
      /**
       * Some asset class was force-created.
       **/
      ForceCreated: AugmentedEvent<ApiType, [assetId: u32, owner: AccountId32], { assetId: u32, owner: AccountId32 }>;
      /**
       * Some account `who` was frozen.
       **/
      Frozen: AugmentedEvent<ApiType, [assetId: u32, who: AccountId32], { assetId: u32, who: AccountId32 }>;
      /**
       * Some assets were issued.
       **/
      Issued: AugmentedEvent<ApiType, [assetId: u32, owner: AccountId32, amount: u128], { assetId: u32, owner: AccountId32, amount: u128 }>;
      /**
       * Metadata has been cleared for an asset.
       **/
      MetadataCleared: AugmentedEvent<ApiType, [assetId: u32], { assetId: u32 }>;
      /**
       * New metadata has been set for an asset.
       **/
      MetadataSet: AugmentedEvent<ApiType, [assetId: u32, name: Bytes, symbol_: Bytes, decimals: u8, isFrozen: bool], { assetId: u32, name: Bytes, symbol: Bytes, decimals: u8, isFrozen: bool }>;
      /**
       * The owner changed.
       **/
      OwnerChanged: AugmentedEvent<ApiType, [assetId: u32, owner: AccountId32], { assetId: u32, owner: AccountId32 }>;
      /**
       * The management team changed.
       **/
      TeamChanged: AugmentedEvent<ApiType, [assetId: u32, issuer: AccountId32, admin: AccountId32, freezer: AccountId32], { assetId: u32, issuer: AccountId32, admin: AccountId32, freezer: AccountId32 }>;
      /**
       * Some account `who` was thawed.
       **/
      Thawed: AugmentedEvent<ApiType, [assetId: u32, who: AccountId32], { assetId: u32, who: AccountId32 }>;
      /**
       * Some account `who` was created with a deposit from `depositor`.
       **/
      Touched: AugmentedEvent<ApiType, [assetId: u32, who: AccountId32, depositor: AccountId32], { assetId: u32, who: AccountId32, depositor: AccountId32 }>;
      /**
       * Some assets were transferred.
       **/
      Transferred: AugmentedEvent<ApiType, [assetId: u32, from: AccountId32, to: AccountId32, amount: u128], { assetId: u32, from: AccountId32, to: AccountId32, amount: u128 }>;
      /**
       * An `amount` was transferred in its entirety from `owner` to `destination` by
       * the approved `delegate`.
       **/
      TransferredApproved: AugmentedEvent<ApiType, [assetId: u32, owner: AccountId32, delegate: AccountId32, destination: AccountId32, amount: u128], { assetId: u32, owner: AccountId32, delegate: AccountId32, destination: AccountId32, amount: u128 }>;
      /**
       * Some assets were withdrawn from the account (e.g. for transaction fees).
       **/
      Withdrawn: AugmentedEvent<ApiType, [assetId: u32, who: AccountId32, amount: u128], { assetId: u32, who: AccountId32, amount: u128 }>;
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
    registries: {
      /**
       * A registry has been archived.
       * \[registry identifier,  authority\]
       **/
      Archive: AugmentedEvent<ApiType, [registryId: Bytes, authority: AccountId32], { registryId: Bytes, authority: AccountId32 }>;
      /**
       * A new registry authorization has been added.
       * \[registry identifier, authorization,  delegate\]
       **/
      Authorization: AugmentedEvent<ApiType, [registryId: Bytes, authorization: Bytes, delegate: AccountId32], { registryId: Bytes, authorization: Bytes, delegate: AccountId32 }>;
      /**
       * A new registry has been created.
       * \[registry identifier, creator, authorization\]
       **/
      Create: AugmentedEvent<ApiType, [registryId: Bytes, creator: AccountId32, authorization: Bytes], { registryId: Bytes, creator: AccountId32, authorization: Bytes }>;
      /**
       * A registry authorization has been removed.
       * \[registry identifier, authorization, ]
       **/
      Deauthorization: AugmentedEvent<ApiType, [registryId: Bytes, authorization: Bytes], { registryId: Bytes, authorization: Bytes }>;
      /**
       * A registry has been reinstated.
       * \[registry identifier,  authority\]
       **/
      Reinstate: AugmentedEvent<ApiType, [registryId: Bytes, authority: AccountId32], { registryId: Bytes, authority: AccountId32 }>;
      /**
       * A registry has been restored.
       * \[registry identifier, authority\]
       **/
      Restore: AugmentedEvent<ApiType, [registryId: Bytes, authority: AccountId32], { registryId: Bytes, authority: AccountId32 }>;
      /**
       * A registry has been revoked.
       * \[registry identifier, authority\]
       **/
      Revoke: AugmentedEvent<ApiType, [registryId: Bytes, authority: AccountId32], { registryId: Bytes, authority: AccountId32 }>;
      /**
       * A existing registry has been updated.
       * \[registry identifier, updater, authorization\]
       **/
      Update: AugmentedEvent<ApiType, [registryId: Bytes, updater: AccountId32, authorization: Bytes], { registryId: Bytes, updater: AccountId32, authorization: Bytes }>;
    };
    remark: {
      /**
       * Stored data off chain.
       **/
      Stored: AugmentedEvent<ApiType, [sender: AccountId32, contentHash: H256], { sender: AccountId32, contentHash: H256 }>;
    };
    rootTesting: {
      /**
       * Event dispatched when the trigger_defensive extrinsic is called.
       **/
      DefensiveTestCall: AugmentedEvent<ApiType, []>;
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
       * A proposal was closed because its threshold was reached or after its duration was up.
       **/
      Closed: AugmentedEvent<ApiType, [proposalHash: H256, yes: u32, no: u32], { proposalHash: H256, yes: u32, no: u32 }>;
      /**
       * A motion was not approved by the required threshold.
       **/
      Disapproved: AugmentedEvent<ApiType, [proposalHash: H256], { proposalHash: H256 }>;
      /**
       * A motion was executed; result will be `Ok` if it returned without error.
       **/
      Executed: AugmentedEvent<ApiType, [proposalHash: H256, result: Result<Null, SpRuntimeDispatchError>], { proposalHash: H256, result: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * A single member did some action; result will be `Ok` if it returned without error.
       **/
      MemberExecuted: AugmentedEvent<ApiType, [proposalHash: H256, result: Result<Null, SpRuntimeDispatchError>], { proposalHash: H256, result: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * A motion (given hash) has been proposed (by given account) with a threshold (given
       * `MemberCount`).
       **/
      Proposed: AugmentedEvent<ApiType, [account: AccountId32, proposalIndex: u32, proposalHash: H256, threshold: u32], { account: AccountId32, proposalIndex: u32, proposalHash: H256, threshold: u32 }>;
      /**
       * A motion (given hash) has been voted on by given account, leaving
       * a tally (yes votes and no votes given respectively as `MemberCount`).
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
    transactionPayment: {
      /**
       * A transaction fee `actual_fee`, of which `tip` was added to the minimum inclusion fee,
       * has been paid by `who`.
       **/
      TransactionFeePaid: AugmentedEvent<ApiType, [who: AccountId32, actualFee: u128, tip: u128], { who: AccountId32, actualFee: u128, tip: u128 }>;
    };
    treasury: {
      /**
       * A new asset spend proposal has been approved.
       **/
      AssetSpendApproved: AugmentedEvent<ApiType, [index: u32, assetKind: Null, amount: u128, beneficiary: AccountId32, validFrom: u32, expireAt: u32], { index: u32, assetKind: Null, amount: u128, beneficiary: AccountId32, validFrom: u32, expireAt: u32 }>;
      /**
       * An approved spend was voided.
       **/
      AssetSpendVoided: AugmentedEvent<ApiType, [index: u32], { index: u32 }>;
      /**
       * Some funds have been allocated.
       **/
      Awarded: AugmentedEvent<ApiType, [proposalIndex: u32, award: u128, account: AccountId32], { proposalIndex: u32, award: u128, account: AccountId32 }>;
      /**
       * Some of our funds have been burnt.
       **/
      Burnt: AugmentedEvent<ApiType, [burntFunds: u128], { burntFunds: u128 }>;
      /**
       * Some funds have been deposited.
       **/
      Deposit: AugmentedEvent<ApiType, [value: u128], { value: u128 }>;
      /**
       * A payment happened.
       **/
      Paid: AugmentedEvent<ApiType, [index: u32, paymentId: Null], { index: u32, paymentId: Null }>;
      /**
       * A payment failed and can be retried.
       **/
      PaymentFailed: AugmentedEvent<ApiType, [index: u32, paymentId: Null], { index: u32, paymentId: Null }>;
      /**
       * Spending has finished; this is the amount that rolls over until next spend.
       **/
      Rollover: AugmentedEvent<ApiType, [rolloverBalance: u128], { rolloverBalance: u128 }>;
      /**
       * A new spend proposal has been approved.
       **/
      SpendApproved: AugmentedEvent<ApiType, [proposalIndex: u32, amount: u128, beneficiary: AccountId32], { proposalIndex: u32, amount: u128, beneficiary: AccountId32 }>;
      /**
       * We have ended a spend period and will now allocate funds.
       **/
      Spending: AugmentedEvent<ApiType, [budgetRemaining: u128], { budgetRemaining: u128 }>;
      /**
       * A spend was processed and removed from the storage. It might have been successfully
       * paid or it may have expired.
       **/
      SpendProcessed: AugmentedEvent<ApiType, [index: u32], { index: u32 }>;
      /**
       * The inactive funds of the pallet have been updated.
       **/
      UpdatedInactive: AugmentedEvent<ApiType, [reactivated: u128, deactivated: u128], { reactivated: u128, deactivated: u128 }>;
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
