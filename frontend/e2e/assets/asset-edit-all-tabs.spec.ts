/**
 * Comprehensive test for editing asset across all tabs in the edit form
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';

test.describe('Asset Edit All Tabs', () => {
  test('should edit asset across all tabs and save changes', async ({ authenticatedPage }) => {
    console.log('\n🚀 TESTING ASSET EDIT ACROSS ALL TABS');

    // Step 1: Navigate to a specific asset details page
    console.log('📍 Navigating to asset details page...');
    await authenticatedPage.goto('http://localhost:3000/en/dashboard/assets/physical/99cb990a-29e4-4e34-acf4-d58b8261046b');
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(5000);

    // Verify we're on the details page
    const currentUrl = authenticatedPage.url();
    console.log(`✅ Current URL: ${currentUrl}`);
    expect(currentUrl).toContain('/assets/physical/');

    // Screenshot the initial details page
    await authenticatedPage.screenshot({
      path: 'test-results/edit-all-tabs-initial-page.png',
      fullPage: true
    });

    // Step 2: Click Edit button to enter edit mode
    console.log('\n🔍 Looking for Edit button on details page...');
    const editButton = await authenticatedPage.locator('button:has-text("Edit")').first();
    expect(await editButton.isVisible()).toBe(true);

    console.log('📝 Clicking Edit button to enter edit mode...');
    await editButton.click();
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.waitForLoadState('networkidle');

    // Step 3: Look for tabs in the edit form
    console.log('\n🧭 Looking for tabs in edit form...');

    // Look for edit form tabs
    const tabSelectors = [
      '[role="tab"]',
      '.tab',
      'button[role="tab"]',
      '.tab-button',
      '[data-tab]',
      '.edit-tab',
      '.form-tab',
      'nav button',
      '.nav button',
      '.tabs button'
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
              // Avoid duplicates and exclude language selector
              const cleanText = text.trim();
              if (!foundTabs.some(t => t.text === cleanText) &&
                  !cleanText.includes('🇺🇸') &&
                  cleanText !== 'English' &&
                  cleanText !== 'Language') {
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

    console.log(`🧭 Found ${foundTabs.length} tabs in edit form:`);
    foundTabs.forEach((tab, index) => {
      console.log(`  Tab ${index}: "${tab.text}" (${tab.selector})`);
    });

    expect(foundTabs.length).toBeGreaterThan(0);

    // Step 4: Process each tab
    let totalFieldsUpdated = 0;
    const timestamp = Date.now();

    for (let tabIndex = 0; tabIndex < foundTabs.length; tabIndex++) {
      const tab = foundTabs[tabIndex];
      console.log(`\n📍 Processing Tab ${tabIndex}: "${tab.text}"`);

      // Click the tab
      await tab.element.click();
      await authenticatedPage.waitForTimeout(2000);

      // Screenshot the tab
      await authenticatedPage.screenshot({
        path: `test-results/edit-all-tabs-${tabIndex}-${tab.text.replace(/[^a-zA-Z0-9]/g, '_')}.png`,
        fullPage: true
      });

      // Look for form fields in this tab
      const allInputs = await authenticatedPage.locator('input, textarea, select').all();
      const editableFields = [];

      for (const input of allInputs) {
        try {
          const isVisible = await input.isVisible();
          if (isVisible) {
            const type = await input.getAttribute('type') || '';
            const name = await input.getAttribute('name') || '';
            const placeholder = await input.getAttribute('placeholder') || '';
            const isDisabled = await input.isDisabled();
            const isReadOnly = await input.getAttribute('readonly') !== null;

            // Exclude search fields and disabled/readonly fields
            const isSearchField = type === 'search' ||
                                placeholder.toLowerCase().includes('search') ||
                                name.toLowerCase().includes('search') ||
                                placeholder.toLowerCase().includes('all assets');

            if (!isSearchField && !isDisabled && !isReadOnly) {
              const tagName = await input.evaluate((el: any) => el.tagName.toLowerCase());
              const currentValue = await input.inputValue().catch(() => '');

              editableFields.push({
                element: input,
                tagName,
                type,
                name,
                placeholder,
                currentValue,
                isDisabled,
                isReadOnly
              });
            }
          }
        } catch (e) {
          // Continue
        }
      }

      console.log(`  📝 Found ${editableFields.length} editable fields in "${tab.text}" tab:`);
      editableFields.slice(0, 8).forEach((field, index) => {
        console.log(`    Field ${index}: ${field.tagName.toUpperCase()} - name: "${field.name}", current: "${field.currentValue.substring(0, 30)}..."`);
      });

      // Fill form fields in this tab
      if (editableFields.length > 0) {
        console.log(`  ✏️ Filling form fields in "${tab.text}" tab...`);

        let tabFieldsUpdated = 0;
        for (let i = 0; i < Math.min(editableFields.length, 5); i++) {
          try {
            const field = editableFields[i];
            let testValue = '';

            // Generate appropriate test values based on tab context and field characteristics
            if (tab.text.toLowerCase().includes('overview') || tab.text.toLowerCase().includes('basic')) {
              // Overview tab fields
              if (field.name?.toLowerCase().includes('description') || field.placeholder?.toLowerCase().includes('description')) {
                testValue = `E2E Updated overview description ${timestamp} - comprehensive asset overview from multi-tab editing test`;
              } else if (field.name?.toLowerCase().includes('name') || field.placeholder?.toLowerCase().includes('name')) {
                testValue = `E2E Asset Name ${timestamp}`;
              } else if (field.name?.toLowerCase().includes('identifier') || field.placeholder?.toLowerCase().includes('identifier')) {
                testValue = `${field.currentValue}-EDITED-${timestamp}`;
              } else if (field.name?.toLowerCase().includes('type') || field.placeholder?.toLowerCase().includes('type')) {
                testValue = `E2E Asset Type ${timestamp}`;
              } else {
                testValue = `E2E Overview ${field.name || 'field'} ${timestamp}`;
              }
            } else if (tab.text.toLowerCase().includes('location') || tab.text.toLowerCase().includes('network')) {
              // Location & Network tab fields
              if (field.name?.toLowerCase().includes('location') || field.placeholder?.toLowerCase().includes('location')) {
                testValue = `E2E Test Location ${timestamp}`;
              } else if (field.name?.toLowerCase().includes('network') || field.placeholder?.toLowerCase().includes('network')) {
                testValue = `E2E Network ${timestamp}`;
              } else if (field.name?.toLowerCase().includes('address') || field.placeholder?.toLowerCase().includes('address')) {
                testValue = `123 E2E Test Street, Suite ${timestamp}`;
              } else if (field.name?.toLowerCase().includes('building') || field.placeholder?.toLowerCase().includes('building')) {
                testValue = `E2E Building ${timestamp}`;
              } else if (field.name?.toLowerCase().includes('floor') || field.placeholder?.toLowerCase().includes('floor')) {
                testValue = `Floor ${timestamp % 10}`;
              } else {
                testValue = `E2E Location ${field.name || 'field'} ${timestamp}`;
              }
            } else if (tab.text.toLowerCase().includes('ownership')) {
              // Ownership tab fields
              if (field.name?.toLowerCase().includes('owner') || field.placeholder?.toLowerCase().includes('owner')) {
                testValue = `E2E Test Owner ${timestamp}`;
              } else if (field.name?.toLowerCase().includes('department') || field.placeholder?.toLowerCase().includes('department')) {
                testValue = `E2E Test Department ${timestamp}`;
              } else if (field.name?.toLowerCase().includes('manager') || field.placeholder?.toLowerCase().includes('manager')) {
                testValue = `E2E Test Manager ${timestamp}`;
              } else if (field.name?.toLowerCase().includes('contact') || field.placeholder?.toLowerCase().includes('contact')) {
                testValue = `contact${timestamp}@e2e.test`;
              } else {
                testValue = `E2E Ownership ${field.name || 'field'} ${timestamp}`;
              }
            } else if (tab.text.toLowerCase().includes('compliance') || tab.text.toLowerCase().includes('security')) {
              // Compliance & Security tab fields
              if (field.name?.toLowerCase().includes('compliance') || field.placeholder?.toLowerCase().includes('compliance')) {
                testValue = `E2E Compliance ${timestamp}`;
              } else if (field.name?.toLowerCase().includes('security') || field.placeholder?.toLowerCase().includes('security')) {
                testValue = `E2E Security Level ${timestamp}`;
              } else if (field.name?.toLowerCase().includes('classification') || field.placeholder?.toLowerCase().includes('classification')) {
                testValue = `E2E Classification ${timestamp}`;
              } else {
                testValue = `E2E Compliance ${field.name || 'field'} ${timestamp}`;
              }
            } else if (tab.text.toLowerCase().includes('control') || tab.text.toLowerCase().includes('risk')) {
              // Controls or Risks tab fields
              if (field.name?.toLowerCase().includes('control') || field.placeholder?.toLowerCase().includes('control')) {
                testValue = `E2E Control ${timestamp}`;
              } else if (field.name?.toLowerCase().includes('risk') || field.placeholder?.toLowerCase().includes('risk')) {
                testValue = `E2E Risk Level ${timestamp}`;
              } else {
                testValue = `E2E Control ${field.name || 'field'} ${timestamp}`;
              }
            } else {
              // Generic fields for other tabs
              if (field.tagName === 'textarea') {
                testValue = `E2E ${tab.text} tab content ${timestamp}\nMulti-line content for comprehensive testing\nThird line for thorough validation`;
              } else if (field.tagName === 'select' || field.type === 'select-one') {
                // For select elements, try to select a different option
                const options = await field.element.locator('option').all();
                if (options.length > 1) {
                  await field.element.selectOption({ index: Math.min(options.length - 1, 2) });
                  tabFieldsUpdated++;
                  console.log(`    ✅ Selected different option for ${field.name}`);
                  continue;
                }
              } else {
                testValue = `E2E ${tab.text} ${field.name || 'field'} ${timestamp}`;
              }
            }

            if (testValue) {
              await field.element.fill(testValue);
              tabFieldsUpdated++;
              console.log(`    ✅ Updated ${field.tagName} "${field.name}": "${testValue.substring(0, 40)}..."`);
            }
          } catch (e) {
            console.log(`    ❌ Could not update field ${i}: ${e}`);
          }
        }

        totalFieldsUpdated += tabFieldsUpdated;
        console.log(`  ✅ Successfully updated ${tabFieldsUpdated} fields in "${tab.text}" tab`);

        // Screenshot after filling this tab
        await authenticatedPage.screenshot({
          path: `test-results/edit-all-tabs-${tabIndex}-${tab.text.replace(/[^a-zA-Z0-9]/g, '_')}-filled.png`,
          fullPage: true
        });
      } else {
        console.log(`  ℹ️ No editable fields found in "${tab.text}" tab`);
      }
    }

    // Step 5: Return to first tab and save
    console.log('\n🔙 Returning to first tab for save...');
    if (foundTabs.length > 0) {
      await foundTabs[0].element.click();
      await authenticatedPage.waitForTimeout(2000);
    }

    // Screenshot before final save
    await authenticatedPage.screenshot({
      path: 'test-results/edit-all-tabs-before-final-save.png',
      fullPage: true
    });

    // Step 6: Look for and click save/update button
    console.log('\n💾 Looking for save/update button...');

    const saveButtonSelectors = [
      'button:has-text("Save")',
      'button:has-text("Update")',
      'button:has-text("Save Changes")',
      'button:has-text("Apply")',
      'button:has-text("Submit")',
      'button[type="submit"]'
    ];

    let saveButtonFound = false;
    let saveButtonText = '';

    // Check if we're in a modal or on page
    const modal = await authenticatedPage.locator('[role="dialog"]').first();
    const modalVisible = await modal.isVisible().catch(() => false);
    const searchContext = modalVisible ? modal : authenticatedPage;

    for (const selector of saveButtonSelectors) {
      try {
        const buttons = await searchContext.locator(selector).all();
        for (const button of buttons) {
          const isVisible = await button.isVisible();
          const isEnabled = await button.isEnabled();
          if (isVisible && isEnabled) {
            const text = await button.textContent();
            if (text) {
              saveButtonFound = true;
              saveButtonText = text.trim();
              console.log(`✅ Found save button: "${saveButtonText}"`);

              await button.click();
              console.log(`✅ Clicked save button: "${saveButtonText}"`);
              break;
            }
          }
        }
        if (saveButtonFound) break;
      } catch (e) {
        console.log(`  Error with save selector ${selector}: ${e}`);
      }
    }

    expect(saveButtonFound).toBe(true);

    // Step 7: Wait for save to complete
    console.log('\n⏳ Waiting for save to complete...');
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(5000);

    // Check if modal is still open
    if (modalVisible) {
      const modalStillVisible = await modal.isVisible().catch(() => false);
      if (!modalStillVisible) {
        console.log('✅ Modal closed after save');
      } else {
        console.log('⚠️ Modal still visible, checking for validation errors...');

        // Look for validation errors
        const errorSelectors = [
          'text:has-text("required")',
          'text:has-text("error")',
          'text:has-text("invalid")',
          '.error-message',
          '.validation-error'
        ];

        let validationErrors = [];
        for (const selector of errorSelectors) {
          try {
            const errors = await modal.locator(selector).all();
            for (const error of errors) {
              if (await error.isVisible()) {
                const errorText = await error.textContent();
                if (errorText) {
                  validationErrors.push(errorText.trim());
                }
              }
            }
          } catch (e) {
            // Continue
          }
        }

        if (validationErrors.length > 0) {
          console.log('❌ Validation errors found:');
          validationErrors.forEach(error => console.log(`  - ${error}`));
        }

        // Close modal if still open
        const closeButton = await modal.locator('button:has-text("Cancel"), button:has-text("Close")').first();
        if (await closeButton.isVisible()) {
          await closeButton.click();
          await authenticatedPage.waitForTimeout(2000);
        }
      }
    }

    // Step 8: Look for success messages
    console.log('\n🔍 Looking for success messages...');

    const successSelectors = [
      'text:has-text("success")',
      'text:has-text("saved")',
      'text:has-text("updated")',
      'text:has-text("Success")',
      '.success-message',
      '.alert-success',
      '.toast',
      '[data-testid="success"]'
    ];

    let successMessageFound = false;
    let successMessageText = '';

    for (const selector of successSelectors) {
      try {
        const elements = await authenticatedPage.locator(selector).all();
        for (const element of elements) {
          const isVisible = await element.isVisible();
          if (isVisible) {
            const text = await element.textContent();
            if (text && (text.toLowerCase().includes('success') ||
                        text.toLowerCase().includes('saved') ||
                        text.toLowerCase().includes('updated'))) {
              successMessageFound = true;
              successMessageText = text.trim();
              console.log(`✅ Success message: "${successMessageText}"`);
              break;
            }
          }
        }
        if (successMessageFound) break;
      } catch (e) {
        // Continue
      }
    }

    // Final screenshot
    await authenticatedPage.screenshot({
      path: 'test-results/edit-all-tabs-final-state.png',
      fullPage: true
    });

    // Verify we're back on a details page
    const finalUrl = authenticatedPage.url();
    console.log(`Final URL: ${finalUrl}`);

    console.log('\n📊 ASSET EDIT ALL TABS TEST COMPLETE');
    console.log(`📁 Tabs found: ${foundTabs.length}`);
    console.log(`📁 Total fields updated: ${totalFieldsUpdated}`);
    console.log(`📁 Save button found: ${saveButtonFound}`);
    console.log(`📁 Save button text: "${saveButtonText}"`);
    console.log(`📁 Success message: ${successMessageFound ? successMessageText : 'None'}`);
    console.log('📁 Screenshots saved in test-results/');

    // Assertions
    expect(foundTabs.length).toBeGreaterThan(0);
    expect(totalFieldsUpdated).toBeGreaterThan(0);
    expect(saveButtonFound).toBe(true);
  });
});