/**
 * @packageDocumentation
 * @module IContent
 */
import type { SchemaId } from './Schema'
import type { DidUri } from './DidDocument'

/**
 * The minimal partial stream from which a JSON-LD representation can be built.
 */
export type PartialContent = Partial<IContent> & Pick<IContent, 'schemaId'>

export type IContents = Record<
  string,
  Record<string, unknown> | string | number | boolean
>
export interface IContent {
  schemaId: SchemaId
  contents: IContents
  holder: DidUri
  issuer: DidUri
}
