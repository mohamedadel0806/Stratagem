/**
 * Comprehensive diagnostic test to understand the assets page with authentication handling
 */
import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';
import { waitForAssetsPage } from '../utils/helpers';

test.describe('Assets - Comprehensive Diagnostic', () => {
  test('should analyze assets page with authentication handling', async ({ authenticatedPage }) => {
    console.log('Step 1: Navigate to dashboard first');
    await authenticatedPage.goto('/dashboard');
    await authenticatedPage.waitForLoadState('domcontentloaded');

    // Take screenshot of dashboard
    await authenticatedPage.screenshot({ path: 'test-results/dashboard-step1.png', fullPage: true });

    console.log('Step 2: Navigate to assets page');
    await authenticatedPage.goto('/dashboard/assets/physical');
    await waitForAssetsPage(authenticatedPage);

    // Check for authentication error
    const authError = await authenticatedPage.locator('text=Authentication error').isVisible().catch(() => false);
    console.log(`Authentication error detected: ${authError}`);

    if (authError) {
      console.log('Step 3: Handling authentication error with refresh');
      await authenticatedPage.reload();
      await authenticatedPage.waitForLoadState('domcontentloaded');
      await waitForAssetsPage(authenticatedPage);
      await authenticatedPage.screenshot({ path: 'test-results/assets-after-refresh.png', fullPage: true });
    }

    // Take screenshot of assets page
    await authenticatedPage.screenshot({ path: 'test-results/assets-current-state.png', fullPage: true });

    // Get current URL
    const currentUrl = authenticatedPage.url();
    console.log(`Current URL: ${currentUrl}`);

    // Get all visible text
    const allText = await authenticatedPage.textContent('body');
    console.log('Page text snippet:', allText?.substring(0, 200));

    // Look for any buttons that might be "Add" related
    const buttons = await authenticatedPage.locator('button').all();
    console.log(`Found ${buttons.length} total buttons:`);

    for (let i = 0; i < Math.min(buttons.length, 20); i++) {
      try {
        const buttonText = await buttons[i].textContent();
        const isVisible = await buttons[i].isVisible();
        console.log(`  Button ${i}: "${buttonText}" (visible: ${isVisible})`);

        // Check specifically for add/create buttons
        if (buttonText && (buttonText.toLowerCase().includes('add') ||
                           buttonText.toLowerCase().includes('create') ||
                           buttonText.toLowerCase().includes('new') ||
                           buttonText.toLowerCase().includes('asset'))) {
          console.log(`    >>> POTENTIAL ADD BUTTON FOUND: "${buttonText}"`);
        }
      } catch (e) {
        console.log(`  Button ${i}: Could not get text (${e})`);
      }
    }

    // Look for links that might be asset-related
    const links = await authenticatedPage.locator('a').all();
    console.log(`Found ${links.length} total links:`);

    for (let i = 0; i < Math.min(links.length, 20); i++) {
      try {
        const linkText = await links[i].textContent();
        const isVisible = await links[i].isVisible();

        if (linkText && (linkText.toLowerCase().includes('add') ||
                        linkText.toLowerCase().includes('create') ||
                        linkText.toLowerCase().includes('new') ||
                        linkText.toLowerCase().includes('asset'))) {
          console.log(`  Link ${i}: "${linkText}" (visible: ${isVisible})`);
        }
      } catch (e) {
        // Skip links that can't be accessed
      }
    }

    // Look for any elements with specific text patterns
    const potentialAddElements = await authenticatedPage.locator('[data-testid*="add"], [data-testid*="create"], [data-testid*="new"], [data-testid*="asset"]').all();
    console.log(`Found ${potentialAddElements.length} elements with potential data-testids`);

    // Check for page structure indicators
    const hasTable = await authenticatedPage.locator('table').isVisible().catch(() => false);
    const hasH1 = await authenticatedPage.locator('h1').isVisible().catch(() => false);
    const hasH2 = await authenticatedPage.locator('h2').isVisible().catch(() => false);
    const hasAnyHeading = await authenticatedPage.locator('h1, h2, h3, h4, h5, h6').count() > 0;

    console.log(`Page structure - Table: ${hasTable}, H1: ${hasH1}, H2: ${hasH2}, Any Heading: ${hasAnyHeading}`);

    // This test should always pass for analysis
    expect(true).toBe(true);
  });
});