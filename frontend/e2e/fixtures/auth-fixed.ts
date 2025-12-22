import { test as base, type Page, type BrowserContext } from '@playwright/test';

/**
 * Fixed Authentication fixtures for E2E tests
 * Handles session persistence issues properly
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

    // Always attempt login to ensure fresh session
    const loginSuccess = await performReliableLogin(page, baseURL);

    if (!loginSuccess) {
      throw new Error('Failed to establish authenticated session');
    }

    console.log('Authentication successful');
    await use(page);
  },
});

export { expect } from '@playwright/test';

/**
 * Perform reliable login and verify session persistence
 */
async function performReliableLogin(page: Page, baseURL?: string): Promise<boolean> {
  try {
    // Step 1: Navigate to login page
    console.log('Navigating to login page...');
    await page.goto(`${baseURL}/en/login`, { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });

    // Step 2: Fill login form
    const email = process.env.TEST_USER_EMAIL || 'admin@grcplatform.com';
    const password = process.env.TEST_USER_PASSWORD || 'password123';

    console.log(`Filling login form with email: ${email}`);

    // Fill email field
    const emailInput = page.locator('input[type="email"], input[id="email"], input[name="email"]').first();
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.click();
    await page.waitForTimeout(100);
    await emailInput.clear();
    await page.waitForTimeout(100);
    await emailInput.fill(email);
    await page.waitForTimeout(200);

    // Fill password field
    const passwordInput = page.locator('input[type="password"], input[id="password"], input[name="password"]').first();
    await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await passwordInput.click();
    await page.waitForTimeout(100);
    await passwordInput.clear();
    await page.waitForTimeout(100);
    await passwordInput.fill(password);
    await page.waitForTimeout(200);

    console.log('Login form filled');

    // Step 3: Submit login
    const submitButton = page.locator('button:has-text("Sign In with Email")').first();
    await submitButton.waitFor({ state: 'visible', timeout: 5000 });
    await submitButton.click();
    console.log('Login submitted');

    // Step 4: Wait for redirect to dashboard
    console.log('Waiting for login redirect...');
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });

    const dashboardUrl = page.url();
    console.log(`Redirected to: ${dashboardUrl}`);

    // Step 5: Verify we're actually authenticated (not still on login)
    if (dashboardUrl.includes('/login')) {
      throw new Error('Still on login page after login attempt');
    }

    // Step 6: Test session persistence by navigating to assets page
    console.log('Testing session persistence...');

    // First go to main dashboard to stabilize session
    await page.goto(`${baseURL}/en/dashboard`, { timeout: 10000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    await page.waitForTimeout(2000); // Allow session to settle

    // Now navigate to assets page
    console.log('Navigating to assets page...');
    await page.goto(`${baseURL}/en/dashboard/assets/physical`, { timeout: 10000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    await page.waitForTimeout(3000); // Allow page to fully load

    const assetsUrl = page.url();
    console.log(`Assets page URL: ${assetsUrl}`);

    // Step 7: Verify we're authenticated on assets page
    const authError = await page.locator('text=Authentication error').isVisible().catch(() => false);
    const loginVisible = await page.locator('button:has-text("Login"), input[type="email"]').isVisible().catch(() => false);

    if (authError) {
      console.log('Authentication error found on assets page - session persistence issue');

      // Try refreshing the page
      console.log('Attempting page refresh...');
      await page.reload();
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      await page.waitForTimeout(3000);

      // Check again after refresh
      const authErrorAfterRefresh = await page.locator('text=Authentication error').isVisible().catch(() => false);
      const loginVisibleAfterRefresh = await page.locator('button:has-text("Login"), input[type="email"]').isVisible().catch(() => false);

      if (authErrorAfterRefresh || loginVisibleAfterRefresh) {
        console.log('Authentication still failing after refresh - session issue persists');
        return false;
      }
    }

    if (loginVisible) {
      console.log('Login form visible - not authenticated');
      return false;
    }

    console.log('Session persistence verified - user is authenticated on assets page');
    return true;

  } catch (error) {
    console.log(`Login process failed: ${error}`);

    // Take screenshot for debugging
    const timestamp = Date.now();
    await page.screenshot({
      path: `test-results/authentication-failure-${timestamp}.png`,
      fullPage: true
    });

    return false;
  }
}