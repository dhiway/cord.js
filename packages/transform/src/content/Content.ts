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
import { SDKErrors, Crypto, DataUtils } from '@cord.network/utils'
import * as Did from '@cord.network/did'
import { isValidIdentifier } from '@cord.network/identifier'
import * as Schema from '../schema/index.js'

const VC_VOCAB = 'https://www.w3.org/2018/credentials/v1'

/**
 * Transforms a given content object into a JSON-LD format. JSON-LD (JavaScript Object Notation
 * for Linked Data) is a method of encoding Linked Data using JSON. This format enables data
 * serialization that is both human-readable and machine-readable. The function supports
 * two JSON-LD formats: compacted and expanded.
 *
 * @param content - The content object to be transformed. This object is a partial representation
 *                  of an [[IContent]]. It must include the `schemaId` property, and may include
 *                  `contents`, `holder`, and `issuer` properties. The `schemaId` is crucial for
 *                  determining the vocabulary used in the JSON-LD output.
 * @param [expanded=true] - Flag to determine the JSON-LD output format. If true, the output is
 *                          in an expanded JSON-LD format. In this format, property keys are
 *                          explicitly transformed into globally unique predicates using the
 *                          schema's vocabulary. If false, the output is in a compacted format,
 *                          where such transformation is implicit, utilizing JSON-LD's `@context`
 *                          for simpler, more readable output.
 *
 * @returns - An object representing the content in JSON-LD format.
 *                                      This object can be serialized into a valid JSON-LD string.
 *
 * @throws {SDKErrors.SchemaIdentifierMissingError} - If the `schemaId` is missing in the
 *                                                    provided content object, this error is
 *                                                    thrown. The `schemaId` is essential for
 *                                                    generating the correct JSON-LD output.
 *
 * @internal
 */
function jsonLDcontents(
  content: PartialContent,
  expanded = true
): Record<string, unknown> {
  const { schemaUri, contents, holderUri, issuerUri } = content

  if (!schemaUri)
    throw new SDKErrors.SchemaIdentifierMissingError(
      `No Schema identifier provided`
    )

  const vocabulary = `${schemaUri}#`
  const result: Record<string, unknown> = {}

  if (issuerUri) result.issuer = issuerUri
  if (holderUri) result.holder = holderUri

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
 * Transforms a content object into a JSON-LD format suitable for use with Verifiable Credentials.
 * This function prepares the content for serialization and integration in credentialing systems,
 * ensuring compliance with the JSON-LD standards employed in such systems.
 *
 * @param content - The content object to transform. This object is a partial representation of an
 *                  [[IContent]], which must include the `schemaId` property. It may also include other
 *                  properties such as `contents`, `holder`, and `issuer`. These properties are used to
 *                  create the JSON-LD structure.
 * @param [expanded=true] - Determines the JSON-LD output format. If true, the function produces an expanded
 *                          JSON-LD format, where predicates are explicitly detailed. If false, it produces a
 *                          compacted format where predicates are implicit, utilizing JSON-LD's `@context`
 *                          for a more streamlined structure.
 *
 * @returns - An object representing the content in a JSON-LD format that is
 *                                      compliant with the standards for Verifiable Credentials. This
 *                                      object includes the `credentialSubject` and `credentialSchema`
 *                                      fields, structured according to the `expanded` parameter.
 *
 * @internal
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
    '@id': content.schemaUri,
  }
  if (!expanded) result['@context'] = { '@vocab': VC_VOCAB }
  return result
}

/**
 * Generates an array of JSON-LD formatted strings, with each string representing an individual
 * statement derived from a given content object. This function is particularly useful for breaking
 * down a content object into separate JSON-LD statements, facilitating their use in diverse data
 * processing scenarios.
 *
 * @param content - The content object from which JSON-LD statements are to be generated. This object
 *                  should be a partial representation of an [[IContent]], containing key-value pairs
 *                  that are to be transformed into individual JSON-LD statements.
 *
 * @returns - An array of strings, where each string is a JSON-LD formatted representation
 *                       of a single statement from the content object. Each statement is encapsulated
 *                       in its own JSON object within the string.
 *
 * @internal
 */
function makeStatementsJsonLD(content: PartialContent): string[] {
  const normalized = jsonLDcontents(content, true)
  return Object.entries(normalized).map(([key, value]) =>
    JSON.stringify({ [key]: value })
  )
}

/**
 * Generates salted hashes of individual statements from a content object (full or partial) for selective
 * disclosure and cryptographic integrity verification. This function is also utilized to recreate hashes
 * for validation purposes, forming a critical component in maintaining and verifying content integrity
 * in a secure manner.
 *
 * @param content - The content object, which can be a full or partial representation of an [[IContent]],
 *                  from which statement hashes are produced. This object contains the data that will be
 *                  hashed.
 * @param [options={}] - An optional parameter object to customize the hashing process.
 * @param [options.canonicalisation=makeStatementsJsonLD] - Optional canonicalisation routine that
 *   converts the content into an array of statement strings. The default routine generates individual
 *   `{"key":"value"}` JSON representations, where keys are transformed into expanded JSON-LD format.
 * @param [options.nonces] - An optional map of nonces, used in the hashing process. If not provided,
 *   nonces are automatically generated.
 * @param [options.nonceGenerator] - Optional nonce generator function as defined by [[hashStatements]].
 *   Defaults to generating random UUIDs (v4).
 * @param [options.hasher] - The hashing function to be used. It defaults to a 256-bit blake2 hasher,
 *   applied over the format `${nonce}${statement}`.
 * @param [options.selectedAttributes] - An optional array of attribute names to include in the hashing process.
 *   Only the specified attributes will be hashed if this is provided.
 *
 * @returns - An object containing two fields: `hashes`, an array of salted hashes, and `nonceMap`, a map where
 *            each key corresponds to an unsalted statement hash. The `nonceMap` is essential for ensuring the
 *            integrity and non-repudiation of the hashed contents.
 *
 * @internal
 */
export function hashContents(
  content: PartialContent,
  options: Crypto.HashingOptions & {
    selectedAttributes?: string[]
    canonicalisation?: (content: PartialContent) => string[]
  } = {}
): {
  hashes: HexString[]
  nonceMap: Record<`0x${string}`, string>
} {
  // apply defaults
  const defaults = { canonicalisation: makeStatementsJsonLD }
  const canonicalisation = options.canonicalisation || defaults.canonicalisation
  // use canonicalisation algorithm to make hashable statement strings
  const statements = canonicalisation(content)
  console.log(statements)
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
  const nonceMap: Record<`0x${string}`, string> = {}
  processed.forEach(({ digest, nonce, statement }) => {
    // throw if we can't map a digest to a nonce - this should not happen if the nonce map is complete and the credential has not been tampered with
    if (!nonce) throw new SDKErrors.ContentNonceMapMalformedError(statement)
    nonceMap[digest] = nonce
  }, {})
  return { hashes, nonceMap }
}

/**
 * Verifies the hash list based proof for the set of disclosed attributes in a [[Content]] object.
 * This function is essential in scenarios where selective disclosure is utilized, as it ensures the
 * integrity and authenticity of disclosed attributes in the content object.
 *
 * @param content - The content object (full or partial) against which the proof is to be verified.
 *                  This should be a representation of an [[IContent]], containing the attributes
 *                  whose integrity and authenticity are to be verified.
 * @param proof - The proof object containing the necessary elements for verification.
 * @param proof.nonces - A map where each statement digest (generated by the hasher) is associated
 *                       with a nonce. This is crucial for the verification process.
 * @param proof.hashes - An array of hashes that are part of the signed credential. These hashes
 *                       result from combining statement digests with corresponding nonces in
 *                       `proof.nonces`, processed through the hasher.
 * @param [attributes] - Optional array of attribute names to include in the verification process.
 *                       If specified, only these attributes will be subject to verification.
 * @param [options={}] - Optional parameters to customize the verification process.
 * @param [options.canonicalisation=makeStatementsJsonLD] - Optional canonicalisation routine to
 *   convert the content into an array of statement strings. The default routine generates individual
 *   `{"key":"value"}` JSON representations with keys transformed into expanded JSON-LD format.
 * @param [options.hasher] - The hashing function used for verification. By default, this is a 256-bit
 *   blake2 hasher applied over the format `${nonce}${statement}`.
 *
 * @throws {SDKErrors.ContentUnverifiableError} - Throws an error if one or more statements in the
 *                                                content could not be verified, indicating an issue
 *                                                with the integrity or authenticity of the content.
 *
 * @internal
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
  const statements = canonicalisation(content)
  let filteredStatements = statements
  if (attributes && attributes.length > 0) {
    filteredStatements = DataUtils.filterStatements(statements, attributes)
  }
  const hashed = Crypto.hashStatements(filteredStatements, {
    ...options,
    nonces,
  })
  const digestsInProof = Object.keys(nonces)
  const { verified, errors } = hashed.reduce<{
    verified: boolean
    errors: Error[]
  }>(
    (status, { saltedHash, statement, digest, nonce }) => {
      if (!digestsInProof.includes(digest) || !nonce) {
        status.errors.push(new SDKErrors.NoProofForStatementError(statement))
        return { ...status, verified: false }
      }
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
      'One or more elements in the content could not be verified',
      { cause: errors }
    )
  }
}

/**
 * Validates the structure of the content object. This helper function is used internally by
 * `verifyDataStructure` to recursively check each property in the content object. It ensures that
 * each property conforms to the expected types (string, number, boolean, object) and recursively
 * validates nested objects. Arrays are accepted as is, without validation of their contents.
 *
 * @param contents - The contents object of an IContent or PartialContent to validate.
 *
 * @throws {SDKErrors.InputContentsMalformedError} - Throws an error if any key is not a string or
 *                                                   if any value type is not one of the expected
 *                                                   types and is not an array.
 *
 * @internal
 */
function validateContentStructure(contents: Record<string, any>): void {
  Object.entries(contents).forEach(([key, value]) => {
    if (!key || typeof key !== 'string') {
      throw new SDKErrors.InputContentsMalformedError(
        `Invalid Content: Key is not a string`
      )
    }

    const valueType = typeof value
    if (valueType === 'object' && value !== null && !Array.isArray(value)) {
      validateContentStructure(value)
    } else if (
      !['string', 'number', 'boolean', 'object'].includes(valueType) &&
      !Array.isArray(value)
    ) {
      throw new SDKErrors.InputContentsMalformedError(
        `Invalid Content: Invalid type for key ${key}`
      )
    }
  })
}

/**
 * Validates the structure and types of a content object, which can be either a full [[IContent]]
 * or a partial representation ([[PartialContent]]). This function is crucial for ensuring that the
 * input content conforms to the expected format, safeguarding the integrity and consistency of
 * data processing within the system.
 *
 * The function verifies the presence and validity of essential fields such as `schemaId`, `holder`,
 * and `issuer`. It also checks the structure and types of the contents against expected types.
 *
 * @param input - The content object to be validated. This can be a complete [[IContent]] or a
 *                partial representation ([[PartialContent]]). The function checks this object to
 *                ensure it meets the structural and type requirements.
 *
 * @throws {SDKErrors.IdentifierMissingError} - Throws an error if the `schemaId`, `holder`, or
 *                                               `issuer` identifiers are missing in the input object.
 *                                               These identifiers are essential for identifying the
 *                                               schema, holder, and issuer of the content.
 * @throws {SDKErrors.InputContentsMalformedError} - Throws an error if the contents of the input
 *                                                   object are malformed. This includes checks for
 *                                                   the existence and type of keys, and whether values
 *                                                   are of type string, number, boolean, or object.
 *                                                   Arrays are accepted without validation of their
 *                                                   individual elements.
 * @throws {SDKErrors.InvalidIdentifierError} - Throws an error if the `schemaId` does not conform
 *                                               to the expected format or identifier standards,
 *                                               ensuring that the schema reference is valid.
 *
 * @internal
 */
export function verifyDataStructure(input: IContent | PartialContent): void {
  if (!input.schemaUri) {
    throw new SDKErrors.IdentifierMissingError(`Schema identifier missing`)
  }

  if ('holderUri' in input) {
    Did.validateUri(input.holderUri, 'Did')
  } else {
    throw new SDKErrors.IdentifierMissingError(`Holder identifier missing`)
  }

  if ('issuerUri' in input) {
    Did.validateUri(input.issuerUri, 'Did')
  } else {
    throw new SDKErrors.IdentifierMissingError(`Issuer identifier missing`)
  }

  if (input.contents !== undefined) {
    validateContentStructure(input.contents)
  }

  const [isValid, errorMessage] = isValidIdentifier(input.schemaUri)
  if (!isValid) {
    throw new SDKErrors.InvalidIdentifierError(
      errorMessage || `Invalid schema identifier: ${input.schemaUri}`
    )
  }
}

/**
 * Verifies a given content object against a specified schema and checks its data structure. This function is
 * essential for ensuring that the content conforms both to the expected data structure and the schema requirements,
 * thus maintaining data integrity and consistency within the system.
 *
 * @param inputContent - The content object to be verified. This should be a complete [[IContent]] representation,
 *                       which contains the data to be validated.
 * @param schema - The schema against which the content is to be validated. This schema defines the expected
 *                 structure, format, and data types that the content should adhere to.
 *
 * @throws Various errors depending on the specific nature of the validation failure. These can include errors
 *         related to schema mismatches, data structure inconsistencies, and other issues as identified by the
 *         `Schema.verifyContentAgainstSchema` and `verifyDataStructure` functions. The specific error types
 *         thrown help in pinpointing the exact nature of the validation failure.
 *
 * @internal
 */
export function verify(inputContent: IContent, schema: ISchema): void {
  Schema.verifyContentAgainstSchema(inputContent.contents, schema)
  verifyDataStructure(inputContent)
}

/**
 * Creates an IContent object based on a given schema, content data, holder, and issuer. This function
 * ensures that the content data conforms to the specified schema, thereby maintaining data integrity
 * and consistency within the system.
 *
 * @param schema - The schema that defines the structure and types expected in the content.
 * @param schemaUri
 * @param type
 * @param contents - The actual data to be included in the content object. This data should conform
 *                   to the structure and types defined in the schema.
 * @param holder - The decentralized identifier (DID) of the holder of this content.
 * @param issuer - The decentralized identifier (DID) of the issuer of this content.
 *
 * @param holderUri
 * @param issuerUri
 * @returns - A fully constructed IContent object that complies with the provided schema.
 *
 * @throws Various errors if the content data does not conform to the schema, or if there are issues
 *         with the content's data structure.
 *
 * @example
 * // Define a schema
 * const userSchema = Schema.buildFromProperties('User', {
 *   name: { type: 'string' },
 *   age: { type: 'number' },
 *   email: { type: 'string' },
 * });
 *
 * // Define content data
 * const userData = {
 *   name: 'Ashok Kumar',
 *   age: 30,
 *   email: 'ashok.kumar@example.com',
 * };
 *
 * // Holder and Issuer DIDs
 * const holderDid = 'did:cord:123456789abcdefghi';
 * const issuerDid = 'did:cord:987654321hgfedcba';
 *
 * // Build IContent object
 * const contentObject = buildFromContentProperties(
 *   userSchema,
 *   userData,
 *   holderDid,
 *   issuerDid
 * );
 *
 * // Use contentObject in your application
 */
export function buildFromContentProperties(
  schema: ISchema,
  type: string[],
  contents: IContent['contents'],
  holderUri: DidUri,
  issuerUri: DidUri
): IContent {
  Schema.verifyDataStructure(schema)
  Schema.verifyContentAgainstSchema(contents, schema)

  if (type.length < 1 || type.length > 3) {
    throw new SDKErrors.ContentTypeMissingError(
      `Type array elements must be between 1 and 3 elements.`
    )
  }

  const content = {
    schemaUri: schema.$id,
    type,
    contents,
    holderUri,
    issuerUri,
  }
  verifyDataStructure(content)
  return content
}

/**
 * Determines whether a given input is an instance of IContent. This function acts as a type guard,
 * checking if the input adheres to the IContent interface structure. It's useful in situations where
 * the type of the input is uncertain and needs to be validated against the IContent structure.
 *
 * @param input - The input to be checked. This is of type 'unknown' to allow for flexibility in what
 *                can be passed to the function.
 *
 * @returns - Returns 'true' if the input is an instance of IContent, and 'false' otherwise.
 *
 * @example
 * // Example of an object that conforms to IContent
 * const validContent = {
 *   schemaId: 'schemaId1',
 *   contents: {
 *     name: 'Ashok Kumar',
 *     age: 30,
 *   },
 *   holder: 'did:cord:123456789abcdefghi',
 *   issuer: 'did:cord:987654321hgfedcba',
 * };
 *
 * // Example of an object that does not conform to IContent
 * const invalidContent = {
 *   name: 'Ashok Kumar',
 *   age: 28,
 * };
 *
 * // Using isIContent to check the objects
 * console.log(isIContent(validContent)); // Expected output: true
 * console.log(isIContent(invalidContent)); // Expected output: false
 */
export function isIContent(input: unknown): input is IContent {
  try {
    verifyDataStructure(input as IContent)
  } catch (error) {
    return false
  }
  return true
}
