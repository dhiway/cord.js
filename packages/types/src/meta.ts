import { HexString } from '@polkadot/util/types.js'
import type { IPublicIdentity } from './PublicIdentity.js'

export interface IMetaDetails {
  identifier: string
  meta: HexString
  metaHash: HexString
  controller: IPublicIdentity['address']
  controllerSignature: string
}

export interface IMetaDataDetails {
  identifier: string
  meta: string
  metaHash: HexString
  controller: IPublicIdentity['address']
}
