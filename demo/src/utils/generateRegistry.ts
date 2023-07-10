import * as Cord from '@cord.network/sdk'
import { randomUUID } from 'crypto'

/**
 * It creates a registry if it doesn't exist, and returns it
 * @param authorAccount - The account that will be used to sign and submit the extrinsic.
 * @param creator - The DID of the creator of the registry.
 * @param schemaUri - The URI of the schema to be used for the registry.
 * @param signCallback - A callback function that will be called when the transaction needs to be
 * signed.
 * @returns The registry that was created.
 */
export async function ensureStoredRegistry(
  authorAccount: Cord.CordKeyringPair,
  creator: Cord.DidUri,
  schemaUri: Cord.ISchema['$id'],
  signCallback: Cord.SignExtrinsicCallback
): Promise<Cord.IRegistry> {
  const api = Cord.ConfigService.get('api')

  const registryTitle = `Registry v3.${randomUUID().substring(0, 4)}`
  const registryDetails: Cord.IContents = {
    title: registryTitle,
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
    // To create a registry without a schema, use the following line instead:
    // const schemaId = null
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

/**
 * `addRegistryAdminDelegate` adds an admin delegate to a registry
 * @param authorAccount - The account that will be used to sign and submit the extrinsic.
 * @param creator - The DID of the creator of the registry.
 * @param registryUri - The URI of the registry you want to add the admin to.
 * @param adminAuthority - The DID of the admin authority to add.
 * @param signCallback - A callback function that will be called when the transaction needs to be
 * signed.
 * @returns The authorization id.
 */
export async function addRegistryAdminDelegate(
  authorAccount: Cord.CordKeyringPair,
  creator: Cord.DidUri,
  registryUri: Cord.IRegistry['identifier'],
  adminAuthority: Cord.DidUri,
  signCallback: Cord.SignExtrinsicCallback
): Promise<Cord.AuthorizationId> {
  const api = Cord.ConfigService.get('api')

  const authId = Cord.Registry.getAuthorizationIdentifier(
    registryUri,
    adminAuthority,
    creator
  )

  try {
    await Cord.Registry.verifyAuthorization(authId)
    console.log('Registry Authorization already stored. Skipping addition')
    return authId
  } catch {
    console.log('Regisrty Authorization not present. Creating it now...')
    // Authorize the tx.
    const registryId = Cord.Registry.uriToIdentifier(registryUri)
    const delegateId = Cord.Did.toChain(adminAuthority)
    const tx = api.tx.registry.addAdminDelegate(registryId, delegateId)
    const extrinsic = await Cord.Did.authorizeTx(
      creator,
      tx,
      signCallback,
      authorAccount.address
    )
    // Write to chain then return the Schema.
    await Cord.Chain.signAndSubmitTx(extrinsic, authorAccount)

    return authId
  }
}

/**
 * `addRegistryDelegate` adds a delegate to a registry
 * @param authorAccount - The account that will be used to sign and submit the extrinsic.
 * @param creator - The DID of the account that will be creating the authorization.
 * @param registryUri - The URI of the registry you want to add the delegate to.
 * @param registryDelegate - The DID of the delegate to add to the registry.
 * @param signCallback - A callback function that will be called when the transaction needs to be
 * signed.
 * @returns The authorization id
 */
export async function addRegistryDelegate(
  authorAccount: Cord.CordKeyringPair,
  creator: Cord.DidUri,
  registryUri: Cord.IRegistry['identifier'],
  registryDelegate: Cord.DidUri,
  signCallback: Cord.SignExtrinsicCallback
): Promise<Cord.AuthorizationId> {
  const api = Cord.ConfigService.get('api')

  const authId = Cord.Registry.getAuthorizationIdentifier(
    registryUri,
    registryDelegate,
    creator
  )

  try {
    await Cord.Registry.verifyAuthorization(authId)
    console.log('Registry Authorization already stored. Skipping addition')
    return authId
  } catch {
    console.log('Regisrty Authorization not present. Creating it now...')
    // Authorize the tx.
    const registryId = Cord.Registry.uriToIdentifier(registryUri)
    const delegateId = Cord.Did.toChain(registryDelegate)

    const tx = api.tx.registry.addDelegate(registryId, delegateId)
    const extrinsic = await Cord.Did.authorizeTx(
      creator,
      tx,
      signCallback,
      authorAccount.address
    )
    // Write to chain then return the Schema.
    await Cord.Chain.signAndSubmitTx(extrinsic, authorAccount)

    return authId
  }
}
