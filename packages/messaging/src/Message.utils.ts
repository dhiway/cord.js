/**
 * @packageDocumentation
 * @module MessageUtils
 */

import {
  StreamUtils,
  CredentialUtils,
  ContentUtils,
  SchemaUtils,
  MarkContentUtils,
} from '@cord.network/modules'
import type {
  ICredential,
  CompressedCredential,
  CompressedMessageBody,
  MessageBody,
  CompressedRequestCredentialContent,
  IRequestStreamForCredential,
  ISchema,
  IMessage,
  PartialContent,
  IContent,
} from '@cord.network/api-types'
import { DataUtils, SDKErrors } from '@cord.network/utils'
import { isHex } from '@polkadot/util'

import { Message } from './Message.js'

export function errorCheckMessageBody(body: MessageBody): boolean | void {
  switch (body.type) {
    case Message.BodyType.REQUEST_STREAM: {
      MarkContentUtils.errorCheck(body.content.requestStream)
      if (body.content.prerequisiteStreams) {
        body.content.prerequisiteStreams.map(
          (content: IContent | PartialContent) =>
            ContentUtils.errorCheck(content)
        )
      }
      break
    }
    case Message.BodyType.ANCHOR_STREAM: {
      StreamUtils.errorCheck(body.content.stream)
      break
    }
    case Message.BodyType.REJECT_STREAM: {
      if (!isHex(body.content)) {
        throw SDKErrors.ERROR_HASH_MALFORMED()
      }
      break
    }
    case Message.BodyType.REQUEST_CREDENTIAL: {
      body.content.forEach(
        (requestStreamsForSchema: IRequestStreamForCredential): void => {
          DataUtils.validateId(
            requestStreamsForSchema.id,
            'Invalid Schema Identifier'
          )
          requestStreamsForSchema.acceptedIssuer?.map((address) =>
            DataUtils.validateAddress(address, 'Invalid Schema Owner Address')
          )
          requestStreamsForSchema.requiredProperties?.forEach(
            (requiredProps) =>
              typeof requiredProps !== 'string' &&
              new TypeError('Required properties is expected to be a string')
          )
        }
      )
      break
    }
    case Message.BodyType.SUBMIT_CREDENTIAL: {
      const creds: ICredential[] = body.content.map((credentials, i) => {
        return credentials[i].credentials
      })
      creds.map((cred) => CredentialUtils.errorCheck(cred))
      break
    }
    case Message.BodyType.ACCEPT_CREDENTIAL: {
      body.content.map((id) => DataUtils.validateId(id, 'invalid schema hash'))
      break
    }
    case Message.BodyType.REJECT_CREDENTIAL: {
      body.content.map((id) =>
        DataUtils.validateId(id, 'rejected streams - invalid schema hash')
      )
      break
    }

    default:
      throw SDKErrors.ERROR_MESSAGE_BODY_MALFORMED()
  }

  return true
}

export function errorCheckMessage(message: IMessage): boolean | void {
  const {
    body,
    request,
    createdAt,
    receiverAddress,
    senderAddress,
    receivedAt,
    senderPublicKey,
    inReplyTo,
  } = message
  if (request && typeof request !== 'string') {
    throw new TypeError('message id is expected to be a string')
  }
  if (createdAt && typeof createdAt !== 'number') {
    throw new TypeError('created at is expected to be a number')
  }
  if (receivedAt && typeof receivedAt !== 'number') {
    throw new TypeError('received at is expected to be a number')
  }
  DataUtils.validateAddress(receiverAddress, 'receiver address')
  DataUtils.validateAddress(senderAddress, 'sender address')
  if (!isHex(senderPublicKey)) {
    throw SDKErrors.ERROR_ADDRESS_INVALID()
  }
  if (inReplyTo && typeof inReplyTo !== 'string') {
    throw new TypeError('in reply to is expected to be a string')
  }
  errorCheckMessageBody(body)
  return true
}

/**
 * Verifies required properties for a given [[MType]] before sending or receiving a message.
 *
 * @param requiredProperties The list of required properties that need to be verified against a [[MType]].
 * @param mType A [[MType]] used to verify the properties.
 * @throws [[ERROR_MTYPE_HASH_NOT_PROVIDED]] when the properties do not match the provide [[MType]].
 *
 * @returns Returns the properties back.
 */

export function verifyRequiredSchemaProperties(
  requiredProperties: string[],
  schema: ISchema
): boolean {
  SchemaUtils.errorCheck(schema as ISchema)

  const validProperties = requiredProperties.find(
    (property) => !(property in schema.schema.properties)
  )
  if (validProperties) {
    throw SDKErrors.ERROR_SCHEMA_PROPERTIES_NOT_MATCHING()
  }

  return true
}

/**
 * Compresses a [[Message]] depending on the message body type.
 *
 * @param body The body of the [[Message]] which depends on the [[MessageBodyType]] that needs to be compressed.
 *
 * @returns Returns the compressed message optimised for sending.
 */

export function compressMessage(body: MessageBody): CompressedMessageBody {
  let compressedContents: CompressedMessageBody[1]
  switch (body.type) {
    case Message.BodyType.REQUEST_STREAM: {
      compressedContents = [
        MarkContentUtils.compress(body.content.requestStream),
        body.content.prerequisiteStreams
          ? body.content.prerequisiteStreams.map((content) =>
              ContentUtils.compress(content)
            )
          : undefined,
      ]
      break
    }
    case Message.BodyType.ANCHOR_STREAM: {
      compressedContents = StreamUtils.compress(body.content.stream)
      break
    }
    case Message.BodyType.REQUEST_CREDENTIAL: {
      compressedContents = body.content.map(
        (val): CompressedRequestCredentialContent => {
          return [val.id, val.acceptedIssuer, val.requiredProperties]
        }
      )
      break
    }
    case Message.BodyType.SUBMIT_CREDENTIAL: {
      const cordStreams: ICredential[] = body.content.map((credentials, i) => {
        return credentials[i].credentials
      })
      compressedContents = cordStreams.map(
        (cordStream: ICredential | CompressedCredential) =>
          Array.isArray(cordStream)
            ? cordStream
            : CredentialUtils.compress(cordStream)
      )
      break
    }

    default:
      throw SDKErrors.ERROR_MESSAGE_BODY_MALFORMED()
  }
  return [body.type, compressedContents] as CompressedMessageBody
}

/**
 * [STATIC] Takes a compressed [[Message]] and decompresses it depending on the message body type.
 *
 * @param body The body of the compressed [[Message]] which depends on the [[MessageBodyType]] that needs to be decompressed.
 *
 * @returns Returns the compressed message back to its original form and more human readable.
 */

export function decompressMessage(body: CompressedMessageBody): MessageBody {
  // body[0] is the [[MessageBodyType]] being sent.
  // body[1] is the content order of the [[compressMessage]] for each [[MessageBodyType]].
  // Each index matches the object keys from the given [[MessageBodyType]].
  let decompressedContents: MessageBody['content']
  switch (body[0]) {
    case Message.BodyType.REQUEST_STREAM: {
      decompressedContents = {
        requestStream: MarkContentUtils.decompress(body[1][0]),
        prerequisiteStreams: body[1][1]
          ? body[1][1].map((stream) => ContentUtils.decompress(stream))
          : undefined,
      }

      break
    }
    case Message.BodyType.ANCHOR_STREAM: {
      decompressedContents = {
        stream: StreamUtils.decompress(body[1]),
      }
      break
    }
    case Message.BodyType.REQUEST_CREDENTIAL: {
      decompressedContents = body[1].map(
        (
          val: CompressedRequestCredentialContent
        ): IRequestStreamForCredential => {
          return {
            id: val[0],
            acceptedIssuer: val[1],
            requiredProperties: val[2],
          }
        }
      )

      break
    }
    // case Message.BodyType.SUBMIT_STREAM_FOR_SCHEMA: {
    //   decompressedContents = body[1].map(
    //     (cordStream: ICredential | CompressedCredential) =>
    //       !Array.isArray(cordStream)
    //         ? cordStream
    //         : CredentialUtils.decompress(cordStream)
    //   )

    //   break
    // }

    default:
      throw SDKErrors.ERROR_MESSAGE_BODY_MALFORMED()
  }

  return { type: body[0], content: decompressedContents } as MessageBody
}
