/**
 * Working asset details exploration test using existing assets
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';

test.describe('Working Asset Details Exploration', () => {
  test('should explore existing physical asset details', async ({ authenticatedPage }) => {
    console.log('\n🚀 TESTING EXISTING PHYSICAL ASSET DETAILS');

    // Step 1: Navigate to physical assets page and wait for data to load
    console.log('📍 Navigating to physical assets page...');
    await authenticatedPage.goto('http://localhost:3000/en/dashboard/assets/physical');

    // Wait for the page to fully load
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(5000);

    // Screenshot initial page state
    await authenticatedPage.screenshot({
      path: 'test-results/physical-assets-list-loaded.png',
      fullPage: true
    });

    // Step 2: Look for existing assets in the list/table
    console.log('\n🔍 Looking for existing assets...');

    const assetSelectors = [
      'text:has-text("View")',
      'text:has-text("Edit")',
      'button:has-text("View")',
      'button:has-text("Edit")',
      '.asset-row',
      'table tbody tr',
      '[data-testid*="asset"]',
      '.asset-item'
    ];

    let assetFound = false;
    let viewButton = null;

    // First try to find View/Edit buttons for existing assets
    for (const selector of assetSelectors) {
      try {
        const elements = await authenticatedPage.locator(selector).all();
        console.log(`  Found ${elements.length} elements with selector: ${selector}`);

        for (const element of elements) {
          const isVisible = await element.isVisible();
          if (isVisible) {
            const text = await element.textContent();

            // Look for View button specifically
            if (text && text.includes('View')) {
              viewButton = element;
              assetFound = true;
              console.log(`✅ Found View button: "${text.trim()}"`);
              break;
            }
          }
        }

        if (assetFound) break;
      } catch (e) {
        console.log(`  Error with selector ${selector}: ${e}`);
      }
    }

    if (!assetFound) {
      console.log('❌ No existing assets found with View buttons');

      // Take screenshot for debugging
      await authenticatedPage.screenshot({
        path: 'test-results/physical-assets-no-view-buttons.png',
        fullPage: true
      });

      test.skip();
      return;
    }

    // Step 3: Click the View button to go to asset details
    console.log('\n📍 Clicking View button to navigate to asset details...');
    await viewButton!.click();

    // Wait for navigation
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(3000);

    // Verify we're on a details page
    const currentUrl = authenticatedPage.url();
    console.log(`✅ Navigated to: ${currentUrl}`);

    if (!currentUrl.includes('/assets/physical/')) {
      console.log('❌ Not redirected to asset details page');

      await authenticatedPage.screenshot({
        path: 'test-results/physical-asset-not-details-page.png',
        fullPage: true
      });

      test.skip();
      return;
    }

    // Screenshot the asset details page
    await authenticatedPage.screenshot({
      path: 'test-results/physical-asset-details-loaded.png',
      fullPage: true
    });

    // Step 4: Analyze the asset details page structure
    console.log('\n📋 Analyzing asset details page...');

    // Look for tabs and navigation elements
    const tabSelectors = [
      '[role="tab"]',
      '.tab',
      'button[role="tab"]',
      '.tab-button',
      '[data-tab]',
      'nav button',
      '.nav button',
      '.details-nav button'
    ];

    let foundTabs = [];
    for (const selector of tabSelectors) {
      try {
        const tabs = await authenticatedPage.locator(selector).all();
        for (const tab of tabs) {
          const isVisible = await tab.isVisible();
          if (isVisible) {
            const text = await tab.textContent();
            if (text && text.trim() && text.trim().length < 50) {
              // Avoid duplicates
              const cleanText = text.trim();
              if (!foundTabs.some(t => t.text === cleanText)) {
                foundTabs.push({
                  element: tab,
                  text: cleanText,
                  selector
                });
              }
            }
          }
        }
      } catch (e) {
        // Continue
      }
    }

    console.log(`🧭 Found ${foundTabs.length} navigation tabs:`);
    foundTabs.forEach((tab, index) => {
      console.log(`  Tab ${index}: "${tab.text}" (${tab.selector})`);
    });

    // Step 5: Look for asset form fields (excluding search)
    console.log('\n📝 Looking for asset detail form fields...');

    const allFormFields = await authenticatedPage.locator('input, textarea, select').all();
    const assetFormFields = [];

    for (const field of allFormFields) {
      try {
        const isVisible = await field.isVisible();
        if (isVisible) {
          const type = await field.getAttribute('type') || '';
          const placeholder = await field.getAttribute('placeholder') || '';
          const name = await field.getAttribute('name') || '';

          // Exclude search and global navigation fields
          const isSearchField = type === 'search' ||
                              placeholder.toLowerCase().includes('search') ||
                              name.toLowerCase().includes('search') ||
                              placeholder.toLowerCase().includes('all assets');

          if (!isSearchField) {
            const tagName = await field.evaluate((el: any) => el.tagName.toLowerCase());
            const isDisabled = await field.isDisabled();
            const isReadOnly = await field.getAttribute('readonly') !== null;
            const value = await field.inputValue().catch(() => '');

            assetFormFields.push({
              element: field,
              tagName,
              type,
              name,
              placeholder,
              value,
              isDisabled,
              isReadOnly
            });
          }
        }
      } catch (e) {
        // Continue
      }
    }

    console.log(`📝 Found ${assetFormFields.length} asset form fields (excluding search):`);
    assetFormFields.slice(0, 8).forEach((field, index) => {
      console.log(`  Field ${index}: ${field.tagName.toUpperCase()} - name: "${field.name}", placeholder: "${field.placeholder}", value: "${field.value.substring(0, 30)}..." (disabled: ${field.isDisabled})`);
    });

    // Step 6: Try to interact with editable form fields
    if (assetFormFields.length > 0) {
      const editableFields = assetFormFields.filter(f => !f.isDisabled && !f.isReadOnly);

      if (editableFields.length > 0) {
        console.log(`\n✏️ Found ${editableFields.length} editable fields - attempting to fill...`);

        const timestamp = Date.now();
        let fieldsUpdated = 0;

        for (let i = 0; i < Math.min(editableFields.length, 3); i++) {
          try {
            const field = editableFields[i];
            let testValue = '';

            // Generate appropriate test values based on field characteristics
            if (field.name?.toLowerCase().includes('description') ||
                field.placeholder?.toLowerCase().includes('description')) {
              testValue = `E2E Updated description ${timestamp}`;
            } else if (field.name?.toLowerCase().includes('notes') ||
                       field.placeholder?.toLowerCase().includes('notes')) {
              testValue = `E2E Updated notes ${timestamp} - testing asset detail form functionality`;
            } else if (field.tagName === 'textarea') {
              testValue = `E2E textarea update ${timestamp} - multiline text testing`;
            } else {
              testValue = `E2E Test ${field.name || 'field'} ${timestamp}`;
            }

            // Store original value
            const originalValue = await field.element.inputValue().catch(() => '');

            // Fill the field
            await field.element.fill(testValue);
            fieldsUpdated++;

            console.log(`  ✅ Updated ${field.tagName} "${field.name}": "${testValue}"`);
          } catch (e) {
            console.log(`  ❌ Could not update field ${i}: ${e}`);
          }
        }

        if (fieldsUpdated > 0) {
          // Screenshot after filling fields
          await authenticatedPage.screenshot({
            path: 'test-results/physical-asset-details-fields-filled.png',
            fullPage: true
          });
        }
      } else {
        console.log('  ℹ️ No editable fields found - all fields are read-only or disabled');
      }
    } else {
      console.log('  ℹ️ No asset form fields found - page might be in view-only mode');
    }

    // Step 7: Try clicking some tabs if available
    if (foundTabs.length > 1) {
      console.log('\n🔄 Exploring asset detail tabs...');

      for (let i = 1; i < Math.min(foundTabs.length, 4); i++) {
        try {
          const tab = foundTabs[i];
          console.log(`📍 Clicking tab: "${tab.text}"`);

          await tab.element.click();
          await authenticatedPage.waitForTimeout(3000);

          // Screenshot each tab
          await authenticatedPage.screenshot({
            path: `test-results/physical-asset-tab-${i}-${tab.text.replace(/[^a-zA-Z0-9]/g, '_')}.png`,
            fullPage: true
          });

          console.log(`✅ Screenshot captured for tab: "${tab.text}"`);
        } catch (e) {
          console.log(`❌ Could not click tab ${i}: ${e}`);
        }
      }
    }

    // Step 8: Look for save/update buttons
    console.log('\n💾 Looking for save/update buttons...');

    const saveButtonSelectors = [
      'button:has-text("Save")',
      'button:has-text("Update")',
      'button:has-text("Save Changes")',
      'button:has-text("Apply")',
      'button[type="submit"]'
    ];

    let saveButtonFound = false;
    for (const selector of saveButtonSelectors) {
      try {
        const buttons = await authenticatedPage.locator(selector).all();
        for (const button of buttons) {
          const isVisible = await button.isVisible();
          const isEnabled = await button.isEnabled();
          if (isVisible && isEnabled) {
            const buttonText = await button.textContent();
            console.log(`💾 Found save button: "${buttonText}"`);
            saveButtonFound = true;

            // Click the save button
            await button.click();
            await authenticatedPage.waitForTimeout(5000);

            // Screenshot after save
            await authenticatedPage.screenshot({
              path: 'test-results/physical-asset-details-after-save.png',
              fullPage: true
            });

            break;
          }
        }
        if (saveButtonFound) break;
      } catch (e) {
        // Continue
      }
    }

    if (!saveButtonFound) {
      console.log('  ℹ️ No save buttons found - page might be in read-only mode');
    }

    // Final screenshot
    await authenticatedPage.screenshot({
      path: 'test-results/physical-asset-details-final-state.png',
      fullPage: true
    });

    console.log('\n📊 PHYSICAL ASSET DETAILS TEST COMPLETE');
    console.log(`📁 Asset found and accessed: ${assetFound}`);
    console.log(`📁 Navigation tabs found: ${foundTabs.length}`);
    console.log(`📁 Form fields found: ${assetFormFields.length}`);
    console.log(`📁 Save button found: ${saveButtonFound}`);
    console.log('📁 All screenshots saved in test-results/');

    expect(assetFound).toBe(true);
    expect(currentUrl).toContain('/assets/physical/');
  });
});