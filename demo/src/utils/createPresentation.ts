import * as Cord from '@cord.network/sdk'

export async function createPresentation(
  credential: Cord.ICredential,
  signCallback: Cord.SignCallback,
  selectedAttributes?: string[],
  challenge?: string
): Promise<Cord.ICredentialPresentation> {
  // Create a presentation with only the specified fields revealed, if specified.
  return Cord.Credential.createPresentation({
    credential,
    signCallback,
    selectedAttributes,
    challenge,
  })
}
