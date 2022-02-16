const { ApiPromise, WsProvider } = require('@polkadot/api')
const { Keyring } = require('@polkadot/keyring')
// import * as cord from '@cord.network/api'
import BN from 'bn.js'

const amount: BN = new BN(1)

async function main() {
  // await cord.init({ address: 'ws://127.0.0.1:9944' })
  const provider = new WsProvider('ws://127.0.0.1:9944')
  const api = await ApiPromise.create(provider)
  const keyring = new Keyring()

  // Step 1: Setup Org Identity
  console.log(`\n🏛  Creating Identities\n`)
  //3x4DHc1rxVAEqKWSx1DAAA8wZxLB4VhiRbMV997niBckUwSi
  const Eve = keyring.addFromUri('//Eve', {
    signingKeyPairType: 'sr25519',
  })
  const Bob = keyring.addFromUri('//Bob', {
    signingKeyPairType: 'sr25519',
  })
  console.log(Bob.address())
  // const NoToken = keyring.addFromUri('//NoToken', {
  //   signingKeyPairType: 'sr25519',
  // })

  // let accounts: any = []
  let tx_batch = []
  // accounts.push(
  //   cord.Identity.buildFromURI('//Bob', {
  //     signingKeyPairType: 'sr25519',
  //   })
  // )

  console.time('Transactions sent to the node in')
  // for (let i = 0; i < accounts.length; i++) {
  for (let j = 0; j < 10; j++) {
    let txTransfer = await api.tx.balances.transfer(Eve.address(), amount)
    tx_batch.push(txTransfer)
  }
  // }
  console.timeEnd('Transactions sent to the node in')
  for (let i = 0; i < tx_batch.length; i++) {
    try {
      await tx_batch[i].signAndSend(Bob, { nonce: -1 })
    } catch (e: any) {
      console.log(e.errorCode, '-', e.message)
    }
  }

  // let i = 0
  // let j = 0
  // let oldPendingTx = 0
  // let interval = setInterval(async () => {
  //   await api.rpc.author.pendingExtrinsics((extrinsics: any) => {
  //     i++
  //     j++
  //     if (oldPendingTx > extrinsics.length) {
  //       console.log('Approx TPS: ', (oldPendingTx - extrinsics.length) / j)
  //       j = 0
  //     }
  //     if (extrinsics.length === 0) {
  //       console.log(i + ' Second passed, No pending extrinsics in the pool.')
  //       clearInterval(interval)
  //       // unsub()
  //       process.exit()
  //     }
  //     console.log(
  //       i +
  //         ' Second passed, ' +
  //         extrinsics.length +
  //         ' pending extrinsics in the pool'
  //     )
  //     oldPendingTx = extrinsics.length
  //   })
  // }, 1000)
}

main()
  .catch(console.error)
  .then(() => console.log('\nBye! 👋 👋 👋 '))
// .finally(api.disconnect)

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  // api.disconnect()
  process.exit(0)
})

// main().catch(console.error)
