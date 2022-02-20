import { Crypto, DataUtils } from '@cord.network/utils'
import type {
  IMark,
  IMarkContent,
  IIdentity,
  IPresentation,
  IPresentationSigningOptions,
} from '@cord.network/api-types'
import { Mark } from './Mark.js'

function ensureCredentialOwnership(
  credentials: IMark[]
): IMarkContent['holder'] {
  const holders = credentials.reduce((owns, credential) => {
    owns.add(credential.request.holder!)
    return owns
  }, new Set<IIdentity['address']>())
  if (holders.size !== 1) {
    throw new Error(
      'all credentials in a presentation must be owned by one holder'
    )
  }
  const holder = holders.values().next().value
  DataUtils.validateAddress(holder, 'credential holder')
  return holder
}

export type SignedPresentation = Presentation &
  Pick<Required<Presentation>, 'request' | 'signature'>

export class Presentation implements IPresentation {
  public credentials: Mark[]
  public request?: string
  // public purpose?: string
  public signature?: string
  // public validUntil?: number

  constructor({
    credentials,
    // request,
    // purpose,
    signature,
  }: // validUntil,
  IPresentation) {
    ensureCredentialOwnership(credentials)
    this.credentials = credentials.map((i) => new Mark(i))
    // this.request = request
    // this.purpose = purpose
    this.signature = signature
    // this.validUntil = validUntil
  }

  public static fromPresentations(
    presentations: IPresentation[],
    signingOpts?: IPresentationSigningOptions
  ): Presentation {
    const credentials = ([] as IMark[]).concat(
      ...presentations.map((i) => i.credentials)
    )
    const presentation = new Presentation({
      credentials,
    })
    if (!signingOpts) return presentation
    presentation.sign(signingOpts)
    return presentation
  }

  public static fromCredentials(
    credentials: IMark[],
    options?: IPresentationSigningOptions
  ): Presentation {
    const presentation = new Presentation({ credentials })
    if (options) {
      presentation.sign(options)
    }
    return presentation
  }

  public sign({
    request,
    signer,
  }: IPresentationSigningOptions): SignedPresentation {
    this.request = request
    delete this.signature
    const signature = signer.sign(Crypto.coToUInt8(JSON.stringify(this)))
    this.signature = Crypto.u8aToHex(signature)
    return this as SignedPresentation
  }

  public isSigned(): this is SignedPresentation {
    return !!this.signature
  }

  public verifySignature(): boolean {
    if (!this.isSigned()) return false
    const claimsOwner = ensureCredentialOwnership(this.credentials)
    const { signature, ...document } = this
    return Crypto.verify(JSON.stringify(document), signature, claimsOwner!)
  }

  public verifyData(): boolean {
    if (this.isSigned() && !this.verifySignature()) return false
    return this.credentials.every((cred) => cred.verifyData())
  }

  public async verify(): Promise<boolean> {
    if (this.isSigned() && !this.verifySignature()) return false
    const results = await Promise.all(
      this.credentials.map((cred) => cred.verify())
    )
    return results.every((r) => !!r)
  }
}
