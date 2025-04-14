import { decodeAddress } from '@polkadot/util-crypto';
import { SDKErrors } from '@cord.network/utils';

/**
 * Validates if a string is a valid SS58 address.
 *
 * @param address - The address to validate.
 * @returns True if valid, false otherwise.
 */
export function isValidAddress(address: string): boolean {
  try {
    decodeAddress(address);
    return true;
  } catch {
    return false;
  }
}


/**
 * Converts a JSON object to an array of tuples for profile data input.
 * Only flat key-value pairs with string values are accepted; complex JSON (e.g., nested objects, arrays) is rejected.
 * No validation is performed on the content of strings.
 *
 * @param jsonData - A JSON object with string keys and values (e.g., `{ pub_name: "Alice", pub_email: "alice@gmail.com" }`).
 * @returns An array of tuples with string keys and values (e.g., `[["pub_name", "Alice"], ["pub_email", "alice@gmail.com"]]`).
 * @throws {SDKErrors.SDKError} If any value is not a string (e.g., objects, arrays, numbers).
 */
export function jsonToProfileData(
  jsonData: Record<string, unknown>
): [string, string][] {
  return Object.entries(jsonData).map(([key, value]) => {
    if (typeof value !== 'string') {
      throw new SDKErrors.SDKError(
        `Invalid value for key "${key}": expected string, got ${typeof value}`
      );
    }
    return [key, value] as [string, string];
  });
}
