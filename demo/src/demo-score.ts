import * as Cord from '@cord.network/sdk'
import { ScoreType } from '@cord.network/types'
import { UUID } from '@cord.network/utils'

async function main() {
  await Cord.init({ address: 'ws://127.0.0.1:9944' })

  // Step 1: Setup Org Identity
  console.log(`\n❄️  Demo Identities (KeyRing)`)
  //3x4DHc1rxVAEqKWSx1DAAA8wZxLB4VhiRbMV997niBckUwSi
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
    `🧑🏻‍💼 Score Collector (${collectorIdentity.signingKeyType}): ${collectorIdentity.address}`
  )
  const requestorIdentity = Cord.Identity.buildFromURI('//SellerApp', {
    signingKeyPairType: 'ed25519',
  })
  console.log(
    `👩‍⚕️ Score Requestor (${requestorIdentity.signingKeyType}): ${requestorIdentity.address}`
  )
  const transactionAuthor = Cord.Identity.buildFromURI('//Bob', {
    signingKeyPairType: 'sr25519',
  })
  console.log(
    `🏢 Transaction Author (${transactionAuthor.signingKeyType}): ${transactionAuthor.address}`
  )
  console.log('✅ Identities created!')

  // Step 2: Create a jounal entry
  console.log(`\n❄️  Journal Entry `)
  let journalContent = {
    entity: sellerIdentity.address,
    uid: UUID.generate().toString(),
    tid: UUID.generate().toString(),
    collector: collectorIdentity.address,
    requestor: requestorIdentity.address,
    scoreType: ScoreType.overall,
    score: 3.7,
  }
  console.dir(journalContent, { depth: null, colors: true })

  let newJournalEntry = Cord.Score.fromJournalProperties(
    journalContent,
    sellerIdentity
  )

  let journalCreationExtrinsic = await Cord.Score.entries(newJournalEntry)
  console.log(`\n❄️  Transformed Journal Entry `)
  console.dir(newJournalEntry, { depth: null, colors: true })

  try {
    await Cord.Chain.signAndSubmitTx(
      journalCreationExtrinsic,
      transactionAuthor,
      {
        resolveOn: Cord.Chain.IS_IN_BLOCK,
        rejectOn: Cord.Chain.IS_ERROR,
      }
    )
    console.log('✅ Journal Entry added!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  console.log(`\n❄️  Query Chain Scores `)
  const chainScore = await Cord.Score.query(
    journalContent.entity,
    journalContent.scoreType
  )
  console.dir(chainScore, { depth: null, colors: true })

  const chainAvgScore = await Cord.Score.queryAverage(
    journalContent.entity,
    journalContent.scoreType
  )
  console.dir(chainAvgScore, { depth: null, colors: true })
}

main()
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(Cord.disconnect)

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})
