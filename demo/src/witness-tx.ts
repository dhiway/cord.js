import * as Cord from "@cord.network/sdk";
import { addNetworkMember } from "./utils/createAuthorities.js";
import { createAccount } from "./utils/createAccount.js";

import { createDid } from "./utils/generateDid";
import fs from 'fs';

const { NETWORK_ADDRESS, ANCHOR_URI } = process.env;

async function main() {
  const networkAddress = NETWORK_ADDRESS ?? 'ws://127.0.0.1:9944';
  const anchorUri = ANCHOR_URI ?? '//Alice';

  let originalConsoleLog = console.log;
  console.log = () => {};

  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK });
  await Cord.connect(networkAddress);

  const api = Cord.ConfigService.get("api");

  console.log = originalConsoleLog;
  console.log(`\nOn-Chain Assets & Transactions  `);

  // Step 1: Setup Identities
  console.log(`\n❄️  Identities`);
  const networkAuthorityIdentity = Cord.Utils.Crypto.makeKeypairFromUri(
    anchorUri,
    "sr25519"
  );

  // const { account: issuerIdentity } = createAccount();
  // Create creator DID
  const { mnemonic: creatorMnemonic, document: creatorDid } = await createDid(
    networkAuthorityIdentity
  )
  const creatorKeys = Cord.Utils.Keys.generateKeypairs(creatorMnemonic, 'sr25519')
  console.log(
    `🏛   Creator (${creatorDid?.assertionMethod![0].type}): ${creatorDid.uri}`
  )

  // Create witness 1 DID
  const { mnemonic: witness1Mnemonic, document: witness1Did } = await createDid(
    networkAuthorityIdentity
  )
  const witness1Keys = Cord.Utils.Keys.generateKeypairs(witness1Mnemonic, 'sr25519')
  console.log(
    `🏛   Witness 1 (${witness1Did?.assertionMethod![0].type}): ${witness1Did.uri}`
  )

  // Create witness 2 DID
  const { mnemonic: witness2Mnemonic, document: witness2Did } = await createDid(
    networkAuthorityIdentity
  )
  console.log(
    `🏛   Witness 2 (${witness2Did?.assertionMethod![0].type}): ${witness2Did.uri}`
  )
  const witness2Keys = Cord.Utils.Keys.generateKeypairs(witness2Mnemonic, 'sr25519')

  const { account: apiIdentity } = createAccount();
  console.log(`🏦  API Provider (${apiIdentity.type}): ${apiIdentity.address}`);

  //  await addNetworkMember(networkAuthorityIdentity, issuerIdentity.address);
  await addNetworkMember(networkAuthorityIdentity, apiIdentity.address);
  console.log("✅ Identities created!");

  // Step 3: Create a new Chain Space
  console.log(`\n❄️  Chain Space Creation `)
  const spaceProperties = await Cord.ChainSpace.buildFromProperties(
    creatorDid.uri
  )
  console.dir(spaceProperties, {
    depth: null,
    colors: true,
  })

  console.log(`\n❄️  Chain Space Properties `)
  const space = await Cord.ChainSpace.dispatchToChain(
    spaceProperties,
    creatorDid.uri,
    networkAuthorityIdentity,
    async ({ data }) => ({
      signature: creatorKeys.authentication.sign(data),
      keyType: creatorKeys.authentication.type,
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

	// Step 2: Read the document and get the hash of the file

	function readFileAsString(filePath: string): string {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error('Error reading file:', err);
        throw err;
    }
	}

	function processFile(filePath: string): string {
			try {
					const fileContents = readFileAsString(filePath);
					const docHash = Cord.Utils.Crypto.hashStr(fileContents);
					//console.log('File contents:', fileContents, docHash);
					return fileContents;
			} catch (err) {
					console.error('Error processing file:', err);
					throw err;
			}
	}

	// Call the function and store the result in a variable
	const filePath = './src/demo_agreement.txt';
	let fileContents = processFile(filePath);

	//const serializedContents = Cord.Utils.Crypto.encodeObjectAsStr(fileContents);
  const docHash = Cord.Utils.Crypto.hashStr(fileContents);
	//console.log('File contents:', fileContents, docHash); // Output the contents of the file
	
  // Step 3: Create a witness entry by the creator
	// For now use the Creator URI as the Document Uri
	let witness_count: number = 2;

  // Step 3: Create assets on-chain (Test)
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
    creatorDid.uri,
    space.uri,
  );

  console.log(`\n❄️  Asset Transaction  - Created by Issuer  `);
  console.dir(assetEntry, {
    depth: null,
    colors: true,
  });

	let extSignCallback = async ({ data }) => ({
    signature: creatorKeys.authentication.sign(data),
    keyType: creatorKeys.authentication.type,
  })

  const extrinsic = await Cord.Asset.dispatchCreateToChain(
      assetEntry,
      networkAuthorityIdentity,
      space.authorization,
			extSignCallback,
    )

  console.log("✅ Asset created!");

	console.log(`\n❄️  Witness Create Transaction  - Created by 'creator'`);
  const extrinsic1 = await Cord.Witness.dispatchCreateToChain(
		creatorDid.uri,
		witness1Did.uri,
		docHash,
		witness_count,
		space.authorization,
		networkAuthorityIdentity,
		extSignCallback,
	)

}
main()
  .then(() => console.log("\nBye! 👋 👋 👋 "))
  .finally(Cord.disconnect);

process.on("SIGINT", async () => {
  console.log("\nBye! 👋 👋 👋 \n");
  Cord.disconnect();
  process.exit(0);
});
