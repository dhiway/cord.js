/**
 * @packageDocumentation
 * @module IContent
 */
import type { SchemaUri } from './Schema'
import type { DidUri } from './DidDocument'

type ContentPrimitives = string | number | boolean

export interface IContents {
  [key: string]:
    | ContentPrimitives
    | IContents
    | Array<ContentPrimitives | IContents>
}

export interface IContent {
  schemaUri: SchemaUri
  type: string[]
  contents: IContents
  holderUri: DidUri
  issuerUri: DidUri
}
/**
 * The minimal partial stream from which a JSON-LD representation can be built.
 */
export type PartialContent = Partial<IContent> & Pick<IContent, 'schemaUri'>
