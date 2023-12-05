import type { ExtDef } from '@polkadot/types/extrinsic/signedExtensions/types'
import { emptyCheck } from './emptyCheck.js'

export const cordSignedExtensions: ExtDef = {
  CheckNetworkMembership: emptyCheck,
  PalletNetworkMembershipCheckNetworkMembership: emptyCheck,
}
