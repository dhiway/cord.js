// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/storage';

import type { ApiTypes, AugmentedQuery, QueryableStorageEntry } from '@polkadot/api-base/types';
import type { Data } from '@polkadot/types';
import type { BTreeSet, Bytes, Null, Option, U8aFixed, Vec, bool, u128, u32, u64 } from '@polkadot/types-codec';
import type { AnyNumber, ITuple } from '@polkadot/types-codec/types';
import type { OpaquePeerId } from '@polkadot/types/interfaces/imOnline';
import type { AccountId32, Call, H256 } from '@polkadot/types/interfaces/runtime';
import type { CordIdentifierEventEntry, CordIdentifierIdentifierTypeOf, CordLoomRuntimeSessionKeys, FrameSupportDispatchPerDispatchClassWeight, FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensMiscIdAmountRuntimeFreezeReason, FrameSupportTokensMiscIdAmountRuntimeHoldReason, FrameSystemAccountInfo, FrameSystemCodeUpgradeAuthorization, FrameSystemEventRecord, FrameSystemLastRuntimeUpgradeInfo, FrameSystemPhase, PalletAssetConversionPoolInfo, PalletAssetsApproval, PalletAssetsAssetAccount, PalletAssetsAssetDetails, PalletAssetsAssetMetadata, PalletBalancesAccountData, PalletBalancesBalanceLock, PalletBalancesReserveData, PalletChainSpaceSpaceAuthorization, PalletChainSpaceSpaceDetails, PalletCollectiveVotes, PalletContractsStorageContractInfo, PalletContractsStorageDeletionQueueManager, PalletContractsWasmCodeInfo, PalletDidDidDetails, PalletDidNameDidNameDidNameOwnership, PalletDidServiceEndpointsDidEndpoint, PalletEntriesRegistryEntryDetails, PalletGrandpaStoredPendingChange, PalletGrandpaStoredState, PalletIdentityAuthorityProperties, PalletIdentityRegistrarInfo, PalletIdentityRegistration, PalletImOnlineSr25519AppSr25519Public, PalletMultisigMultisig, PalletNetworkMembershipMemberData, PalletNetworkScoreAggregatedEntryOf, PalletNetworkScoreRatingEntry, PalletNetworkScoreRatingTypeOf, PalletNodeAuthorizationNodeInfo, PalletPreimageOldRequestStatus, PalletPreimageRequestStatus, PalletRegistriesRegistryAuthorization, PalletRegistriesRegistryDetails, PalletSchedulerRetryConfig, PalletSchedulerScheduled, PalletSchemaSchemaEntry, PalletStatementStatementDetails, PalletStatementStatementEntryStatus, PalletStatementStatementPresentationDetails, PalletTransactionPaymentReleases, PalletTreasuryProposal, PalletTreasurySpendStatus, SpAuthorityDiscoveryAppPublic, SpConsensusBabeAppPublic, SpConsensusBabeBabeEpochConfiguration, SpConsensusBabeDigestsNextConfigDescriptor, SpConsensusBabeDigestsPreDigest, SpConsensusGrandpaAppPublic, SpCoreCryptoKeyTypeId, SpRuntimeDigest, SpStakingOffenceOffenceDetails } from '@polkadot/types/lookup';
import type { Observable } from '@polkadot/types/types';

export type __AugmentedQuery<ApiType extends ApiTypes> = AugmentedQuery<ApiType, () => unknown>;
export type __QueryableStorageEntry<ApiType extends ApiTypes> = QueryableStorageEntry<ApiType>;

declare module '@polkadot/api-base/types/storage' {
  interface AugmentedQueries<ApiType extends ApiTypes> {
    assetConversion: {
      /**
       * Stores the `PoolAssetId` that is going to be used for the next lp token.
       * This gets incremented whenever a new lp pool is created.
       **/
      nextPoolAssetId: AugmentedQuery<ApiType, () => Observable<Option<u32>>, []>;
      /**
       * Map from `PoolAssetId` to `PoolInfo`. This establishes whether a pool has been officially
       * created rather than people sending tokens directly to a pool's public account.
       **/
      pools: AugmentedQuery<ApiType, (arg: ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]> | [FrameSupportTokensFungibleUnionOfNativeOrWithId | { Native: any } | { WithId: any } | string | Uint8Array, FrameSupportTokensFungibleUnionOfNativeOrWithId | { Native: any } | { WithId: any } | string | Uint8Array]) => Observable<Option<PalletAssetConversionPoolInfo>>, [ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]>]>;
    };
    assets: {
      /**
       * The holdings of a specific account for a specific asset.
       **/
      account: AugmentedQuery<ApiType, (arg1: u32 | AnyNumber | Uint8Array, arg2: AccountId32 | string | Uint8Array) => Observable<Option<PalletAssetsAssetAccount>>, [u32, AccountId32]>;
      /**
       * Approved balance transfers. First balance is the amount approved for transfer. Second
       * is the amount of `T::Currency` reserved for storing this.
       * First key is the asset ID, second key is the owner and third key is the delegate.
       **/
      approvals: AugmentedQuery<ApiType, (arg1: u32 | AnyNumber | Uint8Array, arg2: AccountId32 | string | Uint8Array, arg3: AccountId32 | string | Uint8Array) => Observable<Option<PalletAssetsApproval>>, [u32, AccountId32, AccountId32]>;
      /**
       * Details of an asset.
       **/
      asset: AugmentedQuery<ApiType, (arg: u32 | AnyNumber | Uint8Array) => Observable<Option<PalletAssetsAssetDetails>>, [u32]>;
      /**
       * Metadata of an asset.
       **/
      metadata: AugmentedQuery<ApiType, (arg: u32 | AnyNumber | Uint8Array) => Observable<PalletAssetsAssetMetadata>, [u32]>;
      /**
       * The asset ID enforced for the next asset creation, if any present. Otherwise, this storage
       * item has no effect.
       * 
       * This can be useful for setting up constraints for IDs of the new assets. For example, by
       * providing an initial [`NextAssetId`] and using the [`crate::AutoIncAssetId`] callback, an
       * auto-increment model can be applied to all new asset IDs.
       * 
       * The initial next asset ID can be set using the [`GenesisConfig`] or the
       * [SetNextAssetId](`migration::next_asset_id::SetNextAssetId`) migration.
       **/
      nextAssetId: AugmentedQuery<ApiType, () => Observable<Option<u32>>, []>;
    };
    authorityDiscovery: {
      /**
       * Keys of the current authority set.
       **/
      keys: AugmentedQuery<ApiType, () => Observable<Vec<SpAuthorityDiscoveryAppPublic>>, []>;
      /**
       * Keys of the next authority set.
       **/
      nextKeys: AugmentedQuery<ApiType, () => Observable<Vec<SpAuthorityDiscoveryAppPublic>>, []>;
    };
    authorityMembership: {
      blackList: AugmentedQuery<ApiType, () => Observable<Vec<AccountId32>>, []>;
      /**
       * list incoming authorities
       **/
      incomingAuthorities: AugmentedQuery<ApiType, () => Observable<Vec<AccountId32>>, []>;
      /**
       * maps member id to member data
       **/
      members: AugmentedQuery<ApiType, () => Observable<Vec<AccountId32>>, []>;
      /**
       * list outgoing authorities
       **/
      outgoingAuthorities: AugmentedQuery<ApiType, () => Observable<Vec<AccountId32>>, []>;
    };
    authorship: {
      /**
       * Author of current block.
       **/
      author: AugmentedQuery<ApiType, () => Observable<Option<AccountId32>>, []>;
    };
    babe: {
      /**
       * Current epoch authorities.
       **/
      authorities: AugmentedQuery<ApiType, () => Observable<Vec<ITuple<[SpConsensusBabeAppPublic, u64]>>>, []>;
      /**
       * This field should always be populated during block processing unless
       * secondary plain slots are enabled (which don't contain a VRF output).
       * 
       * It is set in `on_finalize`, before it will contain the value from the last block.
       **/
      authorVrfRandomness: AugmentedQuery<ApiType, () => Observable<Option<U8aFixed>>, []>;
      /**
       * Current slot number.
       **/
      currentSlot: AugmentedQuery<ApiType, () => Observable<u64>, []>;
      /**
       * The configuration for the current epoch. Should never be `None` as it is initialized in
       * genesis.
       **/
      epochConfig: AugmentedQuery<ApiType, () => Observable<Option<SpConsensusBabeBabeEpochConfiguration>>, []>;
      /**
       * Current epoch index.
       **/
      epochIndex: AugmentedQuery<ApiType, () => Observable<u64>, []>;
      /**
       * The block numbers when the last and current epoch have started, respectively `N-1` and
       * `N`.
       * NOTE: We track this is in order to annotate the block number when a given pool of
       * entropy was fixed (i.e. it was known to chain observers). Since epochs are defined in
       * slots, which may be skipped, the block numbers may not line up with the slot numbers.
       **/
      epochStart: AugmentedQuery<ApiType, () => Observable<ITuple<[u32, u32]>>, []>;
      /**
       * The slot at which the first epoch actually started. This is 0
       * until the first block of the chain.
       **/
      genesisSlot: AugmentedQuery<ApiType, () => Observable<u64>, []>;
      /**
       * Temporary value (cleared at block finalization) which is `Some`
       * if per-block initialization has already been called for current block.
       **/
      initialized: AugmentedQuery<ApiType, () => Observable<Option<Option<SpConsensusBabeDigestsPreDigest>>>, []>;
      /**
       * How late the current block is compared to its parent.
       * 
       * This entry is populated as part of block execution and is cleaned up
       * on block finalization. Querying this storage entry outside of block
       * execution context should always yield zero.
       **/
      lateness: AugmentedQuery<ApiType, () => Observable<u32>, []>;
      /**
       * Next epoch authorities.
       **/
      nextAuthorities: AugmentedQuery<ApiType, () => Observable<Vec<ITuple<[SpConsensusBabeAppPublic, u64]>>>, []>;
      /**
       * The configuration for the next epoch, `None` if the config will not change
       * (you can fallback to `EpochConfig` instead in that case).
       **/
      nextEpochConfig: AugmentedQuery<ApiType, () => Observable<Option<SpConsensusBabeBabeEpochConfiguration>>, []>;
      /**
       * Next epoch randomness.
       **/
      nextRandomness: AugmentedQuery<ApiType, () => Observable<U8aFixed>, []>;
      /**
       * Pending epoch configuration change that will be applied when the next epoch is enacted.
       **/
      pendingEpochConfigChange: AugmentedQuery<ApiType, () => Observable<Option<SpConsensusBabeDigestsNextConfigDescriptor>>, []>;
      /**
       * The epoch randomness for the *current* epoch.
       * 
       * # Security
       * 
       * This MUST NOT be used for gambling, as it can be influenced by a
       * malicious validator in the short term. It MAY be used in many
       * cryptographic protocols, however, so long as one remembers that this
       * (like everything else on-chain) it is public. For example, it can be
       * used where a number is needed that cannot have been chosen by an
       * adversary, for purposes such as public-coin zero-knowledge proofs.
       **/
      randomness: AugmentedQuery<ApiType, () => Observable<U8aFixed>, []>;
      /**
       * Randomness under construction.
       * 
       * We make a trade-off between storage accesses and list length.
       * We store the under-construction randomness in segments of up to
       * `UNDER_CONSTRUCTION_SEGMENT_LENGTH`.
       * 
       * Once a segment reaches this length, we begin the next one.
       * We reset all segments and return to `0` at the beginning of every
       * epoch.
       **/
      segmentIndex: AugmentedQuery<ApiType, () => Observable<u32>, []>;
      /**
       * A list of the last 100 skipped epochs and the corresponding session index
       * when the epoch was skipped.
       * 
       * This is only used for validating equivocation proofs. An equivocation proof
       * must contains a key-ownership proof for a given session, therefore we need a
       * way to tie together sessions and epoch indices, i.e. we need to validate that
       * a validator was the owner of a given key on a given session, and what the
       * active epoch index was during that session.
       **/
      skippedEpochs: AugmentedQuery<ApiType, () => Observable<Vec<ITuple<[u64, u32]>>>, []>;
      /**
       * TWOX-NOTE: `SegmentIndex` is an increasing integer, so this is okay.
       **/
      underConstruction: AugmentedQuery<ApiType, (arg: u32 | AnyNumber | Uint8Array) => Observable<Vec<U8aFixed>>, [u32]>;
    };
    balances: {
      /**
       * The Balances pallet example of storing the balance of an account.
       * 
       * # Example
       * 
       * ```nocompile
       * impl pallet_balances::Config for Runtime {
       * type AccountStore = StorageMapShim<Self::Account<Runtime>, frame_system::Provider<Runtime>, AccountId, Self::AccountData<Balance>>
       * }
       * ```
       * 
       * You can also store the balance of an account in the `System` pallet.
       * 
       * # Example
       * 
       * ```nocompile
       * impl pallet_balances::Config for Runtime {
       * type AccountStore = System
       * }
       * ```
       * 
       * But this comes with tradeoffs, storing account balances in the system pallet stores
       * `frame_system` data alongside the account data contrary to storing account balances in the
       * `Balances` pallet, which uses a `StorageMap` to store balances data only.
       * NOTE: This is only used in the case that this pallet is used to store balances.
       **/
      account: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<PalletBalancesAccountData>, [AccountId32]>;
      /**
       * Freeze locks on account balances.
       **/
      freezes: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<Vec<FrameSupportTokensMiscIdAmountRuntimeFreezeReason>>, [AccountId32]>;
      /**
       * Holds on account balances.
       **/
      holds: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<Vec<FrameSupportTokensMiscIdAmountRuntimeHoldReason>>, [AccountId32]>;
      /**
       * The total units of outstanding deactivated balance in the system.
       **/
      inactiveIssuance: AugmentedQuery<ApiType, () => Observable<u128>, []>;
      /**
       * Any liquidity locks on some account balances.
       * NOTE: Should only be accessed when setting, changing and freeing a lock.
       * 
       * Use of locks is deprecated in favour of freezes. See `https://github.com/paritytech/substrate/pull/12951/`
       **/
      locks: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<Vec<PalletBalancesBalanceLock>>, [AccountId32]>;
      /**
       * Named reserves on some account balances.
       * 
       * Use of reserves is deprecated in favour of holds. See `https://github.com/paritytech/substrate/pull/12951/`
       **/
      reserves: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<Vec<PalletBalancesReserveData>>, [AccountId32]>;
      /**
       * The total units issued in the system.
       **/
      totalIssuance: AugmentedQuery<ApiType, () => Observable<u128>, []>;
    };
    chainSpace: {
      /**
       * Space authorizations stored on-chain.
       * It maps from an identifier to delegates.
       **/
      authorizations: AugmentedQuery<ApiType, (arg: Bytes | string | Uint8Array) => Observable<Option<PalletChainSpaceSpaceAuthorization>>, [Bytes]>;
      /**
       * Space delegates stored on chain.
       * It maps from an identifier to a  bounded vec of delegates and
       * permissions.
       **/
      delegates: AugmentedQuery<ApiType, (arg: Bytes | string | Uint8Array) => Observable<Vec<AccountId32>>, [Bytes]>;
      /**
       * Space information stored on chain.
       * It maps from an identifier to its details.
       **/
      spaces: AugmentedQuery<ApiType, (arg: Bytes | string | Uint8Array) => Observable<Option<PalletChainSpaceSpaceDetails>>, [Bytes]>;
    };
    contracts: {
      /**
       * A mapping from a contract's code hash to its code info.
       **/
      codeInfoOf: AugmentedQuery<ApiType, (arg: H256 | string | Uint8Array) => Observable<Option<PalletContractsWasmCodeInfo>>, [H256]>;
      /**
       * The code associated with a given account.
       * 
       * TWOX-NOTE: SAFE since `AccountId` is a secure hash.
       **/
      contractInfoOf: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<Option<PalletContractsStorageContractInfo>>, [AccountId32]>;
      /**
       * Evicted contracts that await child trie deletion.
       * 
       * Child trie deletion is a heavy operation depending on the amount of storage items
       * stored in said trie. Therefore this operation is performed lazily in `on_idle`.
       **/
      deletionQueue: AugmentedQuery<ApiType, (arg: u32 | AnyNumber | Uint8Array) => Observable<Option<Bytes>>, [u32]>;
      /**
       * A pair of monotonic counters used to track the latest contract marked for deletion
       * and the latest deleted contract in queue.
       **/
      deletionQueueCounter: AugmentedQuery<ApiType, () => Observable<PalletContractsStorageDeletionQueueManager>, []>;
      /**
       * A migration can span across multiple blocks. This storage defines a cursor to track the
       * progress of the migration, enabling us to resume from the last completed position.
       **/
      migrationInProgress: AugmentedQuery<ApiType, () => Observable<Option<Bytes>>, []>;
      /**
       * This is a **monotonic** counter incremented on contract instantiation.
       * 
       * This is used in order to generate unique trie ids for contracts.
       * The trie id of a new contract is calculated from hash(account_id, nonce).
       * The nonce is required because otherwise the following sequence would lead to
       * a possible collision of storage:
       * 
       * 1. Create a new contract.
       * 2. Terminate the contract.
       * 3. Immediately recreate the contract with the same account_id.
       * 
       * This is bad because the contents of a trie are deleted lazily and there might be
       * storage of the old instantiation still in it when the new contract is created. Please
       * note that we can't replace the counter by the block number because the sequence above
       * can happen in the same block. We also can't keep the account counter in memory only
       * because storage is the only way to communicate across different extrinsics in the
       * same block.
       * 
       * # Note
       * 
       * Do not use it to determine the number of contracts. It won't be decremented if
       * a contract is destroyed.
       **/
      nonce: AugmentedQuery<ApiType, () => Observable<u64>, []>;
      /**
       * A mapping from a contract's code hash to its code.
       **/
      pristineCode: AugmentedQuery<ApiType, (arg: H256 | string | Uint8Array) => Observable<Option<Bytes>>, [H256]>;
    };
    council: {
      /**
       * The current members of the collective. This is stored sorted (just by value).
       **/
      members: AugmentedQuery<ApiType, () => Observable<Vec<AccountId32>>, []>;
      /**
       * The prime member that helps determine the default vote behavior in case of abstentions.
       **/
      prime: AugmentedQuery<ApiType, () => Observable<Option<AccountId32>>, []>;
      /**
       * Proposals so far.
       **/
      proposalCount: AugmentedQuery<ApiType, () => Observable<u32>, []>;
      /**
       * Actual proposal for a given hash, if it's current.
       **/
      proposalOf: AugmentedQuery<ApiType, (arg: H256 | string | Uint8Array) => Observable<Option<Call>>, [H256]>;
      /**
       * The hashes of the active proposals.
       **/
      proposals: AugmentedQuery<ApiType, () => Observable<Vec<H256>>, []>;
      /**
       * Votes on a given proposal, if it is ongoing.
       **/
      voting: AugmentedQuery<ApiType, (arg: H256 | string | Uint8Array) => Observable<Option<PalletCollectiveVotes>>, [H256]>;
    };
    councilMembership: {
      /**
       * The current membership, stored as an ordered Vec.
       **/
      members: AugmentedQuery<ApiType, () => Observable<Vec<AccountId32>>, []>;
      /**
       * The current prime member, if one exists.
       **/
      prime: AugmentedQuery<ApiType, () => Observable<Option<AccountId32>>, []>;
    };
    did: {
      /**
       * DIDs stored on chain.
       * 
       * It maps from a DID identifier to the DID details.
       **/
      did: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<Option<PalletDidDidDetails>>, [AccountId32]>;
      /**
       * The set of DIDs that have been deleted and cannot therefore be created
       * again for security reasons.
       * 
       * It maps from a DID identifier to a unit tuple, for the sake of tracking
       * DID identifiers.
       **/
      didBlacklist: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<Option<Null>>, [AccountId32]>;
      /**
       * Counter of service endpoints for each DID.
       * 
       * It maps from (DID identifier) to a 32-bit counter.
       **/
      didEndpointsCount: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<u32>, [AccountId32]>;
      /**
       * Service endpoints associated with DIDs.
       * 
       * It maps from (DID identifier, service ID) to the service details.
       **/
      serviceEndpoints: AugmentedQuery<ApiType, (arg1: AccountId32 | string | Uint8Array, arg2: Bytes | string | Uint8Array) => Observable<Option<PalletDidServiceEndpointsDidEndpoint>>, [AccountId32, Bytes]>;
    };
    didName: {
      /**
       * Map of name -> ().
       * 
       * If a name key is present, the name is currently banned.
       **/
      banned: AugmentedQuery<ApiType, (arg: Bytes | string | Uint8Array) => Observable<Option<Null>>, [Bytes]>;
      /**
       * Map of owner -> name.
       **/
      names: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<Option<Bytes>>, [AccountId32]>;
      /**
       * Map of name -> ownership details.
       **/
      owner: AugmentedQuery<ApiType, (arg: Bytes | string | Uint8Array) => Observable<Option<PalletDidNameDidNameDidNameOwnership>>, [Bytes]>;
    };
    entries: {
      /**
       * Storage for Registry Entries.
       * It maps Registry Entry Identifier to Registry Entry Details.
       **/
      registryEntries: AugmentedQuery<ApiType, (arg: Bytes | string | Uint8Array) => Observable<Option<PalletEntriesRegistryEntryDetails>>, [Bytes]>;
    };
    grandpa: {
      /**
       * The current list of authorities.
       **/
      authorities: AugmentedQuery<ApiType, () => Observable<Vec<ITuple<[SpConsensusGrandpaAppPublic, u64]>>>, []>;
      /**
       * The number of changes (both in terms of keys and underlying economic responsibilities)
       * in the "set" of Grandpa validators from genesis.
       **/
      currentSetId: AugmentedQuery<ApiType, () => Observable<u64>, []>;
      /**
       * next block number where we can force a change.
       **/
      nextForced: AugmentedQuery<ApiType, () => Observable<Option<u32>>, []>;
      /**
       * Pending change: (signaled at, scheduled change).
       **/
      pendingChange: AugmentedQuery<ApiType, () => Observable<Option<PalletGrandpaStoredPendingChange>>, []>;
      /**
       * A mapping from grandpa set ID to the index of the *most recent* session for which its
       * members were responsible.
       * 
       * This is only used for validating equivocation proofs. An equivocation proof must
       * contains a key-ownership proof for a given session, therefore we need a way to tie
       * together sessions and GRANDPA set ids, i.e. we need to validate that a validator
       * was the owner of a given key on a given session, and what the active set ID was
       * during that session.
       * 
       * TWOX-NOTE: `SetId` is not under user control.
       **/
      setIdSession: AugmentedQuery<ApiType, (arg: u64 | AnyNumber | Uint8Array) => Observable<Option<u32>>, [u64]>;
      /**
       * `true` if we are currently stalled.
       **/
      stalled: AugmentedQuery<ApiType, () => Observable<Option<ITuple<[u32, u32]>>>, []>;
      /**
       * State of the current authority set.
       **/
      state: AugmentedQuery<ApiType, () => Observable<PalletGrandpaStoredState>, []>;
    };
    historical: {
      /**
       * Mapping from historical session indices to session-data root hash and validator count.
       **/
      historicalSessions: AugmentedQuery<ApiType, (arg: u32 | AnyNumber | Uint8Array) => Observable<Option<ITuple<[H256, u32]>>>, [u32]>;
      /**
       * The range of historical sessions we store. [first, last)
       **/
      storedRange: AugmentedQuery<ApiType, () => Observable<Option<ITuple<[u32, u32]>>>, []>;
    };
    identifier: {
      identifiers: AugmentedQuery<ApiType, (arg1: Bytes | string | Uint8Array, arg2: CordIdentifierIdentifierTypeOf | 'Asset' | 'Auth' | 'ChainSpace' | 'Did' | 'Rating' | 'Registry' | 'Statement' | 'Schema' | 'Template' | 'Registries' | 'Entries' | 'RegistryAuthorization' | number | Uint8Array) => Observable<Option<Vec<CordIdentifierEventEntry>>>, [Bytes, CordIdentifierIdentifierTypeOf]>;
    };
    identity: {
      /**
       * Reverse lookup from `username` to the `AccountId` that has registered it. The value should
       * be a key in the `IdentityOf` map, but it may not if the user has cleared their identity.
       * 
       * Multiple usernames may map to the same `AccountId`, but `IdentityOf` will only map to one
       * primary username.
       **/
      accountOfUsername: AugmentedQuery<ApiType, (arg: Bytes | string | Uint8Array) => Observable<Option<AccountId32>>, [Bytes]>;
      /**
       * Information that is pertinent to identify the entity behind an account.
       **/
      identityOf: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<Option<ITuple<[PalletIdentityRegistration, Option<Bytes>]>>>, [AccountId32]>;
      /**
       * Usernames that an authority has granted, but that the account controller has not confirmed
       * that they want it. Used primarily in cases where the `AccountId` cannot provide a signature
       * because they are a pure proxy, multisig, etc. In order to confirm it, they should call
       * [`Call::accept_username`].
       * 
       * First tuple item is the account and second is the acceptance deadline.
       **/
      pendingUsernames: AugmentedQuery<ApiType, (arg: Bytes | string | Uint8Array) => Observable<Option<ITuple<[AccountId32, u32]>>>, [Bytes]>;
      /**
       * The set of registrars. Not expected to get very big as can only be added
       * through a special origin (likely a council motion).
       **/
      registrars: AugmentedQuery<ApiType, () => Observable<Vec<Option<PalletIdentityRegistrarInfo>>>, []>;
      /**
       * Alternative "sub" identities of this account.
       * 
       * The first item is the deposit, the second is a vector of the accounts.
       * 
       * TWOX-NOTE: OK ― `AccountId` is a secure hash.
       **/
      subsOf: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<Vec<AccountId32>>, [AccountId32]>;
      /**
       * The super-identity of an alternative "sub" identity together with its name, within that
       * context. If the account is not some other account's sub-identity, then just `None`.
       **/
      superOf: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<Option<ITuple<[AccountId32, Data]>>>, [AccountId32]>;
      /**
       * A map of the accounts who are authorized to grant usernames.
       **/
      usernameAuthorities: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<Option<PalletIdentityAuthorityProperties>>, [AccountId32]>;
    };
    imOnline: {
      /**
       * For each session index, we keep a mapping of `ValidatorId<T>` to the
       * number of blocks authored by the given authority.
       **/
      authoredBlocks: AugmentedQuery<ApiType, (arg1: u32 | AnyNumber | Uint8Array, arg2: AccountId32 | string | Uint8Array) => Observable<u32>, [u32, AccountId32]>;
      /**
       * The block number after which it's ok to send heartbeats in the current
       * session.
       * 
       * At the beginning of each session we set this to a value that should fall
       * roughly in the middle of the session duration. The idea is to first wait for
       * the validators to produce a block in the current session, so that the
       * heartbeat later on will not be necessary.
       * 
       * This value will only be used as a fallback if we fail to get a proper session
       * progress estimate from `NextSessionRotation`, as those estimates should be
       * more accurate then the value we calculate for `HeartbeatAfter`.
       **/
      heartbeatAfter: AugmentedQuery<ApiType, () => Observable<u32>, []>;
      /**
       * The current set of keys that may issue a heartbeat.
       **/
      keys: AugmentedQuery<ApiType, () => Observable<Vec<PalletImOnlineSr25519AppSr25519Public>>, []>;
      /**
       * For each session index, we keep a mapping of `SessionIndex` and `AuthIndex`.
       **/
      receivedHeartbeats: AugmentedQuery<ApiType, (arg1: u32 | AnyNumber | Uint8Array, arg2: u32 | AnyNumber | Uint8Array) => Observable<Option<bool>>, [u32, u32]>;
    };
    indices: {
      /**
       * The lookup from index to account.
       **/
      accounts: AugmentedQuery<ApiType, (arg: u32 | AnyNumber | Uint8Array) => Observable<Option<ITuple<[AccountId32, u128, bool]>>>, [u32]>;
    };
    multisig: {
      /**
       * The set of open multisig operations.
       **/
      multisigs: AugmentedQuery<ApiType, (arg1: AccountId32 | string | Uint8Array, arg2: U8aFixed | string | Uint8Array) => Observable<Option<PalletMultisigMultisig>>, [AccountId32, U8aFixed]>;
    };
    networkMembership: {
      /**
       * Counter for the related counted storage map
       **/
      counterForMembers: AugmentedQuery<ApiType, () => Observable<u32>, []>;
      members: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<Option<PalletNetworkMembershipMemberData>>, [AccountId32]>;
      /**
       * maps from a member identifier to a unit tuple
       **/
      membershipBlacklist: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<Option<Null>>, [AccountId32]>;
      /**
       * maps block number to the list of authors set to expire at this block
       **/
      membershipsExpiresOn: AugmentedQuery<ApiType, (arg: u32 | AnyNumber | Uint8Array) => Observable<Vec<AccountId32>>, [u32]>;
      /**
       * maps block number to the list of authors set to renew
       **/
      membershipsRenewsOn: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<Option<Null>>, [AccountId32]>;
    };
    networkParameters: {
      networkPermissioned: AugmentedQuery<ApiType, () => Observable<bool>, []>;
    };
    networkScore: {
      /**
       * aggregated network score - aggregated and mapped to an entity
       * identifier.
       **/
      aggregateScores: AugmentedQuery<ApiType, (arg1: Bytes | string | Uint8Array, arg2: PalletNetworkScoreRatingTypeOf | 'Overall' | 'Delivery' | number | Uint8Array) => Observable<Option<PalletNetworkScoreAggregatedEntryOf>>, [Bytes, PalletNetworkScoreRatingTypeOf]>;
      messageIdentifiers: AugmentedQuery<ApiType, (arg1: Bytes | string | Uint8Array, arg2: AccountId32 | string | Uint8Array) => Observable<Option<Bytes>>, [Bytes, AccountId32]>;
      /**
       * rating entry identifiers with rating details stored on chain.
       **/
      ratingEntries: AugmentedQuery<ApiType, (arg: Bytes | string | Uint8Array) => Observable<Option<PalletNetworkScoreRatingEntry>>, [Bytes]>;
    };
    nodeAuthorization: {
      /**
       * The additional adapative connections of each node.
       **/
      additionalConnections: AugmentedQuery<ApiType, (arg: OpaquePeerId | object | string | Uint8Array) => Observable<BTreeSet<OpaquePeerId>>, [OpaquePeerId]>;
      /**
       * A map that maintains the ownership of each node.
       **/
      owners: AugmentedQuery<ApiType, (arg: OpaquePeerId | object | string | Uint8Array) => Observable<Option<PalletNodeAuthorizationNodeInfo>>, [OpaquePeerId]>;
      /**
       * The set of well known nodes. This is stored sorted (just by value).
       **/
      wellKnownNodes: AugmentedQuery<ApiType, () => Observable<BTreeSet<OpaquePeerId>>, []>;
    };
    offences: {
      /**
       * A vector of reports of the same kind that happened at the same time
       * slot.
       **/
      concurrentReportsIndex: AugmentedQuery<ApiType, (arg1: U8aFixed | string | Uint8Array, arg2: Bytes | string | Uint8Array) => Observable<Vec<H256>>, [U8aFixed, Bytes]>;
      /**
       * The primary structure that holds all offence records keyed by report
       * identifiers.
       **/
      reports: AugmentedQuery<ApiType, (arg: H256 | string | Uint8Array) => Observable<Option<SpStakingOffenceOffenceDetails>>, [H256]>;
    };
    poolAssets: {
      /**
       * The holdings of a specific account for a specific asset.
       **/
      account: AugmentedQuery<ApiType, (arg1: u32 | AnyNumber | Uint8Array, arg2: AccountId32 | string | Uint8Array) => Observable<Option<PalletAssetsAssetAccount>>, [u32, AccountId32]>;
      /**
       * Approved balance transfers. First balance is the amount approved for transfer. Second
       * is the amount of `T::Currency` reserved for storing this.
       * First key is the asset ID, second key is the owner and third key is the delegate.
       **/
      approvals: AugmentedQuery<ApiType, (arg1: u32 | AnyNumber | Uint8Array, arg2: AccountId32 | string | Uint8Array, arg3: AccountId32 | string | Uint8Array) => Observable<Option<PalletAssetsApproval>>, [u32, AccountId32, AccountId32]>;
      /**
       * Details of an asset.
       **/
      asset: AugmentedQuery<ApiType, (arg: u32 | AnyNumber | Uint8Array) => Observable<Option<PalletAssetsAssetDetails>>, [u32]>;
      /**
       * Metadata of an asset.
       **/
      metadata: AugmentedQuery<ApiType, (arg: u32 | AnyNumber | Uint8Array) => Observable<PalletAssetsAssetMetadata>, [u32]>;
      /**
       * The asset ID enforced for the next asset creation, if any present. Otherwise, this storage
       * item has no effect.
       * 
       * This can be useful for setting up constraints for IDs of the new assets. For example, by
       * providing an initial [`NextAssetId`] and using the [`crate::AutoIncAssetId`] callback, an
       * auto-increment model can be applied to all new asset IDs.
       * 
       * The initial next asset ID can be set using the [`GenesisConfig`] or the
       * [SetNextAssetId](`migration::next_asset_id::SetNextAssetId`) migration.
       **/
      nextAssetId: AugmentedQuery<ApiType, () => Observable<Option<u32>>, []>;
    };
    preimage: {
      preimageFor: AugmentedQuery<ApiType, (arg: ITuple<[H256, u32]> | [H256 | string | Uint8Array, u32 | AnyNumber | Uint8Array]) => Observable<Option<Bytes>>, [ITuple<[H256, u32]>]>;
      /**
       * The request status of a given hash.
       **/
      requestStatusFor: AugmentedQuery<ApiType, (arg: H256 | string | Uint8Array) => Observable<Option<PalletPreimageRequestStatus>>, [H256]>;
      /**
       * The request status of a given hash.
       **/
      statusFor: AugmentedQuery<ApiType, (arg: H256 | string | Uint8Array) => Observable<Option<PalletPreimageOldRequestStatus>>, [H256]>;
    };
    randomnessCollectiveFlip: {
      /**
       * Series of block headers from the last 81 blocks that acts as random seed material. This
       * is arranged as a ring buffer with `block_number % 81` being the index into the `Vec` of
       * the oldest hash.
       **/
      randomMaterial: AugmentedQuery<ApiType, () => Observable<Vec<H256>>, []>;
    };
    registries: {
      /**
       * Registry authorizations stored on-chain.
       * It maps from an identifier to delegates.
       **/
      authorizations: AugmentedQuery<ApiType, (arg: Bytes | string | Uint8Array) => Observable<Option<PalletRegistriesRegistryAuthorization>>, [Bytes]>;
      /**
       * Registry delegates stored on chain.
       * It maps from an identifier to a  bounded vec of delegates and
       * permissions.
       **/
      delegates: AugmentedQuery<ApiType, (arg: Bytes | string | Uint8Array) => Observable<Vec<AccountId32>>, [Bytes]>;
      /**
       * Registry information stored on chain.
       * It maps from an identifier to its details.
       **/
      registryInfo: AugmentedQuery<ApiType, (arg: Bytes | string | Uint8Array) => Observable<Option<PalletRegistriesRegistryDetails>>, [Bytes]>;
    };
    scheduler: {
      /**
       * Items to be executed, indexed by the block number that they should be executed on.
       **/
      agenda: AugmentedQuery<ApiType, (arg: u32 | AnyNumber | Uint8Array) => Observable<Vec<Option<PalletSchedulerScheduled>>>, [u32]>;
      incompleteSince: AugmentedQuery<ApiType, () => Observable<Option<u32>>, []>;
      /**
       * Lookup from a name to the block number and index of the task.
       * 
       * For v3 -> v4 the previously unbounded identities are Blake2-256 hashed to form the v4
       * identities.
       **/
      lookup: AugmentedQuery<ApiType, (arg: U8aFixed | string | Uint8Array) => Observable<Option<ITuple<[u32, u32]>>>, [U8aFixed]>;
      /**
       * Retry configurations for items to be executed, indexed by task address.
       **/
      retries: AugmentedQuery<ApiType, (arg: ITuple<[u32, u32]> | [u32 | AnyNumber | Uint8Array, u32 | AnyNumber | Uint8Array]) => Observable<Option<PalletSchedulerRetryConfig>>, [ITuple<[u32, u32]>]>;
    };
    schema: {
      /**
       * schemas stored on chain.
       * It maps from a schema identifier to its details.
       **/
      schemas: AugmentedQuery<ApiType, (arg: Bytes | string | Uint8Array) => Observable<Option<PalletSchemaSchemaEntry>>, [Bytes]>;
    };
    session: {
      /**
       * Current index of the session.
       **/
      currentIndex: AugmentedQuery<ApiType, () => Observable<u32>, []>;
      /**
       * Indices of disabled validators.
       * 
       * The vec is always kept sorted so that we can find whether a given validator is
       * disabled using binary search. It gets cleared when `on_session_ending` returns
       * a new set of identities.
       **/
      disabledValidators: AugmentedQuery<ApiType, () => Observable<Vec<u32>>, []>;
      /**
       * The owner of a key. The key is the `KeyTypeId` + the encoded key.
       **/
      keyOwner: AugmentedQuery<ApiType, (arg: ITuple<[SpCoreCryptoKeyTypeId, Bytes]> | [SpCoreCryptoKeyTypeId | string | Uint8Array, Bytes | string | Uint8Array]) => Observable<Option<AccountId32>>, [ITuple<[SpCoreCryptoKeyTypeId, Bytes]>]>;
      /**
       * The next session keys for a validator.
       **/
      nextKeys: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<Option<CordLoomRuntimeSessionKeys>>, [AccountId32]>;
      /**
       * True if the underlying economic identities or weighting behind the validators
       * has changed in the queued validator set.
       **/
      queuedChanged: AugmentedQuery<ApiType, () => Observable<bool>, []>;
      /**
       * The queued keys for the next session. When the next session begins, these keys
       * will be used to determine the validator's session keys.
       **/
      queuedKeys: AugmentedQuery<ApiType, () => Observable<Vec<ITuple<[AccountId32, CordLoomRuntimeSessionKeys]>>>, []>;
      /**
       * The current set of validators.
       **/
      validators: AugmentedQuery<ApiType, () => Observable<Vec<AccountId32>>, []>;
    };
    statement: {
      /**
       * statement uniques stored on chain.
       * It maps from a statement identifier and hash to its details.
       **/
      entries: AugmentedQuery<ApiType, (arg1: Bytes | string | Uint8Array, arg2: H256 | string | Uint8Array) => Observable<Option<AccountId32>>, [Bytes, H256]>;
      /**
       * Storage for Identifier lookup.
       * It maps from a statement entry digest and registry id to an identifier.
       **/
      identifierLookup: AugmentedQuery<ApiType, (arg1: H256 | string | Uint8Array, arg2: Bytes | string | Uint8Array) => Observable<Option<Bytes>>, [H256, Bytes]>;
      /**
       * statement uniques stored on chain.
       * It maps from a statement identifier and hash to its details.
       **/
      presentations: AugmentedQuery<ApiType, (arg1: Bytes | string | Uint8Array, arg2: H256 | string | Uint8Array) => Observable<Option<PalletStatementStatementPresentationDetails>>, [Bytes, H256]>;
      /**
       * Revocation registry of statement entries stored on chain.
       * It maps from a statement identifier and hash to its details.
       **/
      revocationList: AugmentedQuery<ApiType, (arg1: Bytes | string | Uint8Array, arg2: H256 | string | Uint8Array) => Observable<Option<PalletStatementStatementEntryStatus>>, [Bytes, H256]>;
      /**
       * statement identifiers stored on chain.
       * It maps from an identifier to its details.
       * Only stores the latest state.
       **/
      statements: AugmentedQuery<ApiType, (arg: Bytes | string | Uint8Array) => Observable<Option<PalletStatementStatementDetails>>, [Bytes]>;
    };
    sudo: {
      /**
       * The `AccountId` of the sudo key.
       **/
      key: AugmentedQuery<ApiType, () => Observable<Option<AccountId32>>, []>;
    };
    system: {
      /**
       * The full account information for a particular account ID.
       **/
      account: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<FrameSystemAccountInfo>, [AccountId32]>;
      /**
       * Total length (in bytes) for all extrinsics put together, for the current block.
       **/
      allExtrinsicsLen: AugmentedQuery<ApiType, () => Observable<Option<u32>>, []>;
      /**
       * `Some` if a code upgrade has been authorized.
       **/
      authorizedUpgrade: AugmentedQuery<ApiType, () => Observable<Option<FrameSystemCodeUpgradeAuthorization>>, []>;
      /**
       * Map of block numbers to block hashes.
       **/
      blockHash: AugmentedQuery<ApiType, (arg: u32 | AnyNumber | Uint8Array) => Observable<H256>, [u32]>;
      /**
       * The current weight for the block.
       **/
      blockWeight: AugmentedQuery<ApiType, () => Observable<FrameSupportDispatchPerDispatchClassWeight>, []>;
      /**
       * Digest of the current block, also part of the block header.
       **/
      digest: AugmentedQuery<ApiType, () => Observable<SpRuntimeDigest>, []>;
      /**
       * The number of events in the `Events<T>` list.
       **/
      eventCount: AugmentedQuery<ApiType, () => Observable<u32>, []>;
      /**
       * Events deposited for the current block.
       * 
       * NOTE: The item is unbound and should therefore never be read on chain.
       * It could otherwise inflate the PoV size of a block.
       * 
       * Events have a large in-memory size. Box the events to not go out-of-memory
       * just in case someone still reads them from within the runtime.
       **/
      events: AugmentedQuery<ApiType, () => Observable<Vec<FrameSystemEventRecord>>, []>;
      /**
       * Mapping between a topic (represented by T::Hash) and a vector of indexes
       * of events in the `<Events<T>>` list.
       * 
       * All topic vectors have deterministic storage locations depending on the topic. This
       * allows light-clients to leverage the changes trie storage tracking mechanism and
       * in case of changes fetch the list of events of interest.
       * 
       * The value has the type `(BlockNumberFor<T>, EventIndex)` because if we used only just
       * the `EventIndex` then in case if the topic has the same contents on the next block
       * no notification will be triggered thus the event might be lost.
       **/
      eventTopics: AugmentedQuery<ApiType, (arg: H256 | string | Uint8Array) => Observable<Vec<ITuple<[u32, u32]>>>, [H256]>;
      /**
       * The execution phase of the block.
       **/
      executionPhase: AugmentedQuery<ApiType, () => Observable<Option<FrameSystemPhase>>, []>;
      /**
       * Total extrinsics count for the current block.
       **/
      extrinsicCount: AugmentedQuery<ApiType, () => Observable<Option<u32>>, []>;
      /**
       * Extrinsics data for the current block (maps an extrinsic's index to its data).
       **/
      extrinsicData: AugmentedQuery<ApiType, (arg: u32 | AnyNumber | Uint8Array) => Observable<Bytes>, [u32]>;
      /**
       * Whether all inherents have been applied.
       **/
      inherentsApplied: AugmentedQuery<ApiType, () => Observable<bool>, []>;
      /**
       * Stores the `spec_version` and `spec_name` of when the last runtime upgrade happened.
       **/
      lastRuntimeUpgrade: AugmentedQuery<ApiType, () => Observable<Option<FrameSystemLastRuntimeUpgradeInfo>>, []>;
      /**
       * The current block number being processed. Set by `execute_block`.
       **/
      number: AugmentedQuery<ApiType, () => Observable<u32>, []>;
      /**
       * Hash of the previous block.
       **/
      parentHash: AugmentedQuery<ApiType, () => Observable<H256>, []>;
      /**
       * True if we have upgraded so that AccountInfo contains three types of `RefCount`. False
       * (default) if not.
       **/
      upgradedToTripleRefCount: AugmentedQuery<ApiType, () => Observable<bool>, []>;
      /**
       * True if we have upgraded so that `type RefCount` is `u32`. False (default) if not.
       **/
      upgradedToU32RefCount: AugmentedQuery<ApiType, () => Observable<bool>, []>;
    };
    technicalCommittee: {
      /**
       * The current members of the collective. This is stored sorted (just by value).
       **/
      members: AugmentedQuery<ApiType, () => Observable<Vec<AccountId32>>, []>;
      /**
       * The prime member that helps determine the default vote behavior in case of abstentions.
       **/
      prime: AugmentedQuery<ApiType, () => Observable<Option<AccountId32>>, []>;
      /**
       * Proposals so far.
       **/
      proposalCount: AugmentedQuery<ApiType, () => Observable<u32>, []>;
      /**
       * Actual proposal for a given hash, if it's current.
       **/
      proposalOf: AugmentedQuery<ApiType, (arg: H256 | string | Uint8Array) => Observable<Option<Call>>, [H256]>;
      /**
       * The hashes of the active proposals.
       **/
      proposals: AugmentedQuery<ApiType, () => Observable<Vec<H256>>, []>;
      /**
       * Votes on a given proposal, if it is ongoing.
       **/
      voting: AugmentedQuery<ApiType, (arg: H256 | string | Uint8Array) => Observable<Option<PalletCollectiveVotes>>, [H256]>;
    };
    technicalMembership: {
      /**
       * The current membership, stored as an ordered Vec.
       **/
      members: AugmentedQuery<ApiType, () => Observable<Vec<AccountId32>>, []>;
      /**
       * The current prime member, if one exists.
       **/
      prime: AugmentedQuery<ApiType, () => Observable<Option<AccountId32>>, []>;
    };
    timestamp: {
      /**
       * Whether the timestamp has been updated in this block.
       * 
       * This value is updated to `true` upon successful submission of a timestamp by a node.
       * It is then checked at the end of each block execution in the `on_finalize` hook.
       **/
      didUpdate: AugmentedQuery<ApiType, () => Observable<bool>, []>;
      /**
       * The current time for the current block.
       **/
      now: AugmentedQuery<ApiType, () => Observable<u64>, []>;
    };
    transactionPayment: {
      nextFeeMultiplier: AugmentedQuery<ApiType, () => Observable<u128>, []>;
      storageVersion: AugmentedQuery<ApiType, () => Observable<PalletTransactionPaymentReleases>, []>;
    };
    treasury: {
      /**
       * Proposal indices that have been approved but not yet awarded.
       **/
      approvals: AugmentedQuery<ApiType, () => Observable<Vec<u32>>, []>;
      /**
       * The amount which has been reported as inactive to Currency.
       **/
      deactivated: AugmentedQuery<ApiType, () => Observable<u128>, []>;
      /**
       * Number of proposals that have been made.
       **/
      proposalCount: AugmentedQuery<ApiType, () => Observable<u32>, []>;
      /**
       * Proposals that have been made.
       **/
      proposals: AugmentedQuery<ApiType, (arg: u32 | AnyNumber | Uint8Array) => Observable<Option<PalletTreasuryProposal>>, [u32]>;
      /**
       * The count of spends that have been made.
       **/
      spendCount: AugmentedQuery<ApiType, () => Observable<u32>, []>;
      /**
       * Spends that have been approved and being processed.
       **/
      spends: AugmentedQuery<ApiType, (arg: u32 | AnyNumber | Uint8Array) => Observable<Option<PalletTreasurySpendStatus>>, [u32]>;
    };
  } // AugmentedQueries
} // declare module
