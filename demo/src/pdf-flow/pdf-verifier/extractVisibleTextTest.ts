import fs from 'fs';
import pdfParse from 'pdf-parse';
import { createWorker } from 'tesseract.js';

async function extractVisibleTextWithPDFParse(filePath: string): Promise<string> {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(fileBuffer, { max: 0 });
    console.log(`PDF info for ${filePath}:`, data.info);
    if (!data.text.trim()) {
      console.warn(`⚠️  No text extracted with pdf-parse from ${filePath}. Falling back to OCR.`);
      return '';
    }
    return data.text;
  } catch (error) {
    console.error(`❌ pdf-parse error for ${filePath}: ${error.message}`);
    return '';
  }
}

async function extractVisibleTextWithOCR(filePath: string): Promise<string> {
  try {
    const pdfText = await extractVisibleTextWithPDFParse(filePath);
    if (pdfText.trim()) {
      return pdfText; 
    }

    console.log(`🔄 Attempting OCR with tesseract.js for ${filePath}`);
    const worker = await createWorker('eng'); 
    const { data: { text: ocrText } } = await worker.recognize(filePath);
    await worker.terminate();

    if (!ocrText.trim()) {
      console.warn(`No text extracted with OCR from ${filePath}.`);
    }
    return ocrText;
  } catch (error) {
    console.error(`Error extracting text from ${filePath}: ${error.message}`);
    return '';
  }
}

async function testExtractVisibleText(filePath: string) {
  const text = await extractVisibleTextWithOCR(filePath);
  console.log(`Visible text for ${filePath}:`, JSON.stringify(text));
  console.log(`Lines for ${filePath}:`, text.split('\n').map(line => line.trim()).filter(line => line));
}

testExtractVisibleText('./output/transcript.pdf').catch(console.error);
testExtractVisibleText('./output/resume.pdf').catch(console.error);