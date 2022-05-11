/**
 * @packageDocumentation
 * @module IBlockchain
 */

import '@polkadot/api-augment'
import type { ApiPromise } from '@polkadot/api'
import type { Header } from '@polkadot/types/interfaces/types'
import { AnyNumber } from '@polkadot/types/types'
import type BN from 'bn.js'
import type {
  IIdentity,
  ISubmittableResult,
  SubmittableExtrinsic,
  SubscriptionPromise,
} from './index.js'

export type ReSignOpts = { reSign: boolean; tip: AnyNumber }
export type ChainStats = {
  chain: string
  nodeName: string
  nodeVersion: string
}

export interface IChainApi {
  api: ApiPromise

  getStats(): Promise<ChainStats>
  listenToBlocks(listener: (header: Header) => void): Promise<() => void>
  signTx(
    identity: IIdentity,
    tx: SubmittableExtrinsic,
    tip?: AnyNumber
  ): Promise<SubmittableExtrinsic>
  submitSignedTxWithReSign(
    tx: SubmittableExtrinsic,
    identity?: IIdentity,
    opts?: Partial<SubscriptionPromise.Options>
  ): Promise<ISubmittableResult>
  getNonce(accountAddress: string): Promise<BN>
  reSignTx(
    identity: IIdentity,
    tx: SubmittableExtrinsic
  ): Promise<SubmittableExtrinsic>
}
