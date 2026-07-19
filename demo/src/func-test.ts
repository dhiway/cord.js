import * as Cord from '@cord.network/sdk'
import { addNetworkMember } from './utils/createAuthorities'
import { createAccount } from './utils/createAccount'

import BN from 'bn.js';

async function main() {
  const networkAddress = process.env.NETWORK_ADDRESS
    ? process.env.NETWORK_ADDRESS
    : 'ws://127.0.0.1:9944'

  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK })
  await Cord.connect(networkAddress)

  const api = Cord.ConfigService.get('api');

  // Retrieve the runtime version & the type of the runtime.
  const runtimeVersion = api.runtimeVersion;
  
  const runtimeType = runtimeVersion.specName.toString();

  console.log("\n❄️ Connected to CORD runtime type:", runtimeType);

  // Step 1: Setup Membership
  // Setup transaction author account - CORD Account.
  console.log(`\n❄️  New Network Member`)
  const authorityAuthorIdentity = Cord.Utils.Crypto.makeKeypairFromUri(
    process.env.ANCHOR_URI ? process.env.ANCHOR_URI : '//Alice',
    'sr25519'
  )
  // Setup network authority account.
  const { account: authorityIdentity } = await createAccount()
  console.log(
    `🏦  Member (${authorityIdentity.type}): ${authorityIdentity.address}`
  )
  await addNetworkMember(authorityAuthorIdentity, authorityIdentity.address)
  console.log('✅ Network Authority created!\n')

  // Setup network member account for author.
  const { account: authorIdentity } = await createAccount()
  console.log(`🏦  Author Member (${authorIdentity.type}): ${authorIdentity.address}`)
  await addNetworkMember(authorityAuthorIdentity, authorIdentity.address)
  console.log('✅ Network Member added!\n')

  // Transfer funds for author identity.
  let author_id_tx = await api.tx.balances.transferAllowDeath(authorIdentity.address, new BN('1000000000000000'));
  await Cord.Chain.signAndSubmitTx(author_id_tx, authorityAuthorIdentity);

  // Setup network member account for holder.
  const { account: holderIdentity } = await createAccount()
  console.log(`🏦  Holder Member (${holderIdentity.type}): ${holderIdentity.address}`)
  await addNetworkMember(authorityAuthorIdentity, holderIdentity.address)
  console.log('✅ Network Member added!\n')

  // Transfer funds for holder identity.
  let holder_id_tx = await api.tx.balances.transferAllowDeath(holderIdentity.address, new BN('1000000000000000'));
  await Cord.Chain.signAndSubmitTx(holder_id_tx, authorityAuthorIdentity);

  // Setup network member account for verifier.
  const { account: verifierIdentity } = await createAccount()
  console.log(`🏦  Verifier Member (${verifierIdentity.type}): ${verifierIdentity.address}`)
  await addNetworkMember(authorityAuthorIdentity, verifierIdentity.address)
  console.log('✅ Network Member added!\n')

  // Transfer funds for verifier identity.
  let verifier_id_tx = await api.tx.balances.transferAllowDeath(verifierIdentity.address, new BN('1000000000000000'));
  await Cord.Chain.signAndSubmitTx(verifier_id_tx, authorityAuthorIdentity);

  // Setup network member account for delegate 1.
  const { account: delegate_1_Identity } = await createAccount()
  console.log(`🏦  Delegate 1 Member (${delegate_1_Identity.type}): ${delegate_1_Identity.address}`)
  await addNetworkMember(authorityAuthorIdentity, delegate_1_Identity.address)
  console.log('✅ Network Member added!\n')

  // Transfer funds for delegate 1 identity.
  let delegate_1_tx = await api.tx.balances.transferAllowDeath(delegate_1_Identity.address, new BN('1000000000000000'));
  await Cord.Chain.signAndSubmitTx(delegate_1_tx, authorityAuthorIdentity);

  // Setup network member account for delegate 2.
  const { account: delegate_2_Identity } = await createAccount()
  console.log(`🏦  Delegate 2 Member (${delegate_2_Identity.type}): ${delegate_2_Identity.address}`)
  await addNetworkMember(authorityAuthorIdentity, delegate_2_Identity.address)
  console.log('✅ Network Member added!\n')

  // Transfer funds for delegate 1 identity.
  let delegate_2_tx = await api.tx.balances.transferAllowDeath(delegate_2_Identity.address, new BN('1000000000000000'));
  await Cord.Chain.signAndSubmitTx(delegate_2_tx, authorityAuthorIdentity);

  console.log(`\n❄️  Unsupported Modules `)
  console.log(
    'Skipping Did, ChainSpace, Schema, and Statement flows because they are no longer supported.'
  )
}
main()
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(Cord.disconnect)

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})
