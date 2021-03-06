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
import { SPACE_PREFIX } from '@cord.network/types'
import { DecoderUtils, Identifier } from '@cord.network/utils'
import { ConfigService } from '@cord.network/config'
import { ChainApiConnection } from '@cord.network/network'
import { Identity } from '../identity/Identity.js'

const log = ConfigService.LoggingFactory.getLogger('Schema')

/**
 * Generate the extrinsic to create the [[ISpace]].
 *
 * @param space The space to anchor on the chain.
 * @returns The [[SubmittableExtrinsic]] for the `create` call.
 */

export async function create(space: ISpace): Promise<SubmittableExtrinsic> {
  const api = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Create tx for 'space'`)
  const spaceParams = { digest: space.spaceHash, controller: space.controller }
  return api.tx.space.create(spaceParams, space.controllerSignature)
}

/**
 * TBD
 */
export async function archive(
  space: ISpace,
  controller: Identity
): Promise<SubmittableExtrinsic> {
  const { txSignature, txHash } = controller.signTx(space.spaceHash)
  const api = await ChainApiConnection.getConnectionOrConnect()
  const spaceParams = {
    identifier: Identifier.getIdentifierKey(space.identifier, SPACE_PREFIX),
    digest: txHash,
    controller: controller.address,
  }
  return api.tx.space.archive(spaceParams, txSignature)
}

/**
 * TBD
 */
export async function restore(
  space: ISpace,
  controller: Identity
): Promise<SubmittableExtrinsic> {
  const { txSignature, txHash } = controller.signTx(space.spaceHash)

  const api = await ChainApiConnection.getConnectionOrConnect()
  const spaceParams = {
    identifier: Identifier.getIdentifierKey(space.identifier, SPACE_PREFIX),
    digest: txHash,
    controller: controller.address,
  }
  return api.tx.space.restore(spaceParams, txSignature)
}

/**
 * TBD
 */
export async function authorise(
  space: ISpace,
  controller: Identity,
  delegates: [string]
): Promise<SubmittableExtrinsic> {
  const { txSignature, txHash } = controller.signTx(space.spaceHash)

  const api = await ChainApiConnection.getConnectionOrConnect()
  const spaceParams = {
    identifier: Identifier.getIdentifierKey(space.identifier, SPACE_PREFIX),
    digest: txHash,
    controller: controller.address,
  }
  return api.tx.space.authorise(spaceParams, delegates, txSignature)
}

/**
 * TBD
 */
export async function deauthorise(
  space: ISpace,
  controller: Identity,
  delegates: [string]
): Promise<SubmittableExtrinsic> {
  const { txSignature, txHash } = controller.signTx(space.spaceHash)

  const api = await ChainApiConnection.getConnectionOrConnect()
  const spaceParams = {
    identifier: Identifier.getIdentifierKey(space.identifier, SPACE_PREFIX),
    digest: txHash,
    controller: controller.address,
  }
  return api.tx.space.deauthorise(spaceParams, delegates, txSignature)
}

/**
 * TBD
 */
export async function transfer(
  space: ISpace,
  controller: Identity,
  transfer: Identity['address']
): Promise<SubmittableExtrinsic> {
  const { txSignature, txHash } = controller.signTx(space.spaceHash)

  const api = await ChainApiConnection.getConnectionOrConnect()
  const spaceParams = {
    identifier: Identifier.getIdentifierKey(space.identifier, SPACE_PREFIX),
    digest: txHash,
    controller: space.controller,
  }
  return api.tx.space.transfer(spaceParams, transfer, txSignature)
}

export interface AnchoredSpaceDetails extends Struct {
  readonly spaceHash: Hash
  readonly controller: AccountId
  readonly spaceId: Option<Vec<u8>>
  readonly archived: boolean
}

function decodeSpace(
  encodedSpace: Option<AnchoredSpaceDetails>,
  spaceId: string
): ISpaceDetails | null {
  DecoderUtils.assertCodecIsType(encodedSpace, [
    'Option<PalletSpaceSpacessSpaceDetails>',
  ])
  if (encodedSpace.isSome) {
    const anchoredSpace = encodedSpace.unwrap()
    const space: ISpaceDetails = {
      identifier: spaceId,
      spaceHash: anchoredSpace.spaceHash.toHex(),
      controller: anchoredSpace.controller.toString(),
      archived: anchoredSpace.archived.valueOf(),
    }
    return space
  }
  return null
}

async function queryRawHash(
  spaceId: string
): Promise<Option<AnchoredSpaceDetails>> {
  const api = await ChainApiConnection.getConnectionOrConnect()
  const result = await api.query.space.spaces<Option<AnchoredSpaceDetails>>(
    spaceId
  )
  return result
}

async function queryRaw(
  spaceId: string
): Promise<Option<AnchoredSpaceDetails>> {
  const api = await ChainApiConnection.getConnectionOrConnect()
  const result = await api.query.space.spaces<Option<AnchoredSpaceDetails>>(
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
  const spaceId: string = Identifier.getIdentifierKey(space_id, SPACE_PREFIX)
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
