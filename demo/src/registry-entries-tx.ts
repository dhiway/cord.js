import * as Cord from '@cord.network/sdk'
import { createAccount } from './utils/createAccount'

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
    digest,            //digest
    null,              //schemaId
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
  const registryEntryDetails = await Cord.Entries.CreateEntriesProperties(
    authorIdentity.address,
    entryDigest,                  //digest
    entryBlob,                    //blob
    registry.uri,                 //registryUri
    registry.authorizationUri     //registryAuthUri
  );

  console.log(`\n❄️  Registry Entry Create Details `, registryEntryDetails);

  // Dispatch the Registry Entry to the chain.
  const registryEntry = await Cord.Entries.dispatchCreateEntryToChain(
    registryEntryDetails,
    authorIdentity,
  )

  console.log('\n✅ Registry Entry created!');
}

main()
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(Cord.disconnect)

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})
