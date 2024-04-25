/**
 * @packageDocumentation
 * @module Asset
 *
 * <Add documentation>
 *
 * The module's functionality is exposed through a set of exportable functions, which can be integrated into
 * broader applications within the Cord Network ecosystem or other blockchain-based systems that require
 * sophisticated asset management capabilities.
 */

import {
  IAssetProperties,
  ASSET_IDENT,
  ASSET_PREFIX,
  AssetUri,
  IAssetIssuance,
  ASSET_INSTANCE_IDENT,
  IAssetTransfer,
  IAssetEntry,
  IAssetTransferEntry,
  DidUri,
  SpaceUri,
  blake2AsHex,
  AccountId,
  H256,
  Bytes,
} from '@cord.network/types'
import {
  hashToUri,
  uriToIdentifier,
} from '@cord.network/identifier'
import { Crypto } from '@cord.network/utils'
import { ConfigService } from '@cord.network/config'
import * as Did from '@cord.network/did'

import { SDKErrors } from '@cord.network/utils'

export async function buildFromAssetProperties(
    assetInput: IAssetProperties,
    issuer: DidUri,
    spaceUri: SpaceUri,
): Promise<IAssetEntry> {
  const entryDigest = Crypto.hashObjectAsHexStr(assetInput);
  //  const uint8Hash = new Uint8Array([...Crypto.coToUInt8(entryDigest)]);
  const api = ConfigService.get("api");

  const scaleEncodedAssetDigest = api
    .createType<H256>("H256", entryDigest)
    .toU8a();
  const scaleEncodedIssuer = api
    .createType<AccountId>('AccountId', Did.toChain(issuer))
    .toU8a()
  const scaleEncodedSpace = api
    .createType<AccountId>('Bytes', uriToIdentifier(spaceUri))
    .toU8a()

  const assetIdDigest = blake2AsHex(
    Uint8Array.from([...scaleEncodedAssetDigest, ...scaleEncodedSpace, ...scaleEncodedIssuer])
  );

  const assetIdentifier = hashToUri(
    assetIdDigest,
    ASSET_IDENT,
    ASSET_PREFIX
  ) as AssetUri;

  const transformedEntry: IAssetEntry = {
    entry: assetInput,
    creator: issuer,
    space: spaceUri,
    digest: entryDigest,
    uri: assetIdentifier,
  };

  /* Check if assetType is undefined */
  if (assetInput.assetType === undefined) {
    throw new SDKErrors.InvalidAssetType("Asset type is undefined.");
  }

  return transformedEntry;
}

export async function buildFromIssueProperties(
  assetUri: AssetUri,
  assetOwner: DidUri,
  assetQty: number,
  issuer: DidUri,
  space: SpaceUri,
): Promise<IAssetIssuance> {
  const api = ConfigService.get("api");

  const issuanceEntry = {
    assetId: uriToIdentifier(assetUri),
    assetOwner: Did.toChain(assetOwner),
    assetIssuanceQty: assetQty,
  };

  const issueEntryDigest = Crypto.hashObjectAsHexStr(issuanceEntry);

  const scaleEncodedAssetId = api
    .createType<Bytes>("Bytes", issuanceEntry.assetId)
    .toU8a();
  const scaleEncodedSpace = api
    .createType<Bytes>("Bytes", uriToIdentifier(space))
    .toU8a();
  const scaleEncodedOwnerId = api
    .createType<AccountId>("AccountId", issuanceEntry.assetOwner)
    .toU8a();
  const scaleEncodedIssuer = api
    .createType<AccountId>("AccountId", Did.toChain(issuer))
    .toU8a();
  const scaleEncodedAssetDigest = api
    .createType<H256>("H256", issueEntryDigest)
    .toU8a();
  const assetInstanceIdDigest = blake2AsHex(
    Uint8Array.from([
      ...scaleEncodedAssetId,
      ...scaleEncodedOwnerId,
      ...scaleEncodedSpace,
      ...scaleEncodedIssuer,
      ...scaleEncodedAssetDigest,
    ])
  );

  const assetInstanceId = hashToUri(
    assetInstanceIdDigest,
    ASSET_INSTANCE_IDENT,
    ASSET_PREFIX
  ) as AssetUri;

  const assetInstanceIdentifier = `${assetUri}:${assetInstanceId
    .split(ASSET_PREFIX)
    .join("")}` as AssetUri;

  const issuanceDetails: IAssetIssuance = {
    entry: issuanceEntry,
    issuer: issuer,
    space: space,
    digest: issueEntryDigest,
    uri: assetInstanceIdentifier,
  };

  return issuanceDetails;
}

export async function buildFromTransferProperties(
  assetUri: AssetUri,
  assetNewOwner: DidUri,
  assetOwner: DidUri,
): Promise<IAssetTransfer> {
  const uriParts = assetUri.split(":");
  const transferEntry: IAssetTransferEntry = {
    assetId: uriParts[2],
    assetInstanceId: uriParts[3],
    assetOwner: Did.toChain(assetOwner),
    newAssetOwner: Did.toChain(assetNewOwner),
  };

  const issueEntryDigest = Crypto.hashObjectAsHexStr(transferEntry);
//  const uint8Hash = new Uint8Array([
//    ...Crypto.coToUInt8(issueEntryDigest),
//  ]);

  const transferDetails: IAssetTransfer = {
    entry: transferEntry,
    owner: assetOwner,
    digest: issueEntryDigest,
  };

  return transferDetails;
}
