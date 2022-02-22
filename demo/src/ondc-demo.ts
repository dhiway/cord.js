import * as cord from '@cord.network/api'
import * as utils from './utils'
import { createIdentities, registerProducts, addProductListing, placeOrder, giveRating } from './ondc-helper';


async function main() {
    await cord.init({ address: 'wss://staging.cord.network' })

    /* Create Identities - Can have a separate registry for this */
    let id = await createIdentities();
    console.log('✅ Identities created!')

    let content = {
	    name: 'Grade A Shimla Apple',
	    sku: 'SHMGRN002'
    }

    // Step 2: Setup a new Product
    let { products, schema } = await registerProducts(id, content);
    console.log(`✅ ${products.length} Products added! `)
 
    // Step 3: Create a new Listing
    let listings = await addProductListing(id, schema, products);
    console.log(`✅ ${listings.length} products listed by seller! `)

    // Step 4: Create an Order from the lists
    let orders = await placeOrder(id, schema, listings);
    console.log(`✅ ${orders.length} orders placed! `)

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
