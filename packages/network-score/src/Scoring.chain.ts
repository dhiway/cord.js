// import {
//   RatingType,
//   IEntityScoreDetails,
//   SCORE_MODULUS,
//   IJournalContent,
//   IRatingData,
// } from '@cord.network/types'
// import { ConfigService } from '@cord.network/config'
// import { SDKErrors } from '@cord.network/utils'
// import { uriToIdentifier } from '@cord.network/identifier'

// /**
//  * @param scoreId
//  * @param scoreType
//  */
// export async function fetchJournalFromChain(
//   scoreId: string,
//   scoreType: RatingType
// ): Promise<IJournalContent | null> {
//   const api = ConfigService.get('api')
//   const cordScoreId = uriToIdentifier(scoreId)
//   const encodedScoreEntry = await api.query.score.journal(
//     cordScoreId,
//     scoreType
//   )
//   const decodedScoreEntry = fromChain(encodedScoreEntry)
//   if (decodedScoreEntry === null) {
//     throw new SDKErrors.ScoreMissingError(
//       `There is not a Score of type ${scoreType} with the provided ID "${scoreId}" on chain.`
//     )
//   } else return decodedScoreEntry
// }

// /**
//  * @param encodedEntry
//  */
// export function fromChain(encodedEntry: any): IJournalContent | null {
//   if (encodedEntry.isSome) {
//     const unwrapped = encodedEntry.unwrap()
//     return {
//       entity: unwrapped.entry.entity.toString(),
//       tid: JSON.stringify(unwrapped.entry.tid.toHuman()),
//       collector: unwrapped.entry.collector.toString(),
//       rating_type: unwrapped.entry.ratingType.toString(),
//       rating: parseInt(unwrapped.entry.rating.toString()) / SCORE_MODULUS,
//       entry_type: unwrapped.entry.entryType.toString(),
//       count: parseInt(unwrapped.entry.count.toString()),
//     }
//   }
//   return null
// }

// /**
//  * @param entityUri
//  * @param scoreType
//  */
// export async function fetchScore(
//   entityUri: string,
//   scoreType: RatingType
// ): Promise<IEntityScoreDetails> {
//   const api = ConfigService.get('api')
//   const encoded = await api.query.score.scores(entityUri, scoreType)
//   if (encoded.isSome) {
//     const decoded = encoded.unwrap()
//     return {
//       rating: JSON.parse(decoded.rating.toString()),
//       count: JSON.parse(decoded.count.toString()),
//     }
//   }
//   throw new SDKErrors.ScoreMissingError(
//     `There is not a Score of type ${scoreType} with the provided ID "${entityUri}" on chain.`
//   )
// }

// /**
//  * @param ratingData
//  * @param authorization
//  */
// export async function toChain(
//   /**
//    * This function rerturns the jornal creation extrinsic.
//    */
//   ratingData: IRatingData,
//   authorization: string
// ) {
//   const api = ConfigService.get('api')
//   const { ratingInput } = ratingData
//   const auth = uriToIdentifier(authorization)
//   try {
//     const journalCreationExtrinsic = await api.tx.score.addRating(
//       ratingInput,
//       auth
//     )
//     return journalCreationExtrinsic
//   } catch (e: any) {
//     return e.message
//   }
// }
