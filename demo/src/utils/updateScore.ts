import * as Cord from '@cord.network/sdk'
import { IJournalContent } from '@cord.network/types'

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
  const outputFromScore = Cord.Score.fromJournalContent(
    journalContent,
    authorIdentity.address
  )
  try {
    const check = await Cord.Score.makeScoreEntryToChain(
      outputFromScore,
      registryAuthority,
      authorDid,
      authorKeys,
      authorIdentity
    )
    return check
  } catch (e) {
    return e.message
  }
}
