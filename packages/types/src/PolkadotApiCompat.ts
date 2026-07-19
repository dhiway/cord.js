/* eslint-disable max-classes-per-file, no-new-func, no-use-before-define, class-methods-use-this, no-underscore-dangle, no-restricted-syntax, no-await-in-loop, no-constant-condition, @typescript-eslint/strict-boolean-expressions */

import { EventEmitter } from 'node:events'

import BN from 'bn.js'
import { getDynamicBuilder, getLookupFn, type LookupEntry } from '@polkadot-api/metadata-builders'
import { decAnyMetadata, unifyMetadata, type UnifiedMetadata } from '@polkadot-api/substrate-bindings'
import type { PolkadotSigner } from 'polkadot-api'

import type { KeyringPair } from './CompatKeyring.js'
import type {
  AnyJson,
  AnyNumber,
  Codec,
  DispatchError,
  EventRecord,
  ExtDef,
  HexString,
  OverrideBundleType,
  RuntimeVersion,
  StorageKey,
} from './CompatTypes.js'
import { asNumber, hexToU8a, isHex, u8aToHex, u8aToString, u8aToU8a } from './CompatUtils.js'

type TxWatchEvent = {
  type: 'signed' | 'broadcasted' | 'txBestBlocksState' | 'finalized'
  txHash: HexString
  found?: boolean
  ok?: boolean
  isValid?: boolean
  dispatchError?: unknown
  events?: unknown[]
  block?: {
    hash: HexString
    number: number
    index: number
  }
}

type StatusChange = {
  type?: string
}

type RuntimeCallEntryMeta = {
  actualApi: string
  actualMethod: string
  compatApi: string
  compatMethod: string
  version?: number
  args: MetaArg[]
  outputLookup?: LookupEntry
}

type QueryEntryMeta = {
  actualPallet: string
  actualName: string
  compatPallet: string
  compatName: string
  valueLookup?: LookupEntry
  keyLookups: LookupEntry[]
  isOptional: boolean
  modifier: number
}

type ConstEntryMeta = {
  actualPallet: string
  actualName: string
  compatPallet: string
  compatName: string
  lookup?: LookupEntry
}

type EventEntryMeta = {
  actualPallet: string
  actualName: string
  compatPallet: string
  compatName: string
}

type TxEntryMember =
  | {
      type: 'void'
    }
  | {
      type: 'lookup'
      lookup: LookupEntry
    }
  | {
      type: 'tuple'
      items: LookupEntry[]
    }
  | {
      type: 'array'
      lookup: LookupEntry
      len: number
    }
  | {
      type: 'struct'
      items: Array<{
        name: string
        lookup: LookupEntry
      }>
    }

type TxEntryMeta = {
  actualPallet: string
  actualName: string
  compatPallet: string
  compatName: string
  member: TxEntryMember
  meta: {
    args: MetaArg[]
    section: string
    method: string
  }
}

type MetaArg = {
  name: string
  lookup: LookupEntry
  codec: {
    enc(value: unknown): Uint8Array
    dec(value: Uint8Array): unknown
  }
  type: {
    toString(): string
  }
}

type RuntimeState = {
  metadata: UnifiedMetadata
  lookup: ReturnType<typeof getLookupFn>
  dynamicBuilder: ReturnType<typeof getDynamicBuilder>
  queryEntries: Map<string, QueryEntryMeta>
  txEntries: Map<string, TxEntryMeta>
  constEntries: Map<string, ConstEntryMeta>
  eventEntries: Map<string, EventEntryMeta>
  runtimeCallEntries: Map<string, RuntimeCallEntryMeta>
  callTypeId: number | null
  ss58Prefix?: number
}

type StatusKind = 'ready' | 'inBlock' | 'finalized' | 'future'

type ModernJsonRpcMessage = Record<string, unknown>

type ModernJsonRpcConnection = {
  send(message: ModernJsonRpcMessage): void
  disconnect(): void
}

type ModernJsonRpcProvider = (
  onMessage: (message: ModernJsonRpcMessage) => void,
  onHalt: (error?: unknown) => void
) => ModernJsonRpcConnection

type LegacyJsonRpcConnection = {
  send(message: string): void
  disconnect(): void
}

type LegacyJsonRpcProvider = (
  onMessage: (message: string) => void,
  onHalt: (error?: unknown) => void
) => LegacyJsonRpcConnection

const RAW_VALUE = Symbol('rawValue')
const CALL_INPUT = Symbol('callInput')

const dynamicImport = new Function('specifier', 'return import(specifier)') as (
  specifier: string
) => Promise<any>

let papiPromise: Promise<any> | undefined
let papiWsPromise: Promise<any> | undefined
let papiSignerPromise: Promise<any> | undefined
let legacyProviderPromise: Promise<any> | undefined

function loadPapi(): Promise<any> {
  papiPromise ??= dynamicImport('polkadot-api')
  return papiPromise
}

function loadPapiWs(): Promise<any> {
  papiWsPromise ??= dynamicImport('polkadot-api/ws')
  return papiWsPromise
}

function loadPapiSigner(): Promise<any> {
  papiSignerPromise ??= dynamicImport('polkadot-api/signer')
  return papiSignerPromise
}

function loadLegacyProvider(): Promise<any> {
  legacyProviderPromise ??= dynamicImport('@polkadot-api/legacy-provider')
  return legacyProviderPromise
}

function toLegacyProvider(provider: ModernJsonRpcProvider): LegacyJsonRpcProvider {
  return (onMessage, onHalt) => {
    const connection = provider(
      (message) => onMessage(JSON.stringify(message)),
      onHalt
    )

    return {
      send(message) {
        connection.send(JSON.parse(message) as ModernJsonRpcMessage)
      },
      disconnect() {
        connection.disconnect()
      },
    }
  }
}

function toModernProvider(provider: LegacyJsonRpcProvider): ModernJsonRpcProvider {
  return (onMessage, onHalt) => {
    const connection = provider(
      (message) => onMessage(JSON.parse(message) as ModernJsonRpcMessage),
      onHalt
    )

    return {
      send(message) {
        connection.send(JSON.stringify(message))
      },
      disconnect() {
        connection.disconnect()
      },
    }
  }
}

function lowerFirst(value: string): string {
  return value.length > 0
    ? value[0].toLowerCase() + value.slice(1)
    : value
}

function toCompatEntryName(value: string): string {
  return lowerFirst(value.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase()))
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isBnLike(value: unknown): value is BN {
  return value instanceof BN || (
    isObject(value) &&
    typeof (value as { toString?: unknown }).toString === 'function' &&
    typeof (value as { toArray?: unknown }).toArray === 'function'
  )
}

function unwrapCodecValue(value: unknown): unknown {
  if (isObject(value) && RAW_VALUE in value) {
    return (value as Record<symbol, unknown>)[RAW_VALUE]
  }

  if (isBnLike(value)) {
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => unwrapCodecValue(item))
  }

  if (value instanceof Map) {
    return new Map(
      [...value.entries()].map(([key, entryValue]) => [
        unwrapCodecValue(key),
        unwrapCodecValue(entryValue),
      ])
    )
  }

  if (value instanceof Set) {
    return new Set([...value.values()].map((entryValue) => unwrapCodecValue(entryValue)))
  }

  if (isObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [key, unwrapCodecValue(entryValue)])
    )
  }

  return value
}

function humanizeValue(value: unknown): AnyJson {
  const unwrapped = unwrapCodecValue(value)

  if (unwrapped instanceof Uint8Array) {
    return u8aToHex(unwrapped)
  }

  if (typeof unwrapped === 'bigint') {
    return unwrapped.toString()
  }

  if (Array.isArray(unwrapped)) {
    return unwrapped.map((item) => humanizeValue(item))
  }

  if (unwrapped instanceof Map) {
    return Object.fromEntries(
      [...unwrapped.entries()].map(([key, entryValue]) => [
        String(humanizeValue(key)),
        humanizeValue(entryValue),
      ])
    ) as AnyJson
  }

  if (unwrapped instanceof Set) {
    return [...unwrapped.values()].map((item) => humanizeValue(item))
  }

  if (isObject(unwrapped)) {
    return Object.fromEntries(
      Object.entries(unwrapped).map(([key, entryValue]) => [key, humanizeValue(entryValue)])
    ) as AnyJson
  }

  return (unwrapped ?? null) as AnyJson
}

function stringifyValue(value: unknown): string {
  const unwrapped = unwrapCodecValue(value)

  if (typeof unwrapped === 'string') {
    return unwrapped
  }

  if (typeof unwrapped === 'bigint') {
    return unwrapped.toString()
  }

  if (unwrapped instanceof Uint8Array) {
    return u8aToHex(unwrapped)
  }

  if (typeof unwrapped === 'boolean' || typeof unwrapped === 'number') {
    return String(unwrapped)
  }

  return JSON.stringify(humanizeValue(unwrapped))
}

function rawTypeOf(lookup: LookupEntry | undefined, callTypeId: number | null): string {
  if (!lookup) {
    return 'Unknown'
  }

  switch (lookup.type) {
    case 'primitive':
      return lookup.value
    case 'void':
      return 'Null'
    case 'compact':
      return `Compact<${lookup.size}>`
    case 'bitSequence':
      return 'BitVec'
    case 'AccountId32':
      return 'AccountId32'
    case 'AccountId20':
      return 'AccountId20'
    case 'option':
      return `Option<${rawTypeOf(lookup.value, callTypeId)}>`
    case 'result':
      return `Result<${rawTypeOf(lookup.value.ok, callTypeId)}, ${rawTypeOf(
        lookup.value.ko,
        callTypeId
      )}>`
    case 'sequence':
      return lookup.value.id === callTypeId
        ? 'Vec<Call>'
        : `Vec<${rawTypeOf(lookup.value, callTypeId)}>`
    case 'array':
      return `[${rawTypeOf(lookup.value, callTypeId)}; ${lookup.len}]`
    case 'tuple':
      return `(${lookup.value.map((entry) => rawTypeOf(entry, callTypeId)).join(', ')})`
    case 'struct':
      return 'Struct'
    case 'enum':
      return 'Enum'
    default:
      return 'Unknown'
  }
}

function encodePrimitiveValue(typeName: string, value: unknown): Uint8Array {
  if (typeName === 'Bytes') {
    return u8aToU8a(value as Buffer | Uint8Array | string)
  }

  if (typeName === 'Hash' || typeName === 'H256') {
    return isHex(value) ? hexToU8a(value) : u8aToU8a(String(value))
  }

  if (typeName === 'AccountId' || typeName === 'AccountId32') {
    return typeof value === 'string' && value.startsWith('3')
      ? hexToU8a(u8aToHex(u8aToU8a(value)))
      : u8aToU8a(value as Buffer | Uint8Array | string)
  }

  return u8aToU8a(String(value))
}

function attachCodec<T extends object>(
  target: T,
  raw: unknown,
  rawType: string,
  encode: () => Uint8Array
): T & Codec {
  Object.defineProperty(target, RAW_VALUE, {
    value: raw,
    enumerable: false,
  })

  return Object.assign(target, {
    toHex: () => u8aToHex(encode()),
    toHuman: () => humanizeValue(raw),
    toJSON: () => humanizeValue(raw),
    toRawType: () => rawType,
    toString: () => stringifyValue(raw),
    toU8a: () => encode(),
    toUtf8: () => u8aToString(encode()),
  })
}

function wrapNumber(value: number | bigint, rawType: string): any {
  return attachCodec(
    {
      toBn: () => new BN(value.toString()),
      toNumber: () => Number(value),
      valueOf: () => Number(value),
    },
    value,
    rawType,
    () => u8aToU8a(String(value))
  )
}

function wrapString(value: string, rawType: string, encode: () => Uint8Array): any {
  return attachCodec(new String(value) as any, value, rawType, encode)
}

function wrapBytes(value: Uint8Array, rawType: string): any {
  return attachCodec(
    {
      length: value.length,
    },
    value,
    rawType,
    () => value
  )
}

function wrapOption(
  value: unknown,
  lookup: LookupEntry & { type: 'option' },
  state: RuntimeState
): Codec {
  const wrapped = typeof value === 'undefined'
    ? undefined
    : wrapWithLookup(value, lookup.value, state)

  return attachCodec(
    {
      isNone: typeof value === 'undefined',
      isSome: typeof value !== 'undefined',
      unwrap: () => {
        if (typeof wrapped === 'undefined') {
          throw new Error('Cannot unwrap an empty Option')
        }

        return wrapped
      },
    },
    value,
    rawTypeOf(lookup, state.callTypeId),
    () => (typeof value === 'undefined' ? new Uint8Array() : u8aToU8a(stringifyValue(value)))
  )
}

function wrapEnumMember(
  member:
    | {
        type: 'lookupEntry'
        value: LookupEntry
      }
    | {
        type: 'tuple'
        value: LookupEntry[]
      }
    | {
        type: 'struct'
        value: Record<string, LookupEntry>
      }
    | {
        type: 'array'
        value: LookupEntry
        len: number
      }
    | {
        type: 'void'
      },
  value: unknown,
  state: RuntimeState
): unknown {
  switch (member.type) {
    case 'lookupEntry':
      return wrapWithLookup(value, member.value, state)
    case 'tuple':
      return decorateArray(
        Array.isArray(value)
          ? value.map((entryValue, index) =>
              wrapWithLookup(entryValue, member.value[index], state)
            )
          : [],
        value,
        'Tuple'
      )
    case 'array':
      return decorateArray(
        Array.isArray(value)
          ? value.map((entryValue) => wrapWithLookup(entryValue, member.value, state))
          : [],
        value,
        `Array<${rawTypeOf(member.value, state.callTypeId)}>`
      )
    case 'struct':
      return decorateStruct(
        Object.fromEntries(
          Object.entries(member.value).map(([fieldName, fieldLookup]) => [
            fieldName,
            wrapWithLookup((value as Record<string, unknown>)[fieldName], fieldLookup, state),
          ])
        ),
        value,
        'Struct'
      )
    case 'void':
    default:
      return undefined
  }
}

function wrapEnum(
  value: {
    type?: string
    tag?: string
    value?: unknown
  },
  lookup: LookupEntry & { type: 'enum' },
  state: RuntimeState
): Codec {
  const variantName = String(value.type ?? value.tag ?? '')
  const variant = lookup.value[variantName]
  const wrappedValue = variant
    ? wrapEnumMember(variant, value.value, state)
    : value.value
  const target: Record<string, unknown> = {
    type: variantName,
    value: wrappedValue,
  }

  if (variantName) {
    target[`is${variantName}`] = true
    target[`as${variantName}`] = wrappedValue
  }

  return attachCodec(target, value, 'Enum', () => u8aToU8a(JSON.stringify(unwrapCodecValue(value))))
}

function decorateArray(values: unknown[], raw: unknown, rawType: string): any {
  return attachCodec(values, raw, rawType, () => u8aToU8a(JSON.stringify(unwrapCodecValue(raw))))
}

function decorateMap(value: Map<unknown, unknown>, raw: unknown, rawType: string): any {
  return attachCodec(value as any, raw, rawType, () => u8aToU8a(JSON.stringify(humanizeValue(raw))))
}

function decorateSet(value: Set<unknown>, raw: unknown, rawType: string): any {
  return attachCodec(value as any, raw, rawType, () => u8aToU8a(JSON.stringify(humanizeValue(raw))))
}

function decorateStruct(value: Record<string, unknown>, raw: unknown, rawType: string): any {
  return attachCodec(value as any, raw, rawType, () => u8aToU8a(JSON.stringify(unwrapCodecValue(raw))))
}

function wrapWithLookup(
  value: unknown,
  lookup: LookupEntry | undefined,
  state: RuntimeState
): any {
  if (!lookup) {
    return wrapWithoutLookup(value)
  }

  if (lookup.type === 'option') {
    return wrapOption(value, lookup, state)
  }

  if (lookup.type === 'primitive' && lookup.value === 'bool') {
    return Boolean(value)
  }

  if (lookup.type === 'AccountId32' || lookup.type === 'AccountId20') {
    return wrapString(String(value), rawTypeOf(lookup, state.callTypeId), () =>
      typeof value === 'string' && value.startsWith('3')
        ? hexToU8a(u8aToHex(u8aToU8a(value)))
        : u8aToU8a(String(value))
    )
  }

  if (typeof value === 'number' || typeof value === 'bigint') {
    return wrapNumber(value, rawTypeOf(lookup, state.callTypeId))
  }

  if (typeof value === 'string') {
    return isHex(value)
      ? wrapString(value, rawTypeOf(lookup, state.callTypeId), () => hexToU8a(value))
      : wrapString(value, rawTypeOf(lookup, state.callTypeId), () => u8aToU8a(value))
  }

  if (value instanceof Uint8Array) {
    return wrapBytes(value, rawTypeOf(lookup, state.callTypeId))
  }

  if (Array.isArray(value)) {
    if (lookup.type === 'tuple') {
      return decorateArray(
        value.map((entryValue, index) =>
          wrapWithLookup(entryValue, lookup.value[index], state)
        ),
        value,
        rawTypeOf(lookup, state.callTypeId)
      )
    }

    const itemLookup =
      lookup.type === 'sequence' || lookup.type === 'array'
        ? lookup.value
        : undefined

    return decorateArray(
      value.map((entryValue) => wrapWithLookup(entryValue, itemLookup, state)),
      value,
      rawTypeOf(lookup, state.callTypeId)
    )
  }

  if (value instanceof Map) {
    return decorateMap(
      new Map(
        [...value.entries()].map(([key, entryValue]) => [
          wrapWithoutLookup(key),
          wrapWithoutLookup(entryValue),
        ])
      ),
      value,
      rawTypeOf(lookup, state.callTypeId)
    )
  }

  if (value instanceof Set) {
    return decorateSet(
      new Set([...value.values()].map((entryValue) => wrapWithoutLookup(entryValue))),
      value,
      rawTypeOf(lookup, state.callTypeId)
    )
  }

  if (isObject(value) && lookup.type === 'enum' && ('type' in value || 'tag' in value)) {
    return wrapEnum(value as { type?: string; tag?: string; value?: unknown }, lookup, state)
  }

  if (isObject(value) && lookup.type === 'struct') {
    return decorateStruct(
      Object.fromEntries(
        Object.entries(lookup.value).map(([fieldName, fieldLookup]) => [
          fieldName,
          wrapWithLookup((value as Record<string, unknown>)[fieldName], fieldLookup, state),
        ])
      ),
      value,
      rawTypeOf(lookup, state.callTypeId)
    )
  }

  return wrapWithoutLookup(value)
}

function wrapWithoutLookup(value: unknown): any {
  if (typeof value === 'boolean' || typeof value === 'undefined' || value === null) {
    return value
  }

  if (typeof value === 'number' || typeof value === 'bigint') {
    return wrapNumber(value, 'Number')
  }

  if (typeof value === 'string') {
    return isHex(value)
      ? wrapString(value, 'Hex', () => hexToU8a(value))
      : wrapString(value, 'Text', () => u8aToU8a(value))
  }

  if (value instanceof Uint8Array) {
    return wrapBytes(value, 'Bytes')
  }

  if (Array.isArray(value)) {
    return decorateArray(value.map((entryValue) => wrapWithoutLookup(entryValue)), value, 'Array')
  }

  if (value instanceof Map) {
    return decorateMap(
      new Map(
        [...value.entries()].map(([key, entryValue]) => [
          wrapWithoutLookup(key),
          wrapWithoutLookup(entryValue),
        ])
      ),
      value,
      'Map'
    )
  }

  if (value instanceof Set) {
    return decorateSet(
      new Set([...value.values()].map((entryValue) => wrapWithoutLookup(entryValue))),
      value,
      'Set'
    )
  }

  if (isObject(value) && 'event' in value && 'phase' in value) {
    return wrapEventRecord(value as Record<string, any>)
  }

  if (isObject(value) && ('type' in value || 'tag' in value) && 'value' in value) {
    const enumValue = value as { type?: string; tag?: string; value?: unknown }
    const variantName = String(enumValue.type ?? enumValue.tag ?? '')
    const wrappedValue = wrapWithoutLookup(enumValue.value)
    const target: Record<string, unknown> = {
      type: variantName,
      value: wrappedValue,
    }

    if (variantName) {
      target[`is${variantName}`] = true
      target[`as${variantName}`] = wrappedValue
    }

    return attachCodec(
      target,
      value,
      'Enum',
      () => u8aToU8a(JSON.stringify(unwrapCodecValue(value)))
    )
  }

  if (isObject(value)) {
    return decorateStruct(
      Object.fromEntries(
        Object.entries(value).map(([key, entryValue]) => [key, wrapWithoutLookup(entryValue)])
      ),
      value,
      'Struct'
    )
  }

  return value
}

function wrapEventData(data: unknown): Codec[] {
  if (Array.isArray(data)) {
    return data.map((entry) => wrapWithoutLookup(entry))
  }

  if (isObject(data)) {
    return Object.values(data).map((entry) => wrapWithoutLookup(entry))
  }

  if (typeof data === 'undefined') {
    return []
  }

  return [wrapWithoutLookup(data)]
}

function wrapEventRecord(record: Record<string, any>): EventRecord {
  const phaseType = String(record.phase?.type ?? record.phase?.tag ?? record.phase ?? '')
  const phaseValue = Number(record.phase?.value ?? 0)
  const rawEvent = record.event ?? record
  const section = toCompatEntryName(String(rawEvent.type ?? rawEvent.section ?? ''))
  const rawEventValue = rawEvent.value ?? {}
  const method = String(rawEventValue.type ?? rawEvent.method ?? '')
  const payload = rawEventValue.value ?? rawEvent.data ?? []
  const data = wrapEventData(payload)

  const phase = attachCodec(
    {
      isApplyExtrinsic: phaseType === 'ApplyExtrinsic',
      asApplyExtrinsic: wrapNumber(phaseValue, 'u32'),
    },
    record.phase,
    'Phase',
    () => u8aToU8a(JSON.stringify(record.phase))
  )

  const event = attachCodec(
    {
      section,
      method,
      data,
    },
    rawEvent,
    'Event',
    () => u8aToU8a(JSON.stringify(rawEvent))
  )

  return attachCodec(
    {
      phase,
      event,
    },
    record,
    'EventRecord',
    () => u8aToU8a(JSON.stringify(record))
  ) as EventRecord
}

function createStatus(kind: StatusKind, blockHash?: HexString): any {
  const raw =
    kind === 'inBlock'
      ? { InBlock: blockHash }
      : kind === 'finalized'
        ? { Finalized: blockHash }
        : kind

  return attachCodec(
    {
      isReady: kind === 'ready',
      isInBlock: kind === 'inBlock',
      isFinalized: kind === 'finalized',
    },
    raw,
    'ExtrinsicStatus',
    () => u8aToU8a(JSON.stringify(raw))
  )
}

function createRegistry(state: RuntimeState) {
  return {
    createType<T = Codec>(typeName: string, value?: unknown): T {
      if (typeName.startsWith('lookup:')) {
        const id = Number(typeName.slice('lookup:'.length))
        const lookup = state.lookup(id)
        const codec = state.dynamicBuilder.buildDefinition(id)
        return attachCodec(
          wrapWithLookup(value, lookup, state),
          value,
          rawTypeOf(lookup, state.callTypeId),
          () => codec.enc(unwrapCodecValue(value))
        ) as T
      }

      if (typeName === 'RuntimeVersion') {
        return attachCodec(
          wrapWithoutLookup(value),
          value,
          typeName,
          () => u8aToU8a(JSON.stringify(value))
        ) as T
      }

      if (typeName === 'ExtrinsicStatus') {
        if (typeof value === 'string') {
          return createStatus(value as StatusKind) as T
        }

        if (isObject(value) && 'InBlock' in value) {
          return createStatus('inBlock', String(value.InBlock) as HexString) as T
        }

        if (isObject(value) && 'Finalized' in value) {
          return createStatus('finalized', String(value.Finalized) as HexString) as T
        }
      }

      if (typeName === 'Hash' || typeName === 'H256') {
        const normalized = isHex(value) ? value : u8aToHex(u8aToU8a(String(value ?? '')))
        return wrapString(normalized, typeName, () => hexToU8a(normalized)) as T
      }

      if (typeName === 'Bytes') {
        const encoded = encodePrimitiveValue(typeName, value)
        return wrapBytes(encoded, typeName) as T
      }

      if (typeName === 'AccountId' || typeName === 'AccountId32') {
        const normalized = typeof value === 'string' ? value : u8aToHex(u8aToU8a(String(value ?? '')))
        return wrapString(normalized, typeName, () => encodePrimitiveValue(typeName, value)) as T
      }

      if (typeName === 'Index') {
        return wrapNumber(BigInt(String(value ?? 0)), typeName) as T
      }

      return attachCodec(
        wrapWithoutLookup(value),
        value,
        typeName,
        () => encodePrimitiveValue(typeName, value)
      ) as T
    },
  }
}

async function toPolkadotSigner(signer: KeyringPair): Promise<PolkadotSigner> {
  const { getPolkadotSigner } = await loadPapiSigner()

  return getPolkadotSigner(
    signer.accountId ?? signer.publicKey,
    signer.type === 'ecdsa'
      ? 'Ecdsa'
      : signer.type === 'ed25519'
        ? 'Ed25519'
        : 'Sr25519',
    async (data: Uint8Array) => signer.sign(data)
  )
}

function storageKeyId(actualPallet: string, actualName: string): string {
  return `${actualPallet}.${actualName}`
}

function runtimeCallId(actualApi: string, actualMethod: string): string {
  return `${actualApi}.${actualMethod}`
}

function callVariantToMember(variant: any): TxEntryMember {
  if (variant.type === 'void') {
    return { type: 'void' }
  }

  if (variant.type === 'lookupEntry') {
    return { type: 'lookup', lookup: variant.value }
  }

  if (variant.type === 'tuple') {
    return { type: 'tuple', items: variant.value }
  }

  if (variant.type === 'array') {
    return {
      type: 'array',
      lookup: variant.value,
      len: variant.len,
    }
  }

  return {
    type: 'struct',
    items: Object.entries(variant.value).map(([name, lookup]) => ({
      name,
      lookup: lookup as LookupEntry,
    })),
  }
}

function buildMetaArgs(
  items: Array<{
    name: string
    lookup: LookupEntry
  }>,
  state: RuntimeState
): MetaArg[] {
  return items.map(({ name, lookup }) => {
    const codec = state.dynamicBuilder.buildDefinition(lookup.id)
    return {
      name,
      lookup,
      codec,
      type: {
        toString: () => `lookup:${lookup.id}`,
      },
    }
  })
}

function normalizeEnumInput(
  value: unknown,
  lookup: LookupEntry & { type: 'enum' },
  state: RuntimeState
): unknown {
  const candidate = unwrapCodecValue(value)

  if (isObject(candidate) && typeof candidate.type === 'string') {
    const variant = lookup.value[candidate.type]

    if (!variant) {
      return candidate
    }

    return {
      type: candidate.type,
      value: normalizeEnumMemberInput(candidate.value, variant, state),
    }
  }

  if (isObject(candidate)) {
    const [variantName] = Object.keys(candidate)

    if (variantName && variantName in lookup.value) {
      return {
        type: variantName,
        value: normalizeEnumMemberInput(
          (candidate as Record<string, unknown>)[variantName],
          lookup.value[variantName],
          state
        ),
      }
    }
  }

  if (
    (typeof candidate === 'string' || candidate instanceof Uint8Array) &&
    'Id' in lookup.value
  ) {
    return {
      type: 'Id',
      value: normalizeEnumMemberInput(candidate, lookup.value.Id, state),
    }
  }

  if (
    (typeof candidate === 'number' || typeof candidate === 'bigint') &&
    'Index' in lookup.value
  ) {
    return {
      type: 'Index',
      value: normalizeEnumMemberInput(candidate, lookup.value.Index, state),
    }
  }

  return candidate
}

function normalizeEnumMemberInput(
  value: unknown,
  member:
    | {
        type: 'lookupEntry'
        value: LookupEntry
      }
    | {
        type: 'tuple'
        value: LookupEntry[]
      }
    | {
        type: 'struct'
        value: Record<string, LookupEntry>
      }
    | {
        type: 'array'
        value: LookupEntry
        len: number
      }
    | {
        type: 'void'
      },
  state: RuntimeState
): unknown {
  const candidate = unwrapCodecValue(value)

  switch (member.type) {
    case 'lookupEntry':
      return normalizeTxInputValue(candidate, member.value, state)
    case 'tuple':
      return Array.isArray(candidate)
        ? candidate.map((entryValue, index) =>
            normalizeTxInputValue(entryValue, member.value[index], state)
          )
        : candidate
    case 'array':
      return Array.isArray(candidate)
        ? candidate.map((entryValue) =>
            normalizeTxInputValue(entryValue, member.value, state)
          )
        : candidate
    case 'struct':
      if (!isObject(candidate)) {
        return candidate
      }

      return Object.fromEntries(
        Object.entries(member.value).map(([name, entryLookup]) => [
          name,
          normalizeTxInputValue(candidate[name], entryLookup, state),
        ])
      )
    case 'void':
    default:
      return undefined
  }
}

function normalizeTxInputValue(
  value: unknown,
  lookup: LookupEntry,
  state: RuntimeState
): unknown {
  const candidate = unwrapCodecValue(value)
  const normalizedCandidate = isBnLike(candidate)
    ? BigInt(candidate.toString())
    : candidate

  switch (lookup.type) {
    case 'option':
      return typeof normalizedCandidate === 'undefined'
        ? undefined
        : normalizeTxInputValue(normalizedCandidate, lookup.value, state)
    case 'sequence':
      return Array.isArray(normalizedCandidate)
        ? normalizedCandidate.map((entryValue) =>
            normalizeTxInputValue(entryValue, lookup.value, state)
          )
        : normalizedCandidate
    case 'array':
      return Array.isArray(normalizedCandidate)
        ? normalizedCandidate.map((entryValue) =>
            normalizeTxInputValue(entryValue, lookup.value, state)
          )
        : normalizedCandidate
    case 'tuple':
      return Array.isArray(normalizedCandidate)
        ? normalizedCandidate.map((entryValue, index) =>
            normalizeTxInputValue(entryValue, lookup.value[index], state)
          )
        : normalizedCandidate
    case 'struct':
      if (!isObject(normalizedCandidate)) {
        return normalizedCandidate
      }

      return Object.fromEntries(
        Object.entries(lookup.value).map(([name, entryLookup]) => [
          name,
          normalizeTxInputValue(normalizedCandidate[name], entryLookup, state),
        ])
      )
    case 'enum':
      return normalizeEnumInput(normalizedCandidate, lookup, state)
    default:
      return normalizedCandidate
  }
}

function buildTxArgs(member: TxEntryMember, value: unknown, state: RuntimeState): Codec[] {
  switch (member.type) {
    case 'void':
      return []
    case 'lookup':
      return [wrapWithLookup(value, member.lookup, state)]
    case 'tuple':
      return member.items.map((lookup, index) =>
        wrapWithLookup((value as unknown[])[index], lookup, state)
      )
    case 'array':
      return [
        decorateArray(
          Array.isArray(value)
            ? value.map((entryValue) => wrapWithLookup(entryValue, member.lookup, state))
            : [],
          value,
          `Array<${rawTypeOf(member.lookup, state.callTypeId)}>`
        ),
      ]
    case 'struct':
    default:
      return member.items.map(({ lookup, name }) =>
        wrapWithLookup((value as Record<string, unknown>)[name], lookup, state)
      )
  }
}

function buildTxInput(member: TxEntryMember, args: unknown[], state: RuntimeState): unknown {
  switch (member.type) {
    case 'void':
      return undefined
    case 'lookup': {
      const [firstArg] = args
      const candidate = unwrapCodecValue(firstArg)
      if (candidate instanceof Uint8Array || isHex(candidate)) {
        try {
          return state.dynamicBuilder
            .buildDefinition(member.lookup.id)
            .dec(u8aToU8a(candidate as Uint8Array | string))
        } catch {
          return normalizeTxInputValue(candidate, member.lookup, state)
        }
      }

      return normalizeTxInputValue(candidate, member.lookup, state)
    }
    case 'tuple':
      return args.map((entryValue, index) =>
        normalizeTxInputValue(entryValue, member.items[index], state)
      )
    case 'array': {
      const [firstArg] = args
      const values = Array.isArray(firstArg) ? firstArg : args
      return values.map((entryValue) => {
        if (isObject(entryValue) && CALL_INPUT in entryValue) {
          return (entryValue as Record<symbol, unknown>)[CALL_INPUT]
        }
        return normalizeTxInputValue(entryValue, member.lookup, state)
      })
    }
    case 'struct':
    default: {
      const [firstArg] = args
      if (
        args.length === 1 &&
        isObject(firstArg) &&
        !(firstArg instanceof Uint8Array) &&
        !Array.isArray(firstArg)
      ) {
        return Object.fromEntries(
          member.items.map(({ name, lookup }) => [
            name,
            normalizeTxInputValue(firstArg[name], lookup, state),
          ])
        )
      }

      return Object.fromEntries(
        member.items.map(({ name, lookup }, index) => [
          name,
          normalizeTxInputValue(args[index], lookup, state),
        ])
      )
    }
  }
}

function eventEntriesFromMetadata(metadata: UnifiedMetadata, state: RuntimeState): EventEntryMeta[] {
  return metadata.pallets.flatMap((pallet) => {
    if (!pallet.events) {
      return []
    }

    const eventLookup = state.lookup(pallet.events.type)
    if (eventLookup.type !== 'enum') {
      return []
    }

    return Object.keys(eventLookup.value).map((eventName) => ({
      actualPallet: pallet.name,
      actualName: eventName,
      compatPallet: toCompatEntryName(pallet.name),
      compatName: eventName,
    }))
  })
}

export interface ApiOptions {
  provider: WsProvider
  noInitWarn?: boolean
  signedExtensions?: ExtDef
  typesBundle?: OverrideBundleType
}

export interface SubmittableExtrinsic<_ApiType = unknown> {
  readonly args: Codec[]
  readonly meta: any
  readonly method: any
  readonly section: string
  readonly isSigned: boolean
  signAsync(
    signer: KeyringPair,
    options?: Partial<{ nonce: AnyNumber; tip: AnyNumber }>
  ): Promise<SubmittableExtrinsic>
  signAndSend(
    signer: KeyringPair,
    callback?: (result: ISubmittableResult) => void
  ): Promise<Codec | (() => void)>
  signAndSend(
    signer: KeyringPair,
    options: Partial<{ nonce: AnyNumber; tip: AnyNumber }>,
    callback?: (result: ISubmittableResult) => void
  ): Promise<Codec | (() => void)>
  send(
    callback?: (result: ISubmittableResult) => void
  ): Promise<Codec | (() => void)>
  toHex(): HexString
  toHuman(isExtended?: boolean): AnyJson
  toJSON(): AnyJson
  toRawType(): string
  toString(): string
  toU8a(isBare?: boolean): Uint8Array
  toUtf8(): string
}

export type SubmittableExtrinsicFunction<_ApiType = unknown> = (
  extrinsics: Array<SubmittableExtrinsic<_ApiType> | Codec | Uint8Array | string>
) => SubmittableExtrinsic<_ApiType>

export interface ISubmittableResult {
  readonly events: EventRecord[]
  readonly status: any
  readonly txHash: Codec
  readonly dispatchError?: DispatchError
  readonly internalError?: Error
  readonly isCompleted: boolean
  readonly isError: boolean
  readonly isInBlock: boolean
  readonly isFinalized: boolean
  readonly isWarning: boolean
  readonly method: Codec
  filterRecords(section: string, method: string): EventRecord[]
  findRecord(section: string, method: string): EventRecord | undefined
  toHuman(isExtended?: boolean): AnyJson
}

export class WsProvider {
  public readonly endpoint: string | string[]

  public readonly autoConnect: boolean

  public constructor(endpoint: string | string[], autoConnect = true) {
    this.endpoint = endpoint
    this.autoConnect = autoConnect
  }
}

class CompatibleSubmittableExtrinsic implements SubmittableExtrinsic {
  public readonly args: Codec[]

  public readonly meta: any

  public readonly method: any

  public readonly section: string

  private readonly api: ApiPromise

  private readonly entryMeta: TxEntryMeta

  private readonly callInput: unknown

  private readonly signedExtrinsic?: Uint8Array

  public constructor(
    api: ApiPromise,
    entryMeta: TxEntryMeta,
    args: unknown[],
    callInput: unknown,
    signedExtrinsic?: Uint8Array
  ) {
    this.api = api
    this.entryMeta = entryMeta
    this.callInput = callInput
    this.args = buildTxArgs(entryMeta.member, callInput, api.state)
    this.meta = entryMeta.meta
    this.section = entryMeta.compatPallet
    this.method = this.api.createCallCodec(entryMeta, args, callInput)
    this.signedExtrinsic = signedExtrinsic
  }

  public get isSigned(): boolean {
    return typeof this.signedExtrinsic !== 'undefined'
  }

  public async signAsync(
    signer: KeyringPair,
    options: Partial<{ nonce: AnyNumber; tip: AnyNumber }> = {}
  ): Promise<SubmittableExtrinsic> {
    const polkadotSigner = await toPolkadotSigner(signer)
    const unsafeTx = this.api.getUnsafeTx(this.entryMeta, this.callInput)
    const signedExtrinsic = await unsafeTx.sign(
      polkadotSigner,
      this.api.normalizeTxOptions(options)
    )

    return new CompatibleSubmittableExtrinsic(
      this.api,
      this.entryMeta,
      this.args,
      this.callInput,
      signedExtrinsic
    )
  }

  public async signAndSend(
    signer: KeyringPair,
    optionsOrCallback?:
      | Partial<{ nonce: AnyNumber; tip: AnyNumber }>
      | ((result: ISubmittableResult) => void),
    callback?: (result: ISubmittableResult) => void
  ): Promise<Codec | (() => void)> {
    const txOptions =
      typeof optionsOrCallback === 'function' ? {} : (optionsOrCallback ?? {})
    const listener =
      typeof optionsOrCallback === 'function' ? optionsOrCallback : callback
    const signed = await this.signAsync(signer, txOptions)

    return signed.send(listener)
  }

  public async send(
    callback?: (result: ISubmittableResult) => void
  ): Promise<Codec | (() => void)> {
    if (!this.signedExtrinsic) {
      throw new Error('Transaction must be signed before calling send')
    }

    if (!callback) {
      const hash = await this.api.rpcRequest<string>('author_submitExtrinsic', [
        this.api.toHex(this.signedExtrinsic),
      ])

      return this.api.registry.createType('Hash', hash)
    }

    return this.api.watchSignedExtrinsic(
      this.method,
      this.signedExtrinsic,
      callback
    )
  }

  public toHex(): HexString {
    return this.method.toHex() as HexString
  }

  public toHuman(isExtended?: boolean): AnyJson {
    return this.method.toHuman(isExtended)
  }

  public toJSON(): AnyJson {
    return this.method.toJSON()
  }

  public toRawType(): string {
    return this.method.toRawType()
  }

  public toString(): string {
    return this.method.toString()
  }

  public toU8a(): Uint8Array {
    return this.method.toU8a()
  }

  public toUtf8(): string {
    return this.method.toUtf8()
  }

  public async getBareTxU8a(): Promise<Uint8Array> {
    if (this.signedExtrinsic) {
      return this.signedExtrinsic
    }

    const unsafeTx = this.api.getUnsafeTx(this.entryMeta, this.callInput)
    return unsafeTx.getBareTx()
  }

  public async getPaymentInfo(
    signer: KeyringPair,
    options: Partial<{ nonce: AnyNumber; tip: AnyNumber }> = {}
  ): Promise<unknown> {
    const unsafeTx = this.api.getUnsafeTx(this.entryMeta, this.callInput)

    return unsafeTx.getPaymentInfo(
      signer.address,
      this.api.normalizeTxOptions(options)
    )
  }
}

export class ApiPromise extends EventEmitter {
  public registry!: ReturnType<typeof createRegistry>

  public query: Record<string, Record<string, any>> = {}

  public tx: Record<string, Record<string, any>> = {}

  public consts: Record<string, Record<string, any>> = {}

  public call: Record<string, Record<string, any>> = {}

  public rpc: Record<string, Record<string, any>> = {}

  public events: Record<string, Record<string, any>> = {}

  public runtimeVersion!: RuntimeVersion

  public genesisHash!: Codec

  public readonly hasSubscriptions = true

  public isConnected = false

  public isReady: Promise<ApiPromise>

  public isReadyOrError: Promise<ApiPromise>

  public state!: RuntimeState

  private client: any

  private unsafeApi: any

  private staticApi: any

  private constructor() {
    super()

    this.isReady = Promise.resolve(this)
    this.isReadyOrError = this.isReady
  }

  public static async create(options: ApiOptions): Promise<ApiPromise> {
    const api = new ApiPromise()
    await api.initialize(options)
    api.isReady = Promise.resolve(api)
    api.isReadyOrError = api.isReady

    return api
  }

  public createType<T = Codec>(typeName: string, value?: unknown): T {
    return this.registry.createType(typeName, value) as T
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      this.client.destroy()
      this.client = undefined
    }

    if (this.isConnected) {
      this.isConnected = false
      this.emit('disconnected')
    }
  }

  public async txFromCallData(callData: Uint8Array): Promise<any> {
    const decoded = this.staticApi.decodeCallData(callData)
    const entryMeta = this.state.txEntries.get(
      storageKeyId(decoded.pallet, decoded.name)
    )

    if (!entryMeta) {
      throw new Error('createTx: invalid call data')
    }

    const args = buildTxArgs(entryMeta.member, decoded.input, this.state)
    return new CompatibleSubmittableExtrinsic(
      this,
      entryMeta,
      args,
      decoded.input
    )
  }

  public toHex(value: Uint8Array): HexString {
    return u8aToHex(value)
  }

  public async rpcRequest<Reply = unknown>(
    method: string,
    params: unknown[] = []
  ): Promise<Reply> {
    return this.client._request(method, params)
  }

  public normalizeTxOptions(
    options: Record<string, unknown> = {}
  ): Record<string, unknown> {
    const normalized: Record<string, unknown> = {}

    if ('nonce' in options && typeof options.nonce !== 'undefined') {
      const nonce = asNumber(options.nonce as AnyNumber)

      if (nonce >= 0) {
        normalized.nonce = nonce
      }
    }

    if ('tip' in options && typeof options.tip !== 'undefined') {
      normalized.tip = BigInt(String(options.tip as AnyNumber))
    }

    return normalized
  }

  public createCallCodec(
    entryMeta: TxEntryMeta,
    args: unknown[],
    callInput: unknown
  ): Codec {
    const encoded = this.staticApi.tx[entryMeta.actualPallet][
      entryMeta.actualName
    ].getEncodedData(callInput)
    const wrappedArgs = buildTxArgs(entryMeta.member, callInput, this.state)
    const rawType =
      entryMeta.member.type === 'array' && entryMeta.member.lookup.id === this.state.callTypeId
        ? 'Vec<Call>'
        : 'Call'
    const callCodec = attachCodec(
      {
        section: entryMeta.compatPallet,
        method: entryMeta.compatName,
        args: wrappedArgs,
      },
      callInput,
      rawType,
      () => encoded
    ) as unknown as Codec & Record<string, unknown>

    Object.defineProperty(callCodec, CALL_INPUT, {
      value: callInput,
      enumerable: false,
    })

    return callCodec
  }

  public getUnsafeTx(entryMeta: TxEntryMeta, callInput: unknown): any {
    return this.unsafeApi.tx[entryMeta.actualPallet][entryMeta.actualName](callInput)
  }

  public async watchSignedExtrinsic(
    call: Codec,
    signedExtrinsic: Uint8Array,
    callback: (result: ISubmittableResult) => void
  ): Promise<() => void> {
    const stream = this.client.submitAndWatch(signedExtrinsic)
    const subscription = stream.subscribe({
      next: async (event: TxWatchEvent) => {
        const result = await this.mapTxEventToResult(call, event)
        if (result) {
          callback(result)
        }
      },
      error: (error: Error) => {
        callback(
          this.createResult(call, {
            status: createStatus('future'),
            txHash: this.registry.createType('Hash'),
            internalError: error,
          })
        )
      },
    })

    return () => subscription.unsubscribe()
  }

  private async initialize(options: ApiOptions): Promise<void> {
    const [{ createClient }, { getWsProvider }, { withLegacy }] =
      await Promise.all([loadPapi(), loadPapiWs(), loadLegacyProvider()])

    const modernProvider = getWsProvider(options.provider.endpoint, {
      onStatusChanged: (status: StatusChange) => {
        if (status.type === 'connected') {
          this.isConnected = true
          return
        }

        if (status.type === 'close' || status.type === 'disconnected') {
          const wasConnected = this.isConnected
          this.isConnected = false

          if (wasConnected) {
            this.emit('disconnected')
          }
        }
      },
    }) as ModernJsonRpcProvider

    const jsonRpcProvider = toModernProvider(withLegacy()(toLegacyProvider(modernProvider)))

    this.client = createClient(jsonRpcProvider)

    const [chainSpec, finalizedBlock, runtimeVersion] = await Promise.all([
      this.client.getChainSpecData(),
      this.client.getFinalizedBlock(),
      this.rpcRequest<unknown>('state_getRuntimeVersion'),
    ])

    const metadataBytes = await this.client.getMetadata(finalizedBlock.hash)
    const metadata = unifyMetadata(decAnyMetadata(metadataBytes))
    const lookup = getLookupFn(metadata)
    const dynamicBuilder = getDynamicBuilder(lookup)
    const queryEntries = new Map<string, QueryEntryMeta>()
    const txEntries = new Map<string, TxEntryMeta>()
    const constEntries = new Map<string, ConstEntryMeta>()
    const eventEntries = new Map<string, EventEntryMeta>()
    const runtimeCallEntries = new Map<string, RuntimeCallEntryMeta>()

    this.state = {
      metadata,
      lookup,
      dynamicBuilder,
      queryEntries,
      txEntries,
      constEntries,
      eventEntries,
      runtimeCallEntries,
      callTypeId: lookup.call,
      ss58Prefix: dynamicBuilder.ss58Prefix,
    }

    this.registry = createRegistry(this.state)
    this.unsafeApi = this.client.getUnsafeApi()
    this.staticApi = await this.unsafeApi.getStaticApis()

    metadata.pallets.forEach((pallet) => {
      const compatPallet = toCompatEntryName(pallet.name)

      pallet.storage?.items.forEach((entry) => {
        const compatName = toCompatEntryName(entry.name)
        const valueLookup =
          entry.type.tag === 'plain'
            ? lookup(entry.type.value)
            : lookup(entry.type.value.value)
        const keyLookup =
          entry.type.tag === 'map'
            ? lookup(entry.type.value.key)
            : undefined
        const keyLookups =
          keyLookup?.type === 'tuple' ? keyLookup.value : keyLookup ? [keyLookup] : []

        queryEntries.set(storageKeyId(pallet.name, entry.name), {
          actualPallet: pallet.name,
          actualName: entry.name,
          compatPallet,
          compatName,
          valueLookup,
          keyLookups,
          isOptional: entry.modifier === 1,
          modifier: entry.modifier,
        })
      })

      pallet.constants.forEach((constant) => {
        constEntries.set(storageKeyId(pallet.name, constant.name), {
          actualPallet: pallet.name,
          actualName: constant.name,
          compatPallet,
          compatName: toCompatEntryName(constant.name),
          lookup: lookup(constant.type),
        })
      })

      if (pallet.calls) {
        const callLookup = lookup(pallet.calls.type)
        if (callLookup.type === 'enum') {
          Object.entries(callLookup.value).forEach(([callName, variant]) => {
            const member = callVariantToMember(variant)
            const argItems =
              member.type === 'lookup'
                ? [{ name: 'value', lookup: member.lookup }]
                : member.type === 'tuple'
                  ? member.items.map((entry, index) => ({
                      name: String(index),
                      lookup: entry,
                    }))
                  : member.type === 'array'
                    ? [{ name: 'value', lookup: member.lookup }]
                    : member.type === 'struct'
                      ? member.items
                      : []

            txEntries.set(storageKeyId(pallet.name, callName), {
              actualPallet: pallet.name,
              actualName: callName,
              compatPallet,
              compatName: toCompatEntryName(callName),
              member,
              meta: {
                args: buildMetaArgs(argItems, this.state),
                section: compatPallet,
                method: toCompatEntryName(callName),
              },
            })
          })
        }
      }
    })

    eventEntriesFromMetadata(metadata, this.state).forEach((entry) => {
      eventEntries.set(storageKeyId(entry.actualPallet, entry.actualName), entry)
    })

    metadata.apis.forEach((api) => {
      const compatApi = toCompatEntryName(api.name)
      api.methods.forEach((method) => {
        runtimeCallEntries.set(runtimeCallId(api.name, method.name), {
          actualApi: api.name,
          actualMethod: method.name,
          compatApi,
          compatMethod: toCompatEntryName(method.name),
          version: 'version' in api ? api.version : undefined,
          args: buildMetaArgs(
            method.inputs.map((input) => ({
              name: input.name,
              lookup: lookup(input.type),
            })),
            this.state
          ),
          outputLookup: lookup(method.output),
        })
      })
    })

    this.runtimeVersion = this.registry.createType(
      'RuntimeVersion',
      wrapWithoutLookup(runtimeVersion)
    ) as RuntimeVersion
    this.genesisHash = this.registry.createType('Hash', chainSpec.genesisHash)

    this.query = this.createQuerySections()
    this.tx = this.createTxSections()
    this.consts = this.createConstSections()
    this.call = this.createRuntimeCallSections()
    this.rpc = this.createRpcSections()
    this.events = this.createEventSections()
    this.isConnected = true
  }

  private createQuerySections(): Record<string, Record<string, unknown>> {
    const sections = new Map<string, Map<string, unknown>>()

    this.state.queryEntries.forEach((entryMeta) => {
      const section = sections.get(entryMeta.compatPallet) ?? new Map<string, unknown>()
      section.set(entryMeta.compatName, this.createQueryEntry(entryMeta))
      sections.set(entryMeta.compatPallet, section)
    })

    return Object.fromEntries(
      [...sections.entries()].map(([sectionName, entries]) => [
        sectionName,
        Object.fromEntries(entries.entries()),
      ])
    )
  }

  private createQueryEntry(entryMeta: QueryEntryMeta): any {
    const unsafeEntry = this.unsafeApi.query[entryMeta.actualPallet][entryMeta.actualName]
    const staticEntry = this.staticApi.query[entryMeta.actualPallet][entryMeta.actualName]

    const wrapEntryValue = (value: unknown) => {
      if (entryMeta.isOptional) {
        return wrapOption(value, {
          id: -1,
          type: 'option',
          value: entryMeta.valueLookup ?? {
            id: -1,
            type: 'void',
          },
        }, this.state)
      }

      return wrapWithLookup(value, entryMeta.valueLookup, this.state)
    }

    const callable = (...args: unknown[]) => {
      const maybeCallback = args[args.length - 1]

      if (typeof maybeCallback === 'function') {
        return this.subscribeStorageValue(
          entryMeta,
          unsafeEntry,
          args.slice(0, -1),
          maybeCallback as (value: Codec) => void
        )
      }

      return this.queryStorageValue(unsafeEntry, args, entryMeta, wrapEntryValue)
    }

    callable.entries = async (...args: unknown[]) => {
      const response = await unsafeEntry.getEntries(...args)
      return response.map(({ keyArgs, value }: { keyArgs: unknown[]; value: unknown }) => [
        this.createStorageKey(keyArgs, entryMeta.keyLookups),
        wrapEntryValue(value),
      ])
    }
    callable.keysPaged = async (options: {
      args?: unknown[]
      pageSize?: number
      startKey?: string
    }) => {
      const prefix = staticEntry.getKey(...(options.args ?? []))
      const keys = await this.rpcRequest<string[]>('state_getKeysPaged', [
        prefix,
        options.pageSize ?? 1000,
        options.startKey,
      ])

      return keys.map((keyHex) => this.createStorageKey([], [], keyHex))
    }
    callable.at = (blockHash: string, ...args: unknown[]) =>
      this.queryStorageValue(unsafeEntry, [...args, { at: blockHash }], entryMeta, wrapEntryValue)
    callable.meta = {
      modifier: entryMeta.modifier,
      section: entryMeta.compatPallet,
      method: entryMeta.compatName,
    }
    callable.method = entryMeta.compatName
    callable.section = entryMeta.compatPallet
    callable.keyPrefix = (...args: unknown[]) =>
      this.createStorageKey([], [], staticEntry.getKey(...args))
    callable.iterKey = callable.keyPrefix
    callable.prefix = staticEntry.getKey()

    return callable
  }

  private async subscribeStorageValue(
    entryMeta: QueryEntryMeta,
    unsafeEntry: any,
    args: unknown[],
    callback: (value: Codec) => void
  ): Promise<() => void> {
    const subscription = unsafeEntry.watchValue(...args, { at: 'best' }).subscribe({
      next: ({ value }: { value: unknown }) => {
        const wrapped = entryMeta.isOptional
          ? wrapOption(value, {
              id: -1,
              type: 'option',
              value: entryMeta.valueLookup ?? { id: -1, type: 'void' },
            }, this.state)
          : wrapWithLookup(value, entryMeta.valueLookup, this.state)
        callback(wrapped)
      },
    })

    return () => subscription.unsubscribe()
  }

  private async queryStorageValue(
    unsafeEntry: any,
    args: unknown[],
    entryMeta: QueryEntryMeta,
    wrapValue: (value: unknown) => Codec
  ): Promise<Codec> {
    const value = await unsafeEntry.getValue(...args)
    return wrapValue(value)
  }

  private createStorageKey(
    keyArgs: unknown[],
    keyLookups: LookupEntry[],
    keyHex?: string
  ): StorageKey {
    const wrappedArgs = keyArgs.map((arg, index) =>
      wrapWithLookup(arg, keyLookups[index], this.state)
    )

    return attachCodec(
      {
        args: wrappedArgs,
      },
      {
        args: keyArgs,
        keyHex,
      },
      'StorageKey',
      () => (keyHex ? hexToU8a(keyHex) : u8aToU8a(JSON.stringify(keyArgs)))
    ) as StorageKey
  }

  private createTxSections(): Record<string, Record<string, unknown>> {
    const sections = new Map<string, Map<string, unknown>>()

    this.state.txEntries.forEach((entryMeta) => {
      const section = sections.get(entryMeta.compatPallet) ?? new Map<string, unknown>()
      section.set(entryMeta.compatName, (...args: unknown[]) => {
        const input = buildTxInput(entryMeta.member, args, this.state)
        return new CompatibleSubmittableExtrinsic(this, entryMeta, args, input)
      })
      sections.set(entryMeta.compatPallet, section)
    })

    return Object.fromEntries(
      [...sections.entries()].map(([sectionName, entries]) => [
        sectionName,
        Object.fromEntries(entries.entries()),
      ])
    )
  }

  private createConstSections(): Record<string, Record<string, unknown>> {
    const sections = new Map<string, Map<string, unknown>>()

    this.state.constEntries.forEach((entryMeta) => {
      const section = sections.get(entryMeta.compatPallet) ?? new Map<string, unknown>()
      const rawValue = this.staticApi.constants[entryMeta.actualPallet][entryMeta.actualName]
      section.set(entryMeta.compatName, wrapWithLookup(rawValue, entryMeta.lookup, this.state))
      sections.set(entryMeta.compatPallet, section)
    })

    return Object.fromEntries(
      [...sections.entries()].map(([sectionName, entries]) => [
        sectionName,
        Object.fromEntries(entries.entries()),
      ])
    )
  }

  private createRuntimeCallSections(): Record<string, Record<string, unknown>> {
    const sections = new Map<string, Map<string, unknown>>()

    this.state.runtimeCallEntries.forEach((entryMeta) => {
      const section = sections.get(entryMeta.compatApi) ?? new Map<string, unknown>()
      const unsafeCall = this.unsafeApi.apis[entryMeta.actualApi][entryMeta.actualMethod]
      const wrapped = async (...args: unknown[]) =>
        wrapWithLookup(
          await unsafeCall(...args),
          entryMeta.outputLookup,
          this.state
        )

      ;(wrapped as any).meta = {
        section: entryMeta.compatApi,
        version: entryMeta.version ?? 1,
      }

      section.set(entryMeta.compatMethod, wrapped)
      sections.set(entryMeta.compatApi, section)
    })

    return Object.fromEntries(
      [...sections.entries()].map(([sectionName, entries]) => [
        sectionName,
        Object.fromEntries(entries.entries()),
      ])
    )
  }

  private createRpcSections(): Record<string, Record<string, unknown>> {
    return {
      system: {
        accountNextIndex: async (address: string) =>
          this.registry.createType(
            'Index',
            await this.rpcRequest('system_accountNextIndex', [address])
          ),
      },
    }
  }

  private createEventSections(): Record<string, Record<string, unknown>> {
    const sections = new Map<string, Map<string, unknown>>()

    this.state.eventEntries.forEach((entryMeta) => {
      const section = sections.get(entryMeta.compatPallet) ?? new Map<string, unknown>()
      section.set(entryMeta.compatName, {
        is: (event: { section?: string; method?: string }) =>
          event.section === entryMeta.compatPallet &&
          event.method === entryMeta.compatName,
      })
      sections.set(entryMeta.compatPallet, section)
    })

    return Object.fromEntries(
      [...sections.entries()].map(([sectionName, entries]) => [
        sectionName,
        Object.fromEntries(entries.entries()),
      ])
    )
  }

  private async mapTxEventToResult(
    call: Codec,
    event: TxWatchEvent
  ): Promise<ISubmittableResult | null> {
    switch (event.type) {
      case 'broadcasted':
        return this.createResult(call, {
          status: createStatus('ready'),
          txHash: this.registry.createType('Hash', event.txHash),
        })
      case 'txBestBlocksState':
        if (!event.found || !event.block) {
          return null
        }

        return this.createBlockResult(call, event, 'inBlock')
      case 'finalized':
        return this.createBlockResult(call, event, 'finalized')
      case 'signed':
      default:
        return null
    }
  }

  private async createBlockResult(
    call: Codec,
    event: TxWatchEvent,
    kind: 'inBlock' | 'finalized'
  ): Promise<ISubmittableResult> {
    const blockHash = event.block?.hash ?? event.txHash
    const systemEvents = await this.query.system.events.at(blockHash)
    const maybeEvents = systemEvents as {
      isSome?: boolean
      unwrap?: () => EventRecord[]
    }
    const allEvents = (
      isObject(systemEvents) &&
      'isSome' in maybeEvents &&
      'unwrap' in maybeEvents
        ? (maybeEvents.isSome ? maybeEvents.unwrap?.() ?? [] : [])
        : systemEvents
    ) as unknown as EventRecord[]
    const extrinsicEvents = allEvents.filter(
      (record) =>
        record.phase.isApplyExtrinsic &&
        record.phase.asApplyExtrinsic.toNumber() === event.block?.index
    )
    const dispatchError = this.extractDispatchError(extrinsicEvents)

    return this.createResult(call, {
      status: createStatus(kind, blockHash),
      txHash: this.registry.createType('Hash', event.txHash),
      events: extrinsicEvents,
      dispatchError,
    })
  }

  private extractDispatchError(
    events: EventRecord[]
  ): DispatchError | undefined {
    const failedEvent = events.find(
      ({ event }) =>
        event.section === 'system' && event.method === 'ExtrinsicFailed'
    )

    if (!failedEvent) {
      return undefined
    }

    return failedEvent.event.data[0] as DispatchError
  }

  private createResult(
    call: Codec,
    {
      status,
      txHash,
      events = [],
      dispatchError,
      internalError,
    }: {
      status: any
      txHash: Codec
      events?: EventRecord[]
      dispatchError?: DispatchError
      internalError?: Error
    }
  ): ISubmittableResult {
    const result = {
      events,
      status,
      txHash,
      dispatchError,
      internalError,
      isCompleted:
        status.isInBlock ||
        status.isFinalized ||
        Boolean(dispatchError || internalError),
      isError: Boolean(dispatchError || internalError),
      isInBlock: status.isInBlock,
      isFinalized: status.isFinalized,
      isWarning: false,
      method: call,
      filterRecords: (section: string, method: string) =>
        events.filter(
          (eventRecord) =>
            eventRecord.event.section === section &&
            eventRecord.event.method === method
        ),
      findRecord: (section: string, method: string) =>
        events.find(
          (eventRecord) =>
            eventRecord.event.section === section &&
            eventRecord.event.method === method
        ),
      toHuman: () => ({
        dispatchError: dispatchError ? dispatchError.toHuman() : undefined,
        events: events.map((eventRecord) => eventRecord.toHuman()),
        internalError: internalError?.message,
        status: status.toHuman(),
        txHash: txHash.toHex(),
      }),
    }

    return result as ISubmittableResult
  }
}
