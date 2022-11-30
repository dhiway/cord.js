/**
 * @packageDocumentation
 * @module Rating
 */

import { Option, Struct, Vec, u8 } from '@polkadot/types'
import type { AccountId, Hash } from '@polkadot/types/interfaces'
import type {
  IRating,
  IRatingDetails,
  IPublicIdentity,
  SubmittableExtrinsic,
} from '@cord.network/types'
import { DecoderUtils, Identifier } from '@cord.network/utils'
import { ConfigService } from '@cord.network/config'
import { ChainApiConnection } from '@cord.network/network'

const log = ConfigService.LoggingFactory.getLogger('Registry')

/**
 * Generate the extrinsic to create the [[IRating]].
 *
 * @param entry The rating entry to anchor on the chain.
 * @returns The [[SubmittableExtrinsic]] for the `create` call.
 */

export async function create(entry: IRating): Promise<SubmittableExtrinsic> {
  const api = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Create tx for 'rating'`)
  const ratingParams = {
    digest: entry.ratingHash,
    controller: entry.controller,
    rating: { rating: entry.details.rating.rating, count: entry.details.rating.count },
    entity: entry.details.entity,
    seller_app: entry.details.seller_app,
    buyer_app: entry.details.buyer_app,
    
  }
  return api.tx.rating.create(ratingParams, entry.controllerSignature)
}

function decodeRating(
  encodedRegistry: Option<AnchoredRatingDetails>,
  ratingId: string
): IRatingDetails | null {
  DecoderUtils.assertCodecIsType(encodedRegistry, [
    'Option<PalletRatingRatingRatingDetails>',
  ])
  if (encodedRegistry.isSome) {
    const anchoredRating = encodedRegistry.unwrap()
    const rating: IRatingDetails = {
      identifier: ratingId,
      ratingHash: anchoredRating.ratingHash.toHex(),
      controller: anchoredRating.controller.toString(),
      details: {
	  rating: {
	      rating: parseInt(anchoredRating.rating.rating.toString()) || 0,
	      count: parseInt(anchoredRating.rating.count.toString()) || 0
	  },
	  entity: DecoderUtils.hexToString(anchoredRating.entity.toString()) || '-',
	  seller_app: DecoderUtils.hexToString(anchoredRating.seller_app.toString()) || '-',
	  buyer_app: DecoderUtils.hexToString(anchoredRating.buyer_app.toString()) || '-',
      }
    }
    return rating;
  }
  return null
}

async function queryRawHash(
  ratingId: string
): Promise<Option<AnchoredRatingDetails>> {
  const api = await ChainApiConnection.getConnectionOrConnect()
  const result = await api.query.rating.registries<Option<AnchoredRatingDetails>>(
    ratingId
  )
  return result
}

async function queryRaw(
  ratingId: string
): Promise<Option<AnchoredRatingDetails>> {
  const api = await ChainApiConnection.getConnectionOrConnect()
  const result = await api.query.rating.registries<Option<AnchoredRatingDetails>>(
    ratingId
  )
  return result
}

/**
 * @param identifier
 * @internal
 */
export async function queryhash(
  rating_hash: string
): Promise<IRatingDetails | null> {
  const encoded = await queryRawHash(rating_hash)
  return decodeRating(encoded, rating_hash)
}

/**
 * @param identifier
 * @internal
 */
export async function query(rating_id: string): Promise<IRatingDetails | null> {
  const ratingId: string = Identifier.getIdentifierKey(rating_id)
  const encoded = await queryRaw(ratingId)
  return decodeRating(encoded, ratingId)
}

/**
 * @param id
 * @internal
 */
export async function getOwner(
  ratingId: IRating['identifier']
): Promise<IPublicIdentity['address'] | null> {
  const encoded = await queryRaw(ratingId)
  const queriedRatingAccount = decodeRating(encoded, ratingId)
  return queriedRatingAccount!.controller
}

export interface AnchoredRatingDetails extends Struct {
  readonly ratingHash: Hash
  readonly controller: AccountId
  readonly rating: {
	    readonly rating: number
	    readonly count: number
  }
  readonly entity: Vec<u8>
  readonly seller_app: Vec<u8>
  readonly buyer_app: Vec<u8>
}
