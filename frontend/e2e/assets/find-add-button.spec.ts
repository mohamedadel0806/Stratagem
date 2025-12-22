/**
 * Test to find the correct Add Asset button selector
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';
import { waitForAssetsPage } from '../utils/helpers';

test.describe('Assets - Find Add Button', () => {
  test('should locate the correct Add Asset button selector', async ({ authenticatedPage }) => {
    // Navigate to assets page
    await authenticatedPage.goto('/dashboard/assets/physical');
    await waitForAssetsPage(authenticatedPage);

    // Wait for page to fully load
    await authenticatedPage.waitForTimeout(5000);

    console.log('🔍 Searching for Add Asset button...');

    // Take screenshot of current state
    await authenticatedPage.screenshot({ path: 'test-results/assets-page-full.png', fullPage: true });

    // Try different selectors for "Add" buttons
    const addSelectors = [
      'button:has-text("Add New")',
      'button:has-text("Add Asset")',
      'button:has-text("New Asset")',
      'button:has-text("Create")',
      'button:has-text("Add")',
      'button[aria-label*="Add"]',
      'button[aria-label*="Create"]',
      'button[aria-label*="New"]',
      'button[data-testid*="add"]',
      'button[data-testid*="create"]',
      'button[data-testid*="new"]',
      '[data-testid*="add"]',
      '[data-testid*="create"]',
      'button:has-text("+")',  // Plus sign
      'button[class*="add"]',        // Class contains "add"
      'button[class*="create"]',     // Class contains "create"
      'button[class*="new"]'        // Class contains "new"
    ];

    let foundButton = false;
    let foundSelector = '';

    for (const selector of addSelectors) {
      try {
        const element = authenticatedPage.locator(selector);
        const isVisible = await element.isVisible().catch(() => false);

        if (isVisible) {
          const buttonText = await element.textContent();
          console.log(`✅ Found button with selector "${selector}": "${buttonText}"`);
          foundButton = true;
          foundSelector = selector;
          break;
        }
      } catch (e) {
        // Selector not found, continue
      }
    }

    // Also check links that might be styled as buttons
    if (!foundButton) {
      const linkSelectors = [
        'a:has-text("Add")',
        'a:has-text("New")',
        'a:has-text("Create")',
        'a[aria-label*="Add"]',
        'a[data-testid*="add"]',
        'a[data-testid*="create"]'
      ];

      for (const selector of linkSelectors) {
        try {
          const element = authenticatedPage.locator(selector);
          const isVisible = await element.isVisible().catch(() => false);

          if (isVisible) {
            const linkText = await element.textContent();
            console.log(`✅ Found link with selector "${selector}": "${linkText}"`);
            foundButton = true;
            foundSelector = selector;
            break;
          }
        } catch (e) {
          // Selector not found, continue
        }
      }
    }

    // Look for any clickable elements that might be the add button
    if (!foundButton) {
      console.log('🔍 Searching for any clickable elements with Add/New/Create text...');

      const clickableElements = await authenticatedPage.locator('button, a, [role="button"]').all();

      for (let i = 0; i < clickableElements.length; i++) {
        try {
          const element = clickableElements[i];
          const isVisible = await element.isVisible().catch(() => false);

          if (isVisible) {
            const text = await element.textContent();
            if (text && (text.toLowerCase().includes('add') ||
                          text.toLowerCase().includes('new') ||
                          text.toLowerCase().includes('create') ||
                          text.includes('+'))) {
              console.log(`✅ Found clickable element ${i}: "${text}"`);

              // Get element details
              const tag = await element.evaluate((el: any) => el.tagName.toLowerCase());
              const className = await element.getAttribute('class') || '';
              const ariaLabel = await element.getAttribute('aria-label') || '';
              const dataTestId = await element.getAttribute('data-testid') || '';

              console.log(`   - Tag: ${tag}`);
              console.log(`   - Class: ${className}`);
              console.log(`   - Aria-label: ${ariaLabel}`);
              console.log(`   - Data-testid: ${dataTestId}`);

              foundButton = true;
              foundSelector = `button, a, [role="button"] (found with text: "${text}")`;
              break;
            }
          }
        } catch (e) {
          // Element not accessible, continue
        }
      }
    }

    // Get all buttons for manual inspection
    const allButtons = await authenticatedPage.locator('button').all();
    console.log(`\n📋 Total buttons found: ${allButtons.length}`);

    for (let i = 0; i < Math.min(allButtons.length, 20); i++) {
      try {
        const buttonText = await allButtons[i].textContent();
        const isVisible = await allButtons[i].isVisible();
        const className = await allButtons[i].getAttribute('class') || '';

        console.log(`  Button ${i}: "${buttonText}" (visible: ${isVisible}, class: "${className}")`);
      } catch (e) {
        console.log(`  Button ${i}: Could not analyze`);
      }
    }

    // Test assertion
    if (foundButton) {
      console.log(`\n✅ SUCCESS: Found Add button with selector: ${foundSelector}`);
    } else {
      console.log('\n❌ ISSUE: No Add button found');
    }

    // Take screenshot for manual inspection
    await authenticatedPage.screenshot({ path: 'test/assets-add-button-search.png', fullPage: true });

    // The test passes so we can see the results, but let's log the final result
    console.log(`\n📊 Result: ${foundButton ? 'Add button found' : 'Add button not found'}`);

    // For now, expect that we'll find an add button in a real application
    // This test is mainly for diagnostic purposes
    expect(allButtons.length).toBeGreaterThan(0); // We should have buttons on the page
  });
});