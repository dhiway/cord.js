/**
 * @packageDocumentation
 * @module IStorage
 */

import type { IContent, PartialContent } from './Content'
import type { ISchema } from './Schema'
import type { IPublicIdentity } from './PublicIdentity'
import type { IContentStream } from './ContentStream'

export enum StorageContentType {
  STORE_SCHEMA = 'storage-for-schema',
  STORE_STREAM = 'storage-for-stream',
}

/**
 * - `body` - The body of the message, see [[MessageBody]].
 * - `createdAt` - The timestamp of the message construction.
 * - `controllerAddress` - The public SS58 address of the sender.
 * - `controllerBoxPublicKex` - The public encryption key of the sender.
 */
export interface IStorage {
  content: StoreContent
  createdAt: number
  controllerAddress: IPublicIdentity['address']
  controllerPublicKey: IPublicIdentity['boxPublicKeyAsHex']
}

/**
 * Removes the [[MessageBody]], parent-id and references from the [[Message]] and adds
 * four new fields: message, nonce, hash and signature.
 * - `message` - The encrypted body of the message.
 * - `nonce` - The encryption nonce.
 * - `hash` - The hash of the concatenation of message + nonce + createdAt.
 * - `signature` - The sender's signature on the hash.
 */
export type IEncryptedStorage = Pick<
  IStorage,
  'createdAt' | 'controllerAddress' | 'controllerPublicKey'
> & {
  encryptedStream: string
  nonce: string
  hash: string
  signature: string
}
interface IStorageBase {
  content: any
  type: StorageContentType
}

export interface IStorageForStream extends IStorageBase {
  content: IStorageForStreamContent
  type: StorageContentType.STORE_STREAM
}

export interface IStorageForSchema extends IStorageBase {
  content: IStorageForSchemaContent
  type: StorageContentType.STORE_SCHEMA
}

export interface IStorageForStreamContent {
  content: IContentStream
  prerequisiteStreams?: Array<IContent | PartialContent>
}

export interface IStorageForSchemaContent {
  content: ISchema
}

export type StoreContent = IStorageForStream | IStorageForSchema
