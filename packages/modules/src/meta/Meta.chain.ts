/**
 * @packageDocumentation
 * @module Schema
 */

import { Option, Struct, Vec, u8 } from '@polkadot/types'
import type { AccountId, Hash } from '@polkadot/types/interfaces'
import type {
  IMetaDetails,
  IMetaDataDetails,
  IPublicIdentity,
  SubmittableExtrinsic,
} from '@cord.network/types'
import { DecoderUtils, Identifier } from '@cord.network/utils'
import { ConfigService } from '@cord.network/config'
import { ChainApiConnection } from '@cord.network/network'
import { Identity } from '../identity/Identity.js'

const log = ConfigService.LoggingFactory.getLogger('Metadata')

/**
 * Generate the extrinsic to create the [[IMetaDetails]].
 *
 * @param metaDetails: The metadata entry to anchor on the chain.
 * @returns The [[SubmittableExtrinsic]] for the `create` call.
 */

export async function setMetadata(
  metaDetails: IMetaDetails
): Promise<SubmittableExtrinsic> {
  const api = await ChainApiConnection.getConnectionOrConnect()
  log.debug(() => `Create tx for 'space'`)
  const metaParams = {
    identifier: Identifier.getIdentifierKey(metaDetails.identifier),
    digest: metaDetails.metaHash,
    controller: metaDetails.controller,
  }
  return api.tx.meta.setMetadata(
    metaParams,
    metaDetails.meta,
    metaDetails.controllerSignature
  )
}

/**
 * Generate the extrinsic to create the [[IMetaDetails]].
 *
 * @param metaDetails: The metadata entry to anchor on the chain.
 * @returns The [[SubmittableExtrinsic]] for the `create` call.
 */

export async function clearMetadata(
  metaDetails: IMetaDetails,
  controller: Identity
): Promise<SubmittableExtrinsic> {
  const { txSignature, txHash } = controller.signTx(metaDetails.metaHash)

  const api = await ChainApiConnection.getConnectionOrConnect()
  const metaParams = {
    identifier: Identifier.getIdentifierKey(metaDetails.identifier),
    digest: txHash,
    controller: metaDetails.controller,
  }
  return api.tx.meta.clearMetadata(metaParams, txSignature)
}

export interface AnchoredMetaDetails extends Struct {
  readonly meta: Vec<u8>
  readonly digest: Hash
  readonly controller: AccountId
}

function decodeEntry(
  encodedMetadata: Option<AnchoredMetaDetails>,
  entryId: string
): IMetaDataDetails | null {
  DecoderUtils.assertCodecIsType(encodedMetadata, [
    'Option<PalletMetaMetaMetadataEntry>',
  ])
  if (encodedMetadata.isSome) {
    const anchoredEntry = encodedMetadata.unwrap()
    const metadataDetails: IMetaDataDetails = {
      identifier: entryId,
      meta: DecoderUtils.hexToString(anchoredEntry.meta.toString()),
      metaHash: anchoredEntry.digest.toHex(),
      controller: anchoredEntry.controller.toString(),
    }
    return metadataDetails
  }
  return null
}

async function queryRaw(entryId: string): Promise<Option<AnchoredMetaDetails>> {
  const api = await ChainApiConnection.getConnectionOrConnect()
  const result = await api.query.meta.metadata<Option<AnchoredMetaDetails>>(
    entryId
  )
  return result
}

/**
 * @param entry_id
 * @internal
 */
export async function query(
  entry_id: string
): Promise<IMetaDataDetails | null> {
  const entryId: string = Identifier.getIdentifierKey(entry_id)
  const encoded = await queryRaw(entryId)
  return decodeEntry(encoded, entryId)
}

/**
 * @param entryId
 * @internal
 */
export async function getOwner(
  entryId: IMetaDataDetails['identifier']
): Promise<IPublicIdentity['address'] | null> {
  const encoded = await queryRaw(entryId)
  const queriedSpaceAccount = decodeEntry(encoded, entryId)
  return queriedSpaceAccount!.controller
}
