import * as Cord from "@cord.network/sdk";
import { addNetworkMember } from "./utils/createAuthorities.js";
import { createAccount } from "./utils/createAccount.js";
import { createDid } from "./utils/generateDid";

// import {
//   buildFromAssetProperties,
//   failproofSubmit,
//   buildFromAssetIssueProperties,
// } from "./utils/assets.js";

// import "dotenv/config";

// import { AssetTypeOf, IAssetProperties } from "./utils/asset-types.js";

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
  const txCount = 1000;
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
  const issuerKeys = Cord.Utils.Keys.generateKeypairs(issuerMnemonic)
  console.log(
    `🏛   Issuer (${issuerDid?.assertionMethod![0].type}): ${issuerDid.uri}`
  )

//   const { mnemonic: holderMnemonic, document: holderDid } = await createDid(
//     networkAuthorityIdentity
//   )
//   const holderKeys = Cord.Utils.Keys.generateKeypairs(holderMnemonic)
//   console.log(
//     `🏛   Holder (${holderDid?.assertionMethod![0].type}): ${holderDid.uri}`
//   )


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

  const extrinsic = await Cord.Asset.dispatchCreateToChain(
    assetEntry,
    issuerIdentity,
    space.authorization,
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

    //   const { mnemonic: holderMnemonic, document: holderDid } = await createDid(
    //     networkAuthorityIdentity
    //   )
    //   const holderKeys = Cord.Utils.Keys.generateKeypairs(holderMnemonic)
    //   console.log(
    //     `🏛   Holder (${holderDid?.assertionMethod![0].type}): ${holderDid.uri}`
    //   )

      const assetIssuance = await Cord.Asset.buildFromIssueProperties(
        assetEntry.uri,
        `did:cord:${holderIdentity.address}`,
        1,
        issuerDid.uri,
        space.uri,
      );
        
      const issueExtrinsic = await Cord.Asset.prepareExtrinsic(
        assetIssuance,
        issuerIdentity,
        space.authorization,
        async ({ data }) => ({
          signature: issuerKeys.authentication.sign(data),
          keyType: issuerKeys.authentication.type,
        }),
      )

      tx_batch1.push(issueExtrinsic);

      process.stdout.write(
        "  🔖  Preparing " +
          (j * perBlock + 1 + k) +
          " transactions took " +
          moment.duration(moment().diff(startTxPrep)).as("seconds").toFixed(3) +
          "s\r",
      );
      }
      tx_batch[j] = tx_batch1;
      console.log("j ", j);
      }    
    } catch (e: any) {
      console.log(e.errorCode, "-", e.message);
    }
  console.log("\n");

  // console.log = () => {};
  // Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_FINALIZED });
  console.log = originalConsoleLog;
  let batchAncStartTime = moment();
  let promises = [];
  for (let j = 0; j < tx_batch.length; j++) {
  try {
     const tx = await api.tx.utility.batchAll(tx_batch[j]);
     //await tx.signAsync(issuerIdentity, {nonce: -1})

     const authorizedBatch = await Cord.Did.authorizeBatch({
      batchFunction: api.tx.utility.batchAll,
      did: issuerIdentity,
      extrinsics: tx_batch[j],
      sign: async ({ data }) => ({
        signature: issuerKeys.authentication.sign(data),
        keyType: issuerKeys.authentication.type,
      }),
      submitter: issuerIdentity.address
    })

     const send = new Promise((resolve) => tx.send((result) => {
          if (result.status.isReady)
      	  //if (result.isInBlock)
      	  //if (result.isFinalized)
	     return resolve(true);
      }));
      promises.push(send);

    //await Cord.Chain.signAndSubmitTx(tx, issuerIdentity);
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
//  await sleep(10000);
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
