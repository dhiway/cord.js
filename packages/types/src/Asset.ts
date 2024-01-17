import { HexString } from '@polkadot/util/types.js'
import { DidUri } from './DidDocument.js'
import { SpaceUri } from './ChainSpace.js'
import { CordAddress } from './Address.js'

export const ASSET_IDENT = 2348;
export const ASSET_INSTANCE_IDENT = 11380;
export const ASSET_PREFIX = "asset:cord:";
export type AssetUri = `${typeof ASSET_PREFIX}${string}`;
export type AssetDigest = HexString;

export enum AssetTypeOf {
  art = "ART",
  bond = "BOND",
  mf = "MF",
}

export enum AssetStatusOf {
  active = "Active",
  inactive = "Inactive",
  expired = "Expired",
}

export interface IAssetProperties {
  assetType: AssetTypeOf;
  assetDesc: string;
  assetQty: number;
  assetValue: number;
  assetTag: string;
  assetMeta: string;
}

export interface IAssetEntry {
  entry: IAssetProperties;   
  creator: DidUri;
  space: SpaceUri;
  digest: AssetDigest;
  uri: AssetUri;
}

export interface IAssetIssuanceEntry {
  assetId: string;
  assetOwner: CordAddress;
  assetIssuanceQty: number;
}

export interface IAssetIssuance {
  entry: IAssetIssuanceEntry;
  issuer: DidUri;
  space: SpaceUri;
  digest: AssetDigest;
  uri: AssetUri;
}

export interface IAssetTransferEntry {
  assetId: string;
  assetInstanceId: string;
  assetOwner: CordAddress;
  newAssetOwner: CordAddress;
}

export interface IAssetTransfer {
  entry: IAssetTransferEntry;
  owner: DidUri;
  digest: AssetDigest;
}
