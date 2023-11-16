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
): Promise<{ isValid: boolean; message: string }> {
  try {
    // Verify the presentation with the provided challenge.
    await Cord.Document.verifyPresentation(presentation, {
      challenge,
    })

    const { isValid, message } =
      await Cord.Document.verifyPresentationDocumentStatus(presentation, {
        challenge,
        trustedIssuerUris,
      })

    return { isValid, message }
  } catch {
    return { isValid: false, message: 'Verification failed!' }
  }
}
