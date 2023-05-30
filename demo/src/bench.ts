import * as Cord from '@cord.network/sdk'
import BN from 'bn.js'
import moment from 'moment'
import Keyring from '@polkadot/keyring'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { Crypto } from '@cord.network/utils'
import { getChainCredits} from './utils/createAuthorities'
const amount: BN = new BN('1')
import {generateDidAuthenticatedTx} from '../../packages/did'

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

async function main() {
  const networkAddress = 'wss://sparknet.cord.network'
  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK })
  await Cord.connect(networkAddress)
  const api = Cord.ConfigService.get('api')
  // Step 1: Setup Identities
  const Alice = Crypto.makeKeypairFromUri(
    '//Sparknet//1//Demo',
    'sr25519'
  )
  console.log(
    `👩🏻  Alice (${Alice.type}): ${Alice.address}`
  )
  const Bob = Crypto.makeKeypairFromUri(
    '//Sparknet//1//Demo',
    'sr25519'
  )
  console.log(
    `👦🏻  Bob (${Bob.type}): ${Bob.address}`
  )
  let tx_batch: any = []

  let startTxPrep = moment()
  let txCount = 10
  console.log(`\n ✨ Benchmark ${txCount} transactions `)
  let nonce : any = 0
  for (let j = 0; j < txCount; j++) {
    process.stdout.write(
      ' 🔖  Extrinsic creation took ' +
        moment.duration(moment().diff(startTxPrep)).as('seconds').toFixed(3) +
        's\r'
    )
    try {
      const txTransfer =  api.tx.balances.transfer(
        Alice.address,
        5,
      )
      // console.log('txTransfer',txTransfer)
      tx_batch.push(txTransfer)
      // console.log(`tx_batch[${j}]\n`,tx_batch[j].registry,'\n')
      // console.log(`tx_batch\n`,tx_batch,'\n')

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
      // let resignedBatchTx = await tx_batch[i].signAsync(Bob, { nonce: nonce })
      // nonce = nonce + 1
      // console.log('\nnonce\n',nonce)
      // console.log('\nValue of i\n',i)
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
  let BatchAuthor = keyring.addFromUri('//Sparknet//1//Demo')
  let batchAncStartTime = moment()
  // for (let i = 0; i < tx_batch.length; i++){
  try {
    // await api.tx.utility.batch(tx_batch[i]).signAndSend(BatchAuthor,{nonce:nonce})
    // console.log('nonce : line 109',nonce)
    // nonce++
    api.tx.utility.batchAll(tx_batch).signAndSend(BatchAuthor, {nonce: -1})
    // nonce++
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }
// }

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
