// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/errors';

import type { ApiTypes, AugmentedError } from '@polkadot/api-base/types';

export type __AugmentedError<ApiType extends ApiTypes> = AugmentedError<ApiType>;

declare module '@polkadot/api-base/types/errors' {
  interface AugmentedErrors<ApiType extends ApiTypes> {
    asset: {
      /**
       * Asset already added
       **/
      AssetIdAlreadyExists: AugmentedError<ApiType>;
      /**
       * Asset identifier not found
       **/
      AssetIdNotFound: AugmentedError<ApiType>;
      /**
       * Asset is in same status as asked for
       **/
      AssetInSameState: AugmentedError<ApiType>;
      /**
       * asset instance not found
       **/
      AssetInstanceNotFound: AugmentedError<ApiType>;
      /**
       * Asset is not active
       **/
      AssetNotActive: AugmentedError<ApiType>;
      /**
       * distribution limit exceeded
       **/
      DistributionLimitExceeded: AugmentedError<ApiType>;
      /**
       * Asset is not active
       **/
      InstanceNotActive: AugmentedError<ApiType>;
      /**
       * Invalid asset quantity - should be greater than zero
       **/
      InvalidAssetQty: AugmentedError<ApiType>;
      /**
       * Invalid asset type
       **/
      InvalidAssetType: AugmentedError<ApiType>;
      /**
       * Invalid asset value - should be greater than zero
       **/
      InvalidAssetValue: AugmentedError<ApiType>;
      /**
       * Invalid digest
       **/
      InvalidDigest: AugmentedError<ApiType>;
      /**
       * Invalid Identifer Length
       **/
      InvalidIdentifierLength: AugmentedError<ApiType>;
      /**
       * Invalid creator signature
       **/
      InvalidSignature: AugmentedError<ApiType>;
      /**
       * Not enough balance
       **/
      OverIssuanceLimit: AugmentedError<ApiType>;
      /**
       * Unauthorized operation
       **/
      UnauthorizedOperation: AugmentedError<ApiType>;
    };
    authorityMembership: {
      /**
       * The authority entry already exists.
       **/
      MemberAlreadyExists: AugmentedError<ApiType>;
      /**
       * Already incoming
       **/
      MemberAlreadyIncoming: AugmentedError<ApiType>;
      /**
       * Already outgoing
       **/
      MemberAlreadyOutgoing: AugmentedError<ApiType>;
      /**
       * Member is blacklisted
       **/
      MemberBlackListed: AugmentedError<ApiType>;
      /**
       * Member not blacklisted
       **/
      MemberNotBlackListed: AugmentedError<ApiType>;
      /**
       * Not found owner key
       * There is no authority with the given ID.
       **/
      MemberNotFound: AugmentedError<ApiType>;
      /**
       * Not a network member
       **/
      NetworkMembershipNotFound: AugmentedError<ApiType>;
      /**
       * Session keys not provided
       **/
      SessionKeysNotAdded: AugmentedError<ApiType>;
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
    chainSpace: {
      /**
       * Archived Space
       **/
      ArchivedSpace: AugmentedError<ApiType>;
      /**
       * Authorization Id not found
       **/
      AuthorizationNotFound: AugmentedError<ApiType>;
      /**
       * The new capacity value is lower than the current usage
       **/
      CapacityLessThanUsage: AugmentedError<ApiType>;
      /**
       * The capacity limit for the space has been exceeded.
       **/
      CapacityLimitExceeded: AugmentedError<ApiType>;
      /**
       * Authority already added
       **/
      DelegateAlreadyAdded: AugmentedError<ApiType>;
      /**
       * Delegate not found.
       **/
      DelegateNotFound: AugmentedError<ApiType>;
      /**
       * Empty transaction.
       **/
      EmptyTransaction: AugmentedError<ApiType>;
      /**
       * Invalid Identifier
       **/
      InvalidIdentifier: AugmentedError<ApiType>;
      /**
       * Invalid Identifier Length
       **/
      InvalidIdentifierLength: AugmentedError<ApiType>;
      /**
       * Invalid Identifier Prefix
       **/
      InvalidIdentifierPrefix: AugmentedError<ApiType>;
      /**
       * Space identifier is not unique
       **/
      SpaceAlreadyAnchored: AugmentedError<ApiType>;
      /**
       * Space already approved
       **/
      SpaceAlreadyApproved: AugmentedError<ApiType>;
      /**
       * Space delegation limit exceeded
       **/
      SpaceDelegatesLimitExceeded: AugmentedError<ApiType>;
      /**
       * Space not approved.
       **/
      SpaceNotApproved: AugmentedError<ApiType>;
      /**
       * Space not Archived
       **/
      SpaceNotArchived: AugmentedError<ApiType>;
      /**
       * Space identifier not found
       **/
      SpaceNotFound: AugmentedError<ApiType>;
      /**
       * Type capacity overflow
       **/
      TypeCapacityOverflow: AugmentedError<ApiType>;
      /**
       * Only when the author is not the controller or delegate.
       **/
      UnauthorizedOperation: AugmentedError<ApiType>;
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
    did: {
      /**
       * The DID has already been previously deleted.
       **/
      AlreadyDeleted: AugmentedError<ApiType>;
      /**
       * The DID with the given identifier is already present on chain.
       **/
      AlreadyExists: AugmentedError<ApiType>;
      /**
       * The DID call was submitted by the wrong account
       **/
      BadDidOrigin: AugmentedError<ApiType>;
      /**
       * An error that is not supposed to take place, yet it happened.
       **/
      Internal: AugmentedError<ApiType>;
      /**
       * The call had parameters that conflicted with each other
       * or were invalid.
       **/
      InvalidDidAuthorizationCall: AugmentedError<ApiType>;
      /**
       * The DID operation nonce is not equal to the current DID nonce + 1.
       **/
      InvalidNonce: AugmentedError<ApiType>;
      /**
       * One of the service endpoint details contains non-ASCII characters.
       **/
      InvalidServiceEncoding: AugmentedError<ApiType>;
      /**
       * The DID operation signature is invalid for the payload and the
       * verification key provided.
       **/
      InvalidSignature: AugmentedError<ApiType>;
      /**
       * The DID operation signature is not in the format the verification
       * key expects.
       **/
      InvalidSignatureFormat: AugmentedError<ApiType>;
      /**
       * The maximum number of key agreements has been reached for the DID
       * subject.
       **/
      MaxKeyAgreementKeysExceeded: AugmentedError<ApiType>;
      /**
       * A number of new key agreement keys greater than the maximum allowed
       * has been provided.
       **/
      MaxNewKeyAgreementKeysLimitExceeded: AugmentedError<ApiType>;
      /**
       * The maximum number of service endpoints for a DID has been exceeded.
       **/
      MaxNumberOfServicesExceeded: AugmentedError<ApiType>;
      /**
       * The maximum number of types for a service endpoint has been
       * exceeded.
       **/
      MaxNumberOfTypesPerServiceExceeded: AugmentedError<ApiType>;
      /**
       * The maximum number of URLs for a service endpoint has been exceeded.
       **/
      MaxNumberOfUrlsPerServiceExceeded: AugmentedError<ApiType>;
      /**
       * The maximum number of public keys for this DID key identifier has
       * been reached.
       **/
      MaxPublicKeysExceeded: AugmentedError<ApiType>;
      /**
       * The service endpoint ID exceeded the maximum allowed length.
       **/
      MaxServiceIdLengthExceeded: AugmentedError<ApiType>;
      /**
       * One of the service endpoint types exceeded the maximum allowed
       * length.
       **/
      MaxServiceTypeLengthExceeded: AugmentedError<ApiType>;
      /**
       * One of the service endpoint URLs exceeded the maximum allowed
       * length.
       **/
      MaxServiceUrlLengthExceeded: AugmentedError<ApiType>;
      /**
       * The number of service endpoints stored under the DID is larger than
       * the number of endpoints to delete.
       **/
      MaxStoredEndpointsCountExceeded: AugmentedError<ApiType>;
      /**
       * No DID with the given identifier is present on chain.
       **/
      NotFound: AugmentedError<ApiType>;
      /**
       * A service with the provided ID is already present for the given DID.
       **/
      ServiceAlreadyExists: AugmentedError<ApiType>;
      /**
       * A service with the provided ID is not present under the given DID.
       **/
      ServiceNotFound: AugmentedError<ApiType>;
      /**
       * The block number provided in a DID-authorized operation is invalid.
       **/
      TransactionExpired: AugmentedError<ApiType>;
      /**
       * The called extrinsic does not support DID authorisation.
       **/
      UnsupportedDidAuthorizationCall: AugmentedError<ApiType>;
      /**
       * One or more verification keys referenced are not stored in the set
       * of verification keys.
       **/
      VerificationKeyNotFound: AugmentedError<ApiType>;
    };
    didName: {
      /**
       * The specified name has already been previously banned.
       **/
      AlreadyBanned: AugmentedError<ApiType>;
      /**
       * The specified name has already been previously claimed.
       **/
      AlreadyExists: AugmentedError<ApiType>;
      /**
       * The specified name has been banned and cannot be interacted
       * with.
       **/
      Banned: AugmentedError<ApiType>;
      /**
       * The tx submitter does not have enough funds to pay for the deposit.
       **/
      InsufficientFunds: AugmentedError<ApiType>;
      /**
       * A name that contains not allowed characters is being claimed.
       **/
      InvalidFormat: AugmentedError<ApiType>;
      /**
       * A suffix that is too short is being claimed.
       **/
      InvalidSuffix: AugmentedError<ApiType>;
      /**
       * A name that is too long is being claimed.
       **/
      NameExceedsMaxLength: AugmentedError<ApiType>;
      /**
       * A prefix that is too long is being claimed.
       **/
      NamePrefixTooLong: AugmentedError<ApiType>;
      /**
       * A prefix that is too short is being claimed.
       **/
      NamePrefixTooShort: AugmentedError<ApiType>;
      /**
       * A name that is too short is being claimed.
       **/
      NameTooShort: AugmentedError<ApiType>;
      /**
       * The actor cannot performed the specified operation.
       **/
      NotAuthorized: AugmentedError<ApiType>;
      /**
       * The specified name is not currently banned.
       **/
      NotBanned: AugmentedError<ApiType>;
      /**
       * The specified name does not exist.
       **/
      NotFound: AugmentedError<ApiType>;
      /**
       * The specified owner already owns a name.
       **/
      OwnerAlreadyExists: AugmentedError<ApiType>;
      /**
       * The specified owner does not own any names.
       **/
      OwnerNotFound: AugmentedError<ApiType>;
      /**
       * A suffix that is too long is being claimed.
       **/
      SuffixTooLong: AugmentedError<ApiType>;
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
    identifier: {
      MaxEventsHistoryExceeded: AugmentedError<ApiType>;
    };
    identity: {
      /**
       * Account ID is already named.
       **/
      AlreadyClaimed: AugmentedError<ApiType>;
      /**
       * Empty index.
       **/
      EmptyIndex: AugmentedError<ApiType>;
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
       * The sender does not have permission to issue a username.
       **/
      NotUsernameAuthority: AugmentedError<ApiType>;
      /**
       * The requested username does not exist.
       **/
      NoUsername: AugmentedError<ApiType>;
      /**
       * Registrar already exists.
       **/
      RegistrarAlreadyExists: AugmentedError<ApiType>;
      /**
       * Registrar not found.
       **/
      RegistrarNotFound: AugmentedError<ApiType>;
      /**
       * Setting this username requires a signature, but none was provided.
       **/
      RequiresSignature: AugmentedError<ApiType>;
      /**
       * Sticky judgement.
       **/
      StickyJudgement: AugmentedError<ApiType>;
      /**
       * Too many additional fields.
       **/
      TooManyFields: AugmentedError<ApiType>;
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
    networkMembership: {
      /**
       * Max members limit exceeded
       **/
      MaxMembersExceededForTheBlock: AugmentedError<ApiType>;
      /**
       * Membership already acquired
       **/
      MembershipAlreadyAcquired: AugmentedError<ApiType>;
      /**
       * Membership expired
       **/
      MembershipExpired: AugmentedError<ApiType>;
      /**
       * There is no member with the given ID.
       **/
      MembershipNotFound: AugmentedError<ApiType>;
      /**
       * Membership Renewal already requested
       **/
      MembershipRenewalAlreadyRequested: AugmentedError<ApiType>;
      /**
       * Rejects request if the member is added to the blacklist
       **/
      MembershipRequestRejected: AugmentedError<ApiType>;
      /**
       * Origin is not authorized
       **/
      OriginNotAuthorized: AugmentedError<ApiType>;
    };
    networkScore: {
      /**
       * Stream digest is not unique
       **/
      DigestAlreadyAnchored: AugmentedError<ApiType>;
      /**
       * Rating Entity mismatch
       **/
      EntityMismatch: AugmentedError<ApiType>;
      /**
       * Invalid digest
       **/
      InvalidDigest: AugmentedError<ApiType>;
      /**
       * Invalid entity signature
       **/
      InvalidEntitySignature: AugmentedError<ApiType>;
      /**
       * Invalid Identifer Length
       **/
      InvalidIdentifierLength: AugmentedError<ApiType>;
      /**
       * Invalid Rating Identifier
       **/
      InvalidRatingIdentifier: AugmentedError<ApiType>;
      /**
       * Invalid rating type
       **/
      InvalidRatingType: AugmentedError<ApiType>;
      /**
       * Invalid rating value - should be between 1 and 50
       **/
      InvalidRatingValue: AugmentedError<ApiType>;
      /**
       * Invalid creator signature
       **/
      InvalidSignature: AugmentedError<ApiType>;
      /**
       * Transaction already rated
       **/
      MessageIdAlreadyExists: AugmentedError<ApiType>;
      /**
       * Rating idenfier already exist
       **/
      RatingIdentifierAlreadyAdded: AugmentedError<ApiType>;
      /**
       * Rating identifier not found
       **/
      RatingIdentifierNotFound: AugmentedError<ApiType>;
      /**
       * Referenced rating identifier not found
       **/
      ReferenceIdentifierNotFound: AugmentedError<ApiType>;
      /**
       * Refrenced identifer is not a debit transaction
       **/
      ReferenceNotDebitIdentifier: AugmentedError<ApiType>;
      /**
       * Rating Space mismatch
       **/
      SpaceMismatch: AugmentedError<ApiType>;
      /**
       * Exceeds the maximum allowed entries in a single transaction
       **/
      TooManyJournalEntries: AugmentedError<ApiType>;
      /**
       * Unauthorized operation
       **/
      UnauthorizedOperation: AugmentedError<ApiType>;
    };
    nodeAuthorization: {
      /**
       * The node is already claimed by a user.
       **/
      AlreadyClaimed: AugmentedError<ApiType>;
      /**
       * The node is already connected.
       **/
      AlreadyConnected: AugmentedError<ApiType>;
      /**
       * The node is already joined in the list.
       **/
      AlreadyJoined: AugmentedError<ApiType>;
      /**
       * The node identifier is not valid
       **/
      InvalidNodeIdentifier: AugmentedError<ApiType>;
      /**
       * The Utf8 string is not proper.
       **/
      InvalidUtf8: AugmentedError<ApiType>;
      /**
       * The Node identifier is too long.
       **/
      NodeIdTooLong: AugmentedError<ApiType>;
      /**
       * The node doesn't exist in the list.
       **/
      NotExist: AugmentedError<ApiType>;
      /**
       * You are not the owner of the node.
       **/
      NotOwner: AugmentedError<ApiType>;
      /**
       * The PeerId is too long.
       **/
      PeerIdTooLong: AugmentedError<ApiType>;
      /**
       * No permisson to perform specific operation.
       **/
      PermissionDenied: AugmentedError<ApiType>;
      /**
       * Too many well known nodes.
       **/
      TooManyNodes: AugmentedError<ApiType>;
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
    schema: {
      /**
       * Creator DID information not found.
       **/
      CreatorNotFound: AugmentedError<ApiType>;
      /**
       * Empty transaction.
       **/
      EmptyTransaction: AugmentedError<ApiType>;
      InvalidIdentifierLength: AugmentedError<ApiType>;
      /**
       * Schema limit exceeds the permitted size.
       **/
      MaxEncodedSchemaLimitExceeded: AugmentedError<ApiType>;
      /**
       * Schema identifier is not unique.
       **/
      SchemaAlreadyAnchored: AugmentedError<ApiType>;
      /**
       * Schema identifier not found.
       **/
      SchemaNotFound: AugmentedError<ApiType>;
      /**
       * The paying account was unable to pay the fees for creating a schema.
       **/
      UnableToPayFees: AugmentedError<ApiType>;
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
    statement: {
      /**
       * Associate digest already present
       **/
      AssociateDigestAlreadyAnchored: AugmentedError<ApiType>;
      /**
       * Attestation is not found
       **/
      AttestationNotFound: AugmentedError<ApiType>;
      /**
       * Authorization not found
       **/
      AuthorizationDetailsNotFound: AugmentedError<ApiType>;
      /**
       * Bulk Transaction Failed
       **/
      BulkTransactionFailed: AugmentedError<ApiType>;
      /**
       * Statement digest is not unique
       **/
      DigestHashAlreadyAnchored: AugmentedError<ApiType>;
      /**
       * Expired Tx Signature
       **/
      ExpiredSignature: AugmentedError<ApiType>;
      /**
       * Statement hash is not unique
       **/
      HashAlreadyAnchored: AugmentedError<ApiType>;
      /**
       * Invalid Schema Identifier Length
       **/
      InvalidIdentifierLength: AugmentedError<ApiType>;
      /**
       * Invalid creator signature
       **/
      InvalidSignature: AugmentedError<ApiType>;
      /**
       * Invalid Statement Identifier
       **/
      InvalidStatementIdentifier: AugmentedError<ApiType>;
      /**
       * Invalid transaction hash
       **/
      InvalidTransactionHash: AugmentedError<ApiType>;
      MaxDigestLimitExceeded: AugmentedError<ApiType>;
      /**
       * Maximum number of activities exceeded
       **/
      MaxStatementActivitiesExceeded: AugmentedError<ApiType>;
      /**
       * Metadata already set for the entry
       **/
      MetadataAlreadySet: AugmentedError<ApiType>;
      /**
       * Metadata limit exceeded
       **/
      MetadataLimitExceeded: AugmentedError<ApiType>;
      /**
       * Metadata not found for the entry
       **/
      MetadataNotFound: AugmentedError<ApiType>;
      /**
       * Presentation is already anchored.
       **/
      PresentationDigestAlreadyAnchored: AugmentedError<ApiType>;
      /**
       * Presentation not found
       **/
      PresentationNotFound: AugmentedError<ApiType>;
      /**
       * Statement idenfier is not unique
       **/
      StatementAlreadyAnchored: AugmentedError<ApiType>;
      /**
       * Statement digest already present on the chain.
       **/
      StatementDigestAlreadyAnchored: AugmentedError<ApiType>;
      /**
       * Statement entry not found
       **/
      StatementEntryNotFound: AugmentedError<ApiType>;
      /**
       * Statement link does not exist
       **/
      StatementLinkNotFound: AugmentedError<ApiType>;
      /**
       * Statement Link is revoked
       **/
      StatementLinkRevoked: AugmentedError<ApiType>;
      /**
       * Statement idenfier not found
       **/
      StatementNotFound: AugmentedError<ApiType>;
      /**
       * Statement idenfier not marked inactive
       **/
      StatementNotRevoked: AugmentedError<ApiType>;
      /**
       * Statement entry marked inactive
       **/
      StatementRevoked: AugmentedError<ApiType>;
      /**
       * Statement not part of space
       **/
      StatementSpaceMismatch: AugmentedError<ApiType>;
      /**
       * Maximum Number of delegates reached.
       **/
      TooManyDelegates: AugmentedError<ApiType>;
      /**
       * More than the maximum mumber of delegates.
       **/
      TooManyDelegatesToRemove: AugmentedError<ApiType>;
      /**
       * Only when the author is not the controller/delegate.
       **/
      UnauthorizedOperation: AugmentedError<ApiType>;
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
    utility: {
      /**
       * Too many calls batched.
       **/
      TooManyCalls: AugmentedError<ApiType>;
    };
  } // AugmentedErrors
} // declare module
