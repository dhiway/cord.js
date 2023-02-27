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
  console.log(didUri, Cord.Did.toChain(didUri))
  const { metadata, document } = await Cord.Did.resolve(didUri)

  // const encodedFullDid = await api.call.did.query(Cord.Did.toChain(didUri))
  // const encodedFullDid = await api.query.did.did(Cord.Did.toChain(didUri))

  // const encodedFullDid = await api.query.did.did(Cord.Did.toChain(didUri))
  // const encodedFullDid = await api.call.did.query(
  //   '3x431uLcUtL9nxbx7T8DzU6fDDZ1B9CoYB8aFPnz8W7Nr2Ez'
  // )
  console.log(document.unwrap())
  // const { document } = Cord.Did.linkedInfoFromChain(encodedFullDid)

  if (!document) {
    throw new Error('Full DID was not successfully created.')
  }

  return { mnemonic, fullDid: document }
}
