import * as Cord from '@cord.network/sdk'
import { createDidName } from './utils/generateDidName'
import { getDidDocFromName } from './utils/queryDidName'
import { randomUUID } from 'crypto'
import { addNetworkMember } from './utils/createAuthorities'
import { createAccount } from './utils/createAccount'

import BN from 'bn.js';

async function main() {
  const networkAddress = process.env.NETWORK_ADDRESS
    ? process.env.NETWORK_ADDRESS
    : 'ws://127.0.0.1:9944'

  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK })
  await Cord.connect(networkAddress)

  const api = Cord.ConfigService.get('api');

  // Retrieve the runtime version & the type of the runtime.
  const runtimeVersion = api.runtimeVersion;
  
  const runtimeType = runtimeVersion.specName.toString();

  console.log("\n❄️ Connected to CORD runtime type:", runtimeType);

  // Step 1: Setup Membership
  // Setup transaction author account - CORD Account.
  console.log(`\n❄️  New Network Member`)
  const authorityAuthorIdentity = Cord.Utils.Crypto.makeKeypairFromUri(
    process.env.ANCHOR_URI ? process.env.ANCHOR_URI : '//Alice',
    'sr25519'
  )
  // Setup network authority account.
  const { account: authorityIdentity } = await createAccount()
  console.log(
    `🏦  Member (${authorityIdentity.type}): ${authorityIdentity.address}`
  )
  await addNetworkMember(authorityAuthorIdentity, authorityIdentity.address)
  console.log('✅ Network Authority created!\n')

  // Setup network member account for author.
  const { account: authorIdentity } = await createAccount()
  console.log(`🏦  Author Member (${authorIdentity.type}): ${authorIdentity.address}`)
  await addNetworkMember(authorityAuthorIdentity, authorIdentity.address)
  console.log('✅ Network Member added!\n')

  // Transfer funds for author identity.
  let author_id_tx = await api.tx.balances.transferAllowDeath(authorIdentity.address, new BN('1000000000000000'));
  await Cord.Chain.signAndSubmitTx(author_id_tx, authorityAuthorIdentity);

  // Setup network member account for holder.
  const { account: holderIdentity } = await createAccount()
  console.log(`🏦  Holder Member (${holderIdentity.type}): ${holderIdentity.address}`)
  await addNetworkMember(authorityAuthorIdentity, holderIdentity.address)
  console.log('✅ Network Member added!\n')

  // Transfer funds for holder identity.
  let holder_id_tx = await api.tx.balances.transferAllowDeath(holderIdentity.address, new BN('1000000000000000'));
  await Cord.Chain.signAndSubmitTx(holder_id_tx, authorityAuthorIdentity);

  // Setup network member account for verifier.
  const { account: verifierIdentity } = await createAccount()
  console.log(`🏦  Verifier Member (${verifierIdentity.type}): ${verifierIdentity.address}`)
  await addNetworkMember(authorityAuthorIdentity, verifierIdentity.address)
  console.log('✅ Network Member added!\n')

  // Transfer funds for verifier identity.
  let verifier_id_tx = await api.tx.balances.transferAllowDeath(verifierIdentity.address, new BN('1000000000000000'));
  await Cord.Chain.signAndSubmitTx(verifier_id_tx, authorityAuthorIdentity);

  // Setup network member account for delegate 1.
  const { account: delegate_1_Identity } = await createAccount()
  console.log(`🏦  Delegate 1 Member (${delegate_1_Identity.type}): ${delegate_1_Identity.address}`)
  await addNetworkMember(authorityAuthorIdentity, delegate_1_Identity.address)
  console.log('✅ Network Member added!\n')

  // Transfer funds for delegate 1 identity.
  let delegate_1_tx = await api.tx.balances.transferAllowDeath(delegate_1_Identity.address, new BN('1000000000000000'));
  await Cord.Chain.signAndSubmitTx(delegate_1_tx, authorityAuthorIdentity);

  // Setup network member account for delegate 2.
  const { account: delegate_2_Identity } = await createAccount()
  console.log(`🏦  Delegate 2 Member (${delegate_2_Identity.type}): ${delegate_2_Identity.address}`)
  await addNetworkMember(authorityAuthorIdentity, delegate_2_Identity.address)
  console.log('✅ Network Member added!\n')

  // Transfer funds for delegate 1 identity.
  let delegate_2_tx = await api.tx.balances.transferAllowDeath(delegate_2_Identity.address, new BN('1000000000000000'));
  await Cord.Chain.signAndSubmitTx(delegate_2_tx, authorityAuthorIdentity);

  // Step 2: Setup Identities
  console.log(`\n❄️  Demo Identities (KeyRing)`)

  /* Creating the DIDs for the different parties involved in the demo. */
  // Create Verifier DID
  const { mnemonic: verifierMnemonic, document: verifierDid } =
    await Cord.Did.createDid(authorIdentity)
  const verifierKeys = Cord.Utils.Keys.generateKeypairs(
    verifierMnemonic,
    'sr25519'
  )
  console.log(
    `🏢  Verifier (${verifierDid.assertionMethod![0].type}): ${verifierDid.uri}`
  )
  // Create Holder DID
  const { mnemonic: holderMnemonic, document: holderDid } =
    await Cord.Did.createDid(authorIdentity)
  const holderKeys = Cord.Utils.Keys.generateKeypairs(holderMnemonic, 'sr25519')
  console.log(
    `👩‍⚕️  Holder (${holderDid.assertionMethod![0].type}): ${holderDid.uri}`
  )
  // Create issuer DID
  const { mnemonic: issuerMnemonic, document: issuerDid } =
    await Cord.Did.createDid(authorIdentity)
  const issuerKeys = Cord.Utils.Keys.generateKeypairs(issuerMnemonic, 'sr25519')
  console.log(
    `🏛   Issuer (${issuerDid?.assertionMethod![0].type}): ${issuerDid.uri}`
  )
  const conformingDidDocument = Cord.Did.exportToDidDocument(
    issuerDid,
    'application/json'
  )
  console.dir(conformingDidDocument, {
    depth: null,
    colors: true,
  })
  // Create Delegate One DID
  const { mnemonic: delegateOneMnemonic, document: delegateOneDid } =
    await Cord.Did.createDid(authorIdentity)
  const delegateOneKeys = Cord.Utils.Keys.generateKeypairs(
    delegateOneMnemonic,
    'sr25519'
  )
  console.log(
    `🏛   Delegate (${delegateOneDid?.assertionMethod![0].type}): ${
      delegateOneDid.uri
    }`
  )
  // Create Delegate Two DID
  const { mnemonic: delegateTwoMnemonic, document: delegateTwoDid } =
    await Cord.Did.createDid(authorIdentity)
  const delegateTwoKeys = Cord.Utils.Keys.generateKeypairs(
    delegateTwoMnemonic,
    'sr25519'
  )
  console.log(
    `🏛   Delegate (${delegateTwoDid?.assertionMethod![0].type}): ${
      delegateTwoDid.uri
    }`
  )
  // Create Delegate 3 DID
  const { mnemonic: delegate3Mnemonic, document: delegate3Did } =
    await Cord.Did.createDid(authorIdentity)
  const delegate3Keys = Cord.Utils.Keys.generateKeypairs(
    delegate3Mnemonic,
    'sr25519'
  )
  console.log(
    `🏛   Delegate (${delegate3Did?.assertionMethod![0].type}): ${
      delegate3Did.uri
    }`
  )
  console.log('✅ Identities created!')

  // Step 2: Create a DID name for Issuer
  console.log(`\n❄️  DID name Creation `)
  const randomDidName = `solar.sailer.${randomUUID().substring(0, 4)}@cord`

  await createDidName(
    issuerDid.uri,
    authorIdentity,
    randomDidName,
    async ({ data }) => ({
      signature: issuerKeys.authentication.sign(data),
      keyType: issuerKeys.authentication.type,
    })
  )
  console.log(`✅ DID name - ${randomDidName} - created!`)
  await getDidDocFromName(randomDidName)

  // Step 3: Create a new Chain Space
  console.log(`\n❄️  Chain Space Creation `)
  const spaceProperties = await Cord.ChainSpace.buildFromProperties(
    authorIdentity.address,
  )
  console.dir(spaceProperties, {
    depth: null,
    colors: true,
  })

  console.log(`\n❄️  Chain Space Properties `)
  const space = await Cord.ChainSpace.dispatchToChain(
    spaceProperties,
    authorIdentity,
  )
  console.dir(space, {
    depth: null,
    colors: true,
  })
  console.log('✅ Chain Space created!')

  console.log(`\n❄️  Chain Space Approval `)
  await Cord.ChainSpace.sudoApproveChainSpace(
    authorityAuthorIdentity,
    space.uri,
    1000
  )
  console.log(`✅  Chain Space Approved`)

  /* Disable subspace for permissionless chain */
  if (runtimeType != "weave") {
    // Step 3.5: Subspace
    const subSpaceProperties = await Cord.ChainSpace.buildFromProperties(
      authorIdentity.address
    )
    console.dir(subSpaceProperties, {
      depth: null,
      colors: true,
    })
    const subSpace = await Cord.ChainSpace.dispatchSubspaceCreateToChain(
      subSpaceProperties,
      authorIdentity,
      200,
      space.uri,
    )
    console.dir(subSpace, {
      depth: null,
      colors: true,
    })
    console.log(`\n❄️  SubSpace is created`)

    const subSpaceTx = await Cord.ChainSpace.dispatchUpdateTxCapacityToChain(
      subSpace.uri,
      authorIdentity,
      300,
    )
    console.log(`\n❄️  SubSpace limit is updated`)
  }

  // Step 4: Add Delelegate Two as Registry Delegate
  console.log(`\n❄️  Space Delegate Authorization `)
  const permission: Cord.PermissionType = Cord.Permission.ASSERT
  const spaceAuthProperties =
    await Cord.ChainSpace.buildFromAuthorizationProperties(
      space.uri,
      delegate_1_Identity.address,
      permission,
      authorIdentity.address
    )
  console.dir(spaceAuthProperties, {
    depth: null,
    colors: true,
  })
  console.log(`\n❄️  Space Delegation To Chain `)
  const delegateAuth = await Cord.ChainSpace.dispatchDelegateAuthorization(
    spaceAuthProperties,
    authorIdentity,
    space.authorization,
  )
  console.dir(delegateAuth, {
    depth: null,
    colors: true,
  })
  console.log(`✅ Space Authorization - ${delegateAuth} - added!`)

  console.log(`\n❄️  Query From Chain - Chain Space Details `)
  const spaceFromChain = await Cord.ChainSpace.fetchFromChain(space.uri)
  console.dir(spaceFromChain, {
    depth: null,
    colors: true,
  })

  console.log(`\n❄️  Query From Chain - Chain Space Authorization Details `)
  const spaceAuthFromChain = await Cord.ChainSpace.fetchAuthorizationFromChain(
    delegateAuth as Cord.AuthorizationUri
  )
  console.dir(spaceAuthFromChain, {
    depth: null,
    colors: true,
  })
  console.log(`✅ Chain Space Functions Completed!`)

  // Step 5: Create a new Schema
  console.log(`\n❄️  Schema Creation `)
  let newSchemaContent = require('../res/schema.json')
  let newSchemaName = newSchemaContent.title + ':' + Cord.Utils.UUID.generate()
  newSchemaContent.title = newSchemaName

  let schemaProperties = Cord.Schema.buildFromProperties(
    newSchemaContent,
    space.uri,
  )
  console.dir(schemaProperties, {
    depth: null,
    colors: true,
  })
  const schemaUri = await Cord.Schema.dispatchToChain(
    schemaProperties.schema,
    authorIdentity,
  )
  console.log(`✅ Schema - ${schemaUri} - added!`)

  console.log(`\n❄️  Query From Chain - Schema `)
  const schemaFromChain = await Cord.Schema.fetchFromChain(
    schemaProperties.schema.$id
  )
  console.dir(schemaFromChain, {
    depth: null,
    colors: true,
  })
  console.log('✅ Schema Functions Completed!')

// TODO: Fix below after packages/statement is complete

//   // Step 4: Delegate creates a new Verifiable Document
//   console.log(`\n❄️  Statement Creation `)

//   let newCredContent = require('../res/cred.json')
//   newCredContent.issuanceDate = new Date().toISOString()
//   const serializedCred = Cord.Utils.Crypto.encodeObjectAsStr(newCredContent)
//   const credHash = Cord.Utils.Crypto.hashStr(serializedCred)

//   console.dir(newCredContent, {
//     depth: null,
//     colors: true,
//   })

//   const statementEntry = Cord.StatementDid.buildFromProperties(
//     credHash,
//     space.uri,
//     issuerDid.uri,
//     schemaUri as Cord.SchemaUri
//   )
//   console.dir(statementEntry, {
//     depth: null,
//     colors: true,
//   })

//   const statement = await Cord.StatementDid.dispatchRegisterToChain(
//     statementEntry,
//     issuerDid.uri,
//     authorIdentity,
//     space.authorization,
//     async ({ data }) => ({
//       signature: issuerKeys.authentication.sign(data),
//       keyType: issuerKeys.authentication.type,
//     })
//   )

//   console.log(`✅ Statement element registered - ${statement}`)

//   console.log(`\n❄️  Statement Updation `)
//   let updateCredContent = newCredContent
//   updateCredContent.issuanceDate = new Date().toISOString()
//   updateCredContent.name = 'Bachelor of Science'
//   const serializedUpCred =
//     Cord.Utils.Crypto.encodeObjectAsStr(updateCredContent)
//   const upCredHash = Cord.Utils.Crypto.hashStr(serializedUpCred)

//   const updatedStatementEntry = Cord.StatementDid.buildFromUpdateProperties(
//     statementEntry.elementUri,
//     upCredHash,
//     space.uri,
//     delegateTwoDid.uri
//   )
//   console.dir(updatedStatementEntry, {
//     depth: null,
//     colors: true,
//   })

//   const updatedStatement = await Cord.StatementDid.dispatchUpdateToChain(
//     updatedStatementEntry,
//     delegateTwoDid.uri,
//     authorIdentity,
//     delegateAuth as Cord.AuthorizationUri,
//     async ({ data }) => ({
//       signature: delegateTwoKeys.authentication.sign(data),
//       keyType: delegateTwoKeys.authentication.type,
//     })
//   )
//   console.log(`✅ Statement element registered - ${updatedStatement}`)

//   console.log(`\n❄️  Statement verification `)
//   const verificationResult = await Cord.StatementDid.verifyAgainstProperties(
//     statementEntry.elementUri,
//     credHash,
//     issuerDid.uri,
//     space.uri,
//     schemaUri as Cord.SchemaUri
//   )

//   if (verificationResult.isValid) {
//     console.log(`✅ Verification successful! "${statementEntry.elementUri}" 🎉`)
//   } else {
//     console.log(`🚫 Verification failed! - "${verificationResult.message}" 🚫`)
//   }

//   const anotherVerificationResult =
//     await Cord.StatementDid.verifyAgainstProperties(
//       updatedStatementEntry.elementUri,
//       upCredHash,
//       delegateTwoDid.uri,
//       space.uri
//     )

//   if (anotherVerificationResult.isValid) {
//     console.log(
//       `\n✅ Verification successful! "${updatedStatementEntry.elementUri}" 🎉`
//     )
//   } else {
//     console.log(
//       `\n🚫 Verification failed! - "${verificationResult.message}" 🚫`
//     )
//   }

//   console.log(`\n❄️  Revoke Statement - ${updatedStatementEntry.elementUri}`)
//   await Cord.StatementDid.dispatchRevokeToChain(
//     updatedStatementEntry.elementUri,
//     delegateTwoDid.uri,
//     authorIdentity,
//     delegateAuth as Cord.AuthorizationUri,
//     async ({ data }) => ({
//       signature: delegateTwoKeys.authentication.sign(data),
//       keyType: delegateTwoKeys.authentication.type,
//     })
//   )
//   console.log(`✅ Statement revoked!`)

//   console.log(`\n❄️  Statement Re-verification `)
//   const reVerificationResult = await Cord.StatementDid.verifyAgainstProperties(
//     updatedStatementEntry.elementUri,
//     upCredHash,
//     issuerDid.uri,
//     space.uri
//   )

//   if (reVerificationResult.isValid) {
//     console.log(
//       `✅ Verification successful! "${updatedStatementEntry.elementUri}" 🎉`
//     )
//   } else {
//     console.log(
//       `🚫 Verification failed! - "${reVerificationResult.message}" 🚫`
//     )
//   }

//   console.log(`\n❄️  Restore Statement - ${updatedStatementEntry.elementUri}`)
//   await Cord.StatementDid.dispatchRestoreToChain(
//     updatedStatementEntry.elementUri,
//     delegateTwoDid.uri,
//     authorIdentity,
//     delegateAuth as Cord.AuthorizationUri,
//     async ({ data }) => ({
//       signature: delegateTwoKeys.authentication.sign(data),
//       keyType: delegateTwoKeys.authentication.type,
//     })
//   )
//   console.log(`✅ Statement restored!`)

//   console.log(`\n❄️  Statement Re-verification `)
//   const reReVerificationResult = await Cord.StatementDid.verifyAgainstProperties(
//     updatedStatementEntry.elementUri,
//     upCredHash,
//     delegateTwoDid.uri,
//     space.uri
//   )

//   if (reReVerificationResult.isValid) {
//     console.log(
//       `✅ Verification successful! "${updatedStatementEntry.elementUri}" 🎉`
//     )
//   } else {
//     console.log(
//       `🚫 Verification failed! - "${reReVerificationResult.message}" 🚫`
//     )
//   }
}
main()
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(Cord.disconnect)

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})
