/* eslint-disable */

import {
  types,
  cordSignedExtensions as userExtensions,
  didApiCalls,
  TransactionWeightApiCalls,
} from '@cord.network/type-definitions'

// Only types and runtime calls can be exported from here.
export default {
  types,
  runtime: {
    ...didApiCalls,
    ...TransactionWeightApiCalls,
  },
  signedExtensions: {
    ...userExtensions,
  },
}
