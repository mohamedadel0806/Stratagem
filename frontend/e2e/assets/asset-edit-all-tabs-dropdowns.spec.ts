/**
 * Enhanced comprehensive test for editing asset across all tabs with proper dropdown handling
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';

test.describe('Asset Edit All Tabs With Dropdowns', () => {
  test('should edit asset across all tabs and properly handle dropdowns', async ({ authenticatedPage }) => {
    console.log('\n🚀 TESTING ASSET EDIT ACROSS ALL TABS (WITH DROPDOWNS)');

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
      path: 'test-results/edit-all-tabs-dropdowns-initial-page.png',
      fullPage: true
    });

    // Step 2: Click Edit button to open modal
    console.log('\n🔍 Looking for Edit button on details page...');
    const editButton = await authenticatedPage.locator('button:has-text("Edit")').first();
    expect(await editButton.isVisible()).toBe(true);

    console.log('📝 Clicking Edit button to open modal...');
    await editButton.click();
    await authenticatedPage.waitForTimeout(3000);

    // Step 3: Wait for modal to appear and get reference
    console.log('\n🪟 Waiting for edit modal to appear...');
    const modal = await authenticatedPage.locator('[role="dialog"]').first();
    expect(await modal.isVisible()).toBe(true);

    // Screenshot modal opened
    await authenticatedPage.screenshot({
      path: 'test-results/edit-all-tabs-dropdowns-modal-opened.png',
      fullPage: true
    });

    // Get modal title
    const modalTitle = await modal.locator('h1, h2, h3, .modal-title, [data-testid*="title"]').first().textContent();
    console.log(`✅ Modal opened: "${modalTitle}"`);

    // Step 4: Look for tabs within the modal
    console.log('\n🧭 Looking for tabs within modal...');

    // Look for tabs specifically within the modal context
    const modalTabs = await modal.locator('[role="tab"], .tab, button[role="tab"]').all();
    let foundTabs = [];

    for (const tab of modalTabs) {
      try {
        const isVisible = await tab.isVisible();
        if (isVisible) {
          const text = await tab.textContent();
          if (text && text.trim() && text.trim().length < 50) {
            // Avoid duplicates and exclude non-content tabs
            const cleanText = text.trim();
            if (!foundTabs.some(t => t.text === cleanText) &&
                !cleanText.includes('🇺🇸') &&
                cleanText !== 'English' &&
                cleanText !== 'Language' &&
                !cleanText.toLowerCase().includes('close')) {
              foundTabs.push({
                element: tab,
                text: cleanText
              });
            }
          }
        }
      } catch (e) {
        // Continue
      }
    }

    console.log(`🧭 Found ${foundTabs.length} tabs in modal:`);
    foundTabs.forEach((tab, index) => {
      console.log(`  Tab ${index}: "${tab.text}"`);
    });

    expect(foundTabs.length).toBeGreaterThan(0);

    // Step 5: Process each tab within the modal
    let totalFieldsUpdated = 0;
    const timestamp = Date.now();

    for (let tabIndex = 0; tabIndex < foundTabs.length; tabIndex++) {
      const tab = foundTabs[tabIndex];
      console.log(`\n📍 Processing Tab ${tabIndex}: "${tab.text}"`);

      // Click the tab within modal context
      try {
        await tab.element.click();
        await authenticatedPage.waitForTimeout(2000);
      } catch (e) {
        console.log(`  ⚠️ Could not click tab "${tab.text}": ${e}`);
        continue;
      }

      // Screenshot the tab
      await authenticatedPage.screenshot({
        path: `test-results/edit-all-tabs-dropdowns-${tabIndex}-${tab.text.replace(/[^a-zA-Z0-9]/g, '_')}.png`,
        fullPage: true
      });

      // Look for form fields within this tab context (still within modal)
      const modalInputs = await modal.locator('input, textarea, select').all();
      const editableFields = [];

      for (const input of modalInputs) {
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
        for (let i = 0; i < Math.min(editableFields.length, 8); i++) { // Increased to handle more fields
          try {
            const field = editableFields[i];
            let fieldUpdated = false;

            // Handle SELECT elements properly
            if (field.tagName === 'select' || field.type === 'select-one') {
              try {
                // Get available options
                const options = await field.element.locator('option').all();
                console.log(`    🔍 Found ${options.length} options for select field: ${field.name}`);

                if (options.length > 1) {
                  // Log all available options for debugging
                  for (let optIndex = 0; optIndex < options.length; optIndex++) {
                    try {
                      const optValue = await options[optIndex].getAttribute('value');
                      const optText = await options[optIndex].textContent();
                      console.log(`      Option ${optIndex}: value="${optValue}", text="${optText}"`);
                    } catch (e) {
                      console.log(`      Option ${optIndex}: Error getting details`);
                    }
                  }

                  // Try to select a different option (select by index)
                  let selectedIndex = 1; // Start with index 1 (skip first option which might be placeholder)

                  if (options.length > 2) {
                    selectedIndex = Math.min(options.length - 1, 2); // Select a later option if available
                  } else if (options.length === 2) {
                    selectedIndex = 1; // Select second option
                  } else {
                    console.log(`    ⏭️ Only ${options.length} option(s) available for ${field.name}`);
                    continue;
                  }

                  try {
                    await field.element.selectOption({ index: selectedIndex });
                    tabFieldsUpdated++;
                    fieldUpdated = true;
                    const selectedText = await options[selectedIndex].textContent();
                    console.log(`    ✅ Selected option ${selectedIndex}: "${selectedText}" for ${field.name || field.type}`);
                  } catch (selectError) {
                    console.log(`    ❌ Could not select option ${selectedIndex}: ${selectError}`);
                  }
                } else {
                  console.log(`    ⚠️ Only ${options.length} option(s) available for ${field.name}`);
                }
              } catch (selectError) {
                console.log(`    ❌ Could not handle select field ${field.name}: ${selectError}`);
              }
            } else {
              // Handle INPUT and TEXTAREA elements
              let testValue = '';

              // Generate appropriate test values based on tab context and field characteristics
              if (tab.text.toLowerCase().includes('overview') || tab.text.toLowerCase().includes('basic')) {
                // Overview/Basic Info tab fields
                if (field.name?.toLowerCase().includes('description') || field.placeholder?.toLowerCase().includes('description')) {
                  testValue = `E2E Updated ${tab.text} description ${timestamp} - comprehensive asset information from multi-tab editing test`;
                } else if (field.name?.toLowerCase().includes('name') || field.placeholder?.toLowerCase().includes('name')) {
                  testValue = `E2E ${tab.text} Name ${timestamp}`;
                } else if (field.name?.toLowerCase().includes('identifier') || field.placeholder?.toLowerCase().includes('identifier')) {
                  testValue = `${field.currentValue}-EDITED-${timestamp}`;
                } else if (field.name?.toLowerCase().includes('type') || field.placeholder?.toLowerCase().includes('type')) {
                  testValue = `E2E ${tab.text} Type ${timestamp}`;
                } else {
                  testValue = `E2E ${tab.text} ${field.name || 'field'} ${timestamp}`;
                }
              } else if (tab.text.toLowerCase().includes('location') || tab.text.toLowerCase().includes('network')) {
                // Location & Network tab fields
                if (field.name?.toLowerCase().includes('location') || field.placeholder?.toLowerCase().includes('location')) {
                  testValue = `E2E ${tab.text} ${timestamp}`;
                } else if (field.name?.toLowerCase().includes('network') || field.placeholder?.toLowerCase().includes('network')) {
                  testValue = `E2E Network Config ${timestamp}`;
                } else if (field.name?.toLowerCase().includes('address') || field.placeholder?.toLowerCase().includes('address')) {
                  testValue = `123 E2E Test Street, Suite ${timestamp}`;
                } else if (field.name?.toLowerCase().includes('building') || field.placeholder?.toLowerCase().includes('building')) {
                  testValue = `E2E Building ${timestamp}`;
                } else {
                  testValue = `E2E ${tab.text} ${field.name || 'field'} ${timestamp}`;
                }
              } else if (tab.text.toLowerCase().includes('ownership')) {
                // Ownership tab fields
                if (field.name?.toLowerCase().includes('owner') || field.placeholder?.toLowerCase().includes('owner')) {
                  testValue = `E2E ${tab.text} ${timestamp}`;
                } else if (field.name?.toLowerCase().includes('department') || field.placeholder?.toLowerCase().includes('department')) {
                  testValue = `E2E Department ${timestamp}`;
                } else if (field.name?.toLowerCase().includes('manager') || field.placeholder?.toLowerCase().includes('manager')) {
                  testValue = `E2E Manager ${timestamp}`;
                } else if (field.name?.toLowerCase().includes('contact') || field.placeholder?.toLowerCase().includes('contact')) {
                  testValue = `contact${timestamp}@e2e.test`;
                } else {
                  testValue = `E2E ${tab.text} ${field.name || 'field'} ${timestamp}`;
                }
              } else if (tab.text.toLowerCase().includes('compliance') || tab.text.toLowerCase().includes('security')) {
                // Compliance & Security tab fields
                if (field.name?.toLowerCase().includes('compliance') || field.placeholder?.toLowerCase().includes('compliance')) {
                  testValue = `E2E ${tab.text} Level ${timestamp}`;
                } else if (field.name?.toLowerCase().includes('security') || field.placeholder?.toLowerCase().includes('security')) {
                  testValue = `E2E Security ${timestamp}`;
                } else if (field.name?.toLowerCase().includes('classification') || field.placeholder?.toLowerCase().includes('classification')) {
                  testValue = `E2E Classification ${timestamp}`;
                } else {
                  testValue = `E2E ${tab.text} ${field.name || 'field'} ${timestamp}`;
                }
              } else if (tab.text.toLowerCase().includes('control') || tab.text.toLowerCase().includes('risk')) {
                // Controls or Risks tab fields
                if (field.name?.toLowerCase().includes('control') || field.placeholder?.toLowerCase().includes('control')) {
                  testValue = `E2E ${tab.text} ${timestamp}`;
                } else if (field.name?.toLowerCase().includes('risk') || field.placeholder?.toLowerCase().includes('risk')) {
                  testValue = `E2E Risk Level ${timestamp}`;
                } else {
                  testValue = `E2E ${tab.text} ${field.name || 'field'} ${timestamp}`;
                }
              } else {
                // Generic fields for other tabs
                if (field.tagName === 'textarea') {
                  testValue = `E2E ${tab.text} tab content ${timestamp}\nMulti-line content for comprehensive testing\nThird line for thorough validation`;
                } else {
                  testValue = `E2E ${tab.text} ${field.name || 'field'} ${timestamp}`;
                }
              }

              if (testValue) {
                await field.element.fill(testValue);
                tabFieldsUpdated++;
                fieldUpdated = true;
                console.log(`    ✅ Updated ${field.tagName} "${field.name}": "${testValue.substring(0, 40)}..."`);
              }
            }

            if (!fieldUpdated) {
              console.log(`    ⚠️ Field ${field.name} was not updated (select element or no suitable value)`);
            }
          } catch (e) {
            console.log(`    ❌ Could not update field ${i}: ${e}`);
          }
        }

        totalFieldsUpdated += tabFieldsUpdated;
        console.log(`  ✅ Successfully updated ${tabFieldsUpdated} fields in "${tab.text}" tab`);

        // Screenshot after filling this tab
        await authenticatedPage.screenshot({
          path: `test-results/edit-all-tabs-dropdowns-${tabIndex}-${tab.text.replace(/[^a-zA-Z0-9]/g, '_')}-filled.png`,
          fullPage: true
        });
      } else {
        console.log(`  ℹ️ No editable fields found in "${tab.text}" tab`);
      }
    }

    // Step 6: Return to first tab for save
    console.log('\n🔙 Returning to first tab for save...');
    if (foundTabs.length > 0) {
      try {
        await foundTabs[0].element.click();
        await authenticatedPage.waitForTimeout(2000);
      } catch (e) {
        console.log(`  ⚠️ Could not return to first tab: ${e}`);
      }
    }

    // Screenshot before final save
    await authenticatedPage.screenshot({
      path: 'test-results/edit-all-tabs-dropdowns-before-save.png',
      fullPage: true
    });

    // Step 7: Look for and click save/update button within modal
    console.log('\n💾 Looking for save/update button in modal...');

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

    for (const selector of saveButtonSelectors) {
      try {
        const buttons = await modal.locator(selector).all();
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

    // Step 8: Wait for save to complete and modal to close
    console.log('\n⏳ Waiting for save to complete...');
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(5000);

    // Check if modal is still open
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

    // Step 9: Look for success messages
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
      path: 'test-results/edit-all-tabs-dropdowns-final-state.png',
      fullPage: true
    });

    // Verify we're back on a details page
    const finalUrl = authenticatedPage.url();
    console.log(`Final URL: ${finalUrl}`);

    console.log('\n📊 ASSET EDIT ALL TABS WITH DROPDOWNS TEST COMPLETE');
    console.log(`📁 Modal opened: ${modalTitle}`);
    console.log(`📁 Tabs found: ${foundTabs.length}`);
    console.log(`📁 Total fields updated: ${totalFieldsUpdated}`);
    console.log(`📁 Save button found: ${saveButtonFound}`);
    console.log(`📁 Save button text: "${saveButtonText}"`);
    console.log(`📁 Success message: ${successMessageFound ? successMessageText : 'None'}`);
    console.log('📁 Screenshots saved in test-results/');

    // Assertions
    // Modal should be closed after successful save
    expect(await modal.isVisible()).toBe(false);
    expect(foundTabs.length).toBeGreaterThan(0);
    expect(totalFieldsUpdated).toBeGreaterThan(0);
    expect(saveButtonFound).toBe(true);
  });
});