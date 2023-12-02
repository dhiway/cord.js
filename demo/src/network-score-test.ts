import * as Cord from '@cord.network/sdk'
import { generateKeypairs } from './utils/generateKeypairs'
import { createDid } from './utils/generateDid'
import { createDidName } from './utils/generateDidName'
import { getDidDocFromName } from './utils/queryDidName'
import { randomUUID } from 'crypto'
import { addNetworkMember } from './utils/createAuthorities'
import { createAccount } from './utils/createAccount'

import {
  requestJudgement,
  setIdentity,
  setRegistrar,
  provideJudgement,
} from './utils/createRegistrar'

function getChallenge(): string {
  return Cord.Utils.UUID.generate()
}

async function main() {
  const networkAddress = 'ws://127.0.0.1:9944'
  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK })
  await Cord.connect(networkAddress)
  const devAuthorIdentity = Cord.Utils.Crypto.makeKeypairFromUri(
    '//Alice',
    'sr25519'
  )
  console.log(`\n🌐 Network Score Initial Setup`)

  console.log(`\n🎎 Particpants `)
  const { account: networkAuthorIdentity } = await createAccount(
    Cord.Utils.Crypto.mnemonicGenerate()
  )
  console.log(
    `🏦 Network Member (${devAuthorIdentity.type}): ${devAuthorIdentity.address}`
  )
  await addNetworkMember(devAuthorIdentity, networkAuthorIdentity.address)
  console.log('✅ Network Membership Approved! 🎉\n')

  const { mnemonic: chainSpaceAdminMnemonic, document: chainSpaceAdminDid } =
    await createDid(networkAuthorIdentity)
  const chainSpaceAdminKeys = generateKeypairs(chainSpaceAdminMnemonic)
  console.log(
    `🏛  Network Score Admin (${chainSpaceAdminDid.authentication[0].type}): ${chainSpaceAdminDid.uri}`
  )
  const { mnemonic: networkProviderMnemonic, document: networkProviderDid } =
    await createDid(networkAuthorIdentity)
  const networkProviderKeys = generateKeypairs(networkProviderMnemonic)
  console.log(
    `🏛  Network Participant (Provider) (${networkProviderDid.authentication[0].type}): ${networkProviderDid.uri}`
  )

  const { mnemonic: networkAuthorMnemonic, document: networkAuthorDid } =
    await createDid(networkAuthorIdentity)
  const networkAuthorKeys = generateKeypairs(networkAuthorMnemonic)
  console.log(
    `🏦 Network Author (API -> Node) (${networkAuthorDid.authentication[0].type}): ${networkAuthorDid.uri}`
  )

  console.log('✅ Network Members created! 🎉')

  // uncomment to enable DID name creation
  // console.log(`\n❄️  Network Participant DID name Creation `)
  // const randomDidName = `solar.sailer.${randomUUID().substring(0, 4)}@cord`

  // await createDidName(
  //   networkParticipantDid.uri,
  //   networkAuthorIdentity,
  //   randomDidName,
  //   async ({ data }) => ({
  //     signature: networkParticipantKeys.authentication.sign(data),
  //     keyType: networkParticipantKeys.authentication.type,
  //   })
  // )
  // console.log(`✅ Network Participant DID name - ${randomDidName} - created!`)
  // await getDidDocFromName(randomDidName)

  console.log(`\n🌐  Network Score Chain Space Creation `)
  const spaceProperties = await Cord.ChainSpace.buildFromProperties(
    chainSpaceAdminDid.uri
  )
  console.dir(spaceProperties, {
    depth: null,
    colors: true,
  })

  const space = await Cord.ChainSpace.dispatchToChain(
    spaceProperties,
    chainSpaceAdminDid.uri,
    networkAuthorIdentity,
    async ({ data }) => ({
      signature: chainSpaceAdminKeys.authentication.sign(data),
      keyType: chainSpaceAdminKeys.authentication.type,
    })
  )
  console.log('✅ Chain Space created! 🎉')

  await Cord.ChainSpace.sudoApproveChainSpace(
    devAuthorIdentity,
    space.uri,
    1000
  )

  console.log(`\n🌐  Chain Space Authorization (Author) `)
  const permission: Cord.PermissionType = Cord.Permission.ASSERT
  const spaceAuthProperties =
    await Cord.ChainSpace.buildFromAuthorizationProperties(
      space.uri,
      networkAuthorDid.uri,
      permission,
      chainSpaceAdminDid.uri
    )
  console.dir(spaceAuthProperties, {
    depth: null,
    colors: true,
  })

  const delegateAuth = await Cord.ChainSpace.dispatchDelegateAuthorization(
    spaceAuthProperties,
    networkAuthorIdentity,
    space.authorization,
    async ({ data }) => ({
      signature: chainSpaceAdminKeys.capabilityDelegation.sign(data),
      keyType: chainSpaceAdminKeys.capabilityDelegation.type,
    })
  )
  console.log(`✅ Chain Space Authorization Approved! 🎉`)

  console.log(`\n🌐  Query From Chain - Chain Space `)
  const spaceFromChain = await Cord.ChainSpace.fetchFromChain(space.uri)
  console.dir(spaceFromChain, {
    depth: null,
    colors: true,
  })

  console.log(`\n🌐  Query From Chain - Chain Space Authorization `)
  const spaceAuthFromChain = await Cord.ChainSpace.fetchAuthorizationFromChain(
    delegateAuth as Cord.AuthorizationUri
  )
  console.dir(spaceAuthFromChain, {
    depth: null,
    colors: true,
  })
  console.log(`✅ Initial Setup Completed! 🎊`)

  console.log(`\n⏳ Network Rating Transaction Flow`)

  console.log(
    `\n❄️  Rating Captured by Network Participants (Market Place / Providers) `
  )
  let ratingContent: Cord.IRatingContent = {
    entityUid: Cord.Utils.UUID.generate(),
    entityId: 'Gupta Kirana Store',
    providerUid: Cord.Utils.UUID.generate(),
    providerId: 'GoFrugal',
    entityType: Cord.EntityTypeOf.retail,
    ratingType: Cord.RatingTypeOf.overall,
    countOfTxn: 100,
    totalRating: 320,
  }

  console.dir(ratingContent, {
    depth: null,
    colors: true,
  })

  let transformedEntry = await Cord.Score.buildFromContentProperties(
    ratingContent,
    networkProviderDid.uri,
    async ({ data }) => ({
      signature: networkProviderKeys.assertionMethod.sign(data),
      keyType: networkProviderKeys.assertionMethod.type,
      keyUri: `${networkProviderDid.uri}${
        networkProviderDid.assertionMethod![0].id
      }`,
    })
  )
  console.log(`\n❄️  Rating Information to API endpoint (/write-ratings) `)
  console.dir(transformedEntry, {
    depth: null,
    colors: true,
  })

  let dispatchEntry = await Cord.Score.buildFromRatingProperties(
    transformedEntry,
    space.uri,
    networkAuthorDid.uri,
    async ({ data }) => ({
      signature: networkAuthorKeys.assertionMethod.sign(data),
      keyType: networkAuthorKeys.assertionMethod.type,
      keyUri: `${networkAuthorDid.uri}${
        networkAuthorDid.assertionMethod![0].id
      }`,
    })
  )

  console.log(`\n❄️  Rating Information to Ledger (API -> Ledger) `)
  console.dir(dispatchEntry, {
    depth: null,
    colors: true,
  })

  let ratingUri = await Cord.Score.dispatchRatingToChain(
    dispatchEntry.details,
    networkAuthorIdentity,
    delegateAuth as Cord.AuthorizationUri,
    async ({ data }) => ({
      signature: networkAuthorKeys.authentication.sign(data),
      keyType: networkAuthorKeys.authentication.type,
    })
  )

  if (Cord.Identifier.isValidIdentifier(ratingUri)) {
    console.log('✅ Rating addition successful! 🎉')
  } else {
    console.log(`🚫 Ledger Anchoring failed! " 🚫`)
  }

  console.log(`\n🌐  Query From Chain - Chain Space Usage `)
  const spaceUsageFromChain = await Cord.ChainSpace.fetchFromChain(space.uri)
  console.dir(spaceUsageFromChain, {
    depth: null,
    colors: true,
  })
}
main()
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(Cord.disconnect)

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})
