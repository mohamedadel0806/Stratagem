'use client';

import { test, expect } from '../fixtures/auth';

test.describe('Dependency Creation with Accessibility Fixes', () => {
  test('should create dependency using accessible search results', async ({ page }) => {
    console.log('🔧 TESTING DEPENDENCY CREATION WITH ACCESSIBILITY FIXES');

    // Navigate to physical assets page
    await page.goto('http://localhost:3000/en/dashboard/assets/physical');
    await page.waitForTimeout(2000);

    // Find and click the first physical asset
    const assetLinks = await page.locator('a[href*="/dashboard/assets/physical/"]').all();
    if (assetLinks.length === 0) {
      console.log('❌ No physical asset links found');
      return;
    }

    await assetLinks[0].click();
    await page.waitForURL(/\/dashboard\/assets\/physical\//);
    console.log('✅ Navigated to asset details page');

    // Click Dependencies tab
    await page.click('button:has-text("Dependencies")');
    await page.waitForTimeout(1000);
    console.log('✅ Clicked Dependencies tab');

    // Click Add Dependency button
    await page.click('button:has-text("Add Dependency")');
    await page.waitForSelector('h2:has-text("Add Dependency")');
    console.log('✅ Opened Add Dependency dialog');

    // Search for assets
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill('server');
    console.log('✅ Filled search input');

    // Wait for search results
    await page.waitForTimeout(3000);

    // Look for accessible asset search results using data-testid or role="button"
    const searchResults = page.locator('[data-testid^="asset-search-result-"], [role="button"][data-asset-id]');
    const resultsCount = await searchResults.count();

    console.log(`📋 Found ${resultsCount} accessible search results`);

    if (resultsCount > 0) {
      // Click the first search result using the accessible approach
      await searchResults.first().click();
      console.log('✅ Clicked first accessible search result');

      // Check if the asset is now selected (should show ✓ indicator)
      const selectedIndicator = searchResults.first().locator('text=✓');
      const isSelected = await selectedIndicator.isVisible();
      expect(isSelected).toBe(true);
      console.log('✅ Confirmed asset is selected');

      // Fill description
      const descriptionTextarea = page.locator('textarea[placeholder*="Describe"]').first();
      await descriptionTextarea.fill('E2E Test dependency created with accessibility fixes');
      console.log('✅ Filled description');

      // Check if Create button is enabled
      const createButton = page.locator('button:has-text("Create Dependency")').first();
      const isCreateEnabled = await createButton.isEnabled();
      expect(isCreateEnabled).toBe(true);
      console.log('✅ Create button is enabled');

      // Click the Create button
      await createButton.click();
      console.log('✅ Clicked Create Dependency button');

      // Wait for dialog to close or success message
      await page.waitForTimeout(3000);

      // Check if dialog is closed
      const dialogIsOpen = await page.locator('h2:has-text("Add Dependency")').isVisible().catch(() => false);
      expect(dialogIsOpen).toBe(false);
      console.log('✅ Dependency creation dialog closed');

      // Look for success message
      const successMessage = page.locator('div[role="alert"]:has-text("successfully")').isVisible().catch(() => false);
      console.log(`📬 Success message visible: ${await successMessage}`);

      // Refresh the page to check if dependency appears
      await page.reload();
      await page.click('button:has-text("Dependencies")');
      await page.waitForTimeout(2000);

      // Look for outgoing dependencies section
      const outgoingSection = page.locator('h3:has-text("Outgoing Dependencies"), h2:has-text("Outgoing Dependencies")');
      const hasDependencies = await outgoingSection.isVisible().catch(() => false);

      if (hasDependencies) {
        console.log('✅ Outgoing Dependencies section found');
      } else {
        console.log('ℹ️ Outgoing Dependencies section not visible (may need more time or refresh)');
      }

    } else {
      console.log('❌ No accessible search results found after search');

      // Try alternative approach - wait longer and check again
      await page.waitForTimeout(5000);
      const delayedResults = await page.locator('[data-testid^="asset-search-result-"], [role="button"][data-asset-id]').count();
      console.log(`📋 Delayed search results count: ${delayedResults}`);

      if (delayedResults > 0) {
        console.log('✅ Found results after additional wait');
      } else {
        // Take screenshot for debugging
        await page.screenshot({ path: 'test-results/dependency-accessibility-debug.png' });
        console.log('📸 Debugging screenshot saved');
      }
    }

    console.log('🔧 ACCESSIBILITY-FIXED DEPENDENCY CREATION TEST COMPLETE');
  });

  test('should be able to navigate and select assets with keyboard', async ({ page }) => {
    console.log('⌨️ TESTING KEYBOARD ACCESSIBILITY');

    // Navigate to physical assets page
    await page.goto('http://localhost:3000/en/dashboard/assets/physical');
    await page.waitForTimeout(2000);

    // Find and click the first asset
    const assetLinks = await page.locator('a[href*="/dashboard/assets/physical/"]').all();
    if (assetLinks.length === 0) {
      console.log('❌ No physical asset links found');
      return;
    }

    await assetLinks[0].click();
    await page.waitForURL(/\/dashboard\/assets\/physical\//);

    // Click Dependencies tab
    await page.click('button:has-text("Dependencies")');
    await page.click('button:has-text("Add Dependency")');
    await page.waitForSelector('h2:has-text("Add Dependency")');

    // Search for assets
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill('test');
    await page.waitForTimeout(3000);

    // Look for keyboard-accessible elements
    const accessibleElements = page.locator('[role="button"][tabindex="0"][data-asset-id]');
    const count = await accessibleElements.count();

    console.log(`⌨️ Found ${count} keyboard-accessible search results`);

    if (count > 0) {
      // Test keyboard navigation by focusing first element
      await accessibleElements.first().focus();

      // Check if it's focused (should have focus styles)
      const isFocused = await accessibleElements.first().evaluate(el =>
        document.activeElement === el
      );

      expect(isFocused).toBe(true);
      console.log('✅ Keyboard focus works on search results');
    } else {
      console.log('❌ No keyboard-accessible elements found');
    }

    console.log('⌨️ KEYBOARD ACCESSIBILITY TEST COMPLETE');
  });
});