// /**
//  * @packageDocumentation
//  * @module CredentialUtils
//  */

// import type {
//   ICredential,
//   CompressedCredential,
//   ISchema,
// } from '@cord.network/types'
// import { SDKErrors } from '@cord.network/utils'
// import * as StreamUtils from '../stream/Stream.utils.js'
// import * as MarkContentUtils from '../contentstream/ContentStream.utils.js'
// import { Credential } from './Credential.js'
// import * as SchemaUtils from '../schema/Schema.utils.js'
// /**
//  *  Checks whether the input meets all the required criteria of an IMarkedStream object.
//  *  Throws on invalid input.
//  *
//  * @param input The potentially only partial IMarkedStream.
//  * @throws [[ERROR_MARK_NOT_PROVIDED]] or [[ERROR_RFA_NOT_PROVIDED]] when input's credential and content respectively do not exist.
//  * @throws [[ERROR_STREAM_UNVERIFIABLE]] when input's data could not be verified.
//  *
//  */
// export function errorCheck(input: ICredential): void {
//   if (input.stream) {
//     StreamUtils.errorCheck(input.stream)
//   } else throw new SDKErrors.ERROR_CONTENT_NOT_PROVIDED()

//   if (input.request) {
//     MarkContentUtils.errorCheck(input.request)
//   } else throw new SDKErrors.ERROR_MC_NOT_PROVIDED()

//   if (!Credential.verifyData(input as ICredential)) {
//     throw new SDKErrors.ERROR_CONTENT_UNVERIFIABLE()
//   }
// }

// /**
//  *  Compresses an [[MarkedStream]] object into an array for storage and/or messaging.
//  *
//  * @param markedStream An [[MarkedStream]] that will be sorted and stripped for messaging or storage.
//  *
//  * @returns An ordered array of an [[MarkedStream]] that comprises of an [[Credential]] and [[RequestForMark]] arrays.
//  */

// export function compress(stream: ICredential): CompressedCredential {
//   errorCheck(stream)

//   return [
//     MarkContentUtils.compress(stream.request),
//     StreamUtils.compress(stream.stream),
//   ]
// }

// /**
//  *  Decompresses an [[MarkedStream]] array from storage and/or message into an object.
//  *
//  * @param markedStream A compressed [[Credential]] and [[RequestForMark]] array that is reverted back into an object.
//  * @throws [[ERROR_DECOMPRESSION_ARRAY]] when markedStream is not an Array or it's length is unequal 2.
//  *
//  * @returns An object that has the same properties as an [[MarkedStream]].
//  */

// export function decompress(stream: CompressedCredential): ICredential {
//   if (!Array.isArray(stream) || stream.length !== 2) {
//     throw new SDKErrors.ERROR_DECOMPRESSION_ARRAY('Cord Credential')
//   }
//   return {
//     request: MarkContentUtils.decompress(stream[0]),
//     stream: StreamUtils.decompress(stream[1]),
//   }
// }

// /**
//  *  Checks the [[Credential]] with a given [[SchemaType]] to check if the claim meets the [[schema]] structure.
//  *
//  * @param credential A [[Credential]] object of an attested claim used for verification.
//  * @param schema A [[Schema]] to verify the [[Content]] structure.
//  *
//  * @returns A boolean if the [[Content]] structure in the [[Credential]] is valid.
//  */

// export function verifyStructure(
//   credential: ICredential,
//   schema: ISchema
// ): boolean {
//   errorCheck(credential)
//   return SchemaUtils.verifyContentProperties(
//     credential.request.content.contents,
//     schema.schema
//   )
// }
