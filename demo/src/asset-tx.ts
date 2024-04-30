import * as Cord from "@cord.network/sdk";
import { addNetworkMember } from "./utils/createAuthorities.js";
import { createAccount } from "./utils/createAccount.js";
/*
import {
  buildFromAssetProperties,
  failproofSubmit,
  buildFromAssetIssueProperties,
  buildFromAssetTransferProperties,
} from "./utils/assets.js";

import { AssetTypeOf, IAssetProperties } from "./utils/asset-types.js";
*/
import { createDid } from "./utils/generateDid";

const { NETWORK_ADDRESS, ANCHOR_URI } = process.env;

async function main() {
  const networkAddress = NETWORK_ADDRESS ?? 'ws://127.0.0.1:9944';
  const anchorUri = ANCHOR_URI ?? '//Alice';

  // Temporarily suppress console.log
  let originalConsoleLog = console.log;
  console.log = () => {};
  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK });
  await Cord.connect(networkAddress);
  const api = Cord.ConfigService.get("api");
  // Restore console.log
  console.log = originalConsoleLog;
  console.log(`\nOn-Chain Assets & Transactions  `);

  // Step 1: Setup Identities
  console.log(`\n❄️  Identities`);
  const networkAuthorityIdentity = Cord.Utils.Crypto.makeKeypairFromUri(
    anchorUri,
    "sr25519"
  );

  //  const { account: issuerIdentity } = createAccount();
    // Create issuer DID
  const { mnemonic: issuerMnemonic, document: issuerDid } = await createDid(
    networkAuthorityIdentity
  )
  const issuerKeys = Cord.Utils.Keys.generateKeypairs(issuerMnemonic, 'sr25519')
  console.log(
    `🏛   Issuer (${issuerDid?.assertionMethod![0].type}): ${issuerDid.uri}`
  )

  const { mnemonic: holderMnemonic, document: holderDid } = await createDid(
    networkAuthorityIdentity
  )
  const holderKeys = Cord.Utils.Keys.generateKeypairs(holderMnemonic, 'sr25519')
  console.log(
    `🏛   Holder (${holderDid?.assertionMethod![0].type}): ${holderDid.uri}`
  )
  const { mnemonic: holder2Mnemonic, document: holder2Did } = await createDid(
    networkAuthorityIdentity
  )
  console.log(
    `🏛   Holder2 (${holder2Did?.assertionMethod![0].type}): ${holder2Did.uri}`
  )

  const { account: apiIdentity } = createAccount();
  console.log(`🏦  API Provider (${apiIdentity.type}): ${apiIdentity.address}`);

  //  await addNetworkMember(networkAuthorityIdentity, issuerIdentity.address);
  await addNetworkMember(networkAuthorityIdentity, apiIdentity.address);
  console.log("✅ Identities created!");

  // Step 3: Create a new Chain Space
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
    networkAuthorityIdentity,
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
    100
  )
  console.log(`✅  Chain Space Approved`)

  // Step 2: Create assets on-chain
  let assetProperties: Cord.IAssetProperties = {
    assetType: Cord.AssetTypeOf.art,
    assetDesc: "Asset - " + Cord.Utils.UUID.generate(),
    assetQty: 10000,
    assetValue: 100,
    assetTag: "Tag - " + Cord.Utils.UUID.generate(),
    assetMeta: "Meta - " + Cord.Utils.UUID.generate(),
  };

  console.log(`\n❄️  Asset Properties - Created by Issuer  `);
  console.dir(assetProperties, {
    depth: null,
    colors: true,
  });

  const assetEntry = await Cord.Asset.buildFromAssetProperties(
    assetProperties,
    issuerDid.uri,
    space.uri,
  );

  console.log(`\n❄️  Asset Transaction  - Created by Issuer  `);
  console.dir(assetEntry, {
    depth: null,
    colors: true,
  });

  const extrinsic = await Cord.Asset.dispatchCreateToChain(
      assetEntry,
      networkAuthorityIdentity,
      space.authorization,
      async ({ data }) => ({
        signature: issuerKeys.authentication.sign(data),
        keyType: issuerKeys.authentication.type,
      }),
    )

  console.log("✅ Asset created!");

  // Step 3: Issue Asset to Holder
  console.log(`\n❄️  Issue Asset to Holder - Issuer Action  `);
  const assetIssuance = await Cord.Asset.buildFromIssueProperties(
    assetEntry.uri,
    holderDid.uri,
    1,
    issuerDid.uri,
    space.uri,
  );

  console.dir(assetIssuance, {
    depth: null,
    colors: true,
  });

  const issueExtrinsic = await Cord.Asset.dispatchIssueToChain(
      assetIssuance,
      networkAuthorityIdentity,
      space.authorization,
      async ({ data }) => ({
        signature: issuerKeys.authentication.sign(data),
        keyType: issuerKeys.authentication.type,
      }),
    )

  // Step 4: Transfer Asset to New Owner
  console.log(`\n❄️  Transfer Asset to New Owner (Holder2) - Holder Action  `);
  
  const assetTransfer = await Cord.Asset.buildFromTransferProperties(
    assetIssuance.uri,
    holder2Did.uri,
    holderDid.uri,
  );

  console.dir(assetTransfer, {
    depth: null,
    colors: true,
  });

  const transferExtrinsic = await Cord.Asset.dispatchTransferToChain(
      assetTransfer,
      networkAuthorityIdentity,
      async ({ data }) => ({
        signature: holderKeys.authentication.sign(data),
        keyType: holderKeys.authentication.type,
      }),
    )

  console.log("✅ Asset transferred!");

  // Step 5: Change status of Asset
  console.log(`\n❄️  Change status of Asset from 'Active' to 'Inactive' Action`);

  const statusChangeExtrinsic = await Cord.Asset.dispatchAssetStatusChangeToChain(
      assetEntry.uri,
      issuerDid.uri,
      networkAuthorityIdentity,
      Cord.AssetStatusOf.inactive,
      async ({ data }) => ({
        signature: issuerKeys.authentication.sign(data),
        keyType: issuerKeys.authentication.type,
      }),
      assetIssuance.uri
    )

  console.log("✅ Asset status changed!");
}
main()
  .then(() => console.log("\nBye! 👋 👋 👋 "))
  .finally(Cord.disconnect);

process.on("SIGINT", async () => {
  console.log("\nBye! 👋 👋 👋 \n");
  Cord.disconnect();
  process.exit(0);
});
