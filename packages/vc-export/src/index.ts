import '@polkadot/api-augment'

import type * as types from './types.js'
export * as constants from './constants.js'
export * as verification from './verificationUtils.js'
export * as presentation from './presentationUtils.js'
export { fromCredential } from './exportToVerifiableCredential.js'
export * as vcjsSuites from './suites/index.js'

export type { types }
