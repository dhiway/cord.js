import * as cord from '@cord.network/api'
import * as utils from './utils'
import BN from 'bn.js'
import moment from 'moment'
import Keyring from '@polkadot/keyring'

const amount: BN = new BN('1')

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
  let txCount = 1200
  console.log(`\n ✨ Benchmark ${txCount} transactions `)

  for (let j = 0; j < txCount; j++) {
    process.stdout.write(
      '  🔖  Extrinsic creation took ' +
        moment.duration(moment().diff(startTxPrep)).as('seconds') +
        ' Seconds\r'
    )
    try {
      let txTransfer = await cord.Balance.makeTransfer(Eve.address, amount, -18)
      tx_batch.push(txTransfer)
    } catch (e: any) {
      console.log(e.errorCode, '-', e.message)
    }
  }

  let ancStartTime = moment()
  console.log('\n')
  for (let i = 0; i < tx_batch.length; i++) {
    process.stdout.write(
      '  🎁  Extrinsic anchoring took ' +
        moment.duration(moment().diff(ancStartTime)).as('seconds') +
        ' Seconds\r'
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
    ).toFixed(3)} `
  )

  const { api } =
    await cord.ChainHelpers.ChainApiConnection.getConnectionOrConnect()
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
    `\n  🎁  Batch extrinsic anchoring took ${batchAncDuration.as(
      'seconds'
    )} Seconds`
  )
  console.log(
    `  🙌  Block TPS (batch) - ${+(
      txCount / batchAncDuration.as('seconds')
    ).toFixed(3)} `
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
