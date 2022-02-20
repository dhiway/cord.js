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
    getSchemaId(schema.id),
    schema.creator,
    schema.version,
    schema.hash,
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

export async function setVersion(
  schema: ISchema,
  cid?: string | undefined
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Create tx for 'schema' version update`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.schema.version(
    getSchemaId(schema.id),
    schema.creator,
    schema.version,
    schema.hash,
    cid
  )
  return tx
}

/**
 * TBD
 */
export async function setStatus(
  id: string,
  creator: string,
  status: boolean
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Revoking a schema with ID ${id}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.schema.status(
    getSchemaId(id),
    creator,
    status
  )
  return tx
}

/**
 * TBD
 */
export async function setPermission(
  id: string,
  creator: string,
  permission: boolean
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Revoking a schema with ID ${id}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.schema.permission(
    getSchemaId(id),
    creator,
    permission
  )
  return tx
}

/**
 * TBD
 */
export async function authorise(
  id: string,
  creator: string,
  delegates: [string]
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Adding a delagate to ${id}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.schema.authorise(
    getSchemaId(id),
    creator,
    delegates
  )
  return tx
}

/**
 * TBD
 */
export async function deauthorise(
  id: string,
  creator: string,
  delegates: [string]
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Removing delagation from ${id}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.schema.deauthorise(
    getSchemaId(id),
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
      id: anchoredSchema.id.toString(),
      hash: schema_hash,
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

async function queryRawId(schema_id: string): Promise<ISchemaDetails['hash']> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const result = await blockchain.api.query.schema.id<Option<Hash>>(schema_id)
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
  const id: string = getSchemaId(schema_id)
  const hash = await queryRawId(id)
  const encoded = await queryRawHash(hash)
  return decodeSchema(encoded, hash)
}

/**
 * @param id
 * @internal
 */
export async function getOwner(
  hash: ISchema['hash']
): Promise<IPublicIdentity['address'] | null> {
  const encoded = await queryRawHash(hash)
  const queriedSchemaAccount = decodeSchema(encoded, hash)
  return queriedSchemaAccount!.creator
}
