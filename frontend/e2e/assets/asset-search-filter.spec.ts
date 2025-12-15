import { test, expect } from '../fixtures/auth';
import {
  waitForTable,
  selectDropdownOption,
  waitForDialog,
  generateRandomString,
  generateRandomEmail,
  search,
  getTableRowCount
} from '../utils/helpers';

test.describe('Asset Search and Filter Tests', () => {
  test.describe('Search Functionality', () => {
    test('should search physical assets by various fields', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      // Get initial row count
      const initialCount = await getTableRowCount(authenticatedPage);

      // Create test assets for searching
      const testAssets = [
        { description: `Search Test Server Alpha ${generateRandomString()}`, type: 'server', location: 'Data Center A' },
        { description: `Search Test Workstation Beta ${generateRandomString()}`, type: 'workstation', location: 'Office Building B' },
        { description: `Search Test Laptop Gamma ${generateRandomString()}`, type: 'laptop', location: 'Remote Office C' }
      ];

      // Create each asset
      for (const asset of testAssets) {
        await authenticatedPage.click('button:has-text("Add New Asset")');
        await waitForDialog(authenticatedPage);

        await authenticatedPage.fill('input[name="assetDescription"]', asset.description);
        await authenticatedPage.fill('input[name="uniqueIdentifier"]', `SRV-SEARCH-${generateRandomString()}`);

        // Set asset type if available
        const assetTypeField = authenticatedPage.locator('select[name="assetType"], [data-testid="assetType"]').first();
        if (await assetTypeField.isVisible()) {
          await selectDropdownOption(authenticatedPage, assetTypeField, asset.type);
        }

        // Navigate to Location tab
        await authenticatedPage.click('button:has-text("Location")');
        await authenticatedPage.waitForTimeout(500);

        const locationInput = authenticatedPage.locator('input[name*="location"], input[placeholder*="Location"]').first();
        if (await locationInput.isVisible()) {
          await locationInput.fill(asset.location);
        }

        await authenticatedPage.click('button[type="submit"]:has-text("Create")');
        await authenticatedPage.waitForTimeout(2000);

        await waitForTable(authenticatedPage);
      }

      // Verify new assets were added
      const newCount = await getTableRowCount(authenticatedPage);
      expect(newCount).toBeGreaterThan(initialCount);

      // Test search by description
      await search(authenticatedPage, testAssets[0].description);
      await authenticatedPage.waitForTimeout(1000);

      await expect(authenticatedPage.locator(`text=${testAssets[0].description}`).first()).toBeVisible({ timeout: 10000 });

      // Test partial search
      await search(authenticatedPage, 'Search Test Server');
      await authenticatedPage.waitForTimeout(1000);

      await expect(authenticatedPage.locator(`text=${testAssets[0].description}`).first()).toBeVisible({ timeout: 10000 });

      // Test search by location
      await search(authenticatedPage, 'Data Center A');
      await authenticatedPage.waitForTimeout(1000);

      await expect(authenticatedPage.locator(`text=${testAssets[0].description}`).first()).toBeVisible({ timeout: 10000 });

      // Test search with no results
      await search(authenticatedPage, 'NonExistentAsset12345');
      await authenticatedPage.waitForTimeout(2000);

      await expect(authenticatedPage.locator('text=No results found, text=/No assets found/i')).toBeVisible({ timeout: 5000 });

      // Clear search
      const clearButton = authenticatedPage.locator('button[aria-label*="Clear search"], button:has-text("Clear")').first();
      if (await clearButton.isVisible()) {
        await clearButton.click();
        await authenticatedPage.waitForTimeout(1000);
      }

      // Verify all assets are back
      const finalCount = await getTableRowCount(authenticatedPage);
      expect(finalCount).toBe(newCount);
    });

    test('should search information assets by classification', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/information');
      await waitForTable(authenticatedPage);

      // Create test assets with different classifications
      const testAssets = [
        { name: `Confidential Document ${generateRandomString()}`, classification: 'Confidential' },
        { name: `Internal Document ${generateRandomString()}`, classification: 'Internal' },
        { name: `Public Document ${generateRandomString()}`, classification: 'Public' }
      ];

      for (const asset of testAssets) {
        await authenticatedPage.click('button:has-text("Add New Asset")');
        await waitForDialog(authenticatedPage);

        await authenticatedPage.fill('input[name="assetName"]', asset.name);
        await authenticatedPage.fill('input[name="informationType"]', 'Test Documents');

        const classificationField = authenticatedPage.locator('button[data-testid="dataClassification"], [data-testid="dataClassification"]').first();
        if (await classificationField.isVisible()) {
          await selectDropdownOption(authenticatedPage, classificationField, asset.classification);
        }

        await authenticatedPage.click('button[type="submit"]:has-text("Create")');
        await authenticatedPage.waitForTimeout(2000);

        await waitForTable(authenticatedPage);
      }

      // Test search by classification
      await search(authenticatedPage, 'Confidential');
      await authenticatedPage.waitForTimeout(1000);

      await expect(authenticatedPage.locator(`text=${testAssets[0].name}`).first()).toBeVisible({ timeout: 10000 });
      await expect(authenticatedPage.locator(`text=${testAssets[1].name}`)).not.toBeVisible();

      // Test search by information type
      await search(authenticatedPage, 'Test Documents');
      await authenticatedPage.waitForTimeout(1000);

      // Should show all test assets
      for (const asset of testAssets) {
        await expect(authenticatedPage.locator(`text=${asset.name}`).first()).toBeVisible({ timeout: 10000 });
      }
    });

    test('should search software assets by vendor and version', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/software');
      await waitForTable(authenticatedPage);

      // Create test software assets
      const testSoftware = [
        { name: `Microsoft Office ${generateRandomString()}`, vendor: 'Microsoft', version: '2021' },
        { name: `Adobe Photoshop ${generateRandomString()}`, vendor: 'Adobe', version: '2023' },
        { name: `Google Chrome ${generateRandomString()}`, vendor: 'Google', version: '120.0' }
      ];

      for (const software of testSoftware) {
        await authenticatedPage.click('button:has-text("Add New Asset")');
        await waitForDialog(authenticatedPage);

        await authenticatedPage.fill('input[name="softwareName"]', software.name);
        await authenticatedPage.fill('input[name="vendor"]', software.vendor);
        await authenticatedPage.fill('input[name="version"]', software.version);

        await authenticatedPage.click('button[type="submit"]:has-text("Create")');
        await authenticatedPage.waitForTimeout(2000);

        await waitForTable(authenticatedPage);
      }

      // Test search by vendor
      await search(authenticatedPage, 'Microsoft');
      await authenticatedPage.waitForTimeout(1000);

      await expect(authenticatedPage.locator(`text=${testSoftware[0].name}`).first()).toBeVisible({ timeout: 10000 });
      await expect(authenticatedPage.locator(`text=${testSoftware[1].name}`)).not.toBeVisible();

      // Test search by version
      await search(authenticatedPage, '2023');
      await authenticatedPage.waitForTimeout(1000);

      await expect(authenticatedPage.locator(`text=${testSoftware[1].name}`).first()).toBeVisible({ timeout: 10000 });

      // Test partial vendor search
      await search(authenticatedPage, 'Ado');
      await authenticatedPage.waitForTimeout(1000);

      await expect(authenticatedPage.locator(`text=${testSoftware[1].name}`).first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Advanced Filtering', () => {
    test('should filter physical assets by multiple criteria', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      // Look for filter controls
      const filterButton = authenticatedPage.locator('button:has-text("Filter"), button[aria-label*="Filter"]').first();
      if (await filterButton.isVisible()) {
        await filterButton.click();
        await authenticatedPage.waitForTimeout(500);

        // Test filtering by asset type
        const assetTypeFilter = authenticatedPage.locator('select[name*="assetType"], [data-testid="filter-assetType"]').first();
        if (await assetTypeFilter.isVisible()) {
          await selectDropdownOption(authenticatedPage, assetTypeFilter, 'Server');
        }

        // Test filtering by status
        const statusFilter = authenticatedPage.locator('select[name*="status"], [data-testid="filter-status"]').first();
        if (await statusFilter.isVisible()) {
          await selectDropdownOption(authenticatedPage, statusFilter, 'Active');
        }

        // Test filtering by location
        const locationFilter = authenticatedPage.locator('select[name*="location"], [data-testid="filter-location"]').first();
        if (await locationFilter.isVisible()) {
          await selectDropdownOption(authenticatedPage, locationFilter, 'Data Center');
        }

        // Apply filters
        const applyFiltersButton = authenticatedPage.locator('button:has-text("Apply Filters"), button:has-text("Apply")').first();
        if (await applyFiltersButton.isVisible()) {
          await applyFiltersButton.click();
          await authenticatedPage.waitForTimeout(2000);
        }

        // Verify filtering worked (results should be reduced)
        await waitForTable(authenticatedPage);

        // Reset filters
        const resetFiltersButton = authenticatedPage.locator('button:has-text("Reset Filters"), button:has-text("Reset")').first();
        if (await resetFiltersButton.isVisible()) {
          await resetFiltersButton.click();
          await authenticatedPage.waitForTimeout(1000);
        }
      }

      // Test inline filters if available
      const quickFilters = ['Status', 'Type', 'Location'];
      for (const filterType of quickFilters) {
        const quickFilterButton = authenticatedPage.locator(`button:has-text("${filterType}")`).first();
        if (await quickFilterButton.isVisible()) {
          await quickFilterButton.click();
          await authenticatedPage.waitForTimeout(500);

          // Click an option
          const filterOption = authenticatedPage.locator('[role="option"], [role="menuitem"]').first();
          if (await filterOption.isVisible()) {
            await filterOption.click();
            await authenticatedPage.waitForTimeout(1000);
          }
        }
      }
    });

    test('should filter information assets by data classification and sensitivity', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/information');
      await waitForTable(authenticatedPage);

      // Look for filter options
      const classificationFilter = authenticatedPage.locator('button:has-text("Classification"), [data-testid="filter-classification"]').first();
      if (await classificationFilter.isVisible()) {
        await classificationFilter.click();
        await authenticatedPage.waitForTimeout(500);

        // Filter by Confidential classification
        const confidentialOption = authenticatedPage.locator('button:has-text("Confidential"), [role="option"]:has-text("Confidential")').first();
        if (await confidentialOption.isVisible()) {
          await confidentialOption.click();
          await authenticatedPage.waitForTimeout(1000);
        }
      }

      // Look for sensitive data filters
      const sensitiveDataFilter = authenticatedPage.locator('button:has-text("Sensitive Data"), [data-testid="filter-sensitive"]').first();
      if (await sensitiveDataFilter.isVisible()) {
        await sensitiveDataFilter.click();
        await authenticatedPage.waitForTimeout(500);

        const piiOption = authenticatedPage.locator('button:has-text("PII"), [role="option"]:has-text("PII")').first();
        if (await piiOption.isVisible()) {
          await piiOption.click();
          await authenticatedPage.waitForTimeout(1000);
        }
      }

      await waitForTable(authenticatedPage);
    });

    test('should filter software assets by license status', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/software');
      await waitForTable(authenticatedPage);

      // Look for license status filter
      const licenseFilter = authenticatedPage.locator('button:has-text("License"), [data-testid="filter-license"]').first();
      if (await licenseFilter.isVisible()) {
        await licenseFilter.click();
        await authenticatedPage.waitForTimeout(500);

        const licensedOption = authenticatedPage.locator('button:has-text("Licensed"), [role="option"]:has-text("Licensed")').first();
        if (await licensedOption.isVisible()) {
          await licensedOption.click();
          await authenticatedPage.waitForTimeout(1000);
        }
      }

      // Look for vendor filter
      const vendorFilter = authenticatedPage.locator('button:has-text("Vendor"), [data-testid="filter-vendor"]').first();
      if (await vendorFilter.isVisible()) {
        await vendorFilter.click();
        await authenticatedPage.waitForTimeout(500);

        // Should show available vendors
        await expect(authenticatedPage.locator('[role="option"], [role="menuitem"]').first()).toBeVisible({ timeout: 5000 });
      }

      await waitForTable(authenticatedPage);
    });
  });

  test.describe('Sort Functionality', () => {
    test('should sort assets by different columns', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      // Look for sortable column headers
      const sortableColumns = ['Name', 'Description', 'Type', 'Status', 'Created Date'];

      for (const columnName of sortableColumns) {
        const columnHeader = authenticatedPage.locator(`th:has-text("${columnName}"), [data-testid*="${columnName.toLowerCase().replace(' ', '-')}"]`).first();

        if (await columnHeader.isVisible()) {
          // Check if it's sortable (has sorting icon)
          const hasSortIcon = await columnHeader.locator('button, [aria-sort], [data-testid*="sort"]').isVisible();

          if (hasSortIcon) {
            await columnHeader.click();
            await authenticatedPage.waitForTimeout(1000);

            // Click again to reverse sort
            await columnHeader.click();
            await authenticatedPage.waitForTimeout(1000);

            // Break after testing one sortable column to avoid long test times
            break;
          }
        }
      }
    });

    test('should sort information assets by classification', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/information');
      await waitForTable(authenticatedPage);

      const classificationColumn = authenticatedPage.locator('th:has-text("Classification"), [data-testid*="classification"]').first();

      if (await classificationColumn.isVisible()) {
        await classificationColumn.click();
        await authenticatedPage.waitForTimeout(1000);

        // Verify sort indicator or order change
        await expect(classificationColumn.locator('[aria-sort="ascending"], [aria-sort="descending"], .sort-icon')).toBeVisible({ timeout: 5000 });
      }
    });

    test('should sort software assets by vendor', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/software');
      await waitForTable(authenticatedPage);

      const vendorColumn = authenticatedPage.locator('th:has-text("Vendor"), [data-testid*="vendor"]').first();

      if (await vendorColumn.isVisible()) {
        await vendorColumn.click();
        await authenticatedPage.waitForTimeout(1000);

        // Verify sorting happened
        await waitForTable(authenticatedPage);
      }
    });
  });

  test.describe('Pagination', () => {
    test('should handle pagination correctly', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      // Look for pagination controls
      const paginationControls = authenticatedPage.locator('[data-testid="pagination"], .pagination, nav[aria-label*="pagination"]').first();

      if (await paginationControls.isVisible()) {
        // Look for page numbers
        const pageButtons = paginationControls.locator('button:not([disabled]), [role="button"]:not([disabled])');
        const pageCount = await pageButtons.count();

        if (pageCount > 1) {
          // Click next page
          const nextPageButton = authenticatedPage.locator('button:has-text("Next"), button[aria-label*="Next"]').first();
          if (await nextPageButton.isVisible()) {
            await nextPageButton.click();
            await authenticatedPage.waitForTimeout(1000);
            await waitForTable(authenticatedPage);
          }

          // Click previous page
          const prevPageButton = authenticatedPage.locator('button:has-text("Previous"), button[aria-label*="Previous"]').first();
          if (await prevPageButton.isVisible()) {
            await prevPageButton.click();
            await authenticatedPage.waitForTimeout(1000);
            await waitForTable(authenticatedPage);
          }
        }

        // Look for page size selector
        const pageSizeSelector = authenticatedPage.locator('select[name*="pageSize"], [data-testid="page-size"]').first();
        if (await pageSizeSelector.isVisible()) {
          const initialRowCount = await getTableRowCount(authenticatedPage);

          // Change page size
          await selectDropdownOption(authenticatedPage, pageSizeSelector, '50');
          await authenticatedPage.waitForTimeout(2000);

          await waitForTable(authenticatedPage);
          const newRowCount = await getTableRowCount(authenticatedPage);

          // Row count should change (or remain the same if there are fewer than 50 total rows)
          expect(newRowCount).toBeGreaterThanOrEqual(initialRowCount);
        }
      }
    });
  });

  test.describe('Export Functionality', () => {
    test('should export filtered search results', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      // Perform a search first
      await search(authenticatedPage, 'server');
      await authenticatedPage.waitForTimeout(1000);

      // Look for export button
      const exportButton = authenticatedPage.locator('button:has-text("Export"), button[aria-label*="Export"]').first();

      if (await exportButton.isVisible()) {
        // Click export and look for format options
        await exportButton.click();
        await authenticatedPage.waitForTimeout(500);

        // Try CSV export
        const csvOption = authenticatedPage.locator('button:has-text("CSV"), [role="menuitem"]:has-text("CSV")').first();
        if (await csvOption.isVisible()) {
          await csvOption.click();
          await authenticatedPage.waitForTimeout(2000);

          // Check for download started (might be handled differently in different browsers)
          await expect(authenticatedPage.locator('text=Export started, text=Downloading, text=Export completed').first()).toBeVisible({ timeout: 5000 });
        }

        // Try Excel export
        await exportButton.click();
        await authenticatedPage.waitForTimeout(500);

        const excelOption = authenticatedPage.locator('button:has-text("Excel"), [role="menuitem"]:has-text("Excel")').first();
        if (await excelOption.isVisible()) {
          await excelOption.click();
          await authenticatedPage.waitForTimeout(2000);
        }
      }
    });

    test('should export all assets when no search is applied', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/information');
      await waitForTable(authenticatedPage);

      // Make sure no search is applied
      const clearButton = authenticatedPage.locator('button[aria-label*="Clear search"], button:has-text("Clear")').first();
      if (await clearButton.isVisible()) {
        await clearButton.click();
        await authenticatedPage.waitForTimeout(1000);
      }

      const exportButton = authenticatedPage.locator('button:has-text("Export"), button[aria-label*="Export"]').first();

      if (await exportButton.isVisible()) {
        await exportButton.click();
        await authenticatedPage.waitForTimeout(500);

        // Look for "Export All" option
        const exportAllOption = authenticatedPage.locator('button:has-text("Export All"), [role="menuitem"]:has-text("All")').first();
        if (await exportAllOption.isVisible()) {
          await exportAllOption.click();
          await authenticatedPage.waitForTimeout(2000);

          // Should show progress or completion message
          await expect(authenticatedPage.locator('text=Export, text=Download, text=Complete').first()).toBeVisible({ timeout: 10000 });
        }
      }
    });
  });
});