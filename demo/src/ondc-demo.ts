import * as cord from '@cord.network/api'
import * as utils from './utils'
import { createIdentities, registerProducts, addProductListing, placeOrder, giveRating } from './ondc-helper';


function sleep(s: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, s * 1000);
  });
}

async function main() {
    //await cord.init({ address: 'ws://localhost:9944' })
    await cord.init({ address: 'wss://staging.cord.network' })

    /* Create Identities - Can have a separate registry for this */
    let id = await createIdentities();
    console.log('✅ Identities created!')

    let content = {
	    name: 'Grade A Shimla Apple',
	    sku: 'BLRGRN008903'
    }

    // Step 2: Setup a new Product
    let { products, schema } = await registerProducts(id, content);
    console.log(`✅ ${products.length} Item created by manufacturer / OEM vendor! `)
    sleep(3);

    // Step 3: Create a new Listing
    let listings = await addProductListing(id, schema, products);
    console.log(`✅ ${listings.length} item listed by seller! `)
    sleep(10);

    // Step 4: Create an Order from the lists
    let orders = await placeOrder(id, schema, listings);
    console.log(`✅ ${orders.length} order placed by Buyer! `)
    sleep(10);

    // Step 4: Create an Rating from the lists
    let ratings = await giveRating(id, schema, orders);
    console.log(`✅ ${ratings.length} rating given! `)

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
