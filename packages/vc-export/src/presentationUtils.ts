/**
 * @packageDocumentation
 * @module PresentationUtils
 */
import { blake2AsHex } from '@polkadot/util-crypto'
import jsonld from 'jsonld'
import { SDKErrors, Crypto } from '@cord.network/utils'
import {
  CORD_CREDENTIAL_DIGEST_PROOF_TYPE,
  DEFAULT_VERIFIABLE_CREDENTIAL_CONTEXT,
  DEFAULT_VERIFIABLEPRESENTATION_TYPE,
  CORD_SELF_SIGNATURE_PROOF_TYPE,
} from './constants.js'
import type {
  VerifiableCredential,
  VerifiablePresentation,
  CredentialDigestProof,
  CordSelfSignatureProof,
} from './types.js'

import { DidDocument } from '@cord.network/types'

export function makeSigningData(
  rootHash: string,
  challenge?: string | null
): Uint8Array {
  return new Uint8Array([
    ...Crypto.coToUInt8(rootHash),
    ...Crypto.coToUInt8(challenge),
  ])
}

/**
 * This proof is added to a credential to prove that revealed properties were attested in the original credential.
 * For each property to be revealed, it contains an unsalted hash of the statement plus a nonce which is required to verify against the salted hash in the credential.
 * Statements and nonces are mapped to each other through the unsalted hashes.
 *
 * @param credential [[VerifiableCredential]] object containing only the credentialSubject properties you want to reveal.
 * @param proof The [[CredentialDigestProof]] to update.
 * @param options Options.
 * @param options.hasher The hashing function used to generate digests for nonce map. Should be the one used in creating the original credential.
 * @returns Proof object that can be included in a Verifiable Credential / Verifiable Presentation's proof section.
 */
export async function updateCredentialDigestProof(
  credential: VerifiableCredential,
  proof: CredentialDigestProof,
  options: { hasher?: Crypto.Hasher } = {}
): Promise<CredentialDigestProof> {
  const {
    hasher = (value, nonce?) => blake2AsHex((nonce || '') + value, 256),
  } = options

  // recreate statement digests from partial stream to identify required nonces
  const streamNonces = {}
  const expanded = await jsonld.compact(credential.credentialSubject, {})
  const statements = Object.entries(expanded).map(([key, value]) =>
    JSON.stringify({ [key]: value })
  )
  if (statements.length < 1)
    throw new Error(
      `no statements extracted from ${JSON.stringify(
        credential.credentialSubject
      )}`
    )
  statements.forEach((stmt) => {
    const digest = hasher(stmt)
    if (Object.keys(proof.nonces).includes(digest)) {
      streamNonces[digest] = proof.nonces[digest]
    } else {
      throw new Error(`nonce missing for ${stmt}`)
    }
  })

  // return the proof containing nonces which can be mapped via an unsalted hash of the statement
  return { ...proof, nonces: streamNonces }
}

/**
 * Returns a copy of a CORD Verifiable Credential where all streams about the credential subject that are not whitelisted have been removed.
 *
 * @param VC The CORD Verifiable Credential as exported with the SDK utils.
 * @param whitelist An array of properties to keep on the credential.
 * @returns A Verifiable Credential containing the original proofs, but with non-whitelisted streams removed.
 */
export async function removeProperties(
  VC: VerifiableCredential,
  whitelist: string[]
): Promise<VerifiableCredential> {
  // get property names
  const propertyNames = Object.keys(VC.credentialSubject)
  // check whitelist
  const unknownProps = whitelist.filter((prop) => !propertyNames.includes(prop))
  if (unknownProps.length > 0) {
    throw new Error(
      `whitelisted properties ${unknownProps} do not exist on this credential`
    )
  }
  // copy credential
  const copied: VerifiableCredential = JSON.parse(JSON.stringify(VC))
  // remove non-revealed props
  propertyNames.forEach((key) => {
    if (!(key.startsWith('@') || whitelist.includes(key)))
      delete copied.credentialSubject[key]
  })
  // find old proof
  let proofs = copied.proof instanceof Array ? copied.proof : [copied.proof]
  const oldStreamsProof = proofs.filter(
    (p): p is CredentialDigestProof =>
      p.type === CORD_CREDENTIAL_DIGEST_PROOF_TYPE
  )
  if (oldStreamsProof.length !== 1)
    throw new Error(
      `expected exactly one proof of type ${CORD_CREDENTIAL_DIGEST_PROOF_TYPE}`
    )
  proofs = proofs.filter((p) => p.type !== CORD_CREDENTIAL_DIGEST_PROOF_TYPE)
  // compute new (reduced) proof
  proofs.push(await updateCredentialDigestProof(copied, oldStreamsProof[0]))
  copied.proof = proofs
  return copied
}

/**
 * Creates a Verifiable Presentation from a CORD Verifiable Credential and allows removing properties while doing so. Does not currently sign the presentation or allow adding a challenge to be signed.
 *
 * @param VC The CORD Verifiable Credential as exported with the SDK utils.
 * @param showProperties An array of properties to reveal.
 * @returns A Verifiable Presentation containing the original VC with its proofs, but not extra signatures.
 */
export async function makePresentation(
  VC: VerifiableCredential,
  showProperties: string[],
  creator: DidDocument,
  keys: any,
  challenge?: string
): Promise<VerifiablePresentation> {
  const copied = await removeProperties(VC, showProperties)

  if (creator.uri !== VC.credentialSubject.holder) {
    throw new SDKErrors.CreatorMissingError;
  }
//console.log(creator, VC.credentialSubject);
  async function callback(data: any) {
    return {
    signature: keys.authentication.sign(data.data),
    keyType: keys.authentication.type,
    keyUri: `${creator.uri}${creator.authentication[0].id}`,
    }
  };

  const signature = await callback({
    data: makeSigningData(VC.credentialHash, challenge),
    did: VC.credentialSubject.holder,
  })

  const selfSProof: CordSelfSignatureProof = {
    challenge: challenge,
    type: CORD_SELF_SIGNATURE_PROOF_TYPE,
    proofPurpose: 'assertionMethod',
    verificationMethod: signature.keyUri,
    signature: Crypto.u8aToHex(signature.signature),
  }

  return {
    '@context': [DEFAULT_VERIFIABLE_CREDENTIAL_CONTEXT],
    type: [DEFAULT_VERIFIABLEPRESENTATION_TYPE],
    verifiableCredential: copied,
    holder: creator.uri,
    proof: [selfSProof],
  }
}
