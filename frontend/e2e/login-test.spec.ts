import { test, expect } from '@playwright/test';

test.describe('Login Test', () => {
  test('should be able to login', async ({ page }) => {
    console.log('Testing login...');

    try {
      await page.goto('http://localhost:3000/en', { timeout: 30000 });
      console.log('✅ Page loaded successfully');
      console.log('Current URL:', page.url());

      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      console.log('✅ DOM content loaded');

      // Check if we're on the login page
      await page.waitForSelector('input[type="email"], input[id="email"], input[name="email"]', { timeout: 10000 });
      console.log('✅ Login form found');

      // Fill in login credentials
      const email = 'admin@grcplatform.com';
      const password = 'password123';

      await page.fill('#email', email);
      await page.fill('#password', password);
      console.log('✅ Login form filled');

      // Click login button
      await page.click('button:has-text("Sign In")');
      console.log('✅ Login button clicked');

      // Wait for navigation
      await page.waitForURL(/dashboard/, { timeout: 15000 });
      console.log('✅ Successfully logged in and redirected to dashboard');

      await page.screenshot({ path: 'test-results/login-success.png', fullPage: true });
      console.log('✅ Login screenshot saved');

    } catch (error: any) {
      console.log('❌ Login Error:', error.message);
      await page.screenshot({ path: 'test-results/login-error.png', fullPage: true });
      throw error;
    }
  });
});