/* eslint-disable */

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const fs = require('fs')

const loadModule = new Function(
  'specifier',
  'return import(specifier)'
)

const { argv } = yargs(hideBin(process.argv))
  .option('endpoint', {
    alias: 'e',
    description: 'http or ws endpoint from which to fetch metadata',
    type: 'string',
    demandOption: true,
    requiresArg: true,
    coerce: (val) => (Array.isArray(val) ? val.pop() : val),
  })
  .option('outfile', {
    alias: 'o',
    description: 'path to output file',
    type: 'string',
    demandOption: true,
    requiresArg: true,
  })
  .help()
  .alias('help', 'h')

let exitCode
let disconnect = async () => {}

async function fetchHttpMetadata() {
  const response = await fetch(argv.endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'state_getMetadata',
      params: [],
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} while fetching metadata`)
  }

  const payload = await response.json()
  return payload.result
}

async function fetchWsMetadata() {
  const { createWsClient } = await loadModule('polkadot-api/ws')
  const client = createWsClient(argv.endpoint)
  disconnect = async () => {
    client.destroy()
  }

  return client._request('state_getMetadata', [])
}

async function fetchMetadata() {
  if (argv.endpoint.startsWith('http')) {
    return fetchHttpMetadata()
  }

  if (argv.endpoint.startsWith('ws')) {
    return fetchWsMetadata()
  }

  throw new Error(
    `Can only handle ws/wss and http/https endpoints, received "${argv.endpoint}"`
  )
}

async function fetch() {
  const result = await fetchMetadata()

  const metadata = JSON.stringify({ result })

  const outfile = Array.isArray(argv.outfile) ? argv.outfile : [argv.outfile]
  outfile.forEach((file) => {
    console.log(
      `writing metadata to ${file}:\n${metadata.substring(0, 100)}...`
    )
    fs.writeFileSync(file, metadata)
  })
  console.log('success')
  exitCode = 0
}

const timeout = new Promise((_, reject) => {
  setTimeout(() => {
    exitCode = exitCode || 124
    reject(new Error('Timeout waiting for metadata fetch'))
  }, 10000)
})

;(async () => {
  try {
    await Promise.race([fetch(), timeout])
  } catch (error) {
    console.error(`updating metadata failed with ${error}`)
    exitCode = exitCode || 1
  } finally {
    console.log('disconnecting...')
    disconnect().then(() => process.exit(exitCode))
    setTimeout(() => {
      console.error(`timeout while waiting for disconnect`)
      process.exit(exitCode)
    }, 10000)
  }
})()
