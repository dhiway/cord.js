import { HexString } from '@polkadot/util/types.js'
// import { DidUri } from './DidDocument.js'
// import { SpaceUri } from './ChainSpace.js'
// import { CordAddress } from './Address.js'

export const WITNESS_IDENT = 2348;
export const WITNESS_PREFIX = "witness:cord:";
export type WitnessUri = `${typeof WITNESS_PREFIX}${string}`;
export type WitnessDigest = HexString;

// export enum WitnessTypeOf {
//   art = "ART",
//   bond = "BOND",
//   mf = "MF",
// }

export enum WitnessStatusOf {
    witnessapprovalpending = "WITNESSAPPROVALPENDING",
    witnessapprovalcomplete = "WITNESSAPPROVALCOMPLETE",
}

// export interface IWitnessCreateEntry {
//     creator: SpaceUri,
//     uri: WitnessUri,
//     digest: e
// }

// export interface IAssetProperties {
//   assetType: AssetTypeOf;
//   assetDesc: string;
//   assetQty: number;
//   assetValue: number;
//   assetTag: string;
//   assetMeta: string;
// }

// export interface IAssetEntry {
//   entry: IAssetProperties;   
//   creator: DidUri;
//   space: SpaceUri;
//   digest: AssetDigest;
//   uri: AssetUri;
// }

// export interface IAssetIssuanceEntry {
//   assetId: string;
//   assetOwner: CordAddress;
//   assetIssuanceQty: number;
// }

// export interface IAssetIssuance {
//   entry: IAssetIssuanceEntry;
//   issuer: DidUri;
//   space: SpaceUri;
//   digest: AssetDigest;
//   uri: AssetUri;
// }

// export interface IAssetTransferEntry {
//   assetId: string;
//   assetInstanceId: string;
//   assetOwner: CordAddress;
//   newAssetOwner: CordAddress;
// }

// export interface IAssetTransfer {
//   entry: IAssetTransferEntry;
//   owner: DidUri;
//   digest: AssetDigest;
// }
