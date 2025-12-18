import { test, expect } from '@playwright/test';

test.describe('Basic App Test', () => {
  test('should load the app', async ({ page }) => {
    console.log('Testing basic app load...');

    try {
      await page.goto('http://localhost:3000/', { timeout: 30000 });
      console.log('✅ Page loaded successfully');
      console.log('Current URL:', page.url());

      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      console.log('✅ DOM content loaded');

      // Take a screenshot to see what we got
      await page.screenshot({ path: 'test-results/app-load.png', fullPage: true });
      console.log('✅ Screenshot saved');

    } catch (error: any) {
      console.log('❌ Error:', error.message);
      await page.screenshot({ path: 'test-results/app-load-error.png', fullPage: true });
      throw error;
    }
  });
});
