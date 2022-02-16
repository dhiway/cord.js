/**
 * @packageDocumentation
 * @module ISchemaMetadata
 */
export interface ISchemaMetadata {
  metadata: IMetadata
  id: string | null
  hash: string | null
  link: string | null
}

export interface IMetadata {
  name: IMultilangLabel
  description?: IMultilangLabel
  properties: IMetadataProperties
}

export type IMetadataProperties = {
  [key: string]: { name: IMultilangLabel; description?: IMultilangLabel }
}

/**
 * String struct with string keys and a mandatory `default` field.
 * Meant to contain a default label/description and an arbitrary number of translations,
 * where keys represent the use case (language) and values are the labels for this use case.
 */
export interface IMultilangLabel {
  /** Default label in the original language. */
  default: string
  /** An arbitrary number of translations where the key indicates the language. */
  [key: string]: string
}
