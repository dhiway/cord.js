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
  IRatingRevokeEntry,
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
import {
  hashToUri,
  isValidIdentifier,
  uriToIdentifier,
} from '@cord.network/identifier'
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
      ...(entry.referenceId !== undefined && {
        referenceId: entry.referenceId,
      }),
      providerDid: Did.toChain(provider),
      totalEncodedRating: encodeRatingValue(totalRating),
    }
    if (entry.referenceId) {
      const [isValid, error] = isValidIdentifier(entry.referenceId)
      if (!isValid) {
        throw new SDKErrors.InvalidIdentifierError(
          error || `Invalid identifier: ${entry.referenceId}`
        )
      }
      entryTransform.referenceId = uriToIdentifier(entry.referenceId)
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
export async function buildFromRevokeRatingProperties(
  rating: IRatingRevokeEntry,
  chainSpace: SpaceUri,
  authorUri: DidUri,
  signCallback: SignCallback
): Promise<{ uri: RatingEntryUri; details: IRatingDispatch }> {
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

    details.entry = rating.entry

    return { uri, details }
  } catch (error) {
    throw new SDKErrors.RatingPropertiesError(
      `Rating content transformation error: "${error}".`
    )
  }
}
