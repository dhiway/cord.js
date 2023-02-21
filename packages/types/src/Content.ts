/**
 * @packageDocumentation
 * @module IContent
 */
import type { ISchema } from './Schema'
import type { DidUri } from './DidDocument'

/**
 * The minimal partial stream from which a JSON-LD representation can be built.
 */
export type PartialContent = Partial<IContent> & Pick<IContent, 'schema'>

export type IContents = Record<
  string,
  Record<string, unknown> | string | number | boolean
>
export interface IContent {
  schema: ISchema['identifier']
  contents: IContents
  issuer: DidUri
}
