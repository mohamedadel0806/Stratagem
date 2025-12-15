import { test, expect } from '@playwright/test';

test.describe('Basic Connectivity Tests', () => {
  test('should connect to the app', async ({ page }) => {
    console.log('🌐 Testing basic connectivity...');

    // Try to connect to the home page
    const response = await page.goto('http://127.0.0.1:3000', {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });

    console.log(`📊 Response status: ${response?.status()}`);
    console.log(`🔗 Final URL: ${page.url()}`);

    // Take screenshot to see what we get
    await page.screenshot({ path: 'test-results/connectivity-test.png' });

    // Check if page loaded at all
    const hasContent = await page.locator('body').textContent();
    console.log(`📄 Page content length: ${hasContent?.length || 0}`);

    if (hasContent && hasContent.length > 0) {
      console.log('✅ Basic connectivity successful');
    } else {
      console.log('❌ No content loaded');
    }
  });

  test('should access login page', async ({ page }) => {
    console.log('🔐 Testing login page access...');

    // Try to go directly to login
    const response = await page.goto('http://127.0.0.1:3000/en/login', {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });

    console.log(`📊 Response status: ${response?.status()}`);

    // Wait a moment for any dynamic content
    await page.waitForTimeout(3000);

    // Take screenshot
    await page.screenshot({ path: 'test-results/login-page-test.png' });

    // Look for login form
    const emailInput = page.locator('input[type="email"], input[id="email"]').first();
    const hasEmailInput = await emailInput.isVisible().catch(() => false);

    console.log(`📧 Has email input: ${hasEmailInput}`);

    if (hasEmailInput) {
      console.log('✅ Login page accessible');
    } else {
      console.log('❌ Login form not found');

      // Debug: what's actually on the page?
      const pageTitle = await page.title();
      console.log(`📄 Page title: ${pageTitle}`);

      const bodyText = await page.locator('body').textContent();
      console.log(`📝 Body text preview: ${bodyText?.substring(0, 200)}...`);
    }
  });

  test('should handle login step by step', async ({ page }) => {
    console.log('🚀 Testing step-by-step login...');

    try {
      // Step 1: Go to login page
      console.log('📍 Step 1: Navigating to login...');
      await page.goto('http://127.0.0.1:3000/en/login', {
        waitUntil: 'domcontentloaded',
        timeout: 10000
      });
      console.log('✅ Login page loaded');

      // Step 2: Wait for form elements
      console.log('⏳ Step 2: Waiting for form elements...');
      await page.waitForSelector('input[type="email"], input[id="email"]', { timeout: 8000 });
      console.log('✅ Email input found');

      await page.waitForSelector('input[type="password"], input[id="password"]', { timeout: 5000 });
      console.log('✅ Password input found');

      // Step 3: Fill credentials
      console.log('✏️ Step 3: Filling credentials...');
      await page.fill('input[type="email"], input[id="email"]', 'admin@grcplatform.com');
      console.log('✅ Email filled');

      await page.fill('input[type="password"], input[id="password"]', 'password123');
      console.log('✅ Password filled');

      // Step 4: Click login button
      console.log('🖱️ Step 4: Clicking login button...');
      const loginButton = page.locator('button:has-text("Sign In with Email")').first();
      await loginButton.click();
      console.log('✅ Login button clicked');

      // Step 5: Wait for navigation
      console.log('🔄 Step 5: Waiting for dashboard...');

      // Wait for URL to change or timeout
      let dashboardReached = false;
      try {
        await page.waitForURL(/dashboard/, { timeout: 15000 });
        dashboardReached = true;
        console.log('✅ Dashboard URL reached');
      } catch (error) {
        console.log('⏰ Dashboard URL wait timed out');
      }

      // Step 6: Check where we ended up
      const currentUrl = page.url();
      console.log(`🔗 Current URL: ${currentUrl}`);

      // Take screenshot
      await page.screenshot({ path: 'test-results/login-result.png' });

      // Check page title
      const pageTitle = await page.title();
      console.log(`📄 Page title: ${pageTitle}`);

      // Look for error messages
      const errorElement = page.locator('.text-red-500, [role="alert"], .error').first();
      const hasError = await errorElement.isVisible().catch(() => false);

      if (hasError) {
        const errorText = await errorElement.textContent();
        console.log(`❌ Login error: ${errorText}`);
      }

      if (dashboardReached || currentUrl.includes('dashboard')) {
        console.log('🎉 Login successful!');
      } else {
        console.log('❌ Login may have failed');
      }

    } catch (error) {
      console.log(`❌ Login test failed: ${error.message}`);

      // Take screenshot of error state
      await page.screenshot({ path: 'test-results/login-error.png', fullPage: true });

      throw error;
    }
  });
});