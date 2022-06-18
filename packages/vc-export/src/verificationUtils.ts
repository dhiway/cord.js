/**
 * @packageDocumentation
 * @module VerificationUtils
 */

import { u8aConcat, hexToU8a, u8aToHex } from '@polkadot/util'
import { signatureVerify, blake2AsHex } from '@polkadot/util-crypto'
import jsonld from 'jsonld'
import { Stream, TypeSchema, Did } from '@cord.network/modules'
import { Crypto, JsonSchema } from '@cord.network/utils'
import {
  CORD_SELF_SIGNED_PROOF_TYPE,
  CORD_ANCHORED_PROOF_TYPE,
  CORD_CREDENTIAL_DIGEST_PROOF_TYPE,
  KeyTypesMap,
} from './constants.js'
import type {
  VerifiableCredential,
  SelfSignedProof,
  AttestedProof,
  CredentialDigestProof,
} from './types.js'
import { fromCredentialIRI } from './exportToVerifiableCredential.js'

export interface VerificationResult {
  verified: boolean
  errors: Error[]
}

export enum MarkStatus {
  valid = 'valid',
  invalid = 'invalid',
  revoked = 'revoked',
  unknown = 'unknown',
}

export interface MarkVerificationResult extends VerificationResult {
  status: MarkStatus
}

const CREDENTIAL_MALFORMED_ERROR = (reason: string): Error =>
  new Error(`Credential malformed: ${reason}`)

const PROOF_MALFORMED_ERROR = (reason: string): Error =>
  new Error(`Proof malformed: ${reason}`)

/**
 * Verifies a self signed proof (holder signature) against a CORD Verifiable Credential.
 * This entails computing the root hash from the hashes contained in the `protected` section of the credentialSubject.
 * The resulting hash is then verified against the signature and public key contained in the proof (the latter
 * could be a DID URI in the future). It is also expected to by identical to the credential id.
 *
 * @param credential Verifiable Credential to verify proof against.
 * @param proof CORD self signed proof object.
 * @returns Object indicating whether proof could be verified.
 */
export function verifySelfSignedProof(
  credential: VerifiableCredential,
  proof: SelfSignedProof
): VerificationResult {
  const result: VerificationResult = { verified: true, errors: [] }
  try {
    // check proof
    const type = proof['@type'] || proof.type
    if (type !== CORD_SELF_SIGNED_PROOF_TYPE)
      throw new Error('Proof type mismatch')
    if (!proof.signature) throw PROOF_MALFORMED_ERROR('signature missing')
    const { verificationMethod } = proof
    if (
      !(
        typeof verificationMethod === 'object' &&
        verificationMethod.publicKeyHex
      )
    ) {
      throw PROOF_MALFORMED_ERROR(
        'proof must contain public key; resolve did key references beforehand'
      )
    }
    const keyType = verificationMethod.type || verificationMethod['@type']
    if (!Object.values(KeyTypesMap).includes(keyType))
      throw PROOF_MALFORMED_ERROR(
        `signature type unknown; expected one of ${JSON.stringify(
          Object.values(KeyTypesMap)
        )}, got "${verificationMethod.type}"`
      )
    const signerPubKey = verificationMethod.publicKeyHex

    const rootHash = fromCredentialIRI(credential.id)
    // validate signature over root hash
    // signatureVerify can handle all required signature types out of the box
    const verification = signatureVerify(
      rootHash,
      proof.signature,
      signerPubKey
    )
    if (
      !(verification.isValid && KeyTypesMap[verification.crypto] === keyType)
    ) {
      throw new Error('signature could not be verified')
    }
    return result
  } catch (e) {
    result.verified = false
    result.errors = [e as Error]
    return result
  }
}

/**
 * Verifies a CORD credential proof by querying data from the CORD blockchain.
 * This includes querying the CORD blockchain with the credential id, which returns an credential record if attested.
 * This record is then compared against issuer address and delegation id (the latter of which is taken directly from the credential).
 *
 * @param credential Verifiable Credential to verify proof against.
 * @param proof CORD self signed proof object.
 * @returns Object indicating whether proof could be verified.
 */
export async function verifyAttestedProof(
  credential: VerifiableCredential,
  proof: AttestedProof
): Promise<MarkVerificationResult> {
  let status: MarkStatus = MarkStatus.unknown
  try {
    // check proof
    const type = proof['@type'] || proof.type
    if (type !== CORD_ANCHORED_PROOF_TYPE)
      throw new Error('Proof type mismatch')
    const { issuerAddress } = proof
    if (typeof issuerAddress !== 'string' || !issuerAddress)
      throw PROOF_MALFORMED_ERROR('issuer address not understood')
    if (issuerAddress !== Did.getAddressFromIdentifier(credential.issuer))
      throw PROOF_MALFORMED_ERROR(
        'issuer address not matching credential issuer'
      )
    if (typeof credential.id !== 'string' || !credential.id)
      throw CREDENTIAL_MALFORMED_ERROR(
        'stream id (=stream hash) missing / invalid'
      )
    const streamId = fromCredentialIRI(credential.id)

    // query on-chain data by credential id (= stream root hash)
    const onChain = await Stream.query(streamId)
    // if not found, credential has not been attested, proof is invalid
    if (!onChain) {
      status = MarkStatus.invalid
      throw new Error(`credential for credential with id ${streamId} not found`)
    }
    // if data on proof does not correspond to data on chain, proof is incorrect
    if (onChain.issuer !== issuerAddress) {
      status = MarkStatus.invalid
      throw new Error(
        `proof not matching on-chain data: proof ${{
          issuer: issuerAddress,
        }}`
      )
    }
    // if proof data is valid but credential is flagged as revoked, credential is no longer valid
    if (onChain.revoked) {
      status = MarkStatus.revoked
      throw new Error('credential revoked')
    }
  } catch (e) {
    return {
      verified: false,
      errors: [e as Error],
      status,
    }
  }
  return { verified: true, errors: [], status: MarkStatus.valid }
}

/**
 * Verifies a proof that reveals the content of selected properties to a verifier. This enables selective disclosure.
 * Values and nonces contained within this proof will be hashed, the result of which is expected to equal hashes on the credential.
 *
 * @param credential Verifiable Credential to verify proof against.
 * @param proof CORD self signed proof object.
 * @param options Allows passing custom hasher.
 * @param options.hasher A custom hasher. Defaults to hex(blake2-256('nonce'+'value')).
 * @returns Object indicating whether proof could be verified.
 */
export async function verifyCredentialDigestProof(
  credential: VerifiableCredential,
  proof: CredentialDigestProof,
  options: { hasher?: Crypto.Hasher } = {}
): Promise<VerificationResult> {
  const {
    hasher = (value, nonce?) => blake2AsHex((nonce || '') + value, 256),
  } = options
  const result: VerificationResult = { verified: true, errors: [] }
  try {
    // check proof
    const type = proof['@type'] || proof.type
    if (type !== CORD_CREDENTIAL_DIGEST_PROOF_TYPE)
      throw new Error('Proof type mismatch')
    if (typeof proof.nonces !== 'object') {
      throw PROOF_MALFORMED_ERROR('proof must contain object "nonces"')
    }
    if (typeof credential.credentialSubject !== 'object')
      throw CREDENTIAL_MALFORMED_ERROR('credential subject missing')

    // 1: check credential digest against credential contents & stream property hashes in proof
    // collect hashes from hash array, legitimations & delegationId
    const hashes: string[] = proof.streamHashes.concat(
      credential.legitimationIds
    )
    // convert hex hashes to byte arrays & concatenate
    const concatenated = u8aConcat(
      ...hashes.map((hexHash) => hexToU8a(hexHash))
    )
    const rootHash = Crypto.hash(concatenated)

    // throw if root hash does not match expected (=id)
    const expectedRootHash = fromCredentialIRI(credential.id)
    if (expectedRootHash !== u8aToHex(rootHash))
      throw new Error('computed root hash does not match expected')

    // 2: check individual properties against stream hashes in proof
    // expand credentialSubject keys by compacting with empty context credential to produce statements
    const flattened = await jsonld.compact(credential.credentialSubject, {})
    const statements = Object.entries(flattened).map(([key, value]) =>
      JSON.stringify({ [key]: value })
    )
    const expectedUnsalted = Object.keys(proof.nonces)

    return statements.reduce<VerificationResult>(
      (r, stmt) => {
        const unsalted = hasher(stmt)
        if (!expectedUnsalted.includes(unsalted))
          return {
            verified: false,
            errors: [
              ...r.errors,
              PROOF_MALFORMED_ERROR(
                `Proof contains no digest for statement ${stmt}`
              ),
            ],
          }
        const nonce = proof.nonces[unsalted]
        if (!proof.streamHashes.includes(hasher(unsalted, nonce)))
          return {
            verified: false,
            errors: [
              ...r.errors,
              new Error(
                `Proof for statement ${stmt} not valid against streamHashes`
              ),
            ],
          }
        return r
      },
      { verified: true, errors: [] }
    )
  } catch (e) {
    result.verified = false
    result.errors = [e as Error]
    return result
  }
}

export function validateSchema(
  credential: VerifiableCredential
): VerificationResult {
  const { schema } = credential.credentialSchema || {}
  // if present, perform schema validation
  if (schema) {
    // there's no rule against additional properties, so we can just validate the ones that are there

    const validator = new JsonSchema.Validator(schema)
    validator.addSchema(TypeSchema.SchemaModel)
    const result = validator.validate(credential.credentialSubject)
    return {
      verified: result.valid,
      errors: result.errors?.map((e) => new Error(e.error)) || [],
    }
  }
  return { verified: false, errors: [] }
}
