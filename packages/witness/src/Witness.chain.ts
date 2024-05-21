import {
    DidUri,
    AuthorizationUri,
    SignExtrinsicCallback,
    AuthorizationId,
    CordKeyringPair,
} from '@cord.network/types'

import * as Did from '@cord.network/did'

import { Chain } from '@cord.network/network'

import { SDKErrors } from '@cord.network/utils'

import { ConfigService } from '@cord.network/config'

import { uriToIdentifier } from '@cord.network/identifier'
import { 
    WitnessUri
} from '@cord.network/types/src/witness';

export async function dispatchCreateToChain(
    creator: DidUri,
    documentUri: WitnessUri,
    digest: string,
    witness_count: number,
    authorizationUri: AuthorizationUri,
    authorAccount: CordKeyringPair,
    signCallback: SignExtrinsicCallback,
): Promise<{ documentUri: WitnessUri, creator: DidUri }> {
    try {
        const api = ConfigService.get('api')
        const authorizationId: AuthorizationId = uriToIdentifier(authorizationUri)
        
        const tx = api.tx.witness.create(
            documentUri.replaceAll('did:cord:', ''),
            digest,
            witness_count,
            authorizationId
        )

        const extrinsic = await Did.authorizeTx(
            creator,
            tx,
            signCallback,
            authorAccount.address
        )
        
        await Chain.signAndSubmitTx(extrinsic, authorAccount)

        return {documentUri, creator}
    } catch (error) {
        const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error)
        throw new SDKErrors.CordDispatchError(
        `Error dispatching to chain: "${errorMessage}".`
        )
    }
    
}

export async function dispatchWitnessToChain(
    signer: DidUri,
    documentUri: WitnessUri,
    digest: string,
    comment: string,
    authorAccount: CordKeyringPair,
    signCallback: SignExtrinsicCallback,
): Promise<{ 
    documentUri: WitnessUri, 
    signer: DidUri, 
    comment: string,
 }> {
    try {
        const api = ConfigService.get('api')

        const tx = api.tx.witness.witness(
            documentUri.replaceAll('did:cord:', ''),
            digest,
            comment,
        )

        const extrinsic = await Did.authorizeTx(
            signer,
            tx,
            signCallback,
            authorAccount.address
        )

        await Chain.signAndSubmitTx(extrinsic, authorAccount)

        return {documentUri, signer, comment}
    } catch (error) {
        const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error)
        throw new SDKErrors.CordDispatchError(
        `Error dispatching to chain: "${errorMessage}".`
        )
    }
}
