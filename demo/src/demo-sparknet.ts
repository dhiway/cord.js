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

function getChallenge(): string {
  return Cord.Utils.UUID.generate()
}

async function main() {
  //const networkAddress = 'ws://127.0.0.1:9944'
  const networkAddress = 'wss://sparknet.cord.network'
  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK })
  await Cord.connect(networkAddress)

  // Step 1: Setup Authority
  // Setup transaction author account - CORD Account.

  console.log(`\n❄️  New Authority`)
  const authorityAuthorIdentity = Crypto.makeKeypairFromUri(
    '//Sparknet//1//Demo',
    'sr25519'
  )
  console.log("Sparknet (AuthorIdentity for this run): ", authorityAuthorIdentity.address);
  
  // Step 2: Setup Identities
  console.log(`\n❄️  Demo Identities (KeyRing)`)

  /* Creating the DIDs for the different parties involved in the demo. */
  // Create Verifier DID
  const { mnemonic: verifierMnemonic, document: verifierDid } = await createDid(
    authorityAuthorIdentity
  )
  const verifierKeys = generateKeypairs(verifierMnemonic)
  console.log(
    `🏢  Verifier (${verifierDid.assertionMethod![0].type}): ${verifierDid.uri}`
  )
  // Create Holder DID
  const { mnemonic: holderMnemonic, document: holderDid } = await createDid(
    authorityAuthorIdentity
  )
  const holderKeys = generateKeypairs(holderMnemonic)
  console.log(
    `👩‍⚕️  Holder (${holderDid.assertionMethod![0].type}): ${holderDid.uri}`
  )
  // Create issuer DID
  const { mnemonic: issuerMnemonic, document: issuerDid } = await createDid(
    authorityAuthorIdentity
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
    await createDid(authorityAuthorIdentity)
  const delegateOneKeys = generateKeypairs(delegateOneMnemonic)
  console.log(
    `🏛   Delegate (${delegateOneDid?.assertionMethod![0].type}): ${
      delegateOneDid.uri
    }`
  )
  // Create Delegate Two DID
  const { mnemonic: delegateTwoMnemonic, document: delegateTwoDid } =
    await createDid(authorityAuthorIdentity)
  const delegateTwoKeys = generateKeypairs(delegateTwoMnemonic)
  console.log(
    `🏛   Delegate (${delegateTwoDid?.assertionMethod![0].type}): ${
      delegateTwoDid.uri
    }`
  )
  // Create Delegate 3 DID
  const { mnemonic: delegate3Mnemonic, document: delegate3Did } =
    await createDid(authorityAuthorIdentity)
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
    authorityAuthorIdentity,
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
    authorityAuthorIdentity,
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
    authorityAuthorIdentity,
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
    authorityAuthorIdentity,
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
    authorityAuthorIdentity,
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
    authorityAuthorIdentity,
    async ({ data }) => ({
      signature: delegateTwoKeys.assertionMethod.sign(data),
      keyType: delegateTwoKeys.assertionMethod.type,
    }),
    document
  )
  console.log('✅ Credential created!')

  // Step 5: Create a Presentation
  console.log(`\n❄️  Presentation Creation `)
  const challenge = getChallenge()
  const presentation = await createPresentation(
    document,
    async ({ data }) => ({
      signature: holderKeys.authentication.sign(data),
      keyType: holderKeys.authentication.type,
      keyUri: `${holderDid.uri}${holderDid.authentication[0].id}`,
    }),
    ['name', 'id'],
    challenge
  )
  console.dir(presentation, {
    depth: null,
    colors: true,
  })
  console.log('✅ Presentation created!')

  // Step 6: The verifier checks the presentation.
  console.log(`\n❄️  Presentation Verification - ${presentation.identifier} `)
  const isValid = await verifyPresentation(presentation, {
    challenge: challenge,
    trustedIssuerUris: [delegateTwoDid.uri],
  })

  if (isValid) {
    console.log('✅ Verification successful! 🎉')
  } else {
    console.log('✅ Verification failed! 🚫')
  }

  console.log(`\n❄️  Messaging `)
  const schemaId = Cord.Schema.idToChain(schema.$id)
  console.log(' Generating the message - Sender -> Receiver')
  const message = await generateRequestCredentialMessage(
    holderDid.uri,
    verifierDid.uri,
    schemaId
  )

  console.log(' Encrypting the message - Sender -> Receiver')
  const encryptedMessage = await encryptMessage(
    message,
    holderDid.uri,
    verifierDid.uri,
    holderKeys.keyAgreement
  )

  console.log(' Decrypting the message - Receiver')
  await decryptMessage(encryptedMessage, verifierKeys.keyAgreement)

  // Step 7: Revoke a Credential
  console.log(`\n❄️  Revoke credential - ${document.identifier}`)
  await revokeCredential(
    delegateTwoDid.uri,
    authorityAuthorIdentity,
    async ({ data }) => ({
      signature: delegateTwoKeys.assertionMethod.sign(data),
      keyType: delegateTwoKeys.assertionMethod.type,
    }),
    document,
    false
  )
  console.log(`✅ Credential revoked!`)

  // Step 8: The verifier checks the presentation.
  console.log(
    `\n❄️  Presentation Verification (should fail) - ${presentation.identifier} `
  )
  const isAgainValid = await verifyPresentation(presentation, {
    challenge: challenge,
    trustedIssuerUris: [issuerDid.uri],
  })

  if (isAgainValid) {
    console.log('✅ Verification successful! 🎉')
  } else {
    console.log('✅ Verification failed! 🚫')
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
