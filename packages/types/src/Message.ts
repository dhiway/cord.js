import type { ICredential, ICredentialPresentation } from './Credential.js'
import type { DidResourceUri, DidUri } from './DidDocument.js'
import type { IStream } from './Stream'
import type { SchemaId } from './Schema.js'

export type MessageBodyType =
  | 'error'
  | 'reject'
  | 'request-terms'
  | 'submit-terms'
  | 'reject-terms'
  | 'request-stream-entry'
  | 'submit-stream-entry'
  | 'reject-stream-entry'
  | 'request-payment'
  | 'confirm-payment'
  | 'request-stream'
  | 'submit-stream'
  | 'accept-stream'
  | 'reject-stream'
  | 'request-accept-delegation'
  | 'submit-accept-delegation'
  | 'reject-accept-delegation'
  | 'inform-create-delegation'

interface IMessageBodyBase {
  content: any
  type: MessageBodyType
}

export interface IError extends IMessageBodyBase {
  content: {
    /** Optional machine-readable type of the error. */
    name?: string
    /** Optional human-readable description of the error. */
    message?: string
  }
  type: 'error'
}

export interface IReject extends IMessageBodyBase {
  content: {
    /** Optional machine-readable type of the rejection. */
    name?: string
    /** Optional human-readable description of the rejection. */
    message?: string
  }
  type: 'reject'
}

export interface ISubmitStream extends IMessageBodyBase {
  content: ICredentialPresentation[]
  type: 'submit-stream'
}

export interface IAcceptStream extends IMessageBodyBase {
  content: SchemaId[]
  type: 'accept-stream'
}

export interface IRejectStream extends IMessageBodyBase {
  content: SchemaId[]
  type: 'reject-stream'
}
export interface IRequestStreamContent {
  stream: ICredential
}

export interface IRequestStreamEntry extends IMessageBodyBase {
  content: IRequestStreamContent
  type: 'request-stream-entry'
}

export interface ISubmitStreamEntryContent {
  streamEntry: IStream
}

export interface ISubmitStreamEntry extends IMessageBodyBase {
  content: ISubmitStreamEntryContent
  type: 'submit-stream-entry'
}

export interface IRejectStreamEntry extends IMessageBodyBase {
  content: ICredential['identifier']
  type: 'reject-stream-entry'
}

export interface IRequestStreamContent {
  Schemas: Array<{
    schemaId: SchemaId
    trustedAttesters?: DidUri[]
    requiredProperties?: string[]
  }>
  challenge?: string
}

export interface IRequestStream extends IMessageBodyBase {
  content: IRequestStreamContent
  type: 'request-stream'
}

export type MessageBody =
  | IError
  | IReject
  //
  | IRequestStreamEntry
  | ISubmitStreamEntry
  | IRejectStreamEntry
  //
  | IRequestStream
  | ISubmitStream
  | IAcceptStream
  | IRejectStream

/**
 * - `body` - The body of the message, see [[MessageBody]].
 * - `createdAt` - The timestamp of the message construction.
 * - `sender` - The DID of the sender.
 * - `receiver` - The DID of the receiver.
 * - `messageId` - The message id.
 * - `receivedAt` - The timestamp of the message reception.
 * - `inReplyTo` - The id of the parent-message.
 * - `references` - The references or the in-reply-to of the parent-message followed by the message-id of the parent-message.
 */
export interface IMessage {
  body: MessageBody
  createdAt: number
  sender: DidUri
  receiver: DidUri
  messageId?: string
  receivedAt?: number
  inReplyTo?: IMessage['messageId']
  references?: Array<IMessage['messageId']>
}

/**
 * Everything which is part of the encrypted and protected part of the [[IMessage]].
 */
export type IEncryptedMessageContents = Omit<IMessage, 'receivedAt'>

/**
 * Removes the plaintext [[IEncryptedMessageContents]] from an [[IMessage]] and instead includes them in encrypted form.
 * This adds the following fields:
 * - `ciphertext` - The encrypted message content.
 * - `nonce` - The encryption nonce.
 * - `receiverKeyUri` - The URI of the receiver's encryption key.
 * - `senderKeyUri` - The URI of the sender's encryption key.
 */
export type IEncryptedMessage = Pick<IMessage, 'receivedAt'> & {
  receiverKeyUri: DidResourceUri
  senderKeyUri: DidResourceUri
  ciphertext: string
  nonce: string
}
