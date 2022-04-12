/**
 * @packageDocumentation
 * @module IProduct
 */
import type { ISchema } from './Schema.js'
import type { IPublicIdentity } from './PublicIdentity.js'

export interface IProduct {
  id: string
  hash: string
  cid: string
  store_id?: string
  schema?: ISchema['id']
  price?: number
  rating?: number
  link?: string
  issuer: IPublicIdentity['address']
  status: boolean
}

export type CompressedProduct = [
  IProduct['id'],
  IProduct['hash'],
  IProduct['cid'],
  IProduct['store_id'],
  IProduct['schema'],
  IProduct['price'],
  IProduct['rating'],
  IProduct['link'],
  IProduct['issuer'],
  IProduct['status']
]

export interface IProductDetails {
  id: IProduct['id']
  tx_hash: IProduct['hash']
  cid: string | null
  parent_cid: string | null
  store_id: IProduct['id'] | null
  schema: ISchema['id'] | null
  link: IProduct['id'] | null
  issuer: IPublicIdentity['address']
  price: IProduct['id'] | null
  rating: IProduct['id'] | null
  block: string
  status: boolean
}

export interface IProductLinks {
  id: IProduct['id']
  store_id: IProduct['id']
  issuer: IPublicIdentity['address']
}

export enum ProductCommitOf {
  Create,
  List,
  Update,
  Order,
  Return,
  Rating,
  StatusChange,
}
export interface IProductCommits {
  tx_hash: IProduct['hash']
  cid: string | null
  block: string
  commit: ProductCommitOf
}
