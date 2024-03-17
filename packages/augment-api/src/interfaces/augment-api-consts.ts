// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/consts';

import type { ApiTypes, AugmentedConst } from '@polkadot/api-base/types';
import type { u128, u16, u32, u64 } from '@polkadot/types-codec';
import type { FrameSystemLimitsBlockLength, FrameSystemLimitsBlockWeights, SpVersionRuntimeVersion, SpWeightsRuntimeDbWeight, SpWeightsWeightV2Weight } from '@polkadot/types/lookup';

export type __AugmentedConst<ApiType extends ApiTypes> = AugmentedConst<ApiType>;

declare module '@polkadot/api-base/types/consts' {
  interface AugmentedConsts<ApiType extends ApiTypes> {
    asset: {
      maxAssetDistribution: u32 & AugmentedConst<ApiType>;
      maxEncodedValueLength: u32 & AugmentedConst<ApiType>;
    };
    babe: {
      /**
       * The amount of time, in slots, that each epoch should last.
       * NOTE: Currently it is not possible to change the epoch duration after
       * the chain has started. Attempting to do so will brick block production.
       **/
      epochDuration: u64 & AugmentedConst<ApiType>;
      /**
       * The expected average block time at which BABE should be creating
       * blocks. Since BABE is probabilistic it is not trivial to figure out
       * what the expected average block time should be based on the slot
       * duration and the security parameter `c` (where `1 - c` represents
       * the probability of a slot being empty).
       **/
      expectedBlockTime: u64 & AugmentedConst<ApiType>;
      /**
       * Max number of authorities allowed
       **/
      maxAuthorities: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum number of nominators for each validator.
       **/
      maxNominators: u32 & AugmentedConst<ApiType>;
    };
    balances: {
      /**
       * The minimum amount required to keep an account open. MUST BE GREATER THAN ZERO!
       * 
       * If you *really* need it to be zero, you can enable the feature `insecure_zero_ed` for
       * this pallet. However, you do so at your own risk: this will open up a major DoS vector.
       * In case you have multiple sources of provider references, you may also get unexpected
       * behaviour if you set this to zero.
       * 
       * Bottom line: Do yourself a favour and make it at least one!
       **/
      existentialDeposit: u128 & AugmentedConst<ApiType>;
      /**
       * The maximum number of individual freeze locks that can exist on an account at any time.
       **/
      maxFreezes: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum number of locks that should exist on an account.
       * Not strictly enforced, but used for weight estimation.
       **/
      maxLocks: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum number of named reserves that can exist on an account.
       **/
      maxReserves: u32 & AugmentedConst<ApiType>;
    };
    chainSpace: {
      maxSpaceDelegates: u32 & AugmentedConst<ApiType>;
    };
    council: {
      /**
       * The maximum weight of a dispatch call that can be proposed and
       * executed.
       **/
      maxProposalWeight: SpWeightsWeightV2Weight & AugmentedConst<ApiType>;
    };
    did: {
      /**
       * The maximum number of blocks a DID-authorized operation is
       * considered valid after its creation.
       **/
      maxBlocksTxValidity: u32 & AugmentedConst<ApiType>;
      /**
       * Maximum number of key agreement keys that can be added in a creation
       * operation.
       **/
      maxNewKeyAgreementKeys: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum number of services that can be stored under a DID.
       **/
      maxNumberOfServicesPerDid: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum number of a types description for a service endpoint.
       **/
      maxNumberOfTypesPerService: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum number of a URLs for a service endpoint.
       **/
      maxNumberOfUrlsPerService: u32 & AugmentedConst<ApiType>;
      /**
       * Maximum number of total public keys which can be stored per DID key
       * identifier. This includes the ones currently used for
       * authentication, key agreement, assertion, and delegation.
       **/
      maxPublicKeysPerDid: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum length of a service ID.
       **/
      maxServiceIdLength: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum length of a service type description.
       **/
      maxServiceTypeLength: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum length of a service URL.
       **/
      maxServiceUrlLength: u32 & AugmentedConst<ApiType>;
      /**
       * Maximum number of total key agreement keys that can be stored for a
       * DID subject.
       * 
       * Should be greater than `MaxNewKeyAgreementKeys`.
       **/
      maxTotalKeyAgreementKeys: u32 & AugmentedConst<ApiType>;
    };
    didName: {
      /**
       * The max encoded length of a name.
       **/
      maxNameLength: u32 & AugmentedConst<ApiType>;
      /**
       * The max encoded length of a prefix.
       **/
      maxPrefixLength: u32 & AugmentedConst<ApiType>;
      /**
       * The min encoded length of a name.
       **/
      minNameLength: u32 & AugmentedConst<ApiType>;
    };
    grandpa: {
      /**
       * Max Authorities in use
       **/
      maxAuthorities: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum number of nominators for each validator.
       **/
      maxNominators: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum number of entries to keep in the set id to session index mapping.
       * 
       * Since the `SetIdSession` map is only used for validating equivocations this
       * value should relate to the bonding duration of whatever staking system is
       * being used (if any). If equivocation handling is not enabled then this value
       * can be zero.
       **/
      maxSetIdSessionEntries: u64 & AugmentedConst<ApiType>;
    };
    identifier: {
      /**
       * The maximum number of activity for a statement.
       **/
      maxEventsHistory: u32 & AugmentedConst<ApiType>;
    };
    identity: {
      /**
       * Maxmimum number of registrars allowed in the system. Needed to bound
       * the complexity of, e.g., updating judgements.
       **/
      maxRegistrars: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum number of sub-accounts allowed per identified account.
       **/
      maxSubAccounts: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum length of a suffix.
       **/
      maxSuffixLength: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum length of a username, including its suffix and any system-added delimiters.
       **/
      maxUsernameLength: u32 & AugmentedConst<ApiType>;
      /**
       * The number of blocks within which a username grant must be accepted.
       **/
      pendingUsernameExpiration: u32 & AugmentedConst<ApiType>;
    };
    imOnline: {
      /**
       * A configuration for base priority of unsigned transactions.
       * 
       * This is exposed so that it can be tuned for particular runtime, when
       * multiple pallets send unsigned transactions.
       **/
      unsignedPriority: u64 & AugmentedConst<ApiType>;
    };
    indices: {
      /**
       * The deposit needed for reserving an index.
       **/
      deposit: u128 & AugmentedConst<ApiType>;
    };
    multisig: {
      /**
       * The base amount of currency needed to reserve for creating a multisig execution or to
       * store a dispatch call for later.
       * 
       * This is held for an additional storage item whose value size is
       * `4 + sizeof((BlockNumber, Balance, AccountId))` bytes and whose key size is
       * `32 + sizeof(AccountId)` bytes.
       **/
      depositBase: u128 & AugmentedConst<ApiType>;
      /**
       * The amount of currency needed per unit threshold when creating a multisig execution.
       * 
       * This is held for adding 32 bytes more into a pre-existing storage value.
       **/
      depositFactor: u128 & AugmentedConst<ApiType>;
      /**
       * The maximum amount of signatories allowed in the multisig.
       **/
      maxSignatories: u32 & AugmentedConst<ApiType>;
    };
    networkMembership: {
      maxMembersPerBlock: u32 & AugmentedConst<ApiType>;
      /**
       * Maximum life span of a non-renewable membership (in number of
       * blocks)
       **/
      membershipPeriod: u32 & AugmentedConst<ApiType>;
    };
    networkScore: {
      maxEncodedValueLength: u32 & AugmentedConst<ApiType>;
      maxRatingValue: u32 & AugmentedConst<ApiType>;
    };
    nodeAuthorization: {
      /**
       * The maximum length in bytes of PeerId
       **/
      maxNodeIdLength: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum length in bytes of PeerId
       **/
      maxPeerIdLength: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum number of well known nodes that are allowed to set
       **/
      maxWellKnownNodes: u32 & AugmentedConst<ApiType>;
    };
    scheduler: {
      /**
       * The maximum weight that may be scheduled per block for any dispatchables.
       **/
      maximumWeight: SpWeightsWeightV2Weight & AugmentedConst<ApiType>;
      /**
       * The maximum number of scheduled calls in the queue for a single block.
       * 
       * NOTE:
       * + Dependent pallets' benchmarks might require a higher limit for the setting. Set a
       * higher limit under `runtime-benchmarks` feature.
       **/
      maxScheduledPerBlock: u32 & AugmentedConst<ApiType>;
    };
    schema: {
      maxEncodedSchemaLength: u32 & AugmentedConst<ApiType>;
    };
    statement: {
      /**
       * Maximum entires supported per batch call
       **/
      maxDigestsPerBatch: u16 & AugmentedConst<ApiType>;
      /**
       * Maximum removals per call
       **/
      maxRemoveEntries: u16 & AugmentedConst<ApiType>;
    };
    system: {
      /**
       * Maximum number of block number to block hash mappings to keep (oldest pruned first).
       **/
      blockHashCount: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum length of a block (in bytes).
       **/
      blockLength: FrameSystemLimitsBlockLength & AugmentedConst<ApiType>;
      /**
       * Block & extrinsics weights: base values and limits.
       **/
      blockWeights: FrameSystemLimitsBlockWeights & AugmentedConst<ApiType>;
      /**
       * The weight of runtime database operations the runtime can invoke.
       **/
      dbWeight: SpWeightsRuntimeDbWeight & AugmentedConst<ApiType>;
      /**
       * The designated SS58 prefix of this chain.
       * 
       * This replaces the "ss58Format" property declared in the chain spec. Reason is
       * that the runtime should know about the prefix in order to make use of it as
       * an identifier of the chain.
       **/
      ss58Prefix: u16 & AugmentedConst<ApiType>;
      /**
       * Get the chain's current version.
       **/
      version: SpVersionRuntimeVersion & AugmentedConst<ApiType>;
    };
    technicalCommittee: {
      /**
       * The maximum weight of a dispatch call that can be proposed and
       * executed.
       **/
      maxProposalWeight: SpWeightsWeightV2Weight & AugmentedConst<ApiType>;
    };
    timestamp: {
      /**
       * The minimum period between blocks.
       * 
       * Be aware that this is different to the *expected* period that the block production
       * apparatus provides. Your chosen consensus system will generally work with this to
       * determine a sensible block time. For example, in the Aura pallet it will be double this
       * period on default settings.
       **/
      minimumPeriod: u64 & AugmentedConst<ApiType>;
    };
    utility: {
      /**
       * The limit on the number of batched calls.
       **/
      batchedCallsLimit: u32 & AugmentedConst<ApiType>;
    };
  } // AugmentedConsts
} // declare module
