import { test, expect } from '@playwright/test';
import { RiskRegisterPage } from '../pages/risk-register-page';

test.describe('Risk Pages Debug Test', () => {
  test('should navigate to risk register', async ({ page }) => {
    console.log('Starting risk register test...');

    // Navigate to login page
    await page.goto('http://localhost:3000/en/login', { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });

    // Wait for login form
    await page.waitForSelector('input[type="email"], input[id="email"], input[name="email"]', { timeout: 10000 });

    // Fill credentials
    const email = 'admin@grcplatform.com';
    const password = 'password123';

    await page.locator('#email').first().fill(email);
    await page.locator('#password').first().fill(password);

    // Click login
    await page.locator('button:has-text("Sign In"), button[type="submit"]').first().click();

    // Wait for dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });

    console.log('Logged in successfully');

    // Navigate to risk register
    await page.goto('http://localhost:3000/en/dashboard/risks');
    await page.waitForLoadState('domcontentloaded');

    console.log('Navigated to risk register');

    // Take screenshot to verify
    await page.screenshot({ path: 'test-results/risk-register-debug.png', fullPage: true });

    console.log('Screenshot taken');

    // Check if page loaded successfully
    await expect(page.locator('body')).toBeVisible();
  });
});