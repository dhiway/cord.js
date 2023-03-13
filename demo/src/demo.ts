import * as Cord from '@cord.network/sdk'
import { UUID, Crypto } from '@cord.network/utils'
import { generateKeypairs } from './utils/generateKeypairs'
import { createDid } from './utils/generateDid'
import { createDidName } from './utils/generateDidName'
import { getDidDocFromName } from './utils/queryDidName'
import { ensureStoredSchema } from './utils/generateSchema'
import { ensureStoredRegistry } from './utils/generateRegistry'
import { requestCredential } from './utils/requestCredential'
import { createPresentation } from './utils/createPresentation'
import { createStream } from './utils/createStream'
import { verifyPresentation } from './utils/verifyPresentation'
import { revokeCredential } from './utils/revokeCredential'
import { randomUUID } from 'crypto'
import { decryptMessage } from './utils/decrypt_message'
import { encryptMessage } from './utils/encrypt_message'
import { generateRequestCredentialMessage } from './utils/request_credential_message'

function getChallenge(): string {
  return Cord.Utils.UUID.generate()
}

async function main() {
  const networkAddress = 'ws://127.0.0.1:9944'
  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK })
  await Cord.connect(networkAddress)

  // Step 1: Setup Identities
  console.log(`\n❄️  Demo Identities (KeyRing)`)
  // Setup transaction author account - CORD Account.
  const authorIdentity = Crypto.makeKeypairFromUri('//Bob', 'sr25519')
  console.log(`🏦  Author (${authorIdentity.type}): ${authorIdentity.address}`)
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
    'application/ld+json'
  )
  console.dir(conformingDidDocument, {
    depth: null,
    colors: true,
  })
  console.log('✅ Identities created!')

  // Step 2: Create a DID name for Issuer
  console.log(`\n❄️  DID mame Creation `)
  const randomDidName = `${randomUUID().substring(0, 4)}-solar-sailer@space`

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

  // Step 4: Create a new Credential
  console.log(`\n❄️  Credential Creation `)
  const credential = requestCredential(holderDid.uri, issuerDid.uri, schema)
  console.dir(credential, {
    depth: null,
    colors: true,
  })
  await createStream(
    issuerDid.uri,
    authorIdentity,
    async ({ data }) => ({
      signature: issuerKeys.assertionMethod.sign(data),
      keyType: issuerKeys.assertionMethod.type,
    }),
    credential
  )
  console.log('✅ Credential created!')

  // Step 5: Create a Presentation
  console.log(`\n❄️  Presentation Creation `)
  const challenge = getChallenge()
  const presentation = await createPresentation(
    credential,
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
    trustedIssuerUris: [issuerDid.uri],
  })

  if (isValid) {
    console.log('✅ Verification successful! 🎉')
  } else {
    console.log('✅ Verification failed! 🚫')
  }

  console.log(`\n❄️  Messaging `)
  const schemaId = Cord.Schema.idToChain(schema.$id)
  console.log(' Generating the message')
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
  console.log(`\n❄️  Revoke credential - ${credential.identifier}`)
  await revokeCredential(
    issuerDid.uri,
    authorIdentity,
    async ({ data }) => ({
      signature: issuerKeys.assertionMethod.sign(data),
      keyType: issuerKeys.assertionMethod.type,
    }),
    credential,
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
