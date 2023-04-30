import { hexToBn } from '@polkadot/util'
import type { HexString } from '@polkadot/util/types'
import type {
  DidUri,
  IContent,
  ISchema,
  PartialContent,
} from '@cord.network/types'
import {
  SDKErrors,
  Identifier,
  Crypto,
  DataUtils,
  jsonabc,
} from '@cord.network/utils'
import * as Did from '@cord.network/did'
import * as Schema from '../schema/index.js'

const VC_VOCAB = 'https://www.w3.org/2018/credentials/v1'

/**
 * Produces JSON-LD readable representations of [[IContent]]['contents']. This is done by implicitly or explicitely transforming property keys to globally unique predicates.
 * Where possible these predicates are taken directly from the Verifiable Credentials vocabulary. Properties that are unique to a [[Schema]] are transformed to predicates by prepending the [[Schema]][schema][$id].
 *
 * @param content A (partial) [[IContent]] from to build a JSON-LD representation from. The `identifier` property is required.
 * @param expanded Return an expanded instead of a compacted represenation. While property transformation is done explicitely in the expanded format, it is otherwise done implicitly via adding JSON-LD's reserved `@context` properties while leaving [[IContent]][contents] property keys untouched.
 * @returns An object which can be serialized into valid JSON-LD representing an [[IContent]]'s ['contents'].
 */
function jsonLDcontents(
  content: PartialContent,
  expanded = true
): Record<string, unknown> {
  const { schemaId, contents, holder, issuer } = content
  if (!schemaId) new SDKErrors.SchemaIdentifierMissingError()
  const vocabulary = `${schemaId}#`
  const result: Record<string, unknown> = {}
  if (issuer) result['issuer'] = issuer
  if (holder) result['holder'] = holder

  if (!expanded) {
    return {
      ...jsonabc.sortObj(result),
      '@context': { '@vocab': vocabulary },
      ...jsonabc.sortObj(contents ?? {}),
    }
  }

  Object.entries(contents || {}).forEach(([key, value]) => {
    let val = value
    if (typeof value === 'object') {
      /* FIXME: GH-issue #40 */
      /* Supporting object inside is tricky, and jsonld expansion is even more harder */
      /* for now, we got things under control with this check but need more work here */

      let newObj = {}
      Object.entries(jsonabc.sortObj(value)).forEach(([k, v]) => {
        newObj[vocabulary + k] = v
      })
      val = newObj
    }
    result[vocabulary + key] = val
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
    '@id': content.schemaId,
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
    if (!nonce) throw new SDKErrors.ContentNonceMapMalformedError(statement)
    nonceMap[digest] = nonce
  }, {})
  return { hashes, nonceMap }
}

/**
 * Used to verify the hash list based proof over the set of disclosed attributes in [[Content]].
 *
 * @param content Full or partial [[IContent]] to verify proof against.
 * @param proof Proof consisting of a map that matches nonces to statement digests and the resulting hashes.
 * @param proof.nonces A map where a statement digest as produces by options.hasher is mapped to a nonce.
 * @param proof.hashes Array containing hashes which are signed into the credential. Should result from feeding statement digests and nonces in proof.nonce to options.hasher.
 * @param options Object containing optional parameters.
 * @param options.canonicalisation Canonicalisation routine that produces an array of statement strings from the [IContent]. Default produces individual `{"key":"value"}` JSON representations where keys are transformed to expanded JSON-LD.
 * @param options.hasher The hasher to be used. Required but defaults to 256 bit blake2 over `${nonce}${statement}`.
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
): void {
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
  const { verified, errors } = hashed.reduce<{
    verified: boolean
    errors: Error[]
  }>(
    (status, { saltedHash, statement, digest, nonce }) => {
      // check if the statement digest was contained in the proof and mapped it to a nonce
      if (!digestsInProof.includes(digest) || !nonce) {
        status.errors.push(new SDKErrors.NoProofForStatementError(statement))
        return { ...status, verified: false }
      }
      // check if the hash is whitelisted in the proof
      if (!proof.hashes.includes(saltedHash)) {
        status.errors.push(
          new SDKErrors.InvalidProofForStatementError(statement)
        )
        return { ...status, verified: false }
      }
      return status
    },
    { verified: true, errors: [] }
  )
  if (verified !== true) {
    throw new SDKErrors.ContentUnverifiableError(
      'One or more statements in the content could not be verified',
      { cause: errors }
    )
  }
}

/**
 *  Checks whether the input meets all the required criteria of an [[IContent]] object.
 *  Throws on invalid input.
 *
 * @param input The potentially only partial IContent.
 *
 */
export function verifyDataStructure(input: IContent | PartialContent): void {
  if (!input.schemaId) {
    throw new SDKErrors.SchemaIdentifierMissingError()
  }
  if ('holder' in input) {
    Did.validateUri(input.holder, 'Did')
  }
  if (input.contents !== undefined) {
    Object.entries(input.contents).forEach(([key, value]) => {
      if (
        !key ||
        typeof key !== 'string' ||
        !['string', 'number', 'boolean', 'object'].includes(typeof value)
      ) {
        throw new SDKErrors.InputContentsMalformedError()
      }
    })
  }
  DataUtils.validateId(Identifier.uriToIdentifier(input.schemaId), 'Identifier')
}

/**
 * Verifies the data structure and schema of a Claim.
 *
 * @param inputContent IContent to verify.
 * @param schema ISchema to verify inputContent.
 */
export function verify(inputContent: IContent, schema: ISchema): void {
  Schema.verifyContentAganistSchema(inputContent.contents, schema)
  verifyDataStructure(inputContent)
}

/**
 * Builds a [[Content]] stream from [[IContent]] and nested [[ISchema]]s.
 *
 * @param schema A [[Schema]] object that has nested [[Schema]]s.
 * @param nestedSchemas The array of [[Schema]]s, which are used inside the main [[Schema]].
 * @param contents The data inside the [[Content]].
 * @param holder The holder of the [[Content]].
 *
 * @returns A validated [[Content]] stream.
 */

export function fromNestedSchemaAndContent(
  schema: ISchema,
  nestedSchemas: ISchema[],
  contents: IContent['contents'],
  holder: DidUri,
  issuer: DidUri
): IContent {
  Schema.verifyContentAgainstNestedSchemas(schema, nestedSchemas, contents)

  const content = {
    schemaId: schema.$id,
    contents: contents,
    holder: holder,
    issuer: issuer,
  }
  verifyDataStructure(content)
  return content
}

/**
 * Builds a new Content stream from [[ISchema]], IContent['contents'] and issuer's [[DidUri]].
 *
 * @param schema [[ISchema]] on which the content is based on.
 * @param contents IContent['contents'] to be used as the data of the instantiated Content stream.
 * @param holder The DID to be used as the holder.
 * @returns A Content object.
 */
export function fromSchemaAndContent(
  schema: ISchema,
  contents: IContent['contents'],
  holder: DidUri,
  issuer: DidUri
): IContent {
  Schema.verifyDataStructure(schema)
  Schema.verifyContentAganistSchema(contents, schema)

  const content = {
    schemaId: schema.$id,
    contents: contents,
    holder: holder,
    issuer: issuer,
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
