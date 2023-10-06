import type { RegistryTypes } from '@polkadot/types/types'

import { types8 } from './types_8.js'

export const types9: RegistryTypes = {
  ...types8,

  OpaquePeerId: 'Vec<u8>',
  PeerId: 'Vec<u8>',

  RuntimeDispatchWeightInfo: {
    weight: 'Weight',
    class: 'DispatchClass',
  },
  RuntimeDispatchWeightInfoV1: {
    weight: 'WeightV1',
    class: 'DispatchClass',
  },
  RuntimeDispatchWeightInfoV2: {
    weight: 'WeightV2',
    class: 'DispatchClass',
  },
  Data: {
    _enum: {
      None: 'Null', // 0
      Raw: 'Bytes', // 1
    },
  },
}
