import { assert } from 'console'
import * as Cord from '@cord.network/sdk'

export async function getDidDocFromName(
  didName: Cord.Did.DidName
): Promise<void> {
  const api = Cord.ConfigService.get('api')
  console.log(`\n❄️  Resolve DID name ${didName} `)

  // Query the owner of the provided didName.
  const encodedDidNameOwner = await api.call.did.queryByName(didName)

  const {
    document: { uri },
  } = Cord.Did.linkedInfoFromChain(encodedDidNameOwner)

  console.log(` uri: ${uri}`)
  console.log('✅ DID name resolved!')
}
