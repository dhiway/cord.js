/**
 * CORD's core functionalities are exposed via connecting to its blockchain.
 *
 * To connect to the blockchain:
 * ```Cord.connect('ws://localhost:9944');```.
 *
 * @packageDocumentation
 * @module CordConfig
 */

import { ConfigService } from '@cord.network/config'
import { ChainApiConnection, Chain } from '@cord.network/network'
import { Identity } from '../identity'

export function connect(): Promise<Chain> {
  return ChainApiConnection.getConnectionOrConnect()
}

export function config<K extends Partial<ConfigService.configOpts>>(
  configs: K
): void {
  ConfigService.set(configs)
}

/**
 * Prepares crypto modules (required e.g. For identity creation) and calls Cord.config().
 *
 * @param configs Arguments to pass on to Cord.config().
 * @returns Promise that must be awaited to assure crypto is ready.
 */
export async function init<K extends Partial<ConfigService.configOpts>>(
  configs?: K
): Promise<void> {
  config(configs || {})
  await Identity.cryptoWaitReady()
}
export const { disconnect } = ChainApiConnection
