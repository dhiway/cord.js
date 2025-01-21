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

  const registryDetails = await Cord.Registries.registryCreateProperties(
    authorIdentity.address,
    namespace.authorizationUri,
    digest,            //digest
    schemaUri,         //schemaUri
    blob,              //blob
  );

  console.log(`\n❄️  Registry Create Details `, registryDetails);

  const registry = await Cord.Registries.dispatchCreateRegistryToChain(
    registryDetails,
    authorIdentity,
  );
    
  console.log('\n✅ Registry created!');

  // Update a existing Registry.
  const new_blob = {
    "name": "Companies Registry - A",
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
  const new_stringified_blob = JSON.stringify(new_blob);
  const new_digest = await Cord.Registries.getDigestFromRawData(new_stringified_blob);

  const registryUpdateDetails = await Cord.Registries.registryUpdateProperties(
    registry.uri,
    namespace.authorizationUri,
    registry.authorizationUri,
    authorIdentity.address,
    new_digest,               //digest
    new_blob,                 //blob
  );

  console.log(`\n❄️  Registry Update Details `, registryUpdateDetails);

  const registry_update = await Cord.Registries.dispatchUpdateRegistryToChain(
    registryUpdateDetails,
    authorIdentity,
  );

  console.log('\n✅ Registry updated!');

  // Revoke a Registry
  console.log(`\n❄️ Revoking Registry `, registry.uri);
  const registry_revoke = await Cord.Registries.dispatchRevokeToChain(
    registry.uri,
    namespace.authorizationUri,
    registry.authorizationUri,
    authorIdentity
  );
  console.log('✅ Registry Revoked!');

  // Reinstate a Revoked Registry
  console.log(`\n❄️ Reinstating Revoked Registry `, registry.uri);
  const registry_reinstate = await Cord.Registries.dispatchReinstateToChain(
    registry.uri,
    namespace.authorizationUri,
    registry.authorizationUri,
    authorIdentity
  );
  console.log('✅ Revoked Registry Reinstated!');

  // Archive a Registry
  console.log(`\n❄️ Archiving Registry `, registry.uri);
  const registry_archive = await Cord.Registries.dispatchArchiveToChain(
    registry.uri,
    namespace.authorizationUri,
    registry.authorizationUri,
    authorIdentity
  );
  console.log('✅ Registry Archived!');

  // Restore a Archived Registry
  console.log(`\n❄️ Restoring Archived Registry `, registry.uri);
  const registry_restore = await Cord.Registries.dispatchRestoreToChain(
    registry.uri,
    namespace.authorizationUri,
    registry.authorizationUri,
    authorIdentity
  );
  console.log('✅ Archived Registry Restored!');

  // Setup a account to be added as a `ASSERT` delegate.
  const { account: assertIdentity } = await createAccount()
  console.log(`\n🏦  Delegate Member (${assertIdentity.type}): ${assertIdentity.address}`)

  console.log(`\n❄️  Registry Assert Authorization `);

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

  const delegateAssertAuthorizationUri = await Cord.Registries.dispatchDelegateAuthorization(
    registryAssertAuthProperties,
    namespace.authorizationUri,
    registry.authorizationUri,
    authorIdentity
  )

  console.log(`\n✅ Registry Authorization added with ASSERT permission - ${delegateAssertAuthorizationUri} - added!`)

  // Setup a account to be added as a `DELEGATE` delegate.
  const { account: delegateIdentity } = await createAccount()
  console.log(`\n🏦  Delegate Member (${delegateIdentity.type}): ${delegateIdentity.address}`)

  console.log(`\n❄️  Registry Delegate Authorization `);

  // Add a delegate with DELEGATE permission
  const delegatePermission: Cord.RegistryPermissionType = Cord.RegistryPermission.DELEGATE;
  const registryDelegateAuthProperties =
    await Cord.Registries.registryAuthorizationProperties(
      registry.uri,
      delegateIdentity.address,
      delegatePermission,
      authorIdentity.address
    )

  console.dir(registryDelegateAuthProperties, {
    depth: null,
    colors: true,
  })

  const delegateAuthorizationUri = await Cord.Registries.dispatchDelegateAuthorization(
    registryDelegateAuthProperties,
    namespace.authorizationUri,
    registry.authorizationUri,
    authorIdentity
  )

  console.log(`\n✅ Registry Authorization added with DELEGATE permission - ${delegateAuthorizationUri} - added!`)

  // Setup a account to be added as a `DELEGATE` delegate.
  const { account: adminIdentity } = await createAccount()
  console.log(`\n🏦  Delegate Member (${adminIdentity.type}): ${adminIdentity.address}`)

  console.log(`\n❄️  Registry Admin Authorization `);

  // Add a delegate with DELEGATE permission
  const adminPermission: Cord.RegistryPermissionType = Cord.RegistryPermission.ADMIN;
  const registryAdminAuthProperties =
    await Cord.Registries.registryAuthorizationProperties(
      registry.uri,
      adminIdentity.address,
      adminPermission,
      authorIdentity.address
    )

  console.dir(registryAdminAuthProperties, {
    depth: null,
    colors: true,
  })

  const delegateAdminAuthorizationUri = await Cord.Registries.dispatchDelegateAuthorization(
    registryAdminAuthProperties,
    namespace.authorizationUri,
    registry.authorizationUri,
    authorIdentity
  )

  console.log(`\n✅ Registry Authorization added with ADMIN permission - ${delegateAdminAuthorizationUri} - added!`)

  console.log(`\n❄️  Remove Registry Assert Authorization `);

  // Remove a delegate with ASSERT permission
  const removeAuthObj = await Cord.Registries.dispatchRemoveDelegateToChain(
    registry.uri,
    delegateAssertAuthorizationUri,
    namespace.authorizationUri,
    registry.authorizationUri,
    authorIdentity
  )

  console.log(`\n✅ Registry ASSERT Authorization removed - ${delegateAssertAuthorizationUri} - removed!`)

  console.log("Balance of Registry Creator after all transactions", await getBalance(authorIdentity.address, api));
}

main()
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(Cord.disconnect)

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})
