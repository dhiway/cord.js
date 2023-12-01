import * as Cord from '@cord.network/sdk'

export async function updateDocument(
  updateContent: Cord.IDocumentUpdate,
  schema: Cord.ISchema,
  signCallback: Cord.SignCallback
): Promise<Cord.IDocument> {
  const updatedDocument = await Cord.Document.fromUpdatedContent({
    document: updateContent,
    schema,
    signCallback,
    options: {},
  })

  return updatedDocument
}
