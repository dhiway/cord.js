import * as cord from '@cord.network/api'
import { UUID } from '@cord.network/utils'
// import * as utils from './utils'
import * as json from 'multiformats/codecs/json'
import { blake2b256 as hasher } from '@multiformats/blake2/blake2b'
import { CID } from 'multiformats/cid'
// import { Stream } from 'modules/lib'

async function main() {
  await cord.init({ address: 'ws://127.0.0.1:9944' })

  // Step 1: Setup Org Identity
  console.log(`\n🏛  Creating Identities\n`)
  //3x4DHc1rxVAEqKWSx1DAAA8wZxLB4VhiRbMV997niBckUwSi
  const entityIdentity = cord.Identity.buildFromURI('//Bob', {
    signingKeyPairType: 'sr25519',
  })
  const appIdentity = cord.Identity.buildFromURI('//Dave', {
    signingKeyPairType: 'ed25519',
  })
  console.log(
    `🔑 NPCI Controller Address (${entityIdentity.signingKeyType}): ${entityIdentity.address}`
  )
  console.log(
    `🔑 NPCI ID Registry Application Address (${appIdentity.signingKeyType}): ${appIdentity.address}`
  )
  console.log('✅ Identities created!')

  // Step 2: Create a new Schema
  console.log(`\n\n✉️  Adding a new ID Registry Schema \n`)
  let newSchemaContent = require('../res/npci.json')
  let newSchemaName = newSchemaContent.name + ':' + UUID.generate()
  newSchemaContent.name = newSchemaName

  let newSchema = cord.Schema.fromSchemaProperties(
    newSchemaContent,
    appIdentity.address
  )

  let bytes = json.encode(newSchema)
  let encoded_hash = await hasher.digest(bytes)
  const schemaCid = CID.create(1, 0xb220, encoded_hash)

  let schemaCreationExtrinsic = await newSchema.store(schemaCid.toString())

  console.log(`📧 ID Registry Schema Details `)
  console.dir(newSchema, { depth: null, colors: true })
  console.log(`CID: `, schemaCid.toString())
  console.log('\n⛓  Anchoring Schema to the chain...')
  console.log(`🔑 Creator: ${appIdentity.address} `)
  console.log(`🔑 Controller: ${entityIdentity.address} `)

  try {
    await cord.ChainUtils.signAndSubmitTx(
      schemaCreationExtrinsic,
      entityIdentity,
      {
        resolveOn: cord.ChainUtils.IS_IN_BLOCK,
      }
    )
    console.log('✅ ID Registry Schema created!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  // Step 2: Create a new Stream
  console.log(`\n✉️  Adding a new ID Registry Stream`, '\n')
  let content = {
    type: 'BANK',
    verifiedName: 'Ashok Kumar',
    id: 1234567890,
  }
  let schemaStream = cord.Content.fromSchemaAndContent(
    newSchema,
    content,
    appIdentity.address
  )
  console.log(`📧 ID Registry Stream Details `)
  console.dir(schemaStream, { depth: null, colors: true })

  let newStreamContent = cord.ContentStream.fromStreamContent(
    schemaStream,
    appIdentity
  )
  console.log(`\n📧 Hashed ID Registry Stream `)
  console.dir(newStreamContent, { depth: null, colors: true })

  bytes = json.encode(newStreamContent)
  encoded_hash = await hasher.digest(bytes)
  const streamCid = CID.create(1, 0xb220, encoded_hash)

  let newStream = cord.Stream.fromContentStreamProperties(
    newStreamContent,
    streamCid.toString()
  )
  let streamId = newStream.id

  let streamCreationExtrinsic = await newStream.store()
  console.log(`\n📧 ID Registry Stream On-Chain Details`)
  console.dir(newStream, { depth: null, colors: true })

  console.log('\n⛓  Anchoring ID Registry Stream to the chain...')
  console.log(`🔑 Creator: ${appIdentity.address} `)
  console.log(`🔑 Controller: ${entityIdentity.address} `)

  try {
    await cord.ChainUtils.signAndSubmitTx(
      streamCreationExtrinsic,
      entityIdentity,
      {
        resolveOn: cord.ChainUtils.IS_IN_BLOCK,
      }
    )
    console.log('✅ ID Registry Stream anchored!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  let streamDetails = await cord.Stream.query(streamId)
  console.log('\n⛓  Check the state of an ID on the chain...')
  console.log(`📧 ID: ${streamId} `)
  console.log(`⛓  Black Listed: ${streamDetails?.revoked} `)

  let statusExtrinsic = await cord.Stream.set_status(
    streamId,
    appIdentity.address,
    true
  )

  console.log('\n⛓  Change the status of an ID on the chain...')
  console.log(`📧 ID: ${streamId} `)
  console.log(`⛓  Current Status: ${streamDetails?.revoked} `)
  console.log(`📧 New Status: ${true} `)

  try {
    await cord.ChainUtils.signAndSubmitTx(statusExtrinsic, entityIdentity, {
      resolveOn: cord.ChainUtils.IS_IN_BLOCK,
    })
    console.log('✅ ID Registry Stream status changed!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  let newStreamDetails = await cord.Stream.query(streamId)
  console.log('\n⛓  Check State of an ID on the chain...')
  console.log(`📧 ID: ${streamId} `)
  console.log(`⛓  Black Listed: ${newStreamDetails?.revoked} `)
}
main()
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(cord.disconnect)

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  cord.disconnect()
  process.exit(0)
})
