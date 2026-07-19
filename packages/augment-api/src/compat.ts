import type {
  AccountId32,
  AnyJson,
  AnyNumber,
  BN,
  Bytes,
  Codec,
  SubmittableExtrinsic,
} from '@cord.network/types'

interface ChainHumanLike {
  toHuman(isExtended?: boolean, disableAscii?: boolean): AnyJson
}

interface ChainNumberLike {
  toNumber(): number
}

interface ChainHexLike {
  toHex(): string
}

interface ChainBoolLike {
  valueOf(): boolean
}

interface ChainOptionLike<T> {
  readonly isNone: boolean
  readonly isSome: boolean
  unwrap(): T
}

interface ChainKeyIdLike {
  toHex(): string
}

interface ChainMapLike<K, V> {
  entries(): Iterable<[K, V]>
}

interface ChainValuesLike<T> {
  values(): Iterable<T>
}

interface ChainBinaryLike {
  toU8a(): Uint8Array
}

interface DidPublicKeyValue {
  readonly type: string
  readonly value: ChainBinaryLike
}

type Utf8Bytes = Uint8Array & {
  toUtf8(): string
}

export interface PalletDidDidDetailsDidPublicKey {
  readonly isPublicEncryptionKey: boolean
  readonly asPublicEncryptionKey: DidPublicKeyValue
  readonly asPublicVerificationKey: DidPublicKeyValue
}

export interface PalletDidDidDetailsDidPublicKeyDetails {
  readonly key: PalletDidDidDetailsDidPublicKey
}

export interface PalletDidDidDetails extends Codec {
  readonly publicKeys: ChainMapLike<
    ChainKeyIdLike,
    PalletDidDidDetailsDidPublicKeyDetails
  >
  readonly authenticationKey: ChainKeyIdLike
  readonly assertionKey: ChainOptionLike<ChainKeyIdLike>
  readonly delegationKey: ChainOptionLike<ChainKeyIdLike>
  readonly keyAgreementKeys: ChainValuesLike<ChainKeyIdLike>
  readonly lastTxCounter: {
    toBn(): BN
  }
}

export interface PalletDidServiceEndpointsDidEndpoint extends Codec {
  readonly id: Utf8Bytes
  readonly serviceTypes: Utf8Bytes[]
  readonly urls: Utf8Bytes[]
}

export interface RawDidLinkedInfo extends Codec {
  readonly identifier: AccountId32
  readonly account: AccountId32
  readonly name: ChainOptionLike<ChainHumanLike>
  readonly serviceEndpoints: PalletDidServiceEndpointsDidEndpoint[]
  readonly details: PalletDidDidDetails
}

export interface PalletDidDidDetailsDidAuthorizedCallOperation extends Codec {
  readonly txCounter: AnyNumber
  readonly did: string | AccountId32
  readonly call: SubmittableExtrinsic
  readonly submitter: string
  readonly blockNumber: AnyNumber
}

export interface PalletChainSpacePermissions {
  readonly bits: ChainNumberLike
}

export interface PalletChainSpaceSpaceDetails extends Codec {
  readonly creator: AccountId32
  readonly txnCapacity: ChainNumberLike
  readonly txnCount: ChainNumberLike
  readonly approved: ChainBoolLike
  readonly archive: ChainBoolLike
}

export interface PalletChainSpaceSpaceAuthorization extends Codec {
  readonly spaceId: Bytes
  readonly delegate: AccountId32
  readonly delegator: AccountId32
  readonly permissions: PalletChainSpacePermissions
}

export interface PalletSchemaSchemaEntry extends Codec {
  readonly schema: Bytes
  readonly digest: ChainHexLike
  readonly creator: string
}

export interface PalletSchemaDidSchemaEntry extends Codec {
  readonly schema: Bytes
  readonly digest: ChainHexLike
  readonly creator: AccountId32
  readonly space: Bytes
}

export interface PalletStatementStatementDetails extends Codec {
  readonly schema: Bytes
  readonly digest: ChainHexLike
  readonly space: Bytes
}

export interface PalletStatementDidStatementDetails extends Codec {
  readonly schema: Bytes
  readonly digest: ChainHexLike
  readonly space: Bytes
}

export interface PalletEntryRegistryEntryDetails extends Codec {
  readonly txHash: ChainHexLike
  readonly revoked: ChainBoolLike
  readonly creator: ChainHumanLike
  readonly registryId: Bytes
}

export interface PalletEntriesRegistryEntryDetails extends Codec {
  readonly digest: ChainHexLike
  readonly revoked: ChainBoolLike
  readonly creator: string | Uint8Array
  readonly registryId: Bytes
}

export interface PalletProfileProfileMetadata extends Codec, ChainHumanLike {
  readonly latestKey?: AccountId32
}

export interface PalletNetworkScoreRatingTypeOf {
  readonly index: number
}

export interface PalletNetworkScoreEntryTypeOf {
  readonly index: number
}

export interface PalletNetworkScoreAggregatedEntryOf extends Codec {
  readonly countOfTxn: ChainNumberLike
  readonly totalEncodedRating: ChainNumberLike
}

export interface PalletNetworkScoreRatingEntry extends Codec {
  readonly entry: {
    readonly entityId: Bytes
    readonly providerId: Bytes
    readonly ratingType: PalletNetworkScoreRatingTypeOf
    readonly countOfTxn: ChainNumberLike
    readonly totalEncodedRating: ChainNumberLike
  }
  readonly referenceId: ChainOptionLike<Bytes>
  readonly digest: ChainHexLike
  readonly messageId: Bytes
  readonly space: Bytes
  readonly creatorId: AccountId32
  readonly entryType: PalletNetworkScoreEntryTypeOf
  readonly createdAt: ChainNumberLike
}

export type PalletAssetAssetStatusOf = string | { toString(): string }

export type PalletAssetAssetEntry = Codec & Record<string, never>

export type PalletRegistriesRegistryAuthorization = Codec & Record<string, never>

export type PalletNamespaceNameSpaceAuthorization = Codec &
  Record<string, never>

export type PalletNamespaceNameSpaceDetails = Codec & Record<string, never>
