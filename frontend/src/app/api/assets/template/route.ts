import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    // Read the CSV file from the public downloads folder
    const filePath = join(process.cwd(), 'public', 'downloads', 'sample-physical-assets-import.csv');
    const fileContents = readFileSync(filePath, 'utf-8');

    return new NextResponse(fileContents, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="sample-physical-assets-import.csv"',
      },
    });
  } catch (error) {
    console.error('Error serving template file:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}

