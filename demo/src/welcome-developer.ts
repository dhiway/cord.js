import * as Cord from "@cord.network/sdk";
import { createDid } from "../src/utils/generateDid";
import {
  requestJudgement,
  setIdentity,
  setRegistrar,
  provideJudgement,
} from "../src/utils/createRegistrar";
import { addNetworkMember } from "../src/utils/createAuthorities";
/**
    Adding a Developer to Network and Creating a Chainspace.
      This script facilitates adding a developer as a member of the network. Upon execution, 
      it provides essential information for developers to start building.

    Command to Run the Script:
      npx tsx welcome-developer.ts <networkAddress> <sudoAnchorUri> [<authorAnchorUri>] [<chainspaceLimit>]

    Input:
      networkAddress: Address of the network.
      sudoAnchorUri: The sudo anchor URI.
      authorAnchorUri (optional): The author anchor URI. (Default value is //Alice)
      chainspaceLimit (optional): The chainspace limit. (Default value is 1000)

    Output:
      Issuer mnemonic
      Issuer DID
      Chainspace URI
      Chainspace Authorization ID
*/

async function main() {

  const networkAddress = process.argv[2];
  const sudoAnchorUri = process.argv[3];
  const authorAnchorUri = process.argv[4] ? process.argv[4] : "//Alice";
  const chainspaceLimit = process.argv[5] ? parseInt(process.argv[5]) : 1000;

  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK });
  await Cord.connect(networkAddress);

  console.log(`\nCreating the credentials....`)
  const authorityAuthorIdentity = Cord.Utils.Crypto.makeKeypairFromUri(
    sudoAnchorUri,
    "sr25519"
  );

  const authorIdentity = Cord.Utils.Crypto.makeKeypairFromUri(
    authorAnchorUri,
    "sr25519"
  );

  await addNetworkMember(authorityAuthorIdentity, authorIdentity.address);

  const { mnemonic: issuerMnemonic, document: issuerDid } = await createDid(
    authorIdentity
  );
  const issuerKeys = Cord.Utils.Keys.generateKeypairs(
    issuerMnemonic,
    "sr25519"
  );

  const { mnemonic: delegateTwoMnemonic, document: delegateTwoDid } =
    await createDid(authorIdentity);

  const spaceProperties = await Cord.ChainSpace.buildFromProperties(
    issuerDid.uri
  );

  const space = await Cord.ChainSpace.dispatchToChain(
    spaceProperties,
    issuerDid.uri,
    authorIdentity,
    async ({ data }) => ({
      signature: issuerKeys.authentication.sign(data),
      keyType: issuerKeys.authentication.type,
    })
  );

  await Cord.ChainSpace.sudoApproveChainSpace(
    authorityAuthorIdentity,
    space.uri,
    chainspaceLimit
  );
  const permission: Cord.PermissionType = Cord.Permission.ASSERT;
  const spaceAuthProperties =
    await Cord.ChainSpace.buildFromAuthorizationProperties(
      space.uri,
      delegateTwoDid.uri,
      permission,
      issuerDid.uri
    );

  const delegateAuth = await Cord.ChainSpace.dispatchDelegateAuthorization(
    spaceAuthProperties,
    authorIdentity,
    space.authorization,
    async ({ data }) => ({
      signature: issuerKeys.capabilityDelegation.sign(data),
      keyType: issuerKeys.capabilityDelegation.type,
    })
  );

  console.log(`\nThe Author URI:\n${authorAnchorUri}`);
  console.log(`\nIssuer mnemonic:\n${issuerMnemonic}`);
  console.log(`\nIssuer DID:\n${issuerDid.uri}`);
  console.log(`\nThe Chanspace URI:\n${space.uri}`);
  console.log(`\nThe chainspace Authorization ID:\n${space.authorization}`);
}

main()
  .then(() => console.log("\nBye! 👋 👋 👋 "))
  .finally(Cord.disconnect);

process.on("SIGINT", async () => {
  console.log("\nBye! 👋 👋 👋 \n");
  Cord.disconnect();
  process.exit(0);
});