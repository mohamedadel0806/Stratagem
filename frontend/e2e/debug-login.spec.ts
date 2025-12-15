import { test, expect } from '@playwright/test';

test('debug login process', async ({ page }) => {
  console.log('🔍 Starting login debug...');

  // Set reasonable timeouts
  page.setDefaultTimeout(10000);

  try {
    // Step 1: Try to access login page
    console.log('📍 Step 1: Navigating to login page...');
    await page.goto('http://127.0.0.1:3000/en/login', { timeout: 15000 });
    console.log('✅ Login page loaded');

    // Take screenshot
    await page.screenshot({ path: 'test-results/debug-1-login-page.png' });

    // Step 2: Check if email input is present
    console.log('📍 Step 2: Looking for email input...');
    const emailInput = page.locator('input[id="email"], input[type="email"], input[placeholder*="email"]').first();
    await expect(emailInput).toBeVisible({ timeout: 5000 });
    console.log('✅ Email input found');

    // Fill email
    await emailInput.fill('admin@grcplatform.com');
    console.log('✅ Email filled');

    // Step 3: Check password input
    console.log('📍 Step 3: Looking for password input...');
    const passwordInput = page.locator('input[id="password"], input[type="password"], input[placeholder*="password"]').first();
    await expect(passwordInput).toBeVisible({ timeout: 5000 });
    console.log('✅ Password input found');

    // Fill password
    await passwordInput.fill('password123');
    console.log('✅ Password filled');

    // Screenshot before login
    await page.screenshot({ path: 'test-results/debug-2-form-filled.png' });

    // Step 4: Find and click login button
    console.log('📍 Step 4: Looking for login button...');
    const loginButton = page.locator('button:has-text("Sign In with Email")').first();
    await expect(loginButton).toBeVisible({ timeout: 5000 });
    console.log('✅ Login button found');

    // Click login
    await loginButton.click();
    console.log('✅ Login button clicked');

    // Step 5: Wait for navigation
    console.log('📍 Step 5: Waiting for navigation...');
    await page.waitForURL(/\/en\/dashboard/, { timeout: 15000 });
    console.log('✅ Navigation to dashboard successful');

    // Final screenshot
    await page.screenshot({ path: 'test-results/debug-3-logged-in.png' });

    console.log('🎉 Login process completed successfully!');

  } catch (error) {
    console.error('❌ Login failed:', error);

    // Take screenshot of the error state
    await page.screenshot({ path: 'test-results/debug-error.png', fullPage: true });

    // Get page content for debugging
    const pageContent = await page.content();
    console.log('📄 Page content length:', pageContent.length);

    // Check if we're on the right page
    const currentUrl = page.url();
    console.log('🔗 Current URL:', currentUrl);

    throw error;
  }
});