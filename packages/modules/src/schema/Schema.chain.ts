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
import { SchemaDetails } from './Schema'
import { hexToString } from '../stream/Stream.utils'
import { getIdForSchema } from './Schema.utils'

const log = ConfigService.LoggingFactory.getLogger('Schema')

/**
 * Generate the extrinsic to store the provided [[ISchema]].
 *
 * @param schema The schema to anchor on the chain.
 * @returns The [[SubmittableExtrinsic]] for the `create` call.
 */

export async function store(schema: ISchema): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()

  log.debug(() => `Create tx for 'schema'`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.schema.create(
    schema.schema.$id,
    schema.creator,
    schema.version,
    schema.hash,
    schema.cid,
    schema.permissioned
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
      schema_hash: schema_hash,
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

async function queryRaw(
  schema_hash: string
): Promise<Option<AnchoredSchemaDetails>> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const result = await blockchain.api.query.schema.schemas<
    Option<AnchoredSchemaDetails>
  >(schema_hash)
  return result
}

/**
 * @param identifier
 * @internal
 */
export async function queryhash(
  schema_hash: string
): Promise<SchemaDetails | null> {
  const encoded = await queryRaw(schema_hash)
  return decodeSchema(encoded, schema_hash)
}

/**
 * @param identifier
 * @internal
 */
export async function query(schema: string): Promise<SchemaDetails | null> {
  const schemaId = getIdForSchema(schema)
  const schemaIdQuery = await queryRaw(schemaId)
  const schemaDetails = decodeSchema(schemaIdQuery, schema)
  const encoded = await queryRaw(schemaDetails!.schema_hash)
  return decodeSchema(encoded, schema)
}

/**
 * @param identifier
 * @internal
 */
export async function add_delegate(
  schemaId: string,
  creator: string,
  delegate: string
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Adding a delagate to ${schemaId}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.schema.addDelegate(
    schemaId,
    creator,
    delegate
  )
  return tx
}

/**
 * @param identifier
 * @internal
 */
export async function remove_delegate(
  schemaId: string,
  creator: string,
  delegate: string
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Removing delagation from ${schemaId}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.schema.removeDelegate(
    schemaId,
    creator,
    delegate
  )
  return tx
}

/**
 * @param identifier
 * @internal
 */
export async function set_status(
  streamId: string,
  creator: string,
  status: boolean
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Revoking stream with ID ${streamId}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.schema.set_status(
    streamId,
    creator,
    status
  )
  return tx
}

/**
 * @param id
 * @internal
 */
export async function getOwner(
  id: ISchema['id']
): Promise<IPublicIdentity['address'] | null> {
  const encoded = await queryRaw(id)
  const queriedSchemaAccount = decodeSchema(encoded, id)
  return queriedSchemaAccount!.creator
}
