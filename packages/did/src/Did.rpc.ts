import type { Option, Struct } from '@polkadot/types'
import type { AccountId32, Hash } from '@polkadot/types/interfaces'
import { AnyJson } from '@polkadot/types/types'
import { BN, hexToU8a, u8aToString } from '@polkadot/util'
import type {
  RawDidLinkedInfo,
  PalletDidDidDetailsDidPublicKeyDetails,
  PalletDidDidDetails,
  PalletDidServiceEndpointsDidEndpoint,
} from '@cord.network/augment-api'
import type {
  DidDocument,
  DidEncryptionKey,
  DidKey,
  DidServiceEndpoint,
  DidUri,
  DidVerificationKey,
  UriFragment,
} from '@cord.network/types'

import { Crypto, ss58Format } from '@cord.network/utils'
import { getDidUri } from './Did.utils.js'
import { HexString } from '@polkadot/util/types.js'

function fromChain(encoded: AccountId32 | string): DidUri {
  return getDidUri(Crypto.encodeAddress(encoded, ss58Format))
}

type RpcDocument = Pick<
  DidDocument,
  'authentication' | 'assertionMethod' | 'capabilityDelegation' | 'keyAgreement'
> & {
  lastTxCounter: BN
}

function didPublicKeyDetailsFromChain(
  keyId: Hash,
  keyDetails: PalletDidDidDetailsDidPublicKeyDetails
): DidKey {
  const key = keyDetails.key.isPublicEncryptionKey
    ? keyDetails.key.asPublicEncryptionKey
    : keyDetails.key.asPublicVerificationKey
  return {
    id: `#${keyId.toHex()}`,
    type: key.type.toLowerCase() as DidKey['type'],
    publicKey: key.value.toU8a(),
  }
}

function resourceIdToChain(id: UriFragment): string {
  return id.replace(/^#/, '')
}

function documentFromChain(encoded: PalletDidDidDetails): RpcDocument {
  const {
    publicKeys,
    authenticationKey,
    assertionKey,
    delegationKey,
    keyAgreementKeys,
    lastTxCounter,
  } = encoded

  const keys: Record<string, DidKey> = [...publicKeys.entries()]
    .map(([keyId, keyDetails]) =>
      didPublicKeyDetailsFromChain(keyId, keyDetails)
    )
    .reduce((res, key) => {
      res[resourceIdToChain(key.id)] = key
      return res
    }, {})

  const authentication = keys[authenticationKey.toHex()] as DidVerificationKey

  const didRecord: RpcDocument = {
    authentication: [authentication],
    lastTxCounter: lastTxCounter.toBn(),
  }

  if (assertionKey.isSome) {
    const key = keys[assertionKey.unwrap().toHex()] as DidVerificationKey
    didRecord.assertionMethod = [key]
  }
  if (delegationKey.isSome) {
    const key = keys[delegationKey.unwrap().toHex()] as DidVerificationKey
    didRecord.capabilityDelegation = [key]
  }

  const keyAgreementKeyIds = [...keyAgreementKeys.values()].map((keyId) =>
    keyId.toHex()
  )
  if (keyAgreementKeyIds.length > 0) {
    didRecord.keyAgreement = keyAgreementKeyIds.map(
      (id) => keys[id] as DidEncryptionKey
    )
  }

  return didRecord
}

function serviceFromChain(
  encoded: PalletDidServiceEndpointsDidEndpoint
): DidServiceEndpoint {
  const { id, serviceTypes, urls } = encoded
  return {
    id: `#${u8aToString(id)}`,
    type: serviceTypes.map(u8aToString),
    serviceEndpoint: urls.map(u8aToString),
  }
}

function servicesFromChain(
  encoded: PalletDidServiceEndpointsDidEndpoint[]
): DidServiceEndpoint[] {
  return encoded.map((encodedValue) => serviceFromChain(encodedValue))
}

/**
 * DidName is the type of nickname for a DID.
 */
export type DidName = string
export type DidAccount = string

export interface DidInfo {
  document: DidDocument
  account: DidAccount
  didName?: DidName
}

/**
 * Decodes DID and DidName linked to the provided account.
 *
 * @param encoded The data returned by `api.call.did.query()`, and `api.call.did.queryByDidName()`.

 * @returns The DID, and DidName.
 */
export function linkedInfoFromChain(
  encoded: Option<RawDidLinkedInfo>
): DidInfo {
  const { identifier, account, name, serviceEndpoints, details } =
    encoded.unwrap()
  const didRec = documentFromChain(details)
  const did: DidDocument = {
    uri: fromChain(identifier),
    authentication: didRec.authentication,
    assertionMethod: didRec.assertionMethod,
    capabilityDelegation: didRec.capabilityDelegation,
    keyAgreement: didRec.keyAgreement,
  }

  const service = servicesFromChain(serviceEndpoints)
  if (service.length > 0) {
    did.service = service
  }

  const didName = name.isNone ? undefined : name.unwrap().toHuman()
  const DidAccount = account.toHuman()

  return {
    document: did,
    account: DidAccount,
    didName,
  }
}

interface PalletDidDidDetailsApi extends Struct {
  readonly authenticationKey: string;
  readonly keyAgreementKeys: string;
  readonly delegationKey: string | undefined;
  readonly assertionKey: string | undefined;
  readonly publicKeys: any; /* todo */
  readonly lastTxCounter: number;
}

interface PalletDidServiceEndpointsApi extends Struct {
  readonly id: string;
  readonly serviceTypes: string[];
  readonly urls: string[];
}

function didPublicKeyDetailsFromApi(
  keyId: string,
  keyDetails: any
): DidKey {
  const key = keyDetails.key.publicVerificationKey 
    ? keyDetails.key.publicVerificationKey
    : keyDetails.key.publicEncryptionKey
  return {
    id: `#${keyId}`,
    type: Object.keys(key)[0].toLowerCase() as DidKey['type'],
    publicKey: hexToU8a(Object.entries(key)[0][1] as HexString)
  }
}

function documentFromApi(encoded: AnyJson): RpcDocument {
  if (!encoded) return {} as RpcDocument
  if (typeof encoded !== 'object') return {} as RpcDocument
  const {
    publicKeys,
    authenticationKey,
    assertionKey,
    delegationKey,
    keyAgreementKeys,
    lastTxCounter,
  } = encoded as unknown as PalletDidDidDetailsApi

  const keys: Record<string, DidKey> = [...Object.entries(publicKeys)]
    .map(([keyId, keyDetails]) =>
      didPublicKeyDetailsFromApi(keyId, (keyDetails as unknown) as PalletDidDidDetailsDidPublicKeyDetails)
    )
    .reduce((res, key) => {
      res[resourceIdToChain(key.id)] = key
      return res
    }, {})

  const authentication = keys[authenticationKey] as DidVerificationKey

  const didRecord: RpcDocument = {
    authentication: [authentication],
    lastTxCounter: new BN(lastTxCounter),
  }

  if (assertionKey) {
    const key = keys[assertionKey] as DidVerificationKey
    didRecord.assertionMethod = [key]
  }
  if (delegationKey) {
    const key = keys[delegationKey] as DidVerificationKey
    didRecord.capabilityDelegation = [key]
  }

  const keyAgreementKeyIds = [...keyAgreementKeys]
  if (keyAgreementKeyIds.length > 0) {
    didRecord.keyAgreement = keyAgreementKeyIds.map(
      (id) => keys[id] as DidEncryptionKey
    )
  }

  return didRecord
}

function serviceFromApi(
  encoded: PalletDidServiceEndpointsApi
): DidServiceEndpoint {
  const { id, serviceTypes, urls } = encoded
  return {
    id: `#${id}`,
    type: serviceTypes,
    serviceEndpoint: urls,
  }
}

function servicesFromApi(
  encoded: AnyJson
): DidServiceEndpoint[] {
  const e: PalletDidServiceEndpointsApi[] = encoded as unknown as PalletDidServiceEndpointsApi[]
  return e.map((encodedValue) => serviceFromApi(encodedValue))
}

export function linkedInfoFromApi(
  encoded: Record<string, AnyJson>
): DidInfo {
  const { identifier, name, serviceEndpoints, details } = encoded
  const didRec = documentFromApi(details)
  const did: DidDocument = {
    uri: fromChain(identifier as string),
    authentication: didRec.authentication,
    assertionMethod: didRec.assertionMethod,
    capabilityDelegation: didRec.capabilityDelegation,
    keyAgreement: didRec.keyAgreement,
  }

  const service = servicesFromApi(serviceEndpoints)
  if (service.length > 0) {
    did.service = service
  }

  return {
    document: did,
    didName: name ? name as string : undefined,
  }
}
