// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/errors';

import type { ApiTypes, AugmentedError } from '@polkadot/api-base/types';

export type __AugmentedError<ApiType extends ApiTypes> = AugmentedError<ApiType>;

declare module '@polkadot/api-base/types/errors' {
  interface AugmentedErrors<ApiType extends ApiTypes> {
    assetConversion: {
      /**
       * Provided amount should be greater than or equal to the existential deposit/asset's
       * minimal amount.
       **/
      AmountOneLessThanMinimal: AugmentedError<ApiType>;
      /**
       * Desired amount can't be equal to the pool reserve.
       **/
      AmountOutTooHigh: AugmentedError<ApiType>;
      /**
       * Provided amount should be greater than or equal to the existential deposit/asset's
       * minimal amount.
       **/
      AmountTwoLessThanMinimal: AugmentedError<ApiType>;
      /**
       * The minimal amount requirement for the first token in the pair wasn't met.
       **/
      AssetOneDepositDidNotMeetMinimum: AugmentedError<ApiType>;
      /**
       * The minimal amount requirement for the first token in the pair wasn't met.
       **/
      AssetOneWithdrawalDidNotMeetMinimum: AugmentedError<ApiType>;
      /**
       * The minimal amount requirement for the second token in the pair wasn't met.
       **/
      AssetTwoDepositDidNotMeetMinimum: AugmentedError<ApiType>;
      /**
       * The minimal amount requirement for the second token in the pair wasn't met.
       **/
      AssetTwoWithdrawalDidNotMeetMinimum: AugmentedError<ApiType>;
      /**
       * The destination account cannot exist with the swapped funds.
       **/
      BelowMinimum: AugmentedError<ApiType>;
      /**
       * It was not possible to get or increment the Id of the pool.
       **/
      IncorrectPoolAssetId: AugmentedError<ApiType>;
      /**
       * Insufficient liquidity minted.
       **/
      InsufficientLiquidityMinted: AugmentedError<ApiType>;
      /**
       * Provided asset pair is not supported for pool.
       **/
      InvalidAssetPair: AugmentedError<ApiType>;
      /**
       * The provided path must consists of 2 assets at least.
       **/
      InvalidPath: AugmentedError<ApiType>;
      /**
       * The provided path must consists of unique assets.
       **/
      NonUniquePath: AugmentedError<ApiType>;
      /**
       * Optimal calculated amount is less than desired.
       **/
      OptimalAmountLessThanDesired: AugmentedError<ApiType>;
      /**
       * An overflow happened.
       **/
      Overflow: AugmentedError<ApiType>;
      /**
       * Pool already exists.
       **/
      PoolExists: AugmentedError<ApiType>;
      /**
       * The pool doesn't exist.
       **/
      PoolNotFound: AugmentedError<ApiType>;
      /**
       * Provided maximum amount is not sufficient for swap.
       **/
      ProvidedMaximumNotSufficientForSwap: AugmentedError<ApiType>;
      /**
       * Calculated amount out is less than provided minimum amount.
       **/
      ProvidedMinimumNotSufficientForSwap: AugmentedError<ApiType>;
      /**
       * Reserve needs to always be greater than or equal to the existential deposit/asset's
       * minimal amount.
       **/
      ReserveLeftLessThanMinimal: AugmentedError<ApiType>;
      /**
       * Desired amount can't be zero.
       **/
      WrongDesiredAmount: AugmentedError<ApiType>;
      /**
       * Amount can't be zero.
       **/
      ZeroAmount: AugmentedError<ApiType>;
      /**
       * Requested liquidity can't be zero.
       **/
      ZeroLiquidity: AugmentedError<ApiType>;
    };
    assetRate: {
      /**
       * The given asset ID already has an assigned conversion rate and cannot be re-created.
       **/
      AlreadyExists: AugmentedError<ApiType>;
      /**
       * Overflow ocurred when calculating the inverse rate.
       **/
      Overflow: AugmentedError<ApiType>;
      /**
       * The given asset ID is unknown.
       **/
      UnknownAssetKind: AugmentedError<ApiType>;
    };
    assets: {
      /**
       * The asset-account already exists.
       **/
      AlreadyExists: AugmentedError<ApiType>;
      /**
       * The asset is not live, and likely being destroyed.
       **/
      AssetNotLive: AugmentedError<ApiType>;
      /**
       * The asset ID must be equal to the [`NextAssetId`].
       **/
      BadAssetId: AugmentedError<ApiType>;
      /**
       * Invalid metadata given.
       **/
      BadMetadata: AugmentedError<ApiType>;
      /**
       * Invalid witness data given.
       **/
      BadWitness: AugmentedError<ApiType>;
      /**
       * Account balance must be greater than or equal to the transfer amount.
       **/
      BalanceLow: AugmentedError<ApiType>;
      /**
       * Callback action resulted in error
       **/
      CallbackFailed: AugmentedError<ApiType>;
      /**
       * The origin account is frozen.
       **/
      Frozen: AugmentedError<ApiType>;
      /**
       * The asset status is not the expected status.
       **/
      IncorrectStatus: AugmentedError<ApiType>;
      /**
       * The asset ID is already taken.
       **/
      InUse: AugmentedError<ApiType>;
      /**
       * The asset is a live asset and is actively being used. Usually emit for operations such
       * as `start_destroy` which require the asset to be in a destroying state.
       **/
      LiveAsset: AugmentedError<ApiType>;
      /**
       * Minimum balance should be non-zero.
       **/
      MinBalanceZero: AugmentedError<ApiType>;
      /**
       * The account to alter does not exist.
       **/
      NoAccount: AugmentedError<ApiType>;
      /**
       * The asset-account doesn't have an associated deposit.
       **/
      NoDeposit: AugmentedError<ApiType>;
      /**
       * The signing account has no permission to do the operation.
       **/
      NoPermission: AugmentedError<ApiType>;
      /**
       * The asset should be frozen before the given operation.
       **/
      NotFrozen: AugmentedError<ApiType>;
      /**
       * No approval exists that would allow the transfer.
       **/
      Unapproved: AugmentedError<ApiType>;
      /**
       * Unable to increment the consumer reference counters on the account. Either no provider
       * reference exists to allow a non-zero balance of a non-self-sufficient asset, or one
       * fewer then the maximum number of consumers has been reached.
       **/
      UnavailableConsumer: AugmentedError<ApiType>;
      /**
       * The given asset ID is unknown.
       **/
      Unknown: AugmentedError<ApiType>;
      /**
       * The operation would result in funds being burned.
       **/
      WouldBurn: AugmentedError<ApiType>;
      /**
       * The source account would not survive the transfer and it needs to stay alive.
       **/
      WouldDie: AugmentedError<ApiType>;
    };
    babe: {
      /**
       * A given equivocation report is valid but already previously reported.
       **/
      DuplicateOffenceReport: AugmentedError<ApiType>;
      /**
       * Submitted configuration is invalid.
       **/
      InvalidConfiguration: AugmentedError<ApiType>;
      /**
       * An equivocation proof provided as part of an equivocation report is invalid.
       **/
      InvalidEquivocationProof: AugmentedError<ApiType>;
      /**
       * A key ownership proof provided as part of an equivocation report is invalid.
       **/
      InvalidKeyOwnershipProof: AugmentedError<ApiType>;
    };
    balances: {
      /**
       * Beneficiary account must pre-exist.
       **/
      DeadAccount: AugmentedError<ApiType>;
      /**
       * The delta cannot be zero.
       **/
      DeltaZero: AugmentedError<ApiType>;
      /**
       * Value too low to create account due to existential deposit.
       **/
      ExistentialDeposit: AugmentedError<ApiType>;
      /**
       * A vesting schedule already exists for this account.
       **/
      ExistingVestingSchedule: AugmentedError<ApiType>;
      /**
       * Transfer/payment would kill account.
       **/
      Expendability: AugmentedError<ApiType>;
      /**
       * Balance too low to send value.
       **/
      InsufficientBalance: AugmentedError<ApiType>;
      /**
       * The issuance cannot be modified since it is already deactivated.
       **/
      IssuanceDeactivated: AugmentedError<ApiType>;
      /**
       * Account liquidity restrictions prevent withdrawal.
       **/
      LiquidityRestrictions: AugmentedError<ApiType>;
      /**
       * Number of freezes exceed `MaxFreezes`.
       **/
      TooManyFreezes: AugmentedError<ApiType>;
      /**
       * Number of holds exceed `VariantCountOf<T::RuntimeHoldReason>`.
       **/
      TooManyHolds: AugmentedError<ApiType>;
      /**
       * Number of named reserves exceed `MaxReserves`.
       **/
      TooManyReserves: AugmentedError<ApiType>;
      /**
       * Vesting balance too high to send value.
       **/
      VestingBalance: AugmentedError<ApiType>;
    };
    beefy: {
      /**
       * A given equivocation report is valid but already previously reported.
       **/
      DuplicateOffenceReport: AugmentedError<ApiType>;
      /**
       * Submitted configuration is invalid.
       **/
      InvalidConfiguration: AugmentedError<ApiType>;
      /**
       * A double voting proof provided as part of an equivocation report is invalid.
       **/
      InvalidDoubleVotingProof: AugmentedError<ApiType>;
      /**
       * The session of the equivocation proof is invalid
       **/
      InvalidEquivocationProofSession: AugmentedError<ApiType>;
      /**
       * A fork voting proof provided as part of an equivocation report is invalid.
       **/
      InvalidForkVotingProof: AugmentedError<ApiType>;
      /**
       * A future block voting proof provided as part of an equivocation report is invalid.
       **/
      InvalidFutureBlockVotingProof: AugmentedError<ApiType>;
      /**
       * A key ownership proof provided as part of an equivocation report is invalid.
       **/
      InvalidKeyOwnershipProof: AugmentedError<ApiType>;
    };
    collection: {
      /**
       * The activity update operation failed.
       **/
      ActivityUpdateFailed: AugmentedError<ApiType>;
      /**
       * The collection is already archived.
       **/
      ArchivedCollection: AugmentedError<ApiType>;
      /**
       * A collection with the given identifier already exists.
       **/
      CollectionAlreadyExists: AugmentedError<ApiType>;
      /**
       * The collection is not archived (and thus cannot be restored).
       **/
      CollectionNotArchived: AugmentedError<ApiType>;
      /**
       * The specified collection was not found.
       **/
      CollectionNotFound: AugmentedError<ApiType>;
      /**
       * The delegate is already added to the collection.
       **/
      DelegateAlreadyExists: AugmentedError<ApiType>;
      /**
       * The specified delegate was not found.
       **/
      DelegateNotFound: AugmentedError<ApiType>;
      /**
       * The provided entry type input is invalid.
       **/
      InvalidEntryTypeInput: AugmentedError<ApiType>;
      /**
       * The provided identifier length is invalid.
       **/
      InvalidIdentifierLength: AugmentedError<ApiType>;
      /**
       * A registry with the given identifier already exists in the collection.
       **/
      RegistryAlreadyExists: AugmentedError<ApiType>;
      /**
       * The specified registry was not found in the collection.
       **/
      RegistryNotFound: AugmentedError<ApiType>;
      /**
       * The caller does not have the required permissions.
       **/
      UnauthorizedOperation: AugmentedError<ApiType>;
    };
    contracts: {
      /**
       * Can not add a delegate dependency to the code hash of the contract itself.
       **/
      CannotAddSelfAsDelegateDependency: AugmentedError<ApiType>;
      /**
       * No code info could be found at the supplied code hash.
       **/
      CodeInfoNotFound: AugmentedError<ApiType>;
      /**
       * Code removal was denied because the code is still in use by at least one contract.
       **/
      CodeInUse: AugmentedError<ApiType>;
      /**
       * No code could be found at the supplied code hash.
       **/
      CodeNotFound: AugmentedError<ApiType>;
      /**
       * The contract's code was found to be invalid during validation.
       * 
       * The most likely cause of this is that an API was used which is not supported by the
       * node. This happens if an older node is used with a new version of ink!. Try updating
       * your node to the newest available version.
       * 
       * A more detailed error can be found on the node console if debug messages are enabled
       * by supplying `-lruntime::contracts=debug`.
       **/
      CodeRejected: AugmentedError<ApiType>;
      /**
       * The code supplied to `instantiate_with_code` exceeds the limit specified in the
       * current schedule.
       **/
      CodeTooLarge: AugmentedError<ApiType>;
      /**
       * No contract was found at the specified address.
       **/
      ContractNotFound: AugmentedError<ApiType>;
      /**
       * The contract ran to completion but decided to revert its storage changes.
       * Please note that this error is only returned from extrinsics. When called directly
       * or via RPC an `Ok` will be returned. In this case the caller needs to inspect the flags
       * to determine whether a reversion has taken place.
       **/
      ContractReverted: AugmentedError<ApiType>;
      /**
       * Contract trapped during execution.
       **/
      ContractTrapped: AugmentedError<ApiType>;
      /**
       * Input passed to a contract API function failed to decode as expected type.
       **/
      DecodingFailed: AugmentedError<ApiType>;
      /**
       * The contract already depends on the given delegate dependency.
       **/
      DelegateDependencyAlreadyExists: AugmentedError<ApiType>;
      /**
       * The dependency was not found in the contract's delegate dependencies.
       **/
      DelegateDependencyNotFound: AugmentedError<ApiType>;
      /**
       * A contract with the same AccountId already exists.
       **/
      DuplicateContract: AugmentedError<ApiType>;
      /**
       * An indeterministic code was used in a context where this is not permitted.
       **/
      Indeterministic: AugmentedError<ApiType>;
      /**
       * `seal_call` forwarded this contracts input. It therefore is no longer available.
       **/
      InputForwarded: AugmentedError<ApiType>;
      /**
       * Invalid combination of flags supplied to `seal_call` or `seal_delegate_call`.
       **/
      InvalidCallFlags: AugmentedError<ApiType>;
      /**
       * Invalid schedule supplied, e.g. with zero weight of a basic operation.
       **/
      InvalidSchedule: AugmentedError<ApiType>;
      /**
       * Performing a call was denied because the calling depth reached the limit
       * of what is specified in the schedule.
       **/
      MaxCallDepthReached: AugmentedError<ApiType>;
      /**
       * The contract has reached its maximum number of delegate dependencies.
       **/
      MaxDelegateDependenciesReached: AugmentedError<ApiType>;
      /**
       * A pending migration needs to complete before the extrinsic can be called.
       **/
      MigrationInProgress: AugmentedError<ApiType>;
      /**
       * The chain does not provide a chain extension. Calling the chain extension results
       * in this error. Note that this usually  shouldn't happen as deploying such contracts
       * is rejected.
       **/
      NoChainExtension: AugmentedError<ApiType>;
      /**
       * Migrate dispatch call was attempted but no migration was performed.
       **/
      NoMigrationPerformed: AugmentedError<ApiType>;
      /**
       * A buffer outside of sandbox memory was passed to a contract API function.
       **/
      OutOfBounds: AugmentedError<ApiType>;
      /**
       * The executed contract exhausted its gas limit.
       **/
      OutOfGas: AugmentedError<ApiType>;
      /**
       * Can not add more data to transient storage.
       **/
      OutOfTransientStorage: AugmentedError<ApiType>;
      /**
       * The output buffer supplied to a contract API call was too small.
       **/
      OutputBufferTooSmall: AugmentedError<ApiType>;
      /**
       * The subject passed to `seal_random` exceeds the limit.
       **/
      RandomSubjectTooLong: AugmentedError<ApiType>;
      /**
       * A call tried to invoke a contract that is flagged as non-reentrant.
       * The only other cause is that a call from a contract into the runtime tried to call back
       * into `pallet-contracts`. This would make the whole pallet reentrant with regard to
       * contract code execution which is not supported.
       **/
      ReentranceDenied: AugmentedError<ApiType>;
      /**
       * A contract attempted to invoke a state modifying API while being in read-only mode.
       **/
      StateChangeDenied: AugmentedError<ApiType>;
      /**
       * More storage was created than allowed by the storage deposit limit.
       **/
      StorageDepositLimitExhausted: AugmentedError<ApiType>;
      /**
       * Origin doesn't have enough balance to pay the required storage deposits.
       **/
      StorageDepositNotEnoughFunds: AugmentedError<ApiType>;
      /**
       * A contract self destructed in its constructor.
       * 
       * This can be triggered by a call to `seal_terminate`.
       **/
      TerminatedInConstructor: AugmentedError<ApiType>;
      /**
       * Termination of a contract is not allowed while the contract is already
       * on the call stack. Can be triggered by `seal_terminate`.
       **/
      TerminatedWhileReentrant: AugmentedError<ApiType>;
      /**
       * The amount of topics passed to `seal_deposit_events` exceeds the limit.
       **/
      TooManyTopics: AugmentedError<ApiType>;
      /**
       * Performing the requested transfer failed. Probably because there isn't enough
       * free balance in the sender's account.
       **/
      TransferFailed: AugmentedError<ApiType>;
      /**
       * The size defined in `T::MaxValueSize` was exceeded.
       **/
      ValueTooLarge: AugmentedError<ApiType>;
      /**
       * Failed to decode the XCM program.
       **/
      XCMDecodeFailed: AugmentedError<ApiType>;
    };
    council: {
      /**
       * Members are already initialized!
       **/
      AlreadyInitialized: AugmentedError<ApiType>;
      /**
       * Duplicate proposals not allowed
       **/
      DuplicateProposal: AugmentedError<ApiType>;
      /**
       * Duplicate vote ignored
       **/
      DuplicateVote: AugmentedError<ApiType>;
      /**
       * Account is not a member
       **/
      NotMember: AugmentedError<ApiType>;
      /**
       * Prime account is not a member
       **/
      PrimeAccountNotMember: AugmentedError<ApiType>;
      /**
       * Proposal is still active.
       **/
      ProposalActive: AugmentedError<ApiType>;
      /**
       * Proposal must exist
       **/
      ProposalMissing: AugmentedError<ApiType>;
      /**
       * The close call was made too early, before the end of the voting.
       **/
      TooEarly: AugmentedError<ApiType>;
      /**
       * There can only be a maximum of `MaxProposals` active proposals.
       **/
      TooManyProposals: AugmentedError<ApiType>;
      /**
       * Mismatched index
       **/
      WrongIndex: AugmentedError<ApiType>;
      /**
       * The given length bound for the proposal was too low.
       **/
      WrongProposalLength: AugmentedError<ApiType>;
      /**
       * The given weight bound for the proposal was too low.
       **/
      WrongProposalWeight: AugmentedError<ApiType>;
    };
    councilMembership: {
      /**
       * Already a member.
       **/
      AlreadyMember: AugmentedError<ApiType>;
      /**
       * Not a member.
       **/
      NotMember: AugmentedError<ApiType>;
      /**
       * Too many members.
       **/
      TooManyMembers: AugmentedError<ApiType>;
    };
    delegatedStaking: {
      /**
       * An existing staker cannot perform this action.
       **/
      AlreadyStaking: AugmentedError<ApiType>;
      /**
       * Some corruption in internal state.
       **/
      BadState: AugmentedError<ApiType>;
      /**
       * Delegation conditions are not met.
       * 
       * Possible issues are
       * 1) Cannot delegate to self,
       * 2) Cannot delegate to multiple delegates.
       **/
      InvalidDelegation: AugmentedError<ApiType>;
      /**
       * Reward Destination cannot be same as `Agent` account.
       **/
      InvalidRewardDestination: AugmentedError<ApiType>;
      /**
       * Not an existing `Agent` account.
       **/
      NotAgent: AugmentedError<ApiType>;
      /**
       * The account cannot perform this operation.
       **/
      NotAllowed: AugmentedError<ApiType>;
      /**
       * Not a Delegator account.
       **/
      NotDelegator: AugmentedError<ApiType>;
      /**
       * The account does not have enough funds to perform the operation.
       **/
      NotEnoughFunds: AugmentedError<ApiType>;
      /**
       * `Agent` has no pending slash to be applied.
       **/
      NothingToSlash: AugmentedError<ApiType>;
      /**
       * Operation not supported by this pallet.
       **/
      NotSupported: AugmentedError<ApiType>;
      /**
       * Unapplied pending slash restricts operation on `Agent`.
       **/
      UnappliedSlash: AugmentedError<ApiType>;
      /**
       * Failed to withdraw amount from Core Staking.
       **/
      WithdrawFailed: AugmentedError<ApiType>;
    };
    electionProviderMultiPhase: {
      /**
       * Some bound not met
       **/
      BoundNotMet: AugmentedError<ApiType>;
      /**
       * The call is not allowed at this point.
       **/
      CallNotAllowed: AugmentedError<ApiType>;
      /**
       * The fallback failed
       **/
      FallbackFailed: AugmentedError<ApiType>;
      /**
       * `Self::insert_submission` returned an invalid index.
       **/
      InvalidSubmissionIndex: AugmentedError<ApiType>;
      /**
       * Snapshot metadata should exist but didn't.
       **/
      MissingSnapshotMetadata: AugmentedError<ApiType>;
      /**
       * OCW submitted solution for wrong round
       **/
      OcwCallWrongEra: AugmentedError<ApiType>;
      /**
       * Submission was prepared for a different round.
       **/
      PreDispatchDifferentRound: AugmentedError<ApiType>;
      /**
       * Submission was too early.
       **/
      PreDispatchEarlySubmission: AugmentedError<ApiType>;
      /**
       * Submission was too weak, score-wise.
       **/
      PreDispatchWeakSubmission: AugmentedError<ApiType>;
      /**
       * Wrong number of winners presented.
       **/
      PreDispatchWrongWinnerCount: AugmentedError<ApiType>;
      /**
       * The origin failed to pay the deposit.
       **/
      SignedCannotPayDeposit: AugmentedError<ApiType>;
      /**
       * Witness data to dispatchable is invalid.
       **/
      SignedInvalidWitness: AugmentedError<ApiType>;
      /**
       * The queue was full, and the solution was not better than any of the existing ones.
       **/
      SignedQueueFull: AugmentedError<ApiType>;
      /**
       * The signed submission consumes too much weight
       **/
      SignedTooMuchWeight: AugmentedError<ApiType>;
      /**
       * Submitted solution has too many winners
       **/
      TooManyWinners: AugmentedError<ApiType>;
    };
    entry: {
      /**
       * Activity update has failed.
       **/
      ActivityUpdateFailed: AugmentedError<ApiType>;
      /**
       * Activity input type is invalid.
       **/
      InvalidEntryTypeInput: AugmentedError<ApiType>;
      /**
       * Invalid Identifer Length
       **/
      InvalidIdentifierLength: AugmentedError<ApiType>;
      /**
       * Identifier Invalid or Not of DeDir Type
       **/
      InvalidRegistryEntryIdentifier: AugmentedError<ApiType>;
      /**
       * New Registry Entry owner cannot be same as existing owner.
       **/
      NewOwnerCannotBeSameAsExistingOwner: AugmentedError<ApiType>;
      /**
       * Validation or Access of the Registry has failed.
       **/
      RegistryAccessValidationFailed: AugmentedError<ApiType>;
      /**
       * Registry Entry Identifier Already Exists
       **/
      RegistryEntryIdentifierAlreadyExists: AugmentedError<ApiType>;
      /**
       * Registry Entry Identifier Does Not Exists
       **/
      RegistryEntryIdentifierDoesNotExist: AugmentedError<ApiType>;
      /**
       * Registry Entry has not been revoked.
       **/
      RegistryEntryNotRevoked: AugmentedError<ApiType>;
      /**
       * Account has no valid authorization
       **/
      UnauthorizedOperation: AugmentedError<ApiType>;
    };
    fastUnstake: {
      /**
       * The provided un-staker is already in Head, and cannot deregister.
       **/
      AlreadyHead: AugmentedError<ApiType>;
      /**
       * The bonded account has already been queued.
       **/
      AlreadyQueued: AugmentedError<ApiType>;
      /**
       * The call is not allowed at this point because the pallet is not active.
       **/
      CallNotAllowed: AugmentedError<ApiType>;
      /**
       * The provided Controller account was not found.
       * 
       * This means that the given account is not bonded.
       **/
      NotController: AugmentedError<ApiType>;
      /**
       * The bonded account has active unlocking chunks.
       **/
      NotFullyBonded: AugmentedError<ApiType>;
      /**
       * The provided un-staker is not in the `Queue`.
       **/
      NotQueued: AugmentedError<ApiType>;
    };
    grandpa: {
      /**
       * Attempt to signal GRANDPA change with one already pending.
       **/
      ChangePending: AugmentedError<ApiType>;
      /**
       * A given equivocation report is valid but already previously reported.
       **/
      DuplicateOffenceReport: AugmentedError<ApiType>;
      /**
       * An equivocation proof provided as part of an equivocation report is invalid.
       **/
      InvalidEquivocationProof: AugmentedError<ApiType>;
      /**
       * A key ownership proof provided as part of an equivocation report is invalid.
       **/
      InvalidKeyOwnershipProof: AugmentedError<ApiType>;
      /**
       * Attempt to signal GRANDPA pause when the authority set isn't live
       * (either paused or already pending pause).
       **/
      PauseFailed: AugmentedError<ApiType>;
      /**
       * Attempt to signal GRANDPA resume when the authority set isn't paused
       * (either live or already pending resume).
       **/
      ResumeFailed: AugmentedError<ApiType>;
      /**
       * Cannot signal forced change so soon after last.
       **/
      TooSoon: AugmentedError<ApiType>;
    };
    identity: {
      /**
       * Account ID is already named.
       **/
      AlreadyClaimed: AugmentedError<ApiType>;
      /**
       * The username cannot be unbound because it is already unbinding.
       **/
      AlreadyUnbinding: AugmentedError<ApiType>;
      /**
       * Empty index.
       **/
      EmptyIndex: AugmentedError<ApiType>;
      /**
       * Fee is changed.
       **/
      FeeChanged: AugmentedError<ApiType>;
      /**
       * The action cannot be performed because of insufficient privileges (e.g. authority
       * trying to unbind a username provided by the system).
       **/
      InsufficientPrivileges: AugmentedError<ApiType>;
      /**
       * The index is invalid.
       **/
      InvalidIndex: AugmentedError<ApiType>;
      /**
       * Invalid judgement.
       **/
      InvalidJudgement: AugmentedError<ApiType>;
      /**
       * The signature on a username was not valid.
       **/
      InvalidSignature: AugmentedError<ApiType>;
      /**
       * The provided suffix is too long.
       **/
      InvalidSuffix: AugmentedError<ApiType>;
      /**
       * The target is invalid.
       **/
      InvalidTarget: AugmentedError<ApiType>;
      /**
       * The username does not meet the requirements.
       **/
      InvalidUsername: AugmentedError<ApiType>;
      /**
       * The provided judgement was for a different identity.
       **/
      JudgementForDifferentIdentity: AugmentedError<ApiType>;
      /**
       * Judgement given.
       **/
      JudgementGiven: AugmentedError<ApiType>;
      /**
       * Error that occurs when there is an issue paying for judgement.
       **/
      JudgementPaymentFailed: AugmentedError<ApiType>;
      /**
       * The authority cannot allocate any more usernames.
       **/
      NoAllocation: AugmentedError<ApiType>;
      /**
       * No identity found.
       **/
      NoIdentity: AugmentedError<ApiType>;
      /**
       * The username cannot be forcefully removed because it can still be accepted.
       **/
      NotExpired: AugmentedError<ApiType>;
      /**
       * Account isn't found.
       **/
      NotFound: AugmentedError<ApiType>;
      /**
       * Account isn't named.
       **/
      NotNamed: AugmentedError<ApiType>;
      /**
       * Sub-account isn't owned by sender.
       **/
      NotOwned: AugmentedError<ApiType>;
      /**
       * Sender is not a sub-account.
       **/
      NotSub: AugmentedError<ApiType>;
      /**
       * The username cannot be removed because it is not unbinding.
       **/
      NotUnbinding: AugmentedError<ApiType>;
      /**
       * The sender does not have permission to issue a username.
       **/
      NotUsernameAuthority: AugmentedError<ApiType>;
      /**
       * The requested username does not exist.
       **/
      NoUsername: AugmentedError<ApiType>;
      /**
       * Setting this username requires a signature, but none was provided.
       **/
      RequiresSignature: AugmentedError<ApiType>;
      /**
       * Sticky judgement.
       **/
      StickyJudgement: AugmentedError<ApiType>;
      /**
       * The username cannot be removed because it's still in the grace period.
       **/
      TooEarly: AugmentedError<ApiType>;
      /**
       * Maximum amount of registrars reached. Cannot add any more.
       **/
      TooManyRegistrars: AugmentedError<ApiType>;
      /**
       * Too many subs-accounts.
       **/
      TooManySubAccounts: AugmentedError<ApiType>;
      /**
       * The username is already taken.
       **/
      UsernameTaken: AugmentedError<ApiType>;
    };
    imOnline: {
      /**
       * Duplicated heartbeat.
       **/
      DuplicatedHeartbeat: AugmentedError<ApiType>;
      /**
       * Non existent public key.
       **/
      InvalidKey: AugmentedError<ApiType>;
    };
    indices: {
      /**
       * The index was not available.
       **/
      InUse: AugmentedError<ApiType>;
      /**
       * The index was not already assigned.
       **/
      NotAssigned: AugmentedError<ApiType>;
      /**
       * The index is assigned to another account.
       **/
      NotOwner: AugmentedError<ApiType>;
      /**
       * The source and destination accounts are identical.
       **/
      NotTransfer: AugmentedError<ApiType>;
      /**
       * The index is permanent and may not be freed/changed.
       **/
      Permanent: AugmentedError<ApiType>;
    };
    messageQueue: {
      /**
       * The message was already processed and cannot be processed again.
       **/
      AlreadyProcessed: AugmentedError<ApiType>;
      /**
       * There is temporarily not enough weight to continue servicing messages.
       **/
      InsufficientWeight: AugmentedError<ApiType>;
      /**
       * The referenced message could not be found.
       **/
      NoMessage: AugmentedError<ApiType>;
      /**
       * Page to be reaped does not exist.
       **/
      NoPage: AugmentedError<ApiType>;
      /**
       * Page is not reapable because it has items remaining to be processed and is not old
       * enough.
       **/
      NotReapable: AugmentedError<ApiType>;
      /**
       * The message is queued for future execution.
       **/
      Queued: AugmentedError<ApiType>;
      /**
       * The queue is paused and no message can be executed from it.
       * 
       * This can change at any time and may resolve in the future by re-trying.
       **/
      QueuePaused: AugmentedError<ApiType>;
      /**
       * Another call is in progress and needs to finish before this call can happen.
       **/
      RecursiveDisallowed: AugmentedError<ApiType>;
      /**
       * This message is temporarily unprocessable.
       * 
       * Such errors are expected, but not guaranteed, to resolve themselves eventually through
       * retrying.
       **/
      TemporarilyUnprocessable: AugmentedError<ApiType>;
    };
    metaTx: {
      /**
       * The meta transactions's birth block is ancient.
       **/
      AncientBirthBlock: AugmentedError<ApiType>;
      /**
       * Invalid proof (e.g. signature).
       **/
      BadProof: AugmentedError<ApiType>;
      /**
       * The meta transaction is not yet valid (e.g. nonce too high).
       **/
      Future: AugmentedError<ApiType>;
      /**
       * The meta transaction is invalid.
       **/
      Invalid: AugmentedError<ApiType>;
      /**
       * The meta transaction is outdated (e.g. nonce too low).
       **/
      Stale: AugmentedError<ApiType>;
      /**
       * The transaction extension did not authorize any origin.
       **/
      UnknownOrigin: AugmentedError<ApiType>;
    };
    multiBlockMigrations: {
      /**
       * The operation cannot complete since some MBMs are ongoing.
       **/
      Ongoing: AugmentedError<ApiType>;
    };
    multisig: {
      /**
       * Call is already approved by this signatory.
       **/
      AlreadyApproved: AugmentedError<ApiType>;
      /**
       * The data to be stored is already stored.
       **/
      AlreadyStored: AugmentedError<ApiType>;
      /**
       * The maximum weight information provided was too low.
       **/
      MaxWeightTooLow: AugmentedError<ApiType>;
      /**
       * Threshold must be 2 or greater.
       **/
      MinimumThreshold: AugmentedError<ApiType>;
      /**
       * Call doesn't need any (more) approvals.
       **/
      NoApprovalsNeeded: AugmentedError<ApiType>;
      /**
       * Multisig operation not found when attempting to cancel.
       **/
      NotFound: AugmentedError<ApiType>;
      /**
       * No timepoint was given, yet the multisig operation is already underway.
       **/
      NoTimepoint: AugmentedError<ApiType>;
      /**
       * Only the account that originally created the multisig is able to cancel it.
       **/
      NotOwner: AugmentedError<ApiType>;
      /**
       * The sender was contained in the other signatories; it shouldn't be.
       **/
      SenderInSignatories: AugmentedError<ApiType>;
      /**
       * The signatories were provided out of order; they should be ordered.
       **/
      SignatoriesOutOfOrder: AugmentedError<ApiType>;
      /**
       * There are too few signatories in the list.
       **/
      TooFewSignatories: AugmentedError<ApiType>;
      /**
       * There are too many signatories in the list.
       **/
      TooManySignatories: AugmentedError<ApiType>;
      /**
       * A timepoint was given, yet no multisig operation is underway.
       **/
      UnexpectedTimepoint: AugmentedError<ApiType>;
      /**
       * A different timepoint was given to the multisig operation that is underway.
       **/
      WrongTimepoint: AugmentedError<ApiType>;
    };
    networkInfo: {
      /**
       * The identifier activity update failed
       **/
      ActivityUpdateFailed: AugmentedError<ApiType>;
      /**
       * The origin of the operation is not authorized or invalid.
       **/
      Badorigin: AugmentedError<ApiType>;
      /**
       * The provided account ID is invalid or not recognized.
       **/
      InvalidAccountId: AugmentedError<ApiType>;
      /**
       * The checksum of the token is invalid or does not match.
       **/
      InvalidChecksum: AugmentedError<ApiType>;
      /**
       * The cord genesis head is invalid or corrupted.
       **/
      InvalidCordGenesisHead: AugmentedError<ApiType>;
      /**
       * The provided entry input is invalid or malformed.
       **/
      InvalidEntryTypeInput: AugmentedError<ApiType>;
      /**
       * The identifier length is invalid or exceeds the maximum allowed.
       **/
      InvalidIdentifierLength: AugmentedError<ApiType>;
      /**
       * The provided input is invalid or malformed.
       **/
      InvalidInput: AugmentedError<ApiType>;
      /**
       * The network genesis head is invalid or corrupted.
       **/
      InvalidNetworkGenesisHead: AugmentedError<ApiType>;
      /**
       * The network ID is invalid or not recognized.
       **/
      InvalidNetworkId: AugmentedError<ApiType>;
      /**
       * The prefix in the provided token is invalid.
       **/
      InvalidPrefix: AugmentedError<ApiType>;
      /**
       * The provided token is invalid.
       **/
      InvalidToken: AugmentedError<ApiType>;
      /**
       * The provided URI is invalid or cannot be parsed.
       **/
      InvalidUri: AugmentedError<ApiType>;
      /**
       * The network configuration has already been added.
       **/
      NetworkConfigAlreadyAdded: AugmentedError<ApiType>;
      /**
       * The network information was not found.
       **/
      NetworkInfoNotFound: AugmentedError<ApiType>;
      /**
       * The storage configuration has already been added.
       **/
      StorageConfigAlreadyAdded: AugmentedError<ApiType>;
      /**
       * The storage configuration not found.
       **/
      StorageConfigNotFound: AugmentedError<ApiType>;
    };
    networkRegistrar: {
      /**
       * The network registration is currently active.
       **/
      ActiveRegistration: AugmentedError<ApiType>;
      /**
       * The ID is already registered and cannot be registered again.
       **/
      AlreadyRegistered: AugmentedError<ApiType>;
      /**
       * The origin of the operation is not authorized or invalid.
       **/
      BadOrigin: AugmentedError<ApiType>;
      /**
       * The cord genesis hash does not match the expected value.
       **/
      CordGenesisMismatch: AugmentedError<ApiType>;
      /**
       * The network registration has expired and is no longer active.
       **/
      InActiveRegistration: AugmentedError<ApiType>;
      /**
       * The provided account ID is invalid or not recognized.
       **/
      InvalidAccountId: AugmentedError<ApiType>;
      /**
       * The checksum of the token is invalid or does not match.
       **/
      InvalidChecksum: AugmentedError<ApiType>;
      /**
       * The cord genesis head is invalid or corrupted.
       **/
      InvalidCordGenesisHead: AugmentedError<ApiType>;
      /**
       * The provided genesis hash or head is invalid.
       **/
      InvalidGenesisHash: AugmentedError<ApiType>;
      /**
       * The network genesis head is invalid or corrupted.
       **/
      InvalidNetworkGenesisHead: AugmentedError<ApiType>;
      /**
       * The provided network id does not match the expected value.
       **/
      InvalidNetworkId: AugmentedError<ApiType>;
      /**
       * The prefix in the provided token is invalid.
       **/
      InvalidPrefix: AugmentedError<ApiType>;
      /**
       * The provided token is invalid.
       **/
      InvalidToken: AugmentedError<ApiType>;
      /**
       * The maximum number of entries supported for a block has been exceeded.
       **/
      MaxEntriesExceededForTheBlock: AugmentedError<ApiType>;
      /**
       * The caller is not the owner of the specified ID.
       **/
      NotOwner: AugmentedError<ApiType>;
      /**
       * The ID is not registered in the network.
       **/
      NotRegistered: AugmentedError<ApiType>;
      /**
       * The ID provided for registration has not been reserved beforehand.
       **/
      NotReserved: AugmentedError<ApiType>;
      /**
       * The network registration has been successfully renewed.
       **/
      RegistrationRenewed: AugmentedError<ApiType>;
      /**
       * The token generation process failed.
       **/
      TokenGenerationFailed: AugmentedError<ApiType>;
      /**
       * The provided token does not match the expected value.
       **/
      TokenMismatch: AugmentedError<ApiType>;
      /**
       * The network manager does not have sufficient balance to pay fees.
       **/
      UnableToPayFees: AugmentedError<ApiType>;
    };
    nftFractionalization: {
      /**
       * Asset ID does not correspond to locked NFT.
       **/
      IncorrectAssetId: AugmentedError<ApiType>;
      /**
       * NFT doesn't exist.
       **/
      NftNotFound: AugmentedError<ApiType>;
      /**
       * NFT has not yet been fractionalised.
       **/
      NftNotFractionalized: AugmentedError<ApiType>;
      /**
       * The signing account has no permission to do the operation.
       **/
      NoPermission: AugmentedError<ApiType>;
    };
    nfts: {
      /**
       * The provided Item was already used for claiming.
       **/
      AlreadyClaimed: AugmentedError<ApiType>;
      /**
       * The item ID has already been used for an item.
       **/
      AlreadyExists: AugmentedError<ApiType>;
      /**
       * The approval had a deadline that expired, so the approval isn't valid anymore.
       **/
      ApprovalExpired: AugmentedError<ApiType>;
      /**
       * The provided attribute can't be found.
       **/
      AttributeNotFound: AugmentedError<ApiType>;
      /**
       * The witness data given does not match the current state of the chain.
       **/
      BadWitness: AugmentedError<ApiType>;
      /**
       * The provided bid is too low.
       **/
      BidTooLow: AugmentedError<ApiType>;
      /**
       * Collection ID is already taken.
       **/
      CollectionIdInUse: AugmentedError<ApiType>;
      /**
       * Can't delete non-empty collections.
       **/
      CollectionNotEmpty: AugmentedError<ApiType>;
      /**
       * The deadline has already expired.
       **/
      DeadlineExpired: AugmentedError<ApiType>;
      /**
       * Item's config already exists and should be equal to the provided one.
       **/
      InconsistentItemConfig: AugmentedError<ApiType>;
      /**
       * The provided data is incorrect.
       **/
      IncorrectData: AugmentedError<ApiType>;
      /**
       * The provided metadata might be too long.
       **/
      IncorrectMetadata: AugmentedError<ApiType>;
      /**
       * The item is locked (non-transferable).
       **/
      ItemLocked: AugmentedError<ApiType>;
      /**
       * Items within that collection are non-transferable.
       **/
      ItemsNonTransferable: AugmentedError<ApiType>;
      /**
       * Collection's attributes are locked.
       **/
      LockedCollectionAttributes: AugmentedError<ApiType>;
      /**
       * Collection's metadata is locked.
       **/
      LockedCollectionMetadata: AugmentedError<ApiType>;
      /**
       * Item's attributes are locked.
       **/
      LockedItemAttributes: AugmentedError<ApiType>;
      /**
       * Item's metadata is locked.
       **/
      LockedItemMetadata: AugmentedError<ApiType>;
      /**
       * Can't set more attributes per one call.
       **/
      MaxAttributesLimitReached: AugmentedError<ApiType>;
      /**
       * The max supply is locked and can't be changed.
       **/
      MaxSupplyLocked: AugmentedError<ApiType>;
      /**
       * All items have been minted.
       **/
      MaxSupplyReached: AugmentedError<ApiType>;
      /**
       * The provided max supply is less than the number of items a collection already has.
       **/
      MaxSupplyTooSmall: AugmentedError<ApiType>;
      /**
       * The given item has no metadata set.
       **/
      MetadataNotFound: AugmentedError<ApiType>;
      /**
       * The method is disabled by system settings.
       **/
      MethodDisabled: AugmentedError<ApiType>;
      /**
       * Mint has already ended.
       **/
      MintEnded: AugmentedError<ApiType>;
      /**
       * Mint has not started yet.
       **/
      MintNotStarted: AugmentedError<ApiType>;
      /**
       * Config for a collection or an item can't be found.
       **/
      NoConfig: AugmentedError<ApiType>;
      /**
       * The signing account has no permission to do the operation.
       **/
      NoPermission: AugmentedError<ApiType>;
      /**
       * The provided account is not a delegate.
       **/
      NotDelegate: AugmentedError<ApiType>;
      /**
       * Item is not for sale.
       **/
      NotForSale: AugmentedError<ApiType>;
      /**
       * The item has reached its approval limit.
       **/
      ReachedApprovalLimit: AugmentedError<ApiType>;
      /**
       * Some roles were not cleared.
       **/
      RolesNotCleared: AugmentedError<ApiType>;
      /**
       * The named owner has not signed ownership acceptance of the collection.
       **/
      Unaccepted: AugmentedError<ApiType>;
      /**
       * No approval exists that would allow the transfer.
       **/
      Unapproved: AugmentedError<ApiType>;
      /**
       * The given item ID is unknown.
       **/
      UnknownCollection: AugmentedError<ApiType>;
      /**
       * The given item ID is unknown.
       **/
      UnknownItem: AugmentedError<ApiType>;
      /**
       * Swap doesn't exist.
       **/
      UnknownSwap: AugmentedError<ApiType>;
      /**
       * The witness data should be provided.
       **/
      WitnessRequired: AugmentedError<ApiType>;
      /**
       * The delegate turned out to be different to what was expected.
       **/
      WrongDelegate: AugmentedError<ApiType>;
      /**
       * The duration provided should be less than or equal to `MaxDeadlineDuration`.
       **/
      WrongDuration: AugmentedError<ApiType>;
      /**
       * The provided namespace isn't supported in this call.
       **/
      WrongNamespace: AugmentedError<ApiType>;
      /**
       * The extrinsic was sent by the wrong origin.
       **/
      WrongOrigin: AugmentedError<ApiType>;
      /**
       * The owner turned out to be different to what was expected.
       **/
      WrongOwner: AugmentedError<ApiType>;
      /**
       * The provided setting can't be set.
       **/
      WrongSetting: AugmentedError<ApiType>;
      /**
       * The provided signature is incorrect.
       **/
      WrongSignature: AugmentedError<ApiType>;
    };
    nominationPools: {
      /**
       * An account is already delegating in another pool. An account may only belong to one
       * pool at a time.
       **/
      AccountBelongsToOtherPool: AugmentedError<ApiType>;
      /**
       * The pool or member delegation has already migrated to delegate stake.
       **/
      AlreadyMigrated: AugmentedError<ApiType>;
      /**
       * Bonding extra is restricted to the exact pending reward amount.
       **/
      BondExtraRestricted: AugmentedError<ApiType>;
      /**
       * The pools state cannot be changed.
       **/
      CanNotChangeState: AugmentedError<ApiType>;
      /**
       * None of the funds can be withdrawn yet because the bonding duration has not passed.
       **/
      CannotWithdrawAny: AugmentedError<ApiType>;
      /**
       * The submitted changes to commission change rate are not allowed.
       **/
      CommissionChangeRateNotAllowed: AugmentedError<ApiType>;
      /**
       * Not enough blocks have surpassed since the last commission update.
       **/
      CommissionChangeThrottled: AugmentedError<ApiType>;
      /**
       * The supplied commission exceeds global maximum commission.
       **/
      CommissionExceedsGlobalMaximum: AugmentedError<ApiType>;
      /**
       * The supplied commission exceeds the max allowed commission.
       **/
      CommissionExceedsMaximum: AugmentedError<ApiType>;
      /**
       * Some error occurred that should never happen. This should be reported to the
       * maintainers.
       **/
      Defensive: AugmentedError<ApiType>;
      /**
       * The caller does not have adequate permissions.
       **/
      DoesNotHavePermission: AugmentedError<ApiType>;
      /**
       * The member is fully unbonded (and thus cannot access the bonded and reward pool
       * anymore to, for example, collect rewards).
       **/
      FullyUnbonding: AugmentedError<ApiType>;
      /**
       * Pool id provided is not correct/usable.
       **/
      InvalidPoolId: AugmentedError<ApiType>;
      /**
       * The pool's max commission cannot be set higher than the existing value.
       **/
      MaxCommissionRestricted: AugmentedError<ApiType>;
      /**
       * Too many members in the pool or system.
       **/
      MaxPoolMembers: AugmentedError<ApiType>;
      /**
       * The system is maxed out on pools.
       **/
      MaxPools: AugmentedError<ApiType>;
      /**
       * The member cannot unbond further chunks due to reaching the limit.
       **/
      MaxUnbondingLimit: AugmentedError<ApiType>;
      /**
       * Metadata exceeds [`Config::MaxMetadataLen`]
       **/
      MetadataExceedsMaxLen: AugmentedError<ApiType>;
      /**
       * The amount does not meet the minimum bond to either join or create a pool.
       * 
       * The depositor can never unbond to a value less than `Pallet::depositor_min_bond`. The
       * caller does not have nominating permissions for the pool. Members can never unbond to a
       * value below `MinJoinBond`.
       **/
      MinimumBondNotMet: AugmentedError<ApiType>;
      /**
       * No commission current has been set.
       **/
      NoCommissionCurrentSet: AugmentedError<ApiType>;
      /**
       * There is no pending commission to claim.
       **/
      NoPendingCommission: AugmentedError<ApiType>;
      /**
       * A pool must be in [`PoolState::Destroying`] in order for the depositor to unbond or for
       * other members to be permissionlessly unbonded.
       **/
      NotDestroying: AugmentedError<ApiType>;
      /**
       * No imbalance in the ED deposit for the pool.
       **/
      NothingToAdjust: AugmentedError<ApiType>;
      /**
       * No slash pending that can be applied to the member.
       **/
      NothingToSlash: AugmentedError<ApiType>;
      /**
       * Either a) the caller cannot make a valid kick or b) the pool is not destroying.
       **/
      NotKickerOrDestroying: AugmentedError<ApiType>;
      /**
       * The pool or member delegation has not migrated yet to delegate stake.
       **/
      NotMigrated: AugmentedError<ApiType>;
      /**
       * The caller does not have nominating permissions for the pool.
       **/
      NotNominator: AugmentedError<ApiType>;
      /**
       * The pool is not open to join
       **/
      NotOpen: AugmentedError<ApiType>;
      /**
       * This call is not allowed in the current state of the pallet.
       **/
      NotSupported: AugmentedError<ApiType>;
      /**
       * The transaction could not be executed due to overflow risk for the pool.
       **/
      OverflowRisk: AugmentedError<ApiType>;
      /**
       * Partial unbonding now allowed permissionlessly.
       **/
      PartialUnbondNotAllowedPermissionlessly: AugmentedError<ApiType>;
      /**
       * Pool id currently in use.
       **/
      PoolIdInUse: AugmentedError<ApiType>;
      /**
       * An account is not a member.
       **/
      PoolMemberNotFound: AugmentedError<ApiType>;
      /**
       * A (bonded) pool id does not exist.
       **/
      PoolNotFound: AugmentedError<ApiType>;
      /**
       * A reward pool does not exist. In all cases this is a system logic error.
       **/
      RewardPoolNotFound: AugmentedError<ApiType>;
      /**
       * The slash amount is too low to be applied.
       **/
      SlashTooLow: AugmentedError<ApiType>;
      /**
       * A sub pool does not exist.
       **/
      SubPoolsNotFound: AugmentedError<ApiType>;
    };
    poolAssets: {
      /**
       * The asset-account already exists.
       **/
      AlreadyExists: AugmentedError<ApiType>;
      /**
       * The asset is not live, and likely being destroyed.
       **/
      AssetNotLive: AugmentedError<ApiType>;
      /**
       * The asset ID must be equal to the [`NextAssetId`].
       **/
      BadAssetId: AugmentedError<ApiType>;
      /**
       * Invalid metadata given.
       **/
      BadMetadata: AugmentedError<ApiType>;
      /**
       * Invalid witness data given.
       **/
      BadWitness: AugmentedError<ApiType>;
      /**
       * Account balance must be greater than or equal to the transfer amount.
       **/
      BalanceLow: AugmentedError<ApiType>;
      /**
       * Callback action resulted in error
       **/
      CallbackFailed: AugmentedError<ApiType>;
      /**
       * The origin account is frozen.
       **/
      Frozen: AugmentedError<ApiType>;
      /**
       * The asset status is not the expected status.
       **/
      IncorrectStatus: AugmentedError<ApiType>;
      /**
       * The asset ID is already taken.
       **/
      InUse: AugmentedError<ApiType>;
      /**
       * The asset is a live asset and is actively being used. Usually emit for operations such
       * as `start_destroy` which require the asset to be in a destroying state.
       **/
      LiveAsset: AugmentedError<ApiType>;
      /**
       * Minimum balance should be non-zero.
       **/
      MinBalanceZero: AugmentedError<ApiType>;
      /**
       * The account to alter does not exist.
       **/
      NoAccount: AugmentedError<ApiType>;
      /**
       * The asset-account doesn't have an associated deposit.
       **/
      NoDeposit: AugmentedError<ApiType>;
      /**
       * The signing account has no permission to do the operation.
       **/
      NoPermission: AugmentedError<ApiType>;
      /**
       * The asset should be frozen before the given operation.
       **/
      NotFrozen: AugmentedError<ApiType>;
      /**
       * No approval exists that would allow the transfer.
       **/
      Unapproved: AugmentedError<ApiType>;
      /**
       * Unable to increment the consumer reference counters on the account. Either no provider
       * reference exists to allow a non-zero balance of a non-self-sufficient asset, or one
       * fewer then the maximum number of consumers has been reached.
       **/
      UnavailableConsumer: AugmentedError<ApiType>;
      /**
       * The given asset ID is unknown.
       **/
      Unknown: AugmentedError<ApiType>;
      /**
       * The operation would result in funds being burned.
       **/
      WouldBurn: AugmentedError<ApiType>;
      /**
       * The source account would not survive the transfer and it needs to stay alive.
       **/
      WouldDie: AugmentedError<ApiType>;
    };
    preimage: {
      /**
       * Preimage has already been noted on-chain.
       **/
      AlreadyNoted: AugmentedError<ApiType>;
      /**
       * The user is not authorized to perform this action.
       **/
      NotAuthorized: AugmentedError<ApiType>;
      /**
       * The preimage cannot be removed since it has not yet been noted.
       **/
      NotNoted: AugmentedError<ApiType>;
      /**
       * The preimage request cannot be removed since no outstanding requests exist.
       **/
      NotRequested: AugmentedError<ApiType>;
      /**
       * A preimage may not be removed when there are outstanding requests.
       **/
      Requested: AugmentedError<ApiType>;
      /**
       * Preimage is too large to store on-chain.
       **/
      TooBig: AugmentedError<ApiType>;
      /**
       * Too few hashes were requested to be upgraded (i.e. zero).
       **/
      TooFew: AugmentedError<ApiType>;
      /**
       * More than `MAX_HASH_UPGRADE_BULK_COUNT` hashes were requested to be upgraded at once.
       **/
      TooMany: AugmentedError<ApiType>;
    };
    profile: {
      /**
       * The event activity update has failed.
       **/
      ActivityUpdateFailed: AugmentedError<ApiType>;
      /**
       * Rotation must be to new key, not to existing tied account.
       **/
      CannotRotateToSameAccount: AugmentedError<ApiType>;
      /**
       * The entry type for the activity is not valid.
       **/
      InvalidEntryTypeInput: AugmentedError<ApiType>;
      /**
       * The length of the identifier exceeds capacity limit.
       **/
      InvalidIdentifierLength: AugmentedError<ApiType>;
      /**
       * The Profile data key must start with 'pub_'
       **/
      InvalidKeyPrefix: AugmentedError<ApiType>;
      /**
       * The Profile already exists with a identifier.
       **/
      ProfileAlreadyExists: AugmentedError<ApiType>;
      /**
       * The Profile Identifier does not exist.
       **/
      ProfileNotFound: AugmentedError<ApiType>;
      /**
       * Storage transaction has failed abrubtly.
       **/
      TransactionFailed: AugmentedError<ApiType>;
    };
    registry: {
      /**
       * The activity update operation failed.
       **/
      ActivityUpdateFailed: AugmentedError<ApiType>;
      /**
       * The registry is already archived.
       **/
      ArchivedRegistry: AugmentedError<ApiType>;
      /**
       * The delegate is already added to the collection.
       **/
      DelegateAlreadyExists: AugmentedError<ApiType>;
      /**
       * The specified delegate was not found.
       **/
      DelegateNotFound: AugmentedError<ApiType>;
      /**
       * The provided entry type input is invalid.
       **/
      InvalidEntryTypeInput: AugmentedError<ApiType>;
      /**
       * The provided identifier length is invalid.
       **/
      InvalidIdentifierLength: AugmentedError<ApiType>;
      /**
       * A registry with the given identifier already exists in the collection.
       **/
      RegistryAlreadyExists: AugmentedError<ApiType>;
      /**
       * The registry is not archived (and thus cannot be restored).
       **/
      RegistryNotArchived: AugmentedError<ApiType>;
      /**
       * The specified registry was not found in the collection.
       **/
      RegistryNotFound: AugmentedError<ApiType>;
      /**
       * The caller does not have the required permissions.
       **/
      UnauthorizedOperation: AugmentedError<ApiType>;
    };
    remark: {
      /**
       * Attempted to call `store` outside of block execution.
       **/
      BadContext: AugmentedError<ApiType>;
      /**
       * Attempting to store empty data.
       **/
      Empty: AugmentedError<ApiType>;
    };
    revive: {
      /**
       * Tried to map an account that is already mapped.
       **/
      AccountAlreadyMapped: AugmentedError<ApiType>;
      /**
       * An `AccountID32` account tried to interact with the pallet without having a mapping.
       * 
       * Call [`Pallet::map_account`] in order to create a mapping for the account.
       **/
      AccountUnmapped: AugmentedError<ApiType>;
      /**
       * Failed to convert a U256 to a Balance.
       **/
      BalanceConversionFailed: AugmentedError<ApiType>;
      /**
       * The program contains a basic block that is larger than allowed.
       **/
      BasicBlockTooLarge: AugmentedError<ApiType>;
      /**
       * The code blob supplied is larger than [`limits::code::BLOB_BYTES`].
       **/
      BlobTooLarge: AugmentedError<ApiType>;
      /**
       * Can not add a delegate dependency to the code hash of the contract itself.
       **/
      CannotAddSelfAsDelegateDependency: AugmentedError<ApiType>;
      /**
       * No code info could be found at the supplied code hash.
       **/
      CodeInfoNotFound: AugmentedError<ApiType>;
      /**
       * Code removal was denied because the code is still in use by at least one contract.
       **/
      CodeInUse: AugmentedError<ApiType>;
      /**
       * No code could be found at the supplied code hash.
       **/
      CodeNotFound: AugmentedError<ApiType>;
      /**
       * The contract failed to compile or is missing the correct entry points.
       * 
       * A more detailed error can be found on the node console if debug messages are enabled
       * by supplying `-lruntime::revive=debug`.
       **/
      CodeRejected: AugmentedError<ApiType>;
      /**
       * No contract was found at the specified address.
       **/
      ContractNotFound: AugmentedError<ApiType>;
      /**
       * The contract ran to completion but decided to revert its storage changes.
       * Please note that this error is only returned from extrinsics. When called directly
       * or via RPC an `Ok` will be returned. In this case the caller needs to inspect the flags
       * to determine whether a reversion has taken place.
       **/
      ContractReverted: AugmentedError<ApiType>;
      /**
       * Contract trapped during execution.
       **/
      ContractTrapped: AugmentedError<ApiType>;
      /**
       * Failed to convert an EVM balance to a native balance.
       **/
      DecimalPrecisionLoss: AugmentedError<ApiType>;
      /**
       * Input passed to a contract API function failed to decode as expected type.
       **/
      DecodingFailed: AugmentedError<ApiType>;
      /**
       * The contract already depends on the given delegate dependency.
       **/
      DelegateDependencyAlreadyExists: AugmentedError<ApiType>;
      /**
       * The dependency was not found in the contract's delegate dependencies.
       **/
      DelegateDependencyNotFound: AugmentedError<ApiType>;
      /**
       * A contract with the same AccountId already exists.
       **/
      DuplicateContract: AugmentedError<ApiType>;
      /**
       * PolkaVM failed during code execution. Probably due to a malformed program.
       **/
      ExecutionFailed: AugmentedError<ApiType>;
      /**
       * `seal_call` forwarded this contracts input. It therefore is no longer available.
       **/
      InputForwarded: AugmentedError<ApiType>;
      /**
       * Invalid combination of flags supplied to `seal_call` or `seal_delegate_call`.
       **/
      InvalidCallFlags: AugmentedError<ApiType>;
      /**
       * The transaction used to dry-run a contract is invalid.
       **/
      InvalidGenericTransaction: AugmentedError<ApiType>;
      /**
       * Immutable data can only be set during deploys and only be read during calls.
       * Additionally, it is only valid to set the data once and it must not be empty.
       **/
      InvalidImmutableAccess: AugmentedError<ApiType>;
      /**
       * The program contains an invalid instruction.
       **/
      InvalidInstruction: AugmentedError<ApiType>;
      /**
       * Invalid schedule supplied, e.g. with zero weight of a basic operation.
       **/
      InvalidSchedule: AugmentedError<ApiType>;
      /**
       * Invalid storage flags were passed to one of the storage syscalls.
       **/
      InvalidStorageFlags: AugmentedError<ApiType>;
      /**
       * The contract tried to call a syscall which does not exist (at its current api level).
       **/
      InvalidSyscall: AugmentedError<ApiType>;
      /**
       * Performing a call was denied because the calling depth reached the limit
       * of what is specified in the schedule.
       **/
      MaxCallDepthReached: AugmentedError<ApiType>;
      /**
       * The contract has reached its maximum number of delegate dependencies.
       **/
      MaxDelegateDependenciesReached: AugmentedError<ApiType>;
      /**
       * The chain does not provide a chain extension. Calling the chain extension results
       * in this error. Note that this usually  shouldn't happen as deploying such contracts
       * is rejected.
       **/
      NoChainExtension: AugmentedError<ApiType>;
      /**
       * A buffer outside of sandbox memory was passed to a contract API function.
       **/
      OutOfBounds: AugmentedError<ApiType>;
      /**
       * The executed contract exhausted its gas limit.
       **/
      OutOfGas: AugmentedError<ApiType>;
      /**
       * Can not add more data to transient storage.
       **/
      OutOfTransientStorage: AugmentedError<ApiType>;
      /**
       * A contract called into the runtime which then called back into this pallet.
       **/
      ReenteredPallet: AugmentedError<ApiType>;
      /**
       * A call tried to invoke a contract that is flagged as non-reentrant.
       **/
      ReentranceDenied: AugmentedError<ApiType>;
      /**
       * A contract attempted to invoke a state modifying API while being in read-only mode.
       **/
      StateChangeDenied: AugmentedError<ApiType>;
      /**
       * The static memory consumption of the blob will be larger than
       * [`limits::code::STATIC_MEMORY_BYTES`].
       **/
      StaticMemoryTooLarge: AugmentedError<ApiType>;
      /**
       * More storage was created than allowed by the storage deposit limit.
       **/
      StorageDepositLimitExhausted: AugmentedError<ApiType>;
      /**
       * Origin doesn't have enough balance to pay the required storage deposits.
       **/
      StorageDepositNotEnoughFunds: AugmentedError<ApiType>;
      /**
       * A contract self destructed in its constructor.
       * 
       * This can be triggered by a call to `seal_terminate`.
       **/
      TerminatedInConstructor: AugmentedError<ApiType>;
      /**
       * Termination of a contract is not allowed while the contract is already
       * on the call stack. Can be triggered by `seal_terminate`.
       **/
      TerminatedWhileReentrant: AugmentedError<ApiType>;
      /**
       * The amount of topics passed to `seal_deposit_events` exceeds the limit.
       **/
      TooManyTopics: AugmentedError<ApiType>;
      /**
       * Performing the requested transfer failed. Probably because there isn't enough
       * free balance in the sender's account.
       **/
      TransferFailed: AugmentedError<ApiType>;
      /**
       * The size defined in `T::MaxValueSize` was exceeded.
       **/
      ValueTooLarge: AugmentedError<ApiType>;
      /**
       * Failed to decode the XCM program.
       **/
      XCMDecodeFailed: AugmentedError<ApiType>;
    };
    safeMode: {
      /**
       * The account already has a deposit reserved and can therefore not enter or extend again.
       **/
      AlreadyDeposited: AugmentedError<ApiType>;
      /**
       * This deposit cannot be released yet.
       **/
      CannotReleaseYet: AugmentedError<ApiType>;
      /**
       * An error from the underlying `Currency`.
       **/
      CurrencyError: AugmentedError<ApiType>;
      /**
       * The safe-mode is (already or still) entered.
       **/
      Entered: AugmentedError<ApiType>;
      /**
       * The safe-mode is (already or still) exited.
       **/
      Exited: AugmentedError<ApiType>;
      /**
       * There is no balance reserved.
       **/
      NoDeposit: AugmentedError<ApiType>;
      /**
       * This functionality of the pallet is disabled by the configuration.
       **/
      NotConfigured: AugmentedError<ApiType>;
    };
    scheduler: {
      /**
       * Failed to schedule a call
       **/
      FailedToSchedule: AugmentedError<ApiType>;
      /**
       * Attempt to use a non-named function on a named task.
       **/
      Named: AugmentedError<ApiType>;
      /**
       * Cannot find the scheduled call.
       **/
      NotFound: AugmentedError<ApiType>;
      /**
       * Reschedule failed because it does not change scheduled time.
       **/
      RescheduleNoChange: AugmentedError<ApiType>;
      /**
       * Given target block number is in the past.
       **/
      TargetBlockNumberInPast: AugmentedError<ApiType>;
    };
    session: {
      /**
       * Registered duplicate key.
       **/
      DuplicatedKey: AugmentedError<ApiType>;
      /**
       * Invalid ownership proof.
       **/
      InvalidProof: AugmentedError<ApiType>;
      /**
       * Key setting account is not live, so it's impossible to associate keys.
       **/
      NoAccount: AugmentedError<ApiType>;
      /**
       * No associated validator ID for account.
       **/
      NoAssociatedValidatorId: AugmentedError<ApiType>;
      /**
       * No keys are associated with this account.
       **/
      NoKeys: AugmentedError<ApiType>;
    };
    staking: {
      /**
       * Stash is already bonded.
       **/
      AlreadyBonded: AugmentedError<ApiType>;
      /**
       * Rewards for this era have already been claimed for this validator.
       **/
      AlreadyClaimed: AugmentedError<ApiType>;
      /**
       * The stake of this account is already migrated to `Fungible` holds.
       **/
      AlreadyMigrated: AugmentedError<ApiType>;
      /**
       * Controller is already paired.
       **/
      AlreadyPaired: AugmentedError<ApiType>;
      /**
       * Internal state has become somehow corrupted and the operation cannot continue.
       **/
      BadState: AugmentedError<ApiType>;
      /**
       * A nomination target was supplied that was blocked or otherwise not a validator.
       **/
      BadTarget: AugmentedError<ApiType>;
      /**
       * Some bound is not met.
       **/
      BoundNotMet: AugmentedError<ApiType>;
      /**
       * The user has enough bond and thus cannot be chilled forcefully by an external person.
       **/
      CannotChillOther: AugmentedError<ApiType>;
      /**
       * Stash could not be reaped as other pallet might depend on it.
       **/
      CannotReapStash: AugmentedError<ApiType>;
      /**
       * Cannot reset a ledger.
       **/
      CannotRestoreLedger: AugmentedError<ApiType>;
      /**
       * Commission is too low. Must be at least `MinCommission`.
       **/
      CommissionTooLow: AugmentedError<ApiType>;
      /**
       * Used when attempting to use deprecated controller account logic.
       **/
      ControllerDeprecated: AugmentedError<ApiType>;
      /**
       * Duplicate index.
       **/
      DuplicateIndex: AugmentedError<ApiType>;
      /**
       * Targets cannot be empty.
       **/
      EmptyTargets: AugmentedError<ApiType>;
      /**
       * Attempting to target a stash that still has funds.
       **/
      FundedTarget: AugmentedError<ApiType>;
      /**
       * Incorrect previous history depth input provided.
       **/
      IncorrectHistoryDepth: AugmentedError<ApiType>;
      /**
       * Incorrect number of slashing spans provided.
       **/
      IncorrectSlashingSpans: AugmentedError<ApiType>;
      /**
       * Cannot have a validator or nominator role, with value less than the minimum defined by
       * governance (see `MinValidatorBond` and `MinNominatorBond`). If unbonding is the
       * intention, `chill` first to remove one's role as validator/nominator.
       **/
      InsufficientBond: AugmentedError<ApiType>;
      /**
       * Invalid era to reward.
       **/
      InvalidEraToReward: AugmentedError<ApiType>;
      /**
       * Invalid number of nominations.
       **/
      InvalidNumberOfNominations: AugmentedError<ApiType>;
      /**
       * No nominators exist on this page.
       **/
      InvalidPage: AugmentedError<ApiType>;
      /**
       * Slash record index out of bounds.
       **/
      InvalidSlashIndex: AugmentedError<ApiType>;
      /**
       * Can not schedule more unlock chunks.
       **/
      NoMoreChunks: AugmentedError<ApiType>;
      /**
       * Not a controller account.
       **/
      NotController: AugmentedError<ApiType>;
      /**
       * Not enough funds available to withdraw.
       **/
      NotEnoughFunds: AugmentedError<ApiType>;
      /**
       * Items are not sorted and unique.
       **/
      NotSortedAndUnique: AugmentedError<ApiType>;
      /**
       * Not a stash account.
       **/
      NotStash: AugmentedError<ApiType>;
      /**
       * Can not rebond without unlocking chunks.
       **/
      NoUnlockChunk: AugmentedError<ApiType>;
      /**
       * Provided reward destination is not allowed.
       **/
      RewardDestinationRestricted: AugmentedError<ApiType>;
      /**
       * There are too many nominators in the system. Governance needs to adjust the staking
       * settings to keep things safe for the runtime.
       **/
      TooManyNominators: AugmentedError<ApiType>;
      /**
       * Too many nomination targets supplied.
       **/
      TooManyTargets: AugmentedError<ApiType>;
      /**
       * There are too many validator candidates in the system. Governance needs to adjust the
       * staking settings to keep things safe for the runtime.
       **/
      TooManyValidators: AugmentedError<ApiType>;
      /**
       * Operation not allowed for virtual stakers.
       **/
      VirtualStakerNotAllowed: AugmentedError<ApiType>;
    };
    stateTrieMigration: {
      /**
       * Bad child root provided.
       **/
      BadChildRoot: AugmentedError<ApiType>;
      /**
       * Bad witness data provided.
       **/
      BadWitness: AugmentedError<ApiType>;
      /**
       * A key was longer than the configured maximum.
       * 
       * This means that the migration halted at the current [`Progress`] and
       * can be resumed with a larger [`crate::Config::MaxKeyLen`] value.
       * Retrying with the same [`crate::Config::MaxKeyLen`] value will not work.
       * The value should only be increased to avoid a storage migration for the currently
       * stored [`crate::Progress::LastKey`].
       **/
      KeyTooLong: AugmentedError<ApiType>;
      /**
       * Max signed limits not respected.
       **/
      MaxSignedLimits: AugmentedError<ApiType>;
      /**
       * submitter does not have enough funds.
       **/
      NotEnoughFunds: AugmentedError<ApiType>;
      /**
       * Signed migration is not allowed because the maximum limit is not set yet.
       **/
      SignedMigrationNotAllowed: AugmentedError<ApiType>;
    };
    sudo: {
      /**
       * Sender must be the Sudo account.
       **/
      RequireSudo: AugmentedError<ApiType>;
    };
    system: {
      /**
       * The origin filter prevent the call to be dispatched.
       **/
      CallFiltered: AugmentedError<ApiType>;
      /**
       * Failed to extract the runtime version from the new runtime.
       * 
       * Either calling `Core_version` or decoding `RuntimeVersion` failed.
       **/
      FailedToExtractRuntimeVersion: AugmentedError<ApiType>;
      /**
       * The name of specification does not match between the current runtime
       * and the new runtime.
       **/
      InvalidSpecName: AugmentedError<ApiType>;
      /**
       * A multi-block migration is ongoing and prevents the current code from being replaced.
       **/
      MultiBlockMigrationsOngoing: AugmentedError<ApiType>;
      /**
       * Suicide called when the account has non-default composite data.
       **/
      NonDefaultComposite: AugmentedError<ApiType>;
      /**
       * There is a non-zero reference count preventing the account from being purged.
       **/
      NonZeroRefCount: AugmentedError<ApiType>;
      /**
       * No upgrade authorized.
       **/
      NothingAuthorized: AugmentedError<ApiType>;
      /**
       * The specification version is not allowed to decrease between the current runtime
       * and the new runtime.
       **/
      SpecVersionNeedsToIncrease: AugmentedError<ApiType>;
      /**
       * The submitted code is not authorized.
       **/
      Unauthorized: AugmentedError<ApiType>;
    };
    technicalCommittee: {
      /**
       * Members are already initialized!
       **/
      AlreadyInitialized: AugmentedError<ApiType>;
      /**
       * Duplicate proposals not allowed
       **/
      DuplicateProposal: AugmentedError<ApiType>;
      /**
       * Duplicate vote ignored
       **/
      DuplicateVote: AugmentedError<ApiType>;
      /**
       * Account is not a member
       **/
      NotMember: AugmentedError<ApiType>;
      /**
       * Prime account is not a member
       **/
      PrimeAccountNotMember: AugmentedError<ApiType>;
      /**
       * Proposal is still active.
       **/
      ProposalActive: AugmentedError<ApiType>;
      /**
       * Proposal must exist
       **/
      ProposalMissing: AugmentedError<ApiType>;
      /**
       * The close call was made too early, before the end of the voting.
       **/
      TooEarly: AugmentedError<ApiType>;
      /**
       * There can only be a maximum of `MaxProposals` active proposals.
       **/
      TooManyProposals: AugmentedError<ApiType>;
      /**
       * Mismatched index
       **/
      WrongIndex: AugmentedError<ApiType>;
      /**
       * The given length bound for the proposal was too low.
       **/
      WrongProposalLength: AugmentedError<ApiType>;
      /**
       * The given weight bound for the proposal was too low.
       **/
      WrongProposalWeight: AugmentedError<ApiType>;
    };
    technicalMembership: {
      /**
       * Already a member.
       **/
      AlreadyMember: AugmentedError<ApiType>;
      /**
       * Not a member.
       **/
      NotMember: AugmentedError<ApiType>;
      /**
       * Too many members.
       **/
      TooManyMembers: AugmentedError<ApiType>;
    };
    treasury: {
      /**
       * The payment has already been attempted.
       **/
      AlreadyAttempted: AugmentedError<ApiType>;
      /**
       * The spend is not yet eligible for payout.
       **/
      EarlyPayout: AugmentedError<ApiType>;
      /**
       * The balance of the asset kind is not convertible to the balance of the native asset.
       **/
      FailedToConvertBalance: AugmentedError<ApiType>;
      /**
       * The payment has neither failed nor succeeded yet.
       **/
      Inconclusive: AugmentedError<ApiType>;
      /**
       * The spend origin is valid but the amount it is allowed to spend is lower than the
       * amount to be spent.
       **/
      InsufficientPermission: AugmentedError<ApiType>;
      /**
       * No proposal, bounty or spend at that index.
       **/
      InvalidIndex: AugmentedError<ApiType>;
      /**
       * The payout was not yet attempted/claimed.
       **/
      NotAttempted: AugmentedError<ApiType>;
      /**
       * There was some issue with the mechanism of payment.
       **/
      PayoutError: AugmentedError<ApiType>;
      /**
       * Proposal has not been approved.
       **/
      ProposalNotApproved: AugmentedError<ApiType>;
      /**
       * The spend has expired and cannot be claimed.
       **/
      SpendExpired: AugmentedError<ApiType>;
      /**
       * Too many approvals in the queue.
       **/
      TooManyApprovals: AugmentedError<ApiType>;
    };
    txPause: {
      /**
       * The call is paused.
       **/
      IsPaused: AugmentedError<ApiType>;
      /**
       * The call is unpaused.
       **/
      IsUnpaused: AugmentedError<ApiType>;
      NotFound: AugmentedError<ApiType>;
      /**
       * The call is whitelisted and cannot be paused.
       **/
      Unpausable: AugmentedError<ApiType>;
    };
    utility: {
      /**
       * Too many calls batched.
       **/
      TooManyCalls: AugmentedError<ApiType>;
    };
    voterList: {
      /**
       * A error in the list interface implementation.
       **/
      List: AugmentedError<ApiType>;
    };
  } // AugmentedErrors
} // declare module
