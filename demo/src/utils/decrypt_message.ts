import * as Cord from '@cord.network/sdk'
import { useDecryptionCallback } from './useDecryptionCallback'

/**
 * `decryptMessage` decrypts the encrypted message and verifies that it is a properly formatted message
 * @param encryptedMessage - The encrypted message that was received from the sender
 * @param keyAgreement - The keyAgreement object that was created in the previous step.
 * @returns The decrypted message
 */
export async function decryptMessage(
  encryptedMessage: Cord.IEncryptedMessage,
  keyAgreement: Cord.CordEncryptionKeypair
): Promise<Cord.IMessage> {
  // Decrypting the message to retrieve the content
  const decryptedMessage = await Cord.Message.decrypt(
    encryptedMessage,
    useDecryptionCallback(keyAgreement)
  )

  // Verifying this is a properly-formatted message
  Cord.Message.verify(decryptedMessage)

  console.dir(decryptedMessage, {
    depth: null,
    colors: true,
  })
  // console.log(`Decrypted Message: ${JSON.stringify(decryptedMessage, null, 4)}`)

  // Checking if the message type matches the expected checks
  if (decryptedMessage.body.type !== 'request-credential-document') {
    throw new Error('Not the correct body type')
  }

  // Destructing the message to receive the cTypes array to see what credentials
  // Are valid for the given request
  const { schemas } = decryptedMessage.body.content

  const { schemaId, trustedIssuers } = schemas[0]

  // The receiver can check if they have a valid credential that matches the schema
  console.log(' The sent schema identifier :', schemaId)

  // The trusted attesters is an array that includes the list of trusted entities
  // The receiver can check if they have a given credential from the trusted list
  console.log(` A list of trusted issuers DID :${trustedIssuers}`)

  return decryptedMessage
}
