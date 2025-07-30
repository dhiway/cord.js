import fs from 'fs';
import { exec } from 'child_process';
import util from 'util';
import pdfParse from 'pdf-parse';
import { hash } from './utils/hash';

const execPromise = util.promisify(exec);

async function extractMetadata(filePath: string) {
  try {
    /* exiftool suits better and easier to extract for now */
    const { stdout } = await execPromise(`exiftool -j ${filePath}`);
    const metadata = JSON.parse(stdout)[0];

    const title = metadata.Title ?? '';
    let keywords: string[] = [];

    if (Array.isArray(metadata.Keywords)) {
      keywords = metadata.Keywords.map(s => s.trim());
    } else if (typeof metadata.Keywords === 'string') {
      keywords = metadata.Keywords.split(/,\s*/).map(s => s.trim());
    }

    if (!title || keywords.length === 0) {
      console.warn('⚠️  No valid metadata found.');
      return { entryId: '', fieldHashes: {} };
    }

    const fieldHashes: Record<string, string> = {};
    for (const pair of keywords) {
      const parts = pair.split(':').map(s => s.trim());
      if (parts.length !== 2 || !parts[0] || !parts[1]) {
        console.warn(`⚠️  Invalid metadata pair: ${pair}`);
        continue;
      }
      const [key, hash] = parts;
      /* Validate BLAKE2b hash (66 characters, starts with 0x, followed by 64 hex chars), not required for now */
      if (/^0x[0-9a-fA-F]{64}$/.test(hash)) {
        fieldHashes[key] = hash;
      } else {
        console.warn(`⚠️  Invalid hash for ${key}: ${hash}`);
      }
    }

    const entryId = title.replace('EntryID: ', '').trim();
    return { entryId, fieldHashes };
  } catch (error) {
    console.error(`❌ Error extracting metadata: ${error.message}`);
    return { entryId: '', fieldHashes: {} };
  }
}

async function extractVisibleText(filePath: string) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(fileBuffer, { max: 0 }); 
    return data.text;
  } catch (error) {
    console.error(`❌ Error extracting text: ${error.message}`);
    return '';
  }
}

async function verifyTranscript(filePath: string) {
  try {
    const { entryId, fieldHashes } = await extractMetadata(filePath);
    const visibleText = await extractVisibleText(filePath);

    if (!entryId || Object.keys(fieldHashes).length === 0) {
      console.error('❌ No valid metadata to verify.');
      return [];
    }

    console.log('Visible text:', JSON.stringify(visibleText));
    console.log(`Verifying EntryID: ${entryId}`);
    console.log('Metadata fieldHashes:', fieldHashes);

    const lines = visibleText.split('\n').map(line => line.trim()).filter(line => line);
    console.log('Lines:', lines);

    const results: string[] = [];

    for (const [field, expectedHash] of Object.entries(fieldHashes)) {
      console.log(`🔍 Verifying field: ${field}`);

      const normalizedField = field.toLowerCase().replace(/\s+/g, '');
      const match = lines.find(line => {
        const normalizedLine = line.toLowerCase().replace(/\s+/g, '');
        return normalizedLine.startsWith(normalizedField + ':');
      });

      if (!match) {
        console.log(`${field} not found in visible content`);
        results.push(`${field} not found in visible content`);
        continue;
      }

      const actualValue = match.substring(match.indexOf(':') + 1).trim();
      const actualHash = hash(actualValue);

      if (actualHash === expectedHash) {
        console.log(`${field} verified (value: ${actualValue})`);
        results.push(`${field} verified`);
      } else {
        console.log(`${field} tampered (expected: ${expectedHash}, got: ${actualHash}, value: ${actualValue})`);
        results.push(`${field} tampered (expected: ${expectedHash}, got: ${actualHash})`);
      }
    }

    console.log('\nVerification Summary:\n' + results.join('\n'));
    return results;
  } catch (error) {
    console.error(`Verification failed: ${error.message}`);
    return [];
  }
}

verifyTranscript('./output/tampered-transcript.pdf').catch(console.error);