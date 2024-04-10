// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/submittable';

import type { ApiTypes, AugmentedSubmittable, SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api-base/types';
import type { Data } from '@polkadot/types';
import type { Bytes, Compact, Option, U8aFixed, Vec, bool, u128, u16, u32, u64, u8 } from '@polkadot/types-codec';
import type { AnyNumber, IMethod, ITuple } from '@polkadot/types-codec/types';
import type { AccountId32, Call, H256, MultiAddress } from '@polkadot/types/interfaces/runtime';
import type { CordRuntimeOriginCaller, CordRuntimeSessionKeys, PalletAssetAssetInputEntry, PalletAssetAssetIssuanceEntry, PalletAssetAssetStatusOf, PalletAssetAssetTransferEntry, PalletBalancesAdjustmentDirection, PalletDidDidDetailsDidAuthorizedCallOperation, PalletDidDidDetailsDidCreationDetails, PalletDidDidDetailsDidEncryptionKey, PalletDidDidDetailsDidSignature, PalletDidDidDetailsDidVerificationKey, PalletDidServiceEndpointsDidEndpoint, PalletIdentityJudgement, PalletIdentityLegacyIdentityInfo, PalletImOnlineHeartbeat, PalletImOnlineSr25519AppSr25519Signature, PalletMultisigTimepoint, PalletNetworkScoreRatingInputEntry, PalletStatementPresentationTypeOf, SpConsensusBabeDigestsNextConfigDescriptor, SpConsensusGrandpaEquivocationProof, SpConsensusSlotsEquivocationProof, SpRuntimeMultiSignature, SpSessionMembershipProof, SpWeightsWeightV2Weight } from '@polkadot/types/lookup';

export type __AugmentedSubmittable = AugmentedSubmittable<() => unknown>;
export type __SubmittableExtrinsic<ApiType extends ApiTypes> = SubmittableExtrinsic<ApiType>;
export type __SubmittableExtrinsicFunction<ApiType extends ApiTypes> = SubmittableExtrinsicFunction<ApiType>;

declare module '@polkadot/api-base/types/submittable' {
  interface AugmentedSubmittables<ApiType extends ApiTypes> {
    asset: {
      /**
       * See [`Pallet::create`].
       **/
      create: AugmentedSubmittable<(entry: PalletAssetAssetInputEntry | { assetType?: any; assetDesc?: any; assetQty?: any; assetValue?: any; assetTag?: any; assetMeta?: any } | string | Uint8Array, digest: H256 | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletAssetAssetInputEntry, H256, Bytes]>;
      /**
       * See [`Pallet::issue`].
       **/
      issue: AugmentedSubmittable<(entry: PalletAssetAssetIssuanceEntry | { assetId?: any; assetOwner?: any; assetIssuanceQty?: any } | string | Uint8Array, digest: H256 | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletAssetAssetIssuanceEntry, H256, Bytes]>;
      /**
       * See [`Pallet::status_change`].
       **/
      statusChange: AugmentedSubmittable<(assetId: Bytes | string | Uint8Array, instanceId: Option<Bytes> | null | Uint8Array | Bytes | string, newStatus: PalletAssetAssetStatusOf | 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | number | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Option<Bytes>, PalletAssetAssetStatusOf]>;
      /**
       * See [`Pallet::transfer`].
       **/
      transfer: AugmentedSubmittable<(entry: PalletAssetAssetTransferEntry | { assetId?: any; assetInstanceId?: any; assetOwner?: any; newAssetOwner?: any } | string | Uint8Array, digest: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletAssetAssetTransferEntry, H256]>;
      /**
       * See [`Pallet::vc_create`].
       **/
      vcCreate: AugmentedSubmittable<(assetQty: u64 | AnyNumber | Uint8Array, digest: H256 | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [u64, H256, Bytes]>;
      /**
       * See [`Pallet::vc_issue`].
       **/
      vcIssue: AugmentedSubmittable<(entry: PalletAssetAssetIssuanceEntry | { assetId?: any; assetOwner?: any; assetIssuanceQty?: any } | string | Uint8Array, digest: H256 | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletAssetAssetIssuanceEntry, H256, Bytes]>;
      /**
       * See [`Pallet::vc_status_change`].
       **/
      vcStatusChange: AugmentedSubmittable<(assetId: Bytes | string | Uint8Array, instanceId: Option<Bytes> | null | Uint8Array | Bytes | string, newStatus: PalletAssetAssetStatusOf | 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | number | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Option<Bytes>, PalletAssetAssetStatusOf]>;
      /**
       * See [`Pallet::vc_transfer`].
       **/
      vcTransfer: AugmentedSubmittable<(entry: PalletAssetAssetTransferEntry | { assetId?: any; assetInstanceId?: any; assetOwner?: any; newAssetOwner?: any } | string | Uint8Array, digest: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletAssetAssetTransferEntry, H256]>;
    };
    authorityMembership: {
      /**
       * See [`Pallet::go_offline`].
       **/
      goOffline: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * See [`Pallet::go_online`].
       **/
      goOnline: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * See [`Pallet::nominate`].
       **/
      nominate: AugmentedSubmittable<(candidate: AccountId32 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32]>;
      /**
       * See [`Pallet::remove`].
       **/
      remove: AugmentedSubmittable<(candidate: AccountId32 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32]>;
      /**
       * See [`Pallet::remove_member_from_blacklist`].
       **/
      removeMemberFromBlacklist: AugmentedSubmittable<(candidate: AccountId32 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32]>;
    };
    babe: {
      /**
       * See [`Pallet::plan_config_change`].
       **/
      planConfigChange: AugmentedSubmittable<(config: SpConsensusBabeDigestsNextConfigDescriptor | { V1: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [SpConsensusBabeDigestsNextConfigDescriptor]>;
      /**
       * See [`Pallet::report_equivocation`].
       **/
      reportEquivocation: AugmentedSubmittable<(equivocationProof: SpConsensusSlotsEquivocationProof | { offender?: any; slot?: any; firstHeader?: any; secondHeader?: any } | string | Uint8Array, keyOwnerProof: SpSessionMembershipProof | { session?: any; trieNodes?: any; validatorCount?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [SpConsensusSlotsEquivocationProof, SpSessionMembershipProof]>;
      /**
       * See [`Pallet::report_equivocation_unsigned`].
       **/
      reportEquivocationUnsigned: AugmentedSubmittable<(equivocationProof: SpConsensusSlotsEquivocationProof | { offender?: any; slot?: any; firstHeader?: any; secondHeader?: any } | string | Uint8Array, keyOwnerProof: SpSessionMembershipProof | { session?: any; trieNodes?: any; validatorCount?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [SpConsensusSlotsEquivocationProof, SpSessionMembershipProof]>;
    };
    balances: {
      /**
       * See [`Pallet::force_adjust_total_issuance`].
       **/
      forceAdjustTotalIssuance: AugmentedSubmittable<(direction: PalletBalancesAdjustmentDirection | 'Increase' | 'Decrease' | number | Uint8Array, delta: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletBalancesAdjustmentDirection, Compact<u128>]>;
      /**
       * See [`Pallet::force_set_balance`].
       **/
      forceSetBalance: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, newFree: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, Compact<u128>]>;
      /**
       * See [`Pallet::force_transfer`].
       **/
      forceTransfer: AugmentedSubmittable<(source: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, dest: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, value: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, MultiAddress, Compact<u128>]>;
      /**
       * See [`Pallet::force_unreserve`].
       **/
      forceUnreserve: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, amount: u128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, u128]>;
      /**
       * See [`Pallet::transfer_all`].
       **/
      transferAll: AugmentedSubmittable<(dest: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, keepAlive: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, bool]>;
      /**
       * See [`Pallet::transfer_allow_death`].
       **/
      transferAllowDeath: AugmentedSubmittable<(dest: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, value: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, Compact<u128>]>;
      /**
       * See [`Pallet::transfer_keep_alive`].
       **/
      transferKeepAlive: AugmentedSubmittable<(dest: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, value: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, Compact<u128>]>;
      /**
       * See [`Pallet::upgrade_accounts`].
       **/
      upgradeAccounts: AugmentedSubmittable<(who: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>, [Vec<AccountId32>]>;
    };
    chainSpace: {
      /**
       * See [`Pallet::add_admin_delegate`].
       **/
      addAdminDelegate: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array, delegate: AccountId32 | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, AccountId32, Bytes]>;
      /**
       * See [`Pallet::add_delegate`].
       **/
      addDelegate: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array, delegate: AccountId32 | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, AccountId32, Bytes]>;
      /**
       * See [`Pallet::add_delegator`].
       **/
      addDelegator: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array, delegate: AccountId32 | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, AccountId32, Bytes]>;
      /**
       * See [`Pallet::approval_restore`].
       **/
      approvalRestore: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * See [`Pallet::approval_revoke`].
       **/
      approvalRevoke: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * See [`Pallet::approve`].
       **/
      approve: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array, txnCapacity: u64 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, u64]>;
      /**
       * See [`Pallet::archive`].
       **/
      archive: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * See [`Pallet::create`].
       **/
      create: AugmentedSubmittable<(spaceCode: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256]>;
      /**
       * See [`Pallet::remove_delegate`].
       **/
      removeDelegate: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array, removeAuthorization: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes, Bytes]>;
      /**
       * See [`Pallet::reset_transaction_count`].
       **/
      resetTransactionCount: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * See [`Pallet::restore`].
       **/
      restore: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * See [`Pallet::subspace_create`].
       **/
      subspaceCreate: AugmentedSubmittable<(spaceCode: H256 | string | Uint8Array, count: u64 | AnyNumber | Uint8Array, spaceId: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256, u64, Bytes]>;
      /**
       * See [`Pallet::update_transaction_capacity`].
       **/
      updateTransactionCapacity: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array, newTxnCapacity: u64 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, u64]>;
      /**
       * See [`Pallet::update_transaction_capacity_sub`].
       **/
      updateTransactionCapacitySub: AugmentedSubmittable<(spaceId: Bytes | string | Uint8Array, newTxnCapacity: u64 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, u64]>;
    };
    council: {
      /**
       * See [`Pallet::close`].
       **/
      close: AugmentedSubmittable<(proposalHash: H256 | string | Uint8Array, index: Compact<u32> | AnyNumber | Uint8Array, proposalWeightBound: SpWeightsWeightV2Weight | { refTime?: any; proofSize?: any } | string | Uint8Array, lengthBound: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256, Compact<u32>, SpWeightsWeightV2Weight, Compact<u32>]>;
      /**
       * See [`Pallet::disapprove_proposal`].
       **/
      disapproveProposal: AugmentedSubmittable<(proposalHash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256]>;
      /**
       * See [`Pallet::execute`].
       **/
      execute: AugmentedSubmittable<(proposal: Call | IMethod | string | Uint8Array, lengthBound: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Call, Compact<u32>]>;
      /**
       * See [`Pallet::propose`].
       **/
      propose: AugmentedSubmittable<(threshold: Compact<u32> | AnyNumber | Uint8Array, proposal: Call | IMethod | string | Uint8Array, lengthBound: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, Call, Compact<u32>]>;
      /**
       * See [`Pallet::set_members`].
       **/
      setMembers: AugmentedSubmittable<(newMembers: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[], prime: Option<AccountId32> | null | Uint8Array | AccountId32 | string, oldCount: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Vec<AccountId32>, Option<AccountId32>, u32]>;
      /**
       * See [`Pallet::vote`].
       **/
      vote: AugmentedSubmittable<(proposal: H256 | string | Uint8Array, index: Compact<u32> | AnyNumber | Uint8Array, approve: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256, Compact<u32>, bool]>;
    };
    councilMembership: {
      /**
       * See [`Pallet::add_member`].
       **/
      addMember: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * See [`Pallet::change_key`].
       **/
      changeKey: AugmentedSubmittable<(updated: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * See [`Pallet::clear_prime`].
       **/
      clearPrime: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * See [`Pallet::remove_member`].
       **/
      removeMember: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * See [`Pallet::reset_members`].
       **/
      resetMembers: AugmentedSubmittable<(members: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>, [Vec<AccountId32>]>;
      /**
       * See [`Pallet::set_prime`].
       **/
      setPrime: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * See [`Pallet::swap_member`].
       **/
      swapMember: AugmentedSubmittable<(remove: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, add: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, MultiAddress]>;
    };
    did: {
      /**
       * See [`Pallet::add_key_agreement_key`].
       **/
      addKeyAgreementKey: AugmentedSubmittable<(newKey: PalletDidDidDetailsDidEncryptionKey | { x25519: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletDidDidDetailsDidEncryptionKey]>;
      /**
       * See [`Pallet::add_service_endpoint`].
       **/
      addServiceEndpoint: AugmentedSubmittable<(serviceEndpoint: PalletDidServiceEndpointsDidEndpoint | { id?: any; serviceTypes?: any; urls?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletDidServiceEndpointsDidEndpoint]>;
      /**
       * See [`Pallet::create`].
       **/
      create: AugmentedSubmittable<(details: PalletDidDidDetailsDidCreationDetails | { did?: any; submitter?: any; newKeyAgreementKeys?: any; newAssertionKey?: any; newDelegationKey?: any; newServiceDetails?: any } | string | Uint8Array, signature: PalletDidDidDetailsDidSignature | { ed25519: any } | { sr25519: any } | { ecdsa: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletDidDidDetailsDidCreationDetails, PalletDidDidDetailsDidSignature]>;
      /**
       * See [`Pallet::create_from_account`].
       **/
      createFromAccount: AugmentedSubmittable<(authenticationKey: PalletDidDidDetailsDidVerificationKey | { ed25519: any } | { sr25519: any } | { ecdsa: any } | { Account: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletDidDidDetailsDidVerificationKey]>;
      /**
       * See [`Pallet::delete`].
       **/
      delete: AugmentedSubmittable<(endpointsToRemove: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32]>;
      /**
       * See [`Pallet::dispatch_as`].
       **/
      dispatchAs: AugmentedSubmittable<(didIdentifier: AccountId32 | string | Uint8Array, call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32, Call]>;
      /**
       * See [`Pallet::remove_assertion_key`].
       **/
      removeAssertionKey: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * See [`Pallet::remove_delegation_key`].
       **/
      removeDelegationKey: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * See [`Pallet::remove_key_agreement_key`].
       **/
      removeKeyAgreementKey: AugmentedSubmittable<(keyId: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256]>;
      /**
       * See [`Pallet::remove_service_endpoint`].
       **/
      removeServiceEndpoint: AugmentedSubmittable<(serviceId: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * See [`Pallet::set_assertion_key`].
       **/
      setAssertionKey: AugmentedSubmittable<(newKey: PalletDidDidDetailsDidVerificationKey | { ed25519: any } | { sr25519: any } | { ecdsa: any } | { Account: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletDidDidDetailsDidVerificationKey]>;
      /**
       * See [`Pallet::set_authentication_key`].
       **/
      setAuthenticationKey: AugmentedSubmittable<(newKey: PalletDidDidDetailsDidVerificationKey | { ed25519: any } | { sr25519: any } | { ecdsa: any } | { Account: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletDidDidDetailsDidVerificationKey]>;
      /**
       * See [`Pallet::set_delegation_key`].
       **/
      setDelegationKey: AugmentedSubmittable<(newKey: PalletDidDidDetailsDidVerificationKey | { ed25519: any } | { sr25519: any } | { ecdsa: any } | { Account: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletDidDidDetailsDidVerificationKey]>;
      /**
       * See [`Pallet::submit_did_call`].
       **/
      submitDidCall: AugmentedSubmittable<(didCall: PalletDidDidDetailsDidAuthorizedCallOperation | { did?: any; txCounter?: any; call?: any; blockNumber?: any; submitter?: any } | string | Uint8Array, signature: PalletDidDidDetailsDidSignature | { ed25519: any } | { sr25519: any } | { ecdsa: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletDidDidDetailsDidAuthorizedCallOperation, PalletDidDidDetailsDidSignature]>;
    };
    didName: {
      /**
       * See [`Pallet::ban`].
       **/
      ban: AugmentedSubmittable<(name: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * See [`Pallet::register`].
       **/
      register: AugmentedSubmittable<(name: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * See [`Pallet::release`].
       **/
      release: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * See [`Pallet::unban`].
       **/
      unban: AugmentedSubmittable<(name: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
    };
    grandpa: {
      /**
       * See [`Pallet::note_stalled`].
       **/
      noteStalled: AugmentedSubmittable<(delay: u32 | AnyNumber | Uint8Array, bestFinalizedBlockNumber: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32, u32]>;
      /**
       * See [`Pallet::report_equivocation`].
       **/
      reportEquivocation: AugmentedSubmittable<(equivocationProof: SpConsensusGrandpaEquivocationProof | { setId?: any; equivocation?: any } | string | Uint8Array, keyOwnerProof: SpSessionMembershipProof | { session?: any; trieNodes?: any; validatorCount?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [SpConsensusGrandpaEquivocationProof, SpSessionMembershipProof]>;
      /**
       * See [`Pallet::report_equivocation_unsigned`].
       **/
      reportEquivocationUnsigned: AugmentedSubmittable<(equivocationProof: SpConsensusGrandpaEquivocationProof | { setId?: any; equivocation?: any } | string | Uint8Array, keyOwnerProof: SpSessionMembershipProof | { session?: any; trieNodes?: any; validatorCount?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [SpConsensusGrandpaEquivocationProof, SpSessionMembershipProof]>;
    };
    identity: {
      /**
       * See [`Pallet::accept_username`].
       **/
      acceptUsername: AugmentedSubmittable<(username: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * See [`Pallet::add_registrar`].
       **/
      addRegistrar: AugmentedSubmittable<(account: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * See [`Pallet::add_sub`].
       **/
      addSub: AugmentedSubmittable<(sub: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, data: Data | { None: any } | { Raw: any } | { BlakeTwo256: any } | { Sha256: any } | { Keccak256: any } | { ShaThree256: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, Data]>;
      /**
       * See [`Pallet::add_username_authority`].
       **/
      addUsernameAuthority: AugmentedSubmittable<(authority: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, suffix: Bytes | string | Uint8Array, allocation: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, Bytes, u32]>;
      /**
       * See [`Pallet::cancel_request`].
       **/
      cancelRequest: AugmentedSubmittable<(registrar: AccountId32 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32]>;
      /**
       * See [`Pallet::clear_identity`].
       **/
      clearIdentity: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * See [`Pallet::kill_identity`].
       **/
      killIdentity: AugmentedSubmittable<(target: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * See [`Pallet::provide_judgement`].
       **/
      provideJudgement: AugmentedSubmittable<(target: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, judgement: PalletIdentityJudgement | 'Unknown' | 'Requested' | 'Reasonable' | 'KnownGood' | 'OutOfDate' | 'LowQuality' | 'Erroneous' | number | Uint8Array, identity: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, PalletIdentityJudgement, H256]>;
      /**
       * See [`Pallet::quit_sub`].
       **/
      quitSub: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * See [`Pallet::remove_dangling_username`].
       **/
      removeDanglingUsername: AugmentedSubmittable<(username: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * See [`Pallet::remove_expired_approval`].
       **/
      removeExpiredApproval: AugmentedSubmittable<(username: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * See [`Pallet::remove_registrar`].
       **/
      removeRegistrar: AugmentedSubmittable<(account: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * See [`Pallet::remove_sub`].
       **/
      removeSub: AugmentedSubmittable<(sub: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * See [`Pallet::remove_username_authority`].
       **/
      removeUsernameAuthority: AugmentedSubmittable<(authority: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * See [`Pallet::rename_sub`].
       **/
      renameSub: AugmentedSubmittable<(sub: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, data: Data | { None: any } | { Raw: any } | { BlakeTwo256: any } | { Sha256: any } | { Keccak256: any } | { ShaThree256: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, Data]>;
      /**
       * See [`Pallet::request_judgement`].
       **/
      requestJudgement: AugmentedSubmittable<(registrar: AccountId32 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32]>;
      /**
       * See [`Pallet::set_account_id`].
       **/
      setAccountId: AugmentedSubmittable<(updated: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * See [`Pallet::set_fields`].
       **/
      setFields: AugmentedSubmittable<(fields: u64 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u64]>;
      /**
       * See [`Pallet::set_identity`].
       **/
      setIdentity: AugmentedSubmittable<(info: PalletIdentityLegacyIdentityInfo | { additional?: any; display?: any; legal?: any; web?: any; email?: any; image?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletIdentityLegacyIdentityInfo]>;
      /**
       * See [`Pallet::set_primary_username`].
       **/
      setPrimaryUsername: AugmentedSubmittable<(username: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * See [`Pallet::set_subs`].
       **/
      setSubs: AugmentedSubmittable<(subs: Vec<ITuple<[AccountId32, Data]>> | ([AccountId32 | string | Uint8Array, Data | { None: any } | { Raw: any } | { BlakeTwo256: any } | { Sha256: any } | { Keccak256: any } | { ShaThree256: any } | string | Uint8Array])[]) => SubmittableExtrinsic<ApiType>, [Vec<ITuple<[AccountId32, Data]>>]>;
      /**
       * See [`Pallet::set_username_for`].
       **/
      setUsernameFor: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, username: Bytes | string | Uint8Array, signature: Option<SpRuntimeMultiSignature> | null | Uint8Array | SpRuntimeMultiSignature | { ed25519: any } | { sr25519: any } | { ecdsa: any } | string) => SubmittableExtrinsic<ApiType>, [MultiAddress, Bytes, Option<SpRuntimeMultiSignature>]>;
    };
    imOnline: {
      /**
       * See [`Pallet::heartbeat`].
       **/
      heartbeat: AugmentedSubmittable<(heartbeat: PalletImOnlineHeartbeat | { blockNumber?: any; sessionIndex?: any; authorityIndex?: any; validatorsLen?: any } | string | Uint8Array, signature: PalletImOnlineSr25519AppSr25519Signature | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletImOnlineHeartbeat, PalletImOnlineSr25519AppSr25519Signature]>;
    };
    indices: {
      /**
       * See [`Pallet::claim`].
       **/
      claim: AugmentedSubmittable<(index: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32]>;
      /**
       * See [`Pallet::force_transfer`].
       **/
      forceTransfer: AugmentedSubmittable<(updated: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, index: u32 | AnyNumber | Uint8Array, freeze: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, u32, bool]>;
      /**
       * See [`Pallet::free`].
       **/
      free: AugmentedSubmittable<(index: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32]>;
      /**
       * See [`Pallet::freeze`].
       **/
      freeze: AugmentedSubmittable<(index: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32]>;
      /**
       * See [`Pallet::transfer`].
       **/
      transfer: AugmentedSubmittable<(updated: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, index: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, u32]>;
    };
    multisig: {
      /**
       * See [`Pallet::approve_as_multi`].
       **/
      approveAsMulti: AugmentedSubmittable<(threshold: u16 | AnyNumber | Uint8Array, otherSignatories: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[], maybeTimepoint: Option<PalletMultisigTimepoint> | null | Uint8Array | PalletMultisigTimepoint | { height?: any; index?: any } | string, callHash: U8aFixed | string | Uint8Array, maxWeight: SpWeightsWeightV2Weight | { refTime?: any; proofSize?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [u16, Vec<AccountId32>, Option<PalletMultisigTimepoint>, U8aFixed, SpWeightsWeightV2Weight]>;
      /**
       * See [`Pallet::as_multi`].
       **/
      asMulti: AugmentedSubmittable<(threshold: u16 | AnyNumber | Uint8Array, otherSignatories: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[], maybeTimepoint: Option<PalletMultisigTimepoint> | null | Uint8Array | PalletMultisigTimepoint | { height?: any; index?: any } | string, call: Call | IMethod | string | Uint8Array, maxWeight: SpWeightsWeightV2Weight | { refTime?: any; proofSize?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [u16, Vec<AccountId32>, Option<PalletMultisigTimepoint>, Call, SpWeightsWeightV2Weight]>;
      /**
       * See [`Pallet::as_multi_threshold_1`].
       **/
      asMultiThreshold1: AugmentedSubmittable<(otherSignatories: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[], call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Vec<AccountId32>, Call]>;
      /**
       * See [`Pallet::cancel_as_multi`].
       **/
      cancelAsMulti: AugmentedSubmittable<(threshold: u16 | AnyNumber | Uint8Array, otherSignatories: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[], timepoint: PalletMultisigTimepoint | { height?: any; index?: any } | string | Uint8Array, callHash: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [u16, Vec<AccountId32>, PalletMultisigTimepoint, U8aFixed]>;
    };
    networkMembership: {
      /**
       * See [`Pallet::nominate`].
       **/
      nominate: AugmentedSubmittable<(member: AccountId32 | string | Uint8Array, expires: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32, bool]>;
      /**
       * See [`Pallet::renew`].
       **/
      renew: AugmentedSubmittable<(member: AccountId32 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32]>;
      /**
       * See [`Pallet::revoke`].
       **/
      revoke: AugmentedSubmittable<(member: AccountId32 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32]>;
    };
    networkScore: {
      /**
       * See [`Pallet::register_rating`].
       **/
      registerRating: AugmentedSubmittable<(entry: PalletNetworkScoreRatingInputEntry | { entityId?: any; providerId?: any; countOfTxn?: any; totalEncodedRating?: any; ratingType?: any; providerDid?: any } | string | Uint8Array, digest: H256 | string | Uint8Array, messageId: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletNetworkScoreRatingInputEntry, H256, Bytes, Bytes]>;
      /**
       * See [`Pallet::revise_rating`].
       **/
      reviseRating: AugmentedSubmittable<(entry: PalletNetworkScoreRatingInputEntry | { entityId?: any; providerId?: any; countOfTxn?: any; totalEncodedRating?: any; ratingType?: any; providerDid?: any } | string | Uint8Array, digest: H256 | string | Uint8Array, messageId: Bytes | string | Uint8Array, debitRefId: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletNetworkScoreRatingInputEntry, H256, Bytes, Bytes, Bytes]>;
      /**
       * See [`Pallet::revoke_rating`].
       **/
      revokeRating: AugmentedSubmittable<(entryIdentifier: Bytes | string | Uint8Array, messageId: Bytes | string | Uint8Array, digest: H256 | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes, H256, Bytes]>;
    };
    nodeAuthorization: {
      /**
       * See [`Pallet::add_connection`].
       **/
      addConnection: AugmentedSubmittable<(nodeId: Bytes | string | Uint8Array, connectionId: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * See [`Pallet::add_well_known_node`].
       **/
      addWellKnownNode: AugmentedSubmittable<(nodeId: Bytes | string | Uint8Array, owner: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, MultiAddress]>;
      /**
       * See [`Pallet::remove_connection`].
       **/
      removeConnection: AugmentedSubmittable<(nodeId: Bytes | string | Uint8Array, connectionId: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * See [`Pallet::remove_well_known_node`].
       **/
      removeWellKnownNode: AugmentedSubmittable<(nodeId: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * See [`Pallet::swap_well_known_node`].
       **/
      swapWellKnownNode: AugmentedSubmittable<(removeId: Bytes | string | Uint8Array, addId: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * See [`Pallet::transfer_node`].
       **/
      transferNode: AugmentedSubmittable<(nodeId: Bytes | string | Uint8Array, owner: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, MultiAddress]>;
    };
    preimage: {
      /**
       * See [`Pallet::ensure_updated`].
       **/
      ensureUpdated: AugmentedSubmittable<(hashes: Vec<H256> | (H256 | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>, [Vec<H256>]>;
      /**
       * See [`Pallet::note_preimage`].
       **/
      notePreimage: AugmentedSubmittable<(bytes: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * See [`Pallet::request_preimage`].
       **/
      requestPreimage: AugmentedSubmittable<(hash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256]>;
      /**
       * See [`Pallet::unnote_preimage`].
       **/
      unnotePreimage: AugmentedSubmittable<(hash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256]>;
      /**
       * See [`Pallet::unrequest_preimage`].
       **/
      unrequestPreimage: AugmentedSubmittable<(hash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256]>;
    };
    remark: {
      /**
       * See [`Pallet::store`].
       **/
      store: AugmentedSubmittable<(remark: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
    };
    runtimeUpgrade: {
      /**
       * See [`Pallet::set_code`].
       **/
      setCode: AugmentedSubmittable<(code: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
    };
    scheduler: {
      /**
       * See [`Pallet::cancel`].
       **/
      cancel: AugmentedSubmittable<(when: u32 | AnyNumber | Uint8Array, index: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32, u32]>;
      /**
       * See [`Pallet::cancel_named`].
       **/
      cancelNamed: AugmentedSubmittable<(id: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed]>;
      /**
       * See [`Pallet::cancel_retry`].
       **/
      cancelRetry: AugmentedSubmittable<(task: ITuple<[u32, u32]> | [u32 | AnyNumber | Uint8Array, u32 | AnyNumber | Uint8Array]) => SubmittableExtrinsic<ApiType>, [ITuple<[u32, u32]>]>;
      /**
       * See [`Pallet::cancel_retry_named`].
       **/
      cancelRetryNamed: AugmentedSubmittable<(id: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed]>;
      /**
       * See [`Pallet::schedule`].
       **/
      schedule: AugmentedSubmittable<(when: u32 | AnyNumber | Uint8Array, maybePeriodic: Option<ITuple<[u32, u32]>> | null | Uint8Array | ITuple<[u32, u32]> | [u32 | AnyNumber | Uint8Array, u32 | AnyNumber | Uint8Array], priority: u8 | AnyNumber | Uint8Array, call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32, Option<ITuple<[u32, u32]>>, u8, Call]>;
      /**
       * See [`Pallet::schedule_after`].
       **/
      scheduleAfter: AugmentedSubmittable<(after: u32 | AnyNumber | Uint8Array, maybePeriodic: Option<ITuple<[u32, u32]>> | null | Uint8Array | ITuple<[u32, u32]> | [u32 | AnyNumber | Uint8Array, u32 | AnyNumber | Uint8Array], priority: u8 | AnyNumber | Uint8Array, call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32, Option<ITuple<[u32, u32]>>, u8, Call]>;
      /**
       * See [`Pallet::schedule_named`].
       **/
      scheduleNamed: AugmentedSubmittable<(id: U8aFixed | string | Uint8Array, when: u32 | AnyNumber | Uint8Array, maybePeriodic: Option<ITuple<[u32, u32]>> | null | Uint8Array | ITuple<[u32, u32]> | [u32 | AnyNumber | Uint8Array, u32 | AnyNumber | Uint8Array], priority: u8 | AnyNumber | Uint8Array, call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed, u32, Option<ITuple<[u32, u32]>>, u8, Call]>;
      /**
       * See [`Pallet::schedule_named_after`].
       **/
      scheduleNamedAfter: AugmentedSubmittable<(id: U8aFixed | string | Uint8Array, after: u32 | AnyNumber | Uint8Array, maybePeriodic: Option<ITuple<[u32, u32]>> | null | Uint8Array | ITuple<[u32, u32]> | [u32 | AnyNumber | Uint8Array, u32 | AnyNumber | Uint8Array], priority: u8 | AnyNumber | Uint8Array, call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed, u32, Option<ITuple<[u32, u32]>>, u8, Call]>;
      /**
       * See [`Pallet::set_retry`].
       **/
      setRetry: AugmentedSubmittable<(task: ITuple<[u32, u32]> | [u32 | AnyNumber | Uint8Array, u32 | AnyNumber | Uint8Array], retries: u8 | AnyNumber | Uint8Array, period: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [ITuple<[u32, u32]>, u8, u32]>;
      /**
       * See [`Pallet::set_retry_named`].
       **/
      setRetryNamed: AugmentedSubmittable<(id: U8aFixed | string | Uint8Array, retries: u8 | AnyNumber | Uint8Array, period: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed, u8, u32]>;
    };
    schema: {
      /**
       * See [`Pallet::create`].
       **/
      create: AugmentedSubmittable<(txSchema: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
    };
    session: {
      /**
       * See [`Pallet::purge_keys`].
       **/
      purgeKeys: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * See [`Pallet::set_keys`].
       **/
      setKeys: AugmentedSubmittable<(keys: CordRuntimeSessionKeys | { grandpa?: any; babe?: any; imOnline?: any; authorityDiscovery?: any } | string | Uint8Array, proof: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [CordRuntimeSessionKeys, Bytes]>;
    };
    statement: {
      /**
       * See [`Pallet::add_presentation`].
       **/
      addPresentation: AugmentedSubmittable<(statementId: Bytes | string | Uint8Array, presentationDigest: H256 | string | Uint8Array, presentationType: PalletStatementPresentationTypeOf | 'Other' | 'PDF' | 'JPEG' | 'PNG' | 'GIF' | 'TXT' | 'SVG' | 'JSON' | 'DOCX' | 'XLSX' | 'PPTX' | 'MP3' | 'MP4' | 'XML' | number | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, H256, PalletStatementPresentationTypeOf, Bytes]>;
      /**
       * See [`Pallet::register`].
       **/
      register: AugmentedSubmittable<(digest: H256 | string | Uint8Array, authorization: Bytes | string | Uint8Array, schemaId: Option<Bytes> | null | Uint8Array | Bytes | string) => SubmittableExtrinsic<ApiType>, [H256, Bytes, Option<Bytes>]>;
      /**
       * See [`Pallet::register_batch`].
       **/
      registerBatch: AugmentedSubmittable<(digests: Vec<H256> | (H256 | string | Uint8Array)[], authorization: Bytes | string | Uint8Array, schemaId: Option<Bytes> | null | Uint8Array | Bytes | string) => SubmittableExtrinsic<ApiType>, [Vec<H256>, Bytes, Option<Bytes>]>;
      /**
       * See [`Pallet::remove`].
       **/
      remove: AugmentedSubmittable<(statementId: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * See [`Pallet::remove_presentation`].
       **/
      removePresentation: AugmentedSubmittable<(statementId: Bytes | string | Uint8Array, presentationDigest: H256 | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, H256, Bytes]>;
      /**
       * See [`Pallet::restore`].
       **/
      restore: AugmentedSubmittable<(statementId: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * See [`Pallet::revoke`].
       **/
      revoke: AugmentedSubmittable<(statementId: Bytes | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * See [`Pallet::update`].
       **/
      update: AugmentedSubmittable<(statementId: Bytes | string | Uint8Array, newStatementDigest: H256 | string | Uint8Array, authorization: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, H256, Bytes]>;
    };
    sudo: {
      /**
       * See [`Pallet::remove_key`].
       **/
      removeKey: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * See [`Pallet::set_key`].
       **/
      setKey: AugmentedSubmittable<(updated: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * See [`Pallet::sudo`].
       **/
      sudo: AugmentedSubmittable<(call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Call]>;
      /**
       * See [`Pallet::sudo_as`].
       **/
      sudoAs: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, Call]>;
      /**
       * See [`Pallet::sudo_unchecked_weight`].
       **/
      sudoUncheckedWeight: AugmentedSubmittable<(call: Call | IMethod | string | Uint8Array, weight: SpWeightsWeightV2Weight | { refTime?: any; proofSize?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Call, SpWeightsWeightV2Weight]>;
    };
    system: {
      /**
       * See [`Pallet::apply_authorized_upgrade`].
       **/
      applyAuthorizedUpgrade: AugmentedSubmittable<(code: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * See [`Pallet::authorize_upgrade`].
       **/
      authorizeUpgrade: AugmentedSubmittable<(codeHash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256]>;
      /**
       * See [`Pallet::authorize_upgrade_without_checks`].
       **/
      authorizeUpgradeWithoutChecks: AugmentedSubmittable<(codeHash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256]>;
      /**
       * See [`Pallet::kill_prefix`].
       **/
      killPrefix: AugmentedSubmittable<(prefix: Bytes | string | Uint8Array, subkeys: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, u32]>;
      /**
       * See [`Pallet::kill_storage`].
       **/
      killStorage: AugmentedSubmittable<(keys: Vec<Bytes> | (Bytes | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>, [Vec<Bytes>]>;
      /**
       * See [`Pallet::remark`].
       **/
      remark: AugmentedSubmittable<(remark: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * See [`Pallet::remark_with_event`].
       **/
      remarkWithEvent: AugmentedSubmittable<(remark: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * See [`Pallet::set_code`].
       **/
      setCode: AugmentedSubmittable<(code: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * See [`Pallet::set_code_without_checks`].
       **/
      setCodeWithoutChecks: AugmentedSubmittable<(code: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * See [`Pallet::set_heap_pages`].
       **/
      setHeapPages: AugmentedSubmittable<(pages: u64 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u64]>;
      /**
       * See [`Pallet::set_storage`].
       **/
      setStorage: AugmentedSubmittable<(items: Vec<ITuple<[Bytes, Bytes]>> | ([Bytes | string | Uint8Array, Bytes | string | Uint8Array])[]) => SubmittableExtrinsic<ApiType>, [Vec<ITuple<[Bytes, Bytes]>>]>;
    };
    technicalCommittee: {
      /**
       * See [`Pallet::close`].
       **/
      close: AugmentedSubmittable<(proposalHash: H256 | string | Uint8Array, index: Compact<u32> | AnyNumber | Uint8Array, proposalWeightBound: SpWeightsWeightV2Weight | { refTime?: any; proofSize?: any } | string | Uint8Array, lengthBound: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256, Compact<u32>, SpWeightsWeightV2Weight, Compact<u32>]>;
      /**
       * See [`Pallet::disapprove_proposal`].
       **/
      disapproveProposal: AugmentedSubmittable<(proposalHash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256]>;
      /**
       * See [`Pallet::execute`].
       **/
      execute: AugmentedSubmittable<(proposal: Call | IMethod | string | Uint8Array, lengthBound: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Call, Compact<u32>]>;
      /**
       * See [`Pallet::propose`].
       **/
      propose: AugmentedSubmittable<(threshold: Compact<u32> | AnyNumber | Uint8Array, proposal: Call | IMethod | string | Uint8Array, lengthBound: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u32>, Call, Compact<u32>]>;
      /**
       * See [`Pallet::set_members`].
       **/
      setMembers: AugmentedSubmittable<(newMembers: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[], prime: Option<AccountId32> | null | Uint8Array | AccountId32 | string, oldCount: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Vec<AccountId32>, Option<AccountId32>, u32]>;
      /**
       * See [`Pallet::vote`].
       **/
      vote: AugmentedSubmittable<(proposal: H256 | string | Uint8Array, index: Compact<u32> | AnyNumber | Uint8Array, approve: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256, Compact<u32>, bool]>;
    };
    technicalMembership: {
      /**
       * See [`Pallet::add_member`].
       **/
      addMember: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * See [`Pallet::change_key`].
       **/
      changeKey: AugmentedSubmittable<(updated: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * See [`Pallet::clear_prime`].
       **/
      clearPrime: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * See [`Pallet::remove_member`].
       **/
      removeMember: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * See [`Pallet::reset_members`].
       **/
      resetMembers: AugmentedSubmittable<(members: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>, [Vec<AccountId32>]>;
      /**
       * See [`Pallet::set_prime`].
       **/
      setPrime: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * See [`Pallet::swap_member`].
       **/
      swapMember: AugmentedSubmittable<(remove: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, add: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, MultiAddress]>;
    };
    timestamp: {
      /**
       * See [`Pallet::set`].
       **/
      set: AugmentedSubmittable<(now: Compact<u64> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u64>]>;
    };
    utility: {
      /**
       * See [`Pallet::as_derivative`].
       **/
      asDerivative: AugmentedSubmittable<(index: u16 | AnyNumber | Uint8Array, call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [u16, Call]>;
      /**
       * See [`Pallet::batch`].
       **/
      batch: AugmentedSubmittable<(calls: Vec<Call> | (Call | IMethod | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>, [Vec<Call>]>;
      /**
       * See [`Pallet::batch_all`].
       **/
      batchAll: AugmentedSubmittable<(calls: Vec<Call> | (Call | IMethod | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>, [Vec<Call>]>;
      /**
       * See [`Pallet::dispatch_as`].
       **/
      dispatchAs: AugmentedSubmittable<(asOrigin: CordRuntimeOriginCaller | { system: any } | { Void: any } | { Council: any } | { TechnicalCommittee: any } | { Did: any } | string | Uint8Array, call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [CordRuntimeOriginCaller, Call]>;
      /**
       * See [`Pallet::force_batch`].
       **/
      forceBatch: AugmentedSubmittable<(calls: Vec<Call> | (Call | IMethod | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>, [Vec<Call>]>;
      /**
       * See [`Pallet::with_weight`].
       **/
      withWeight: AugmentedSubmittable<(call: Call | IMethod | string | Uint8Array, weight: SpWeightsWeightV2Weight | { refTime?: any; proofSize?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Call, SpWeightsWeightV2Weight]>;
    };
  } // AugmentedSubmittables
} // declare module
