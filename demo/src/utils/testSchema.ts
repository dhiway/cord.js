import * as Cord from '@cord.network/sdk'

// Return Schema.
export function getSchema(): Cord.ISchema {
  return Cord.Schema.fromProperties('Test Demo Schema v121', {
    name: {
      type: 'string',
    },
    id: {
      type: 'integer',
    },
    age: {
      type: 'integer',
    },
    gender: {
      type: 'string',
    },
    country: {
      type: 'string',
    },
  })
}
