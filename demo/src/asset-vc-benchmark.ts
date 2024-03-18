import * as Cord from "@cord.network/sdk";
import { addNetworkMember } from "./utils/createAuthorities.js";
import { createAccount } from "./utils/createAccount.js";
import { createDid } from "./utils/generateDid";
import { BN } from '@polkadot/util'
import { uriToIdentifier } from '@cord.network/identifier'

import moment from "moment";
import { Address } from '../../packages/utils/lib/esm/Crypto';

const { NETWORK_ADDRESS, ANCHOR_URI } = process.env;

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
};

async function main() {
  const networkAddress = "ws://127.0.0.1:9944";
  const anchorUri = "//Alice";
  if (!anchorUri || !networkAddress) {
    console.log("Missing variables");
    return -1;
  }
  console.log("Env Variables: ", networkAddress, anchorUri);

  // Temporarily suppress console.log
  let originalConsoleLog = console.log;
  console.log = () => {};
  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK });

  await Cord.connect(networkAddress);
  const api = Cord.ConfigService.get("api");

  // Restore console.log
  console.log = originalConsoleLog;
  const txCount = 20000;
  const perBlock = 350;

  // Step 1: Setup Identities
  console.log(`\n❄️  Identities`);
  const networkAuthorityIdentity = Cord.Utils.Crypto.makeKeypairFromUri(
    anchorUri,
    "sr25519",
  );
  const { account: issuerIdentity } = createAccount();
  console.log(`🏦  Issuer (${issuerIdentity.type}): ${issuerIdentity.address}`);
  await addNetworkMember(networkAuthorityIdentity, issuerIdentity.address);
  console.log("✅ Issuer Identity created!");

  const { mnemonic: issuerMnemonic, document: issuerDid } = await createDid(
    networkAuthorityIdentity
  )
  const issuerKeys = Cord.Utils.Keys.generateKeypairs(issuerMnemonic, 'sr25519')
  console.log(
    `🏛   Issuer (${issuerDid?.assertionMethod![0].type}): ${issuerDid.uri}`
  )

  // Step 2: Create a new Chain Space
  console.log(`\n❄️  Chain Space Creation `)
  const spaceProperties = await Cord.ChainSpace.buildFromProperties(
    issuerDid.uri
  )
  console.dir(spaceProperties, {
    depth: null,
    colors: true,
  })

  console.log(`\n❄️  Chain Space Properties `)
  const space = await Cord.ChainSpace.dispatchToChain(
    spaceProperties,
    issuerDid.uri,
    issuerIdentity,
    async ({ data }) => ({
      signature: issuerKeys.authentication.sign(data),
      keyType: issuerKeys.authentication.type,
    })
  )
  console.dir(space, {
    depth: null,
    colors: true,
  })
  console.log('✅ Chain Space created!')

  console.log(`\n❄️  Chain Space Approval `)
  await Cord.ChainSpace.sudoApproveChainSpace(
    networkAuthorityIdentity,
    space.uri,
    100000
  )
  console.log(`✅  Chain Space Approved`)

  // Step 3: Create assets on-chain
  console.log = () => {};

  /* Check which options one needs: note below only agree */
  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_READY });
  //Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK});
  //Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_FINALIZED });
  console.log = originalConsoleLog;

  console.log(`\n❄️  Create On-Chain Assets  `);
  let assetProperties: Cord.IAssetProperties = {
    assetType: Cord.AssetTypeOf.art,
    assetDesc: "Asset - " + Cord.Utils.UUID.generate(),
    assetQty: 1000000,
    assetValue: 10,
    assetTag: "Tag - " + Cord.Utils.UUID.generate(),
    assetMeta: "Meta - " + Cord.Utils.UUID.generate(),
  };

  const assetEntry = await Cord.Asset.buildFromAssetProperties(
    assetProperties,
    issuerDid.uri,
    space.uri
  );

  console.dir(assetEntry, {
    depth: null,
    colors: true,
  });

  const extrinsic = await Cord.Asset.dispatchCreateVcToChain(
    assetProperties.assetQty,
    assetEntry.digest,
    assetEntry.creator,
    issuerIdentity,
    space.authorization,
    assetEntry.uri,
    async ({ data }) => ({
      signature: issuerKeys.authentication.sign(data),
      keyType: issuerKeys.authentication.type,
    }),
  )

  console.log("✅ Asset created!");

  console.log(`\n❄️  Transaction Benchmarking  `);

  let tx_batch: any = [];
  let startTxPrep = moment();

  try {
  for (let j = 0; j < (txCount / perBlock); j++) {
     let tx_batch1: any = [];
     for (let k = 0; k < perBlock; k++) {
      const { account: holderIdentity } = createAccount();

      const assetIssuance = await Cord.Asset.buildFromIssueProperties(
        assetEntry.uri,
        `did:cord:${holderIdentity.address}`,
        1,
        issuerDid.uri,
        space.uri,
      );
      
      const authorizationId: Cord.AuthorizationId = uriToIdentifier(space.authorization)
  
      const tx = await api.tx.asset.vcIssue(
        assetIssuance.entry,
        assetIssuance.digest,
        authorizationId
      )

      tx_batch1.push(tx);

      process.stdout.write(
        "  🔖  Preparing " +
          (j * perBlock + 1 + k) +
          " transactions took " +
          moment.duration(moment().diff(startTxPrep)).as("seconds").toFixed(3) +
          "s\r",
      );
      }
      tx_batch[j] = tx_batch1;
      }    
    } catch (e: any) {
      console.log(e.errorCode, "-", e.message);
    }
  console.log("\n");

  //Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_FINALIZED });
  console.log = originalConsoleLog;
  let batchAncStartTime = moment();

  let promises = [];
  for (let j = 0; j < tx_batch.length; j++) {
  try {
      let extSignCallback: Cord.SignExtrinsicCallback = async ({ data }) => ({
            signature: issuerKeys.authentication.sign(data),
            keyType: issuerKeys.authentication.type,
      })
     
      /* Use nonce when authorizing tx in batch(loop) */
     const authorizedBatch = await Cord.Did.authorizeBatch({
      batchFunction: api.tx.utility.batchAll,
      did: issuerDid.uri,
      nonce: new BN(j+3),
      extrinsics: tx_batch[j],
      sign: extSignCallback,
      submitter: issuerIdentity.address
    })

     await authorizedBatch.signAsync(issuerIdentity, {nonce: 2+j});
     const send:any = new Promise((resolve) => authorizedBatch.send((result) => {
          if (result.status.isReady)
      	  //if (result.isInBlock)
      	  //if (result.isFinalized)
	     return resolve(true);
      }));
      promises.push(send);

  } catch (e: any) {
    console.log(e.errorCode, "-", e.message);
  }
  }
  await Promise.all(promises);
  
  var batchAncDuration = moment
    .duration(moment().diff(batchAncStartTime))
    .as("seconds");

  console.log(
    `\n  🎁  Anchoring a batch of ${
      txCount
    } transactions took ${batchAncDuration.toFixed(3)}s`,
  );
  console.log(
    `  🙌  Block TPS (batch transactions) - ${+(
      txCount / batchAncDuration
    ).toFixed(0)} `,
  );

  await sleep(1000);
//  await sleep(10000);

  await api.disconnect();
}
main()
  .then(() => console.log("\nBye! 👋 👋 👋 "))
  .finally(Cord.disconnect);

process.on("SIGINT", async () => {
  console.log("\nBye! 👋 👋 👋 \n");
  Cord.disconnect();
  process.exit(0);
});
