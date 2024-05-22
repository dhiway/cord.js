import { HexString } from '@polkadot/util/types.js'

export const WITNESS_IDENT = 2348;
export const WITNESS_PREFIX = "witness:cord:";
export type WitnessUri = `${typeof WITNESS_PREFIX}${string}`;
export type WitnessDigest = HexString;

export enum WitnessStatusOf {
    witnessapprovalpending = "WITNESSAPPROVALPENDING",
    witnessapprovalcomplete = "WITNESSAPPROVALCOMPLETE",
}
