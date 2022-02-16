/**
 * @packageDocumentation
 * @module Share
 */

import { Credential, Identity, SDKErrors } from '@cord.network/modules'
import type {
  IMessage,
  IPublicIdentity,
  IPresentationOptions,
  IPresentationSigningOptions,
} from '@cord.network/api-types'
import { Message } from '@cord.network/messaging'
import { Crypto } from '@cord.network/utils'

/**
 * Creates a presentation for an arbitrary amount of [[MarkedStream]]s which can be verified in [[verifyPresentation]].
 *
 * @param identity The Holder [[Identity]] which owns the [[MarkedStream]]s.
 * @param message The message which represents multiple [[MType]]s, [[IRequestStreamsForMTypes]]s and whether privacy
 * enhancement is supported.
 * @param verifier The [[IPublicIdentity]] of the verifier that requested the presentation.
 * @param credentials The [[MarkedStream]]s which should be verified.
 * @throws [[ERROR_PE_MISMATCH]], [[ERROR_MESSAGE_TYPE]], [[ERROR_PE_CREDENTIAL_MISSING]].
 * @returns A message which represents either an array of [[MarkedStream]]s if privacy enhancement is not supported
 * or a combined presentation. Both of these options can be verified.
 */
export function createPresentation(
  identity: Identity,
  message: IMessage,
  verifier: IPublicIdentity,
  credentials: Credential[],
  {
    showAttributes,
    hideAttributes = [],
    signer,
    request = message.request,
  }: IPresentationOptions & Partial<IPresentationSigningOptions> = {}
): Message {
  // did we get the right message type?
  if (message.body.type !== Message.BodyType.REQUEST_CREDENTIAL) {
    throw SDKErrors.ERROR_MESSAGE_TYPE(
      message.body.type,
      Message.BodyType.REQUEST_CREDENTIAL
    )
  }

  // create presentation for each credential
  const credentialStreams = credentials.map((cred, i) => {
    const presentation = cred.createPresentation({
      showAttributes,
      hideAttributes,
      signer,
      request,
    })

    return presentation
  })

  const resMessage = new Message(
    {
      request: message.body.request,
      type: Message.BodyType.SUBMIT_CREDENTIAL,
      content: credentialStreams,
      purpose: message.body.purpose,
      validUntil: message.body.validUntil,
      signature: message.body.signature,
    },
    identity,
    verifier
  )
  const msgSigner = signer ? { signer } : undefined
  delete resMessage.body.signature
  const signature = msgSigner?.signer.sign(
    Crypto.coToUInt8(JSON.stringify(resMessage))
  )

  resMessage.body.signature = Crypto.u8aToHex(signature)

  return resMessage
}
