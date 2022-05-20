/**
 * @packageDocumentation
 * @module DID
 */

import { Option } from '@polkadot/types'
import type { IPublicIdentity, SubmittableExtrinsic } from '@cord.network/types'
import { ChainApiConnection } from '@cord.network/network'
import type { IDid } from './Did.js'
import {
  decodeDid,
  getAddressFromIdentifier,
  getIdentifierFromAddress,
  IEncodedDidRecord,
} from './Did.utils.js'

/**
 * @param identifier
 * @internal
 */
export async function queryByIdentifier(
  identifier: IDid['identifier']
): Promise<IDid | null> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const address = getAddressFromIdentifier(identifier)
  const decoded = decodeDid(
    identifier,
    await blockchain.api.query.did.dIDs<Option<IEncodedDidRecord>>(address)
  )
  return decoded
}

/**
 * @param address
 * @internal
 */
export async function queryByAddress(
  address: IPublicIdentity['address']
): Promise<IDid | null> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const identifier = getIdentifierFromAddress(address)
  const decoded = decodeDid(
    identifier,
    await blockchain.api.query.did.dIDs<Option<IEncodedDidRecord>>(address)
  )
  return decoded
}

/**
 * @internal
 */
export async function remove(): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const tx: SubmittableExtrinsic = blockchain.api.tx.did.remove()
  return tx
}

/**
 * @param did
 * @internal
 */
export async function store(did: IDid): Promise<SubmittableExtrinsic> {
  const blockchain = await ChainApiConnection.getConnectionOrConnect()
  const tx: SubmittableExtrinsic = blockchain.api.tx.did.add(
    did.publicBoxKey,
    did.publicSigningKey,
    did.documentStore
  )
  return tx
}
