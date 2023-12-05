import type { DefinitionsCall, DefinitionCall } from '@polkadot/types/types'

const TransactionWeightApiCalls: Record<string, DefinitionCall> = {
  query_weight_info: {
    description: 'The transaction weight info',
    params: [
      {
        name: 'uxt',
        type: 'Extrinsic',
      },
    ],
    type: 'RuntimeDispatchInfo',
  },
}

export const calls: DefinitionsCall = {
  TransactionWeightApi: [
    {
      methods: {
        ...TransactionWeightApiCalls,
      },
      version: 1,
    },
  ],
}
