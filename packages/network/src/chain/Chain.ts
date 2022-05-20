/**
 * Chain bridges that connects the SDK and the CORD Chain.
 *
 * Communicates with the chain via WebSockets and can [[listenToBlocks]]. It exposes the [[signTx]] function that performs the necessary tx signing.
 *
 * @packageDocumentation
 * @module Chain
 */
import type { ApiPromise } from '@polkadot/api'
import type { Header } from '@polkadot/types/interfaces/types'
import type { AnyJson, AnyNumber, Codec } from '@polkadot/types/types'
import type { Text } from '@polkadot/types'
import type { SignerPayloadJSON } from '@polkadot/types/types/extrinsic'
import { BN } from '@polkadot/util'
import { ConfigService } from '@cord.network/config'
import type {
  IIdentity,
  ISubmittableResult,
  SubmittableExtrinsic,
  IChainApi,
  ChainStats,
  SubscriptionPromise,
} from '@cord.network/types'
import { isRecoverableTxError, submitSignedTx } from './Chain.utils.js'

const log = ConfigService.LoggingFactory.getLogger('Chain')

// Code taken from
// https://polkadot.js.org/api/api/classes/_promise_index_.apipromise.html

/**
 * Blockchain bridges that connects the SDK and the KILT Blockchain.
 *
 * Communicates with the chain via WebSockets and can [[listenToBlocks]]. It exposes the [[signTx]] function that performs the necessary tx signing.
 */
export class Chain implements IChainApi {
  public static asArray(queryResult: Codec): AnyJson[] {
    const json = queryResult.toJSON()
    if (json instanceof Array) return json
    return []
  }

  public api: ApiPromise
  private accountNonces: Map<IIdentity['address'], BN>

  public constructor(api: ApiPromise) {
    this.api = api
    this.accountNonces = new Map<IIdentity['address'], BN>()
  }

  public async getStats(): Promise<ChainStats> {
    const encoded: Text[] = await Promise.all([
      this.api.rpc.system.chain(),
      this.api.rpc.system.name(),
      this.api.rpc.system.version(),
    ])
    const [chain, nodeName, nodeVersion] = encoded.map((el) => el.toString())
    return { chain, nodeName, nodeVersion }
  }

  // TODO: implement unsubscribe as subscriptionId continuously increases
  public async listenToBlocks(
    listener: (header: Header) => void
  ): Promise<() => void> {
    return this.api.rpc.chain.subscribeNewHeads(listener)
  }
  /**
   * [ASYNC] Signs the SubmittableExtrinsic with the given identity.
   *
   * @param signer The [[Identity]] to sign the tx with.
   * @param tx The unsigned SubmittableExtrinsic.
   * @param tip The amount of tip the validator.
   * @returns Signed [[SubmittableExtrinsic]].
   *
   */
  public async signTx(
    signer: IIdentity,
    tx: SubmittableExtrinsic,
    tip?: AnyNumber
  ): Promise<SubmittableExtrinsic> {
    const nonce = await this.getNonce(signer.address)
    return tx.signAsync(signer.signKeyringPair, {
      nonce,
      tip,
    })
  }

  /**
   * [ASYNC] Submits a signed SubmittableExtrinsic with imported function [[submitSignedTx]].
   * Handles recoverable errors if identity is provided by re-signing and re-sending the tx up to two times.
   * Uses [[parseSubscriptionOptions]] to provide complete potentially defaulted options to the called [[submitSignedTx]].
   *
   * Transaction fees will apply whenever a transaction fee makes it into a block, even if extrinsics fail to execute correctly!
   *
   * @param tx The SubmittableExtrinsic to be submitted. Most transactions need to be signed, this must be done beforehand.
   * @param signer Optional [[Identity]] to potentially re-sign the tx with.
   * @param opts Optional partial criteria for resolving/rejecting the promise.
   * @returns A promise which can be used to track transaction status.
   * If resolved, this promise returns the eventually resolved ISubmittableResult.
   */
  async submitSignedTxWithReSign(
    tx: SubmittableExtrinsic,
    signer?: IIdentity,
    opts?: Partial<SubscriptionPromise.Options>
  ): Promise<ISubmittableResult> {
    const retry = async (
      reason: Error | ISubmittableResult
    ): Promise<ISubmittableResult> => {
      if (isRecoverableTxError(reason) && signer) {
        return submitSignedTx(await this.reSignTx(signer, tx), opts)
      }
      return Promise.reject(reason)
    }
    return submitSignedTx(tx, opts).catch(retry).catch(retry)
  }

  /**
   * [ASYNC] Retrieves the Nonce for Transaction signing for the specified account and increments the in accountNonces mapped Index.
   *
   * @param accountAddress The address of the identity that we retrieve the nonce for.
   * @returns Representation of the Tx nonce for the identity.
   *
   */
  public async getNonce(accountAddress: IIdentity['address']): Promise<BN> {
    let nonce = this.accountNonces.get(accountAddress)
    if (!nonce) {
      // the account nonce is unknown, we will query it from chain
      const chainNonce = await this.api.rpc.system
        .accountNextIndex(accountAddress)
        .catch((reason) => {
          log.error(
            `On-chain nonce retrieval failed for account ${accountAddress}\nwith reason: ${reason}`
          )
          throw Error(`Chain failed to retrieve nonce for : ${accountAddress}`)
        })
      // ensure that the nonce we queried is still up to date and no newer nonce was queried during the await above
      const secondQuery = this.accountNonces.get(accountAddress)
      nonce = BN.max(chainNonce, secondQuery || new BN(0))
    }
    this.accountNonces.set(accountAddress, nonce.addn(1))
    return nonce
  }

  /**
   * [ASYNC] Re-signs the given SubmittableExtrinsic with an updated Nonce.
   *
   * @param signer The [[Identity]] to re-sign the Tx with.
   * @param tx The tx with recoverable Error that failed.
   * @returns Original Tx, injected with signature payload with updated nonce.
   *
   */
  public async reSignTx(
    signer: IIdentity,
    tx: SubmittableExtrinsic
  ): Promise<SubmittableExtrinsic> {
    this.accountNonces.delete(signer.address)
    const nonce: BN = await this.getNonce(signer.address)
    const signerPayload: SignerPayloadJSON = this.api
      .createType('SignerPayload', {
        method: tx.method.toHex(),
        nonce,
        genesisHash: this.api.genesisHash,
        blockHash: this.api.genesisHash,
        runtimeVersion: this.api.runtimeVersion,
        version: this.api.extrinsicVersion,
      })
      .toPayload()
    tx.addSignature(
      signer.address,
      this.api
        .createType('ExtrinsicPayload', signerPayload, {
          version: this.api.extrinsicVersion,
        })
        .sign(signer.signKeyringPair).signature,
      signerPayload
    )
    return tx
  }
}
