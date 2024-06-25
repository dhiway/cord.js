import { connect, disconnect } from '@cord.network/config'
import { SDKErrors } from '.'

/**
 * Connects to chain and returnns the genesis hash in hexadecimal format for a given networkAddress.
 *
 * @param networkAddress Network Address for which the genesis hash is required.
 * @returns Returns the genesis hash in Hexadecimal format.
 */
export async function getGenesisHash(
  networkAddress: string,
): Promise<string> {
try {
  const connectData = await connect(networkAddress as string);
  const genesisHash = connectData.genesisHash.toHex();

  return genesisHash;
} catch (error) {
  const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error)

  throw new SDKErrors.CordQueryError(
      `Error querying asset entry: ${errorMessage}`
  )
} finally {
    disconnect();
  }
}
