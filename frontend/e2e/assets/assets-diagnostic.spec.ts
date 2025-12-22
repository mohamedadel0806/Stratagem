/**
 * Diagnostic test to understand the assets page structure
 */
import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';
import { waitForAssetsPage } from '../utils/helpers';

test.describe('Assets - Diagnostic', () => {
  test('should analyze page structure', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/assets/physical');
    await waitForAssetsPage(authenticatedPage);

    // Take a screenshot
    await authenticatedPage.screenshot({ path: 'test-results/assets-page-structure.png', fullPage: true });

    // Get all visible text
    const allText = await authenticatedPage.textContent('body');
    console.log('Page text:', allText?.substring(0, 500));

    // Look for any buttons
    const buttons = await authenticatedPage.locator('button').all();
    console.log(`Found ${buttons.length} buttons:`);

    for (let i = 0; i < Math.min(buttons.length, 10); i++) {
      const buttonText = await buttons[i].textContent();
      console.log(`  Button ${i}: "${buttonText}"`);
    }

    // Look for any links that might be "Add" buttons
    const links = await authenticatedPage.locator('a').all();
    console.log(`Found ${links.length} links:`);

    for (let i = 0; i < Math.min(links.length, 10); i++) {
      const linkText = await links[i].textContent();
      if (linkText && (linkText.includes('Add') || linkText.includes('Create') || linkText.includes('New'))) {
        console.log(`  Link ${i}: "${linkText}"`);
      }
    }

    // Look for page elements
    const hasTable = await authenticatedPage.locator('table').isVisible().catch(() => false);
    const hasH1 = await authenticatedPage.locator('h1').isVisible().catch(() => false);
    const hasH2 = await authenticatedPage.locator('h2').isVisible().catch(() => false);

    console.log(`Has table: ${hasTable}, Has h1: ${hasH1}, Has h2: ${hasH2}`);

    // This test should always pass
    expect(true).toBe(true);
  });
});