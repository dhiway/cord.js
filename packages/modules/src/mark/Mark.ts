/**
 * In CORD, a [[Mark]] is a **stream**, which a Holder can store locally and share with Verifiers as they wish.
 *
 * Once a request for Mark has been made, the [[Stream]] can be built and the Issuer submits it wrapped in a [[Mark]] object.
 * This [[Mark]] also contains the original request.
 * Mark also exposes a [[createPresentation]] method, that can be used by the holder to hide some specific information from the verifier for more privacy.
 *
 * @packageDocumentation
 * @module Mark
 */

import type {
  IMark,
  CompressedMark,
  IMarkContent,
  IPresentationOptions,
  IPresentationSigningOptions,
  IStreamDetails,
} from '@cord.network/api-types'
import { SDKErrors, Identifier } from '@cord.network/utils'
import { StreamDetails } from '../stream/Stream.js'
import { MarkContent } from '../markcontent/MarkContent.js'
import * as MarkUtils from './Mark.utils.js'
import { Presentation, SignedPresentation } from './Presentation'
import { SCHEMA_PREFIX } from '@cord.network/api-types'

export class Mark implements IMark {
  /**
   * [STATIC] Builds an instance of [[Mark]], from a simple object with the same properties.
   * Used for deserialization.
   *
   * @param markStreamInput - The base object from which to create the Mark.
   * @returns A new instantiated [[Mark]] object.
   * @example ```javascript
   * // create a Mark object, so we can call methods on it (`serialized` is a serialized Mark object)
   * Mark.fromMark(JSON.parse(serialized));
   * ```
   */
  public static fromMark(markStream: IMark): Mark {
    return new Mark(markStream)
  }

  /**
   * [STATIC] Builds a new instance of [[Mark]], from all required properties.
   *
   * @param request - The request for mark for the stream that was anchored.
   * @param content - The mark stream from the issuer.
   * @returns A new [[Mark]] object.
   * @example ```javascript
   * // create an Mark object after receiving the mark from the issuer
   * Mark.fromMarkContentStream(request, content);
   * ```
   */
  public static fromMarkContentStream(
    request: IMarkContent,
    content: IStreamDetails
  ): Mark {
    return new Mark({
      request,
      content,
    })
  }

  /**
   *  [STATIC] Custom Type Guard to determine input being of type IMark using the MarkUtils errorCheck.
   *
   * @param input The potentially only partial IMark.
   *
   * @returns Boolean whether input is of type IMark.
   */
  public static isIMark(input: unknown): input is IMark {
    try {
      MarkUtils.errorCheck(input as IMark)
    } catch (error) {
      return false
    }
    return true
  }

  public request: MarkContent
  public content: StreamDetails

  /**
   * Builds a new [[Mark]] instance.
   *
   * @param markStream - The base object with all required input, from which to create the Mark.
   * @example ```javascript
   * // Create an `Mark` upon successful `Stream` creation:
   * const credential = new MarkedStream(markedStreamInput);
   * ```
   */
  public constructor(markStream: IMark) {
    MarkUtils.errorCheck(markStream)
    this.request = MarkContent.fromMarkContent(markStream.request)
    this.content = StreamDetails.fromStreamDetails(markStream.content)
  }

  /**
   * (ASYNC) Verifies whether the mark stream is valid. It is valid if:
   * * the data is valid (see [[verifyData]]);
   * and
   * * the [[Stream]] object for this stream is valid (see [[Stream.checkValidity]], where the **chain** is queried).
   *
   * Upon presentation of a stream, a verifier would call this [[verify]] function.
   *
   * @param markedStream - The stream to check for validity.
   * @returns A promise containing whether this attested stream is valid.
   * @example ```javascript
   * markedStream.verify().then((isVerified) => {
   *   // `isVerified` is true if the mark is verified, false otherwise
   * });
   * ```
   */
  public static async verify(markStream: IMark): Promise<boolean> {
    return (
      Mark.verifyData(markStream) &&
      StreamDetails.checkValidity(markStream.content)
    )
  }

  public async verify(): Promise<boolean> {
    return Mark.verify(this)
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
  public static verifyData(markStream: IMark): boolean {
    const schemaId = markStream.request.content.schemaId
      ? Identifier.getIdentifierKey(
          markStream.request.content.schemaId,
          SCHEMA_PREFIX
        )
      : null
    if (schemaId !== markStream.content.schemaId) return false
    return (
      markStream.request.rootHash === markStream.content.streamHash &&
      MarkContent.verifyData(markStream.request)
    )
  }

  public verifyData(): boolean {
    return Mark.verifyData(this)
  }

  /**
   *  [STATIC] Verifies the data of each element of the given Array of IMarkedStreams.
   *
   * @param legitimations Array of IMarkedStreams to validate.
   * @throws [[ERROR_LEGITIMATIONS_UNVERIFIABLE]] when one of the IMarkedStreams data is unable to be verified.
   *
   * @returns Boolean whether each element of the given Array of IMarkedStreams is verifiable.
   */
  public static validateProofs(proofs: IMark[]): boolean {
    proofs.forEach((proof: IMark) => {
      if (!Mark.verifyData(proof)) {
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
    const deepCopy = new Mark(JSON.parse(JSON.stringify(this)))

    deepCopy.request.removeContentProperties(excludedProperties)
    const signingOpts = request && signer ? { request, signer } : undefined
    return Presentation.fromCredentials([deepCopy], signingOpts)
  }

  /**
   * Compresses an [[MarkedStream]] object.
   *
   * @returns An array that contains the same properties of an [[MarkedStream]].
   */
  public compress(): CompressedMark {
    return MarkUtils.compress(this)
  }

  /**
   * [STATIC] Builds an [[MarkedStream]] from the decompressed array.
   *
   * @param markedStream The [[CompressedMarkedStream]] that should get decompressed.
   * @returns A new [[MarkedStream]] object.
   */
  public static decompress(markStream: CompressedMark): Mark {
    const decompressedCredential = MarkUtils.decompress(markStream)
    return Mark.fromMark(decompressedCredential)
  }
}
