import * as Cord from '@cord.network/sdk'
import { useEncryptionCallback } from './useEncryptionCallback'

/**
 * `encryptMessage` takes a message, a sender DID, a receiver DID, and a key agreement, and returns an
 * encrypted message
 * @param message - The message to encrypt.
 * @param senderUri - The DID URI of the sender.
 * @param receiverUri - The DID URI of the receiver of the message.
 * @param keyAgreement - The keyAgreement object that was created in the previous step.
 * @returns An encrypted message
 */
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

  return encryptedMessage
}
