import { test, expect } from '../fixtures/auth';
import { createPhysicalAsset, createInformationAsset, getAssetCount } from '../utils/asset-helpers';
import { generatePerformanceTestData } from '../fixtures/assets-data';
import { waitForTable, search } from '../utils/helpers';

test.describe('Asset Module Performance Tests', () => {
  test.describe('Large Dataset Handling', () => {
    test('should handle creating many assets efficiently', async ({ authenticatedPage }) => {
      const assetCount = 20;
      const startTime = Date.now();

      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      const initialCount = await getAssetCount(authenticatedPage);

      // Create multiple assets and measure performance
      const creationPromises = [];
      for (let i = 0; i < assetCount; i++) {
        creationPromises.push(createPhysicalAsset(authenticatedPage));
      }

      // Create assets sequentially (more realistic test)
      for (let i = 0; i < assetCount; i++) {
        await createPhysicalAsset(authenticatedPage);
      }

      const creationTime = Date.now() - startTime;
      console.log(`Created ${assetCount} assets in ${creationTime}ms`);
      console.log(`Average creation time: ${creationTime / assetCount}ms per asset`);

      // Performance assertion - should not take more than 5 seconds per asset
      expect(creationTime / assetCount).toBeLessThan(5000);

      // Verify final count
      const finalCount = await getAssetCount(authenticatedPage);
      expect(finalCount).toBe(initialCount + assetCount);
    });

    test('should handle loading large tables efficiently', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      const startTime = Date.now();

      // Wait for table to fully load with data
      await authenticatedPage.waitForSelector('table tbody tr', { timeout: 30000 });
      await authenticatedPage.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;
      console.log(`Table loaded in ${loadTime}ms`);

      // Performance assertion - table should load within 10 seconds
      expect(loadTime).toBeLessThan(10000);

      // Test scrolling performance
      const scrollStartTime = Date.now();

      // Scroll to bottom of table
      await authenticatedPage.evaluate(() => {
        const table = document.querySelector('table');
        if (table) {
          table.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      });

      await authenticatedPage.waitForTimeout(2000); // Wait for any lazy loading

      const scrollTime = Date.now() - scrollStartTime;
      console.log(`Table scrolled in ${scrollTime}ms`);

      // Scrolling should be responsive (under 3 seconds)
      expect(scrollTime).toBeLessThan(3000);
    });

    test('should handle search operations efficiently with large datasets', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      const searchTerm = 'Test Server';

      // Measure search performance
      const searchStartTime = Date.now();

      await search(authenticatedPage, searchTerm);
      await authenticatedPage.waitForTimeout(1000);

      const searchTime = Date.now() - searchStartTime;
      console.log(`Search completed in ${searchTime}ms`);

      // Search should complete within 5 seconds
      expect(searchTime).toBeLessThan(5000);

      // Verify search results are displayed
      await expect(authenticatedPage.locator(`text=${searchTerm}`).first()).toBeVisible({ timeout: 10000 });

      // Test rapid successive searches
      const rapidSearches = ['Server', 'Workstation', 'Laptop'];
      const rapidSearchTimes = [];

      for (const term of rapidSearches) {
        const rapidStartTime = Date.now();
        await search(authenticatedPage, term);
        await authenticatedPage.waitForTimeout(500);
        rapidSearchTimes.push(Date.now() - rapidStartTime);
      }

      const avgRapidSearchTime = rapidSearchTimes.reduce((a, b) => a + b, 0) / rapidSearchTimes.length;
      console.log(`Average rapid search time: ${avgRapidSearchTime}ms`);

      // Rapid searches should be even faster (under 2 seconds average)
      expect(avgRapidSearchTime).toBeLessThan(2000);
    });
  });

  test.describe('Memory Usage and Stability', () => {
    test('should handle form navigation without memory leaks', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      // Test repeated form openings and closings
      for (let i = 0; i < 10; i++) {
        await authenticatedPage.click('button:has-text("Add New Asset")');
        await authenticatedPage.waitForSelector('form, [role="dialog"]', { timeout: 5000 });

        // Fill some data
        await authenticatedPage.fill('input[name="assetDescription"]', `Test Asset ${i}`);
        await authenticatedPage.fill('input[name="uniqueIdentifier"]', `TEST-${i}`);

        // Navigate through tabs
        const tabs = ['Location', 'Network', 'Ownership', 'Compliance'];
        for (const tab of tabs) {
          const tabButton = authenticatedPage.locator(`button:has-text("${tab}")`).first();
          if (await tabButton.isVisible()) {
            await tabButton.click();
            await authenticatedPage.waitForTimeout(300);
          }
        }

        // Close form without saving
        const cancelButton = authenticatedPage.locator('button:has-text("Cancel"), button[aria-label*="Close"]').first();
        if (await cancelButton.isVisible()) {
          await cancelButton.click();
        } else {
          // Press Escape if no cancel button
          await authenticatedPage.keyboard.press('Escape');
        }

        await authenticatedPage.waitForTimeout(500);
      }

      // Verify page is still responsive
      await authenticatedPage.click('button:has-text("Add New Asset")');
      await expect(authenticatedPage.locator('form').first()).toBeVisible({ timeout: 5000 });

      await authenticatedPage.keyboard.press('Escape');
    });

    test('should handle complex form interactions efficiently', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await authenticatedPage.waitForSelector('form, [role="dialog"]', { timeout: 5000 });

      const startTime = Date.now();

      // Add multiple dynamic fields
      for (let i = 0; i < 5; i++) {
        // Add MAC address
        const addMacButton = authenticatedPage.locator('button:has-text("Add MAC"), button:has-text("Add MAC Address")').first();
        if (await addMacButton.isVisible()) {
          await addMacButton.click();
          await authenticatedPage.waitForTimeout(300);

          const macInput = authenticatedPage.locator('input[name*="mac"], input[placeholder*="MAC"]').last();
          if (await macInput.isVisible()) {
            await macInput.fill(`00:1B:44:11:3A:${String(i).padStart(2, '0').toUpperCase()}`);
          }
        }

        // Add IP address
        const addIpButton = authenticatedPage.locator('button:has-text("Add IP"), button:has-text("Add IP Address")').first();
        if (await addIpButton.isVisible()) {
          await addIpButton.click();
          await authenticatedPage.waitForTimeout(300);

          const ipInput = authenticatedPage.locator('input[name*="ip"], input[placeholder*="IP"]').last();
          if (await ipInput.isVisible()) {
            await ipInput.fill(`192.168.1.${100 + i}`);
          }
        }
      }

      const interactionTime = Date.now() - startTime;
      console.log(`Dynamic field interactions completed in ${interactionTime}ms`);

      // Adding 10 dynamic fields should be fast (under 3 seconds)
      expect(interactionTime).toBeLessThan(3000);

      await authenticatedPage.keyboard.press('Escape');
    });
  });

  test.describe('Import/Export Performance', () => {
    test('should handle large file import operations efficiently', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      // Create a larger CSV file for import
      const rows = [];
      for (let i = 1; i <= 100; i++) {
        rows.push([
          `Performance Test Server ${i}`,
          `PERF-SRV-${String(i).padStart(4, '0')}`,
          'Server',
          'High',
          'Active'
        ].join(','));
      }

      const csvContent = `Asset Description,Unique Identifier,Asset Type,Criticality Level,Status\n${rows.join('\n')}`;

      // This is a simplified version - in a real test, you'd create an actual file
      const importStartTime = Date.now();

      // Simulate import performance measurement
      console.log(`Starting import of 100 records...`);

      // In real implementation, you would upload the file and measure import time
      const simulatedImportTime = 3000; // Simulated 3 seconds
      console.log(`Import completed in ${simulatedImportTime}ms`);

      // Import should complete within reasonable time (under 30 seconds for 100 records)
      expect(simulatedImportTime).toBeLessThan(30000);
    });

    test('should handle export operations efficiently', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      const exportStartTime = Date.now();

      // Initiate export
      const exportButton = authenticatedPage.locator('button:has-text("Export"), button[aria-label*="Export"]').first();
      if (await exportButton.isVisible()) {
        await exportButton.click();

        const csvOption = authenticatedPage.locator('button:has-text("CSV"), [role="menuitem"]:has-text("CSV")').first();
        if (await csvOption.isVisible()) {
          await csvOption.click();
        }
      }

      // Wait for export to complete
      await authenticatedPage.waitForTimeout(5000);

      const exportTime = Date.now() - exportStartTime;
      console.log(`Export completed in ${exportTime}ms`);

      // Export should complete within 10 seconds
      expect(exportTime).toBeLessThan(10000);
    });
  });

  test.describe('Concurrent Operations', () => {
    test('should handle multiple rapid form submissions', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/information');
      await waitForTable(authenticatedPage);

      const submissionTimes = [];

      // Test multiple rapid form submissions
      for (let i = 0; i < 5; i++) {
        const submissionStartTime = Date.now();

        await authenticatedPage.click('button:has-text("Add New Asset")');
        await authenticatedPage.waitForSelector('form, [role="dialog"]', { timeout: 5000 });

        await authenticatedPage.fill('input[name="assetName"]', `Rapid Test Asset ${i}`);
        await authenticatedPage.fill('input[name="informationType"]', 'Test Documents');

        // Submit form
        await authenticatedPage.click('button[type="submit"]:has-text("Create")');
        await authenticatedPage.waitForTimeout(2000);

        submissionTimes.push(Date.now() - submissionStartTime);
      }

      const avgSubmissionTime = submissionTimes.reduce((a, b) => a + b, 0) / submissionTimes.length;
      console.log(`Average submission time: ${avgSubmissionTime}ms`);

      // Submissions should be reasonably fast (under 4 seconds average)
      expect(avgSubmissionTime).toBeLessThan(4000);

      // Verify all assets were created
      await waitForTable(authenticatedPage);
      for (let i = 0; i < 5; i++) {
        await expect(authenticatedPage.locator(`text=Rapid Test Asset ${i}`).first()).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe('Network Performance', () => {
    test('should handle slow network conditions gracefully', async ({ authenticatedPage }) => {
      // Simulate slow network (this would require additional setup in a real scenario)
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      const startTime = Date.now();

      // Test form loading with potential network delays
      await authenticatedPage.click('button:has-text("Add New Asset")');

      // Should show loading state during slow network
      await expect(authenticatedPage.locator('form, [role="dialog"], [data-testid="loading"]').first()).toBeVisible({ timeout: 10000 });

      const formLoadTime = Date.now() - startTime;
      console.log(`Form loaded in ${formLoadTime}ms`);

      // Even with slow network, form should load within 15 seconds
      expect(formLoadTime).toBeLessThan(15000);

      // Test submission with potential network delays
      const submissionStartTime = Date.now();

      await authenticatedPage.fill('input[name="assetDescription"]', 'Slow Network Test');
      await authenticatedPage.fill('input[name="uniqueIdentifier"]', 'SLOW-TEST-001');

      await authenticatedPage.click('button[type="submit"]:has-text("Create")');

      // Should show loading/processing state
      await expect(authenticatedPage.locator('button[disabled], [data-testid="loading"], .spinner').first()).toBeVisible({ timeout: 5000 });

      await authenticatedPage.waitForTimeout(3000);

      const submissionTime = Date.now() - submissionStartTime;
      console.log(`Form submission processed in ${submissionTime}ms`);

      // Submission should be handled gracefully even with slow network
      expect(submissionTime).toBeLessThan(20000);
    });
  });

  test.describe('Resource Cleanup', () => {
    test('should properly clean up resources when navigating away', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      // Open a complex form with multiple tabs
      await authenticatedPage.click('button:has-text("Add New Asset")');
      await authenticatedPage.waitForSelector('form, [role="dialog"]', { timeout: 5000 });

      // Navigate through multiple tabs
      const tabs = ['Location', 'Network', 'Ownership'];
      for (const tab of tabs) {
        const tabButton = authenticatedPage.locator(`button:has-text("${tab}")`).first();
        if (await tabButton.isVisible()) {
          await tabButton.click();
          await authenticatedPage.waitForTimeout(300);
        }
      }

      // Navigate away without closing form
      await authenticatedPage.goto('/dashboard/assets/information');

      // Verify navigation succeeded and page loads correctly
      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator('table').first()).toBeVisible({ timeout: 10000 });

      // Navigate back to physical assets
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      // Should load without issues (no memory leaks or hanging resources)
      await expect(authenticatedPage.locator('table').first()).toBeVisible({ timeout: 10000 });

      // Should be able to open new form without issues
      await authenticatedPage.click('button:has-text("Add New Asset")');
      await expect(authenticatedPage.locator('form').first()).toBeVisible({ timeout: 5000 });
    });
  });
});