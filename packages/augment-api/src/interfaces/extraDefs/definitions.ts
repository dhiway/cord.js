/* eslint-disable */

import type { Definitions } from '@polkadot/types/types';

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
} as Definitions
