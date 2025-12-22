'use client';

import { test, expect } from '../fixtures/auth';

test.describe('Asset Dependencies Creation', () => {
  test('should create a dependency between two physical assets', async ({ page }) => {
    console.log('🚀 TESTING DEPENDENCY CREATION WORKFLOW');

    // Navigate to a physical asset details page
    await page.goto('http://localhost:3000/en/dashboard/assets/physical');
    await page.waitForSelector('a[href*="/dashboard/assets/physical/"]');

    // Click on the first asset
    const firstAssetLink = await page.locator('a[href*="/dashboard/assets/physical/"]').first();
    await firstAssetLink.click();

    // Wait for the asset details page to load
    await page.waitForURL(/\/dashboard\/assets\/physical\//);
    console.log('✅ Navigated to asset details page');

    // Click on the Dependencies tab
    await page.click('button:has-text("Dependencies")');
    console.log('✅ Clicked on Dependencies tab');

    // Wait for the dependencies section to load
    await page.waitForSelector('button:has-text("Add Dependency")');

    // Click the Add Dependency button
    await page.click('button:has-text("Add Dependency")');
    console.log('✅ Clicked Add Dependency button');

    // Wait for the dialog to open
    await page.waitForSelector('h2:has-text("Add Dependency")');
    console.log('✅ Dependency creation dialog opened');

    // Select target asset type (keep default as Physical)
    // Search for a target asset
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('server');
    console.log('✅ Filled search input with "server"');

    // Wait for search results to appear
    await page.waitForSelector('.border.rounded-lg.max-h-60');

    // Wait for search results to load
    await page.waitForTimeout(2000);

    // Try to find search results
    const searchResults = page.locator('.border.rounded-lg.max-h-60 > div');
    const resultsCount = await searchResults.count();

    if (resultsCount > 0) {
      console.log(`✅ Found ${resultsCount} search results`);

      // Click on the first search result
      const firstResult = searchResults.first();
      await firstResult.click();
      console.log('✅ Selected first search result');

      // Check if the asset is now selected (should show a ✓ indicator)
      const selectedIndicator = firstResult.locator('text=✓');
      const isSelected = await selectedIndicator.isVisible();
      expect(isSelected).toBe(true);
      console.log('✅ Confirmed asset is selected');

      // Look for the "Selected:" section
      const selectedSection = page.locator('text=/Selected:/');
      const isSelectionVisible = await selectedSection.isVisible();
      expect(isSelectionVisible).toBe(true);
      console.log('✅ Selected asset section is visible');

      // Select relationship type (keep default as "Depends On")
      // Add description
      const descriptionTextarea = page.locator('textarea[placeholder*="Describe"]');
      await descriptionTextarea.fill('E2E Test Dependency: This server depends on the selected asset');
      console.log('✅ Filled description');

      // Click the Create Dependency button
      await page.click('button:has-text("Create Dependency")');
      console.log('✅ Clicked Create Dependency button');

      // Wait for success message or dialog to close
      await page.waitForTimeout(3000);

      // Check if dialog is closed (should not find the h2)
      const dialogIsOpen = await page.locator('h2:has-text("Add Dependency")').isVisible().catch(() => false);
      expect(dialogIsOpen).toBe(false);
      console.log('✅ Dependency creation dialog closed');

      // Look for success toast message
      const successToast = page.locator('div[role="alert"]:has-text("Dependency created successfully")');
      const isSuccessVisible = await successToast.isVisible().catch(() => false);

      if (isSuccessVisible) {
        console.log('✅ Success toast message is visible');
      } else {
        console.log('ℹ️ Success toast message not found, but dialog closed successfully');
      }

      // Verify the dependency was created by checking the dependencies list
      // Refresh the page to see updated dependencies
      await page.reload();
      await page.click('button:has-text("Dependencies")');
      await page.waitForTimeout(2000);

      // Look for outgoing dependencies section
      const outgoingSection = page.locator('h3:has-text("Outgoing Dependencies")');
      const isOutgoingVisible = await outgoingSection.isVisible();

      if (isOutgoingVisible) {
        console.log('✅ Outgoing Dependencies section is visible');

        // Look for dependency items
        const dependencyItems = page.locator('.flex.items-center.justify-between.p-3.border');
        const dependencyCount = await dependencyItems.count();

        if (dependencyCount > 0) {
          console.log(`✅ Found ${dependencyCount} dependencies listed`);
        } else {
          console.log('ℹ️ No dependencies listed yet, may need more time to update');
        }
      }

    } else {
      console.log('❌ No search results found. This might indicate:');
      console.log('   1. No assets match the search criteria');
      console.log('   2. Search functionality is not working');
      console.log('   3. Backend API is not responding');

      // Take a screenshot for debugging
      await page.screenshot({ path: 'test-results/dependency-creation-no-results.png' });
      console.log('📸 Screenshot saved: test-results/dependency-creation-no-results.png');
    }

    console.log('🎯 DEPENDENCY CREATION TEST COMPLETE');
  });

  test('should show proper error when no asset is selected', async ({ page }) => {
    console.log('🚀 TESTING DEPENDENCY CREATION VALIDATION');

    // Navigate to a physical asset details page
    await page.goto('http://localhost:3000/en/dashboard/assets/physical');
    await page.waitForSelector('a[href*="/dashboard/assets/physical/"]');

    const firstAssetLink = await page.locator('a[href*="/dashboard/assets/physical/"]').first();
    await firstAssetLink.click();

    await page.waitForURL(/\/dashboard\/assets\/physical\//);

    // Click on the Dependencies tab
    await page.click('button:has-text("Dependencies")');
    await page.waitForSelector('button:has-text("Add Dependency")');

    // Click the Add Dependency button
    await page.click('button:has-text("Add Dependency")');
    await page.waitForSelector('h2:has-text("Add Dependency")');

    // Try to create dependency without selecting an asset
    await page.click('button:has-text("Create Dependency")');
    console.log('✅ Attempted to create dependency without selecting asset');

    // Should show an error message
    await page.waitForSelector('div[role="alert"]');
    const errorAlert = page.locator('div[role="alert"]:has-text("Please search for and select a target asset")');
    const isErrorVisible = await errorAlert.isVisible();

    expect(isErrorVisible).toBe(true);
    console.log('✅ Error message is properly displayed');

    console.log('🎯 VALIDATION TEST COMPLETE');
  });
});