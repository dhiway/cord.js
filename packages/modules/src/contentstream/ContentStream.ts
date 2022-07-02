import type {
  IContentStream,
  CompressedContentStream,
  Hash,
  IContent,
  ISchema,
  ICredential,
  CompressedCredential,
  IPublicIdentity,
} from '@cord.network/types'
import { Crypto, SDKErrors, DataUtils } from '@cord.network/utils'
import * as Content from '../content/Content.js'
import * as Credential from '../credential/Credential.js'
import { Identity } from '../identity/Identity.js'
import {
  STREAM_IDENTIFIER,
  STREAM_PREFIX,
  DEFAULT_STREAM_VALIDITY,
} from '@cord.network/types'
import { Identifier } from '@cord.network/utils'
import { verifyContentWithSchema } from '../schema/Schema.js'
import { HexString } from '@polkadot/util/types'

export function makeSigningData(
  input: IContentStream,
  challenge?: string | null
): Uint8Array {
  return new Uint8Array([
    ...Crypto.coToUInt8(input.rootHash),
    ...Crypto.coToUInt8(challenge),
  ])
}

export async function verifySignature(
  content: IContentStream,
  {
    challenge,
  }: {
    challenge?: string
  } = {}
): Promise<boolean> {
  const { signatureProof } = content
  if (!signatureProof) return false
  const signingData = makeSigningData(content, challenge)
  const verified = Crypto.verify(
    signingData,
    signatureProof.signature,
    signatureProof.keyId
  )
  return verified
}

function getHashRoot(leaves: Uint8Array[]): Uint8Array {
  const result = Crypto.u8aConcat(...leaves)
  return Crypto.hash(result)
}

function getHashLeaves(
  contentHashes: Hash[],
  evidenceIds: ICredential[],
  issueDate: string,
  expiryDate: string
): Uint8Array[] {
  const result: Uint8Array[] = []
  contentHashes.forEach((item) => {
    result.push(Crypto.coToUInt8(item))
  })
  if (evidenceIds) {
    evidenceIds.forEach((evidence) => {
      result.push(Crypto.coToUInt8(evidence.request.identifier))
    })
  }
  result.push(Crypto.coToUInt8(issueDate))
  result.push(Crypto.coToUInt8(expiryDate))
  return result
}

export function calculateRootHash(
  credential: Partial<IContentStream>,
  issuanceDate: HexString,
  expirationDate: HexString
): Hash {
  const hashes: Uint8Array[] = getHashLeaves(
    credential.contentHashes || [],
    credential.evidenceIds || [],
    issuanceDate,
    expirationDate
  )
  const root: Uint8Array = getHashRoot(hashes)
  return Crypto.u8aToHex(root)
}

export function addSignature(
  request: IContentStream,
  sig: string | Uint8Array,
  keyId: IPublicIdentity['address'],
  {
    challenge,
  }: {
    challenge?: string
  } = {}
): void {
  const signature = typeof sig === 'string' ? sig : Crypto.u8aToHex(sig)
  request.signatureProof = { keyId, signature }
}

export function signWithKey(
  request: IContentStream,
  signer: Identity,
  challenge?: string
): void {
  const signature = signer.signStr(makeSigningData(request, challenge))
  addSignature(request, signature, signer.address, { challenge })
}

/**
 * Removes [[Content] properties from the [[ContentStream]] object, provides anonymity and security when building the [[createPresentation]] method.
 *
 * @param contentStram - The ContentStream object to remove properties from.
 * @param properties - Properties to remove from the [[Stream]] object.
 * @throws [[ERROR_CONTENT_HASHTREE_MISMATCH]] when a property which should be deleted wasn't found.
 *
 */
export function removeContentProperties(
  contentStram: IContentStream,
  properties: string[]
): void {
  properties.forEach((key) => {
    delete contentStram.content.contents[key]
  })
  contentStram.contentNonceMap = Content.hashContents(contentStram.content, {
    nonces: contentStram.contentNonceMap,
  }).nonceMap
}

export function verifyRootHash(input: IContentStream): boolean {
  const issuanceDateHash = Crypto.hashObjectAsHexStr(input.issuanceDate)
  const expirationDateHash = Crypto.hashObjectAsHexStr(input.expirationDate)
  return (
    input.rootHash ===
    calculateRootHash(input, issuanceDateHash, expirationDateHash)
  )
}

/**
 * Verifies the data of the [[ContentStream]] object; used to check that the data was not tampered with, by checking the data against hashes.
 *
 * @param input - The [[ContentStream]] for which to verify data.
 * @returns Whether the data is valid.
 * @throws [[ERROR_CONTENT_NONCE_MAP_MALFORMED]] when any key of the stream marks could not be found in the streamHashTree.
 * @throws [[ERROR_ROOT_HASH_UNVERIFIABLE]] or [[ERROR_SIGNATURE_UNVERIFIABLE]] when either the rootHash or the signature are not verifiable respectively.
 *
 */
export function verifyDataIntegrity(input: IContentStream): boolean {
  // check stream hash
  if (!verifyRootHash(input)) {
    throw new SDKErrors.ERROR_ROOT_HASH_UNVERIFIABLE()
  }
  // check signature
  if (!verifySignature(input)) {
    throw new SDKErrors.ERROR_SIGNATURE_UNVERIFIABLE()
  }

  // verify properties against selective disclosure proof
  const verificationResult = Content.verifyDisclosedAttributes(input.content, {
    nonces: input.contentNonceMap,
    hashes: input.contentHashes,
  })
  // TODO: how do we want to deal with multiple errors during stream verification?
  if (!verificationResult.verified)
    throw (
      verificationResult.errors[0] || new SDKErrors.ERROR_CONTENT_UNVERIFIABLE()
    )

  // check proofs
  Credential.validateEvidenceIds(input.evidenceIds)

  return true
}

/**
 *  Checks whether the input meets all the required criteria of an IContentStream object.
 *  Throws on invalid input.
 *
 * @param input - A potentially only partial [[IContentStream]].
 *
 */
export function verifyDataStructure(input: IContentStream): void {
  if (!input.content) {
    throw new SDKErrors.ERROR_CONTENT_NOT_PROVIDED()
  } else {
    Content.verifyDataStructure(input.content)
  }
  if (!input.content.issuer) {
    throw new SDKErrors.ERROR_OWNER_NOT_PROVIDED()
  }
  if (!input.evidenceIds && !Array.isArray(input.evidenceIds)) {
    throw new SDKErrors.ERROR_EVIDENCE_ID_NOT_PROVIDED()
  }
  if (!input.contentNonceMap) {
    throw new SDKErrors.ERROR_CONTENT_NONCE_MAP_NOT_PROVIDED()
  }
  if (
    typeof input.contentNonceMap !== 'object' ||
    Object.entries(input.contentNonceMap).some(
      ([digest, nonce]) =>
        !digest ||
        !DataUtils.validateHash(digest, 'statement digest') ||
        typeof nonce !== 'string' ||
        !nonce
    )
  ) {
    throw new SDKErrors.ERROR_CONTENT_NONCE_MAP_MALFORMED()
  }
}

/**
 *  Checks the [[ContentStream]] with a given [[SchemaType]] to check if the claim meets the [[schema]] structure.
 *
 * @param contentStream A [[ContentStream]] object of an attested claim used for verification.
 * @param schema A [[Schema]] to verify the [[Content]] structure.
 *
 * @returns A boolean if the [[Content]] structure in the [[Credential]] is valid.
 */

export function verifyWithSchema(
  contentStream: IContentStream,
  schema: ISchema
): boolean {
  try {
    verifyDataStructure(contentStream)
  } catch {
    return false
  }
  return verifyContentWithSchema(contentStream.content.contents, schema.schema)
}

export type Options = {
  evidenceIds?: ICredential[]
  link?: IContentStream['link']
  space?: IContentStream['space']
  expiry?: Date
}

/**
 * Builds a new i [[ContentStream]] object, from a complete set of required parameters.
 *
 * @param content An `IContentStream` object the request for credential is built for.
 * @param issuer The Issuer's [[Identity]].
 * @param option Container for different options that can be passed to this method.
 * @param option.evidenceIds Array of [[Credential]] objects the Issuer include as evidenceIds.
 * @param option.link Identifier of the stream this credential is linked to.
 * @param option.space Identifier of the space this credential is linked to.
 * @throws [[ERROR_IDENTITY_MISMATCH]] when streamInput's issuer address does not match the supplied identity's address.
 * @returns A new [[ContentStream]] object.
 */
export function fromContent(
  content: IContent,
  issuer: Identity,
  { evidenceIds, link, space, expiry }: Options = {}
): IContentStream {
  if (content.issuer !== issuer.address) {
    throw new SDKErrors.ERROR_IDENTITY_MISMATCH()
  }

  const { hashes: contentHashes, nonceMap: contentNonceMap } =
    Content.hashContents(content)

  const issuanceDate = new Date()
  const issuanceDateString = issuanceDate.toISOString()
  const issuanceDateHash = Crypto.hashObjectAsHexStr(issuanceDateString)
  const expirationDate =
    expiry ||
    new Date(
      issuanceDate.setFullYear(
        issuanceDate.getFullYear() + DEFAULT_STREAM_VALIDITY
      )
    )
  const expirationDateString = expirationDate.toISOString()
  const expirationDateHash = Crypto.hashObjectAsHexStr(expirationDateString)

  const rootHash = calculateRootHash(
    {
      evidenceIds,
      contentHashes,
    },
    issuanceDateHash,
    expirationDateHash
  )

  const contentStream = {
    content,
    contentHashes,
    contentNonceMap,
    evidenceIds: evidenceIds || [],
    link: link || null,
    space: space || null,
    rootHash,
    issuanceDate: issuanceDateString,
    expirationDate: expirationDateString,
    identifier: Identifier.getIdentifier(
      rootHash,
      STREAM_IDENTIFIER,
      STREAM_PREFIX
    ),
  }
  signWithKey(contentStream, issuer)

  verifyDataStructure(contentStream)
  return contentStream
}

/**
 * Update instance of [[ContentStream]], from a complete set of required parameters.
 *
 * @param content An `IContentStream` object the request for credential is built for.
 * @param issuer The Issuer's [[Identity]].
 * @param option Container for different options that can be passed to this method.
 * @param option.legitimations Array of [[Credential]] objects the Issuer include as legitimations.
 * @throws [[ERROR_IDENTITY_MISMATCH]] when streamInput's issuer address does not match the supplied identity's address.
 * @returns An updated [[ContentStream]] object.
 */
export function updateContent(
  content: IContentStream,
  issuer: Identity,
  { evidenceIds, expiry }: Options = {}
): IContentStream {
  if (content.content.issuer !== issuer.address) {
    throw new SDKErrors.ERROR_IDENTITY_MISMATCH()
  }
  let updateEvidenceIds = evidenceIds || content.evidenceIds

  const { hashes: contentHashes, nonceMap: contentNonceMap } =
    Content.hashContents(content.content)

  const issuanceDate = new Date().toISOString()
  const issuanceDateHash = Crypto.hashObjectAsHexStr(issuanceDate)
  const expirationDate = expiry?.toISOString() || content.expirationDate
  const expirationDateHash = Crypto.hashObjectAsHexStr(expirationDate)

  const rootHash = calculateRootHash(
    {
      evidenceIds: updateEvidenceIds,
      contentHashes,
    },
    issuanceDateHash,
    expirationDateHash
  )

  const contentStream = {
    content: content.content,
    contentHashes,
    contentNonceMap,
    evidenceIds: updateEvidenceIds || content.evidenceIds,
    link: content.link,
    space: content.space,
    rootHash,
    issuanceDate,
    expirationDate,
    identifier: content.identifier,
  }
  signWithKey(contentStream, issuer)
  verifyDataStructure(contentStream)
  return contentStream
}

/**
 * Verifies data structure and integrity.
 *
 * @param contentStream - The object to check.
 * @param options - Additional parameter for more verification step.
 * @param options.ctype - Ctype which the included claim should be checked against.
 * @param options.challenge -  The expected value of the challenge. Verification will fail in case of a mismatch.
 * @param options.resolver - The resolver used to resolve the claimer's identity. Defaults to [[DidResolver]].
 * @throws - If a check fails.
 */
export async function verify(
  contentStream: IContentStream,
  schema?: ISchema,
  challenge?: string
): Promise<void> {
  verifyDataStructure(contentStream)
  verifyDataIntegrity(contentStream)
  const isSignatureCorrect = verifySignature(contentStream, { challenge })
  if (!isSignatureCorrect) throw new SDKErrors.ERROR_SIGNATURE_UNVERIFIABLE()

  if (schema) {
    const isSchemaValid = verifyWithSchema(contentStream, schema)
    if (!isSchemaValid) throw new SDKErrors.ERROR_CREDENTIAL_UNVERIFIABLE()
  }
}

/**
 * Custom Type Guard to determine input being of type IContentStream..
 *
 * @param input - A potentially only partial [[IContentStream]].
 *
 * @returns  Boolean whether input is of type IContentStream.
 */
export function isIContentStream(input: unknown): input is IContentStream {
  try {
    verifyDataStructure(input as IContentStream)
  } catch (error) {
    return false
  }
  return true
}

/**
 *  Compresses [[Credential]]s which are made up from [[Stream]] and [[ContentStream]] for storage and/or message.
 *
 * @param leg An array of [[Credential]] and [[ContentStream]] objects.
 *
 * @returns An ordered array of [[CordMark]]s.
 */

export function compressProof(leg: ICredential[]): CompressedCredential[] {
  return leg.map(Credential.compress)
}

/**
 *  Decompresses [[Credential]]s which are [[Stream]] and [[ContentStream]] from storage and/or message.
 *
 * @param leg A compressed [[Credential]] and [[ContentStream]] array that is reverted back into an object.
 *
 * @returns An object that has the same properties as an [[Credential]].
 */

function decompressProof(leg: CompressedCredential[]): ICredential[] {
  return leg.map(Credential.decompress)
}

/**
 *  Compresses a [[ContentStream]] for storage and/or messaging.
 *
 * @param contentStream A [[ContentStream]] object that will be sorted and stripped for messaging or storage.
 *
 * @returns An ordered array of a [[CompressedContentStream]].
 */

export function compress(
  contentStream: IContentStream
): CompressedContentStream {
  verifyDataStructure(contentStream)
  return [
    Content.compress(contentStream.content),
    contentStream.contentHashes,
    contentStream.contentNonceMap,
    contentStream.signatureProof,
    contentStream.link,
    contentStream.space,
    compressProof(contentStream.evidenceIds),
    contentStream.rootHash,
    contentStream.identifier,
    contentStream.issuanceDate,
    contentStream.expirationDate,
  ]
}
/**
 *  Decompresses a [[ContentStream]] from storage and/or message.
 *
 * @param contentStream A compressed [[ContentStream]] array that is reverted back into an object.
 * @throws [[ERROR_DECOMPRESSION_ARRAY]] when contentStream is not an Array and it's length is not equal to the defined length of 11.
 *
 * @returns An object that has the same properties as a [[ContentStream]].
 */

export function decompress(
  contentStream: CompressedContentStream
): IContentStream {
  if (!Array.isArray(contentStream) || contentStream.length !== 11) {
    throw new SDKErrors.ERROR_DECOMPRESSION_ARRAY('Request for Content Stream')
  }
  return {
    content: Content.decompress(contentStream[0]),
    contentHashes: contentStream[1],
    contentNonceMap: contentStream[2],
    signatureProof: contentStream[3],
    link: contentStream[4],
    space: contentStream[5],
    evidenceIds: decompressProof(contentStream[6]),
    rootHash: contentStream[7],
    identifier: contentStream[8],
    issuanceDate: contentStream[9],
    expirationDate: contentStream[10],
  }
}
