import { hexToBn } from '@polkadot/util'
import type { HexString } from '@polkadot/util/types'
import type {
  IContent,
  ISchema,
  CompressedContent,
  CompressedPartialContent,
  PartialContent,
  IPublicIdentity,
} from '@cord.network/types'
import {
  SDKErrors,
  Identifier,
  Crypto,
  jsonabc,
  DataUtils,
} from '@cord.network/utils'
import {
  verifyContentWithSchema,
  verifyContentWithNestedSchemas,
} from '../schema/index.js'

const VC_VOCAB = 'https://www.w3.org/2018/credentials#'

/**
 * Produces JSON-LD readable representations of [[IContent]]['contents']. This is done by implicitly or explicitely transforming property keys to globally unique predicates.
 * Where possible these predicates are taken directly from the Verifiable Credentials vocabulary. Properties that are unique to a [[Schema]] are transformed to predicates by prepending the [[Schema]][schema][$id].
 *
 * @param content A (partial) [[IContent]] from to build a JSON-LD representation from. The `identifier` property is required.
 * @param expanded Return an expanded instead of a compacted represenation. While property transformation is done explicitely in the expanded format, it is otherwise done implicitly via adding JSON-LD's reserved `@context` properties while leaving [[IContent]][contents] property keys untouched.
 * @returns An object which can be serialized into valid JSON-LD representing an [[IContent]]'s ['contents'].
 * @throws [[ERROR_SCHEMA_IDENTIFIER_NOT_PROVIDED]] in case the content's ['identifier'] property is undefined.
 */
function jsonLDcontents(
  content: PartialContent,
  expanded = true
): Record<string, unknown> {
  const { schema, contents, holder } = content
  if (!schema) new SDKErrors.ERROR_SCHEMA_IDENTIFIER_NOT_PROVIDED()
  const vocabulary = `${schema}#`
  const result: Record<string, unknown> = {}
  if (holder) result['@id'] = Identifier.getAccountIdentifierFromAddress(holder)

  if (!expanded) {
    return {
      ...result,
      '@context': { '@vocab': vocabulary },
      ...contents,
    }
  }
  Object.entries(contents || {}).forEach(([key, value]) => {
    result[vocabulary + key] = value
  })
  return result
}

/**
 * Produces JSON-LD readable representations of the content. This is done by implicitly or explicitly transforming property keys to globally unique predicates.
 * Where possible these predicates are taken directly from the Verifiable Credentials vocabulary. Properties that are unique to a [[Schema]] are transformed to predicates by prepending the [[Schema]][schema][$id].
 *
 * @param claim A (partial) [[IContent]] from to build a JSON-LD representation from. The `identifier` property is required.
 * @param expanded Return an expanded instead of a compacted representation. While property transformation is done explicitly in the expanded format, it is otherwise done implicitly via adding JSON-LD's reserved `@context` properties while leaving [[IContent]][contents] property keys untouched.
 * @returns An object which can be serialized into valid JSON-LD representing an [[IContent]].
 * @throws [[ERROR_SCHEMA_IDENTIFIER_NOT_PROVIDED]] in case the content's ['identifier'] property is undefined.
 */
export function toJsonLD(
  content: PartialContent,
  expanded = true
): Record<string, unknown> {
  const credentialSubject = jsonLDcontents(content, expanded)
  const prefix = expanded ? VC_VOCAB : ''
  const result = {
    [`${prefix}credentialSubject`]: credentialSubject,
  }
  result[`${prefix}credentialSchema`] = {
    '@id': content.schema,
  }
  if (!expanded) result['@context'] = { '@vocab': VC_VOCAB }
  return result
}

function makeStatementsJsonLD(content: PartialContent): string[] {
  const normalized = jsonLDcontents(content, true)
  return Object.entries(normalized).map(([key, value]) =>
    JSON.stringify({ [key]: value })
  )
}

/**
 * Produces salted hashes of individual statements comprising a (partial) [[IContent]] to enable selective disclosure of contents. Can also be used to reproduce hashes for the purpose of validation.
 *
 * @param content Full or partial [[IContent]] to produce statement hashes from.
 * @param options Object containing optional parameters.
 * @param options.canonicalisation Canonicalisation routine that produces an array of statement strings from the [IContent]. Default produces individual `{"key":"value"}` JSON representations where keys are transformed to expanded JSON-LD.
 * @param options.nonces Optional map of nonces as produced by this function.
 * @param options.nonceGenerator Nonce generator as defined by [[hashStatements]] to be used if no `nonces` are given. Default produces random UUIDs (v4).
 * @param options.hasher The hasher to be used. Required but defaults to 256 bit blake2 over `${nonce}${statement}`.
 * @returns An array of salted `hashes` and a `nonceMap` where keys correspond to unsalted statement hashes.
 * @throws [[ERROR_CONTENT_NONCE_MAP_MALFORMED]] if the nonceMap or the nonceGenerator was non-exhaustive for any statement.
 */
export function hashContents(
  content: PartialContent,
  options: Crypto.HashingOptions & {
    canonicalisation?: (content: PartialContent) => string[]
  } = {}
): {
  hashes: HexString[]
  nonceMap: Record<string, string>
} {
  // apply defaults
  const defaults = { canonicalisation: makeStatementsJsonLD }
  const canonicalisation = options.canonicalisation || defaults.canonicalisation
  // use canonicalisation algorithm to make hashable statement strings
  const statements = canonicalisation(content)
  // iterate over statements to produce salted hashes
  const processed = Crypto.hashStatements(statements, options)
  // produce array of salted hashes to add to credential
  const hashes = processed
    .map(({ saltedHash }) => saltedHash)
    .sort((a, b) => hexToBn(a).cmp(hexToBn(b)))
  // produce nonce map, where each nonce is keyed with the unsalted hash
  const nonceMap = {}
  processed.forEach(({ digest, nonce, statement }) => {
    // throw if we can't map a digest to a nonce - this should not happen if the nonce map is complete and the credential has not been tampered with
    if (!nonce) throw new SDKErrors.ERROR_CONTENT_NONCE_MAP_MALFORMED(statement)
    nonceMap[digest] = nonce
  }, {})
  return { hashes, nonceMap }
}

/**
 * Used to verify the hash list based proof over the set of disclosed attributes in a [[Stream]].
 *
 * @param content Full or partial [[IContent]] to verify proof against.
 * @param proof Proof consisting of a map that matches nonces to statement digests and the resulting hashes.
 * @param proof.nonces A map where a statement digest as produces by options.hasher is mapped to a nonce.
 * @param proof.hashes Array containing hashes which are signed into the credential. Should result from feeding statement digests and nonces in proof.nonce to options.hasher.
 * @param options Object containing optional parameters.
 * @param options.canonicalisation Canonicalisation routine that produces an array of statement strings from the [IContent]. Default produces individual `{"key":"value"}` JSON representations where keys are transformed to expanded JSON-LD.
 * @param options.hasher The hasher to be used. Required but defaults to 256 bit blake2 over `${nonce}${statement}`.
 * @returns `verified` is a boolean indicating whether the proof is valid. `errors` is an array of all errors in case it is not.
 */
export function verifyDisclosedAttributes(
  content: PartialContent,
  proof: {
    nonces: Record<string, string>
    hashes: string[]
  },
  options: Pick<Crypto.HashingOptions, 'hasher'> & {
    canonicalisation?: (content: PartialContent) => string[]
  } = {}
): { verified: boolean; errors: Error[] } {
  // apply defaults
  const defaults = { canonicalisation: makeStatementsJsonLD }
  const canonicalisation = options.canonicalisation || defaults.canonicalisation
  const { nonces } = proof
  // use canonicalisation algorithm to make hashable statement strings
  const statements = canonicalisation(content)
  // iterate over statements to produce salted hashes
  const hashed = Crypto.hashStatements(statements, { ...options, nonces })
  // check resulting hashes
  const digestsInProof = Object.keys(nonces)
  return hashed.reduce<{ verified: boolean; errors: Error[] }>(
    (status, { saltedHash, statement, digest, nonce }) => {
      // check if the statement digest was contained in the proof and mapped it to a nonce
      if (!digestsInProof.includes(digest) || !nonce) {
        status.errors.push(
          new SDKErrors.ERROR_NO_PROOF_FOR_STATEMENT(statement)
        )
        return { ...status, verified: false }
      }
      // check if the hash is whitelisted in the proof
      if (!proof.hashes.includes(saltedHash)) {
        status.errors.push(
          new SDKErrors.ERROR_INVALID_PROOF_FOR_STATEMENT(statement)
        )
        return { ...status, verified: false }
      }
      return status
    },
    { verified: true, errors: [] }
  )
}

/**
 *  Checks whether the input meets all the required criteria of an [[IContent]] object.
 *  Throws on invalid input.
 *
 * @param input The potentially only partial IContent.
 * @throws [[ERROR_SCHEMA_IDENTIFIER_NOT_PROVIDED]] when input's id do not exist.
 * @throws [[ERROR_CONTENT_PROPERTIES_MALFORMED]] when any of the input's contents[key] is not of type 'number', 'boolean' or 'string'.
 *
 */
export function verifyDataStructure(input: IContent | PartialContent): void {
  if (!input.schema) {
    throw new SDKErrors.ERROR_SCHEMA_IDENTIFIER_NOT_PROVIDED()
  }
  if (input.issuer) {
    DataUtils.validateAddress(input.issuer, 'Content Creator')
  }
  if (input.contents !== undefined) {
    Object.entries(input.contents).forEach(([key, value]) => {
      if (
        !key ||
        typeof key !== 'string' ||
        !['string', 'number', 'boolean', 'object'].includes(typeof value)
      ) {
        throw new SDKErrors.ERROR_CONTENT_PROPERTIES_MALFORMED()
      }
    })
  }
  DataUtils.validateId(Identifier.getIdentifierKey(input.schema), 'Identifier')
}

function verifyWithSchema(
  contents: IContent['contents'],
  schema: ISchema['schema']
): boolean {
  return verifyContentWithSchema(contents, schema)
}

/**
 * Verifies the data structure and schema of the Content.
 *
 * @param contentInput IClaim to verify.
 * @param typeSchema ISchema['schema'] to verify contents.
 * @throws [[ERROR_CLAIM_UNVERIFIABLE]] when  contents could not be verified with the provided typeSchema.
 */
export function verify(
  contentInput: IContent,
  typeSchema: ISchema['schema']
): void {
  if (!verifyWithSchema(contentInput.contents, typeSchema)) {
    throw new SDKErrors.ERROR_CONTENT_UNVERIFIABLE()
  }

  verifyDataStructure(contentInput)
}

/**
 * Builds a [[Content]] stream from [[IContent]] and nested [[ISchema]]s.
 *
 * @param schema A [[Schema]] object that has nested [[Schema]]s.
 * @param nestedSchemas The array of [[Schema]]s, which are used inside the main [[Schema]].
 * @param contents The data inside the [[Content]].
 * @param issuer The owner of the [[Content]].
 * @param holder The holder of the [[Content]].
 *
 * @returns A validated [[Content]] stream.
 */

export function fromNestedSchemaAndContent(
  schema: ISchema,
  nestedSchemas: Array<ISchema['schema']>,
  contents: IContent['contents'],
  issuer: IPublicIdentity['address'],
  holder?: IPublicIdentity['address']
): IContent {
  if (!verifyContentWithNestedSchemas(schema.schema, nestedSchemas, contents)) {
    throw new SDKErrors.ERROR_NESTED_CONTENT_UNVERIFIABLE()
  }
  const content = {
    schema: schema.identifier,
    contents: contents,
    issuer: issuer,
    holder: holder || null,
  }
  verifyDataStructure(content)
  return content
}

/**
 * Builds a new [[Content]] stream from [[ISchema]], IContent['contents'] and issuer's [[IPublicIdentity['address']].
 *
 * @param schema [[ISchema]] on which the content is based on.
 * @param contents IContent['contents'] to be used as the data of the instantiated Content stream.
 * @throws [[ERROR_CONTENT_UNVERIFIABLE]] when the input stream could not be verified with the schema provided.
 *
 * @returns An instantiated Content.
 */
export function fromSchemaAndContent(
  schema: ISchema,
  contents: IContent['contents'],
  issuer: IPublicIdentity['address'],
  holder?: IPublicIdentity['address']
): IContent {
  if (schema.schema) {
    if (!verifyWithSchema(contents, schema.schema)) {
      throw new SDKErrors.ERROR_CONTENT_UNVERIFIABLE()
    }
  }
  const content = {
    schema: schema.identifier,
    issuer: issuer,
    holder: holder || null,
    contents: contents,
  }
  verifyDataStructure(content)
  return content
}

/**
 *  Custom Type Guard to determine input being of type IContent
 *
 * @param input The potentially only partial IContent.
 *
 * @returns Boolean whether input is of type IContent.
 */
export function isIContent(input: unknown): input is IContent {
  try {
    verifyDataStructure(input as IContent)
  } catch (error) {
    return false
  }
  return true
}

/**
 * Compresses the [[Content]] for storage and/or messaging.
 *
 * @param content An [[IContent]] object that will be sorted and stripped for messaging or storage.
 *
 * @returns An ordered array of an [[CompressedContent]].
 */

export function compress(content: IContent): CompressedContent

/**
 * Compresses a [[PartialContent]] for storage and/or messaging.
 *
 * @param content A [[PartialContent]] object that will be sorted and stripped for messaging or storage.
 *
 * @returns An ordered array of a [[CompressedPartialContent]].
 */
export function compress(content: PartialContent): CompressedPartialContent

/**
 *  Compresses a content object for storage and/or messaging.
 *
 * @param content A (partial) content object that will be sorted and stripped for messaging or storage.
 *
 * @returns An ordered array of that represents the underlying data in a more compact form.
 */
export function compress(
  content: IContent | PartialContent
): CompressedContent | CompressedPartialContent {
  verifyDataStructure(content)
  let sortedContents
  if (content.contents) {
    sortedContents = jsonabc.sortObj(content.contents)
  }
  return [content.schema, content.issuer, content.holder, sortedContents]
}

/**
 *  Decompresses an [[IContent]] from storage and/or message.
 *
 * @param content A [[CompressedContent]] array that is reverted back into an object.
 * @throws [[ERROR_DECOMPRESSION_ARRAY]] when a [[CompressedContent]] is not an Array or it's length is unequal 3.
 * @returns An [[IContent]] object that has the same properties compressed representation.
 */
export function decompress(content: CompressedContent): IContent

/**
 *  Decompresses compressed representation of a (partial) [[IContent]] from storage and/or message.
 *
 * @param content A [[CompressedContent]] or [[CompressedPartialContent]] array that is reverted back into an object.
 * @throws
 * @throws [[ERROR_DECOMPRESSION_ARRAY]] if the  `content` is not an Array or it's length is unequal 4.
 * @returns An [[IContent]] or [[PartialContent]] object that has the same properties compressed representation.
 */
export function decompress(content: CompressedPartialContent): PartialContent
export function decompress(
  content: CompressedContent | CompressedPartialContent
): IContent | PartialContent {
  if (!Array.isArray(content) || content.length !== 4) {
    throw new SDKErrors.ERROR_DECOMPRESSION_ARRAY('Stream')
  }
  const decompressedContent = {
    schema: content[0],
    issuer: content[1],
    holder: content[2],
    contents: content[3],
  }
  verifyDataStructure(decompressedContent)
  return decompressedContent
}
