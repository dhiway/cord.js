import * as Cord from '@cord.network/sdk'
import { createAccount } from '../utils/createAccount'
import { SubmittableExtrinsic } from '@polkadot/api/types'; 

import moment from "moment";

import {
  BN
} from 'bn.js';
import { UUID } from '@cord.network/utils';

import fs from 'fs';
import path from 'path';

import fetch from 'node-fetch';

/* 
* NOTE/ README:
* maxOuterBatches: Maximum number of times the outer batch is refreshed.
*  Outer batch function calls `batchTransactions` method `maxOuterBatches` times.
* 
* txCount: Number of total transactions to be packed as batches in `batchTransactions`.
* 
* perBatch: Number of transactions to be pushed to a single batch.
* 
* Example: 
* maxOuterBatches = 1, txCount = 1_00_000, perBatch = 10_000
* The method `batchTransactions` is called for `maxOuterBatches` i.e 1 times in a loop.
* Since `perBatch` is set to `10_000`. There shall be 10 batches with each containing,
* `10_000` transactions. 
* Every batch is signed and sent to the chain sequentially.
* 
* Logs are enabled by default per script execution. Log file can be found at `cord.js/log/`.
* 
*/

const logFilePath = path.join(process.cwd(), 'log', `transaction_log_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`);

const logDirPath = path.dirname(logFilePath);
if (!fs.existsSync(logDirPath)) {
  fs.mkdirSync(logDirPath, { recursive: true });
}

const logToFile = (message: any) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${formatMessage(message)}\n`;

  fs.appendFileSync(logFilePath, logMessage);
};

const formatMessage = (message: any): string => {
  if (typeof message === 'object') {
    return JSON.stringify(message, null, 2); 
  }
  return message.toString();
};

const log = (...args: any[]) => {
  const message = args.map(arg => formatMessage(arg)).join(' ');
  logToFile(message); 
  console.log(...args); 
}

async function getRpcPendingTransactions() {
  try {
    const response = await fetch('http://127.0.0.1:9944', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'author_pendingExtrinsics',
        params: [],
      }),
    });

    if (!response.ok) {
      console.error(`Error: HTTP status ${response.status}`);
      return -1; 
    }

    const data = await response.json();

    if (data && Array.isArray(data.result)) {
      return data.result.length;
    } else {
      console.error('Error: Unexpected response format or undefined result');
      return -1;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return -1; 
  }
}

async function monitorPendingTransactions() {
  while (true) {
    const pendingTransactions = await getRpcPendingTransactions();
    log(`Pending Transactions: ${pendingTransactions}`);

    /* pendingTransactions count of 3 works to have all transactions submitted to the chain */
    /* -1 is reported when there is error from the RPC call, or the data is not a array type */
    /* --rpc-max-response-size=MB can be configured for the response size */
    if (pendingTransactions >= 3 || pendingTransactions < 0) {
      log('Pending transactions count is >=3 . Waiting for it to become 0...');
      await waitUntilZeroPendingTransactions();
      log('Pending transactions have dropped to 0. Resuming...');
    } else {
      log('Pending transactions are within acceptable limits.');
      break; 
    }
  }
}

async function waitUntilZeroPendingTransactions() {
  while (true) {
    const pendingTransactions = await getRpcPendingTransactions();
    if (pendingTransactions === 0) {
      break; 
    }
    log('Still waiting...');
    await new Promise(resolve => setTimeout(resolve, 5000)); 
  }
}


async function main() {
  try {
    const networkAddress = process.env.NETWORK_ADDRESS
      ? process.env.NETWORK_ADDRESS
      : 'ws://127.0.0.1:9944'

    Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK })
    await Cord.connect(networkAddress)

    const api = Cord.ConfigService.get('api');

    // Step 1: Setup Membership
    // Setup transaction author account - CORD Account.
    log(`\n❄️  New Network Member`)
    const authorityAuthorIdentity = Cord.Utils.Crypto.makeKeypairFromUri(
      process.env.ANCHOR_URI ? process.env.ANCHOR_URI : '//Alice',
      'sr25519'
    )

    // Setup network member account.
    const { account: authorIdentity } = await createAccount()
    log(`🏦  Member (${authorIdentity.type}): ${authorIdentity.address}`)

    try {      
      let tx = await api.tx.balances.transferAllowDeath(authorIdentity.address, new BN('1732334381294000000000'));

      await Cord.Chain.signAndSubmitTx(tx, authorityAuthorIdentity);
      log("Balance transferred successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        log(`Error in main function: ${error.message}`);
      }
    }

    const initialBalance = await getBalance(api, authorIdentity.address);
    log(`Initial Balance: ${initialBalance.toString()}`);

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
    log(`\n❄️  Schema Creation `)
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
    log(`✅ Schema - ${schemaUri} - added!`)

    log(`\n❄️  Query From Chain - Schema `)
    const schemaFromChain = await Cord.SchemaAccounts.fetchFromChain(
      schemaProperties.schema.$id
    )
    console.dir(schemaFromChain, {
      depth: null,
      colors: true,
    })
    log('✅ Schema Functions Completed!')

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
      digest,           
      null,             
      stringified_blob, 
    );

    log(`\n❄️  Registry Create Details `, registryDetails);
    
    const registry = await Cord.Registries.dispatchCreateRegistryToChain(
      registryDetails,
      authorIdentity,
    );

    log("Registry URI", registryDetails.uri);
      
    log('\n✅ Registry created!');

    /* (10_000 * 1_00_000) = 1 Billion in batches of 10_000 */
    let maxOuterBatches = 1; 
    let txCount = 1_00_000;
    let perBatch = 10_000;

    let outerBatchStartTime = moment();

    for (let i = 0; i < maxOuterBatches; i++) {
      log(`\nProcessing outer batch ${i + 1}...`);

      await batchTransactions(api, authorIdentity, registry.uri, registry.authorizationUri, txCount, perBatch);

      log(`\nNumber of transactions sent to chain: ${(i+1) * 1_00_000}`);

      // Start the monitoring function
      await monitorPendingTransactions();

      // await getRpcIdOnly().catch((error) => console.error('Error:', error));
      // await new Promise((resolve) => setTimeout(resolve, 20000));
    }

    let outerBatchEndTime = moment();

    let outerBatchDurationInSeconds = outerBatchEndTime.diff(outerBatchStartTime, 'seconds');
    log(`\nTotal time for ${maxOuterBatches} maximum outer batches: ${outerBatchDurationInSeconds} seconds`);

    const finalBalance = await getBalance(api, authorIdentity.address);
    log(`Final Balance: ${finalBalance.toString()}`);

    const totalConsumed = initialBalance.sub(finalBalance);
    log(`Total Balance Consumed: ${totalConsumed.toString()}`);

    const totalTransactions = maxOuterBatches * (1_00_000); 
    const balancePerTransaction = totalConsumed.div(new BN(totalTransactions));
    log(`Balance per Transaction: ${balancePerTransaction.toString()}`);

    const remainingPercentage =
      (Number(finalBalance) / Number(initialBalance)) * 100;
    const consumedPercentage = 100 - remainingPercentage;

    log(`Initial Balance: ${initialBalance}`);
    log(`Final Balance: ${finalBalance}`);
    log(`Total Balance Consumed: ${totalConsumed}`);
    log(`Balance Per Transaction: ${balancePerTransaction}`);
    log(`Remaining Balance Percentage: ${remainingPercentage.toFixed(2)}%`);
    log(`Consumed Balance Percentage: ${consumedPercentage.toFixed(2)}%`);

  } catch (error: unknown) {
    if (error instanceof Error) {
      log(`Error in main function: ${error.message}`);
    }
  } finally {
    await Cord.disconnect();
    log('\nBye! 👋 👋 👋 ');
  }
}

async function batchTransactions(
  api: Cord.ApiPromise,
  authorIdentity: Cord.CordKeyringPair,
  registryUri: Cord.RegistryUri,
  registryAuthUri: Cord.RegistryAuthorizationUri,
  txCount: number, perBatch: number) {

  let startTxPrep = moment();

  // const initialNonce = (await api.query.system.account(authorIdentity.address)).nonce.toNumber();
  // let currentNonce = initialNonce;

  log(`\nPreparing and submitting ${txCount} transactions in batches of ${perBatch}...`);

  const txBatch: SubmittableExtrinsic<'promise'>[] = [];

  try {
    for (let j = 0; j < Math.ceil(txCount / perBatch); j++) {
      txBatch.length = 0; 

      for (let k = 0; k < perBatch && j * perBatch + k < txCount; k++) {

        const registryEntryDetails = await Cord.Entries.createEntriesProperties(
          authorIdentity.address,
          registryUri,
          registryAuthUri,
          null,  
          `${UUID.generate()}`
        );

        const tx = api.tx.entries.create(
          registryEntryDetails.uri.split(":")[2],
          registryEntryDetails.authorizationUri.replace('registryauth:cord:', ''),
          registryEntryDetails.digest,
          registryEntryDetails.blob
        );

        txBatch.push(tx);

        process.stdout.write(
          `  🔖  Prepared ${(j * perBatch + k + 1)} transactions in ${moment
            .duration(moment().diff(startTxPrep))
            .asSeconds()
            .toFixed(3)}s\r`
        );
      }

      log(`\nSubmitting batch ${j + 1}...`);

      const batchExtrinsic = api.tx.utility.batchAll(txBatch);

      // This is working and having no spikes in memory usage,
      // Heap memory usage can be tracked through enabling `--inspect` subcommand on node.
      await batchExtrinsic.signAndSend(authorIdentity, { nonce: -1 });

      /* Memory spikes in below submission attempts */
      // Sign the batch with the correct nonce
      // await batchExtrinsic.signAsync(authorIdentity, { nonce: new BN(currentNonce) });
      // try {
      //   const unsub = await batchExtrinsic.signAndSend(
      //     authorIdentity,
      //     async (result) => {
      //       if (result.status.isInBlock) {
      //         unsub();
      //         log(`Batch included in block.`);
      //       } else if (result.status.isFinalized) {
      //         unsub();
      //         log(`Batch finalized.`); }
      //       // } else if (result.isError) {
      //       //   log(`Batch failed:`, result.toHuman());
      //       // }
      //     }
      //   );
      // } catch (error: unknown) {
      //   if (error instanceof Error) {
      //     log(`Batch submission error: ${error.message}`);
      //   }
      // }
      // await new Promise<void>((resolve, reject) => {
      //   const batchExtrinsic = api.tx.utility.batchAll(txBatch);
      //   batchExtrinsic
      //     .signAndSend(authorIdentity, { nonce: currentNonce }, (result) => {
      //       if (result.status.isInBlock) {
      //         log(`Batch ${j + 1} included in block.`);
      //       } else if (result.status.isFinalized) {
      //         log(`Batch ${j + 1} finalized.`);
      //         resolve(); 
      //       } else if (result.isError) {
      //         log(`Batch ${j + 1} failed:`, result.toHuman());
      //         reject(new Error(`Batch ${j + 1} failed`));
      //       }
      //     })
      //     .catch((error) => {
      //       log(`Error submitting batch ${j + 1}:`, error.message);
      //       reject(error);
      //     });
      // });
      // Increment nonce for the next batch
      // currentNonce++;

      // Empty the array after use.
      txBatch.length = 0;

      // Force GC for every batch.
      if (typeof global.gc === "function") {
        global.gc();
      } else {
        console.warn(
            "Garbage collection is not exposed. Run the script with 'node --expose-gc --inspect -r 'ts-node/register' demo/src/dedi/dedi-stress-test.ts'."
        );
      }
    
      await new Promise((resolve) => setImmediate(resolve));
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
        log(`Error during transaction preparation or submission: ${e.message}`);
    }
    return 
  }

  const batchDuration = moment.duration(moment().diff(startTxPrep)).asSeconds();
  log(`\n  🎁  Anchoring ${txCount} transactions took ${batchDuration.toFixed(3)}s`);
  log(`  🙌  Block TPS (batch transactions) - ${Math.round(txCount / batchDuration)} `);
}

async function getBalance(api: Cord.ApiPromise, address: string) {
  const { data: balance } = await api.query.system.account(address);
  return balance.free; 
}

main()
  .then(() => log('\nBye! 👋 👋 👋 '))
  .finally(Cord.disconnect)

process.on('SIGINT', async () => {
  log('\nBye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})
