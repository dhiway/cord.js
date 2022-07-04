/**
 * @packageDocumentation
 * @module IMessage
 */

import type { CompressedStream, IStream } from './Stream.js'
import type { CompressedCredential, ICredential } from './Credential.js'

import type {
  // CompressedContent,
  IContent,
  IContents,
  // PartialContent,
} from './Content.js'
import type { ISchema } from './Schema.js'
import type { IPublicIdentity } from './PublicIdentity.js'
import type {
  CompressedContentStream,
  IContentStream,
} from './ContentStream.js'

export enum MessageBodyType {
  ERROR = 'error',
  REJECT = 'reject',

  REQUEST_STREAM = 'request-stream',
  SUBMIT_STREAM = 'anchor-stream',
  REJECT_STREAM = 'reject-stream',

  REQUEST_CREDENTIAL = 'request-credential',
  SUBMIT_CREDENTIAL = 'submit-credential',
  ACCEPT_CREDENTIAL = 'accept-credential',
  REJECT_CREDENTIAL = 'reject-credential',
}

/**
 * - `body` - The body of the message, see [[MessageBody]].
 * - `createdAt` - The timestamp of the message construction.
 * - `receiverAddress` - The public SS58 address of the receiver.
 * - `senderAddress` - The public SS58 address of the sender.
 * - `senderBoxPublicKex` - The public encryption key of the sender.
 * - `requestId` - The message id.
 * - `inReplyTo` - The id of the parent-message.
 * - `references` - The references or the in-reply-to of the parent-message followed by the message-id of the parent-message.
 */
export interface IMessage {
  body: MessageBody
  createdAt: string
  purpose?: string
  receiverAddress: IPublicIdentity['address']
  senderAddress: IPublicIdentity['address']
  senderPublicKey: IPublicIdentity['boxPublicKeyAsHex']
  messageId?: string
  receivedAt?: number
  inReplyTo?: IMessage['messageId']
  references?: Array<IMessage['messageId']>
}

/**
 * Removes the [[MessageBody]], parent-id and references from the [[Message]] and adds
 * four new fields: message, nonce, hash and signature.
 * - `message` - The encrypted body of the message.
 * - `nonce` - The encryption nonce.
 * - `hash` - The hash of the concatenation of message + nonce + createdAt.
 * - `signature` - The sender's signature on the hash.
 */
export type IEncryptedMessage = Pick<
  IMessage,
  | 'createdAt'
  | 'receiverAddress'
  | 'senderAddress'
  | 'senderPublicKey'
  | 'messageId'
  | 'receivedAt'
> & {
  encryptedStream: string
  nonce: string
  hash: string
  signature: string
}
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
  type: MessageBodyType.ERROR
}

export interface IReject extends IMessageBodyBase {
  content: {
    /** Optional machine-readable type of the rejection. */
    name?: string
    /** Optional human-readable description of the rejection. */
    message?: string
  }
  type: MessageBodyType.REJECT
}

export interface IRequestStream extends IMessageBodyBase {
  content: IRequestStreamContent
  type: MessageBodyType.REQUEST_STREAM
}
export interface ISubmitStream extends IMessageBodyBase {
  content: ISubmitStreamContent
  type: MessageBodyType.SUBMIT_STREAM
}
export interface IRejectStream extends IMessageBodyBase {
  content: IContentStream['identifier']
  type: MessageBodyType.REJECT_STREAM
}

export interface IRequestCredential extends IMessageBodyBase {
  content: IRequestCredentialContent
  type: MessageBodyType.REQUEST_CREDENTIAL
}
export interface ISubmitCredential extends IMessageBodyBase {
  content: ICredential[]
  type: MessageBodyType.SUBMIT_CREDENTIAL
}
export interface IAcceptCredential extends IMessageBodyBase {
  content: Array<ISchema['identifier']>
  type: MessageBodyType.ACCEPT_CREDENTIAL
}
export interface IRejectCredential extends IMessageBodyBase {
  content: Array<ISchema['identifier']>
  type: MessageBodyType.REJECT_CREDENTIAL
}

export type CompressedRequestStream = [
  MessageBodyType.REQUEST_STREAM,
  CompressedRequestStreamContent
]
export type CompressedSubmitStream = [
  MessageBodyType.SUBMIT_STREAM,
  CompressedStream
]
export type CompressedRejectStream = [
  MessageBodyType.REJECT_STREAM,
  IContentStream['identifier']
]

export type CompressedRequestCredential = [
  MessageBodyType.REQUEST_CREDENTIAL,
  CompressedRequestCredentialContent
]
export type CompressedSubmitCredential = [
  MessageBodyType.SUBMIT_CREDENTIAL,
  CompressedCredential[]
]
export type CompressedAcceptCredential = [
  MessageBodyType.ACCEPT_CREDENTIAL,
  Array<ISchema['identifier']>
]
export type CompressedRejectCredential = [
  MessageBodyType.REJECT_CREDENTIAL,
  Array<ISchema['identifier']>
]

export interface IRequestStreamContent {
  requestStream: IContentStream
  // prerequisiteStreams?: Array<IContent | PartialContent>
}
// Seems this can be removed
export interface ISubmitStreamContent {
  stream: IStream
}
export interface IRequestCredentialContent {
  schemas: Array<{
    schemaIdentifier: ISchema['identifier']
    trustedIssuers?: Array<IPublicIdentity['address']>
    requiredProperties?: string[]
  }>
  challenge?: string
}

export type CompressedPartialContent = [
  IContent['schema'],
  IContent['issuer'] | undefined,
  IContent['holder'] | undefined,
  IContents | undefined
]

export type CompressedRequestCredentialContent = [
  Array<
    [
      ISchema['identifier'],
      Array<IPublicIdentity['address']> | undefined,
      string[] | undefined
    ]
  >,
  string?
]

export type CompressedRequestStreamContent = [
  CompressedContentStream
  // Array<CompressedPartialContent | CompressedContent> | undefined
]

export type MessageBody =
  //
  | IRequestStream
  | ISubmitStream
  | IRejectStream
  //
  | IRequestCredential
  | ISubmitCredential
  | IAcceptCredential
  | IRejectCredential

export type CompressedMessageBody =
  | CompressedRequestStream
  | CompressedSubmitStream
  | CompressedRejectStream
  //
  | CompressedRequestCredential
  | CompressedSubmitCredential
  | CompressedAcceptCredential
  | CompressedRejectCredential
