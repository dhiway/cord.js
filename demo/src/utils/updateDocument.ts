import * as Cord from '@cord.network/sdk'
import type {
  DidUri,
  IDocument,
  ISchema,
  SignCallback,
  IContents,
  // DocumenentMetaData,
} from '@cord.network/types'

/**
 * This function performs the task of modifying the data within a document and anchoring it on the blockchain.
 * @param document - The document which needs to be updated.
 * @param updatedContent - The updated content that is intended for incorporation into the document.
 * @param schema - Schema of the document.
 * @param signCallback - A function that takes a signature request and returns a signature.
 * @param authorDid - DID of the entity which anchors the transaction.
 * @param authorIdentity - The account that will be used to sign and submit the extrinsic.
 * @param signingkeys - Keys which are used to sign.
 * @returns the updated document if the update operation is executed successfully.
 */
export async function updateStream(
  document: IDocument,
  updatedContent: IContents,
  schema: ISchema,
  signCallback: SignCallback,
  authorDid: DidUri,
  authorIdentity: Cord.CordKeyringPair,
  signingkeys: any
) {

    const updatedDocument = await Cord.Document.updateFromContent(
    document,
    updatedContent,
    schema,
    signCallback,
    {}
  )

  const api = Cord.ConfigService.get('api')
  const { streamHash } = Cord.Stream.fromDocument(updatedDocument)
  const authorization = Cord.Registry.uriToIdentifier(
    updatedDocument.authorization
  )

  const streamTx = api.tx.stream.update(
    updatedDocument.identifier.replace('stream:cord:', ''),
    streamHash,
    authorization
  )

  const authorizedStreamTx = await Cord.Did.authorizeTx(
    authorDid.uri,
    streamTx,
    async ({ data }) => ({
      signature: signingkeys.assertionMethod.sign(data),
      keyType: signingkeys.assertionMethod.type,
    }),
    authorIdentity.address
  )

  try {
    await Cord.Chain.signAndSubmitTx(authorizedStreamTx, authorIdentity)
    return updatedDocument
  } catch (e) {
    console.log('Error: \n', e.message)
  }
}
