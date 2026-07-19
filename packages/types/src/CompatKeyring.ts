import {
  accountId,
  blake2b256,
  DEV_PHRASE,
  ecdsa,
  ed25519,
  ensureBytes,
  mnemonicToMiniSecret,
  parseSuri,
  ss58Address,
  sr25519,
} from '@polkadot-labs/hdkd-helpers'
import { HDKD, getPublicKey as sr25519PublicKey, secretFromSeed } from '@scure/sr25519'
import { Bytes as ScaleBytes, Tuple, str, u32 } from 'scale-ts'

import type { HexString, Prefix } from './CompatTypes.js'
import { u8aToU8a } from './CompatUtils.js'

export type KeypairType = 'ed25519' | 'sr25519' | 'ecdsa' | 'ethereum'

type SupportedKeypairType = Exclude<KeypairType, 'ethereum'>

export interface KeyringPair {
  readonly address: string
  readonly accountId: Uint8Array
  readonly secretKey: Uint8Array
  readonly publicKey: Uint8Array
  readonly ss58Address: string
  readonly type: SupportedKeypairType
  sign(
    message: Uint8Array | string,
    options?: {
      withType?: boolean
    }
  ): Uint8Array
  derive(path: string): KeyringPair
}

type CreateKeypairContext = {
  path: string
  prefix: Prefix
  rootSeed: Uint8Array
  type: SupportedKeypairType
}

type DerivationSegment = readonly ['hard' | 'soft', Uint8Array]

const derivationCodec = Tuple(str, ScaleBytes(32), ScaleBytes(32))
const derivationPattern = /(\/{1,2})([^/]+)/g

function signaturePrefix(type: SupportedKeypairType): number {
  switch (type) {
    case 'ed25519':
      return 0
    case 'ecdsa':
      return 2
    case 'sr25519':
    default:
      return 1
  }
}

function derivationPrefix(type: SupportedKeypairType): string {
  switch (type) {
    case 'ed25519':
      return 'Ed25519HDKD'
    case 'ecdsa':
      return 'Secp256k1HDKD'
    case 'sr25519':
    default:
      return 'SchnorrkelHDKD'
  }
}

function createChainCode(code: string): Uint8Array {
  const chainCode = new Uint8Array(32)
  const encoded = Number.isNaN(Number(code)) ? str.enc(code) : u32.enc(Number(code))
  chainCode.set(encoded)
  return chainCode
}

function derivePrivateKey(
  rootSeed: Uint8Array,
  path: string,
  type: SupportedKeypairType
): Uint8Array {
  const derivations: DerivationSegment[] = [...path.matchAll(derivationPattern)].map(
    ([, slash, code]) => [
      slash === '//' ? 'hard' : 'soft',
      createChainCode(code),
    ] as const
  )

  if (type === 'sr25519') {
    return derivations.reduce<Uint8Array>(
      (secretKey, [derivationType, chainCode]) =>
        derivationType === 'hard'
          ? HDKD.secretHard(secretKey, chainCode)
          : HDKD.secretSoft(secretKey, chainCode),
      secretFromSeed(rootSeed)
    )
  }

  return derivations.reduce<Uint8Array>((secretKey, [derivationType, chainCode]) => {
    if (derivationType === 'soft') {
      throw new Error(`Soft derivations are not supported for ${type}`)
    }

    return blake2b256(
      derivationCodec.enc([derivationPrefix(type), secretKey, chainCode])
    )
  }, rootSeed)
}

function getPublicKey(
  type: SupportedKeypairType,
  secretKey: Uint8Array
): Uint8Array {
  switch (type) {
    case 'ed25519':
      return ed25519.getPublicKey(secretKey)
    case 'ecdsa':
      return ecdsa.getPublicKey(secretKey)
    case 'sr25519':
    default:
      return sr25519PublicKey(secretKey)
  }
}

function signMessage(
  type: SupportedKeypairType,
  secretKey: Uint8Array,
  message: Uint8Array
): Uint8Array {
  switch (type) {
    case 'ed25519':
      return ed25519.sign(message, secretKey)
    case 'ecdsa':
      return ecdsa.sign(message, secretKey)
    case 'sr25519':
    default:
      return sr25519.sign(message, secretKey)
  }
}

function makeKeyringPair(context: CreateKeypairContext): KeyringPair {
  const secretKey = derivePrivateKey(
    context.rootSeed,
    context.path,
    context.type
  )
  const publicKey = getPublicKey(context.type, secretKey)
  const networkAccountId = accountId(publicKey)
  const address = ss58Address(publicKey, context.prefix)

  return {
    address,
    accountId: networkAccountId,
    secretKey,
    publicKey,
    ss58Address: address,
    type: context.type,
    sign(message, options) {
      const signature = signMessage(context.type, secretKey, u8aToU8a(message))
      if (!options?.withType) {
        return signature
      }

      return Uint8Array.from([signaturePrefix(context.type), ...signature])
    },
    derive(path: string) {
      return makeKeyringPair({
        ...context,
        path: `${context.path}${path}`,
      })
    },
  }
}

function normalizeRootSeed(uriOrMnemonic: string): {
  path: string
  rootSeed: Uint8Array
} {
  const { phrase, password, paths } = parseSuri(uriOrMnemonic)
  const normalizedPhrase = phrase ?? DEV_PHRASE

  if (/^0x[0-9a-fA-F]+$/.test(normalizedPhrase)) {
    return {
      path: paths ?? '',
      rootSeed: ensureBytes('seed', normalizedPhrase, 32),
    }
  }

  return {
    path: paths ?? '',
    rootSeed: mnemonicToMiniSecret(normalizedPhrase, password),
  }
}

export class Keyring {
  public readonly ss58Format: Prefix

  public readonly type: SupportedKeypairType

  public constructor(options: {
    ss58Format?: Prefix
    type?: SupportedKeypairType
  } = {}) {
    this.ss58Format = options.ss58Format ?? 42
    this.type = options.type ?? 'sr25519'
  }

  public addFromMnemonic(mnemonic: string): KeyringPair {
    return this.addFromUri(mnemonic)
  }

  public addFromSeed(seed: Uint8Array | HexString | string): KeyringPair {
    return makeKeyringPair({
      path: '',
      prefix: this.ss58Format,
      rootSeed: u8aToU8a(seed),
      type: this.type,
    })
  }

  public addFromUri(uri: string): KeyringPair {
    const { path, rootSeed } = normalizeRootSeed(uri)
    return makeKeyringPair({
      path,
      prefix: this.ss58Format,
      rootSeed,
      type: this.type,
    })
  }

  public createFromUri(uri: string): KeyringPair {
    return this.addFromUri(uri)
  }
}
