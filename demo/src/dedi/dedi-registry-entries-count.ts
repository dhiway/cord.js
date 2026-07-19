import * as Cord from '@cord.network/sdk';
import { StorageKey } from '@cord.network/types'

import fs from 'fs';
import path from 'path';

import moment from "moment";

const logFilePath = path.join(process.cwd(), 'log', `registry_entries_count_log_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`);

const logDirPath = path.dirname(logFilePath);
if (!fs.existsSync(logDirPath)) {
  fs.mkdirSync(logDirPath, { recursive: true });
}

const logToFile = (message: any) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${formatMessage(message)}\n`;

  fs.appendFileSync(logFilePath, logMessage);
};

const formatMessage = (message: any): string => {
  if (typeof message === 'object') {
    return JSON.stringify(message, null, 2); 
  }
  return message.toString();
};

const log = (...args: any[]) => {
  const message = args.map(arg => formatMessage(arg)).join(' ');
  logToFile(message); 
  console.log(...args); 
}

async function main() {
  try {
    const networkAddress = process.env.NETWORK_ADDRESS
      ? process.env.NETWORK_ADDRESS
      : 'ws://127.0.0.1:9944'

    Cord.ConfigService.set({ submitTxResolveOn: Cord.Chain.IS_IN_BLOCK })
    await Cord.connect(networkAddress)

    const api = Cord.ConfigService.get('api');

    let registryEntriesCountStartTime = moment();

    const registryEntriesCount = await getRegistryEntriesCount(api);
    log("Total number of registry entries found at chain-state", registryEntriesCount);

    let registryEntriesCountStopTime = moment();

    let timePassedInSeconds = registryEntriesCountStopTime.diff(registryEntriesCountStartTime, 'seconds');
    log(`\nTotal time for counting : ${timePassedInSeconds} seconds`);

  } catch (error: unknown) {
    if (error instanceof Error) {
      log(`Error in main function: ${error.message}`);
    }
  } finally {
    await Cord.disconnect();
    log('\nBye! 👋 👋 👋 ');
  }
}

async function getRegistryEntriesCount(api: Cord.ApiPromise) {
  let registryEntriesCount = 0;
  let startKey: string | undefined;

  let entries: StorageKey<[Cord.Bytes]>[];

  try {
    while (true) {
      entries = await api.query.entries.registryEntries.keysPaged({
        pageSize: 1000, 
        args: [],
        startKey: startKey, 
      });

      if (entries.length === 0) {
        break;
      }

      registryEntriesCount += entries.length;

      startKey = entries[entries.length - 1].toHex();

      log(`Processed ${registryEntriesCount} entries so far...`);
    }
  } catch (error) {
    log('Error querying registry entries:', error);
  }

  return registryEntriesCount;
}

main()
  .then(() => log('\nBye! 👋 👋 👋 '))
  .finally(Cord.disconnect)

process.on('SIGINT', async () => {
  log('\nBye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})


// node --expose-gc --inspect -r 'ts-node/register' demo/src/dedi/dedi-stress-test.ts
