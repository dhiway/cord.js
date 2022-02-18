/**
 * @packageDocumentation
 * @module Request
 */

import {
  // Credential,
  Schema,
  SDKErrors,
  Identity,
  SchemaUtils,
} from '@cord.network/modules'
// import { ConfigService } from '@cord.network/config'
import type {
  IPublicIdentity,
  IMessage,
  // ICredential,
  // IContentStream,
  // IMessage,
  IRequestStreamForCredential,
} from '@cord.network/api-types'
import { Message } from '@cord.network/messaging'
import { UUID, Crypto } from '@cord.network/utils'

export interface IPresentationReq {
  properties: string[]
  id?: Schema['id']
  proofs?: boolean
  requestUpdatedAfter?: Date
}

export interface IPartialRequest {
  id: Schema['id']
  properties: string[]
}

export interface IRequestSession {
  requestedProperties: IPartialRequest[]
}

/**
 * A helper class to initiate a verification by creating a presentation request which is built
 * on a specific [[MType]] and attributes of the [[Stream]] the verifier requires to see.
 */
export class PresentationRequestBuilder {
  private partialReq: IPartialRequest[]
  constructor() {
    this.partialReq = []
  }

  /**
   * Initiates a verification by creating a presentation request for a specific [[Schema]].
   * Note that you are required to call [[finalize]] on the request to conclude it.
   *
   * @param p The parameter object.
   * @param p.id The ID of the [[Schema]].
   * @param p.properties A list of properties of the [[Credential]]s requested.
   * @param p.proofs An optional boolean representing whether the verifier requests to see the proofs of the issuers which signed the [[Credentials]]s.
   * The default value for this is the current date.
   * @returns A [[PresentationRequestBuilder]] on which you need to call [[finalize]] to complete the presentation request.
   */
  public requestPresentation({
    id,
    properties,
    proofs,
  }: IPresentationReq): PresentationRequestBuilder {
    const rawProperties = properties.map((attr) => `${attr}`)

    if (typeof id !== 'undefined') {
      rawProperties.push('content.id')
    }
    if (proofs === true) {
      rawProperties.push('proof')
    }
    if (!id) throw SDKErrors.ERROR_SCHEMA_ID_NOT_PROVIDED()
    this.partialReq.push({
      id: SchemaUtils.getSchemaId(id),
      properties: rawProperties,
    })
    return this
  }

  /**
   * Concludes the presentation request.
   *
   * @param requester The [[Identity]] of the verifier used to sign.
   * @param holder The [[IPublicIdentity]] for which the message should be encrypted (note: the message will be return unencrypted. Use Message.getEncryptedMessage to encrypt the message).
   * @returns A session and a message object.
   * The **session** object will be used in [[verifyPresentation]] and should be kept private by the verifier.
   * The **message** object should be sent to the Holder and used in [[createPresentation]].
   */
  public finalize(
    purpose: string,
    requester: Identity,
    holder: IPublicIdentity,
    validUntil: number,
    relatedData: boolean
  ): {
    session: IRequestSession
    message: IMessage
  } {
    const session = {
      requestedProperties: this.partialReq,
    }
    const message = new Message(
      {
        request: UUID.generate(),
        type: Message.BodyType.REQUEST_CREDENTIAL,
        content: this.partialReq.map((pr): IRequestStreamForCredential => {
          return {
            id: pr.id,
            requiredProperties: pr.properties,
          }
        }),
        purpose,
        validUntil,
        relatedData,
      },
      requester,
      holder
    )
    const hash = Crypto.hashStr(JSON.stringify(message))
    message.body.signature = requester.signStr(hash)
    return {
      session: session,
      message: message,
    }
  }
}
/**
 * Initiates a verification by creating a request on the Verifier's side.
 *
 * @returns A [[PresentationRequestBuilder]] based on a [[MType]] and a list of required disclosed attributes of the [[MarkedStream]]s.
 */
export function newRequestBuilder(): PresentationRequestBuilder {
  return new PresentationRequestBuilder()
}
