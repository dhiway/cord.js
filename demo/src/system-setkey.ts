import * as Cord from '@cord.network/sdk'

const {
  KEY_SEED,
  SESSIONKEYS,
} = process.env;

async function main() {
  if (!KEY_SEED || !SESSIONKEYS) {
      console.log("Missing ENV variables (KEY_SEED || SESSIONKEYS)");
      return;
  }
  const networkAddress = 'ws://127.0.0.1:9944'
  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK })
  await Cord.connect(networkAddress)
  const api = Cord.ConfigService.get('api')

  try {
      const nodeKey = await Cord.Utils.Crypto.makeKeypairFromUri(
	  KEY_SEED,
	  'ed25519'
      )
      console.log (api.tx);
      
      const tx = api.tx.session.setKeys(SESSIONKEYS, "0x00")
      await Cord.Chain.signAndSubmitTx(tx, nodeKey)
  } catch (err) {
      console.log("Failed to execute setKeys method", err);
  }
}

main()
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(Cord.disconnect)

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})
