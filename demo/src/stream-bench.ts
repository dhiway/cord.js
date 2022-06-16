import * as cord from '@cord.network/api'
import * as utils from './utils'
import { UUID } from '@cord.network/utils'
// import BN from 'bn.js'
import moment from 'moment'
import Keyring from '@polkadot/keyring'
import * as json from 'multiformats/codecs/json'
import { blake2b256 as hasher } from '@multiformats/blake2/blake2b'
import { CID } from 'multiformats/cid'

// const amount: BN = new BN('1')

async function main() {
  await cord.init({ address: 'ws://127.0.0.1:9944' })

  // Step 1: Setup Identities
  const Alice = cord.Identity.buildFromURI('//Alice', {
    signingKeyPairType: 'sr25519',
  })
  const Bob = cord.Identity.buildFromURI('//Bob', {
    signingKeyPairType: 'sr25519',
  })

  // Step 2: Create a new Schema
  console.log(`\n\n✉️  Adding a new Schema \n`)
  let newSchemaContent = require('../res/schema.json')
  let newSchemaTitle = newSchemaContent.title + ':' + UUID.generate()
  newSchemaContent.title = newSchemaTitle

  let newSchema = cord.Schema.fromSchemaProperties(
    newSchemaContent,
    Bob.address
  )

  let bytes = json.encode(newSchema.schema)
  let encoded_hash = await hasher.digest(bytes)
  const schemaCid = CID.create(1, 0xb240, encoded_hash)
  let schemaCreationExtrinsic = await newSchema.create(schemaCid.toString())

  try {
    await cord.ChainUtils.signAndSubmitTx(schemaCreationExtrinsic, Bob, {
      resolveOn: cord.ChainUtils.IS_IN_BLOCK,
      rejectOn: cord.ChainUtils.IS_ERROR,
    })
    console.log('✅ Schema created!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  // Step 2: Create a new Stream
  console.log(`\n✉️  Adding a new Stream`, '\n')
  let tx_batch = []

  let startTxPrep = moment()
  let txCount = 500
  let newStreamContent: cord.MarkContent
  // let link_id: string = '5P4oXCREF8Uw6pJHRMZfhgmoN6DDAtAN72hNuAMgGnCqkJn7'
  console.log(`\n ✨ Benchmark ${txCount} transactions `)

  for (let j = 0; j < txCount; j++) {
    let content = {
      name: 'Alice' + ':' + UUID.generate(),
      age: 29,
      gender: 'Female',
      country: 'India',
      credit: 1000,
    }
    // const nonceSaltValue = UUID.generate()
    let schemaStream = cord.Content.fromContent(
      newSchema,
      content,
      Alice.address
    )

    newStreamContent = cord.MarkContent.fromContent(
      schemaStream,
      Alice
      // { nonceSalt: nonceSaltValue }
    )

    // newStreamContent = cord.MarkContent.fromContent(
    //   schemaStream,
    //   Alice,
    //   { link: link_id, nonceSalt: nonceSaltValue }
    // )

    // bytes = json.encode(newStreamContent)
    // encoded_hash = await hasher.digest(bytes)
    // const streamCid = CID.create(1, 0xb220, encoded_hash)

    let newStream = cord.Stream.fromMarkContentProperties(
      newStreamContent
      // streamCid.toString()
    )
    process.stdout.write(
      '  🔖  Extrinsic creation took ' +
        moment.duration(moment().diff(startTxPrep)).as('seconds').toFixed(3) +
        's\r'
    )
    try {
      let txStream = await newStream.create()
      tx_batch.push(txStream)
    } catch (e: any) {
      console.log(e.errorCode, '-', e.message)
    }
  }

  let ancStartTime = moment()
  console.log('\n')
  for (let i = 0; i < tx_batch.length; i++) {
    process.stdout.write(
      '  🎁  Anchoring ' +
        (i + 1) +
        ' extrinsics took ' +
        moment.duration(moment().diff(ancStartTime)).as('seconds').toFixed(3) +
        's\r'
    )
    try {
      await cord.ChainUtils.signAndSubmitTx(tx_batch[i], Bob, {
        resolveOn: cord.ChainUtils.IS_READY,
        rejectOn: cord.ChainUtils.IS_ERROR,
      })
    } catch (e: any) {
      console.log(e.errorCode, '-', e.message)
    }
  }

  let ancEndTime = moment()
  var ancDuration = moment.duration(ancEndTime.diff(ancStartTime))
  console.log(
    `\n  🙌  Block TPS (extrinsic) - ${+(
      txCount / ancDuration.as('seconds')
    ).toFixed(0)} `
  )

  let tx_new_batch = []

  let startTxPrep2 = moment()

  for (let j = 0; j < txCount; j++) {
    let content = {
      name: 'Alice' + ':' + UUID.generate(),
      age: 29,
      gender: 'Female',
      country: 'India',
      credit: 1000,
    }
    // const nonceSaltValue = UUID.generate()
    let schemaStream = cord.Content.fromContent(
      newSchema,
      content,
      Alice.address
    )

    let newStreamContent = cord.MarkContent.fromContent(
      schemaStream,
      Alice
      // { nonceSalt: nonceSaltValue }
    )

    // bytes = json.encode(newStreamContent)
    // encoded_hash = await hasher.digest(bytes)
    // const streamCid = CID.create(1, 0xb220, encoded_hash)

    let newStream = cord.Stream.fromMarkContentProperties(
      newStreamContent
      // streamCid.toString()
    )
    process.stdout.write(
      '  🔖  Extrinsic creation took ' +
        moment.duration(moment().diff(startTxPrep2)).as('seconds').toFixed(3) +
        's\r'
    )
    try {
      let txStream = await newStream.create()
      tx_new_batch.push(txStream)
    } catch (e: any) {
      console.log(e.errorCode, '-', e.message)
    }
  }

  const { api } =
    await cord.ChainHelpers.ChainApiConnection.getConnectionOrConnect()
  let keyring = new Keyring({ type: 'sr25519' })
  let BatchAuthor = keyring.addFromUri('//Charlie')
  let batchAncStartTime = moment()
  try {
    api.tx.utility.batchAll(tx_new_batch).signAndSend(BatchAuthor)
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  let batchAncEndTime = moment()
  var batchAncDuration = moment.duration(
    batchAncEndTime.diff(batchAncStartTime)
  )
  console.log(
    `\n  🎁  Anchoring a batch of ${
      tx_batch.length
    } extrinsics took ${batchAncDuration.as('seconds')}s`
  )
  console.log(
    `  🙌  Block TPS (batch) - ${+(
      txCount / batchAncDuration.as('seconds')
    ).toFixed(0)} `
  )
  await utils.waitForEnter('\n⏎ Press Enter to continue..')
}

main()
  .then(() => console.log('Bye! 👋 👋 👋 \n'))
  .finally(cord.disconnect)

process.on('SIGINT', async () => {
  console.log('Bye! 👋 👋 👋 \n')
  cord.disconnect()
  process.exit(0)
})
