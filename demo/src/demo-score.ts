import * as Cord from '@cord.network/sdk'
import { UUID, Crypto } from '@cord.network/utils'
import { generateKeypairs } from './utils/generateKeypairs'
import { createDid } from './utils/generateDid'
import { addRegistryAdminDelegate } from './utils/generateRegistry'
import { randomUUID } from 'crypto'
import { addAuthority } from './utils/createAuthorities'
import { createAccount } from './utils/createAccount'
import { RatingEntry, IJournalContent, RatingType } from '@cord.network/types'

async function main() {
  const networkAddress = 'ws://127.0.0.1:9944'
  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK })
  await Cord.connect(networkAddress)

  const api = Cord.ConfigService.get('api')

  console.log(`\n❄️   New Member\n`)
  const authorityAuthorIdentity = Crypto.makeKeypairFromUri(
    '//Alice',
    'sr25519'
  )
  // Setup author authority account.
  const { account: authorIdentity } = await createAccount()
  console.log(`🏦  Member (${authorIdentity.type}): ${authorIdentity.address}`)
  await addAuthority(authorityAuthorIdentity, authorIdentity.address)
  console.log(`🔏  Member permissions updated`)
  console.log('✅  Network Member added!')

  // Step 2: Setup Identities
  console.log(`\n❄️   Demo Identities (KeyRing)\n`)
  const { mnemonic: issuerMnemonic, document: issuerDid } = await createDid(
    authorIdentity
  )
  const issuerKeys = generateKeypairs(issuerMnemonic)
  console.log(
    `🏛   Issuer (${issuerDid?.assertionMethod![0].type}): ${issuerDid.uri}`
  )

  // Create Delegate One DID
  const { mnemonic: delegateOneMnemonic, document: delegateOneDid } =
    await createDid(authorIdentity)

  const delegateOneKeys = generateKeypairs(delegateOneMnemonic)

  console.log(
    `🏛   Delegate (${delegateOneDid?.assertionMethod![0].type}): ${
      delegateOneDid.uri
    }`
  )

  console.log('✅  Identities created!')

  // Seller Entities
  console.log(`\n❄️   Demo Seller Entities\n`)
  const sellerIdentity1 = Crypto.makeKeypairFromUri('//Entity1', 'sr25519')
  console.log(
    `🏛   Seller Entity 1 (${sellerIdentity1.type}): ${sellerIdentity1.address}`
  )

  const sellerIdentity2 = Crypto.makeKeypairFromUri('//Entity2', 'sr25519')
  console.log(
    `🏛   Seller Entity 2 (${sellerIdentity2.type}): ${sellerIdentity2.address}`
  )

  const sellerIdentity3 = Crypto.makeKeypairFromUri('//Entity3', 'sr25519')
  console.log(
    `🏛   Seller Entity 3 (${sellerIdentity3.type}): ${sellerIdentity3.address}`
  )

  const sellerIdentity4 = Crypto.makeKeypairFromUri('//Entity4', 'sr25519')
  console.log(
    `🏛   Seller Entity 4 (${sellerIdentity4.type}): ${sellerIdentity4.address}`
  )

  console.log(`\n❄️   Demo Collector Entity\n`)
  const collectorIdentity = Crypto.makeKeypairFromUri('//BuyerApp', 'sr25519')
  console.log(
    `🧑🏻‍💼  Score Collector (${collectorIdentity.type}): ${collectorIdentity.address}`
  )

  console.log('\n✅  Entities created!')

  console.log(`\n❄️  Registry Creation \n`)

  const registryTitle = `Registry v3.${randomUUID().substring(0, 4)}`
  const registryDetails: Cord.IContents = {
    title: registryTitle,
    description: 'Registry for for scoring',
  }

  const registryType: Cord.IRegistryType = {
    details: registryDetails,
    creator: issuerDid.uri,
  }

  const txRegistry: Cord.IRegistry =
    Cord.Registry.fromRegistryProperties(registryType)

  let registry
  try {
    await Cord.Registry.verifyStored(txRegistry)
    console.log('Registry already stored. Skipping creation')
  } catch {
    console.log('Regisrty not present. Creating it now...')
    // Authorize the tx.
    const tx = api.tx.registry.create(txRegistry.details, null)
    const extrinsic = await Cord.Did.authorizeTx(
      issuerDid.uri,
      tx,
      async ({ data }) => ({
        signature: issuerKeys.assertionMethod.sign(data),
        keyType: issuerKeys.assertionMethod.type,
      }),
      authorIdentity.address
    )
    console.log('\n', txRegistry)
    // Write to chain then return the Schema.
    await Cord.Chain.signAndSubmitTx(extrinsic, authorIdentity)
    registry = txRegistry
  }
  console.log('\n✅ Registry created!')

  // Step 4: Add Delelegate One as Registry Admin
  console.log(`\n❄️  Registry Admin Delegate Authorization \n`)
  const registryAuthority = await addRegistryAdminDelegate(
    authorIdentity,
    issuerDid.uri,
    registry['identifier'],
    delegateOneDid.uri,
    async ({ data }) => ({
      signature: issuerKeys.capabilityDelegation.sign(data),
      keyType: issuerKeys.capabilityDelegation.type,
    })
  )
  console.log(`\n✅ Registry Authorization - ${registryAuthority} - created!`)

  console.log(`\n❄️  Journal Entries \n`)

  let journalEntryArray: Array<IJournalContent> = []
  let journalContent_1: IJournalContent = {
    collector: collectorIdentity.address,
    entity: sellerIdentity1.address,
    tid: UUID.generatev4().toString(),
    entry_type: RatingEntry.credit,
    count: 5,
    rating: 12.116,
    rating_type: RatingType.overall,
  }
  journalEntryArray.push(journalContent_1)

  let journalContent_2: IJournalContent = {
    collector: collectorIdentity.address,
    entity: sellerIdentity2.address,
    tid: UUID.generatev4().toString(),
    entry_type: RatingEntry.debit,
    count: 15,
    rating: 60,
    rating_type: RatingType.overall,
  }
  journalEntryArray.push(journalContent_2)

  let journalContent_3: IJournalContent = {
    collector: collectorIdentity.address,
    entity: sellerIdentity3.address,
    tid: UUID.generatev4().toString(),
    entry_type: RatingEntry.credit,
    count: 46,
    rating: 144.8,
    rating_type: RatingType.delivery,
  }
  journalEntryArray.push(journalContent_3)

  let journalContent_4: IJournalContent = {
    collector: collectorIdentity.address,
    entity: sellerIdentity4.address,
    tid: UUID.generatev4().toString(),
    entry_type: RatingEntry.debit,
    count: 96,
    rating: 117,
    rating_type: RatingType.delivery,
  }
  journalEntryArray.push(journalContent_4)

  console.dir(journalEntryArray, { depth: null, colors: true })
  console.log('\n✅ Journal Entry Array created!\n')

  console.log('♺ BAP Transforms the journal entries to required format\n')
  let transformedJournalEntryArray: Array<IJournalContent> = []
  for (let i: number = 0; i < journalEntryArray.length; i++) {
    transformedJournalEntryArray.push(
      Cord.Score.transformRatingEntry(journalEntryArray[i])
    )
  }

  console.log(
    '✍🏻 BAP signs the journal entry array as a packet and sends it to API\n'
  )
  const signature = Crypto.sign(
    JSON.stringify(transformedJournalEntryArray),
    delegateOneKeys.assertionMethod
  )

  console.log('\n👨🏻‍⚖️ API verfies the packet\n')
  Crypto.verify(
    JSON.stringify(transformedJournalEntryArray),
    signature,
    delegateOneKeys.assertionMethod.publicKey
  )
  console.log('\n✅ Packet verified!\n')

  console.log(
    '☎️  API utilizses the verified transformedJournalEntryArray \n to preparing rating input and anchors it to the chain'
  )

  for (let j: number = 0; j < transformedJournalEntryArray.length; j++) {
    try {
      let outputFromScore = await Cord.Score.fromRatingEntry(
        transformedJournalEntryArray[j],
        authorIdentity.address
      )
      let extrensic = await Cord.Score.toChain(
        outputFromScore,
        registryAuthority
      )
      const authorizedStreamTx = await Cord.Did.authorizeTx(
        delegateOneDid.uri,
        extrensic,
        async ({ data }: any) => ({
          signature: delegateOneKeys.assertionMethod.sign(data),
          keyType: delegateOneKeys.assertionMethod.type,
        }),
        authorIdentity.address
      )
      await Cord.Chain.signAndSubmitTx(authorizedStreamTx, authorIdentity)
      console.log(
        `\n✅ Rating ${j + 1} has been achored to the blockchain\n`,
        outputFromScore.identifier
      )
    } catch (error) {
      console.log(error.message)
    }
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
