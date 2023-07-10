/**
 * The ConfigService is used for setting up the node address,
 * the logging level as well as storing custom configuration options.
 *
 * @packageDocumentation
 * @module ConfigService
 */

import type { ApiPromise } from '@polkadot/api'

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

const { CORD_WSS_URL, CORD_API_URL, CORD_API_TOKEN } = process.env

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
  apiUrl: string | null
  wssUrl: string | null
  token: string | null
} & { [key: string]: any }

/**
 * Changes all existing Loggers of our default Factory with id 0 to the intended Level.
 *
 * @param level The intended LogLevel. LogLevel has a range of 0 to 5.
 * @returns The new set level.
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
  apiUrl: CORD_API_URL ?? null,
  wssUrl: CORD_WSS_URL ?? null,
  token: CORD_API_TOKEN ?? null,
}

let configuration: Partial<configOpts> = { ...defaultConfig }

/**
 * Get the value set for a configuration.
 *
 * @param configOpt Key of the configuration.
 * @returns Value for this key.
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
 * Set values for one or multiple configurations.
 *
 * @param opts Object of configurations as key-value pairs.
 */
export function set<K extends Partial<configOpts>>(opts: K): void {
  configuration = { ...configuration, ...opts }
  setLogLevel(configuration.logLevel)
}

/**
 * Set the value for a configuration to its default (which may be `undefined`).
 *
 * @param key Key identifying the configuration option.
 */
export function unset<K extends keyof configOpts>(key: K): void {
  if (Object.prototype.hasOwnProperty.call(defaultConfig, key)) {
    configuration[key] = defaultConfig[key]
  } else {
    delete configuration[key]
  }
}

/**
 * Indicates whether a configuration option is set.
 *
 * @param key Key identifying the configuration option.
 * @returns True if this value is set, false otherwise.
 */
export function isSet<K extends keyof configOpts>(key: K): boolean {
  return typeof configuration[key] !== 'undefined'
}

// Create options instance and specify 1 LogGroupRule:
// * LogLevel Error on default, env DEBUG = 'true' changes Level to Debug.throws
const options = new LoggerFactoryOptions().addLogGroupRule(
  new LogGroupRule(new RegExp('.+'), get('logLevel'))
)
// Create a named logging factory and pass in the options and export the factory.
// Named is since version 0.2.+ (it's recommended for future usage)
export const LoggingFactory = LFService.createNamedLoggerFactory(
  'LoggerFactory',
  options
)
