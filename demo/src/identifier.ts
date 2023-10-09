import * as Cord from '@cord.network/sdk'
import { UUID } from '@cord.network/utils'
import type { HexString } from '@polkadot/util/types'

import { base58Decode, base58Encode, blake2AsU8a } from '@polkadot/util-crypto'
import {
  assert,
  u8aConcat,
  u8aToU8a,
  stringToU8a,
  isU8a,
  isHex,
} from '@polkadot/util'

export const defaults = {
  allowedDecodedLengths: [1, 2, 4, 8, 32, 33],
  // publicKey has prefix + 2 checksum bytes, short only prefix + 1 checksum byte
  allowedEncodedLengths: [3, 4, 6, 10, 35, 36, 37, 38],
}

const SS58_PREFIX = stringToU8a('CIDPRE')

export function pphash(key: Uint8Array): Uint8Array {
  return blake2AsU8a(u8aConcat(SS58_PREFIX, key), 512)
}

export function checkAddressChecksum(
  decoded: Uint8Array
): [boolean, number, number, number] {
  const ss58Length = decoded[0] & 0b0100_0000 ? 2 : 1
  const ss58Decoded =
    ss58Length === 1
      ? decoded[0]
      : ((decoded[0] & 0b0011_1111) << 2) |
        (decoded[1] >> 6) |
        ((decoded[1] & 0b0011_1111) << 8)

  // 32/33 bytes public + 2 bytes checksum + prefix
  const isPublicKey = [34 + ss58Length, 35 + ss58Length].includes(
    decoded.length
  )
  const length = decoded.length - (isPublicKey ? 2 : 1)

  // calculate the hash and do the checksum byte checks
  const hash = pphash(decoded.subarray(0, length))
  const isValid =
    (decoded[0] & 0b1000_0000) === 0 &&
    ![46, 47].includes(decoded[0]) &&
    (isPublicKey
      ? decoded[decoded.length - 2] === hash[0] &&
        decoded[decoded.length - 1] === hash[1]
      : decoded[decoded.length - 1] === hash[0])

  return [isValid, length, ss58Length, ss58Decoded]
}

export function encodeIdentifier(
  key: HexString | Uint8Array | string,
  ss58Format: number
): string {
  // decode it, this means we can re-encode an address
  const u8a = u8aToU8a(key)

  assert(
    ss58Format >= 0 && ss58Format <= 16383 && ![46, 47].includes(ss58Format),
    'Out of range ss58Format specified'
  )
  assert(
    defaults.allowedDecodedLengths.includes(u8a.length),
    () =>
      `Expected a valid key to convert, with length ${defaults.allowedDecodedLengths.join(
        ', '
      )}`
  )

  const input = u8aConcat(
    ss58Format < 64
      ? [ss58Format]
      : [
          ((ss58Format & 0b0000_0000_1111_1100) >> 2) | 0b0100_0000,
          (ss58Format >> 8) | ((ss58Format & 0b0000_0000_0000_0011) << 6),
        ],
    u8a
  )

  return base58Encode(
    u8aConcat(
      input,
      pphash(input).subarray(0, [32, 33].includes(u8a.length) ? 2 : 1)
    )
  )
}

export function decodeIdentifier(
  encoded?: HexString | string | Uint8Array | null,
  ignoreChecksum?: boolean,
  ss58Format: number = -1
): Uint8Array {
  assert(encoded, 'Invalid empty address passed')

  if (isU8a(encoded) || isHex(encoded)) {
    return u8aToU8a(encoded)
  }

  try {
    const decoded = base58Decode(encoded)

    assert(
      defaults.allowedEncodedLengths.includes(decoded.length),
      'Invalid decoded address length'
    )

    const [isValid, endPos, ss58Length, ss58Decoded] =
      checkAddressChecksum(decoded)

    assert(ignoreChecksum || isValid, 'Invalid decoded address checksum')
    assert(
      [-1, ss58Decoded].includes(ss58Format),
      () => `Expected ss58Format ${ss58Format}, received ${ss58Decoded}`
    )

    return decoded.slice(ss58Length, endPos)
  } catch (error) {
    throw new Error(`Decoding ${encoded}: ${(error as Error).message}`)
  }
}

async function main() {
  await Cord.init({ address: 'ws://127.0.0.1:9944' })

  // Step 1: Setup Org Identity
  console.log(`\n🏛  Creating Identities\n`)
  //3x4DHc1rxVAEqKWSx1DAAA8wZxLB4VhiRbMV997niBckUwSi
  const entityIdentity = Cord.Identity.buildFromURI('//Bob', {
    signingKeyPairType: 'sr25519',
  })
  const employeeIdentity = Cord.Identity.buildFromURI('//Dave', {
    signingKeyPairType: 'ed25519',
  })
  const holderIdentity = Cord.Identity.buildFromURI('//Alice', {
    signingKeyPairType: 'sr25519',
  })
  const verifierIdentity = Cord.Identity.buildFromURI('//Charlie', {
    signingKeyPairType: 'ed25519',
  })
  console.log(
    `🔑 Entity Controller Address (${entityIdentity.signingKeyType}): ${entityIdentity.address}`
  )
  console.log(
    `🔑 Employee Address (${employeeIdentity.signingKeyType}): ${employeeIdentity.address}`
  )
  console.log(
    `🔑 Holder Org Address (${holderIdentity.signingKeyType}): ${holderIdentity.address}`
  )
  console.log(
    `🔑 Verifier Org Address (${verifierIdentity.signingKeyType}): ${verifierIdentity.address}\n`
  )
  console.log('✅ Identities created!')

  // Step 2: Create a new Schema
  console.log(`\n\n✉️  Adding a new Schema \n`)
  let newSchemaContent = require('../res/schema.json')
  let newSchemaTitle = newSchemaContent.title + ':' + UUID.generate()
  newSchemaContent.title = newSchemaTitle

  let newSchema = Cord.Schema.fromSchemaProperties(
    newSchemaContent,
    employeeIdentity
  )

  let schemaCreationExtrinsic = await Cord.Schema.create(newSchema)

  // console.log('DerivED ', encodeIdentifier(newSchema.hash, 29))
  // console.log(
  //   'DerivED ',
  //   u8aToHex(decodeIdentifier(encodeIdentifier(newSchema.hash, 29)))
  // )

  // let schemaEncodedHash = base32Encode(newSchema.hash, true)
  // console.log('base58:', schemaEncodedHash)
  // console.log(
  //   'base58 Decode:',
  //   Cord.StatementUtils.hexToString(schemaEncodedHash),
  //   schemaEncodedHash
  // )
  // // console.log(encodeDerivedAddress(newSchema.hash, 1031))

  console.log(`📧 Schema Details `)
  console.dir(newSchema, { depth: null, colors: true })
  console.log('\n⛓  Anchoring Schema to the chain...')
  console.log(`🔑 Creator: ${employeeIdentity.address} `)
  console.log(`🔑 Controller: ${entityIdentity.address} `)
  console.dir(schemaCreationExtrinsic, { depth: null, colors: true })
}
main()
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(Cord.disconnect)

// process.on('SIGINT', async () => {
//   console.log('\nBye! 👋 👋 👋 \n')
//   Cord.disconnect()
//   process.exit(0)
// })
