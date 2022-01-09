import * as cord from '@cord.network/api'
import * as utils from './utils'
import { createIdentities, registerProducts, addProductListing } from './ondc-helper';


async function main() {
    await cord.init({ address: 'wss://staging.cord.network' })

    /* Create Identities - Can have a separate registry for this */
    let id = await createIdentities();
    console.log('✅ Identities created!')
    
    // Step 2: Setup a new Product
    let product = await registerProducts(id);
    console.log(`✅ New Product (${product.product!.id}) added! `)
 
    // Step 3: Create a new Listing
    let listing = await addProductListing(id, product);
    console.log(`✅ Listing (${listing.listing!.id}) created! `)

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
