import * as Cord from "@cord.network/sdk";
import { addNetworkMember } from "./utils/createAuthorities.js";
import { createAccount } from "./utils/createAccount.js";

import * as vcExport from "@cord.network/vc-export";
import { createDid } from "./utils/generateDid";
import PalletAssetVcAssetEntry from '@polkadot/types/lookup';

const { NETWORK_ADDRESS, ANCHOR_URI } = process.env;

/* TODO: Remove unused below dependencies after AssetEntryUri is built in vcExport library */
import { hashToUri, uriToIdentifier } from '@cord.network/identifier'
import {
  IAssetProperties,
  ASSET_IDENT,
  ASSET_PREFIX,
  AssetUri,
  IAssetIssuance,
  ASSET_INSTANCE_IDENT,
  IAssetTransfer,
  IAssetEntry,
  IAssetTransferEntry,
  DidUri,
  SpaceUri,
  blake2AsHex,
  AccountId,
  H256,
  Bytes,
} from '@cord.network/types'
import { Crypto } from '@cord.network/utils'
import * as Did from '@cord.network/did'
//import AccountId32 from '@polkadot/types/interfaces/runtime';


/* TODO: Take arguments, generate digests with typed arguments */
async function buildAssetUri(assetInput: IAssetEntry, issuerUri: DidUri , spaceUri: SpaceUri, api: any) {
  //const api = Cord.ConfigService.get("api");
  const entryDigest = Crypto.hashObjectAsHexStr(assetInput);

  const scaleEncodedAssetDigest = api
  .createType("H256", entryDigest)
  .toU8a();
  const scaleEncodedIssuer = api
    .createType('AccountId', Did.toChain(issuerUri))
    .toU8a()
  const scaleEncodedSpace = api
    .createType('Bytes', uriToIdentifier(spaceUri))
    .toU8a()

  const assetIdDigest = blake2AsHex(
    Uint8Array.from([...scaleEncodedAssetDigest, ...scaleEncodedSpace, ...scaleEncodedIssuer])
  );

  const assetIdentifier = hashToUri(
    assetIdDigest,
    ASSET_IDENT,
    ASSET_PREFIX
  ) as AssetUri;

  return assetIdentifier
}

async function main() {
  const networkAddress = NETWORK_ADDRESS ?? 'ws://127.0.0.1:60477';
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

  // Step 3: Create a new Chain Space
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
  console.log(`✅  Chain Space Approved`)

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

  // Step 2: Create assets on-chain
  let assetProperties: Cord.IAssetProperties = {
    assetType: Cord.AssetTypeOf.art,
    assetDesc: "Asset - " + Cord.Utils.UUID.generate(),
    assetQty: 10000,
    assetValue: 100,
    assetTag: "Tag - " + Cord.Utils.UUID.generate(),
    assetMeta: "Meta - " + Cord.Utils.UUID.generate(),
  };

  // Step 4: Delegate creates a new Verifiable Document
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

  console.log("VC asset creation complete", newCredContent);

  let vc = await vcExport.addProof(
      newCredContent,
      async (data) => ({
          signature: await issuerKeys.assertionMethod.sign(data),
          keyType: issuerKeys.assertionMethod.type,
          keyUri: `${issuerDid.uri}${
              issuerDid.assertionMethod![0].id
          }` as Cord.DidResourceUri,
      }),
      issuerDid,
      { spaceUri: space.uri, schemaUri, needSDR: false, needStatementProof: false },
  );
  console.dir(vc, {
      depth: null,
      colors: true,
  });

  console.log(`\n❄️  Asset Properties - Created by Issuer  `);
  console.dir(assetProperties, {
    depth: null,
    colors: true,
  });

  // const assetEntry = await Cord.Asset.buildFromAssetProperties(
  //   assetProperties,
  //   issuerDid.uri,
  //   space.uri,
  // );

  console.log("\n ** VC Asset Create Entry to chain ** \n", 
  {
    "entry": {
    assetQty: assetProperties.assetQty,
    digest: vc.credentialHash,
    authorizationId: uriToIdentifier(space.authorization),
  }});

  /* TODO: Build assetEntryUri from vcExport library */
  const assetEntryUri = await buildAssetUri(assetProperties, issuerDid.uri, space.uri, api);

  const extrinsic = await Cord.Asset.dispatchCreateVcToChain(
      assetProperties.assetQty,
      vc.credentialHash,
      vc.issuer,
      networkAuthorityIdentity,
      space.authorization,
      //assetEntry.uri,
      extSignCallback,
    )

  console.log("\n ✅ VC Asset created!");

  console.log("Pring vc asset", vc);

  // Step 3: Issue Asset to Holder
  console.log(`\n❄️  Issue Asset to Holder - Issuer Action  `);
  const assetIssuance = await Cord.Asset.buildFromIssueProperties(
    //assetEntry.uri,
    assetEntryUri,
    holderDid.uri,
    1,
    issuerDid.uri,
    space.uri,
  );

  console.dir(assetIssuance, {
    depth: null,
    colors: true,
  });

  const issueExtrinsic = await Cord.Asset.dispatchIssueVcToChain(
    assetIssuance,
    networkAuthorityIdentity,
    space.authorization,
    extSignCallback,
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

  const transferExtrinsic = await Cord.Asset.dispatchTransferVcToChain(
    assetTransfer,
    networkAuthorityIdentity,
    async ({ data }) => ({
      signature: holderKeys.authentication.sign(data),
      keyType: holderKeys.authentication.type,
    }),
  )

  console.log("✅ Asset transferred!");
}
main()
  .then(() => console.log("\nBye! 👋 👋 👋 "))
  .finally(Cord.disconnect);

process.on("SIGINT", async () => {
  console.log("\nBye! 👋 👋 👋 \n");
  Cord.disconnect();
  process.exit(0);
});
