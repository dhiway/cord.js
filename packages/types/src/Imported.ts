import BN from 'bn.js'
import { mnemonicToMiniSecret } from '@polkadot-labs/hdkd-helpers'

export { ApiPromise, WsProvider } from './PolkadotApiCompat.js'
export { Keyring } from './CompatKeyring.js'
export {
  assert,
  base58Decode,
  base58Encode,
  blake2AsHex,
  blake2AsU8a,
  checkAddress,
  cryptoWaitReady,
  decodeAddress,
  encodeAddress,
  hexToBn,
  isHex,
  isString,
  mnemonicGenerate,
  randomAsU8a,
  signatureVerify,
  stringToU8a,
  u8aConcat,
  u8aToHex,
  u8aToString,
  u8aToU8a,
} from './CompatUtils.js'

export { mnemonicToMiniSecret }
export { BN }

export type { ISubmittableResult } from './PolkadotApiCompat.js'
export type {
  AccountId,
  AccountId32,
  AnyJson,
  AnyNumber,
  BlockNumber,
  Bytes,
  Codec,
  DefinitionCall,
  DefinitionsCall,
  DispatchError,
  EventRecord,
  Extrinsic,
  ExtDef,
  ExtInfo,
  H256,
  HexString,
  Index,
  NumberCodec,
  Option,
  OverrideBundleDefinition,
  OverrideBundleType,
  OverrideVersionedType,
  Prefix,
  RegistryError,
  RegistryTypes,
  RuntimeVersion,
  StorageKey,
} from './CompatTypes.js'
export type { BN as BNType } from 'bn.js'
export type { KeyringPair } from './CompatKeyring.js'
export type {
  ApiOptions,
  SubmittableExtrinsic,
  SubmittableExtrinsicFunction,
} from './PolkadotApiCompat.js'
