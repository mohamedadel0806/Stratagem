import { test as base, type Page, type BrowserContext } from '@playwright/test';

/**
 * Authentication fixtures for E2E tests
 * Provides authenticated page context for testing using NextAuth storageState
 */

export type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page, context, baseURL }, use) => {
    // Set reasonable timeouts
    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(30000);

    const email = process.env.TEST_USER_EMAIL || 'admin@grcplatform.com';
    const password = process.env.TEST_USER_PASSWORD || 'password123';
    const storageFile = '.auth/storageState.json';

    console.log('Setting up authenticated page...');
    console.log(`Using email: ${email}`);

    // Try to load existing auth state using Playwright's storageState API
    let isAuthenticated = false;

    try {
      const fs = require('fs');
      if (fs.existsSync(storageFile)) {
        const state = JSON.parse(fs.readFileSync(storageFile, 'utf-8'));

        // Apply cookies
        if (state.cookies) {
          await context.addCookies(state.cookies);
        }

        // Apply localStorage (requires navigation to origin first or using a dummy page)
        if (state.origins) {
          for (const origin of state.origins) {
            if (origin.localStorage) {
              await context.addInitScript((storage: any) => {
                if (window.location.origin === storage.origin) {
                  for (const [key, value] of Object.entries(storage.localStorage)) {
                    window.localStorage.setItem(key, value as string);
                  }
                }
              }, { origin: origin.origin, localStorage: origin.localStorage });
            }
          }
        }

        console.log('Applied saved authentication state from', storageFile);

        // Navigate to dashboard to verify auth
        await page.goto(`${baseURL}/en/dashboard`, { timeout: 15000 });
        await page.waitForLoadState('networkidle', { timeout: 10000 });

        // Wait for React to fully render and check for login indicators
        const userMenu = page.getByTestId('user-menu-trigger');
        const loginBtn = page.getByRole('link', { name: 'Login' });

        // Wait for either indicator
        await Promise.race([
          userMenu.waitFor({ state: 'visible', timeout: 10000 }).catch(() => { }),
          loginBtn.waitFor({ state: 'visible', timeout: 10000 }).catch(() => { })
        ]);

        const currentUrl = page.url();
        const hasUserMenu = await userMenu.isVisible();

        if (currentUrl.includes('/dashboard') && hasUserMenu) {
          console.log('Successfully authenticated from saved state');
          isAuthenticated = true;
        } else {
          if (!hasUserMenu) {
            console.log('User menu not found - session is invalid despite dashboard URL');
            // Take diagnostic screenshot
            await page.screenshot({ path: '.auth/auth-failure-debug.png', fullPage: true });
            console.log('Saved auth failure diagnostic screenshot to .auth/auth-failure-debug.png');
          } else {
            console.log('Redirected away from dashboard, auth state invalid');
          }
          // Delete invalid state
          if (fs.existsSync(storageFile)) fs.unlinkSync(storageFile);
        }
      }
    } catch (error) {
      console.log('No valid saved auth state or error loading state, proceeding with login:', error);
    }

    // If not authenticated, perform login
    if (!isAuthenticated) {
      console.log('Proceeding with login...');

      // Navigate to login page
      await page.goto(`${baseURL}/en/login`, { timeout: 15000 });
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      await page.waitForTimeout(2000);

      // Fill email
      const emailInput = page.locator('input[type="email"], input[id="email"], input[name="email"]').first();
      await emailInput.waitFor({ state: 'visible', timeout: 10000 });
      await emailInput.click();
      await page.waitForTimeout(100);
      await emailInput.fill(email);
      await page.waitForTimeout(200);

      console.log('Email filled');

      // Fill password
      const passwordInput = page.locator('input[type="password"], input[id="password"], input[name="password"]').first();
      await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
      await passwordInput.click();
      await page.waitForTimeout(100);
      await passwordInput.fill(password);
      await page.waitForTimeout(200);

      console.log('Password filled');

      // Submit login
      const submitButton = page.locator('button:has-text("Sign In"), button[type="submit"]').first();
      await submitButton.waitFor({ state: 'visible', timeout: 5000 });
      await submitButton.click();
      console.log('Login button clicked');

      // Wait for login completion
      try {
        await page.waitForURL(/\/dashboard/, { timeout: 15000 });
        console.log('Login successful - redirected to dashboard');
      } catch (urlError) {
        console.log('URL change not detected, checking for error messages...');

        // Check for login errors
        const errorElement = page.locator('.text-red-500, [role="alert"], .error, .text-red-800').first();
        const hasError = await errorElement.isVisible().catch(() => false);

        if (hasError) {
          const errorMessage = await errorElement.textContent().catch(() => 'Unknown error');
          console.log('Login error:', errorMessage);
          throw new Error(`Login failed: ${errorMessage}`);
        }

        // If no error, assume login succeeded
        console.log('No error messages detected, assuming login succeeded');
      }

      // Wait for page to fully load
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      await page.waitForTimeout(3000);

      // Save authentication state for future tests
      await context.storageState({ path: storageFile });
      console.log('Saved authentication state to', storageFile);
    }

    console.log('Authentication setup complete');

    await use(page);
  },
});

// Helper function to ensure page is in a clean state
async function ensureCleanPage(page: Page, baseURL: string) {
  await page.goto(`${baseURL}/en/dashboard`, { timeout: 10000 });
  await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
  await page.waitForTimeout(2000);
}

async function saveAuthState(context: BrowserContext, page: Page, storageFile: string) {
  try {
    // Get cookies from the page context
    const cookies = await context.cookies();

    // Get localStorage from the page
    const localStorage = await page.evaluate(() => {
      const storage: Record<string, string> = {};
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key) {
          storage[key] = window.localStorage.getItem(key) as string;
        }
      }
      return storage;
    });

    // Create storage state object
    const storageState = {
      cookies: cookies.map(c => ({
        name: c.name,
        value: c.value,
        domain: c.domain,
        path: c.path,
        expires: c.expires,
        httpOnly: c.httpOnly,
        secure: c.secure,
        sameSite: c.sameSite,
      })),
      origins: [
        {
          origin: page.url(),
          localStorage: localStorage,
        },
      ],
    };

    // Ensure directory exists
    const path = require('path');
    const fs = require('fs');
    const dir = path.dirname(storageFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Save to file
    fs.writeFileSync(storageFile, JSON.stringify(storageState, null, 2));
    console.log('Saved authentication state to', storageFile);
  } catch (error) {
    console.log('Failed to save auth state:', error);
  }
}
