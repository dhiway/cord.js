import * as cord from '@cord.network/api'
import * as utils from './utils'
import BN from 'bn.js'
import moment from 'moment'

const amount: BN = new BN(1)

async function main() {
  await cord.init({ address: 'ws://127.0.0.1:9944' })

  // Step 1: Setup Identities
  const Eve = cord.Identity.buildFromURI('//Alice', {
    signingKeyPairType: 'sr25519',
  })
  const Bob = cord.Identity.buildFromURI('//Dave', {
    signingKeyPairType: 'sr25519',
  })
  let tx_batch = []

  let startTxPrep = moment()
  let txCount = 1000
  console.log(`\n ✨ Benchmark ${txCount} transactions `)

  for (let j = 0; j < txCount; j++) {
    try {
      let txTransfer = await cord.Balance.makeTransfer(Eve.address, amount, 0)
      tx_batch.push(txTransfer)
    } catch (e: any) {
      console.log(e.errorCode, '-', e.message)
    }
  }

  let prepEndTime = moment()
  var txDuration = moment.duration(prepEndTime.diff(startTxPrep))
  console.log(`\n 🔖 Creation  took ${txDuration.as('seconds')} Seconds`)

  let ancStartTime = moment()
  for (let i = 0; i < tx_batch.length; i++) {
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
  console.log(` 🎁 Anchoring took ${ancDuration.as('seconds')} Seconds`)
  console.log(` 🙌 Block TPS ${txCount / ancDuration.as('seconds')} `)
  await utils.waitForEnter('\n⏎ Press Enter to continue..')

  //TODO utility batch submission
}

main()
  .then(() => console.log('Bye! 👋 👋 👋 \n'))
  .finally(cord.disconnect)

process.on('SIGINT', async () => {
  console.log('Bye! 👋 👋 👋 \n')
  cord.disconnect()
  process.exit(0)
})
