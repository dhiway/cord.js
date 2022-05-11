/**
 * @group unit/vc-js
 */

import { Chain as Blockchain } from '@cord.network/network'
import jsigs, { purposes } from 'jsonld-signatures'
import { Mark } from '@cord.network/modules'
import vcjs from 'vc-js'
import jsonld from 'jsonld'
import MarkSuite from './CordAnchoredSuite'
import credential from '../examples/example-vc.json'
import { documentLoader } from '../documentLoader'
import type { AttestedProof } from '../../types'
import { CORD_ANCHORED_PROOF_TYPE } from '../../constants'

const mark = Mark.fromMark({
  streamHash:
    '0x24195dd6313c0bb560f3043f839533b54bcd32d602dd848471634b0345ec88ad',
  mTypeHash:
    '0xf0fd09f9ed6233b2627d37eb5d6c528345e8945e0b610e70997ed470728b2ebf',
  issuer: '4sejigvu6STHdYmmYf2SuN92aNp8TbrsnBBDUj7tMrJ9Z3cG',
  delegationId: null,
  revoked: false,
})

const spy = jest
  .spyOn(Mark, 'query')
  .mockImplementation(async (): Promise<Mark | null> => mark)

let suite: MarkSuite
let purpose: purposes.ProofPurpose
let proof: AttestedProof

beforeAll(async () => {
  const CordConnection = new Blockchain({} as any)
  suite = new MarkSuite({ CordConnection })
  purpose = new purposes.AssertionProofPurpose()
  credential.proof.some((p) => {
    if (p.type === CORD_ANCHORED_PROOF_TYPE) {
      proof = p as AttestedProof
      return true
    }
    return false
  })
})

describe('jsigs', () => {
  describe('proof matching', () => {
    it('purpose matches compacted proof', async () => {
      const compactedProof = await jsonld.compact(
        { ...proof, '@context': credential['@context'] },
        'https://w3id.org/security/v2',
        { documentLoader, compactToRelative: false }
      )
      await expect(purpose.match(compactedProof, {})).resolves.toBe(true)
      await expect(
        purpose.match(compactedProof, { document: credential, documentLoader })
      ).resolves.toBe(true)
    })

    it('suite matches proof', async () => {
      const proofWithContext = { ...proof, '@context': credential['@context'] }
      await expect(suite.matchProof({ proof: proofWithContext })).resolves.toBe(
        true
      )
      await expect(
        suite.matchProof({
          proof: proofWithContext,
          document: credential,
          purpose,
          documentLoader,
        })
      ).resolves.toBe(true)
    })
  })

  describe('attested', () => {
    beforeAll(() => {
      spy.mockImplementation(async (): Promise<Mark> => mark)
    })

    it('verifies Cord Mark Proof', async () => {
      await expect(
        jsigs.verify(credential, { suite, purpose, documentLoader })
      ).resolves.toMatchObject({ verified: true })
    })
  })

  describe('revoked', () => {
    beforeAll(() => {
      const revoked = { ...mark, revoked: true }
      spy.mockImplementation(async (): Promise<Mark> => revoked as Mark)
    })

    it('fails to verify Cord Mark Proof', async () => {
      await expect(
        jsigs.verify(credential, { suite, purpose, documentLoader })
      ).resolves.toMatchObject({ verified: false })
    })
  })

  describe('not attested', () => {
    beforeAll(() => {
      spy.mockImplementation(async (): Promise<Mark | null> => null)
    })

    it('fails to verify Cord Mark Proof', async () => {
      await expect(
        jsigs.verify(credential, { suite, purpose, documentLoader })
      ).resolves.toMatchObject({ verified: false })
    })
  })
})

describe('vc-js', () => {
  describe('attested', () => {
    beforeAll(() => {
      spy.mockImplementation(async (): Promise<Mark> => mark)
    })

    it('verifies Cord Mark Proof', async () => {
      await expect(
        vcjs.verifyCredential({ credential, suite, purpose, documentLoader })
      ).resolves.toMatchObject({ verified: true })
    })
  })

  describe('revoked', () => {
    beforeAll(() => {
      const revoked = { ...mark, revoked: true }
      spy.mockImplementation(async (): Promise<Mark> => revoked as Mark)
    })

    it('fails to verify Cord Mark Proof', async () => {
      await expect(
        vcjs.verifyCredential({ credential, suite, purpose, documentLoader })
      ).resolves.toMatchObject({ verified: false })
    })
  })

  describe('not attested', () => {
    beforeAll(() => {
      spy.mockImplementation(async (): Promise<Mark | null> => null)
    })

    it('fails to verify Cord Mark Proof', async () => {
      await expect(
        vcjs.verifyCredential({ credential, suite, purpose, documentLoader })
      ).resolves.toMatchObject({ verified: false })
    })
  })
})
