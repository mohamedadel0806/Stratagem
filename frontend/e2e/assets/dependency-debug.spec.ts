'use client';

import { test, expect } from '../fixtures/auth';

test.describe('Dependency Creation Debug', () => {
  test('should monitor API calls during dependency creation', async ({ page }) => {
    console.log('🔍 DEBUGGING DEPENDENCY CREATION API CALLS');

    // Enable network monitoring
    const apiResponses: any[] = [];
    page.on('response', async (response) => {
      if (response.url().includes('/assets/') && response.url().includes('/dependencies')) {
        const url = response.url();
        const status = response.status();
        const method = response.request().method();

        try {
          const body = await response.text();
          apiResponses.push({
            url,
            method,
            status,
            body: body.substring(0, 500) + (body.length > 500 ? '...' : ''),
            timestamp: new Date().toISOString()
          });

          console.log(`📡 API Response: ${method} ${url} - ${status}`);
          if (body) {
            console.log(`   Body: ${body.substring(0, 200)}${body.length > 200 ? '...' : ''}`);
          }
        } catch (e) {
          console.log(`📡 API Response: ${method} ${url} - ${status} (no body)`);
        }
      }
    });

    // Monitor console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        console.log(`🚨 Browser ${msg.type()}: ${msg.text()}`);
      }
    });

    // Navigate to a physical asset
    await page.goto('http://localhost:3000/en/dashboard/assets/physical');
    await page.waitForTimeout(2000);

    // Find and click the first asset
    try {
      const assetLinks = await page.locator('a[href*="/dashboard/assets/physical/"]').all();
      if (assetLinks.length === 0) {
        console.log('❌ No asset links found. Looking for alternative selectors...');

        // Try to find any clickable elements that might be asset cards
        const possibleAssets = await page.locator('[href*="physical"]').all();
        console.log(`Found ${possibleAssets.length} elements with "physical" in href`);

        if (possibleAssets.length > 0) {
          await possibleAssets[0].click();
        } else {
          console.log('❌ No physical assets found on page');
          return;
        }
      } else {
        await assetLinks[0].click();
      }
    } catch (error) {
      console.log(`Error clicking asset: ${error}`);
      return;
    }

    await page.waitForURL(/\/dashboard\/assets\/physical\//);
    console.log('✅ Navigated to asset details page');

    // Click Dependencies tab
    try {
      await page.click('button:has-text("Dependencies")');
      await page.waitForTimeout(1000);
      console.log('✅ Clicked Dependencies tab');
    } catch (error) {
      console.log(`Error clicking Dependencies tab: ${error}`);
      return;
    }

    // Click Add Dependency
    try {
      await page.click('button:has-text("Add Dependency")');
      await page.waitForSelector('h2:has-text("Add Dependency")', { timeout: 5000 });
      console.log('✅ Opened Add Dependency dialog');
    } catch (error) {
      console.log(`Error opening Add Dependency dialog: ${error}`);
      return;
    }

    // Perform search and selection
    try {
      const searchInput = page.locator('input[placeholder*="Search"]').first();
      await searchInput.fill('server');
      console.log('✅ Filled search with "server"');

      // Wait for search results
      await page.waitForTimeout(3000);

      // Look for any clickable elements in the search results
      const searchContainer = page.locator('.border.rounded-lg.max-h-60').first();
      const isSearchVisible = await searchContainer.isVisible().catch(() => false);

      if (!isSearchVisible) {
        console.log('❌ Search results container not visible');
        // Try to find any elements that might be search results
        const allClickable = await page.locator('div:has-text("server"), div:has-text("Server")').all();
        console.log(`Found ${allClickable.length} elements containing "server"`);

        if (allClickable.length > 0) {
          await allClickable[0].click();
          console.log('✅ Clicked on element containing "server"');
        }
      } else {
        const searchResults = await searchContainer.locator('> div').all();
        console.log(`Found ${searchResults.length} search results`);

        if (searchResults.length > 0) {
          await searchResults[0].click();
          console.log('✅ Clicked first search result');
        } else {
          console.log('❌ No search results found');
        }
      }

      // Fill description
      const descriptionTextarea = page.locator('textarea[placeholder*="Describe"]').first();
      await descriptionTextarea.fill('Test dependency creation - debug monitoring');
      console.log('✅ Filled description');

      // Check if Create button is enabled
      const createButton = page.locator('button:has-text("Create Dependency")').first();
      const isEnabled = await createButton.isEnabled();
      console.log(`🔘 Create button enabled: ${isEnabled}`);

      if (isEnabled) {
        console.log('✅ Clicking Create Dependency button...');
        await createButton.click();

        // Wait for API calls
        await page.waitForTimeout(5000);

        // Check if dialog closed
        const dialogOpen = await page.locator('h2:has-text("Add Dependency")').isVisible().catch(() => false);
        console.log(`📝 Dialog still open: ${dialogOpen}`);

        // Check for success/error messages
        const successToast = page.locator('div[role="alert"]:has-text("successfully")').isVisible().catch(() => false);
        const errorToast = page.locator('div[role="alert"]:has-text("Error")').isVisible().catch(() => false);

        console.log(`✅ Success toast visible: ${await successToast}`);
        console.log(`❌ Error toast visible: ${await errorToast}`);

      } else {
        console.log('❌ Create button is not enabled');
      }

    } catch (error) {
      console.log(`Error during dependency creation: ${error}`);
    }

    // Log all API responses
    console.log('\n📊 API RESPONSES SUMMARY:');
    if (apiResponses.length === 0) {
      console.log('❌ No API responses captured');
    } else {
      apiResponses.forEach((resp, index) => {
        console.log(`${index + 1}. ${resp.method} ${resp.url}`);
        console.log(`   Status: ${resp.status}`);
        if (resp.body) {
          console.log(`   Body: ${resp.body}`);
        }
        console.log('');
      });
    }

    // Take a screenshot for visual debugging
    await page.screenshot({
      path: 'test-results/dependency-debug-final.png',
      fullPage: true
    });
    console.log('📸 Final screenshot saved: test-results/dependency-debug-final.png');

    console.log('🔍 DEBUGGING COMPLETE');
  });
});