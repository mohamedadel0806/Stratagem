'use client';

import { test, expect } from '../fixtures/auth';

test.describe('Targeted Dependency Creation Test', () => {
  test('should test dependency creation with known asset IDs', async ({ page }) => {
    console.log('🎯 TESTING DEPENDENCY CREATION WITH KNOWN ASSET IDS');

    // Navigate directly to a specific physical asset we know exists
    const knownAssetId = '99cb990a-29e4-4e34-acf4-d58b8261046b';
    await page.goto(`http://localhost:3000/en/dashboard/assets/physical/${knownAssetId}`);
    await page.waitForTimeout(2000);
    console.log('✅ Navigated to known physical asset');

    // Check if we're on the correct page
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);

    // Click Dependencies tab - use the same selector that worked in comprehensive test
    const dependenciesTab = page.locator('[role="tab"]:has-text("Dependencies")');
    await dependenciesTab.click();
    await page.waitForTimeout(2000);
    console.log('✅ Clicked Dependencies tab');

    // Check current dependency state
    const dependencyElements = page.locator('[data-testid^="dependency-item-"], [role="listitem"]');
    const currentDependencies = await dependencyElements.count();
    console.log(`📋 Current dependencies: ${currentDependencies}`);

    // Click Add Dependency button
    await page.click('button:has-text("Add Dependency")');
    await page.waitForSelector('h2:has-text("Add Dependency")');
    console.log('✅ Opened Add Dependency dialog');

    // Test the accessibility fixes
    console.log('🔧 Testing accessibility fixes...');

    // Search for assets
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill('server');
    console.log('✅ Filled search input with "server"');

    // Wait for search results
    await page.waitForTimeout(5000);

    // Check for accessible search results with the new attributes
    const accessibleResults = page.locator('[data-testid^="asset-search-result-"]');
    const resultsCount = await accessibleResults.count();

    console.log(`📋 Found ${resultsCount} accessible search results with data-testid`);

    // Also check for role="button" elements
    const roleButtonResults = page.locator('[role="button"][data-asset-id]');
    const roleButtonCount = await roleButtonResults.count();

    console.log(`📋 Found ${roleButtonCount} search results with role="button"`);

    if (resultsCount > 0 || roleButtonCount > 0) {
      console.log('✅ SUCCESS: Accessibility fixes working! Search results are accessible');

      // Try to click the first result
      const targetElement = resultsCount > 0 ? accessibleResults.first() : roleButtonResults.first();

      // Get asset info before clicking
      const assetInfo = await targetElement.evaluate(el => ({
        name: el.getAttribute('data-asset-name'),
        id: el.getAttribute('data-asset-id'),
        type: el.getAttribute('data-asset-type')
      }));

      console.log(`🎯 Clicking asset: ${JSON.stringify(assetInfo)}`);

      await targetElement.click();
      console.log('✅ Successfully clicked accessible search result');

      // Check if selection indicator appears
      const selectedIndicator = targetElement.locator('text=✓');
      const isSelected = await selectedIndicator.isVisible();
      console.log(`✅ Selection indicator visible: ${isSelected}`);

      // Fill description
      const descriptionTextarea = page.locator('textarea[placeholder*="Describe"]').first();
      await descriptionTextarea.fill(`E2E Test dependency - ${assetInfo.name} - Accessibility Fix Test`);
      console.log('✅ Filled description');

      // Check Create button state
      const createButton = page.locator('button:has-text("Create Dependency")').first();
      const isCreateEnabled = await createButton.isEnabled();
      console.log(`🔘 Create button enabled: ${isCreateEnabled}`);

      if (isCreateEnabled) {
        await createButton.click();
        console.log('✅ Clicked Create Dependency button');

        // Wait for completion
        await page.waitForTimeout(3000);

        // Check if dialog closed
        const dialogOpen = await page.locator('h2:has-text("Add Dependency")').isVisible().catch(() => false);
        console.log(`📝 Dialog still open: ${dialogOpen}`);

        if (!dialogOpen) {
          console.log('✅ SUCCESS: Dependency creation dialog closed properly');

          // Look for success message
          const successToast = page.locator('div[role="alert"]:has-text("successfully")').isVisible().catch(() => false);
          console.log(`🎉 Success toast visible: ${await successToast}`);
        }
      } else {
        console.log('❌ Create button is still disabled');
      }

    } else {
      console.log('❌ No accessible search results found');

      // Take screenshot for debugging
      await page.screenshot({
        path: 'test-results/accessibility-test-debug.png',
        fullPage: true
      });

      // Check if search results exist without proper attributes
      const allResults = page.locator('.border.rounded-lg.max-h-60 > div');
      const allCount = await allResults.count();
      console.log(`📋 Found ${allCount} total search result elements (checking if they exist but lack attributes)`);

      if (allCount > 0) {
        console.log('⚠️  Search results exist but lack accessibility attributes');

        // Check the attributes of the first result
        const firstResult = allResults.first();
        const hasOnClick = await firstResult.evaluate(el => !!el.onclick);
        const hasRole = await firstResult.evaluate(el => el.getAttribute('role'));
        const hasTabIndex = await firstResult.evaluate(el => el.getAttribute('tabindex'));

        console.log(`🔍 First result attributes: onClick=${hasOnClick}, role=${hasRole}, tabIndex=${hasTabIndex}`);
      }
    }

    console.log('🎯 TARGETED DEPENDENCY CREATION TEST COMPLETE');
  });
});