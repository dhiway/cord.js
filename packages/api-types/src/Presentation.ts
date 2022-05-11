import { IMark } from './Mark.js'

export interface IPresentation {
  credentials: IMark[]
  holderSignature?: string
}

export interface Signer {
  sign: (data: Uint8Array) => Uint8Array
}

export interface IPresentationSigningOptions {
  request: string
  signer: Signer
}

export interface IPresentationOptions {
  showAttributes?: string[]
  hideAttributes?: string[]
}
