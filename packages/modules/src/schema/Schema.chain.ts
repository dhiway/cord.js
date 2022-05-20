/**
 * @packageDocumentation
 * @module Schema
 */

import { Option, Struct, Vec, u8 } from '@polkadot/types'
import type { AccountId, Hash } from '@polkadot/types/interfaces'
import type {
  ISchema,
  ISchemaDetails,
  IPublicIdentity,
  SubmittableExtrinsic,
} from '@cord.network/api-types'
import { SCHEMA_PREFIX, SPACE_PREFIX } from '@cord.network/api-types'
import { DecoderUtils, Identifier } from '@cord.network/utils'
import { ConfigService } from '@cord.network/config'
import { ChainApiConnection } from '@cord.network/network'
import { SchemaDetails } from './Schema.js'

const log = ConfigService.LoggingFactory.getLogger('Schema')

/**
 * Generate the extrinsic to create the [[ISchema]].
 *
 * @param schema The schema to anchor on the chain.
 * @returns The [[SubmittableExtrinsic]] for the `create` call.
 */

export async function create(
  schema: ISchema,
  spaceid?: string | undefined
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const space_id = spaceid
    ? Identifier.getIdentifierKey(spaceid, SPACE_PREFIX)
    : null
  log.debug(() => `Create tx for 'schema'`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.schema.create(
    schema.controller,
    schema.schemaHash,
    space_id,
    schema.controllerSignature
  )
  return tx
}

/**
 * TBD
 */
export async function revoke(
  schema_id: string,
  controller: string,
  txHash: string,
  txSignature: string,
  spaceid?: string | undefined
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Revoking a schema with ID ${schema_id}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.schema.revoke(
    controller,
    Identifier.getIdentifierKey(schema_id, SCHEMA_PREFIX),
    txHash,
    spaceid,
    txSignature
  )
  return tx
}

/**
 * TBD
 */
export async function authorise(
  schema_id: string,
  controller: string,
  delegates: [string],
  txHash: string,
  txSignature: string,
  spaceid?: string | undefined
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Adding a delagate to ${schema_id}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.schema.authorise(
    controller,
    Identifier.getIdentifierKey(schema_id, SCHEMA_PREFIX),
    txHash,
    delegates,
    spaceid,
    txSignature
  )
  return tx
}

/**
 * TBD
 */
export async function deauthorise(
  schema_id: string,
  controller: string,
  delegates: [string],
  txHash: string,
  txSignature: string,
  spaceid?: string | undefined
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Removing delagation from ${schema_id}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.schema.deauthorise(
    controller,
    Identifier.getIdentifierKey(schema_id, SCHEMA_PREFIX),
    txHash,
    delegates,
    spaceid,
    txSignature
  )
  return tx
}

export interface AnchoredSchemaDetails extends Struct {
  readonly schemaHash: Hash
  readonly controller: AccountId
  readonly spaceId: Option<Vec<u8>>
  readonly revoked: boolean
}

function decodeSchema(
  encodedSchema: Option<AnchoredSchemaDetails>,
  schemaId: string
): SchemaDetails | null {
  DecoderUtils.assertCodecIsType(encodedSchema, [
    'Option<PalletSchemaSchemasSchemaDetails>',
  ])
  if (encodedSchema.isSome) {
    const anchoredSchema = encodedSchema.unwrap()
    const schema: ISchemaDetails = {
      schemaId: schemaId,
      schemaHash: anchoredSchema.schemaHash.toString(),
      controller: anchoredSchema.controller.toString(),
      spaceid:
        DecoderUtils.hexToString(anchoredSchema.spaceId.toString()) || null,
      revoked: anchoredSchema.revoked.valueOf(),
    }
    return SchemaDetails.fromSchemaDetails(schema)
  }
  return null
}

async function queryRawHash(
  schema_hash: string
): Promise<Option<AnchoredSchemaDetails>> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const result = await blockchain.api.query.schema.schemas<
    Option<AnchoredSchemaDetails>
  >(schema_hash)
  return result
}

async function queryRaw(
  schema_id: string
): Promise<Option<AnchoredSchemaDetails>> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const result = await blockchain.api.query.schema.schemas<
    Option<AnchoredSchemaDetails>
  >(schema_id)
  return result
}

/**
 * @param identifier
 * @internal
 */
export async function queryhash(
  schema_hash: string
): Promise<SchemaDetails | null> {
  const encoded = await queryRawHash(schema_hash)
  return decodeSchema(encoded, schema_hash)
}

/**
 * @param identifier
 * @internal
 */
export async function query(schema_id: string): Promise<SchemaDetails | null> {
  const schemaId: string = Identifier.getIdentifierKey(schema_id, SCHEMA_PREFIX)
  const encoded = await queryRaw(schemaId)
  return decodeSchema(encoded, schemaId)
}

/**
 * @param id
 * @internal
 */
export async function getOwner(
  schemaId: ISchema['schemaId']
): Promise<IPublicIdentity['address'] | null> {
  const encoded = await queryRaw(schemaId)
  const queriedSchemaAccount = decodeSchema(encoded, schemaId)
  return queriedSchemaAccount!.controller
}
