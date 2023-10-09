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
import type { CordStatementProof } from '../../types.js'
import { verifyStatementProof, StatementStatus } from '../../verificationUtils.js'
import { CORD_ANCHORED_PROOF_TYPE } from '../../constants.js'
import CordAbstractSuite from './CordAbstractSuite.js'

class StatementError extends Error {
  public readonly statementStatus: StatementStatus

  constructor(message: string, statementStatus: StatementStatus) {
    super(message)
    this.name = 'StatementError'
    this.statementStatus = statementStatus
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
      const compactedProof = await this.compactProof<CordStatementProof>(
        proof,
        options
      )
      this.setConnection()
      const { verified, errors, status } = await verifyStatementProof(
        compactedDoc,
        compactedProof
      )
      if (errors.length > 0)
        return {
          verified,
          error: new StatementError(errors[0].message, status),
        }
      return { verified }
    } catch (e: any) {
      return { verified: false, error: e }
    }
  }
}
