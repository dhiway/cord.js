/**
 * @packageDocumentation
 * @module Schema
 */

import { Option, Struct, Vec, u8 } from '@polkadot/types'
import type { AccountId, Hash } from '@polkadot/types/interfaces'
import type {
  IRegistryEntry,
  IRegistryEntryDetails,
  IRegistryMetadataEntry,
  IPublicIdentity,
  SubmittableExtrinsic,
} from '@cord.network/types'
import { REGISTRY_PREFIX } from '@cord.network/types'
import { DecoderUtils, Identifier, Crypto } from '@cord.network/utils'
import { ConfigService } from '@cord.network/config'
import { ChainApiConnection } from '@cord.network/network'
import { Identity } from '../identity/Identity.js'

const log = ConfigService.LoggingFactory.getLogger('Registry')

/**
 * Generate the extrinsic to create the [[I]].
 *
 * @param entry The registry entry to anchor on the chain.
 * @returns The [[SubmittableExtrinsic]] for the `create` call.
 */

export async function create(
  entryDetails: IRegistryEntry
): Promise<SubmittableExtrinsic> {
  const api = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Create tx for 'registry'`)
  const entryParams = {
    digest: entryDetails.entryHash,
    controller: entryDetails.entry.controller,
    space: entryDetails.entry.space,
  }
  return api.tx.registry.create(entryParams, entryDetails.controllerSignature)
}

/**
 * Generate the extrinsic to update the provided [[IStream]].
 *
 * @param stream The stream to update on the chain.
 * @returns The [[SubmittableExtrinsic]] for the `update` call.
 */
export async function update(
  entryDetails: IRegistryEntry
): Promise<SubmittableExtrinsic> {
  const entryParams = {
    identifier: Identifier.getIdentifierKey(
      entryDetails.identifier,
      REGISTRY_PREFIX
    ),
    entry: {
      digest: entryDetails.entryHash,
      controller: entryDetails.entry.controller,
      space: entryDetails.entry.space,
    },
  }
  const api = await ChainApiConnection.getConnectionOrConnect()
  return api.tx.registry.update(entryParams, entryDetails.controllerSignature)
}

/**
 * TBD
 */
export async function revoke(
  entryDetails: IRegistryEntry,
  controller: Identity
): Promise<SubmittableExtrinsic> {
  const { txSignature, txHash } = controller.signTx(entryDetails.entryHash)
  const api = await ChainApiConnection.getConnectionOrConnect()
  const entryParams = {
    identifier: Identifier.getIdentifierKey(
      entryDetails.identifier,
      REGISTRY_PREFIX
    ),
    entry: {
      digest: txHash,
      controller: controller.address,
      space: entryDetails.entry.space,
    },
  }
  return api.tx.registry.revoke(entryParams, txSignature)
}

/**
 * TBD
 */
export async function remove(
  entryDetails: IRegistryEntry,
  controller: Identity
): Promise<SubmittableExtrinsic> {
  const { txSignature, txHash } = controller.signTx(entryDetails.entryHash)
  const api = await ChainApiConnection.getConnectionOrConnect()
  const entryParams = {
    identifier: Identifier.getIdentifierKey(
      entryDetails.identifier,
      REGISTRY_PREFIX
    ),
    entry: {
      digest: txHash,
      controller: controller.address,
      space: entryDetails.entry.space,
    },
  }
  return api.tx.registry.remove(entryParams, txSignature)
}

/**
 * TBD
 */
export async function set_metadata(
  entryDetails: IRegistryEntry,
  metadata: string,
  controller: Identity
): Promise<SubmittableExtrinsic> {
  const txHash = Crypto.hashObjectAsHexStr(metadata)
  const txSignature = controller.signStr(txHash)
  const api = await ChainApiConnection.getConnectionOrConnect()
  const entryParams = {
    identifier: Identifier.getIdentifierKey(
      entryDetails.identifier,
      REGISTRY_PREFIX
    ),
    entry: {
      digest: txHash,
      controller: controller.address,
      space: entryDetails.entry.space,
    },
  }
  return api.tx.registry.set_metadata(entryParams, metadata, txSignature)
}

/**
 * TBD
 */
export async function clear_metadata(
  entryDetails: IRegistryEntry,
  controller: Identity
): Promise<SubmittableExtrinsic> {
  const { txSignature, txHash } = controller.signTx(entryDetails.entryHash)

  // const entryHash = Crypto.hashObjectAsHexStr(metadata)
  // const txSignature = controller.signStr(entryHash)
  const api = await ChainApiConnection.getConnectionOrConnect()
  const entryParams = {
    identifier: Identifier.getIdentifierKey(
      entryDetails.identifier,
      REGISTRY_PREFIX
    ),
    entry: {
      digest: txHash,
      controller: controller.address,
      space: entryDetails.entry.space,
    },
  }
  return api.tx.registry.clear_metadata(entryParams, txSignature)
}

export interface AnchoredRegistryDetails extends Struct {
  entry: {
    readonly digest: Hash
    readonly controller: AccountId
    readonly space: Vec<u8>
  }
  readonly revoked: boolean
  readonly metadata: boolean
}

function decodeEntry(
  encodedEntry: Option<AnchoredRegistryDetails>,
  entryId: string
): IRegistryEntryDetails | null {
  DecoderUtils.assertCodecIsType(encodedEntry, [
    'Option<PalletRegistyRegistryEntryDetails>',
  ])
  if (encodedEntry.isSome) {
    const anchoredEntry = encodedEntry.unwrap()
    const entry: IRegistryEntryDetails = {
      identifier: entryId,
      entryHash: anchoredEntry.entry.digest.toHex(),
      controller: anchoredEntry.entry.controller.toString(),
      space: anchoredEntry.entry.space.toString(),
      revoked: anchoredEntry.revoked.valueOf(),
      metadata: anchoredEntry.metadata.valueOf(),
    }
    return entry
  }
  return null
}

export interface AnchoredMetadataDetails extends Struct {
  readonly metadata: Vec<u8>
  readonly digest: Hash
  readonly controller: AccountId
}

function decodeMetadataEntry(
  encodedMetadata: Option<AnchoredMetadataDetails>,
  entryId: string
): IRegistryMetadataEntry | null {
  DecoderUtils.assertCodecIsType(encodedMetadata, [
    'Option<PalletRegistyRegistryMetadataEntry>',
  ])
  if (encodedMetadata.isSome) {
    const anchoredEntry = encodedMetadata.unwrap()
    const metadataDetails: IRegistryMetadataEntry = {
      identifier: entryId,
      metadata: anchoredEntry.metadata.toString(),
      metaHash: anchoredEntry.digest.toHex(),
      controller: anchoredEntry.controller.toString(),
    }
    return metadataDetails
  }
  return null
}

async function queryRaw(
  spaceId: string
): Promise<Option<AnchoredRegistryDetails>> {
  const api = await ChainApiConnection.getConnectionOrConnect()
  const result = await api.query.registry.entries<
    Option<AnchoredRegistryDetails>
  >(spaceId)
  return result
}

async function queryRawMetadata(
  entryId: string
): Promise<Option<AnchoredMetadataDetails>> {
  const api = await ChainApiConnection.getConnectionOrConnect()
  const result = await api.query.registry.metadata<
    Option<AnchoredMetadataDetails>
  >(entryId)
  return result
}

/**
 * @param identifier
 * @internal
 */
export async function query(
  entry_id: string
): Promise<IRegistryEntryDetails | null> {
  const entryId: string = Identifier.getIdentifierKey(entry_id, REGISTRY_PREFIX)
  const encoded = await queryRaw(entryId)
  return decodeEntry(encoded, entryId)
}

/**
 * @param identifier
 * @internal
 */
export async function query_metadata(
  entry_id: string
): Promise<IRegistryMetadataEntry | null> {
  const entryId: string = Identifier.getIdentifierKey(entry_id, REGISTRY_PREFIX)
  const encoded = await queryRawMetadata(entryId)
  return decodeMetadataEntry(encoded, entryId)
}

/**
 * @param id
 * @internal
 */
export async function getOwner(
  entryId: IRegistryEntry['identifier']
): Promise<IPublicIdentity['address'] | null> {
  const encoded = await queryRaw(entryId)
  const queriedSpaceAccount = decodeEntry(encoded, entryId)
  return queriedSpaceAccount!.controller
}
