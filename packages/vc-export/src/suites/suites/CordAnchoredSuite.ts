/* eslint-disable max-classes-per-file */
import { ApiPromise } from '@polkadot/api'
import { ConfigService } from '@cord.network/config'
import type {
  DocumentLoader,
  ExpansionMap,
  Proof,
  purposes,
  VerificationResult,
} from 'jsonld-signatures'
import type { JsonLdObj } from 'jsonld/jsonld-spec'
import type { CordStreamProof } from '../../types.js'
import { verifyStreamProof, StreamStatus } from '../../verificationUtils.js'
import { CORD_ANCHORED_PROOF_TYPE } from '../../constants.js'
import CordAbstractSuite from './CordAbstractSuite.js'

class StreamError extends Error {
  public readonly streamStatus: StreamStatus

  constructor(message: string, streamStatus: StreamStatus) {
    super(message)
    this.name = 'StreamError'
    this.streamStatus = streamStatus
  }
}

export default class CordAnchoredSuite extends CordAbstractSuite {
  private readonly provider: ApiPromise

  constructor(options: { CordConnection: ApiPromise }) {
    // vc-js complains when there is no verificationMethod
    super({ type: CORD_ANCHORED_PROOF_TYPE, verificationMethod: '<none>' })
    if (
      !options.CordConnection ||
      !(options.CordConnection instanceof ApiPromise)
    )
      throw new TypeError('CordConnection must be a Cord blockchain connection')
    this.provider = options.CordConnection
  }

  private setConnection(): void {
    ConfigService.set(Promise.resolve(this.provider))
  }

  public async verifyProof(options: {
    proof: Proof
    document: JsonLdObj
    purpose?: purposes.ProofPurpose
    documentLoader?: DocumentLoader
    expansionMap?: ExpansionMap
  }): Promise<VerificationResult> {
    try {
      const { document, proof } = options
      if (!document || typeof document !== 'object')
        throw new TypeError('document must be a JsonLd object')
      if (!proof || typeof proof !== 'object')
        throw new TypeError('proof must be a JsonLd object')
      const compactedDoc = await this.compactDoc(document, options)
      const compactedProof = await this.compactProof<CordStreamProof>(
        proof,
        options
      )
      this.setConnection()
      const { verified, errors, status } = await verifyStreamProof(
        compactedDoc,
        compactedProof
      )
      if (errors.length > 0)
        return {
          verified,
          error: new StreamError(errors[0].message, status),
        }
      return { verified }
    } catch (e: any) {
      return { verified: false, error: e }
    }
  }
}
