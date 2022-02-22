import * as cord from '@cord.network/api'
import { UUID } from '@cord.network/utils'
import * as utils from './utils'
import * as json from 'multiformats/codecs/json'
import { blake2b256 as hasher } from '@multiformats/blake2/blake2b'
import { CID } from 'multiformats/cid'

async function main() {
  await cord.init({ address: 'ws://127.0.0.1:9944' })

  // Step 1: Setup Org Identity
  console.log(`\n🏛  Creating Identities\n`)
  //3x4DHc1rxVAEqKWSx1DAAA8wZxLB4VhiRbMV997niBckUwSi
  const entityIdentity = cord.Identity.buildFromURI('//Bob', {
    signingKeyPairType: 'sr25519',
  })
  const employeeIdentity = cord.Identity.buildFromURI('//Dave', {
    signingKeyPairType: 'ed25519',
  })
  const holderIdentity = cord.Identity.buildFromURI('//Alice', {
    signingKeyPairType: 'sr25519',
  })
  const verifierIdentity = cord.Identity.buildFromURI('//Charlie', {
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
  console.log(`\n\n✉️  Adding a new Schema \n`)
  let newSchemaContent = require('../res/schema.json')
  let newSchemaTitle = newSchemaContent.title + ':' + UUID.generate()
  newSchemaContent.title = newSchemaTitle

  let newSchema = cord.Schema.fromSchemaProperties(
    newSchemaContent,
    employeeIdentity.address
  )

  let bytes = json.encode(newSchema.schema)
  let encoded_hash = await hasher.digest(bytes)
  const schemaCid = CID.create(1, 0xb240, encoded_hash)
  console.log('Version', newSchema.version)
  let schemaCreationExtrinsic = await newSchema.create(schemaCid.toString())

  console.log(`📧 Schema Details `)
  console.dir(newSchema, { depth: null, colors: true })
  console.log(`CID: `, schemaCid.toString())
  console.log('\n⛓  Anchoring Schema to the chain...')
  console.log(`🔑 Creator: ${employeeIdentity.address} `)
  console.log(`🔑 Controller: ${entityIdentity.address} `)
  console.dir(schemaCreationExtrinsic, { depth: null, colors: true })

  try {
    await cord.ChainUtils.signAndSubmitTx(
      schemaCreationExtrinsic,
      entityIdentity,
      {
        resolveOn: cord.ChainUtils.IS_READY,
        rejectOn: cord.ChainUtils.IS_ERROR,
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
  const nonceSaltValue = UUID.generate()
  let schemaStream = cord.Content.fromContentProperties(
    newSchema,
    content,
    employeeIdentity.address
  )
  console.log(`📧 Stream Details `)
  console.dir(schemaStream, { depth: null, colors: true })

  let newStreamContent = cord.MarkContent.fromContentProperties(
    schemaStream,
    employeeIdentity,
    { nonceSalt: nonceSaltValue }
  )
  console.log(`\n📧 Hashed Stream `)
  console.dir(newStreamContent, { depth: null, colors: true })

  bytes = json.encode(newStreamContent)
  encoded_hash = await hasher.digest(bytes)
  const streamCid = CID.create(1, 0xb220, encoded_hash)

  let newStream = cord.Stream.fromMarkContentProperties(
    newStreamContent,
    streamCid.toString()
  )

  let streamCreationExtrinsic = await newStream.create()
  console.log(`\n📧 Stream On-Chain Details`)
  console.dir(newStream, { depth: null, colors: true })

  console.log('\n⛓  Anchoring Stream to the chain...')
  console.log(`🔑 Creator: ${employeeIdentity.address} `)
  console.log(`🔑 Controller: ${entityIdentity.address} `)

  try {
    await cord.ChainUtils.signAndSubmitTx(
      streamCreationExtrinsic,
      entityIdentity,
      {
        resolveOn: cord.ChainUtils.IS_READY,
        rejectOn: cord.ChainUtils.IS_ERROR,
      }
    )
    console.log('✅ Stream created!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  // Step 3: Create a new Mark and Link to the Stream
  console.log(`\n\n✉️  Adding a new Mark Schema \n`)
  let credSchema = require('../res/cred-schema.json')
  credSchema.title = credSchema.title + ':' + UUID.generate()

  let credSchemaStream = cord.Schema.fromSchemaProperties(
    credSchema,
    employeeIdentity.address
  )

  bytes = json.encode(credSchemaStream)
  encoded_hash = await hasher.digest(bytes)
  const credSchemaCid = CID.create(1, 0xb220, encoded_hash)
  let credSchemaCreationExtrinsic = await credSchemaStream.create(
    credSchemaCid.toString()
  )
  console.log('\n⛓  Anchoring Mark Schema to the chain...')

  try {
    await cord.ChainUtils.signAndSubmitTx(
      credSchemaCreationExtrinsic,
      entityIdentity,
      {
        resolveOn: cord.ChainUtils.IS_READY,
        rejectOn: cord.ChainUtils.IS_ERROR,
      }
    )
    console.log('✅ Schema created!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }
  console.log(`📧 Schema Details `)
  console.dir(credSchema, { depth: null, colors: true })

  console.log(`\n✉️  Adding a new Mark`, '\n')
  let markStream = {
    name: newStreamContent.content.contents.name,
    country: newStreamContent.content.contents.country,
  }

  let credStreamContent = cord.Content.fromContentProperties(
    credSchemaStream,
    markStream,
    employeeIdentity.address,
    holderIdentity.address
  )

  let credContentStream = cord.MarkContent.fromContentProperties(
    credStreamContent,
    employeeIdentity,
    {
      link: newStream.streamId,
      nonceSalt: nonceSaltValue,
    }
  )
  console.log(`\n📧 Hashed Stream Details`)
  console.dir(credContentStream, { depth: null, colors: true })

  bytes = json.encode(credContentStream)
  encoded_hash = await hasher.digest(bytes)
  const credStreamCid = CID.create(1, 0xb220, encoded_hash)

  let credStreamTx = cord.Stream.fromMarkContentProperties(
    credContentStream,
    credStreamCid.toString()
  )

  let credStreamCreationExtrinsic = await credStreamTx.create()
  console.log(`\n📧 Mark On-Chain Details`)
  console.dir(credStreamTx, { depth: null, colors: true })

  try {
    await cord.ChainUtils.signAndSubmitTx(
      credStreamCreationExtrinsic,
      entityIdentity,
      {
        resolveOn: cord.ChainUtils.IS_READY,
        rejectOn: cord.ChainUtils.IS_ERROR,
      }
    )
    console.log('✅ Mark created!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }
  await utils.waitForEnter('\n⏎ Press Enter to continue..')

  //  Step 7: Mark exchange via messaging
  console.log(`\n\n📩 Mark Exchange - Selective Disclosure (Verifier)`)
  console.log(`🔑 Verifier Address: ${verifierIdentity.address}`)
  const purpose = 'Account Opening Request'
  const validUntil = Date.now() + 864000000
  const relatedData = true
  console.dir(newSchema, { depth: null, colors: true })

  const { session, message: message } =
    cord.Exchange.Request.newRequestBuilder()
      .requestPresentation({
        id: newSchema.id,
        properties: ['name'],
      })
      .finalize(
        purpose,
        verifierIdentity,
        holderIdentity.getPublicIdentity(),
        validUntil,
        relatedData
      )

  console.log(`\n📧 Selective Disclosure Request`)
  console.dir(message, { depth: null, colors: true })

  let credential: cord.Mark
  credential = cord.Mark.fromMarkContentStream(credContentStream, credStreamTx)
  const presentation = cord.Exchange.Share.createPresentation(
    holderIdentity,
    message,
    verifierIdentity.getPublicIdentity(),
    [credential],
    {
      showAttributes: message.body.content[0].requiredProperties,
      signer: holderIdentity,
      request: message.body.request,
    }
  )

  const { verified } = await cord.Exchange.Verify.verifyPresentation(
    presentation,
    session
  )

  console.log(`\n📧 Received Mark `)
  console.dir(presentation, { depth: null, colors: true })
  console.log('🔍 All valid? ', verified)

  await utils.waitForEnter('\n⏎ Press Enter to continue..')
}
main()
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(cord.disconnect)

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  cord.disconnect()
  process.exit(0)
})
