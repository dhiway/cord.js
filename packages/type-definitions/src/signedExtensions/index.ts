import type { ExtDef } from '@cord.network/types'
import { emptyCheck } from './emptyCheck.js'

export const cordSignedExtensions: ExtDef = {
  CheckNetworkMembership: emptyCheck,
  PalletNetworkMembershipCheckNetworkMembership: emptyCheck,
}
