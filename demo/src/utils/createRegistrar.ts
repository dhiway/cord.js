import * as Cord from '@cord.network/sdk'
import { BN } from '@polkadot/util'
import { setTimeout } from 'timers/promises'

/**
 * It tries to submit a transaction, and if it fails, it waits a bit and tries again
 * @param tx - The transaction to submit.
 * @param submitter - The account that will be used to sign the transaction.
 */
async function failproofSubmit(
  tx: Cord.SubmittableExtrinsic,
  submitter: Cord.KeyringPair
) {
  try {
    await Cord.Chain.signAndSubmitTx(tx, submitter)
  } catch {
    // Try a second time after a small delay and fetching the right nonce.
    const waitingTime = 6_000 // 6 seconds
    console.log(
      `First submission failed. Waiting ${waitingTime} ms before retrying.`
    )
    await setTimeout(waitingTime)
    console.log('Retrying...')
    // nonce: -1 tells the client to fetch the latest nonce by also checking the tx pool.
    const resignedBatchTx = await tx.signAsync(submitter, { nonce: -1 })
    await Cord.Chain.submitSignedTx(resignedBatchTx)
  }
}

export async function setRegistrar(
  authority: Cord.KeyringPair,
  registrar: Cord.CordAddress
) {
  const api = Cord.ConfigService.get('api')

  const callTx = api.tx.identity.addRegistrar(registrar)
  const sudoTx = api.tx.sudo.sudo(callTx)

  await Cord.Chain.signAndSubmitTx(sudoTx, authority)
}

export async function setIdentity(account: Cord.KeyringPair) {
  const identityInfo = {
    additional: [[null, null]],
    display: {
      Raw: 'Cord_Demo',
    },
    legal: {
      Raw: 'CORD Demo Account',
    },
    web: {
      Raw: 'dhiway.com',
    },
    email: {
      Raw: 'engineering@dhiway.com',
    },
  }

  const api = Cord.ConfigService.get('api')

  const callTx = api.tx.identity.setIdentity(identityInfo)

  await Cord.Chain.signAndSubmitTx(callTx, account)

  // await failproofSubmit(callTx, account)
}

export async function requestJudgement(
  account: Cord.KeyringPair,
  registrar: Cord.CordAddress
) {
  const api = Cord.ConfigService.get('api')

  // const identityInfos = await api.query.identity.identityOf(account.address);
  // const identityHash = identityInfos.unwrap().info.hash.toHex();

  const callTx = api.tx.identity.requestJudgement(registrar)

  await Cord.Chain.signAndSubmitTx(callTx, account)

  // await failproofSubmit(callTx, account)
}

export async function provideJudgement(
  registrar: Cord.KeyringPair,
  account: Cord.CordAddress
) {
  const api = Cord.ConfigService.get('api')

  const identityInfos = await api.query.identity.identityOf(account)
  const identityHash = identityInfos.unwrap().info.hash.toHex()

  const callTx = api.tx.identity.provideJudgement(
    account,
    'Reasonable',
    identityHash
  )
  await Cord.Chain.signAndSubmitTx(callTx, registrar)

  // await failproofSubmit(callTx, registrar)
}
