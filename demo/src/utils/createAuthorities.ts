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

/**
 * It sends a transaction to the chain to transfer the specified amount of credits from the faucet
 * account to the recipient account
 * @param faucetAccount - The account that will be used to send the credits to the recipient.
 * @param recipient - The address of the account you want to send credits to.
 * @param {number} chainAmount - The amount of credits to transfer to the recipient.
 */
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

/**
 * It adds an authority to the list of authorities that can submit extrinsics to the chain
 * @param authorAccount - The account that will be used to sign the transaction.
 * @param authority - The address of the authority to add.
 */
export async function addNetworkMember(
  authorAccount: Cord.KeyringPair,
  authority: Cord.CordAddress
) {
  const api = Cord.ConfigService.get('api')

  const callTx = api.tx.networkMembership.nominate(authority, false)

  const sudoTx = await api.tx.sudo.sudo(callTx)

  await failproofSubmit(sudoTx, authorAccount)
}
