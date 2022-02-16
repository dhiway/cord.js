/**
 * @packageDocumentation
 * @module Stream
 */
import { Option, Struct, Vec, u8 } from '@polkadot/types'
import type {
  IStream,
  IStreamDetails,
  SubmittableExtrinsic,
} from '@cord.network/api-types'
import { DecoderUtils } from '@cord.network/utils'
import type { AccountId, BlockNumber, Hash } from '@polkadot/types/interfaces'
import { ConfigService } from '@cord.network/config'
import { ChainApiConnection } from '@cord.network/network'
import { StreamDetails } from './Stream'
import { hexToString } from './Stream.utils'

const log = ConfigService.LoggingFactory.getLogger('Mark')

/**
 * Generate the extrinsic to store the provided [[IStream]].
 *
 * @param stream The stream to anchor on the chain.
 * @returns The [[SubmittableExtrinsic]] for the `create` call.
 */
export async function store(stream: IStream): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const tx: SubmittableExtrinsic = blockchain.api.tx.stream.create(
    stream.id,
    stream.creator,
    stream.hash,
    stream.cid,
    stream.schema,
    stream.link
  )
  return tx
}
export interface AnchoredStreamDetails extends Struct {
  readonly streamHash: Hash
  readonly cid: Option<Vec<u8>>
  readonly parent_cid: Option<Vec<u8>>
  readonly link: Option<Hash>
  readonly schema: Option<Hash>
  readonly creator: AccountId
  readonly block: BlockNumber
  readonly revoked: boolean
}

function decodeStream(
  encodedStream: Option<AnchoredStreamDetails>,
  streamId: string
): StreamDetails | null {
  DecoderUtils.assertCodecIsType(encodedStream, [
    'Option<PalletStreamStreamsStreamDetails>',
  ])
  if (encodedStream.isSome) {
    const anchoredStream = encodedStream.unwrap()
    const stream: IStreamDetails = {
      id: streamId,
      streamHash: anchoredStream.streamHash.toString(),
      cid: anchoredStream.cid
        ? hexToString(anchoredStream.cid.toString())
        : null,
      parent_cid: anchoredStream.parent_cid
        ? hexToString(anchoredStream.parent_cid.toString())
        : null,
      schema: anchoredStream.schema.toString() || null,
      link: anchoredStream.link.toString() || null,
      creator: anchoredStream.creator.toString(),
      block: anchoredStream.block.toString(),
      revoked: anchoredStream.revoked.valueOf(),
    }

    return StreamDetails.fromStreamDetails(stream)
  }
  return null
}

async function queryRaw(
  streamId: string
): Promise<Option<AnchoredStreamDetails>> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const result = await blockchain.api.query.stream.streams<
    Option<AnchoredStreamDetails>
  >(streamId)
  return result
}

/**
 * Query a stream from the chain given the stream Id.
 *
 * @param streamId The Id of the stream anchored.
 * @returns Either the retrieved [[StreamDetails]] or null.
 */
export async function query(streamId: string): Promise<StreamDetails | null> {
  const encoded = await queryRaw(streamId)
  return decodeStream(encoded, streamId)
}

/**
 * Generate the extrinsic to set the status of a given stream. The submitter can be the owner of the stream or an authorized delegator of the schema.
 *
 * @param streamId The stream Is.
 * @param creator The submitter
 * @param status The stream status
 * @returns The [[SubmittableExtrinsic]] for the `set_status` call.
 */
export async function set_status(
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
