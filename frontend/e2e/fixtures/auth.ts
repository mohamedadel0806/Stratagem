import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * Authentication fixtures for E2E tests
 * Provides authenticated page context for testing
 */

export type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page, baseURL }, use) => {
    // Set reasonable timeouts
    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(30000);

    // Navigate to login page with shorter timeout
    try {
      await page.goto(`${baseURL}/en/login`, { timeout: 15000 });
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    } catch (error) {
      console.log('Login page navigation failed, trying root URL...');
      await page.goto(`${baseURL}/`, { timeout: 15000 });
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    }

    // Wait for login form to be visible with shorter timeout
    try {
      await page.waitForSelector('input[type="email"], input[id="email"], input[name="email"]', { timeout: 10000 });
    } catch (error) {
      console.log('Email input not found, checking if already authenticated...');
      // Check if we're already logged in
      const currentUrl = page.url();
      if (currentUrl.includes('/dashboard') || currentUrl.includes('/home')) {
        console.log('Already authenticated, using current session');
        await use(page);
        return;
      }
      throw error;
    }

    // Fill in login credentials
    // Load from environment variables or use defaults
    const email = process.env.TEST_USER_EMAIL || 'admin@grcplatform.com';
    const password = process.env.TEST_USER_PASSWORD || 'password123';

    // Wait a bit for form to be fully rendered
    await page.waitForTimeout(500);

    // Fill email field - use id selector first as it's most reliable
    // For react-hook-form, we need to ensure the value is set AND events fire
    const emailInput = page.locator('#email').first();
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.waitFor({ state: 'attached', timeout: 5000 });
    
    // Click to focus
    await emailInput.click({ timeout: 5000 });
    await page.waitForTimeout(100);
    
    // Use fill to set the value
    await emailInput.fill(email);
    await page.waitForTimeout(100);
    
    // Manually trigger the input and change events that react-hook-form listens to
    await emailInput.evaluate((el: HTMLInputElement) => {
      // Create proper input event
      const inputEvent = new Event('input', { bubbles: true, cancelable: true });
      // Create proper change event  
      const changeEvent = new Event('change', { bubbles: true, cancelable: true });
      // Dispatch events
      el.dispatchEvent(inputEvent);
      el.dispatchEvent(changeEvent);
    });
    
    await page.waitForTimeout(200);
    
    // Verify email was filled
    const emailValue = await emailInput.inputValue();
    console.log(`Email input value after fill: "${emailValue}"`);
    if (emailValue !== email) {
      throw new Error(`Failed to fill email input. Expected: "${email}", Got: "${emailValue}"`);
    }

    // Fill password field
    const passwordInput = page.locator('#password').first();
    await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await passwordInput.waitFor({ state: 'attached', timeout: 5000 });
    
    // Click to focus
    await passwordInput.click({ timeout: 5000 });
    await page.waitForTimeout(100);
    
    // Use fill to set the value
    await passwordInput.fill(password);
    await page.waitForTimeout(100);
    
    // Manually trigger the input and change events that react-hook-form listens to
    await passwordInput.evaluate((el: HTMLInputElement) => {
      // Create proper input event
      const inputEvent = new Event('input', { bubbles: true, cancelable: true });
      // Create proper change event
      const changeEvent = new Event('change', { bubbles: true, cancelable: true });
      // Dispatch events
      el.dispatchEvent(inputEvent);
      el.dispatchEvent(changeEvent);
    });
    
    await page.waitForTimeout(200);
    
    // Verify password was filled (check length since it's password type)
    const passwordValue = await passwordInput.inputValue();
    console.log(`Password input value length after fill: ${passwordValue.length}`);
    if (passwordValue.length !== password.length) {
      throw new Error(`Failed to fill password input. Expected length: ${password.length}, Got: ${passwordValue.length}`);
    }

    // Click the login button - use text content since it's more reliable
    const loginButton = page.locator('button:has-text("Sign In with Email"), button:has-text("Sign In"), button[type="submit"]').first();
    await loginButton.waitFor({ state: 'visible', timeout: 5000 });
    await loginButton.click();

    // Wait for form submission to complete - use smart waits instead of fixed timeout
    try {
      // Wait for URL to change to dashboard
      await page.waitForURL(/\/en\/dashboard|\/dashboard/, { timeout: 15000 });

      // Wait for dashboard content to be ready with shorter timeout
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });

    } catch (error: any) {
      // Double-check if we're actually logged in
      const currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        // Check for error messages
        const errorElement = page.locator('.text-red-500, [role="alert"], .error, .text-red-800').first();
        const hasError = await errorElement.isVisible().catch(() => false);
        if (hasError) {
          const errorMessage = await errorElement.textContent().catch(() => 'Unknown error');
          throw new Error(`Login failed: ${errorMessage}`);
        }

        // Take screenshot for debugging
        const timestamp = Date.now();
        await page.screenshot({ path: `test-results/login-failure-${timestamp}.png`, fullPage: true });

        throw new Error(`Login failed - still on login page. URL: ${currentUrl}\nScreenshot: test-results/login-failure-${timestamp}.png`);
      }

      // If not on login page, maybe login succeeded but URL check failed
      console.log('URL check failed, but not on login page. Proceeding...');
    }

    // Brief wait for page stability
    await page.waitForTimeout(500);
    
    // Use the authenticated page
    await use(page);
  },
});

export { expect } from '@playwright/test';

