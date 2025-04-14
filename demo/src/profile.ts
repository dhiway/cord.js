import * as Cord from '@cord.network/sdk';

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
    console.log(`✅ Connected to CORD runtime: ${runtimeType} (version ${runtimeVersion.specVersion})`);

    // 👤 Setup Network Members
    console.log('\n👤 Setting up network members...');
    const alice = Cord.Utils.Crypto.makeKeypairFromUri(
      process.env.ANCHOR_URI || '//Alice',
      'sr25519'
    );
    const bob = Cord.Utils.Crypto.makeKeypairFromUri(
      process.env.ANCHOR_URI || '//Bob',
      'sr25519'
    );
    console.log(`🏦 Member 1 (Alice): ${alice.address}`);
    console.log(`🏦 Member 2 (Bob): ${bob.address}`);

    // 📝 Create Profile for Alice
    console.log(`\n📝 Creating profile for Alice (${alice.address})...`);

    // 🔑 Set Profile Data
    const jsonProfileData = { "pub_name": "Alice", "pub_email": "alice@example.com" };
    const profileData = Cord.Profile.jsonToProfileData(jsonProfileData);
   
    /* Can also use the below raw format to depict vector of tuples directly into 
     * dispatch function without conversion 
     */
    // const profileData: [string, string][] = [
    //   ['pub_name', 'Alice'],
    //   ['pub_email', 'alice@gmail.com'],
    // ];

    try {
      await Cord.Profile.dispatchSetProfileToChain(profileData, alice);
      console.log('✅ Profile created successfully');

      // 🔄 Rotate Profile Key
      console.log(`🔄 Rotating profile key to Bob (${bob.address})...`);
      await Cord.Profile.dispatchRotateKeyToChain(bob.address, alice);
      console.log('✅ Key rotated successfully');

    } catch (error) {
      console.error('❌ Profile or key rotation failed:', error instanceof Error ? error.message : error);
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
