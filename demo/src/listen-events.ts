import * as Cord from "@cord.network/sdk";

async function main() {
  const networkAddress = process.env.NETWORK_ADDRESS
    ? process.env.NETWORK_ADDRESS
    : 'ws://127.0.0.1:9944'
  //  const networkAddress = 'ws://127.0.0.1:9944'
  Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK })
  await Cord.connect(networkAddress)

  const api = Cord.ConfigService.get('api')

  // Subscribe to system events
  api.query.system.events((events) => {
    // Loop through the array of events
    events.forEach((record) => {
      // Extract the phase, event type, and event data
      const { event, phase } = record
      const types = event.typeDef
      const args = event.data.map((data) => data.toString())

      // Print the event details
      console.log(
        `\nEvent: ${event.section}.${event.method} [${phase.toString()}]`
      )
      console.log(`\tParameters:`)
      args.forEach((arg, index) => {
        console.log(`\t\t${types[index].type}: ${arg}`)
      })
    })
  })
}

main().catch((error) => {
  console.error('Error:', error)
})
