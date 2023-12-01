/**
 * @packageDocumentation
 * @module IContent
 */
import type { SchemaUri } from './Schema.js'
import type { DidUri } from './DidDocument.js'
import type { SpaceUri } from './ChainSpace.js'

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
  spaceUri?: SpaceUri
  issuanceDate?: string
  expirationDate?: string
}
/**
 * The minimal partial stream from which a JSON-LD representation can be built.
 */
export type PartialContent = Partial<IContent> & Pick<IContent, 'schemaUri'>
