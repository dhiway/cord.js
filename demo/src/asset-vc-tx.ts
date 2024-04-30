import * as Cord from "@cord.network/sdk";
import { addNetworkMember } from "./utils/createAuthorities.js";
import { createAccount } from "./utils/createAccount.js";

import * as vcExport from "@cord.network/vc-export";
import { createDid } from "./utils/generateDid";
import PalletAssetVcAssetEntry from '@polkadot/types/lookup';

const { NETWORK_ADDRESS, ANCHOR_URI } = process.env;

import { hashToUri, uriToIdentifier } from '@cord.network/identifier'
import {
  ASSET_IDENT,
  ASSET_PREFIX,
  AssetUri,
  IAssetEntry,
  DidUri,
  SpaceUri,
  blake2AsHex,
  AccountId,
  H256,
} from '@cord.network/types'
import * as Did from '@cord.network/did'
import { HexString } from "@cord.network/types";

async function buildFromAssetVcProperties(entryDigest: HexString, issuerUri: DidUri , spaceUri: SpaceUri, api: Cord.ConfigService) {
  const scaleEncodedAssetDigest = api
  .createType<H256>("H256", entryDigest)
  .toU8a();
  const scaleEncodedIssuer = api
    .createType<AccountId>('AccountId', Did.toChain(issuerUri))
    .toU8a()
  const scaleEncodedSpace = api
    .createType<AccountId>('Bytes', uriToIdentifier(spaceUri))
    .toU8a()

  const assetIdDigest = blake2AsHex(
    Uint8Array.from([...scaleEncodedAssetDigest, ...scaleEncodedSpace, ...scaleEncodedIssuer])
  );

  const assetIdentifier = hashToUri(
    assetIdDigest,
    ASSET_IDENT,
    ASSET_PREFIX
  ) as AssetUri;

  const transformedEntry: IAssetEntry = {
    creator: issuerUri,
    space: spaceUri,
    digest: entryDigest,
    uri: assetIdentifier,
  };

  return transformedEntry;
}

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
  console.log(`\nOn-Chain Assets & Transactions`);

  // Step 1: Setup Identities
  console.log(`\n❄️  Identities`);
  const networkAuthorityIdentity = Cord.Utils.Crypto.makeKeypairFromUri(
    anchorUri,
    "sr25519"
  );

  const { account: authorIdentity } = await createAccount()
  console.log(`🏦  Member (${authorIdentity.type}): ${authorIdentity.address}`)
  await addNetworkMember(networkAuthorityIdentity, authorIdentity.address)
 
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

  // Step 2: Create a new Chain Space
  console.log(`\n❄️  Chain Space Creation `)
  const spaceProperties = await Cord.ChainSpace.buildFromProperties(
    issuerDid.uri
  )
  console.dir(spaceProperties, {
    depth: null,
    colors: true,
  })

  let extSignCallback = async ({ data }) => ({
    signature: issuerKeys.authentication.sign(data),
    keyType: issuerKeys.authentication.type,
  })

  console.log(`\n❄️  Chain Space Properties `)
  const space = await Cord.ChainSpace.dispatchToChain(
    spaceProperties,
    issuerDid.uri,
    authorIdentity,
    extSignCallback,
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
  console.log(`✅ Chain Space Approved`)

  // Step 3: Dispatch creation of asset schema to chain.
  let newSchemaContent = require('../res/asset_vc_schema.json');
  let newSchemaName =
      newSchemaContent.title + ':' + Cord.Utils.UUID.generate();
  newSchemaContent.title = newSchemaName;

  let schemaProperties = Cord.Schema.buildFromProperties(
    newSchemaContent,
    space.uri,
    issuerDid.uri,
  );

  const schemaUri = await Cord.Schema.dispatchToChain(
      schemaProperties.schema,
      issuerDid.uri,
      authorIdentity,
      space.authorization,
      async ({ data }) => ({
          signature: issuerKeys.authentication.sign(data),
          keyType: issuerKeys.authentication.type,
      }),
  );
  
  console.log(`✅ Schema - ${schemaUri} - added!`);

  // Step 4: Create assets off-chain
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

  // Step 5: Delegate(Asset Owner/Issuer) creates a new Verifiable Document
  console.log(`\n❄️  VC Asset Creation `);

  let newCredContent = await vcExport.buildVcFromContent(
      schemaProperties.schema,
      assetProperties,
      issuerDid,
      issuerDid.uri,
      {
          spaceUri: space.uri,
          schemaUri: schemaUri,
      },
  );
  /* TODO: Fix addProof dependency issue by implementing the methods requiring api locally */
  // let vc = await vcExport.addProof(
  //     newCredContent,
  //     async (data) => ({
  //         signature: await issuerKeys.assertionMethod.sign(data),
  //         keyType: issuerKeys.assertionMethod.type,
  //         keyUri: `${issuerDid.uri}${
  //             issuerDid.assertionMethod![0].id
  //         }` as Cord.DidResourceUri,
  //     }),
  //     issuerDid,
  //     { spaceUri: space.uri, schemaUri, needSDR: false, needStatementProof: false },
  // );
  // console.dir(vc, {
  //     depth: null,
  //     colors: true,
  // });
  
  const assetVcEntry = await buildFromAssetVcProperties(newCredContent.credentialHash, issuerDid.uri, space.uri, api);
  newCredContent.id = assetVcEntry.uri;
  console.log("\n❄️  Asset(create) Verifiable Credential Document created \n", newCredContent);

  const extrinsic = await Cord.Asset.dispatchCreateVcToChain(
      assetProperties.assetQty,
      newCredContent.credentialHash,
      newCredContent.issuer,
      networkAuthorityIdentity,
      space.authorization,
      assetVcEntry.uri,
      extSignCallback,
    )
  console.log("\n✅  VC Asset created on-chain!");

  // Update the assetProperties with number of quantity of asset issued.
  let issuanceQty = 1;
  assetProperties.assetQty = issuanceQty;
  
  let newIssueCredContent = await vcExport.buildVcFromContent(
    schemaProperties.schema,
    assetProperties,
    issuerDid,
    holderDid.uri,
    {
        spaceUri: space.uri,
        schemaUri: schemaUri,
    },
  );

  // Step 6: Issue Asset to Holder
  console.log(`\n❄️  Issue Asset to Holder - Issuer Action  `);
  const assetIssuance = await Cord.Asset.buildFromIssueProperties(
    assetVcEntry.uri,
    holderDid.uri,
    1,
    issuerDid.uri,
    space.uri,
  );

  console.dir(assetIssuance, {
    depth: null,
    colors: true,
  });

  // Asset Issue ID consists of both asset_id:instance_id
  newIssueCredContent.id = assetIssuance.uri;
  console.log("\n❄️  Asset(issue) Verifiable Credential Document created \n", newIssueCredContent);

  const issueExtrinsic = await Cord.Asset.dispatchIssueVcToChain(
    assetIssuance,
    networkAuthorityIdentity,
    space.authorization,
    extSignCallback,
  )

  // Step 7: Transfer Asset to New Owner
  console.log(`\n❄️  Transfer Asset to New Owner (Holder2) - Holder Action  `);

  assetProperties.assetQty = issuanceQty;
  let newTransferCredContent = await vcExport.buildVcFromContent(
    schemaProperties.schema,
    assetProperties,
    holderDid,
    holder2Did.uri,
    {
        spaceUri: space.uri,
        schemaUri: schemaUri,
    },
  );

  // Asset Issue ID consists of both asset_id:instance_id
  newTransferCredContent.id = assetIssuance.uri;
  console.log("\n❄️  Asset(transfer) Verifiable Credential Document created \n", newTransferCredContent);
  
  const assetTransfer = await Cord.Asset.buildFromTransferProperties(
    assetIssuance.uri,
    holder2Did.uri,
    holderDid.uri,
  );

  console.dir(assetTransfer, {
    depth: null,
    colors: true,
  });

  const transferExtrinsic = await Cord.Asset.dispatchTransferVcToChain(
    assetTransfer,
    networkAuthorityIdentity,
    async ({ data }) => ({
      signature: holderKeys.authentication.sign(data),
      keyType: holderKeys.authentication.type,
    }),
  )

  console.log("✅  Asset transferred!");
  
  // Step 5: Change status of Asset
  console.log(`\n❄️  Change status of Asset from 'Active' to 'Inactive' Action`);

  const statusChangeExtrinsic = await Cord.Asset.dispatchAssetStatusChangeVcToChain(
    assetVcEntry.uri,
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
