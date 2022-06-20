/* eslint-disable max-classes-per-file */
import { Chain, ChainApiConnection } from '@cord.network/network'
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

class MarkError extends Error {
  public readonly journalStatus: StreamStatus

  constructor(message: string, journalStatus: StreamStatus) {
    super(message)
    this.name = 'JournalError'
    this.journalStatus = journalStatus
  }
}

export default class CordAnchoredSuite extends CordAbstractSuite {
  private readonly provider: Chain

  constructor(options: { CordConnection: Chain }) {
    // vc-js complains when there is no verificationMethod
    super({ type: CORD_ANCHORED_PROOF_TYPE, verificationMethod: '<none>' })
    if (!options.CordConnection || !(options.CordConnection instanceof Chain))
      throw new TypeError('CordConnection must be a Cord blockchain connection')
    this.provider = options.CordConnection
  }

  private setConnection(): void {
    ChainApiConnection.setConnection(Promise.resolve(this.provider))
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
          error: new MarkError(errors[0].message, status),
        }
      return { verified }
    } catch (e: any) {
      return { verified: false, error: e }
    }
  }
}
