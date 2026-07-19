import type BN from 'bn.js'

export type HexString = `0x${string}`
export type Prefix = number

export type AnyJson =
  | null
  | boolean
  | number
  | string
  | AnyJson[]
  | { [key: string]: AnyJson }

export type AnyNumber =
  | string
  | number
  | bigint
  | BN
  | {
      toString(): string
    }
  | {
      toNumber(): number
    }

export interface Codec {
  toHex(): HexString
  toHuman(isExtended?: boolean, disableAscii?: boolean): AnyJson
  toJSON(): AnyJson
  toRawType(): string
  toString(): string
  toU8a(isBare?: boolean): Uint8Array
  toUtf8(): string
}

export type Bytes = Codec

export interface NumberCodec extends Codec {
  toBn(): BN
  toNumber(): number
}

export interface Option<T = Codec> extends Codec {
  readonly isNone: boolean
  readonly isSome: boolean
  unwrap(): T
}

export interface AccountId extends Codec {}

export interface AccountId32 extends AccountId {}

export interface H256 extends Codec {}

export interface BlockNumber extends NumberCodec {}

export interface Index extends NumberCodec {}

export interface RegistryError extends Codec {}

export interface DispatchError extends Codec {
  readonly isModule?: boolean
  readonly asModule?: {
    readonly registry: {
      findMetaError(error: unknown): RegistryError
    }
  }
}

export interface ExtrinsicMethod extends Codec {
  readonly args: Codec[]
  readonly method: string
  readonly section: string
}

export interface Extrinsic extends Codec {
  readonly method: ExtrinsicMethod
}

export interface EventLike extends Codec {
  readonly section: string
  readonly method: string
  readonly data: Codec[]
}

export interface EventPhaseLike extends Codec {
  readonly isApplyExtrinsic: boolean
  readonly asApplyExtrinsic: NumberCodec
}

export interface EventRecord extends Codec {
  readonly event: EventLike
  readonly phase: EventPhaseLike
}

export interface RuntimeVersion extends Codec {
  readonly specName: Codec
  readonly specVersion: NumberCodec
}

export interface StorageKey<Args extends unknown[] = unknown[]> extends Codec {
  readonly args: Args
}

export type OverrideVersionedType = {
  minmax: [number, number | undefined]
  types: Record<string, unknown>
}

export type OverrideBundleDefinition = {
  types?: OverrideVersionedType[]
  signedExtensions?: Record<string, unknown>
  runtime?: Record<string, unknown>
}

export type OverrideBundleType = {
  spec: Record<string, OverrideBundleDefinition>
}

export type ExtInfo = {
  extrinsic: Record<string, unknown>
  payload: Record<string, unknown>
}

export type ExtDef = Record<string, ExtInfo>

export type RegistryTypes = Record<string, unknown>

export type DefinitionCallParam = {
  name: string
  type: string
}

export type DefinitionCall = {
  description?: string
  params: DefinitionCallParam[]
  type: string
}

export type DefinitionsCall = Record<
  string,
  Array<{
    methods: Record<string, DefinitionCall>
    version: number
  }>
>
