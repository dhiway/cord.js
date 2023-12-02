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

  console.log(`\n🌐  Particpants `)
  const { account: networkAuthorIdentity } = await createAccount(
    Cord.Utils.Crypto.mnemonicGenerate()
  )
  console.log(
    `🏦 Network Member (${devAuthorIdentity.type}): ${devAuthorIdentity.address}`
  )
  await addNetworkMember(devAuthorIdentity, networkAuthorIdentity.address)
  console.log('✅ Network Membership Approved! 🎉')

  const { mnemonic: chainSpaceAdminMnemonic, document: chainSpaceAdminDid } =
    await createDid(networkAuthorIdentity)
  const chainSpaceAdminKeys = generateKeypairs(chainSpaceAdminMnemonic)
  console.log(
    `🏛  Network Score Admin (${chainSpaceAdminDid.authentication[0].type}): ${chainSpaceAdminDid.uri}`
  )
  const {
    mnemonic: networkParticipantMnemonic,
    document: networkParticipantDid,
  } = await createDid(networkAuthorIdentity)
  const networkParticipantKeys = generateKeypairs(networkParticipantMnemonic)
  console.log(
    `🏛  Network Participant (Provider) (${networkParticipantDid.authentication[0].type}): ${networkParticipantDid.uri}`
  )

  const { mnemonic: networkProviderMnemonic, document: networkProviderDid } =
    await createDid(networkAuthorIdentity)
  const networkProviderKeys = generateKeypairs(networkProviderMnemonic)
  console.log(
    `🏦 Network Author (API -> Node) (${networkProviderDid.authentication[0].type}): ${networkProviderDid.uri}`
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
  console.log('✅ Chain Space created! ☃️')

  await Cord.ChainSpace.sudoApproveChainSpace(
    devAuthorIdentity,
    space.uri,
    1000
  )

  console.log(`\n🌐  Space Delegate Authorization `)
  const permission: Cord.PermissionType = Cord.Permission.ASSERT
  const spaceAuthProperties =
    await Cord.ChainSpace.buildFromAuthorizationProperties(
      space.uri,
      networkProviderDid.uri,
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
  console.log(`✅ Space Authorization added!`)

  console.log(`\n🌐  Query From Chain - Chain Space Details `)
  const spaceFromChain = await Cord.ChainSpace.fetchFromChain(space.uri)
  console.dir(spaceFromChain, {
    depth: null,
    colors: true,
  })

  console.log(`\n🌐  Query From Chain - Chain Space Authorization Details `)
  const spaceAuthFromChain = await Cord.ChainSpace.fetchAuthorizationFromChain(
    delegateAuth as Cord.AuthorizationUri
  )
  console.dir(spaceAuthFromChain, {
    depth: null,
    colors: true,
  })
  console.log(`✅ Initial Setup Completed!`)

  console.log(`\n🌐  Network Rating Transaction`)

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
    networkParticipantDid.uri,
    async ({ data }) => ({
      signature: networkParticipantKeys.assertionMethod.sign(data),
      keyType: networkParticipantKeys.assertionMethod.type,
      keyUri: `${networkParticipantDid.uri}${
        networkParticipantDid.assertionMethod![0].id
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
    networkProviderDid.uri
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
      signature: networkProviderKeys.authentication.sign(data),
      keyType: networkProviderKeys.authentication.type,
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

  // console.dir(ratingUri, {
  //   depth: null,
  //   colors: true,
  // })

  // let newCredContent = require('../res/cred.json')
  // newCredContent.issuanceDate = new Date().toISOString()
  // const serializedCred = Cord.Utils.Crypto.encodeObjectAsStr(newCredContent)
  // const credHash = Cord.Utils.Crypto.hashStr(serializedCred)

  // console.dir(newCredContent, {
  //   depth: null,
  //   colors: true,
  // })

  // const statementEntry = Cord.Statement.buildFromProperties(
  //   credHash,
  //   space.uri,
  //   issuerDid.uri,
  //   schemaUri as Cord.SchemaUri
  // )
  // console.dir(statementEntry, {
  //   depth: null,
  //   colors: true,
  // })

  // const statement = await Cord.Statement.dispatchRegisterToChain(
  //   statementEntry,
  //   issuerDid.uri,
  //   authorIdentity,
  //   space.authorization,
  //   async ({ data }) => ({
  //     signature: issuerKeys.authentication.sign(data),
  //     keyType: issuerKeys.authentication.type,
  //   })
  // )

  // console.log(`✅ Statement element registered - ${statement}`)

  // console.log(`\n❄️  Statement Updation `)
  // let updateCredContent = newCredContent
  // updateCredContent.issuanceDate = new Date().toISOString()
  // updateCredContent.name = 'Bachelor of Science'
  // const serializedUpCred =
  //   Cord.Utils.Crypto.encodeObjectAsStr(updateCredContent)
  // const upCredHash = Cord.Utils.Crypto.hashStr(serializedUpCred)

  // const updatedStatementEntry = Cord.Statement.buildFromUpdateProperties(
  //   statementEntry.elementUri,
  //   upCredHash,
  //   space.uri,
  //   delegateTwoDid.uri
  // )
  // console.dir(updatedStatementEntry, {
  //   depth: null,
  //   colors: true,
  // })

  // const updatedStatement = await Cord.Statement.dispatchUpdateToChain(
  //   updatedStatementEntry,
  //   delegateTwoDid.uri,
  //   authorIdentity,
  //   delegateAuth as Cord.AuthorizationUri,
  //   async ({ data }) => ({
  //     signature: delegateTwoKeys.authentication.sign(data),
  //     keyType: delegateTwoKeys.authentication.type,
  //   })
  // )
  // console.log(`✅ Statement element registered - ${updatedStatement}`)

  // console.log(`\n❄️  Statement verification `)
  // const verificationResult = await Cord.Statement.verifyAgainstProperties(
  //   statementEntry.elementUri,
  //   credHash,
  //   issuerDid.uri,
  //   space.uri,
  //   schemaUri as Cord.SchemaUri
  // )

  // if (verificationResult.isValid) {
  //   console.log(`✅ Verification successful! "${statementEntry.elementUri}" 🎉`)
  // } else {
  //   console.log(`🚫 Verification failed! - "${verificationResult.message}" 🚫`)
  // }

  // const anotherVerificationResult =
  //   await Cord.Statement.verifyAgainstProperties(
  //     updatedStatementEntry.elementUri,
  //     upCredHash,
  //     delegateTwoDid.uri,
  //     space.uri
  //   )

  // if (anotherVerificationResult.isValid) {
  //   console.log(
  //     `\n✅ Verification successful! "${updatedStatementEntry.elementUri}" 🎉`
  //   )
  // } else {
  //   console.log(
  //     `\n🚫 Verification failed! - "${verificationResult.message}" 🚫`
  //   )
  // }

  // console.log(`\n❄️  Revoke Statement - ${updatedStatementEntry.elementUri}`)
  // await Cord.Statement.dispatchRevokeToChain(
  //   updatedStatementEntry.elementUri,
  //   delegateTwoDid.uri,
  //   authorIdentity,
  //   delegateAuth as Cord.AuthorizationUri,
  //   async ({ data }) => ({
  //     signature: delegateTwoKeys.authentication.sign(data),
  //     keyType: delegateTwoKeys.authentication.type,
  //   })
  // )
  // console.log(`✅ Statement revoked!`)

  // console.log(`\n❄️  Statement Re-verification `)
  // const reVerificationResult = await Cord.Statement.verifyAgainstProperties(
  //   updatedStatementEntry.elementUri,
  //   upCredHash,
  //   issuerDid.uri,
  //   space.uri
  // )

  // if (reVerificationResult.isValid) {
  //   console.log(
  //     `✅ Verification successful! "${updatedStatementEntry.elementUri}" 🎉`
  //   )
  // } else {
  //   console.log(
  //     `🚫 Verification failed! - "${reVerificationResult.message}" 🚫`
  //   )
  // }

  // console.log(`\n❄️  Restore Statement - ${updatedStatementEntry.elementUri}`)
  // await Cord.Statement.dispatchRestoreToChain(
  //   updatedStatementEntry.elementUri,
  //   delegateTwoDid.uri,
  //   authorIdentity,
  //   delegateAuth as Cord.AuthorizationUri,
  //   async ({ data }) => ({
  //     signature: delegateTwoKeys.authentication.sign(data),
  //     keyType: delegateTwoKeys.authentication.type,
  //   })
  // )
  // console.log(`✅ Statement revoked!`)

  // console.log(`\n❄️  Statement Re-verification `)
  // const reReVerificationResult = await Cord.Statement.verifyAgainstProperties(
  //   updatedStatementEntry.elementUri,
  //   upCredHash,
  //   delegateTwoDid.uri,
  //   space.uri
  // )

  // if (reReVerificationResult.isValid) {
  //   console.log(
  //     `✅ Verification successful! "${updatedStatementEntry.elementUri}" 🎉`
  //   )
  // } else {
  //   console.log(
  //     `🚫 Verification failed! - "${reReVerificationResult.message}" 🚫`
  //   )
  // }
}
main()
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(Cord.disconnect)

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})
