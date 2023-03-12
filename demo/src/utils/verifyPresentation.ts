import * as Cord from '@cord.network/sdk'

export async function verifyPresentation(
  presentation: Cord.ICredentialPresentation,
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
    await Cord.Credential.verifyPresentation(presentation, { challenge })

    // Verify the credential by checking the stream on the blockchain.
    const api = Cord.ConfigService.get('api')
    const chainIdentifier = Cord.Stream.idToChain(presentation.identifier)
    const streamOnChain = await api.query.stream.streams(chainIdentifier)
    const stream = Cord.Stream.fromChain(streamOnChain, chainIdentifier)
    if (stream.revoked) {
      return false
    }
    return trustedIssuerUris.includes(stream.issuer)
  } catch {
    return false
  }
}
