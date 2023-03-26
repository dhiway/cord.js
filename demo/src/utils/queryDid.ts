import * as Cord from '@cord.network/sdk'

/**
 * It takes a DID URI, resolves it, and returns the DID document if it exists and is not deactivated
 * @param didUri - The DID URI of the DID you want to query.
 * @returns A promise that resolves to a Cord.DidDocument or null.
 */
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
