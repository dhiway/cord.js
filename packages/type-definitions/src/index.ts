import type {
  OverrideBundleType,
  OverrideVersionedType,
} from '@polkadot/types/types'

// import type { ExtDef } from '@polkadot/types/extrinsic/signedExtensions/types.js'
import { types7 } from './types_7.js'
import { types8 } from './types_8.js'
import { types9 } from './types_9.js'
import { calls as didApiCalls } from './runtime/did.js'
import { calls as TransactionWeightApiCalls } from './runtime/weight.js'

import { cordSignedExtensions } from './signedExtensions/index.js'

export { cordSignedExtensions } from './signedExtensions/index.js'
export { calls as didApiCalls } from './runtime/did.js'
export { calls as TransactionWeightApiCalls } from './runtime/weight.js'

export { types7, types8, types9 as types }

const defaultTypesBundle: OverrideVersionedType[] = [
  {
    minmax: [0, 7999],
    types: types7,
  },
  {
    minmax: [8000, 8999],
    types: types8,
  },
  {
    minmax: [9000, undefined],
    types: types9,
  },
]

// // Current runtime version: 9000
// export const signedExtensions: ExtDef = {
//   ...cordSignedExtensions,
// }

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
