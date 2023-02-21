export interface IPublicIdentity {
  address: string
  boxPublicKeyAsHex: string
  serviceAddress?: string
}

export interface IIdentityPublicKey {
  id: string
  type: string
  controller: string
  publicKeyHex: string
}
