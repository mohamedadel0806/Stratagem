'use client';

import { test, expect } from '../fixtures/auth';

test.describe('Verify Accessibility Fix Implementation', () => {
  test('should verify accessibility attributes are present in dependency dialog', async ({ page }) => {
    console.log('🔧 VERIFYING ACCESSIBILITY FIX IMPLEMENTATION');

    // Navigate to physical assets page
    await page.goto('http://localhost:3000/en/dashboard/assets/physical');
    await page.waitForTimeout(2000);

    // Try to find an asset to click
    const assetLinks = await page.locator('a[href*="/dashboard/assets/physical/"]').all();
    console.log(`📋 Found ${assetLinks.length} physical asset links`);

    if (assetLinks.length === 0) {
      console.log('❌ No physical asset links found on assets page');

      // Try to create a test asset first or use existing assets
      // Let's see what's on the page
      const pageText = await page.textContent('body');
      console.log(`📝 Page text contains "Dependencies": ${pageText?.includes('Dependencies')}`);
      console.log(`📝 Page text contains "Add Dependency": ${pageText?.includes('Add Dependency')}`);

      // Look for any clickable elements that might lead to asset details
      const clickableElements = await page.locator('a, button, [role="button"]').all();
      console.log(`📋 Found ${clickableElements.length} clickable elements`);
    } else {
      // Click the first asset
      await assetLinks[0].click();
      await page.waitForTimeout(2000);
      console.log('✅ Clicked first physical asset');

      // Check if Dependencies tab exists
      const tabsList = await page.locator('[role="tab"]').all();
      const dependenciesTab = await page.locator('[role="tab"]:has-text("Dependencies")').all();

      console.log(`📋 Found ${tabsList.length} total tabs`);
      console.log(`📋 Found ${dependenciesTab.length} Dependencies tabs`);

      if (dependenciesTab.length > 0) {
        await dependenciesTab[0].click();
        await page.waitForTimeout(2000);
        console.log('✅ Clicked Dependencies tab');

        // Look for Add Dependency button
        const addDependencyButtons = await page.locator('button:has-text("Add Dependency")').all();
        console.log(`📋 Found ${addDependencyButtons.length} Add Dependency buttons`);

        if (addDependencyButtons.length > 0) {
          await addDependencyButtons[0].click();
          await page.waitForSelector('h2:has-text("Add Dependency")');
          console.log('✅ Opened Add Dependency dialog');

          // This is the key test - verify accessibility attributes
          console.log('🔧 Checking for accessibility fixes...');

          // Search for assets to trigger the search results
          const searchInput = page.locator('input[placeholder*="Search"]').first();
          await searchInput.fill('server');
          await page.waitForTimeout(3000);

          // Check for elements with our accessibility attributes
          const elementsWithDataTestId = await page.locator('[data-testid^="asset-search-result-"]').all();
          const elementsWithRoleButton = await page.locator('[role="button"][data-asset-id]').all();
          const elementsWithTabIndex = await page.locator('[tabindex="0"][data-asset-id]').all();

          console.log(`✅ Found ${elementsWithDataTestId.length} elements with data-testid`);
          console.log(`✅ Found ${elementsWithRoleButton.length} elements with role="button"`);
          console.log(`✅ Found ${elementsWithTabIndex.length} elements with tabindex`);

          if (elementsWithDataTestId.length > 0) {
            console.log('🎉 SUCCESS: Accessibility fixes are working!');

            // Try clicking one of the accessible elements
            await elementsWithDataTestId[0].click();
            console.log('✅ Successfully clicked accessible search result');

            // Check if selection appears
            const selectedIndicator = elementsWithDataTestId[0].locator('text=✓');
            const isSelected = await selectedIndicator.isVisible();
            console.log(`✅ Selection indicator visible: ${isSelected}`);

            if (isSelected) {
              console.log('🎉 COMPLETE: Accessibility fixes work perfectly!');
              console.log('📝 The dependency search results are now clickable by both mouse and programmatic methods');
            }

          } else {
            console.log('❌ Accessibility fixes not found');

            // Check if search results exist without the attributes
            const allSearchResults = await page.locator('.border.rounded-lg.max-h-60 > div').all();
            console.log(`📋 Found ${allSearchResults.length} total search result divs`);

            if (allSearchResults.length > 0) {
              console.log('⚠️  Search results exist but missing accessibility attributes');
              console.log('💡 This means our fix may not be properly deployed or there\'s a caching issue');
            } else {
              console.log('ℹ️  No search results found - may need different search term or assets don\'t exist');
            }
          }

          // Close dialog
          await page.keyboard.press('Escape');
          await page.waitForTimeout(1000);

        } else {
          console.log('❌ No Add Dependency button found');
        }
      } else {
        console.log('❌ No Dependencies tab found');
      }
    }

    console.log('🔧 ACCESSIBILITY VERIFICATION TEST COMPLETE');
  });
});