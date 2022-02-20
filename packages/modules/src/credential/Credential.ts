/**
 * In CORD, an [[MarkedStream]] is a **credential**, which a Holder can store locally and share with Verifiers as they wish.
 *
 * Once a [[RequestForMark]] has been made, the [[Stream]] can be built and the Issuer submits it wrapped in an [[MarkedStream]] object.
 * This [[MarkedStream]] also contains the original request for mark.
 * RequestForMark also exposes a [[createPresentation]] method, that can be used by the holder to hide some specific information from the verifier for more privacy.
 *
 * @packageDocumentation
 * @module ContentStream
 */

import type {
  ICredential,
  CompressedCredential,
  IStream,
  IContentStream,
  IPresentationOptions,
  IPresentationSigningOptions,
} from '@cord.network/api-types'
import { SDKErrors } from '@cord.network/utils'
import { Stream } from '../stream/Stream.js'
import { ContentStream } from '../contentstream/ContentStream.js'
import * as CredentialUtils from './Credential.utils.js'
import { Presentation, SignedPresentation } from './Presentation'

export class Credential implements ICredential {
  /**
   * [STATIC] Builds an instance of [[MarkedStream]], from a simple object with the same properties.
   * Used for deserialization.
   *
   * @param markedStreamInput - The base object from which to create the attested stream.
   * @returns A new instantiated [[MarkedStream]] object.
   * @example ```javascript
   * // create an MarkedStream object, so we can call methods on it (`serialized` is a serialized MarkedStream object)
   * MarkedStream.fromMarkedStream(JSON.parse(serialized));
   * ```
   */
  public static fromCredential(credStream: ICredential): Credential {
    return new Credential(credStream)
  }

  /**
   * [STATIC] Builds a new instance of [[MarkedStream]], from all required properties.
   *
   * @param request - The request for mark for the stream that was attested.
   * @param mark - The mark for the stream by the issuer.
   * @returns A new [[MarkedStream]] object.
   * @example ```javascript
   * // create an MarkedStream object after receiving the mark from the issuer
   * MarkedStream.fromRequestAndMark(request, mark);
   * ```
   */
  public static fromStreamProperties(
    request: IContentStream,
    content: IStream
  ): Credential {
    return new Credential({
      request,
      content,
    })
  }

  /**
   *  [STATIC] Custom Type Guard to determine input being of type IMarkedStream using the MarkedStreamUtils errorCheck.
   *
   * @param input The potentially only partial IMarkedStream.
   *
   * @returns Boolean whether input is of type IMarkedStream.
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
  public content: Stream

  /**
   * Builds a new [[MarkedStream]] instance.
   *
   * @param markedStreamInput - The base object with all required input, from which to create the attested stream.
   * @example ```javascript
   * // Create an `MarkedStream` upon successful `Stream` creation:
   * const credential = new MarkedStream(markedStreamInput);
   * ```
   */
  public constructor(credStream: ICredential) {
    CredentialUtils.errorCheck(credStream)
    this.request = ContentStream.fromRequest(credStream.request)
    this.content = Stream.fromStream(credStream.content)
  }

  /**
   * (ASYNC) Verifies whether the attested stream is valid. It is valid if:
   * * the data is valid (see [[verifyData]]);
   * and
   * * the [[Stream]] object for this attested stream is valid (see [[Stream.checkValidity]], where the **chain** is queried).
   *
   * Upon presentation of an attested stream, a verifier would call this [[verify]] function.
   *
   * @param markedStream - The attested stream to check for validity.
   * @returns A promise containing whether this attested stream is valid.
   * @example ```javascript
   * markedStream.verify().then((isVerified) => {
   *   // `isVerified` is true if the mark is verified, false otherwise
   * });
   * ```
   */
  public static async verify(credStream: ICredential): Promise<boolean> {
    return (
      Credential.verifyData(credStream) &&
      Stream.checkValidity(credStream.content)
    )
  }

  public async verify(): Promise<boolean> {
    return Credential.verify(this)
  }

  /**
   * Verifies whether the data of the given attested stream is valid. It is valid if:
   * * the [[RequestForMark]] object associated with this attested stream has valid data (see [[RequestForMark.verifyData]]);
   * and
   * * the hash of the [[RequestForMark]] object for the attested stream, and the hash of the [[Stream]] for the attested stream are the same.
   *
   * @param markedStream - The attested stream to verify.
   * @returns Whether the attested stream's data is valid.
   * @example ```javascript
   * const verificationResult = markedStream.verifyData();
   * ```
   */
  public static verifyData(credStream: ICredential): boolean {
    if (credStream.request.content.schemaId !== credStream.content.schemaId)
      return false
    return (
      credStream.request.contentHash === credStream.content.streamHash &&
      ContentStream.verifyData(credStream.request)
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
  public static validateProofs(proofs: ICredential[]): boolean {
    proofs.forEach((proof: ICredential) => {
      if (!Credential.verifyData(proof)) {
        throw SDKErrors.ERROR_LEGITIMATIONS_UNVERIFIABLE()
      }
    })
    return true
  }

  /**
   * Gets the hash of the stream that corresponds to this mark.
   *
   * @returns The hash of the stream for this mark (streamHash).
   * @example ```javascript
   * mark.getHash();
   * ```
   */
  public getHash(): string {
    return this.content.streamHash
  }

  public getId(): string {
    return this.content.streamId
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
  public static decompress(credStream: CompressedCredential): Credential {
    const decompressedCredential = CredentialUtils.decompress(credStream)
    return Credential.fromCredential(decompressedCredential)
  }
}
