import * as Cord from '@cord.network/sdk'
import { UUID, Crypto } from '@cord.network/utils'
import { generateKeypairs } from './utils/generateKeypairs'
import { createDid } from './utils/generateDid'
import { createDidName } from './utils/generateDidName'
import { getDidDocFromName } from './utils/queryDidName'
// import { ensureStoredSchema } from './utils/generateSchema'
// import {
//   ensureStoredChainSpace,
//   addSpaceAuthorization,
//   approveSpace,
// } from './utils/generateChainSpace'
// import { createDocument } from './utils/createDocument'
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
import { SignCallback } from '@cord.network/types'
// import { Permission } from '@cord.network/types'

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
  // console.dir(conformingDidDocument, {
  //   depth: null,
  //   colors: true,
  // })
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

  console.log(`\n❄️  Query From Chain - Chain Space Details `)
  const spaceFromChain = await Cord.ChainSpace.fetchFromChain(space.uri)
  console.dir(spaceFromChain, {
    depth: null,
    colors: true,
  })

  console.log(`\n❄️  Query From Chain - Chain Space Authorization Details `)
  const spaceAuthFromChain = await Cord.ChainSpace.fetchAuthorizationFromChain(
    delegateAuth as Cord.AuthorizationUri
  )
  console.dir(spaceAuthFromChain, {
    depth: null,
    colors: true,
  })
  console.log(`✅ Chain Space Functions Completed!`)

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

  console.log(`\n❄️  Query From Chain - Schema `)
  const schemaFromChain = await Cord.Schema.fetchFromChain(
    schemaProperties.schema.$id
  )
  console.dir(schemaFromChain, {
    depth: null,
    colors: true,
  })
  console.log('✅ Schema Functions Completed!')

  // Step 4: Delegate creates a new Verifiable Document
  console.log(`\n❄️  Verifiable Document Creation `)

  const content: Cord.IContent = Cord.Content.buildFromContentProperties(
    schemaProperties.schema,
    ['VerifiableDocument', 'TestCredential'],
    {
      name: 'Alice',
      age: 29,
      id: '123456789987654321',
      country: 'India',
      address: {
        street: 'Gandhinagar 2nd',
        pin: 54032,
        location: {
          state: 'Karnataka',
          country: 'India',
        },
      },
    },
    holderDid.uri,
    delegateTwoDid.uri
  )
  console.dir(content, {
    depth: null,
    colors: true,
  })

  console.log(space.uri)
  const chainSpaceUri = space.uri
  // Can also me called like this
  // const docSignCallback = async ({ data }) => {
  //   return {
  //     signature: delegateTwoKeys.assertionMethod.sign(data),
  //     keyType: delegateTwoKeys.assertionMethod.type,
  //     keyUri: `${delegateTwoDid.uri}${delegateTwoDid?.assertionMethod![0].id}`,
  //   }
  // }

  // const document = await Cord.Document.buildFromContentProperties({
  //   content: content,
  //   spaceUri: chainSpaceUri,
  //   signCallback: docSignCallback,
  //   options: {},
  // })

  const document = await Cord.Document.buildFromContentProperties({
    content: content,
    spaceUri: chainSpaceUri,
    signCallback: async ({ data }) => ({
      signature: delegateTwoKeys.assertionMethod.sign(data),
      keyType: delegateTwoKeys.assertionMethod.type,
      keyUri: `${delegateTwoDid.uri}${delegateTwoDid?.assertionMethod![0].id}`,
    }),
    options: {},
  })
  console.dir(document, {
    depth: null,
    colors: true,
  })

  const statementEntry = Cord.Statement.buildFromDocumentProperties(
    document,
    issuerDid.uri
  )
  console.dir(statementEntry, {
    depth: null,
    colors: true,
  })

  console.log(issuerDid.uri, authorIdentity, space.authorization)

  const statement = await Cord.Statement.dispatchRegisterToChain(
    statementEntry.statementDetails,
    issuerDid.uri,
    authorIdentity,
    space.authorization,
    async ({ data }) => ({
      signature: issuerKeys.assertionMethod.sign(data),
      keyType: issuerKeys.assertionMethod.type,
    })
  )

  console.log(`✅ Statement element registered - ${statement}`)

  // Step 5: Delegate updates the Verifiable Document
  console.log(`\n❄️  Verifiable Document Update `)
  let documentContent = Cord.Document.prepareDocumentForUpdate(
    statementEntry.document
  )

  console.dir(documentContent, {
    depth: null,
    colors: true,
  })
  // const contents = documentContent.content.contents as Cord.IContents
  documentContent.content.contents.name = 'Alice M'
  documentContent.content.contents.age = 32
  documentContent.content.contents.address.pin = 560100

  const updatedDocumentEntry = await Cord.Document.updateFromDocumentProperties(
    {
      document: documentContent,
      updater: delegateTwoDid.uri,
      signCallback: async ({ data }) => ({
        signature: delegateTwoKeys.assertionMethod.sign(data),
        keyType: delegateTwoKeys.assertionMethod.type,
        keyUri: `${delegateTwoDid.uri}${
          delegateTwoDid?.assertionMethod![0].id
        }`,
      }),
      options: {},
    }
  )
  console.dir(updatedDocumentEntry, {
    depth: null,
    colors: true,
  })

  const updatedStatementEntry = Cord.Statement.buildFromUpdateProperties(
    updatedDocumentEntry,
    delegateTwoDid.uri
  )
  console.dir(updatedStatementEntry, {
    depth: null,
    colors: true,
  })

  const updatedStatement = await Cord.Statement.dispatchUpdateToChain(
    updatedStatementEntry.statementDetails,
    delegateTwoDid.uri,
    authorIdentity,
    delegateAuth as Cord.AuthorizationUri,
    async ({ data }) => ({
      signature: delegateTwoKeys.assertionMethod.sign(data),
      keyType: delegateTwoKeys.assertionMethod.type,
    })
  )

  console.log(`✅ Statement element registered - ${updatedStatement}`)

  // const stmtUri = Cord.Identifier.elementUriToStatementUri(
  //   updatedStatemen.elementUri
  // )
  // await Cord.Statement.dispatchRevokeToChain(
  //   updatedStatementEntry,
  //   delegateTwoDid.uri,
  //   authorIdentity,
  //   delegateAuth,
  //   async ({ data }) => ({
  //     signature: delegateTwoKeys.assertionMethod.sign(data),
  //     keyType: delegateTwoKeys.assertionMethod.type,
  //   })
  // )

  console.log(`✅ Statement element registered - ${updatedStatement}`)

  // const updatedDocument = await Cord.Document.updateFromDocumentProperties(
  //   documentContent,
  //   async ({ data }) => ({
  //     signature: delegateTwoKeys.assertionMethod.sign(data),
  //     keyType: delegateTwoKeys.assertionMethod.type,
  //     keyUri: `${delegateTwoDid.uri}${delegateTwoDid?.assertionMethod![0].id}`,
  //   })
  //   options: {},
  // )

  // const updatedDocument = await updateDocument(
  //   updateDocumentContent,
  //   schema,
  //   async ({ data }) => ({
  //     signature: delegateTwoKeys.assertionMethod.sign(data),
  //     keyType: delegateTwoKeys.assertionMethod.type,
  //     keyUri: `${delegateTwoDid.uri}${delegateTwoDid?.assertionMethod![0].id}`,
  //   })
  // )
  // console.dir(updatedDocument, {
  //   depth: null,
  //   colors: true,
  // })
  // await updateStatement(
  //   updatedDocument,
  //   delegateTwoDid.uri,
  //   delegateAuth['authorization'],
  //   authorIdentity,
  //   async ({ data }) => ({
  //     signature: delegateTwoKeys.assertionMethod.sign(data),
  //     keyType: delegateTwoKeys.assertionMethod.type,
  //   })
  // )
  // console.log(`✅ Statement updated - ${updatedDocument.identifier}`)

  // // Step 6: Create a Presentation
  // console.log(`\n❄️  Selective Disclosure Presentation Creation `)
  // const challenge = getChallenge()
  // const presentation = await createPresentation({
  //   document: updatedDocument,
  //   signCallback: async ({ data }) => ({
  //     signature: holderKeys.authentication.sign(data),
  //     keyType: holderKeys.authentication.type,
  //     keyUri: `${holderDid.uri}${holderDid.authentication[0].id}`,
  //   }),
  //   // Comment the below line to have a full disclosure
  //   selectedAttributes: ['name', 'id', 'address.pin', 'address.location'],
  //   challenge: challenge,
  // })

  // console.dir(presentation, {
  //   depth: null,
  //   colors: true,
  // })
  // console.log('✅ Presentation created!')

  // // Step 7: The verifier checks the presentation.
  // console.log(`\n❄️  Presentation Verification - ${presentation.identifier} `)
  // const verificationResult = await verifyPresentation(presentation, {
  //   challenge: challenge,
  //   trustedIssuerUris: [delegateTwoDid.uri],
  // })

  // if (verificationResult.isValid) {
  //   console.log('✅ Verification successful! 🎉')
  // } else {
  //   console.log(`🚫 Verification failed! - "${verificationResult.message}" 🚫`)
  // }

  // // Uncomment the following section to enable messaging demo
  // //
  // // console.log(`\n❄️  Messaging `)
  // // const schemaId = Cord.Schema.idToChain(schema.$id)
  // // console.log(' Generating the message - Sender -> Receiver')
  // // const message = await generateRequestCredentialMessage(
  // //   holderDid.uri,
  // //   verifierDid.uri,
  // //   schemaId
  // // )
  // //
  // // console.log(' Encrypting the message - Sender -> Receiver')
  // // const encryptedMessage = await encryptMessage(
  // //   message,
  // //   holderDid.uri,
  // //   verifierDid.uri,
  // //   holderKeys.keyAgreement
  // // )
  // //
  // // console.log(' Decrypting the message - Receiver')
  // // await decryptMessage(encryptedMessage, verifierKeys.keyAgreement)

  // // Step 8: Revoke a Credential
  // console.log(`\n❄️  Revoke credential - ${updatedDocument.identifier}`)
  // await revokeCredential(
  //   delegateTwoDid.uri,
  //   authorIdentity,
  //   async ({ data }) => ({
  //     signature: delegateTwoKeys.assertionMethod.sign(data),
  //     keyType: delegateTwoKeys.assertionMethod.type,
  //   }),
  //   updatedDocument,
  //   delegateAuth['authorization']
  // )
  // console.log(`✅ Credential revoked!`)

  // // Step 9: The verifier checks the presentation.
  // console.log(`\n❄️  Presentation Verification - ${presentation.identifier} `)
  // let reVerificationResult = await verifyPresentation(presentation, {
  //   challenge: challenge,
  //   trustedIssuerUris: [issuerDid.uri],
  // })

  // if (reVerificationResult.isValid) {
  //   console.log('✅ Verification successful! 🎉')
  // } else {
  //   console.log(
  //     `🚫 Verification failed! - "${reVerificationResult.message}" 🚫`
  //   )
  // }
}
main()
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(Cord.disconnect)

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})
