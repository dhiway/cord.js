import * as Cord from '@cord.network/sdk'

export async function ensureStoredChainSpace(
  authorAccount: Cord.CordKeyringPair,
  creator: Cord.DidUri,
  signCallback: Cord.SignExtrinsicCallback
): Promise<Cord.IChainSpace> {
  const api = Cord.ConfigService.get('api')

  const txSpace: Cord.IChainSpace = await Cord.ChainSpace.createChainSpace(
    creator
  )

  const exists = await Cord.ChainSpace.isChainSpaceStored(txSpace.identifier)
  if (exists) {
    console.log('Space already exists. Skipping creation')
    return txSpace
  } else {
    console.log('Space not present. Creating it now...')

    const tx = api.tx.chainSpace.create(txSpace.digest)
    const extrinsic = await Cord.Did.authorizeTx(
      creator,
      tx,
      signCallback,
      authorAccount.address
    )

    await Cord.Chain.signAndSubmitTx(extrinsic, authorAccount)

    return txSpace
  }
}

export async function approveSpace(
  authority: Cord.KeyringPair,
  spaceUri: Cord.IChainSpace['identifier']
) {
  const api = Cord.ConfigService.get('api')
  const spaceId = Cord.Identifier.uriToIdentifier(spaceUri)

  const callTx = api.tx.chainSpace.approve(spaceId, 1000)
  const sudoTx = api.tx.sudo.sudo(callTx)

  await Cord.Chain.signAndSubmitTx(sudoTx, authority)
}

export async function addSpaceAuthorization(
  authorAccount: Cord.CordKeyringPair,
  spaceDelegate: Cord.DidUri,
  creator: Cord.DidUri,
  spaceUri: Cord.IChainSpace['identifier'],
  authUri: Cord.IChainSpace['authorization'],
  signCallback: Cord.SignExtrinsicCallback
): Promise<Cord.ISpaceAuthorization> {
  const api = Cord.ConfigService.get('api')

  const spaceId = Cord.Identifier.uriToIdentifier(spaceUri)
  const authId = Cord.Identifier.uriToIdentifier(authUri)
  const delegateId = Cord.Did.toChain(spaceDelegate)

  const delegateAuthId = await Cord.ChainSpace.createChainSpaceDelegate(
    spaceUri,
    spaceDelegate,
    creator
  )
  const authorizationExists = await Cord.ChainSpace.isAuthorizationStored(
    delegateAuthId.authorization
  )
  if (authorizationExists) {
    console.log('Authorization already stored. Skipping addition')
  } else {
    console.log('Authorization not present. Creating it now...')

    const tx = api.tx.chainSpace.addDelegate(spaceId, delegateId, authId)
    const extrinsic = await Cord.Did.authorizeTx(
      creator,
      tx,
      signCallback,
      authorAccount.address
    )

    await Cord.Chain.signAndSubmitTx(extrinsic, authorAccount)
  }
  return delegateAuthId
}

// export async function addSpaceAdminAuthorization(
//   authorAccount: Cord.CordKeyringPair,
//   creator: Cord.DidUri,
//   spaceUri: Cord.IChainSpace['spaceId'],
//   authUri: Cord.IChainSpace['authorizationId'],
//   spaceDelegate: Cord.DidUri,
//   signCallback: Cord.SignExtrinsicCallback
// ): Promise<Cord.AuthorizationId> {
//   const api = Cord.ConfigService.get('api')

//   const spaceId = Cord.Identifier.uriToIdentifier(spaceUri)
//   const authId = Cord.Identifier.uriToIdentifier(authUri)
//   const delegateId = Cord.Did.toChain(spaceDelegate)

//   try {
//     await Cord.ChainSpace.isAuthorization(authId)
//     console.log('Authorization already stored. Skipping addition')
//     return authId
//   } catch {
//     console.log('Authorization not present. Creating it now...')
//     const tx = api.tx.chainSpace.addAdminDelegate(spaceId, delegateId, authId)
//     const extrinsic = await Cord.Did.authorizeTx(
//       creator,
//       tx,
//       signCallback,
//       authorAccount.address
//     )
//     await Cord.Chain.signAndSubmitTx(extrinsic, authorAccount)

//     return authId
//   }
// }
