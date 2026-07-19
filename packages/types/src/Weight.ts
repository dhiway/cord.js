import type { NumberCodec } from './CompatTypes.js'

export type V1Weight = NumberCodec

export interface V2Weight {
  refTime: NumberCodec
  proofSize: NumberCodec
}
