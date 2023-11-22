import * as Cord from '@cord.network/sdk'

/**
 * It checks if the schema is already stored on chain, and if not, it creates it
 * @param authorAccount - The account that will be used to sign and submit the extrinsic.
 * @param creator - The DID of the schema creator.
 * @param signCallback - A callback function that will be called when the DID module needs to sign a
 * transaction.
 * @returns The schema is being returned.
 */
export async function ensureStoredSchema(
  authorAccount: Cord.CordKeyringPair,
  creator: Cord.DidUri,
  signCallback: Cord.SignExtrinsicCallback
): Promise<Cord.ISchema> {
  const api = Cord.ConfigService.get('api')

  // TODO: Enable required field support within subschemas
  const schema = Cord.Schema.fromProperties(
    'Test Demo Schema v2',
    {
      name: {
        type: 'string',
      },
      age: {
        type: 'integer',
      },
      id: {
        type: 'string',
      },
      country: {
        type: 'string',
      },
      address: {
        type: 'object',
        properties: {
          street: { type: 'string' },
          pin: { type: 'integer' },
          location: {
            type: 'object',
            properties: {
              state: { type: 'string' },
              country: { type: 'string' },
            },
          },
        },
      },
    },
    ['name', 'id', 'age'],
    creator
  )

  const exists = await Cord.Schema.isSchemaStored(schema)
  if (exists) {
    console.log('Schema already stored. Skipping creation')
    return schema
  } else {
    console.log('Schema not present. Creating it now...')

    const encodedSchema = Cord.Schema.toChain(schema)
    const tx = api.tx.schema.create(encodedSchema)
    const extrinsic = await Cord.Did.authorizeTx(
      creator,
      tx,
      signCallback,
      authorAccount.address
    )

    await Cord.Chain.signAndSubmitTx(extrinsic, authorAccount)

    return schema
  }
}
