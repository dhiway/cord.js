/**
 * @packageDocumentation
 * @module CordConfig
 *
 * The `CordConfig` module is an integral part of the CORD SDK, offering functionalities to configure and manage
 * connections with the CORD blockchain. Essential for establishing a secure and efficient communication channel,
 * this module enables operations like identity management, transaction processing, and smart contract interactions.
 *
 * Features of `CordConfig` include:
 * - Initialization of cryptographic modules for SDK setup.
 * - Connection management using WebSocket for interacting with the CORD blockchain network.
 * - Cryptographic readiness checks ensuring secure blockchain interactions.
 * - Disconnection utilities for clean closure of blockchain connections.
 *
 * ## Usage
 *
 * To use the `CordConfig` module, import it into your project and utilize its functions for blockchain
 * interactions.
 */

import type { ApiOptions } from '@cord.network/types'
import { ApiPromise, WsProvider, cryptoWaitReady } from '@cord.network/types'
import {
  typesBundle,
  cordSignedExtensions,
} from '@cord.network/type-definitions'
import * as ConfigService from './Service.js'

/**
 * Initializes the CORD SDK configuration and prepares cryptographic modules.
 *
 * @remarks
 * Essential for setting up the environment before blockchain interaction, ensuring all necessary configurations are in place.
 *
 * @example
 * ```typescript
 * import { init } from './CordConfig';
 *
 * init(config).then(() => {
 *   console.log('CORD SDK initialized and ready.');
 * }).catch(error => {
 *   console.error('Initialization failed:', error);
 * });
 * ```
 *
 * @param configs - Configuration options for initializing the SDK.
 * @returns A promise resolving once cryptographic modules are ready.
 *
 * @internal
 */
export async function init<K extends Partial<ConfigService.configOpts>>(
  configs?: K
): Promise<void> {
  ConfigService.set(configs || {})
  await cryptoWaitReady()
}

/**
 * Establishes a connection to the CORD blockchain via WebSocket URL.
 *
 * @remarks
 * Initializes the connection and makes the API instance available for SDK functionalities.
 *
 * @example
 * ```typescript
 * import { connect } from './CordConfig';
 *
 * const wsUrl = 'ws://localhost:9944';
 * connect(wsUrl).then(api => {
 *   console.log('Connected to CORD blockchain:', api);
 * }).catch(error => {
 *   console.error('Connection failed:', error);
 * });
 * ```
 *
 * @param blockchainRpcWsUrl - WebSocket URL for the CORD blockchain RPC endpoint.
 * @param apiOpts.noInitWarn
 * @param apiOpts - Additional API connection options.
 * @returns A promise resolving to the ApiPromise instance.
 */
export async function connect(
  blockchainRpcWsUrl: string,
  { noInitWarn = true, ...apiOptions }: Omit<ApiOptions, 'provider'> = {}
): Promise<ApiPromise> {
  try {
    const provider = new WsProvider(blockchainRpcWsUrl)
    const apiOpts = {
      noInitWarn,
      ...apiOptions,
    }
    const api = await ApiPromise.create({
      provider,
      typesBundle,
      signedExtensions: cordSignedExtensions,
      ...apiOpts,
    })

    await init({ api })
    return api.isReadyOrError
  } catch (error) {
    console.error('Error connecting to blockchain:', error)
    throw error
  }
}

/**
 * Disconnects from the CORD blockchain and clears the cached connection.
 *
 * @remarks
 * Should be invoked to cleanly close the connection when no longer needed.
 *
 * @example
 * ```typescript
 * import { connect, disconnect } from './CordConfig';
 *
 * const wsUrl = 'ws://localhost:9944';
 * connect(wsUrl).then(() => disconnect()).then(disconnected => {
 *   console.log('Disconnected:', disconnected);
 * }).catch(error => {
 *   console.error('Error:', error);
 * });
 * ```
 *
 * @returns A promise resolving to a boolean indicating successful disconnection.
 */
export async function disconnect(): Promise<boolean> {
  if (!ConfigService.isSet('api')) return false
  const api = ConfigService.get('api')
  ConfigService.unset('api')
  await api.disconnect()
  return true
}
