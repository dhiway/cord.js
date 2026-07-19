/**
 * Module: Doken State Query
 * Description: Provides functions to query the state history of a doken identifier on the CORD network.
 * This module is designed for backend use with TypeScript and relies on the Polkadot API to interact with the blockchain.
 * It includes methods to fetch a specific state change by index or retrieve the complete history of state changes.
 */

import type { ApiPromise } from '@cord.network/types'

interface DokenState {
  state: string;
  action: string;
  height: number;
}

/**
 * Retrieves the state change details for a specific index in the doken's state history.
 * 
 * @param api - An instance of ApiPromise from the CORD PAPI-backed API layer, connected to the CORD network.
 * @param doken - A string representing the doken identifier (not necessarily in hex).
 * @param index - A non-negative integer indicating the position of the state change in the history (e.g., 0 for creation).
 * @returns A Promise resolving to a DokenState object containing the state, action, and height.
 * @throws Error if doken is invalid, index is negative or non-integer, or no state change is found at the given index.
 * 
 * @example
 * ```typescript
 * const state = await queryDokenStateByIndex(api, 'T6fvpeF1Q5y1qFB15aUnTpreo7JRLgJFM1ED5Qzqw6dV8oCnP4kS', 0);
 * console.log(state); // { state: '...', action: 'RegistryEntryCreated', height: 748 }
 * ```
 */
export async function queryDokenStateByIndex(api: ApiPromise, doken: string, index: number): Promise<DokenState> {
  if (!doken || typeof doken !== 'string') {
    throw new Error('Invalid doken: must be a non-empty string');
  }
  if (!Number.isInteger(index) || index < 0) {
    throw new Error('Invalid index: must be a non-negative integer');
  }

  const stateHistory = await api.query.doken.stateHistory(doken, index);
  if (!stateHistory.isSome) {
    throw new Error(`No state change found at index ${index} for doken ${doken}`);
  }

  return stateHistory.toHuman() as unknown as DokenState;
}

/**
 * Retrieves the complete history of state changes for a given doken identifier.
 * 
 * @param api - An instance of ApiPromise from the CORD PAPI-backed API layer, connected to the CORD network.
 * @param doken - A string representing the doken identifier (not necessarily in hex).
 * @returns A Promise resolving to an array of DokenState objects, or an empty array if no history is found.
 * @throws Error if doken is invalid.
 * 
 * @example
 * ```typescript
 * const history = await queryAllDokenStateHistory(api, 'T6fvpeF1Q5y1qFB15aUnTpreo7JRLgJFM1ED5Qzqw6dV8oCnP4kS');
 * console.log(history); // [{ state: '...', action: 'RegistryEntryCreated', height: 748 }, ...]
 * ```
 */
export async function queryAllDokenStateHistory(api: ApiPromise, doken: string): Promise<DokenState[]> {
  if (!doken || typeof doken !== 'string') {
    throw new Error('Invalid doken: must be a non-empty string');
  }

  const stateHistory = await api.query.doken.stateHistory.entries(doken);
  if (stateHistory.length === 0) {
    return [];
  }

  const historyData = stateHistory.map((entry: [unknown, { toHuman: () => unknown }]) => {
    const [, value] = entry;
    return value.toHuman() as unknown as DokenState;
  });
  return historyData;
}
