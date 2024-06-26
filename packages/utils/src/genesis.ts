import { connect, disconnect } from '@cord.network/config';
import { SDKErrors } from '.';
import { ApiPromise } from '@polkadot/api';

/**
 * Returns the genesis hash in hexadecimal format for a given network object which is a ApiPromise.
 *
 * @param network network object of type ApiPromise for which the genesis hash is required.
 * @returns Returns the genesis hash in Hexadecimal format.
 */
export async function getGenesisHash(
  network: ApiPromise,
): Promise<string> {
try {
  return network.genesisHash.toHex();
} catch (error) {
  const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error)

  throw new SDKErrors.CordQueryError(
      `Error querying asset entry: ${errorMessage}`
  )}
}

/**
 * Connects to chain and returns the genesis hash in hexadecimal format for a given networkAddress.
 *
 * @param networkAddress Network Address for which the genesis hash is required.
 * @returns Returns the genesis hash in Hexadecimal format.
 */
export async function getGenesisHashWithConnect(
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
