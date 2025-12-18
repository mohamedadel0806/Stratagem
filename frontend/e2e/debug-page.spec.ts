import { test, expect } from '@playwright/test';

test.describe('Debug Page Content', () => {
  test('should analyze page content', async ({ page }) => {
    console.log('Analyzing page content...');

    try {
      await page.goto('http://localhost:3000/en', { timeout: 30000 });
      console.log('✅ Page loaded successfully');
      console.log('Current URL:', page.url());

      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      console.log('✅ DOM content loaded');

      // Wait a bit for dynamic content
      await page.waitForTimeout(3000);

      // Get page content
      const pageTitle = await page.title();
      console.log('Page title:', pageTitle);

      // Look for any form inputs
      const inputs = await page.locator('input').all();
      console.log(`Found ${inputs.length} input elements`);

      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        const type = await input.getAttribute('type');
        const id = await input.getAttribute('id');
        const name = await input.getAttribute('name');
        const placeholder = await input.getAttribute('placeholder');
        const isVisible = await input.isVisible();

        console.log(`Input ${i}: type=${type}, id=${id}, name=${name}, placeholder=${placeholder}, visible=${isVisible}`);
      }

      // Look for any buttons
      const buttons = await page.locator('button').all();
      console.log(`Found ${buttons.length} button elements`);

      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const text = await button.textContent();
        const isVisible = await button.isVisible();

        console.log(`Button ${i}: text="${text}", visible=${isVisible}`);
      }

      // Take a screenshot
      await page.screenshot({ path: 'test-results/page-content.png', fullPage: true });
      console.log('✅ Page content screenshot saved');

    } catch (error: any) {
      console.log('❌ Error:', error.message);
      await page.screenshot({ path: 'test-results/page-content-error.png', fullPage: true });
      throw error;
    }
  });
});