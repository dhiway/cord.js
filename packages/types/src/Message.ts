import type { IDocument, IDocumentPresentation } from './Document.js'
import type { DidResourceUri, DidUri } from './DidDocument.js'
import type { IStream } from './Stream'
import type { SchemaId } from './Schema.js'

export type MessageBodyType =
  | 'error'
  | 'reject'
  | 'request-document-stream'
  | 'submit-document-stream'
  | 'reject-document-stream'
  | 'request-credential-document'
  | 'submit-credential-document'
  | 'accept-credential-document'
  | 'reject-credential-document'

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

export interface ISubmitCredentialDocument extends IMessageBodyBase {
  content: IDocumentPresentation[]
  type: 'submit-credential-document'
}

export interface IAcceptCredentialDocument extends IMessageBodyBase {
  content: SchemaId[]
  type: 'accept-credential-document'
}

export interface IRejectCredentialDocument extends IMessageBodyBase {
  content: SchemaId[]
  type: 'reject-credential-document'
}
export interface IRequestDocumentContent {
  document: IDocument
}

export interface IRequestDocument extends IMessageBodyBase {
  content: IRequestDocumentContent
  type: 'request-document-stream'
}

export interface ISubmitStreamContent {
  stream: IStream
}

export interface ISubmitDocumentStream extends IMessageBodyBase {
  content: ISubmitStreamContent
  type: 'submit-document-stream'
}

export interface IRejectDocumentStream extends IMessageBodyBase {
  content: IDocument['identifier']
  type: 'reject-document-stream'
}

export interface IRequestDocumentContent {
  schemas: Array<{
    schemaId: SchemaId
    trustedIssuers?: DidUri[]
    requiredProperties?: string[]
  }>
  challenge?: string
}

export interface IRequestCredentialDocument extends IMessageBodyBase {
  content: IRequestDocumentContent
  type: 'request-credential-document'
}

export type MessageBody =
  | IError
  | IReject
  //
  | IRequestDocument
  | ISubmitDocumentStream
  | IRejectDocumentStream
  //
  | IRequestCredentialDocument
  | ISubmitCredentialDocument
  | IAcceptCredentialDocument
  | IRejectCredentialDocument

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
