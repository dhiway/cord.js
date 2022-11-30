import * as Cord from '@cord.network/sdk'
import { UUID, Crypto } from '@cord.network/utils'

async function main() {
  await Cord.init({ address: 'ws://127.0.0.1:9944' })

  // Step 1: Setup Org Identity
  console.log(`\n❄️  Demo Identities (KeyRing)`)
  //3x4DHc1rxVAEqKWSx1DAAA8wZxLB4VhiRbMV997niBckUwSi
  const entityIdentity = Cord.Identity.buildFromURI('//Bob', {
    signingKeyPairType: 'sr25519',
  })
  console.log(
    `🏛  Entity (${entityIdentity.signingKeyType}): ${entityIdentity.address}`
  )
  const employeeIdentity = Cord.Identity.buildFromURI('//Dave', {
    signingKeyPairType: 'sr25519',
  })
  console.log(
    `🧑🏻‍💼 Employee (${employeeIdentity.signingKeyType}): ${employeeIdentity.address}`
  )
  const holderIdentity = Cord.Identity.buildFromURI('//Alice', {
    signingKeyPairType: 'sr25519',
  })
  console.log(
    `👩‍⚕️ Holder (${holderIdentity.signingKeyType}): ${holderIdentity.address}`
  )
  const verifierIdentity = Cord.Identity.buildFromURI('//Charlie', {
    signingKeyPairType: 'ed25519',
  })
  console.log(
    `🏢 Verifier (${verifierIdentity.signingKeyType}): ${verifierIdentity.address}`
  )
  console.log('✅ Identities created!')

  let entity = UUID.generate();
  // Step 2: Create a Rating
  console.log(`\n❄️  Rating Creation `)
  let ratingContent = {
    rating: { rating: 39, count: 10},
    entity: entity,
    seller_app: UUID.generate(),
    buyer_app: UUID.generate(),
  }

  let newRating = Cord.Rating.fromRatingProperties(
    ratingContent,
    employeeIdentity
  )

  let ratingCreationExtrinsic = await Cord.Rating.create(newRating)

  console.dir(newRating, { depth: null, colors: true })

  try {
    await Cord.Chain.signAndSubmitTx(ratingCreationExtrinsic, entityIdentity, {
      resolveOn: Cord.Chain.IS_IN_BLOCK,
      rejectOn: Cord.Chain.IS_ERROR,
    })
    console.log('✅ Rating created!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }
}

main()
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(Cord.disconnect)

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})
