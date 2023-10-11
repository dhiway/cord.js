import * as Cord from '@cord.network/sdk'

/**
 * It verifies a presentation by checking the statement on the blockchain and verifying the presentation
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

    // Verify the credential by checking the statement on the blockchain.
    const api = Cord.ConfigService.get('api')
    const chainIdentifier = Cord.Statement.idToChain(presentation.identifier)
    const statementOnChain = await api.query.statement.statements(chainIdentifier)
    const statement = Cord.Statement.fromChain(statementOnChain, chainIdentifier)
    if (statement.statementHash !== presentation.documentHash) {
      return false
    }
    const attestationOnChain = await api.query.statement.attestations(chainIdentifier, presentation.documentHash)
    const attest = Cord.Statement.fromChainAttest(attestationOnChain, chainIdentifier)
    if (attest.revoked) {
      return false
    }

    return trustedIssuerUris.includes(attest.creator)
  } catch {
    return false
  }
}
