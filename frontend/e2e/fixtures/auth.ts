import { test as base, type Page, type BrowserContext } from '@playwright/test';

/**
 * Authentication fixtures for E2E tests
 * Provides authenticated page context for testing
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
    const hasAuthCookies = cookies.some(cookie =>
      cookie.name.includes('token') ||
      cookie.name.includes('session') ||
      cookie.name.includes('auth')
    );

    console.log(`Found ${cookies.length} cookies, auth cookies: ${hasAuthCookies}`);

    // Try to use existing session first
    if (hasAuthCookies) {
      try {
        await page.goto(`${baseURL}/en/dashboard`, { timeout: 15000 });
        const userMenu = page.getByTestId('user-menu-trigger');
        const loginBtn = page.getByRole('link', { name: 'Login' });

        await Promise.race([
          userMenu.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { }),
          loginBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { })
        ]);

        const currentUrl = page.url();
        const hasUserMenu = await userMenu.isVisible();

        if (currentUrl.includes('/dashboard') && hasUserMenu) {
          console.log('Using existing authenticated session');
          await use(page);
          return;
        }
      } catch (error) {
        console.log('Existing session invalid, proceeding with login');
      }
    }

    // Navigate to base URL and check if login is needed
    try {
      await page.goto(`${baseURL}/en`, { timeout: 15000 });
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 });

      // Wait for dynamic content
      await page.waitForTimeout(2000);

      // Check if already authenticated on current or dashboard URL
      const userMenu = page.getByTestId('user-menu-trigger');
      const loginBtn = page.getByRole('link', { name: 'Login' });

      await Promise.race([
        userMenu.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { }),
        loginBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { })
      ]);

      if (await userMenu.isVisible()) {
        console.log('Already authenticated, using current session');
        await use(page);
        return;
      }

    } catch (error) {
      console.log(`Navigation error: ${error}`);
    }

    // Perform login
    console.log('Proceeding with login...');
    await page.goto(`${baseURL}/en/login`, { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const email = process.env.TEST_USER_EMAIL || 'admin@grcplatform.com';
    const password = process.env.TEST_USER_PASSWORD || 'password123';

    try {
      // Wait for page to be ready
      await page.waitForTimeout(1000);

      // Find and fill email field
      const emailInput = page.locator('input[type="email"], input[id="email"], input[name="email"], input[placeholder*="email" i]').first();
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
      const submitButton = page.locator('button:has-text("Sign In"), button:has-text("Login"), button[type="submit"], button:has-text("Continue")').first();
      await submitButton.waitFor({ state: 'visible', timeout: 5000 });

      await submitButton.click();
      console.log('Login button clicked');

      // Wait for login completion
      try {
        await page.waitForURL(/\/dashboard|\/home/, { timeout: 15000 });
        console.log('Login successful - redirected to dashboard');
      } catch (urlError) {
        console.log('URL change not detected, checking for error messages...');

        // Check for login errors
        const errorElement = page.locator('.text-red-500, [role="alert"], .error, .text-red-800').first();
        const hasError = await errorElement.isVisible().catch(() => false);

        if (hasError) {
          const errorMessage = await errorElement.textContent().catch(() => 'Unknown error');
          throw new Error(`Login failed: ${errorMessage}`);
        }

        // If no error, assume login succeeded
        console.log('No error messages detected, assuming login succeeded');
      }

      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });

      // Final verification - we should be on dashboard
      const finalUrl = page.url();
      if (!finalUrl.includes('/dashboard') && !finalUrl.includes('/home')) {
        console.log('Not on dashboard after login, trying to navigate there...');
        await page.goto(`${baseURL}/en/dashboard`, { timeout: 10000 });
        await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      }

      console.log('Authentication setup complete');

    } catch (loginError) {
      console.log(`Login error: ${loginError}`);

      // Take screenshot for debugging
      const timestamp = Date.now();
      await page.screenshot({
        path: `test-results/login-failure-${timestamp}.png`,
        fullPage: true
      });

      throw new Error(`Login failed: ${loginError}`);
    }

    // Use the authenticated page
    await use(page);
  },
});

// Note: test files should import expect directly from @playwright/test