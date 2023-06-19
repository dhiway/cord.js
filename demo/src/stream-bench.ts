import * as Cord from '@cord.network/sdk'
import { UUID, Crypto } from '@cord.network/utils'
import { generateKeypairs } from './utils/generateKeypairs'
import { createDid } from './utils/generateDid'
import { createDidName } from './utils/generateDidName'
import { getDidDocFromName } from './utils/queryDidName'
import { ensureStoredSchema } from './utils/generateSchema'
import {
  ensureStoredRegistry,
  addRegistryDelegate,
} from './utils/generateRegistry'
import { randomUUID } from 'crypto'
import { getChainCredits, addAuthority } from './utils/createAuthorities'
import moment from 'moment'

function getChallenge(): string {
  return Cord.Utils.UUID.generate()
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

async function main() {
  const networkAddress = 'ws://127.0.0.1:9944'
  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK })
  await Cord.connect(networkAddress)

  // Step 1: Setup Authority
  // Setup transaction author account - CORD Account.

  console.log(`\n❄️  Identities `)
  const xUri = process.argv[2] ? process.argv[2] : '//Alice'
  console.log('🥢 URI of identity 1: ', xUri)

  const X = Crypto.makeKeypairFromUri(`${xUri}`, 'sr25519')

  await sleep(Math.random()*6000);
  if (xUri != '//Alice' && xUri != '//Bob') {
  try {
    const authorityAuthorIdentity = Crypto.makeKeypairFromUri(
      `//Alice`,
      'sr25519'
    )
    await addAuthority(authorityAuthorIdentity, X.address)
    console.log(`🔏 permissions updated`)
    await getChainCredits(authorityAuthorIdentity, X.address, 15)
    console.log(`💸 Authors endowed with credits`)
    } catch (err) {
    console.log('authority addition: ', err);
    }
  }

  const { mnemonic: XMnemonic, document: XDid } = await createDid(X)
  const { mnemonic: YMnemonic, document: YDid } = await createDid(X)
  const XKeys = await generateKeypairs(XMnemonic)

  // // Step 2: Create a DID name for Issuer
  console.log(`\n❄️  DID name Creation `)
  const randomDidName = `solar.sailer.${randomUUID().substring(0, 4)}@cord`

  await createDidName(XDid.uri, X, randomDidName, async ({ data }) => ({
    signature: XKeys.authentication.sign(data),
    keyType: XKeys.authentication.type,
  }))
  console.log(`✅ DID name - ${randomDidName} - created!`)
  await getDidDocFromName(randomDidName)

  // Step 2: Create a new Schema
  console.log(`\n❄️  Schema Creation `)
  const schema = await ensureStoredSchema(X, XDid.uri, async ({ data }) => ({
    signature: XKeys.assertionMethod.sign(data),
    keyType: XKeys.assertionMethod.type,
  }))
  console.log('✅ Schema created!')
  // Step 3: Create a new Registry
  console.log(`\n❄️  Registry Creation `)
  const registry = await ensureStoredRegistry(
    X,
    XDid.uri,
    schema['$id'],
    async ({ data }) => ({
      signature: XKeys.assertionMethod.sign(data),
      keyType: XKeys.assertionMethod.type,
    })
  )
  console.log('\n✅ Registry created!')

  const registryDelegate = await addRegistryDelegate(
    X,
    XDid.uri,
    registry['identifier'],
    XDid.uri,
    async ({ data }) => ({
      signature: XKeys.capabilityDelegation.sign(data),
      keyType: XKeys.capabilityDelegation.type,
    })
  )

  const api = Cord.ConfigService.get('api')
  // Step 2: Create a new Stream
  console.log(`\n✉️  Adding a new Stream`, '\n')
  let tx_batch: any = []

  let startTxPrep = moment()
  let txCount = 3000
  let newStreamContent: Cord.IContentStream
  console.log(`\n ✨ Benchmark ${txCount} transactions `)

  for (let j = 0; j < txCount; j++) {
    let content = {
      name: 'Bob ' + ': ' + UUID.generate(),
      age: 29,
      id: `${YDid.uri}`,
      gender: 'Male',
      country: 'India',
    }

    let schemaStream = await Cord.Content.fromSchemaAndContent(
      schema,
      content,
      YDid.uri,
      XDid.uri
    )
    let signCallback: Cord.SignCallback = async ({ data }) => ({
      signature: XKeys.authentication.sign(data),
      keyType: XKeys.authentication.type,
      keyUri: `${XDid.uri}${XDid.authentication[0].id}`,
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
      signature: XKeys.assertionMethod.sign(data),
      keyType: XKeys.assertionMethod.type,
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
        XDid.uri,
        streamTx,
        extSignCallback,
        X.address,
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
      await Cord.Chain.signAndSubmitTx(tx_batch[i], X, {
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

  /*
  await sleep(3000)

  let batchAncStartTime = moment()
  try {
    api.tx.utility.batchAll(tx_batch).signAndSend(Alice)
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  let batchAncEndTime = moment()
  var batchAncDuration = moment.duration(
    batchAncEndTime.diff(batchAncStartTime)
  )
  console.log(
    `\n  🎁  Anchoring a batch of ${
      tx_batch.length
    } extrinsics took ${batchAncDuration.as('seconds')}s`
  )
  console.log(
    `  🙌  Block TPS (batch) - ${+(
      txCount / batchAncDuration.as('seconds')
    ).toFixed(0)} `
  )
  */
  await sleep(2000)
  await api.disconnect()
}
main()
  .then(() => console.log('Bye! 👋 👋 👋 \n'))
  .finally(Cord.disconnect)

process.on('SIGINT', async () => {
  console.log('Bye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})
