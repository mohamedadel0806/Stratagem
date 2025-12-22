/**
 * Test to find the correct form field selectors in the asset creation form
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';
import { waitForAssetsPage } from '../utils/helpers';

test.describe('Asset Form - Find Field Selectors', () => {
  test('should locate the correct form field selectors', async ({ authenticatedPage }) => {
    // Navigate to assets page
    await authenticatedPage.goto('/dashboard/assets/physical');
    await waitForAssetsPage(authenticatedPage);

    // Click "New Asset" button
    await authenticatedPage.click('button:has-text("New Asset")');

    // Wait for form to appear
    await authenticatedPage.waitForTimeout(3000);

    // Take screenshot of form
    await authenticatedPage.screenshot({ path: 'test-results/asset-form-fields.png', fullPage: true });

    console.log('🔍 Searching for form fields...');

    // Look for form inputs
    const inputSelectors = [
      'input[name*="unique"]',
      'input[name*="description"]',
      'input[name*="asset"]',
      'input[placeholder*="unique"]',
      'input[placeholder*="description"]',
      'input[placeholder*="asset"]',
      'input[type="text"]',
      'textarea'
    ];

    let foundInputs = [];

    for (const selector of inputSelectors) {
      try {
        const elements = await authenticatedPage.locator(selector).all();
        for (let i = 0; i < elements.length; i++) {
          const isVisible = await elements[i].isVisible().catch(() => false);
          if (isVisible) {
            const name = await elements[i].getAttribute('name');
            const placeholder = await elements[i].getAttribute('placeholder');
            const type = await elements[i].getAttribute('type');
            const label = await elements[i].evaluate((el: any) => {
              const parentLabel = el.closest('label');
              if (parentLabel) return parentLabel.textContent?.trim();

              const associatedLabel = document.querySelector(`label[for="${el.id}"]`);
              if (associatedLabel) return associatedLabel.textContent?.trim();

              return '';
            });

            console.log(`✅ Found input with selector "${selector}":`);
            console.log(`   - Name: ${name || 'none'}`);
            console.log(`   - Placeholder: ${placeholder || 'none'}`);
            console.log(`   - Type: ${type || 'none'}`);
            console.log(`   - Label: ${label || 'none'}`);

            foundInputs.push({
              selector,
              name,
              placeholder,
              type,
              label
            });
          }
        }
      } catch (e) {
        // Selector not found, continue
      }
    }

    // Look for select elements
    const selectSelectors = [
      'select[name*="type"]',
      'select[name*="criticality"]',
      'select'
    ];

    console.log('\n🔍 Searching for select elements...');

    for (const selector of selectSelectors) {
      try {
        const elements = await authenticatedPage.locator(selector).all();
        for (let i = 0; i < elements.length; i++) {
          const isVisible = await elements[i].isVisible().catch(() => false);
          if (isVisible) {
            const name = await elements[i].getAttribute('name');
            const label = await elements[i].evaluate((el: any) => {
              const parentLabel = el.closest('label');
              if (parentLabel) return parentLabel.textContent?.trim();

              const associatedLabel = document.querySelector(`label[for="${el.id}"]`);
              if (associatedLabel) return associatedLabel.textContent?.trim();

              return '';
            });

            console.log(`✅ Found select with selector "${selector}":`);
            console.log(`   - Name: ${name || 'none'}`);
            console.log(`   - Label: ${label || 'none'}`);

            foundInputs.push({
              selector,
              name,
              label,
              type: 'select'
            });
          }
        }
      } catch (e) {
        // Selector not found, continue
      }
    }

    // Get all form elements
    const allInputs = await authenticatedPage.locator('input, select, textarea').all();
    console.log(`\n📋 Total form elements found: ${allInputs.length}`);

    console.log('\n📊 Summary:');
    console.log(`Found ${foundInputs.length} visible form elements`);

    // The test passes if we find some form elements
    expect(foundInputs.length).toBeGreaterThan(0);
  });
});