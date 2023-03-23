import * as Cord from '@cord.network/sdk'

export async function createPresentation(
  document: Cord.IDocument,
  signCallback: Cord.SignCallback,
  selectedAttributes?: string[],
  challenge?: string
): Promise<Cord.IDocumentPresentation> {
  // Create a presentation with only the specified fields revealed, if specified.
  return Cord.Document.createPresentation({
    document,
    signCallback,
    selectedAttributes,
    challenge,
  })
}
