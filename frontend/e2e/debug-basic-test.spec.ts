import { test, expect } from '@playwright/test';

test.describe('Playwright Configuration Test', () => {
  test('basic playwright test', async ({ page }) => {
    console.log('Starting basic test...');
    await page.goto('https://example.com');
    await expect(page.locator('h1')).toBeVisible();
    console.log('Basic test passed');
  });
});