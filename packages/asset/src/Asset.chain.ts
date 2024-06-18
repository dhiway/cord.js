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

export async function isAssetStored(
  assetUri: AssetUri,
  network: string = 'api'
): Promise<boolean> {
  try {
    const api = ConfigService.get(network)

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

export async function prepareCreateExtrinsic(
  assetEntry: IAssetEntry,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback,
  network: string = 'api'
): Promise<SubmittableExtrinsic> {
  try {
    const api = ConfigService.get(network);
    const authorizationId: AuthorizationId = uriToIdentifier(authorizationUri);

    const tx = api.tx.asset.create(
      assetEntry.entry,
      assetEntry.digest,
      authorizationId
    );

    const extrinsic = await Did.authorizeTx(
      assetEntry.creator,
      tx,
      signCallback,
      authorAccount.address,
      {},
      network
    );

    return extrinsic;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
      `Error preparing extrinsic: "${errorMessage}".`
    );
  }
}

export async function dispatchCreateToChain(
  assetEntry: IAssetEntry,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback,
  network: string = 'api'
): Promise<AssetUri> {
  try {
    
    const extrinsic = await prepareCreateExtrinsic(
      assetEntry,
      authorAccount,
      authorizationUri,
      signCallback,
      network
    )

    await Chain.signAndSubmitTx(
      extrinsic,
      authorAccount,
      { network }
    )

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
  assetEntryUri: AssetUri,
  signCallback: SignExtrinsicCallback,
  network: string = 'api'
): Promise<AssetUri> {
  try {
    const api = ConfigService.get(network)
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
      authorAccount.address,
      {}, 
      network
    )

    await Chain.signAndSubmitTx(
      extrinsic,
      authorAccount,
      { network }
    )

    return assetEntryUri
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
  signCallback: SignExtrinsicCallback,
  network: string = 'api'
): Promise<SubmittableExtrinsic> {
  try {
    const api = ConfigService.get(network)

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
      authorAccount.address,
      {},
      network
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
  signCallback: SignExtrinsicCallback,
  network: string = 'api'
): Promise<AssetUri> {
  try {

    const extrinsic = await prepareExtrinsic(
      assetEntry,
      authorAccount,
      authorizationUri,
      signCallback,
      network
    ) 
    await Chain.signAndSubmitTx(
      extrinsic,
      authorAccount,
      { network}
    )

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
  signCallback: SignExtrinsicCallback,
  network: string = 'api'
): Promise<SubmittableExtrinsic> {
  try {
    const api = ConfigService.get(network)

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
      authorAccount.address,
      {},
      network
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
  signCallback: SignExtrinsicCallback,
  network: string = 'api'
): Promise<AssetUri> {
  try {

    const extrinsic = await prepareVcExtrinsic(
      assetEntry, 
      authorAccount,
      authorizationUri, 
      signCallback,
      network
    ) 
    await Chain.signAndSubmitTx(
      extrinsic,
      authorAccount,
      { network }
    )

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
  signCallback: SignExtrinsicCallback,
  network: string = 'api'
): Promise<AssetUri> {
  try {
    const api = ConfigService.get(network)

    const tx = api.tx.asset.transfer(assetEntry.entry, assetEntry.digest)

    const extrinsic = await Did.authorizeTx(
      assetEntry.owner,
      tx,
      signCallback,
      authorAccount.address,
      {},
      network
    )

    await Chain.signAndSubmitTx(
      extrinsic,
      authorAccount,
      { network }
    )

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
  signCallback: SignExtrinsicCallback,
  network: string = 'api'
): Promise<AssetUri> {
  try {
    const api = ConfigService.get(network)

    const tx = api.tx.asset.vcTransfer(assetEntry.entry, assetEntry.digest)

    const extrinsic = await Did.authorizeTx(
      assetEntry.owner,
      tx,
      signCallback,
      authorAccount.address,
      {},
      network
    )

    await Chain.signAndSubmitTx(
      extrinsic,
      authorAccount,
      { network }
    )

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
  assetUri: AssetUri,
  assetIssuerDidUri: DidUri,
  authorAccount: CordKeyringPair,
  newStatus: PalletAssetAssetStatusOf,
  signCallback: SignExtrinsicCallback,
  opts: {
    assetInstanceId?: string,
    network?: string
  }
): Promise<void> {
  try {
    let {
      assetInstanceId,
      network = 'api'
    } = opts;

    const api = ConfigService.get(network);
    let tx;
    const assetId = uriToIdentifier(assetUri);
    const assetIssuerDid = Did.toChain(assetIssuerDidUri);

    assetInstanceId = assetInstanceId?.split(":").pop();

    /* Check if assetStatusType is undefined */
    if (newStatus === undefined) {
      throw new SDKErrors.InvalidAssetStatus("Asset status is undefined.");
    }

    if (assetInstanceId) {
      let encodedAssetInstanceDetail = await api.query.asset.issuance(
        assetId,
        assetInstanceId
      );
      if (encodedAssetInstanceDetail.isNone) {
        throw new SDKErrors.AssetInstanceNotFound(
          `Error: Asset Instance Not Found`
        );
      }
      let assetInstanceDetail = JSON.parse(
        encodedAssetInstanceDetail.toString()
      );
      if (assetIssuerDid !== assetInstanceDetail.assetInstanceIssuer) {
        throw new SDKErrors.AssetIssuerMismatch(`Error: Asset issuer mismatch`);
      }

      if (
        assetInstanceDetail.assetInstanceStatus?.toLowerCase() ===
        String(newStatus)?.toLowerCase()
      ) {
        throw new SDKErrors.AssetStatusError(
          `Error: Asset Instance is already in the ${newStatus} state`
        );
      }
      tx = api.tx.asset.statusChange(assetId, assetInstanceId, newStatus);
    } else {
      let encodedAssetDetail = await api.query.asset.assets(assetId);
      if (encodedAssetDetail.isNone) {
        throw new SDKErrors.AssetNotFound(`Error: Asset Not Found`);
      }
      let assetDetail = JSON.parse(encodedAssetDetail.toString());

      if (assetIssuerDid !== assetDetail.assetIssuer) {
        throw new SDKErrors.AssetIssuerMismatch(`Error: Asset issuer mismatch`);
      }

      if (
        assetDetail.assetStatus?.toLowerCase() ===
        String(newStatus)?.toLowerCase()
      ) {
        throw new SDKErrors.AssetStatusError(
          `Error: Asset is already in the ${newStatus} state`
        );
      }
      tx = api.tx.asset.statusChange(assetId, null, newStatus);
    }

    const extrinsic = await Did.authorizeTx(
      assetIssuerDidUri,
      tx,
      signCallback,
      authorAccount.address,
      {},
      network
    );

    await Chain.signAndSubmitTx(
      extrinsic,
      authorAccount,
      { network }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${errorMessage}".`
    );
  }
}

export async function dispatchAssetStatusChangeVcToChain(
  assetUri: AssetUri,
  assetIssuerDidUri: DidUri,
  authorAccount: CordKeyringPair,
  newStatus: PalletAssetAssetStatusOf,
  signCallback: SignExtrinsicCallback,
  opts: {
    assetInstanceId?: string,
    network?: string
  }
): Promise<void> {
  try {
    let {
      assetInstanceId,
      network = 'api'
    } = opts;

    const api = ConfigService.get(network);
    let tx;
    const assetId = uriToIdentifier(assetUri);
    const assetIssuerDid = Did.toChain(assetIssuerDidUri);

    assetInstanceId = assetInstanceId?.split(":").pop();

    /* Check if assetStatusType is undefined */
    if (newStatus === undefined) {
      throw new SDKErrors.InvalidAssetStatus("Asset status is undefined.");
    }

    if (assetInstanceId) {
      let encodedAssetInstanceDetail = await api.query.asset.vcIssuance(
        assetId,
        assetInstanceId
      );
      if (encodedAssetInstanceDetail.isNone) {
        throw new SDKErrors.AssetInstanceNotFound(
          `Error: Asset Instance Not Found`
        );
      }
      let assetInstanceDetail = JSON.parse(
        encodedAssetInstanceDetail.toString()
      );
      if (assetIssuerDid !== assetInstanceDetail.assetInstanceIssuer) {
        throw new SDKErrors.AssetIssuerMismatch(`Error: Asset issuer mismatch`);
      }
      if (
        assetInstanceDetail.assetInstanceStatus?.toLowerCase() ===
        String(newStatus)?.toLowerCase()
      ) {
        throw new SDKErrors.AssetStatusError(
          `Error: Asset Instance is already in the ${newStatus} state`
        );
      }
      tx = api.tx.asset.vcStatusChange(assetId, assetInstanceId, newStatus);
    } else {
      let encodedAssetDetail = await api.query.asset.vcAssets(assetId);

      if (encodedAssetDetail.isNone) {
        throw new SDKErrors.AssetNotFound(`Error: Asset Not Found`);
      }
      let assetDetail = JSON.parse(encodedAssetDetail.toString());

      if (assetIssuerDid !== assetDetail.assetIssuer) {
        throw new SDKErrors.AssetIssuerMismatch(`Error: Asset issuer mismatch`);
      }
      if (
        assetDetail.assetStatus?.toLowerCase() ===
        String(newStatus)?.toLowerCase()
      ) {
        throw new SDKErrors.AssetStatusError(
          `Error: Asset is already in the ${newStatus} state`
        );
      }
      tx = api.tx.asset.vcStatusChange(assetId, null, newStatus);
    }

    const extrinsic = await Did.authorizeTx(
      assetIssuerDidUri,
      tx,
      signCallback,
      authorAccount.address,
      {}, 
      network
    );

    await Chain.signAndSubmitTx(
      extrinsic,
      authorAccount,
      { network }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${errorMessage}".`
    );
  }
}
