import type { RegistryTypes } from '@polkadot/types/types'

export const types8: RegistryTypes = {
  RawDidLinkedInfo: {
    identifier: 'AccountId32',
    account: 'AccountId32',
    name: 'Option<Text>',
    serviceEndpoints: 'Vec<PalletDidServiceEndpointsDidEndpoint>',
    details: 'PalletDidDidDetails',
  },
}
