import * as Cord from '@cord.network/sdk'

export function createDocument(
  holder: Cord.DidUri,
  issuer: Cord.DidUri,
  schema: Cord.ISchema
): Cord.IDocument {
  const content = Cord.Content.fromSchemaAndContent(
    schema,
    {
      name: 'Alice',
      age: 29,
      id: '123456789987654321',
      gender: 'Female',
      country: 'India',
    },
    holder,
    issuer
  )
  const document = Cord.Document.fromContent(content)
  return document
}
