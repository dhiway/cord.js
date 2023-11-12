import {
  isDidSignature,
  verifyDidSignature,
  resolveKey,
  signatureToJson,
  signatureFromJson,
} from '@cord.network/did'
import type {
  DidUri,
  DidResolveKey,
  Hash,
  IDocument,
  IStatement,
  IContent,
  IDocumentPresentation,
  ISchema,
  SignCallback,
  StatementId,
  SpaceId,
  AuthorizationId,
  PresentationOptions,
} from '@cord.network/types'
import {
  Crypto,
  SDKErrors,
  DataUtils,
  jsonabc,
  Identifier,
} from '@cord.network/utils'
import { STATEMENT_IDENT, STATEMENT_PREFIX } from '@cord.network/types'
import { HexString } from '@polkadot/util/types.js'
import { Bytes } from '@polkadot/types'
import type { AccountId, H256 } from '@polkadot/types/interfaces'
import * as Did from '@cord.network/did'
import { blake2AsHex } from '@polkadot/util-crypto'
import { ConfigService } from '@cord.network/config'
import { verifyContentAganistSchema } from '../schema/Schema.js'
import { hashContents } from '../content/index.js'
import * as Content from '../content/index.js'

function getHashRoot(leaves: Uint8Array[]): Uint8Array {
  const result = Crypto.u8aConcat(...leaves)
  return Crypto.hash(result)
}

function getHashLeaves(
  contentHashes: Hash[],
  evidenceIds: IDocument[]
): Uint8Array[] {
  const result = contentHashes.map((item) => Crypto.coToUInt8(item))

  if (evidenceIds.length > 0) {
    evidenceIds.forEach((evidence) => {
      result.push(Crypto.coToUInt8(evidence.identifier))
    })
  }

  return result
}

/**
 * Calculates the root hash of the document.
 *
 * @param document The document object.
 * @returns The document hash.
 */

/**
 * @param document
 */
export function calculateDocumentHash(document: Partial<IDocument>): Hash {
  const hashes = getHashLeaves(
    document.contentHashes || [],
    document.evidenceIds || []
  )
  if (document.issuanceDate) {
    hashes.push(Crypto.coToUInt8(document.issuanceDate))
  }
  if (document.validFrom) {
    hashes.push(Crypto.coToUInt8(document.validFrom))
  }
  if (document.validUntil) {
    hashes.push(Crypto.coToUInt8(document.validUntil))
  }
  const root = getHashRoot(hashes)
  return Crypto.u8aToHex(root)
}

/**
 * Prepares credential data for signing.
 *
 * @param input - The Statement to prepare the data for.
 * @param challenge - An optional challenge to be included in the signing process.
 * @returns The prepared signing data as Uint8Array.
 */
export function makeSigningData(
  input: IDocument,
  challenge?: string
): Uint8Array {
  return new Uint8Array([
    ...Crypto.coToUInt8(input.documentHash),
    ...Crypto.coToUInt8(challenge),
  ])
}

/**
 * @param input
 */
export function verifyDocumentHash(input: IDocument): void {
  if (input.documentHash !== calculateDocumentHash(input))
    throw new SDKErrors.RootHashUnverifiableError()
}

type VerifyOptions = {
  schema?: ISchema
  challenge?: string
  didResolveKey?: DidResolveKey
  selectedAttributes?: string[]
}

/**
 * Verifies the data of the [[ContentStatement]] object; used to check that the data was not tampered with, by checking the data against hashes.
 *
 * @param input - The [[Statement]] for which to verify data.
 */

/**
 * @param input
 * @param root0
 * @param root0.selectedAttributes
 */
export function verifyDataIntegrity(
  input: IDocument,
  { selectedAttributes }: VerifyOptions = {}
): void {
  // check document hash
  verifyDocumentHash(input)

  // verify properties against selective disclosure proof
  if (selectedAttributes) {
    Content.verifyDisclosedAttributes(
      input.content,
      {
        nonces: input.contentNonceMap,
        hashes: input.contentHashes,
      },
      selectedAttributes
    )
  } else {
    Content.verifyDisclosedAttributes(input.content, {
      nonces: input.contentNonceMap,
      hashes: input.contentHashes,
    })
  }

  // TODO - check evidences
  // input.evidenceIds.forEach(verifyDataIntegrity)
}

/**
 *  Checks whether the input meets all the required criteria of an IDocument object.
 *  Throws on invalid input.
 *
 * @param input - A potentially only partial [[IDocument]].
 *
 */
export function verifyDataStructure(input: IDocument): void {
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

// /**
//  * @param input
//  * @param authorizationDetails
//  */
// export function verifyAuthorization(
//   input: IContent,
//   authorizationDetails: AuthorizationId
// ): void {
//   if (input.issuer !== authorizationDetails.delegate) {
//     throw new SDKErrors.IssuerMismatchError()
//   }
//   if (input.schemaId !== authorizationDetails.schema) {
//     throw new SDKErrors.SchemaMismatchError()
//   }
// }

/**
 *  Checks the [[Document]] with a given [[SchemaType]] to check if the claim meets the [[schema]] structure.
 *
 * @param document A [[Document]] object of an anchored content used for verification.
 * @param schema A [[Schema]] to verify the [[Content]] structure.
 */

// export function verifyAgainstSchema(
//   document: IDocument,
//   schema: ISchema
// ): void {
//   verifyDataStructure(document)
//   verifyContentAganistSchema(document.content.contents, schema)
// }

/**
 * .
 * Verifies the signature of the [[IDocumentPresentation]].
 * The signature over the presentation **must** be generated with the DID in order for the verification to be successful.
 *
 * @param input - The [[IPresentation]].
 * @param verificationOpts Additional verification options.
 * @param verificationOpts.didResolveKey - The function used to resolve the claimer's key. Defaults to [[resolveKey]].
 * @param verificationOpts.challenge - The expected value of the challenge. Verification will fail in case of a mismatch.
 */
export async function verifySignature(
  input: IDocumentPresentation,
  {
    challenge,
    didResolveKey = resolveKey,
  }: {
    challenge?: string
    didResolveKey?: DidResolveKey
  } = {}
): Promise<void> {
  // verify Holder Signature
  const { holderSignature } = input
  if (challenge && challenge !== holderSignature.challenge)
    throw new SDKErrors.SignatureUnverifiableError(
      'Challenge differs from expected'
    )

  const signingData = makeSigningData(input, holderSignature.challenge)
  await verifyDidSignature({
    ...signatureFromJson(holderSignature),
    message: signingData,
    // check if credential owner matches signer
    expectedSigner: input.content.holder,
    expectedVerificationMethod: 'authentication',
    didResolveKey,
  })
  // verify Issuer Signature
  const { issuerSignature } = input
  const uint8DocumentHash = new Uint8Array([
    ...Crypto.coToUInt8(input.documentHash),
  ])
  await verifyDidSignature({
    ...signatureFromJson(issuerSignature),
    message: uint8DocumentHash,
    // check if credential issuer matches signer
    expectedSigner: input.content.issuer,
    expectedVerificationMethod: 'authentication',
    didResolveKey,
  })
}

/**
 * Calculates the statement Id by hashing it.
 *
 * @param statement Statement for which to create the id.
 * @param statementDigest
 * @param registry
 * @param chainSpace
 * @param creator
 * @returns Statement id uri.
 */
export function getUriForStatement(
  statementDigest: HexString,
  chainSpace: SpaceId,
  creator: DidUri
): StatementId {
  const api = ConfigService.get('api')
  const scaleEncodedDigest = api
    .createType<H256>('H256', statementDigest)
    .toU8a()
  const scaleEncodedRegistry = api
    .createType<Bytes>('Bytes', chainSpace)
    .toU8a()
  const scaleEncodedCreator = api
    .createType<AccountId>('AccountId', Did.toChain(creator))
    .toU8a()

  const digest = blake2AsHex(
    Uint8Array.from([
      ...scaleEncodedDigest,
      ...scaleEncodedRegistry,
      ...scaleEncodedCreator,
    ])
  )
  return Identifier.hashToUri(digest, STATEMENT_IDENT, STATEMENT_PREFIX)
}

export type Options = {
  evidenceIds?: IDocument[]
  validFrom?: Date
  validUntil?: Date
  templates?: string[]
  labels?: string[]
}

/**
 * Builds a new  [[IDocument]] object, from a complete set of required parameters.
 *
 * @param content An `IContent` object to build the document for.
 * @param option Container for different options that can be passed to this method.
 * @param authorization The authrization id of the Issuer, which should be used in anchoring the document.
 * @param registry Identifier of the registry this document is linked to.
 * @param option.evidenceIds Array of [[Document]] objects the Issuer include as evidenceIds.
 * @returns A new [[IDocument]] object.
 */

/**
 * @param root0
 * @param root0.content
 * @param root0.authorization
 * @param root0.registry
 * @param root0.signCallback
 * @param root0.options
 * @param root0.chainSpace
 */
export async function fromContent({
  content,
  chainSpace,
  authorization,
  signCallback,
  options = {},
}: {
  content: IContent
  authorization: AuthorizationId
  chainSpace: SpaceId
  signCallback: SignCallback
  options: Options
}): Promise<IDocument> {
  const { evidenceIds, validFrom, validUntil, templates, labels } = options

  const { hashes: contentHashes, nonceMap: contentNonceMap } =
    Content.hashContents(content)

  const issuanceDate = new Date().toISOString()
  const validFromString = validFrom ? validFrom.toISOString() : undefined
  const validUntilString = validUntil ? validUntil.toISOString() : undefined

  const metaData = {
    templates: templates || [],
    labels: labels || [],
  }

  const documentHash = calculateDocumentHash({
    evidenceIds,
    contentHashes,
    issuanceDate,
    validFrom: validFromString,
    validUntil: validUntilString,
  })

  const spaceIdentifier = Identifier.uriToIdentifier(chainSpace)
  const statementId = getUriForStatement(
    documentHash,
    spaceIdentifier,
    content.issuer
  )
  const uint8Hash = new Uint8Array([...Crypto.coToUInt8(documentHash)])
  const issuerSignature = await signCallback({
    data: uint8Hash,
    did: content.issuer,
    keyRelationship: 'authentication',
  })

  const document = {
    identifier: statementId,
    content,
    contentHashes,
    contentNonceMap,
    evidenceIds: evidenceIds || [],
    authorization,
    chainSpace,
    issuanceDate,
    validFrom: validFromString,
    validUntil: validUntilString,
    documentHash,
    issuerSignature: signatureToJson(issuerSignature),
    metadata: metaData,
  }
  verifyDataStructure(document)
  return document
}

/**
 * @param document
 * @param updatedContent
 * @param schema
 * @param signCallback
 * @param options
 */
export async function updateFromContent(
  document: IDocument,
  updatedContent: IContent['contents'],
  schema: ISchema,
  signCallback: SignCallback,
  options: Options
) {
  const { evidenceIds, validFrom, validUntil, templates, labels } = options
  let isUpdateFromOptionsPossible = false
  let isUpdateFromContentsPossible = false

  if (document.content.schemaId !== schema.$id) {
    throw new Error(
      'Updating cannot be performed because the schema ID of the document does not correspond to the provided schema argument'
    )
  }

  if (
    JSON.stringify(evidenceIds) !== JSON.stringify(document.evidenceIds) ||
    JSON.stringify(validFrom) !== JSON.stringify(document.validFrom) ||
    JSON.stringify(validUntil) !== JSON.stringify(document.validUntil) ||
    JSON.stringify(templates) !== JSON.stringify(document.metadata.templates) ||
    JSON.stringify(labels) !== JSON.stringify(document.metadata.labels)
  ) {
    isUpdateFromOptionsPossible = true
  }

  if (
    JSON.stringify(jsonabc.sortObj(document.content.contents)) !==
    JSON.stringify(jsonabc.sortObj(updatedContent))
  ) {
    isUpdateFromContentsPossible = true
  }

  if (!(isUpdateFromOptionsPossible || isUpdateFromContentsPossible)) {
    throw new Error(
      "For document updating, it's necessary to modify either the contents or the options, or modify both"
    )
  }

  const newContent = Content.fromSchemaAndContent(
    schema,
    updatedContent,
    document.content.holder,
    document.content.issuer
  )

  const updatedDocument = await fromContent({
    content: newContent,
    authorization: document.authorization,
    chainSpace: document.chainSpace,
    signCallback,
    options,
  })
  updatedDocument.identifier = document.identifier
  return updatedDocument
}

/**
 * Verifies data structure & data integrity of a document object.
 * This combines all offline sanity checks that can be performed on an IDocument object.
 *
 * @param document - The object to check.
 * @param options - Additional parameter for more verification steps.
 * @param options.schema - Schema to be checked against.
 * @param options.selectedAttributes - Selective disclosure attributes.
 */
export function verifyWellFormed(
  document: IDocument,
  { schema, selectedAttributes }: VerifyOptions = {}
): void {
  verifyDataStructure(document)
  if (
    selectedAttributes &&
    (selectedAttributes.length > 0 || selectedAttributes[0] !== '*')
  ) {
    verifyDataIntegrity(document, { selectedAttributes })
  } else {
    verifyDataIntegrity(document)
  }
  if (schema) {
    verifyContentAganistSchema(document.content.contents, schema)
  }
}

/**
 * Verifies data structure & data integrity of a credential object.
 *
 * @param document - The object to check.
 * @param options - Additional parameter for more verification steps.
 * @param options.schema - Schema to be checked against.
 * @param options.selectedAttributes
 */
export async function verifyDocument(
  document: IDocument,
  { schema, selectedAttributes }: VerifyOptions = {}
): Promise<void> {
  verifyWellFormed(document, { schema, selectedAttributes })
  // verifyDataStructure(document)
  // verifyDataIntegrity(document)

  // if (schema) {
  //   verifyAgainstSchema(document, schema)
  // }
}

/**
 * Verifies data structure, data integrity and the holder's signature of a document presentation.
 *
 * Upon presentation of a document, a verifier would call this function.
 *
 * @param presentation - The object to check.
 * @param options - Additional parameter for more verification steps.
 * @param options.schema - Schema which the included document should be checked against.
 * @param options.challenge -  The expected value of the challenge. Verification will fail in case of a mismatch.
 * @param options.didResolveKey - The function used to resolve the holders's key. Defaults to [[resolveKey]].
 */
export async function verifyPresentation(
  presentation: IDocumentPresentation,
  { schema, challenge, didResolveKey = resolveKey }: VerifyOptions = {}
): Promise<void> {
  const selectedAttributes = presentation.selectiveAttributes
  await verifyDocument(presentation, { schema, selectedAttributes })
  await verifySignature(presentation, {
    challenge,
    didResolveKey,
  })
}

/**
 * Type Guard to determine input being of type [[IDocument]].
 *
 * @param input - A potentially only partial [[IDocument]].
 *
 * @returns  Boolean whether input is of type IDocument.
 */
export function isIDocument(input: unknown): input is IDocument {
  try {
    verifyDataStructure(input as IDocument)
  } catch (error) {
    return false
  }
  return true
}

/**
 * Type Guard to determine input being of type [[IDocumentPresentation]].
 *
 * @param input - An [[IDocument]], [[IDocumentPresentation]], or other object.
 *
 * @returns  Boolean whether input is of type IDocumentPresentation.
 */
export function isPresentation(input: unknown): input is IDocumentPresentation {
  return (
    isIDocument(input) &&
    isDidSignature((input as IDocumentPresentation).holderSignature)
  )
}

/**
 * Gets the hash of the document.
 *
 * @param document - The document to get the hash from.
 * @returns The hash of the credential.
 */
export function getHash(document: IDocument): IStatement['statementHash'] {
  return document.documentHash
}

function filterNestedObject(
  obj: Record<string, any>,
  keysToKeep: string[]
): Record<string, any> {
  const result: Record<string, any> = {}

  Object.keys(obj).forEach((key) => {
    // Check if the key is in keysToKeep list.
    if (keysToKeep.includes(key)) {
      result[key] = obj[key]
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Process nested keys.
      const nestedKeys = keysToKeep
        .filter((k) => k.startsWith(`${key}.`))
        .map((k) => k.split('.').slice(1).join('.'))

      if (nestedKeys.length > 0) {
        const nestedObject = filterNestedObject(obj[key], nestedKeys)
        if (Object.keys(nestedObject).length > 0) {
          result[key] = nestedObject
        }
      }
    }
  })

  return result
}

/**
 * Creates a public presentation which can be sent to a verifier.
 * This presentation is signed.
 *
 * @param presentationOptions The additional options to use upon presentation generation.
 * @param presentationOptions.document The document to create the presentation for.
 * @param presentationOptions.signCallback The callback to sign the presentation.
 * @param presentationOptions.selectedAttributes All properties of the credential which have been requested by the verifier and therefore must be publicly presented.
 * @param presentationOptions.challenge Challenge which will be part of the presentation signature.
 * If not specified, all attributes are shown. If set to an empty array, we hide all attributes inside the claim for the presentation.
 * @returns A deep copy of the Credential with selected attributes.
 */
export async function createPresentation({
  document,
  signCallback,
  selectedAttributes,
  challenge,
}: PresentationOptions): Promise<IDocumentPresentation> {
  const presentationDocument = document

  if (selectedAttributes && selectedAttributes.length > 0) {
    // Only keep selected attributes
    presentationDocument.content.contents = filterNestedObject(
      document.content.contents,
      selectedAttributes
    )
  }
  presentationDocument.contentNonceMap = hashContents(
    presentationDocument.content,
    {
      nonces: presentationDocument.contentNonceMap,
      selectedAttributes,
    }
  ).nonceMap

  const signature = await signCallback({
    data: makeSigningData(presentationDocument, challenge),
    did: document.content.holder,
    keyRelationship: 'authentication',
  })

  return {
    ...presentationDocument,
    selectiveAttributes: selectedAttributes || [],
    holderSignature: {
      ...signatureToJson(signature),
      ...(challenge && { challenge }),
    },
  }
}
