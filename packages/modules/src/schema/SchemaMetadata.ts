/**
 * @packageDocumentation
 * @module SchemaMetadata
 */

import type { ISchemaMetadata } from '@cord.network/types'
import { SDKErrors } from '@cord.network/utils'
import * as SchemaUtils from './Schema.utils.js'
import { MetadataModel } from './TypeSchema.js'

export class SchemaMetadata implements ISchemaMetadata {
  public id: ISchemaMetadata['id']
  public hash: ISchemaMetadata['hash']
  public metadata: ISchemaMetadata['metadata']

  /**
   *  Instantiates a new SchemaMetadata.
   *
   * @param metadata [[ISchemaMetadata]] that is to be instantiated.
   * @throws [[ERROR_OBJECT_MALFORMED]] when metadata is not verifiable with the MetadataModel.
   * @returns The verified and instantiated [[SchemaMetadata]].
   */
  public constructor(metadata: ISchemaMetadata) {
    if (!SchemaUtils.verifySchema(metadata, MetadataModel)) {
      throw SDKErrors.ERROR_OBJECT_MALFORMED()
    }
    this.metadata = metadata.metadata
    this.id = metadata.id
    this.hash = metadata.hash
  }
}
