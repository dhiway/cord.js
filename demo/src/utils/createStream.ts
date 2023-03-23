import * as Cord from '@cord.network/sdk'

export async function createStream(
  issuer: Cord.DidUri,
  authorAccount: Cord.CordKeyringPair,
  signCallback: Cord.SignExtrinsicCallback,
  document: Cord.IDocument
): Promise<void> {
  const api = Cord.ConfigService.get('api')

  // Create a stream object
  const { schema, streamHash } = Cord.Stream.fromDocument(document)
  const schema_id = Cord.Schema.idToChain(schema)
  const authorization = document.authorization
  const streamTx = api.tx.stream.create(streamHash, schema_id, authorization)
  const authorizedStreamTx = await Cord.Did.authorizeTx(
    issuer,
    streamTx,
    signCallback,
    authorAccount.address
  )
  await Cord.Chain.signAndSubmitTx(authorizedStreamTx, authorAccount)
}
