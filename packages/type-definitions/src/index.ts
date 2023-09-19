import type {
  OverrideBundleType,
  OverrideVersionedType,
} from '@polkadot/types/types'

import { types7 } from './types_7.js'
import { types8 } from './types_8.js'
import { calls as didApiCalls } from './runtime/did.js'
import { calls as TransactionWeightApiCalls } from './runtime/weight.js'

import { cordSignedExtensions } from './signedExtensions/index.js'

export { cordSignedExtensions } from './signedExtensions/index.js'
export { calls as didApiCalls } from './runtime/did.js'
export { calls as TransactionWeightApiCalls } from './runtime/weight.js'

export { types8 as types }

const defaultTypesBundle: OverrideVersionedType[] = [
  {
    minmax: [0, 7999],
    types: types7,
  },
  {
    minmax: [8000, undefined],
    types: types8,
  },
]

// Current runtime version: 8000
export const typesBundle: OverrideBundleType = {
  chain: {
    'Cord Sprintnet': {
      runtime: {
        ...didApiCalls,
        ...TransactionWeightApiCalls,
      },
      signedExtensions: {
        ...cordSignedExtensions,
      },
      types: defaultTypesBundle,
    },
    'Cord Sparknet': {
      runtime: {
        ...didApiCalls,
        ...TransactionWeightApiCalls,
      },
      signedExtensions: {
        ...cordSignedExtensions,
      },
      types: defaultTypesBundle,
    },
    'Cord Spin': {
      runtime: {
        ...didApiCalls,
        ...TransactionWeightApiCalls,
      },
      signedExtensions: {
        ...cordSignedExtensions,
      },
      types: defaultTypesBundle,
    },
    'Cord Ignite': {
      runtime: {
        ...didApiCalls,
        ...TransactionWeightApiCalls,
      },
      signedExtensions: {
        ...cordSignedExtensions,
      },
      types: defaultTypesBundle,
    },
    'Dev. Node': {
      runtime: {
        ...didApiCalls,
        ...TransactionWeightApiCalls,
      },
      signedExtensions: {
        ...cordSignedExtensions,
      },
      types: defaultTypesBundle,
    },
  },
}
