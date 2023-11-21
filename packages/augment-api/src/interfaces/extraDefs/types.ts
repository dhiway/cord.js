// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Option, Struct, Text, Vec } from '@polkadot/types-codec';
import type { AccountId32, Weight, WeightV1, WeightV2 } from '@polkadot/types/interfaces/runtime';
import type { DispatchClass } from '@polkadot/types/interfaces/system';
import type { PalletDidServiceEndpointsDidEndpoint, PalletDidDidDetails } from '@polkadot/types/lookup'

/** @name RawDidLinkedInfo */
export interface RawDidLinkedInfo extends Struct {
  readonly identifier: AccountId32;
  readonly account: AccountId32;
  readonly name: Option<Text>;
  readonly serviceEndpoints: Vec<PalletDidServiceEndpointsDidEndpoint>;
  readonly details: PalletDidDidDetails;
}

/** @name RuntimeDispatchWeightInfo */
export interface RuntimeDispatchWeightInfo extends Struct {
  readonly weight: Weight;
  readonly class: DispatchClass;
}

/** @name RuntimeDispatchWeightInfoV1 */
export interface RuntimeDispatchWeightInfoV1 extends Struct {
  readonly weight: WeightV1;
  readonly class: DispatchClass;
}

/** @name RuntimeDispatchWeightInfoV2 */
export interface RuntimeDispatchWeightInfoV2 extends Struct {
  readonly weight: WeightV2;
  readonly class: DispatchClass;
}

export type PHANTOM_EXTRADEFS = 'extraDefs';
