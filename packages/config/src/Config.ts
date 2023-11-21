/**
 * @packageDocumentation
 * @module CordConfig
 *
 * This module provides the necessary functionalities to establish and manage connections with the CORD blockchain.
 * It includes methods to initialize cryptographic modules, connect to the blockchain network, and disconnect when
 * required. The module plays a crucial role in enabling interactions with the CORD blockchain, facilitating various
 * operations such as identity creation and transaction processing.
 *
 *  * ## Example
 *
 * To connect to the blockchain:
 * ```Cord.connect('ws://localhost:9944');```.
 */
import type { ApiOptions } from '@cord.network/types'
import { ApiPromise, WsProvider, cryptoWaitReady } from '@cord.network/types'
import {
  typesBundle,
  cordSignedExtensions,
} from '@cord.network/type-definitions'
import * as ConfigService from './Service.js'

/**
 * Initializes the configuration for the CORD SDK and prepares cryptographic modules.
 * This function is essential for setting up the environment before interacting with the blockchain.
 *
 * @param configs - Configuration options to initialize the SDK.
 * @returns A promise that resolves once the cryptographic modules are ready.
 */
export async function init<K extends Partial<ConfigService.configOpts>>(
  configs?: K
): Promise<void> {
  ConfigService.set(configs || {})
  await cryptoWaitReady()
}

/**
 * Establishes a connection to the CORD blockchain using a WebSocket URL.
 * This function initializes the connection and makes the API instance available for SDK functions.
 *
 * @param blockchainRpcWsUrl - The WebSocket URL of the CORD blockchain RPC endpoint.
 * @param apiOpts - Additional options for the API connection.
 * @param apiOpts.noInitWarn - Flag to suppress initialization warnings.
 * @returns A promise that resolves to the ApiPromise instance, indicating a ready or errored state.
 */
export async function connect(
  blockchainRpcWsUrl: string,
  {
    noInitWarn = ConfigService.get('logLevel') > 3, // by default warnings are disabled on log level error and higher
    ...apiOpts
  }: Omit<ApiOptions, 'provider'> = {}
): Promise<ApiPromise> {
  const provider = new WsProvider(blockchainRpcWsUrl)
  const api = await ApiPromise.create({
    provider,
    typesBundle,
    signedExtensions: cordSignedExtensions,
    noInitWarn,
    ...apiOpts,
  })
  await init({ api })
  return api.isReadyOrError
}

/**
 * Disconnects from the CORD blockchain and clears the cached connection.
 * This function should be called to cleanly close the connection when it's no longer needed.
 *
 * @returns A promise that resolves to a boolean indicating whether a connection was active and has been disconnected.
 */
export async function disconnect(): Promise<boolean> {
  if (!ConfigService.isSet('api')) return false
  const api = ConfigService.get('api')
  ConfigService.unset('api')
  await api.disconnect()
  return true
}
