import * as cord from '@cord.network/api'
import * as json from 'multiformats/codecs/json'
import { blake2b256 as hasher } from '@multiformats/blake2/blake2b'
import { CID } from 'multiformats/cid'
import type { KeyringPair } from '@polkadot/keyring/types'

const { ApiPromise, WsProvider } = require('@polkadot/api');

const AUTH_SEED =
  '0x0000000000000000000000000000000000000000000000000000000000000000'
const ENC_SEED =
  '0x0000000000000000000000000000000000000000000000000000000000000001'
const ATT_SEED =
  '0x0000000000000000000000000000000000000000000000000000000000000002'
const DEL_SEED =
  '0x0000000000000000000000000000000000000000000000000000000000000003'

export function generate_ed25519_authentication_key(): KeyringPair {
  return cord.Identity.buildFromSeedString(AUTH_SEED, {
    signingKeyPairType: 'ed25519',
  }).signKeyringPair
}
export function get_ed25519_authentication_key_id(): string {
  return '0xed52d866f75a5e57641b6ca68a7618312564de787cda3d0664d15471ec1d12b5'
}

export function generate_sr25519_authentication_key(): KeyringPair {
  return cord.Identity.buildFromSeedString(AUTH_SEED, {
    signingKeyPairType: 'sr25519',
  }).signKeyringPair
}
export function get_sr25519_authentication_key_id(): string {
  return '0x1eb4134f8acf477337de6b208c1044b19b9ac09e20e4c6f6c1561d1cef6cad8b'
}

export function generate_encryption_key(): nacl.BoxKeyPair {
  return cord.Identity.buildFromSeedString(ENC_SEED, {
    signingKeyPairType: 'ed25519',
  }).boxKeyPair
}
export function get_encryption_key_id(): string {
  return '0xd8752aed376a12f17ee8c5e06aa19df1cea571da1c9241fc50c330504513b350'
}

export function generate_ed25519_anchor_key(): KeyringPair {
  return cord.Identity.buildFromSeedString(ATT_SEED, {
    signingKeyPairType: 'ed25519',
  }).signKeyringPair
}
export function get_ed25519_anchor_key_id(): string {
  return '0xee643cd1b9567e60b913ef6d7b99e117277413736955051b891b07fa2cff1ca2'
}

export function generate_sr25519_anchor_key(): KeyringPair {
  return cord.Identity.buildFromSeedString(ATT_SEED, {
    signingKeyPairType: 'sr25519',
  }).signKeyringPair
}
export function get_sr25519_anchor_key_id(): string {
  return '0x8ab41dc8ddfecb44ca18658b0a34becdcc0580096855c9f7cbb8575b02356286'
}

export function generate_ed25519_delegation_key(): KeyringPair {
  return cord.Identity.buildFromSeedString(DEL_SEED, {
    signingKeyPairType: 'ed25519',
  }).signKeyringPair
}
export function get_ed25519_delegation_key_id(): string {
  return '0xe8633ac00f7cf860d6310624c721e4229d7f661de9afd885cd2d422fd15b7669'
}

export function generate_sr25519_delegation_key(): KeyringPair {
  return cord.Identity.buildFromSeedString(DEL_SEED, {
    signingKeyPairType: 'sr25519',
  }).signKeyringPair
}
export function get_sr25519_delegation_key_id(): string {
  return '0x81dc5bf133b998d615b70563ee94e92296e1219f8235b008b38a2ddb40168a35'
}

export async function waitForEnter(message?: string) {
  const waitForEnter = require('wait-for-enter')
  message = message || 'Press Enter to continue: '
  console.log(message)
  await waitForEnter()
}

export async function createIdentities(my_id: string) {

    // Step 1: Setup Org Identity
    console.log(`\n🏛  Creating Identities\n`)
    //3x4DHc1rxVAEqKWSx1DAAA8wZxLB4VhiRbMV997niBckUwSi
    const networkAuthor = cord.Identity.buildFromURI('//Alice', {
	signingKeyPairType: 'sr25519',
    })
    const productOwner = cord.Identity.buildFromURI('//Bob', {
	signingKeyPairType: 'sr25519',
    })
    const buyer = cord.Identity.buildFromURI(my_id, {
	signingKeyPairType: 'sr25519',
    })

    console.log(
	`🔑 Network Author Address (${networkAuthor.signingKeyType}): ${networkAuthor.address}`
    )
    console.log(
	`🔑 Product Controller Address (${productOwner.signingKeyType}): ${productOwner.address}`
    )
    console.log(
	`🔑 Buyer Address (${buyer.signingKeyType}): ${buyer.address}\n`
    )
    return { networkAuthor, productOwner, buyer }
}



export async function placeOrder(id: any, schema: any, product: any, listId: string, storeId: string, price: any) {
    console.log(`\n\n✉️  Listening to Product Orders \n`)

    let orderStream = cord.Content.fromSchemaAndContent(
	schema,
	{name: "Hello"},
	id.buyer!.address
    )
    console.log(`📧 Product Order Details `)
    console.dir(orderStream, { depth: null, colors: true })

    let newOrderContent = cord.ContentStream.fromStreamContent(
	orderStream,
	id.buyer!,
	{
	    link: listId,
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
	storeId,
	price ? price : 0,
    )

    let orderCreationExtrinsic = await newOrder.order()
    
    console.log(`\n📧 Order On-Chain Details`)
    console.dir(newOrder, { depth: null, colors: true })
    console.log('\n⛓  Anchoring Product Ordering Event to the chain...')
    console.log(`🔑 Controller: ${id.buyer!.address} `)
    
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
}

async function main(my_id: string, blockHash: string, listId: string) {
    await cord.init({ address: 'wss://staging.cord.network' })

    /* Create Identities - Can have a separate registry for this */
    let id = await createIdentities(my_id);
    console.log('✅ Identities created!')

    /* TODO: can we get this from cord? */
    const provider = new WsProvider('wss://staging.cord.network');
    const api = await ApiPromise.create({ provider});

    //let list = await api.query.product.products(listId);
    //console.log("List", listId, list);
    //const args = process.argv.slice(2);

    const signedBlock = await api.rpc.chain.getBlock(blockHash);

    if (!signedBlock) {
       console.log("product anchor not found");
       return;
    }

    let prodSchemaContent = require('../res/ondc-prod-schema.json')

    let productSchema = cord.Schema.fromSchemaProperties(
	prodSchemaContent,
	id.productOwner!.address
    )

    let storeId: string = '';
    let listingId: string = '';
    let price: string = '';
    let product: any = {};
    signedBlock.block.extrinsics.forEach(async (ex: any, index: number) => {
	const { method: { args, method, section } } = ex;

	if (method !== 'list' && section !== 'product') {
	   return;
	}

	listingId = args[0].toString();

	/* there can be more than 1 product.list events */
	if (listingId === listId) {
            /* This is matching now */
	    storeId = args[3].toString();
	    price = args[4].toString();
	    let product = cord.Product.fromProductAnchor(
		listId,
		args[2].toString(), /* contentHash */
		args[5].toString(), /* cid */
		args[1].toString(), /* creator */
		storeId,
		productSchema.id?.replace('cord:schema:',''),
		parseInt(price, 10),
		args[7].toString(), /* link */
		0
	    )
	}
    });


    console.log(listingId, storeId, price);

    // Step 4: Create an Order from the lists
    await placeOrder(id, productSchema, product, listingId, storeId, price);

    /*
    // Step 4: Create an Rating from the lists
    let ratings = await giveRating(id, schema, orders);
    console.log(`✅ ${ratings.length} rating given! `)
    */
    await waitForEnter('\n⏎ Press Enter to continue..')
}

main('//buyer//1', '0x00744854001d04d873a28a2a402608de768ffa79820bb83756ba849bf461938e', '0x4b1b959a616b4bf170b08a09a37f5f56d782b70ed2346719e7702dee8c387607')
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(cord.disconnect)

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  cord.disconnect()
  process.exit(0)
})
