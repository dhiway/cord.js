/**
 * Content is the core building block of CORD SDK. The content will be transformed to create a [[ContentStream]].
 *
 * A content object has:
 * * contents - details of the content to be transformed;
 * * a [[Schema]] that represents its data structure.
 *
 * @packageDocumentation
 * @module Content
 */

import type {
  IContent,
  CompressedContent,
  CompressedPartialContent,
  PartialContent,
  IPublicIdentity,
} from '@cord.network/types'
import { SDKErrors } from '@cord.network/utils'
import { Schema as ISchema } from '../schema/Schema.js'
import * as SchemaUtils from '../schema/Schema.utils.js'
import * as ContentUtils from './Content.utils.js'

function verifyContent(
  contents: IContent['contents'],
  schema: ISchema['schema']
): boolean {
  return SchemaUtils.verifyContentProperties(contents, schema)
}

export class Content implements IContent {
  /**
   * [STATIC] Instantiates a new [[Content]] transformation from [[IContent]] and [[ISchema]].
   *
   * @param input IContent to create the new stream from.
   * @param schema ISchema['schema'] to verify input's contents.
   * @throws [[ERROR_CONTENT_UNVERIFIABLE]] when input's contents could not be verified with the provided schema.
   *
   * @returns A validated [[Content]] stream.
   */
  public static fromContentType(
    input: IContent,
    schema: ISchema['schema']
  ): Content {
    if (!verifyContent(input.contents, schema)) {
      throw new SDKErrors.ERROR_CONTENT_UNVERIFIABLE()
    }
    return new Content(input)
  }

  /**
   * [STATIC] Builds a [[Content]] stream from [[IContent]] and nested [[ISchema]]s.
   *
   * @param schema A [[Schema]] object that has nested [[Schema]]s.
   * @param nestedSchemas The array of [[Schema]]s, which are used inside the main [[Schema]].
   * @param contents The data inside the [[Content]].
   * @param issuer The owner of the [[Content]].
   * @param holder The holder of the [[Content]].
   *
   * @returns A validated [[Content]] stream.
   */

  public static fromNestedContentStructure(
    schema: ISchema,
    nestedSchemas: Array<ISchema['schema']>,
    contents: IContent['contents'],
    issuer: IPublicIdentity['address'],
    holder?: IPublicIdentity['address']
  ): Content {
    if (
      !SchemaUtils.validateNestedSchemas(schema.schema, nestedSchemas, contents)
    ) {
      throw new SDKErrors.ERROR_NESTED_CONTENT_UNVERIFIABLE()
    }
    return new Content({
      schema: schema.identifier,
      contents: contents,
      issuer: issuer,
      holder: holder,
    })
  }

  /**
   * [STATIC] Builds a new [[Content]] stream from [[ISchema]], IContent['contents'] and issuer's [[IPublicIdentity['address']].
   *
   * @param schema [[ISchema]] from which the Content stream will be built.
   * @param contents IContent['contents'] to be used as the data of the instantiated Content stream.
   * @throws [[ERROR_STREAM_UNVERIFIABLE]] when streamInput's contents could not be verified with the schema of the provided mtypeInput.
   *
   * @returns A validated [[Content]] stream.
   */
  public static fromContentStructure(
    schema: ISchema,
    contents: IContent['contents'],
    issuer: IPublicIdentity['address'],
    holder?: IPublicIdentity['address']
  ): Content {
    if (schema.schema) {
      if (!verifyContent(contents, schema.schema)) {
        throw new SDKErrors.ERROR_CONTENT_UNVERIFIABLE()
      }
    }
    return new Content({
      schema: schema.identifier,
      issuer: issuer,
      holder: holder,
      contents: contents,
    })
  }

  /**
   *  [STATIC] Custom Type Guard to determine input being of type IContent using the ContentUtils errorCheck.
   *
   * @param input The potentially only partial IContent.
   *
   * @returns Boolean whether input is of type IContent.
   */
  static isIContent(input: unknown): input is IContent {
    try {
      ContentUtils.errorCheck(input as IContent)
    } catch (error) {
      return false
    }
    return true
  }

  public schema: IContent['schema']
  public contents: IContent['contents']
  public issuer: IContent['issuer']
  public holder?: IContent['holder']

  public constructor(input: IContent) {
    ContentUtils.errorCheck(input)
    this.schema = input.schema
    this.contents = input.contents
    this.issuer = input.issuer
    this.holder = input.holder || input.issuer
  }

  /**
   * Compresses the [[Content]] stream object to a [[CompressedContent]].
   *
   * @returns An array that contains the same properties of an [[Content]].
   */

  public compress(): CompressedContent {
    return ContentUtils.compress(this)
  }

  /**
   *  Decompresses the [[IContent]] from storage and/or message.
   *
   * @param content A [[CompressedContent]] array that is reverted back into an object.
   * @throws [[ERROR_DECOMPRESSION_ARRAY]] when an [[CompressedContent]] is not an Array or it's length is unequal 3.
   * @returns An [[IContent]] object that has the same properties as the [[CompressedContent]].
   */
  public static decompress(content: CompressedContent): IContent
  /**
   *  Decompresses the Partial [[IContent] from storage and/or message.
   *
   * @param content An [[CompressedPartialContent]] array that is reverted back into an object.
   * @throws [[ERROR_DECOMPRESSION_ARRAY]] when an [[CompressedPartialContent]] is not an Array or it's length is unequal 3.
   * @returns An [[PartialContent]] object that has the same properties as the [[CompressedPartialContent]].
   */
  public static decompress(content: CompressedPartialContent): PartialContent
  public static decompress(
    compressedContent: CompressedContent | CompressedPartialContent
  ): IContent | PartialContent {
    return ContentUtils.decompress(compressedContent)
  }
}
