/**
 * A[[Credential]] is a **stream**, which a Holder can store locally and share with Verifiers as they wish.
 *
 * Once a content for Credential has been made, the [[Stream]] can be built and the Issuer submits it wrapped in a [[Credential]] object.
 * This [[Credential]] also contains the original content.
 * Credential also exposes a [[createPresentation]] method, that can be used by the holder to hide some specific information from the verifier for more privacy.
 *
 * @packageDocumentation
 * @module Credential
 */

import type {
  ICredential,
  CompressedCredential,
  IContentStream,
  IStream,
  ISchema,
} from '@cord.network/types'
import { SDKErrors } from '@cord.network/utils'
import * as Stream from '../stream/Stream.js'
import * as ContentStream from '../contentstream/ContentStream.js'
import { verifyContentWithSchema } from '../schema/index.js'
import { Identity } from '../identity/Identity.js'

/**
 * Verifies whether the data of the given credential is valid. It is valid if:
 * * the [[ContentStream]] object associated with this credential has valid data (see [[ContentStream.verifyDataIntegrity]]);
 * and
 * * the hash of the [[ContentStream]] object for the credential, and the hash of the [[Content]] for the credential are the same.
 *
 * @param credential - The credential to verify.
 * @returns Whether the credential's data is valid.
 */
export function verifyDataIntegrity(credential: ICredential): boolean {
  if (credential.request.content.schema !== credential.stream.schema)
    return false
  return (
    credential.request.rootHash === credential.stream.streamHash &&
    ContentStream.verifyDataIntegrity(credential.request)
  )
}

/**
 * Checks whether the input meets all the required criteria of an ICredential object.
 * Throws on invalid input.
 *
 * @param input The potentially only partial ICredential.
 * @throws [[ERROR_STREAM_NOT_PROVIDED]] or [[ERROR_RFA_NOT_PROVIDED]] when input's attestation and request respectively do not exist.
 *
 */
export function verifyDataStructure(input: ICredential): void {
  if (input.stream) {
    Stream.verifyDataStructure(input.stream)
  } else throw new SDKErrors.ERROR_STREAM_NOT_PROVIDED()

  if (input.request) {
    ContentStream.verifyDataStructure(input.request)
  } else throw new SDKErrors.ERROR_CONTENT_STREAM_NOT_PROVIDED()
}

/**
 * Checks the [[Credential]] with a given [[Schema]] to check if the content meets the [[schema]] structure.
 *
 * @param credential A [[Credential]] object of an attested claim used for verification.
 * @param schema A [[Schema]] to verify the [[Content]] structure.
 *
 * @returns A boolean if the [[Content]] structure in the [[Credential]] is valid.
 */
export function verifyAgainstCType(
  credential: ICredential,
  schema: ISchema
): boolean {
  verifyDataStructure(credential)
  return verifyContentWithSchema(
    credential.request.content.contents,
    schema.schema
  )
}

/**
 * Builds a new instance of [[Credential]], from all required properties.
 *
 * @param request - The content stream.
 * @param stream - The credential stream.
 * @returns A new [[Credential]] object.
 *
 */
export function fromRequestAndStream(
  request: IContentStream,
  stream: IStream
): ICredential {
  const credential = {
    request,
    stream,
  }
  verifyDataStructure(credential)
  return credential
}

/**
 * Custom Type Guard to determine input being of type ICredential using the CredentialUtils errorCheck.
 *
 * @param input The potentially only partial ICredential.
 *
 * @returns Boolean whether input is of type ICredential.
 */
export function isICredential(input: unknown): input is ICredential {
  try {
    verifyDataStructure(input as ICredential)
  } catch (error) {
    return false
  }
  return true
}

/**
 * Verifies whether the credential stream is valid. It is valid if:
 * * the data is valid (see [[verifyData]]);
 * and
 * * the [[Stream]] object for this stream is valid (see [[Stream.checkValidity]], where the **chain** is queried).
 *
 * Upon presentation of a stream, a verifier would call this [[verify]] function.
 *
 * @param markedStream - The stream to check for validity.
 * @returns A promise containing whether this attested stream is valid.
 *
 */

export async function verify(cred: ICredential): Promise<boolean> {
  return (
    verifyDataIntegrity(cred) &&
    (await ContentStream.verifySignature(cred.request)) &&
    Stream.checkValidity(cred.stream)
  )
}

/**
 * Verifies the data of each element of the given Array of IMarkedStreams.
 *
 * @param evidenceIds Array of IMarkedStreams to validate.
 * @throws [[ERROR_EVIDENCE_ID_UNVERIFIABLE]] when one of the IMarkedStreams data is unable to be verified.
 *
 * @returns Boolean whether each element of the given Array of IMarkedStreams is verifiable.
 */
export function validateEvidenceIds(evidenceIds: ICredential[]): boolean {
  evidenceIds.forEach((evidence: ICredential) => {
    if (!verifyDataIntegrity(evidence)) {
      throw new SDKErrors.ERROR_EVIDENCE_ID_UNVERIFIABLE()
    }
  })
  return true
}

/**
 * Gets the hash of the stream that corresponds to this credential.
 *
 * @returns The hash of the stream for this credential (streamHash).
 *
 */
export function getHash(credential: ICredential): IStream['streamHash'] {
  return credential.stream.streamHash
}

export function getId(credential: ICredential): IStream['identifier'] {
  return credential.stream.identifier
}

export function getAttributes(credential: ICredential): Set<string> {
  // TODO: move this to stream or contents
  return new Set(Object.keys(credential.request.content.contents))
}

/**
 * Creates a public presentation which can be sent to a verifier.
 *
 * @param publicAttributes All properties of the stream which have been requested by the verifier and therefore must be publicly presented.
 * If kept empty, we hide all attributes inside the stream for the presentation.
 *
 * @returns A deep copy of the MarkedStream with all but `publicAttributes` removed.
 */

export async function createPresentation({
  credential,
  selectedAttributes,
  signer,
  challenge,
}: {
  credential: ICredential
  selectedAttributes?: string[]
  signer: Identity
  challenge?: string
}): Promise<ICredential> {
  const presentation =
    // clone the attestation and request for attestation because properties will be deleted later.
    // TODO: find a nice way to clone stuff
    JSON.parse(JSON.stringify(credential))

  // filter attributes that are not in public attributes
  const excludedClaimProperties = selectedAttributes
    ? Array.from(getAttributes(credential)).filter(
        (property) => !selectedAttributes.includes(property)
      )
    : []

  // remove these attributes
  ContentStream.removeContentProperties(
    presentation.request,
    excludedClaimProperties
  )

  await ContentStream.signWithKey(presentation.request, signer, challenge)

  return presentation
}

/**
 * Compresses a [[Credential]] object into an array for storage and/or messaging.
 *
 * @param credential - The credential to compress.
 * @returns An array that contains the same properties of a [[Credential]].
 */
export function compress(credential: ICredential): CompressedCredential {
  verifyDataStructure(credential)

  return [
    ContentStream.compress(credential.request),
    Stream.compress(credential.stream),
  ]
}

/**
 * Decompresses a [[Credential]] array from storage and/or message into an object.
 *
 * @param credential The [[CompressedCredential]] that should get decompressed.
 * @throws [[ERROR_DECOMPRESSION_ARRAY]] when credential is not an Array or it's length is unequal 2.
 * @returns A new [[Credential]] object.
 */
export function decompress(credential: CompressedCredential): ICredential {
  if (!Array.isArray(credential) || credential.length !== 2) {
    throw new SDKErrors.ERROR_DECOMPRESSION_ARRAY('Credential')
  }
  const decompressedCredential = {
    request: ContentStream.decompress(credential[0]),
    stream: Stream.decompress(credential[1]),
  }
  verifyDataStructure(decompressedCredential)
  return decompressedCredential
}
