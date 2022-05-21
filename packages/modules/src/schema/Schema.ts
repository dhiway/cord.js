/**
 * Schema.
 *
 * * A Schema is a description of the [[Stream]] data structure, based on [JSON Schema](http://json-schema.org/).
 * * Schemas are published and stored by the issuer.
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
  SubmittableExtrinsic,
  ISpace,
} from '@cord.network/types'
import { Identifier, Crypto, UUID } from '@cord.network/utils'
import {
  query,
  create,
  authorise,
  deauthorise,
  revoke,
} from './Schema.chain.js'
import * as SchemaUtils from './Schema.utils.js'
import { SCHEMA_IDENTIFIER, SCHEMA_PREFIX } from '@cord.network/types'
import { Identity } from '../identity/Identity.js'

export class Schema implements ISchema {
  /**
   * [STATIC] [ASYNC] Queries the chain for a given schema entry, by `identifier`.
   *
   * @param identifier - The identifier of the schema.
   * @returns A promise containing the [[SchemaDetails] or null.
   */
  public static async query(identifier: string): Promise<SchemaDetails | null> {
    return query(Identifier.getIdentifierKey(identifier, SCHEMA_PREFIX))
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
   *
   * @param schema The JSON schema from which the [[Schema]] should be generated.
   * @param issuer The public SS58 address of the issuer of the [[Schema]].
   * @param schema The identity of the space to which the schema is linked..
   * @returns An instance of [[Schema]].
   */
  public static fromSchemaProperties(
    schema: ISchema['schema'],
    controller: Identity,
    spaceId?: string | null
  ): Schema {
    const schemaHash = SchemaUtils.getHashForSchema(schema)
    const schemaIdentifier = Identifier.getIdentifier(
      schemaHash,
      SCHEMA_IDENTIFIER,
      SCHEMA_PREFIX
    )
    return new Schema({
      identifier: schemaIdentifier,
      schemaHash: schemaHash,
      schema: {
        ...schema,
        $id: schemaIdentifier,
      },
      space: spaceId,
      controller: controller.address,
      controllerSignature: controller.signStr(schemaHash),
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

  public identifier: ISchema['identifier']
  public schemaHash: ISchema['schemaHash']
  public controller: ISchema['controller']
  public controllerSignature: string
  public space: ISpace['identifier'] | null | undefined
  public schema: ISchema['schema']

  public constructor(schemaInput: ISchema) {
    SchemaUtils.errorCheck(schemaInput)
    this.identifier = schemaInput.identifier
    this.schemaHash = schemaInput.schemaHash
    this.space = schemaInput.space
    this.controller = schemaInput.controller
    this.controllerSignature = schemaInput.controllerSignature
    this.schema = schemaInput.schema
  }

  /**
   * [ASYNC] Stores the [[Schema]] on the blockchain.
   *
   * @param schemaCId The IPFS CID of the schema.
   * @returns A promise of a unsigned SubmittableExtrinsic.
   */
  public async create(): Promise<SubmittableExtrinsic> {
    return create(this)
  }

  public async authorise(
    controller: Identity,
    delegates: [string]
  ): Promise<SubmittableExtrinsic> {
    const txId = UUID.generate()
    const schemaHash = this.schemaHash
    const hashVal = { txId, delegates, schemaHash }
    const txHash = Crypto.hashObjectAsStr(hashVal)
    const txSignature = controller.signStr(txHash)
    return authorise(
      this.schema.$id,
      controller.address,
      delegates,
      txHash,
      txSignature,
      this.space
    )
  }

  public async deauthorise(
    controller: Identity,
    delegates: [string],
    spaceid?: string | undefined
  ): Promise<SubmittableExtrinsic> {
    const txId = UUID.generate()
    const schemaHash = this.schemaHash
    const hashVal = { txId, delegates, schemaHash }
    const txHash = Crypto.hashObjectAsStr(hashVal)
    const txSignature = controller.signStr(txHash)
    return deauthorise(
      this.schema.$id,
      controller.address,
      delegates,
      txHash,
      txSignature,
      this.space
    )
  }

  public async revoke(controller: Identity): Promise<SubmittableExtrinsic> {
    const txId = UUID.generate()
    const schemaHash = this.schemaHash
    const hashVal = { txId, schemaHash }
    const txHash = Crypto.hashObjectAsStr(hashVal)
    const txSignature = controller.signStr(txHash)
    return revoke(
      this.identifier,
      controller.address,
      txHash,
      txSignature,
      this.space
    )
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

  public identifier: ISchemaDetails['identifier']
  public schemaHash: ISchemaDetails['schemaHash']
  public controller: ISchemaDetails['controller']
  public space: string | null | undefined
  public revoked: ISchemaDetails['revoked']

  public constructor(details: ISchemaDetails) {
    this.identifier = details.identifier
    this.schemaHash = details.schemaHash
    this.controller = details.controller
    this.space = details.space
    this.revoked = details.revoked
  }
}
