/**
 * Schema.
 *
 * * A Space is a collection to hold schemas, stream, controllers and delegates
 *
 * @packageDocumentation
 * @module Space
 * @preferred
 */

import type {
  ISpace,
  ISpaceDetails,
  SubmittableExtrinsic,
} from '@cord.network/types'
import { Identifier, Crypto, UUID } from '@cord.network/utils'
import {
  query,
  create,
  authorise,
  deauthorise,
  archive,
  restore,
  transfer,
} from './Space.chain.js'
import * as SpaceUtils from './Space.utils.js'
import { SPACE_IDENTIFIER, SPACE_PREFIX } from '@cord.network/types'
import { Identity } from '../identity/Identity.js'

export class Space implements ISpace {
  /**
   * [STATIC] [ASYNC] Queries the chain for a given space entry, by `identifier`.
   *
   * @param identifier - The identifier of the space.
   * @returns A promise containing the [[SpaceDetails] or null.
   */
  public static async query(identifier: string): Promise<SpaceDetails | null> {
    return query(Identifier.getIdentifierKey(identifier, SPACE_PREFIX))
  }

  /**
   *  [STATIC] Creates a new [[Space]] from an [[ISpaceType]].
 
   *
   * @param space The request from which the [[Space]] should be generated.
   * @param controller The identity of the [[Space]] controller.
   * @returns An instance of [[Space]].
   */
  public static fromSpaceProperties(
    space: ISpace['space'],
    controller: Identity
  ): Space {
    const spaceHash = Crypto.hashObjectAsHexStr(space)
    const spaceId = Identifier.getIdentifier(
      spaceHash,
      SPACE_IDENTIFIER,
      SPACE_PREFIX
    )
    return new Space({
      identifier: spaceId,
      spaceHash: spaceHash,
      space: {
        ...space,
      },
      controller: controller.address,
      controllerSignature: controller.signStr(spaceHash),
    })
  }
  /**
   *  [STATIC] Custom Type Guard to determine input being of type ISpace using the SpaceUtils errorCheck.
   *
   * @param input The potentially only partial ISpace.
   * @returns Boolean whether input is of type ISpace.
   */
  public static isISpace(input: unknown): input is ISpace {
    try {
      SpaceUtils.errorCheck(input as ISpace)
    } catch (error) {
      return false
    }
    return true
  }

  public identifier: ISpace['identifier']
  public spaceHash: ISpace['spaceHash']
  public controller: ISpace['controller']
  public controllerSignature: string
  public space: ISpace['space']

  public constructor(spaceInput: ISpace) {
    SpaceUtils.errorCheck(spaceInput)
    this.identifier = spaceInput.identifier
    this.spaceHash = spaceInput.spaceHash
    this.controller = spaceInput.controller
    this.controllerSignature = spaceInput.controllerSignature
    this.space = spaceInput.space
  }

  /**
   * [ASYNC] Stores the [[Space]] on the blockchain.
   *
   * @returns A promise of a unsigned SubmittableExtrinsic.
   */
  public async create(): Promise<SubmittableExtrinsic> {
    return create(this)
  }

  /**
   *  [ASYNC] Add delegates to a [[Space]].
   *
   * @param controller The identity of the [[Space]] controller.
   * @param delegates Delegates to be added.
   *
   * @returns A promise of a unsigned SubmittableExtrinsic.
   */
  public async authorise(
    controller: Identity,
    delegates: [string]
  ): Promise<SubmittableExtrinsic> {
    const txId = UUID.generate()
    const spaceHash = this.spaceHash
    const hashVal = { txId, delegates, spaceHash }
    const txHash = Crypto.hashObjectAsHexStr(hashVal)
    const txSignature = controller.signStr(txHash)
    return authorise(
      this.identifier,
      controller.address,
      delegates,
      txHash,
      txSignature
    )
  }

  /**
   *  [ASYNC] Remove delegates from a [[Space]].
   *
   * @param controller The identity of the [[Space]] controller.
   * @param delegates Delegates to be removed.
   *
   * @returns A promise of a unsigned SubmittableExtrinsic.
   */
  public async deauthorise(
    controller: Identity,
    delegates: [string]
  ): Promise<SubmittableExtrinsic> {
    const txId = UUID.generate()
    const spaceHash = this.spaceHash
    const hashVal = { txId, delegates, spaceHash }
    const txHash = Crypto.hashObjectAsHexStr(hashVal)
    const txSignature = controller.signStr(txHash)
    return deauthorise(
      this.identifier,
      controller.address,
      delegates,
      txHash,
      txSignature
    )
  }

  /**
   *  [ASYNC] Archive a [[Space]].
   *
   * @param controller The identity of the [[Space]] controller.
   *
   * @returns A promise of a unsigned SubmittableExtrinsic.
   */
  public async archive(controller: Identity): Promise<SubmittableExtrinsic> {
    const txId = UUID.generate()
    const spaceHash = this.spaceHash
    const hashVal = { txId, spaceHash }
    const txHash = Crypto.hashObjectAsHexStr(hashVal)
    const txSignature = controller.signStr(txHash)
    return archive(this.identifier, controller.address, txHash, txSignature)
  }

  /**
   *  [ASYNC] Restore a [[Space]].
   *
   * @param controller The identity of the [[Space]] controller.
   *
   * @returns A promise of a unsigned SubmittableExtrinsic.
   */
  public async restore(controller: Identity): Promise<SubmittableExtrinsic> {
    const txId = UUID.generate()
    const spaceHash = this.spaceHash
    const hashVal = { txId, spaceHash }
    const txHash = Crypto.hashObjectAsHexStr(hashVal)
    const txSignature = controller.signStr(txHash)
    return restore(this.identifier, controller.address, txHash, txSignature)
  }

  /**
   *  [ASYNC] Transfer a [[Space]].
   *
   * @param controller The identity of the [[Space]] controller.
   * @param transfer_to The address of the new [[Space]] controller.
   *
   * @returns A promise of a unsigned SubmittableExtrinsic.
   */
  public async transfer(
    controller: Identity,
    transfer_to: Identity['address']
  ): Promise<SubmittableExtrinsic> {
    const txId = UUID.generate()
    const spaceHash = this.spaceHash
    const hashVal = { txId, spaceHash }
    const txHash = Crypto.hashObjectAsHexStr(hashVal)
    const txSignature = controller.signStr(txHash)
    return transfer(
      this.identifier,
      controller.address,
      transfer_to,
      txHash,
      txSignature
    )
  }
}

export class SpaceDetails implements ISpaceDetails {
  public static fromSpaceDetails(input: ISpaceDetails): SpaceDetails {
    return new SpaceDetails(input)
  }
  /**
   * Builds a new [[SpaceDetails]] instance.
   */

  public identifier: ISpaceDetails['identifier']
  public spaceHash: ISpaceDetails['spaceHash']
  public controller: ISpaceDetails['controller']
  public archived: ISpaceDetails['archived']

  public constructor(details: ISpaceDetails) {
    this.identifier = details.identifier
    this.spaceHash = details.spaceHash
    this.controller = details.controller
    this.archived = details.archived
  }
}
