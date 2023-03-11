import * as Cord from '@cord.network/sdk'

export async function ensureStoredRegistry(
  authorAccount: Cord.CordKeyringPair,
  creator: Cord.DidUri,
  schemaUri: Cord.ISchema['$id'],
  signCallback: Cord.SignExtrinsicCallback
): Promise<Cord.IRegistry> {
  const api = Cord.ConfigService.get('api')

  const registryDetails: Cord.IContents = {
    title: 'Registry v3',
    description: 'Registry for demo',
  }

  const registryType: Cord.IRegistryType = {
    details: registryDetails,
    schema: schemaUri,
    creator: creator,
  }

  const txRegistry: Cord.IRegistry =
    Cord.Registry.fromRegistryProperties(registryType)

  try {
    await Cord.Registry.verifyStored(txRegistry)
    console.log('Registry already stored. Skipping creation')
    return txRegistry
  } catch {
    console.log('Regisrty not present. Creating it now...')
    // Authorize the tx.
    const schemaId = Cord.Schema.idToChain(schemaUri)
    const tx = api.tx.registry.create(txRegistry.details, schemaId)
    const extrinsic = await Cord.Did.authorizeTx(
      creator,
      tx,
      signCallback,
      authorAccount.address
    )
    // Write to chain then return the Schema.
    await Cord.Chain.signAndSubmitTx(extrinsic, authorAccount)

    return txRegistry
  }
}
