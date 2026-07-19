declare module 'bn.js' {
  class BN {
    public constructor(
      value?:
        | number
        | string
        | number[]
        | Uint8Array
        | BN,
      base?: number | 'hex',
      endian?: 'le' | 'be'
    )

    public add(num: BN): BN

    public addn(num: number): BN

    public abs(): BN

    public clone(): BN

    public div(num: BN): BN

    public divn(num: number): BN

    public eq(num: BN): boolean

    public gt(num: BN): boolean

    public gte(num: BN): boolean

    public isNeg(): boolean

    public isZero(): boolean

    public lt(num: BN): boolean

    public lte(num: BN): boolean

    public mod(num: BN): BN

    public mul(num: BN): BN

    public muln(num: number): BN

    public pow(num: BN): BN

    public sub(num: BN): BN

    public subn(num: number): BN

    public toNumber(): number

    public toString(base?: number | 'hex', padding?: number): string
  }

  export { BN }
  export default BN
}
