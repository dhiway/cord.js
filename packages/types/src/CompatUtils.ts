import { randomBytes } from 'node:crypto'
import { TextDecoder, TextEncoder } from 'node:util'

import BN from 'bn.js'
import {
  blake2b256,
  blake2b512,
  generateMnemonic,
  ss58Decode,
  ss58Encode,
  ed25519,
  ecdsa,
  sr25519,
} from '@polkadot-labs/hdkd-helpers'

import type { AnyNumber, HexString, Prefix } from './CompatTypes.js'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

const BASE58_ALPHABET =
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const BASE58_INDEX = new Map(
  BASE58_ALPHABET.split('').map((char, index) => [char, index])
)

function hexBody(value: string): string {
  return value.startsWith('0x') ? value.slice(2) : value
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function assert(
  condition: unknown,
  message: string | (() => string) = 'Assertion failed'
): asserts condition {
  if (!condition) {
    throw new Error(typeof message === 'function' ? message() : message)
  }
}

export function isHex(value: unknown, bitLength = -1): value is HexString {
  if (typeof value !== 'string' || !/^(0x)?[0-9a-fA-F]+$/.test(value)) {
    return false
  }

  if (bitLength < 0) {
    return true
  }

  return hexBody(value).length === bitLength / 4
}

export function stringToU8a(value: string): Uint8Array {
  return encoder.encode(value)
}

export function u8aToString(value: Uint8Array): string {
  return decoder.decode(value)
}

export function u8aToHex(value: Uint8Array): HexString {
  return `0x${Buffer.from(value).toString('hex')}` as HexString
}

export function hexToU8a(value: string): Uint8Array {
  const normalized = hexBody(value)
  const padded = normalized.length % 2 === 0 ? normalized : `0${normalized}`
  return Uint8Array.from(Buffer.from(padded, 'hex'))
}

export function u8aConcat(
  ...values: Array<Buffer | Uint8Array | string | number[]>
): Uint8Array {
  const normalized = values.map((value) => u8aToU8a(value))
  const length = normalized.reduce((total, value) => total + value.length, 0)
  const result = new Uint8Array(length)
  let offset = 0

  normalized.forEach((value) => {
    result.set(value, offset)
    offset += value.length
  })

  return result
}

export function u8aToU8a(
  value: Buffer | Uint8Array | string | number[] | null | undefined
): Uint8Array {
  if (!value) {
    return new Uint8Array()
  }

  if (value instanceof Uint8Array) {
    return new Uint8Array(value)
  }

  if (Buffer.isBuffer(value)) {
    return new Uint8Array(value)
  }

  if (Array.isArray(value)) {
    return Uint8Array.from(value)
  }

  if (isHex(value)) {
    return hexToU8a(value)
  }

  return stringToU8a(value)
}

export function hexToBn(value: HexString | string): BN {
  return new BN(hexBody(value), 16)
}

export function base58Encode(value: Uint8Array): string {
  if (value.length === 0) {
    return ''
  }

  const digits = [0]

  value.forEach((byte) => {
    let carry = byte

    digits.forEach((digit, index) => {
      const current = digit * 256 + carry
      digits[index] = current % 58
      carry = Math.floor(current / 58)
    })

    while (carry > 0) {
      digits.push(carry % 58)
      carry = Math.floor(carry / 58)
    }
  })

  let prefix = ''
  value.forEach((byte) => {
    if (byte === 0) {
      prefix += '1'
    }
  })

  return `${prefix}${digits
    .reverse()
    .map((digit) => BASE58_ALPHABET[digit])
    .join('')}`
}

export function base58Decode(value: string): Uint8Array {
  if (value.length === 0) {
    return new Uint8Array()
  }

  const bytes = [0]

  value.split('').forEach((char) => {
    const digit = BASE58_INDEX.get(char)
    if (typeof digit === 'undefined') {
      throw new Error(`Invalid base58 character '${char}'`)
    }

    let carry = digit
    bytes.forEach((byte, index) => {
      const current = byte * 58 + carry
      bytes[index] = current & 0xff
      carry = current >> 8
    })

    while (carry > 0) {
      bytes.push(carry & 0xff)
      carry >>= 8
    }
  })

  let leadingZeroes = 0
  while (leadingZeroes < value.length && value[leadingZeroes] === '1') {
    leadingZeroes += 1
  }

  return Uint8Array.from([
    ...new Array(leadingZeroes).fill(0),
    ...bytes.reverse(),
  ])
}

export function blake2AsU8a(
  value: Buffer | Uint8Array | string,
  bitLength: 64 | 128 | 256 | 384 | 512 = 256
): Uint8Array {
  const input = u8aToU8a(value)

  if (bitLength === 256) {
    return blake2b256(input)
  }

  const digest512 = blake2b512(input)
  if (bitLength === 512) {
    return digest512
  }

  return digest512.slice(0, bitLength / 8)
}

export function blake2AsHex(
  value: Buffer | Uint8Array | string,
  bitLength: 64 | 128 | 256 | 384 | 512 = 256
): HexString {
  return u8aToHex(blake2AsU8a(value, bitLength))
}

export function cryptoWaitReady(): Promise<boolean> {
  return Promise.resolve(true)
}

export function randomAsU8a(length: number): Uint8Array {
  return new Uint8Array(randomBytes(length))
}

export function mnemonicGenerate(words = 12): string {
  const strength = Math.max(128, Math.round((words * 32) / 3))
  return generateMnemonic(strength)
}

export function encodeAddress(
  key: HexString | Uint8Array | string,
  prefix: Prefix = 42
): string {
  return ss58Encode(u8aToU8a(key), prefix)
}

export function decodeAddress(address: string): Uint8Array {
  return ss58Decode(address)[0]
}

export function checkAddress(
  address: string,
  prefix: Prefix = -1
): [boolean, string | null] {
  try {
    const [, decodedPrefix] = ss58Decode(address)
    if (prefix >= 0 && decodedPrefix !== prefix) {
      return [false, `Expected prefix ${prefix}, got ${decodedPrefix}`]
    }
    return [true, null]
  } catch (error) {
    return [false, error instanceof Error ? error.message : 'Invalid address']
  }
}

type SignatureVerification = {
  crypto: 'ed25519' | 'sr25519' | 'ecdsa' | 'none'
  isValid: boolean
  publicKey: Uint8Array
}

const SIGNATURE_TYPES = ['ed25519', 'sr25519', 'ecdsa'] as const

function prefixedSignatureToParts(signature: Uint8Array): {
  type: SignatureVerification['crypto']
  signature: Uint8Array
} {
  const prefix = signature[0]
  const type = SIGNATURE_TYPES.at(prefix) ?? 'none'
  return {
    type,
    signature:
      type === 'none' || signature.length < 65 ? signature : signature.slice(1),
  }
}

function detectSignatureType(
  signature: Uint8Array,
  publicKey: Uint8Array
): SignatureVerification['crypto'] {
  if (signature.length === 65 && publicKey.length === 33) {
    return 'ecdsa'
  }

  if (sr25519.verify(signature, new Uint8Array(), publicKey)) {
    return 'sr25519'
  }

  return publicKey.length === 32 ? 'ed25519' : 'none'
}

export function signatureVerify(
  message: Buffer | Uint8Array | string,
  signature: Buffer | Uint8Array | string,
  addressOrPublicKey: string | HexString | Uint8Array
): SignatureVerification {
  const messageU8a = u8aToU8a(message)
  const signatureU8a = u8aToU8a(signature)
  const publicKey = isString(addressOrPublicKey)
    ? addressOrPublicKey.startsWith('3')
      ? decodeAddress(addressOrPublicKey)
      : u8aToU8a(addressOrPublicKey)
    : u8aToU8a(addressOrPublicKey)

  const {
    type: prefixedType,
    signature: unwrappedSignature,
  } = prefixedSignatureToParts(signatureU8a)
  const type =
    prefixedType !== 'none'
      ? prefixedType
      : detectSignatureType(unwrappedSignature, publicKey)

  let isValid = false
  if (type === 'sr25519') {
    isValid = sr25519.verify(unwrappedSignature, messageU8a, publicKey)
  } else if (type === 'ed25519') {
    isValid = ed25519.verify(unwrappedSignature, messageU8a, publicKey)
  } else if (type === 'ecdsa') {
    isValid = ecdsa.verify(unwrappedSignature, messageU8a, publicKey)
  }

  return {
    crypto: type,
    isValid,
    publicKey,
  }
}

export function asNumber(value: AnyNumber): number {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'bigint') {
    return Number(value)
  }

  if (value instanceof BN) {
    return value.toNumber()
  }

  if (typeof value === 'object' && value !== null && 'toNumber' in value) {
    return value.toNumber()
  }

  return Number(value.toString())
}
