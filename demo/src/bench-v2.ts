import * as Cord from '@cord.network/sdk'
import Keyring from '@polkadot/keyring'
import moment from 'moment'

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

async function createBatch(
  start: number,
  end: number,
  api: any
): Promise<any[]> {
  const batch: any[] = Array.from({ length: end - start }, (_, index) => {
    try {
      return api.tx.system.remark(`Hello World! ${start + index + 1}`)
    } catch (e: any) {
      console.log(
        `Error on transaction ${start + index + 1}: ${e.errorCode} - ${
          e.message
        }`
      )
      return null
    }
  }).filter((tx) => tx !== null)
  return batch
}

async function sendBatch(
  batch: any[],
  batchAuthor: any,
  index: number,
  api: any
) {
  try {
    process.stdout.write('  🎁  Sending Batch ' + (index + 1) + 's\r')
    let nonce = await api.rpc.system.accountNextIndex(batchAuthor.address)
    await api.tx.utility
      .batchAll(batch)
      .signAndSend(batchAuthor, { nonce: nonce.addn(index) })
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }
}

async function main() {
  const networkAddress = 'ws://127.0.0.1:9944'
  await Cord.connect(networkAddress)
  const api = Cord.ConfigService.get('api')
  const txRemark = api.tx.system.remark('H!')
  // const txCount = await Cord.Chain.getMaxBatchable(txRemark)
  const txCount = 60000
  const batchSize = 1000

  // Start the timer for creation
  console.time('Extrinsic creation')
  let ancStartTime = moment()

  // const createBatchPromises = []
  const createBatchPromises: Promise<any[]>[] = []
  for (let i = 0; i < Math.ceil(txCount / batchSize); i++) {
    process.stdout.write(
      '  🎁  Anchoring ' +
        (i + 1 * batchSize) +
        ' extrinsics took ' +
        moment.duration(moment().diff(ancStartTime)).as('seconds').toFixed(3) +
        's\r'
    )
    const start = i * batchSize
    const end = Math.min((i + 1) * batchSize, txCount)
    createBatchPromises.push(createBatch(start, end, api))
  }
  const tx_batches = await Promise.all(createBatchPromises)
  console.timeEnd('Extrinsic creation')

  // Initialize keyring and author
  let keyring = new Keyring({ type: 'sr25519' })
  let batchAuthor = keyring.addFromUri('//Charlie')
  // Start the timer for sending
  console.time('Extrinsic sending')
  let batchAncStartTime = moment()

  const sendBatchPromises = tx_batches.map((batch, index) =>
    sendBatch(batch, batchAuthor, index, api)
  )
  await Promise.all(sendBatchPromises)
  console.timeEnd('Extrinsic sending')
  let batchAncEndTime = moment()
  var batchAncDuration = moment.duration(
    batchAncEndTime.diff(batchAncStartTime)
  )
  console.log(
    `\n  🎁  Anchoring a batch of ${txCount} extrinsics took ${batchAncDuration.as(
      'seconds'
    )}s`
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
  console.log('\nBye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})
