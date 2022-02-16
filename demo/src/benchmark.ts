import * as cord from '@cord.network/api'
import { UUID } from '@cord.network/utils'
// import * as utils from './utils'
import * as json from 'multiformats/codecs/json'
import { blake2b256 as hasher } from '@multiformats/blake2/blake2b'
import { CID } from 'multiformats/cid'

function get_time_diff(startTime: Date, endTime: any) {
  var elHour = 0,
    elMin = 0,
    elSec = 0,
    elMsec = 0

  if (endTime.getHours() >= startTime.getHours()) {
    elHour = endTime.getHours() - startTime.getHours()
  } else {
    elHour = 0
  }
  if (endTime.getMinutes() >= startTime.getMinutes()) {
    elMin = endTime.getMinutes() - startTime.getMinutes()
  } else {
    elMin = startTime.getMinutes() - endTime.getMinutes()
  }
  if (endTime.getSeconds() >= startTime.getSeconds()) {
    elSec = endTime.getSeconds() - startTime.getSeconds()
  } else {
    elSec = startTime.getSeconds() - endTime.getSeconds()
  }
  if (endTime.getMilliseconds() >= startTime.getMilliseconds()) {
    elMsec = endTime.getMilliseconds() - startTime.getMilliseconds()
  } else {
    elMsec = startTime.getMilliseconds() - endTime.getMilliseconds()
  }
  // var elSec: number = endTime.getSeconds() - startTime.getSeconds()
  // var elMsec: number = endTime.getMilliseconds() - startTime.getMilliseconds()

  return (
    elHour +
    ' Hours ' +
    elMin +
    ' Minutes ' +
    elSec +
    ' Seconds ' +
    elMsec +
    ' Milliseconds'
  )
}

async function main() {
  await cord.init({ address: 'ws://127.0.0.1:9944' })
  cord.Balance.makeTransfer
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
  const holderIdentity = cord.Identity.buildFromURI('//Student', {
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
    `🔑 Student (holder) Address (${holderIdentity.signingKeyType}): ${holderIdentity.address}`
  )

  console.log(`\n\n✉️  Adding a Certificate Schema \n`)
  let newCertificateSchemaContent = require('../res/certificate-bm.json')

  let newCertificateSchema = cord.Schema.fromSchemaProperties(
    newCertificateSchemaContent,
    accrediatorIdentity.address,
    false
  )
  // let cert_bytes = json.encode(newCertificateSchema)
  // let cert_encoded_hash = await hasher.digest(cert_bytes)
  // const certSchemaCid = CID.create(1, 0xb220, cert_encoded_hash)

  // let certSchemaCreationExtrinsic = await newCertificateSchema.store(
  //   certSchemaCid.toString()
  // )

  // try {
  //   await cord.ChainUtils.signAndSubmitTx(
  //     certSchemaCreationExtrinsic,
  //     authorIdentity,
  //     {
  //       resolveOn: cord.ChainUtils.IS_IN_BLOCK,
  //     }
  //   )
  console.log('✅ Certificate Schema anchored!')
  // } catch (e: any) {
  //   console.log(e.errorCode, '-', e.message)
  // }
  // await utils.waitForEnter('✅ Setup Complete! Press Enter to continue \n')

  // Step 5: Create a Student Credential
  // let initialTime = new Date()

  let tx_batch = []
  let credentials = 1000
  let startPrep = new Date()
  for (let i = 0; i <= credentials; i++) {
    process.stdout.write(
      '✉️  Preparing ' + i + '/' + credentials + ' Credentials\r'
    )
    let certificateStream = {
      certificateId: UUID.generate(),
      studentId: UUID.generate(),
      studentName: 'Ashok Kumar',
      issuerName: 'ABCD Skills University',
      credential: 'Course Completion Certificate',
      grade: 'A+',
      batch: '2017 - 2021',
      issuedOn: '2021-07-31',
    }

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
      }
    )

    let bytes = json.encode(certContentStream)
    let encoded_hash = await hasher.digest(bytes)
    const certStreamCid = CID.create(1, 0xb220, encoded_hash)

    let certStreamTx = cord.Stream.fromContentStreamProperties(
      certContentStream,
      certStreamCid.toString()
    )

    let certStreamCreationExtrinsic = await certStreamTx.store()
    tx_batch.push(certStreamCreationExtrinsic)
  }
  let prepEndTime = new Date()
  let prepTime = get_time_diff(startPrep, prepEndTime)
  console.log(`\nTook ${prepTime} \n `)

  // console.log('\n')

  let txStartTime = new Date()
  for (let tx_extrinsic = 0; tx_extrinsic < tx_batch.length; tx_extrinsic++) {
    try {
      await cord.ChainUtils.signAndSubmitTx(
        tx_batch[tx_extrinsic],
        authorIdentity,
        {
          resolveOn: cord.ChainUtils.IS_READY,
        }
      )
    } catch (e: any) {
      console.log(e.errorCode, '-', e.message)
    }
    process.stdout.write(
      '⛓  Anchoring ' + tx_extrinsic + '/' + credentials + ' Credential\r'
    )
  }
  let txEndTime = new Date()
  let txTime = get_time_diff(txStartTime, txEndTime)
  console.log(`\nTook ${txTime} `)

  let milisec_diff = txEndTime.getTime() - txStartTime.getTime()
  let tps = credentials / (milisec_diff / 1000)

  console.log(`\nTPS ${tps}`)
}

main()
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(cord.disconnect)

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  cord.disconnect()
  process.exit(0)
})
