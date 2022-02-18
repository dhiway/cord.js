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
import { DecoderUtils } from '@cord.network/utils'
import { ConfigService } from '@cord.network/config'
import { ChainApiConnection } from '@cord.network/network'
import { SchemaDetails } from './Schema.js'
import { hexToString } from '../stream/Stream.utils.js'
import { getSchemaId } from './Schema.utils.js'

const log = ConfigService.LoggingFactory.getLogger('Schema')

/**
 * Generate the extrinsic to create the provided [[ISchema]].
 *
 * @param schema The schema to anchor on the chain.
 * @returns The [[SubmittableExtrinsic]] for the `create` call.
 */

export async function create(
  schema: ISchema,
  cid?: string | undefined
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Create tx for 'schema'`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.schema.create(
    getSchemaId(schema.schemaId),
    schema.creator,
    schema.version,
    schema.schemaHash,
    cid,
    schema.permissioned
  )
  return tx
}

/**
 * Generate the extrinsic to update the version of the provided [[ISchema]].
 *
 * @param schema The schema to update the version on the chain.
 * @returns The [[SubmittableExtrinsic]] for the `version` call.
 */

export async function version(
  schema: ISchema,
  cid?: string | undefined
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Create tx for 'schema' version update`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.schema.version(
    getSchemaId(schema.schemaId),
    schema.creator,
    schema.version,
    schema.schemaHash,
    cid
  )
  return tx
}

/**
 * TBD
 */
export async function status(
  schemaId: string,
  creator: string,
  status: boolean
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Revoking a schema with ID ${schemaId}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.schema.status(
    getSchemaId(schemaId),
    creator,
    status
  )
  return tx
}

/**
 * TBD
 */
export async function permission(
  schemaId: string,
  creator: string,
  permission: boolean
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Revoking a schema with ID ${schemaId}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.schema.permission(
    getSchemaId(schemaId),
    creator,
    permission
  )
  return tx
}

/**
 * TBD
 */
export async function authorise(
  schemaId: string,
  creator: string,
  delegates: [string]
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Adding a delagate to ${schemaId}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.schema.authorise(
    getSchemaId(schemaId),
    creator,
    delegates
  )
  return tx
}

/**
 * TBD
 */
export async function deauthorise(
  schemaId: string,
  creator: string,
  delegates: [string]
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Removing delagation from ${schemaId}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.schema.deauthorise(
    getSchemaId(schemaId),
    creator,
    delegates
  )
  return tx
}

export interface AnchoredSchemaDetails extends Struct {
  readonly version: Vec<u8>
  readonly id: Hash
  readonly creator: AccountId
  readonly cid: Option<Vec<u8>>
  readonly parent: Option<Hash>
  readonly permissioned: boolean
  readonly revoked: boolean
}

function decodeSchema(
  encodedSchema: Option<AnchoredSchemaDetails>,
  schema_hash: string
): SchemaDetails | null {
  DecoderUtils.assertCodecIsType(encodedSchema, [
    'Option<PalletSchemaSchemasSchemaDetails>',
  ])
  if (encodedSchema.isSome) {
    const anchoredSchema = encodedSchema.unwrap()
    const schema: ISchemaDetails = {
      schemaId: anchoredSchema.id.toString(),
      schemaHash: schema_hash,
      version: anchoredSchema.version.toString(),
      cid: anchoredSchema.cid
        ? hexToString(anchoredSchema.cid.toString())
        : null,
      parent: anchoredSchema.parent
        ? hexToString(anchoredSchema.parent.toString())
        : null,
      creator: anchoredSchema.creator.toString(),
      permissioned: anchoredSchema.permissioned.valueOf(),
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

async function queryRawId(
  schema_id: string
): Promise<ISchemaDetails['schemaHash']> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const result = await blockchain.api.query.schema.schemaId<Option<Hash>>(
    schema_id
  )
  return result.toString()
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
  const schemaId: string = getSchemaId(schema_id)
  const schemaHash = await queryRawId(schemaId)
  const encoded = await queryRawHash(schemaHash)
  return decodeSchema(encoded, schemaHash)
}

/**
 * @param id
 * @internal
 */
export async function getOwner(
  hash: ISchema['schemaHash']
): Promise<IPublicIdentity['address'] | null> {
  const encoded = await queryRawHash(hash)
  const queriedSchemaAccount = decodeSchema(encoded, hash)
  return queriedSchemaAccount!.creator
}
