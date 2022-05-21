/**
 * @packageDocumentation
 * @module Request
 */

import { Mark, SDKErrors } from '@cord.network/modules'
import { ConfigService } from '@cord.network/config'
import type { IMark, IContentStream, IMessage } from '@cord.network/types'
import { Message } from '@cord.network/messaging'
import { IRequestSession } from './Request'

const log = ConfigService.LoggingFactory.getLogger('Request')

/**
//  * Initiates a verification by creating a request on the Verifier's side.
//  *
//  * @returns A [[PresentationRequestBuilder]] based on a [[MType]] and a list of required disclosed attributes of the [[MarkedStream]]s.
//  */
// export function newRequestBuilder(): PresentationRequestBuilder {
//   return new PresentationRequestBuilder()
// }

/**
 * [ASYNC] Checks that the submitted marks fulfil the ones requested upon presentation creation.
 *
 * @param markedStreams The attested streams submitted by the holder.
 * @param session The stored session object.
 * @returns An object describing whether the verification was successful.
 */
async function verifySharedPresentation(
  credStreams: Mark[],
  session: IRequestSession
): Promise<{
  verified: boolean
  streams: Array<Partial<IMark>>
}> {
  if (credStreams.length !== session.requestedProperties.length) {
    log.info(
      `Rejected presentation because the number of shared streams (${credStreams.length}) did not match the number of requested streams (${session.requestedProperties.length}).`
    )
    return {
      verified: false,
      streams: [],
    }
  }

  const allVerified = await Promise.all(
    session.requestedProperties.map(async (requested, i) => {
      const ac = credStreams[i]
      const providedProperties = ac.getAttributes()
      const rawProperties = Array.from(providedProperties.keys()).map(
        (prop) => `${prop}`
      )
      rawProperties.push('content.id')
      rawProperties.push('content.issuer')
      return (
        requested.properties.every((p) => {
          return rawProperties.includes(p)
        }) && ac.verify()
      )
    })
  )
  const verified = !allVerified.includes(false)
  return { verified, streams: verified ? credStreams : [] }
}

/**
 * [ASYNC] Verifies the Holder's presentation of [[MarkedStream]]s.
 *
 * @param message The Holder's presentation of the [[MarkedStream]]s that should be verified, the result of [[createPresentation]].
 * @param session The Verifier's private verification session created in [[finalize]].
 * @throws [[ERROR_MESSAGE_TYPE]].
 * @returns An object containing the keys
 * **verified** (which describes whether the [[MarkedStream]]s could be verified)
 * and **streams** (an array of [[Stream]]s restricted on the disclosed attributes selected in [[requestPresentationForMtype]]).
 */
export async function verifyPresentation(
  message: IMessage,
  session: IRequestSession
): Promise<{
  verified: boolean
  streams: Array<Partial<IContentStream | IMark>>
}> {
  if (message.body.type !== Message.BodyType.SUBMIT_CREDENTIAL)
    throw new SDKErrors.ERROR_MESSAGE_TYPE(
      message.body.type,
      Message.BodyType.SUBMIT_CREDENTIAL
    )
  const credentialStreams: IMark[] = message.body.content.map(
    (credentials: any, i: any) => {
      return credentials.credentials[i]
    }
  )
  const credStreams = credentialStreams.map(Mark.fromMark)

  // currently only supporting id-ed credentials
  return verifySharedPresentation(credStreams, session)
}
