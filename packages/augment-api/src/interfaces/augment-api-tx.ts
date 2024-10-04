// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/submittable';

import type { ApiTypes, AugmentedSubmittable, SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api-base/types';
import type { Data } from '@polkadot/types';
import type { Bytes, Compact, Null, Option, U8aFixed, Vec, bool, u128, u16, u32, u64, u8 } from '@polkadot/types-codec';
import type { AnyNumber, IMethod, ITuple } from '@polkadot/types-codec/types';
import type { AccountId32, Call, H256, MultiAddress, Perbill } from '@polkadot/types/interfaces/runtime';
import type { CordLoomRuntimeOriginCaller, CordLoomRuntimeSessionKeys, FrameSupportTokensFungibleUnionOfNativeOrWithId, PalletBalancesAdjustmentDirection, PalletContractsWasmDeterminism, PalletDidDidDetailsDidAuthorizedCallOperation, PalletDidDidDetailsDidCreationDetails, PalletDidDidDetailsDidEncryptionKey, PalletDidDidDetailsDidSignature, PalletDidDidDetailsDidVerificationKey, PalletDidServiceEndpointsDidEndpoint, PalletIdentityJudgement, PalletIdentityLegacyIdentityInfo, PalletImOnlineHeartbeat, PalletImOnlineSr25519AppSr25519Signature, PalletMultisigTimepoint, PalletNetworkScoreRatingInputEntry, PalletStatementPresentationTypeOf, SpConsensusBabeDigestsNextConfigDescriptor, SpConsensusGrandpaEquivocationProof, SpConsensusSlotsEquivocationProof, SpRuntimeMultiSignature, SpSessionMembershipProof, SpWeightsWeightV2Weight } from '@polkadot/types/lookup';

export type __AugmentedSubmittable = AugmentedSubmittable<() => unknown>;
export type __SubmittableExtrinsic<ApiType extends ApiTypes> = SubmittableExtrinsic<ApiType>;
export type __SubmittableExtrinsicFunction<ApiType extends ApiTypes> = SubmittableExtrinsicFunction<ApiType>;

declare module '@polkadot/api-base/types/submittable' {
  interface AugmentedSubmittables<ApiType extends ApiTypes> {
    assetConversion: {
      /**
       * Provide liquidity into the pool of `asset1` and `asset2`.
       * NOTE: an optimal amount of asset1 and asset2 will be calculated and
       * might be different than the provided `amount1_desired`/`amount2_desired`
       * thus you should provide the min amount you're happy to provide.
       * Params `amount1_min`/`amount2_min` represent that.
       * `mint_to` will be sent the liquidity tokens that represent this share of the pool.
       * 
       * NOTE: when encountering an incorrect exchange rate and non-withdrawable pool liquidity,
       * batch an atomic call with [`Pallet::add_liquidity`] and
       * [`Pallet::swap_exact_tokens_for_tokens`] or [`Pallet::swap_tokens_for_exact_tokens`]
       * calls to render the liquidity withdrawable and rectify the exchange rate.
       * 
       * Once liquidity is added, someone may successfully call
       * [`Pallet::swap_exact_tokens_for_tokens`] successfully.
       **/
      addLiquidity: AugmentedSubmittable<(asset1: FrameSupportTokensFungibleUnionOfNativeOrWithId | { Native: any } | { WithId: any } | string | Uint8Array, asset2: FrameSupportTokensFungibleUnionOfNativeOrWithId | { Native: any } | { WithId: any } | string | Uint8Array, amount1Desired: u128 | AnyNumber | Uint8Array, amount2Desired: u128 | AnyNumber | Uint8Array, amount1Min: u128 | AnyNumber | Uint8Array, amount2Min: u128 | AnyNumber | Uint8Array, mintTo: AccountId32 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId, u128, u128, u128, u128, AccountId32]>;
      /**
       * Creates an empty liquidity pool and an associated new `lp_token` asset
       * (the id of which is returned in the `Event::PoolCreated` event).
       * 
       * Once a pool is created, someone may [`Pallet::add_liquidity`] to it.
       **/
      createPool: AugmentedSubmittable<(asset1: FrameSupportTokensFungibleUnionOfNativeOrWithId | { Native: any } | { WithId: any } | string | Uint8Array, asset2: FrameSupportTokensFungibleUnionOfNativeOrWithId | { Native: any } | { WithId: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]>;
      /**
       * Allows you to remove liquidity by providing the `lp_token_burn` tokens that will be
       * burned in the process. With the usage of `amount1_min_receive`/`amount2_min_receive`
       * it's possible to control the min amount of returned tokens you're happy with.
       **/
      removeLiquidity: AugmentedSubmittable<(asset1: FrameSupportTokensFungibleUnionOfNativeOrWithId | { Native: any } | { WithId: any } | string | Uint8Array, asset2: FrameSupportTokensFungibleUnionOfNativeOrWithId | { Native: any } | { WithId: any } | string | Uint8Array, lpTokenBurn: u128 | AnyNumber | Uint8Array, amount1MinReceive: u128 | AnyNumber | Uint8Array, amount2MinReceive: u128 | AnyNumber | Uint8Array, withdrawTo: AccountId32 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId, u128, u128, u128, AccountId32]>;
      /**
       * Swap the exact amount of `asset1` into `asset2`.
       * `amount_out_min` param allows you to specify the min amount of the `asset2`
       * you're happy to receive.
       * 
       * [`AssetConversionApi::quote_price_exact_tokens_for_tokens`] runtime call can be called
       * for a quote.
       **/
      swapExactTokensForTokens: AugmentedSubmittable<(path: Vec<FrameSupportTokensFungibleUnionOfNativeOrWithId> | (FrameSupportTokensFungibleUnionOfNativeOrWithId | { Native: any } | { WithId: any } | string | Uint8Array)[], amountIn: u128 | AnyNumber | Uint8Array, amountOutMin: u128 | AnyNumber | Uint8Array, sendTo: AccountId32 | string | Uint8Array, keepAlive: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>, [Vec<FrameSupportTokensFungibleUnionOfNativeOrWithId>, u128, u128, AccountId32, bool]>;
      /**
       * Swap any amount of `asset1` to get the exact amount of `asset2`.
       * `amount_in_max` param allows to specify the max amount of the `asset1`
       * you're happy to provide.
       * 
       * [`AssetConversionApi::quote_price_tokens_for_exact_tokens`] runtime call can be called
       * for a quote.
       **/
      swapTokensForExactTokens: AugmentedSubmittable<(path: Vec<FrameSupportTokensFungibleUnionOfNativeOrWithId> | (FrameSupportTokensFungibleUnionOfNativeOrWithId | { Native: any } | { WithId: any } | string | Uint8Array)[], amountOut: u128 | AnyNumber | Uint8Array, amountInMax: u128 | AnyNumber | Uint8Array, sendTo: AccountId32 | string | Uint8Array, keepAlive: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>, [Vec<FrameSupportTokensFungibleUnionOfNativeOrWithId>, u128, u128, AccountId32, bool]>;
      /**
       * Touch an existing pool to fulfill prerequisites before providing liquidity, such as
       * ensuring that the pool's accounts are in place. It is typically useful when a pool
       * creator removes the pool's accounts and does not provide a liquidity. This action may
       * involve holding assets from the caller as a deposit for creating the pool's accounts.
       * 
       * The origin must be Signed.
       * 
       * - `asset1`: The asset ID of an existing pool with a pair (asset1, asset2).
       * - `asset2`: The asset ID of an existing pool with a pair (asset1, asset2).
       * 
       * Emits `Touched` event when successful.
       **/
      touch: AugmentedSubmittable<(asset1: FrameSupportTokensFungibleUnionOfNativeOrWithId | { Native: any } | { WithId: any } | string | Uint8Array, asset2: FrameSupportTokensFungibleUnionOfNativeOrWithId | { Native: any } | { WithId: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]>;
    };
    assets: {
      /**
       * Approve an amount of asset for transfer by a delegated third-party account.
       * 
       * Origin must be Signed.
       * 
       * Ensures that `ApprovalDeposit` worth of `Currency` is reserved from signing account
       * for the purpose of holding the approval. If some non-zero amount of assets is already
       * approved from signing account to `delegate`, then it is topped up or unreserved to
       * meet the right value.
       * 
       * NOTE: The signing account does not need to own `amount` of assets at the point of
       * making this call.
       * 
       * - `id`: The identifier of the asset.
       * - `delegate`: The account to delegate permission to transfer asset.
       * - `amount`: The amount of asset that may be transferred by `delegate`. If there is
       * already an approval in place, then this acts additively.
       * 
       * Emits `ApprovedTransfer` on success.
       * 
       * Weight: `O(1)`
       **/
      approveTransfer: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, delegate: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, amount: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, Compact<u128>]>;
      /**
       * Disallow further unprivileged transfers of an asset `id` to and from an account `who`.
       * 
       * Origin must be Signed and the sender should be the Freezer of the asset `id`.
       * 
       * - `id`: The identifier of the account's asset.
       * - `who`: The account to be unblocked.
       * 
       * Emits `Blocked`.
       * 
       * Weight: `O(1)`
       **/
      block: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress]>;
      /**
       * Reduce the balance of `who` by as much as possible up to `amount` assets of `id`.
       * 
       * Origin must be Signed and the sender should be the Manager of the asset `id`.
       * 
       * Bails with `NoAccount` if the `who` is already dead.
       * 
       * - `id`: The identifier of the asset to have some amount burned.
       * - `who`: The account to be debited from.
       * - `amount`: The maximum amount by which `who`'s balance should be reduced.
       * 
       * Emits `Burned` with the actual amount burned. If this takes the balance to below the
       * minimum for the asset, then the amount burned is increased to take it to zero.
       * 
       * Weight: `O(1)`
       * Modes: Post-existence of `who`; Pre & post Zombie-status of `who`.
       **/
      burn: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, amount: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, Compact<u128>]>;
      /**
       * Cancel all of some asset approved for delegated transfer by a third-party account.
       * 
       * Origin must be Signed and there must be an approval in place between signer and
       * `delegate`.
       * 
       * Unreserves any deposit previously reserved by `approve_transfer` for the approval.
       * 
       * - `id`: The identifier of the asset.
       * - `delegate`: The account delegated permission to transfer asset.
       * 
       * Emits `ApprovalCancelled` on success.
       * 
       * Weight: `O(1)`
       **/
      cancelApproval: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, delegate: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress]>;
      /**
       * Clear the metadata for an asset.
       * 
       * Origin must be Signed and the sender should be the Owner of the asset `id`.
       * 
       * Any deposit is freed for the asset owner.
       * 
       * - `id`: The identifier of the asset to clear.
       * 
       * Emits `MetadataCleared`.
       * 
       * Weight: `O(1)`
       **/
      clearMetadata: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>]>;
      /**
       * Issue a new class of fungible assets from a public origin.
       * 
       * This new asset class has no assets initially and its owner is the origin.
       * 
       * The origin must conform to the configured `CreateOrigin` and have sufficient funds free.
       * 
       * Funds of sender are reserved by `AssetDeposit`.
       * 
       * Parameters:
       * - `id`: The identifier of the new asset. This must not be currently in use to identify
       * an existing asset. If [`NextAssetId`] is set, then this must be equal to it.
       * - `admin`: The admin of this class of assets. The admin is the initial address of each
       * member of the asset class's admin team.
       * - `min_balance`: The minimum balance of this new asset that any single account must
       * have. If an account's balance is reduced below this, then it collapses to zero.
       * 
       * Emits `Created` event when successful.
       * 
       * Weight: `O(1)`
       **/
      create: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, admin: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, minBalance: u128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, u128]>;
      /**
       * Destroy all accounts associated with a given asset.
       * 
       * `destroy_accounts` should only be called after `start_destroy` has been called, and the
       * asset is in a `Destroying` state.
       * 
       * Due to weight restrictions, this function may need to be called multiple times to fully
       * destroy all accounts. It will destroy `RemoveItemsLimit` accounts at a time.
       * 
       * - `id`: The identifier of the asset to be destroyed. This must identify an existing
       * asset.
       * 
       * Each call emits the `Event::DestroyedAccounts` event.
       **/
      destroyAccounts: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>]>;
      /**
       * Destroy all approvals associated with a given asset up to the max (T::RemoveItemsLimit).
       * 
       * `destroy_approvals` should only be called after `start_destroy` has been called, and the
       * asset is in a `Destroying` state.
       * 
       * Due to weight restrictions, this function may need to be called multiple times to fully
       * destroy all approvals. It will destroy `RemoveItemsLimit` approvals at a time.
       * 
       * - `id`: The identifier of the asset to be destroyed. This must identify an existing
       * asset.
       * 
       * Each call emits the `Event::DestroyedApprovals` event.
       **/
      destroyApprovals: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>]>;
      /**
       * Complete destroying asset and unreserve currency.
       * 
       * `finish_destroy` should only be called after `start_destroy` has been called, and the
       * asset is in a `Destroying` state. All accounts or approvals should be destroyed before
       * hand.
       * 
       * - `id`: The identifier of the asset to be destroyed. This must identify an existing
       * asset.
       * 
       * Each successful call emits the `Event::Destroyed` event.
       **/
      finishDestroy: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>]>;
      /**
       * Alter the attributes of a given asset.
       * 
       * Origin must be `ForceOrigin`.
       * 
       * - `id`: The identifier of the asset.
       * - `owner`: The new Owner of this asset.
       * - `issuer`: The new Issuer of this asset.
       * - `admin`: The new Admin of this asset.
       * - `freezer`: The new Freezer of this asset.
       * - `min_balance`: The minimum balance of this new asset that any single account must
       * have. If an account's balance is reduced below this, then it collapses to zero.
       * - `is_sufficient`: Whether a non-zero balance of this asset is deposit of sufficient
       * value to account for the state bloat associated with its balance storage. If set to
       * `true`, then non-zero balances may be stored without a `consumer` reference (and thus
       * an ED in the Balances pallet or whatever else is used to control user-account state
       * growth).
       * - `is_frozen`: Whether this asset class is frozen except for permissioned/admin
       * instructions.
       * 
       * Emits `AssetStatusChanged` with the identity of the asset.
       * 
       * Weight: `O(1)`
       **/
      forceAssetStatus: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, owner: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, issuer: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, admin: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, freezer: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, minBalance: Compact<u128> | AnyNumber | Uint8Array, isSufficient: bool | boolean | Uint8Array, isFrozen: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, MultiAddress, MultiAddress, MultiAddress, Compact<u128>, bool, bool]>;
      /**
       * Cancel all of some asset approved for delegated transfer by a third-party account.
       * 
       * Origin must be either ForceOrigin or Signed origin with the signer being the Admin
       * account of the asset `id`.
       * 
       * Unreserves any deposit previously reserved by `approve_transfer` for the approval.
       * 
       * - `id`: The identifier of the asset.
       * - `delegate`: The account delegated permission to transfer asset.
       * 
       * Emits `ApprovalCancelled` on success.
       * 
       * Weight: `O(1)`
       **/
      forceCancelApproval: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, owner: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, delegate: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, MultiAddress]>;
      /**
       * Clear the metadata for an asset.
       * 
       * Origin must be ForceOrigin.
       * 
       * Any deposit is returned.
       * 
       * - `id`: The identifier of the asset to clear.
       * 
       * Emits `MetadataCleared`.
       * 
       * Weight: `O(1)`
       **/
      forceClearMetadata: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>]>;
      /**
       * Issue a new class of fungible assets from a privileged origin.
       * 
       * This new asset class has no assets initially.
       * 
       * The origin must conform to `ForceOrigin`.
       * 
       * Unlike `create`, no funds are reserved.
       * 
       * - `id`: The identifier of the new asset. This must not be currently in use to identify
       * an existing asset. If [`NextAssetId`] is set, then this must be equal to it.
       * - `owner`: The owner of this class of assets. The owner has full superuser permissions
       * over this asset, but may later change and configure the permissions using
       * `transfer_ownership` and `set_team`.
       * - `min_balance`: The minimum balance of this new asset that any single account must
       * have. If an account's balance is reduced below this, then it collapses to zero.
       * 
       * Emits `ForceCreated` event when successful.
       * 
       * Weight: `O(1)`
       **/
      forceCreate: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, owner: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, isSufficient: bool | boolean | Uint8Array, minBalance: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, bool, Compact<u128>]>;
      /**
       * Force the metadata for an asset to some value.
       * 
       * Origin must be ForceOrigin.
       * 
       * Any deposit is left alone.
       * 
       * - `id`: The identifier of the asset to update.
       * - `name`: The user friendly name of this asset. Limited in length by `StringLimit`.
       * - `symbol`: The exchange symbol for this asset. Limited in length by `StringLimit`.
       * - `decimals`: The number of decimals this asset uses to represent one unit.
       * 
       * Emits `MetadataSet`.
       * 
       * Weight: `O(N + S)` where N and S are the length of the name and symbol respectively.
       **/
      forceSetMetadata: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, name: Bytes | string | Uint8Array, symbol: Bytes | string | Uint8Array, decimals: u8 | AnyNumber | Uint8Array, isFrozen: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, Bytes, Bytes, u8, bool]>;
      /**
       * Move some assets from one account to another.
       * 
       * Origin must be Signed and the sender should be the Admin of the asset `id`.
       * 
       * - `id`: The identifier of the asset to have some amount transferred.
       * - `source`: The account to be debited.
       * - `dest`: The account to be credited.
       * - `amount`: The amount by which the `source`'s balance of assets should be reduced and
       * `dest`'s balance increased. The amount actually transferred may be slightly greater in
       * the case that the transfer would otherwise take the `source` balance above zero but
       * below the minimum balance. Must be greater than zero.
       * 
       * Emits `Transferred` with the actual amount transferred. If this takes the source balance
       * to below the minimum for the asset, then the amount transferred is increased to take it
       * to zero.
       * 
       * Weight: `O(1)`
       * Modes: Pre-existence of `dest`; Post-existence of `source`; Account pre-existence of
       * `dest`.
       **/
      forceTransfer: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, source: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, dest: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, amount: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, MultiAddress, Compact<u128>]>;
      /**
       * Disallow further unprivileged transfers of an asset `id` from an account `who`. `who`
       * must already exist as an entry in `Account`s of the asset. If you want to freeze an
       * account that does not have an entry, use `touch_other` first.
       * 
       * Origin must be Signed and the sender should be the Freezer of the asset `id`.
       * 
       * - `id`: The identifier of the asset to be frozen.
       * - `who`: The account to be frozen.
       * 
       * Emits `Frozen`.
       * 
       * Weight: `O(1)`
       **/
      freeze: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress]>;
      /**
       * Disallow further unprivileged transfers for the asset class.
       * 
       * Origin must be Signed and the sender should be the Freezer of the asset `id`.
       * 
       * - `id`: The identifier of the asset to be frozen.
       * 
       * Emits `Frozen`.
       * 
       * Weight: `O(1)`
       **/
      freezeAsset: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>]>;
      /**
       * Mint assets of a particular class.
       * 
       * The origin must be Signed and the sender must be the Issuer of the asset `id`.
       * 
       * - `id`: The identifier of the asset to have some amount minted.
       * - `beneficiary`: The account to be credited with the minted assets.
       * - `amount`: The amount of the asset to be minted.
       * 
       * Emits `Issued` event when successful.
       * 
       * Weight: `O(1)`
       * Modes: Pre-existing balance of `beneficiary`; Account pre-existence of `beneficiary`.
       **/
      mint: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, beneficiary: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, amount: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, Compact<u128>]>;
      /**
       * Return the deposit (if any) of an asset account or a consumer reference (if any) of an
       * account.
       * 
       * The origin must be Signed.
       * 
       * - `id`: The identifier of the asset for which the caller would like the deposit
       * refunded.
       * - `allow_burn`: If `true` then assets may be destroyed in order to complete the refund.
       * 
       * Emits `Refunded` event when successful.
       **/
      refund: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, allowBurn: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, bool]>;
      /**
       * Return the deposit (if any) of a target asset account. Useful if you are the depositor.
       * 
       * The origin must be Signed and either the account owner, depositor, or asset `Admin`. In
       * order to burn a non-zero balance of the asset, the caller must be the account and should
       * use `refund`.
       * 
       * - `id`: The identifier of the asset for the account holding a deposit.
       * - `who`: The account to refund.
       * 
       * Emits `Refunded` event when successful.
       **/
      refundOther: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress]>;
      /**
       * Set the metadata for an asset.
       * 
       * Origin must be Signed and the sender should be the Owner of the asset `id`.
       * 
       * Funds of sender are reserved according to the formula:
       * `MetadataDepositBase + MetadataDepositPerByte * (name.len + symbol.len)` taking into
       * account any already reserved funds.
       * 
       * - `id`: The identifier of the asset to update.
       * - `name`: The user friendly name of this asset. Limited in length by `StringLimit`.
       * - `symbol`: The exchange symbol for this asset. Limited in length by `StringLimit`.
       * - `decimals`: The number of decimals this asset uses to represent one unit.
       * 
       * Emits `MetadataSet`.
       * 
       * Weight: `O(1)`
       **/
      setMetadata: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, name: Bytes | string | Uint8Array, symbol: Bytes | string | Uint8Array, decimals: u8 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, Bytes, Bytes, u8]>;
      /**
       * Sets the minimum balance of an asset.
       * 
       * Only works if there aren't any accounts that are holding the asset or if
       * the new value of `min_balance` is less than the old one.
       * 
       * Origin must be Signed and the sender has to be the Owner of the
       * asset `id`.
       * 
       * - `id`: The identifier of the asset.
       * - `min_balance`: The new value of `min_balance`.
       * 
       * Emits `AssetMinBalanceChanged` event when successful.
       **/
      setMinBalance: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, minBalance: u128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, u128]>;
      /**
       * Change the Issuer, Admin and Freezer of an asset.
       * 
       * Origin must be Signed and the sender should be the Owner of the asset `id`.
       * 
       * - `id`: The identifier of the asset to be frozen.
       * - `issuer`: The new Issuer of this asset.
       * - `admin`: The new Admin of this asset.
       * - `freezer`: The new Freezer of this asset.
       * 
       * Emits `TeamChanged`.
       * 
       * Weight: `O(1)`
       **/
      setTeam: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, issuer: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, admin: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, freezer: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, MultiAddress, MultiAddress]>;
      /**
       * Start the process of destroying a fungible asset class.
       * 
       * `start_destroy` is the first in a series of extrinsics that should be called, to allow
       * destruction of an asset class.
       * 
       * The origin must conform to `ForceOrigin` or must be `Signed` by the asset's `owner`.
       * 
       * - `id`: The identifier of the asset to be destroyed. This must identify an existing
       * asset.
       * 
       * The asset class must be frozen before calling `start_destroy`.
       **/
      startDestroy: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>]>;
      /**
       * Allow unprivileged transfers to and from an account again.
       * 
       * Origin must be Signed and the sender should be the Admin of the asset `id`.
       * 
       * - `id`: The identifier of the asset to be frozen.
       * - `who`: The account to be unfrozen.
       * 
       * Emits `Thawed`.
       * 
       * Weight: `O(1)`
       **/
      thaw: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress]>;
      /**
       * Allow unprivileged transfers for the asset again.
       * 
       * Origin must be Signed and the sender should be the Admin of the asset `id`.
       * 
       * - `id`: The identifier of the asset to be thawed.
       * 
       * Emits `Thawed`.
       * 
       * Weight: `O(1)`
       **/
      thawAsset: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>]>;
      /**
       * Create an asset account for non-provider assets.
       * 
       * A deposit will be taken from the signer account.
       * 
       * - `origin`: Must be Signed; the signer account must have sufficient funds for a deposit
       * to be taken.
       * - `id`: The identifier of the asset for the account to be created.
       * 
       * Emits `Touched` event when successful.
       **/
      touch: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>]>;
      /**
       * Create an asset account for `who`.
       * 
       * A deposit will be taken from the signer account.
       * 
       * - `origin`: Must be Signed by `Freezer` or `Admin` of the asset `id`; the signer account
       * must have sufficient funds for a deposit to be taken.
       * - `id`: The identifier of the asset for the account to be created.
       * - `who`: The account to be created.
       * 
       * Emits `Touched` event when successful.
       **/
      touchOther: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress]>;
      /**
       * Move some assets from the sender account to another.
       * 
       * Origin must be Signed.
       * 
       * - `id`: The identifier of the asset to have some amount transferred.
       * - `target`: The account to be credited.
       * - `amount`: The amount by which the sender's balance of assets should be reduced and
       * `target`'s balance increased. The amount actually transferred may be slightly greater in
       * the case that the transfer would otherwise take the sender balance above zero but below
       * the minimum balance. Must be greater than zero.
       * 
       * Emits `Transferred` with the actual amount transferred. If this takes the source balance
       * to below the minimum for the asset, then the amount transferred is increased to take it
       * to zero.
       * 
       * Weight: `O(1)`
       * Modes: Pre-existence of `target`; Post-existence of sender; Account pre-existence of
       * `target`.
       **/
      transfer: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, target: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, amount: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, Compact<u128>]>;
      /**
       * Transfer some asset balance from a previously delegated account to some third-party
       * account.
       * 
       * Origin must be Signed and there must be an approval in place by the `owner` to the
       * signer.
       * 
       * If the entire amount approved for transfer is transferred, then any deposit previously
       * reserved by `approve_transfer` is unreserved.
       * 
       * - `id`: The identifier of the asset.
       * - `owner`: The account which previously approved for a transfer of at least `amount` and
       * from which the asset balance will be withdrawn.
       * - `destination`: The account to which the asset balance of `amount` will be transferred.
       * - `amount`: The amount of assets to transfer.
       * 
       * Emits `TransferredApproved` on success.
       * 
       * Weight: `O(1)`
       **/
      transferApproved: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, owner: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, destination: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, amount: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, MultiAddress, Compact<u128>]>;
      /**
       * Move some assets from the sender account to another, keeping the sender account alive.
       * 
       * Origin must be Signed.
       * 
       * - `id`: The identifier of the asset to have some amount transferred.
       * - `target`: The account to be credited.
       * - `amount`: The amount by which the sender's balance of assets should be reduced and
       * `target`'s balance increased. The amount actually transferred may be slightly greater in
       * the case that the transfer would otherwise take the sender balance above zero but below
       * the minimum balance. Must be greater than zero.
       * 
       * Emits `Transferred` with the actual amount transferred. If this takes the source balance
       * to below the minimum for the asset, then the amount transferred is increased to take it
       * to zero.
       * 
       * Weight: `O(1)`
       * Modes: Pre-existence of `target`; Post-existence of sender; Account pre-existence of
       * `target`.
       **/
      transferKeepAlive: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, target: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, amount: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, Compact<u128>]>;
      /**
       * Change the Owner of an asset.
       * 
       * Origin must be Signed and the sender should be the Owner of the asset `id`.
       * 
       * - `id`: The identifier of the asset.
       * - `owner`: The new Owner of this asset.
       * 
       * Emits `OwnerChanged`.
       * 
       * Weight: `O(1)`
       **/
      transferOwnership: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, owner: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress]>;
    };
    authorityMembership: {
      /**
       * Mark an authority member offline.
       * The authority will be deactivated from current session + 2.
       **/
      goOffline: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Mark an authority member going online.
       * Authority will be activated from current session + 2.
       **/
      goOnline: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Add new authorities to the set.
       * The new authorities will be active from current session + 2.
       **/
      nominate: AugmentedSubmittable<(candidate: AccountId32 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32]>;
      /**
       * Remove authorities from the set.
       * The removed authorities will be deactivated from current session + 2
       **/
      remove: AugmentedSubmittable<(candidate: AccountId32 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32]>;
      /**
       * Remove members from blacklist.
       **/
      removeMemberFromBlacklist: AugmentedSubmittable<(candidate: AccountId32 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32]>;
    };
    babe: {
      /**
       * Plan an epoch config change. The epoch config change is recorded and will be enacted on
       * the next call to `enact_epoch_change`. The config will be activated one epoch after.
       * Multiple calls to this method will replace any existing planned config change that had
       * not been enacted yet.
       **/
      planConfigChange: AugmentedSubmittable<(config: SpConsensusBabeDigestsNextConfigDescriptor | { V1: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [SpConsensusBabeDigestsNextConfigDescriptor]>;
      /**
       * Report authority equivocation/misbehavior. This method will verify
       * the equivocation proof and validate the given key ownership proof
       * against the extracted offender. If both are valid, the offence will
       * be reported.
       **/
      reportEquivocation: AugmentedSubmittable<(equivocationProof: SpConsensusSlotsEquivocationProof | { offender?: any; slot?: any; firstHeader?: any; secondHeader?: any } | string | Uint8Array, keyOwnerProof: SpSessionMembershipProof | { session?: any; trieNodes?: any; validatorCount?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [SpConsensusSlotsEquivocationProof, SpSessionMembershipProof]>;
      /**
       * Report authority equivocation/misbehavior. This method will verify
       * the equivocation proof and validate the given key ownership proof
       * against the extracted offender. If both are valid, the offence will
       * be reported.
       * This extrinsic must be called unsigned and it is expected that only
       * block authors will call it (validated in `ValidateUnsigned`), as such
       * if the block author is defined it will be defined as the equivocation
       * reporter.
       **/
      reportEquivocationUnsigned: AugmentedSubmittable<(equivocationProof: SpConsensusSlotsEquivocationProof | { offender?: any; slot?: any; firstHeader?: any; secondHeader?: any } | string | Uint8Array, keyOwnerProof: SpSessionMembershipProof | { session?: any; trieNodes?: any; validatorCount?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [SpConsensusSlotsEquivocationProof, SpSessionMembershipProof]>;
    };
    balances: {
      /**
       * Burn the specified liquid free balance from the origin account.
       * 
       * If the origin's account ends up below the existential deposit as a result
       * of the burn and `keep_alive` is false, the account will be reaped.
       * 
       * Unlike sending funds to a _burn_ address, which merely makes the funds inaccessible,
       * this `burn` operation will reduce total issuance by the amount _burned_.
       **/
      burn: AugmentedSubmittable<(value: Compact<u128> | AnyNumber | Uint8Array, keepAlive: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u128>, bool]>;
      /**
       * Adjust the total issuance in a saturating way.
       * 
       * Can only be called by root and always needs a positive `delta`.
       * 
       * # Example
       **/
      forceAdjustTotalIssuance: AugmentedSubmittable<(direction: PalletBalancesAdjustmentDirection | 'Increase' | 'Decrease' | number | Uint8Array, delta: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletBalancesAdjustmentDirection, Compact<u128>]>;
      /**
       * Set the regular balance of a given account.
       * 
       * The dispatch origin for this call is `root`.
       **/
      forceSetBalance: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, newFree: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, Compact<u128>]>;
      /**
       * Exactly as `transfer_allow_death`, except the origin must be root and the source account
       * may be specified.
       **/
      forceTransfer: AugmentedSubmittable<(source: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, dest: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, value: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, MultiAddress, Compact<u128>]>;
      /**
       * Unreserve some balance from a user by force.
       * 
       * Can only be called by ROOT.
       **/
      forceUnreserve: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, amount: u128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, u128]>;
      /**
       * Transfer the entire transferable balance from the caller account.
       * 
       * NOTE: This function only attempts to transfer _transferable_ balances. This means that
       * any locked, reserved, or existential deposits (when `keep_alive` is `true`), will not be
       * transferred by this function. To ensure that this function results in a killed account,
       * you might need to prepare the account by removing any reference counters, storage
       * deposits, etc...
       * 
       * The dispatch origin of this call must be Signed.
       * 
       * - `dest`: The recipient of the transfer.
       * - `keep_alive`: A boolean to determine if the `transfer_all` operation should send all
       * of the funds the account has, causing the sender account to be killed (false), or
       * transfer everything except at least the existential deposit, which will guarantee to
       * keep the sender account alive (true).
       **/
      transferAll: AugmentedSubmittable<(dest: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, keepAlive: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, bool]>;
      /**
       * Transfer some liquid free balance to another account.
       * 
       * `transfer_allow_death` will set the `FreeBalance` of the sender and receiver.
       * If the sender's account is below the existential deposit as a result
       * of the transfer, the account will be reaped.
       * 
       * The dispatch origin for this call must be `Signed` by the transactor.
       **/
      transferAllowDeath: AugmentedSubmittable<(dest: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, value: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, Compact<u128>]>;
      /**
       * Same as the [`transfer_allow_death`] call, but with a check that the transfer will not
       * kill the origin account.
       * 
       * 99% of the time you want [`transfer_allow_death`] instead.
       * 
       * [`transfer_allow_death`]: struct.Pallet.html#method.transfer
       **/
      transferKeepAlive: AugmentedSubmittable<(dest: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, value: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, Compact<u128>]>;
      /**
       * Upgrade a specified account.
       * 
       * - `origin`: Must be `Signed`.
       * - `who`: The account to be upgraded.
       * 
       * This will waive the transaction fee if at least all but 10% of the accounts needed to
       * be upgraded. (We let some not have to be upgraded just in order to allow for the
       * possibility of churn).
       **/
      upgradeAccounts: AugmentedSubmittable<(who: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>, [Vec<AccountId32>]>;
    };
    chainSpace: {
      /**
       * Adds an administrative delegate to a space.
       * 
       * The `ADMIN` permission grants the delegate extensive control over
       * the space, including the ability to manage other delegates and
       * change space configurations. This function is called to
       * grant a delegate these administrative privileges. It verifies that
       * the caller has the necessary authorization (admin rights) to add an
       * admin delegate to the space. If the caller is authorized,
       * the delegate is added with the `ADMIN` permission using the
       * `space_delegate_addition` internal function.
       * 
       * # Parameters
       * - `origin`: The origin of the call, which must be signed by an existing admin of the
       * space.
       * - `space_id`: The identifier of the space to which the admin delegate is being added.
       * - `delegate`: The identifier of the delegate being granted admin permissions.
       * - `authorization`: The authorization ID used to validate the addition.
       * 
       * # Returns
       * Returns `Ok(())` if the admin delegate was successfully added, or an
       * `Err` with an appropriate error if the operation fails.
       * 
       * # Errors
       * - `UnauthorizedOperation`: If the caller is not an admin of the space.
       * - Propagates errors from `space_delegate_addition` if it fails.
       **/
      addAdminDelegate: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array, delegate: AccountId32 | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, AccountId32, Bytes]>;
      /**
       * Adds a delegate with the ability to assert new entries to a space.
       * 
       * The `ASSERT` permission allows the delegate to sign and add new
       * entries within the space. This function is called to grant a
       * delegate this specific permission. It checks that the caller has the
       * necessary authorization (admin rights) to add a delegate to the
       * space. If the caller is authorized, the delegate is added with the
       * `ASSERT` permission using the `space_delegate_addition`
       * internal function.
       * 
       * # Parameters
       * - `origin`: The origin of the call, which must be signed by an admin of the space.
       * - `space_id`: The identifier of the space to which the delegate is being added.
       * - `delegate`: The identifier of the delegate being added to the space.
       * - `authorization`: The authorization ID used to validate the addition.
       * 
       * # Returns
       * Returns `Ok(())` if the delegate was successfully added with
       * `ASSERT` permission, or an `Err` with an appropriate error if the
       * operation fails.
       * 
       * # Errors
       * - `UnauthorizedOperation`: If the caller is not an admin of the space.
       * - Propagates errors from `space_delegate_addition` if it fails.
       **/
      addDelegate: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array, delegate: AccountId32 | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, AccountId32, Bytes]>;
      /**
       * Adds an audit delegate to a space.
       * 
       * The `AUDIT` permission grants the delegate the ability to perform
       * oversight and compliance checks within the space. This function is
       * used to assign a delegate these audit privileges. It ensures that
       * the caller has the necessary authorization (admin rights) to add an
       * audit delegate to the space. If the caller is authorized, the
       * delegate is added with the `AUDIT` permission using the
       * `space_delegate_addition` internal function.
       * 
       * # Parameters
       * - `origin`: The origin of the call, which must be signed by an existing admin of the
       * space.
       * - `space_id`: The identifier of the space to which the audit delegate is being added.
       * - `delegate`: The identifier of the delegate being granted audit permissions.
       * - `authorization`: The authorization ID used to validate the addition.
       * 
       * # Returns
       * Returns `Ok(())` if the audit delegate was successfully added, or an
       * `Err` with an appropriate error if the operation fails.
       **/
      addDelegator: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array, delegate: AccountId32 | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, AccountId32, Bytes]>;
      approvalRestore: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Revokes approval for a specified space.
       * 
       * This function can be executed by an authorized origin, as determined
       * by `ChainSpaceOrigin`. It is designed to change the status of a
       * given space, referred to by `space_id`, to unapproved.
       * The revocation is only allowed if the space is currently approved,
       * and not archived.
       * 
       * # Parameters
       * - `origin`: The transaction's origin, which must satisfy the `ChainSpaceOrigin` policy.
       * - `space_id`: The identifier of the space whose approval status is being revoked.
       * 
       * # Errors
       * - Returns `SpaceNotFound` if no space corresponds to the provided `space_id`.
       * - Returns `ArchivedSpace` if the space is archived, in which case its status cannot be
       * altered.
       * - Returns `SpaceNotApproved` if the space is already unapproved.
       * 
       * # Events
       * - Emits `Revoke` when the space's approved status is successfully revoked.
       **/
      approvalRevoke: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Approves a space and sets its capacity.
       * 
       * This function can only be called by a council or root origin,
       * reflecting its privileged nature. It is used to approve a space that
       * has been previously created, setting its transaction capacity and
       * marking it as approved. It ensures that the space exists, is not
       * archived, and has not already been approved.
       * 
       * # Parameters
       * - `origin`: The origin of the transaction, which must be a council or root origin.
       * - `space_id`: The identifier of the space to be approved.
       * - `txn_capacity`: The transaction capacity to be set for the space.
       * 
       * # Returns
       * - `DispatchResult`: Returns `Ok(())` if the space is successfully approved, or an error
       * (`DispatchError`) if:
       * - The origin is not a council or root origin.
       * - The space does not exist.
       * - The space is archived.
       * - The space is already approved.
       * 
       * # Errors
       * - `BadOrigin`: If the call does not come from a council or root origin.
       * - `SpaceNotFound`: If the specified space ID does not correspond to an existing space.
       * - `ArchivedSpace`: If the space is archived and no longer active.
       * - `SpaceAlreadyApproved`: If the space has already been approved.
       * 
       * # Events
       * - `Approve`: Emitted when a space is successfully approved. It includes the space
       * identifier.
       * 
       * # Security Considerations
       * Due to the privileged nature of this function, callers must ensure
       * that they have the appropriate authority. Misuse can lead to
       * unauthorized approval of spaces, which may have security
       * implications.
       **/
      approve: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array, txnCapacity: u64 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, u64]>;
      /**
       * Archives a space, rendering it inactive.
       * 
       * This function marks a space as archived based on the provided space
       * ID. It checks that the space exists, is not already archived, and is
       * approved. Additionally, it verifies that the caller has the
       * authority to archive the space, as indicated by the provided
       * authorization ID.
       * 
       * # Parameters
       * - `origin`: The origin of the transaction, which must be signed by the creator or an
       * admin with the appropriate authority.
       * - `space_id`: The identifier of the space to be archived.
       * - `authorization`: An identifier for the authorization being used to validate the
       * archival.
       * 
       * # Returns
       * - `DispatchResult`: Returns `Ok(())` if the space is successfully archived, or an error
       * (`DispatchError`) if:
       * - The space does not exist.
       * - `ArchivedSpace`: If the space is already archived.
       * - `SpaceNotApproved`: If the space has not been approved for use.
       * - `UnauthorizedOperation`: If the caller does not have the authority to archive the
       * space.
       * 
       * # Errors
       * - `SpaceNotFound`: If the specified space ID does not correspond to an existing space.
       * - `ArchivedSpace`: If the space is already archived.
       * - `SpaceNotApproved`: If the space has not been approved for use.
       * - `UnauthorizedOperation`: If the caller is not authorized to archive the space.
       * 
       * # Events
       * - `Archive`: Emitted when a space is successfully archived. It includes the space ID and
       * the authority who performed the archival.
       **/
      archive: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * Creates a new space with a unique identifier based on the provided
       * space code and the creator's identity.
       * 
       * This function generates a unique identifier for the space by hashing
       * the encoded space code and creator's identifier. It ensures that the
       * generated space identifier is not already in use. An authorization
       * ID is also created for the new space, which is used to manage
       * delegations. The creator is automatically added as a delegate with
       * all permissions.
       * 
       * # Parameters
       * - `origin`: The origin of the transaction, which must be signed by the creator.
       * - `space_code`: A unique code representing the space to be created.
       * 
       * # Returns
       * - `DispatchResult`: Returns `Ok(())` if the space is successfully created, or an error
       * (`DispatchError`) if:
       * - The generated space identifier is already in use.
       * - The generated authorization ID is of invalid length.
       * - The space delegates limit is exceeded.
       * 
       * # Errors
       * - `InvalidIdentifierLength`: If the generated identifiers for the space or authorization
       * are of invalid length.
       * - `SpaceAlreadyAnchored`: If the space identifier is already in use.
       * - `SpaceDelegatesLimitExceeded`: If the space exceeds the limit of allowed delegates.
       * 
       * # Events
       * - `Create`: Emitted when a new space is successfully created. It includes the space
       * identifier, the creator's identifier, and the authorization ID.
       **/
      create: AugmentedSubmittable<(spaceCode: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256]>;
      /**
       * Removes a delegate from a specified space.
       * 
       * This function will remove an existing delegate from a space, given
       * the space ID and the delegate's authorization ID. It checks that the
       * space exists, is not archived, is approved, and that the provided
       * authorization corresponds to a delegate of the space. It also
       * verifies that the caller has the authority to remove a delegate.
       * 
       * # Parameters
       * - `origin`: The origin of the transaction, which must be signed by the creator or an
       * admin.
       * - `space_id`: The identifier of the space from which the delegate is being removed.
       * - `remove_authorization`: The authorization ID of the delegate to be removed.
       * - `authorization`: An identifier for the authorization being used to validate the
       * removal.
       * 
       * # Returns
       * - `DispatchResult`: This function returns `Ok(())` if the delegate is successfully
       * removed, or an error (`DispatchError`) if any of the checks fail.
       * 
       * # Errors
       * - `AuthorizationNotFound`: If the provided `remove_authorization` does not exist.
       * - `UnauthorizedOperation`: If the origin is not authorized to remove a delegate from the
       * space.
       * - `SpaceNotFound`: If the specified space ID does not correspond to an existing space.
       * - `ArchivedSpace`: If the space is archived and no longer active.
       * - `SpaceNotApproved`: If the space has not been approved for use.
       * - `DelegateNotFound`: If the delegate specified by `remove_authorization` is not found
       * in the space.
       * 
       * # Events
       * 
       * - `Deauthorization`: Emitted when a delegate is successfully removed from a space. The
       * event includes the space ID and the authorization ID of the removed delegate.
       **/
      removeDelegate: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array, removeAuthorization: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes, Bytes]>;
      /**
       * Resets the usage counter of a specified space to zero.
       * 
       * This function can only be called by an authorized origin, defined by
       * `ChainSpaceOrigin`, and is used to reset the usage metrics for a
       * given space on the chain, identified by `space_id`. The reset action
       * is only permissible if the space exists, is not archived, and is
       * approved for operations.
       * 
       * # Parameters
       * - `origin`: The transaction's origin, which must pass the `ChainSpaceOrigin` check.
       * - `space_id`: The identifier of the space for which the usage counter will be reset.
       * 
       * # Errors
       * - Returns `SpaceNotFound` if the specified `space_id` does not correspond to any
       * existing space.
       * - Returns `ArchivedSpace` if the space is archived and thus cannot be modified.
       * - Returns `SpaceNotApproved` if the space is not approved for operations.
       * 
       * # Events
       * - Emits `UpdateCapacity` upon successfully resetting the space's usage counter.
       **/
      resetTransactionCount: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Restores an archived space, making it active again.
       * 
       * This function unarchives a space based on the provided space ID. It
       * checks that the space exists, is currently archived, and is
       * approved. It also verifies that the caller has the authority to
       * restore the space, as indicated by the provided authorization ID.
       * 
       * # Parameters
       * - `origin`: The origin of the transaction, which must be signed by the creator or an
       * admin with the appropriate authority.
       * - `space_id`: The identifier of the space to be restored.
       * - `authorization`: An identifier for the authorization being used to validate the
       * restoration.
       * 
       * # Returns
       * - `DispatchResult`: Returns `Ok(())` if the space is successfully restored, or an error
       * (`DispatchError`) if:
       * - The space does not exist.
       * - The space is not archived.
       * - The space is not approved.
       * - The caller does not have the authority to restore the space.
       * 
       * # Errors
       * - `SpaceNotFound`: If the specified space ID does not correspond to an existing space.
       * - `SpaceNotArchived`: If the space is not currently archived.
       * - `SpaceNotApproved`: If the space has not been approved for use.
       * - `UnauthorizedOperation`: If the caller is not authorized to restore the space.
       * 
       * # Events
       * - `Restore`: Emitted when a space is successfully restored. It includes the space ID and
       * the authority who performed the restoration.
       **/
      restore: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * Creates a new space with a unique identifier based on the provided
       * space code and the creator's identity, along with parent space ID.
       * 
       * This function generates a unique identifier for the space by hashing
       * the encoded space code and creator's identifier. It ensures that the
       * generated space identifier is not already in use. An authorization
       * ID is also created for the new space, which is used to manage
       * delegations. The creator is automatically added as a delegate with
       * all permissions.
       * NOTE: this call is different from create() in just 1 main step. This
       * space can be created from the already 'approved' space, as a
       * 'space-approval' is a council activity, instead in this case, its
       * owner/creator's task. Thus reducing the involvement of council once
       * the top level approval is present.
       * 
       * # Parameters
       * - `origin`: The origin of the transaction, which must be signed by the creator.
       * - `space_code`: A unique code representing the space to be created.
       * - `count`: Number of approved transaction capacity in the sub-space.
       * - `space_id`: Identifier of the parent space.
       * 
       * # Returns
       * - `DispatchResult`: Returns `Ok(())` if the space is successfully created, or an error
       * (`DispatchError`) if:
       * - The generated space identifier is already in use.
       * - The generated authorization ID is of invalid length.
       * - The space delegates limit is exceeded.
       * 
       * # Errors
       * - `InvalidIdentifierLength`: If the generated identifiers for the space or authorization
       * are of invalid length.
       * - `SpaceAlreadyAnchored`: If the space identifier is already in use.
       * - `SpaceDelegatesLimitExceeded`: If the space exceeds the limit of allowed delegates.
       * 
       * # Events
       * - `Create`: Emitted when a new space is successfully created. It includes the space
       * identifier, the creator's identifier, and the authorization ID.
       **/
      subspaceCreate: AugmentedSubmittable<(spaceCode: H256 | string | Uint8Array, count: Option<u64> | null | Uint8Array | u64 | AnyNumber, spaceId: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256, Option<u64>, Bytes]>;
      /**
       * Updates the transaction capacity of an existing space.
       * 
       * This extrinsic updates the capacity limit of a space, ensuring that
       * the new limit is not less than the current usage to prevent
       * over-allocation. It can only be called by an authorized origin and
       * not on archived or unapproved spaces.
       * 
       * # Arguments
       * * `origin` - The origin of the call, which must be from an authorized source.
       * * `space_id` - The identifier of the space for which the capacity is being updated.
       * * `new_txn_capacity` - The new capacity limit to be set for the space.
       * 
       * # Errors
       * * `SpaceNotFound` - If the space with the given ID does not exist.
       * * `ArchivedSpace` - If the space is archived and thus cannot be modified.
       * * `SpaceNotApproved` - If the space has not been approved for use yet.
       * * `CapacityLessThanUsage` - If the new capacity is less than the current usage of the
       * space.
       * 
       * # Events
       * * `UpdateCapacity` - Emits the space ID when the capacity is successfully updated.
       **/
      updateTransactionCapacity: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array, newTxnCapacity: u64 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, u64]>;
      /**
       * Updates the transaction capacity of an existing subspace.
       * 
       * This extrinsic updates the capacity limit of a space, ensuring that
       * the new limit is not less than the current usage to prevent
       * over-allocation. It can only be called by an authorized origin and
       * not on archived or unapproved spaces.
       * 
       * # Arguments
       * * `origin` - The origin of the call, which must be from an authorized source.
       * * `space_id` - The identifier of the space for which the capacity is being updated.
       * * `new_txn_capacity` - The new capacity limit to be set for the space.
       * 
       * # Errors
       * * `SpaceNotFound` - If the space with the given ID does not exist.
       * * `ArchivedSpace` - If the space is archived and thus cannot be modified.
       * * `SpaceNotApproved` - If the space has not been approved for use yet.
       * * `CapacityLessThanUsage` - If the new capacity is less than the current usage of the
       * space.
       * 
       * # Events
       * * `UpdateCapacity` - Emits the space ID when the capacity is successfully updated.
       **/
      updateTransactionCapacitySub: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array, newTxnCapacity: u64 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, u64]>;
    };
    contracts: {
      /**
       * Makes a call to an account, optionally transferring some balance.
       * 
       * # Parameters
       * 
       * * `dest`: Address of the contract to call.
       * * `value`: The balance to transfer from the `origin` to `dest`.
       * * `gas_limit`: The gas limit enforced when executing the constructor.
       * * `storage_deposit_limit`: The maximum amount of balance that can be charged from the
       * caller to pay for the storage consumed.
       * * `data`: The input data to pass to the contract.
       * 
       * * If the account is a smart-contract account, the associated code will be
       * executed and any value will be transferred.
       * * If the account is a regular account, any value will be transferred.
       * * If no account exists and the call value is not less than `existential_deposit`,
       * a regular account will be created and any value will be transferred.
       **/
      call: AugmentedSubmittable<(dest: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, value: Compact<u128> | AnyNumber | Uint8Array, gasLimit: SpWeightsWeightV2Weight | { refTime?: any; proofSize?: any } | string | Uint8Array, storageDepositLimit: Option<Compact<u128>> | null | Uint8Array | Compact<u128> | AnyNumber, data: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, Compact<u128>, SpWeightsWeightV2Weight, Option<Compact<u128>>, Bytes]>;
      /**
       * Deprecated version if [`Self::call`] for use in an in-storage `Call`.
       **/
      callOldWeight: AugmentedSubmittable<(dest: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, value: Compact<u128> | AnyNumber | Uint8Array, gasLimit: Compact<u64> | AnyNumber | Uint8Array, storageDepositLimit: Option<Compact<u128>> | null | Uint8Array | Compact<u128> | AnyNumber, data: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, Compact<u128>, Compact<u64>, Option<Compact<u128>>, Bytes]>;
      /**
       * Instantiates a contract from a previously deployed wasm binary.
       * 
       * This function is identical to [`Self::instantiate_with_code`] but without the
       * code deployment step. Instead, the `code_hash` of an on-chain deployed wasm binary
       * must be supplied.
       **/
      instantiate: AugmentedSubmittable<(value: Compact<u128> | AnyNumber | Uint8Array, gasLimit: SpWeightsWeightV2Weight | { refTime?: any; proofSize?: any } | string | Uint8Array, storageDepositLimit: Option<Compact<u128>> | null | Uint8Array | Compact<u128> | AnyNumber, codeHash: H256 | string | Uint8Array, data: Bytes | string | Uint8Array, salt: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u128>, SpWeightsWeightV2Weight, Option<Compact<u128>>, H256, Bytes, Bytes]>;
      /**
       * Deprecated version if [`Self::instantiate`] for use in an in-storage `Call`.
       **/
      instantiateOldWeight: AugmentedSubmittable<(value: Compact<u128> | AnyNumber | Uint8Array, gasLimit: Compact<u64> | AnyNumber | Uint8Array, storageDepositLimit: Option<Compact<u128>> | null | Uint8Array | Compact<u128> | AnyNumber, codeHash: H256 | string | Uint8Array, data: Bytes | string | Uint8Array, salt: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u128>, Compact<u64>, Option<Compact<u128>>, H256, Bytes, Bytes]>;
      /**
       * Instantiates a new contract from the supplied `code` optionally transferring
       * some balance.
       * 
       * This dispatchable has the same effect as calling [`Self::upload_code`] +
       * [`Self::instantiate`]. Bundling them together provides efficiency gains. Please
       * also check the documentation of [`Self::upload_code`].
       * 
       * # Parameters
       * 
       * * `value`: The balance to transfer from the `origin` to the newly created contract.
       * * `gas_limit`: The gas limit enforced when executing the constructor.
       * * `storage_deposit_limit`: The maximum amount of balance that can be charged/reserved
       * from the caller to pay for the storage consumed.
       * * `code`: The contract code to deploy in raw bytes.
       * * `data`: The input data to pass to the contract constructor.
       * * `salt`: Used for the address derivation. See [`Pallet::contract_address`].
       * 
       * Instantiation is executed as follows:
       * 
       * - The supplied `code` is deployed, and a `code_hash` is created for that code.
       * - If the `code_hash` already exists on the chain the underlying `code` will be shared.
       * - The destination address is computed based on the sender, code_hash and the salt.
       * - The smart-contract account is created at the computed address.
       * - The `value` is transferred to the new account.
       * - The `deploy` function is executed in the context of the newly-created account.
       **/
      instantiateWithCode: AugmentedSubmittable<(value: Compact<u128> | AnyNumber | Uint8Array, gasLimit: SpWeightsWeightV2Weight | { refTime?: any; proofSize?: any } | string | Uint8Array, storageDepositLimit: Option<Compact<u128>> | null | Uint8Array | Compact<u128> | AnyNumber, code: Bytes | string | Uint8Array, data: Bytes | string | Uint8Array, salt: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u128>, SpWeightsWeightV2Weight, Option<Compact<u128>>, Bytes, Bytes, Bytes]>;
      /**
       * Deprecated version if [`Self::instantiate_with_code`] for use in an in-storage `Call`.
       **/
      instantiateWithCodeOldWeight: AugmentedSubmittable<(value: Compact<u128> | AnyNumber | Uint8Array, gasLimit: Compact<u64> | AnyNumber | Uint8Array, storageDepositLimit: Option<Compact<u128>> | null | Uint8Array | Compact<u128> | AnyNumber, code: Bytes | string | Uint8Array, data: Bytes | string | Uint8Array, salt: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u128>, Compact<u64>, Option<Compact<u128>>, Bytes, Bytes, Bytes]>;
      /**
       * When a migration is in progress, this dispatchable can be used to run migration steps.
       * Calls that contribute to advancing the migration have their fees waived, as it's helpful
       * for the chain. Note that while the migration is in progress, the pallet will also
       * leverage the `on_idle` hooks to run migration steps.
       **/
      migrate: AugmentedSubmittable<(weightLimit: SpWeightsWeightV2Weight | { refTime?: any; proofSize?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [SpWeightsWeightV2Weight]>;
      /**
       * Remove the code stored under `code_hash` and refund the deposit to its owner.
       * 
       * A code can only be removed by its original uploader (its owner) and only if it is
       * not used by any contract.
       **/
      removeCode: AugmentedSubmittable<(codeHash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256]>;
      /**
       * Privileged function that changes the code of an existing contract.
       * 
       * This takes care of updating refcounts and all other necessary operations. Returns
       * an error if either the `code_hash` or `dest` do not exist.
       * 
       * # Note
       * 
       * This does **not** change the address of the contract in question. This means
       * that the contract address is no longer derived from its code hash after calling
       * this dispatchable.
       **/
      setCode: AugmentedSubmittable<(dest: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, codeHash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, H256]>;
      /**
       * Upload new `code` without instantiating a contract from it.
       * 
       * If the code does not already exist a deposit is reserved from the caller
       * and unreserved only when [`Self::remove_code`] is called. The size of the reserve
       * depends on the size of the supplied `code`.
       * 
       * If the code already exists in storage it will still return `Ok` and upgrades
       * the in storage version to the current
       * [`InstructionWeights::version`](InstructionWeights).
       * 
       * - `determinism`: If this is set to any other value but [`Determinism::Enforced`] then
       * the only way to use this code is to delegate call into it from an offchain execution.
       * Set to [`Determinism::Enforced`] if in doubt.
       * 
       * # Note
       * 
       * Anyone can instantiate a contract from any uploaded code and thus prevent its removal.
       * To avoid this situation a constructor could employ access control so that it can
       * only be instantiated by permissioned entities. The same is true when uploading
       * through [`Self::instantiate_with_code`].
       * 
       * Use [`Determinism::Relaxed`] exclusively for non-deterministic code. If the uploaded
       * code is deterministic, specifying [`Determinism::Relaxed`] will be disregarded and
       * result in higher gas costs.
       **/
      uploadCode: AugmentedSubmittable<(code: Bytes | string | Uint8Array, storageDepositLimit: Option<Compact<u128>> | null | Uint8Array | Compact<u128> | AnyNumber, determinism: PalletContractsWasmDeterminism | 'Enforced' | 'Relaxed' | number | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Option<Compact<u128>>, PalletContractsWasmDeterminism]>;
    };
    council: {
      /**
       * Close a vote that is either approved, disapproved or whose voting period has ended.
       * 
       * May be called by any signed account in order to finish voting and close the proposal.
       * 
       * If called before the end of the voting period it will only close the vote if it is
       * has enough votes to be approved or disapproved.
       * 
       * If called after the end of the voting period abstentions are counted as rejections
       * unless there is a prime member set and the prime member cast an approval.
       * 
       * If the close operation completes successfully with disapproval, the transaction fee will
       * be waived. Otherwise execution of the approved operation will be charged to the caller.
       * 
       * + `proposal_weight_bound`: The maximum amount of weight consumed by executing the closed
       * proposal.
       * + `length_bound`: The upper bound for the length of the proposal in storage. Checked via
       * `storage::read` so it is `size_of::<u32>() == 4` larger than the pure length.
       * 
       * ## Complexity
       * - `O(B + M + P1 + P2)` where:
       * - `B` is `proposal` size in bytes (length-fee-bounded)
       * - `M` is members-count (code- and governance-bounded)
       * - `P1` is the complexity of `proposal` preimage.
       * - `P2` is proposal-count (code-bounded)
       **/
      close: AugmentedSubmittable<(proposalHash: H256 | string | Uint8Array, index: Compact<u32> | AnyNumber | Uint8Array, proposalWeightBound: SpWeightsWeightV2Weight | { refTime?: any; proofSize?: any } | string | Uint8Array, lengthBound: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256, Compact<u32>, SpWeightsWeightV2Weight, Compact<u32>]>;
      /**
       * Disapprove a proposal, close, and remove it from the system, regardless of its current
       * state.
       * 
       * Must be called by the Root origin.
       * 
       * Parameters:
       * * `proposal_hash`: The hash of the proposal that should be disapproved.
       * 
       * ## Complexity
       * O(P) where P is the number of max proposals
       **/
      disapproveProposal: AugmentedSubmittable<(proposalHash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256]>;
      /**
       * Dispatch a proposal from a member using the `Member` origin.
       * 
       * Origin must be a member of the collective.
       * 
       * ## Complexity:
       * - `O(B + M + P)` where:
       * - `B` is `proposal` size in bytes (length-fee-bounded)
       * - `M` members-count (code-bounded)
       * - `P` complexity of dispatching `proposal`
       **/
      execute: AugmentedSubmittable<(proposal: Call | IMethod | string | Uint8Array, lengthBound: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Call, Compact<u32>]>;
      /**
       * Add a new proposal to either be voted on or executed directly.
       * 
       * Requires the sender to be member.
       * 
       * `threshold` determines whether `proposal` is executed directly (`threshold < 2`)
       * or put up for voting.
       * 
       * ## Complexity
       * - `O(B + M + P1)` or `O(B + M + P2)` where:
       * - `B` is `proposal` size in bytes (length-fee-bounded)
       * - `M` is members-count (code- and governance-bounded)
       * - branching is influenced by `threshold` where:
       * - `P1` is proposal execution complexity (`threshold < 2`)
       * - `P2` is proposals-count (code-bounded) (`threshold >= 2`)
       **/
      propose: AugmentedSubmittable<(threshold: Compact<u32> | AnyNumber | Uint8Array, proposal: Call | IMethod | string | Uint8Array, lengthBound: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, Call, Compact<u32>]>;
      /**
       * Set the collective's membership.
       * 
       * - `new_members`: The new member list. Be nice to the chain and provide it sorted.
       * - `prime`: The prime member whose vote sets the default.
       * - `old_count`: The upper bound for the previous number of members in storage. Used for
       * weight estimation.
       * 
       * The dispatch of this call must be `SetMembersOrigin`.
       * 
       * NOTE: Does not enforce the expected `MaxMembers` limit on the amount of members, but
       * the weight estimations rely on it to estimate dispatchable weight.
       * 
       * # WARNING:
       * 
       * The `pallet-collective` can also be managed by logic outside of the pallet through the
       * implementation of the trait [`ChangeMembers`].
       * Any call to `set_members` must be careful that the member set doesn't get out of sync
       * with other logic managing the member set.
       * 
       * ## Complexity:
       * - `O(MP + N)` where:
       * - `M` old-members-count (code- and governance-bounded)
       * - `N` new-members-count (code- and governance-bounded)
       * - `P` proposals-count (code-bounded)
       **/
      setMembers: AugmentedSubmittable<(newMembers: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[], prime: Option<AccountId32> | null | Uint8Array | AccountId32 | string, oldCount: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Vec<AccountId32>, Option<AccountId32>, u32]>;
      /**
       * Add an aye or nay vote for the sender to the given proposal.
       * 
       * Requires the sender to be a member.
       * 
       * Transaction fees will be waived if the member is voting on any particular proposal
       * for the first time and the call is successful. Subsequent vote changes will charge a
       * fee.
       * ## Complexity
       * - `O(M)` where `M` is members-count (code- and governance-bounded)
       **/
      vote: AugmentedSubmittable<(proposal: H256 | string | Uint8Array, index: Compact<u32> | AnyNumber | Uint8Array, approve: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256, Compact<u32>, bool]>;
    };
    councilMembership: {
      /**
       * Add a member `who` to the set.
       * 
       * May only be called from `T::AddOrigin`.
       **/
      addMember: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * Swap out the sending member for some other key `new`.
       * 
       * May only be called from `Signed` origin of a current member.
       * 
       * Prime membership is passed from the origin account to `new`, if
       * extant.
       **/
      changeKey: AugmentedSubmittable<(updated: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * Remove the prime member if it exists.
       * 
       * May only be called from `T::PrimeOrigin`.
       **/
      clearPrime: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Remove a member `who` from the set.
       * 
       * May only be called from `T::RemoveOrigin`.
       **/
      removeMember: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * Change the membership to a new set, disregarding the existing
       * membership. Be nice and pass `members` pre-sorted.
       * 
       * May only be called from `T::ResetOrigin`.
       **/
      resetMembers: AugmentedSubmittable<(members: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>, [Vec<AccountId32>]>;
      /**
       * Set the prime member. Must be a current member.
       * 
       * May only be called from `T::PrimeOrigin`.
       **/
      setPrime: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * Swap out one member `remove` for another `add`.
       * 
       * May only be called from `T::SwapOrigin`.
       * 
       * Prime membership is *not* passed from `remove` to `add`, if extant.
       **/
      swapMember: AugmentedSubmittable<(remove: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, add: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, MultiAddress]>;
    };
    did: {
      /**
       * Add a single new key agreement key to the DID.
       * 
       * The new key is added to the set of public keys.
       * 
       * The dispatch origin must be a DID origin proxied via the
       * `submit_did_call` extrinsic.
       * 
       * Emits `DidUpdated`.
       * 
       * # <weight>
       * Weight: O(1)
       * - Reads: [Origin Account], Did
       * - Writes: Did
       * # </weight>
       **/
      addKeyAgreementKey: AugmentedSubmittable<(newKey: PalletDidDidDetailsDidEncryptionKey | { x25519: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletDidDidDetailsDidEncryptionKey]>;
      /**
       * Add a new service endpoint under the given DID.
       * 
       * The dispatch origin must be a DID origin proxied via the
       * `submit_did_call` extrinsic.
       * 
       * Emits `DidUpdated`.
       * 
       * # <weight>
       * Weight: O(1)
       * - Reads: [Origin Account], Did, ServiceEndpoints, DidEndpointsCount
       * - Writes: Did, ServiceEndpoints, DidEndpointsCount
       * # </weight>
       **/
      addServiceEndpoint: AugmentedSubmittable<(serviceEndpoint: PalletDidServiceEndpointsDidEndpoint | { id?: any; serviceTypes?: any; urls?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletDidServiceEndpointsDidEndpoint]>;
      /**
       * Store a new DID on chain, after verifying that the creation
       * operation has been signed by the CORD account associated with the
       * identifier of the DID being created and that a DID with the same
       * identifier has not previously existed on (and then deleted from) the
       * chain.
       * 
       * There must be no DID information stored on chain under the same DID
       * identifier.
       * 
       * The new keys added with this operation are stored under the DID
       * identifier along with the block number in which the operation was
       * executed.
       * 
       * The dispatch origin can be any CORD account authorised to execute
       * the extrinsic and it does not have to be tied in any way to the
       * CORD account identifying the DID subject.
       * 
       * Emits `DidCreated`.
       * 
       * # <weight>
       * - The transaction's complexity is mainly dependent on the number of new key agreement
       * keys and the number of new service endpoints included in the operation.
       * ---------
       * Weight: O(K) + O(N) where K is the number of new key agreement
       * keys bounded by `MaxNewKeyAgreementKeys`, while N is the number of
       * new service endpoints bounded by `MaxNumberOfServicesPerDid`.
       * - Reads: [Origin Account], Did, DidBlacklist
       * - Writes: Did (with K new key agreement keys), ServiceEndpoints (with N new service
       * endpoints), DidEndpointsCount
       * # </weight>
       **/
      create: AugmentedSubmittable<(details: PalletDidDidDetailsDidCreationDetails | { did?: any; submitter?: any; newKeyAgreementKeys?: any; newAssertionKey?: any; newDelegationKey?: any; newServiceDetails?: any } | string | Uint8Array, signature: PalletDidDidDetailsDidSignature | { ed25519: any } | { sr25519: any } | { ecdsa: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletDidDidDetailsDidCreationDetails, PalletDidDidDetailsDidSignature]>;
      /**
       * Store a new DID on chain.
       * 
       * The DID identifier is derived from the account ID that submits this
       * call. The authentication key must correspond to the account ID that
       * submitted this call. For accounts that use the ed25519 and sr25519
       * schema, the authentication key must be of the
       * `DidVerificationKey::ed25519` or `DidVerificationKey::sr25519`
       * variant and contains the public key. For ecdsa accounts, the
       * `DidVerificationKey::ecdsa` variant is calculated by hashing the
       * ecdsa public key.
       * 
       * If this call is dispatched by an account id that doesn't correspond
       * to a public private key pair, the `DidVerificationKey::Account`
       * variant shall be used (Multisig, Pure Proxy, Governance origins).
       * The resulting DID can NOT be used for signing data and is therefore
       * limited to onchain activities.
       * 
       * There must be no DID information stored on chain under the same DID
       * identifier. This call will fail if there exists a DID with the same
       * identifier or if a DID with the same identifier existed and was
       * deleted.
       * 
       * The origin for this account must be funded and provide the required
       * deposit and fee.
       * 
       * Emits `DidCreated`.
       **/
      createFromAccount: AugmentedSubmittable<(authenticationKey: PalletDidDidDetailsDidVerificationKey | { ed25519: any } | { sr25519: any } | { ecdsa: any } | { Account: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletDidDidDetailsDidVerificationKey]>;
      /**
       * Delete a DID from the chain and all information associated with it,
       * after verifying that the delete operation has been signed by the DID
       * subject using the authentication key currently stored on chain.
       * 
       * The referenced DID identifier must be present on chain before the
       * delete operation is evaluated.
       * 
       * After it is deleted, a DID with the same identifier cannot be
       * re-created ever again.
       * 
       * As the result of the deletion, all traces of the DID are removed
       * from the storage, which results in the invalidation of all
       * assertions issued by the DID subject.
       * 
       * The dispatch origin must be a DID origin proxied via the
       * `submit_did_call` extrinsic.
       * 
       * Emits `DidDeleted`.
       * 
       * # <weight>
       * Weight: O(1)
       * - Reads: [Origin Account], Did
       * - Kills: Did entry associated to the DID identifier
       * # </weight>
       **/
      delete: AugmentedSubmittable<(endpointsToRemove: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32]>;
      /**
       * Proxy a dispatchable call of another runtime extrinsic that
       * supports a DID origin.
       * 
       * The referenced DID identifier must be present on chain before the
       * operation is dispatched.
       * 
       * A call submitted through this extrinsic must be signed with the
       * right DID key, depending on the call. In contrast to the
       * `submit_did_call` extrinsic, this call doesn't separate the sender
       * from the DID subject. The key that must be used for this DID call
       * is required to also be a valid account with enough balance to pay
       * for fees.
       * 
       * The dispatch origin must be a KILT account with enough funds to
       * execute the extrinsic and must correspond to the required DID
       * Verification Key.
       * 
       * Emits `DidCallDispatched`.
       **/
      dispatchAs: AugmentedSubmittable<(didIdentifier: AccountId32 | string | Uint8Array, call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32, Call]>;
      /**
       * Remove the DID assertion key.
       * 
       * The old key is deleted from the set of public keys if
       * it is not used in any other part of the DID.
       * 
       * The dispatch origin must be a DID origin proxied via the
       * `submit_did_call` extrinsic.
       * 
       * Emits `DidUpdated`.
       * 
       * # <weight>
       * Weight: O(1)
       * - Reads: [Origin Account], Did
       * - Writes: Did
       * # </weight>
       **/
      removeAssertionKey: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Remove the DID delegation key.
       * 
       * The old key is deleted from the set of public keys if
       * it is not used in any other part of the DID.
       * 
       * The dispatch origin must be a DID origin proxied via the
       * `submit_did_call` extrinsic.
       * 
       * Emits `DidUpdated`.
       * 
       * # <weight>
       * Weight: O(1)
       * - Reads: [Origin Account], Did
       * - Writes: Did
       * # </weight>
       **/
      removeDelegationKey: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Remove a DID key agreement key from both its set of key agreement
       * keys and as well as its public keys.
       * 
       * The dispatch origin must be a DID origin proxied via the
       * `submit_did_call` extrinsic.
       * 
       * Emits `DidUpdated`.
       * 
       * # <weight>
       * Weight: O(1)
       * - Reads: [Origin Account], Did
       * - Writes: Did
       * # </weight>
       **/
      removeKeyAgreementKey: AugmentedSubmittable<(keyId: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256]>;
      /**
       * Remove the service with the provided ID from the DID.
       * 
       * The dispatch origin must be a DID origin proxied via the
       * `submit_did_call` extrinsic.
       * 
       * Emits `DidUpdated`.
       * 
       * # <weight>
       * Weight: O(1)
       * - Reads: [Origin Account], ServiceEndpoints, DidEndpointsCount
       * - Writes: Did, ServiceEndpoints, DidEndpointsCount
       * # </weight>
       **/
      removeServiceEndpoint: AugmentedSubmittable<(serviceId: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Set or update the DID assertion key.
       * 
       * If an old key existed, it is deleted from the set of public keys if
       * it is not used in any other part of the DID. The new key is added to
       * the set of public keys.
       * 
       * The dispatch origin must be a DID origin proxied via the
       * `submit_did_call` extrinsic.
       * 
       * Emits `DidUpdated`.
       * 
       * # <weight>
       * Weight: O(1)
       * - Reads: [Origin Account], Did
       * - Writes: Did
       * # </weight>
       **/
      setAssertionKey: AugmentedSubmittable<(newKey: PalletDidDidDetailsDidVerificationKey | { ed25519: any } | { sr25519: any } | { ecdsa: any } | { Account: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletDidDidDetailsDidVerificationKey]>;
      /**
       * Update the DID authentication key.
       * 
       * The old key is deleted from the set of public keys if it is
       * not used in any other part of the DID. The new key is added to the
       * set of public keys.
       * 
       * The dispatch origin must be a DID origin proxied via the
       * `submit_did_call` extrinsic.
       * 
       * Emits `DidUpdated`.
       * 
       * # <weight>
       * Weight: O(1)
       * - Reads: [Origin Account], Did
       * - Writes: Did
       * # </weight>
       **/
      setAuthenticationKey: AugmentedSubmittable<(newKey: PalletDidDidDetailsDidVerificationKey | { ed25519: any } | { sr25519: any } | { ecdsa: any } | { Account: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletDidDidDetailsDidVerificationKey]>;
      /**
       * Set or update the DID delegation key.
       * 
       * If an old key existed, it is deleted from the set of public keys if
       * it is not used in any other part of the DID. The new key is added to
       * the set of public keys.
       * 
       * The dispatch origin must be a DID origin proxied via the
       * `submit_did_call` extrinsic.
       * 
       * Emits `DidUpdated`.
       * 
       * # <weight>
       * Weight: O(1)
       * - Reads: [Origin Account], Did
       * - Writes: Did
       * # </weight>
       **/
      setDelegationKey: AugmentedSubmittable<(newKey: PalletDidDidDetailsDidVerificationKey | { ed25519: any } | { sr25519: any } | { ecdsa: any } | { Account: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletDidDidDetailsDidVerificationKey]>;
      /**
       * Proxy a dispatchable call of another runtime extrinsic that
       * supports a DID origin.
       * 
       * The referenced DID identifier must be present on chain before the
       * operation is dispatched.
       * 
       * A call submitted through this extrinsic must be signed with the
       * right DID key, depending on the call. This information is provided
       * by the `DidAuthorizedCallOperation` parameter, which specifies the
       * DID subject acting as the origin of the call, the DID's tx counter
       * (nonce), the dispatchable to call in case signature verification
       * succeeds, the type of DID key to use to verify the operation
       * signature, and the block number the operation was targeting for
       * inclusion, when it was created and signed.
       * 
       * In case the signature is incorrect, the nonce is not valid, the
       * required key is not present for the specified DID, or the block
       * specified is too old the verification fails and the call is not
       * dispatched. Otherwise, the call is properly dispatched with a
       * `DidOrigin` origin indicating the DID subject.
       * 
       * A successful dispatch operation results in the tx counter associated
       * with the given DID to be incremented, to mitigate replay attacks.
       * 
       * The dispatch origin can be any CORD account with enough funds to
       * execute the extrinsic and it does not have to be tied in any way to
       * the CORD account identifying the DID subject.
       * 
       * Emits `DidCallDispatched`.
       * 
       * # <weight>
       * Weight: O(1) + weight of the dispatched call
       * - Reads: [Origin Account], Did
       * - Writes: Did
       * # </weight>
       **/
      submitDidCall: AugmentedSubmittable<(didCall: PalletDidDidDetailsDidAuthorizedCallOperation | { did?: any; txCounter?: any; call?: any; blockNumber?: any; submitter?: any } | string | Uint8Array, signature: PalletDidDidDetailsDidSignature | { ed25519: any } | { sr25519: any } | { ecdsa: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletDidDidDetailsDidAuthorizedCallOperation, PalletDidDidDetailsDidSignature]>;
    };
    didName: {
      /**
       * Ban a name.
       * 
       * A banned name cannot be registered by anyone.
       * 
       * The origin must be the ban origin.
       **/
      ban: AugmentedSubmittable<(name: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Assign the specified name to the owner as specified in the
       * origin.
       * 
       * The name must not have already been registered by someone else and
       * the owner must not already own another name.
       **/
      register: AugmentedSubmittable<(name: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Release the provided name from its owner.
       * 
       * The origin must be the owner of the specified name.
       **/
      release: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Unban a name.
       * 
       * Make a name available again.
       * 
       * The origin must be the ban origin.
       **/
      unban: AugmentedSubmittable<(name: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
    };
    entries: {
      /**
       * Creates a new Registry Entry within a specified Registry.
       * 
       * This function allows a user to create a new entry within an existing Registry.
       * The function verifies that the caller is authorized to create an entry within the
       * specified Registry, ensures that the entry does not already exist.
       * 
       * 
       * # Arguments
       * * `origin` - The origin of the call, which must be a signed account (creator of the
       * entry).
       * * `registry_entry_id` - A unique id as registry entry identifier.
       * * `authorization` - The authorization identifier that links the creator to the Registry.
       * * `digest` - The hash value or digest of the content associated with the Registry entry.
       * * `blob` - (Optional) Additional data associated with the Registry entry, provided as an
       * optional field.
       * 
       * # Errors
       * This function returns an error in the following cases:
       * * `UnauthorizedOperation` - If the caller does not have permission to create entries
       * within the Registry.
       * * `RegistryEntryIdentifierAlreadyExists` - If the `registry_entry_id` already exists in
       * the storage.
       * * `InvalidIdentifierLength` - If the `registry_entry_id` generated from the hash exceeds
       * the expected length for identifiers.
       * 
       * # Events
       * Emits the `Event::RegistryEntryCreated` event upon successful creation of a new Registry
       * entry. This event includes the `creator`, `registry_id`, and the `registry_entry_id`
       * of the new entry.
       * 
       * # Example
       * ```rust
       * create(origin, registry_entry_id, authorization, digest, Some(blob))?;
       * ```
       **/
      create: AugmentedSubmittable<(registryEntryId: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array, digest: H256 | string | Uint8Array, blob: Option<Bytes> | null | Uint8Array | Bytes | string) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes, H256, Option<Bytes>]>;
      /**
       * Reinstates an revoked existing Registry Entry.
       * 
       * This function allows an authorized user to reinstates revoked an existing Registry
       * Entry, marking it active again. The revocation can only be performed by the account
       * with appropriate permissions
       * 
       * # Arguments
       * * `origin` - The origin of the call, which must be a signed account (updater).
       * * `registry_entry_id` - The unique identifier of the Registry Entry to be reinstated.
       * * `authorization` - The authorization identifier that links the updater to the Registry.
       * 
       * # Errors
       * This function returns an error in the following cases:
       * * `UnauthorizedOperation` - If the caller does not have permission to revoke the
       * Registry Entry.
       * * `RegistryEntryIdentifierDoesNotExist` - If the specified `registry_entry_id` does not
       * exist.
       * 
       * # Events
       * Emits the `Event::RegistryEntryReinstated` event upon Registry Entry successfully
       * reinstated. This event includes the `updater` and the `registry_entry_id`.
       * 
       * # Example
       * ```rust
       * reinstate(origin, registry_entry_id, authorization)?;
       * ```
       **/
      reinstate: AugmentedSubmittable<(registryEntryId: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * Revokes an existing Registry Entry.
       * 
       * This function allows an authorized user to revoke an existing Registry Entry, marking it
       * as no longer valid. The revocation can only be performed by the account with
       * appropriate permissions.
       * 
       * # Arguments
       * * `origin` - The origin of the call, which must be a signed account (updater).
       * * `registry_entry_id` - The unique identifier of the Registry Entry to be revoked.
       * * `authorization` - The authorization identifier that links the updater to the Registry.
       * 
       * # Errors
       * This function returns an error in the following cases:
       * * `UnauthorizedOperation` - If the caller does not have permission to revoke the
       * Registry Entry.
       * * `RegistryEntryIdentifierDoesNotExist` - If the specified `registry_entry_id` does not
       * exist.
       * 
       * # Events
       * Emits the `Event::RegistryEntryRevoked` event upon successful revocation of the Registry
       * Entry. This event includes the `updater` and the `registry_entry_id`.
       * 
       * # Example
       * ```rust
       * revoke(origin, registry_entry_id, authorization)?;
       * ```
       **/
      revoke: AugmentedSubmittable<(registryEntryId: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * Updates an existing Registry Entry with new metadata.
       * 
       * This function allows an authorized user to update the metadata (such as the `digest` or
       * optional `blob`) of an existing Registry Entry. The user must have the necessary
       * permissions to perform this operation.
       * 
       * 
       * # Arguments
       * * `origin` - The origin of the call, which must be a signed account (updater).
       * * `registry_entry_id` - The unique identifier of the Registry Entry to be updated.
       * * `authorization` - The authorization identifier that links the updater to the Registry.
       * * `digest` - The new hash value or digest to be associated with the Registry Entry.
       * * `blob` - (Optional) New additional data to be associated with the Registry Entry.
       * 
       * # Errors
       * This function returns an error in the following cases:
       * * `UnauthorizedOperation` - If the caller does not have permission to update the
       * Registry Entry.
       * * `RegistryEntryIdentifierDoesNotExist` - If the specified `registry_entry_id` does not
       * exist.
       * * `StateNotSupported` - If an unsupported state is provided.
       * 
       * # Events
       * Emits the `Event::RegistryEntryUpdated` event upon successful update of the Registry
       * Entry. This event includes the `updater` and the `registry_entry_id`.
       * 
       * # Example
       * ```rust
       * update(origin, registry_entry_id, authorization, digest, Some(blob))?;
       * ```
       **/
      update: AugmentedSubmittable<(registryEntryId: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array, digest: H256 | string | Uint8Array, blob: Option<Bytes> | null | Uint8Array | Bytes | string) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes, H256, Option<Bytes>]>;
    };
    grandpa: {
      /**
       * Note that the current authority set of the GRANDPA finality gadget has stalled.
       * 
       * This will trigger a forced authority set change at the beginning of the next session, to
       * be enacted `delay` blocks after that. The `delay` should be high enough to safely assume
       * that the block signalling the forced change will not be re-orged e.g. 1000 blocks.
       * The block production rate (which may be slowed down because of finality lagging) should
       * be taken into account when choosing the `delay`. The GRANDPA voters based on the new
       * authority will start voting on top of `best_finalized_block_number` for new finalized
       * blocks. `best_finalized_block_number` should be the highest of the latest finalized
       * block of all validators of the new authority set.
       * 
       * Only callable by root.
       **/
      noteStalled: AugmentedSubmittable<(delay: u32 | AnyNumber | Uint8Array, bestFinalizedBlockNumber: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32, u32]>;
      /**
       * Report voter equivocation/misbehavior. This method will verify the
       * equivocation proof and validate the given key ownership proof
       * against the extracted offender. If both are valid, the offence
       * will be reported.
       **/
      reportEquivocation: AugmentedSubmittable<(equivocationProof: SpConsensusGrandpaEquivocationProof | { setId?: any; equivocation?: any } | string | Uint8Array, keyOwnerProof: SpSessionMembershipProof | { session?: any; trieNodes?: any; validatorCount?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [SpConsensusGrandpaEquivocationProof, SpSessionMembershipProof]>;
      /**
       * Report voter equivocation/misbehavior. This method will verify the
       * equivocation proof and validate the given key ownership proof
       * against the extracted offender. If both are valid, the offence
       * will be reported.
       * 
       * This extrinsic must be called unsigned and it is expected that only
       * block authors will call it (validated in `ValidateUnsigned`), as such
       * if the block author is defined it will be defined as the equivocation
       * reporter.
       **/
      reportEquivocationUnsigned: AugmentedSubmittable<(equivocationProof: SpConsensusGrandpaEquivocationProof | { setId?: any; equivocation?: any } | string | Uint8Array, keyOwnerProof: SpSessionMembershipProof | { session?: any; trieNodes?: any; validatorCount?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [SpConsensusGrandpaEquivocationProof, SpSessionMembershipProof]>;
    };
    identity: {
      /**
       * Accept a given username that an `authority` granted. The call must include the full
       * username, as in `username.suffix`.
       **/
      acceptUsername: AugmentedSubmittable<(username: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Add a registrar to the system.
       * 
       * The dispatch origin for this call must be `T::RegistrarOrigin`.
       * 
       * - `account`: the account of the registrar.
       * 
       * Emits `RegistrarAdded` if successful.
       **/
      addRegistrar: AugmentedSubmittable<(account: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * Add the given account to the sender's subs.
       * 
       * Payment: Balance reserved by a previous `set_subs` call for one sub will be repatriated
       * to the sender.
       * 
       * The dispatch origin for this call must be _Signed_ and the sender must have a registered
       * sub identity of `sub`.
       **/
      addSub: AugmentedSubmittable<(sub: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, data: Data | { None: any } | { Raw: any } | { BlakeTwo256: any } | { Sha256: any } | { Keccak256: any } | { ShaThree256: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, Data]>;
      /**
       * Add an `AccountId` with permission to grant usernames with a given `suffix` appended.
       * 
       * The authority can grant up to `allocation` usernames. To top up their allocation, they
       * should just issue (or request via governance) a new `add_username_authority` call.
       **/
      addUsernameAuthority: AugmentedSubmittable<(authority: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, suffix: Bytes | string | Uint8Array, allocation: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, Bytes, u32]>;
      /**
       * Cancel a previous request.
       * 
       * Payment: A previously reserved deposit is returned on success.
       * 
       * The dispatch origin for this call must be _Signed_ and the sender
       * must have a registered identity.
       * 
       * - `reg_index`: The index of the registrar whose judgement is no longer requested.
       * 
       * Emits `JudgementUnrequested` if successful.
       **/
      cancelRequest: AugmentedSubmittable<(registrar: AccountId32 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32]>;
      /**
       * Clear an account's identity info and all sub-accounts
       * 
       * The dispatch origin for this call must be _Signed_ and the sender
       * must have a registered identity.
       * 
       * Emits `IdentityCleared` if successful.
       **/
      clearIdentity: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Remove an account's identity
       * 
       * The dispatch origin for this call must match `T::RegistrarOrigin`.
       * 
       * - `target`: the account whose identity the judgement is upon. This must be an account
       * with a registered identity.
       * 
       * Emits `IdentityKilled` if successful.
       **/
      killIdentity: AugmentedSubmittable<(target: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * Provide a judgement for an account's identity.
       * 
       * The dispatch origin for this call must be _Signed_ and the sender
       * must be the account of the registrar whose index is `reg_index`.
       * 
       * - `reg_index`: the index of the registrar whose judgement is being made.
       * - `target`: the account whose identity the judgement is upon. This must be an account
       * with a registered identity.
       * - `judgement`: the judgement of the registrar of index `reg_index` about `target`.
       * - `identity`: The hash of the [`IdentityInfo`] for that the judgement is provided.
       * 
       * Emits `JudgementGiven` if successful.
       * 
       * ## Complexity
       * - `O(R + X)`.
       * - where `R` registrar-count (governance-bounded).
       * - where `X` additional-field-count (deposit-bounded and code-bounded).
       **/
      provideJudgement: AugmentedSubmittable<(target: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, judgement: PalletIdentityJudgement | 'Unknown' | 'Requested' | 'Reasonable' | 'KnownGood' | 'OutOfDate' | 'LowQuality' | 'Erroneous' | number | Uint8Array, identity: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, PalletIdentityJudgement, H256]>;
      /**
       * Remove the sender as a sub-account.
       * 
       * Payment: Balance reserved by a previous `set_subs` call for one sub will be repatriated
       * to the sender (*not* the original depositor).
       * 
       * The dispatch origin for this call must be _Signed_ and the sender must have a registered
       * super-identity.
       * 
       * NOTE: This should not normally be used, but is provided in the case that the non-
       * controller of an account is maliciously registered as a sub-account.
       **/
      quitSub: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Remove a username that corresponds to an account with no identity. Exists when a user
       * gets a username but then calls `clear_identity`.
       **/
      removeDanglingUsername: AugmentedSubmittable<(username: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Remove an expired username approval. The username was approved by an authority but never
       * accepted by the user and must now be beyond its expiration. The call must include the
       * full username, as in `username.suffix`.
       **/
      removeExpiredApproval: AugmentedSubmittable<(username: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Remove a registrar from the system.
       * 
       * The dispatch origin for this call must be `T::RegistrarOrigin`.
       * 
       * - `account`: the account of the registrar.
       * 
       * Emits `RegistrarRemoved` if successful.
       **/
      removeRegistrar: AugmentedSubmittable<(account: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * Remove the given account from the sender's subs.
       * 
       * Payment: Balance reserved by a previous `set_subs` call for one sub will be repatriated
       * to the sender.
       * 
       * The dispatch origin for this call must be _Signed_ and the sender must have a registered
       * sub identity of `sub`.
       **/
      removeSub: AugmentedSubmittable<(sub: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * Remove `authority` from the username authorities.
       **/
      removeUsernameAuthority: AugmentedSubmittable<(authority: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * Alter the associated name of the given sub-account.
       * 
       * The dispatch origin for this call must be _Signed_ and the sender must have a registered
       * sub identity of `sub`.
       **/
      renameSub: AugmentedSubmittable<(sub: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, data: Data | { None: any } | { Raw: any } | { BlakeTwo256: any } | { Sha256: any } | { Keccak256: any } | { ShaThree256: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, Data]>;
      /**
       * Request a judgement from a registrar.
       * 
       * The dispatch origin for this call must be _Signed_ and the sender
       * must have a registered identity.
       * 
       * - `reg_index`: The index of the registrar whose judgement is requested.
       * 
       * Emits `JudgementRequested` if successful.
       **/
      requestJudgement: AugmentedSubmittable<(registrar: AccountId32 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32]>;
      /**
       * Change the account associated with a registrar.
       * 
       * The dispatch origin for this call must be _Signed_ and the sender
       * must be the account of the registrar whose index is `index`.
       * 
       * - `index`: the index of the registrar whose fee is to be set.
       * - `new`: the new account ID.
       **/
      setAccountId: AugmentedSubmittable<(updated: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * Set the field information for a registrar.
       * 
       * The dispatch origin for this call must be _Signed_ and the sender
       * must be the account of the registrar whose index is `index`.
       * 
       * - `index`: the index of the registrar whose fee is to be set.
       * - `fields`: the fields that the registrar concerns themselves with.
       **/
      setFields: AugmentedSubmittable<(fields: u64 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u64]>;
      /**
       * Set an account's identity information
       * 
       * 
       * The dispatch origin for this call must be _Signed_.
       * 
       * - `info`: The identity information.
       * 
       * Emits `IdentitySet` if successful.
       **/
      setIdentity: AugmentedSubmittable<(info: PalletIdentityLegacyIdentityInfo | { additional?: any; display?: any; legal?: any; web?: any; email?: any; image?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletIdentityLegacyIdentityInfo]>;
      /**
       * Set a given username as the primary. The username should include the suffix.
       **/
      setPrimaryUsername: AugmentedSubmittable<(username: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Set the sub-accounts of the sender.
       * 
       * The dispatch origin for this call must be _Signed_ and the sender must have a registered
       * identity.
       * 
       * - `subs`: The identity's (new) sub-accounts.
       **/
      setSubs: AugmentedSubmittable<(subs: Vec<ITuple<[AccountId32, Data]>> | ([AccountId32 | string | Uint8Array, Data | { None: any } | { Raw: any } | { BlakeTwo256: any } | { Sha256: any } | { Keccak256: any } | { ShaThree256: any } | string | Uint8Array])[]) => SubmittableExtrinsic<ApiType>, [Vec<ITuple<[AccountId32, Data]>>]>;
      /**
       * Set the username for `who`. Must be called by a username authority.
       * 
       * The authority must have an `allocation`. Users can either pre-sign their usernames or
       * accept them later.
       * 
       * Usernames must:
       * - Only contain lowercase ASCII characters or digits.
       * - When combined with the suffix of the issuing authority be _less than_ the
       * `MaxUsernameLength`.
       **/
      setUsernameFor: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, username: Bytes | string | Uint8Array, signature: Option<SpRuntimeMultiSignature> | null | Uint8Array | SpRuntimeMultiSignature | { ed25519: any } | { sr25519: any } | { ecdsa: any } | string) => SubmittableExtrinsic<ApiType>, [MultiAddress, Bytes, Option<SpRuntimeMultiSignature>]>;
    };
    imOnline: {
      /**
       * ## Complexity:
       * - `O(K)` where K is length of `Keys` (heartbeat.validators_len)
       * - `O(K)`: decoding of length `K`
       **/
      heartbeat: AugmentedSubmittable<(heartbeat: PalletImOnlineHeartbeat | { blockNumber?: any; sessionIndex?: any; authorityIndex?: any; validatorsLen?: any } | string | Uint8Array, signature: PalletImOnlineSr25519AppSr25519Signature | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletImOnlineHeartbeat, PalletImOnlineSr25519AppSr25519Signature]>;
    };
    indices: {
      /**
       * Assign an previously unassigned index.
       * 
       * Payment: `Deposit` is reserved from the sender account.
       * 
       * The dispatch origin for this call must be _Signed_.
       * 
       * - `index`: the index to be claimed. This must not be in use.
       * 
       * Emits `IndexAssigned` if successful.
       * 
       * ## Complexity
       * - `O(1)`.
       **/
      claim: AugmentedSubmittable<(index: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32]>;
      /**
       * Force an index to an account. This doesn't require a deposit. If the index is already
       * held, then any deposit is reimbursed to its current owner.
       * 
       * The dispatch origin for this call must be _Root_.
       * 
       * - `index`: the index to be (re-)assigned.
       * - `new`: the new owner of the index. This function is a no-op if it is equal to sender.
       * - `freeze`: if set to `true`, will freeze the index so it cannot be transferred.
       * 
       * Emits `IndexAssigned` if successful.
       * 
       * ## Complexity
       * - `O(1)`.
       **/
      forceTransfer: AugmentedSubmittable<(updated: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, index: u32 | AnyNumber | Uint8Array, freeze: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, u32, bool]>;
      /**
       * Free up an index owned by the sender.
       * 
       * Payment: Any previous deposit placed for the index is unreserved in the sender account.
       * 
       * The dispatch origin for this call must be _Signed_ and the sender must own the index.
       * 
       * - `index`: the index to be freed. This must be owned by the sender.
       * 
       * Emits `IndexFreed` if successful.
       * 
       * ## Complexity
       * - `O(1)`.
       **/
      free: AugmentedSubmittable<(index: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32]>;
      /**
       * Freeze an index so it will always point to the sender account. This consumes the
       * deposit.
       * 
       * The dispatch origin for this call must be _Signed_ and the signing account must have a
       * non-frozen account `index`.
       * 
       * - `index`: the index to be frozen in place.
       * 
       * Emits `IndexFrozen` if successful.
       * 
       * ## Complexity
       * - `O(1)`.
       **/
      freeze: AugmentedSubmittable<(index: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32]>;
      /**
       * Assign an index already owned by the sender to another account. The balance reservation
       * is effectively transferred to the new account.
       * 
       * The dispatch origin for this call must be _Signed_.
       * 
       * - `index`: the index to be re-assigned. This must be owned by the sender.
       * - `new`: the new owner of the index. This function is a no-op if it is equal to sender.
       * 
       * Emits `IndexAssigned` if successful.
       * 
       * ## Complexity
       * - `O(1)`.
       **/
      transfer: AugmentedSubmittable<(updated: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, index: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, u32]>;
    };
    multisig: {
      /**
       * Register approval for a dispatch to be made from a deterministic composite account if
       * approved by a total of `threshold - 1` of `other_signatories`.
       * 
       * Payment: `DepositBase` will be reserved if this is the first approval, plus
       * `threshold` times `DepositFactor`. It is returned once this dispatch happens or
       * is cancelled.
       * 
       * The dispatch origin for this call must be _Signed_.
       * 
       * - `threshold`: The total number of approvals for this dispatch before it is executed.
       * - `other_signatories`: The accounts (other than the sender) who can approve this
       * dispatch. May not be empty.
       * - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is
       * not the first approval, then it must be `Some`, with the timepoint (block number and
       * transaction index) of the first approval transaction.
       * - `call_hash`: The hash of the call to be executed.
       * 
       * NOTE: If this is the final approval, you will want to use `as_multi` instead.
       * 
       * ## Complexity
       * - `O(S)`.
       * - Up to one balance-reserve or unreserve operation.
       * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
       * signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
       * - One encode & hash, both of complexity `O(S)`.
       * - Up to one binary search and insert (`O(logS + S)`).
       * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
       * - One event.
       * - Storage: inserts one item, value size bounded by `MaxSignatories`, with a deposit
       * taken for its lifetime of `DepositBase + threshold * DepositFactor`.
       **/
      approveAsMulti: AugmentedSubmittable<(threshold: u16 | AnyNumber | Uint8Array, otherSignatories: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[], maybeTimepoint: Option<PalletMultisigTimepoint> | null | Uint8Array | PalletMultisigTimepoint | { height?: any; index?: any } | string, callHash: U8aFixed | string | Uint8Array, maxWeight: SpWeightsWeightV2Weight | { refTime?: any; proofSize?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [u16, Vec<AccountId32>, Option<PalletMultisigTimepoint>, U8aFixed, SpWeightsWeightV2Weight]>;
      /**
       * Register approval for a dispatch to be made from a deterministic composite account if
       * approved by a total of `threshold - 1` of `other_signatories`.
       * 
       * If there are enough, then dispatch the call.
       * 
       * Payment: `DepositBase` will be reserved if this is the first approval, plus
       * `threshold` times `DepositFactor`. It is returned once this dispatch happens or
       * is cancelled.
       * 
       * The dispatch origin for this call must be _Signed_.
       * 
       * - `threshold`: The total number of approvals for this dispatch before it is executed.
       * - `other_signatories`: The accounts (other than the sender) who can approve this
       * dispatch. May not be empty.
       * - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is
       * not the first approval, then it must be `Some`, with the timepoint (block number and
       * transaction index) of the first approval transaction.
       * - `call`: The call to be executed.
       * 
       * NOTE: Unless this is the final approval, you will generally want to use
       * `approve_as_multi` instead, since it only requires a hash of the call.
       * 
       * Result is equivalent to the dispatched result if `threshold` is exactly `1`. Otherwise
       * on success, result is `Ok` and the result from the interior call, if it was executed,
       * may be found in the deposited `MultisigExecuted` event.
       * 
       * ## Complexity
       * - `O(S + Z + Call)`.
       * - Up to one balance-reserve or unreserve operation.
       * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
       * signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
       * - One call encode & hash, both of complexity `O(Z)` where `Z` is tx-len.
       * - One encode & hash, both of complexity `O(S)`.
       * - Up to one binary search and insert (`O(logS + S)`).
       * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
       * - One event.
       * - The weight of the `call`.
       * - Storage: inserts one item, value size bounded by `MaxSignatories`, with a deposit
       * taken for its lifetime of `DepositBase + threshold * DepositFactor`.
       **/
      asMulti: AugmentedSubmittable<(threshold: u16 | AnyNumber | Uint8Array, otherSignatories: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[], maybeTimepoint: Option<PalletMultisigTimepoint> | null | Uint8Array | PalletMultisigTimepoint | { height?: any; index?: any } | string, call: Call | IMethod | string | Uint8Array, maxWeight: SpWeightsWeightV2Weight | { refTime?: any; proofSize?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [u16, Vec<AccountId32>, Option<PalletMultisigTimepoint>, Call, SpWeightsWeightV2Weight]>;
      /**
       * Immediately dispatch a multi-signature call using a single approval from the caller.
       * 
       * The dispatch origin for this call must be _Signed_.
       * 
       * - `other_signatories`: The accounts (other than the sender) who are part of the
       * multi-signature, but do not participate in the approval process.
       * - `call`: The call to be executed.
       * 
       * Result is equivalent to the dispatched result.
       * 
       * ## Complexity
       * O(Z + C) where Z is the length of the call and C its execution weight.
       **/
      asMultiThreshold1: AugmentedSubmittable<(otherSignatories: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[], call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Vec<AccountId32>, Call]>;
      /**
       * Cancel a pre-existing, on-going multisig transaction. Any deposit reserved previously
       * for this operation will be unreserved on success.
       * 
       * The dispatch origin for this call must be _Signed_.
       * 
       * - `threshold`: The total number of approvals for this dispatch before it is executed.
       * - `other_signatories`: The accounts (other than the sender) who can approve this
       * dispatch. May not be empty.
       * - `timepoint`: The timepoint (block number and transaction index) of the first approval
       * transaction for this dispatch.
       * - `call_hash`: The hash of the call to be executed.
       * 
       * ## Complexity
       * - `O(S)`.
       * - Up to one balance-reserve or unreserve operation.
       * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
       * signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
       * - One encode & hash, both of complexity `O(S)`.
       * - One event.
       * - I/O: 1 read `O(S)`, one remove.
       * - Storage: removes one item.
       **/
      cancelAsMulti: AugmentedSubmittable<(threshold: u16 | AnyNumber | Uint8Array, otherSignatories: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[], timepoint: PalletMultisigTimepoint | { height?: any; index?: any } | string | Uint8Array, callHash: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [u16, Vec<AccountId32>, PalletMultisigTimepoint, U8aFixed]>;
    };
    networkMembership: {
      /**
       * Add an author. Only root or council origin can perform this
       * action.
       **/
      nominate: AugmentedSubmittable<(member: AccountId32 | string | Uint8Array, expires: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32, bool]>;
      /**
       * Renew authorship. Only root or council orgin can perform this
       * action.
       **/
      renew: AugmentedSubmittable<(member: AccountId32 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32]>;
      /**
       * Revoke a membership. Only root or council orgin can perform this
       * action.
       **/
      revoke: AugmentedSubmittable<(member: AccountId32 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32]>;
    };
    networkScore: {
      /**
       * Registers a new rating in the system.
       * 
       * This function allows a user to submit a new rating for an entity.
       * The rating is recorded along with various metadata, including the
       * author of the rating, the space ID, and a unique message identifier.
       * 
       * # Arguments
       * * `origin` - The origin of the call, which should be a signed user in most cases.
       * * `entry` - The rating entry, containing details about the entity being rated, the
       * rating itself, and other metadata.
       * * `digest` - A hash representing some unique aspects of the rating, used for
       * identification and integrity purposes.
       * * `authorization` - An identifier for authorization, used to validate the origin's
       * permission to make this rating.
       * 
       * # Errors
       * Returns `Error::<T>::InvalidRatingValue` if the rating value is not
       * within the expected range.
       * Returns `Error::<T>::InvalidRatingType` if the entry type or
       * rating type is not valid.
       * Returns `Error::<T>::MessageIdAlreadyExists` if the message
       * identifier is already used.
       * Returns `Error::<T>::InvalidIdentifierLength` if the generated
       * identifier for the rating is of invalid length.
       * Returns `Error::<T>::RatingIdentifierAlreadyAdded` if the rating
       * identifier is already in use.
       * 
       * # Events
       * Emits `RatingEntryAdded` when a new rating is successfully
       * registered.
       * 
       * # Example
       * ```
       * register_rating(origin, entry, digest, authorization)?;
       * ```
       **/
      registerRating: AugmentedSubmittable<(entry: PalletNetworkScoreRatingInputEntry | { entityId?: any; providerId?: any; countOfTxn?: any; totalEncodedRating?: any; ratingType?: any; providerDid?: any } | string | Uint8Array, digest: H256 | string | Uint8Array, messageId: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletNetworkScoreRatingInputEntry, H256, Bytes, Bytes]>;
      /**
       * Revises an existing rating by creating a new credit entry linked to
       * the original.
       * 
       * This function allows for the modification of a previously submitted
       * rating. It creates a new credit entry which is linked to the
       * original rating (referred to by `amend_ref_id`). This function is
       * used for correcting or updating an existing rating.
       * 
       * # Arguments
       * * `origin` - The origin of the call, usually a signed user.
       * * `entry` - The new rating entry with updated details.
       * * `digest` - A hash representing the revised rating, used for identification and
       * integrity.
       * * `message_id` - A new message identifier for the revised rating.
       * * `amend_ref_id` - The identifier of the original rating entry that is being revised.
       * * `authorization` - An identifier for authorization, validating the origin's permission
       * to revise the rating.
       * 
       * # Errors
       * Returns `Error::<T>::InvalidRatingValue` if the new rating value is
       * not within the expected range.
       * Returns `Error::<T>::InvalidRatingType` if the entry type or
       * rating type of the new rating is invalid.
       * Returns `Error::<T>::ReferenceIdentifierNotFound` if the original
       * rating reference identifier is not found.
       * Returns `Error::<T>::EntityMismatch` if the entity UID of the new
       * rating does not match the original.
       * Returns `Error::<T>::SpaceMismatch` if the space ID does not match
       * the original. Returns `Error::<T>::ReferenceNotAmendIdentifier` if
       * the original entry is not a debit entry.
       * Returns `Error::<T>::MessageIdAlreadyExists` if the new message
       * identifier is already in use.
       * Returns `Error::<T>::InvalidIdentifierLength` if the generated
       * identifier for the revision is of invalid length.
       * Returns `Error::<T>::RatingIdentifierAlreadyAdded` if the revised
       * rating identifier is already in use.
       * 
       * # Events
       * Emits `RatingEntryRevoked` when an existing rating entry is
       * successfully revised.
       * 
       * # Example
       * ```
       * revise_rating(origin, entry, digest, message_id, amend_ref_id, authorization)?;
       * ```
       **/
      reviseRating: AugmentedSubmittable<(entry: PalletNetworkScoreRatingInputEntry | { entityId?: any; providerId?: any; countOfTxn?: any; totalEncodedRating?: any; ratingType?: any; providerDid?: any } | string | Uint8Array, digest: H256 | string | Uint8Array, messageId: Bytes | string | Uint8Array, debitRefId: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletNetworkScoreRatingInputEntry, H256, Bytes, Bytes, Bytes]>;
      /**
       * Amends an existing rating entry by creating a debit entry linked to
       * the original.
       * 
       * This function facilitates the amendment of a previously submitted
       * rating. It creates a debit entry referencing the original rating
       * entry. This function is typically used to correct or revoke a
       * rating.
       * 
       * # Arguments
       * * `origin` - The origin of the call, usually a signed user.
       * * `entry_identifier` - The identifier of the rating entry to be amended.
       * * `message_id` - A new message identifier for the amendment.
       * * `digest` - A hash representing the amendment, used for identification and integrity
       * purposes.
       * * `authorization` - An identifier for authorization, validating the origin's permission
       * to amend the rating.
       * 
       * # Errors
       * Returns `Error::<T>::RatingIdentifierNotFound` if the original
       * rating entry is not found.
       * Returns `Error::<T>::UnauthorizedOperation` if the origin does not
       * have the authority to amend the rating.
       * Returns `Error::<T>::MessageIdAlreadyExists` if the new message
       * identifier is already in use.
       * Returns `Error::<T>::InvalidIdentifierLength` if the generated
       * identifier for the amendment is of invalid length.
       * Returns `Error::<T>::RatingIdentifierAlreadyAdded` if the amendment
       * identifier is already in use.
       * 
       * # Events
       * Emits `RatingEntryRevoked` when a rating entry is successfully
       * amended.
       * 
       * # Example
       * ```
       * amend_rating(origin, entry_identifier, message_id, digest, authorization)?;
       * ```
       **/
      revokeRating: AugmentedSubmittable<(entryIdentifier: Bytes | string | Uint8Array, messageId: Bytes | string | Uint8Array, digest: H256 | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes, H256, Bytes]>;
    };
    nodeAuthorization: {
      /**
       * Add additional connections to a given node.
       * 
       * - `node`: identifier of the node.
       * - `connections`: additonal nodes from which the connections are allowed.
       **/
      addConnection: AugmentedSubmittable<(nodeId: Bytes | string | Uint8Array, connectionId: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * Add a node to the set of well known nodes. If the node is already
       * claimed, the owner will be updated and keep the existing additional
       * connection unchanged.
       * 
       * May only be called from `T::AddOrigin`.
       * 
       * - `node`: identifier of the node.
       **/
      addWellKnownNode: AugmentedSubmittable<(nodeId: Bytes | string | Uint8Array, owner: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, MultiAddress]>;
      /**
       * Remove additional connections of a given node.
       * 
       * - `node`: identifier of the node.
       * - `connections`: additonal nodes from which the connections are not allowed anymore.
       **/
      removeConnection: AugmentedSubmittable<(nodeId: Bytes | string | Uint8Array, connectionId: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * Remove a node from the set of well known nodes. The ownership and
       * additional connections of the node will also be removed.
       * 
       * May only be called from `T::RemoveOrigin`.
       * 
       * - `node`: identifier of the node.
       **/
      removeWellKnownNode: AugmentedSubmittable<(nodeId: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Swap a well known node to another. Both the ownership and additional
       * connections stay untouched.
       * 
       * - `remove`: the node which will be moved out from the list.
       * - `add`: the node which will be put in the list.
       **/
      swapWellKnownNode: AugmentedSubmittable<(removeId: Bytes | string | Uint8Array, addId: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * A node can be transferred to a new owner.
       * 
       * - `node`: identifier of the node.
       * - `owner`: new owner of the node.
       **/
      transferNode: AugmentedSubmittable<(nodeId: Bytes | string | Uint8Array, owner: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, MultiAddress]>;
    };
    poolAssets: {
      /**
       * Approve an amount of asset for transfer by a delegated third-party account.
       * 
       * Origin must be Signed.
       * 
       * Ensures that `ApprovalDeposit` worth of `Currency` is reserved from signing account
       * for the purpose of holding the approval. If some non-zero amount of assets is already
       * approved from signing account to `delegate`, then it is topped up or unreserved to
       * meet the right value.
       * 
       * NOTE: The signing account does not need to own `amount` of assets at the point of
       * making this call.
       * 
       * - `id`: The identifier of the asset.
       * - `delegate`: The account to delegate permission to transfer asset.
       * - `amount`: The amount of asset that may be transferred by `delegate`. If there is
       * already an approval in place, then this acts additively.
       * 
       * Emits `ApprovedTransfer` on success.
       * 
       * Weight: `O(1)`
       **/
      approveTransfer: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, delegate: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, amount: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, Compact<u128>]>;
      /**
       * Disallow further unprivileged transfers of an asset `id` to and from an account `who`.
       * 
       * Origin must be Signed and the sender should be the Freezer of the asset `id`.
       * 
       * - `id`: The identifier of the account's asset.
       * - `who`: The account to be unblocked.
       * 
       * Emits `Blocked`.
       * 
       * Weight: `O(1)`
       **/
      block: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress]>;
      /**
       * Reduce the balance of `who` by as much as possible up to `amount` assets of `id`.
       * 
       * Origin must be Signed and the sender should be the Manager of the asset `id`.
       * 
       * Bails with `NoAccount` if the `who` is already dead.
       * 
       * - `id`: The identifier of the asset to have some amount burned.
       * - `who`: The account to be debited from.
       * - `amount`: The maximum amount by which `who`'s balance should be reduced.
       * 
       * Emits `Burned` with the actual amount burned. If this takes the balance to below the
       * minimum for the asset, then the amount burned is increased to take it to zero.
       * 
       * Weight: `O(1)`
       * Modes: Post-existence of `who`; Pre & post Zombie-status of `who`.
       **/
      burn: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, amount: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, Compact<u128>]>;
      /**
       * Cancel all of some asset approved for delegated transfer by a third-party account.
       * 
       * Origin must be Signed and there must be an approval in place between signer and
       * `delegate`.
       * 
       * Unreserves any deposit previously reserved by `approve_transfer` for the approval.
       * 
       * - `id`: The identifier of the asset.
       * - `delegate`: The account delegated permission to transfer asset.
       * 
       * Emits `ApprovalCancelled` on success.
       * 
       * Weight: `O(1)`
       **/
      cancelApproval: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, delegate: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress]>;
      /**
       * Clear the metadata for an asset.
       * 
       * Origin must be Signed and the sender should be the Owner of the asset `id`.
       * 
       * Any deposit is freed for the asset owner.
       * 
       * - `id`: The identifier of the asset to clear.
       * 
       * Emits `MetadataCleared`.
       * 
       * Weight: `O(1)`
       **/
      clearMetadata: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>]>;
      /**
       * Issue a new class of fungible assets from a public origin.
       * 
       * This new asset class has no assets initially and its owner is the origin.
       * 
       * The origin must conform to the configured `CreateOrigin` and have sufficient funds free.
       * 
       * Funds of sender are reserved by `AssetDeposit`.
       * 
       * Parameters:
       * - `id`: The identifier of the new asset. This must not be currently in use to identify
       * an existing asset. If [`NextAssetId`] is set, then this must be equal to it.
       * - `admin`: The admin of this class of assets. The admin is the initial address of each
       * member of the asset class's admin team.
       * - `min_balance`: The minimum balance of this new asset that any single account must
       * have. If an account's balance is reduced below this, then it collapses to zero.
       * 
       * Emits `Created` event when successful.
       * 
       * Weight: `O(1)`
       **/
      create: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, admin: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, minBalance: u128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, u128]>;
      /**
       * Destroy all accounts associated with a given asset.
       * 
       * `destroy_accounts` should only be called after `start_destroy` has been called, and the
       * asset is in a `Destroying` state.
       * 
       * Due to weight restrictions, this function may need to be called multiple times to fully
       * destroy all accounts. It will destroy `RemoveItemsLimit` accounts at a time.
       * 
       * - `id`: The identifier of the asset to be destroyed. This must identify an existing
       * asset.
       * 
       * Each call emits the `Event::DestroyedAccounts` event.
       **/
      destroyAccounts: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>]>;
      /**
       * Destroy all approvals associated with a given asset up to the max (T::RemoveItemsLimit).
       * 
       * `destroy_approvals` should only be called after `start_destroy` has been called, and the
       * asset is in a `Destroying` state.
       * 
       * Due to weight restrictions, this function may need to be called multiple times to fully
       * destroy all approvals. It will destroy `RemoveItemsLimit` approvals at a time.
       * 
       * - `id`: The identifier of the asset to be destroyed. This must identify an existing
       * asset.
       * 
       * Each call emits the `Event::DestroyedApprovals` event.
       **/
      destroyApprovals: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>]>;
      /**
       * Complete destroying asset and unreserve currency.
       * 
       * `finish_destroy` should only be called after `start_destroy` has been called, and the
       * asset is in a `Destroying` state. All accounts or approvals should be destroyed before
       * hand.
       * 
       * - `id`: The identifier of the asset to be destroyed. This must identify an existing
       * asset.
       * 
       * Each successful call emits the `Event::Destroyed` event.
       **/
      finishDestroy: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>]>;
      /**
       * Alter the attributes of a given asset.
       * 
       * Origin must be `ForceOrigin`.
       * 
       * - `id`: The identifier of the asset.
       * - `owner`: The new Owner of this asset.
       * - `issuer`: The new Issuer of this asset.
       * - `admin`: The new Admin of this asset.
       * - `freezer`: The new Freezer of this asset.
       * - `min_balance`: The minimum balance of this new asset that any single account must
       * have. If an account's balance is reduced below this, then it collapses to zero.
       * - `is_sufficient`: Whether a non-zero balance of this asset is deposit of sufficient
       * value to account for the state bloat associated with its balance storage. If set to
       * `true`, then non-zero balances may be stored without a `consumer` reference (and thus
       * an ED in the Balances pallet or whatever else is used to control user-account state
       * growth).
       * - `is_frozen`: Whether this asset class is frozen except for permissioned/admin
       * instructions.
       * 
       * Emits `AssetStatusChanged` with the identity of the asset.
       * 
       * Weight: `O(1)`
       **/
      forceAssetStatus: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, owner: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, issuer: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, admin: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, freezer: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, minBalance: Compact<u128> | AnyNumber | Uint8Array, isSufficient: bool | boolean | Uint8Array, isFrozen: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, MultiAddress, MultiAddress, MultiAddress, Compact<u128>, bool, bool]>;
      /**
       * Cancel all of some asset approved for delegated transfer by a third-party account.
       * 
       * Origin must be either ForceOrigin or Signed origin with the signer being the Admin
       * account of the asset `id`.
       * 
       * Unreserves any deposit previously reserved by `approve_transfer` for the approval.
       * 
       * - `id`: The identifier of the asset.
       * - `delegate`: The account delegated permission to transfer asset.
       * 
       * Emits `ApprovalCancelled` on success.
       * 
       * Weight: `O(1)`
       **/
      forceCancelApproval: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, owner: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, delegate: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, MultiAddress]>;
      /**
       * Clear the metadata for an asset.
       * 
       * Origin must be ForceOrigin.
       * 
       * Any deposit is returned.
       * 
       * - `id`: The identifier of the asset to clear.
       * 
       * Emits `MetadataCleared`.
       * 
       * Weight: `O(1)`
       **/
      forceClearMetadata: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>]>;
      /**
       * Issue a new class of fungible assets from a privileged origin.
       * 
       * This new asset class has no assets initially.
       * 
       * The origin must conform to `ForceOrigin`.
       * 
       * Unlike `create`, no funds are reserved.
       * 
       * - `id`: The identifier of the new asset. This must not be currently in use to identify
       * an existing asset. If [`NextAssetId`] is set, then this must be equal to it.
       * - `owner`: The owner of this class of assets. The owner has full superuser permissions
       * over this asset, but may later change and configure the permissions using
       * `transfer_ownership` and `set_team`.
       * - `min_balance`: The minimum balance of this new asset that any single account must
       * have. If an account's balance is reduced below this, then it collapses to zero.
       * 
       * Emits `ForceCreated` event when successful.
       * 
       * Weight: `O(1)`
       **/
      forceCreate: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, owner: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, isSufficient: bool | boolean | Uint8Array, minBalance: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, bool, Compact<u128>]>;
      /**
       * Force the metadata for an asset to some value.
       * 
       * Origin must be ForceOrigin.
       * 
       * Any deposit is left alone.
       * 
       * - `id`: The identifier of the asset to update.
       * - `name`: The user friendly name of this asset. Limited in length by `StringLimit`.
       * - `symbol`: The exchange symbol for this asset. Limited in length by `StringLimit`.
       * - `decimals`: The number of decimals this asset uses to represent one unit.
       * 
       * Emits `MetadataSet`.
       * 
       * Weight: `O(N + S)` where N and S are the length of the name and symbol respectively.
       **/
      forceSetMetadata: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, name: Bytes | string | Uint8Array, symbol: Bytes | string | Uint8Array, decimals: u8 | AnyNumber | Uint8Array, isFrozen: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, Bytes, Bytes, u8, bool]>;
      /**
       * Move some assets from one account to another.
       * 
       * Origin must be Signed and the sender should be the Admin of the asset `id`.
       * 
       * - `id`: The identifier of the asset to have some amount transferred.
       * - `source`: The account to be debited.
       * - `dest`: The account to be credited.
       * - `amount`: The amount by which the `source`'s balance of assets should be reduced and
       * `dest`'s balance increased. The amount actually transferred may be slightly greater in
       * the case that the transfer would otherwise take the `source` balance above zero but
       * below the minimum balance. Must be greater than zero.
       * 
       * Emits `Transferred` with the actual amount transferred. If this takes the source balance
       * to below the minimum for the asset, then the amount transferred is increased to take it
       * to zero.
       * 
       * Weight: `O(1)`
       * Modes: Pre-existence of `dest`; Post-existence of `source`; Account pre-existence of
       * `dest`.
       **/
      forceTransfer: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, source: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, dest: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, amount: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, MultiAddress, Compact<u128>]>;
      /**
       * Disallow further unprivileged transfers of an asset `id` from an account `who`. `who`
       * must already exist as an entry in `Account`s of the asset. If you want to freeze an
       * account that does not have an entry, use `touch_other` first.
       * 
       * Origin must be Signed and the sender should be the Freezer of the asset `id`.
       * 
       * - `id`: The identifier of the asset to be frozen.
       * - `who`: The account to be frozen.
       * 
       * Emits `Frozen`.
       * 
       * Weight: `O(1)`
       **/
      freeze: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress]>;
      /**
       * Disallow further unprivileged transfers for the asset class.
       * 
       * Origin must be Signed and the sender should be the Freezer of the asset `id`.
       * 
       * - `id`: The identifier of the asset to be frozen.
       * 
       * Emits `Frozen`.
       * 
       * Weight: `O(1)`
       **/
      freezeAsset: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>]>;
      /**
       * Mint assets of a particular class.
       * 
       * The origin must be Signed and the sender must be the Issuer of the asset `id`.
       * 
       * - `id`: The identifier of the asset to have some amount minted.
       * - `beneficiary`: The account to be credited with the minted assets.
       * - `amount`: The amount of the asset to be minted.
       * 
       * Emits `Issued` event when successful.
       * 
       * Weight: `O(1)`
       * Modes: Pre-existing balance of `beneficiary`; Account pre-existence of `beneficiary`.
       **/
      mint: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, beneficiary: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, amount: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, Compact<u128>]>;
      /**
       * Return the deposit (if any) of an asset account or a consumer reference (if any) of an
       * account.
       * 
       * The origin must be Signed.
       * 
       * - `id`: The identifier of the asset for which the caller would like the deposit
       * refunded.
       * - `allow_burn`: If `true` then assets may be destroyed in order to complete the refund.
       * 
       * Emits `Refunded` event when successful.
       **/
      refund: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, allowBurn: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, bool]>;
      /**
       * Return the deposit (if any) of a target asset account. Useful if you are the depositor.
       * 
       * The origin must be Signed and either the account owner, depositor, or asset `Admin`. In
       * order to burn a non-zero balance of the asset, the caller must be the account and should
       * use `refund`.
       * 
       * - `id`: The identifier of the asset for the account holding a deposit.
       * - `who`: The account to refund.
       * 
       * Emits `Refunded` event when successful.
       **/
      refundOther: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress]>;
      /**
       * Set the metadata for an asset.
       * 
       * Origin must be Signed and the sender should be the Owner of the asset `id`.
       * 
       * Funds of sender are reserved according to the formula:
       * `MetadataDepositBase + MetadataDepositPerByte * (name.len + symbol.len)` taking into
       * account any already reserved funds.
       * 
       * - `id`: The identifier of the asset to update.
       * - `name`: The user friendly name of this asset. Limited in length by `StringLimit`.
       * - `symbol`: The exchange symbol for this asset. Limited in length by `StringLimit`.
       * - `decimals`: The number of decimals this asset uses to represent one unit.
       * 
       * Emits `MetadataSet`.
       * 
       * Weight: `O(1)`
       **/
      setMetadata: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, name: Bytes | string | Uint8Array, symbol: Bytes | string | Uint8Array, decimals: u8 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, Bytes, Bytes, u8]>;
      /**
       * Sets the minimum balance of an asset.
       * 
       * Only works if there aren't any accounts that are holding the asset or if
       * the new value of `min_balance` is less than the old one.
       * 
       * Origin must be Signed and the sender has to be the Owner of the
       * asset `id`.
       * 
       * - `id`: The identifier of the asset.
       * - `min_balance`: The new value of `min_balance`.
       * 
       * Emits `AssetMinBalanceChanged` event when successful.
       **/
      setMinBalance: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, minBalance: u128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, u128]>;
      /**
       * Change the Issuer, Admin and Freezer of an asset.
       * 
       * Origin must be Signed and the sender should be the Owner of the asset `id`.
       * 
       * - `id`: The identifier of the asset to be frozen.
       * - `issuer`: The new Issuer of this asset.
       * - `admin`: The new Admin of this asset.
       * - `freezer`: The new Freezer of this asset.
       * 
       * Emits `TeamChanged`.
       * 
       * Weight: `O(1)`
       **/
      setTeam: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, issuer: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, admin: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, freezer: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, MultiAddress, MultiAddress]>;
      /**
       * Start the process of destroying a fungible asset class.
       * 
       * `start_destroy` is the first in a series of extrinsics that should be called, to allow
       * destruction of an asset class.
       * 
       * The origin must conform to `ForceOrigin` or must be `Signed` by the asset's `owner`.
       * 
       * - `id`: The identifier of the asset to be destroyed. This must identify an existing
       * asset.
       * 
       * The asset class must be frozen before calling `start_destroy`.
       **/
      startDestroy: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>]>;
      /**
       * Allow unprivileged transfers to and from an account again.
       * 
       * Origin must be Signed and the sender should be the Admin of the asset `id`.
       * 
       * - `id`: The identifier of the asset to be frozen.
       * - `who`: The account to be unfrozen.
       * 
       * Emits `Thawed`.
       * 
       * Weight: `O(1)`
       **/
      thaw: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress]>;
      /**
       * Allow unprivileged transfers for the asset again.
       * 
       * Origin must be Signed and the sender should be the Admin of the asset `id`.
       * 
       * - `id`: The identifier of the asset to be thawed.
       * 
       * Emits `Thawed`.
       * 
       * Weight: `O(1)`
       **/
      thawAsset: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>]>;
      /**
       * Create an asset account for non-provider assets.
       * 
       * A deposit will be taken from the signer account.
       * 
       * - `origin`: Must be Signed; the signer account must have sufficient funds for a deposit
       * to be taken.
       * - `id`: The identifier of the asset for the account to be created.
       * 
       * Emits `Touched` event when successful.
       **/
      touch: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>]>;
      /**
       * Create an asset account for `who`.
       * 
       * A deposit will be taken from the signer account.
       * 
       * - `origin`: Must be Signed by `Freezer` or `Admin` of the asset `id`; the signer account
       * must have sufficient funds for a deposit to be taken.
       * - `id`: The identifier of the asset for the account to be created.
       * - `who`: The account to be created.
       * 
       * Emits `Touched` event when successful.
       **/
      touchOther: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress]>;
      /**
       * Move some assets from the sender account to another.
       * 
       * Origin must be Signed.
       * 
       * - `id`: The identifier of the asset to have some amount transferred.
       * - `target`: The account to be credited.
       * - `amount`: The amount by which the sender's balance of assets should be reduced and
       * `target`'s balance increased. The amount actually transferred may be slightly greater in
       * the case that the transfer would otherwise take the sender balance above zero but below
       * the minimum balance. Must be greater than zero.
       * 
       * Emits `Transferred` with the actual amount transferred. If this takes the source balance
       * to below the minimum for the asset, then the amount transferred is increased to take it
       * to zero.
       * 
       * Weight: `O(1)`
       * Modes: Pre-existence of `target`; Post-existence of sender; Account pre-existence of
       * `target`.
       **/
      transfer: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, target: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, amount: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, Compact<u128>]>;
      /**
       * Transfer some asset balance from a previously delegated account to some third-party
       * account.
       * 
       * Origin must be Signed and there must be an approval in place by the `owner` to the
       * signer.
       * 
       * If the entire amount approved for transfer is transferred, then any deposit previously
       * reserved by `approve_transfer` is unreserved.
       * 
       * - `id`: The identifier of the asset.
       * - `owner`: The account which previously approved for a transfer of at least `amount` and
       * from which the asset balance will be withdrawn.
       * - `destination`: The account to which the asset balance of `amount` will be transferred.
       * - `amount`: The amount of assets to transfer.
       * 
       * Emits `TransferredApproved` on success.
       * 
       * Weight: `O(1)`
       **/
      transferApproved: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, owner: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, destination: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, amount: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, MultiAddress, Compact<u128>]>;
      /**
       * Move some assets from the sender account to another, keeping the sender account alive.
       * 
       * Origin must be Signed.
       * 
       * - `id`: The identifier of the asset to have some amount transferred.
       * - `target`: The account to be credited.
       * - `amount`: The amount by which the sender's balance of assets should be reduced and
       * `target`'s balance increased. The amount actually transferred may be slightly greater in
       * the case that the transfer would otherwise take the sender balance above zero but below
       * the minimum balance. Must be greater than zero.
       * 
       * Emits `Transferred` with the actual amount transferred. If this takes the source balance
       * to below the minimum for the asset, then the amount transferred is increased to take it
       * to zero.
       * 
       * Weight: `O(1)`
       * Modes: Pre-existence of `target`; Post-existence of sender; Account pre-existence of
       * `target`.
       **/
      transferKeepAlive: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, target: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, amount: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress, Compact<u128>]>;
      /**
       * Change the Owner of an asset.
       * 
       * Origin must be Signed and the sender should be the Owner of the asset `id`.
       * 
       * - `id`: The identifier of the asset.
       * - `owner`: The new Owner of this asset.
       * 
       * Emits `OwnerChanged`.
       * 
       * Weight: `O(1)`
       **/
      transferOwnership: AugmentedSubmittable<(id: Compact<u32> | AnyNumber | Uint8Array, owner: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, MultiAddress]>;
    };
    preimage: {
      /**
       * Ensure that the a bulk of pre-images is upgraded.
       * 
       * The caller pays no fee if at least 90% of pre-images were successfully updated.
       **/
      ensureUpdated: AugmentedSubmittable<(hashes: Vec<H256> | (H256 | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>, [Vec<H256>]>;
      /**
       * Register a preimage on-chain.
       * 
       * If the preimage was previously requested, no fees or deposits are taken for providing
       * the preimage. Otherwise, a deposit is taken proportional to the size of the preimage.
       **/
      notePreimage: AugmentedSubmittable<(bytes: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Request a preimage be uploaded to the chain without paying any fees or deposits.
       * 
       * If the preimage requests has already been provided on-chain, we unreserve any deposit
       * a user may have paid, and take the control of the preimage out of their hands.
       **/
      requestPreimage: AugmentedSubmittable<(hash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256]>;
      /**
       * Clear an unrequested preimage from the runtime storage.
       * 
       * If `len` is provided, then it will be a much cheaper operation.
       * 
       * - `hash`: The hash of the preimage to be removed from the store.
       * - `len`: The length of the preimage of `hash`.
       **/
      unnotePreimage: AugmentedSubmittable<(hash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256]>;
      /**
       * Clear a previously made request for a preimage.
       * 
       * NOTE: THIS MUST NOT BE CALLED ON `hash` MORE TIMES THAN `request_preimage`.
       **/
      unrequestPreimage: AugmentedSubmittable<(hash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256]>;
    };
    registries: {
      /**
       * Adds an administrative delegate to a registry.
       * 
       * This function grants the `ADMIN` permission to a specified delegate,
       * allowing the delegate to manage other delegates and modify registry
       * configurations. Only existing registry administrators can invoke this
       * function to add another admin delegate.
       * 
       * The function ensures that the caller has sufficient administrative
       * privileges in the registry and that the `registry_id` matches the
       * authorization. If the checks pass, the delegate is added with `ADMIN`
       * permissions using the internal `registry_delegate_addition` function.
       * 
       * # Parameters
       * - `origin`: The origin of the call, which must be signed by an existing administrator of
       * the registry.
       * - `registry_id`: The unique identifier of the registry to which the admin delegate is
       * being added.
       * - `delegate`: The account identifier of the delegate being granted admin permissions.
       * - `authorization`: The authorization ID used to validate the caller's permission to add
       * an admin delegate to the specified registry.
       * 
       * # Returns
       * Returns `Ok(())` if the admin delegate is successfully added, or an `Err`
       * if the operation fails, such as when the caller lacks the necessary
       * permissions or if there's an internal error during delegate addition.
       * 
       * # Errors
       * - `UnauthorizedOperation`: If the caller does not have admin permissions in the
       * registry.
       * - Propagates errors from `registry_delegate_addition` if delegate addition fails.
       **/
      addAdminDelegate: AugmentedSubmittable<(registryId: Bytes | string | Uint8Array, delegate: AccountId32 | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, AccountId32, Bytes]>;
      /**
       * Adds a delegate with permission to assert new entries to a registry.
       * 
       * The `ASSERT` permission enables a delegate to add and sign new entries
       * within the specified registry. This function is used to grant this
       * permission to a delegate, provided that the caller has sufficient
       * authorization, typically as an admin of the registry.
       * 
       * The function checks that the caller is authorized (as an admin) to add
       * a delegate with `ASSERT` permissions to the registry. If the caller's
       * authorization is verified, the delegate is added using the internal
       * `registry_delegate_addition` function.
       * 
       * # Parameters
       * - `origin`: The origin of the call, which must be signed by an admin of the registry.
       * - `registry_id`: The unique identifier of the registry to which the delegate is being
       * added.
       * - `delegate`: The account identifier of the delegate being granted the `ASSERT`
       * permission.
       * - `authorization`: The authorization ID used to validate the caller's permission to add
       * a delegate.
       * 
       * # Returns
       * Returns `Ok(())` if the delegate is successfully added with `ASSERT`
       * permissions, or an `Err` if the operation fails due to authorization issues
       * or internal errors during delegate addition.
       * 
       * # Errors
       * - `UnauthorizedOperation`: If the caller does not have the necessary admin permissions
       * for the registry.
       * - Propagates errors from `registry_delegate_addition` if the addition fails.
       **/
      addDelegate: AugmentedSubmittable<(registryId: Bytes | string | Uint8Array, delegate: AccountId32 | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, AccountId32, Bytes]>;
      /**
       * Adds an audit delegate to a registry.
       * 
       * The `AUDIT` permission allows the delegate to perform oversight and
       * compliance checks within the registry. This function is used to grant
       * these audit privileges to a delegate. It checks that the caller has the
       * necessary administrative rights to add an audit delegate to the registry.
       * 
       * If the caller is authorized, the delegate is added with the `AUDIT`
       * permission using the internal `registry_delegate_addition` function.
       * 
       * # Parameters
       * - `origin`: The origin of the call, which must be signed by an existing administrator of
       * the registry.
       * - `registry_id`: The unique identifier of the registry to which the audit delegate is
       * being added.
       * - `delegate`: The account identifier of the delegate being granted audit permissions.
       * - `authorization`: The authorization ID used to validate the caller's permission to add
       * the audit delegate.
       * 
       * # Returns
       * Returns `Ok(())` if the audit delegate is successfully added, or an `Err`
       * if the operation fails due to authorization issues or internal errors
       * during delegate addition.
       * 
       * # Errors
       * - `UnauthorizedOperation`: If the caller does not have the necessary admin permissions
       * for the registry.
       * - Propagates errors from `registry_delegate_addition` if delegate addition fails.
       **/
      addDelegator: AugmentedSubmittable<(registryId: Bytes | string | Uint8Array, delegate: AccountId32 | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, AccountId32, Bytes]>;
      /**
       * Archives a registry, marking it as inactive.
       * 
       * This function allows the creator or an admin with the appropriate authority
       * to archive an existing registry. It checks that the registry exists, is not already
       * archived, and ensures that the caller has the necessary authorization to perform the
       * archival.
       * 
       * # Parameters
       * - `origin`: The origin of the transaction, which must be signed by the creator or an
       * admin with the appropriate authority.
       * - `registry_id`: The identifier of the registry to be archived.
       * - `authorization`: An identifier for the authorization being used to validate the
       * archival.
       * 
       * # Returns
       * - `DispatchResult`: Returns `Ok(())` if the registry is successfully archived, or an
       * error (`DispatchError`) if:
       * - The registry does not exist.
       * - The registry is already archived.
       * - The caller does not have the authority to archive the registry.
       * 
       * # Errors
       * - `RegistryNotFound`: If the specified registry ID does not correspond to an existing
       * registry.
       * - `RegistryAlreadyArchived`: If the registry is already archived.
       * - `UnauthorizedOperation`: If the caller is not authorized to archive the registry.
       * 
       * # Events
       * - `Archive`: Emitted when a registry is successfully archived. It includes the registry
       * ID and the authority who performed the archival.
       **/
      archive: AugmentedSubmittable<(registryId: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * Creates a new registry with a unique identifier based on the provided
       * registry digest and the creator's identity.
       * 
       * This function generates a unique identifier for the registry by hashing
       * the encoded digest of the registry and the creator's identifier. It ensures that the
       * generated registry identifier is not already in use. An authorization
       * ID is also created for the new registry, which is used to manage
       * delegations. The creator is automatically added as a delegate with
       * full permissions.
       * 
       * # Parameters
       * - `origin`: The origin of the transaction, signed by the creator.
       * - `registry_id`: A unique code created to identify the registry.
       * - `digest`: The digest representing the registry data to be created.
       * - `blob`: Optional metadata or data associated with the registry.
       * 
       * # Returns
       * - `DispatchResult`: Returns `Ok(())` if the registry is successfully created, or an
       * error (`DispatchError`) if:
       * - The generated registry identifier is already in use.
       * - The generated authorization ID has an invalid length.
       * - The registry exceeds the allowed delegate limit.
       * 
       * # Errors
       * - `InvalidIdentifierLength`: If the generated identifiers for the registry or
       * authorization have invalid lengths.
       * - `RegistryAlreadyAnchored`: If the registry identifier already exists.
       * - `RegistryDelegatesLimitExceeded`: If the registry exceeds the maximum number of
       * allowed delegates.
       * 
       * # Events
       * - `Create`: Emitted when a new registry is successfully created. It includes the
       * registry identifier, the creator's identifier, and the authorization ID.
       **/
      create: AugmentedSubmittable<(registryId: Bytes | string | Uint8Array, digest: H256 | string | Uint8Array, schemaId: Option<Bytes> | null | Uint8Array | Bytes | string, blob: Option<Bytes> | null | Uint8Array | Bytes | string) => SubmittableExtrinsic<ApiType>, [Bytes, H256, Option<Bytes>, Option<Bytes>]>;
      /**
       * Reinstates a revoked registry, making it active again.
       * 
       * This function changes the status of a previously revoked registry to active
       * based on the provided registry ID. It checks that the registry exists, is
       * currently revoked, and ensures that the caller has the authority to reinstate
       * the registry as indicated by the provided authorization ID.
       * 
       * # Parameters
       * - `origin`: The origin of the transaction, which must be signed by the creator or an
       * admin with the appropriate authority.
       * - `registry_id`: The identifier of the registry to be reinstated.
       * - `authorization`: An identifier for the authorization being used to validate the
       * reinstatement.
       * 
       * # Returns
       * - `DispatchResult`: Returns `Ok(())` if the registry is successfully reinstated, or an
       * error (`DispatchError`) if:
       * - The registry does not exist.
       * - The registry is not revoked.
       * - The caller does not have the authority to reinstate the registry.
       * 
       * # Errors
       * - `RegistryNotFound`: If the specified registry ID does not correspond to an existing
       * registry.
       * - `RegistryNotRevoked`: If the registry is not currently revoked.
       * - `UnauthorizedOperation`: If the caller is not authorized to reinstate the registry.
       * 
       * # Events
       * - `Reinstate`: Emitted when a registry is successfully reinstated. It includes the
       * registry ID and the authority who performed the reinstatement.
       **/
      reinstate: AugmentedSubmittable<(registryId: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * Removes a delegate from a specified registry.
       * 
       * This function removes an existing delegate from a registry, identified
       * by the `registry_id` and the delegate's `remove_authorization` ID.
       * It ensures that the registry exists, is not archived or revoked, and that
       * the provided authorization corresponds to a delegate in the registry.
       * Additionally, it verifies that the caller has the authority (admin rights)
       * to remove the delegate.
       * 
       * # Parameters
       * - `origin`: The origin of the call, which must be signed by an admin of the registry.
       * - `registry_id`: The unique identifier of the registry from which the delegate is being
       * removed.
       * - `remove_authorization`: The authorization ID of the delegate to be removed.
       * - `authorization`: The authorization ID validating the caller’s permission to perform
       * the removal.
       * 
       * # Returns
       * - `DispatchResult`: Returns `Ok(())` if the delegate was successfully removed, or an
       * error (`DispatchError`) if any of the checks fail.
       * 
       * # Errors
       * - `AuthorizationNotFound`: If the provided `remove_authorization` does not exist.
       * - `UnauthorizedOperation`: If the origin is not authorized to remove a delegate from the
       * registry.
       * - `RegistryNotFound`: If the specified `registry_id` does not correspond to an existing
       * registry.
       * - `RegistryArchived`: If the registry is archived and no longer active.
       * - `RegistryRevoked`: If the registry has been revoked.
       * - `DelegateNotFound`: If the delegate specified by `remove_authorization` is not found
       * in the registry.
       * 
       * # Events
       * - `Deauthorization`: Emitted when a delegate is successfully removed from the registry.
       * The event includes the registry ID and the authorization ID of the removed delegate.
       **/
      removeDelegate: AugmentedSubmittable<(registryId: Bytes | string | Uint8Array, removeAuthorization: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes, Bytes]>;
      /**
       * Restores an archived registry, making it active again.
       * 
       * This function allows the creator or an admin with the appropriate authority
       * to restore an archived registry. It checks that the registry exists, is currently
       * archived, and ensures that the caller has the necessary authorization to perform the
       * restoration.
       * 
       * # Parameters
       * - `origin`: The origin of the transaction, which must be signed by the creator or an
       * admin with the appropriate authority.
       * - `registry_id`: The identifier of the registry to be restored.
       * - `authorization`: An identifier for the authorization being used to validate the
       * restoration.
       * 
       * # Returns
       * - `DispatchResult`: Returns `Ok(())` if the registry is successfully restored, or an
       * error (`DispatchError`) if:
       * - The registry does not exist.
       * - The registry is not archived.
       * - The caller does not have the authority to restore the registry.
       * 
       * # Errors
       * - `RegistryNotFound`: If the specified registry ID does not correspond to an existing
       * registry.
       * - `RegistryNotArchived`: If the registry is not currently archived.
       * - `UnauthorizedOperation`: If the caller is not authorized to restore the registry.
       * 
       * # Events
       * - `Restore`: Emitted when a registry is successfully restored. It includes the registry
       * ID and the authority who performed the restoration.
       **/
      restore: AugmentedSubmittable<(registryId: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * Revokes a registry, marking it as no longer active.
       * 
       * This function marks a registry as revoked based on the provided registry
       * ID. It checks that the registry exists, is not already revoked, and
       * ensures that the caller has the authority to revoke the registry, as
       * indicated by the provided authorization ID.
       * 
       * # Parameters
       * - `origin`: The origin of the transaction, which must be signed by the creator or an
       * admin with the appropriate authority.
       * - `registry_id`: The identifier of the registry to be revoked.
       * - `authorization`: An identifier for the authorization being used to validate the
       * revocation.
       * 
       * # Returns
       * - `DispatchResult`: Returns `Ok(())` if the registry is successfully revoked, or an
       * error (`DispatchError`) if:
       * - The registry does not exist.
       * - The registry is already revoked.
       * - The caller does not have the authority to revoke the registry.
       * 
       * # Errors
       * - `RegistryNotFound`: If the specified registry ID does not correspond to an existing
       * registry.
       * - `RegistryAlreadyRevoked`: If the registry has already been revoked.
       * - `UnauthorizedOperation`: If the caller is not authorized to revoke the registry.
       * 
       * # Events
       * - `Revoke`: Emitted when a registry is successfully revoked. It includes the registry ID
       * and the authority who performed the revocation.
       **/
      revoke: AugmentedSubmittable<(registryId: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * Updates the digest and optional blob of a registry.
       * 
       * This function allows the creator or an admin with the appropriate authority
       * to update the digest and optionally the blob of an existing registry. It checks
       * that the registry exists, ensures that the caller has the necessary authorization,
       * and updates the registry with the new digest and blob (if provided).
       * 
       * # Parameters
       * - `origin`: The origin of the transaction, which must be signed by the creator or an
       * admin with the appropriate authority.
       * - `registry_id`: The identifier of the registry to be updated.
       * - `digest`: The new digest (hash) to be assigned to the registry.
       * - `blob`: An optional new blob (data) to be assigned to the registry. If `None`, the
       * existing blob remains unchanged.
       * - `authorization`: An identifier for the authorization being used to validate the
       * update.
       * 
       * # Returns
       * - `DispatchResult`: Returns `Ok(())` if the registry is successfully updated, or an
       * error (`DispatchError`) if:
       * - The registry does not exist.
       * - The caller does not have the authority to update the registry.
       * 
       * # Errors
       * - `RegistryNotFound`: If the specified registry ID does not correspond to an existing
       * registry.
       * - `UnauthorizedOperation`: If the caller is not authorized to update the registry.
       * 
       * # Events
       * - `Update`: Emitted when a registry is successfully updated. It includes the registry
       * ID, the updater, and the authorization used.
       **/
      update: AugmentedSubmittable<(registryId: Bytes | string | Uint8Array, digest: H256 | string | Uint8Array, blob: Option<Bytes> | null | Uint8Array | Bytes | string, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, H256, Option<Bytes>, Bytes]>;
    };
    remark: {
      /**
       * Index and store data off chain.
       **/
      store: AugmentedSubmittable<(remark: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
    };
    rootTesting: {
      /**
       * A dispatch that will fill the block weight up to the given ratio.
       **/
      fillBlock: AugmentedSubmittable<(ratio: Perbill | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Perbill]>;
      triggerDefensive: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
    };
    runtimeUpgrade: {
      setCode: AugmentedSubmittable<(code: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
    };
    scheduler: {
      /**
       * Cancel an anonymously scheduled task.
       **/
      cancel: AugmentedSubmittable<(when: u32 | AnyNumber | Uint8Array, index: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32, u32]>;
      /**
       * Cancel a named scheduled task.
       **/
      cancelNamed: AugmentedSubmittable<(id: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed]>;
      /**
       * Removes the retry configuration of a task.
       **/
      cancelRetry: AugmentedSubmittable<(task: ITuple<[u32, u32]> | [u32 | AnyNumber | Uint8Array, u32 | AnyNumber | Uint8Array]) => SubmittableExtrinsic<ApiType>, [ITuple<[u32, u32]>]>;
      /**
       * Cancel the retry configuration of a named task.
       **/
      cancelRetryNamed: AugmentedSubmittable<(id: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed]>;
      /**
       * Anonymously schedule a task.
       **/
      schedule: AugmentedSubmittable<(when: u32 | AnyNumber | Uint8Array, maybePeriodic: Option<ITuple<[u32, u32]>> | null | Uint8Array | ITuple<[u32, u32]> | [u32 | AnyNumber | Uint8Array, u32 | AnyNumber | Uint8Array], priority: u8 | AnyNumber | Uint8Array, call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32, Option<ITuple<[u32, u32]>>, u8, Call]>;
      /**
       * Anonymously schedule a task after a delay.
       **/
      scheduleAfter: AugmentedSubmittable<(after: u32 | AnyNumber | Uint8Array, maybePeriodic: Option<ITuple<[u32, u32]>> | null | Uint8Array | ITuple<[u32, u32]> | [u32 | AnyNumber | Uint8Array, u32 | AnyNumber | Uint8Array], priority: u8 | AnyNumber | Uint8Array, call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32, Option<ITuple<[u32, u32]>>, u8, Call]>;
      /**
       * Schedule a named task.
       **/
      scheduleNamed: AugmentedSubmittable<(id: U8aFixed | string | Uint8Array, when: u32 | AnyNumber | Uint8Array, maybePeriodic: Option<ITuple<[u32, u32]>> | null | Uint8Array | ITuple<[u32, u32]> | [u32 | AnyNumber | Uint8Array, u32 | AnyNumber | Uint8Array], priority: u8 | AnyNumber | Uint8Array, call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed, u32, Option<ITuple<[u32, u32]>>, u8, Call]>;
      /**
       * Schedule a named task after a delay.
       **/
      scheduleNamedAfter: AugmentedSubmittable<(id: U8aFixed | string | Uint8Array, after: u32 | AnyNumber | Uint8Array, maybePeriodic: Option<ITuple<[u32, u32]>> | null | Uint8Array | ITuple<[u32, u32]> | [u32 | AnyNumber | Uint8Array, u32 | AnyNumber | Uint8Array], priority: u8 | AnyNumber | Uint8Array, call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed, u32, Option<ITuple<[u32, u32]>>, u8, Call]>;
      /**
       * Set a retry configuration for a task so that, in case its scheduled run fails, it will
       * be retried after `period` blocks, for a total amount of `retries` retries or until it
       * succeeds.
       * 
       * Tasks which need to be scheduled for a retry are still subject to weight metering and
       * agenda space, same as a regular task. If a periodic task fails, it will be scheduled
       * normally while the task is retrying.
       * 
       * Tasks scheduled as a result of a retry for a periodic task are unnamed, non-periodic
       * clones of the original task. Their retry configuration will be derived from the
       * original task's configuration, but will have a lower value for `remaining` than the
       * original `total_retries`.
       **/
      setRetry: AugmentedSubmittable<(task: ITuple<[u32, u32]> | [u32 | AnyNumber | Uint8Array, u32 | AnyNumber | Uint8Array], retries: u8 | AnyNumber | Uint8Array, period: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [ITuple<[u32, u32]>, u8, u32]>;
      /**
       * Set a retry configuration for a named task so that, in case its scheduled run fails, it
       * will be retried after `period` blocks, for a total amount of `retries` retries or until
       * it succeeds.
       * 
       * Tasks which need to be scheduled for a retry are still subject to weight metering and
       * agenda space, same as a regular task. If a periodic task fails, it will be scheduled
       * normally while the task is retrying.
       * 
       * Tasks scheduled as a result of a retry for a periodic task are unnamed, non-periodic
       * clones of the original task. Their retry configuration will be derived from the
       * original task's configuration, but will have a lower value for `remaining` than the
       * original `total_retries`.
       **/
      setRetryNamed: AugmentedSubmittable<(id: U8aFixed | string | Uint8Array, retries: u8 | AnyNumber | Uint8Array, period: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed, u8, u32]>;
    };
    schema: {
      /**
       * Create a new schema and associates with its identifier.
       * `create` takes a `InputSchemaOf<T>` and returns a `DispatchResult`
       * 
       * Arguments:
       * 
       * * `origin`: The origin of the transaction.
       * * `tx_schema`: The schema that is being anchored.
       * 
       * Returns:
       * 
       * DispatchResult
       **/
      create: AugmentedSubmittable<(txSchema: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
    };
    session: {
      /**
       * Removes any session key(s) of the function caller.
       * 
       * This doesn't take effect until the next session.
       * 
       * The dispatch origin of this function must be Signed and the account must be either be
       * convertible to a validator ID using the chain's typical addressing system (this usually
       * means being a controller account) or directly convertible into a validator ID (which
       * usually means being a stash account).
       * 
       * ## Complexity
       * - `O(1)` in number of key types. Actual cost depends on the number of length of
       * `T::Keys::key_ids()` which is fixed.
       **/
      purgeKeys: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Sets the session key(s) of the function caller to `keys`.
       * Allows an account to set its session key prior to becoming a validator.
       * This doesn't take effect until the next session.
       * 
       * The dispatch origin of this function must be signed.
       * 
       * ## Complexity
       * - `O(1)`. Actual cost depends on the number of length of `T::Keys::key_ids()` which is
       * fixed.
       **/
      setKeys: AugmentedSubmittable<(keys: CordLoomRuntimeSessionKeys | { grandpa?: any; babe?: any; imOnline?: any; authorityDiscovery?: any } | string | Uint8Array, proof: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [CordLoomRuntimeSessionKeys, Bytes]>;
    };
    statement: {
      /**
       * Adds a presentation to a specified statement.
       * 
       * This privileged function is reserved for execution by the council or
       * root origin only. It allows the removal of a presentation associated
       * with a given  `statement_id`. The function performs authorization
       * checks based on the provided `authorization` parameter, ensuring
       * that the operation is performed within the correct chain space.
       * 
       * # Parameters
       * - `origin`: The transaction's origin, restricted to council or root.
       * - `statement_id`: The identifier of the statement to which the presentation will be
       * added.
       * - `presentation_digest`: The digest that uniquely identifies the new presentation.
       * - `presentation_type`: The type categorization of the presentation.
       * - `authorization`: The authorization identifier for the creator, required to perform the
       * addition.
       * 
       * # Errors
       * - Returns `StatementNotFound` if the `statement_id` does not correspond to any existing
       * statement.
       * - Returns `StatementRevoked` if the statement associated with the `statement_id` has
       * been revoked.
       * - Returns `UnauthorizedOperation` if the operation is not authorized within the
       * associated space.
       * - Returns `PresentationDigestAlreadyAnchored` if the `presentation_digest` is not
       * unique.
       * 
       * # Events
       * - Emits `PresentationAdded` upon the successful addition of the presentation.
       **/
      addPresentation: AugmentedSubmittable<(statementId: Bytes | string | Uint8Array, presentationDigest: H256 | string | Uint8Array, presentationType: PalletStatementPresentationTypeOf | 'Other' | 'PDF' | 'JPEG' | 'PNG' | 'GIF' | 'TXT' | 'SVG' | 'JSON' | 'DOCX' | 'XLSX' | 'PPTX' | 'MP3' | 'MP4' | 'XML' | number | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, H256, PalletStatementPresentationTypeOf, Bytes]>;
      /**
       * Creates a new statement within a specified space subject to
       * authorization and capacity constraints.
       * 
       * The function first ensures that the call's origin is authorized and
       * retrieves the subject, referred to as the creator. It then verifies
       * that the creator is a delegate for the space associated with the
       * given authorization. Following this, it checks that the space has
       * not exceeded its allowed number of statements.
       * 
       * A unique identifier for the statement is generated by hashing the
       * encoded statement digest, space identifier, and creator identifier.
       * The function ensures that this identifier has not been used to
       * anchor another statement.
       * 
       * Once the identifier is confirmed to be unique, the statement details
       * are inserted into the `Statements` storage. Additionally, the
       * statement entry and identifier lookup are recorded in their
       * respective storages. The space's usage count is incremented to
       * reflect the addition of the new statement.
       * 
       * The function also logs the creation event by updating the activity
       * log and emits an event to signal the successful creation of the
       * statement.
       * 
       * # Parameters
       * - `origin`: The origin of the dispatch call, which should be a signed message from the
       * creator.
       * - `digest`: The digest of the statement, serving as a unique identifier.
       * - `authorization`: The authorization ID, verifying the creator's delegation status.
       * - `schema_id`: An optional schema identifier to be associated with the statement.
       * 
       * # Returns
       * A `DispatchResult` indicating the success or failure of the
       * statement creation. On success, it returns `Ok(())`. On failure, it
       * provides an error detailing the cause.
       * 
       * # Errors
       * The function can fail for several reasons including unauthorized
       * origin, the creator not being a delegate, space capacity being
       * exceeded, invalid statement identifier, or the statement already
       * being anchored. Errors related to incrementing space usage or
       * updating the activity log may also occur.
       * 
       * # Events
       * - `Create`: Emitted when a statement is successfully created, containing the
       * `identifier`, `digest`, and `author` (creator).
       **/
      register: AugmentedSubmittable<(digest: H256 | string | Uint8Array, authorization: Bytes | string | Uint8Array, schemaId: Option<Bytes> | null | Uint8Array | Bytes | string) => SubmittableExtrinsic<ApiType>, [H256, Bytes, Option<Bytes>]>;
      /**
       * Creates multiple statements in a batch operation. This function
       * takes a vector of statement digests and attempts to create a new
       * statement for each digest. It performs checks on the batch size,
       * ensures the creator has the proper authorization, and verifies that
       * the space has enough capacity to accommodate the batch of new
       * statements.
       * 
       * The function iterates over the provided digests, generating a unique
       * identifier for each and attempting to create a new statement. If a
       * statement with the generated identifier already exists, or if there
       * is an error in generating the identifier, the digest is marked as
       * failed. Otherwise, the new statement is recorded along
       * with its details. The function also updates the activity log for
       * each successful creation.
       * 
       * After processing all digests, the function ensures that at least one
       * statement was successfully created. It then increments the usage
       * count of the space by the number of successful creations. Finally, a
       * `BatchCreate` event is emitted, summarizing the results of the batch
       * operation, including the number of successful and failed creations,
       * the indices of the failed digests, and the author of the batch
       * creation.
       * 
       * # Parameters
       * - `origin`: The origin of the dispatch call, which should be a signed message from the
       * creator.
       * - `digests`: A vector of statement digests to be processed in the batch operation.
       * - `authorization`: The authorization ID, verifying the creator's delegation status.
       * - `schema_id`: An optional schema identifier that may be associated with the statements.
       * 
       * # Returns
       * A `DispatchResult` indicating the success or failure of the batch
       * creation. On success, it returns `Ok(())`. On failure, it provides
       * an error detailing the cause, such as exceeding the maximum number
       * of digests, the space capacity being exceeded, or all digests
       * failing to create statements.
       * 
       * # Errors
       * The function can fail for several reasons, including exceeding the
       * maximum number of digests allowed in a batch, the space capacity
       * being exceeded, or if no statements could be successfully created.
       * 
       * # Events
       * - `BatchCreate`: Emitted upon the completion of the batch operation, providing details
       * of the outcome.
       **/
      registerBatch: AugmentedSubmittable<(digests: Vec<H256> | (H256 | string | Uint8Array)[], authorization: Bytes | string | Uint8Array, schemaId: Option<Bytes> | null | Uint8Array | Bytes | string) => SubmittableExtrinsic<ApiType>, [Vec<H256>, Bytes, Option<Bytes>]>;
      /**
       * Removes a statement and its associated entries from the system. The
       * removal can be either complete or partial, depending on the number
       * of entries associated with the statement and a predefined maximum
       * removal limit.
       * 
       * The function begins by authenticating the origin of the call to
       * identify the updater. It then retrieves the statement details using
       * the provided `statement_id`. If the statement cannot be found, the
       * function fails with an error. An early authorization check is
       * performed to ensure that the updater has the proper delegation
       * status for the space associated with the statement.
       * 
       * The function counts the number of entries linked to the statement
       * and compares this to the maximum number of entries that can be
       * removed in a single operation, as specified by `MaxRemoveEntries`.
       * If the count is less than or equal to the maximum, a complete
       * removal is initiated; otherwise, a partial removal is performed.
       * 
       * In a complete removal, all entries and their lookups are removed,
       * the statement is deleted, and the space usage is decremented
       * accordingly. In a partial removal, only up to the maximum number of
       * entries are removed, and the space usage is decremented by the
       * number of entries actually removed.
       * 
       * After the removal process, the function updates the activity log to
       * record the event. It then emits either a `Removed` event for a
       * complete removal or a `PartialRemoval` event for a partial removal,
       * providing details of the operation including the statement
       * identifier and the updater's information.
       * 
       * # Parameters
       * - `origin`: The origin of the dispatch call, which should be a signed message from the
       * updater.
       * - `statement_id`: The identifier of the statement to be removed.
       * - `authorization`: The authorization ID, verifying the updater's delegation status.
       * 
       * # Returns
       * A `DispatchResult` indicating the success or failure of the removal.
       * On success, it returns `Ok(())`. On failure, it provides an error
       * detailing the cause, such as the statement not being found or the
       * updater not having the authority to perform the removal.
       * 
       * # Errors
       * The function can fail for several reasons including the statement
       * not being found or the updater lacking the authority to perform the
       * removal.
       * 
       * # Events
       * - `Removed`: Emitted when a statement and all its entries are completely removed.
       * - `PartialRemoval`: Emitted when only a portion of the entries are removed, detailing
       * the number of entries
       * removed.
       **/
      remove: AugmentedSubmittable<(statementId: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * Removes a presentation from a specified statement state.
       * 
       * This privileged function is reserved for execution by the council or
       * root origin only. It allows the removal of a presentation associated
       * with the `statement_id` and identified by `presentation_digest`. The
       * function validates the `authorization` of the caller within the
       * specified chain space before proceeding with the removal.
       * 
       * # Parameters
       * - `origin`: The transaction's origin, restricted to council or root.
       * - `statement_id`: The identifier of the statement associated with the presentation.
       * - `presentation_digest`: The digest that uniquely identifies the presentation to be
       * removed.
       * - `authorization`: The authorization identifier that the remover must have to perform
       * the removal.
       * 
       * # Errors
       * - Returns `PresentationNotFound` if the specified presentation does not exist.
       * - Returns `UnauthorizedOperation` if the origin is not authorized to perform this
       * action.
       * 
       * # Events
       * - Emits `PresentationRemoved` upon the successful removal of the presentation.
       **/
      removePresentation: AugmentedSubmittable<(statementId: Bytes | string | Uint8Array, presentationDigest: H256 | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, H256, Bytes]>;
      /**
       * Restores a previously revoked statement, re-enabling its validity
       * within the system. The restoration is contingent upon a set of
       * checks to ensure that the action is permitted and appropriate.
       * 
       * The function commences by authenticating the origin of the call to
       * ascertain the identity of the updater attempting the restoration. It
       * then fetches the details of the statement using the `statement_id`
       * provided. If the statement does not exist, the function aborts and
       * signals an error.
       * 
       * A crucial step in the process is to verify that the statement has
       * indeed been revoked; if not, the function ceases further execution.
       * Assuming the statement is revoked, the function then ascertains
       * whether the updater is either the original creator of the statement
       * or a delegate with the requisite authorization. If the updater
       * is not the creator, their delegation status for the space linked to
       * the statement is verified.
       * 
       * Upon confirming the updater's authority to restore the statement,
       * the function removes the statement from the `RevocationList`,
       * effectively reactivating it. It then logs the restoration event in
       * the activity log. To finalize the process, a `Restored` event is
       * broadcast, indicating the successful restoration of the statement
       * with its identifier and the updater's details.
       * 
       * # Parameters
       * - `origin`: The origin of the dispatch call, which should be a signed message from the
       * updater.
       * - `statement_id`: The identifier of the statement to be restored.
       * - `authorization`: The authorization ID, verifying the updater's delegation status if
       * they are not the creator.
       * 
       * # Returns
       * A `DispatchResult` indicating the success or failure of the
       * restoration. On success, it returns `Ok(())`. On failure, it
       * provides an error detailing the cause, such as the statement not
       * being found, not being revoked, or the updater not having the
       * authority to restore the statement.
       * 
       * # Errors
       * The function can fail for several reasons including the statement
       * not being found, not being revoked, or the updater lacking the
       * authority to perform the restoration.
       * 
       * # Events
       * - `Restored`: Emitted when a statement is successfully restored, containing the
       * `identifier` of the statement
       * and the `author` who is the updater.
       **/
      restore: AugmentedSubmittable<(statementId: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * Revokes an existing statement, rendering it invalid for future
       * operations. The revocation process involves several authorization
       * and state checks to ensure the integrity of the operation.
       * 
       * Initially, the function authenticates the origin of the call to
       * identify the updater, who is attempting the revocation. It then
       * retrieves the details of the statement using the provided
       * `statement_id`. If the statement is not found, the function fails
       * with an error.
       * 
       * Before proceeding, the function checks whether the statement has
       * already been revoked. If it has, the function terminates early to
       * prevent redundant revocation attempts. If the statement is active,
       * the function then determines whether the updater is the original
       * creator of the statement or a delegate with proper authorization. If
       * the updater is not the creator, they must be a delegate with
       * authorization for the space associated with the statement, and the
       * function checks for this condition.
       * 
       * Once the updater's authority to revoke the statement is confirmed,
       * the function marks the statement as revoked in the `RevocationList`.
       * It updates the activity log to record the revocation event. Finally,
       * it emits a `Revoked` event, indicating the successful revocation of
       * the statement with the statement identifier and the
       * updater's information.
       * 
       * # Parameters
       * - `origin`: The origin of the dispatch call, which should be a signed message from the
       * updater.
       * - `statement_id`: The identifier of the statement to be revoked.
       * - `authorization`: The authorization ID, verifying the updater's delegation status if
       * they are not the creator.
       * 
       * # Returns
       * A `DispatchResult` indicating the success or failure of the
       * revocation. On success, it returns `Ok(())`. On failure, it provides
       * an error detailing the cause, such as the statement not being found
       * or already being revoked, or the updater not having the authority to
       * revoke the statement.
       * 
       * # Errors
       * The function can fail due to several reasons including the statement
       * not being found, already being revoked, or the updater lacking the
       * authority to perform the revocation.
       * 
       * # Events
       * - `Revoked`: Emitted when a statement is successfully revoked, containing the
       * `identifier` of the statement and
       * the `author` who is the updater.
       **/
      revoke: AugmentedSubmittable<(statementId: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * Updates the digest of an existing statement after performing a
       * series of validations. Initially, the function confirms that the
       * call's origin is authorized and identifies the updater. It then
       * retrieves the statement details associated with the provided
       * `statement_id`. Before proceeding, the function checks whether the
       * statement has already been revoked; if so, it halts further
       * execution. Additionally, it ensures that the new digest provided for
       * the update is different from the current one to avoid unnecessary
       * operations.
       * 
       * Upon passing these checks, the updater's delegation status for the
       * space linked to the statement is verified. The existing statement is
       * then marked as revoked, and the new digest is recorded. This
       * involves updating the `Entries` storage with the new digest and the
       * updater's information, as well as adjusting the `IdentifierLookup`
       * to reflect the change. The `Statements` storage is also updated with
       * the new details of the statement.
       * 
       * Subsequently, the space usage count is incremented to account for
       * the updated statement. An activity log entry is created to record
       * the update event. To conclude the process, an `Update` event is
       * emitted, which includes the statement identifier, the new digest,
       * and the authoring updater's details.
       * 
       * # Parameters
       * - `origin`: The origin of the dispatch call, which should be a signed message from the
       * updater.
       * - `statement_id`: The identifier of the statement to be updated.
       * - `new_statement_digest`: The new digest to replace the existing one for the statement.
       * - `authorization`: The authorization ID, verifying the updater's delegation status.
       * 
       * # Returns
       * A `DispatchResult` indicating the success or failure of the update
       * operation. On success, it returns `Ok(())`. On failure, it provides
       * an error detailing the cause.
       * 
       * # Errors
       * The function can fail due to several reasons including an
       * unauthorized origin, the statement not found, the statement being
       * revoked, the new digest being the same as the existing one, or the
       * updater not being authorized for the operation.
       * 
       * # Events
       * - `Update`: Emitted when a statement is successfully updated, containing the
       * `identifier`, `digest`, and `author`
       * (updater).
       **/
      update: AugmentedSubmittable<(statementId: Bytes | string | Uint8Array, newStatementDigest: H256 | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, H256, Bytes]>;
    };
    sudo: {
      /**
       * Permanently removes the sudo key.
       * 
       * **This cannot be un-done.**
       **/
      removeKey: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Authenticates the current sudo key and sets the given AccountId (`new`) as the new sudo
       * key.
       **/
      setKey: AugmentedSubmittable<(updated: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * Authenticates the sudo key and dispatches a function call with `Root` origin.
       **/
      sudo: AugmentedSubmittable<(call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Call]>;
      /**
       * Authenticates the sudo key and dispatches a function call with `Signed` origin from
       * a given account.
       * 
       * The dispatch origin for this call must be _Signed_.
       **/
      sudoAs: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, Call]>;
      /**
       * Authenticates the sudo key and dispatches a function call with `Root` origin.
       * This function does not check the weight of the call, and instead allows the
       * Sudo user to specify the weight of the call.
       * 
       * The dispatch origin for this call must be _Signed_.
       **/
      sudoUncheckedWeight: AugmentedSubmittable<(call: Call | IMethod | string | Uint8Array, weight: SpWeightsWeightV2Weight | { refTime?: any; proofSize?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Call, SpWeightsWeightV2Weight]>;
    };
    system: {
      /**
       * Provide the preimage (runtime binary) `code` for an upgrade that has been authorized.
       * 
       * If the authorization required a version check, this call will ensure the spec name
       * remains unchanged and that the spec version has increased.
       * 
       * Depending on the runtime's `OnSetCode` configuration, this function may directly apply
       * the new `code` in the same block or attempt to schedule the upgrade.
       * 
       * All origins are allowed.
       **/
      applyAuthorizedUpgrade: AugmentedSubmittable<(code: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Authorize an upgrade to a given `code_hash` for the runtime. The runtime can be supplied
       * later.
       * 
       * This call requires Root origin.
       **/
      authorizeUpgrade: AugmentedSubmittable<(codeHash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256]>;
      /**
       * Authorize an upgrade to a given `code_hash` for the runtime. The runtime can be supplied
       * later.
       * 
       * WARNING: This authorizes an upgrade that will take place without any safety checks, for
       * example that the spec name remains the same and that the version number increases. Not
       * recommended for normal use. Use `authorize_upgrade` instead.
       * 
       * This call requires Root origin.
       **/
      authorizeUpgradeWithoutChecks: AugmentedSubmittable<(codeHash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256]>;
      /**
       * Kill all storage items with a key that starts with the given prefix.
       * 
       * **NOTE:** We rely on the Root origin to provide us the number of subkeys under
       * the prefix we are removing to accurately calculate the weight of this function.
       **/
      killPrefix: AugmentedSubmittable<(prefix: Bytes | string | Uint8Array, subkeys: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, u32]>;
      /**
       * Kill some items from storage.
       **/
      killStorage: AugmentedSubmittable<(keys: Vec<Bytes> | (Bytes | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>, [Vec<Bytes>]>;
      /**
       * Make some on-chain remark.
       * 
       * Can be executed by every `origin`.
       **/
      remark: AugmentedSubmittable<(remark: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Make some on-chain remark and emit event.
       **/
      remarkWithEvent: AugmentedSubmittable<(remark: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Set the new runtime code.
       **/
      setCode: AugmentedSubmittable<(code: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Set the new runtime code without doing any checks of the given `code`.
       * 
       * Note that runtime upgrades will not run if this is called with a not-increasing spec
       * version!
       **/
      setCodeWithoutChecks: AugmentedSubmittable<(code: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Set the number of pages in the WebAssembly environment's heap.
       **/
      setHeapPages: AugmentedSubmittable<(pages: u64 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u64]>;
      /**
       * Set some items of storage.
       **/
      setStorage: AugmentedSubmittable<(items: Vec<ITuple<[Bytes, Bytes]>> | ([Bytes | string | Uint8Array, Bytes | string | Uint8Array])[]) => SubmittableExtrinsic<ApiType>, [Vec<ITuple<[Bytes, Bytes]>>]>;
    };
    technicalCommittee: {
      /**
       * Close a vote that is either approved, disapproved or whose voting period has ended.
       * 
       * May be called by any signed account in order to finish voting and close the proposal.
       * 
       * If called before the end of the voting period it will only close the vote if it is
       * has enough votes to be approved or disapproved.
       * 
       * If called after the end of the voting period abstentions are counted as rejections
       * unless there is a prime member set and the prime member cast an approval.
       * 
       * If the close operation completes successfully with disapproval, the transaction fee will
       * be waived. Otherwise execution of the approved operation will be charged to the caller.
       * 
       * + `proposal_weight_bound`: The maximum amount of weight consumed by executing the closed
       * proposal.
       * + `length_bound`: The upper bound for the length of the proposal in storage. Checked via
       * `storage::read` so it is `size_of::<u32>() == 4` larger than the pure length.
       * 
       * ## Complexity
       * - `O(B + M + P1 + P2)` where:
       * - `B` is `proposal` size in bytes (length-fee-bounded)
       * - `M` is members-count (code- and governance-bounded)
       * - `P1` is the complexity of `proposal` preimage.
       * - `P2` is proposal-count (code-bounded)
       **/
      close: AugmentedSubmittable<(proposalHash: H256 | string | Uint8Array, index: Compact<u32> | AnyNumber | Uint8Array, proposalWeightBound: SpWeightsWeightV2Weight | { refTime?: any; proofSize?: any } | string | Uint8Array, lengthBound: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256, Compact<u32>, SpWeightsWeightV2Weight, Compact<u32>]>;
      /**
       * Disapprove a proposal, close, and remove it from the system, regardless of its current
       * state.
       * 
       * Must be called by the Root origin.
       * 
       * Parameters:
       * * `proposal_hash`: The hash of the proposal that should be disapproved.
       * 
       * ## Complexity
       * O(P) where P is the number of max proposals
       **/
      disapproveProposal: AugmentedSubmittable<(proposalHash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256]>;
      /**
       * Dispatch a proposal from a member using the `Member` origin.
       * 
       * Origin must be a member of the collective.
       * 
       * ## Complexity:
       * - `O(B + M + P)` where:
       * - `B` is `proposal` size in bytes (length-fee-bounded)
       * - `M` members-count (code-bounded)
       * - `P` complexity of dispatching `proposal`
       **/
      execute: AugmentedSubmittable<(proposal: Call | IMethod | string | Uint8Array, lengthBound: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Call, Compact<u32>]>;
      /**
       * Add a new proposal to either be voted on or executed directly.
       * 
       * Requires the sender to be member.
       * 
       * `threshold` determines whether `proposal` is executed directly (`threshold < 2`)
       * or put up for voting.
       * 
       * ## Complexity
       * - `O(B + M + P1)` or `O(B + M + P2)` where:
       * - `B` is `proposal` size in bytes (length-fee-bounded)
       * - `M` is members-count (code- and governance-bounded)
       * - branching is influenced by `threshold` where:
       * - `P1` is proposal execution complexity (`threshold < 2`)
       * - `P2` is proposals-count (code-bounded) (`threshold >= 2`)
       **/
      propose: AugmentedSubmittable<(threshold: Compact<u32> | AnyNumber | Uint8Array, proposal: Call | IMethod | string | Uint8Array, lengthBound: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, Call, Compact<u32>]>;
      /**
       * Set the collective's membership.
       * 
       * - `new_members`: The new member list. Be nice to the chain and provide it sorted.
       * - `prime`: The prime member whose vote sets the default.
       * - `old_count`: The upper bound for the previous number of members in storage. Used for
       * weight estimation.
       * 
       * The dispatch of this call must be `SetMembersOrigin`.
       * 
       * NOTE: Does not enforce the expected `MaxMembers` limit on the amount of members, but
       * the weight estimations rely on it to estimate dispatchable weight.
       * 
       * # WARNING:
       * 
       * The `pallet-collective` can also be managed by logic outside of the pallet through the
       * implementation of the trait [`ChangeMembers`].
       * Any call to `set_members` must be careful that the member set doesn't get out of sync
       * with other logic managing the member set.
       * 
       * ## Complexity:
       * - `O(MP + N)` where:
       * - `M` old-members-count (code- and governance-bounded)
       * - `N` new-members-count (code- and governance-bounded)
       * - `P` proposals-count (code-bounded)
       **/
      setMembers: AugmentedSubmittable<(newMembers: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[], prime: Option<AccountId32> | null | Uint8Array | AccountId32 | string, oldCount: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Vec<AccountId32>, Option<AccountId32>, u32]>;
      /**
       * Add an aye or nay vote for the sender to the given proposal.
       * 
       * Requires the sender to be a member.
       * 
       * Transaction fees will be waived if the member is voting on any particular proposal
       * for the first time and the call is successful. Subsequent vote changes will charge a
       * fee.
       * ## Complexity
       * - `O(M)` where `M` is members-count (code- and governance-bounded)
       **/
      vote: AugmentedSubmittable<(proposal: H256 | string | Uint8Array, index: Compact<u32> | AnyNumber | Uint8Array, approve: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256, Compact<u32>, bool]>;
    };
    technicalMembership: {
      /**
       * Add a member `who` to the set.
       * 
       * May only be called from `T::AddOrigin`.
       **/
      addMember: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * Swap out the sending member for some other key `new`.
       * 
       * May only be called from `Signed` origin of a current member.
       * 
       * Prime membership is passed from the origin account to `new`, if
       * extant.
       **/
      changeKey: AugmentedSubmittable<(updated: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * Remove the prime member if it exists.
       * 
       * May only be called from `T::PrimeOrigin`.
       **/
      clearPrime: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Remove a member `who` from the set.
       * 
       * May only be called from `T::RemoveOrigin`.
       **/
      removeMember: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * Change the membership to a new set, disregarding the existing
       * membership. Be nice and pass `members` pre-sorted.
       * 
       * May only be called from `T::ResetOrigin`.
       **/
      resetMembers: AugmentedSubmittable<(members: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>, [Vec<AccountId32>]>;
      /**
       * Set the prime member. Must be a current member.
       * 
       * May only be called from `T::PrimeOrigin`.
       **/
      setPrime: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * Swap out one member `remove` for another `add`.
       * 
       * May only be called from `T::SwapOrigin`.
       * 
       * Prime membership is *not* passed from `remove` to `add`, if extant.
       **/
      swapMember: AugmentedSubmittable<(remove: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, add: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, MultiAddress]>;
    };
    timestamp: {
      /**
       * Set the current time.
       * 
       * This call should be invoked exactly once per block. It will panic at the finalization
       * phase, if this call hasn't been invoked by that time.
       * 
       * The timestamp should be greater than the previous one by the amount specified by
       * [`Config::MinimumPeriod`].
       * 
       * The dispatch origin for this call must be _None_.
       * 
       * This dispatch class is _Mandatory_ to ensure it gets executed in the block. Be aware
       * that changing the complexity of this call could result exhausting the resources in a
       * block to execute any other calls.
       * 
       * ## Complexity
       * - `O(1)` (Note that implementations of `OnTimestampSet` must also be `O(1)`)
       * - 1 storage read and 1 storage mutation (codec `O(1)` because of `DidUpdate::take` in
       * `on_finalize`)
       * - 1 event handler `on_timestamp_set`. Must be `O(1)`.
       **/
      set: AugmentedSubmittable<(now: Compact<u64> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u64>]>;
    };
    treasury: {
      /**
       * Check the status of the spend and remove it from the storage if processed.
       * 
       * ## Dispatch Origin
       * 
       * Must be signed.
       * 
       * ## Details
       * 
       * The status check is a prerequisite for retrying a failed payout.
       * If a spend has either succeeded or expired, it is removed from the storage by this
       * function. In such instances, transaction fees are refunded.
       * 
       * ### Parameters
       * - `index`: The spend index.
       * 
       * ## Events
       * 
       * Emits [`Event::PaymentFailed`] if the spend payout has failed.
       * Emits [`Event::SpendProcessed`] if the spend payout has succeed.
       **/
      checkStatus: AugmentedSubmittable<(index: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32]>;
      /**
       * Claim a spend.
       * 
       * ## Dispatch Origin
       * 
       * Must be signed
       * 
       * ## Details
       * 
       * Spends must be claimed within some temporal bounds. A spend may be claimed within one
       * [`Config::PayoutPeriod`] from the `valid_from` block.
       * In case of a payout failure, the spend status must be updated with the `check_status`
       * dispatchable before retrying with the current function.
       * 
       * ### Parameters
       * - `index`: The spend index.
       * 
       * ## Events
       * 
       * Emits [`Event::Paid`] if successful.
       **/
      payout: AugmentedSubmittable<(index: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32]>;
      /**
       * Force a previously approved proposal to be removed from the approval queue.
       * 
       * ## Dispatch Origin
       * 
       * Must be [`Config::RejectOrigin`].
       * 
       * ## Details
       * 
       * The original deposit will no longer be returned.
       * 
       * ### Parameters
       * - `proposal_id`: The index of a proposal
       * 
       * ### Complexity
       * - O(A) where `A` is the number of approvals
       * 
       * ### Errors
       * - [`Error::ProposalNotApproved`]: The `proposal_id` supplied was not found in the
       * approval queue, i.e., the proposal has not been approved. This could also mean the
       * proposal does not exist altogether, thus there is no way it would have been approved
       * in the first place.
       **/
      removeApproval: AugmentedSubmittable<(proposalId: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>]>;
      /**
       * Propose and approve a spend of treasury funds.
       * 
       * ## Dispatch Origin
       * 
       * Must be [`Config::SpendOrigin`] with the `Success` value being at least
       * `amount` of `asset_kind` in the native asset. The amount of `asset_kind` is converted
       * for assertion using the [`Config::BalanceConverter`].
       * 
       * ## Details
       * 
       * Create an approved spend for transferring a specific `amount` of `asset_kind` to a
       * designated beneficiary. The spend must be claimed using the `payout` dispatchable within
       * the [`Config::PayoutPeriod`].
       * 
       * ### Parameters
       * - `asset_kind`: An indicator of the specific asset class to be spent.
       * - `amount`: The amount to be transferred from the treasury to the `beneficiary`.
       * - `beneficiary`: The beneficiary of the spend.
       * - `valid_from`: The block number from which the spend can be claimed. It can refer to
       * the past if the resulting spend has not yet expired according to the
       * [`Config::PayoutPeriod`]. If `None`, the spend can be claimed immediately after
       * approval.
       * 
       * ## Events
       * 
       * Emits [`Event::AssetSpendApproved`] if successful.
       **/
      spend: AugmentedSubmittable<(assetKind: Null | null, amount: Compact<u128> | AnyNumber | Uint8Array, beneficiary: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, validFrom: Option<u32> | null | Uint8Array | u32 | AnyNumber) => SubmittableExtrinsic<ApiType>, [Null, Compact<u128>, MultiAddress, Option<u32>]>;
      /**
       * Propose and approve a spend of treasury funds.
       * 
       * ## Dispatch Origin
       * 
       * Must be [`Config::SpendOrigin`] with the `Success` value being at least `amount`.
       * 
       * ### Details
       * NOTE: For record-keeping purposes, the proposer is deemed to be equivalent to the
       * beneficiary.
       * 
       * ### Parameters
       * - `amount`: The amount to be transferred from the treasury to the `beneficiary`.
       * - `beneficiary`: The destination account for the transfer.
       * 
       * ## Events
       * 
       * Emits [`Event::SpendApproved`] if successful.
       **/
      spendLocal: AugmentedSubmittable<(amount: Compact<u128> | AnyNumber | Uint8Array, beneficiary: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u128>, MultiAddress]>;
      /**
       * Void previously approved spend.
       * 
       * ## Dispatch Origin
       * 
       * Must be [`Config::RejectOrigin`].
       * 
       * ## Details
       * 
       * A spend void is only possible if the payout has not been attempted yet.
       * 
       * ### Parameters
       * - `index`: The spend index.
       * 
       * ## Events
       * 
       * Emits [`Event::AssetSpendVoided`] if successful.
       **/
      voidSpend: AugmentedSubmittable<(index: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32]>;
    };
    utility: {
      /**
       * Send a call through an indexed pseudonym of the sender.
       * 
       * Filter from origin are passed along. The call will be dispatched with an origin which
       * use the same filter as the origin of this call.
       * 
       * NOTE: If you need to ensure that any account-based filtering is not honored (i.e.
       * because you expect `proxy` to have been used prior in the call stack and you do not want
       * the call restrictions to apply to any sub-accounts), then use `as_multi_threshold_1`
       * in the Multisig pallet instead.
       * 
       * NOTE: Prior to version *12, this was called `as_limited_sub`.
       * 
       * The dispatch origin for this call must be _Signed_.
       **/
      asDerivative: AugmentedSubmittable<(index: u16 | AnyNumber | Uint8Array, call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [u16, Call]>;
      /**
       * Send a batch of dispatch calls.
       * 
       * May be called from any origin except `None`.
       * 
       * - `calls`: The calls to be dispatched from the same origin. The number of call must not
       * exceed the constant: `batched_calls_limit` (available in constant metadata).
       * 
       * If origin is root then the calls are dispatched without checking origin filter. (This
       * includes bypassing `frame_system::Config::BaseCallFilter`).
       * 
       * ## Complexity
       * - O(C) where C is the number of calls to be batched.
       * 
       * This will return `Ok` in all circumstances. To determine the success of the batch, an
       * event is deposited. If a call failed and the batch was interrupted, then the
       * `BatchInterrupted` event is deposited, along with the number of successful calls made
       * and the error of the failed call. If all were successful, then the `BatchCompleted`
       * event is deposited.
       **/
      batch: AugmentedSubmittable<(calls: Vec<Call> | (Call | IMethod | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>, [Vec<Call>]>;
      /**
       * Send a batch of dispatch calls and atomically execute them.
       * The whole transaction will rollback and fail if any of the calls failed.
       * 
       * May be called from any origin except `None`.
       * 
       * - `calls`: The calls to be dispatched from the same origin. The number of call must not
       * exceed the constant: `batched_calls_limit` (available in constant metadata).
       * 
       * If origin is root then the calls are dispatched without checking origin filter. (This
       * includes bypassing `frame_system::Config::BaseCallFilter`).
       * 
       * ## Complexity
       * - O(C) where C is the number of calls to be batched.
       **/
      batchAll: AugmentedSubmittable<(calls: Vec<Call> | (Call | IMethod | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>, [Vec<Call>]>;
      /**
       * Dispatches a function call with a provided origin.
       * 
       * The dispatch origin for this call must be _Root_.
       * 
       * ## Complexity
       * - O(1).
       **/
      dispatchAs: AugmentedSubmittable<(asOrigin: CordLoomRuntimeOriginCaller | { system: any } | { Void: any } | { Council: any } | { TechnicalCommittee: any } | { Did: any } | string | Uint8Array, call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [CordLoomRuntimeOriginCaller, Call]>;
      /**
       * Send a batch of dispatch calls.
       * Unlike `batch`, it allows errors and won't interrupt.
       * 
       * May be called from any origin except `None`.
       * 
       * - `calls`: The calls to be dispatched from the same origin. The number of call must not
       * exceed the constant: `batched_calls_limit` (available in constant metadata).
       * 
       * If origin is root then the calls are dispatch without checking origin filter. (This
       * includes bypassing `frame_system::Config::BaseCallFilter`).
       * 
       * ## Complexity
       * - O(C) where C is the number of calls to be batched.
       **/
      forceBatch: AugmentedSubmittable<(calls: Vec<Call> | (Call | IMethod | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>, [Vec<Call>]>;
      /**
       * Dispatch a function call with a specified weight.
       * 
       * This function does not check the weight of the call, and instead allows the
       * Root origin to specify the weight of the call.
       * 
       * The dispatch origin for this call must be _Root_.
       **/
      withWeight: AugmentedSubmittable<(call: Call | IMethod | string | Uint8Array, weight: SpWeightsWeightV2Weight | { refTime?: any; proofSize?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Call, SpWeightsWeightV2Weight]>;
    };
  } // AugmentedSubmittables
} // declare module
