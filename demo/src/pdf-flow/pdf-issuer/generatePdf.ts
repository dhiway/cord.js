import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { hash } from './utils/hash';
import { computeEntryDokenId } from 'doken-precomputer';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { GLOBAL_REGISTRY_ID, GLOBAL_ISSUER_ADDRESS } from './index';

type FieldData = {
  name: string;
  rollNumber: string;
  course: string;
  issueDate: string;
};

export async function generatePdfWithMetadata(
  fields: FieldData,
  registryId: string = GLOBAL_REGISTRY_ID,
  accountAddress: string = GLOBAL_ISSUER_ADDRESS
) {

  const fieldHashes: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields)) {
    fieldHashes[key] = hash(value);
  }

  const combinedHashInput = Object.values(fieldHashes).join('');
  /* TODO: Hash student-id/roll-number later */
  const txHash = hash(combinedHashInput);

  const provider = new WsProvider('ws://127.0.0.1:9944'); // Adjust to your CORD endpoint
  const api = await ApiPromise.create({ provider });

  const entryId = await computeEntryDokenId(api, txHash, registryId, accountAddress);
  await api.disconnect();

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 14;

  const lines = [
    `Name: ${fields.name}`,
    `Roll Number: ${fields.rollNumber}`,
    `Course: ${fields.course}`,
    `Issue Date: ${fields.issueDate}`,
  ];

  let y = height - 50;
  for (const line of lines) {
    page.drawText(line, { x: 50, y, size: fontSize, font, color: rgb(0, 0, 0) });
    y -= 24;
  }

  pdfDoc.setTitle(`EntryID: ${entryId}`);
  pdfDoc.setSubject('Transcript issued by Issuer');
  pdfDoc.setAuthor('CORD Network Issuer App');
    pdfDoc.setKeywords(
    Object.entries(fieldHashes).map(([k, v]) => `${k}:${v}`)
    );

  /* Write to chain */
  /* Create a registry-entry with digest as the roll-no, blob with field hashes of all individual data */

  const pdfBytes = await pdfDoc.save();
  if (!existsSync('./output')) mkdirSync('./output');
  writeFileSync('./output/transcript.pdf', pdfBytes);

  console.log('📄 PDF saved at ./output/transcript.pdf');
  console.log('🧾 EntryID:', entryId);
}
