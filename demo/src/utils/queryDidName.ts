import { assert } from 'console'
import * as Cord from '@cord.network/sdk'

/**
 * It queries the owner of the provided DID name, and then prints the URI of the DID document
 * @param didName - The DID name to resolve.
 */
export async function getDidDocFromName(
  didName: Cord.Did.DidName
): Promise<void> {
  const api = Cord.ConfigService.get('api')
  console.log(`\n❄️  Resolve DID name ${didName} `)

  // Query the owner of the provided didName.
  const encodedDidNameOwner = await api.call.didApi.queryByName(didName)

  const {
    document: { uri },
  } = Cord.Did.linkedInfoFromChain(encodedDidNameOwner)

  console.log(` uri: ${uri}`)
  console.log('✅ DID name resolved!')
}
