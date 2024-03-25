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
  SubmittableExtrinsic,
} from '@cord.network/types'

import type { Option } from '@cord.network/types'
import type { PalletAssetAssetEntry, PalletAssetAssetStatusOf } from '@cord.network/augment-api'

import * as Did from '@cord.network/did'
import { uriToIdentifier } from '@cord.network/identifier'
import { Chain } from '@cord.network/network'
import { ConfigService } from '@cord.network/config'
import { SDKErrors } from '@cord.network/utils'

/* TODO: Write method description, params, return types to all methods */

export async function isAssetStored(assetUri: AssetUri): Promise<boolean> {
  try {
    const api = ConfigService.get('api')

    const identifier = uriToIdentifier(assetUri)

    const encoded = (await api.query.asset.assets(
      identifier
    )) as Option<PalletAssetAssetEntry>

    return encoded.isSome
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

export async function dispatchCreateVcToChain(
  assetQty: number,
  digest: string,
  creator: DidUri,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  //assetEntryUri: AssetUri,
  signCallback: SignExtrinsicCallback
): Promise<any> {
  try {
    const api = ConfigService.get('api')
    const authorizationId: AuthorizationId = uriToIdentifier(authorizationUri)

    const tx = api.tx.asset.vcCreate(
      assetQty,
      digest,
      authorizationId
    )

    const extrinsic = await Did.authorizeTx(
      creator,
      tx,
      signCallback,
      authorAccount.address
    )

    await Chain.signAndSubmitTx(extrinsic, authorAccount)

    return null
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error)
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${errorMessage}".`
    )
  }
}

export async function prepareExtrinsic(
  assetEntry: IAssetIssuance,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<SubmittableExtrinsic> {
  try {
    const api = ConfigService.get('api')

    const authorizationId: AuthorizationId = uriToIdentifier(authorizationUri)

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

    return extrinsic
  } catch (error) {
    const errorMessage = 
     error instanceof Error ? error.message : JSON.stringify(error)
    throw new SDKErrors.CordDispatchError(
      `Error preparing extrinsic: "${errorMessage}".`
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

    const extrinsic = await prepareExtrinsic(assetEntry, authorAccount, authorizationUri, signCallback) 
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

export async function prepareVcExtrinsic(
  assetEntry: IAssetIssuance,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<SubmittableExtrinsic> {
  try {
    const api = ConfigService.get('api')

    const authorizationId: AuthorizationId = uriToIdentifier(authorizationUri)

    const tx = api.tx.asset.vcIssue(
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

    return extrinsic
  } catch (error) {
    const errorMessage = 
     error instanceof Error ? error.message : JSON.stringify(error)
    throw new SDKErrors.CordDispatchError(
      `Error preparing extrinsic: "${errorMessage}".`
    )
  }
}

export async function dispatchIssueVcToChain(
  assetEntry: IAssetIssuance,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<AssetUri> {
  try {

    const extrinsic = await prepareVcExtrinsic(assetEntry, authorAccount, authorizationUri, signCallback) 
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

export async function dispatchTransferVcToChain(
  assetEntry: IAssetTransfer,
  authorAccount: CordKeyringPair,
  signCallback: SignExtrinsicCallback
): Promise<AssetUri> {
  try {
    const api = ConfigService.get('api')

    const tx = api.tx.asset.vcTransfer(assetEntry.entry, assetEntry.digest)

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
  newStatus: PalletAssetAssetStatusOf,
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
      if (encodedAssetInstanceDetail.isNone) {
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
      tx = api.tx.asset.statusChange(assetId, assetInstanceId, newStatus)
    } else {
      let encodedAssetDetail = await api.query.asset.assets(assetId)
      if (encodedAssetDetail.isNone) {
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
      tx = api.tx.asset.statusChange(assetId, null, newStatus)
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

export async function dispatchAssetStatusChangeVcToChain(
  assetId: AssetUri,
  assetIssuerDidUri: DidUri,
  authorAccount: CordKeyringPair,
  newStatus: PalletAssetAssetStatusOf,
  signCallback: SignExtrinsicCallback,
  assetInstanceId?: string
): Promise<void> {
  try {
    const api = ConfigService.get('api')
    let tx

    if (assetInstanceId) {
      let encodedAssetInstanceDetail = await api.query.asset.vcIssuance(
        assetId,
        assetInstanceId
      )
      if (encodedAssetInstanceDetail.isNone) {
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
      tx = api.tx.asset.statusChange(assetId, assetInstanceId, newStatus)
    } else {
      let encodedAssetDetail = await api.query.asset.assets(assetId)
      if (encodedAssetDetail.isNone) {
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
      tx = api.tx.asset.statusChange(assetId, null, newStatus)
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
