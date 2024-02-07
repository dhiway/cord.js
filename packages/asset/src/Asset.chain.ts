import {
  AssetUri,
  IAssetEntry,
  IAssetIssuance,
  IAssetTransfer,
  AuthorizationUri,
  CordKeyringPair,
  SignExtrinsicCallback,
  AuthorizationId,
  ASSET_PREFIX,
  DidUri,
  AssetStatusOf,
} from '@cord.network/types'
import type { Option } from '@cord.network/types'
import type { PalletAssetAssetEntry } from '@cord.network/augment-api'

import * as Did from '@cord.network/did'
import { uriToIdentifier } from '@cord.network/identifier'
import { Chain } from '@cord.network/network'
import { ConfigService } from '@cord.network/config'
import { SDKErrors } from '@cord.network/utils'

export async function isAssetStored(assetUri: AssetUri): Promise<boolean> {
  try {
    const api = ConfigService.get('api')
    const identifier = uriToIdentifier(assetUri)
    const encoded = (await api.query.asset.assets(
      identifier
    )) as Option<PalletAssetAssetEntry>

    return !encoded.isNone
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error)
    throw new SDKErrors.CordQueryError(
      `Error querying asset entry: ${errorMessage}`
    )
  }
}

export async function dispatchCreateToChain(
  assetEntry: IAssetEntry,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<AssetUri> {
  try {
    const api = ConfigService.get('api')
    const authorizationId: AuthorizationId = uriToIdentifier(authorizationUri)
    const exists = await isAssetStored(assetEntry.uri)
    if (exists) {
      return assetEntry.uri
    }

    const tx = api.tx.asset.create(
      assetEntry.entry,
      assetEntry.digest,
      authorizationId
    )

    const extrinsic = await Did.authorizeTx(
      assetEntry.creator,
      tx,
      signCallback,
      authorAccount.address
    )

    await Chain.signAndSubmitTx(extrinsic, authorAccount)

    return assetEntry.uri
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error)
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${errorMessage}".`
    )
  }
}

export async function dispatchIssueToChain(
  assetEntry: IAssetIssuance,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<AssetUri> {
  try {
    const api = ConfigService.get('api')

    const authorizationId: AuthorizationId = uriToIdentifier(authorizationUri)

    const exists = await isAssetStored(assetEntry.entry.assetId as AssetUri)

    if (!exists) {
      throw new SDKErrors.CordDispatchError(`Asset Entry not found on chain.`)
    }

    const tx = api.tx.asset.issue(
      assetEntry.entry,
      assetEntry.digest,
      authorizationId
    )

    const extrinsic = await Did.authorizeTx(
      assetEntry.issuer,
      tx,
      signCallback,
      authorAccount.address
    )

    await Chain.signAndSubmitTx(extrinsic, authorAccount)

    return assetEntry.uri
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error)
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${errorMessage}".`
    )
  }
}

export async function dispatchTransferToChain(
  assetEntry: IAssetTransfer,
  authorAccount: CordKeyringPair,
  signCallback: SignExtrinsicCallback
): Promise<AssetUri> {
  try {
    const api = ConfigService.get('api')

    const tx = api.tx.asset.transfer(assetEntry.entry, assetEntry.digest)

    const extrinsic = await Did.authorizeTx(
      assetEntry.owner,
      tx,
      signCallback,
      authorAccount.address
    )

    await Chain.signAndSubmitTx(extrinsic, authorAccount)

    return `${ASSET_PREFIX}${assetEntry.entry.assetId}:${assetEntry.entry.assetInstanceId}`
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error)
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${errorMessage}".`
    )
  }
}

export async function dispatchAssetStatusChangeToChain(
  assetId: AssetUri,
  assetIssuerDidUri: DidUri,
  authorAccount: CordKeyringPair,
  newStatus: AssetStatusOf,
  signCallback: SignExtrinsicCallback,
  assetInstanceId?: string
): Promise<void> {
  try {
    const api = ConfigService.get('api')
    let tx

    if (assetInstanceId) {
      let encodedAssetInstanceDetail = await api.query.asset.issuance(
        assetId,
        assetInstanceId
      )
      if (!encodedAssetInstanceDetail) {
        throw new SDKErrors.AssetInstanceNotFound(
          `Error: Assset Instance Not Found`
        )
      }
      let assetInstanceDetail = JSON.parse(
        encodedAssetInstanceDetail.toString()
      )
      if (assetIssuerDidUri !== assetInstanceDetail.assetInstanceIssuer) {
        throw new SDKErrors.AssetIssuerMismatch(`Error: Assset issuer mismatch`)
      }
      if (assetInstanceDetail.assetInstanceStatus === newStatus) {
        throw new SDKErrors.AssetStatusError(
          `Error: Asset Instance is already in the ${newStatus} state`
        )
      }
      tx = api.tx.asset.status_change(assetId, assetInstanceId, newStatus)
    } else {
      let encodedAssetDetail = await api.query.asset.assets(assetId)
      if (!encodedAssetDetail) {
        throw new SDKErrors.AssetNotFound(`Error: Assset Not Found`)
      }
      let assetDetail = JSON.parse(encodedAssetDetail.toString())
      if (assetIssuerDidUri !== assetDetail.assetIssuer) {
        throw new SDKErrors.AssetIssuerMismatch(`Error: Assset issuer mismatch`)
      }
      if (assetDetail.assetInstanceStatus === newStatus) {
        throw new SDKErrors.AssetStatusError(
          `Error: Asset is already in the ${newStatus} state`
        )
      }
      tx = api.tx.asset.status_change(assetId, newStatus)
    }

    const extrinsic = await Did.authorizeTx(
      assetIssuerDidUri,
      tx,
      signCallback,
      authorAccount.address
    )

    await Chain.signAndSubmitTx(extrinsic, authorAccount)
  } catch (error) {
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${error}".`
    )
  }
}
