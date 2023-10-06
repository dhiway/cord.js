import type { ICompact, INumber } from '@polkadot/types/types'

export type V1Weight = INumber

export interface V2Weight {
  refTime: ICompact<INumber>
  proofSize: ICompact<INumber>
}
