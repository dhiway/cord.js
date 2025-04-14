import { SDKErrors } from '@cord.network/utils';
import { ConfigService } from '@cord.network/config';
import { Chain } from '@cord.network/network';
import { CordKeyringPair } from '@cord.network/types';
import { Bytes } from '@polkadot/types';
import { isValidAddress } from './Profile';


/**
 * Dispatches a request to create or update a profile on the CORD blockchain using the `setProfile` extrinsic.
 *
 * @param profileData - An array of key-value pairs representing profile attributes 
 * (e.g., `[["pub_name", "Alice"], ["pub_email", Bytes([97, 108, 105, 99, 101])]]`). 
 * Keys and values can be strings, Bytes, or Uint8Array.
 * @param authorAccount - The keyring pair of the account creating or updating the profile to sign the transaction.
 * @returns A promise that resolves when the transaction is successfully submitted.
 * @throws {SDKErrors.CordDispatchError} If the profile data is invalid or an error occurs during dispatch.
 */
export async function dispatchSetProfileToChain(
  profileData: [string | Bytes | Uint8Array, string | Bytes | Uint8Array][],
  authorAccount: CordKeyringPair
): Promise<void> {
  try {
    const api = ConfigService.get('api');
    const extrinsic = api.tx.profile.setProfile(profileData);

    await Chain.signAndSubmitTx(extrinsic, authorAccount);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${errorMessage}"`
    );
  }
}


/**
 * Dispatches a request to rotate the key for a profile on the CORD blockchain using the `rotateKey` extrinsic.
 *
 * @param newKey - The new account ID (SS58 address) to set as the profile's key.
 * @param authorAccount - The keyring pair of the current profile owner to sign the transaction.
 * @returns A promise that resolves when the transaction is successfully submitted.
 * @throws {SDKErrors.CordDispatchError} If the newKey is invalid or an error occurs during dispatch.
 */
export async function dispatchRotateKeyToChain(
  newKey: string,
  authorAccount: CordKeyringPair
): Promise<void> {
  try {
    const api = ConfigService.get('api');

    if (!isValidAddress(newKey)) {
      throw new Error(`Invalid SS58 address: ${newKey}`);
    }

    const extrinsic = api.tx.profile.rotateKey(newKey);

    await Chain.signAndSubmitTx(extrinsic, authorAccount);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${errorMessage}"`
    );
  }
}
