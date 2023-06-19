import * as Cord from '@cord.network/sdk'
import { Crypto } from '@cord.network/utils'
import { createDid } from './utils/generateDid'
import { generateKeypairs } from './utils/generateKeypairs'

export async function createCustomSchema(
  schemaTitle: string,
  fieldsAsJsonObject: object
): Promise<Cord.ISchema> {
  const networkAddress = 'wss://sparknet.cord.network'
  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK })
  await Cord.connect(networkAddress)
  const api = Cord.ConfigService.get('api')
  const Alice = Crypto.makeKeypairFromUri('//Sparknet//1//Demo', 'sr25519')
  const { mnemonic: aliceMnemonic, document: aliceDid } = await createDid(Alice)
  const aliceKeys = await generateKeypairs(aliceMnemonic)
  const schema = Cord.Schema.fromProperties(
    schemaTitle,
    fieldsAsJsonObject,
    aliceDid.uri
  )
  try {
    await Cord.Schema.verifyStored(schema)
    console.log('Schema already present\n')
    console.log('Schema: \n', schema)
    Cord.disconnect()
    return schema
  } catch {
    console.log('Schema not present. Creating it now...')
    // Authorize the tx.
    const encodedSchema = Cord.Schema.toChain(schema)
    const tx = api.tx.schema.create(encodedSchema)
    const extrinsic = await Cord.Did.authorizeTx(
      aliceDid.uri,
      tx,
      async ({ data }) => ({
        signature: aliceKeys.assertionMethod.sign(data),
        keyType: aliceKeys.assertionMethod.type,
      }),
      Alice.address
    )
    // Write to chain then return the Schema.
    await Cord.Chain.signAndSubmitTx(extrinsic, Alice)
    Cord.disconnect()
    console.log('Schema: \n', schema)
    return schema
  }
}

createCustomSchema('Test', {
  name: { type: 'string' },
  cordAddress: { type: 'string' },
})
