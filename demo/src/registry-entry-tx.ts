import * as Cord from '@cord.network/sdk';
import { blake2AsHex } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/keyring';
import { createAccount } from './utils/createAccount.js';

const TIMEOUT = 10_000; // 10s timeout for event listeners

/**
 * Waits for a specific chain event and extracts a field from its data.
 * @param api - CORD API instance.
 * @param eventCheck - Function to check if an event matches.
 * @param fieldIndex - Index of the field to extract from event data.
 * @returns Promise resolving to the extracted field value.
 */
async function waitForEvent(api, eventCheck, fieldIndex) {
  return new Promise((resolve, reject) => {
    let unsubscribe;
    api.query.system.events((events) => {
      events.forEach(({ phase, event }) => {
        if (phase.isApplyExtrinsic && eventCheck(event)) {
          const fieldValue = event.data[fieldIndex].toHuman();
          resolve(fieldValue);
          if (unsubscribe) unsubscribe();
        }
      });
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    setTimeout(() => {
      if (unsubscribe) unsubscribe();
      reject(new Error('Timeout: Event not found'));
    }, TIMEOUT);
  });
}

async function main() {
  const networkAddress = process.env.NETWORK_ADDRESS || 'ws://127.0.0.1:9944';
  const stashUri = process.env.STASH_URI || '//Alice';
  const TRANSFER_AMOUNT = 30 * 10 ** 12; // 30 WAY for transactions

  try {
    console.log(`\n🏦 Connecting to CORD at ${networkAddress}...`);
    Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK });
    await Cord.connect(networkAddress);

    const api = Cord.ConfigService.get('api');
    console.log(`✅ Connected to ${api.runtimeVersion.specName} (v${api.runtimeVersion.specVersion})`);

    const keyring = new Keyring({ type: 'sr25519' });
    const stash = keyring.createFromUri(stashUri);
    console.log(`🏦 Stash: ${stash.address}`);

    console.log('\n👤 Generating accounts...');
    const accounts = [createAccount(), createAccount(), createAccount()]
      .map(({ account }, i) => {
        console.log(`🏦 Account ${i + 1}: ${account.address}`);
        return account;
      });

    console.log('\n💸 Funding accounts...');
    const fundTxs = accounts.map((account) =>
      api.tx.balances.transferKeepAlive(account.address, TRANSFER_AMOUNT)
    );

    for (const [i, tx] of fundTxs.entries()) {
      await new Promise((resolve, reject) => {
        tx.signAndSend(stash, ({ status, dispatchError }) => {
          if (dispatchError) {
            reject(new Error(`Funding account ${i + 1} failed: ${dispatchError}`));
          } else if (status.isInBlock) {
            console.log(`✅ Funded account ${i + 1}`);
            resolve();
          }
        }).catch(reject);
      });
    }

    // 📝 Profile for Account 1
    console.log('\n📝 Creating profile for Account 1...');
    const rawProfileData1 = {
      pub_name: 'Account 1',
      pub_email: 'account1@example.com',
    };
    const hashedProfileData1 = Object.entries(rawProfileData1).map(([key, value]) => [
      key,
      blake2AsHex(value),
    ]);

    await Cord.Profile.dispatchSetProfileToChain(hashedProfileData1, accounts[0]);
    const profileIdentifier1 = await waitForEvent(
      api,
      (event) => api.events.profile.ProfileSet.is(event),
      1
    );
    console.log(`✅ Profile set for Account 1 with ID: ${profileIdentifier1}`);

    // 📝 Profile for Account 2 (new owner)
    console.log('\n📝 Creating profile for Account 2...');
    const rawProfileData2 = {
      pub_name: 'Account 2',
      pub_email: 'account2@example.com',
    };
    const hashedProfileData2 = Object.entries(rawProfileData2).map(([key, value]) => [
      key,
      blake2AsHex(value),
    ]);

    await Cord.Profile.dispatchSetProfileToChain(hashedProfileData2, accounts[1]);
    const profileIdentifier2 = await waitForEvent(
      api,
      (event) => api.events.profile.ProfileSet.is(event),
      1
    );
    console.log(`✅ Profile set for Account 2 with ID: ${profileIdentifier2}`);

    // 🔄 Create Registry
    console.log('\n🔄 Creating registry...');
    const registryBlob = {
      title: 'User Credentials',
      description: 'Registry for user data',
    };
    const registryStringifiedBlob = JSON.stringify(registryBlob);
    const registryTxHash = await Cord.Registry.getDigestFromRawData(registryStringifiedBlob);

    const registryProperties = await Cord.Registry.registryCreateProperties(
      registryTxHash,
      registryStringifiedBlob
    );
    await Cord.Registry.dispatchCreateToChain(registryProperties, accounts[0]);

    const identifier = await waitForEvent(
      api,
      (event) => api.events.registry.RegistryCreated.is(event),
      0
    );
    const registryUri = `registry:cord:${identifier}`;
    console.log(`✅ Registry created with URI: ${registryUri}`);

    // 📝 Create Registry Entry
    console.log('\n📝 Creating registry entry...');
    const entryBlob = {
      credentialId: 'cred123',
      issuedTo: 'Account 1',
      validUntil: '2025-12-31',
    };
    const entryStringifiedBlob = JSON.stringify(entryBlob);
    const entryTxHash = await Cord.Registry.getDigestFromRawData(entryStringifiedBlob);

    const entryProperties = await Cord.Entry.createEntriesProperties(
      registryUri,
      entryTxHash,
      entryStringifiedBlob
    );
    await Cord.Entry.dispatchCreateEntryToChain(entryProperties, accounts[0]);

    const entryIdentifier = await waitForEvent(
      api,
      (event) => api.events.entry.RegistryEntryCreated.is(event),
      2
    );
    const entryUri = `entry:cord:${entryIdentifier}`;
    console.log(`✅ Entry created with URI: ${entryUri}`);

    // 🔄 Update Registry Entry
    console.log('\n🔄 Updating registry entry...');
    const updatedEntryBlob = {
      credentialId: 'cred123',
      issuedTo: 'Account 1',
      validUntil: '2026-06-30',
    };
    const updatedEntryStringifiedBlob = JSON.stringify(updatedEntryBlob);
    const updatedEntryTxHash = await Cord.Registry.getDigestFromRawData(updatedEntryStringifiedBlob);

    const updateProperties = await Cord.Entry.updateEntriesProperties(
      registryUri,
      entryUri,
      updatedEntryTxHash,
      updatedEntryStringifiedBlob
    );
    await Cord.Entry.dispatchUpdateEntryToChain(updateProperties, accounts[0]);
    console.log('✅ Entry updated');

    // ❄️ Verify Entry
    console.log('\n❄️ Verifying entry...');
    const verificationResult = await Cord.Entry.verifyAgainstInputProperties(
      entryUri,
      updatedEntryTxHash,
      `did:cord:3${profileIdentifier1}`,
      registryUri
    );
    console.log(
      verificationResult.isValid
        ? `✅ Verification successful: ${entryUri}`
        : `🚫 Verification failed: ${verificationResult.message}`
    );

    // 🛑 Revoke Entry
    console.log('\n🛑 Revoking entry...');
    await Cord.Entry.dispatchRevokeEntryToChain(registryUri, entryUri, accounts[0]);
    console.log('✅ Entry revoked');

    // ❄️ Verify Revocation
    console.log('\n❄️ Verifying revocation...');
    const revokedDetails = await Cord.Entry.fetchRegistryEntryDetailsFromChain(entryUri);
    console.log(
      revokedDetails.revoked
        ? `✅ Entry ${entryUri} is revoked`
        : `🚫 Revocation not applied`
    );

    // 🔄 Reinstate Entry
    console.log('\n🔄 Reinstating entry...');
    await Cord.Entry.dispatchReinstateEntryToChain(registryUri, entryUri, accounts[0]);
    console.log('✅ Entry reinstated');

    // ❄️ Verify Reinstatement
    console.log('\n❄️ Verifying reinstatement...');
    const reinstatedDetails = await Cord.Entry.fetchRegistryEntryDetailsFromChain(entryUri);
    console.log(
      !reinstatedDetails.revoked
        ? `✅ Entry ${entryUri} is active`
        : `🚫 Reinstatement not applied`
    );

    // 🔄 Transfer Ownership
    console.log('\n🔄 Transferring ownership to Account 2...');

		await Cord.Registry.dispatchAddDelegateToChain(
			registryUri,
			accounts[1].address,
			[Cord.RegistryPermissionVariant.Entry],
			accounts[0]
		);
		console.log('\n✅ Delegate added');

    await Cord.Entry.dispatchUpdateOwnershipToChain(
      registryUri,
      entryUri,
      accounts[1].address,
      accounts[0]
    );
    console.log(`✅ Ownership transferred to ${accounts[1].address}`);

    // ❄️ Verify Ownership
    console.log('\n❄️ Verifying ownership...');
    const ownershipDetails = await Cord.Entry.fetchRegistryEntryDetailsFromChain(entryUri);
    const expectedCreatorUri = `did:cord:3${profileIdentifier2}`;
    console.log(
      ownershipDetails.creatorUri === expectedCreatorUri
        ? `✅ Ownership updated to Account 2 (creatorUri: ${expectedCreatorUri})`
        : `🚫 Ownership not updated: got ${ownershipDetails.creatorUri}, expected ${expectedCreatorUri}`
    );

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
  } finally {
    console.log('\n🔌 Disconnecting from CORD...');
    await Cord.disconnect();
    console.log('✅ Disconnected');
  }
}

main().catch((error) => {
  console.error('❌ Unexpected error:', error instanceof Error ? error.message : error);
  process.exit(1);
});
