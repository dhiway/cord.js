import { blake2AsHex } from '@polkadot/util-crypto';

/* using blake here so we maintain uniformity on chain and off chain */
export function hash(data: string): string {
  return blake2AsHex(data)
}
