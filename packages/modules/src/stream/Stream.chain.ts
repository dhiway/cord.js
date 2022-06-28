import { Option, Struct, Vec, u8 } from '@polkadot/types'
import type {
  IStream,
  IStreamDetails,
  IPublicIdentity,
  IContentStream,
  SubmittableExtrinsic,
} from '@cord.network/types'
import { DecoderUtils, Identifier } from '@cord.network/utils'
import type { AccountId, Hash } from '@polkadot/types/interfaces'
import { ConfigService } from '@cord.network/config'
import { ChainApiConnection } from '@cord.network/network'
import { STREAM_PREFIX } from '@cord.network/types'
import { Identity } from '../identity/Identity.js'
import { HexString } from '@polkadot/util/types.js'

const log = ConfigService.LoggingFactory.getLogger('Stream')

/**
 * Generate the extrinsic to store the provided [[IStream]].
 *
 * @param stream The stream to anchor on the chain.
 * @returns The [[SubmittableExtrinsic]] for the `create` call.
 */
export async function create(stream: IStream): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  return blockchain.api.tx.stream.create(
    stream.issuer,
    stream.streamHash,
    stream.holder,
    stream.schema,
    stream.link,
    stream.space,
    stream.issuerSignature
  )
}

/**
 * Generate the extrinsic to update the provided [[IStream]].
 *
 * @param stream The stream to update on the chain.
 * @returns The [[SubmittableExtrinsic]] for the `update` call.
 */
export async function update(stream: IStream): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  return blockchain.api.tx.stream.update(
    stream.identifier,
    stream.issuer,
    stream.streamHash,
    stream.issuerSignature,
    stream.space
  )
}

/**
 * Generate the extrinsic to set the status of a given stream. The submitter can
 * be the owner of the stream or an authorized delegator of the linked schema.
 *
 * @param stream The stream to revoke
 * @param updater TThe transaction creator
 * @returns The [[SubmittableExtrinsic]] for the `revoke` call.
 */
export async function revoke(
  stream: IStream,
  updater: Identity
): Promise<SubmittableExtrinsic> {
  const { txSignature, txHash } = updater.signTx(stream.streamHash)

  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Revoking stream with ID ${stream.identifier}`)
  const space = stream.identifier || null
  return blockchain.api.tx.stream.revoke(
    stream.identifier,
    updater.address,
    txHash,
    txSignature,
    space
  )
}

/**
 * Generate the extrinsic to remove an anchored stream data. The submitter should
 * be the owner of the space or an authorized delegator of the linked space.
 *
 * @param streamIdentifier The stream Identifier.
 * @param spaceIdentifier Linked Space Identifier
 * @returns The [[SubmittableExtrinsic]] for the `removeSpaceStream` call.
 */
export async function removeSpaceStream(
  streamIdentifier: string,
  spaceIdentifier: string
): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Revoking stream with ID ${streamIdentifier}`)
  return blockchain.api.tx.stream.removeSpaceStream(
    streamIdentifier,
    spaceIdentifier
  )
}

/**
 * Generate the extrinsic to anchore the digest of a stream presentation. The submitter
 * can be the owner of the stream or an authorized delegator of the schema.
 *
 * @param streamIdentifier The stream Identifier.
 * @param creator The transaction creator
 * @param digestHash Hash of the presentation
 * @returns The [[SubmittableExtrinsic]] for the `digest` call.
 */
export async function digest(
  streamIdentifier: string,
  creator: Identity,
  digestHash: HexString
): Promise<SubmittableExtrinsic> {
  const txSignature = creator.signStr(digestHash)

  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Adding a stream Digest ${streamIdentifier}`)
  return blockchain.api.tx.stream.digest(
    streamIdentifier,
    creator,
    digestHash,
    txSignature
  )
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
  streamIdentifier: IContentStream['identifier']
): IStreamDetails | null {
  DecoderUtils.assertCodecIsType(encodedStream, [
    'Option<PalletStreamStreamsStreamDetails>',
  ])
  if (encodedStream.isSome) {
    const anchoredStream = encodedStream.unwrap()
    const stream: IStreamDetails = {
      identifier: streamIdentifier,
      streamHash: anchoredStream.streamHash.toHex(),
      issuer: anchoredStream.controller.toString(),
      holder: anchoredStream.holder.toString() || null,
      schema:
        DecoderUtils.hexToString(anchoredStream.schema.toString()) || null,
      link: DecoderUtils.hexToString(anchoredStream.link.toString()) || null,
      space: DecoderUtils.hexToString(anchoredStream.space.toString()) || null,
      revoked: anchoredStream.revoked.valueOf(),
    }
    return stream
  }
  return null
}

/**
 * Query a stream from the chain, returning the SCALE encoded value.
 *
 * @param streamIdentifier The Identifier of the stream anchored.
 * @returns An Option wrapping scale encoded stream data.
 */
export async function queryRaw(
  streamIdentifier: IContentStream['identifier']
): Promise<Option<AnchoredStreamDetails>> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const result = await blockchain.api.query.stream.streams<
    Option<AnchoredStreamDetails>
  >(streamIdentifier)
  return result
}

/**
 * Query a stream from the chain.
 *
 * @param streamIdentifier The Identifier of the stream anchored.
 * @returns Either the retrieved [[Stream]] or null.
 */
export async function query(
  streamIdentifier: IContentStream['identifier']
): Promise<IStreamDetails | null> {
  const encoded = await queryRaw(streamIdentifier)
  return decodeStream(encoded, streamIdentifier)
}

/**
 * Queries the chain and returns the stream owner.
 *
 * @param streamIdentifier The Identifier of the stream anchored.
 * @returns Either the retrieved owner or null.
 */
export async function getOwner(
  streamIdentifier: IContentStream['identifier']
): Promise<IPublicIdentity['address'] | null> {
  const stream_Id = Identifier.getIdentifierKey(streamIdentifier, STREAM_PREFIX)

  const encoded = await queryRaw(stream_Id)
  const queriedStreamAccount = decodeStream(encoded, stream_Id)
  return queriedStreamAccount!.issuer
}
