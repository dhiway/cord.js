// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Option, Struct, Text, Vec } from '@polkadot/types-codec';
import type { AccountId32 } from '@polkadot/types/interfaces/runtime';

/** @name RawDidLinkedInfo */
export interface RawDidLinkedInfo extends Struct {
  readonly identifier: AccountId32;
  readonly dName: Option<Text>;
  readonly serviceEndpoints: Vec<PalletDidServiceEndpointsDidEndpoint>;
  readonly details: PalletDidDidDetails;
}

export type PHANTOM_EXTRADEFS = 'extraDefs';
