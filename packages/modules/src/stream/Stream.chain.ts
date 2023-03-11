import { ConfigService } from '@cord.network/config'
import type { Option } from '@polkadot/types'
import type { IStream, ICredential, IStreamChain } from '@cord.network/types'
import * as Did from '@cord.network/did'
import type { PalletStreamStreamEntry } from '@cord.network/augment-api'
import { DecoderUtils, Identifier } from '@cord.network/utils'

const log = ConfigService.LoggingFactory.getLogger('Stream')

/**
 * Encodes the provided stream for use in `api.tx.stream.create()`.
 *
 * @param stream The Stream to translate for the blockchain.
 * @returns Encoded Stream.
 */
export function toChain(content: IStream): IStreamChain {
  const chainStream = {
    streamHash: content.streamHash,
    schema: Identifier.uriToIdentifier(content.schema),
  }
  return chainStream
}

/**
 * Decodes the stream returned by `api.query.stream.streams()`.
 *
 * @param encoded Raw stream data from blockchain.
 * @param identifier The stream identifier.
 * @returns The stream.
 */
export function fromChain(
  encoded: Option<PalletStreamStreamEntry>,
  identifier: ICredential['identifier']
): IStream {
  const chainStream = encoded.unwrap()
  const stream: IStream = {
    identifier,
    streamHash: chainStream.digest.toHex(),
    issuer: Did.fromChain(chainStream.creator),
    schema: DecoderUtils.hexToString(chainStream.schema.toString()),
    registry: DecoderUtils.hexToString(chainStream.registry.toString()),
    revoked: chainStream.revoked.valueOf(),
  }
  log.info(`Decoded stream: ${JSON.stringify(stream)}`)
  return stream
}
