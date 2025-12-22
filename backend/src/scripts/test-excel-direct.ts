import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

// Test Excel generation directly
const testData = [
  {
    uniqueIdentifier: 'ASSET-001',
    assetDescription: 'Test Asset 1',
    assetTypeId: 'type-1',
    manufacturer: 'Test Manufacturer',
    model: 'Model X',
    serialNumber: 'SN123456',
    assetTag: 'TAG-001',
  },
  {
    uniqueIdentifier: 'ASSET-002',
    assetDescription: 'Test Asset 2',
    assetTypeId: 'type-2',
    manufacturer: 'Another Manufacturer',
    model: 'Model Y',
    serialNumber: 'SN789012',
    assetTag: 'TAG-002',
  },
];

console.log('Testing Excel generation with simple data...');
console.log(`Data rows: ${testData.length}`);

try {
  // Simple Excel generation (like our simplified version)
  const worksheet = XLSX.utils.json_to_sheet(testData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

  const buffer = XLSX.write(workbook, {
    type: 'buffer',
    bookType: 'xlsx',
  }) as Buffer;

  const finalBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);

  console.log(`Excel file generated: ${finalBuffer.length} bytes`);

  // Check file signature
  const signature = finalBuffer.slice(0, 2).toString('hex');
  console.log(`File signature: ${signature} (expected: 504b for ZIP/Excel)`);

  if (signature !== '504b') {
    console.error('ERROR: File signature is invalid!');
    console.error(`First 100 bytes (hex): ${finalBuffer.slice(0, 100).toString('hex')}`);
    console.error(`First 100 bytes (ascii): ${finalBuffer.slice(0, 100).toString('ascii')}`);
  } else {
    console.log('✓ File signature is valid.');
  }

  // Save to file
  const outputPath = path.join(__dirname, '../../test-excel-direct.xlsx');
  fs.writeFileSync(outputPath, finalBuffer);
  console.log(`File saved to: ${outputPath}`);

  // Try to read it back to verify
  try {
    const readWorkbook = XLSX.readFile(outputPath);
    const sheetName = readWorkbook.SheetNames[0];
    const sheet = readWorkbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    console.log(`✓ File can be read back. Rows: ${data.length}`);
  } catch (readError: any) {
    console.error(`ERROR: File cannot be read back: ${readError.message}`);
  }
} catch (error: any) {
  console.error('Error generating Excel:', error.message);
  console.error(error.stack);
  process.exit(1);
}


