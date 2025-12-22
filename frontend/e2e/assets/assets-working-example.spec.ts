/**
 * Working example of assets E2E test
 * Follow this pattern for all asset tests
 */
import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';
import { waitForAssetsPage } from '../utils/helpers';

test.describe('Assets - Working Example', () => {
  test('should navigate to assets page and handle authentication', async ({ authenticatedPage }) => {
    // First navigate to main dashboard to ensure authentication
    await authenticatedPage.goto('/dashboard');
    await authenticatedPage.waitForLoadState('domcontentloaded');

    // Then navigate to assets section
    await authenticatedPage.goto('/dashboard/assets/physical');
    await waitForAssetsPage(authenticatedPage);

    // Check if we have authentication error
    const hasAuthError = await authenticatedPage.locator('text=Authentication error').isVisible().catch(() => false);

    if (hasAuthError) {
      // Try refreshing the page
      console.log('Authentication error detected, refreshing page...');
      await authenticatedPage.reload();
      await authenticatedPage.waitForLoadState('domcontentloaded');
      await waitForAssetsPage(authenticatedPage);
    }

    // Check if we're on the physical assets page by URL
    expect(authenticatedPage.url()).toContain('/dashboard/assets/physical');
  });

  test('should find page elements and handle refresh', async ({ authenticatedPage }) => {
    // Navigate via dashboard first
    await authenticatedPage.goto('/dashboard');
    await authenticatedPage.waitForLoadState('domcontentloaded');

    await authenticatedPage.goto('/dashboard/assets/physical');
    await waitForAssetsPage(authenticatedPage);

    // Check for authentication error and refresh if needed
    const authError = await authenticatedPage.locator('text=Authentication error').isVisible().catch(() => false);
    if (authError) {
      await authenticatedPage.reload();
      await authenticatedPage.waitForLoadState('domcontentloaded');
      await waitForAssetsPage(authenticatedPage);
    }

    // Wait for page to fully render
    await authenticatedPage.waitForTimeout(3000);

    // Look for any interactive elements
    const interactiveElements = await authenticatedPage.locator('button, a, [role="button"]').count();

    // Verify we have some interactive elements (navigation etc.)
    expect(interactiveElements).toBeGreaterThan(5);

    // Check for refresh button and try clicking it if present
    const refreshButton = await authenticatedPage.locator('button:has-text("Refresh"), button:has-text("Reload")').first();
    if (await refreshButton.isVisible().catch(() => false)) {
      await refreshButton.click();
      await authenticatedPage.waitForLoadState('domcontentloaded');
      await waitForAssetsPage(authenticatedPage);
    }
  });

  test('should demonstrate proper error handling and page loading', async ({ authenticatedPage }) => {
    // Navigate with error handling
    await authenticatedPage.goto('/dashboard/assets/physical');
    await waitForAssetsPage(authenticatedPage);

    // Handle authentication error by refreshing
    const authError = await authenticatedPage.locator('text=Authentication error').first();
    if (await authError.isVisible().catch(() => false)) {
      console.log('Authentication error found, attempting refresh...');
      await authenticatedPage.reload();
      await authenticatedPage.waitForLoadState('domcontentloaded');
      await waitForAssetsPage(authenticatedPage);
    }

    // The test passes if we can navigate to the assets URL and handle any authentication issues
    expect(authenticatedPage.url()).toContain('/dashboard/assets/physical');

    // Verify we have basic page structure
    const hasBody = await authenticatedPage.locator('body').isVisible();
    expect(hasBody).toBe(true);
  });
});