import * as Cord from '@cord.network/sdk'
// import { UUID, Crypto } from '@cord.network/utils'
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
  const networkAddress = process.env.NETWORK_ADDRESS
    ? process.env.NETWORK_ADDRESS
    : 'ws://127.0.0.1:9944'
  //  const networkAddress = 'ws://127.0.0.1:9944'
  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK })
  let connName = "random";
  await Cord.connect(networkAddress, connName);
  const api = Cord.ConfigService.get(connName);

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
  await addNetworkMember(authorityAuthorIdentity, authorityIdentity.address, connName)
  await setRegistrar(authorityAuthorIdentity, authorityIdentity.address, connName)
  console.log('✅ Network Authority created!')

  // Setup network member account.
  const { account: authorIdentity } = await createAccount()
  console.log(`🏦  Member (${authorIdentity.type}): ${authorIdentity.address}`)
  await addNetworkMember(authorityAuthorIdentity, authorIdentity.address, connName)
  console.log(`🔏  Member permissions updated`)
  await setIdentity(authorIdentity, connName)
  console.log(`🔏  Member identity info updated`)
  await requestJudgement(authorIdentity, authorityIdentity.address, connName)
  console.log(`🔏  Member identity judgement requested`)
  await provideJudgement(authorityIdentity, authorIdentity.address, connName)
  console.log(`🔏  Member identity judgement provided`)
  console.log('✅ Network Member added!')

  // Step 2: Setup Identities
  console.log(`\n❄️  Demo Identities (KeyRing)`)

  /* Creating the DIDs for the different parties involved in the demo. */
  // Create Verifier DID
  const { mnemonic: verifierMnemonic, document: verifierDid } =
    await createDid(authorIdentity, connName)
  const verifierKeys = Cord.Utils.Keys.generateKeypairs(
    verifierMnemonic,
    'sr25519'
  )
  console.log(
    `🏢  Verifier (${verifierDid.assertionMethod![0].type}): ${verifierDid.uri}`
  )
  // Create Holder DID
  const { mnemonic: holderMnemonic, document: holderDid } =
    await createDid(authorIdentity, connName)
  const holderKeys = Cord.Utils.Keys.generateKeypairs(holderMnemonic, 'sr25519')
  console.log(
    `👩‍⚕️  Holder (${holderDid.assertionMethod![0].type}): ${holderDid.uri}`
  )
  // Create issuer DID
  const { mnemonic: issuerMnemonic, document: issuerDid } =
    await createDid(authorIdentity, connName)
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
    await createDid(authorIdentity, connName)
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
    await createDid(authorIdentity, connName)
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
    await createDid(authorIdentity, connName)
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
    }),
    connName
  )
  console.log(`✅ DID name - ${randomDidName} - created!`)
  await getDidDocFromName(randomDidName, connName)

  // Step 3: Create a new Chain Space
  console.log(`\n❄️  Chain Space Creation `)
  const spaceProperties = await Cord.ChainSpace.buildFromProperties(
    issuerDid.uri, {connName}
  )
  console.dir(spaceProperties, {
    depth: null,
    colors: true,
  })

  console.log(`\n❄️  Chain Space Properties `)
  const space = await Cord.ChainSpace.dispatchToChain(
    spaceProperties,
    issuerDid.uri,
    authorIdentity,
    async ({ data }) => ({
      signature: issuerKeys.authentication.sign(data),
      keyType: issuerKeys.authentication.type,
    }),
    connName
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
    1000,
    connName
  )
  console.log(`✅  Chain Space Approved`)

  // Step 3.5: Subspace
  const subSpaceProperties = await Cord.ChainSpace.buildFromProperties(
    issuerDid.uri, {connName}
  )
  console.dir(subSpaceProperties, {
    depth: null,
    colors: true,
  })
  const subSpace = await Cord.ChainSpace.dispatchSubspaceCreateToChain(
    subSpaceProperties,
    issuerDid.uri,
    authorIdentity,
    200,
    space.uri,
    async ({ data }) => ({
      signature: issuerKeys.authentication.sign(data),
      keyType: issuerKeys.authentication.type,
    }),
    connName
  )
  console.dir(subSpace, {
    depth: null,
    colors: true,
  })
  console.log(`\n❄️  SubSpace is created`)

  const subSpaceTx = await Cord.ChainSpace.dispatchUpdateTxCapacityToChain(
    subSpace.uri,
    issuerDid.uri,
    authorIdentity,
    300,
    async ({ data }) => ({
      signature: issuerKeys.authentication.sign(data),
      keyType: issuerKeys.authentication.type,
    }),
    connName
  )
  console.log(`\n❄️  SubSpace limit is updated`)

  // Step 4: Add Delelegate Two as Registry Delegate
  console.log(`\n❄️  Space Delegate Authorization `)
  const permission: Cord.PermissionType = Cord.Permission.ASSERT
  const spaceAuthProperties =
    await Cord.ChainSpace.buildFromAuthorizationProperties(
      space.uri,
      delegateTwoDid.uri,
      permission,
      issuerDid.uri,
      connName
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
    async ({ data }) => ({
      signature: issuerKeys.capabilityDelegation.sign(data),
      keyType: issuerKeys.capabilityDelegation.type,
    }),
    connName
  )
  console.dir(delegateAuth, {
    depth: null,
    colors: true,
  })
  console.log(`✅ Space Authorization - ${delegateAuth} - added!`)

  console.log(`\n❄️  Query From Chain - Chain Space Details `)
  const spaceFromChain = await Cord.ChainSpace.fetchFromChain(space.uri, connName)
  console.dir(spaceFromChain, {
    depth: null,
    colors: true,
  })

  console.log(`\n❄️  Query From Chain - Chain Space Authorization Details `)
  const spaceAuthFromChain = await Cord.ChainSpace.fetchAuthorizationFromChain(
    delegateAuth as Cord.AuthorizationUri,
    connName
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
    issuerDid.uri,
    connName
  )
  console.dir(schemaProperties, {
    depth: null,
    colors: true,
  })
  const schemaUri = await Cord.Schema.dispatchToChain(
    schemaProperties.schema,
    issuerDid.uri,
    authorIdentity,
    space.authorization,
    async ({ data }) => ({
      signature: issuerKeys.authentication.sign(data),
      keyType: issuerKeys.authentication.type,
    }),
    connName
  )
  console.log(`✅ Schema - ${schemaUri} - added!`)

  console.log(`\n❄️  Query From Chain - Schema `)
  const schemaFromChain = await Cord.Schema.fetchFromChain(
    schemaProperties.schema.$id, connName
  )
  console.dir(schemaFromChain, {
    depth: null,
    colors: true,
  })
  console.log('✅ Schema Functions Completed!')

  // Step 4: Delegate creates a new Verifiable Document
  console.log(`\n❄️  Statement Creation `)

  let newCredContent = require('../res/cred.json')
  newCredContent.issuanceDate = new Date().toISOString()
  const serializedCred = Cord.Utils.Crypto.encodeObjectAsStr(newCredContent)
  const credHash = Cord.Utils.Crypto.hashStr(serializedCred)

  console.dir(newCredContent, {
    depth: null,
    colors: true,
  })

  const statementEntry = Cord.Statement.buildFromProperties(
    credHash,
    space.uri,
    issuerDid.uri,
    schemaUri as Cord.SchemaUri,
    connName
  )
  console.dir(statementEntry, {
    depth: null,
    colors: true,
  })

  const statement = await Cord.Statement.dispatchRegisterToChain(
    statementEntry,
    issuerDid.uri,
    authorIdentity,
    space.authorization,
    async ({ data }) => ({
      signature: issuerKeys.authentication.sign(data),
      keyType: issuerKeys.authentication.type,
    }),
    connName
  )

  console.log(`✅ Statement element registered - ${statement}`)

  console.log(`\n❄️  Statement Updation `)
  let updateCredContent = newCredContent
  updateCredContent.issuanceDate = new Date().toISOString()
  updateCredContent.name = 'Bachelor of Science'
  const serializedUpCred =
    Cord.Utils.Crypto.encodeObjectAsStr(updateCredContent)
  const upCredHash = Cord.Utils.Crypto.hashStr(serializedUpCred)

  const updatedStatementEntry = Cord.Statement.buildFromUpdateProperties(
    statementEntry.elementUri,
    upCredHash,
    space.uri,
    delegateTwoDid.uri
  )
  console.dir(updatedStatementEntry, {
    depth: null,
    colors: true,
  })

  const updatedStatement = await Cord.Statement.dispatchUpdateToChain(
    updatedStatementEntry,
    delegateTwoDid.uri,
    authorIdentity,
    delegateAuth as Cord.AuthorizationUri,
    async ({ data }) => ({
      signature: delegateTwoKeys.authentication.sign(data),
      keyType: delegateTwoKeys.authentication.type,
    }),
    connName
  )
  console.log(`✅ Statement element registered - ${updatedStatement}`)

  console.log(`\n❄️  Statement verification `)
  const verificationResult = await Cord.Statement.verifyAgainstProperties(
    statementEntry.elementUri,
    credHash,
    {
      creator: issuerDid.uri,
      spaceuri: space.uri,
      schemaUri: schemaUri as Cord.SchemaUri,
      connName
    }
  )

  if (verificationResult.isValid) {
    console.log(`✅ Verification successful! "${statementEntry.elementUri}" 🎉`)
  } else {
    console.log(`🚫 Verification failed! - "${verificationResult.message}" 🚫`)
  }

  const anotherVerificationResult =
    await Cord.Statement.verifyAgainstProperties(
      updatedStatementEntry.elementUri,
      upCredHash,
      {
        creator: delegateTwoDid.uri,
        spaceuri: space.uri,
        connName
      }
    )

  if (anotherVerificationResult.isValid) {
    console.log(
      `\n✅ Verification successful! "${updatedStatementEntry.elementUri}" 🎉`
    )
  } else {
    console.log(
      `\n🚫 Verification failed! - "${verificationResult.message}" 🚫`
    )
  }

  console.log(`\n❄️  Revoke Statement - ${updatedStatementEntry.elementUri}`)
  await Cord.Statement.dispatchRevokeToChain(
    updatedStatementEntry.elementUri,
    delegateTwoDid.uri,
    authorIdentity,
    delegateAuth as Cord.AuthorizationUri,
    async ({ data }) => ({
      signature: delegateTwoKeys.authentication.sign(data),
      keyType: delegateTwoKeys.authentication.type,
    }),
    connName
  )
  console.log(`✅ Statement revoked!`)

  console.log(`\n❄️  Statement Re-verification `)
  const reVerificationResult = await Cord.Statement.verifyAgainstProperties(
    updatedStatementEntry.elementUri,
    upCredHash,
    { 
      creator: issuerDid.uri,
      spaceuri: space.uri,
      connName
    }
  )

  if (reVerificationResult.isValid) {
    console.log(
      `✅ Verification successful! "${updatedStatementEntry.elementUri}" 🎉`
    )
  } else {
    console.log(
      `🚫 Verification failed! - "${reVerificationResult.message}" 🚫`
    )
  }

  console.log(`\n❄️  Restore Statement - ${updatedStatementEntry.elementUri}`)
  await Cord.Statement.dispatchRestoreToChain(
    updatedStatementEntry.elementUri,
    delegateTwoDid.uri,
    authorIdentity,
    delegateAuth as Cord.AuthorizationUri,
    async ({ data }) => ({
      signature: delegateTwoKeys.authentication.sign(data),
      keyType: delegateTwoKeys.authentication.type,
    }),
    connName
  )
  console.log(`✅ Statement revoked!`)

  console.log(`\n❄️  Statement Re-verification `)
  const reReVerificationResult = await Cord.Statement.verifyAgainstProperties(
    updatedStatementEntry.elementUri,
    upCredHash,
    {
      creator: delegateTwoDid.uri,
      spaceuri: space.uri,
      connName
    }
  )

  if (reReVerificationResult.isValid) {
    console.log(
      `✅ Verification successful! "${updatedStatementEntry.elementUri}" 🎉`
    )
  } else {
    console.log(
      `🚫 Verification failed! - "${reReVerificationResult.message}" 🚫`
    )
  }
}
main()
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(async () => {
      let connName = "random";
      await Cord.disconnect(connName);
    });

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  let connName = "random";
  await Cord.disconnect(connName);
  process.exit(0)
})
