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
  ISchemaEnvelope,
  ISchemaDetails,
  CompressedSchemaType,
  SchemaWithoutId,
  SubmittableExtrinsic,
} from '@cord.network/api-types'
import {
  set_status,
  query,
  store,
  add_delegate,
  remove_delegate,
} from './Schema.chain.js'
import * as SchemaUtils from './Schema.utils.js'

// export type Options = {
//   permission?: boolean
//   version?: string | '1.0.0'
//   cid?: string
// }

export class Schema implements ISchemaEnvelope {
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
   * [STATIC] [ASYNC] Revokes a stream stream Also available as an instance method.
   * @param identifier - The ID of the stream stream.
   * @param status - bool value to set the status of the  stream stream.
   * @returns A promise containing the unsigned SubmittableExtrinsic (submittable transaction).
   * @example ```javascript
   * Stream.revoke('0xd8024cdc147c4fa9221cd177', true).then(() => {
   *   // the stream status tx was created, sign and send it!
   *   ChainUtils.signAndSendTx(tx, identity);
   * });
   * ```
   */
  public static async set_status(
    identifier: string,
    creator: string,
    status: boolean
  ): Promise<SubmittableExtrinsic> {
    return set_status(identifier, creator, status)
  }

  /**
   * [STATIC] Clone an already existing [[Schema]]
   * or initializes from an [[ISchemaEnvelope]] object
   * which has non-initialized and non-verified Schema data.
   *
   * @param schemaInput The [[Schema]] which shall be cloned.
   * @returns A copy of the given [[Schema]].
   */
  public static fromSchemaType(schemaInput: ISchemaEnvelope): Schema {
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
    schema: SchemaWithoutId | ISchemaEnvelope['schema'],
    creator: ISchemaEnvelope['creator'],
    version?: ISchemaEnvelope['version'],
    permission?: boolean
  ): Schema {
    const schemaId = SchemaUtils.getIdForSchema(schema, creator)
    const schemaWithId = {
      $id: schemaId,
      ...schema,
    }
    return new Schema({
      id: schemaId,
      hash: SchemaUtils.getHashForSchema(schemaWithId),
      version: version || '1.0.0',
      schema: schemaWithId,
      creator: creator,
      permissioned: permission || false,
    })
  }

  /**
   *  [STATIC] Custom Type Guard to determine input being of type ISchemaEnvelope using the SchemaUtils errorCheck.
   *
   * @param input The potentially only partial ISchemaEnvelope.
   * @returns Boolean whether input is of type ISchemaEnvelope.
   */
  static isISchema(input: unknown): input is ISchemaEnvelope {
    try {
      SchemaUtils.errorCheck(input as ISchemaEnvelope)
    } catch (error) {
      return false
    }
    return true
  }

  public id: ISchemaEnvelope['id']
  public hash: ISchemaEnvelope['hash']
  public version: ISchemaEnvelope['version']
  public creator: ISchemaEnvelope['creator']
  public schema: ISchemaEnvelope['schema']
  public parent?: ISchemaEnvelope['parent'] | undefined
  public permissioned: ISchemaEnvelope['permissioned']

  public constructor(schemaInput: ISchemaEnvelope) {
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
  public async store(cid?: string | undefined): Promise<SubmittableExtrinsic> {
    return store(this, cid)
  }

  public async add_delegate(delegate: string): Promise<SubmittableExtrinsic> {
    return add_delegate(this.schema.$id, this.creator, delegate)
  }

  public async remove_delegate(
    delegate: string
  ): Promise<SubmittableExtrinsic> {
    return remove_delegate(this.id, this.creator, delegate)
  }

  /**
   * [ASYNC] Set status (active/revoked) a journal stream.
   *
   * @param status - bool value to set the status of the  journal stream.
   * @returns A promise containing the unsigned SubmittableExtrinsic (submittable transaction).
   * @example ```javascript
   * stream.set_status(false).then((tx) => {
   *   // the stream entry status tx was created, sign and send it!
   *   ChainUtils.signAndSendTx(tx, identity);
   * });
   * ```
   */
  public async set_status(status: boolean): Promise<SubmittableExtrinsic> {
    return set_status(this.id, this.creator, status)
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
   * Builds a new [[Schema]] instance.
   *
   * @param stream - The base object from which to create the stream.
   * @example ```javascript
   * // create an stream, e.g. to store it on-chain
   * const stream = new Schema(stream);
   * ```
   */

  public id: ISchemaDetails['id']
  public schema_hash: ISchemaDetails['schema_hash']
  public version: ISchemaDetails['version']
  public creator: ISchemaDetails['creator']
  public cid: string | null | undefined
  public parent: ISchemaDetails['parent'] | null | undefined
  public permissioned: ISchemaDetails['permissioned']
  public revoked: ISchemaDetails['revoked']

  public constructor(details: ISchemaDetails) {
    // SchemaUtils.errorCheck(details)
    this.id = details.id
    this.schema_hash = details.schema_hash
    this.version = details.version
    this.cid = details.cid
    this.parent = details.parent
    this.creator = details.creator
    this.permissioned = details.permissioned
    this.revoked = details.revoked
  }
}
