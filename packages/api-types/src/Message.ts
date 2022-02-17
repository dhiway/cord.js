/**
 * @packageDocumentation
 * @module IMessage
 */

import type { CompressedStream, IStream } from './Stream.js'
import type { CompressedCredential } from './Credential.js'

import type {
  CompressedContent,
  IContent,
  IContents,
  PartialContent,
} from './Content.js'
import type { ISchemaEnvelope } from './Schema.js'
import type { IPublicIdentity } from './PublicIdentity.js'
import type {
  CompressedContentStream,
  IContentStream,
} from './ContentStream.js'
import { IPresentation } from './Presentation.js'

export enum MessageBodyType {
  REQUEST_STREAM = 'request-stream',
  ANCHOR_STREAM = 'anchor-stream',
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
  createdAt: number
  purpose?: string
  receiverAddress: IPublicIdentity['address']
  senderAddress: IPublicIdentity['address']
  senderPublicKey: IPublicIdentity['boxPublicKeyAsHex']
  request?: string
  receivedAt?: number
  inReplyTo?: IMessage['request']
  references?: Array<IMessage['request']>
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
  | 'request'
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
  request: string
  purpose?: string
  validUntil?: number
  relatedData?: boolean
  signature?: string
}

export interface IRequestStream extends IMessageBodyBase {
  content: IRequestStreamContent
  type: MessageBodyType.REQUEST_STREAM
}
export interface IAnchorStream extends IMessageBodyBase {
  content: IAnchorStreamContent
  type: MessageBodyType.ANCHOR_STREAM
}
export interface IRejectStream extends IMessageBodyBase {
  content: IContentStream['id']
  type: MessageBodyType.REJECT_STREAM
}

export interface IRequestCredential extends IMessageBodyBase {
  content: IRequestStreamForCredential[]
  type: MessageBodyType.REQUEST_CREDENTIAL
}
export interface ISubmitCredential extends IMessageBodyBase {
  content: IPresentation[]
  type: MessageBodyType.SUBMIT_CREDENTIAL
}
export interface IAcceptCredential extends IMessageBodyBase {
  content: Array<ISchemaEnvelope['id']>
  type: MessageBodyType.ACCEPT_CREDENTIAL
}
export interface IRejectCredential extends IMessageBodyBase {
  content: Array<ISchemaEnvelope['id']>
  type: MessageBodyType.REJECT_CREDENTIAL
}

export type CompressedRequestStream = [
  MessageBodyType.REQUEST_STREAM,
  CompressedRequestStreamContent
]
export type CompressedAnchorStream = [
  MessageBodyType.ANCHOR_STREAM,
  CompressedStream
]
export type CompressedRejectStream = [
  MessageBodyType.REJECT_STREAM,
  IContentStream['id']
]

export type CompressedRequestCredential = [
  MessageBodyType.REQUEST_CREDENTIAL,
  CompressedRequestCredentialContent[]
]
export type CompressedSubmitCredential = [
  MessageBodyType.SUBMIT_CREDENTIAL,
  CompressedCredential[]
]
export type CompressedAcceptCredential = [
  MessageBodyType.ACCEPT_CREDENTIAL,
  Array<ISchemaEnvelope['id']>
]
export type CompressedRejectCredential = [
  MessageBodyType.REJECT_CREDENTIAL,
  Array<ISchemaEnvelope['id']>
]

export interface IRequestStreamContent {
  requestStream: IContentStream
  prerequisiteStreams?: Array<IContent | PartialContent>
}
// Seems this can be removed
export interface IAnchorStreamContent {
  stream: IStream
}
export interface IRequestStreamForCredential {
  id: ISchemaEnvelope['id']
  acceptedIssuer?: Array<IPublicIdentity['address']>
  requiredProperties?: string[]
}

export type CompressedPartialContentStream = [
  IContent['schemaId'],
  IContent['creator'] | undefined,
  IContents | undefined
]

export type CompressedRequestCredentialContent = [
  ISchemaEnvelope['id'],
  Array<IPublicIdentity['address']> | undefined,
  string[] | undefined
]

export type CompressedRequestStreamContent = [
  CompressedContentStream,
  Array<CompressedPartialContentStream | CompressedContent> | undefined
]

export type MessageBody =
  //
  | IRequestStream
  | IAnchorStream
  | IRejectStream
  //
  | IRequestCredential
  | ISubmitCredential
  | IAcceptCredential
  | IRejectCredential

export type CompressedMessageBody =
  | CompressedRequestStream
  | CompressedAnchorStream
  | CompressedRejectStream
  //
  | CompressedRequestCredential
  | CompressedSubmitCredential
  | CompressedAcceptCredential
  | CompressedRejectCredential
