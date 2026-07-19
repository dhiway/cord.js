import * as Cord from '@cord.network/sdk';
import { PalletProfileProfileMetadata } from '@cord.network/augment-api';
import { blake2AsHex, Keyring, Option } from '@cord.network/types';
import { createAccount } from './utils/createAccount.js';
import { DidResolver } from '@cord.network/utils';

async function main() {
  const networkAddress = process.env.NETWORK_ADDRESS || 'ws://127.0.0.1:9944';

  try {
    // 🏦 Network Connection
    console.log(`\n🏦 Connecting to CORD network at ${networkAddress}...`);
    Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK });
    await Cord.connect(networkAddress);
    
    const api = Cord.ConfigService.get('api');
    const runtimeVersion = api.runtimeVersion;
    const runtimeType = runtimeVersion.specName.toString();

    const stashUri = process.env.STASH_URI || '//Alice'; // Default to Alice for dev chains
    const TRANSFER_AMOUNT = 15 * 10**12; // 13 WAY, enough for this script

    console.log(`✅ Connected to CORD runtime: ${runtimeType} (version ${runtimeVersion.specVersion})`);

    console.log('\n👤 Setting up stash account...');
    const keyring = new Keyring({ type: 'sr25519' });
    const stash = keyring.createFromUri(stashUri);
    console.log(`🏦 Stash account: ${stash.address}`);

    console.log('\n👤 Generating random accounts...');
    const { account: account1 } = createAccount();
    const { account: account2 } = createAccount();
    const { account: account3 } = createAccount();
    console.log(`🏦 Account 1: ${account1.address}`);
    console.log(`🏦 Account 2: ${account2.address}`);
    console.log(`🏦 Account 3: ${account3.address}`);

    console.log('\n💸 Funding accounts from stash...');
    const fundPromises = [
      api.tx.balances.transferKeepAlive(account1.address, TRANSFER_AMOUNT),
      api.tx.balances.transferKeepAlive(account2.address, TRANSFER_AMOUNT),
      api.tx.balances.transferKeepAlive(account3.address, TRANSFER_AMOUNT),
    ];

    let acc = 1;
    for (const tx of fundPromises) {
      await new Promise<void>((resolve, reject) => {
        tx.signAndSend(stash, ({ status, dispatchError }) => {
          if (dispatchError) {
            const errorMessage = dispatchError.toString();
            reject(new Error(`Funding account-${acc} failed: ${errorMessage}`));
          } else if (status.isInBlock) {
            console.log(`✅ Funding account-${acc} transaction included in block`);
            resolve();
          }
        }).catch(reject);
      });
      acc += 1;
    }
    console.log('✅ All accounts funded successfully');

    // 📝 Create Profile
    console.log(`\n📝 Creating profile for Alice (${account1.address})...`);
    const rawProfileData = {
      pub_name: 'Alice',
      pub_email: 'alice@example.com',
    };

    // Hash the profile data
    const hashedProfileData = Object.entries(rawProfileData).map(([key, value]) => [
      key,
      blake2AsHex(value),
    ]);

    /* Can also use the below raw format to depict vector of tuples directly into 
     * dispatch function without conversion.
     * 
     * Profile data can be a string or bytes. Recommeded to use hashed values for GDPR/ Privacy compliance.
     * 
     */
    // const profileData: [string, string][] = [
    //   ['pub_name', 'Alice'],
    //   ['pub_email', 'alice@gmail.com'],
    //   ['pub_phone', '0x12dwq34dwhqwegewq5678dw90'],
    // ];

    let profileId: string | null = null;
    try {
      await Cord.Profile.dispatchSetProfileToChain(hashedProfileData, account1);
      console.log('✅ Profile created successfully');

      // Query accountProfiles to get profile-id
      console.log(`\n🔍 Querying accountProfiles for ${account1.address}...`);
      const profileData = (await api.query.profile.accountProfiles(account1.address)) as Option<PalletProfileProfileMetadata>;
      if (!profileData.isNone) {
        profileId = String(profileData.unwrap().toHuman());
        console.log(`✅ Profile ID for Alice: ${profileId}`);
      } else {
        console.error('❌ No profile found for account', account1.address);
        throw new Error(`No profile found for account ${account1.address}`);
      }
    } catch (error) {
      console.error('❌ Profile creation failed:', error instanceof Error ? error.message : error);
    }

    // 📜 Resolve DID Document
    if (profileId) {
      try {
        const { latestKey: latestKey } = await DidResolver.queryProfiles(profileId, api);
        console.log(`\n🔍 Latest Key for profileId: ${profileId}, latestKey: ${latestKey}`);

        console.log(`\n📜 Resolving DID document for did:cord:${profileId}:${latestKey}...`);
        const did = `did:cord:${profileId}:${latestKey}`;
        const didResponse = await DidResolver.resolveDidDoc(did, api);
        console.log('✅ DID Document resolved successfully:');
        console.log(didResponse.doc);

        console.log("\n📜 Verifying PublicMultiBaseKey correctness...");
        const jsonDidDoc = JSON.parse(didResponse.doc);
        console.log('PublicMultiBaseKey:', jsonDidDoc.verificationMethod[0].publicKeyMultibase);
        const accountId = api.createType('AccountId', account1.address);
        const res = await DidResolver.verifyMultibaseKey(jsonDidDoc.verificationMethod[0].publicKeyMultibase, accountId);
        console.log(res ? '✅ PublicMultiBaseKey is correct' : '❌ PublicMultiBaseKey is incorrect');

      } catch (error) {
        console.error('❌ DID resolution failed:', error instanceof Error ? error.message : error);
      }
    }

    // 🔄 Rotate Profile Key
    if (profileId) {
      try {
        console.log(`\n🔄 Rotating profile key to Bob (${account2.address})...`);
        await Cord.Profile.dispatchRotateKeyToChain(account2.address, account1);
        console.log('✅ Key rotated successfully');
      } catch (error) {
        console.error('❌ Key rotation failed:', error instanceof Error ? error.message : error);
      }
    }
  } catch (error) {
    console.error('❌ Failed to connect or execute operations:', error instanceof Error ? error.message : error);
  } finally {
    // 🔌 Disconnect
    console.log('\n🔌 Disconnecting from CORD network...');
    await Cord.disconnect();
    console.log('✅ Disconnected successfully');
  }
}

main().catch((error) => {
  console.error('❌ Unexpected error:', error instanceof Error ? error.message : error);
  process.exit(1);
});
