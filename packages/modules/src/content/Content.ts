/**
 * @packageDocumentation
 * @module Content
 * @preferred
 *
 * The `Content` module provides a comprehensive suite of functionalities to handle, validate, and manipulate content
 * within a digital credentialing system. This module is a core part of the system, designed to work seamlessly with
 * other modules like `Schema`, `Crypto`, and `Document` to enable the creation, verification, and management of
 * digital credentials based on various schemas and standards.
 *
 * ## Features
 *
 * - **Content Creation and Management**: Facilitates the creation and manipulation of content objects that conform
 *   to specific schemas. This includes validating content structure, ensuring data integrity, and preparing content
 *   for further processing or credential issuance.
 * - **Content Verification**: Provides tools to verify the structure and data of content objects against predefined
 *   schemas, ensuring that they meet the necessary standards and requirements.
 * - **JSON-LD Support**: Includes functionalities to convert content objects to and from JSON-LD format, enabling
 *   integration with systems and standards that utilize JSON-LD for structured data.
 * - **Selective Disclosure**: Supports mechanisms to hash and verify individual content statements, allowing for
 *   selective disclosure of information in a privacy-preserving manner.
 * - **Type Safety and Validation**: Implements type guards and validation checks to ensure that content objects
 *   conform to expected interfaces and data types, enhancing the robustness and reliability of the system.
 *
 * ## Usage
 *
 * The `Content` module is designed to be used in conjunction with other modules in the system. It does not operate
 * in isolation but as a part of a larger workflow involving schema definition, cryptographic operations, and document
 * handling. Developers working with digital credentials, particularly in the context of decentralized identities
 * (DIDs) and verifiable credentials (VCs), will find this module essential for content-related operations.
 *
 * ## Example
 *
 * ```
 * import { Content } from '@cord.network/modules';
 *
 * // Example of creating a content object
 * const contentObject = Content.fromSchemaAndContent(schema, contentData, holderDid, issuerDid);
 *
 * // Example of verifying a content object
 * Content.verify(contentObject, schema);
 * ```
 *
 * In summary, the `Content` module is a vital component of the digital credentialing ecosystem, providing essential
 * functionalities required for handling and processing content in a secure, standardized, and efficient manner.
 */
import type {
  DidUri,
  IContent,
  ISchema,
  PartialContent,
  HexString,
} from '@cord.network/types'
import { hexToBn } from '@cord.network/types'
import { SDKErrors, Identifier, Crypto, DataUtils } from '@cord.network/utils'
import * as Did from '@cord.network/did'
import * as Schema from '../schema/index.js'

const VC_VOCAB = 'https://www.w3.org/2018/credentials/v1'

/**
 * Transforms a given content object into a JSON-LD format, suitable for serialization and interoperability
 * in systems using Linked Data. JSON-LD (JavaScript Object Notation for Linked Data) is a method of encoding
 * Linked Data using JSON, allowing data to be serialized in a way that is both human-readable and machine-readable.
 * This function supports both compacted and expanded JSON-LD formats.
 *
 * @param content - The content object to transform. This is a partial representation of an [[IContent]].
 *   It must include the `schemaId` property, and may include `contents`, `holder`, and `issuer` properties.
 * @param [expanded=true] - Determines the format of the JSON-LD output. If true, the function produces an expanded
 *   JSON-LD format where property keys are explicitly transformed into globally unique predicates using the schema's vocabulary.
 *   If false, the function produces a compacted format where the transformation is implicit, using JSON-LD's `@context`.
 *
 * @returns - An object representing the content in JSON-LD format, which can be serialized into valid JSON-LD.
 *
 * @throws {SDKErrors.SchemaIdentifierMissingError} - Thrown if the `schemaId` is missing in the provided content object.
 */
function jsonLDcontents(
  content: PartialContent,
  expanded = true
): Record<string, unknown> {
  const { schemaId, contents, holder, issuer } = content

  if (!schemaId) throw new SDKErrors.SchemaIdentifierMissingError()

  const vocabulary = `${schemaId}#`
  const result: Record<string, unknown> = {}

  if (issuer) result.issuer = issuer
  if (holder) result.holder = holder

  const flattenedContents = DataUtils.flattenObject(contents || {})

  if (!expanded) {
    return {
      ...result,
      '@context': { '@vocab': vocabulary },
      ...contents,
    }
  }

  Object.entries(flattenedContents).forEach(([key, value]) => {
    result[vocabulary + key] = value
  })

  return result
}

/**
 * Transforms a content object into a JSON-LD representation suitable for Verifiable Credentials. This function
 * wraps the content in a structure that is compliant with the JSON-LD format used in Verifiable Credentials,
 * making it ready for serialization and use in credentialing systems.
 *
 * @param content - The content object to be transformed. This is a partial representation of an [[IContent]].
 *   It must include the `schemaId` property and may include other properties like `contents`, `holder`, and `issuer`.
 * @param [expanded=true] - Determines the format of the JSON-LD output. If true, the function produces an expanded
 *   JSON-LD format with explicit predicates. If false, it produces a compacted format with implicit predicates using JSON-LD's `@context`.
 *
 * @returns - An object representing the content in a JSON-LD format compliant with Verifiable Credentials.
 *   This includes the `credentialSubject` and `credentialSchema` fields, structured according to the specified `expanded` parameter.
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

/**
 * Generates an array of JSON-LD formatted strings, each representing a statement derived from the content object.
 * This function is useful for creating individual JSON-LD statements from a content object, which can be used in various data processing scenarios.
 *
 * @param content - The content object from which to generate JSON-LD statements. This should be a partial representation of an [[IContent]].
 *
 * @returns - An array of strings, where each string is a JSON-LD formatted representation of a single statement from the content object.
 */
function makeStatementsJsonLD(content: PartialContent): string[] {
  const normalized = jsonLDcontents(content, true)
  return Object.entries(normalized).map(([key, value]) =>
    JSON.stringify({ [key]: value })
  )
}

/**
 * Produces salted hashes of individual statements comprising a (partial) [[IContent]] to enable selective disclosure of contents.
 * This function is also used to reproduce hashes for the purpose of validation. It is a key component in the process of creating
 * and verifying the integrity of content in a cryptographic manner.
 *
 * @param content - The content object, either full or partial, from which to produce statement hashes.
 *   This should be a representation of an [[IContent]].
 * @param [options={}] - An object containing optional parameters to customize the hashing process.
 * @param [options.canonicalisation=makeStatementsJsonLD] - A canonicalisation routine that produces an array of
 *   statement strings from the [IContent]. The default routine produces individual `{"key":"value"}` JSON representations
 *   where keys are transformed to expanded JSON-LD.
 * @param [options.nonces] - An optional map of nonces as produced by this function. If not provided,
 *   nonces will be generated.
 * @param [options.nonceGenerator] - A nonce generator function as defined by [[hashStatements]]. The default
 *   generator produces random UUIDs (v4).
 * @param [options.hasher] - The hashing function to be used. While it is required, it defaults to a 256-bit
 *   blake2 hasher over the format `${nonce}${statement}`.
 * @param [options.selectedAttributes] - Optional array of attribute names to be included in the hashing process.
 *   If provided, only these attributes will be hashed.
 *
 * @returns - An object containing an array of salted `hashes`
 *   and a `nonceMap`, where keys in the map correspond to unsalted statement hashes.
 */
export function hashContents(
  content: PartialContent,
  options: Crypto.HashingOptions & {
    selectedAttributes?: string[]
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

  let filteredStatements = statements
  if (options.selectedAttributes && options.selectedAttributes.length > 0) {
    filteredStatements = DataUtils.filterStatements(
      statements,
      options.selectedAttributes
    )
  }

  // iterate over statements to produce salted hashes
  const processed = Crypto.hashStatements(filteredStatements, options)

  // produce array of salted hashes
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
 * Verifies the hash list based proof over the set of disclosed attributes in a [[Content]] object. This function is crucial
 * for ensuring the integrity and authenticity of the disclosed attributes in a content object, especially in scenarios where
 * selective disclosure of information is employed.
 *
 * @param content - The content object, either full or partial, against which the proof is to be verified.
 *   This should be a representation of an [[IContent]].
 * @param proof - The proof object containing nonces and hashes that are used to verify the content.
 * @param proof.nonces - A map where each statement digest (produced by the hasher) is mapped to a nonce.
 * @param proof.hashes - An array containing hashes that are signed into the credential. These should result from
 *   feeding statement digests and nonces in proof.nonces to the hasher.
 * @param [attributes] - Optional array of attribute names to be included in the verification process. If provided,
 *   only these attributes will be verified.
 * @param [options={}] - An object containing optional parameters to customize the verification process.
 * @param [options.canonicalisation=makeStatementsJsonLD] - A canonicalisation routine that produces an array of
 *   statement strings from the [IContent]. The default routine produces individual `{"key":"value"}` JSON representations
 *   where keys are transformed to expanded JSON-LD.
 * @param [options.hasher] - The hashing function to be used. While it is required, it defaults to a 256-bit
 *   blake2 hasher over the format `${nonce}${statement}`.
 *
 * @throws {SDKErrors.ContentUnverifiableError} - Throws an error if one or more statements in the content could not be verified.
 */
export function verifyDisclosedAttributes(
  content: PartialContent,
  proof: {
    nonces: Record<string, string>
    hashes: string[]
  },
  attributes?: string[],
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
  let filteredStatements = statements
  if (attributes && attributes.length > 0) {
    filteredStatements = DataUtils.filterStatements(statements, attributes)
  }
  // iterate over statements to produce salted hashes
  const hashed = Crypto.hashStatements(filteredStatements, {
    ...options,
    nonces,
  })
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
 * Validates the structure of an [[IContent]] or [[PartialContent]] object. This function is essential for ensuring that the
 * input content adheres to the expected structure and types, which is crucial for the integrity and consistency of data
 * processing in the system.
 *
 * @param input - The content object to be validated. This can be a full [[IContent]] or a
 *   partial representation ([[PartialContent]]).
 *
 * @throws {SDKErrors.SchemaIdentifierMissingError} - Throws an error if the `schemaId` is missing in the input object.
 * @throws {SDKErrors.InputContentsMalformedError} - Throws an error if the contents of the input object are malformed.
 *   This includes checks for key existence, key being a string, and value being of type string, number, boolean, or object.
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
 * Verifies the provided content against a given schema and checks its data structure. This function is crucial for ensuring
 * that the content not only adheres to the expected data structure but also conforms to the specified schema, thereby
 * maintaining data integrity and consistency within the system.
 *
 * @param inputContent - The content object to be verified. This should be a full [[IContent]] representation.
 * @param schema - The schema against which the content is to be validated. This schema defines the expected
 *   structure and data types of the content.
 *
 * @throws Various errors depending on the specific validation failure. These can include schema mismatch errors, data
 *   structure errors, and others as defined in the `Schema.verifyContentAgainstSchema` and `verifyDataStructure` functions.
 */
export function verify(inputContent: IContent, schema: ISchema): void {
  Schema.verifyContentAgainstSchema(inputContent.contents, schema)
  verifyDataStructure(inputContent)
}

/**
 * Constructs an IContent object from a given schema, nested schemas, content data, holder, and issuer. This function
 * ensures that the content data adheres to the specified schema and its nested schemas, thereby maintaining data
 * integrity and consistency in complex data structures.
 *
 * @param schema - The primary schema that defines the structure and types expected in the content.
 * @param nestedSchemas - An array of nested schemas that are referenced within the primary schema.
 *   These nested schemas provide additional structure and type definitions for parts of the content.
 * @param contents - The actual data to be included in the content object. This data should
 *   conform to the structure and types defined in the schema and nested schemas.
 * @param holder - The decentralized identifier (DID) of the holder of this content.
 * @param issuer - The decentralized identifier (DID) of the issuer of this content.
 *
 * @returns - A fully constructed IContent object that is compliant with the provided schema and nested schemas.
 *
 * @throws Various errors if the content data does not conform to the schema or nested schemas, or if there are issues
 *   with the data structure of the content.
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
    contents,
    holder,
    issuer,
  }
  verifyDataStructure(content)
  return content
}

/**
 * Creates an IContent object based on a given schema, content data, holder, and issuer. This function ensures that
 * the content data conforms to the specified schema, thereby maintaining data integrity and consistency.
 *
 * @param schema - The schema that defines the structure and types expected in the content.
 * @param contents - The actual data to be included in the content object. This data should
 *   conform to the structure and types defined in the schema.
 * @param holder - The decentralized identifier (DID) of the holder of this content.
 * @param issuer - The decentralized identifier (DID) of the issuer of this content.
 *
 * @returns - A fully constructed IContent object that is compliant with the provided schema.
 *
 * @throws Various errors if the content data does not conform to the schema, or if there are issues with the
 *   data structure of the content.
 */
export function fromSchemaAndContent(
  schema: ISchema,
  contents: IContent['contents'],
  holder: DidUri,
  issuer: DidUri
): IContent {
  Schema.verifyDataStructure(schema)
  Schema.verifyContentAgainstSchema(contents, schema)

  const content = {
    schemaId: schema.$id,
    contents,
    holder,
    issuer,
  }
  verifyDataStructure(content)
  return content
}

/**
 * Determines whether a given input is an instance of IContent. This function is a type guard that checks if the input
 * conforms to the IContent interface structure.
 *
 * @param input - The input to be checked. This is of type 'unknown' to allow flexibility in what can be
 *   passed to the function.
 *
 * @returns - Returns 'true' if the input is an instance of IContent, and 'false' otherwise.
 */
export function isIContent(input: unknown): input is IContent {
  try {
    verifyDataStructure(input as IContent)
  } catch (error) {
    return false
  }
  return true
}
