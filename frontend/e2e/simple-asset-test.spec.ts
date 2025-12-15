import { test, expect } from '@playwright/test';

test.describe('Simple Asset Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set shorter timeouts to fail fast
    page.setDefaultTimeout(10000);

    // Navigate and login directly
    console.log('🔐 Logging in...');
    await page.goto('http://127.0.0.1:3000/en/login', { waitUntil: 'domcontentloaded' });

    // Fill login form
    await page.fill('input[id="email"]', 'admin@grcplatform.com');
    await page.fill('input[id="password"]', 'password123');
    await page.click('button:has-text("Sign In with Email")');

    // Wait for dashboard - use a shorter, more reliable wait
    await page.waitForURL(/dashboard/, { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded');

    // Give React a moment to hydrate
    await page.waitForTimeout(2000);
    console.log('✅ Logged in successfully');
  });

  test('should navigate to physical assets page', async ({ page }) => {
    console.log('📍 Navigating to physical assets...');

    // Navigate to assets page
    await page.goto('http://127.0.0.1:3000/dashboard/assets/physical', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');

    // Wait a moment for React to render
    await page.waitForTimeout(3000);

    // Take screenshot to see what we got
    await page.screenshot({ path: 'test-results/simple-nav-test.png' });

    // Look for page title
    const pageTitle = page.locator('h1');
    await expect(pageTitle).toBeVisible({ timeout: 10000 });

    const titleText = await pageTitle.textContent();
    console.log(`📄 Page title: ${titleText}`);

    // Look for New Asset button
    const newAssetButton = page.locator('button:has-text("New Asset")');
    await expect(newAssetButton).toBeVisible({ timeout: 5000 });

    console.log('✅ Navigation successful!');
  });

  test('should create a physical asset', async ({ page }) => {
    console.log('🆕 Creating physical asset...');

    // Navigate to assets page
    await page.goto('http://127.0.0.1:3000/dashboard/assets/physical', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Click New Asset button
    console.log('📝 Clicking New Asset button...');
    const newAssetButton = page.locator('button:has-text("New Asset")');
    await newAssetButton.click();
    await page.waitForTimeout(2000);

    // Wait for form to appear
    console.log('📋 Waiting for form...');
    await page.waitForSelector('form', { timeout: 10000 });

    // Take screenshot to see the form
    await page.screenshot({ path: 'test-results/simple-form.png' });

    // Fill in the form - try multiple selectors for each field
    console.log('✏️ Filling form fields...');

    // Try to find and fill asset description
    const descSelectors = [
      'input[name="assetDescription"]',
      'input[placeholder*="Asset Description"]',
      'input[placeholder*="description"]',
      'input[id*="description"]'
    ];

    let descField = null;
    for (const selector of descSelectors) {
      const field = page.locator(selector).first();
      if (await field.isVisible().catch(() => false)) {
        descField = field;
        break;
      }
    }

    if (descField) {
      await descField.fill('Test Asset from Simple Test');
      console.log('✅ Description filled');
    } else {
      console.log('❌ Could not find description field');
      await page.screenshot({ path: 'test-results/form-no-description.png' });
      throw new Error('Description field not found');
    }

    // Try to find and fill unique identifier
    const idSelectors = [
      'input[name="uniqueIdentifier"]',
      'input[placeholder*="Unique Identifier"]',
      'input[placeholder*="identifier"]',
      'input[id*="identifier"]'
    ];

    let idField = null;
    for (const selector of idSelectors) {
      const field = page.locator(selector).first();
      if (await field.isVisible().catch(() => false)) {
        idField = field;
        break;
      }
    }

    if (idField) {
      await idField.fill('SIMPLE-TEST-001');
      console.log('✅ Identifier filled');
    }

    // Take screenshot after filling form
    await page.screenshot({ path: 'test-results/simple-form-filled.png' });

    // Submit the form
    console.log('💾 Submitting form...');

    const submitSelectors = [
      'button[type="submit"]:has-text("Create")',
      'button:has-text("Create")',
      'button[type="submit"]:has-text("Save")',
      'button:has-text("Save")'
    ];

    for (const selector of submitSelectors) {
      const button = page.locator(selector).first();
      if (await button.isVisible().catch(() => false)) {
        await button.click();
        console.log(`✅ Clicked submit button: ${selector}`);
        break;
      }
    }

    // Wait for form to close and page to reload
    await page.waitForTimeout(5000);

    // Take final screenshot
    await page.screenshot({ path: 'test-results/simple-result.png' });

    console.log('🎉 Test completed!');
  });
});