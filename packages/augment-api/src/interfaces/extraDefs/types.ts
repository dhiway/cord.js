// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Struct, Vec } from '@polkadot/types-codec'
import type { AccountId32 } from '@polkadot/types/interfaces/runtime'
// FIXME: manually added as they are not automatically imported
import type {
  PalletDidServiceEndpointsDidEndpoint,
  PalletDidDidDetails,
} from '@polkadot/types/lookup'

/** @name DidApiAccountId */
export interface DidApiAccountId extends AccountId32 {}

/** @name RawDidLinkedInfo */
export interface RawDidLinkedInfo extends Struct {
  readonly identifier: AccountId32
  readonly serviceEndpoints: Vec<PalletDidServiceEndpointsDidEndpoint>
  readonly details: PalletDidDidDetails
}

export type PHANTOM_EXTRADEFS = 'extraDefs'
