import { test as base, type Page, type BrowserContext } from '@playwright/test';

/**
 * Improved Authentication fixtures for E2E tests
 * Provides properly authenticated page context for testing
 */

export type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page, context, baseURL }, use) => {
    // Set reasonable timeouts
    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(30000);

    console.log('Setting up authenticated page...');

    // Check for existing cookies
    const cookies = await context.cookies();
    console.log(`Found ${cookies.length} existing cookies`);

    // Try to verify existing session by accessing a protected page
    const hasValidSession = await checkExistingSession(page, baseURL);

    if (hasValidSession) {
      console.log('Using existing authenticated session');
      await use(page);
      return;
    }

    console.log('No valid session found, performing login...');

    // Perform login
    const loginSuccess = await performLogin(page, baseURL);

    if (!loginSuccess) {
      throw new Error('Login failed');
    }

    console.log('Login successful');
    await use(page);
  },
});

export { expect } from '@playwright/test';

/**
 * Check if existing session is valid by attempting to access a protected page
 */
async function checkExistingSession(page: Page, baseURL?: string): Promise<boolean> {
  try {
    // Try to access dashboard directly
    await page.goto(`${baseURL}/en/dashboard`, { timeout: 10000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 5000 });

    const currentUrl = page.url();

    // Check if we successfully reached dashboard (not redirected to login)
    if (currentUrl.includes('/dashboard') && !currentUrl.includes('/login')) {
      // Also try to access a sub-page to ensure session works properly
      await page.goto(`${baseURL}/en/dashboard/assets/physical`, { timeout: 10000 });
      await page.waitForLoadState('domcontentloaded', { timeout: 5000 });

      const assetsUrl = page.url();

      // If we can reach assets page without authentication error, session is valid
      if (assetsUrl.includes('/dashboard/assets/physical') &&
          !await page.locator('text=Authentication error').isVisible().catch(() => false)) {
        console.log('Session is valid for all pages');
        return true;
      }
    }

    return false;
  } catch (error) {
    console.log(`Session check failed: ${error}`);
    return false;
  }
}

/**
 * Perform login with the application
 */
async function performLogin(page: Page, baseURL?: string): Promise<boolean> {
  try {
    // Navigate to login page
    await page.goto(`${baseURL}/en/login`, { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });

    // Wait for page to be ready
    await page.waitForTimeout(1000);

    const email = process.env.TEST_USER_EMAIL || 'admin@grcplatform.com';
    const password = process.env.TEST_USER_PASSWORD || 'password123';

    // Find and fill email field
    const emailInput = page.locator('input[type="email"], input[id="email"], input[name="email"]').first();
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });

    await emailInput.click();
    await page.waitForTimeout(100);
    await emailInput.clear();
    await page.waitForTimeout(100);
    await emailInput.fill(email);
    await page.waitForTimeout(200);

    console.log(`Email filled: ${email}`);

    // Find and fill password field
    const passwordInput = page.locator('input[type="password"], input[id="password"], input[name="password"]').first();
    await passwordInput.waitFor({ state: 'visible', timeout: 10000 });

    await passwordInput.click();
    await page.waitForTimeout(100);
    await passwordInput.clear();
    await page.waitForTimeout(100);
    await passwordInput.fill(password);
    await page.waitForTimeout(200);

    console.log('Password filled');

    // Find and click submit button
    const submitButton = page.locator('button:has-text("Sign In with Email"), button[type="submit"]').first();
    await submitButton.waitFor({ state: 'visible', timeout: 5000 });

    await submitButton.click();
    console.log('Login button clicked');

    // Wait for login completion
    try {
      await page.waitForURL(/\/dashboard/, { timeout: 15000 });
      console.log('Login successful - redirected to dashboard');

      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });

      // Verify we're actually on dashboard and not still on login page
      const finalUrl = page.url();
      if (!finalUrl.includes('/dashboard') || finalUrl.includes('/login')) {
        throw new Error(`Unexpected URL after login: ${finalUrl}`);
      }

      // Test session persistence by navigating to assets page
      await page.goto(`${baseURL}/en/dashboard/assets/physical`, { timeout: 10000 });
      await page.waitForLoadState('domcontentloaded', { timeout: 5000 });

      const hasAuthError = await page.locator('text=Authentication error').isVisible().catch(() => false);
      if (hasAuthError) {
        console.log('Authentication error found on assets page - session not persistent');
        return false;
      }

      console.log('Session persistence verified');
      return true;

    } catch (urlError) {
      console.log(`URL change not detected, checking for error messages...`);

      // Check for login errors
      const errorElement = page.locator('.text-red-500, [role="alert"], .error, .text-red-800').first();
      const hasError = await errorElement.isVisible().catch(() => false);

      if (hasError) {
        const errorMessage = await errorElement.textContent().catch(() => 'Unknown error');
        throw new Error(`Login failed: ${errorMessage}`);
      }

      // If no error, assume login succeeded but check final state
      console.log('No error messages detected, checking final state');

      await page.waitForTimeout(2000);
      const finalUrl = page.url();

      if (finalUrl.includes('/dashboard')) {
        console.log('Login appears successful based on URL');
        return true;
      }

      return false;
    }

  } catch (loginError) {
    console.log(`Login error: ${loginError}`);

    // Take screenshot for debugging
    const timestamp = Date.now();
    await page.screenshot({
      path: `test-results/login-failure-${timestamp}.png`,
      fullPage: true
    });

    return false;
  }
}