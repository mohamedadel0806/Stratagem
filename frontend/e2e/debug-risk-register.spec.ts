import { test, expect } from '@playwright/test';

test.describe('Debug Risk Register Page', () => {
  test('should analyze risk register page content', async ({ page }) => {
    console.log('Analyzing risk register page...');

    try {
      // Login first using auth fixture approach
      await page.goto('http://localhost:3000/en', { timeout: 30000 });

      // Fill in login credentials manually
      await page.waitForTimeout(2000); // Wait for any dynamic content
      const email = 'admin@grcplatform.com';
      const password = 'password123';

      // Try to find and fill email field
      try {
        const emailInput = page.locator('input[type="email"], input[id="email"], input[name="email"], input[placeholder*="email"]').first();
        await emailInput.fill(email);
        console.log('✅ Email filled');
      } catch (e) {
        console.log('❌ Could not fill email');
      }

      // Try to find and fill password field
      try {
        const passwordInput = page.locator('input[type="password"], input[id="password"], input[name="password"]').first();
        await passwordInput.fill(password);
        console.log('✅ Password filled');
      } catch (e) {
        console.log('❌ Could not fill password');
      }

      // Try to click login button
      try {
        const loginButton = page.locator('button:has-text("Sign In"), button[type="submit"]').first();
        await loginButton.click();
        console.log('✅ Login button clicked');
      } catch (e) {
        console.log('❌ Could not click login button');
      }

      // Wait for login and navigation
      await page.waitForTimeout(5000);

      // Navigate to risk register page
      await page.goto('http://localhost:3000/en/dashboard/risks', { timeout: 30000 });
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      console.log('✅ Navigated to risk register page');

      // Wait for dynamic content
      await page.waitForTimeout(3000);

      // Analyze page content
      const pageTitle = await page.title();
      console.log('Page title:', pageTitle);

      // Look for any buttons
      const buttons = await page.locator('button').all();
      console.log(`Found ${buttons.length} button elements`);

      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const text = await button.textContent();
        const testId = await button.getAttribute('data-testid');
        const isVisible = await button.isVisible();

        console.log(`Button ${i}: text="${text}", testId="${testId}", visible=${isVisible}`);
      }

      // Look for elements with test-id containing "risk" or "new"
      const riskElements = await page.locator('[data-testid*="risk"], [data-testid*="new"]').all();
      console.log(`Found ${riskElements.length} elements with risk/new testids`);

      for (let i = 0; i < riskElements.length; i++) {
        const element = riskElements[i];
        const testId = await element.getAttribute('data-testid');
        const tag = await element.evaluate(el => el.tagName.toLowerCase());
        const isVisible = await element.isVisible();

        console.log(`Risk Element ${i}: tag="${tag}", testId="${testId}", visible=${isVisible}`);
      }

      // Take a screenshot
      await page.screenshot({ path: 'test-results/risk-register-debug.png', fullPage: true });
      console.log('✅ Risk register screenshot saved');

    } catch (error: any) {
      console.log('❌ Error:', error.message);
      await page.screenshot({ path: 'test-results/risk-register-error.png', fullPage: true });
      throw error;
    }
  });
});