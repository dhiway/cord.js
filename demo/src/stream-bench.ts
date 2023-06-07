import * as Cord from '@cord.network/sdk'
import { UUID, Crypto } from '@cord.network/utils'
import { generateKeypairs } from './utils/generateKeypairs'
import { createDid } from './utils/generateDid'
import { createDidName } from './utils/generateDidName'
import { getDidDocFromName } from './utils/queryDidName'
import { ensureStoredSchema } from './utils/generateSchema'
import {
  ensureStoredRegistry,
  addRegistryAdminDelegate,
  addRegistryDelegate,
} from './utils/generateRegistry'
import { createDocument } from './utils/createDocument'
import { createPresentation } from './utils/createPresentation'
import { createStream } from './utils/createStream'
import { verifyPresentation } from './utils/verifyPresentation'
import { revokeCredential } from './utils/revokeCredential'
import { randomUUID } from 'crypto'
import { decryptMessage } from './utils/decrypt_message'
import { encryptMessage } from './utils/encrypt_message'
import { generateRequestCredentialMessage } from './utils/request_credential_message'
import { getChainCredits, addAuthority } from './utils/createAuthorities'
import { createAccount } from './utils/createAccount'
import moment from 'moment'

function getChallenge(): string {
  return Cord.Utils.UUID.generate()
}

async function main() {
  const networkAddress = 'ws://127.0.0.1:9944'
  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK })
  await Cord.connect(networkAddress)

  // Step 1: Setup Authority
  // Setup transaction author account - CORD Account.

  console.log(`\n❄️  Identities `)
  const Alice = Crypto.makeKeypairFromUri('//Alice', 'sr25519')
  const Bob = Crypto.makeKeypairFromUri('//Bob', 'sr25519')

  const { mnemonic: aliceMnemonic, document: aliceDid } = await createDid(Alice)

  const { mnemonic: bobMnemonic, document: bobDid } = await createDid(Bob)
  const aliceKeys = await generateKeypairs(aliceMnemonic)

  // // Step 2: Create a DID name for Issuer
  console.log(`\n❄️  DID name Creation `)
  const randomDidName = `solar.sailer.${randomUUID().substring(0, 4)}@cord`

  await createDidName(aliceDid.uri, Bob, randomDidName, async ({ data }) => ({
    signature: aliceKeys.authentication.sign(data),
    keyType: aliceKeys.authentication.type,
  }))
  console.log(`✅ DID name - ${randomDidName} - created!`)
  await getDidDocFromName(randomDidName)

  // Step 2: Create a new Schema
  console.log(`\n❄️  Schema Creation `)
  const schema = await ensureStoredSchema(
    Bob,
    aliceDid.uri,
    async ({ data }) => ({
      signature: aliceKeys.assertionMethod.sign(data),
      keyType: aliceKeys.assertionMethod.type,
    })
  )
  console.log('✅ Schema created!')

  // Step 3: Create a new Registry
  console.log(`\n❄️  Registry Creation `)
  const registry = await ensureStoredRegistry(
    Bob,
    aliceDid.uri,
    schema['$id'],
    async ({ data }) => ({
      signature: aliceKeys.assertionMethod.sign(data),
      keyType: aliceKeys.assertionMethod.type,
    })
  )
  console.log('✅ Registry created!')

  const registryDelegate = await addRegistryDelegate(
    Alice,
    aliceDid.uri,
    registry['identifier'],
    aliceDid.uri,
    async ({ data }) => ({
      signature: aliceKeys.capabilityDelegation.sign(data),
      keyType: aliceKeys.capabilityDelegation.type,
    })
  )

  const api = Cord.ConfigService.get('api')
  // Step 2: Create a new Stream
  console.log(`\n✉️  Adding a new Stream`, '\n')
  let tx_batch: any = []

  let startTxPrep = moment()
  let txCount = 2000
  let newStreamContent: Cord.IContentStream
  console.log(`\n ✨ Benchmark ${txCount} transactions `)

  for (let j = 0; j < txCount; j++) {
    let content = {
      name: 'Bob ' + ': ' + UUID.generate(),
      age: 29,
      id: `${bobDid.uri}`,
      gender: 'Male',
      country: 'India',
    }

    let schemaStream = await Cord.Content.fromSchemaAndContent(
      schema,
      content,
      bobDid.uri,
      aliceDid.uri
    )
    let signCallback: Cord.SignCallback = async ({ data }) => ({
      signature: aliceKeys.authentication.sign(data),
      keyType: aliceKeys.authentication.type,
      keyUri: `${aliceDid.uri}${aliceDid.authentication[0].id}`,
    })

    const document = await Cord.Document.fromContent({
      content: schemaStream,
      authorization: registryDelegate,
      registry: registry.identifier,
      signCallback,
    })

    process.stdout.write(
      '  🔖  Extrinsic creation took ' +
        moment.duration(moment().diff(startTxPrep)).as('seconds').toFixed(3) +
        's\r'
    )
    let extSignCallback: Cord.SignExtrinsicCallback = async ({ data }) => ({
      signature: aliceKeys.assertionMethod.sign(data),
      keyType: aliceKeys.assertionMethod.type,
    })

    try {
      // Create a stream object
      const { streamHash } = Cord.Stream.fromDocument(document)
      const authorization = Cord.Registry.uriToIdentifier(
        document.authorization
      )
      const schemaId = Cord.Registry.uriToIdentifier(document.content.schemaId)
      // To create a stream without a schema, use the following line instead:
      // const schemaId = null
      // make sure the registry is not linked with a schema for this to work
      const streamTx = api.tx.stream.create(streamHash, authorization, schemaId)

      /* TODO: txCounter is a must have requirement in this case, but it works
         because DID is freshly created. Otherwise, it should pick the latest
         DID's nonce and then use that. */

      const txStream = await Cord.Did.authorizeTx(
        aliceDid.uri,
        streamTx,
        extSignCallback,
        Alice.address,
        { txCounter: j + 1 }
      )
      tx_batch.push(txStream)
    } catch (e: any) {
      console.log(e.errorCode, '-', e.message)
      console.log('IN ERROR 1')
    }
  }
  let ancStartTime = moment()
  console.log('\n')
  for (let i = 0; i < tx_batch.length; i++) {
    process.stdout.write(
      '  🎁  Anchoring ' +
        (i + 1) +
        ' extrinsics took ' +
        moment.duration(moment().diff(ancStartTime)).as('seconds').toFixed(3) +
        's\r'
    )

    try {
      await Cord.Chain.signAndSubmitTx(tx_batch[i], Alice, {
        resolveOn: Cord.Chain.IS_READY,
        rejectOn: Cord.Chain.IS_ERROR,
      })
    } catch (e: any) {
      console.log(e.errorCode, '-', e.message)
      console.log('IN ERROR 2')
    }
  }

  let ancEndTime = moment()
  var ancDuration = moment.duration(ancEndTime.diff(ancStartTime))
  console.log(
    `\n  🙌  Block TPS (extrinsic) - ${+(
      txCount / ancDuration.as('seconds')
    ).toFixed(0)} `
  )
}
main()
  .then(() => console.log('Bye! 👋 👋 👋 \n'))
  .finally(Cord.disconnect)

process.on('SIGINT', async () => {
  console.log('Bye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})
