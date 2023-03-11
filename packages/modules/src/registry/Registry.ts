/**
 * Registry.
 *
 * @packageDocumentation
 * @module Registry
 * @preferred
 */

import type { IRegistry, IRegistryType } from '@cord.network/types'
import {
  Identifier,
  Crypto,
  SDKErrors,
  jsonabc,
  DataUtils,
} from '@cord.network/utils'
import { REGISTRY_IDENT, REGISTRY_PREFIX } from '@cord.network/types'
import { ConfigService } from '@cord.network/config'

/**
 *  Checks whether the input meets all the required criteria of an [[IRegistry]] object.
 *  Throws on invalid input.
 *
 * @param input The potentially only partial [[IRegistry]].
 *
 */
export function verifyRegistryDataStructure(input: IRegistry): void {
  if (!input.meta.schema) {
    throw new SDKErrors.SchemaMissingError()
  }
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
  const registryId = Identifier.hashToUri(
    registryHash,
    REGISTRY_IDENT,
    REGISTRY_PREFIX
  )
  const registryDetails = {
    identifier: registryId,
    registryHash: registryHash,
    details: encodedRegistry,
  }
  const registryMeta = {
    digest: registryHash,
    schema: registryProps.schema,
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
 * Checks on the CORD blockchain whether a schema is registered.
 *
 * @param schema Schema data.
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
 * Encodes the provided Schema for use in `api.tx.schema.add()`.
 *
 * @param schema The Schema to write on the blockchain.
 * @returns Encoded Schema.
 */
export function toChain(details: IRegistryType): string {
  return Crypto.encodeObjectAsStr(details)
}
