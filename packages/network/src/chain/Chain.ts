/**
 * Chain bridges that connects the SDK and the CORD Chain.
 *
 * Communicates with the chain via WebSockets and can [[listenToBlocks]]. It exposes the [[signTx]] function that performs the necessary tx signing.
 *
 * @packageDocumentation
 * @module Chain
 */
import { SubmittableResult } from '@polkadot/api'
import { AnyNumber } from '@polkadot/types/types'

import { ConfigService } from '@cord.network/config'
import type {
  ISubmittableResult,
  KeyringPair,
  SubmittableExtrinsic,
  SubscriptionPromise,
} from '@cord.network/types'
import { SDKErrors } from '@cord.network/utils'
import { V1Weight, V2Weight, BN } from '@cord.network/types'
import type {
  RuntimeDispatchWeightInfoV1,
  RuntimeDispatchWeightInfoV2,
} from '@cord.network/augment-api'
import { ErrorHandler } from '../errorhandling/index.js'
import { makeSubscriptionPromise } from './SubscriptionPromise.js'

export const TxOutdated = 'Transaction is outdated'
export const TxPriority = 'Priority is too low:'
export const TxDuplicate = 'Transaction Already Imported'
/**
 * Evaluator resolves on extrinsic reaching status "is ready".
 *
 * @param result Submission result.
 * @returns Whether the extrinsic reached status "is ready".
 */
export function IS_READY(result: ISubmittableResult): boolean {
  return result.status.isReady
}

/**
 * Evaluator resolves on extrinsic reaching status "in block".
 *
 * @param result Submission result.
 * @returns Whether the extrinsic reached status "in block".
 */
export function IS_IN_BLOCK(result: ISubmittableResult): boolean {
  return result.isInBlock
}

/**
 * Evaluator resolves on extrinsic reaching status "success".
 *
 * @param result Submission result.
 * @returns Whether the extrinsic reached status "success".
 */
export function EXTRINSIC_EXECUTED(result: ISubmittableResult): boolean {
  return ErrorHandler.extrinsicSuccessful(result)
}

/**
 * Evaluator resolves on extrinsic reaching status "finalized".
 *
 * @param result Submission result.
 * @returns Whether the extrinsic reached status "finalized".
 */
export function IS_FINALIZED(result: ISubmittableResult): boolean {
  return result.isFinalized
}

/**
 * Evaluator resolves on extrinsic reaching status "is error".
 *
 * @param result Submission result.
 * @returns Whether the extrinsic reached status "is error" and the error itself.
 */
export function IS_ERROR(
  result: ISubmittableResult
): boolean | Error | undefined {
  return result.isError || result.internalError
}

/**
 * Evaluator resolves on extrinsic reaching status "is ready".
 *
 * @param result Submission result.
 * @returns Whether the extrinsic reached status "is ready".
 */
export function EXTRINSIC_FAILED(result: ISubmittableResult): boolean {
  return ErrorHandler.extrinsicFailed(result)
}

function defaultResolveOn(): SubscriptionPromise.ResultEvaluator {
  return ConfigService.isSet('submitTxResolveOn')
    ? ConfigService.get('submitTxResolveOn')
    : IS_FINALIZED
}

/**
 * Converts the weight information of an extrinsic to a BN (Big Number).
 *
 * @param weight - The weight information of an extrinsic.
 * @returns The weight as a BN.
 */
export function convertWeight(weight: V1Weight | V2Weight): BN {
  if ('refTime' in weight) {
    // V2 or V1.5 weight
    return (weight as V2Weight).refTime.toBn()
  }
  // V1 weight
  return (weight as V1Weight).toBn()
}

/**
 * Calculates the maximum number of the same extrinsics that can be batched into a block.
 *
 * @param tx The extrinsic to be checked.
 * @returns A promise that resolves to the maximum number of the same extrinsics that can be batched.
 */
export async function getMaxBatchable(
  tx: SubmittableExtrinsic
): Promise<number> {
  const api = ConfigService.get('api')
  // if (!api.hasSubscriptions) {
  //   throw new SDKErrors.SubscriptionsNotSupportedError()
  // }
  //
  type Weight = RuntimeDispatchWeightInfoV1 | RuntimeDispatchWeightInfoV2

  // Get weight information for the input extrinsic
  const weightInfo = (await api.call.transactionWeightApi.queryWeightInfo(
    tx
  )) as Weight

  const extrinsicRefTime = convertWeight(weightInfo.weight)

  // Get the max block weight and convert it
  const maxRefTime = convertWeight(api.consts.system.blockWeights.maxBlock)

  // Use only 75% of the max block weight
  const totalRefTime = maxRefTime.muln(75).divn(100)

  // Initialize variables
  let remainingRefTime = totalRefTime.clone()
  let count = 0

  // Calculate how many of the same extrinsics can fit into a batch
  while (remainingRefTime.gte(extrinsicRefTime)) {
    remainingRefTime = remainingRefTime.sub(extrinsicRefTime)
    count += 1
  }

  return count
}

/**
 * Submits a signed SubmittableExtrinsic and attaches a callback to monitor the inclusion status of the transaction
 * and possible errors in the execution of extrinsics. Returns a promise to that end which by default resolves upon
 * finalization or rejects if any errors occur during submission or execution of extrinsics. This behavior can be adjusted via optional parameters or via the [[ConfigService]].
 *
 * Transaction fees will apply whenever a transaction fee makes it into a block, even if extrinsics fail to execute correctly!
 *
 * @param tx The SubmittableExtrinsic to be submitted. Most transactions need to be signed, this must be done beforehand.
 * @param opts Allows overwriting criteria for resolving/rejecting the transaction result subscription promise. These options take precedent over configuration via the ConfigService.
 * @returns A promise which can be used to track transaction status.
 * If resolved, this promise returns ISubmittableResult that has led to its resolution.
 */
export async function submitSignedTx(
  tx: SubmittableExtrinsic,
  opts: Partial<SubscriptionPromise.Options> = {}
): Promise<ISubmittableResult> {
  const {
    resolveOn = defaultResolveOn(),
    rejectOn = (result: ISubmittableResult) =>
      EXTRINSIC_FAILED(result) || IS_ERROR(result),
  } = opts

  const api = ConfigService.get('api')
  if (!api.hasSubscriptions) {
    throw new SDKErrors.SubscriptionsNotSupportedError()
  }

  const { promise, subscription } = makeSubscriptionPromise({
    ...opts,
    resolveOn,
    rejectOn,
  })

  let latestResult: SubmittableResult | undefined
  const unsubscribe = await tx.send((result) => {
    latestResult = result
    subscription(result)
  })

  function handleDisconnect(): void {
    const result = new SubmittableResult({
      events: latestResult?.events || [],
      internalError: new Error('connection error'),
      status:
        latestResult?.status ||
        api.registry.createType('ExtrinsicStatus', 'future'),
      txHash: api.registry.createType('Hash'),
    })
    subscription(result)
  }

  api.once('disconnected', handleDisconnect)

  try {
    return await promise
  } catch (e) {
    throw ErrorHandler.getExtrinsicError(e as ISubmittableResult) || e
  } finally {
    unsubscribe()
    api.off('disconnected', handleDisconnect)
  }
}

export const dispatchTx = submitSignedTx

/**
 * Signs and submits the SubmittableExtrinsic with optional resolution and rejection criteria.
 *
 * @param tx The generated unsigned SubmittableExtrinsic to submit.
 * @param signer The [[CordKeyringPair]] used to sign the tx.
 * @param opts - Optional parameters including nonce and subscription options.
 * @param opts.nonce Optional nonce value for the transaction.
 * @returns Promise result of executing the extrinsic, of type ISubmittableResult.
 */
export async function signAndSubmitTx(
  tx: SubmittableExtrinsic,
  signer: KeyringPair,
  {
    nonce = -1,
    ...opts
  }: Partial<SubscriptionPromise.Options> & Partial<{ nonce: AnyNumber }> = {}
): Promise<ISubmittableResult> {
  const signedTx = await tx.signAsync(signer, { nonce })
  return submitSignedTx(signedTx, opts)
}
