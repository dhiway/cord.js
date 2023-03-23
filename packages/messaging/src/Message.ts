import type {
  DecryptCallback,
  DidResolveKey,
  DidResourceUri,
  EncryptCallback,
  IEncryptedMessage,
  IEncryptedMessageContents,
  ISchema,
  IMessage,
  MessageBody,
} from '@cord.network/types'
import { Stream, Document, Schema } from '@cord.network/modules'
import { DataUtils, SDKErrors, UUID } from '@cord.network/utils'
import * as Did from '@cord.network/did'
import {
  hexToU8a,
  stringToU8a,
  u8aToHex,
  u8aToString,
  isHex,
} from '@polkadot/util'

/**
 * Checks if the message body is well-formed.
 *
 * @param body The message body.
 */
export function verifyMessageBody(body: MessageBody): void {
  switch (body.type) {
    case 'request-document-stream': {
      Document.verifyDataStructure(body.content.document)
      break
    }
    case 'submit-document-stream': {
      Stream.verifyDataStructure(body.content.stream)
      break
    }
    case 'reject-document-stream': {
      if (!isHex(body.content)) {
        throw new SDKErrors.HashMalformedError()
      }
      break
    }
    case 'request-credential-document': {
      body.content.schemas.forEach(
        ({ schemaId, trustedIssuers, requiredProperties }): void => {
          DataUtils.validateId(schemaId, 'Schema Identiifier')
          trustedIssuers?.forEach((did) => Did.validateUri(did, 'Did'))
          requiredProperties?.forEach((requiredProps) => {
            if (typeof requiredProps !== 'string')
              throw new TypeError(
                'Required properties is expected to be a string'
              )
          })
        }
      )
      break
    }
    case 'submit-credential-document': {
      body.content.forEach((presentation) => {
        Document.verifyDataStructure(presentation)
        if (!Did.isDidSignature(presentation.holderSignature)) {
          throw new SDKErrors.SignatureMalformedError()
        }
      })
      break
    }
    case 'accept-credential-document': {
      body.content.forEach((schemaId) =>
        DataUtils.validateId(schemaId, 'Schema Identiifier')
      )
      break
    }
    case 'reject-credential-document': {
      body.content.forEach((schemaId) =>
        DataUtils.validateId(schemaId, 'Schema Identiifier')
      )
      break
    }
    default:
      throw new SDKErrors.UnknownMessageBodyTypeError()
  }
}

/**
 * Checks if the message object is well-formed.
 *
 * @param message The message object.
 */
export function verifyMessageEnvelope(message: IMessage): void {
  const { messageId, createdAt, receiver, sender, receivedAt, inReplyTo } =
    message
  if (messageId !== undefined && typeof messageId !== 'string') {
    throw new TypeError('Message id is expected to be a string')
  }
  if (createdAt !== undefined && typeof createdAt !== 'number') {
    throw new TypeError('Created at is expected to be a number')
  }
  if (receivedAt !== undefined && typeof receivedAt !== 'number') {
    throw new TypeError('Received at is expected to be a number')
  }
  Did.validateUri(sender, 'Did')
  Did.validateUri(receiver, 'Did')
  if (inReplyTo && typeof inReplyTo !== 'string') {
    throw new TypeError('In reply to is expected to be a string')
  }
}

/**
 * Verifies required properties for a given [[Schema]] before sending or receiving a message.
 *
 * @param requiredProperties The list of required properties that need to be verified against a [[Schema]].
 * @param schema A [[Schema]] used to verify the properties.
 */
export function verifyRequiredSchemaProperties(
  requiredProperties: string[],
  schema: ISchema
): void {
  Schema.verifyDataStructure(schema as ISchema)

  const unknownProperties = requiredProperties.find(
    (property) => !(property in schema.properties)
  )
  if (unknownProperties) {
    throw new SDKErrors.SchemaUnknownPropertiesError()
  }
}

/**
 * Verifies that the sender of a [[Message]] is also the owner of it, e.g the owner's and sender's DIDs refer to the same subject.
 *
 * @param message The [[Message]] object which needs to be decrypted.
 * @param message.body The body of the [[Message]] which depends on the [[BodyType]].
 * @param message.sender The sender's DID taken from the [[IMessage]].
 */
export function ensureOwnerIsSender({ body, sender }: IMessage): void {
  switch (body.type) {
    case 'request-document-stream':
      {
        const requestStream = body
        if (
          !Did.isSameSubject(
            requestStream.content.document.content.holder,
            sender
          )
        ) {
          throw new SDKErrors.IdentityMismatchError('Content', 'Sender')
        }
      }
      break
    case 'submit-document-stream':
      {
        const submitStream = body
        if (!Did.isSameSubject(submitStream.content.stream.issuer, sender)) {
          throw new SDKErrors.IdentityMismatchError('Stream', 'Sender')
        }
      }
      break
    case 'submit-credential-document':
      {
        const submitContentForSchema = body
        submitContentForSchema.content.forEach((presentation) => {
          if (!Did.isSameSubject(presentation.content.holder, sender)) {
            throw new SDKErrors.IdentityMismatchError('Claims', 'Sender')
          }
        })
      }
      break
    default:
  }
}

/**
 * Symmetrically decrypts the result of [[encrypt]].
 *
 * @param encrypted The encrypted message.
 * @param decryptCallback The callback to decrypt with the secret key.
 * @param decryptionOptions Options to perform the decryption operation.
 * @param decryptionOptions.resolveKey The DID key resolver to use.
 * @returns The original [[Message]].
 */
export async function decrypt(
  encrypted: IEncryptedMessage,
  decryptCallback: DecryptCallback,
  {
    resolveKey = Did.resolveKey,
  }: {
    resolveKey?: DidResolveKey
  } = {}
): Promise<IMessage> {
  const { senderKeyUri, receiverKeyUri, ciphertext, nonce, receivedAt } =
    encrypted

  const senderKeyDetails = await resolveKey(senderKeyUri, 'keyAgreement')

  const { fragment } = Did.parse(receiverKeyUri)
  if (!fragment) {
    throw new SDKErrors.DidError(
      `No fragment for the receiver key ID "${receiverKeyUri}"`
    )
  }

  let data: Uint8Array
  try {
    data = (
      await decryptCallback({
        peerPublicKey: senderKeyDetails.publicKey,
        data: hexToU8a(ciphertext),
        nonce: hexToU8a(nonce),
        keyUri: receiverKeyUri,
      })
    ).data
  } catch (cause) {
    throw new SDKErrors.DecodingMessageError(undefined, {
      cause: cause as Error,
    })
  }

  const decoded = u8aToString(data)

  const {
    body,
    createdAt,
    messageId,
    inReplyTo,
    references,
    sender,
    receiver,
  } = JSON.parse(decoded) as IEncryptedMessageContents
  const decrypted: IMessage = {
    receiver,
    sender,
    createdAt,
    body,
    messageId,
    receivedAt,
    inReplyTo,
    references,
  }

  if (sender !== senderKeyDetails.controller) {
    throw new SDKErrors.IdentityMismatchError('Encryption key', 'Sender')
  }

  return decrypted
}

/**
 * Checks the message structure and body contents (e.g. Hashes match, ensures the owner is the sender).
 * Throws, if a check fails.
 *
 * @param decryptedMessage The decrypted message to check.
 */
export function verify(decryptedMessage: IMessage): void {
  verifyMessageBody(decryptedMessage.body)
  verifyMessageEnvelope(decryptedMessage)
  ensureOwnerIsSender(decryptedMessage)
}

/**
 * Constructs a message from a message body.
 * This should be encrypted with [[encrypt]] before sending to the receiver.
 *
 * @param body The body of the message.
 * @param sender The DID of the sender.
 * @param receiver The DID of the receiver.
 * @returns The message created.
 */
export function fromBody(
  body: MessageBody,
  sender: IMessage['sender'],
  receiver: IMessage['receiver']
): IMessage {
  return {
    body,
    createdAt: Date.now(),
    receiver,
    sender,
    messageId: UUID.generate(),
  }
}

/**
 * Encrypts the [[Message]] as a string. This can be reversed with [[decrypt]].
 *
 * @param message The message to encrypt.
 * @param encryptCallback The callback to encrypt with the secret key.
 * @param receiverKeyUri The key URI of the receiver.
 * @param encryptionOptions Options to perform the encryption operation.
 * @param encryptionOptions.resolveKey The DID key resolver to use.
 *
 * @returns The encrypted version of the original [[Message]], see [[IEncryptedMessage]].
 */
export async function encrypt(
  message: IMessage,
  encryptCallback: EncryptCallback,
  receiverKeyUri: DidResourceUri,
  {
    resolveKey = Did.resolveKey,
  }: {
    resolveKey?: DidResolveKey
  } = {}
): Promise<IEncryptedMessage> {
  const receiverKey = await resolveKey(receiverKeyUri, 'keyAgreement')
  if (message.receiver !== receiverKey.controller) {
    throw new SDKErrors.IdentityMismatchError('receiver public key', 'receiver')
  }

  const toEncrypt: IEncryptedMessageContents = {
    body: message.body,
    createdAt: message.createdAt,
    sender: message.sender,
    receiver: message.receiver,
    messageId: message.messageId,
    inReplyTo: message.inReplyTo,
    references: message.references,
  }

  const serialized = stringToU8a(JSON.stringify(toEncrypt))

  const encrypted = await encryptCallback({
    did: message.sender,
    data: serialized,
    peerPublicKey: receiverKey.publicKey,
  })

  const ciphertext = u8aToHex(encrypted.data)
  const nonce = u8aToHex(encrypted.nonce)

  return {
    receivedAt: message.receivedAt,
    ciphertext,
    nonce,
    senderKeyUri: encrypted.keyUri,
    receiverKeyUri: receiverKey.id,
  }
}
