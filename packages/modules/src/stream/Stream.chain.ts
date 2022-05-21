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
} from '@cord.network/types'
import { DecoderUtils, Identifier } from '@cord.network/utils'
import type { AccountId, Hash } from '@polkadot/types/interfaces'
import { ConfigService } from '@cord.network/config'
import { ChainApiConnection } from '@cord.network/network'
import { StreamDetails } from './Stream.js'
import { STREAM_PREFIX } from '@cord.network/types'

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
    stream.issuer,
    stream.streamHash,
    stream.holder,
    stream.schema,
    stream.link,
    stream.space,
    stream.issuerSignature
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
    stream.identifier,
    stream.issuer,
    stream.streamHash,
    stream.space,
    stream.issuerSignature
  )
  return tx
}

/**
 * Generate the extrinsic to set the status of a given stream. The submitter can be the owner of the stream or an authorized delegator of the schema.
 *
 * @param streamIdentifier The stream Identifier.
 * @param issuer The submitter
 * @param status The stream status
 * @returns The [[SubmittableExtrinsic]] for the `set_status` call.
 */
export async function revoke(
  streamIdentifier: string,
  issuer: string,
  txHash: string,
  txSignature: string,
  spaceIdentifier?: string | null | undefined
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Revoking stream with ID ${streamIdentifier}`)
  const space = spaceIdentifier ? spaceIdentifier : null
  const tx: SubmittableExtrinsic = blockchain.api.tx.stream.revoke(
    streamIdentifier,
    issuer,
    txHash,
    space,
    txSignature
  )
  return tx
}

/**
 * Generate the extrinsic to set the status of a given stream. The submitter can be the owner of the stream or an authorized delegator of the schema.
 *
 * @param streamIdentifier The stream Identifier.
 * @param issuer The submitter
 * @param status The stream status
 * @returns The [[SubmittableExtrinsic]] for the `set_status` call.
 */
export async function removeSpaceStream(
  streamIdentifier: string,
  spaceIdentifier: string
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Revoking stream with ID ${streamIdentifier}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.stream.removeSpaceStream(
    streamIdentifier,
    spaceIdentifier
  )
  return tx
}

/**
 * Generate the extrinsic to set the status of a given stream. The submitter can be the owner of the stream or an authorized delegator of the schema.
 *
 * @param streamId The stream Is.
 * @param issuer The submitter
 * @param status The stream status
 * @returns The [[SubmittableExtrinsic]] for the `set_status` call.
 */
export async function digest(
  streamId: string,
  creator: string,
  digestHash: string,
  txSignature: string
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Revoking stream with ID ${streamId}`)
  const tx: SubmittableExtrinsic = blockchain.api.tx.stream.digest(
    streamId,
    creator,
    digestHash,
    txSignature
  )
  return tx
}

export interface AnchoredStreamDetails extends Struct {
  readonly streamHash: Hash
  readonly controller: AccountId
  readonly holder: Option<AccountId>
  readonly schema: Option<Vec<u8>>
  readonly link: Option<Vec<u8>>
  readonly space: Option<Vec<u8>>
  readonly revoked: boolean
}

function decodeStream(
  encodedStream: Option<AnchoredStreamDetails>,
  streamIdentifier: string
): StreamDetails | null {
  DecoderUtils.assertCodecIsType(encodedStream, [
    'Option<PalletStreamStreamsStreamDetails>',
  ])
  if (encodedStream.isSome) {
    const anchoredStream = encodedStream.unwrap()
    const stream: IStreamDetails = {
      identifier: streamIdentifier,
      streamHash: anchoredStream.streamHash.toString(),
      issuer: anchoredStream.controller.toString(),
      holder: anchoredStream.holder.toString() || null,
      schema:
        DecoderUtils.hexToString(anchoredStream.schema.toString()) || null,
      link: DecoderUtils.hexToString(anchoredStream.link.toString()) || null,
      space: DecoderUtils.hexToString(anchoredStream.space.toString()) || null,
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
 * @param id
 * @internal
 */
export async function getOwner(
  streamId: string
): Promise<IPublicIdentity['address'] | null> {
  const stream_Id = Identifier.getIdentifierKey(streamId, STREAM_PREFIX)

  const encoded = await queryRaw(stream_Id)
  const queriedStreamAccount = decodeStream(encoded, stream_Id)
  return queriedStreamAccount!.issuer
}
