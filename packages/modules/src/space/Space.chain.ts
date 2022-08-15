/**
 * @packageDocumentation
 * @module Schema
 */

import { Option, Struct, Vec, u8 } from '@polkadot/types'
import type { AccountId, Hash } from '@polkadot/types/interfaces'
import type {
  ISpace,
  ISpaceDetails,
  IPublicIdentity,
  SubmittableExtrinsic,
} from '@cord.network/types'
import { DecoderUtils, Identifier } from '@cord.network/utils'
import { ConfigService } from '@cord.network/config'
import { ChainApiConnection } from '@cord.network/network'
import { Identity } from '../identity/Identity.js'

const log = ConfigService.LoggingFactory.getLogger('Registry')

/**
 * Generate the extrinsic to create the [[ISpace]].
 *
 * @param entry The space entry to anchor on the chain.
 * @returns The [[SubmittableExtrinsic]] for the `create` call.
 */

export async function create(entry: ISpace): Promise<SubmittableExtrinsic> {
  const api = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Create tx for 'space'`)
  const spaceParams = {
    digest: entry.spaceHash,
    controller: entry.controller,
    schema: entry.schema,
  }
  return api.tx.space.create(spaceParams, entry.controllerSignature)
}

/**
 * TBD
 */
export async function archive(
  entry: ISpace,
  controller: Identity
): Promise<SubmittableExtrinsic> {
  const { txSignature, txHash } = controller.signTx(entry.spaceHash)
  const api = await ChainApiConnection.getConnectionOrConnect()
  const spaceParams = {
    identifier: Identifier.getIdentifierKey(entry.identifier),
    digest: txHash,
    controller: controller.address,
  }
  return api.tx.space.archive(spaceParams, txSignature)
}

/**
 * TBD
 */
export async function restore(
  entry: ISpace,
  controller: Identity
): Promise<SubmittableExtrinsic> {
  const { txSignature, txHash } = controller.signTx(entry.spaceHash)

  const api = await ChainApiConnection.getConnectionOrConnect()
  const spaceParams = {
    identifier: Identifier.getIdentifierKey(entry.identifier),
    digest: txHash,
    controller: controller.address,
  }
  return api.tx.space.restore(spaceParams, txSignature)
}

/**
 * TBD
 */
export async function delegate(
  entry: ISpace,
  controller: Identity,
  delegates: [string]
): Promise<SubmittableExtrinsic> {
  const { txSignature, txHash } = controller.signTx(entry.spaceHash)

  const api = await ChainApiConnection.getConnectionOrConnect()
  const spaceParams = {
    identifier: Identifier.getIdentifierKey(entry.identifier),
    digest: txHash,
    controller: controller.address,
  }
  return api.tx.space.delegate(spaceParams, delegates, txSignature)
}

/**
 * TBD
 */
export async function undelegate(
  entry: ISpace,
  controller: Identity,
  delegates: [string]
): Promise<SubmittableExtrinsic> {
  const { txSignature, txHash } = controller.signTx(entry.spaceHash)

  const api = await ChainApiConnection.getConnectionOrConnect()
  const spaceParams = {
    identifier: Identifier.getIdentifierKey(entry.identifier),
    digest: txHash,
    controller: controller.address,
  }
  return api.tx.space.undelegate(spaceParams, delegates, txSignature)
}

/**
 * TBD
 */
export async function transfer(
  entry: ISpace,
  controller: Identity,
  transfer: Identity['address']
): Promise<SubmittableExtrinsic> {
  const { txSignature, txHash } = controller.signTx(entry.spaceHash)

  const api = await ChainApiConnection.getConnectionOrConnect()
  const spaceParams = {
    identifier: Identifier.getIdentifierKey(entry.identifier),
    digest: txHash,
    controller: entry.controller,
  }
  return api.tx.space.transfer(spaceParams, transfer, txSignature)
}

export interface AnchoredSpaceDetails extends Struct {
  readonly spaceHash: Hash
  readonly controller: AccountId
  readonly schema: Option<Vec<u8>>
  readonly archived: boolean
  readonly meta: boolean
}

function decodeSpace(
  encodedRegistry: Option<AnchoredSpaceDetails>,
  spaceId: string
): ISpaceDetails | null {
  DecoderUtils.assertCodecIsType(encodedRegistry, [
    'Option<PalletSpaceSpaceSpaceDetails>',
  ])
  if (encodedRegistry.isSome) {
    const anchoredSpace = encodedRegistry.unwrap()
    const space: ISpaceDetails = {
      identifier: spaceId,
      spaceHash: anchoredSpace.spaceHash.toHex(),
      schema: DecoderUtils.hexToString(anchoredSpace.schema.toString()) || null,
      controller: anchoredSpace.controller.toString(),
      archived: anchoredSpace.archived.valueOf(),
      meta: anchoredSpace.meta.valueOf(),
    }
    return space
  }
  return null
}

async function queryRawHash(
  spaceId: string
): Promise<Option<AnchoredSpaceDetails>> {
  const api = await ChainApiConnection.getConnectionOrConnect()
  const result = await api.query.space.registries<Option<AnchoredSpaceDetails>>(
    spaceId
  )
  return result
}

async function queryRaw(
  spaceId: string
): Promise<Option<AnchoredSpaceDetails>> {
  const api = await ChainApiConnection.getConnectionOrConnect()
  const result = await api.query.space.registries<Option<AnchoredSpaceDetails>>(
    spaceId
  )
  return result
}

/**
 * @param identifier
 * @internal
 */
export async function queryhash(
  space_hash: string
): Promise<ISpaceDetails | null> {
  const encoded = await queryRawHash(space_hash)
  return decodeSpace(encoded, space_hash)
}

/**
 * @param identifier
 * @internal
 */
export async function query(space_id: string): Promise<ISpaceDetails | null> {
  const spaceId: string = Identifier.getIdentifierKey(space_id)
  const encoded = await queryRaw(spaceId)
  return decodeSpace(encoded, spaceId)
}

/**
 * @param id
 * @internal
 */
export async function getOwner(
  spaceId: ISpace['identifier']
): Promise<IPublicIdentity['address'] | null> {
  const encoded = await queryRaw(spaceId)
  const queriedSpaceAccount = decodeSpace(encoded, spaceId)
  return queriedSpaceAccount!.controller
}
