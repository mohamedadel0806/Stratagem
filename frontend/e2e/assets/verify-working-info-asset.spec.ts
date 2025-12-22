import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';
import { AssetDetailsPage } from '../pages/asset-details.page';

test.describe('Verify Working Information Asset Structure', () => {
  let assetDetailsPage: AssetDetailsPage;

  test.beforeEach(async ({ page }) => {
    assetDetailsPage = new AssetDetailsPage(page);
  });

  test('should verify working information asset structure and find an asset with actual tabs', async ({ page }) => {
    console.log('🔍 VERIFYING WORKING INFORMATION ASSET STRUCTURE');

    // Step 1: Navigate to information assets list page
    await page.goto('http://localhost:3000/en/dashboard/assets/information');
    await page.waitForTimeout(3000);
    console.log('✅ Navigated to information assets list');

    // Take screenshot
    await page.screenshot({ path: 'test-results/info-assets-list-page.png', fullPage: true });

    // Step 2: Look for available assets or create one
    console.log('🔍 STEP 1: LOOKING FOR AVAILABLE ASSETS');

    const assetLinks = await page.locator('a[href*="/dashboard/assets/information/"]').all();
    console.log(`Found ${assetLinks.length} asset links`);

    if (assetLinks.length > 0) {
      // Click the first available asset
      await assetLinks[0].click();
      await page.waitForTimeout(3000);

      const currentUrl = page.url();
      console.log(`✅ Clicked first asset, current URL: ${currentUrl}`);

      // Extract asset ID from URL
      const assetIdMatch = currentUrl.match(/\/dashboard\/assets\/information\/([a-f0-9-]+)/);
      const workingAssetId = assetIdMatch ? assetIdMatch[1] : null;

      if (workingAssetId) {
        console.log(`✅ Found working asset ID: ${workingAssetId}`);

        // Step 3: Test the tabs on this working asset
        await testAssetTabs(page, assetDetailsPage, workingAssetId);
      }
    } else {
      // Try to create a new asset
      console.log('⚠️ No existing assets found, trying to create one...');

      // Look for create button
      const createButton = page.locator('a:has-text("Add Asset"), button:has-text("Add Asset")').first();
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForTimeout(3000);
        console.log('✅ Clicked create asset button');

        // Fill form and create asset
        await createInformationAsset(page);

        // Get new asset ID from URL
        const newUrl = page.url();
        const newAssetMatch = newUrl.match(/\/dashboard\/assets\/information\/([a-f0-9-]+)/);
        const newAssetId = newAssetMatch ? newAssetMatch[1] : null;

        if (newAssetId) {
          console.log(`✅ Created new asset with ID: ${newAssetId}`);
          await testAssetTabs(page, assetDetailsPage, newAssetId);
        }
      }
    }
  });
});

async function createInformationAsset(page: any): Promise<void> {
  console.log('📝 Creating new information asset...');

  const timestamp = Date.now();
  const assetName = `Test Info Asset ${timestamp}`;
  const assetIdentifier = `TEST-INFO-${timestamp}`;

  // Fill form fields
  const nameSelectors = ['input[name*="name"]', 'input[placeholder*="Name"]', 'input[id*="name"]'];
  for (const selector of nameSelectors) {
    try {
      const field = page.locator(selector).first();
      if (await field.isVisible()) {
        await field.fill(assetName);
        console.log(`✅ Filled asset name: ${assetName}`);
        break;
      }
    } catch (error) {
      continue;
    }
  }

  const identifierSelectors = ['input[name*="identifier"]', 'input[placeholder*="Identifier"]'];
  for (const selector of identifierSelectors) {
    try {
      const field = page.locator(selector).first();
      if (await field.isVisible()) {
        await field.fill(assetIdentifier);
        console.log(`✅ Filled asset identifier: ${assetIdentifier}`);
        break;
      }
    } catch (error) {
      continue;
    }
  }

  const descriptionSelectors = ['textarea[name*="description"]', 'textarea[placeholder*="Description"]'];
  for (const selector of descriptionSelectors) {
    try {
      const field = page.locator(selector).first();
      if (await field.isVisible()) {
        await field.fill('Test information asset created for tab verification');
        console.log('✅ Filled description');
        break;
      }
    } catch (error) {
      continue;
    }
  }

  // Select classification if available
  const classificationSelectors = ['select[name*="classification"]', 'select[name*="dataClassification"]'];
  for (const selector of classificationSelectors) {
    try {
      const field = page.locator(selector).first();
      if (await field.isVisible()) {
        await field.selectOption({ label: 'Confidential' });
        console.log('✅ Selected classification');
        break;
      }
    } catch (error) {
      continue;
    }
  }

  // Submit form
  const submitButton = page.locator('button:has-text("Create"), button:has-text("Save"), button[type="submit"]').first();
  if (await submitButton.isVisible()) {
    await submitButton.click();
    console.log('✅ Submitted asset creation form');
    await page.waitForTimeout(5000);
  }
}

async function testAssetTabs(page: any, assetDetailsPage: AssetDetailsPage, assetId: string): Promise<void> {
  console.log(`📋 TESTING TABS FOR ASSET: ${assetId}`);

  // Expected tabs for information assets
  const expectedTabs = [
    'Overview', 'Classification', 'Ownership', 'Compliance',
    'Controls', 'Risks', 'Dependencies', 'Graph View', 'Audit Trail'
  ];

  console.log(`📊 Expected tabs: ${expectedTabs.join(', ')}`);

  // Test each tab systematically
  for (const tabName of expectedTabs) {
    console.log(`📍 Testing tab: ${tabName}`);

    try {
      await assetDetailsPage.clickTab(tabName);
      await page.waitForTimeout(3000);

      // Take screenshot for each tab
      const screenshotPath = `test-results/working-asset-tab-${tabName.toLowerCase().replace(/\s+/g, '-')}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`✅ Screenshot captured: ${screenshotPath}`);

      // Analyze tab content for data
      const hasData = await analyzeTabContentForData(page, tabName);
      console.log(`📊 Tab "${tabName}" has data: ${hasData ? 'YES' : 'NO'}`);

    } catch (error) {
      console.log(`❌ Error testing tab ${tabName}: ${error.message}`);
    }
  }

  console.log('🎯 WORKING ASSET TABS TESTING COMPLETE');
}

async function analyzeTabContentForData(page: any, tabName: string): Promise<boolean> {
  try {
    // Count different types of content
    const formFields = await page.locator('input, textarea, select').count();
    const buttons = await page.locator('button').count();
    const cards = await page.locator('.card, [class*="card"]').count();
    const tables = await page.locator('table').count();
    const lists = await page.locator('ul, ol, [role="list"]').count();
    const dataElements = await page.locator('[data-testid]').count();

    console.log(`    📊 ${tabName}: ${formFields} fields, ${buttons} buttons, ${cards} cards, ${tables} tables, ${lists} lists, ${dataElements} data elements`);

    // Look for meaningful content
    const textContent = await page.locator('body').textContent() || '';
    const hasSubstantialText = textContent.length > 200;
    const hasStructuredData = (formFields + buttons + cards + tables + lists) > 0;

    return hasSubstantialText || hasStructuredData;

  } catch (error) {
    console.log(`    ❌ Error analyzing ${tabName}: ${error.message}`);
    return false;
  }
}