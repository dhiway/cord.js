/**
 * @packageDocumentation
 * @module Stream
 */
import { Option, Struct, Vec, u8 } from '@polkadot/types'
import type {
  IStream,
  IStreamDetails,
  IPublicIdentity,
  SubmittableExtrinsic,
} from '@cord.network/api-types'
import { DecoderUtils, Identifier } from '@cord.network/utils'
import type { AccountId, Hash } from '@polkadot/types/interfaces'
import { ConfigService } from '@cord.network/config'
import { ChainApiConnection } from '@cord.network/network'
import { StreamDetails } from './Stream.js'
import { SCHEMA_PREFIX, STREAM_PREFIX } from '@cord.network/api-types'

const log = ConfigService.LoggingFactory.getLogger('Mark')

/**
 * Generate the extrinsic to store the provided [[IStream]].
 *
 * @param stream The stream to anchor on the chain.
 * @returns The [[SubmittableExtrinsic]] for the `create` call.
 */
export async function create(stream: IStream): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const tx: SubmittableExtrinsic = blockchain.api.tx.stream.create(
    Identifier.getIdentifierKey(stream.streamId, STREAM_PREFIX),
    stream.creator,
    stream.streamHash,
    stream.holder,
    Identifier.getIdentifierKey(stream.schemaId, SCHEMA_PREFIX),
    stream.cid,
    Identifier.getIdentifierKey(stream.linkId, STREAM_PREFIX)
  )
  return tx
}

/**
 * Generate the extrinsic to update the provided [[IStream]].
 *
 * @param stream The stream to update on the chain.
 * @returns The [[SubmittableExtrinsic]] for the `create` call.
 */
export async function update(stream: IStream): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const tx: SubmittableExtrinsic = blockchain.api.tx.stream.update(
    Identifier.getIdentifierKey(stream.streamId, STREAM_PREFIX),
    stream.creator,
    stream.streamHash,
    stream.cid
  )
  return tx
}

/**
 * Generate the extrinsic to set the status of a given stream. The submitter can be the owner of the stream or an authorized delegator of the schema.
 *
 * @param streamId The stream Is.
 * @param creator The submitter
 * @param status The stream status
 * @returns The [[SubmittableExtrinsic]] for the `set_status` call.
 */
export async function setStatus(
  streamId: string,
  creator: string,
  status: boolean
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Revoking stream with ID ${streamId}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.stream.setStatus(
    streamId,
    creator,
    status
  )
  return tx
}

export interface AnchoredStreamDetails extends Struct {
  readonly streamId: Vec<u8>
  readonly creator: AccountId
  readonly holder: Option<AccountId>
  readonly schema: Option<Hash>
  readonly cid: Option<Vec<u8>>
  readonly parent: Option<Hash>
  readonly link: Option<Vec<u8>>
  readonly revoked: boolean
}

function decodeStream(
  encodedStream: Option<AnchoredStreamDetails>,
  streamHash: string
): StreamDetails | null {
  DecoderUtils.assertCodecIsType(encodedStream, [
    'Option<PalletStreamStreamsStreamDetails>',
  ])
  if (encodedStream.isSome) {
    const anchoredStream = encodedStream.unwrap()
    const stream: IStreamDetails = {
      streamId: DecoderUtils.hexToString(anchoredStream.streamId.toString()),
      streamHash: streamHash,
      creator: anchoredStream.creator.toString(),
      holder: anchoredStream.holder.toString() || null,
      schemaId: anchoredStream.schema.toString() || null,
      cid: anchoredStream.cid
        ? DecoderUtils.hexToString(anchoredStream.cid.toString())
        : null,
      parentHash: anchoredStream.parent.toString() || null,
      linkId: DecoderUtils.hexToString(anchoredStream.link.toString()) || null,
      revoked: anchoredStream.revoked.valueOf(),
    }
    return StreamDetails.fromStreamDetails(stream)
  }
  return null
}

async function queryRawHash(
  stream_hash: string
): Promise<Option<AnchoredStreamDetails>> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const result = await blockchain.api.query.stream.streams<
    Option<AnchoredStreamDetails>
  >(stream_hash)
  return result
}

async function queryRawId(
  streamId: string
): Promise<IStreamDetails['streamHash']> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const result = await blockchain.api.query.stream.streamId<Option<Hash>>(
    streamId
  )
  return result.toString()
}

/**
 * @param identifier
 * @internal
 */
export async function queryHash(
  streamHash: string
): Promise<StreamDetails | null> {
  const encoded = await queryRawHash(streamHash)
  return decodeStream(encoded, streamHash)
}

/**
 * Query a stream from the chain given the stream Id.
 *
 * @param streamId The Id of the stream anchored.
 * @returns Either the retrieved [[StreamDetails]] or null.
 */
export async function query(streamId: string): Promise<StreamDetails | null> {
  const stream_Id = Identifier.getIdentifierKey(streamId, STREAM_PREFIX)
  const streamHash = await queryRawId(stream_Id)
  const encoded = await queryRawHash(streamHash)
  return decodeStream(encoded, streamHash)
}

/**
 * @param id
 * @internal
 */
export async function getOwner(
  streamHash: IStream['streamHash']
): Promise<IPublicIdentity['address'] | null> {
  const encoded = await queryRawHash(streamHash)
  const queriedSchemaAccount = decodeStream(encoded, streamHash)
  return queriedSchemaAccount!.creator
}
