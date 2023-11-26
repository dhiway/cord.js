/**
 * @packageDocumentation
 * @module ConfigService
 *
 * The `ConfigService` module in the CORD SDK is responsible for managing configuration settings
 * necessary for the operation of various components within the SDK. It offers functionalities to set, retrieve,
 * and modify configurations that include connection parameters, logging levels, and other SDK-wide settings.
 *
 * This module plays a crucial role in customizing the behavior of the CORD SDK to suit different operational
 * environments and use cases. It ensures that different parts of the SDK can access shared configuration settings
 * in a consistent manner, thereby facilitating a cohesive operation.
 *
 * Key functionalities include:
 * - Setting and retrieving configuration options for the SDK.
 * - Modifying log levels to control the verbosity of SDK logging.
 * - Resetting configurations to their default values.
 * - Checking the presence of specific configuration settings.
 *
 * Configuration settings are crucial for the proper initialization and operation of the SDK components.
 * The `ConfigService` provides a centralized and convenient way to manage these settings throughout the SDK's lifecycle.
 *
 * Usage of the `ConfigService` is straightforward - configurations can be set or modified at any point,
 * and the changes will be reflected across the SDK. This allows for dynamic adjustments according to the
 * application's runtime requirements.
 */

import type { ApiPromise } from '@cord.network/types'

import {
  LFService,
  LoggerFactoryOptions,
  LogGroupRule,
  LogLevel,
  getLogControl,
  LogGroupControlSettings,
} from 'typescript-logging'
import { SDKErrors } from '@cord.network/utils'
import { SubscriptionPromise } from '@cord.network/types'

const DEFAULT_DEBUG_LEVEL =
  typeof process !== 'undefined' &&
  process.env?.DEBUG &&
  process.env.DEBUG === 'true'
    ? LogLevel.Debug
    : LogLevel.Error

export type configOpts = {
  api: ApiPromise
  logLevel: LogLevel
  submitTxResolveOn: SubscriptionPromise.ResultEvaluator
} & { [key: string]: any }

/**
 * Modifies the log level for all existing loggers in the default factory.
 *
 * @remarks
 * The log level is constrained between 0 (Trace) and 5 (Fatal).
 * If an out-of-range level is provided, it is clamped to the nearest valid value.
 *
 * @example
 * ```typescript
 * // Set the log level to Debug
 * modifyLogLevel(LogLevel.Debug);
 * ```
 *
 * @param level - The intended log level.
 * @returns The actual log level that was set.
 */
export function modifyLogLevel(level: LogLevel): LogLevel {
  // eslint-disable-next-line no-nested-ternary
  const actualLevel = level > 0 ? (level > 5 ? 5 : level) : 0
  getLogControl()
    .getLoggerFactoryControl(0)
    .change({
      group: 'all',
      logLevel: LogLevel[actualLevel],
    } as LogGroupControlSettings)
  return actualLevel
}

const defaultConfig: Partial<configOpts> = {
  logLevel: DEFAULT_DEBUG_LEVEL,
}

let configuration: Partial<configOpts> = { ...defaultConfig }

/**
 * Retrieves the value of a specified configuration option.
 *
 * @remarks
 * Throws an error if the requested configuration option is not set.
 *
 * @example
 * ```typescript
 * // Retrieve the current API instance
 * const apiInstance = get('api');
 * ```
 *
 * @param configOpt - The key of the configuration option to retrieve.
 * @returns The value of the configuration option.
 * @throws {@link SDKErrors.BlockchainApiMissingError} | Generic not configured error.
 */
export function get<K extends keyof configOpts>(configOpt: K): configOpts[K] {
  if (typeof configuration[configOpt] === 'undefined') {
    switch (configOpt) {
      case 'api':
        throw new SDKErrors.BlockchainApiMissingError()
      default:
        throw new Error(`GENERIC NOT CONFIGURED ERROR FOR KEY: "${configOpt}"`)
    }
  }
  return configuration[configOpt]
}

function setLogLevel(logLevel: LogLevel | undefined): void {
  if (logLevel !== undefined) {
    modifyLogLevel(logLevel)
  }
}

/**
 * Sets one or more configuration options.
 *
 * @remarks
 * This method allows setting multiple configuration options at once. It also updates the log level if provided.
 *
 * @example
 * ```typescript
 * // Set multiple configuration options
 * set({ logLevel: LogLevel.Info, customConfig: 'myValue' });
 * ```
 *
 * @param opts - An object containing key-value pairs of configuration options.
 */
export function set<K extends Partial<configOpts>>(opts: K): void {
  configuration = { ...configuration, ...opts }
  setLogLevel(configuration.logLevel)
}

/**
 * Resets a configuration option to its default value.
 *
 * @remarks
 * If the default value is not defined, the configuration option is removed.
 *
 * @example
 * ```typescript
 * // Reset a custom configuration option
 * unset('customConfig');
 * ```
 *
 * @param key - The key of the configuration option to reset.
 */
export function unset<K extends keyof configOpts>(key: K): void {
  if (Object.prototype.hasOwnProperty.call(defaultConfig, key)) {
    configuration[key] = defaultConfig[key]
  } else {
    delete configuration[key]
  }
}

/**
 * Checks whether a specific configuration option is set.
 *
 * @example
 * ```typescript
 * // Verify if the 'api' configuration is set
 * if (isSet('api')) {
 *   console.log('API configuration is set.');
 * } else {
 *   console.log('API configuration is not set.');
 * }
 * ```
 *
 * @param key - The key of the configuration option to check.
 * @returns `true` if the configuration option is set, otherwise `false`.
 */
export function isSet<K extends keyof configOpts>(key: K): boolean {
  return typeof configuration[key] !== 'undefined'
}

// Create options instance and specify 1 LogGroupRule:
// * LogLevel Error on default, env DEBUG = 'true' changes Level to Debug.throws
const options = new LoggerFactoryOptions().addLogGroupRule(
  new LogGroupRule(new RegExp('.+'), get('logLevel'))
)

/**
 * Factory for creating loggers with predefined log group rules.
 *
 * @remarks
 * This factory is configured based on the defined log level. It supports dynamic log level adjustment.
 *
 * @example
 * ```typescript
 * // Create a logger and log an informational message
 * const logger = LoggingFactory.getLogger('myLogger');
 * logger.info('This is an informational message');
 * ```
 */
export const LoggingFactory = LFService.createNamedLoggerFactory(
  'LoggerFactory',
  options
)
