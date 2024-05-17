// import {
//   WitnessUri,
// } from '@cord.network/types'

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

// import type { Option } from '@cord.network/types'
// import type { PalletAssetAssetEntry, PalletAssetAssetStatusOf } from '@cord.network/augment-api'

// import * as Did from '@cord.network/did'
// import { uriToIdentifier } from '@cord.network/identifier'
// import { Chain } from '@cord.network/network'
// import { ConfigService } from '@cord.network/config'
// import { SDKErrors } from '@cord.network/utils'
// import { DidUri } from '../../types/lib/esm/DidDocument';

export async function dispatchCreateToChain(
    creator: DidUri,
    documentUri: WitnessUri,
    digest: string,
    witness_count: number,
    authorizationUri: AuthorizationUri,
    authorAccount: CordKeyringPair,
    signCallback: SignExtrinsicCallback,
): Promise<{ documentUri: WitnessUri, creator: DidUri }> {
    // try {
        const api = ConfigService.get('api')
        const authorizationId: AuthorizationId = uriToIdentifier(authorizationUri)
        
        const tx = api.tx.witness.create(
            documentUri,
            digest,
            witness_count,
            authorizationId
        )
        
        console.log("authorizationId", authorizationId);

        console.log(
            "creator ", creator,
            //"signCallback", signCallback,
            "authorAccount.address", authorAccount.address
        )

        const extrinsic = await Did.authorizeTx(
            creator,
            tx,
            signCallback,
            authorAccount.address
        )

        await Chain.signAndSubmitTx(extrinsic, authorAccount)

        return {documentUri, creator}
    // } catch (error) {
    //     const errorMessage =
    //     error instanceof Error ? error.message : JSON.stringify(error)
    //     throw new SDKErrors.CordDispatchError(
    //     `Error dispatching to chain: "${errorMessage}".`
    //     )
    // }
    
}

export async function dispatchWitnessToChain(
    signer: DidUri,
    documentUri: WitnessUri,
    digest: string,
    authorizationUri: AuthorizationUri,
    authorAccount: CordKeyringPair,
    signCallback: SignExtrinsicCallback,
/* TODO: Add witness_counts, status to promise and return after retreiving the data from tx or extrinsic */
): Promise<{ 
    documentUri: WitnessUri, 
    signer: DidUri, 
 }> {
    try {
        const api = ConfigService.get('api')
        const authorizationId: AuthorizationId = uriToIdentifier(authorizationUri)
        
        const tx = api.tx.witness.witness(
            documentUri,
            digest,
            authorizationId
        )

        const extrinsic = await Did.authorizeTx(
            signer,
            tx,
            signCallback,
            authorAccount.address
        )

        await Chain.signAndSubmitTx(extrinsic, authorAccount)

        return {documentUri, signer}
    } catch (error) {
        const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error)
        throw new SDKErrors.CordDispatchError(
        `Error dispatching to chain: "${errorMessage}".`
        )
    }
}