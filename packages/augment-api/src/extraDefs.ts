import type { V1Weight, V2Weight } from '@cord.network/types'

export interface RuntimeDispatchWeightInfo {
  readonly weight: V1Weight | V2Weight
  readonly class: unknown
}

export interface RuntimeDispatchWeightInfoV1 {
  readonly weight: V1Weight
  readonly class: unknown
}

export interface RuntimeDispatchWeightInfoV2 {
  readonly weight: V2Weight
  readonly class: unknown
}
