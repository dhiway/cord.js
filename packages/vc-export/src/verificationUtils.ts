/**
 * @packageDocumentation
 * @module VerificationUtils
 */

import { ConfigService, DidResourceUri, Stream } from "@cord.network/sdk"
import { CORD_ANCHORED_PROOF_TYPE, CORD_CREDENTIAL_DIGEST_PROOF_TYPE, CORD_SELF_SIGNATURE_PROOF_TYPE } from "./constants"
import { fromCredentialIRI } from "./exportToVerifiableCredential"
import { CordSelfSignatureProof, CordStreamProof, CordStreamSignatureProof, CredentialDigestProof, VerifiableCredential } from "./types"
import { Crypto } from "@cord.network/utils"
import { u8aConcat, hexToU8a, u8aToHex } from '@polkadot/util'
import { blake2AsHex } from '@polkadot/util-crypto'
import { makeSigningData } from "./presentationUtils"
import { signatureFromJson, verifyDidSignature } from "@cord.network/did"

export interface VerificationResult {
  verified: boolean
  errors: Error[]
}

export enum StreamStatus {
  valid = 'valid',
  invalid = 'invalid',
  revoked = 'revoked',
  unknown = 'unknown',
}

export interface StreamVerificationResult extends VerificationResult {
  status: StreamStatus
}

const CREDENTIAL_MALFORMED_ERROR = (reason: string): Error =>
  new Error(`Credential malformed: ${reason}`)

const PROOF_MALFORMED_ERROR = (reason: string): Error =>
  new Error(`Proof malformed: ${reason}`)

/**
 * Verifies a CORD credential proof by querying data from the CORD blockchain.
 * This includes querying the CORD blockchain with the credential id, which returns an credential record if attested.
 * This record is then compared against issuer address and delegation id (the latter of which is taken directly from the credential).
 *
 * @param credential Verifiable Credential to verify proof against.
 * @param proof CORD self signed proof object.
 * @returns Object indicating whether proof could be verified.
 */
export async function verifyStreamProof(
  credential: VerifiableCredential,
  proof: CordStreamProof
): Promise<StreamVerificationResult> {
  let status: StreamStatus = StreamStatus.unknown
  try {
    // check proof
    const type = proof['@type'] || proof.type
    if (type !== CORD_ANCHORED_PROOF_TYPE)
      throw new Error('Proof type mismatch')
    const { issuerAddress } = proof
    if (typeof issuerAddress !== 'string' || !issuerAddress)
      throw PROOF_MALFORMED_ERROR('issuer address not understood')
    if (issuerAddress !== credential.issuer)
      throw PROOF_MALFORMED_ERROR('credential issuer address is not matching')

    if (typeof credential.id !== 'string' || !credential.id)
      throw CREDENTIAL_MALFORMED_ERROR(
        'stream id (=stream hash) missing / invalid'
      )
    const streamId = fromCredentialIRI(credential.id)

    const api = await ConfigService.get('api');
    // query on-chain data by credential id (= stream root hash)
    const onChainData = await api.query.stream.streams(streamId)
    const onChain = Stream.fromChain(onChainData, streamId);
    // if not found, credential has not been attested, proof is invalid
    if (!onChain) {
      status = StreamStatus.invalid
      throw new Error(`credential for credential with id ${streamId} not found`)
    }
    // if issuer data on proof does not correspond to data on chain, proof is incorrect
    if (onChain.issuer !== issuerAddress) {
      status = StreamStatus.invalid
      throw new Error(
        `proof not matching on-chain data: proof ${{
          issuer: issuerAddress,
        }}`
      )
    }

    // if documentHash on credential does not correspond to data on chain, proof is incorrect
    if (onChain.streamHash !== credential.credentialHash)
      throw new Error(
        `credential hash is not matching on-chain data: proof ${{
          hash: credential.credentialHash,
        }}`
      )

    // if proof data is valid but credential is flagged as revoked, credential is no longer valid
    if (onChain.revoked) {
      status = StreamStatus.revoked
      throw new Error('credential revoked')
    }
  } catch (e) {
    return {
      verified: false,
      errors: [e as Error],
      status,
    }
  }
  return { verified: true, errors: [], status: StreamStatus.valid }
}


export async function verifyCredentialDigestProof(
  credential: VerifiableCredential,
  proof: CredentialDigestProof,
  options: { hasher?: Crypto.Hasher } = {}
): Promise<VerificationResult> {
  const result: VerificationResult = { verified: true, errors: [] }
  const {
    hasher = (value, nonce?) => blake2AsHex((nonce || '') + value, 256),
  } = options
  try {
    // check proof
    const type = proof['@type'] ?? proof.type
    if (type !== CORD_CREDENTIAL_DIGEST_PROOF_TYPE)
      throw new Error('Proof type mismatch')
    if (typeof proof.nonces !== 'object') {
      throw  PROOF_MALFORMED_ERROR('Proof must contain object "nonces"')
    }
    if (typeof credential.credentialSubject !== 'object')
      throw CREDENTIAL_MALFORMED_ERROR('Credential subject missing')

    // 1: check credential digest against credential contents & claim property hashes in proof
    // collect hashes from hash array, legitimations & delegationId
    const hashes = proof.contentHashes
    // convert hex hashes to byte arrays & concatenate
    const concatenated = u8aConcat(
      ...hashes.map((hexHash) => hexToU8a(hexHash))
    )
    const rootHash = Crypto.hash(concatenated)

    // throw if root hash does not match expected (=id)
    const expectedRootHash = fromCredentialIRI(credential.id)
    if (expectedRootHash !== u8aToHex(rootHash))
      throw new Error('Computed root hash does not match expected')

    // 2: check individual properties against claim hashes in proof
    // expand credentialSubject keys by compacting with empty context credential to produce statements
    const flattened = credential.credentialSubject;// await jsonld.compact(credential.credentialSubject, {})
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
        if (!proof.claimHashes.includes(hasher(unsalted, nonce)))
          return {
            verified: false,
            errors: [
              ...r.errors,
              new Error(
                `Proof for statement "${stmt}" not valid against contentHashes`
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

  return result;
}
/*
export function verifySelfSignatureProof(
  credential: VerifiableCredential,
  proof: CordSelfSignatureProof,
  challenge?: string
): VerificationResult {
  const result: VerificationResult = { verified: true, errors: []}
  return result;
}
*/

export function verifyStreamSignatureProof(
    credential: VerifiableCredential,
    proof: CordStreamSignatureProof
): VerificationResult {
  const result: VerificationResult = { verified: true, errors: [] }
  return result;
}


export async function verifySelfSignatureProof(
  credential: VerifiableCredential,
  proof: CordSelfSignatureProof,
  challenge?: string
 ) : Promise<VerificationResult> {
  const result: VerificationResult = { verified: true, errors: [] }
  try {
    // check proof
    const type = proof['@type'] ?? proof.type
    if (type !== CORD_SELF_SIGNATURE_PROOF_TYPE)
      throw new Error('Proof type mismatch')
    if (!proof.signature) throw PROOF_MALFORMED_ERROR('signature missing')
    /*TODO: for now, makePresentation takes just one VC. Think more on what should be verified. */ 
    const signingData = makeSigningData(credential.credentialHash, proof.challenge)

    const proofJson = {
      keyUri: proof.verificationMethod as DidResourceUri,
      signature: proof.signature,
    }
    try {
    await verifyDidSignature({
      ...signatureFromJson(proofJson),
      message: signingData,
      // check if credential owner matches signer
      expectedSigner: credential.credentialSubject.holder as `did:cord:3${string}#${string}`,
      expectedVerificationMethod: 'authentication'
    })
  } catch (err) {
    result.verified = false;
    result.errors.push(err as  Error);
  }
  } catch (e) {
    result.verified = false
    result.errors = [e as Error]
    return result
  }
  return result;
}
