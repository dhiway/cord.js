import * as Cord from '@cord.network/sdk'
import { useEncryptionCallback } from './useEncryptionCallback'

export async function encryptMessage(
  message: Cord.IMessage,
  senderUri: Cord.DidUri,
  receiverUri: Cord.DidUri,
  keyAgreement: Cord.CordEncryptionKeypair
): Promise<Cord.IEncryptedMessage> {
  const { document: senderDocument } = await Cord.Did.resolve(senderUri)

  const { document: receiverDocument } = await Cord.Did.resolve(receiverUri)

  const receiverKeyAgreementUri =
    `${receiverUri}${receiverDocument.keyAgreement?.[0].id}` as Cord.DidResourceUri
  const senderKeyAgreeementUri =
    `${senderUri}${senderDocument.keyAgreement?.[0].id}` as Cord.DidResourceUri
  // encrypt the message
  const encryptedMessage = await Cord.Message.encrypt(
    message,
    useEncryptionCallback({
      keyAgreement,
      keyAgreementUri: senderKeyAgreeementUri,
    }),
    receiverKeyAgreementUri
  )

  console.dir(encryptedMessage, {
    depth: null,
    colors: true,
  })
  // console.log(`Encrypted Message: ${JSON.stringify(encryptedMessage, null, 4)}`)

  return encryptedMessage
}
