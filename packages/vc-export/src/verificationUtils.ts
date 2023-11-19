/**
 * @packageDocumentation
 * @module VerificationUtils
 */

import { DidResourceUri, Hash, Statement } from '@cord.network/sdk'
import { Crypto } from '@cord.network/utils'
import { signatureFromJson, verifyDidSignature } from '@cord.network/did'
import type { AnyJson } from '@polkadot/types/types'
import {
  CORD_ANCHORED_PROOF_TYPE,
  CORD_CREDENTIAL_DIGEST_PROOF_TYPE,
  CORD_SELF_SIGNATURE_PROOF_TYPE,
  CORD_STATEMENT_SIGNATURE_PROOF_TYPE,
} from './constants.js'
import { fromCredentialIRI } from './exportToVerifiableCredential.js'
import {
  CordSelfSignatureProof,
  CordStatementProof,
  CordStatementSignatureProof,
  CredentialDigestProof,
  VerifiableCredential,
} from './types.js'
import { makeSigningData } from './presentationUtils.js'

export interface VerificationResult {
  verified: boolean
  errors: Error[]
}

export enum StatementStatus {
  valid = 'valid',
  invalid = 'invalid',
  revoked = 'revoked',
  unknown = 'unknown',
}

export interface StatementVerificationResult extends VerificationResult {
  status: StatementStatus
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
export async function verifyStatementProof(
  credential: VerifiableCredential,
  proof: CordStatementProof
): Promise<StatementVerificationResult> {
  let status: StatementStatus = StatementStatus.unknown
  try {
    // check proof
    const type =
      proof['@type'] !== undefined && proof['@type'] !== null
        ? proof['@type']
        : proof.type
    // const type = proof['@type'] || proof.type
    if (type !== CORD_ANCHORED_PROOF_TYPE)
      throw new Error('Proof type mismatch')
    const { issuerAddress } = proof
    if (typeof issuerAddress !== 'string' || !issuerAddress)
      throw PROOF_MALFORMED_ERROR('issuer address not understood')
    if (issuerAddress !== credential.issuer)
      throw PROOF_MALFORMED_ERROR('credential issuer address is not matching')

    if (typeof credential.id !== 'string' || !credential.id)
      throw CREDENTIAL_MALFORMED_ERROR(
        'statement id (=statement hash) missing / invalid'
      )
    const statementId = fromCredentialIRI(credential.id)

    // const api = await ConfigService.get('api')
    // query on-chain data by credential id (= statement root hash)
    const onChainData = await Statement.getStatementDetailsfromChain(
      statementId
    )
    const onChain = await Statement.getStatementStatusfromChain(
      statementId,
      onChainData?.digest
    )
    // if not found, credential has not been attested, proof is invalid
    if (!onChain) {
      status = StatementStatus.invalid
      throw new Error(
        `credential for credential with id ${statementId} not found`
      )
    }
    // if documentHash on credential does not correspond to data on chain, proof is incorrect
    if (onChain.digest !== credential.credentialHash)
      throw new Error(
        `credential hash is not matching on-chain data: proof ${{
          hash: credential.credentialHash,
        }}`
      )

    // const onChainDataAttest = await api.query.statement.attestations(
    //   statementId,
    //   credential.credentialHash
    // )
    // const onChainAttest = Statement.fromChainAttest(
    //   onChainDataAttest,
    //   statementId
    // )
    // if issuer data on proof does not correspond to data on chain, proof is incorrect
    if (onChain.creator !== issuerAddress) {
      status = StatementStatus.invalid
      throw new Error(
        `proof not matching on-chain data: proof ${{
          issuer: issuerAddress,
        }}`
      )
    }

    // if proof data is valid but credential is flagged as revoked, credential is no longer valid
    if (onChain.revoked) {
      status = StatementStatus.revoked
      throw new Error('credential revoked')
    }
  } catch (e) {
    return {
      verified: false,
      errors: [e as Error],
      status,
    }
  }
  return { verified: true, errors: [], status: StatementStatus.valid }
}

function jsonLDcontents(
  content: Record<string, AnyJson>,
  vocabulary: string
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  Object.entries(content).forEach(([key, value]) => {
    result[vocabulary + key] = value
  })

  return result
}

function makeStatementsJsonLD(content: Record<string, AnyJson>): string[] {
  const tempContent: Record<string, AnyJson> = { ...content }
  const vocabObj = content['@context']
  // const vocabulary = vocabObj ? vocabObj['@vocab'] : undefined
  const vocabulary =
    typeof vocabObj === 'object' && vocabObj !== null && '@vocab' in vocabObj
      ? vocabObj['@vocab']
      : undefined
  if (typeof vocabulary !== 'string')
    throw new Error('Schema Identifier Missing or Not a String')
  delete tempContent['@context']
  // if (!vocabulary) throw new Error('Schema Identifier Missing')
  // delete tempContent['@context']
  const normalized = jsonLDcontents(tempContent, vocabulary)
  return Object.entries(normalized).map(([key, value]) =>
    JSON.stringify({ [key]: value })
  )
}

function getHashRoot(leaves: Uint8Array[]): Uint8Array {
  const result = Crypto.u8aConcat(...leaves)
  return Crypto.hash(result)
}

function getHashLeaves(
  contentHashes: string[],
  evidenceIds: string[],
  createdAt: string,
  validUntil: string
): Uint8Array[] {
  const result = contentHashes.map((item) => Crypto.coToUInt8(item))

  // if (evidenceIds) {
  evidenceIds.forEach((evidence) => {
    result.push(Crypto.coToUInt8(evidence))
  })
  // }
  if (createdAt && createdAt !== '') {
    result.push(Crypto.coToUInt8(createdAt))
  }
  if (validUntil && validUntil !== '') {
    result.push(Crypto.coToUInt8(validUntil))
  }

  return result
}

/**
 * Calculates the root hash of the document.
 *
 * @param document The document object.
 * @returns The document hash.
 */

/**
 * @param document
 * @param proof
 */
export function calculateCredentialHash(
  document: VerifiableCredential,
  proof: CredentialDigestProof
): Hash {
  const hashes = getHashLeaves(
    proof.contentHashes,
    document.evidence,
    document.issuanceDate || '',
    document.expirationDate || ''
  )
  const root = getHashRoot(hashes)
  return Crypto.u8aToHex(root)
}

/**
 * @param credential
 * @param proof
 * @param options
 * @param options.hasher
 */
export async function verifyCredentialDigestProof(
  credential: VerifiableCredential,
  proof: CredentialDigestProof,
  options: { hasher?: Crypto.Hasher } = {}
): Promise<VerificationResult> {
  try {
    // check proof
    const type = proof['@type'] ?? proof.type
    if (type !== CORD_CREDENTIAL_DIGEST_PROOF_TYPE)
      throw new Error('Proof type mismatch')
    if (typeof proof.nonces !== 'object') {
      throw PROOF_MALFORMED_ERROR('Proof must contain object "nonces"')
    }
    if (typeof credential.credentialSubject !== 'object')
      throw CREDENTIAL_MALFORMED_ERROR('Credential subject missing')

    // 1: check credential digest against credential contents & claim property hashes in proof
    // collect hashes from hash array, legitimations & delegationId
    const defaults = { canonicalisation: makeStatementsJsonLD }
    const { canonicalisation } = defaults

    const rootHash = calculateCredentialHash(credential, proof)
    // convert hex hashes to byte arrays & concatenate

    // throw if root hash does not match expected (=id)
    const expectedRootHash = credential.credentialHash
    if (expectedRootHash !== rootHash) {
      throw new Error(
        `Computed root hash does not match expected ${expectedRootHash} != ${rootHash}`
      )
    }
    // 2: check individual properties against claim hashes in proof
    // expand credentialSubject keys by compacting with empty context credential to produce statements
    const statements = canonicalisation(credential.credentialSubject)

    const { nonces } = proof
    // iterate over statements to produce salted hashes
    const hashed = Crypto.hashStatements(statements, { ...options, nonces })
    const digestsInProof = Object.keys(nonces)
    const result = hashed.reduce<{
      verified: boolean
      errors: Error[]
    }>(
      (status, { saltedHash, statement, digest, nonce }) => {
        // check if the statement digest was contained in the proof and mapped it to a nonce
        if (!digestsInProof.includes(digest) || !nonce) {
          status.errors.push(
            PROOF_MALFORMED_ERROR(
              `Proof contains no digest for statement ${statement} - ${digestsInProof} ${digest}`
            )
          )
          return { ...status, verified: false }
        }
        // check if the hash is whitelisted in the proof
        if (!proof.contentHashes.includes(saltedHash)) {
          status.errors.push(new Error('proof missing hash'))
          return { ...status, verified: false }
        }
        return status
      },
      { verified: true, errors: [] }
    )
    return result
  } catch (error) {
    return { verified: false, errors: [new Error(`${error}`)] }
  }
}

/**
 * @param credential
 * @param proof
 */
export async function verifyStatementSignatureProof(
  credential: VerifiableCredential,
  proof: CordStatementSignatureProof
): Promise<VerificationResult> {
  const result: VerificationResult = { verified: true, errors: [] }
  try {
    // check proof
    const type = proof['@type'] ?? proof.type
    if (type !== CORD_STATEMENT_SIGNATURE_PROOF_TYPE)
      throw new Error('Proof type mismatch')
    if (!proof.signature) throw PROOF_MALFORMED_ERROR('signature missing')
    /* TODO: for now, makePresentation takes just one VC. Think more on what should be verified. */
    const signingData = makeSigningData(proof.challenge)

    const proofJson = {
      keyUri: proof.verificationMethod as DidResourceUri,
      signature: proof.signature,
    }
    try {
      await verifyDidSignature({
        ...signatureFromJson(proofJson),
        message: signingData,
        // check if credential owner matches signer
        expectedSigner: credential.issuer as DidResourceUri,
        expectedVerificationMethod: 'authentication',
      })
    } catch (err) {
      result.verified = false
      result.errors.push(err as Error)
    }
  } catch (e) {
    result.verified = false
    result.errors = [e as Error]
    return result
  }
  return result
}

/**
 * @param credential
 * @param proof
 * @param challenge
 */
export async function verifySelfSignatureProof(
  credential: VerifiableCredential,
  proof: CordSelfSignatureProof,
  challenge?: string
): Promise<VerificationResult> {
  const result: VerificationResult = { verified: true, errors: [] }
  try {
    // check proof
    const type = proof['@type'] ?? proof.type
    if (type !== CORD_SELF_SIGNATURE_PROOF_TYPE)
      throw new Error('Proof type mismatch')
    if (!proof.signature) throw PROOF_MALFORMED_ERROR('signature missing')
    /* TODO: for now, makePresentation takes just one VC. Think more on what should be verified. */
    const signingData = makeSigningData(
      credential.credentialHash,
      proof.challenge
    )

    const proofJson = {
      keyUri: proof.verificationMethod as DidResourceUri,
      signature: proof.signature,
    }
    try {
      await verifyDidSignature({
        ...signatureFromJson(proofJson),
        message: signingData,
        // check if credential owner matches signer
        expectedSigner: credential.credentialSubject
          .holder as `did:cord:3${string}#${string}`,
        expectedVerificationMethod: 'authentication',
      })
    } catch (err) {
      result.verified = false
      result.errors.push(err as Error)
    }
  } catch (e) {
    result.verified = false
    result.errors = [e as Error]
    return result
  }
  return result
}
