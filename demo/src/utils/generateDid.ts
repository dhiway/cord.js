import * as Cord from '@cord.network/sdk'
import { mnemonicGenerate } from '@polkadot/util-crypto'
import { generateAccount } from './generateAccount'
import { generateKeypairs } from './generateKeypairs'

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

export async function createFullDid(
  submitterAccount: Cord.CordKeyringPair
): Promise<{
  mnemonic: string
  fullDid: Cord.DidDocument
}> {
  const api = Cord.ConfigService.get('api')

  const mnemonic = mnemonicGenerate()
  const {
    authentication,
    keyAgreement,
    assertionMethod,
    capabilityDelegation,
  } = generateKeypairs(mnemonic)
  // Get tx that will create the DID on chain and DID-URI that can be used to resolve the DID Document.
  const fullDidCreationTx = await Cord.Did.getStoreTx(
    {
      authentication: [authentication],
      keyAgreement: [keyAgreement],
      assertionMethod: [assertionMethod],
      capabilityDelegation: [capabilityDelegation],
    },
    submitterAccount.address,
    async ({ data }) => ({
      signature: authentication.sign(data),
      keyType: authentication.type,
    })
  )

  await Cord.Chain.signAndSubmitTx(fullDidCreationTx, submitterAccount)
  // await sleep(6000)

  const didUri = Cord.Did.getFullDidUriFromKey(authentication)
  console.log(didUri, Cord.Did.toChain(didUri), typeof Cord.Did.toChain(didUri))

  const newDid = {
    did: Cord.Did.toChain(didUri),
  }

  // const { metadata, document } = await Cord.Did.resolve(didUri)

  // const encodedFullDid = await api.call.did.query(Cord.Did.toChain(didUri))
  // const encodedFullDid = await api.call.did.query(didUri)

  // await api.call.did.query(Cord.Did.toChain(didUri))
  const encodedFullDidi = (await api.query.did.did) ?? Cord.Did.toChain(didUri)
  console.log(encodedFullDidi)

  const encodedFullDid = await api.call.did.query(newDid.did)
  console.log(encodedFullDid)

  // const encodedFullDid = (await api.call.did.query) ?? 'abs'
  const { document } = Cord.Did.linkedInfoFromChain(encodedFullDid)
  console.log(document)

  if (!document) {
    throw new Error('Full DID was not successfully created.')
  }

  return { mnemonic, fullDid: document }
}
