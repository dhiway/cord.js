/**
 * Schema.
 *
 * * A Schema is a description of the [[Stream]] data structure, based on [JSON Schema](http://json-schema.org/).
 * * Schemas are published and stored by the creator.
 * * Permissioned users can use a Schema to create a new [[Stream]].
 *
 * @packageDocumentation
 * @module Schema
 * @preferred
 */

import type {
  IContent,
  ISchema,
  ISchemaDetails,
  CompressedSchemaType,
  SchemaWithoutId,
  SubmittableExtrinsic,
} from '@cord.network/api-types'
import {
  query,
  create,
  setVersion,
  authorise,
  deauthorise,
  setStatus,
  setPermission,
} from './Schema.chain.js'
import * as SchemaUtils from './Schema.utils.js'

export class Schema implements ISchema {
  /**
   * [STATIC] [ASYNC] Queries the chain for a given stream entry, by `identifier`.
   *
   * @param identifier - The identifier of the stream.
   * @returns A promise containing the [[StreamStream] or null.
   * @example ```javascript
   * Stream.query('0xd8024cdc147c4fa9221cd177').then((stream) => {
   *   // now we can for example revoke `stream`
   * });
   * ```
   */
  public static async query(identifier: string): Promise<SchemaDetails | null> {
    return query(identifier)
  }

  /**
   * [STATIC] Clone an already existing [[Schema]]
   * or initializes from an [[ISchema]] object
   * which has non-initialized and non-verified Schema data.
   *
   * @param schemaInput The [[Schema]] which shall be cloned.
   * @returns A copy of the given [[Schema]].
   */
  public static fromSchemaType(schemaInput: ISchema): Schema {
    return new Schema(schemaInput)
  }

  /**
   *  [STATIC] Creates a new [[Schema]] from an [[ISchemaType]].
   *  _Note_ that you can either supply the schema without the id as
   * [[SchemaWithoutId]] will automatically generate it.
   *
   * @param schema The JSON schema from which the [[Schema]] should be generated.
   * @param creator The public SS58 address of the creator of the [[Schema]].
   * @param schema The identity of the space to which the schema is linked..
   * @returns An instance of [[Schema]].
   */
  public static fromSchemaProperties(
    schema: SchemaWithoutId | ISchema['schema'],
    creator: ISchema['creator'],
    version?: ISchema['version'],
    permission?: boolean
  ): Schema {
    const id = SchemaUtils.getIdForSchema(schema, creator)
    const schemaWithId = {
      $id: id,
      ...schema,
    }
    return new Schema({
      id: id,
      hash: SchemaUtils.getHashForSchema(schemaWithId),
      version: version || '1.0.0',
      schema: schemaWithId,
      creator: creator,
      permissioned: permission || false,
    })
  }

  /**
   *  [STATIC] Custom Type Guard to determine input being of type ISchema using the SchemaUtils errorCheck.
   *
   * @param input The potentially only partial ISchema.
   * @returns Boolean whether input is of type ISchema.
   */
  static isISchema(input: unknown): input is ISchema {
    try {
      SchemaUtils.errorCheck(input as ISchema)
    } catch (error) {
      return false
    }
    return true
  }

  public id: ISchema['id']
  public hash: ISchema['hash']
  public version: ISchema['version']
  public creator: ISchema['creator']
  public schema: ISchema['schema']
  public parent?: ISchema['parent'] | undefined
  public permissioned: ISchema['permissioned']

  public constructor(schemaInput: ISchema) {
    SchemaUtils.errorCheck(schemaInput)
    this.id = schemaInput.id
    this.hash = schemaInput.hash
    this.version = schemaInput.version
    this.creator = schemaInput.creator
    this.schema = schemaInput.schema
    this.parent = schemaInput.parent
    this.permissioned = schemaInput.permissioned
  }

  /**
   * [ASYNC] Stores the [[Schema]] on the blockchain.
   *
   * @param schemaCId The IPFS CID of the schema.
   * @returns A promise of a unsigned SubmittableExtrinsic.
   */
  public async create(cid?: string | undefined): Promise<SubmittableExtrinsic> {
    return create(this, cid)
  }

  public async authorise(delegates: [string]): Promise<SubmittableExtrinsic> {
    return authorise(this.schema.$id, this.creator, delegates)
  }

  public async deauthorise(delegates: [string]): Promise<SubmittableExtrinsic> {
    return deauthorise(this.id, this.creator, delegates)
  }

  public async setStatus(status: boolean): Promise<SubmittableExtrinsic> {
    return setStatus(this.id, this.creator, status)
  }

  public async setPermission(
    permission: boolean
  ): Promise<SubmittableExtrinsic> {
    return setPermission(this.id, this.creator, permission)
  }

  public async setVersion(
    cid?: string | undefined
  ): Promise<SubmittableExtrinsic> {
    return setVersion(this, cid)
  }

  /**
   *  Verifies whether a [[Stream]] follows this [[Schema]] definition.
   *
   * @param stream The [[Stream]] we want to check against.
   * @returns Whether the [[Stream]] and the [[Schema]] align.
   */
  public verifyContentStructure(content: IContent): boolean {
    return SchemaUtils.verifySchema(content.contents, this.schema)
  }

  /**
   * [ASYNC] Check whether the [[Schema]]'s hash has been registered to the blockchain.
   *
   * @returns Whether the [[Schema]] hash is registered to the blockchain.
   */
  public async verifyStored(): Promise<boolean> {
    return SchemaUtils.verifyStored(this)
  }

  /**
   * [ASYNC] Check whether the current owner of [[Schema]] matches the one stored on the blockchain. Returns true if:
   * - The [[Schema]] is registered on-chain
   * - The owner property of the [[Schema]] matches the registered owner
   * If the owner property is not set this method will always return false because the blockchain always stores the
   * submitter as owner.
   *
   * @returns Whether the owner of this [[Schema]] matches the one stored on the blockchain.
   */
  public async verifyOwner(): Promise<boolean> {
    return SchemaUtils.verifyOwner(this)
  }

  /**
   * Compresses an [[Schema]] object.
   *
   * @returns An array that contains the same properties of an [[Schema]].
   */

  public compress(): CompressedSchemaType {
    return SchemaUtils.compress(this)
  }

  /**
   * [STATIC] Builds a [[Schema]] from the decompressed array.
   *
   * @param schema The [[CompressedSchema]] that should get decompressed.
   * @returns A new [[Schema]] object.
   */
  public static decompress(schema: CompressedSchemaType): Schema {
    const decompressedSchemaType = SchemaUtils.decompress(schema)
    return Schema.fromSchemaType(decompressedSchemaType)
  }
}

export class SchemaDetails implements ISchemaDetails {
  public static fromSchemaDetails(input: ISchemaDetails): SchemaDetails {
    return new SchemaDetails(input)
  }
  /**
   * Builds a new [[SchemaDetails]] instance.
   *
   */

  public id: ISchemaDetails['id']
  public hash: ISchemaDetails['hash']
  public version: ISchemaDetails['version']
  public creator: ISchemaDetails['creator']
  public parent: ISchemaDetails['parent'] | null | undefined
  public cid: string | null | undefined
  public permissioned: ISchemaDetails['permissioned']
  public revoked: ISchemaDetails['revoked']

  public constructor(details: ISchemaDetails) {
    this.id = details.id
    this.hash = details.hash
    this.version = details.version
    this.creator = details.creator
    this.parent = details.parent
    this.cid = details.cid
    this.permissioned = details.permissioned
    this.revoked = details.revoked
  }
}
