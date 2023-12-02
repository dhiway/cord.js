import {
  IRatingContent,
  IRatingTransformed,
  IRatingEntry,
  EntityTypeOf,
  RatingTypeOf,
  DidUri,
  blake2AsHex,
  RATING_IDENT,
  RATING_PREFIX,
  IRatingDispatch,
  RatingEntryUri,
  SpaceUri,
  SignCallback,
  // RatingPartialEntry,
  IRatingRevokeEntry,
  PartialDispatchEntry,
  SignResponseData,
} from '@cord.network/types'
import type {
  AccountId,
  H256,
  Bytes,
  SpaceId,
  HexString,
  DidSignature,
} from '@cord.network/types'
import {
  isDidSignature,
  verifyDidSignature,
  resolveKey,
  signatureToJson,
  signatureFromJson,
} from '@cord.network/did'
import { hashToUri, uriToIdentifier } from '@cord.network/identifier'
import { Crypto, SDKErrors, UUID } from '@cord.network/utils'
import { ConfigService } from '@cord.network/config'
import * as Did from '@cord.network/did'

function validateRatingContent(
  ratingContent: IRatingContent | IRatingTransformed
): void {
  const allFieldsFilled = Object.entries(ratingContent).every(
    ([key, value]) => {
      if (value === undefined || value === null || value === '') {
        throw new SDKErrors.RatingContentError(
          `Field '${key}' cannot be empty.`
        )
      }
      return true
    }
  )

  if (!allFieldsFilled) {
    throw new SDKErrors.RatingContentError('All fields must be filled.')
  }

  if ('totalRating' in ratingContent) {
    if (ratingContent.totalRating > ratingContent.countOfTxn * 5) {
      throw new SDKErrors.RatingContentError(
        `Total rating cannot exceed ${ratingContent.countOfTxn * 5}.`
      )
    }
  } else if (ratingContent.totalEncodedRating > ratingContent.countOfTxn * 50) {
    throw new SDKErrors.RatingContentError(
      `Total encoded rating cannot exceed ${ratingContent.countOfTxn * 50}.`
    )
  }

  if (!Object.values(EntityTypeOf).includes(ratingContent.entityType)) {
    throw new SDKErrors.RatingContentError(
      `Invalid entityType: ${ratingContent.entityType}.`
    )
  }

  if (!Object.values(RatingTypeOf).includes(ratingContent.ratingType)) {
    throw new SDKErrors.RatingContentError(
      `Invalid ratingType: ${ratingContent.ratingType}.`
    )
  }
}

function encodeRatingValue(totalRating: number, modulus = 10): number {
  return Math.round(totalRating * modulus)
}

/**
 * @param input
 * @param root0
 * @param root0.challenge
 * @param root0.didResolveKey
 * @param digest
 * @param signature
 * @param didResolveKey
 * @param providerUri
 * @param providerDid
 */
export async function verifySignature(
  digest: HexString,
  signature: DidSignature,
  providerDid: DidUri,
  didResolveKey = resolveKey
): Promise<void> {
  isDidSignature(signature)

  // const { entryDigest, providerSignature } = input
  const signingData = new Uint8Array([...Crypto.coToUInt8(digest)])

  await verifyDidSignature({
    ...signatureFromJson(signature),
    message: signingData,
    expectedSigner: providerDid,
    expectedVerificationMethod: 'assertionMethod',
    didResolveKey,
  })
}

function generateCommonFields(messageId?: string): {
  msgId: string
  transactionTime: string
} {
  const msgId = messageId || `msg-${UUID.generate()}`
  const transactionTime = new Date().toISOString()
  return { msgId, transactionTime }
}

async function hashAndSign(
  entry: any,
  provider: DidUri,
  signCallback: SignCallback
) {
  const entryDigest = Crypto.hashObjectAsHexStr(entry)
  const uint8Hash = new Uint8Array([...Crypto.coToUInt8(entryDigest)])
  const providerSignature = await signCallback({
    data: uint8Hash,
    did: provider,
    keyRelationship: 'assertionMethod',
  })
  return { entryDigest, providerSignature }
}

async function digestSignature(
  digest: HexString,
  author: DidUri,
  signCallback: SignCallback
) {
  const uint8Hash = new Uint8Array([...Crypto.coToUInt8(digest)])
  const authorSignature = await signCallback({
    data: uint8Hash,
    did: author,
    keyRelationship: 'assertionMethod',
  })
  return authorSignature
}

/**
 * @param spaceDigest
 * @param entry
 * @param entryDigest
 * @param entryUid
 * @param entityUid
 * @param entryMsgId
 * @param chainSpace
 * @param providerUri
 * @param creatorUri
 */
export async function getUriForRatingEntry(
  entryDigest: HexString,
  entityUid: string,
  entryMsgId: string,
  chainSpace: SpaceId,
  providerUri: DidUri
): Promise<RatingEntryUri> {
  const api = ConfigService.get('api')
  const scaleEncodedRatingEntryDigest = api
    .createType<H256>('H256', entryDigest)
    .toU8a()
  const scaleEncodedEntityUid = api
    .createType<Bytes>('Bytes', entityUid)
    .toU8a()
  const scaleEncodedMessageId = api
    .createType<Bytes>('Bytes', entryMsgId)
    .toU8a()
  const scaleEncodedChainSpace = api
    .createType<Bytes>('Bytes', uriToIdentifier(chainSpace))
    .toU8a()
  const scaleEncodedProvider = api
    .createType<AccountId>('AccountId', Did.toChain(providerUri))
    .toU8a()
  const digest = blake2AsHex(
    Uint8Array.from([
      ...scaleEncodedRatingEntryDigest,
      ...scaleEncodedEntityUid,
      ...scaleEncodedMessageId,
      ...scaleEncodedChainSpace,
      ...scaleEncodedProvider,
    ])
  )
  return hashToUri(digest, RATING_IDENT, RATING_PREFIX) as RatingEntryUri
}

/**
 * @param entry
 * @param provider
 * @param signCallback
 * @param messageId
 */
export async function buildFromContentProperties(
  entry: IRatingContent,
  provider: DidUri,
  signCallback: SignCallback,
  messageId?: string
): Promise<IRatingEntry> {
  try {
    validateRatingContent(entry)

    const { msgId, transactionTime } = generateCommonFields(messageId)
    const { totalRating, ...restOfEntry } = entry

    const entryTransform: IRatingTransformed = {
      ...restOfEntry,
      ...(entry.referenceId && { referenceId: entry.referenceId }),
      providerDid: Did.toChain(provider),
      totalEncodedRating: encodeRatingValue(totalRating),
    }
    const { entryDigest, providerSignature } = await hashAndSign(
      { entryTransform, msgId, transactionTime },
      provider,
      signCallback
    )

    const transformedEntry: IRatingEntry = {
      entry: entryTransform,
      messageId: msgId,
      entryDigest,
      providerSignature: signatureToJson(providerSignature),
      ...(entry.referenceId && { referenceId: entry.referenceId }),
    }

    return transformedEntry
  } catch (error) {
    throw new SDKErrors.RatingContentError(
      `Rating content transformation error: "${error}".`
    )
  }
}

// Refactored buildFromRevokeContentProperties function
/**
 * @param entryUri
 * @param entityuid
 * @param entityUid
 * @param provider
 * @param signCallback
 * @param messageId
 */
export async function buildFromRevokeProperties(
  entryUri: RatingEntryUri,
  entityUid: string,
  provider: DidUri,
  signCallback: SignCallback,
  messageId?: string
): Promise<IRatingRevokeEntry> {
  try {
    const { msgId, transactionTime } = generateCommonFields(messageId)
    const entryTransform = { entryUri, msgId, provider, transactionTime }

    const { entryDigest, providerSignature } = await hashAndSign(
      entryTransform,
      provider,
      signCallback
    )

    const transformedEntry: IRatingRevokeEntry = {
      entryUri,
      entry: {
        messageId: msgId,
        entryDigest,
        referenceId: entryUri,
        providerSignature: signatureToJson(providerSignature),
      },
      entityUid,
      providerDid: provider,
    }

    return transformedEntry
  } catch (error) {
    throw new SDKErrors.RatingContentError(
      `Rating content transformation error: "${error}".`
    )
  }
}

// Utility function for validation of required fields
function validateRequiredFields(fields: any[]): void {
  const isFieldEmpty = (field: any): boolean => {
    return field === null || field === undefined || field === ''
  }

  if (fields.some(isFieldEmpty)) {
    throw new SDKErrors.RatingPropertiesError(
      'Required fields cannot be empty.'
    )
  }
}

// Utility function for validating HexString format
function validateHexString(entryDigest: string): void {
  if (!/^0x[0-9a-fA-F]+$/.test(entryDigest)) {
    throw new SDKErrors.RatingPropertiesError(
      'Invalid HexString for entryDigest.'
    )
  }
}

// Utility function for creating the ratingUri and common parts of the return object
async function createRatingObject(
  entryDigest: HexString,
  entityUid: string,
  messageId: string,
  chainSpace: SpaceUri,
  providerUri: DidUri,
  authorUri: DidUri,
  authorSig: SignResponseData
): Promise<{ uri: RatingEntryUri; details: any }> {
  const ratingUri = await getUriForRatingEntry(
    entryDigest,
    entityUid,
    messageId,
    chainSpace,
    providerUri
  )

  const authorSignature = signatureToJson(authorSig)

  return {
    uri: ratingUri,
    details: {
      entryUri: ratingUri,
      chainSpace,
      messageId,
      entryDigest,
      authorUri,
      authorSignature,
    },
  }
}

// Refactored buildFromRatingProperties function
/**
 * @param rating
 * @param chainSpace
 * @param creatorUri
 * @param authorUri
 * @param signCallback
 */
export async function buildFromRatingProperties(
  rating: IRatingEntry,
  chainSpace: SpaceUri,
  authorUri: DidUri,
  signCallback: SignCallback
): Promise<{ uri: RatingEntryUri; details: IRatingDispatch }> {
  try {
    validateRatingContent(rating.entry)
    verifySignature(
      rating.entryDigest,
      rating.providerSignature,
      Did.getDidUri(rating.entry.providerDid)
    )

    validateRequiredFields([
      chainSpace,
      authorUri,
      rating.messageId,
      rating.entryDigest,
    ])
    validateHexString(rating.entryDigest)

    const authorSignature = await digestSignature(
      rating.entryDigest,
      authorUri,
      signCallback
    )

    const { uri, details } = await createRatingObject(
      rating.entryDigest,
      rating.entry.entityUid,
      rating.messageId,
      chainSpace,
      Did.getDidUri(rating.entry.providerDid),
      authorUri,
      authorSignature
    )

    const { providerId, entityId, ...chainEntry } = rating.entry

    details.entry = chainEntry

    return { uri, details }
  } catch (error) {
    throw new SDKErrors.RatingPropertiesError(
      `Rating content transformation error: "${error}".`
    )
  }
}

// Refactored buildFromAmendRatingProperties function
/**
 * @param rating
 * @param chainSpace
 * @param creatorUri
 * @param authorUri
 * @param signCallback
 */
export async function buildFromAmendRatingProperties(
  rating: IRatingRevokeEntry,
  chainSpace: SpaceUri,
  authorUri: DidUri,
  signCallback: SignCallback
): Promise<{ uri: RatingEntryUri; details: PartialDispatchEntry }> {
  try {
    verifySignature(
      rating.entry.entryDigest,
      rating.entry.providerSignature,
      Did.getDidUri(rating.providerDid)
    )

    validateRequiredFields([
      chainSpace,
      authorUri,
      rating.entry.messageId,
      rating.entry.entryDigest,
    ])
    validateHexString(rating.entry.entryDigest)

    const authorSignature = await digestSignature(
      rating.entry.entryDigest,
      authorUri,
      signCallback
    )

    const { uri, details } = await createRatingObject(
      rating.entry.entryDigest,
      rating.entityUid,
      rating.entry.messageId,
      chainSpace,
      Did.getDidUri(rating.providerDid),
      authorUri,
      authorSignature
    )

    return { uri, details }
  } catch (error) {
    throw new SDKErrors.RatingPropertiesError(
      `Rating content transformation error: "${error}".`
    )
  }
}

// /**
//  * @param entry
//  * @param messageId
//  * @param rating
//  * @param chainSpace
//  * @param creatorUri
//  */
// export async function buildFromRatingProperties(
//   rating: IRatingEntry,
//   chainSpace: SpaceUri,
//   creatorUri: DidUri
// ): Promise<{ uri: RatingEntryUri; details: IRatingDispatch }> {
//   try {
//     validateRatingContent(rating.entry)
//     verifySignature(rating)

//     if (
//       !chainSpace ||
//       !creatorUri ||
//       !rating.messageId ||
//       !rating.entryDigest
//     ) {
//       throw new SDKErrors.RatingPropertiesError(
//         'Required fields cannot be empty.'
//       )
//     }

//     if (!/^0x[0-9a-fA-F]+$/.test(rating.entryDigest)) {
//       throw new SDKErrors.RatingPropertiesError(
//         'Invalid HexString for entryDigest.'
//       )
//     }
//     const partialRating: IRatingChainEntry = {
//       ...rating.entry,
//     }

//     const ratingUri = await getUriForRatingEntry(
//       rating.entryDigest,
//       rating.messageId,
//       chainSpace,
//       rating.providerUri,
//       creatorUri
//     )

//     const ratingEntry: IRatingDispatch = {
//       entryUri: ratingUri,
//       entry: partialRating,
//       chainSpace,
//       messageId: rating.messageId,
//       entryDigest: rating.entryDigest,
//       creatorUri,
//     }

//     return { uri: ratingUri, details: ratingEntry }
//   } catch (error) {
//     throw new SDKErrors.RatingPropertiesError(
//       `Rating content transformation error: "${error}".`
//     )
//   }
// }

// /**
//  * @param rating
//  * @param chainSpace
//  * @param creatorUri
//  */
// export async function buildFromAmendRatingProperties(
//   rating: IRatingRevokeEntry,
//   chainSpace: SpaceUri,
//   creatorUri: DidUri
// ): Promise<{ uri: RatingEntryUri; details: PartialDispatchEntry }> {
//   try {
//     verifySignature(rating.entry)

//     if (
//       !chainSpace ||
//       !creatorUri ||
//       !rating.entry.messageId ||
//       !rating.entry.entryDigest
//     ) {
//       throw new SDKErrors.RatingPropertiesError(
//         'Required fields cannot be empty.'
//       )
//     }

//     if (!/^0x[0-9a-fA-F]+$/.test(rating.entry.entryDigest)) {
//       throw new SDKErrors.RatingPropertiesError(
//         'Invalid HexString for entryDigest.'
//       )
//     }

//     const ratingUri = (await getUriForRatingEntry(
//       rating.entry.entryDigest,
//       rating.entry.messageId,
//       chainSpace,
//       rating.entry.providerUri,
//       creatorUri
//     )) as RatingEntryUri

//     const ratingEntry: PartialDispatchEntry = {
//       entryUri: ratingUri,
//       chainSpace,
//       messageId: rating.entry.messageId,
//       entryDigest: rating.entry.entryDigest,
//       creatorUri,
//     }

//     return { uri: ratingUri, details: ratingEntry }
//   } catch (error) {
//     throw new SDKErrors.RatingPropertiesError(
//       `Rating content transformation error: "${error}".`
//     )
//   }
// }

// /**
//  * @param journalContent
//  */
// export function transformRatingEntry(
//   journalContent: IJournalContent
// ): IJournalContent {
//   journalContent.rating = base10Encode(journalContent.rating)
//   verifyScoreStructure(journalContent)
//   return journalContent
// }

// /**
//  * @param rating
//  */
// export function computeActualRating(rating: number): number {
//   return rating / SCORE_MODULUS
// }

// /**
//  * @param rating
//  * @param count
//  */
// export function computeAverageRating(rating: number, count: number): number {
//   return rating / count
// }

// /**
//  * @param journalContent
//  */
// export function generateDigestFromJournalContent(
//   journalContent: IJournalContent
// ) {
//   const derivedObjectForHash: object = {
//     entity: journalContent.entity,
//     tid: journalContent.tid,
//     entry_type: journalContent.entry_type,
//     rating_type: journalContent.rating_type,
//   }
//   const digest = Crypto.hash(JSON.stringify(derivedObjectForHash))
//   const hexDigest = Crypto.u8aToHex(digest)
//   return hexDigest
// }

// /**
//  * @param journalContent
//  */
// export function getUriForScore(journalContent: IJournalContent) {
//   const scoreDigest = generateDigestFromJournalContent(journalContent)
//   return hashToUri(scoreDigest, SCORE_IDENT, SCORE_PREFIX)
// }

// /**
//  * @param journalContent
//  * @param creator
//  */
// export function transformRatingEntryToInput(
//   journalContent: IJournalContent,
//   creator: CordAddress
// ): IRatingInput {
//   const digest = generateDigestFromJournalContent(journalContent)
//   const ratingInput: IRatingInput = {
//     entry: journalContent,
//     digest,
//     creator,
//   }
//   return ratingInput
// }

// /**
//  * @param journalContent
//  * @param creator
//  */
// export function fromRatingEntry(
//   journalContent: IJournalContent,
//   creator: CordAddress
// ): IRatingData {
//   verifyScoreStructure(journalContent)
//   const ratingInput = transformRatingEntryToInput(journalContent, creator)
//   const { entry } = ratingInput
//   const scoreIdentifier = getUriForScore(entry)
//   const ratingType =
//     ratingInput.entry.rating_type === 'Overall'
//       ? RatingType.overall
//       : RatingType.delivery
//   verifyStoredEntry(scoreIdentifier, ratingType)
//   return {
//     ratingInput,
//     identifier: scoreIdentifier,
//   }
// }

// /**
//  * @param input
//  */
// export function verifyScoreStructure(input: IJournalContent) {
//   if (input.collector) {
//     if (typeof input.collector !== 'string')
//       throw new SDKErrors.ScoreCollectorTypeMissMatchError()
//   } else {
//     throw new SDKErrors.ScoreCollectorMissingError()
//   }

//   if (input.entity) {
//     if (typeof input.entity !== 'string')
//       throw new SDKErrors.ScoreEntityTypeMissMatchError()
//   } else {
//     throw new SDKErrors.ScoreEntityMissingError()
//   }

//   if (input.tid) {
//     if (typeof input.tid !== 'string')
//       throw new SDKErrors.ScoreTidTypeMissMatchError()
//   } else {
//     throw new SDKErrors.ScoreTidMissingError()
//   }

//   if (input.entry_type) {
//     if (
//       !(
//         input.entry_type === RatingEntry.credit ||
//         input.entry_type === RatingEntry.debit
//       )
//     )
//       throw new SDKErrors.ScoreRatingEntryTypeMissMatchError()
//   } else {
//     throw new SDKErrors.ScoreRatingEntryTypeMissingError()
//   }

//   if (input.count) {
//     if (typeof input.count !== 'number')
//       throw new SDKErrors.ScoreCountTypeMissMatchError()
//   } else {
//     throw new SDKErrors.ScoreCountMissingError()
//   }

//   if (input.rating) {
//     if (typeof input.rating !== 'number')
//       throw new SDKErrors.RatingInputTypeMissMatchError()
//     if (input.rating > input.count * MAX_SCORE_PER_ENTRY)
//       throw new SDKErrors.RatingExceedsMaxValueError()
//   } else {
//     throw new SDKErrors.ScoreRatingMissingError()
//   }

//   if (input.rating_type) {
//     if (
//       !(
//         input.rating_type === RatingType.overall ||
//         input.rating_type === RatingType.delivery
//       )
//     )
//       throw new SDKErrors.ScoreRatingTypeMissMatchError()
//   } else {
//     throw new SDKErrors.ScoreRatingTypeMissingError()
//   }
// }

// /**
//  * @param scoreIdentifier
//  * @param RatingType
//  */
// export async function verifyStoredEntry(
//   scoreIdentifier: string,
//   RatingType: RatingType
// ) {
//   const api = ConfigService.get('api')
//   const encodedScoreEntry = await api.query.score.journal(
//     scoreIdentifier.replace('score:cord:', ''),
//     RatingType
//   )
//   if (encodedScoreEntry.isSome) {
//     throw new SDKErrors.ScoreEntryAlreadyPresentError()
//   }
// }
