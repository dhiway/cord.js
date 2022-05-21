/**
 * @packageDocumentation
 * @module VCExport
 */

import { decodeAddress } from '@polkadot/keyring'
import { u8aToHex } from '@polkadot/util'
import type { AnyJson } from '@polkadot/types/types'
import { Did, ContentUtils, Identity } from '@cord.network/modules'
import type { IMark, ISchema } from '@cord.network/types'
import { signatureVerify } from '@polkadot/util-crypto'
import {
  DEFAULT_VERIFIABLE_CREDENTIAL_CONTEXT,
  DEFAULT_VERIFIABLE_CREDENTIAL_TYPE,
  JSON_SCHEMA_TYPE,
  KeyTypesMap,
  CORD_ANCHORED_PROOF_TYPE,
  CORD_CREDENTIAL_DIGEST_PROOF_TYPE,
  CORD_SELF_SIGNED_PROOF_TYPE,
  CORD_CREDENTIAL_CONTEXT_URL,
  CORD_VERIFIABLE_CREDENTIAL_TYPE,
  CORD_CREDENTIAL_IRI_PREFIX,
} from './constants.js'
import type {
  AttestedProof,
  CredentialDigestProof,
  CredentialSchema,
  Proof,
  SelfSignedProof,
  VerifiableCredential,
} from './types.js'
import { SDKErrors, Identifier } from '@cord.network/utils'
import { STREAM_PREFIX } from '@cord.network/types'

export function fromCredentialIRI(credentialId: string): string {
  const idString = credentialId.startsWith(CORD_CREDENTIAL_IRI_PREFIX)
    ? credentialId.substring(CORD_CREDENTIAL_IRI_PREFIX.length)
    : credentialId
  return idString
}

export function toCredentialIRI(streamId: string): string {
  if (streamId.startsWith(CORD_CREDENTIAL_IRI_PREFIX)) {
    return streamId
  }
  return CORD_CREDENTIAL_IRI_PREFIX + streamId
}

export function fromMark(
  input: IMark,
  holder: Identity,
  schemaType?: ISchema
): VerifiableCredential {
  const {
    contentHashes,
    legitimations,
    rootHash,
    issuerSignature,
    content,
    identifier,
  } = input.request

  // write root hash to id
  const id = toCredentialIRI(
    Identifier.getIdentifierKey(identifier, STREAM_PREFIX)
  )

  // transform & annotate stream to be json-ld and VC conformant
  const { credentialSubject } = ContentUtils.toJsonLD(content, false) as Record<
    string,
    Record<string, AnyJson>
  >

  const issuer = Did.getIdentifierFromAddress(input.content.issuer)

  // add current date bc we have no issuance date on credential
  // TODO: could we get this from block time or something?
  const issuanceDate = new Date().toISOString()

  // if schema is given, add as credential schema
  let credentialSchema: CredentialSchema | undefined
  if (schemaType) {
    const { schema, controller } = schemaType
    credentialSchema = {
      '@id': schema.$id,
      '@type': JSON_SCHEMA_TYPE,
      name: schema.title,
      schema,
      author: controller ? Did.getIdentifierFromAddress(controller) : undefined,
    }
  }

  const legitimationIds = legitimations.map((leg) => leg.request.rootHash)

  const proof: Proof[] = []

  const VC: VerifiableCredential = {
    '@context': [
      DEFAULT_VERIFIABLE_CREDENTIAL_CONTEXT,
      CORD_CREDENTIAL_CONTEXT_URL,
    ],
    type: [DEFAULT_VERIFIABLE_CREDENTIAL_TYPE, CORD_VERIFIABLE_CREDENTIAL_TYPE],
    id,
    credentialSubject,
    legitimationIds,
    issuer,
    issuanceDate,
    nonTransferable: true,
    proof,
    credentialSchema,
  }

  const keyType: string | undefined =
    KeyTypesMap[signatureVerify('', issuerSignature, content.issuer).crypto]
  if (!keyType)
    throw new TypeError(
      `Unknown signature type on credential.\nCurrently this handles ${JSON.stringify(
        Object.keys(KeyTypesMap)
      )}\nReceived: ${keyType}`
    )

  // add self-signed proof
  // infer key type
  if (input.content.holder !== holder.address) {
    throw new SDKErrors.ERROR_IDENTITY_MISMATCH()
  }

  const sSProof: SelfSignedProof = {
    type: CORD_SELF_SIGNED_PROOF_TYPE,
    proofPurpose: 'assertionMethod',
    verificationMethod: {
      type: keyType,
      publicKeyHex: u8aToHex(decodeAddress(content.holder)),
    },
    signature: holder.signStr(rootHash),
  }
  VC.proof.push(sSProof)

  // add mark proof
  const attProof: AttestedProof = {
    type: CORD_ANCHORED_PROOF_TYPE,
    proofPurpose: 'assertionMethod',
    issuerAddress: input.content.issuer,
  }
  VC.proof.push(attProof)

  // add hashed properties proof
  const cDProof: CredentialDigestProof = {
    type: CORD_CREDENTIAL_DIGEST_PROOF_TYPE,
    proofPurpose: 'assertionMethod',
    nonces: input.request.contentNonceMap,
    contentHashes,
  }
  VC.proof.push(cDProof)

  return VC
}

// export default { fromJournalStream }
// holder.signStr(rootHash)
