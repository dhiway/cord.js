import * as Cord from '@cord.network/sdk'
import { BN } from '@polkadot/util'
import { setTimeout } from 'timers/promises'

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

export async function getChainCredits(
  faucetAccount: Cord.KeyringPair,
  recipient: Cord.CordAddress,
  chainAmount: number
) {
  const api = Cord.ConfigService.get('api')

  const tx = api.tx.balances.transfer(
    recipient,
    Cord.BalanceUtils.convertToTxUnit(new BN(chainAmount), 0)
  )

  await failproofSubmit(tx, faucetAccount)
}

export async function addAuthority(
  authorAccount: Cord.KeyringPair,
  authority: Cord.CordAddress
) {
  const api = Cord.ConfigService.get('api')

  const callTx = api.tx.extrinsicAuthorship.add([authority])

  const sudoTx = await api.tx.sudo.sudo(callTx)

  await failproofSubmit(sudoTx, authorAccount)
}
