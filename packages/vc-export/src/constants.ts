/**
 * Constant for default context.
 */
export const DEFAULT_VERIFIABLE_CREDENTIAL_CONTEXT =
  'https://www.w3.org/2018/credentials/v1'

export const CORD_CREDENTIAL_CONTEXT_URL =
  'https://cord.network/contexts/credentials'

/**
 * Constant for default type.
 */
export const DEFAULT_VERIFIABLE_CREDENTIAL_TYPE = 'VerifiableCredential'
/**
 * Constant for default presentation type.
 */
export const DEFAULT_VERIFIABLEPRESENTATION_TYPE = 'VerifiablePresentation'

export const CORD_VERIFIABLE_CREDENTIAL_TYPE = 'CordCredential2020'

export const CORD_STREAM_SIGNATURE_PROOF_TYPE = 'CordStreamSignature2020'
export const CORD_SELF_SIGNATURE_PROOF_TYPE = 'CordSelfSignature2020'
export const CORD_ANCHORED_PROOF_TYPE = 'CordCredential2020'
export const CORD_CREDENTIAL_DIGEST_PROOF_TYPE = 'CordCredentialDigest2020'

export const JSON_SCHEMA_TYPE = 'JsonSchemaValidator2018'

export const CORD_CREDENTIAL_IRI_PREFIX = 'cred:cord:'

export const KeyTypesMap = {
  sr25519: 'Sr25519VerificationKey2020',
  ed25519: 'Ed25519VerificationKey2018',
  ecdsa: 'EcdsaSecp256k1VerificationKey2019',
}
