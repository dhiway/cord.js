import * as Cord from '@cord.network/sdk'
import moment from 'moment'
import Keyring from '@polkadot/keyring'
import { Crypto } from '@cord.network/utils'
import type { ICompact, INumber } from '@polkadot/types/types'
import { BN } from '@polkadot/util'

type V1Weight = INumber

interface V2Weight {
  refTime: ICompact<INumber>
  proofSize: ICompact<INumber>
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

export function convertWeight(weight: V1Weight | V2Weight): BN {
  if ((weight as V2Weight).refTime) {
    // V2 or V1.5 weight
    return (weight as V2Weight).refTime.toBn()
  }
  // V1 weight
  return (weight as V1Weight).toBn()
}

async function main() {
  // Make sure that you are running the CORD locally
  const networkAddress = 'ws://127.0.0.1:9944'
  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK })
  await Cord.connect(networkAddress)
  const api = Cord.ConfigService.get('api')
  // const Alice = Crypto.makeKeypairFromUri('//Alice', 'sr25519')
  const txRemark = api.tx.system.remark('Hello World!')
  const txCount = await Cord.Chain.getMaxBatchable(txRemark)
  let tx_batches: any[][] = []
  const batchSize = 10000
  // Start the timer for creation
  console.time('Extrinsic creation')
  // Create all batches first
  for (let i = 0; i < Math.ceil(txCount / batchSize); i++) {
    const start = i * batchSize
    const end = Math.min((i + 1) * batchSize, txCount)

    // Log progress for creation
    const progress = ((start / txCount) * 100).toFixed(2)
    console.log(
      `Creation Progress: ${progress}% - Creating transactions from ${
        start + 1
      } to ${end}`
    )

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

    tx_batches.push(batch)
  }

  // End the timer for creation
  console.timeEnd('Extrinsic creation')

  // Start the timer for sending
  console.time('Extrinsic sending')
  let keyring = new Keyring({ type: 'sr25519' })
  let BatchAuthor = keyring.addFromUri('//Charlie')
  // Loop through tx_batches to send each batch
  for (let i = 0; i < tx_batches.length; i++) {
    const batch = tx_batches[i]

    // Log progress for sending
    const progress = ((i / tx_batches.length) * 100).toFixed(2)
    console.log(`Sending Progress: ${progress}% - Sending batch ${i + 1}`)

    try {
      api.tx.utility.batchAll(batch).signAndSend(BatchAuthor)
    } catch (e: any) {
      console.log(e.errorCode, '-', e.message)
    }
  }

  // End the timer for sending
  console.timeEnd('Extrinsic sending')

  // let batchAncEndTime = moment()
  // var batchAncDuration = moment.duration(
  //   batchAncEndTime.diff(batchAncStartTime)
  // )
  // console.log(
  //   `\n  🎁  Anchoring a batch of ${
  //     tx_batch.length
  //   } extrinsics took ${batchAncDuration.as('seconds')}s`
  // )
  // console.log(
  //   `  🙌  Block TPS (batch) - ${+(
  //     txCount / batchAncDuration.as('seconds')
  //   ).toFixed(0)} `
  // )
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
// async function main() {
//   // Make sure that you are runni
