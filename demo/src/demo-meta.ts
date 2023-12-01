import * as Cord from '@cord.network/sdk'
import { UUID, Crypto, SDKErrors } from '@cord.network/utils'

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

  // Step 2: Create a new Schema
  console.log(`\n❄️  Schema Creation `)
  let newSchemaContent = require('../res/schema.json')
  let newSchemaTitle = newSchemaContent.title + ':' + UUID.generate()
  newSchemaContent.title = newSchemaTitle

  let newSchema = Cord.Schema.fromSchemaProperties(
    newSchemaContent,
    employeeIdentity
  )
  console.dir(newSchema, {
    depth: null,
    colors: true,
  })

  let schemaCreationExtrinsic = await Cord.Schema.create(newSchema)

  try {
    await Cord.Chain.signAndSubmitTx(schemaCreationExtrinsic, entityIdentity, {
      resolveOn: Cord.Chain.IS_IN_BLOCK,
      rejectOn: Cord.Chain.IS_ERROR,
    })
    console.log('✅ Schema created!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  // Step 3: Add Schema Metadata
  console.log(`\n❄️  Schema Metadata addition `)
  console.log(`🔗 ${newSchema.identifier}`)

  let schemaMeta = Cord.Meta.fromMetaProperties(
    newSchema.identifier,
    JSON.stringify(newSchema.schema),
    employeeIdentity
  )
  let schemaMetaCreationExtrinsic = await Cord.Meta.setMetadata(schemaMeta)
  console.dir(schemaMeta, {
    depth: null,
    colors: true,
  })

  try {
    await Cord.Chain.signAndSubmitTx(
      schemaMetaCreationExtrinsic,
      entityIdentity,
      {
        resolveOn: Cord.Chain.IS_IN_BLOCK,
        rejectOn: Cord.Chain.IS_ERROR,
      }
    )
    console.log('✅ Schema metadata added!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  // Step 4: Create a new Space
  console.log(`\n❄️  Space Creation `)
  let spaceContent = {
    title: 'Demo Registry Space',
    description: 'Space for registy demo',
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

  // Step 5: Add Space Metadata
  console.log(`\n❄️  Space Metadata addition `)
  console.log(`🔗 ${newSpace.identifier}`)

  let spaceMeta = Cord.Meta.fromMetaProperties(
    newSpace.identifier,
    JSON.stringify(newSpace.details),
    employeeIdentity
  )
  let spaceMetaCreationExtrinsic = await Cord.Meta.setMetadata(spaceMeta)
  console.dir(spaceMeta, {
    depth: null,
    colors: true,
  })

  try {
    await Cord.Chain.signAndSubmitTx(
      spaceMetaCreationExtrinsic,
      entityIdentity,
      {
        resolveOn: Cord.Chain.IS_IN_BLOCK,
        rejectOn: Cord.Chain.IS_ERROR,
      }
    )
    console.log('✅ Space metadata added!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  // Step 6: Create a new Statement
  console.log(`\n❄️  Statement Creation `)
  console.log(`🔗 ${newSpace.identifier} `)
  console.log(`🔗 ${newSchema.identifier} `)

  const content = {
    name: 'Alice',
    age: 29,
    gender: 'Female',
    country: 'India',
    credit: 1000,
  }
  let schemaStatement = Cord.Content.fromSchemaAndContent(
    newSchema,
    content,
    employeeIdentity.address,
    holderIdentity.address
  )
  console.dir(schemaStatement, { depth: null, colors: true })

  let newStatementContent = Cord.ContentStatement.fromContent(
    schemaStatement,
    employeeIdentity,
    { space: newSpace.identifier }
  )
  console.dir(newStatementContent, { depth: null, colors: true })

  let newStatement = Cord.Statement.fromContentStatement(newStatementContent)

  let statementCreationExtrinsic = await Cord.Statement.create(newStatement)
  console.dir(newStatement, { depth: null, colors: true })

  try {
    await Cord.Chain.signAndSubmitTx(statementCreationExtrinsic, entityIdentity, {
      resolveOn: Cord.Chain.IS_IN_BLOCK,
      rejectOn: Cord.Chain.IS_ERROR,
    })
    console.log('✅ Statement created!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  // Step 7: Add Statement Metadata
  console.log(`\n❄️  Statement Metadata addition `)
  console.log(`🔗 ${newStatementContent.identifier}`)

  let statementMeta = Cord.Meta.fromMetaProperties(
    newStatementContent.identifier,
    JSON.stringify(newStatementContent),
    employeeIdentity
  )
  let statementMetaCreationExtrinsic = await Cord.Meta.setMetadata(statementMeta)
  console.dir(statementMeta, {
    depth: null,
    colors: true,
  })

  try {
    await Cord.Chain.signAndSubmitTx(
      statementMetaCreationExtrinsic,
      entityIdentity,
      {
        resolveOn: Cord.Chain.IS_IN_BLOCK,
        rejectOn: Cord.Chain.IS_ERROR,
      }
    )
    console.log('✅ Statement metadata added!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  // Step 8: Retrieve Metadata
  console.log(`\n❄️  Schema Metadata `)
  console.log(`🔗 ${newSchema.identifier}`)
  const schemaMetaData = await Cord.Meta.query(newSchema.identifier)
  if (!schemaMetaData) {
    console.log(`Schema metadata not anchored on CORD`)
  } else {
    console.dir(schemaMetaData, { depth: null, colors: true })
  }

  console.log(`\n❄️  Space Metadata `)
  console.log(`🔗 ${newSpace.identifier}`)
  const spaceMetaData = await Cord.Meta.query(newSpace.identifier)
  if (!spaceMetaData) {
    console.log(`Space metadata not anchored on CORD`)
  } else {
    console.dir(spaceMetaData, { depth: null, colors: true })
  }

  console.log(`\n❄️  Statement Metadata `)
  console.log(`🔗 ${newStatementContent.identifier}`)
  const statementMetaData = await Cord.Meta.query(newStatementContent.identifier)
  if (!statementMetaData) {
    console.log(`Space metadata not anchored on CORD`)
  } else {
    console.dir(statementMetaData, { depth: null, colors: true })
  }

  // Step 9: Clear Space metadata
  console.log(`\n❄️  Clear Metadata - ${newSpace.identifier} `)
  let clearSpaceMeta = spaceMeta

  let clearSpaceMetaExtrinsic = await Cord.Meta.clearMetadata(
    clearSpaceMeta,
    employeeIdentity
  )

  try {
    await Cord.Chain.signAndSubmitTx(clearSpaceMetaExtrinsic, entityIdentity, {
      resolveOn: Cord.Chain.IS_IN_BLOCK,
      rejectOn: Cord.Chain.IS_ERROR,
    })
    console.log(`✅ Space Metadata cleared!`)
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }
  // Step 6: Reverify Space Metadata
  console.log(`\n❄️  Space Metadata - ${newSpace.identifier} `)
  const spaceMetaDataQuery = await Cord.Meta.query(newSpace.identifier)
  if (!spaceMetaDataQuery) {
    console.log(`Space metadata not anchored on CORD`)
  } else {
    console.dir(spaceMetaDataQuery, { depth: null, colors: true })
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
