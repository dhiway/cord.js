import * as Cord from '@cord.network/sdk'
import {
  IJournalContent,
  IRatingInput,
} from '@cord.network/types'
import { Crypto } from '@cord.network/utils'

/**
 * This function anchors the score on the blockchain
 * @param journalContent - Score entry details
 * @param registryAuthority - Registry authority 
 * @param authorIdentity - The account that will be used to sign and submit the extrinsic.
 * @param authorDid - DID of the entity which anchors the transaction.
 * @param authorKeys -  Keys which are used to sign.
 * @returns the hash of the score entry if the operation is executed successfully.
 */

export async function updateScore(
  journalContent: IJournalContent,
  registryAuthority: String,
  authorIdentity: Cord.CordKeyringPair,
  authorDid: Cord.DidUri,
  authorKeys: Cord.CordKeyringPair
) {
  const api = Cord.ConfigService.get('api')
  const digest = Crypto.coToUInt8(journalContent.toString(), false)
  const root = Crypto.hash(digest)
  const h256String = Crypto.u8aToHex(root)
  const authorization = registryAuthority.replace('auth:cord:', '')
  const ratingInput: IRatingInput = {
    journalContent,
    h256String,
    authorization,
  }

  const journalCreationExtrinsic = await api.tx.scoring.entries(
    ratingInput,
    authorization
  )

  const authorizedStreamTx = await Cord.Did.authorizeTx(
    authorDid,
    journalCreationExtrinsic,
    async ({ data }) => ({
      signature: authorKeys.assertionMethod.sign(data),
      keyType: authorKeys.assertionMethod.type,
    }),
    authorIdentity.address
  )

  try {
    await Cord.Chain.signAndSubmitTx(authorizedStreamTx, authorIdentity)
    return h256String
  } catch (error) {
    console.log('Error:\n',error.message)
  }
}
