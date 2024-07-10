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
import { SDKErrors } from '@cord.network/utils'

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
 * @param network - An optional chain connection object to be used to connect to a particular chain. Defaults to 'api'. 
 * @param apiOpts.noInitWarn
 * @param apiOpts - Additional API connection options.
 * @returns A promise resolving to the ApiPromise instance.
 */
export async function connect(
  blockchainRpcWsUrl: string,
  network: string = 'api',
  { noInitWarn = true, ...apiOptions }: Omit<ApiOptions, 'provider'> = {},
): Promise<ApiPromise> {
  let connection: ApiPromise;
  let connectionObject: { [key: string]: ApiPromise } = {};
  try {
    const provider = new WsProvider(blockchainRpcWsUrl);
    const apiOpts = {
      noInitWarn,
      ...apiOptions,
    };

    connection = await ApiPromise.create({
      provider,
      typesBundle,
      signedExtensions: cordSignedExtensions,
      ...apiOpts,
    });

    /* Create a connection object with dynamic name at runtime */
    connectionObject = { [network]: connection };

    await init(connectionObject);

    return connection.isReadyOrError;

  } catch (error) {
    console.error('Error connecting to blockchain:', error);
    throw error;
  } finally {
    delete connectionObject[network];
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
 * connect(wsUrl).then(() => disconnect(network)).then(disconnected => {
 *   console.log('Disconnected:', disconnected);
 * }).catch(error => {
 *   console.error('Error:', error);
 * });
 * ```
 * 
 * @param network - An optional chain connection object to be used to connect to a particular chain. Defaults to 'api'. 
 * 
 * @returns A promise resolving to a boolean indicating successful disconnection.
 */
export async function disconnect(
  network: string = 'api',
): Promise<boolean> {
  if (!ConfigService.isSet(network)) return false
  const api = ConfigService.get(network)
  ConfigService.unset(network)
  await api.disconnect()
  return true
}

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
