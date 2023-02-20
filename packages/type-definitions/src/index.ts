import type {
  OverrideBundleType,
  OverrideVersionedType,
} from '@polkadot/types/types'

import { types7 } from './types_7.js'
import { types8 } from './types_8.js'
import { userExtensions } from './signedExtensions'
export { userExtensions } from './signedExtensions'

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
      signedExtensions: {
        ...userExtensions,
      },
      types: defaultTypesBundle,
    },
    Development: {
      signedExtensions: {
        ...userExtensions,
      },
      types: defaultTypesBundle,
    },
  },
}
