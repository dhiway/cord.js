import type { DefinitionsCall, DefinitionCall } from '@polkadot/types/types'

const DidApiCalls: Record<string, DefinitionCall> = {
  query_by_name: {
    description:
      'Return the information relative to the owner of the provided didName, if any.',
    params: [
      {
        name: 'name',
        type: 'Text',
      },
    ],
    type: 'Option<RawDidLinkedInfo>',
  },
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
  DidApi: [
    {
      methods: {
        ...DidApiCalls,
      },
      version: 1,
    },
  ],
}
