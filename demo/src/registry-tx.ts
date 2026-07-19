import * as Cord from '@cord.network/sdk';
import { RegistryPermissionVariant } from '@cord.network/types';
import { blake2AsHex, Keyring } from '@cord.network/types';
import { createAccount } from './utils/createAccount.js';

async function main() {
  const networkAddress = process.env.NETWORK_ADDRESS || 'ws://127.0.0.1:9944';
  const stashUri = process.env.STASH_URI || '//Alice'; // Default to Alice for dev chains
  const TRANSFER_AMOUNT = 13 * 10**12; // 13 WAY, which is just enough for this script to complete :)

  try {
    console.log(`\n🏦 Connecting to CORD network at ${networkAddress}...`);
    Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK });
    await Cord.connect(networkAddress);

    const api = Cord.ConfigService.get('api');
    const runtimeVersion = api.runtimeVersion;
    const runtimeType = runtimeVersion.specName.toString();
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

    var acc = 1;
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

    console.log(`\n📝 Creating profile for Account 1 (${account1.address})...`);

    let rawProfileData = {
      pub_name: 'Account 1',
      pub_email: 'account1@example.com',
    };

    // Hash the profile data
    let hashedProfileData = Object.entries(rawProfileData).map(([key, value]) => [
      key,
      blake2AsHex(value),
    ]);

    try {
      await Cord.Profile.dispatchSetProfileToChain(hashedProfileData, account1);
      console.log('✅ Account 1 Profile created successfully\n');

      let blob = {
        name: 'Account 1',
        email: 'account1@example.com',
      };

      let stringified_blob = JSON.stringify(blob);
      let tx_hash = await Cord.Registry.getDigestFromRawData(stringified_blob);

      console.log('\n🔄 Creating a Registry...');
      const registryProperties = await Cord.Registry.registryCreateProperties(
        tx_hash,
        stringified_blob
      );

      console.dir(registryProperties, { depth: 5, colors: true });

      await Cord.Registry.dispatchCreateToChain(registryProperties, account1);
      console.log('✅ Registry created successfully\n');

      const identifier = await new Promise<string>((resolve, reject) => {
        let unsubscribe: () => void;
        api.query.system.events((events) => {
          events.forEach(({ phase, event }) => {
            if (phase.isApplyExtrinsic && api.events.registry.RegistryCreated.is(event)) {
              console.log("'Registry Created' Event Data", event.data.toHuman());
              const identifier = event.data[0].toHuman();
              resolve(identifier);
              if (unsubscribe) unsubscribe();
            }
          });
        }).then((unsub) => {
          unsubscribe = unsub;
        });

        setTimeout(() => {
          if (unsubscribe) unsubscribe();
          reject(new Error('Timeout: RegistryCreated event not found'));
        }, 10_000); // 10s
      });

      console.log(`✅ Registry created with identifier: ${identifier}`);
      const registryId = identifier;

      console.log('\n🔄 Updating the Registry Creator...');

      console.log(`\n📝 Creating profile for Account 2 (${account2.address})...`);

      rawProfileData = {
        pub_name: 'Account 2',
        pub_email: 'account2@example.com',
      };

      // Hash the profile data
      hashedProfileData = Object.entries(rawProfileData).map(([key, value]) => [
        key,
        blake2AsHex(value),
      ]);

      await Cord.Profile.dispatchSetProfileToChain(hashedProfileData, account2);
      console.log('✅ Account 2 Profile created successfully\n');

      await Cord.Registry.dispatchUpdateCreator(registryId, account2.address, account1);
      console.log('✅ Registry creator updated successfully');

      console.log('\n🔄 Updating the Registry TxHash and Blob...');

      blob = {
        name: 'Account 2',
        email: 'account2@example.com',
      };
      stringified_blob = JSON.stringify(blob);
      tx_hash = await Cord.Registry.getDigestFromRawData(stringified_blob);

      const registryUpdateProperties = await Cord.Registry.registryUpdateHashProperties(
        registryId,
        tx_hash,
        stringified_blob
      );

      console.dir(registryUpdateProperties, { depth: 5, colors: true });

      await Cord.Registry.dispatchUpdateRegistryHashToChain(registryUpdateProperties, account2);
      console.log('✅ Registry updated successfully');

      console.log('\n📝 Adding delegate with Entry and Delegate roles...');

      rawProfileData = {
        pub_name: 'Account 3',
        pub_email: 'account3@example.com',
      };

      // Hash the profile data
      hashedProfileData = Object.entries(rawProfileData).map(([key, value]) => [
        key,
        blake2AsHex(value),
      ]);

      console.log(`\n📝 Creating profile for Account 3 (${account3.address})...`);
      await Cord.Profile.dispatchSetProfileToChain(hashedProfileData, account3);
      console.log('✅ Account 3 Profile created successfully');

      await Cord.Registry.dispatchAddDelegateToChain(
        registryId,
        account3.address,
        [RegistryPermissionVariant.Entry, RegistryPermissionVariant.Delegate],
        account2
      );
      console.log('\n✅ Delegate added');

      console.log('\n📝 Removing delegate with Entry and Delegate roles...');

      await Cord.Registry.dispatchRemoveDelegateToChain(registryId, account3.address, account2);
      console.log('\n✅ Delegate removed');

      console.log('\n📝 Archiving the registry...');

      await Cord.Registry.dispatchArchiveRegistryToChain(registryId, account2);
      console.log('\n✅ Registry archived');

      console.log('\n📝 Restoring the Archived registry...');

      await Cord.Registry.dispatchRestoreRegistryToChain(registryId, account2);
      console.log('\n✅ Archived Registry Restored');
    } catch (error) {
      console.error('❌ Profile or registry operation failed:', error instanceof Error ? error.message : error);
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
