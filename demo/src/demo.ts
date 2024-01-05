import * as Cord from '@cord.network/sdk'
import { UUID, Crypto } from '@cord.network/utils'
import { createDid } from './utils/generateDid'
import { createDidName } from './utils/generateDidName'
import { getDidDocFromName } from './utils/queryDidName'
import { ensureStoredSchema } from './utils/generateSchema'
import {
  ensureStoredChainSpace,
  addSpaceAuthorization,
  approveSpace,
} from './utils/generateChainSpace'
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
import { updateDocument } from './utils/updateDocument'
import { updateStatement } from './utils/updateStatement'

import {
  requestJudgement,
  setIdentity,
  setRegistrar,
  provideJudgement,
} from './utils/createRegistrar'

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
  // Setup network authority account.
  const { account: authorityIdentity } = await createAccount()
  console.log(
    `🏦  Member (${authorityIdentity.type}): ${authorityIdentity.address}`
  )
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
  const verifierKeys = Cord.Utils.Keys.generateKeypairs(verifierMnemonic)
  console.log(
    `🏢  Verifier (${verifierDid.assertionMethod![0].type}): ${verifierDid.uri}`
  )
  // Create Holder DID
  const { mnemonic: holderMnemonic, document: holderDid } = await createDid(
    authorIdentity
  )
  const holderKeys = Cord.Utils.Keys.generateKeypairs(holderMnemonic)
  console.log(
    `👩‍⚕️  Holder (${holderDid.assertionMethod![0].type}): ${holderDid.uri}`
  )
  // Create issuer DID
  const { mnemonic: issuerMnemonic, document: issuerDid } = await createDid(
    authorIdentity
  )
  const issuerKeys = Cord.Utils.Keys.generateKeypairs(issuerMnemonic)
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
  const delegateOneKeys = Cord.Utils.Keys.generateKeypairs(delegateOneMnemonic)
  console.log(
    `🏛   Delegate (${delegateOneDid?.assertionMethod![0].type}): ${
      delegateOneDid.uri
    }`
  )
  // Create Delegate Two DID
  const { mnemonic: delegateTwoMnemonic, document: delegateTwoDid } =
    await createDid(authorIdentity)
  const delegateTwoKeys = Cord.Utils.Keys.generateKeypairs(delegateTwoMnemonic)
  console.log(
    `🏛   Delegate (${delegateTwoDid?.assertionMethod![0].type}): ${
      delegateTwoDid.uri
    }`
  )
  // Create Delegate 3 DID
  const { mnemonic: delegate3Mnemonic, document: delegate3Did } =
    await createDid(authorIdentity)
  const delegate3Keys = Cord.Utils.Keys.generateKeypairs(delegate3Mnemonic)
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

  // Step 3: Create a new Chain Space
  console.log(`\n❄️  Chain Space Creation `)
  const spaceProperties = await Cord.ChainSpace.buildFromProperties(
    issuerDid.uri
  )
  console.dir(spaceProperties, {
    depth: null,
    colors: true,
  })

  console.log(`\n❄️  Chain Space Properties `)
  const space = await Cord.ChainSpace.dispatchToChain(
    spaceProperties,
    issuerDid.uri,
    authorIdentity,
    async ({ data }) => ({
      signature: issuerKeys.assertionMethod.sign(data),
      keyType: issuerKeys.assertionMethod.type,
    })
  )
  console.dir(space, {
    depth: null,
    colors: true,
  })
  console.log('✅ Chain Space created!')

  console.log(`\n❄️  Chain Space Approval `)
  await Cord.ChainSpace.sudoApproveChainSpace(
    authorityAuthorIdentity,
    space.uri,
    100
  )
  console.log(`✅  Chain Space Approved`)

  // Step 4: Add Delelegate Two as Registry Delegate
  console.log(`\n❄️  Space Delegate Authorization `)
  const permission: Cord.PermissionType = Cord.Permission.ASSERT
  const spaceAuthProperties =
    await Cord.ChainSpace.buildFromAuthorizationProperties(
      space.uri,
      delegateTwoDid.uri,
      permission,
      issuerDid.uri
    )
  console.dir(spaceAuthProperties, {
    depth: null,
    colors: true,
  })
  console.log(`\n❄️  Space Delegation To Chain `)
  const delegateAuth = await Cord.ChainSpace.dispatchDelegateAuthorization(
    spaceAuthProperties,
    authorIdentity,
    space.authorization,
    async ({ data }) => ({
      signature: issuerKeys.capabilityDelegation.sign(data),
      keyType: issuerKeys.capabilityDelegation.type,
    })
  )
  console.dir(delegateAuth, {
    depth: null,
    colors: true,
  })
  console.log(`✅ Space Authorization - ${delegateAuth} - added!`)

  // Step 5: Create a new Schema
  console.log(`\n❄️  Schema Creation `)
  let newSchemaContent = require('../res/schema.json')
  let newSchemaName = newSchemaContent.title + ':' + UUID.generate()
  newSchemaContent.title = newSchemaName

  let schemaProperties = Cord.Schema.buildFromProperties(
    newSchemaContent,
    space.uri,
    issuerDid.uri
  )
  console.dir(schemaProperties, {
    depth: null,
    colors: true,
  })

  const schemaId = await Cord.Schema.dispatchToChain(
    schemaProperties.schema,
    issuerDid.uri,
    authorIdentity,
    space.authorization,
    async ({ data }) => ({
      signature: issuerKeys.assertionMethod.sign(data),
      keyType: issuerKeys.assertionMethod.type,
    })
  )

  console.log(`✅ Schema - ${schemaId} - added!`)

  // Step 4: Delegate creates a new Verifiable Document
  console.log(`\n❄️  Verifiable Document Creation `)

  const document = await createDocument(
    holderDid.uri,
    delegateTwoDid.uri,
    schemaProperties.schema,
    space.uri,
    async ({ data }) => ({
      signature: delegateTwoKeys.assertionMethod.sign(data),
      keyType: delegateTwoKeys.assertionMethod.type,
      keyUri: `${delegateTwoDid.uri}${delegateTwoDid?.assertionMethod![0].id}`,
    })
  )
  console.dir(document, {
    depth: null,
    colors: true,
  })
  await createStatement(
    document,
    delegateTwoDid.uri,
    delegateAuth,
    authorIdentity,
    async ({ data }) => ({
      signature: delegateTwoKeys.assertionMethod.sign(data),
      keyType: delegateTwoKeys.assertionMethod.type,
    })
  )
  console.log(`✅ Statement registered - ${document.identifier}`)

  // Step 5: Delegate updates the Verifiable Document
  console.log(`\n❄️  Verifiable Document Update `)
  let updateDocumentContent =
    Cord.Document.extractDocumentContentforUpdate(document)

  const contents = updateDocumentContent.content.contents as Cord.IContents
  contents.name = 'Alice M'
  contents.age = 32
  contents.address.pin = 560100

  const updatedDocument = await updateDocument(
    updateDocumentContent,
    schemaProperties.schema,
    async ({ data }) => ({
      signature: delegateTwoKeys.assertionMethod.sign(data),
      keyType: delegateTwoKeys.assertionMethod.type,
      keyUri: `${delegateTwoDid.uri}${delegateTwoDid?.assertionMethod![0].id}`,
    })
  )
  console.dir(updatedDocument, {
    depth: null,
    colors: true,
  })
  await updateStatement(
    updatedDocument,
    delegateTwoDid.uri,
    delegateAuth,
    authorIdentity,
    async ({ data }) => ({
      signature: delegateTwoKeys.assertionMethod.sign(data),
      keyType: delegateTwoKeys.assertionMethod.type,
    })
  )
  console.log(`✅ Statement updated - ${updatedDocument.identifier}`)

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
  const verificationResult = await verifyPresentation(presentation, {
    challenge: challenge,
    trustedIssuerUris: [delegateTwoDid.uri],
  })

  if (verificationResult.isValid) {
    console.log('✅ Verification successful! 🎉')
  } else {
    console.log(`🚫 Verification failed! - "${verificationResult.message}" 🚫`)
  }

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
    delegateAuth
  )
  console.log(`✅ Credential revoked!`)

  // Step 9: The verifier checks the presentation.
  console.log(`\n❄️  Presentation Verification - ${presentation.identifier} `)
  let reVerificationResult = await verifyPresentation(presentation, {
    challenge: challenge,
    trustedIssuerUris: [issuerDid.uri],
  })

  if (reVerificationResult.isValid) {
    console.log('✅ Verification successful! 🎉')
  } else {
    console.log(
      `🚫 Verification failed! - "${reVerificationResult.message}" 🚫`
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
