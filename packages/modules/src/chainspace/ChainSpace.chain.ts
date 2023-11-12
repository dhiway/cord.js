// /**
//  * @packageDocumentation
//  * @module Schema
//  */

// import { Option, Struct, Vec, u8 } from '@polkadot/types'
// import type { AccountId, Hash } from '@polkadot/types/interfaces'
// import type {
//   ISpace,
//   ISpaceDetails,
//   IPublicIdentity,
//   SubmittableExtrinsic,
// } from '@cord.network/types'
// import { DecoderUtils, Identifier } from '@cord.network/utils'
// import { ConfigService } from '@cord.network/config'
// import { ChainApiConnection } from '@cord.network/network'
// import { Identity } from '../identity/Identity.js'

// const log = ConfigService.LoggingFactory.getLogger('Registry')

// /**
//  * Generate the extrinsic to create the [[ISpace]].
//  *
//  * @param entry The space entry to anchor on the chain.
//  * @returns The [[SubmittableExtrinsic]] for the `create` call.
//  */

// export async function create(entry: ISpace): Promise<SubmittableExtrinsic> {
//   const api = await ChainApiConnection.getConnectionOrConnect()
//   log.debug(() => `Create tx for 'space'`)
//   const spaceParams = {
//     digest: entry.spaceHash,
//     controller: entry.controller,
//     schema: entry.schema,
//   }
//   return api.tx.space.create(spaceParams, entry.controllerSignature)
// }

// /**
//  * TBD
//  */
// export async function archive(
//   entry: ISpace,
//   controller: Identity
// ): Promise<SubmittableExtrinsic> {
//   const { txSignature, txHash } = controller.signTx(entry.spaceHash)
//   const api = await ChainApiConnection.getConnectionOrConnect()
//   const spaceParams = {
//     identifier: Identifier.getIdentifierKey(entry.identifier),
//     digest: txHash,
//     controller: controller.address,
//   }
//   return api.tx.space.archive(spaceParams, txSignature)
// }

// /**
//  * TBD
//  */
// export async function restore(
//   entry: ISpace,
//   controller: Identity
// ): Promise<SubmittableExtrinsic> {
//   const { txSignature, txHash } = controller.signTx(entry.spaceHash)

//   const api = await ChainApiConnection.getConnectionOrConnect()
//   const spaceParams = {
//     identifier: Identifier.getIdentifierKey(entry.identifier),
//     digest: txHash,
//     controller: controller.address,
//   }
//   return api.tx.space.restore(spaceParams, txSignature)
// }

// /**
//  * TBD
//  */
// export async function delegate(
//   entry: ISpace,
//   controller: Identity,
//   delegates: [string]
// ): Promise<SubmittableExtrinsic> {
//   const { txSignature, txHash } = controller.signTx(entry.spaceHash)

//   const api = await ChainApiConnection.getConnectionOrConnect()
//   const spaceParams = {
//     identifier: Identifier.getIdentifierKey(entry.identifier),
//     digest: txHash,
//     controller: controller.address,
//   }
//   return api.tx.space.delegate(spaceParams, delegates, txSignature)
// }

// /**
//  * TBD
//  */
// export async function undelegate(
//   entry: ISpace,
//   controller: Identity,
//   delegates: [string]
// ): Promise<SubmittableExtrinsic> {
//   const { txSignature, txHash } = controller.signTx(entry.spaceHash)

//   const api = await ChainApiConnection.getConnectionOrConnect()
//   const spaceParams = {
//     identifier: Identifier.getIdentifierKey(entry.identifier),
//     digest: txHash,
//     controller: controller.address,
//   }
//   return api.tx.space.undelegate(spaceParams, delegates, txSignature)
// }

// /**
//  * TBD
//  */
// export async function transfer(
//   entry: ISpace,
//   controller: Identity,
//   transfer: Identity['address']
// ): Promise<SubmittableExtrinsic> {
//   const { txSignature, txHash } = controller.signTx(entry.spaceHash)

//   const api = await ChainApiConnection.getConnectionOrConnect()
//   const spaceParams = {
//     identifier: Identifier.getIdentifierKey(entry.identifier),
//     digest: txHash,
//     controller: entry.controller,
//   }
//   return api.tx.space.transfer(spaceParams, transfer, txSignature)
// }

// export interface AnchoredSpaceDetails extends Struct {
//   readonly spaceHash: Hash
//   readonly controller: AccountId
//   readonly schema: Option<Vec<u8>>
//   readonly archived: boolean
//   readonly meta: boolean
// }

// function decodeSpace(
//   encodedRegistry: Option<AnchoredSpaceDetails>,
//   spaceId: string
// ): ISpaceDetails | null {
//   DecoderUtils.assertCodecIsType(encodedRegistry, [
//     'Option<PalletSpaceSpaceSpaceDetails>',
//   ])
//   if (encodedRegistry.isSome) {
//     const anchoredSpace = encodedRegistry.unwrap()
//     const space: ISpaceDetails = {
//       identifier: spaceId,
//       spaceHash: anchoredSpace.spaceHash.toHex(),
//       schema: DecoderUtils.hexToString(anchoredSpace.schema.toString()) || null,
//       controller: anchoredSpace.controller.toString(),
//       archived: anchoredSpace.archived.valueOf(),
//       meta: anchoredSpace.meta.valueOf(),
//     }
//     return space
//   }
//   return null
// }

// async function queryRawHash(
//   spaceId: string
// ): Promise<Option<AnchoredSpaceDetails>> {
//   const api = await ChainApiConnection.getConnectionOrConnect()
//   const result = await api.query.space.registries<Option<AnchoredSpaceDetails>>(
//     spaceId
//   )
//   return result
// }

// async function queryRaw(
//   spaceId: string
// ): Promise<Option<AnchoredSpaceDetails>> {
//   const api = await ChainApiConnection.getConnectionOrConnect()
//   const result = await api.query.space.registries<Option<AnchoredSpaceDetails>>(
//     spaceId
//   )
//   return result
// }

// /**
//  * @param identifier
//  * @internal
//  */
// export async function queryhash(
//   space_hash: string
// ): Promise<ISpaceDetails | null> {
//   const encoded = await queryRawHash(space_hash)
//   return decodeSpace(encoded, space_hash)
// }

// /**
//  * @param identifier
//  * @internal
//  */
// export async function query(space_id: string): Promise<ISpaceDetails | null> {
//   const spaceId: string = Identifier.getIdentifierKey(space_id)
//   const encoded = await queryRaw(spaceId)
//   return decodeSpace(encoded, spaceId)
// }

// /**
//  * @param id
//  * @internal
//  */
// export async function getOwner(
//   spaceId: ISpace['identifier']
// ): Promise<IPublicIdentity['address'] | null> {
//   const encoded = await queryRaw(spaceId)
//   const queriedSpaceAccount = decodeSpace(encoded, spaceId)
//   return queriedSpaceAccount!.controller
// }

// export function createChainSpace(creator: DidUri): IChainSpace {
//   const api = ConfigService.get('api')

//   const chainSpaceString = `ChainSpace v1.${UUID.generatev4()}`

//   const chainSpaceHash = Crypto.hashStr(chainSpaceString)
//   const chainSpaceId = getUriForChainSpace(chainSpaceHash, creator)
//   const scaleEncodedRegistry = api
//     .createType<Bytes>('Bytes', uriToIdentifier(chainSpaceId))
//     .toU8a()
//   const scaleEncodedCreator = api
//     .createType<AccountId>('AccountId', Did.toChain(creator))
//     .toU8a()

//   const authDigest = blake2AsHex(
//     Uint8Array.from([...scaleEncodedRegistry, ...scaleEncodedCreator])
//   )

//   const authorizationId = Identifier.hashToUri(
//     authDigest,
//     AUTHORIZATION_IDENT,
//     AUTHORIZATION_PREFIX
//   )

//   const chainSpace: IChainSpace = {
//     identifier: chainSpaceId,
//     digest: chainSpaceHash,
//     creator,
//     authorization: authorizationId,
//   }
//   return chainSpace
// }

// /**
//  * @param registry
//  * @param authority
//  * @param creator
//  */
// export function getAuthorizationIdentifier(
//   registry: IRegistry['identifier'],
//   authority: DidUri,
//   creator: DidUri
// ): AuthorizationId {
//   const api = ConfigService.get('api')

//   const scaleEncodedRegistry = api
//     .createType<Bytes>('Bytes', uriToIdentifier(registry))
//     .toU8a()
//   const scaleEncodedAuthority = api
//     .createType<AccountId>('AccountId', Did.toChain(authority))
//     .toU8a()
//   const scaleEncodedCreator = api
//     .createType<AccountId>('AccountId', Did.toChain(creator))
//     .toU8a()

//   const digest = blake2AsHex(
//     Uint8Array.from([
//       ...scaleEncodedRegistry,
//       ...scaleEncodedAuthority,
//       ...scaleEncodedCreator,
//     ])
//   )

//   const authorizationId = Identifier.hashToUri(
//     digest,
//     AUTHORIZATION_IDENT,
//     AUTHORIZATION_PREFIX
//   )

//   return authorizationId
// }

// /**
//  *  Custom Type Guard to determine input being of type ISpace using the SpaceUtils errorCheck.
//  *
//  * @param input The potentially only partial ISpace.
//  * @returns Boolean whether input is of type ISpace.
//  */
// export function isIRegistry(input: unknown): input is IRegistry {
//   try {
//     verifyRegistryDataStructure(input as IRegistry)
//   } catch (error) {
//     return false
//   }
//   return true
// }

// /**
//  * Checks on the CORD blockchain whether a Registry is anchored.
//  *
//  * @param registry Registry data.
//  */

// /**
//  * @param registry
//  */
// export async function verifyStored(registry: IRegistry): Promise<void> {
//   const api = ConfigService.get('api')
//   const identifier = Identifier.uriToIdentifier(registry.identifier)
//   const encoded: any = await api.query.registry.registries(identifier)
//   if (encoded.isNone)
//     throw new SDKErrors.RegistryIdentifierMissingError(
//       `Registry with identifier ${identifier} is not registered on chain`
//     )
// }

// /**
//  * Checks on the CORD blockchain whether a schema is registered.
//  *
//  * @param schema Schema data.
//  */

// /**
//  * @param auth
//  */
// export async function verifyAuthorization(
//   auth: AuthorizationId
// ): Promise<void> {
//   const api = ConfigService.get('api')
//   const identifier = Identifier.uriToIdentifier(auth)
//   const encoded: any = await api.query.registry.authorizations(identifier)
//   if (encoded.isNone)
//     throw new SDKErrors.AuthorizationIdMissingError(
//       `Authorization with identifier ${identifier} is not registered on chain`
//     )
// }

// /**
//  * Checks on the CORD blockchain whether a Registry is anchored.
//  *
//  * @param auth Authorization URI.
//  */

// /**
//  * @param auth
//  */
// export async function fetchAuthorizationDetailsfromChain(
//   auth: AuthorizationId
// ): Promise<Option<PalletRegistryRegistryAuthorization>> {
//   const api = ConfigService.get('api')
//   const authorizationId = Identifier.uriToIdentifier(auth)
//   const registryAuthoriation: Option<PalletRegistryRegistryAuthorization> =
//     await api.query.registry.authorizations(authorizationId)
//   if (registryAuthoriation.isNone) {
//     throw new SDKErrors.AuthorizationIdentifierMissingError(
//       `Registry Authorization with identifier ${authorizationId} is not registered on chain`
//     )
//   } else {
//     return registryAuthoriation
//   }
// }

// /**
//  * @param encodedEntry
//  */
// export function getAuthorizationDetails(
//   encodedEntry: Option<PalletRegistryRegistryAuthorization>
// ): IRegistryAuthorizationDetails {
//   const decodedEntry = encodedEntry.unwrap()
//   const authorizationDetails: IRegistryAuthorizationDetails = {
//     delegate: Did.fromChain(decodedEntry.delegate),
//     schema: DecoderUtils.hexToString(decodedEntry.schema.toString()),
//   }
//   return authorizationDetails
// }

// /**
//  * Encodes the provided Schema for use in `api.tx.schema.add()`.
//  *
//  * @param schema The Schema to write on the blockchain.
//  * @param details
//  * @returns Encoded Schema.
//  */
// export function toChain(details: IRegistryType): string {
//   return Crypto.encodeObjectAsStr(details)
// }
