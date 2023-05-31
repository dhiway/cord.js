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
    '//Bob',
    'sr25519'
  )
  console.log(
    `👦🏻  Bob (${Bob.type}): ${Bob.address}`
  )
  let tx_batch: any = []

  let startTxPrep = moment()
  let txCount = 3400
  console.log(`\n ✨ Benchmark ${txCount} transactions `)
  for (let j = 0; j < txCount; j++) {
    try {
      const txTransfer =  await api.tx.balances.transfer(
        Bob.address,
        1,
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
      let nonce: number = 24012412;
    try {
        await tx_batch[i].signAndSend(Alice, {nonce: -1})
	/*
	TODO: Fix below
	*/
	/*
	Cord.Chain.signAndSubmitTx(tx_batch[i], Alice, {
	    nonce: nonce,
        resolveOn: Cord.Chain.IS_READY,
        rejectOn: Cord.Chain.IS_ERROR,
	})
	nonce++;
	*/  
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
  api.tx.utility.batchAll(tx_batch).signAndSend(BatchAuthor, {nonce: -1})
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
