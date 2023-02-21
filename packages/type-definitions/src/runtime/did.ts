import type { DefinitionsCall, DefinitionCall } from '@polkadot/types/types'

const didApiCalls: Record<string, DefinitionCall> = {
  query: {
    description:
      'Return the information relative to the owner of the provided DID, if present.',
    params: [
      {
        name: 'did',
        type: 'AccountId32',
      },
    ],
    type: 'Option<RawDidLinkedInfo>',
  },
}

export const calls: DefinitionsCall = {
  Did: [
    {
      methods: {
        ...didApiCalls,
      },
      version: 1,
    },
  ],
}
