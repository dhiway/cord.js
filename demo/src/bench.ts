import * as Cord from '@cord.network/sdk'
import moment from 'moment'
import Keyring from '@polkadot/keyring'
import { Crypto } from '@cord.network/utils'

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

async function main() {
  // Make sure that you are running the CORD locally
  const networkAddress = 'ws://127.0.0.1:9944'
  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK })
  await Cord.connect(networkAddress)
  const api = Cord.ConfigService.get('api')
  // Step 1: Setup Identities
  console.log(`\n❄️  Demo Identities (KeyRing)\n`)
  const Alice = Crypto.makeKeypairFromUri('//Alice', 'sr25519')
  console.log(`👩🏻  Alice (${Alice.type}): ${Alice.address}`)
  const Bob = Crypto.makeKeypairFromUri('//Bob', 'sr25519')
  console.log(`👦🏻  Bob (${Bob.type}): ${Bob.address}`)
  let tx_batch: any = []
  let startTxPrep = moment()
  let txCount = 3000
  console.log(`\n ✨ Benchmark ${txCount} transactions `)
  console.log(
    '\nTo see the transactions, Go to https://apps.cord.network -> DEVELOPMENT -> Local Node -> Switch\n'
  )
  let nonce: any = 0
  for (let j = 0; j < txCount; j++) {
    process.stdout.write(
      ' 🔖  Extrinsic creation took ' +
        moment.duration(moment().diff(startTxPrep)).as('seconds').toFixed(3) +
        's\r'
    )
    try {
      const txTransfer = api.tx.balances.transfer(Alice.address, 5)
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
  console.log('\nBye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})
