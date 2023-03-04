import type {
  OverrideBundleType,
  OverrideVersionedType,
} from '@polkadot/types/types'

import { types7 } from './types_7.js'
import { types8 } from './types_8.js'
import { calls as didCalls } from './runtime/did.js'

// import { cordSignedExtensions } from './signedExtensions'
// export { cordSignedExtensions } from './signedExtensions'
export { calls as didCalls } from './runtime/did.js'

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
    Staging: {
      runtime: {
        ...didCalls,
      },
      // signedExtensions: {
      //   ...cordSignedExtensions,
      // },
      types: defaultTypesBundle,
    },
    Development: {
      runtime: {
        ...didCalls,
      },
      // signedExtensions: {
      //   ...cordSignedExtensions,
      // },
      types: defaultTypesBundle,
    },
  },
}
