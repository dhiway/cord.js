import * as Cord from '@cord.network/sdk'

/**
 * It creates a `request-credential` message that requests a credential with a specific schema
 * @param senderUri - The DID URI of the sender of the message.
 * @param receiverUri - The DID of the receiver of the message
 * @param schemaId - The schemaId of the credential schema that you want to request.
 * @returns A message object
 */
export async function generateRequestCredentialMessage(
  senderUri: Cord.DidUri,
  receiverUri: Cord.DidUri,
  schemaId: Cord.SchemaId
) {
  // Creating a challenge to submit to the receiver
  const challenge = Cord.Utils.UUID.generate()

  // Sender uri is checked if it is a valid URI
  Cord.Did.validateUri(senderUri)
  // Receiver uri is checked if it is a valid URI
  Cord.Did.validateUri(receiverUri)

  // The content of the 'request-credential' message
  // It includes a schemaId that is being requested
  // The sender is the trusted issuer in the scenario
  const requestCredentialContent = {
    schemaId: schemaId,
    trustedIssuers: [senderUri],
  }

  const messageBody: Cord.IRequestCredential = {
    type: 'request-credential-document',
    content: { schemas: [requestCredentialContent], challenge: challenge },
  }

  // The message will throw an Error if invalid
  const message = Cord.Message.fromBody(messageBody, senderUri, receiverUri)

  console.dir(message, {
    depth: null,
    colors: true,
  })

  return message
}
