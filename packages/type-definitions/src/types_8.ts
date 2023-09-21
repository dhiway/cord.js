import type { RegistryTypes } from '@polkadot/types/types'

export const types8: RegistryTypes = {
  RawDidLinkedInfo: {
    identifier: 'AccountId32',
    account: 'AccountId32',
    name: 'Option<Text>',
    serviceEndpoints: 'Vec<PalletDidServiceEndpointsDidEndpoint>',
    details: 'PalletDidDidDetails',
  },
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
