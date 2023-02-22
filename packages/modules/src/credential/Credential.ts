import {
  isDidSignature,
  verifyDidSignature,
  resolveKey,
  signatureToJson,
  signatureFromJson,
} from '@cord.network/did'
import type {
  DidResolveKey,
  Hash,
  ICredential,
  IStream,
  IContent,
  ICredentialPresentation,
  ISchema,
  SignCallback,
} from '@cord.network/types'
import { Crypto, SDKErrors, DataUtils } from '@cord.network/utils'
import * as Content from '../content/index.js'
import { hashContents } from '../content/index.js'

import { verifyContentAganistSchema } from '../schema/Schema.js'
import { STREAM_IDENTIFIER, STREAM_PREFIX } from '@cord.network/types'
import { Identifier } from '@cord.network/utils'

function getHashRoot(leaves: Uint8Array[]): Uint8Array {
  const result = Crypto.u8aConcat(...leaves)
  return Crypto.hash(result)
}

function getHashLeaves(
  contentHashes: Hash[],
  evidenceIds: ICredential[]
): Uint8Array[] {
  const result = contentHashes.map((item) => Crypto.coToUInt8(item))

  if (evidenceIds) {
    evidenceIds.forEach((evidence) => {
      result.push(Crypto.coToUInt8(evidence.identifier))
    })
  }
  return result
}

/**
 * Calculates the root hash of the credential.
 *
 * @param credential The credential object.
 * @returns The hash.
 */

export function calculateRootHash(credential: Partial<ICredential>): Hash {
  const hashes = getHashLeaves(
    credential.contentHashes || [],
    credential.evidenceIds || []
  )
  const root = getHashRoot(hashes)
  return Crypto.u8aToHex(root)
}

/**
 * Removes [[Content] properties from the [[ContentStream]] object, provides anonymity and security when building the [[createPresentation]] method.
 *
 * @param credential - The credential object to remove properties from.
 * @param properties - Properties to remove from the [[Content]] object.
 * @returns A cloned Stream with removed properties.
 */
export function removeContentProperties(
  credential: ICredential,
  properties: string[]
): ICredential {
  const presentation: ICredential =
    // clone the credential because properties will be deleted later.
    // TODO: find a nice way to clone stuff
    JSON.parse(JSON.stringify(credential))

  properties.forEach((key) => {
    delete presentation.content.contents[key]
  })
  presentation.contentNonceMap = hashContents(presentation.content, {
    nonces: presentation.contentNonceMap,
  }).nonceMap

  return presentation
}

/**
 * Prepares credential data for signing.
 *
 * @param input - The Stream to prepare the data for.
 * @param challenge - An optional challenge to be included in the signing process.
 * @returns The prepared signing data as Uint8Array.
 */
export function makeSigningData(
  input: ICredential,
  challenge?: string
): Uint8Array {
  return new Uint8Array([
    ...Crypto.coToUInt8(input.rootHash),
    ...Crypto.coToUInt8(challenge),
  ])
}

// export async function verifySignature(
//   content: IContentStream,
//   {
//     challenge,
//   }: {
//     challenge?: string
//   } = {}
// ): Promise<boolean> {
//   const { signatureProof } = content
//   if (!signatureProof) return false
//   const signingData = makeSigningData(content, challenge)
//   const verified = Crypto.verify(
//     signingData,
//     signatureProof.signature,
//     signatureProof.keyId
//   )
//   return verified
// }

export function verifyRootHash(input: ICredential): void {
  if (input.rootHash !== calculateRootHash(input))
    throw new SDKErrors.RootHashUnverifiableError()
}

/**
 * Verifies the data of the [[ContentStream]] object; used to check that the data was not tampered with, by checking the data against hashes.
 *
 * @param input - The [[Stream]] for which to verify data.
 */

export function verifyDataIntegrity(input: ICredential): void {
  // check claim hash
  verifyRootHash(input)

  // verify properties against selective disclosure proof
  Content.verifyDisclosedAttributes(input.content, {
    nonces: input.contentNonceMap,
    hashes: input.contentHashes,
  })

  // check legitimations
  input.evidenceIds.forEach(verifyDataIntegrity)
}

/**
 *  Checks whether the input meets all the required criteria of an ICredential object.
 *  Throws on invalid input.
 *
 * @param input - A potentially only partial [[ICredential]].
 *
 */
export function verifyDataStructure(input: ICredential): void {
  if (!('content' in input)) {
    throw new SDKErrors.ContentMissingError()
  } else {
    Content.verifyDataStructure(input.content)
  }
  if (!input.content.holder) {
    throw new SDKErrors.HolderMissingError()
  }
  if (!Array.isArray(input.evidenceIds)) {
    throw new SDKErrors.EvidenceMissingError()
  }
  if (!('contentNonceMap' in input)) {
    throw new SDKErrors.ContentNonceMapMissingError()
  }
  if (typeof input.contentNonceMap !== 'object')
    throw new SDKErrors.ContentNonceMapMalformedError()
  Object.entries(input.contentNonceMap).forEach(([digest, nonce]) => {
    DataUtils.verifyIsHex(digest, 256)
    if (!digest || typeof nonce !== 'string' || !nonce)
      throw new SDKErrors.ContentNonceMapMalformedError()
  })
  if (!('contentHashes' in input)) {
    throw new SDKErrors.DataStructureError('content hashes not provided')
  }
}

/**
 *  Checks the [[Stream]] with a given [[SchemaType]] to check if the claim meets the [[schema]] structure.
 *
 * @param contentStream A [[Stream]] object of an anchored content used for verification.
 * @param schema A [[Schema]] to verify the [[Content]] structure.
 */

export function verifyAgainstSchema(
  credential: ICredential,
  schema: ISchema
): void {
  verifyDataStructure(credential)
  verifyContentAganistSchema(credential.content.contents, schema)
}

/**
 * Verifies the signature of the [[ICredentialPresentation]].
 * the signature over the presentation **must** be generated with the DID in order for the verification to be successful.
 *
 * @param input - The [[IPresentation]].
 * @param verificationOpts Additional verification options.
 * @param verificationOpts.didResolveKey - The function used to resolve the claimer's key. Defaults to [[resolveKey]].
 * @param verificationOpts.challenge - The expected value of the challenge. Verification will fail in case of a mismatch.
 */
export async function verifySignature(
  input: ICredentialPresentation,
  {
    challenge,
    didResolveKey = resolveKey,
  }: {
    challenge?: string
    didResolveKey?: DidResolveKey
  } = {}
): Promise<void> {
  const { claimerSignature } = input
  if (challenge && challenge !== claimerSignature.challenge)
    throw new SDKErrors.SignatureUnverifiableError(
      'Challenge differs from expected'
    )

  const signingData = makeSigningData(input, claimerSignature.challenge)
  await verifyDidSignature({
    ...signatureFromJson(claimerSignature),
    message: signingData,
    // check if credential owner matches signer
    expectedSigner: input.content.holder,
    expectedVerificationMethod: 'authentication',
    didResolveKey,
  })
}

export type Options = {
  evidenceIds?: ICredential[]
  swarm?: ICredential['swarm']
}

/**
 * Builds a new  [[ICredential]] object, from a complete set of required parameters.
 *
 * @param content An `IContent` object to build the credential for.
 * @param option Container for different options that can be passed to this method.
 * @param option.evidenceIds Array of [[Credential]] objects the Issuer include as evidenceIds.
 * @param option.link Identifier of the credential this credential is linked to.
 * @param option.space Identifier of the space this credential is linked to.
 * @returns A new [[ICredential]] object.
 */
export function fromContent(
  content: IContent,
  { evidenceIds, swarm }: Options = {}
): ICredential {
  const { hashes: contentHashes, nonceMap: contentNonceMap } =
    Content.hashContents(content)

  const rootHash = calculateRootHash({
    evidenceIds,
    contentHashes,
  })

  const credential = {
    content,
    contentHashes,
    contentNonceMap,
    evidenceIds: evidenceIds || [],
    swarm: swarm || null,
    rootHash,
    identifier: Identifier.hashToUri(
      rootHash,
      STREAM_IDENTIFIER,
      STREAM_PREFIX
    ),
  }
  verifyDataStructure(credential)
  return credential
}

type VerifyOptions = {
  schema?: ISchema
  challenge?: string
  didResolveKey?: DidResolveKey
}

/**
 * Verifies data structure & data integrity of a credential object.
 *
 * @param credential - The object to check.
 * @param options - Additional parameter for more verification steps.
 * @param options.schema - Schema to be checked against.
 */
export async function verifyCredential(
  credential: ICredential,
  { schema }: VerifyOptions = {}
): Promise<void> {
  verifyDataStructure(credential)
  verifyDataIntegrity(credential)

  if (schema) {
    verifyAgainstSchema(credential, schema)
  }
}

/**
 * Verifies data structure, data integrity and the holder's signature of a credential presentation.
 *
 * Upon presentation of a credential, a verifier would call this function.
 *
 * @param presentation - The object to check.
 * @param options - Additional parameter for more verification steps.
 * @param options.schema - Schema which the included claim should be checked against.
 * @param options.challenge -  The expected value of the challenge. Verification will fail in case of a mismatch.
 * @param options.didResolveKey - The function used to resolve the holders's key. Defaults to [[resolveKey]].
 */
export async function verifyPresentation(
  presentation: ICredentialPresentation,
  { schema, challenge, didResolveKey = resolveKey }: VerifyOptions = {}
): Promise<void> {
  await verifyCredential(presentation, { schema })
  await verifySignature(presentation, {
    challenge,
    didResolveKey,
  })
}

/**
 * Type Guard to determine input being of type [[ICredential]].
 *
 * @param input - A potentially only partial [[ICredential]].
 *
 * @returns  Boolean whether input is of type ICredential.
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
 * Type Guard to determine input being of type [[ICredentialPresentation]].
 *
 * @param input - An [[ICredential]], [[ICredentialPresentation]], or other object.
 *
 * @returns  Boolean whether input is of type ICredentialPresentation.
 */
export function isPresentation(
  input: unknown
): input is ICredentialPresentation {
  return (
    isICredential(input) &&
    isDidSignature((input as ICredentialPresentation).claimerSignature)
  )
}

/**
 * Gets the hash of the credential.
 *
 * @param credential - The credential to get the hash from.
 * @returns The hash of the credential.
 */
export function getHash(credential: ICredential): IStream['streamHash'] {
  return credential.rootHash
}

/**
 * Gets names of the credential’s attributes.
 *
 * @param credential The credential.
 * @returns The set of names.
 */
function getAttributes(credential: ICredential): Set<string> {
  return new Set(Object.keys(credential.content.contents))
}

/**
 * Creates a public presentation which can be sent to a verifier.
 * This presentation is signed.
 *
 * @param presentationOptions The additional options to use upon presentation generation.
 * @param presentationOptions.credential The credential to create the presentation for.
 * @param presentationOptions.signCallback The callback to sign the presentation.
 * @param presentationOptions.selectedAttributes All properties of the credential which have been requested by the verifier and therefore must be publicly presented.
 * @param presentationOptions.challenge Challenge which will be part of the presentation signature.
 * If not specified, all attributes are shown. If set to an empty array, we hide all attributes inside the claim for the presentation.
 * @returns A deep copy of the Credential with selected attributes.
 */
export async function createPresentation({
  credential,
  signCallback,
  selectedAttributes,
  challenge,
}: {
  credential: ICredential
  signCallback: SignCallback
  selectedAttributes?: string[]
  challenge?: string
}): Promise<ICredentialPresentation> {
  // filter attributes that are not in requested attributes
  const excludedClaimProperties = selectedAttributes
    ? Array.from(getAttributes(credential)).filter(
        (property) => !selectedAttributes.includes(property)
      )
    : []

  // remove these attributes
  const presentation = removeContentProperties(
    credential,
    excludedClaimProperties
  )

  const signature = await signCallback({
    data: makeSigningData(presentation, challenge),
    did: credential.content.holder,
    keyRelationship: 'authentication',
  })

  return {
    ...presentation,
    claimerSignature: {
      ...signatureToJson(signature),
      ...(challenge && { challenge }),
    },
  }
}
