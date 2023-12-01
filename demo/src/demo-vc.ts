import * as VCUtils from '@cord.network/vc-export'
import * as Cord from '@cord.network/sdk'
import { UUID, Crypto } from '@cord.network/utils'
import { generateKeypairs } from './utils/generateKeypairs'
import { createDid } from './utils/generateDid'
import { createDidName } from './utils/generateDidName'
import { getDidDocFromName } from './utils/queryDidName'
import { ensureStoredSchema } from './utils/generateSchema'
import {
  ensureStoredRegistry,
  addRegistryAdminDelegate,
  addRegistryDelegate,
} from './utils/generateRegistry'
import { createDocument } from './utils/createDocument'
import { createPresentation } from './utils/createPresentation'
import { createStatement } from './utils/createStatement'
import { verifyPresentation } from './utils/verifyPresentation'
import { revokeCredential } from './utils/revokeCredential'
import { randomUUID } from 'crypto'
import { decryptMessage } from './utils/decrypt_message'
import { encryptMessage } from './utils/encrypt_message'
import { generateRequestCredentialMessage } from './utils/request_credential_message'
import { getChainCredits, addAuthority } from './utils/createAuthorities'
import { createAccount } from './utils/createAccount'
import { VerifiableCredential } from '@cord.network/vc-export'

function getChallenge(): string {
  return Cord.Utils.UUID.generate()
}

async function main() {
  const networkAddress = 'ws://127.0.0.1:9944'
  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK })
  await Cord.connect(networkAddress)

  // Step 1: Setup Membership
  // Setup transaction author account - CORD Account.

  console.log(`\n❄️  New Network Member`)
  const authorityAuthorIdentity = Crypto.makeKeypairFromUri(
    '//Alice',
    'sr25519'
  )
  // Setup network member account.
  const { account: authorIdentity } = await createAccount()
  console.log(`🏦  Member (${authorIdentity.type}): ${authorIdentity.address}`)
  await addAuthority(authorityAuthorIdentity, authorIdentity.address)
  console.log(`🔏  Member permissions updated`)
  console.log('✅ Network Member added!')

  // Step 2: Setup Identities
  console.log(`\n❄️  Demo Identities (KeyRing)`)

  /* Creating the DIDs for the different parties involved in the demo. */
  // Create Verifier DID
  const { mnemonic: verifierMnemonic, document: verifierDid } = await createDid(
    authorIdentity
  )
  const verifierKeys = generateKeypairs(verifierMnemonic)
  console.log(
    `🏢  Verifier (${verifierDid.assertionMethod![0].type}): ${verifierDid.uri}`
  )
  // Create Holder DID
  const { mnemonic: holderMnemonic, document: holderDid } = await createDid(
    authorIdentity
  )
  const holderKeys = generateKeypairs(holderMnemonic)
  console.log(
    `👩‍⚕️  Holder (${holderDid.assertionMethod![0].type}): ${holderDid.uri}`
  )
  // Create issuer DID
  const { mnemonic: issuerMnemonic, document: issuerDid } = await createDid(
    authorIdentity
  )
  const issuerKeys = generateKeypairs(issuerMnemonic)
  console.log(
    `🏛   Issuer (${issuerDid?.assertionMethod![0].type}): ${issuerDid.uri}`
  )
  const conformingDidDocument = Cord.Did.exportToDidDocument(
    issuerDid,
    'application/json'
  )
  console.dir(conformingDidDocument, {
    depth: null,
    colors: true,
  })
  // Create Delegate One DID
  const { mnemonic: delegateOneMnemonic, document: delegateOneDid } =
    await createDid(authorIdentity)
  const delegateOneKeys = generateKeypairs(delegateOneMnemonic)
  console.log(
    `🏛   Delegate (${delegateOneDid?.assertionMethod![0].type}): ${
      delegateOneDid.uri
    }`
  )
  // Create Delegate Two DID
  const { mnemonic: delegateTwoMnemonic, document: delegateTwoDid } =
    await createDid(authorIdentity)
  const delegateTwoKeys = generateKeypairs(delegateTwoMnemonic)
  console.log(
    `🏛   Delegate (${delegateTwoDid?.assertionMethod![0].type}): ${
      delegateTwoDid.uri
    }`
  )
  // Create Delegate 3 DID
  const { mnemonic: delegate3Mnemonic, document: delegate3Did } =
    await createDid(authorIdentity)
  const delegate3Keys = generateKeypairs(delegate3Mnemonic)
  console.log(
    `🏛   Delegate (${delegate3Did?.assertionMethod![0].type}): ${
      delegate3Did.uri
    }`
  )
  console.log('✅ Identities created!')

  // Step 2: Create a DID name for Issuer
  console.log(`\n❄️  DID name Creation `)
  const randomDidName = `solar.sailer.${randomUUID().substring(0, 4)}@cord`

  await createDidName(
    issuerDid.uri,
    authorIdentity,
    randomDidName,
    async ({ data }) => ({
      signature: issuerKeys.authentication.sign(data),
      keyType: issuerKeys.authentication.type,
    })
  )
  console.log(`✅ DID name - ${randomDidName} - created!`)
  await getDidDocFromName(randomDidName)

  // Step 2: Create a new Schema
  console.log(`\n❄️  Schema Creation `)
  const schema = await ensureStoredSchema(
    authorIdentity,
    issuerDid.uri,
    async ({ data }) => ({
      signature: issuerKeys.assertionMethod.sign(data),
      keyType: issuerKeys.assertionMethod.type,
    })
  )
  console.dir(schema, {
    depth: null,
    colors: true,
  })
  console.log('✅ Schema created!')

  // Step 3: Create a new Registry
  console.log(`\n❄️  Registry Creation `)
  const registry = await ensureStoredRegistry(
    authorIdentity,
    issuerDid.uri,
    schema['$id'],
    async ({ data }) => ({
      signature: issuerKeys.assertionMethod.sign(data),
      keyType: issuerKeys.assertionMethod.type,
    })
  )
  console.dir(registry, {
    depth: null,
    colors: true,
  })
  console.log('✅ Registry created!')

  // Step 4: Add Delelegate One as Registry Admin
  console.log(`\n❄️  Registry Admin Delegate Authorization `)
  const registryAuthority = await addRegistryAdminDelegate(
    authorIdentity,
    issuerDid.uri,
    registry['identifier'],
    delegateOneDid.uri,
    async ({ data }) => ({
      signature: issuerKeys.capabilityDelegation.sign(data),
      keyType: issuerKeys.capabilityDelegation.type,
    })
  )
  console.log(`✅ Registry Authorization - ${registryAuthority} - created!`)

  // Step 4: Add Delelegate Two as Registry Delegate
  console.log(`\n❄️  Registry Delegate Authorization `)
  const registryDelegate = await addRegistryDelegate(
    authorIdentity,
    issuerDid.uri,
    registry['identifier'],
    delegateTwoDid.uri,
    async ({ data }) => ({
      signature: issuerKeys.capabilityDelegation.sign(data),
      keyType: issuerKeys.capabilityDelegation.type,
    })
  )
  console.log(`✅ Registry Delegation - ${registryDelegate} - created!`)

  // Step 4: Delegate creates a new Verifiable Document
  console.log(`\n❄️  Verifiable Document Creation `)
  const document = await createDocument(
    holderDid.uri,
    delegateTwoDid.uri,
    schema,
    registryDelegate,
    registry.identifier,
    async ({ data }) => ({
      signature: delegateTwoKeys.authentication.sign(data),
      keyType: delegateTwoKeys.authentication.type,
      keyUri: `${delegateTwoDid.uri}${delegateTwoDid.authentication[0].id}`,
    })
  )
  console.dir(document, {
    depth: null,
    colors: true,
  })
  await createStatement(
    delegateTwoDid.uri,
    authorIdentity,
    async ({ data }) => ({
      signature: delegateTwoKeys.assertionMethod.sign(data),
      keyType: delegateTwoKeys.assertionMethod.type,
    }),
    document
  )
  console.log('✅ Credential created!')

  // Step 5: Verifiable Credential & Presentation
  console.log(`\n❄️  Verifiable Credentials & Presentation `)

  //let credential: Cord.IDocument = await Cord.Document.fromContent(document)
  const VC = VCUtils.fromCredential(document, schema)
  console.dir(VC, { depth: null, colors: true })
  console.log('✅ Verifiable Credential created!')

  console.log(`\n❄️  Verifiable Presentation - Selective Disclosure `)
  const sharedCredential = JSON.parse(JSON.stringify(VC))
  const vcChallenge = UUID.generate()
  const vcPresentation = await VCUtils.presentation.makePresentation(
    sharedCredential,
    ['name', 'country'],
    holderDid,
    holderKeys,
    vcChallenge
  )
  console.dir(vcPresentation, { depth: null, colors: true })
  console.log('✅ Verifiable Presentation created!')

  console.log(`\n❄️  Verifiy Presentation`)

  const VCfromPresentation =
    vcPresentation.verifiableCredential as VerifiableCredential

  const statementResult = await VCUtils.verification.verifyStatementProof(
    VCfromPresentation,
    VCfromPresentation.proof[1]
  )
  //console.log("\n: VC Proof(1): ", VCfromPresentation.proof[1], statementResult)

  const selfSignatureResult =
    await VCUtils.verification.verifySelfSignatureProof(
      VCfromPresentation,
      vcPresentation.proof[0],
      vcChallenge
    )
  //console.log("\n: VP Proof: ", vcPresentation.proof, vcChallenge, selfSignatureResult)

  const digestResult = await VCUtils.verification.verifyCredentialDigestProof(
    VCfromPresentation,
    VCfromPresentation.proof[2]
  )
  //console.log("\n: VC Proof(2): ", VCfromPresentation.proof[2], digestResult)

  const statementSignatureResult =
    await VCUtils.verification.verifyStatementSignatureProof(
      VCfromPresentation,
      VCfromPresentation.proof[0]
    )

  //console.log("\n: VC Proof(0): ", VCfromPresentation.proof[0], statementSignatureResult)

  if (
    statementResult &&
    statementResult['verified'] &&
    digestResult &&
    digestResult['verified'] &&
    statementSignatureResult &&
    statementSignatureResult['verified'] &&
    selfSignatureResult &&
    selfSignatureResult['verified']
  ) {
    console.log(
      '✅',
      'Statement-Signature-Proof',
      statementSignatureResult['verified'],
      '✧ Statement-Proof',
      statementResult['verified'],
      '✧ Digest-Proof',
      digestResult['verified'],
      '✧ Self-Signature-Proof',
      selfSignatureResult['verified']
    )
  } else {
    console.log(
      `❌`,
      'Statement-Signature-Proof',
      statementSignatureResult['verified'],
      '✧ Statement-Proof',
      statementResult['verified'],
      '✧ Digest-Proof',
      digestResult['verified'],
      '✧ Self-Signature-Proof',
      selfSignatureResult['verified']
    )
  }

  console.log(`\n❄️  Revoke credential - ${document.identifier}`)
  await revokeCredential(
    delegateTwoDid.uri,
    authorIdentity,
    async ({ data }) => ({
      signature: delegateTwoKeys.assertionMethod.sign(data),
      keyType: delegateTwoKeys.assertionMethod.type,
    }),
    document,
    false
  )
  console.log(`✅ Credential revoked!`)

  /* Test VC & VP after revoke */
  const statementResult1 = await VCUtils.verification.verifyStatementProof(
    VCfromPresentation,
    VCfromPresentation.proof[1]
  )
  //console.log("\n: VC Proof(1): ", VCfromPresentation.proof[1], statementResult)

  const selfSignatureResult1 =
    await VCUtils.verification.verifySelfSignatureProof(
      VCfromPresentation,
      vcPresentation.proof[0],
      vcChallenge
    )
  //console.log("\n: VP Proof: ", vcPresentation.proof, vcChallenge, selfSignatureResult)

  const digestResult1 = await VCUtils.verification.verifyCredentialDigestProof(
    VCfromPresentation,
    VCfromPresentation.proof[2]
  )
  //console.log("\n: VC Proof(2): ", VCfromPresentation.proof[2], digestResult)

  const statementSignatureResult1 =
    await VCUtils.verification.verifyStatementSignatureProof(
      VCfromPresentation,
      VCfromPresentation.proof[0]
    )

  //console.log("\n: VC Proof(0): ", VCfromPresentation.proof[0], statementSignatureResult)

  if (
    statementResult1 &&
    statementResult1['verified'] &&
    digestResult1 &&
    digestResult1['verified'] &&
    statementSignatureResult1 &&
    statementSignatureResult1['verified'] &&
    selfSignatureResult1 &&
    selfSignatureResult1['verified']
  ) {
    console.log(
      '✅',
      'Statement-Signature-Proof',
      statementSignatureResult1['verified'],
      '✧ Statement-Proof',
      statementResult1['verified'],
      '✧ Digest-Proof',
      digestResult1['verified'],
      '✧ Self-Signature-Proof',
      selfSignatureResult1['verified']
    )
  } else {
    console.log(
      `🚫`,
      'Statement-Signature-Proof',
      statementSignatureResult1['verified'],
      '✧ Statement-Proof',
      statementResult1['verified'],
      '✧ Digest-Proof',
      digestResult1['verified'],
      '✧ Self-Signature-Proof',
      selfSignatureResult1['verified']
    )
  }
}

main()
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(Cord.disconnect)

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})
