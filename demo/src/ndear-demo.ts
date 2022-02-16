import * as cord from '@cord.network/api'
import { UUID } from '@cord.network/utils'
import * as utils from './utils'
import * as json from 'multiformats/codecs/json'
import { blake2b256 as hasher } from '@multiformats/blake2/blake2b'
import { CID } from 'multiformats/cid'

async function main() {
  await cord.init({ address: 'ws://127.0.0.1:9944' })

  // Step 1: Setup Org Identity
  console.log(`\n🏛  Creating Identities\n`)
  //3x4DHc1rxVAEqKWSx1DAAA8wZxLB4VhiRbMV997niBckUwSi
  const authorIdentity = cord.Identity.buildFromURI('//Bob', {
    signingKeyPairType: 'sr25519',
  })
  const accrediatorIdentity = cord.Identity.buildFromURI('//Alice', {
    signingKeyPairType: 'sr25519',
  })
  const instituteOneIdentity = cord.Identity.buildFromURI('//InstituteOne', {
    signingKeyPairType: 'sr25519',
  })
  const instituteTwoIdentity = cord.Identity.buildFromURI('//InstituteTwo', {
    signingKeyPairType: 'sr25519',
  })
  const holderIdentity = cord.Identity.buildFromURI('//Student', {
    signingKeyPairType: 'sr25519',
  })
  const verifierIdentity = cord.Identity.buildFromURI('//Employer', {
    signingKeyPairType: 'sr25519',
  })
  console.log(
    `🔑 Chain Author Address (${authorIdentity.signingKeyType}): ${authorIdentity.address}`
  )
  console.log(
    `🔑 Accrediation Entity Address (${accrediatorIdentity.signingKeyType}): ${accrediatorIdentity.address}`
  )
  console.log(
    `🔑 Institute One Address (${instituteOneIdentity.signingKeyType}): ${instituteOneIdentity.address}`
  )
  console.log(
    `🔑 Institute Two Address (${instituteTwoIdentity.signingKeyType}): ${instituteTwoIdentity.address}`
  )
  console.log(
    `🔑 Student (holder) Address (${holderIdentity.signingKeyType}): ${holderIdentity.address}`
  )
  console.log(
    `🔑 Employer (verifier) Entity Address (${verifierIdentity.signingKeyType}): ${verifierIdentity.address}\n`
  )
  await utils.waitForEnter('✅ Identities created! Press Enter to continue')

  // Step 2: Add new Schemas
  console.log(`\n\n✉️  Adding an Institute Schema \n`)
  let newInstituteSchemaContent = require('../res/institute.json')
  let newSchemaName = newInstituteSchemaContent.name + ':' + UUID.generate()
  newInstituteSchemaContent.name = newSchemaName

  let newInstituteSchema = cord.Schema.fromSchemaProperties(
    newInstituteSchemaContent,
    accrediatorIdentity.address
  )

  let bytes = json.encode(newInstituteSchema)
  let encoded_hash = await hasher.digest(bytes)
  // const schemaCid = CID.create(1, 0xb220, encoded_hash)
  const schemaCid = CID.create(1, 0xb220, encoded_hash)

  let instituteSchemaCreationExtrinsic = await newInstituteSchema.store(
    schemaCid.toString()
  )
  let new_bytes = json.encode(newInstituteSchema.schema)
  let new_encoded_hash = await hasher.digest(new_bytes)
  console.log(new_encoded_hash)

  const checkSchemaCid = CID.create(1, 0xb220, new_encoded_hash)

  console.log(`📧 Schema Details `)
  console.log(`📧 Schema ID - ${checkSchemaCid}`)

  console.dir(newInstituteSchema, { depth: null, colors: true })
  console.log('\n⛓  Anchoring Institute Schema to the chain...')
  console.log(`🔑 Creator: ${accrediatorIdentity.address} `)
  console.log(`🔑 Controller: ${authorIdentity.address} `)

  try {
    await cord.ChainUtils.signAndSubmitTx(
      instituteSchemaCreationExtrinsic,
      authorIdentity,
      {
        resolveOn: cord.ChainUtils.IS_IN_BLOCK,
      }
    )
    console.log('✅ Institute Schema anchored!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  console.log(`\n\n✉️  Adding a Certificate Schema \n`)
  let newCertificateSchemaContent = require('../res/certificate.json')
  let newCertificateName =
    newCertificateSchemaContent.name + ':' + UUID.generate()
  newCertificateSchemaContent.name = newCertificateName

  let newCertificateSchema = cord.Schema.fromSchemaProperties(
    newCertificateSchemaContent,
    accrediatorIdentity.address
  )

  let cert_bytes = json.encode(newCertificateSchema)
  let cert_encoded_hash = await hasher.digest(cert_bytes)
  const certSchemaCid = CID.create(1, 0xb220, cert_encoded_hash)

  let certSchemaCreationExtrinsic = await newCertificateSchema.store(
    certSchemaCid.toString()
  )

  console.log(`📧 Certificate Schema Details `)
  console.dir(newCertificateSchema, { depth: null, colors: true })
  console.log('\n⛓  Anchoring Certificate Schema to the chain...')
  console.log(`🔑 Creator: ${accrediatorIdentity.address} `)
  console.log(`🔑 Controller: ${authorIdentity.address} `)

  try {
    await cord.ChainUtils.signAndSubmitTx(
      certSchemaCreationExtrinsic,
      authorIdentity,
      {
        resolveOn: cord.ChainUtils.IS_IN_BLOCK,
      }
    )
    console.log('✅ Certificate Schema anchored!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  console.log(`\n\n✉️  Adding a Student Identity Schema \n`)
  let newIdentitySchemaContent = require('../res/student-id.json')
  let newIdentityName = newIdentitySchemaContent.name + ':' + UUID.generate()
  newIdentitySchemaContent.name = newIdentityName

  let newIdentitySchema = cord.Schema.fromSchemaProperties(
    newIdentitySchemaContent,
    accrediatorIdentity.address
  )

  let id_bytes = json.encode(newIdentitySchema)
  let id_encoded_hash = await hasher.digest(id_bytes)
  const idSchemaCid = CID.create(1, 0xb220, id_encoded_hash)

  let idSchemaCreationExtrinsic = await newIdentitySchema.store(
    idSchemaCid.toString()
  )

  console.log(`📧 Student Identity Schema Details `)
  console.dir(newIdentitySchema, { depth: null, colors: true })
  console.log('\n⛓  Anchoring Student Identity Schema to the chain...')
  console.log(`🔑 Creator: ${accrediatorIdentity.address} `)
  console.log(`🔑 Controller: ${authorIdentity.address} `)

  try {
    await cord.ChainUtils.signAndSubmitTx(
      idSchemaCreationExtrinsic,
      authorIdentity,
      {
        resolveOn: cord.ChainUtils.IS_IN_BLOCK,
      }
    )
    console.log('✅ Student Identity Schema anchored!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }
  await utils.waitForEnter('✅ All Schemas anchored! Press Enter to continue')

  // Step 3: Create Accrediation Credential
  console.log(`\n✉️  Issuing a new Accrediation Credential`, '\n')
  let accredStream = {
    instituteId: UUID.generate(),
    instituteName: 'ABCD Skills University',
    establishmentYear: '2009-06-13',
    gstnId: 'AHSFGT12367KJ',
    category: 'University',
    cgpaGrade: 'A++',
    issuerName: 'National Assessment and Accreditation Council',
    issuedOn: '2021-06-13',
    validUntil: '2021-06-12',
  }

  let acccredStreamContent = cord.Content.fromSchemaAndContent(
    newInstituteSchema,
    accredStream,
    accrediatorIdentity.address
  )

  let accredContentStream = cord.ContentStream.fromStreamContent(
    acccredStreamContent,
    accrediatorIdentity,
    {
      holder: holderIdentity.address,
    }
  )
  console.log(`\n📧 Hashed  Accrediation Stream Details`)
  console.dir(accredContentStream, { depth: null, colors: true })

  bytes = json.encode(accredContentStream)
  encoded_hash = await hasher.digest(bytes)
  const accredStreamCid = CID.create(1, 0xb220, encoded_hash)

  let accredStreamTx = cord.Stream.fromContentStreamProperties(
    accredContentStream,
    accredStreamCid.toString()
  )

  let accredStreamCreationExtrinsic = await accredStreamTx.store()
  console.log(`\n📧 Accrediation Credential On-Chain Details`)
  console.dir(accredStreamTx, { depth: null, colors: true })

  try {
    await cord.ChainUtils.signAndSubmitTx(
      accredStreamCreationExtrinsic,
      authorIdentity,
      {
        resolveOn: cord.ChainUtils.IS_IN_BLOCK,
      }
    )
    await utils.waitForEnter(
      '✅ Accrediation Credential Anchored! Press Enter to continue'
    )
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  // Step 4: Delegate Schemas
  console.log(`\n\n✉️  Adding Schema Delegations`)
  let identitySchemaDelegateExtrinsic = await newIdentitySchema.add_delegate(
    instituteOneIdentity.address
  )

  console.log(`\n📧 Identity Schema Delegation `)
  try {
    await cord.ChainUtils.signAndSubmitTx(
      identitySchemaDelegateExtrinsic,
      accrediatorIdentity,
      {
        resolveOn: cord.ChainUtils.IS_IN_BLOCK,
      }
    )
    console.log(`✅ Schema Delegation added: ${instituteOneIdentity.address}`)
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  let certSchemaDelegateExtrinsic = await newCertificateSchema.add_delegate(
    instituteOneIdentity.address
  )

  console.log(`📧 Certificate Schema Delegation `)
  try {
    await cord.ChainUtils.signAndSubmitTx(
      certSchemaDelegateExtrinsic,
      accrediatorIdentity,
      {
        resolveOn: cord.ChainUtils.IS_IN_BLOCK,
      }
    )
    console.log(
      `✅ Certificate Delegation added: ${instituteOneIdentity.address}`
    )
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  await utils.waitForEnter('✅ All Schemas delegated! Press Enter to continue')

  // Step 5: Create a Student Identity Credential
  console.log(`\n✉️  Issuing a new Student Identity Credential`, '\n')
  let studenIdStream = {
    studentId: UUID.generate(),
    fullName: 'Ashok Kumar',
    gender: 'Male',
    dob: '2000-06-10',
    batch: 'Mechanical Engineering',
    email: 'ashok@demo.org',
    mobile: 9890123321,
    address: 'A-124',
    street: 'M G Road',
    landmark: 'Near XYZ School',
    district: 'Bangalore',
    state: 'Karnataka',
    pincode: 560100,
    issuerName: 'ABCD Skills University',
    validUntil: '2022-07-31',
  }

  let studenIdStreamContent = cord.Content.fromSchemaAndContent(
    newIdentitySchema,
    studenIdStream,
    instituteOneIdentity.address
  )

  let studentIdContentStream = cord.ContentStream.fromStreamContent(
    studenIdStreamContent,
    instituteOneIdentity,
    {
      holder: holderIdentity.address,
      link: accredStreamTx.id,
    }
  )
  console.log(`\n📧 Hashed Student Identity Stream Details`)
  console.dir(studentIdContentStream, { depth: null, colors: true })

  bytes = json.encode(studentIdContentStream)
  encoded_hash = await hasher.digest(bytes)
  const studentIdStreamCid = CID.create(1, 0xb220, encoded_hash)

  let studentIdStreamTx = cord.Stream.fromContentStreamProperties(
    studentIdContentStream,
    studentIdStreamCid.toString()
  )

  let studentIdStreamCreationExtrinsic = await studentIdStreamTx.store()
  console.log(`\n📧 Student Identity Credential On-Chain Details`)
  console.dir(studentIdStreamTx, { depth: null, colors: true })

  try {
    await cord.ChainUtils.signAndSubmitTx(
      studentIdStreamCreationExtrinsic,
      authorIdentity,
      {
        resolveOn: cord.ChainUtils.IS_IN_BLOCK,
      }
    )
    await utils.waitForEnter(
      '✅ Student Identity Credential Anchored! Press Enter to continue'
    )
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  // Step 5: Create a Student Credential
  console.log(`\n✉️  Issuing a new Student Completion Credential`, '\n')
  let certificateStream = {
    certificateId: UUID.generate(),
    studentId: studentIdContentStream.content.contents.studentId,
    studentName: studentIdContentStream.content.contents.fullName,
    issuerName: accredContentStream.content.contents.instituteName,
    credential: 'Course Completion Certificate',
    grade: 'A+',
    batch: '2017 - 2021',
    issuedOn: '2021-07-31',
  }

  let linkProof: cord.Credential
  linkProof = cord.Credential.fromStreamProperties(
    accredContentStream,
    accredStreamTx
  )

  console.log(`\n📧 Link Proof Details`)
  console.dir(linkProof, { depth: null, colors: true })

  let certStreamContent = cord.Content.fromSchemaAndContent(
    newCertificateSchema,
    certificateStream,
    instituteOneIdentity.address
  )

  let certContentStream = cord.ContentStream.fromStreamContent(
    certStreamContent,
    instituteOneIdentity,
    {
      holder: holderIdentity.address,
      link: accredStreamTx.id,
      proofs: [linkProof],
    }
  )
  console.log(`\n📧 Hashed Course Completion Stream Details`)
  console.dir(certContentStream, { depth: null, colors: true })

  bytes = json.encode(certContentStream)
  encoded_hash = await hasher.digest(bytes)
  const certStreamCid = CID.create(1, 0xb220, encoded_hash)

  let certStreamTx = cord.Stream.fromContentStreamProperties(
    certContentStream,
    certStreamCid.toString()
  )

  let certStreamCreationExtrinsic = await certStreamTx.store()
  console.log(`\n📧 Course Completion Credential On-Chain Details`)
  console.dir(certStreamTx, { depth: null, colors: true })

  try {
    await cord.ChainUtils.signAndSubmitTx(
      certStreamCreationExtrinsic,
      authorIdentity,
      {
        resolveOn: cord.ChainUtils.IS_IN_BLOCK,
      }
    )
    await utils.waitForEnter(
      '✅ Course Completion Credential Anchored! Press Enter to continue'
    )
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  // Step 6: Institution Two creating a Student Credential - Should Fail
  console.log(
    `\n✉️  Institute Two Issuing a new Student Completion Credential`,
    '\n'
  )

  let newCertificateStream = {
    certificateId: UUID.generate(),
    studentId: studentIdContentStream.content.contents.studentId,
    studentName: studentIdContentStream.content.contents.fullName,
    issuerName: accredContentStream.content.contents.instituteName,
    credential: 'Course Completion Certificate',
    grade: 'A+',
    batch: '2017 - 2021',
    issuedOn: '2021-07-31',
  }

  let newCertStreamContent = cord.Content.fromSchemaAndContent(
    newCertificateSchema,
    newCertificateStream,
    instituteTwoIdentity.address
  )

  let newCertContentStream = cord.ContentStream.fromStreamContent(
    newCertStreamContent,
    instituteTwoIdentity,
    {
      holder: holderIdentity.address,
      link: accredStreamTx.id,
    }
  )
  console.log(`\n📧 Hashed Course Completion Stream Details`)
  console.dir(newCertContentStream, { depth: null, colors: true })

  bytes = json.encode(newCertContentStream)
  encoded_hash = await hasher.digest(bytes)
  const newCertStreamCid = CID.create(1, 0xb220, encoded_hash)

  let newCertStreamTx = cord.Stream.fromContentStreamProperties(
    newCertContentStream,
    newCertStreamCid.toString()
  )

  let newCertStreamCreationExtrinsic = await newCertStreamTx.store()
  console.log(`\n📧 Course Completion Credential On-Chain Details`)
  console.dir(newCertStreamTx, { depth: null, colors: true })

  try {
    await cord.ChainUtils.signAndSubmitTx(
      newCertStreamCreationExtrinsic,
      authorIdentity,
      {
        resolveOn: cord.ChainUtils.IS_IN_BLOCK,
      }
    )
    console.log('✅ Course Completion Credential Anchored!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }
  await utils.waitForEnter(
    '❌  Error generated, as expected! Press Enter to continue'
  )

  //  Step 7: Credential exchange via messaging
  console.log(`\n\n📩 Credential Exchange - Selective Disclosure (Verifier)`)
  console.log(`🔑 Verifier Address: ${verifierIdentity.address}`)
  const purpose = 'Employment Application'
  const validUntil = Date.now() + 864000000
  const relatedData = false
  const { session, message: message } =
    cord.Exchange.Request.newRequestBuilder()
      .requestPresentation({
        schemaId: newCertificateSchema.id,
        properties: ['studentName', 'credential', 'grade', 'issuerName'],
      })
      .finalize(
        purpose,
        verifierIdentity,
        holderIdentity.getPublicIdentity(),
        validUntil,
        relatedData
      )

  console.log(`\n📧 Selective Disclosure Request`)
  console.dir(message, { depth: null, colors: true })

  await utils.waitForEnter('✅  Press Enter to continue')

  let credential: cord.Credential
  credential = cord.Credential.fromStreamProperties(
    certContentStream,
    certStreamTx
  )
  const presentation = cord.Exchange.Share.createPresentation(
    holderIdentity,
    message,
    verifierIdentity.getPublicIdentity(),
    [credential],
    {
      showAttributes: message.body.content[0].requiredProperties,
      signer: holderIdentity,
      request: message.body.request,
    }
  )

  console.log(`\n📧 Received Credential `)
  console.dir(presentation, { depth: null, colors: true })
  await utils.waitForEnter('✅  Press Enter to continue')

  const { verified } = await cord.Exchange.Verify.verifyPresentation(
    presentation,
    session
  )

  console.log('🔍 All valid? ', verified)

  await utils.waitForEnter('\n⏎ Press Enter to continue..')
}
main()
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(cord.disconnect)

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  cord.disconnect()
  process.exit(0)
})
