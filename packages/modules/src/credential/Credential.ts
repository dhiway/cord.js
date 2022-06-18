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
  IPresentationOptions,
  IPresentationSigningOptions,
} from '@cord.network/types'
import { SDKErrors, Identifier } from '@cord.network/utils'
import { Stream } from '../stream/Stream.js'
import { ContentStream } from '../contentstream/ContentStream.js'
import * as CredentialUtils from './Credential.utils.js'
import { Presentation, SignedPresentation } from './Presentation'
import { SCHEMA_PREFIX } from '@cord.network/types'

export class Credential implements ICredential {
  /**
   * [STATIC] Builds an instance of [[Credential]], from a simple object with the same properties.
   * Used for deserialization.
   *
   * @param cred - The base object from which to create the Credential.
   * @returns A new instantiated [[Credential]] object.
   *
   */
  public static fromCredential(cred: ICredential): Credential {
    return new Credential(cred)
  }

  /**
   * [STATIC] Builds a new instance of [[Credential]], from all required properties.
   *
   * @param content - The content stream.
   * @param stream - The credential stream.
   * @returns A new [[Credential]] object.
   *
   */
  public static fromRequestAndStream(
    request: IContentStream,
    stream: IStream
  ): Credential {
    return new Credential({
      request,
      stream,
    })
  }

  /**
   *  [STATIC] Custom Type Guard to determine input being of type ICredential using the CredentialUtils errorCheck.
   *
   * @param input The potentially only partial ICredential.
   *
   * @returns Boolean whether input is of type ICredential.
   */
  public static isICredential(input: unknown): input is ICredential {
    try {
      CredentialUtils.errorCheck(input as ICredential)
    } catch (error) {
      return false
    }
    return true
  }

  public request: ContentStream
  public stream: Stream

  /**
   * Builds a new [[Credential]] instance.
   *
   * @param cred - The base object with all required input, from which to create the Credential.
   *
   */
  public constructor(cred: ICredential) {
    CredentialUtils.errorCheck(cred)
    this.request = ContentStream.fromRequest(cred.request)
    this.stream = Stream.fromStream(cred.stream)
  }

  /**
   * (ASYNC) Verifies whether the credential stream is valid. It is valid if:
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

  public static async verify(cred: ICredential): Promise<boolean> {
    return (
      Credential.verifyData(cred) &&
      (await ContentStream.verifySignature(cred.request)) &&
      Stream.checkValidity(cred.stream)
    )
  }

  public async verify(challenge?: string): Promise<boolean> {
    return Credential.verify(this)
  }

  /**
   * Verifies whether the data of the given anchored stream is valid. It is valid if:
   * * the [[RequestForMark]] object associated with this attested stream has valid data (see [[RequestForMark.verifyData]]);
   * and
   * * the hash of the [[RequestForMark]] object for the attested stream, and the hash of the [[Stream]] for the attested stream are the same.
   *
   * @param cred - The credential to verify.
   * @returns Whether the attested stream's data is valid.
   *
   */
  public static verifyData(cred: ICredential): boolean {
    const schemaIdentifier = cred.request.content.schema
      ? Identifier.getIdentifierKey(cred.request.content.schema, SCHEMA_PREFIX)
      : null
    if (schemaIdentifier !== cred.stream.schema) return false
    return (
      cred.request.rootHash === cred.stream.streamHash &&
      ContentStream.verifyData(cred.request)
    )
  }

  public verifyData(): boolean {
    return Credential.verifyData(this)
  }

  /**
   *  [STATIC] Verifies the data of each element of the given Array of IMarkedStreams.
   *
   * @param legitimations Array of IMarkedStreams to validate.
   * @throws [[ERROR_LEGITIMATIONS_UNVERIFIABLE]] when one of the IMarkedStreams data is unable to be verified.
   *
   * @returns Boolean whether each element of the given Array of IMarkedStreams is verifiable.
   */
  public static validateLegitimations(legitimations: ICredential[]): boolean {
    legitimations.forEach((legitimation: ICredential) => {
      if (!Credential.verifyData(legitimation)) {
        throw new SDKErrors.ERROR_LEGITIMATIONS_UNVERIFIABLE()
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
  public getHash(): IStream['streamHash'] {
    return this.stream.streamHash
  }

  public getId(): IStream['identifier'] {
    return this.stream.identifier
  }

  public getAttributes(): Set<string> {
    // TODO: move this to stream or contents
    return new Set(Object.keys(this.request.content.contents))
  }

  /**
   * Creates a public presentation which can be sent to a verifier.
   *
   * @param publicAttributes All properties of the stream which have been requested by the verifier and therefore must be publicly presented.
   * If kept empty, we hide all attributes inside the stream for the presentation.
   *
   * @returns A deep copy of the MarkedStream with all but `publicAttributes` removed.
   */

  public createPresentation({
    showAttributes,
    hideAttributes = [],
    signer,
    request,
  }: IPresentationOptions & Partial<IPresentationSigningOptions> = {}):
    | Presentation
    | SignedPresentation {
    const allAttributes = Array.from(this.getAttributes())
    const excludedProperties = showAttributes
      ? allAttributes.filter((i) => !showAttributes.includes(i))
      : []
    excludedProperties.push(...hideAttributes)
    const deepCopy = new Credential(JSON.parse(JSON.stringify(this)))

    deepCopy.request.removeContentProperties(excludedProperties)
    const signingOpts = request && signer ? { request, signer } : undefined
    return Presentation.fromCredentials([deepCopy], signingOpts)
  }

  /**
   * Compresses an [[MarkedStream]] object.
   *
   * @returns An array that contains the same properties of an [[MarkedStream]].
   */
  public compress(): CompressedCredential {
    return CredentialUtils.compress(this)
  }

  /**
   * [STATIC] Builds an [[MarkedStream]] from the decompressed array.
   *
   * @param markedStream The [[CompressedMarkedStream]] that should get decompressed.
   * @returns A new [[MarkedStream]] object.
   */
  public static decompress(cred: CompressedCredential): Credential {
    const decompressedCredential = CredentialUtils.decompress(cred)
    return Credential.fromCredential(decompressedCredential)
  }
}
