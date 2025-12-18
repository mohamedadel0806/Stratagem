import { test, expect } from '@playwright/test';

test('isolation test', async ({ page }) => {
  console.log('Test isolation - starting');
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
  console.log('Test isolation - passed');
});