import * as Cord from '@cord.network/sdk'
import { UUID, Crypto } from '@cord.network/utils'
import { generateKeypairs } from './utils/generateKeypairs'
import { createFullDid } from './utils/generateDid'
import { ensureStoredSchema } from './utils/generateSchema'
import { ensureStoredRegistry } from './utils/generateRegistry'
import { requestCredential } from './utils/requestCredential'
import { createPresentation } from './utils/createPresentation'
import { createStream } from './utils/createStream'
import { verifyPresentation } from './utils/verifyPresentation'
import { revokeCredential } from './utils/revokeCredential'

function getChallenge(): string {
  return Cord.Utils.UUID.generate()
}

async function main() {
  const networkAddress = 'ws://127.0.0.1:9944'
  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK })
  const api = await Cord.connect(networkAddress)

  // Step 1: Setup Org Identity
  console.log(`\n❄️  Demo Identities (KeyRing)`)
  // Setup issuer account.
  //3x4DHc1rxVAEqKWSx1DAAA8wZxLB4VhiRbMV997niBckUwSi
  const authorIdentity = Crypto.makeKeypairFromUri('//Bob', 'sr25519')
  console.log(`🏦  Author (${authorIdentity.type}): ${authorIdentity.address}`)

  // Create issuer DID
  const { mnemonic: issuerMnemonic, fullDid: issuerDid } = await createFullDid(
    authorIdentity
  )
  const issuerKeys = generateKeypairs(issuerMnemonic)
  console.log(
    `🏛   Issuer (${issuerDid.assertionMethod[0].type}): ${issuerDid.uri}`
  )
  // Create Holder DID
  const { mnemonic: holderMnemonic, fullDid: holderDid } = await createFullDid(
    authorIdentity
  )
  const holderKeys = generateKeypairs(holderMnemonic)
  console.log(
    `👩‍⚕️  Holder (${holderDid.assertionMethod[0].type}): ${holderDid.uri}`
  )
  // Create Verifier DID
  const { mnemonic: verifierMnemonic, fullDid: verifierDid } =
    await createFullDid(authorIdentity)
  console.log(
    `🏢  Verifier (${verifierDid.assertionMethod[0].type}): ${verifierDid.uri}`
  )

  console.log('✅ Identities created!')
  const conformingDidDocument = Cord.Did.exportToDidDocument(
    issuerDid,
    'application/ld+json'
  )

  // const { metadata, document } = await Cord.Did.resolve(issuerDid.uri)
  console.dir(conformingDidDocument, {
    depth: null,
    colors: true,
  })

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

  // Step 2: Create a new Registry
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

  // Step 2: Create a new Credential
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
  // Step 2: Create a Presentation
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

  // The verifier checks the presentation.
  const isValid = await verifyPresentation(presentation, {
    challenge: challenge,
    trustedIssuerUris: [issuerDid.uri],
  })

  if (isValid) {
    console.log('Verification successful! You are allowed to enter the club 🎉')
  } else {
    console.log('Verification failed! 🚫')
  }

  console.log('7.1 claiming) Revoke credential')
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
  console.log('Presentation should fail to verify after revocation')

  // The verifier checks the presentation.
  const isAgainValid = await verifyPresentation(presentation, {
    challenge: challenge,
    trustedIssuerUris: [issuerDid.uri],
  })

  if (isAgainValid) {
    console.log('Verification successful! You are allowed to enter the club 🎉')
  } else {
    console.log('Verification should fail after revocation! 🚫')
  }

  // signature: claimerAuthKey.sign(data),
  // keyType: claimerAuthKey.type,
  // keyUri: `${claimerLightDid.uri}${claimerLightDid.authentication[0].id}`,

  // console.log('6 claiming) Verify selective disclosure presentation')
  // await verifyPresentation(presentation, {
  //   trustedAttesterUris: [attesterFullDid.uri],
  // })
  // console.log('7.1 claiming) Revoke credential')
  // await revokeCredential(
  //   attesterFullDid.uri,
  //   submitterAccount,
  //   async ({ data }) => ({
  //     signature: attersterKeys.attestation.sign(data),
  //     keyType: attersterKeys.attestation.type,
  //   }),
  //   credential,
  //   false
  // )
  // console.log(
  //   '7.2 claiming) Presentation should fail to verify after revocation'
  // )
  // try {
  //   await verifyPresentation(presentation, {
  //     trustedAttesterUris: [attesterFullDid.uri],
  //   })
  //   throw new Error('Error: verification should fail after revocation')
  //   // eslint-disable-next-line no-empty
  // } catch {}

  //   let newSchemaContent = require('../res/schema.json')
  //   let newSchemaTitle = newSchemaContent.title + ':' + UUID.generate()
  //   newSchemaContent.title = newSchemaTitle

  //   let newSchema = Cord.Schema.fromSchemaProperties(
  //     newSchemaContent,
  //     employeeIdentity
  //   )

  //   let schemaCreationExtrinsic = await Cord.Schema.create(newSchema)

  //   try {
  //     await Cord.Chain.signAndSubmitTx(schemaCreationExtrinsic, entityIdentity, {
  //       resolveOn: Cord.Chain.IS_IN_BLOCK,
  //       rejectOn: Cord.Chain.IS_ERROR,
  //     })
  //     console.log('✅ Schema created!')
  //   } catch (e: any) {
  //     console.log(e.errorCode, '-', e.message)
  //   }

  //   // Step 3: Add Schema Metadata
  //   console.log(`\n❄️  Schema Metadata addition `)
  //   console.log(`🔗 ${newSchema.identifier}`)

  //   let schemaMeta = Cord.Meta.fromMetaProperties(
  //     newSchema.identifier,
  //     Crypto.encodeObjectAsStr(newSchema.schema),
  //     employeeIdentity
  //   )
  //   let schemaMetaCreationExtrinsic = await Cord.Meta.setMetadata(schemaMeta)
  //   console.dir(schemaMeta, {
  //     depth: null,
  //     colors: true,
  //   })

  //   try {
  //     await Cord.Chain.signAndSubmitTx(
  //       schemaMetaCreationExtrinsic,
  //       entityIdentity,
  //       {
  //         resolveOn: Cord.Chain.IS_IN_BLOCK,
  //         rejectOn: Cord.Chain.IS_ERROR,
  //       }
  //     )
  //     console.log('✅ Schema metadata added!')
  //   } catch (e: any) {
  //     console.log(e.errorCode, '-', e.message)
  //   }

  //   // Step 2: Create a new Space
  //   console.log(`\n❄️  Space Creation `)
  //   console.log(`🔗 ${newSchema.identifier}`)
  //   let spaceContent = {
  //     title: 'Demo Space',
  //     description: 'Space for demo',
  //   }
  //   let spaceTitle = spaceContent.title + ':' + UUID.generate()
  //   spaceContent.title = spaceTitle

  //   let newSpace = Cord.Space.fromSpaceProperties(
  //     spaceContent,
  //     employeeIdentity,
  //     newSchema.identifier
  //   )

  //   let spaceCreationExtrinsic = await Cord.Space.create(newSpace)

  //   console.dir(newSpace, { depth: null, colors: true })

  //   try {
  //     await Cord.Chain.signAndSubmitTx(spaceCreationExtrinsic, entityIdentity, {
  //       resolveOn: Cord.Chain.IS_IN_BLOCK,
  //       rejectOn: Cord.Chain.IS_ERROR,
  //     })
  //     console.log('✅ Space created!')
  //   } catch (e: any) {
  //     console.log(e.errorCode, '-', e.message)
  //   }

  //   // Step 4: Create a new Stream
  //   console.log(`\n❄️  Stream Creation `)
  //   console.log(`🔗 ${newSpace.identifier} `)
  //   console.log(`🔗 ${newSchema.identifier} `)

  //   const content = {
  //     name: 'Alice',
  //     age: 29,
  //     gender: 'Female',
  //     country: 'India',
  //     credit: 1000,
  //   }
  //   let schemaStream = Cord.Content.fromSchemaAndContent(
  //     newSchema,
  //     content,
  //     employeeIdentity.address,
  //     holderIdentity.address
  //   )
  //   console.dir(schemaStream, { depth: null, colors: true })

  //   let newStreamContent = Cord.ContentStream.fromContent(
  //     schemaStream,
  //     employeeIdentity,
  //     { space: newSpace.identifier }
  //   )
  //   console.dir(newStreamContent, { depth: null, colors: true })

  //   let newStream = Cord.Stream.fromContentStream(newStreamContent)

  //   let streamCreationExtrinsic = await Cord.Stream.create(newStream)
  //   console.dir(newStream, { depth: null, colors: true })

  //   try {
  //     await Cord.Chain.signAndSubmitTx(streamCreationExtrinsic, entityIdentity, {
  //       resolveOn: Cord.Chain.IS_IN_BLOCK,
  //       rejectOn: Cord.Chain.IS_ERROR,
  //     })
  //     console.log('✅ Stream created!')
  //   } catch (e: any) {
  //     console.log(e.errorCode, '-', e.message)
  //   }

  //   // Step 5: Update a Stream
  //   console.log(`\n❄️  Update - ${newStreamContent.identifier}`)
  //   const updateContent = JSON.parse(JSON.stringify(newStreamContent))
  //   updateContent.content.contents.name = 'Alice Jackson'

  //   let updateStreamContent = Cord.ContentStream.updateContent(
  //     updateContent,
  //     employeeIdentity
  //   )
  //   console.dir(updateStreamContent, { depth: null, colors: true })

  //   let updateStream = Cord.Stream.fromContentStream(updateStreamContent)
  //   let updateStreamCreationExtrinsic = await Cord.Stream.update(updateStream)
  //   console.dir(updateStream, { depth: null, colors: true })

  //   try {
  //     await Cord.Chain.signAndSubmitTx(
  //       updateStreamCreationExtrinsic,
  //       entityIdentity,
  //       {
  //         resolveOn: Cord.Chain.IS_IN_BLOCK,
  //         rejectOn: Cord.Chain.IS_ERROR,
  //       }
  //     )
  //     console.log('✅ Stream updated!')
  //   } catch (e: any) {
  //     console.log(e.errorCode, '-', e.message)
  //   }

  //   // Step 6: Validate a Credential
  //   console.log(`\n❄️  Verify - ${updateStreamContent.identifier} `)
  //   const stream = await Cord.Stream.query(updateStream.identifier)
  //   if (!stream) {
  //     console.log(`Stream not anchored on CORD`)
  //   } else {
  //     const credential = Cord.Credential.fromRequestAndStream(
  //       updateStreamContent,
  //       stream
  //     )
  //     const isCredentialValid = await Cord.Credential.verify(credential)
  //     console.log(`Is Alices's credential valid? ${isCredentialValid}`)
  //   }

  //   // Step 7: Revoke a Stream
  //   console.log(`\n❄️  Revoke - ${updateStreamContent.identifier} `)
  //   let revokeStream = updateStream

  //   let revokeStreamCreationExtrinsic = await Cord.Stream.revoke(
  //     revokeStream,
  //     employeeIdentity
  //   )

  //   try {
  //     await Cord.Chain.signAndSubmitTx(
  //       revokeStreamCreationExtrinsic,
  //       entityIdentity,
  //       {
  //         resolveOn: Cord.Chain.IS_IN_BLOCK,
  //         rejectOn: Cord.Chain.IS_ERROR,
  //       }
  //     )
  //     console.log(`✅ Alices's credential revoked!`)
  //   } catch (e: any) {
  //     console.log(e.errorCode, '-', e.message)
  //   }

  //   // Step 8: Re-verify a revoked Credential
  //   console.log(`\n❄️  Verify - ${updateStreamContent.identifier} `)
  //   const revstream = await Cord.Stream.query(updateStream.identifier)
  //   if (!revstream) {
  //     console.log(`Stream not anchored on CORD`)
  //   } else {
  //     const credential = Cord.Credential.fromRequestAndStream(
  //       updateStreamContent,
  //       revstream
  //     )
  //     const isCredentialValid = await Cord.Credential.verify(credential)
  //     console.log(`Is Alices's credential valid? ${isCredentialValid}`)
  //   }
}
main()
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(Cord.disconnect)

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})
