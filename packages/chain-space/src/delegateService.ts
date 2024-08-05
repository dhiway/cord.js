
import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import * as Did from '@cord.network/did'
import type {PermissionType} from '@cord.network/types'

interface DelegateInfo {
    permission: PermissionType,
    spaceId: string,
    delegateId: string,
    authId: string
}

const api = {} as ApiPromise;

export async function prepareDelegateAuthorizationExtrinsic(delegateInfo: DelegateInfo): Promise<SubmittableExtrinsic<'promise'>[]> {
    const extrinsics: SubmittableExtrinsic<'promise'>[] = [];

    const delegateAuthorizationTx = api.tx.delegate.dispatchDelegateAuthorizationTx(delegateInfo);
    extrinsics.push(delegateAuthorizationTx);

    // Prepare the extrinsic for DID authorization
    const extrinsic = Did.authorizeTx(delegateInfo);
    extrinsics.push(extrinsic);

    return extrinsics;
}
