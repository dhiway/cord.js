/**
 * ChainSpace.
 *
 * @packageDocumentation
 * @module ChainSpace
 * @preferred
 */

import type {
  DidUri,
  SpaceId,
  IChainSpace,
  ChainSpaceIdentifiers,
  AuthorizationId,
  AccountId,
  H256,
} from '@cord.network/types'
import { Identifier, Crypto, UUID } from '@cord.network/utils'
import {
  SPACE_IDENT,
  SPACE_PREFIX,
  AUTHORIZATION_IDENT,
  AUTHORIZATION_PREFIX,
  blake2AsHex,
  Bytes,
} from '@cord.network/types'
import { ConfigService } from '@cord.network/config'
import * as Did from '@cord.network/did'

/**
 * Calculates the chain space Identifiers .
 *
 * @param registry  Registry for which to create the id.
 * @param serializedRegistry
 * @param spaceDigest
 * @param creator
 * @returns Registry id uri.
 */

function getChainSpaceIdentifiers(
  spaceDigest: string,
  creator: DidUri
): ChainSpaceIdentifiers {
  const api = ConfigService.get('api')
  const scaleEncodedSpaceDigest = api
    .createType<H256>('H256', spaceDigest)
    .toU8a()
  const scaleEncodedCreator = api
    .createType<AccountId>('AccountId', Did.toChain(creator))
    .toU8a()
  const digest = blake2AsHex(
    Uint8Array.from([...scaleEncodedSpaceDigest, ...scaleEncodedCreator])
  )

  const chainSpaceId: SpaceId = Identifier.hashToUri(
    digest,
    SPACE_IDENT,
    SPACE_PREFIX
  )

  const scaleEncodedAuthDigest = api
    .createType<Bytes>('Bytes', Identifier.uriToIdentifier(chainSpaceId))
    .toU8a()
  const scaleEncodedAuthDelegate = api
    .createType<AccountId>('AccountId', Did.toChain(creator))
    .toU8a()

  const authDigest = blake2AsHex(
    Uint8Array.from([...scaleEncodedAuthDigest, ...scaleEncodedAuthDelegate])
  )

  const authorizationId: AuthorizationId = Identifier.hashToUri(
    authDigest,
    AUTHORIZATION_IDENT,
    AUTHORIZATION_PREFIX
  )

  return { chainSpaceId, authorizationId }
}

/**
 * @param creator
 */

/**
 * @param creator
 */
export function createChainSpace(creator: DidUri): IChainSpace {
  const chainSpaceString = `ChainSpace v1.${UUID.generatev4()}`
  const chainSpaceHash = Crypto.hashStr(chainSpaceString)

  const { chainSpaceId, authorizationId } = getChainSpaceIdentifiers(
    chainSpaceHash,
    creator
  )

  return {
    identifier: chainSpaceId,
    digest: chainSpaceHash,
    creator,
    authorization: authorizationId,
  }
}
