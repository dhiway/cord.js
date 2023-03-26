import * as Cord from '@cord.network/sdk'

/**
 * It creates a stream object on the blockchain
 * @param issuer - The DID of the issuer of the document
 * @param authorAccount - The account that will be used to sign the extrinsic.
 * @param signCallback - A callback function that signs the extrinsic.
 * @param document - The document to be referenced by the stream
 */
export async function createStream(
  issuer: Cord.DidUri,
  authorAccount: Cord.CordKeyringPair,
  signCallback: Cord.SignExtrinsicCallback,
  document: Cord.IDocument
): Promise<void> {
  const api = Cord.ConfigService.get('api')

  // Create a stream object
  const { streamHash } = Cord.Stream.fromDocument(document)
  const authorization = Cord.Registry.uriToIdentifier(document.authorization)

  const streamTx = api.tx.stream.create(streamHash, authorization)
  const authorizedStreamTx = await Cord.Did.authorizeTx(
    issuer,
    streamTx,
    signCallback,
    authorAccount.address
  )
  await Cord.Chain.signAndSubmitTx(authorizedStreamTx, authorAccount)
}
