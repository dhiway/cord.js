/**
 * A [[Product]] creates a sharable stream. [[Product]]s are **written on the CORD chain** and are **revocable**.
 * The [[Product]] streams can be used as the base for [[Link]] streams.
 *
 * @packageDocumentation
 * @module Product
 * @preferred
 */

import type { SubmittableExtrinsic } from '@polkadot/api/promise/types'
import type {
  // IPublicIdentity,
  IProduct,
  IProductDetails,
  IContentStream,
  CompressedProduct,
} from '@cord.network/api-types'
import {
  set_status,
  query,
  create,
  list,
  order,
  order_return,
  order_rating,
} from './Product.chain.js'
import * as ProductUtils from './Product.utils.js'
// import Storage from '@cord.network/storage'
// import SchemaUtils from '../schema/Schema.utils'

export class Product implements IProduct {
  /**
   * [STATIC] [ASYNC] Queries the chain for a given stream entry, by `identifier`.
   *
   * @param identifier - The identifier of the stream.
   * @returns A promise containing the [[ProductProduct] or null.
   * @example ```javascript
   * Product.query('0xd8024cdc147c4fa9221cd177').then((stream) => {
   *   // now we can for example revoke `stream`
   * });
   * ```
   */
  public static async query(
    identifier: string
  ): Promise<ProductDetails | null> {
    return query(identifier)
  }

  /**
   * [STATIC] [ASYNC] Revokes a stream stream Also available as an instance method.
   * @param identifier - The ID of the stream stream.
   * @param status - bool value to set the status of the  stream stream.
   * @returns A promise containing the unsigned SubmittableExtrinsic (submittable transaction).
   * @example ```javascript
   * Product.revoke('0xd8024cdc147c4fa9221cd177', true).then(() => {
   *   // the stream status tx was created, sign and send it!
   *   ChainUtils.signAndSendTx(tx, identity);
   * });
   * ```
   */
  public static async set_status(
    identifier: string,
    creator: string,
    status: boolean
  ): Promise<SubmittableExtrinsic> {
    return set_status(identifier, creator, status)
  }

  /**
   * [STATIC] Builds an instance of [[ProductProduct]], from a simple object with the same properties.
   * Used for deserialization.
   *
   * @param input - The base object from which to create the stream stream.
   * @returns A new [[Product]] object.
   * @example ```javascript
   * // create a Product stream object, so we can call methods on it (`serialized` is a serialized Product object )
   * Product.fromProduct(JSON.parse(serialized));
   * ```
   */
  public static fromProduct(input: IProduct): Product {
    return new Product(input)
  }

  /**
   * [STATIC] Builds a new instance of an [[Product]], from a complete set of input required for an stream.
   *
   * @param content - The base request for stream.
   * @param link - ID of the [[Space]] this [[Journal]] is linked to.
   * @param creatorPublicIdentity - Public Identity of the creator, used to anchor the underlying stream.
   * @returns A new [[Product]] object.
   * @example ```javascript
   * // create a complete new stream from the `ProductProduct` and all other needed properties
   * Product.fromContentAndPublicIdentity(request, issuerPublicIdentity);
   * ```
   */
  public static fromProductContentAnchor(
    content: IContentStream,
    cid: string,
    store_id?: string,
    price?: number,
    rating?: number
  ): Product {
    return new Product({
      id: ProductUtils.getIdentifier(content.contentId),
      hash: content.contentHash,
      cid: cid,
      store_id: store_id,
      schema: content.content.schemaId,
      price: price,
      rating: rating,
      link: content.link,
      creator: content.creator,
      status: true,
    })
  }

  /**
   *  [STATIC] Custom Type Guard to determine input being of type IProduct using the ProductUtils errorCheck.
   *
   * @param input The potentially only partial IProduct.
   * @returns Boolean whether input is of type IProduct.
   */
  public static isIProduct(input: unknown): input is IProduct {
    try {
      ProductUtils.errorCheck(input as IProduct)
    } catch (error) {
      return false
    }
    return true
  }

  public id: IProduct['id']
  public hash: IProduct['hash']
  public cid: IProduct['cid']
  public store_id?: string | undefined
  public schema: IProduct['schema']
  public price?: number | undefined
  public rating?: number | undefined
  public link: IProduct['link']
  public creator: IProduct['creator']
  public status: IProduct['status']

  /**
   * Builds a new [[Product]] instance.
   *
   * @param stream - The base object from which to create the stream.
   * @example ```javascript
   * // create an stream, e.g. to store it on-chain
   * const stream = new Product(stream);
   * ```
   */
  public constructor(stream: IProduct) {
    ProductUtils.errorCheck(stream)
    this.id = stream.id
    this.hash = stream.hash
    this.cid = stream.cid
    this.store_id = stream.store_id
    this.schema = stream.schema
    this.price = stream.price
    this.rating = stream.rating
    this.link = stream.link
    this.creator = stream.creator
    this.status = stream.status
  }

  /**
   * [ASYNC] Stores the stream on chain.
   * @param cid - The IPFS CID of the stream stream.
   * @returns A promise containing the unsigned SubmittableExtrinsic (submittable transaction).
   * @example ```javascript
   * // Use `store` to store an stream on chain, and to create an `ProductedProduct` upon success:
   * stream.store(cid).then(() => {
   *   // the stream store tx was successfully prepared, so now we can sign and send it and subsequently create an `ProductedProduct`.
   * });
   * ```
   */
  public async create(): Promise<SubmittableExtrinsic> {
    return create(this)
  }

  public async list(): Promise<SubmittableExtrinsic> {
    return list(this)
  }

  public async order(): Promise<SubmittableExtrinsic> {
    return order(this)
  }

  public async order_return(): Promise<SubmittableExtrinsic> {
    return order_return(this.id, this.creator)
  }

  public async order_rating(): Promise<SubmittableExtrinsic> {
    return order_rating(this)
  }

  /**
   * [ASYNC] Set status (active/revoked) a journal stream.
   *
   * @param status - bool value to set the status of the  journal stream.
   * @returns A promise containing the unsigned SubmittableExtrinsic (submittable transaction).
   * @example ```javascript
   * stream.set_status(false).then((tx) => {
   *   // the stream entry status tx was created, sign and send it!
   *   ChainUtils.signAndSendTx(tx, identity);
   * });
   * ```
   */
  public async set_status(status: boolean): Promise<SubmittableExtrinsic> {
    return set_status(this.id, this.creator, status)
  }

  /**
   * [STATIC] [ASYNC] Queries an stream from the chain and checks its validity.
   *
   * @param stream - The Product to verify.
   * @param identifier - The ID that corresponds to the stream to check. Defaults to the streamHash for the stream onto which "verify" is called.
   * @returns A promise containing whether the stream is valid.
   * @example ```javascript
   * Product.checkValidity(stream).then((isVerified) => {
   *   // `isVerified` is true if the stream is verified, false otherwise
   * });
   * ```
   */
  public static async checkValidity(
    stream: IProduct,
    identifier: string = stream.id
  ): Promise<boolean> {
    // Query stream by stream identifier. null if no stream is found on-chain for this hash
    const chainProduct: ProductDetails | null = await Product.query(identifier)
    return !!(
      chainProduct !== null &&
      chainProduct.creator === stream.creator &&
      chainProduct.tx_hash === stream.hash &&
      chainProduct.status
    )
  }

  public async checkValidity(): Promise<boolean> {
    return Product.checkValidity(this)
  }

  /**
   * Compresses an [[Product]] object.
   *
   * @returns An array that contains the same properties of an [[Product]].
   */
  public compress(): CompressedProduct {
    return ProductUtils.compress(this)
  }

  /**
   * [STATIC] Builds an [[Product]] from the compressed array.
   *
   * @param stream The [[CompressedProduct]] that should get decompressed.
   * @returns A new [[Product]] object.
   */
  public static decompress(stream: CompressedProduct): Product {
    const decompressedProduct = ProductUtils.decompress(stream)
    return Product.fromProduct(decompressedProduct)
  }
}

export class ProductDetails implements IProductDetails {
  public static fromProductDetails(input: IProductDetails): ProductDetails {
    return new ProductDetails(input)
  }
  /**
   * Builds a new [[Product]] instance.
   *
   * @param stream - The base object from which to create the stream.
   * @example ```javascript
   * // create an stream, e.g. to store it on-chain
   * const stream = new Product(stream);
   * ```
   */

  public id: IProductDetails['id']
  public tx_hash: IProductDetails['tx_hash']
  public cid: IProductDetails['cid']
  public store_id: IProductDetails['store_id']
  public parent_cid: IProductDetails['parent_cid']
  public schema: IProductDetails['schema']
  public link: IProductDetails['link']
  public creator: IProductDetails['creator']
  public price: IProductDetails['price']
  public rating: IProductDetails['rating']
  public block: IProductDetails['block']
  public status: IProductDetails['status']

  public constructor(details: IProductDetails) {
    // ProductUtils.errorCheck(details)
    this.id = details.id
    this.tx_hash = details.tx_hash
    this.cid = details.cid
    this.parent_cid = details.parent_cid
    this.store_id = details.store_id
    this.schema = details.schema
    this.link = details.link
    this.creator = details.creator
    this.price = details.price
    this.rating = details.rating
    this.block = details.block
    this.status = details.status
  }
}
