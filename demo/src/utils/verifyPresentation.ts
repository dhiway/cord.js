import * as Cord from '@cord.network/sdk'
import {cord_api_query} from '@cord.network/utils'

/**
 * It verifies a presentation by checking the stream on the blockchain and verifying the presentation
 * with the provided challenge
 * @param presentation - The presentation to verify.
 * @param  - `presentation` - The presentation to verify.
 * @returns A boolean value.
 */
export async function verifyPresentation(
  presentation: Cord.IDocumentPresentation,
  {
    challenge,
    trustedIssuerUris = [],
  }: {
    challenge?: string
    trustedIssuerUris?: Cord.DidUri[]
  } = {}
): Promise<boolean> {
  try {
    let stream: any
    // Verify the presentation with the provided challenge.
    await Cord.Document.verifyPresentation(presentation, { challenge })

    // Verify the credential by checking the stream on the blockchain.

    const api = Cord.ConfigService.get('api')
    const chainIdentifier = Cord.Stream.idToChain(presentation.identifier)

    stream = await cord_api_query('stream', 'streams', chainIdentifier)

    if (!stream) {
      const streamOnChain = await api.query.stream.streams(chainIdentifier)
      stream = Cord.Stream.fromChain(streamOnChain, chainIdentifier)
    }
    if (stream.revoked) {
      return false
    }
    return trustedIssuerUris.includes(stream.issuer)
  } catch  (err: any) {
    console.log(err);
    return false
  }
}
