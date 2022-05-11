/**
 * @packageDocumentation
 * @module Product
 */
import { Option, Struct, Vec, u8, u32 } from '@polkadot/types'
import type {
  IProduct,
  IProductDetails,
  SubmittableExtrinsic,
} from '@cord.network/api-types'
import { DecoderUtils } from '@cord.network/utils'
import type { AccountId, BlockNumber, Hash } from '@polkadot/types/interfaces'
import { ConfigService } from '@cord.network/config'
import { ChainApiConnection } from '@cord.network/network'
import { ProductDetails } from './Product.js'
import { hexToString } from './Product.utils.js'

const log = ConfigService.LoggingFactory.getLogger('Mark')

/**
 * Generate the extrinsic to store the provided [[IProduct]].
 *
 * @param stream The stream to anchor on the chain.
 * @returns The [[SubmittableExtrinsic]] for the `create` call.
 */
export async function create(stream: IProduct): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const tx: SubmittableExtrinsic = blockchain.api.tx.product.create(
    stream.id,
    stream.issuer,
    stream.hash,
    stream.cid,
    stream.schema
  )
  return tx
}

/**
 * Generate the extrinsic to store the provided [[IProduct]].
 *
 * @param stream The stream to anchor on the chain.
 * @returns The [[SubmittableExtrinsic]] for the `create` call.
 */
export async function list(stream: IProduct): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const tx: SubmittableExtrinsic = blockchain.api.tx.product.list(
    stream.id,
    stream.issuer,
    stream.hash,
    stream.store_id,
    stream.price,
    stream.cid,
    stream.schema,
    stream.link
  )
  return tx
}

/**
 * Generate the extrinsic to store the provided [[IProduct]].
 *
 * @param stream The stream to anchor on the chain.
 * @returns The [[SubmittableExtrinsic]] for the `create` call.
 */
export async function order(stream: IProduct): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const tx: SubmittableExtrinsic = blockchain.api.tx.product.order(
    stream.id,
    stream.issuer,
    stream.hash,
    stream.store_id,
    stream.price,
    stream.cid,
    stream.schema,
    stream.link
  )
  return tx
}

export async function order_return(
  streamId: string,
  issuer: string
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const tx: SubmittableExtrinsic = blockchain.api.tx.product.order(
    streamId,
    issuer
  )
  return tx
}

export async function order_rating(
  stream: IProduct
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const tx: SubmittableExtrinsic = blockchain.api.tx.product.rating(
    stream.id,
    stream.issuer,
    stream.hash,
    stream.store_id,
    stream.price,
    stream.cid,
    stream.schema,
    stream.link,
    stream.rating
  )
  return tx
}

export interface AnchoredProductDetails extends Struct {
  readonly tx_hash: Hash
  readonly cid: Option<Vec<u8>>
  readonly parent_cid: Option<Vec<u8>>
  readonly store_id: Option<Hash>
  readonly link: Option<Hash>
  readonly schema: Option<Hash>
  readonly issuer: AccountId
  readonly price: u32
  readonly rating: u8
  readonly block: BlockNumber
  readonly status: boolean
}

function decodeProduct(
  encodedProduct: Option<AnchoredProductDetails>,
  streamId: string
): ProductDetails | null {
  DecoderUtils.assertCodecIsType(encodedProduct, [
    'Option<PalletProductProductsProductDetails>',
  ])
  if (encodedProduct.isSome) {
    const anchoredProduct = encodedProduct.unwrap()
    const stream: IProductDetails = {
      id: streamId,
      tx_hash: anchoredProduct.tx_hash.toString(),
      cid: anchoredProduct.cid
        ? hexToString(anchoredProduct.cid.toString())
        : null,
      parent_cid: anchoredProduct.parent_cid
        ? hexToString(anchoredProduct.parent_cid.toString())
        : null,
      store_id: anchoredProduct.store_id.toString() || null,
      schema: anchoredProduct.schema.toString() || null,
      link: anchoredProduct.link.toString() || null,
      issuer: anchoredProduct.issuer.toString(),
      price: anchoredProduct.price.toString() || null,
      rating: anchoredProduct.price.toString() || null,
      block: anchoredProduct.block.toString(),
      status: anchoredProduct.status.valueOf(),
    }

    return ProductDetails.fromProductDetails(stream)
  }
  return null
}

async function queryRaw(
  streamId: string
): Promise<Option<AnchoredProductDetails>> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const result = await blockchain.api.query.stream.streams<
    Option<AnchoredProductDetails>
  >(streamId)
  return result
}

/**
 * Query a stream from the chain given the stream Id.
 *
 * @param streamId The Id of the stream anchored.
 * @returns Either the retrieved [[ProductDetails]] or null.
 */
export async function query(streamId: string): Promise<ProductDetails | null> {
  const encoded = await queryRaw(streamId)
  return decodeProduct(encoded, streamId)
}

/**
 * Generate the extrinsic to set the status of a given stream. The submitter can be the owner of the stream or an authorized delegator of the schema.
 *
 * @param streamId The stream Is.
 * @param issuer The submitter
 * @param status The stream status
 * @returns The [[SubmittableExtrinsic]] for the `set_status` call.
 */
export async function set_status(
  streamId: string,
  issuer: string,
  status: boolean
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Revoking stream with ID ${streamId}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.stream.set_status(
    streamId,
    issuer,
    status
  )
  return tx
}
