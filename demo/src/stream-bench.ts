import * as Cord from '@cord.network/sdk'
import { UUID } from '@cord.network/utils'
import moment from 'moment'
import Keyring from '@polkadot/keyring'
import { ApiPromise, WsProvider } from '@polkadot/api'

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

async function main() {
  await Cord.init({ address: 'ws://127.0.0.1:9944' })
  // await Cord.ChainHelpers.ChainApiConnection.getConnectionOrConnect()
  const wsProvider = new WsProvider('ws://127.0.0.1:9944')
  const api = await ApiPromise.create({ provider: wsProvider })

  // Step 1: Setup Identities
  const Alice = Cord.Identity.buildFromURI('//Alice', {
    signingKeyPairType: 'sr25519',
  })
  const Bob = Cord.Identity.buildFromURI('//Bob', {
    signingKeyPairType: 'sr25519',
  })

  // Step 2: Create a new Schema
  console.log(`\n\n✉️  Adding a new Schema \n`)
  let newSchemaContent = require('../res/schema.json')
  let newSchemaTitle = newSchemaContent.title + ':' + UUID.generate()
  newSchemaContent.title = newSchemaTitle

  let newSchema = Cord.Schema.fromSchemaProperties(newSchemaContent, Bob)
  let schemaCreationExtrinsic = await await Cord.Schema.create(newSchema)

  try {
    await Cord.Chain.signAndSubmitTx(schemaCreationExtrinsic, Bob, {
      resolveOn: Cord.Chain.IS_IN_BLOCK,
      rejectOn: Cord.Chain.IS_ERROR,
    })
    console.log('✅ Schema created!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  // Step 2: Create a new Stream
  console.log(`\n✉️  Adding a new Stream`, '\n')
  let tx_batch: any = []

  let startTxPrep = moment()
  let txCount = 805
  let newStreamContent: Cord.IContentStream
  console.log(`\n ✨ Benchmark ${txCount} transactions `)

  for (let j = 0; j < txCount; j++) {
    let content = {
      name: 'Alice' + ':' + UUID.generate(),
      age: 29,
      gender: 'Female',
      country: 'India',
      credit: 1000,
    }
    let schemaStream = Cord.Content.fromSchemaAndContent(
      newSchema,
      content,
      Bob.address
    )

    newStreamContent = Cord.ContentStream.fromContent(schemaStream, Bob)
    let newStream = Cord.Stream.fromContentStream(newStreamContent)

    process.stdout.write(
      '  🔖  Extrinsic creation took ' +
        moment.duration(moment().diff(startTxPrep)).as('seconds').toFixed(3) +
        's\r'
    )
    try {
      let txStream = await Cord.Stream.create(newStream)
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
      await Cord.Chain.signAndSubmitTx(tx_batch[i], Bob, {
        resolveOn: Cord.Chain.IS_READY,
        rejectOn: Cord.Chain.IS_ERROR,
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

  let tx_new_batch: any = []

  let startTxPrep2 = moment()

  for (let j = 0; j < txCount; j++) {
    let content = {
      name: 'Alice' + ':' + UUID.generate(),
      age: 29,
      gender: 'Female',
      country: 'India',
      credit: 1000,
    }
    let schemaStream = Cord.Content.fromSchemaAndContent(
      newSchema,
      content,
      Bob.address
    )

    let newStreamContent = Cord.ContentStream.fromContent(schemaStream, Bob)
    let newStream = Cord.Stream.fromContentStream(newStreamContent)

    process.stdout.write(
      '  🔖  Extrinsic creation took ' +
        moment.duration(moment().diff(startTxPrep2)).as('seconds').toFixed(3) +
        's\r'
    )
    try {
      let txStream = await Cord.Stream.create(newStream)
      tx_new_batch.push(txStream)
    } catch (e: any) {
      console.log(e.errorCode, '-', e.message)
    }
  }

  let keyring = new Keyring({ type: 'sr25519' })
  let BatchAuthor = keyring.addFromUri('//Charlie')
  let batchAncStartTime = moment()

  try {
    api.tx.utility.batch(tx_new_batch).signAndSend(BatchAuthor)
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
  await sleep(2000)
  await api.disconnect()
}

main()
  .then(() => console.log('Bye! 👋 👋 👋 \n'))
  .finally(Cord.disconnect)

process.on('SIGINT', async () => {
  console.log('Bye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})
