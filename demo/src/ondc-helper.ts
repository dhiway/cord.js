import * as cord from '@cord.network/api'
import { Crypto, UUID } from '@cord.network/utils'
import * as json from 'multiformats/codecs/json'
import { blake2b256 as hasher } from '@multiformats/blake2/blake2b'
import { CID } from 'multiformats/cid'

const NUMBER_OF_ORDERS = 8
const NUMBER_OF_RATING = 5

function between(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

export async function createIdentities() {

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
    return { networkAuthor, productOwner, sellerOne, sellerTwo, buyerOne }
}


export async function registerProducts(id: any) {
    
    console.log(`\n\n✉️  Adding a new Product Schema \n`)
    let newProdSchemaContent = require('../res/prod-schema.json')
    let newProdSchemaName = newProdSchemaContent.name + ':' + UUID.generate()
    newProdSchemaContent.name = newProdSchemaName

    let newProductSchema = cord.Schema.fromSchemaProperties(
	newProdSchemaContent,
	id.productOwner!.address
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
    console.log(`🔑 Controller: ${id.productOwner!.address} `)

    try {
	await cord.ChainUtils.signAndSubmitTx(
	    productSchemaCreationExtrinsic,
	    id.productOwner!,
	    {
		resolveOn: cord.ChainUtils.IS_READY,
	    }
	)
	console.log('✅ Schema created!')
    } catch (e: any) {
	console.log(e.errorCode, '-', e.message)
    }

    let productSchemaDelegateExtrinsic = await newProductSchema.add_delegate(
	id.sellerOne!.address
    )

    console.log(`📧 Schema Delegation `)
    try {
	await cord.ChainUtils.signAndSubmitTx(
	    productSchemaDelegateExtrinsic,
	    id.productOwner!,
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
    let products: any = [];
    for (let i = 0; i < 10 ; i++) {
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
	    id.productOwner!.address
	)
	console.log(`📧 Product Details `)
	console.dir(productStream, { depth: null, colors: true })

	let newProductContent = cord.ContentStream.fromStreamContent(
	    productStream,
	    id.productOwner!
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
	console.log(`🔑 Controller: ${id.productOwner!.address} `)

	try {
	    await cord.ChainUtils.signAndSubmitTx(
		productCreationExtrinsic,
		id.productOwner!,
		{
		    resolveOn: cord.ChainUtils.IS_IN_BLOCK,
		}
	    )
	} catch (e: any) {
	    console.log(e.errorCode, '-', e.message)
	}
	products.push({
	    product: newProduct,
	    prodContent: content,
	    schema: newProductSchema,
	    stream: productStream,
	})
    }
    return { products, schema: newProductSchema};
}

export async function addProductListing(id: any, schema: any, products: any) {
    let listings: any = [];
    console.log(`\n\n✉️  Listening to Product Listings \n`)
    let store_name = 'ABC Store'
    let price = 135000
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
	let listStream = cord.Content.fromSchemaAndContent(
	    schema,
	    product.stream!.contents,
	    id.sellerOne!.address
	)
	console.log(`📧 Product Listing Details `)
	console.dir(product.stream!, { depth: null, colors: true })

	let newListingContent = cord.ContentStream.fromStreamContent(
	    listStream,
	    id.sellerOne!,
	    {
		link: product.product!.id!,
	    }
	)
	console.log(`\n📧 Hashed Product Stream `)
	console.dir(newListingContent, { depth: null, colors: true })

	let bytes = json.encode(newListingContent)
	let encoded_hash = await hasher.digest(bytes)
	const listCid = CID.create(1, 0xb220, encoded_hash)
	const storeVal = {
	    store: store_name,
	    seller: id.sellerOne!.address,
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
	console.log(`🔑 Controller: ${id.sellerOne!.address} `)

	try {
	    await cord.ChainUtils.signAndSubmitTx(
		listingCreationExtrinsic,
		id.networkAuthor!,
		{
		    resolveOn: cord.ChainUtils.IS_READY,
		}
	    )
	} catch (e: any) {
	    console.log(e.errorCode, '-', e.message)
	}

	listings.push({ listing: newListing, product: product });
    }

    return listings;
}

export async function placeOrder(id: any, schema: any, listings: any) {
    let orders: any = []
    let price = 135000
    console.log(`\n\n✉️  Listening to Product Orders \n`)

    for (let i = 0; i < NUMBER_OF_ORDERS; i++) {
	let inventory = listings[between(0, listings.length)];
	let orderStream = cord.Content.fromSchemaAndContent(
	    schema,
	    inventory.product!.stream!.contents,
	    id.buyerOne!.address
	)
	console.log(`📧 Product Order Details `)
	console.dir(orderStream, { depth: null, colors: true })

	let newOrderContent = cord.ContentStream.fromStreamContent(
	    orderStream,
	    id.buyerOne!,
	    {
		link: inventory.listing!.id,
	    }
	)
	console.log(`\n📧 Hashed Order Stream `)
	console.dir(newOrderContent, { depth: null, colors: true })

	let bytes = json.encode(newOrderContent)
	let encoded_hash = await hasher.digest(bytes)
	const orderCid = CID.create(1, 0xb220, encoded_hash)

	let newOrder = cord.Product.fromProductContentAnchor(
	    newOrderContent,
	    orderCid.toString(),
	    inventory.listing!.store_id,
	    price
	)

	let orderCreationExtrinsic = await newOrder.order()

	console.log(`\n📧 Order On-Chain Details`)
	console.dir(newOrder, { depth: null, colors: true })
	console.log('\n⛓  Anchoring Product Ordering Event to the chain...')
	console.log(`🔑 Controller: ${id.buyerOne!.address} `)

	try {
	    await cord.ChainUtils.signAndSubmitTx(
		orderCreationExtrinsic,
		id.networkAuthor!,
		{
		    resolveOn: cord.ChainUtils.IS_IN_BLOCK,
		}
	    )
	    console.log(`✅ Order (${newOrder.id}) created! `)
	} catch (e: any) {
	    console.log(e.errorCode, '-', e.message)
	}
	orders.push({order: newOrder,
		     product: inventory.product,
		     listing: inventory.listing
		    })
	
    }
    return orders;
}

export async function giveRating(id: any, schema: any, orders: any) {
    let ratings: any = [];
    let price = 135000

    console.log(`\n\n✉️  Listening to Ratings \n`)

    for (let i = 0; i < NUMBER_OF_RATING; i++) {
	let order = orders[between(0, orders.length)];
	
	let ratingStream = cord.Content.fromSchemaAndContent(
	    schema,
	    order.product!.stream!.contents,
	    id.buyerOne!.address
	)
	console.log(`📧 Product Order Details `)
	console.dir(ratingStream, { depth: null, colors: true })

	let newRatingContent = cord.ContentStream.fromStreamContent(
	    ratingStream,
	    id.buyerOne!,
	    {
		link: order.order!.id,
	    }
	)
	console.log(`\n📧 Hashed Order Stream `)
	console.dir(newRatingContent, { depth: null, colors: true })

	let bytes = json.encode(newRatingContent)
	let encoded_hash = await hasher.digest(bytes)
	const ratingCid = CID.create(1, 0xb220, encoded_hash)
	let rating = between(1,5);
	let newRating = cord.Product.fromProductContentAnchor(
	    newRatingContent,
	    ratingCid.toString(),
	    order.listing!.store_id,
	    price,
	    rating
	)

	let ratingCreationExtrinsic = await newRating.order_rating()

	console.log(`\n📧 Order On-Chain Details`)
	console.dir(newRating, { depth: null, colors: true })
	console.log('\n⛓  Anchoring Product Ordering Event to the chain...')
	console.log(`🔑 Controller: ${id.buyerOne!.address} `)

	try {
	    await cord.ChainUtils.signAndSubmitTx(
		ratingCreationExtrinsic,
		id.networkAuthor!,
		{
		    resolveOn: cord.ChainUtils.IS_IN_BLOCK,
		}
	    )
	    console.log(`✅ Rating for (${newRating.id}) created! `)
	} catch (e: any) {
	    console.log(e.errorCode, '-', e.message)
	}

	ratings.push({rating: newRating})
    }
    return ratings;
}
