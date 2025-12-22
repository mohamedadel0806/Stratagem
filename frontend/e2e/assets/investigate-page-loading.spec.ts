import { test, expect } from '@playwright/test';

test.describe('Investigate Page Loading Issues', () => {
  test('manual investigation of information asset page', async ({ page }) => {
    console.log('🔍 MANUAL INVESTIGATION OF PAGE LOADING');

    // First go to main dashboard to ensure authentication
    await page.goto('http://localhost:3000/en/dashboard');
    await page.waitForTimeout(3000);

    // Take screenshot of dashboard
    await page.screenshot({ path: 'dashboard-page.png', fullPage: true });
    console.log('✅ Dashboard screenshot captured');

    // Try to navigate to assets list
    await page.goto('http://localhost:3000/en/dashboard/assets/information');
    await page.waitForTimeout(5000);

    // Take screenshot of assets list
    await page.screenshot({ path: 'assets-list-page.png', fullPage: true });
    console.log('✅ Assets list screenshot captured');

    // Check what's on the assets page
    const pageContent = await page.content();
    console.log(`Assets page HTML length: ${pageContent.length}`);

    // Look for any asset links or content
    const assetLinks = await page.locator('a[href*="assets/information/"]').all();
    console.log(`Found ${assetLinks.length} information asset links`);

    if (assetLinks.length > 0) {
      // Click the first available asset
      console.log('Clicking first available information asset...');
      await assetLinks[0].click();
      await page.waitForTimeout(5000);

      // Take screenshot of asset details
      await page.screenshot({ path: 'asset-details-page.png', fullPage: true });
      console.log('✅ Asset details screenshot captured');

      // Check current URL
      const currentUrl = page.url();
      console.log(`Current URL after clicking asset: ${currentUrl}`);

      // Look for any H1 elements or tabs
      const headings = await page.locator('h1, h2, h3').all();
      console.log(`Found ${headings.length} heading elements`);

      for (let i = 0; i < Math.min(headings.length, 5); i++) {
        const text = await headings[i].textContent();
        console.log(`  Heading ${i + 1}: ${text}`);
      }

      // Look for data-testid elements
      const testIdElements = await page.locator('[data-testid]').all();
      console.log(`Found ${testIdElements.length} elements with data-testid`);

    } else {
      console.log('❌ No information asset links found on the assets page');

      // Look for any other content or error messages
      const bodyText = await page.textContent('body');
      if (bodyText) {
        console.log('Page body content (first 200 chars):', bodyText.substring(0, 200));
      }
    }

    // Finally, try the specific URL we were testing
    console.log('Trying specific asset URL...');
    await page.goto('http://localhost:3000/en/dashboard/assets/information/189d91ee-01dd-46a4-b6ef-76ccac11c60d');
    await page.waitForTimeout(5000);

    await page.screenshot({ path: 'specific-asset-url.png', fullPage: true });
    console.log('✅ Specific asset URL screenshot captured');

    const finalUrl = page.url();
    console.log(`Final URL: ${finalUrl}`);

    const hasContent = await page.locator('body').textContent();
    console.log(`Page content length: ${hasContent?.length || 0}`);
  });
});