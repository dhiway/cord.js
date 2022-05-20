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
} from '@cord.network/api-types'
import { SPACE_PREFIX } from '@cord.network/api-types'
import { DecoderUtils, Identifier } from '@cord.network/utils'
import { ConfigService } from '@cord.network/config'
import { ChainApiConnection } from '@cord.network/network'
import { SpaceDetails } from './Space.js'

const log = ConfigService.LoggingFactory.getLogger('Schema')

/**
 * Generate the extrinsic to create the [[ISpace]].
 *
 * @param space The space to anchor on the chain.
 * @returns The [[SubmittableExtrinsic]] for the `create` call.
 */

export async function create(space: ISpace): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Create tx for 'space'`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.space.create(
    space.controller,
    space.spaceHash,
    space.controllerSignature
  )
  return tx
}

/**
 * TBD
 */
export async function archive(
  spaceId: string,
  controller: string,
  txHash: string,
  txSignature: string
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Revoking a schema with ID ${spaceId}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.space.archive(
    controller,
    Identifier.getIdentifierKey(spaceId, SPACE_PREFIX),
    txHash,
    txSignature
  )
  return tx
}

/**
 * TBD
 */
export async function restore(
  spaceId: string,
  controller: string,
  txHash: string,
  txSignature: string
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Revoking a schema with ID ${spaceId}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.space.restore(
    controller,
    Identifier.getIdentifierKey(spaceId, SPACE_PREFIX),
    txHash,
    txSignature
  )
  return tx
}

/**
 * TBD
 */
export async function authorise(
  spaceId: string,
  controller: string,
  delegates: [string],
  txHash: string,
  txSignature: string
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Adding a delagate to ${spaceId}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.space.authorise(
    controller,
    Identifier.getIdentifierKey(spaceId, SPACE_PREFIX),
    txHash,
    delegates,
    txSignature
  )
  return tx
}

/**
 * TBD
 */
export async function deauthorise(
  spaceId: string,
  controller: string,
  delegates: [string],
  txHash: string,
  txSignature: string
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Removing delagation from ${spaceId}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.space.deauthorise(
    controller,
    Identifier.getIdentifierKey(spaceId, SPACE_PREFIX),
    txHash,
    delegates,
    txSignature
  )
  return tx
}

/**
 * TBD
 */
export async function transfer(
  spaceId: string,
  controller: string,
  transfer: string,
  txHash: string,
  txSignature: string
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Revoking a schema with ID ${spaceId}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.space.transfer(
    controller,
    Identifier.getIdentifierKey(spaceId, SPACE_PREFIX),
    transfer,
    txHash,
    txSignature
  )
  return tx
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
): SpaceDetails | null {
  DecoderUtils.assertCodecIsType(encodedSpace, [
    'Option<PalletSpaceSpacessSpaceDetails>',
  ])
  if (encodedSpace.isSome) {
    const anchoredSpace = encodedSpace.unwrap()
    const space: ISpaceDetails = {
      spaceId: spaceId,
      spaceHash: anchoredSpace.spaceHash.toString(),
      controller: anchoredSpace.controller.toString(),
      archived: anchoredSpace.archived.valueOf(),
    }
    return SpaceDetails.fromSpaceDetails(space)
  }
  return null
}

async function queryRawHash(
  spaceId: string
): Promise<Option<AnchoredSpaceDetails>> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const result = await blockchain.api.query.space.spaces<
    Option<AnchoredSpaceDetails>
  >(spaceId)
  return result
}

async function queryRaw(
  spaceId: string
): Promise<Option<AnchoredSpaceDetails>> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const result = await blockchain.api.query.space.spaces<
    Option<AnchoredSpaceDetails>
  >(spaceId)
  return result
}

/**
 * @param identifier
 * @internal
 */
export async function queryhash(
  space_hash: string
): Promise<SpaceDetails | null> {
  const encoded = await queryRawHash(space_hash)
  return decodeSpace(encoded, space_hash)
}

/**
 * @param identifier
 * @internal
 */
export async function query(space_id: string): Promise<SpaceDetails | null> {
  const spaceId: string = Identifier.getIdentifierKey(space_id, SPACE_PREFIX)
  const encoded = await queryRaw(spaceId)
  return decodeSpace(encoded, spaceId)
}

/**
 * @param id
 * @internal
 */
export async function getOwner(
  spaceId: ISpace['spaceId']
): Promise<IPublicIdentity['address'] | null> {
  const encoded = await queryRaw(spaceId)
  const queriedSpaceAccount = decodeSpace(encoded, spaceId)
  return queriedSpaceAccount!.controller
}
