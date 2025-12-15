/**
 * Excel export utilities using xlsx library
 * Note: Install xlsx package: npm install xlsx
 */

// Type definitions for xlsx (will be available after installing the package)
declare module 'xlsx' {
  export interface WorkBook {
    SheetNames: string[];
    Sheets: { [sheet: string]: any };
  }
  
  export interface XLSXUtils {
    json_to_sheet(data: any[]): any;
    book_new(): WorkBook;
    book_append_sheet(workbook: WorkBook, worksheet: any, sheetName: string): void;
  }
  
  export function writeFile(workbook: WorkBook, filename: string): void;
  export var utils: XLSXUtils;
}

export interface ExportableData {
  [key: string]: any;
}

/**
 * Export data to Excel (.xlsx) format
 * Requires xlsx package: npm install xlsx @types/xlsx
 */
export async function exportToExcel(
  data: ExportableData[],
  filename: string,
  sheetName: string = 'Sheet1',
): Promise<void> {
  try {
    // Dynamic import to handle case where xlsx might not be installed
    const XLSX = await import('xlsx').catch(() => {
      throw new Error('xlsx package is not installed. Run: npm install xlsx');
    });

    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Write file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } catch (error: any) {
    if (error.message.includes('not installed')) {
      throw error;
    }
    throw new Error(`Failed to export to Excel: ${error.message}`);
  }
}

/**
 * Export data to Excel with multiple sheets
 */
export async function exportToExcelMultiSheet(
  sheets: Array<{ name: string; data: ExportableData[] }>,
  filename: string,
): Promise<void> {
  try {
    const XLSX = await import('xlsx').catch(() => {
      throw new Error('xlsx package is not installed. Run: npm install xlsx');
    });

    const workbook = XLSX.utils.book_new();

    sheets.forEach((sheet) => {
      const worksheet = XLSX.utils.json_to_sheet(sheet.data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
    });

    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } catch (error: any) {
    if (error.message.includes('not installed')) {
      throw error;
    }
    throw new Error(`Failed to export to Excel: ${error.message}`);
  }
}

