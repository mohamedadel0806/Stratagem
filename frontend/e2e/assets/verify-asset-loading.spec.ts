import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';

test('verify information asset page loads correctly', async ({ page }) => {
  console.log('🔍 VERIFYING INFORMATION ASSET PAGE LOADS');

  // Navigate to information asset
  const informationAssetId = '189d91ee-01dd-46a4-b6ef-76ccac11c60d';
  await page.goto(`http://localhost:3000/en/dashboard/assets/information/${informationAssetId}`);
  await page.waitForTimeout(5000);

  // Check if we're on the correct URL
  const currentUrl = page.url();
  console.log(`Current URL: ${currentUrl}`);
  expect(currentUrl).toContain('/dashboard/assets/information/');
  expect(currentUrl).toContain(informationAssetId);

  // Take screenshot
  await page.screenshot({ path: 'verify-asset-loading.png', fullPage: true });

  // Look for asset-specific content
  const assetName = await page.locator('h1').first().textContent();
  console.log(`Page title/h1: ${assetName}`);

  // Look for asset detail indicators
  const assetIdentifiers = await page.locator('text=Identifier, text=Asset Name, text=Classification, text=Overview').all();
  console.log(`Found ${assetIdentifiers.length} asset detail indicators`);

  // Look for tabs or navigation elements specific to asset details
  const tabsList = await page.locator('[role="tab"], button[data-value], [data-testid*="tab"]').all();
  console.log(`Found ${tabsList.length} tab-like elements`);

  for (let i = 0; i < Math.min(tabsList.length, 10); i++) {
    const tab = tabsList[i];
    const text = await tab.textContent();
    const isVisible = await tab.isVisible();
    const testId = await tab.getAttribute('data-testid');
    const role = await tab.getAttribute('role');
    if (text && text.trim() && isVisible) {
      console.log(`  Tab ${i + 1}: "${text.trim()}" | role="${role}" | data-testid="${testId}"`);
    }
  }

  // Check if we have any asset-specific content
  const pageContent = await page.textContent('body');
  const hasAssetContent = pageContent?.includes('Asset') || pageContent?.includes('Information') || pageContent?.includes('Classification');
  console.log(`Has asset-specific content: ${hasAssetContent}`);

  if (!hasAssetContent) {
    console.log('⚠️  This might be a login redirect or 404 page');
    console.log('Page content sample:', pageContent?.substring(0, 200));
  }
});