/**
 * Chain Api Connection enables the building and accessing of the CORD [[Chain]] connection. In which it keeps one connection open and allows to reuse the connection for all [[Chain]] related tasks.
 *
 * Other modules can access the [[Chain]] as such: `const blockchain = await getConnectionOrConnect()`.
 *
 * @packageDocumentation
 * @module ChainApiConnection
 */

import { ApiPromise, WsProvider } from '@polkadot/api'
import { ConfigService } from '@cord.network/config'

let instance: Promise<ApiPromise> | null

/**
 * Builds a new blockchain connection instance.
 *
 * @param host Optional host address. Otherwise taken from the ConfigService.
 * @returns A new blockchain connection instance.
 */
export async function buildConnection(
  host: string = ConfigService.get('address')
): Promise<ApiPromise> {
  const provider = new WsProvider(host)
  return ApiPromise.create({
    provider,
  })
}

/**
 * Allows caching of a self-built connection instance.
 * This will be automatically used by all chain functions.
 *
 * For advanced use-cases only.
 *
 * @param connectionInstance The Chain instance, which should be cached.
 */
export function setConnection(connectionInstance: Promise<ApiPromise>): void {
  instance = connectionInstance
}

/**
 * Gets the cached blockchain connection instance.
 *
 * @returns Cached blockchain connection.
 */
export function getConnection(): Promise<ApiPromise> | null {
  return instance
}

/**
 * Gets the cached blockchain connection, or builds a new one, if non-existant.
 *
 * @returns The cached or newly built blockchain connection instance.
 */
export async function getConnectionOrConnect(): Promise<ApiPromise> {
  if (!instance) {
    instance = buildConnection()
  }
  return instance
}

/**
 * Clears the cached blockchain connection instance.
 * This does NOT disconnect automatically beforehand!
 */
export function clearCache(): void {
  instance = null
}

/**
 * Check, if the cached blockchain connection is connected.
 *
 * @returns If there is a cached connection and it is currently connected.
 */
export async function connected(): Promise<boolean> {
  if (!instance) return false
  const resolved = await instance
  return resolved.isConnected
}

/**
 * Disconnects the cached connection and clears the cache.
 *
 * @returns If there was a cached and connected connection, or not.
 */
export async function disconnect(): Promise<boolean> {
  const oldInstance = instance
  clearCache()

  if (!oldInstance) return false

  const resolved = await oldInstance
  const { isConnected } = resolved
  await resolved.disconnect()

  return isConnected
}
