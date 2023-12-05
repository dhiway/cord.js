import * as Cord from '@cord.network/sdk'

/**
 * Create a presentation for a document, optionally revealing only the specified attributes
 * @param document - The document to create a presentation for.
 * @param signCallback - A function that takes a signature request and returns a signature.
 * @param {string[]} [selectedAttributes] - An array of attribute names to reveal in the presentation.
 * If not specified, all attributes will be revealed.
 * @param {string} [challenge] - A challenge string that will be signed by the user's private key.
 * @returns A promise that resolves to a document presentation.
 */
export async function createPresentation({
  document,
  signCallback,
  selectedAttributes = [],
  challenge,
}: Cord.PresentationOptions): Promise<Cord.IDocumentPresentation> {
  // Create a presentation with only the specified fields revealed, if specified.
  return Cord.Document.createPresentation({
    document,
    signCallback,
    selectedAttributes,
    challenge,
  });
}


// export async function createPresentation(
//   document,
//   signCallback: Cord.SignCallback,
//   selectedAttributes?: string[],
//   challenge?: string
// ): Promise<Cord.IDocumentPresentation> {
//   // Create a presentation with only the specified fields revealed, if specified.
//   return Cord.Document.createPresentation({
//     document,
//     signCallback,
//     selectedAttributes,
//     challenge,
//   })
// }
