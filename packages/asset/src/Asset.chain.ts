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
} from '@cord.network/types';

import type { Option } from '@cord.network/types';
import type { PalletAssetAssetEntry, PalletAssetAssetStatusOf } from '@cord.network/augment-api';

import * as Did from '@cord.network/did';
import { uriToIdentifier } from '@cord.network/identifier';
import { Chain } from '@cord.network/network';
import { ConfigService } from '@cord.network/config';
import { SDKErrors } from '@cord.network/utils';

/**
 * Checks if an asset is stored on the chain.
 * @param assetUri - URI of the asset.
 * @returns A promise that resolves to a boolean indicating if the asset is stored.
 */
export async function isAssetStored(assetUri: AssetUri): Promise<boolean> {
  try {
    const api = ConfigService.get('api');
    const identifier = uriToIdentifier(assetUri);

    const encoded = (await api.query.asset.assets(
      identifier
    )) as Option<PalletAssetAssetEntry>;

    return encoded.isSome;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordQueryError(
      `Error querying asset entry: ${errorMessage}`
    );
  }
}

/**
 * Prepares an extrinsic for creating an asset entry.
 * @param assetEntry - The asset entry to create.
 * @param authorAccount - Keyring pair of the author.
 * @param authorizationUri - URI for authorization.
 * @param signCallback - Callback for signing the extrinsic.
 * @returns A promise that resolves to a SubmittableExtrinsic.
 */
export async function prepareCreateExtrinsic(
  assetEntry: IAssetEntry,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<SubmittableExtrinsic> {
  try {
    const api = ConfigService.get('api');
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
      authorAccount.address
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

/**
 * Dispatches the creation of an asset entry to the chain.
 * @param assetEntry - The asset entry to create.
 * @param authorAccount - Keyring pair of the author.
 * @param authorizationUri - URI for authorization.
 * @param signCallback - Callback for signing the extrinsic.
 * @returns A promise that resolves to the AssetUri.
 */
export async function dispatchCreateToChain(
  assetEntry: IAssetEntry,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<AssetUri> {
  try {
    const extrinsic = await prepareCreateExtrinsic(
      assetEntry,
      authorAccount,
      authorizationUri,
      signCallback
    );

    await Chain.signAndSubmitTx(extrinsic, authorAccount);

    return assetEntry.uri;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${errorMessage}".`
    );
  }
}

/**
 * Prepares an extrinsic for creating a Verifiable Credential (VC) asset entry.
 * @param assetQty - Quantity of the asset.
 * @param digest - Digest string for the asset.
 * @param creator - DID URI of the creator.
 * @param authorAccount - Keyring pair of the author.
 * @param authorizationUri - URI for authorization.
 * @param signCallback - Callback for signing the extrinsic.
 * @returns A promise that resolves to a SubmittableExtrinsic.
 */
export async function prepareCreateVcExtrinsic(
  assetQty: number,
  digest: string,
  creator: DidUri,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<SubmittableExtrinsic> {
  try {
    const api = ConfigService.get('api');
    const authorizationId: AuthorizationId = uriToIdentifier(authorizationUri);

    const tx = api.tx.asset.vcCreate(assetQty, digest, authorizationId);

    const extrinsic = await Did.authorizeTx(
      creator,
      tx,
      signCallback,
      authorAccount.address
    );

    return extrinsic;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
      `Error preparing VC Asset Entry extrinsic: "${errorMessage}".`
    );
  }
}

/**
 * Dispatches the creation of a Verifiable Credential (VC) asset entry to the chain.
 * @param assetQty - Quantity of the asset.
 * @param digest - Digest string for the asset.
 * @param creator - DID URI of the creator.
 * @param authorAccount - Keyring pair of the author.
 * @param authorizationUri - URI for authorization.
 * @param assetEntryUri - URI of the asset entry.
 * @param signCallback - Callback for signing the extrinsic.
 * @returns A promise that resolves to the AssetUri.
 */
export async function dispatchCreateVcToChain(
  assetQty: number,
  digest: string,
  creator: DidUri,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  assetEntryUri: AssetUri,
  signCallback: SignExtrinsicCallback
): Promise<AssetUri> {
  try {
    const extrinsic = await prepareCreateVcExtrinsic(
      assetQty,
      digest,
      creator,
      authorAccount,
      authorizationUri,
      signCallback
    );

    await Chain.signAndSubmitTx(extrinsic, authorAccount);

    return assetEntryUri;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${errorMessage}".`
    );
  }
}

/**
 * Prepares an extrinsic for issuing an asset entry.
 * @param assetEntry - The asset entry to issue.
 * @param authorAccount - Keyring pair of the author.
 * @param authorizationUri - URI for authorization.
 * @param signCallback - Callback for signing the extrinsic.
 * @returns A promise that resolves to a SubmittableExtrinsic.
 */
export async function prepareExtrinsic(
  assetEntry: IAssetEntry,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<SubmittableExtrinsic> {
  try {
    const api = ConfigService.get('api');
    const authorizationId: AuthorizationId = uriToIdentifier(authorizationUri);

    const tx = api.tx.asset.issue(
      assetEntry.entry,
      assetEntry.digest,
      authorizationId
    );

    const extrinsic = await Did.authorizeTx(
      assetEntry.creator,
      tx,
      signCallback,
      authorAccount.address
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

/**
 * Dispatches the issuance of an asset entry to the chain.
 * @param assetEntry - The asset entry to issue.
 * @param authorAccount - Keyring pair of the author.
 * @param authorizationUri - URI for authorization.
 * @param signCallback - Callback for signing the extrinsic.
 * @returns A promise that resolves to the AssetUri.
 */
export async function dispatchIssueToChain(
  assetEntry: IAssetEntry,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<AssetUri> {
  try {
    const extrinsic = await prepareExtrinsic(
      assetEntry,
      authorAccount,
      authorizationUri,
      signCallback
    );

    await Chain.signAndSubmitTx(extrinsic, authorAccount);

    return assetEntry.uri;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${errorMessage}".`
    );
  }
}

/**
 * Prepares an extrinsic for issuing a Verifiable Credential (VC) asset entry.
 * @param assetEntry - The asset entry to issue.
 * @param authorAccount - Keyring pair of the author.
 * @param authorizationUri - URI for authorization.
 * @param signCallback - Callback for signing the extrinsic.
 * @returns A promise that resolves to a SubmittableExtrinsic.
 */
export async function prepareVcExtrinsic(
  assetEntry: IAssetEntry,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<SubmittableExtrinsic> {
  try {
    const api = ConfigService.get('api');
    const authorizationId: AuthorizationId = uriToIdentifier(authorizationUri);

    const tx = api.tx.asset.vcIssue(
      assetEntry.entry,
      assetEntry.digest,
      authorizationId
    );

    const extrinsic = await Did.authorizeTx(
      assetEntry.creator,
      tx,
      signCallback,
      authorAccount.address
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

/**
 * Dispatches the issuance of a Verifiable Credential (VC) asset entry to the chain.
 * @param assetEntry - The asset entry to issue.
 * @param authorAccount - Keyring pair of the author.
 * @param authorizationUri - URI for authorization.
 * @param signCallback - Callback for signing the extrinsic.
 * @returns A promise that resolves to the AssetUri.
 */
export async function dispatchIssueVcToChain(
  assetEntry: IAssetEntry,
  authorAccount: CordKeyringPair,
  authorizationUri: AuthorizationUri,
  signCallback: SignExtrinsicCallback
): Promise<AssetUri> {
  try {
    const extrinsic = await prepareVcExtrinsic(
      assetEntry,
      authorAccount,
      authorizationUri,
      signCallback
    );

    await Chain.signAndSubmitTx(extrinsic, authorAccount);

    return assetEntry.uri;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new SDKErrors.CordDispatchError(
      `Error dispatching to chain: "${errorMessage}".`
    );
  }
}
