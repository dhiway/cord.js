/**
 * A.
 *
 * @packageDocumentation////////////////////////////////////////////////////////
 * @module VCExport
 */

// import { decodeAddress } from '@polkadot/keyring'
// import { u8aToHex } from '@polkadot/util'
import type { AnyJson } from '@polkadot/types/types'
import { Content } from '@cord.network/transform'
import type { IDocument, ISchema } from '@cord.network/types'
import { uriToIdentifier } from '@cord.network/identifier'
import {
  DEFAULT_VERIFIABLE_CREDENTIAL_CONTEXT,
  DEFAULT_VERIFIABLE_CREDENTIAL_TYPE,
  JSON_SCHEMA_TYPE,
  CORD_ANCHORED_PROOF_TYPE,
  CORD_CREDENTIAL_DIGEST_PROOF_TYPE,
  CORD_STATEMENT_SIGNATURE_PROOF_TYPE,
  CORD_CREDENTIAL_CONTEXT_URL,
  CORD_VERIFIABLE_CREDENTIAL_TYPE,
  CORD_CREDENTIAL_IRI_PREFIX,
} from './constants.js'
import type {
  CordStatementProof,
  CredentialDigestProof,
  CredentialSchema,
  Proof,
  CordStatementSignatureProof,
  VerifiableCredential,
} from './types.js'

/**
 * @param credentialId
 */
export function fromCredentialIRI(credentialId: string): string {
  const idString = credentialId.startsWith(CORD_CREDENTIAL_IRI_PREFIX)
    ? credentialId.substring(CORD_CREDENTIAL_IRI_PREFIX.length)
    : credentialId
  return idString
}

/**
 * @param statementId
 */
export function toCredentialIRI(statementId: string): string {
  if (statementId.startsWith(CORD_CREDENTIAL_IRI_PREFIX)) {
    return statementId
  }
  return CORD_CREDENTIAL_IRI_PREFIX + statementId
}

/**
 * @param input
 * @param schemaType
 */
export function fromCredential(
  input: IDocument,
  schemaType?: ISchema
): VerifiableCredential {
  const {
    contentHashes,
    evidenceIds,
    documentHash,
    issuerSignature,
    content,
    identifier,
  } = input

  // write root hash to id
  const id = toCredentialIRI(uriToIdentifier(identifier))

  // transform & annotate statement to be json-ld and VC conformant
  const { credentialSubject } = Content.toJsonLD(content, false) as Record<
    string,
    Record<string, AnyJson>
  >

  const { issuer } = input.content

  const { issuanceDate } = input
  const expirationDate = input.validUntil
  // if schema is given, add as credential schema
  let credentialSchema: CredentialSchema | undefined
  if (schemaType) {
    const schema = schemaType
    credentialSchema = {
      '@id': schema.$id,
      '@type': JSON_SCHEMA_TYPE,
      name: schema.title,
      schema: schema.$schema,
      properties: schema.properties,
    }
  }

  const evidence = evidenceIds.map((e) => e.identifier)

  const proof: Proof[] = []

  const VC: VerifiableCredential = {
    '@context': [
      DEFAULT_VERIFIABLE_CREDENTIAL_CONTEXT,
      CORD_CREDENTIAL_CONTEXT_URL,
    ],
    id,
    type: [DEFAULT_VERIFIABLE_CREDENTIAL_TYPE, CORD_VERIFIABLE_CREDENTIAL_TYPE],
    issuer,
    issuanceDate,
    expirationDate,
    credentialSubject,
    credentialHash: documentHash,
    evidence,
    nonTransferable: true,
    proof,
    credentialSchema,
  }

  if (issuerSignature) {
    const sSProof: CordStatementSignatureProof = {
      type: CORD_STATEMENT_SIGNATURE_PROOF_TYPE,
      proofPurpose: 'assertionMethod',
      signature: issuerSignature?.signature,
      challenge: documentHash,
      verificationMethod: issuerSignature?.keyUri,
    }
    VC.proof.push(sSProof)
  }

  // add credential proof
  const statementProof: CordStatementProof = {
    type: CORD_ANCHORED_PROOF_TYPE,
    proofPurpose: 'assertionMethod',
    issuerAddress: input.content.issuer,
  }
  VC.proof.push(statementProof)

  // add hashed properties proof
  const cDProof: CredentialDigestProof = {
    type: CORD_CREDENTIAL_DIGEST_PROOF_TYPE,
    proofPurpose: 'assertionMethod',
    nonces: { ...input.contentNonceMap },
    contentHashes: [...contentHashes],
  }
  VC.proof.push(cDProof)

  return VC
}
