/**
 * @packageDocumentation
 * @module Schema
 */

import { Option, Struct, Vec, u8 } from '@polkadot/types'
import type { AccountId, BlockNumber, Hash } from '@polkadot/types/interfaces'
import type {
  ISchema,
  ISchemaDetails,
  IPublicIdentity,
  SubmittableExtrinsic,
} from '@cord.network/types'
import { DecoderUtils } from '@cord.network/utils'
import { ConfigService } from '@cord.network/config'
import { ChainApiConnection } from '@cord.network/network'
import { SchemaDetails } from './Schema'
import { hexToString } from '../stream/Stream.utils'

const log = ConfigService.LoggingFactory.getLogger('Schema')

/**
 * Generate the extrinsic to store the provided [[ISchema]].
 *
 * @param schema The schema to anchor on the chain.
 * @returns The [[SubmittableExtrinsic]] for the `create` call.
 */

export async function store(
  schema: ISchema,
  cid: string
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()

  log.debug(() => `Create tx for 'schema'`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.schema.create(
    schema.schema.$id,
    schema.creator,
    schema.hash,
    cid,
    schema.permissioned
  )
  return tx
}
export interface AnchoredSchemaDetails extends Struct {
  readonly schema_hash: Hash
  readonly cid: Option<Vec<u8>>
  readonly pcid: Option<Vec<u8>>
  readonly creator: AccountId
  readonly block: BlockNumber
  readonly permissioned: boolean
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
      id: schemaId,
      schema_hash: anchoredSchema.schema_hash.toString(),
      cid: anchoredSchema.cid
        ? hexToString(anchoredSchema.cid.toString())
        : null,
      pcid: anchoredSchema.pcid
        ? hexToString(anchoredSchema.pcid.toString())
        : null,
      creator: anchoredSchema.creator.toString(),
      block: anchoredSchema.block.toString(),
      permissioned: anchoredSchema.permissioned.valueOf(),
      revoked: anchoredSchema.revoked.valueOf(),
    }
    return SchemaDetails.fromSchemaDetails(schema)
  }
  return null
}

async function queryRaw(
  schemaId: string
): Promise<Option<AnchoredSchemaDetails>> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const result = await blockchain.api.query.schema.schemas<
    Option<AnchoredSchemaDetails>
  >(schemaId)
  return result
}

/**
 * @param identifier
 * @internal
 */
export async function query(schemaId: string): Promise<SchemaDetails | null> {
  const encoded = await queryRaw(schemaId)
  return decodeSchema(encoded, schemaId)
}

/**
 * @param identifier
 * @internal
 */
export async function add_delegate(
  schemaId: string,
  creator: string,
  delegate: string,
  quantity: number
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Adding a delagate to ${schemaId}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.schema.addDelegate(
    schemaId,
    quantity,
    creator,
    delegate,
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
