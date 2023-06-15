import * as Cord from '@cord.network/sdk'
import { API_URL } from '../../../packages/network/src/chain/Chain'

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
    // Verify the presentation with the provided challenge.
    await Cord.Document.verifyPresentation(presentation, { challenge })

    // Verify the credential by checking the stream on the blockchain.

    // const api = Cord.ConfigService.get('api')
    const chainIdentifier = Cord.Stream.idToChain(presentation.identifier)
    // const streamOnChain = await api.query.stream.streams(chainIdentifier)

    const url = API_URL
    const cordApiUrl = `${url}/query/stream/${chainIdentifier}`

    let stream: any

    if (url) {
      stream = await fetch(cordApiUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((resp) => {
          return resp.json()
        })
        .catch((error) => {
          console.error(error)
        })
    } else {
      console.log('URL not found')
    }

    // const stream = Cord.Stream.fromChain(streamOnChai, chainIdentifier)
    if (stream.revoked) {
      return false
    }
    return trustedIssuerUris.includes(stream.issuer)
  } catch {
    return false
  }
}
