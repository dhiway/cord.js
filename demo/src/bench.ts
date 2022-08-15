import * as Cord from '@cord.network/sdk'
import BN from 'bn.js'
import moment from 'moment'
import Keyring from '@polkadot/keyring'
import { ApiPromise, WsProvider } from '@polkadot/api'

const amount: BN = new BN('1')

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

async function main() {
  await Cord.init({ address: 'ws://127.0.0.1:9944' })
  const wsProvider = new WsProvider('ws://127.0.0.1:9944')
  const api = await ApiPromise.create({ provider: wsProvider })

  // Step 1: Setup Identities
  const Alice = Cord.Identity.buildFromURI('//Alice', {
    signingKeyPairType: 'sr25519',
  })
  const Bob = Cord.Identity.buildFromURI('//Bob', {
    signingKeyPairType: 'sr25519',
  })
  let tx_batch: any = []

  let startTxPrep = moment()
  let txCount = 1000
  console.log(`\n ✨ Benchmark ${txCount} transactions `)

  for (let j = 0; j < txCount; j++) {
    process.stdout.write(
      '  🔖  Extrinsic creation took ' +
        moment.duration(moment().diff(startTxPrep)).as('seconds').toFixed(3) +
        's\r'
    )
    try {
      let txTransfer = await Cord.Balance.makeTransfer(
        Alice.address,
        amount,
        -6
      )
      tx_batch.push(txTransfer)
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

  let keyring = new Keyring({ type: 'sr25519' })
  let BatchAuthor = keyring.addFromUri('//Charlie')
  let batchAncStartTime = moment()
  try {
    api.tx.utility.batchAll(tx_batch).signAndSend(BatchAuthor)
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
