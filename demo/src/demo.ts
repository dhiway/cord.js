import * as Cord from '@cord.network/api'
import { UUID } from '@cord.network/utils'
import * as utils from './utils'
// import * as json from 'multiformats/codecs/json'
// import { blake2b256 as hasher } from '@multiformats/blake2/blake2b'
// import { CID } from 'multiformats/cid'
// import * as VCUtils from '@cord.network/credential'

async function main() {
  await Cord.init({ address: 'ws://127.0.0.1:9944' })
  // const { api } =
  //   await Cord.ChainHelpers.ChainApiConnection.getConnectionOrConnect()

  // Step 1: Setup Org Identity
  console.log(`\n🏛  Creating Identities\n`)
  //3x4DHc1rxVAEqKWSx1DAAA8wZxLB4VhiRbMV997niBckUwSi
  const entityIdentity = Cord.Identity.buildFromURI('//Bob', {
    signingKeyPairType: 'sr25519',
  })
  const employeeIdentity = Cord.Identity.buildFromURI('//Dave', {
    signingKeyPairType: 'sr25519',
  })
  const holderIdentity = Cord.Identity.buildFromURI('//Alice', {
    signingKeyPairType: 'sr25519',
  })
  const verifierIdentity = Cord.Identity.buildFromURI('//Charlie', {
    signingKeyPairType: 'ed25519',
  })
  console.log(
    `🔑 Entity Controller Address (${entityIdentity.signingKeyType}): ${entityIdentity.address}`
  )
  console.log(
    `🔑 Employee Address (${employeeIdentity.signingKeyType}): ${employeeIdentity.address}`
  )
  console.log(
    `🔑 Holder Org Address (${holderIdentity.signingKeyType}): ${holderIdentity.address}`
  )
  console.log(
    `🔑 Verifier Org Address (${verifierIdentity.signingKeyType}): ${verifierIdentity.address}\n`
  )
  console.log('✅ Identities created!')

  // Step 2: Create a new Schema
  console.log(`\n\n✉️  Creating a new Space \n`)
  let spaceContent = {
    title: 'Demo Space',
    description: 'Space for demo',
  }
  let spaceTitle = spaceContent.title + ':' + UUID.generate()
  spaceContent.title = spaceTitle

  let newSpace = Cord.Space.fromSpaceProperties(spaceContent, employeeIdentity)

  let spaceCreationExtrinsic = await newSpace.create()

  console.log(`📧 Space Details `)
  console.dir(newSpace, { depth: null, colors: true })
  console.log('\n⛓  Anchoring Space to the chain...')
  console.log(`🔑 Creator: ${employeeIdentity.address} `)
  console.log(`🔑 Controller: ${entityIdentity.address} `)
  console.dir(spaceCreationExtrinsic, { depth: null, colors: true })

  try {
    await Cord.ChainUtils.signAndSubmitTx(
      spaceCreationExtrinsic,
      entityIdentity,
      {
        resolveOn: Cord.ChainUtils.IS_IN_BLOCK,
        rejectOn: Cord.ChainUtils.IS_ERROR,
      }
    )
    console.log('✅ Space created!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }
  console.log('SDK', newSpace.identifier)
  console.log(
    'SDK',
    Cord.Utils.Identifier.getIdentifierHash(newSpace.identifier, 'space:cord:')
  )
  // Step 2: Create a new Schema
  console.log(`\n\n✉️  Adding a new Schema \n`)
  let newSchemaContent = require('../res/schema.json')
  let newSchemaTitle = newSchemaContent.title + ':' + UUID.generate()
  newSchemaContent.title = newSchemaTitle

  let newSchema = Cord.Schema.fromSchemaProperties(
    newSchemaContent,
    employeeIdentity,
    newSpace.identifier
  )

  let schemaCreationExtrinsic = await newSchema.create()

  console.log(`📧 Schema Details `)
  console.dir(newSchema, { depth: null, colors: true })
  console.log('\n⛓  Anchoring Schema to the chain...')
  console.log(`🔑 Creator: ${employeeIdentity.address} `)
  console.log(`🔑 Controller: ${entityIdentity.address} `)
  console.dir(schemaCreationExtrinsic, { depth: null, colors: true })

  try {
    await Cord.ChainUtils.signAndSubmitTx(
      schemaCreationExtrinsic,
      entityIdentity,
      {
        resolveOn: Cord.ChainUtils.IS_IN_BLOCK,
        rejectOn: Cord.ChainUtils.IS_ERROR,
      }
    )
    console.log('✅ Schema created!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  // Step 2: Create a new Stream
  console.log(`\n✉️  Adding a new Stream`, '\n')
  let content = {
    name: 'Alice',
    age: 29,
    gender: 'Female',
    country: 'India',
    credit: 1000,
  }
  let schemaStream = Cord.Content.fromProperties(
    newSchema,
    content,
    employeeIdentity.address
  )
  console.log(`📧 Stream Details `)
  console.dir(schemaStream, { depth: null, colors: true })

  let newStreamContent = Cord.ContentStream.fromContent(
    schemaStream,
    employeeIdentity,
    { space: newSpace.identifier }
  )
  console.log(`\n📧 Hashed Stream `)
  console.dir(newStreamContent, { depth: null, colors: true })

  let newStream = Cord.Stream.fromContentStream(newStreamContent)

  let streamCreationExtrinsic = await newStream.create()
  console.log(`\n📧 Stream On-Chain Details`)
  console.dir(newStream, { depth: null, colors: true })

  console.log('\n⛓  Anchoring Stream to the chain...')
  console.log(`🔑 Creator: ${employeeIdentity.address} `)
  console.log(`🔑 Controller: ${entityIdentity.address} `)

  try {
    await Cord.ChainUtils.signAndSubmitTx(
      streamCreationExtrinsic,
      entityIdentity,
      {
        resolveOn: Cord.ChainUtils.IS_READY,
        rejectOn: Cord.ChainUtils.IS_ERROR,
      }
    )
    console.log('✅ Stream created!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  await utils.waitForEnter('\n⏎ Press Enter to continue..')

  // //  Step 7: Mark exchange via messaging
  // console.log(`\n\n📩 Mark Exchange - Selective Disclosure (Verifier)`)
  // console.log(`🔑 Verifier Address: ${verifierIdentity.address}`)
  // const purpose = 'Account Opening Request'
  // const validUntil = Date.now() + 864000000
  // const relatedData = true

  // const { session, message: message } =
  //   cord.Exchange.Request.newRequestBuilder()
  //     .requestPresentation({
  //       id: schemaStream.schemaId,
  //       properties: ['name', 'age'],
  //     })
  //     .finalize(
  //       purpose,
  //       verifierIdentity,
  //       holderIdentity.getPublicIdentity(),
  //       validUntil,
  //       relatedData
  //     )

  // console.log(`\n📧 Selective Disclosure Request`)
  // console.dir(message, { depth: null, colors: true })

  // const chainStream = await cord.Stream.query(newStream.streamId)
  // if (chainStream) {
  //   let credential: cord.Mark
  //   credential = cord.Mark.fromMarkContentStream(newStreamContent, chainStream)
  //   const presentation = cord.Exchange.Share.createPresentation(
  //     holderIdentity,
  //     message,
  //     verifierIdentity.getPublicIdentity(),
  //     [credential],
  //     {
  //       showAttributes: message.body.content[0].requiredProperties,
  //       signer: holderIdentity,
  //       request: message.body.request,
  //     }
  //   )

  //   const { verified } = await cord.Exchange.Verify.verifyPresentation(
  //     presentation,
  //     session
  //   )
  //   console.log(`\n📧 Received Mark `)
  //   console.dir(presentation, { depth: null, colors: true })

  //   let result = vcPresentation.verifiableCredential.proof.forEach(function (
  //     proof: any
  //   ) {
  //     console.log(proof)
  //     if (proof.type === VCUtils.constants.CORD_ANCHORED_PROOF_TYPE)
  //       VCUtils.verification.verifyAttestedProof(
  //         vcPresentation.verifiableCredential,
  //         proof
  //       )
  //   })
  //   console.log(result)
  //   if (result && result.verified) {
  //     console.log(
  //       `Name of the crook: ${vcPresentation.verifiableCredential.credentialSubject.name}`
  //     ) // prints 'Billy The Kid'
  //     // console.log(
  //     //   `Reward: ${vcPresentation.verifiableCredential.credentialSubject.}`
  //     // ) // undefined
  //   }

  //   console.log('🔍 All valid? ', verified)
  // } else {
  //   console.log(`\n❌ Mark not found `)
  // }

  await utils.waitForEnter('\n⏎ Press Enter to continue..')
}
main()
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(Cord.disconnect)

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})
