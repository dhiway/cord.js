import { ICredential } from './Credential'

export interface IPresentation {
  credentials: ICredential[]
  // request?: string
  // purpose?: string
  // validUntil?: number
  // relatedData?: boolean
  signature?: string
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
