/**
 * @packageDocumentation
 * @module IContent
 */
import type { ISchema } from './Schema'
import type { IPublicIdentity } from './PublicIdentity'

/**
 * The minimal partial stream from which a JSON-LD representation can be built.
 */
export type PartialContent = Partial<IContent> & Pick<IContent, 'schema'>
export const HASH_PREFIX: string = 'hash:cord:'

export type IContents = Record<
  string,
  Record<string, unknown> | string | number | boolean
>
export interface IContent {
  schema: ISchema['identifier']
  contents: IContents
  issuer: IPublicIdentity['address']
  holder: IPublicIdentity['address'] | null
}

export type CompressedContent = [
  IContent['schema'],
  IContent['issuer'],
  IContent['holder'] | null,
  IContents
]
