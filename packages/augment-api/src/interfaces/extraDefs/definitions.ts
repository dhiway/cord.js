/* eslint-disable */

import {
  types,
  cordSignedExtensions as userExtensions,
  didCalls,
} from '@cord.network/type-definitions'

// Only types and runtime calls can be exported from here.
export default {
  types,
  runtime: {
    ...didCalls,
  },
  signedExtensions: {
    ...userExtensions,
  },
}
