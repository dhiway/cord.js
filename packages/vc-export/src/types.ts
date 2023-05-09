/**
 * @packageDocumentation
 * @module VCExportTypes
 */
import type { AnyJson } from '@polkadot/types/types'
// import type { IDidDocumentPublicKey } from '@cord.network/modules'
import type { ISchema, IIdentityPublicKey } from '@cord.network/types'
import type {
  DEFAULT_VERIFIABLE_CREDENTIAL_CONTEXT,
  DEFAULT_VERIFIABLE_CREDENTIAL_TYPE,
  DEFAULT_VERIFIABLEPRESENTATION_TYPE,
  JSON_SCHEMA_TYPE,
  CORD_ANCHORED_PROOF_TYPE,
  CORD_CREDENTIAL_DIGEST_PROOF_TYPE,
  CORD_STREAM_SIGNATURE_PROOF_TYPE,
  CORD_SELF_SIGNATURE_PROOF_TYPE,
} from './constants.js'

export interface Proof {
  type: string
  created?: string
  proofPurpose?: string
  [key: string]: any
}

export type IPublicKeyRecord = Partial<IIdentityPublicKey> &
  Pick<IIdentityPublicKey, 'publicKeyHex' | 'type'>

export interface CordStreamSignatureProof extends Proof {
  type: typeof CORD_STREAM_SIGNATURE_PROOF_TYPE
  verificationMethod: string | IPublicKeyRecord
  signature: string
}
export interface CordStreamProof extends Proof {
  type: typeof CORD_ANCHORED_PROOF_TYPE
  issuerAddress: string
}
export interface CredentialDigestProof extends Proof {
  type: typeof CORD_CREDENTIAL_DIGEST_PROOF_TYPE
  // map of unsalted property digests and nonces
  nonces: Record<string, string>
  // salted hashes of statements in credentialSubject to allow selective disclosure.
  contentHashes: string[]
}
export interface CordSelfSignatureProof extends Proof {
  type: typeof CORD_SELF_SIGNATURE_PROOF_TYPE
  verificationMethod: string | IPublicKeyRecord
  signature: string
  challenge?: string
}

export interface CredentialSchema {
  '@id': string
  '@type': typeof JSON_SCHEMA_TYPE
  schema: ISchema['$schema']
  properties: ISchema['properties']
  modelVersion?: string
  name?: string
  author?: string
  authored?: string
  proof?: Proof
}

export interface VerifiableCredential {
  '@context': [typeof DEFAULT_VERIFIABLE_CREDENTIAL_CONTEXT, ...string[]]
  // the credential types, which declare what data to expect in the credential
  id: string
  type: [typeof DEFAULT_VERIFIABLE_CREDENTIAL_TYPE, ...string[]]
  // the entity that issued the credential
  issuer: string
  // when the credential was issued
  issuanceDate: string
  // when the credential will expire
  expirationDate: string
  // streams about the subjects of the credential
  credentialSubject: Record<string, AnyJson>
  // rootHash  of the credential
  credentialHash: string
  // Ids / digests of streams that empower the issuer to provide judegment
  evidence: string[]
  // digital proof that makes the credential tamper-evident
  proof: Proof | Proof[]
  nonTransferable?: boolean
  credentialSchema?: CredentialSchema
}

export interface VerifiablePresentation {
  '@context': [typeof DEFAULT_VERIFIABLE_CREDENTIAL_CONTEXT, ...string[]]
  type: [typeof DEFAULT_VERIFIABLEPRESENTATION_TYPE, ...string[]]
  verifiableCredential: VerifiableCredential | VerifiableCredential[]
  holder?: string
  proof: Proof | Proof[]
}
