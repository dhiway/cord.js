import * as Cord from '@cord.network/sdk'

export async function queryFullDid(
  didUri: Cord.DidUri
): Promise<Cord.DidDocument | null> {
  const { metadata, document } = await Cord.Did.resolve(didUri)
  if (metadata.deactivated) {
    console.log(`DID ${didUri} has been deleted.`)
    return null
  } else if (document === undefined) {
    console.log(`DID ${didUri} does not exist.`)
    return null
  } else {
    return document
  }
}
