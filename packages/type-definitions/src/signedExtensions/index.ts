import type { ExtDef } from '@polkadot/types/extrinsic/signedExtensions/types'
import { emptyCheck } from './emptyCheck'
// import { objectSpread } from '@polkadot/util'

export const cordSignedExtensions: ExtDef = {
  CheckExtrinsicAuthor: emptyCheck,
  PalletExtrinsicAuthorshipCheckExtrinsicAuthor: emptyCheck,
}

// export const userExtensions: ExtDef = objectSpread({}, cord)

// export const signedExtensions = {
//   CheckExtrinsicAuthor: {
//     extrinsic: {},
//     payload: {},
//   },
// } as ExtDef
