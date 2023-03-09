import * as Cord from '@cord.network/sdk'
import { DidUri } from '@cord.network/sdk'
import { mnemonicGenerate } from '@polkadot/util-crypto'
import { generateAccount } from './generateAccount'
import { generateKeypairs } from './generateKeypairs'

export async function createFullDid(
  submitterAccount: Cord.CordKeyringPair
): Promise<{
  mnemonic: string
  didUri: DidUri
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
      // Example service.
      service: [
        {
          id: '#my-service',
          type: ['service-type'],
          serviceEndpoint: ['https://www.example.com'],
        },
      ],
    },
    submitterAccount.address,
    async ({ data }) => ({
      signature: authentication.sign(data),
      keyType: authentication.type,
    })
  )

  await Cord.Chain.signAndSubmitTx(fullDidCreationTx, submitterAccount)

  const didUri = Cord.Did.getFullDidUriFromKey(authentication)
  console.log(didUri)
  // const encodedFullDid = await api.call.did.query(Cord.Did.toChain(didUri))
  // const { document } = Cord.Did.linkedInfoFromChain(encodedFullDid)

  // if (!document) {
  //   throw new Error('Full DID was not successfully created.')
  // }

  // return { mnemonic, fullDid: document }

  return { mnemonic, didUri: didUri }
}
