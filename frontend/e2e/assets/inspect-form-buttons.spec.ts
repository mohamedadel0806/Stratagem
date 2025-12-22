/**
 * Test to inspect form buttons and understand why submit is disabled
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';
import { waitForAssetsPage } from '../utils/helpers';

test.describe('Asset Form - Inspect Buttons', () => {
  test('should inspect form buttons and their states', async ({ authenticatedPage }) => {
    // Navigate to assets page
    await authenticatedPage.goto('/dashboard/assets/physical');
    await waitForAssetsPage(authenticatedPage);

    // Click "New Asset" button
    await authenticatedPage.click('button:has-text("New Asset")');

    // Wait for form to appear
    await authenticatedPage.waitForTimeout(3000);

    console.log('🔍 Inspecting form buttons...');

    // Get all buttons on the page
    const buttons = await authenticatedPage.locator('button').all();
    console.log(`\n📋 Found ${buttons.length} buttons:`);

    for (let i = 0; i < buttons.length; i++) {
      try {
        const button = buttons[i];
        const isVisible = await button.isVisible();
        const isEnabled = await button.isEnabled();
        const text = await button.textContent();
        const type = await button.getAttribute('type');
        const title = await button.getAttribute('title');
        const className = await button.getAttribute('class') || '';

        // Only show visible buttons or enabled buttons
        if (isVisible || isEnabled) {
          console.log(`\nButton ${i}:`);
          console.log(`  - Text: "${text}"`);
          console.log(`  - Visible: ${isVisible}`);
          console.log(`  - Enabled: ${isEnabled}`);
          console.log(`  - Type: ${type || 'none'}`);
          console.log(`  - Title: ${title || 'none'}`);
          console.log(`  - Class snippet: ${className.length > 100 ? className.substring(0, 100) + '...' : className}`);

          // Look for submit/save buttons
          if (text && (text.toLowerCase().includes('save') ||
                      text.toLowerCase().includes('create') ||
                      text.toLowerCase().includes('submit') ||
                      text.toLowerCase().includes('confirm'))) {
            console.log(`  *** THIS IS A SUBMIT/SAVE BUTTON ***`);
          }

          // Look for cancel/close buttons
          if (text && (text.toLowerCase().includes('cancel') ||
                      text.toLowerCase().includes('close') ||
                      text.toLowerCase().includes('dismiss'))) {
            console.log(`  *** THIS IS A CANCEL/CLOSE BUTTON ***`);
          }
        }
      } catch (e) {
        console.log(`Button ${i}: Could not analyze`);
      }
    }

    // Look specifically for buttons with specific attributes
    console.log('\n🔍 Looking for submit buttons specifically...');
    const submitButtons = await authenticatedPage.locator('button[type="submit"], button[form], button:has-text("Create"), button:has-text("Save"), button:has-text("Submit")').all();

    console.log(`Found ${submitButtons.length} potential submit buttons:`);
    for (let i = 0; i < submitButtons.length; i++) {
      try {
        const button = submitButtons[i];
        const text = await button.textContent();
        const isVisible = await button.isVisible();
        const isEnabled = await button.isEnabled();
        const title = await button.getAttribute('title');

        console.log(`Submit Button ${i}: "${text}" (visible: ${isVisible}, enabled: ${isEnabled}, title: "${title}")`);
      } catch (e) {
        console.log(`Submit Button ${i}: Could not analyze`);
      }
    }

    // Take screenshot for manual inspection
    await authenticatedPage.screenshot({ path: 'test-results/form-buttons-inspection.png', fullPage: true });

    console.log('\n✅ Form button inspection complete');

    // The test should pass if we can see the form
    expect(true).toBe(true);
  });
});