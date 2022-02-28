import * as cord from '@cord.network/api'
import { Crypto } from '@cord.network/utils'
import * as json from 'multiformats/codecs/json'
import { blake2b256 as hasher } from '@multiformats/blake2/blake2b'
import { CID } from 'multiformats/cid'
//import * as utils from './utils'

//const NUMBER_OF_ORDERS = 8
//const NUMBER_OF_RATING = 5

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
    const sellerOne = cord.Identity.buildFromURI('//seller//2', {
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


export async function registerProducts(id: any, content: any) {
    
    console.log(`\n\n✉️  Adding a new Product Schema \n`)
    let newProdSchemaContent = require('../res/ondc-prod-schema.json')
    let newProdSchemaName = `Item Schema: ${content.name}`
    newProdSchemaContent.name = newProdSchemaName

    let products: any = [];
    let newProductSchema = cord.Schema.fromSchemaProperties(
	newProdSchemaContent,
	id.productOwner!.address,
	false
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
		resolveOn: cord.ChainUtils.IS_IN_BLOCK,
	    }
	)
	console.log('✅ Schema created!')
    } catch (e: any) {
	console.log(e.errorCode, '-', e.message)
    }


    // Step 2: Setup a new Product
    console.log(`\n✉️  Listening to new Product Additions`, '\n')
    let productStream = cord.Content.fromSchemaAndContent(
        newProductSchema,
        content,
        id.productOwner!.address
     )
	console.log(`📧 Product Details `)
	console.dir(productStream, { depth: null, colors: true })

	let newProductContent = cord.ContentStream.fromStreamContent(
	    productStream,
	    id.productOwner!,
	    {
	    nonceSalt: `${content.name}:${content.sku}:create`
	    }
	)
	console.log(`\n📧 Hashed Product Stream `)
	console.dir(newProductContent, { depth: null, colors: true })

	bytes = json.encode(newProductContent)
	encoded_hash = await hasher.digest(bytes)
	let streamCid = CID.create(1, 0xb220, encoded_hash)

	let newProduct = cord.Product.fromProductContentAnchor(
	    newProductContent,
	    streamCid.toString(),
	    undefined,
	    100,
	    undefined,
	    100000
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

    /* Handle delegation */

    let productDelegationStream = cord.Content.fromSchemaAndContent(
        newProductSchema,
        content,
        id.sellerOne!.address
     )
	let newProductDelegationContent = cord.ContentStream.fromStreamContent(
	    productDelegationStream,
	    id.sellerOne!,
	    {
		link: newProduct.id,
		nonceSalt: `${content.name}:${content.sku}:delegate`
	    }
	)
	bytes = json.encode(newProductDelegationContent)
	encoded_hash = await hasher.digest(bytes)
	streamCid = CID.create(1, 0xb220, encoded_hash)

	let newDelegateProduct = cord.Product.fromProductContentAnchor(
	    newProductDelegationContent,
	    streamCid.toString(),
	    undefined,
	    103,
	    undefined,
	    1000
	)

	let productDelegationExtrinsic = await newDelegateProduct.delegate()

	console.log(`\n📧 Stream On-Chain Details`)
	console.dir(newDelegateProduct, { depth: null, colors: true })

	console.log('\n⛓  Anchoring Product Delegation to the chain...')
	console.log(`🔑 Controller: ${id.productOwner!.address} `)
    
        try {
	    await cord.ChainUtils.signAndSubmitTx(
		productDelegationExtrinsic,
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


    return { products, schema: newProductSchema};
}

export async function addProductListing(id: any, schema: any, products: any) {
    let listings: any = [];
    console.log(`\n\n✉️  Listening to Product Listings \n`)
    let store_name = 'ABC Store'
    let price = 100
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
	let content = product.stream!.contents;
	let listStream = cord.Content.fromSchemaAndContent(
	    schema,
	    content,
	    id.sellerOne!.address
	)
	console.log(`📧 Product Listing Details `)
	console.dir(product.stream!, { depth: null, colors: true })

	let newListingContent = cord.ContentStream.fromStreamContent(
	    listStream,
	    id.sellerOne!,
	    {
		link: product.product!.id!,
		nonceSalt: `${content.name}:${content.sku}:list`
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
	    price,
	    undefined,
	    500
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
		    resolveOn: cord.ChainUtils.IS_IN_BLOCK,
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
    console.log(`\n\n✉️  Listening to Product Orders \n`)
    let price = 99;
    	let inventory = listings[0];
	console.log(inventory);
	let content = inventory.product!.stream!.contents;
	let orderStream = cord.Content.fromSchemaAndContent(
	    schema,
	    content,
	    id.buyerOne!.address
	)
	console.log(`📧 Product Order Details `)
	console.dir(orderStream, { depth: null, colors: true })

	let newOrderContent = cord.ContentStream.fromStreamContent(
	    orderStream,
	    id.buyerOne!,
	    {
		link: inventory.listing!.id,
		nonceSalt: `${content.name}:${content.sku}:order`
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
	    price,
	    undefined,
	    5
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
	
    return orders;
}

export async function giveRating(id: any, schema: any, orders: any) {
    let ratings: any = [];

    console.log(`\n\n✉️  Listening to Ratings \n`)

	let order = orders[0];
	let content = order.product!.stream!.contents;
	let ratingStream = cord.Content.fromSchemaAndContent(
	    schema,
	    content,
	    id.buyerOne!.address
	)
	console.log(`📧 Product Order Details `)
	console.dir(ratingStream, { depth: null, colors: true })

	let newRatingContent = cord.ContentStream.fromStreamContent(
	    ratingStream,
	    id.buyerOne!,
	    {
		link: order.order!.id,
		nonceSalt: `${content.name}:${content.sku}:order`
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
	    99,
	    rating,
	    undefined
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

    return ratings;
}
