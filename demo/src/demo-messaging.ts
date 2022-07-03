import * as Cord from '@cord.network/sdk'
import { UUID } from '@cord.network/utils'

async function main() {
  await Cord.init({ address: 'ws://127.0.0.1:9944' })

  // Step 1: Setup Org Identity
  console.log(`\n❄️  Demo Identities (KeyRing)`)
  //3x4DHc1rxVAEqKWSx1DAAA8wZxLB4VhiRbMV997niBckUwSi
  const entityIdentity = Cord.Identity.buildFromURI('//Bob', {
    signingKeyPairType: 'sr25519',
  })
  console.log(
    `🏛  Entity (${entityIdentity.signingKeyType}): ${entityIdentity.address}`
  )
  const employeeIdentity = Cord.Identity.buildFromURI('//Dave', {
    signingKeyPairType: 'sr25519',
  })
  console.log(
    `🧑🏻‍💼 Employee (${employeeIdentity.signingKeyType}): ${employeeIdentity.address}`
  )
  const holderIdentity = Cord.Identity.buildFromURI('//Alice', {
    signingKeyPairType: 'sr25519',
  })
  console.log(
    `👩‍⚕️ Holder (${holderIdentity.signingKeyType}): ${holderIdentity.address}`
  )
  const verifierIdentity = Cord.Identity.buildFromURI('//Charlie', {
    signingKeyPairType: 'ed25519',
  })
  console.log(
    `🏢 Verifier (${verifierIdentity.signingKeyType}): ${verifierIdentity.address}`
  )
  console.log('✅ Identities created!')

  // Step 2: Create a new Space
  console.log(`\n❄️  Space Creation `)
  let spaceContent = {
    title: 'Demo Space',
    description: 'Space for demo',
  }
  let spaceTitle = spaceContent.title + ':' + UUID.generate()
  spaceContent.title = spaceTitle

  let newSpace = Cord.Space.fromSpaceProperties(spaceContent, employeeIdentity)

  let spaceCreationExtrinsic = await Cord.Space.create(newSpace)

  console.dir(newSpace, { depth: null, colors: true })

  try {
    await Cord.Chain.signAndSubmitTx(spaceCreationExtrinsic, entityIdentity, {
      resolveOn: Cord.Chain.IS_IN_BLOCK,
      rejectOn: Cord.Chain.IS_ERROR,
    })
    console.log('✅ Space created!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  // Step 2: Create a new Schema
  console.log(`\n❄️  Schema Creation `)
  console.log(`🔗 ${newSpace.identifier}`)
  let newSchemaContent = require('../res/schema.json')
  let newSchemaTitle = newSchemaContent.title + ':' + UUID.generate()
  newSchemaContent.title = newSchemaTitle

  let newSchema = Cord.Schema.fromSchemaProperties(
    newSchemaContent,
    employeeIdentity,
    newSpace.identifier
  )

  let schemaCreationExtrinsic = await Cord.Schema.create(newSchema)

  console.dir(newSchema, { depth: null, colors: true })

  try {
    await Cord.Chain.signAndSubmitTx(schemaCreationExtrinsic, entityIdentity, {
      resolveOn: Cord.Chain.IS_IN_BLOCK,
      rejectOn: Cord.Chain.IS_ERROR,
    })
    console.log('✅ Schema created!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  // Step 2: Create a new Stream
  console.log(`\n❄️  Stream Creation `)
  console.log(`🔗 ${newSpace.identifier} `)
  console.log(`🔗 ${newSchema.identifier} `)

  const content = {
    name: 'Alice',
    age: 29,
    gender: 'Female',
    country: 'India',
    credit: 1000,
  }
  let schemaStream = Cord.Content.fromSchemaAndContent(
    newSchema,
    content,
    employeeIdentity.address,
    holderIdentity.address
  )
  console.dir(schemaStream, { depth: null, colors: true })

  let newStreamContent = Cord.ContentStream.fromContent(
    schemaStream,
    employeeIdentity,
    { space: newSpace.identifier }
  )
  console.dir(newStreamContent, { depth: null, colors: true })

  let newStream = Cord.Stream.fromContentStream(newStreamContent)

  let streamCreationExtrinsic = await Cord.Stream.create(newStream)
  console.dir(newStream, { depth: null, colors: true })

  try {
    await Cord.Chain.signAndSubmitTx(streamCreationExtrinsic, entityIdentity, {
      resolveOn: Cord.Chain.IS_IN_BLOCK,
      rejectOn: Cord.Chain.IS_ERROR,
    })
    console.log('✅ Stream created!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  //  Step 7: Credential exchange via messaging
  console.log(`\n\n📩 Credential Exchange - Selective Disclosure (Verifier)`)
  console.log(`🔑 Verifier Address: ${verifierIdentity.address}`)

  const msgChallenge = UUID.generate()
  const messageBodyForHolder: Cord.MessageBody = {
    type: Cord.Message.BodyType.REQUEST_CREDENTIAL,
    content: {
      schemas: [
        {
          schemaIdentifier: schemaStream.schema,
          trustedIssuers: [schemaStream.issuer],
          requiredProperties: ['name', 'age'],
        },
      ],
      challenge: msgChallenge,
    },
  }
  const messageForHolder = new Cord.Message(
    messageBodyForHolder,
    verifierIdentity,
    holderIdentity.getPublicIdentity()
  )

  console.log(`\n📧 Selective Disclosure Request`)
  console.dir(messageForHolder, { depth: null, colors: true })

  const chainStream = await Cord.Stream.query(newStream.identifier)
  if (chainStream) {
    let credential: Cord.ICredential
    credential = await Cord.Credential.fromRequestAndStream(
      newStreamContent,
      chainStream
    )
    const presentation = await Cord.Credential.createPresentation({
      credential,
      selectedAttributes:
        messageForHolder.body.content['schemas'][0]['requiredProperties'],
      signer: holderIdentity,
      challenge: messageForHolder.body.content['challenge'],
    })

    const messageBodyForRequestor: Cord.MessageBody = {
      type: Cord.Message.BodyType.SUBMIT_CREDENTIAL,
      content: [presentation],
    }

    const messageForRequestor = new Cord.Message(
      messageBodyForRequestor,
      verifierIdentity,
      holderIdentity.getPublicIdentity()
    )
    console.log(`\n📧 Selective Disclosure Response`)
    console.dir(messageForRequestor, { depth: null, colors: true })
    console.log(`\n❄️  Verifiy Presentation`)

    if (
      messageForRequestor.body.type === Cord.Message.BodyType.SUBMIT_CREDENTIAL
    ) {
      const claims = messageForRequestor.body.content

      // Using detail verification model to capture results seperately
      // await Cord.Credential.verify(claims[0], msgChallenge)
      // is the one - line alternative
      const credIntegrity = await Cord.Credential.verifyDataIntegrity(claims[0])
      const credSignature = await Cord.ContentStream.verifySignature(
        claims[0].request,
        { challenge: msgChallenge }
      )
      const credValidity = await Cord.Stream.checkValidity(claims[0].stream)
      if (credIntegrity && credSignature && credValidity) {
        console.log(
          '✅',
          'Credential-Integity',
          credIntegrity,
          '✧ Credential-Signature',
          credSignature,
          '✧ Credential-Validity',
          credValidity
        )
      } else {
        console.log(
          `❌`,
          'Credential-Integity',
          credIntegrity,
          '| Credential-Signature',
          credSignature,
          '| Credential-Validity',
          credValidity
        )
      }
    }
  } else {
    console.log(`\n❌ Credential not found `)
  }
}
main()
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(Cord.disconnect)

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})
