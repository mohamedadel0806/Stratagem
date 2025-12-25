import { test, expect } from '@playwright/test';

test.describe('Simple Asset Tests', () => {
  test.beforeEach(async ({ page }) => {
    page.setDefaultTimeout(10000);

    await page.goto('http://127.0.0.1:3000/en/login', { waitUntil: 'domcontentloaded' });

    await page.fill('input[id="email"]', 'admin@grcplatform.com');
    await page.fill('input[id="password"]', 'password123');
    await page.click('button:has-text("Sign In with Email")');

    await page.waitForURL(/dashboard/, { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to physical assets page', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/dashboard/assets/physical', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');

    const pageTitle = page.locator('h1');
    await expect(pageTitle).toBeVisible({ timeout: 10000 });

    const newAssetButton = page.locator('button:has-text("New Asset")');
    await expect(newAssetButton).toBeVisible({ timeout: 5000 });
  });

  test('should create a physical asset', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/dashboard/assets/physical', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');

    const newAssetButton = page.locator('button:has-text("New Asset")');
    await newAssetButton.click();

    await expect(page.locator('form')).toBeVisible({ timeout: 10000 });

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
    } else {
      await page.screenshot({ path: 'test-results/form-no-description.png' });
      throw new Error('Description field not found');
    }

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
    }

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
        break;
      }
    }

    await page.waitForLoadState('domcontentloaded');
  });
});
