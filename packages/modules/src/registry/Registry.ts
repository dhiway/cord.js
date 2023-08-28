/**
 * Registry.
 *
 * @packageDocumentation
 * @module Registry
 * @preferred
 */

import type {
  DidUri,
  IRegistry,
  IRegistryType,
  RegistryId,
  AuthorizationId,
  IRegistryAuthorizationDetails,
} from '@cord.network/types'
import {
  Identifier,
  Crypto,
  SDKErrors,
  jsonabc,
  DataUtils,
  DecoderUtils,
} from '@cord.network/utils'
import {
  REGISTRY_IDENT,
  REGISTRY_PREFIX,
  AUTHORIZATION_IDENT,
  AUTHORIZATION_PREFIX,
} from '@cord.network/types'
import { ConfigService } from '@cord.network/config'
import type { AccountId } from '@polkadot/types/interfaces'
import { Bytes, Option } from '@polkadot/types'
import * as Did from '@cord.network/did'
import { blake2AsHex } from '@polkadot/util-crypto'
import type { PalletRegistryRegistryAuthorization } from '@cord.network/augment-api'
/**
 *  Checks whether the input meets all the required criteria of an [[IRegistry]] object.
 *  Throws on invalid input.
 *
 * @param input The potentially only partial [[IRegistry]].
 *
 */
export function verifyRegistryDataStructure(input: IRegistry): void {
  if (!input.meta.creator) {
    throw new SDKErrors.CreatorMissingError()
  }
  if (!input.meta.digest) {
    throw new SDKErrors.DataStructureError('registry hash not provided')
  }
  if (!input.details) {
    throw new SDKErrors.ContentMissingError()
  } else {
    Object.entries(input.details).forEach(([key, value]) => {
      if (
        !key ||
        typeof key !== 'string' ||
        !['string', 'number', 'boolean', 'object'].includes(typeof value)
      ) {
        throw new SDKErrors.RegistryInputMalformedError()
      }
    })
  }
  DataUtils.verifyIsHex(input.meta.digest, 256)
}

/**
 * Calculates the registry Id by hashing it.
 *
 * @param registry  Registry for which to create the id.
 * @returns Registry id uri.
 */
export function getUriForRegistry(
  serializedRegistry: string,
  creator: DidUri
): RegistryId {
  const api = ConfigService.get('api')
  const scaleEncodedRegistry = api
    .createType<Bytes>('Bytes', serializedRegistry)
    .toU8a()
  const scaleEncodedCreator = api
    .createType<AccountId>('AccountId', Did.toChain(creator))
    .toU8a()
  const digest = blake2AsHex(
    Uint8Array.from([...scaleEncodedRegistry, ...scaleEncodedCreator])
  )
  return Identifier.hashToUri(digest, REGISTRY_IDENT, REGISTRY_PREFIX)
}

/**
   * Creates a new [[Registry]] from an [[IRegistryType]].
 
   *
   * @param space The request from which the [[Registry]] should be generated.
   * @param controller The identity of the [[Registry]] creator.
   * @returns An instance of [[Registry]].
   */
export function fromRegistryProperties(
  registryProps: IRegistryType
): IRegistry {
  const registryType = jsonabc.sortObj({
    ...registryProps.details,
  })
  const encodedRegistry = Crypto.encodeObjectAsStr(registryType)
  const registryHash = Crypto.hashStr(encodedRegistry)

  const registryId = getUriForRegistry(encodedRegistry, registryProps.creator)

  const registryDetails = {
    identifier: registryId,
    registryHash: registryHash,
    details: encodedRegistry,
  }
  const registryMeta = {
    digest: registryHash,
    schema: registryProps.schema || null,
    creator: registryProps.creator,
    active: true,
  }
  const registry: IRegistry = {
    identifier: registryId,
    details: registryDetails.details,
    meta: registryMeta,
  }
  verifyRegistryDataStructure(registry)
  return registry
}

export function getAuthorizationIdentifier(
  registry: IRegistry['identifier'],
  authority: DidUri,
  creator: DidUri
): AuthorizationId {
  const api = ConfigService.get('api')

  const scaleEncodedRegistry = api
    .createType<Bytes>('Bytes', uriToIdentifier(registry))
    .toU8a()
  const scaleEncodedAuthority = api
    .createType<AccountId>('AccountId', Did.toChain(authority))
    .toU8a()
  const scaleEncodedCreator = api
    .createType<AccountId>('AccountId', Did.toChain(creator))
    .toU8a()

  const digest = blake2AsHex(
    Uint8Array.from([
      ...scaleEncodedRegistry,
      ...scaleEncodedAuthority,
      ...scaleEncodedCreator,
    ])
  )

  const authorizationId = Identifier.hashToUri(
    digest,
    AUTHORIZATION_IDENT,
    AUTHORIZATION_PREFIX
  )

  return authorizationId
}

/**
 *  Custom Type Guard to determine input being of type ISpace using the SpaceUtils errorCheck.
 *
 * @param input The potentially only partial ISpace.
 * @returns Boolean whether input is of type ISpace.
 */
export function isIRegistry(input: unknown): input is IRegistry {
  try {
    verifyRegistryDataStructure(input as IRegistry)
  } catch (error) {
    return false
  }
  return true
}

/**
 * Checks on the CORD blockchain whether a Registry is anchored.
 *
 * @param registry Registry data.
 */

export async function verifyStored(registry: IRegistry): Promise<void> {
  const api = ConfigService.get('api')
  const identifier = Identifier.uriToIdentifier(registry.identifier)
  const encoded: any = await api.query.registry.registries(identifier)
  if (encoded.isNone)
    throw new SDKErrors.RegistryIdentifierMissingError(
      `Registry with identifier ${identifier} is not registered on chain`
    )
}

/**
 * Checks on the CORD blockchain whether a schema is registered.
 *
 * @param schema Schema data.
 */

export async function verifyAuthorization(
  auth: AuthorizationId
): Promise<void> {
  const api = ConfigService.get('api')
  const identifier = Identifier.uriToIdentifier(auth)
  const encoded: any = await api.query.registry.authorizations(identifier)
  if (encoded.isNone)
    throw new SDKErrors.AuthorizationIdMissingError(
      `Authorization with identifier ${identifier} is not registered on chain`
    )
}

/**
 * Checks on the CORD blockchain whether a Registry is anchored.
 *
 * @param auth authorization URI.
 */

export async function fetchAuthorizationDetailsfromChain(
  auth: AuthorizationId
): Promise<Option<PalletRegistryRegistryAuthorization>> {
  const api = ConfigService.get('api')
  const authorizationId = Identifier.uriToIdentifier(auth)
  const registryAuthoriation: Option<PalletRegistryRegistryAuthorization> =
    await api.query.registry.authorizations(authorizationId)
  if (registryAuthoriation.isNone) {
    throw new SDKErrors.AuthorizationIdentifierMissingError(
      `Registry Authorization with identifier ${authorizationId} is not registered on chain`
    )
  } else {
    return registryAuthoriation
  }
}

export function getAuthorizationDetails(
  encodedEntry: Option<PalletRegistryRegistryAuthorization>
): IRegistryAuthorizationDetails {
  const decodedEntry = encodedEntry.unwrap()
  const authorizationDetails: IRegistryAuthorizationDetails = {
    delegate: Did.fromChain(decodedEntry.delegate),
    schema: DecoderUtils.hexToString(decodedEntry.schema.toString()),
  }
  return authorizationDetails
}

/**
 * Encodes the provided Schema for use in `api.tx.schema.add()`.
 *
 * @param schema The Schema to write on the blockchain.
 * @returns Encoded Schema.
 */
export function toChain(details: IRegistryType): string {
  return Crypto.encodeObjectAsStr(details)
}

export function uriToIdentifier(
  registryId: IRegistry['identifier']
): RegistryId {
  return Identifier.uriToIdentifier(registryId)
}
