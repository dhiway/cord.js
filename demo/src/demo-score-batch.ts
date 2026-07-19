import * as Cord from '@cord.network/sdk'
import moment from 'moment'
import { ScoreType } from '@cord.network/types'
import { Keyring } from '@cord.network/types'
import { UUID } from '@cord.network/utils'

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}
function getRandomFloat(min: number, max: number, decimals: number) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals)

  return parseFloat(str)
}
async function main() {
  await Cord.init({ address: 'ws://127.0.0.1:9944' })
  const wsProvider = new Cord.WsProvider('ws://127.0.0.1:9944')
  const api = await Cord.ApiPromise.create({ provider: wsProvider })

  // Step 1: Setup Identities
  console.log(`\n❄️  Demo Identities (KeyRing)`)

  const sellerIdentity = Cord.Identity.buildFromURI('//Entity', {
    signingKeyPairType: 'sr25519',
  })
  console.log(
    `🏛  Seller Entity (${sellerIdentity.signingKeyType}): ${sellerIdentity.address}`
  )
  const deliveryIdentity = Cord.Identity.buildFromURI('//Delivery', {
    signingKeyPairType: 'sr25519',
  })
  console.log(
    `🏛  Delivery Entity (${deliveryIdentity.signingKeyType}): ${deliveryIdentity.address}`
  )
  const collectorIdentity = Cord.Identity.buildFromURI('//BuyerApp', {
    signingKeyPairType: 'ed25519',
  })
  console.log(
    `📱 Score Collector (${collectorIdentity.signingKeyType}): ${collectorIdentity.address}`
  )
  const requestorIdentity = Cord.Identity.buildFromURI('//SellerApp', {
    signingKeyPairType: 'ed25519',
  })
  console.log(
    `📱 Score Requestor (${requestorIdentity.signingKeyType}): ${requestorIdentity.address}`
  )
  const poolTransactionAuthor = Cord.Identity.buildFromURI('//Bob', {
    signingKeyPairType: 'sr25519',
  })
  console.log(
    `🏢 Pool Author (${poolTransactionAuthor.signingKeyType}): ${poolTransactionAuthor.address}`
  )
  let keyring = new Keyring({ type: 'sr25519' })
  let batchTransactionAuthor = keyring.addFromUri('//Charlie')
  console.log(
    `🏢 Batch Author (${keyring.type}): ${batchTransactionAuthor.address}`
  )
  console.log('✅ Identities created!')

  let txPoolBatch: any = []

  let startTxPrep = moment()
  let txPoolCount = 125

  console.log(`\n❄️  Pool Submission `)
  for (let j = 0; j < txPoolCount; j++) {
    let tidUid = UUID.generate().toString()
    let overallPoolEntryContent = {
      entity: sellerIdentity.address,
      uid: UUID.generate().toString(),
      tid: tidUid,
      collector: collectorIdentity.address,
      requestor: requestorIdentity.address,
      scoreType: ScoreType.overall,
      score: getRandomFloat(1.5, 4.5, 2),
    }

    let newOverallPoolJournalEntry = Cord.Score.fromJournalProperties(
      overallPoolEntryContent,
      sellerIdentity
    )

    try {
      let txOverallPoolEntry = await Cord.Score.entries(
        newOverallPoolJournalEntry
      )
      txPoolBatch.push(txOverallPoolEntry)
    } catch (e: any) {
      console.log(e.errorCode, '-', e.message)
    }

    let deliveryPoolEntryContent = {
      entity: deliveryIdentity.address,
      uid: UUID.generate().toString(),
      tid: tidUid,
      collector: collectorIdentity.address,
      requestor: requestorIdentity.address,
      scoreType: ScoreType.delivery,
      score: getRandomFloat(0.5, 3.5, 2),
    }
    let newDeliveryPoolJournalEntry = Cord.Score.fromJournalProperties(
      deliveryPoolEntryContent,
      deliveryIdentity
    )
    try {
      let txDeliveryPoolEntry = await Cord.Score.entries(
        newDeliveryPoolJournalEntry
      )
      txPoolBatch.push(txDeliveryPoolEntry)
    } catch (e: any) {
      console.log(e.errorCode, '-', e.message)
    }
  }
  let ancStartTime = moment()
  // console.log('\n')
  for (let i = 0; i < txPoolBatch.length; i++) {
    process.stdout.write(
      '  ✨  Creation, Transformation & Submission of ' +
        (i + 1) +
        ' extrinsics to the pool took ' +
        moment.duration(moment().diff(ancStartTime)).as('seconds').toFixed(3) +
        's\r'
    )

    try {
      await Cord.Chain.signAndSubmitTx(txPoolBatch[i], poolTransactionAuthor, {
        resolveOn: Cord.Chain.IS_READY,
        rejectOn: Cord.Chain.IS_ERROR,
      })
    } catch (e: any) {
      console.log(e.errorCode, '-', e.message)
    }
  }

  console.log(`\n❄️  Batch Anchoring `)
  let txBatch: any = []
  let startBatchPrep = moment()
  let txBatchCount = 125
  for (let j = 0; j < txBatchCount; j++) {
    let tidUid = UUID.generate().toString()
    let overallEntryContent = {
      entity: sellerIdentity.address,
      uid: UUID.generate().toString(),
      tid: tidUid,
      collector: collectorIdentity.address,
      requestor: requestorIdentity.address,
      scoreType: ScoreType.overall,
      score: getRandomFloat(1.5, 4.5, 2),
    }

    let newOverallJournalEntry = Cord.Score.fromJournalProperties(
      overallEntryContent,
      sellerIdentity
    )

    try {
      let txOverallEntry = await Cord.Score.entries(newOverallJournalEntry)
      txBatch.push(txOverallEntry)
    } catch (e: any) {
      console.log(e.errorCode, '-', e.message)
    }

    let deliveryEntryContent = {
      entity: deliveryIdentity.address,
      uid: UUID.generate().toString(),
      tid: tidUid,
      collector: collectorIdentity.address,
      requestor: requestorIdentity.address,
      scoreType: ScoreType.delivery,
      score: getRandomFloat(0.5, 3.5, 2),
    }
    let newDeliveryJournalEntry = Cord.Score.fromJournalProperties(
      deliveryEntryContent,
      deliveryIdentity
    )
    try {
      let txDeliveryEntry = await Cord.Score.entries(newDeliveryJournalEntry)
      txBatch.push(txDeliveryEntry)
    } catch (e: any) {
      console.log(e.errorCode, '-', e.message)
    }
  }
  try {
    api.tx.utility.batchAll(txBatch).signAndSend(batchTransactionAuthor)
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }
  process.stdout.write(
    '  ✨  Creation, Transformation & Submission of ' +
      txBatch.length +
      ' extrinsics to the block took ' +
      moment.duration(moment().diff(startBatchPrep)).as('seconds').toFixed(3) +
      's\r'
  )
  console.log('\n\n💤 Waiting for block finalization')

  await sleep(6000)
  console.log(`\n❄️  Query Chain Scores `)
  const chainDeliveryScore = await Cord.Score.query(
    deliveryIdentity.address,
    ScoreType.delivery
  )
  console.dir(chainDeliveryScore, { depth: null, colors: true })

  const chainDeiveryAvgScore = await Cord.Score.queryAverage(
    deliveryIdentity.address,
    ScoreType.delivery
  )
  console.dir(chainDeiveryAvgScore, { depth: null, colors: true })

  const chainOverallScore = await Cord.Score.query(
    sellerIdentity.address,
    ScoreType.overall
  )
  console.dir(chainOverallScore, { depth: null, colors: true })

  const chainOverallAvgScore = await Cord.Score.queryAverage(
    sellerIdentity.address,
    ScoreType.overall
  )
  console.dir(chainOverallAvgScore, { depth: null, colors: true })
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
