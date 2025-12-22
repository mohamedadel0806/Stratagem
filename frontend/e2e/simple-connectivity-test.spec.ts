/**
 * Simple connectivity test without authentication
 * Use this for basic debugging and connectivity verification
 */
import { test, expect } from '@playwright/test';

test.describe('Basic Connectivity Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set reasonable timeouts
    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(30000);
  });

  test('should load the login page', async ({ page }) => {
    await page.goto('http://localhost:3000/en/login');
    await page.waitForLoadState('domcontentloaded');

    // Check if we can see login elements
    const emailInput = page.locator('input[type="email"], input[id="email"], input[name="email"]');
    await expect(emailInput.first()).toBeVisible();
  });

  test('should reach the application base URL', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/');
    expect(response?.status()).toBe(200);
  });
});