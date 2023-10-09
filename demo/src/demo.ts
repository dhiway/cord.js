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
import { createStream } from './utils/createStream'
import { verifyPresentation } from './utils/verifyPresentation'
import { revokeCredential } from './utils/revokeCredential'
import { randomUUID } from 'crypto'
import { decryptMessage } from './utils/decrypt_message'
import { encryptMessage } from './utils/encrypt_message'
import { generateRequestCredentialMessage } from './utils/request_credential_message'
import { getChainCredits, addAuthority } from './utils/createAuthorities'
import { createAccount } from './utils/createAccount'
import { updateStream } from './utils/updateDocument'
import { requestJudgement, setIdentity, setRegistrar, provideJudgement } from './utils/createRegistrar'

// import type {
//   SignCallback,
//   // DocumenentMetaData,
// } from '@cord.network/types'

function getChallenge(): string {
  return Cord.Utils.UUID.generate()
}

async function main() {
  const networkAddress = 'ws://127.0.0.1:63554'
  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK })
  await Cord.connect(networkAddress)

  // Step 1: Setup Membership
  // Setup transaction author account - CORD Account.

  console.log(`\n❄️  New Network Member`)
  const authorityAuthorIdentity = Crypto.makeKeypairFromUri(
    '//Alice',
    'sr25519'
  )
  // Setup network authority account.
  const { account: authorityIdentity } = await createAccount()
  console.log(`🏦  Member (${authorityIdentity.type}): ${authorityIdentity.address}`)
  await addAuthority(authorityAuthorIdentity, authorityIdentity.address)
  await setRegistrar(authorityAuthorIdentity, authorityIdentity.address)
  console.log('✅ Network Authority created!')

  // Setup network member account.
  const { account: authorIdentity } = await createAccount()
  console.log(`🏦  Member (${authorIdentity.type}): ${authorIdentity.address}`)
  await addAuthority(authorityAuthorIdentity, authorIdentity.address)
  console.log(`🔏  Member permissions updated`)
  await setIdentity(authorIdentity)
  console.log(`🔏  Member identity info updated`)
  await requestJudgement(authorIdentity, authorityIdentity.address)
  console.log(`🔏  Member identity judgement requested`)
  await provideJudgement(authorityIdentity, authorIdentity.address)
  console.log(`🔏  Member identity judgement provided`)
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
  await createStream(
    delegateTwoDid.uri,
    authorIdentity,
    async ({ data }) => ({
      signature: delegateTwoKeys.assertionMethod.sign(data),
      keyType: delegateTwoKeys.assertionMethod.type,
    }),
    document
  )
  console.log('✅ Credential created!')

  // Step 5: Delegate updates the Verifiable Document
  console.log('\n🖍️ Stream update...\n')

  let updatedContent: Cord.IContent = {
    name: 'Adi',
    age: 23,
    id: '123456789987654321',
    gender: 'Male',
    country: 'India',
    address: {
      street: 'a',
      pin: 54032,
      location: {
        state: 'karnataka',
        country: 'india',
      },
    },
  }

  console.log('𝌞 Updated content\n', updatedContent)

  const updatedDocument = await updateStream(
    document,
    updatedContent,
    schema,
    async ({ data }) => ({
      signature: delegateTwoKeys.authentication.sign(data),
      keyType: delegateTwoKeys.authentication.type,
      keyUri: `${delegateTwoDid.uri}${delegateTwoDid.authentication[0].id}`,
    }),
    delegateTwoDid.uri,
    authorIdentity,
    delegateTwoKeys
  )

  console.log('\n✅ Document updated!')
  console.log('\nUpdated document: \n', updatedDocument)

  // Step 6: Create a Presentation
  console.log(`\n❄️  Selective Disclosure Presentation Creation `)
  const challenge = getChallenge()
  const presentation = await createPresentation({
    document: updatedDocument,
    signCallback: async ({ data }) => ({
      signature: holderKeys.authentication.sign(data),
      keyType: holderKeys.authentication.type,
      keyUri: `${holderDid.uri}${holderDid.authentication[0].id}`,
    }),
    // Comment the below line to have a full disclosure
    selectedAttributes: ['name', 'id', 'address.pin', 'address.location'],
    challenge: challenge,
  })

  console.dir(presentation, {
    depth: null,
    colors: true,
  })
  console.log('✅ Presentation created!')

  // Step 7: The verifier checks the presentation.
  console.log(`\n❄️  Presentation Verification - ${presentation.identifier} `)
  const isValid = await verifyPresentation(presentation, {
    challenge: challenge,
    trustedIssuerUris: [delegateTwoDid.uri],
  })

  if (isValid) {
    console.log('✅  Verification successful! 🎉')
  } else {
    console.log('✅  Verification failed! 🚫')
  }

  // Uncomment the following section to enable messaging demo
  //
  // console.log(`\n❄️  Messaging `)
  // const schemaId = Cord.Schema.idToChain(schema.$id)
  // console.log(' Generating the message - Sender -> Receiver')
  // const message = await generateRequestCredentialMessage(
  //   holderDid.uri,
  //   verifierDid.uri,
  //   schemaId
  // )
  //
  // console.log(' Encrypting the message - Sender -> Receiver')
  // const encryptedMessage = await encryptMessage(
  //   message,
  //   holderDid.uri,
  //   verifierDid.uri,
  //   holderKeys.keyAgreement
  // )
  //
  // console.log(' Decrypting the message - Receiver')
  // await decryptMessage(encryptedMessage, verifierKeys.keyAgreement)

  // Step 8: Revoke a Credential
  console.log(`\n❄️  Revoke credential - ${updatedDocument.identifier}`)
  await revokeCredential(
    delegateTwoDid.uri,
    authorIdentity,
    async ({ data }) => ({
      signature: delegateTwoKeys.assertionMethod.sign(data),
      keyType: delegateTwoKeys.assertionMethod.type,
    }),
    updatedDocument,
    false
  )
  console.log(`✅ Credential revoked!`)

  // Step 9: The verifier checks the presentation.
  console.log(
    // `\n❄️  Presentation Verification (should fail) - ${presentation.identifier} `
    `\n❄️  Presentation Verification - ${presentation.identifier} `
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
