import * as cord from '@cord.network/api'
import { Crypto, UUID } from '@cord.network/utils'
import * as utils from './utils'
import * as json from 'multiformats/codecs/json'
import { blake2b256 as hasher } from '@multiformats/blake2/blake2b'
import { CID } from 'multiformats/cid'

async function main() {
  await cord.init({ address: 'ws://127.0.0.1:9944' })

  // Step 1: Setup Org Identity
  console.log(`\n🏛  Creating Identities\n`)
  //3x4DHc1rxVAEqKWSx1DAAA8wZxLB4VhiRbMV997niBckUwSi
  const networkAuthor = cord.Identity.buildFromURI('//Alice', {
    signingKeyPairType: 'sr25519',
  })
  const productOwner = cord.Identity.buildFromURI('//Bob', {
    signingKeyPairType: 'sr25519',
  })
  const sellerOne = cord.Identity.buildFromURI('//SellerOne', {
    signingKeyPairType: 'sr25519',
  })
  const sellerTwo = cord.Identity.buildFromURI('//SellerTwo', {
    signingKeyPairType: 'sr25519',
  })
  const buyerOne = cord.Identity.buildFromURI('//BuyerOne', {
    signingKeyPairType: 'sr25519',
  })

  console.log(
    `🔑 Network Author Address (${networkAuthor.signingKeyType}): ${networkAuthor.address}`
  )
  console.log(
    `🔑 Product Controller Address (${productOwner.signingKeyType}): ${productOwner.address}`
  )
  console.log(
    `🔑 Seller One Address (${sellerOne.signingKeyType}): ${sellerOne.address}`
  )
  console.log(
    `🔑 Seller Two Address (${sellerTwo.signingKeyType}): ${sellerTwo.address}`
  )
  console.log(
    `🔑 Buyer One Address (${buyerOne.signingKeyType}): ${buyerOne.address}\n`
  )
  console.log('✅ Identities created!')

  // Step 2: Setup a new Product Schema
  console.log(`\n\n✉️  Adding a new Product Schema \n`)
  let newProdSchemaContent = require('../res/prod-schema.json')
  let newProdSchemaName = newProdSchemaContent.name + ':' + UUID.generate()
  newProdSchemaContent.name = newProdSchemaName

  let newProductSchema = cord.Schema.fromSchemaProperties(
    newProdSchemaContent,
    productOwner.address
  )

  let bytes = json.encode(newProductSchema)
  let encoded_hash = await hasher.digest(bytes)
  const schemaCid = CID.create(1, 0xb220, encoded_hash)

  let productSchemaCreationExtrinsic = await newProductSchema.store(
    schemaCid.toString()
  )
  console.log(`📧 Schema Details `)
  console.dir(newProductSchema, { depth: null, colors: true })
  console.log(`CID: `, schemaCid.toString())
  console.log('\n⛓  Anchoring Schema to the chain...')
  console.log(`🔑 Controller: ${productOwner.address} `)

  try {
    await cord.ChainUtils.signAndSubmitTx(
      productSchemaCreationExtrinsic,
      productOwner,
      {
        resolveOn: cord.ChainUtils.IS_READY,
      }
    )
    console.log('✅ Schema created!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  let productSchemaDelegateExtrinsic = await newProductSchema.add_delegate(
    sellerOne.address
  )

  console.log(`📧 Schema Delegation `)
  try {
    await cord.ChainUtils.signAndSubmitTx(
      productSchemaDelegateExtrinsic,
      productOwner,
      {
        resolveOn: cord.ChainUtils.IS_READY,
      }
    )
    console.log('✅ Schema Delegation added: ${sellerOne.address}')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  // Step 2: Setup a new Product
  console.log(`\n✉️  Listening to new Product Additions`, '\n')
  let content = {
    name: 'Sony OLED 55 Inch Television',
    description: 'Best Television in the World',
    countryOfOrigin: 'India',
    gtin: UUID.generate(),
    brand: 'Sony OLED',
    manufacturer: 'Sony',
    model: '2022',
    sku: UUID.generate(),
  }

  let productStream = cord.Content.fromSchemaAndContent(
    newProductSchema,
    content,
    productOwner.address
  )
  console.log(`📧 Product Details `)
  console.dir(productStream, { depth: null, colors: true })

  let newProductContent = cord.ContentStream.fromStreamContent(
    productStream,
    productOwner
  )
  console.log(`\n📧 Hashed Product Stream `)
  console.dir(newProductContent, { depth: null, colors: true })

  bytes = json.encode(newProductContent)
  encoded_hash = await hasher.digest(bytes)
  const streamCid = CID.create(1, 0xb220, encoded_hash)

  let newProduct = cord.Product.fromProductContentAnchor(
    newProductContent,
    streamCid.toString()
  )

  let productCreationExtrinsic = await newProduct.create()

  console.log(`\n📧 Stream On-Chain Details`)
  console.dir(newProduct, { depth: null, colors: true })

  console.log('\n⛓  Anchoring Product to the chain...')
  console.log(`🔑 Controller: ${productOwner.address} `)

  try {
    await cord.ChainUtils.signAndSubmitTx(
      productCreationExtrinsic,
      productOwner,
      {
        resolveOn: cord.ChainUtils.IS_IN_BLOCK,
      }
    )
    console.log(`✅ New Product (${newProduct.id}) added! `)
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  // Step 2: Create a new Product Schema
  console.log(`\n\n✉️  Listening to Product Listings \n`)
  let store_name = 'ABC Store'
  let price = 135000

  let listStream = cord.Content.fromSchemaAndContent(
    newProductSchema,
    productStream.contents,
    sellerOne.address
  )
  console.log(`📧 Product Listing Details `)
  console.dir(productStream, { depth: null, colors: true })

  let newListingContent = cord.ContentStream.fromStreamContent(
    listStream,
    sellerOne,
    {
      link: newProduct.id,
    }
  )
  console.log(`\n📧 Hashed Product Stream `)
  console.dir(newListingContent, { depth: null, colors: true })

  bytes = json.encode(newListingContent)
  encoded_hash = await hasher.digest(bytes)
  const listCid = CID.create(1, 0xb220, encoded_hash)
  const storeVal = {
    store: store_name,
    seller: sellerOne.address,
  }
  const storeId = Crypto.hashObjectAsStr(storeVal)

  let newListing = cord.Product.fromProductContentAnchor(
    newListingContent,
    listCid.toString(),
    storeId.toString(),
    price
  )

  let listingCreationExtrinsic = await newListing.list()

  console.log(`\n📧 Listing On-Chain Details`)
  console.dir(newListing, { depth: null, colors: true })
  console.log('\n⛓  Anchoring Product Lisiting Event to the chain...')
  console.log(`🔑 Controller: ${sellerOne.address} `)

  try {
    await cord.ChainUtils.signAndSubmitTx(
      listingCreationExtrinsic,
      networkAuthor,
      {
        resolveOn: cord.ChainUtils.IS_READY,
      }
    )
    console.log(`✅ Listing (${newListing.id}) created! `)
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

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
