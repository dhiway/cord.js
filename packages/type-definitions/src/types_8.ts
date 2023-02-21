import type { RegistryTypes } from '@polkadot/types/types'

export const types8: RegistryTypes = {
  // DID state_call
  DidApiAccountId: 'AccountId32',
  RawDidLinkedInfo: {
    identifier: 'AccountId32',
    serviceEndpoints: 'Vec<PalletDidServiceEndpointsDidEndpoint>',
    details: 'PalletDidDidDetails',
  },
}
