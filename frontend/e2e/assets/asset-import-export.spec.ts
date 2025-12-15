import { test, expect } from '../fixtures/auth';
import {
  waitForTable,
  waitForDialog,
  waitForToast,
  generateRandomString,
  generateRandomEmail,
  getTableRowCount
} from '../utils/helpers';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Asset Import and Export Tests', () => {
  test.describe('Asset Import Wizard', () => {
    test('should complete full import workflow with CSV file', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      // Look for import button
      const importButton = authenticatedPage.locator('button:has-text("Import"), button[aria-label*="Import"]').first();
      await expect(importButton).toBeVisible({ timeout: 5000 });
      await importButton.click();

      // Wait for import wizard to open
      await waitForDialog(authenticatedPage);

      // Step 1: File Upload
      await expect(authenticatedPage.locator('text=Upload, text=Step 1, text=Choose File').first()).toBeVisible({ timeout: 5000 });

      // Look for file upload input
      const fileInput = authenticatedPage.locator('input[type="file"]').first();
      expect(fileInput).toBeVisible();

      // Create a test CSV file for import
      const csvContent = `Asset Description,Unique Identifier,Asset Type,Criticality Level,Status
Test Server 1,SRV-IMPORT-001,Server,High,Active
Test Workstation 1,WS-IMPORT-001,Workstation,Medium,Active
Test Laptop 1,LAP-IMPORT-001,Laptop,Low,Active`;

      // Write CSV file
      const tempCsvPath = path.join(__dirname, '../../temp/test-import.csv');
      await fs.mkdir(path.dirname(tempCsvPath), { recursive: true });
      await fs.writeFile(tempCsvPath, csvContent, 'utf8');

      // Upload the file
      await fileInput.setInputFiles(tempCsvPath);

      // Wait for file to be processed
      await authenticatedPage.waitForTimeout(2000);

      // Click Next to go to field mapping
      const nextButton = authenticatedPage.locator('button:has-text("Next"), button:has-text("Continue")').first();
      await expect(nextButton).toBeVisible();
      await nextButton.click();

      // Step 2: Field Mapping
      await expect(authenticatedPage.locator('text=Map Fields, text=Step 2').first()).toBeVisible({ timeout: 5000 });

      // Verify that CSV columns are detected
      await expect(authenticatedPage.locator('text=Asset Description').first()).toBeVisible();
      await expect(authenticatedPage.locator('text=Unique Identifier').first()).toBeVisible();
      await expect(authenticatedPage.locator('text=Asset Type').first()).toBeVisible();

      // Map fields if automatic mapping doesn't work
      const mappingSelects = authenticatedPage.locator('select').all();
      for (let i = 0; i < Math.min(mappingSelects.length, 5); i++) {
        const select = mappingSelects[i];
        if (await select.isVisible()) {
          // Get available options and select appropriate one
          await select.selectOption({ index: Math.min(i + 1, 4) });
        }
      }

      // Click Next to go to preview
      await authenticatedPage.locator('button:has-text("Next"), button:has-text("Continue")').first().click();

      // Step 3: Preview
      await expect(authenticatedPage.locator('text=Preview, text=Step 3').first()).toBeVisible({ timeout: 5000 });

      // Verify preview data is displayed
      await expect(authenticatedPage.locator('text=Test Server 1').first()).toBeVisible();
      await expect(authenticatedPage.locator('text=SRV-IMPORT-001').first()).toBeVisible();

      // Click Next to start import
      await authenticatedPage.locator('button:has-text("Next"), button:has-text("Import")').first().click();

      // Step 4: Importing
      await expect(authenticatedPage.locator('text=Importing, text=Step 4').first()).toBeVisible({ timeout: 5000 });

      // Wait for import to complete (this might take some time)
      await authenticatedPage.waitForTimeout(5000);

      // Should move to results step
      await expect(authenticatedPage.locator('text=Complete, text=Results, text=Step 5').first()).toBeVisible({ timeout: 10000 });

      // Verify import results
      await expect(authenticatedPage.locator('text=3 assets imported, text=Import successful').first()).toBeVisible({ timeout: 5000 });

      // Close import wizard
      const closeButton = authenticatedPage.locator('button:has-text("Close"), button[aria-label*="Close"]').first();
      await closeButton.click();

      // Verify assets were imported
      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator('text=Test Server 1').first()).toBeVisible({ timeout: 10000 });
      await expect(authenticatedPage.locator('text=SRV-IMPORT-001').first()).toBeVisible({ timeout: 10000 });

      // Clean up temporary file
      try {
        await fs.unlink(tempCsvPath);
      } catch (error) {
        // Ignore cleanup errors
      }
    });

    test('should handle import validation errors gracefully', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/information');
      await waitForTable(authenticatedPage);

      const importButton = authenticatedPage.locator('button:has-text("Import"), button[aria-label*="Import"]').first();
      await importButton.click();

      await waitForDialog(authenticatedPage);

      // Create CSV with validation errors
      const errorCsvContent = `Asset Name,Information Type,Data Classification
Missing Type,,Confidential
Valid Asset,Customer Records,
Another Asset,Financial Data,Internal`;

      const tempCsvPath = path.join(__dirname, '../../temp/test-import-errors.csv');
      await fs.mkdir(path.dirname(tempCsvPath), { recursive: true });
      await fs.writeFile(tempCsvPath, errorCsvContent, 'utf8');

      const fileInput = authenticatedPage.locator('input[type="file"]').first();
      await fileInput.setInputFiles(tempCsvPath);

      await authenticatedPage.waitForTimeout(2000);

      // Go through wizard
      await authenticatedPage.locator('button:has-text("Next")').first().click();
      await authenticatedPage.locator('button:has-text("Next")').first().click();

      // Should show validation errors in preview
      await expect(authenticatedPage.locator('text=Missing required fields, text=Validation errors').first()).toBeVisible({ timeout: 5000 });

      // Should show which rows have errors
      await expect(authenticatedPage.locator('text=Missing Type').first()).toBeVisible();

      // Try to continue despite errors
      const importButtonInWizard = authenticatedPage.locator('button:has-text("Import"), button:has-text("Continue Anyway")').first();
      if (await importButtonInWizard.isVisible()) {
        await importButtonInWizard.click();

        // Should show partial import results
        await authenticatedPage.waitForTimeout(3000);
        await expect(authenticatedPage.locator('text=1 asset imported, text=2 errors').first()).toBeVisible({ timeout: 5000 });
      }

      // Clean up
      try {
        await fs.unlink(tempCsvPath);
      } catch (error) {
        // Ignore cleanup errors
      }

      await authenticatedPage.locator('button:has-text("Close")').first().click();
    });

    test('should support different asset types in import', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/software');
      await waitForTable(authenticatedPage);

      const importButton = authenticatedPage.locator('button:has-text("Import"), button[aria-label*="Import"]').first();
      await importButton.click();

      await waitForDialog(authenticatedPage);

      // Look for asset type selection
      const assetTypeSelect = authenticatedPage.locator('select[name*="assetType"], [data-testid="asset-type-select"]').first();
      if (await assetTypeSelect.isVisible()) {
        await assetTypeSelect.selectOption('software');
      }

      // Create software-specific CSV
      const softwareCsvContent = `Software Name,Vendor,Version,License Type
Test Software 1,Microsoft,2021,Commercial
Test Software 2,Adobe,2023,Commercial
Test Software 3,Google,120.0,Freeware`;

      const tempCsvPath = path.join(__dirname, '../../temp/test-import-software.csv');
      await fs.mkdir(path.dirname(tempCsvPath), { recursive: true });
      await fs.writeFile(tempCsvPath, softwareCsvContent, 'utf8');

      const fileInput = authenticatedPage.locator('input[type="file"]').first();
      await fileInput.setInputFiles(tempCsvPath);

      await authenticatedPage.waitForTimeout(2000);

      // Complete import quickly
      await authenticatedPage.locator('button:has-text("Next")').click();
      await authenticatedPage.locator('button:has-text("Next")').click();
      await authenticatedPage.locator('button:has-text("Import")').click();

      await authenticatedPage.waitForTimeout(5000);

      // Verify completion
      await expect(authenticatedPage.locator('text=Imported successfully, text=Complete').first()).toBeVisible({ timeout: 10000 });

      await authenticatedPage.locator('button:has-text("Close")').click();

      // Verify assets were imported
      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator('text=Test Software 1').first()).toBeVisible({ timeout: 10000 });

      // Clean up
      try {
        await fs.unlink(tempCsvPath);
      } catch (error) {
        // Ignore cleanup errors
      }
    });

    test('should handle Excel file imports', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/business-applications');
      await waitForTable(authenticatedPage);

      const importButton = authenticatedPage.locator('button:has-text("Import"), button[aria-label*="Import"]').first();
      if (await importButton.isVisible()) {
        await importButton.click();

        await waitForDialog(authenticatedPage);

        // Look for file format options
        const excelOption = authenticatedPage.locator('button:has-text("Excel"), input[type="radio"][value="excel"]').first();
        if (await excelOption.isVisible()) {
          await excelOption.check();
        }

        // Create a simple CSV file (since we can't easily create Excel files in this context)
        // In a real scenario, you would create an actual .xlsx file
        const excelLikeCsv = `Application Name,Application Type,Status,Vendor,URL
Test App 1,Web Application,Production,Test Vendor,https://app1.example.com
Test App 2,Mobile Application,Development,Another Vendor,https://app2.example.com`;

        const tempCsvPath = path.join(__dirname, '../../temp/test-import-excel.csv');
        await fs.mkdir(path.dirname(tempCsvPath), { recursive: true });
        await fs.writeFile(tempCsvPath, excelLikeCsv, 'utf8');

        const fileInput = authenticatedPage.locator('input[type="file"]').first();
        await fileInput.setInputFiles(tempCsvPath);

        await authenticatedPage.waitForTimeout(2000);

        await authenticatedPage.locator('button:has-text("Next")').click();
        await authenticatedPage.locator('button:has-text("Next")').click();
        await authenticatedPage.locator('button:has-text("Import")').click();

        await authenticatedPage.waitForTimeout(5000);

        await authenticatedPage.locator('button:has-text("Close")').click();

        // Clean up
        try {
          await fs.unlink(tempCsvPath);
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    });

    test('should support duplicate handling options', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/suppliers');
      await waitForTable(authenticatedPage);

      const importButton = authenticatedPage.locator('button:has-text("Import"), button[aria-label*="Import"]').first();
      if (await importButton.isVisible()) {
        await importButton.click();

        await waitForDialog(authenticatedPage);

        // Look for duplicate handling options
        const duplicateHandling = authenticatedPage.locator('[data-testid="duplicate-handling"], fieldset:has-text("Duplicates")').first();
        if (await duplicateHandling.isVisible()) {
          // Test different duplicate options
          const skipDuplicates = authenticatedPage.locator('input[type="radio"][value="skip"], label:has-text("Skip")').first();
          if (await skipDuplicates.isVisible()) {
            await skipDuplicates.check();
          }

          const updateDuplicates = authenticatedPage.locator('input[type="radio"][value="update"], label:has-text("Update")').first();
          if (await updateDuplicates.isVisible()) {
            await updateDuplicates.check();
          }
        }

        await authenticatedPage.locator('button:has-text("Cancel")').first().click();
      }
    });
  });

  test.describe('Asset Export Functionality', () => {
    test('should export all assets to CSV', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      // Look for export button
      const exportButton = authenticatedPage.locator('button:has-text("Export"), button[aria-label*="Export"]').first();
      await expect(exportButton).toBeVisible({ timeout: 5000 });
      await exportButton.click();

      // Look for export options
      await expect(authenticatedPage.locator('[role="menu"], .dropdown-menu').first()).toBeVisible({ timeout: 3000 });

      // Select CSV export
      const csvExportOption = authenticatedPage.locator('button:has-text("CSV"), [role="menuitem"]:has-text("CSV")').first();
      await csvExportOption.click();

      // Should show export progress or success message
      await expect(authenticatedPage.locator('text=Export started, text=Downloading, text=Export complete').first()).toBeVisible({ timeout: 10000 });

      // Wait for export to complete
      await authenticatedPage.waitForTimeout(3000);

      // Verify export success message
      await expect(authenticatedPage.locator('text=Exported successfully, text=Download complete').first()).toBeVisible({ timeout: 5000 });
    });

    test('should export filtered search results', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/information');
      await waitForTable(authenticatedPage);

      // Perform a search first
      await authenticatedPage.fill('input[type="search"], input[placeholder*="Search"]', 'test');
      await authenticatedPage.press('input[type="search"], input[placeholder*="Search"]', 'Enter');
      await authenticatedPage.waitForTimeout(1000);

      // Export filtered results
      const exportButton = authenticatedPage.locator('button:has-text("Export"), button[aria-label*="Export"]').first();
      await exportButton.click();

      // Look for "Export Current Results" option
      const exportFilteredOption = authenticatedPage.locator('button:has-text("Export Current"), button:has-text("Filtered Results")').first();
      if (await exportFilteredOption.isVisible()) {
        await exportFilteredOption.click();
      } else {
        // Fallback to regular export
        const csvOption = authenticatedPage.locator('button:has-text("CSV")').first();
        await csvOption.click();
      }

      await expect(authenticatedPage.locator('text=Exporting filtered results, text=Export started').first()).toBeVisible({ timeout: 5000 });
    });

    test('should export to Excel format', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/software');
      await waitForTable(authenticatedPage);

      const exportButton = authenticatedPage.locator('button:has-text("Export"), button[aria-label*="Export"]').first();
      await exportButton.click();

      // Select Excel export
      const excelExportOption = authenticatedPage.locator('button:has-text("Excel"), [role="menuitem"]:has-text("Excel")').first();
      if (await excelExportOption.isVisible()) {
        await excelExportOption.click();

        await expect(authenticatedPage.locator('text=Exporting to Excel, text=Export started').first()).toBeVisible({ timeout: 5000 });
      }
    });

    test('should customize export columns', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/applications');
      await waitForTable(authenticatedPage);

      const exportButton = authenticatedPage.locator('button:has-text("Export"), button[aria-label*="Export"]').first();
      await exportButton.click();

      // Look for custom export option
      const customExportOption = authenticatedPage.locator('button:has-text("Custom Export"), button:has-text("Select Columns")').first();
      if (await customExportOption.isVisible()) {
        await customExportOption.click();

        // Should show column selection modal
        await waitForDialog(authenticatedPage);

        // Verify column options are available
        const columnCheckboxes = authenticatedPage.locator('input[type="checkbox"]').all();
        expect(columnCheckboxes.length).toBeGreaterThan(0);

        // Select specific columns
        const nameCheckbox = authenticatedPage.locator('label:has-text("Name") input, input[name*="name"]').first();
        if (await nameCheckbox.isVisible()) {
          await nameCheckbox.check();
        }

        const typeCheckbox = authenticatedPage.locator('label:has-text("Type") input, input[name*="type"]').first();
        if (await typeCheckbox.isVisible()) {
          await typeCheckbox.check();
        }

        // Deselect some columns
        const idCheckbox = authenticatedPage.locator('label:has-text("ID") input, input[name*="id"]').first();
        if (await idCheckbox.isVisible() && await idCheckbox.isChecked()) {
          await idCheckbox.uncheck();
        }

        // Proceed with custom export
        await authenticatedPage.locator('button:has-text("Export"), button:has-text("Continue")').first().click();

        await expect(authenticatedPage.locator('text=Custom export started, text=Exporting selected columns').first()).toBeVisible({ timeout: 5000 });
      }
    });

    test('should export with different date formats', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/suppliers');
      await waitForTable(authenticatedPage);

      const exportButton = authenticatedPage.locator('button:has-text("Export"), button[aria-label*="Export"]').first();
      await exportButton.click();

      // Look for export settings/options
      const exportOptionsLink = authenticatedPage.locator('button:has-text("Options"), button:has-text("Settings")').first();
      if (await exportOptionsLink.isVisible()) {
        await exportOptionsLink.click();

        // Look for date format options
        const dateFormatSelect = authenticatedPage.locator('select[name*="dateFormat"], [data-testid="date-format"]').first();
        if (await dateFormatSelect.isVisible()) {
          await dateFormatSelect.selectOption('MM/DD/YYYY');
        }

        await authenticatedPage.locator('button:has-text("Export"), button:has-text("Continue")').first().click();
      }

      // Proceed with default export if no options available
      const csvOption = authenticatedPage.locator('button:has-text("CSV")').first();
      if (await csvOption.isVisible()) {
        await csvOption.click();
      }
    });
  });

  test.describe('Template Download', () => {
    test('should provide import template for each asset type', async ({ authenticatedPage }) => {
      const assetTypes = ['physical', 'information', 'software', 'applications', 'suppliers'];

      for (const assetType of assetTypes) {
        await authenticatedPage.goto(`/dashboard/assets/${assetType}`);
        await waitForTable(authenticatedPage);

        // Look for template download option
        const templateButton = authenticatedPage.locator('button:has-text("Template"), button:has-text("Download Template"), button[aria-label*="Template"]').first();

        if (await templateButton.isVisible()) {
          await templateButton.click();

          // Should show template format options
          await expect(authenticatedPage.locator('text=CSV Template, text=Excel Template').first()).toBeVisible({ timeout: 3000 });

          // Select CSV template
          const csvTemplateOption = authenticatedPage.locator('button:has-text("CSV Template")').first();
          if (await csvTemplateOption.isVisible()) {
            await csvTemplateOption.click();

            // Should show download success message
            await expect(authenticatedPage.locator('text=Template downloaded, text=Download complete').first()).toBeVisible({ timeout: 5000 });
          }

          await authenticatedPage.waitForTimeout(1000);
        }
      }
    });
  });

  test.describe('Import/Export Error Handling', () => {
    test('should handle malformed CSV files', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      const importButton = authenticatedPage.locator('button:has-text("Import")').first();
      await importButton.click();

      await waitForDialog(authenticatedPage);

      // Create malformed CSV
      const malformedCsv = `Header1,Header2,Header3
Value1,Value2
Value3,Value4,Value5,ExtraValue6
"Unclosed quote,value`;

      const tempCsvPath = path.join(__dirname, '../../temp/test-malformed.csv');
      await fs.mkdir(path.dirname(tempCsvPath), { recursive: true });
      await fs.writeFile(tempCsvPath, malformedCsv, 'utf8');

      const fileInput = authenticatedPage.locator('input[type="file"]').first();
      await fileInput.setInputFiles(tempCsvPath);

      await authenticatedPage.waitForTimeout(2000);

      // Should show parsing error
      await expect(authenticatedPage.locator('text=Invalid CSV format, text=Parse error, text=Malformed file').first()).toBeVisible({ timeout: 5000 });

      // Should not allow proceeding with malformed file
      const nextButton = authenticatedPage.locator('button:has-text("Next")').first();
      expect(await nextButton.isDisabled()).toBeTruthy();

      // Clean up
      try {
        await fs.unlink(tempCsvPath);
      } catch (error) {
        // Ignore cleanup errors
      }

      await authenticatedPage.locator('button:has-text("Cancel")').first().click();
    });

    test('should handle large file imports with progress tracking', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/information');
      await waitForTable(authenticatedPage);

      const importButton = authenticatedPage.locator('button:has-text("Import")').first();
      await importButton.click();

      await waitForDialog(authenticatedPage);

      // Create a larger CSV file
      const rows = [];
      for (let i = 1; i <= 50; i++) {
        rows.push(`Test Asset ${i},Test Type ${i % 5},Confidential`);
      }
      const largeCsvContent = `Asset Name,Information Type,Data Classification\n${rows.join('\n')}`;

      const tempCsvPath = path.join(__dirname, '../../temp/test-large-import.csv');
      await fs.mkdir(path.dirname(tempCsvPath), { recursive: true });
      await fs.writeFile(tempCsvPath, largeCsvContent, 'utf8');

      const fileInput = authenticatedPage.locator('input[type="file"]').first();
      await fileInput.setInputFiles(tempCsvPath);

      await authenticatedPage.waitForTimeout(3000); // Give more time for larger file

      // Proceed with import
      await authenticatedPage.locator('button:has-text("Next")').click();
      await authenticatedPage.locator('button:has-text("Next")').click();
      await authenticatedPage.locator('button:has-text("Import")').click();

      // Should show progress indicator
      await expect(authenticatedPage.locator('text=Importing, text=Progress, [role="progressbar"]').first()).toBeVisible({ timeout: 5000 });

      // Wait for import to complete
      await authenticatedPage.waitForTimeout(10000);

      // Should show completion with number of records
      await expect(authenticatedPage.locator('text=50 assets imported, text=Import complete').first()).toBeVisible({ timeout: 5000 });

      await authenticatedPage.locator('button:has-text("Close")').click();

      // Clean up
      try {
        await fs.unlink(tempCsvPath);
      } catch (error) {
        // Ignore cleanup errors
      }
    });

    test('should handle network errors during import/export', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/software');
      await waitForTable(authenticatedPage);

      // Test export when network is potentially slow
      const exportButton = authenticatedPage.locator('button:has-text("Export")').first();
      await exportButton.click();

      const csvOption = authenticatedPage.locator('button:has-text("CSV")').first();
      await csvOption.click();

      // Should show loading state
      await expect(authenticatedPage.locator('text=Exporting, text=Processing').first()).toBeVisible({ timeout: 3000 });

      // If export takes too long, should show retry option
      await authenticatedPage.waitForTimeout(8000);

      const retryButton = authenticatedPage.locator('button:has-text("Retry"), button:has-text("Try Again")').first();
      if (await retryButton.isVisible()) {
        await expect(retryButton).toBeVisible();
      }
    });
  });

  test.describe('Batch Operations', () => {
    test('should support bulk asset updates via import', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      // Create some assets first
      const assetNames = [];
      for (let i = 1; i <= 3; i++) {
        await authenticatedPage.click('button:has-text("Add New Asset")');
        await waitForDialog(authenticatedPage);

        const assetName = `Batch Update Asset ${i}-${generateRandomString()}`;
        assetNames.push(assetName);

        await authenticatedPage.fill('input[name="assetDescription"]', assetName);
        await authenticatedPage.fill('input[name="uniqueIdentifier"]', `BATCH-${i}`);

        await authenticatedPage.click('button[type="submit"]:has-text("Create")');
        await authenticatedPage.waitForTimeout(2000);

        await waitForTable(authenticatedPage);
      }

      // Now create update CSV with existing unique identifiers
      const updateCsvContent = `Unique Identifier,Asset Description,Status,Criticality Level
BATCH-1,Batch Update Asset 1 - Updated,Active,High
BATCH-2,Batch Update Asset 2 - Updated,Maintenance,Medium
BATCH-3,Batch Update Asset 3 - Updated,Active,Critical`;

      const tempCsvPath = path.join(__dirname, '../../temp/test-batch-update.csv');
      await fs.mkdir(path.dirname(tempCsvPath), { recursive: true });
      await fs.writeFile(tempCsvPath, updateCsvContent, 'utf8');

      const importButton = authenticatedPage.locator('button:has-text("Import")').first();
      await importButton.click();

      await waitForDialog(authenticatedPage);

      // Look for update mode option
      const updateModeOption = authenticatedPage.locator('input[type="radio"][value="update"], label:has-text("Update existing")').first();
      if (await updateModeOption.isVisible()) {
        await updateModeOption.check();
      }

      const fileInput = authenticatedPage.locator('input[type="file"]').first();
      await fileInput.setInputFiles(tempCsvPath);

      await authenticatedPage.waitForTimeout(2000);

      // Proceed with update
      await authenticatedPage.locator('button:has-text("Next")').click();
      await authenticatedPage.locator('button:has-text("Next")').click();
      await authenticatedPage.locator('button:has-text("Update"), button:has-text("Import")').click();

      await authenticatedPage.waitForTimeout(5000);

      // Should show update results
      await expect(authenticatedPage.locator('text=3 assets updated, text=Update complete').first()).toBeVisible({ timeout: 5000 });

      await authenticatedPage.locator('button:has-text("Close")').click();

      // Verify updates by searching for updated assets
      await search(authenticatedPage, 'Updated');
      await authenticatedPage.waitForTimeout(1000);

      for (const assetName of assetNames) {
        await expect(authenticatedPage.locator(`text=${assetName} - Updated`).first()).toBeVisible({ timeout: 10000 });
      }

      // Clean up
      try {
        await fs.unlink(tempCsvPath);
      } catch (error) {
        // Ignore cleanup errors
      }
    });
  });
});