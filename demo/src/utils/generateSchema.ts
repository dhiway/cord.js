import * as Cord from '@cord.network/sdk'

// import { generateAccount } from './generateAccount'
// import { generateKeypairs } from './generateKeypairs'
// import { getSchema } from './testSchema'

export async function ensureStoredSchema(
  authorAccount: Cord.CordKeyringPair,
  creator: Cord.DidUri,
  signCallback: Cord.SignExtrinsicCallback
): Promise<Cord.ISchema> {
  const api = Cord.ConfigService.get('api')

  const schema = Cord.Schema.fromProperties('Test Demo Schema v1', {
    name: {
      type: 'string',
    },
    age: {
      type: 'integer',
    },
    gender: {
      type: 'string',
    },
    credit: {
      type: 'integer',
    },
  })

  // Get the Schema and see if it's stored, if yes return it.
  // const schema = getSchema()
  try {
    await Cord.Schema.verifyStored(schema)
    console.log('Schema already stored. Skipping creation')
    return schema
  } catch {
    console.log('Schema not present. Creating it now...')
    // Authorize the tx.
    const encodedSchema = Cord.Schema.toChain(schema)
    const tx = api.tx.schema.create(encodedSchema)
    const extrinsic = await Cord.Did.authorizeTx(
      creator,
      tx,
      signCallback,
      authorAccount.address
    )

    // Write to chain then return the Schema.
    await Cord.Chain.signAndSubmitTx(extrinsic, authorAccount)

    return schema
  }
}
