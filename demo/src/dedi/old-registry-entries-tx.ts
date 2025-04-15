import * as Cord from '@cord.network/sdk'
import { createAccount } from '../utils/createAccount'

import {
  BN
} from 'bn.js';

async function getBalance(address: string, api) {
  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK })

  const { data: balance } = await api.query.system.account(address);
  return balance.free.toString(); // Returns free balance as a string
}

async function main() {
  const networkAddress = process.env.NETWORK_ADDRESS
    ? process.env.NETWORK_ADDRESS
    : 'ws://127.0.0.1:9944'

  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK })
  await Cord.connect(networkAddress)

  const api = Cord.ConfigService.get('api');

  // Step 1: Setup Membership
  // Setup transaction author account - CORD Account.

  console.log(`\n❄️  New Network Member`)
  const authorityAuthorIdentity = Cord.Utils.Crypto.makeKeypairFromUri(
    process.env.ANCHOR_URI ? process.env.ANCHOR_URI : '//Alice',
    'sr25519'
  )

  // Setup network member account.
  const { account: authorIdentity } = await createAccount()
  console.log(`🏦  Member (${authorIdentity.type}): ${authorIdentity.address}`)

  let tx = await api.tx.balances.transferAllowDeath(authorIdentity.address, new BN('1000000000000000'));
  await Cord.Chain.signAndSubmitTx(tx, authorityAuthorIdentity);

  // Create a namespace
  console.log(`\n❄️  Namespace Creation `)

  const namespace_blob = {
    "name": "A Namespace of various company registries",
    "description": "A namespace that contains various company registries across different industries",
    "created_at": "2025-01-01",
  };

  const namespace_stringified_blob = JSON.stringify(namespace_blob);
  const namespace_digest = await Cord.Registries.getDigestFromRawData(namespace_stringified_blob);

  const namespaceDetails = await Cord.Namespace.namespaceCreateProperties(
    authorIdentity.address,
    namespace_digest,            
    namespace_blob,              
  );

  console.log(`\n❄️  Namespace Create Details `, namespaceDetails);

  const namespace = await Cord.Namespace.dispatchCreateToChain(
    namespaceDetails,
    authorIdentity,
  );
    
  console.log('\n✅ Namespace created!');

  // Create a Schema
  console.log(`\n❄️  Schema Creation `)
  let newSchemaContent = require('../../res/schema.json')
  let newSchemaName = newSchemaContent.title + ':' + Cord.Utils.UUID.generate()
  newSchemaContent.title = newSchemaName

  let schemaProperties = Cord.SchemaAccounts.buildFromProperties(
    newSchemaContent,
    authorIdentity.address,
  )
  console.dir(schemaProperties, {
    depth: null,
    colors: true,
  })
  const schemaUri = await Cord.SchemaAccounts.dispatchToChain(
    schemaProperties.schema,
    authorIdentity,
  )
  console.log(`✅ Schema - ${schemaUri} - added!`)

  console.log(`\n❄️  Query From Chain - Schema `)
  const schemaFromChain = await Cord.SchemaAccounts.fetchFromChain(
    schemaProperties.schema.$id
  )
  console.dir(schemaFromChain, {
    depth: null,
    colors: true,
  })
  console.log('✅ Schema Functions Completed!')

  // Create a Registry.
  const blob = {
    "name": "Companies Registry",
    "description": "A centralized registry that tracks the registration, incorporation status, and key business details of companies across various industries.",
    "metadata": {
      "category": "business",
      "totalCompaniesRegistered": 15000,
      "industriesCovered": [
        "Technology",
        "Healthcare",
        "Renewable Energy",
        "Finance",
        "Manufacturing"
      ],
      "lastUpdated": "01-10-2024",
      "regulatoryAuthority": "National Business Bureau",
      "registrationRequirements": {
        "documentsNeeded": [
          "Incorporation Certificate",
          "Tax Identification Number",
          "Proof of Address",
          "Board Resolution"
        ],
        "feeStructure": {
          "smallBusiness": "INR500",
          "mediumBusiness": "INR1000",
          "largeBusiness": "INR5000"
        }
      }
    }
  };
  const stringified_blob = JSON.stringify(blob);
  const digest = await Cord.Registries.getDigestFromRawData(stringified_blob);

  // Crreate a Registry Property.
  const registryDetails = await Cord.Registries.registryCreateProperties(
    authorIdentity.address,
    namespace.authorizationUri,
    digest,            //digest
    schemaUri,         //schemaUri
    blob,              //blob
  );

  console.log(`\n❄️  Registry Create Details `, registryDetails);
  
  // Dispatch the Registry Property to the chain.
  const registry = await Cord.Registries.dispatchCreateRegistryToChain(
    registryDetails,
    authorIdentity,
  );
    
  console.log('\n✅ Registry created!');

  // Create a Registry Entry.
  const entryBlob = {
    "name": "Tech Solutions Ltd.",
    "description": "A technology company providing software development and IT consulting services.",
    "metadata": {
      "category": "Technology",
      "registrationDate": "15-06-2022",
      "status": "Active",
      "registrationNumber": "TSL12345",
      "industry": "Technology",
      "regulatoryAuthority": "National Business Bureau",
      "documentsProvided": [
        "Incorporation Certificate",
        "Tax Identification Number",
        "Proof of Address",
        "Board Resolution"
      ],
      "feePaid": "INR500",
      "lastUpdated": "01-10-2024"
    }
  };
  const stringifiedEntryBlob = JSON.stringify(entryBlob);
  const entryDigest = await Cord.Registries.getDigestFromRawData(stringifiedEntryBlob);

  // Create a Registry Entry Properties.
  const registryEntryDetails = await Cord.Entries.createEntriesProperties(
    authorIdentity.address,
    registry.uri,                 //registryUri
    registry.authorizationUri,    //registryAuthUri
    entryDigest,                  //digest
    entryBlob,                    //blob
  );

  console.log(`\n❄️  Registry Entry Create Details `, registryEntryDetails);

  // Dispatch the Registry Entry to the chain.
  const registryEntry = await Cord.Entries.dispatchCreateEntryToChain(
    registryEntryDetails,
    authorIdentity,
  )

  console.log('\n✅ Registry Entry created!', registryEntry);

  // Update the Registry Entry
  const updateEntryBlob = {
    "name": "New Tech Solutions Ltd.",
    "description": "A technology company providing software development and IT consulting services.",
    "metadata": {
      "category": "Technology",
      "registrationDate": "15-06-2022",
      "status": "Active",
      "registrationNumber": "TSL12345",
      "industry": "Technology",
      "regulatoryAuthority": "National Business Bureau",
      "documentsProvided": [
        "Incorporation Certificate",
        "Tax Identification Number",
        "Proof of Address",
        "Board Resolution"
      ],
      "feePaid": "INR500",
      "lastUpdated": "01-10-2024"
    }
  };

  const updateStringifiedEntryBlob = JSON.stringify(updateEntryBlob);
  const updateEntryDigest = await Cord.Registries.getDigestFromRawData(updateStringifiedEntryBlob);

  // Create Update Entry Properties
  const registryEntryUpdateDetails = await Cord.Entries.updateEntriesProperties(
    registryEntry,
    authorIdentity.address,
    registry.uri,
    registry.authorizationUri,
    updateEntryDigest,               //digest
    updateEntryBlob,                 //blob
  );

  console.log(`\n❄️  Registry Entry Update Details `, registryEntryUpdateDetails);

  // Dispatch the Property to the chain
  const registryEntryUpdate = await Cord.Entries.dispatchUpdateEntryToChain(
    registryEntryUpdateDetails,
    authorIdentity,
  );

  console.log('\n✅ Registry Entry updated!', registryEntryUpdate);

  console.log(`\n❄️  Revoking Registry Entry`, registryEntryUpdateDetails.uri);

  const registryEntryRevoke = await Cord.Entries.dispatchRevokeEntryToChain(
    registryEntryUpdateDetails.uri,
    registryEntryUpdateDetails.authorizationUri,
    authorIdentity,
  );

  console.log('\n✅ Registry Entry revoked!', registryEntryRevoke);

  console.log(`\n❄️  Reinstating Revoked Registry Entry`, registryEntryUpdateDetails.uri);

  const registryEntryReinstate = await Cord.Entries.dispatchReinstateEntryToChain(
    registryEntryUpdateDetails.uri,
    registryEntryUpdateDetails.authorizationUri,
    authorIdentity,
  );

  console.log('\n✅ Registry Entry reinstated!', registryEntryReinstate);

  console.log(`\n❄️  Registry Entry verification `)

  const verificationResult = await Cord.Entries.verifyAgainstInputProperties(
    registryEntry,
    updateEntryDigest,
    `did:cord:3${authorIdentity.address}`,
    registry.uri
  )

  if (verificationResult.isValid) {
    console.log(`✅ Verification successful! "${registryEntry}" 🎉`)
  } else {
    console.log(`🚫 Verification failed! - "${verificationResult.message}" 🚫`)
  }

  // Setup a account to be added as a new onwer.
  const { account: assertIdentity } = await createAccount()
  console.log(`\n🏦  New Owner Member (${assertIdentity.type})`)

  // Add a delegate with ASSERT permission
  const assertPermission: Cord.RegistryPermissionType = Cord.RegistryPermission.ASSERT;
  const registryAssertAuthProperties =
    await Cord.Registries.registryAuthorizationProperties(
      registry.uri,
      assertIdentity.address,
      assertPermission,
      authorIdentity.address
    )

  console.dir(registryAssertAuthProperties, {
    depth: null,
    colors: true,
  })

  const newOwnerAssertAuthorizationUri = await Cord.Registries.dispatchDelegateAuthorization(
    registryAssertAuthProperties,
    namespace.authorizationUri,
    registry.authorizationUri,
    authorIdentity
  )

  console.log(`\n✅ Registry Authorization added with ASSERT permission - ${newOwnerAssertAuthorizationUri} - added!`)

  // Transfer the ownership of the entry to new owner
  const entryOwnershipUpdatedUri = 
    await Cord.Entries.dispatchUpdateOwnershipToChain(
      registryEntryDetails.uri,
      registryEntryDetails.authorizationUri,
      assertIdentity.address,
      newOwnerAssertAuthorizationUri,
      authorIdentity
    );

  console.log(`\n✅ Registry Entry Ownership Updated - ${assertIdentity.AccountId}!`)
}

main()
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(Cord.disconnect)

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})
