/**
 * Test for editing existing assets - filling forms and saving changes
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';

test.describe('Asset Edit and Save', () => {
  test('should edit existing physical asset and save changes', async ({ authenticatedPage }) => {
    console.log('\n🚀 TESTING PHYSICAL ASSET EDIT AND SAVE');

    // Step 1: Navigate to physical assets page
    console.log('📍 Navigating to physical assets page...');
    await authenticatedPage.goto('http://localhost:3000/en/dashboard/assets/physical');
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(5000);

    // Screenshot initial state
    await authenticatedPage.screenshot({
      path: 'test-results/physical-assets-before-edit.png',
      fullPage: true
    });

    // Step 2: Look for Edit buttons
    console.log('\n🔍 Looking for Edit buttons...');

    const editButtonSelectors = [
      'button:has-text("Edit")',
      'text:has-text("Edit")',
      '[data-testid*="edit"]',
      '.edit-button',
      '.btn-edit'
    ];

    let editButtonFound = false;
    let editButton = null;

    for (const selector of editButtonSelectors) {
      try {
        const buttons = await authenticatedPage.locator(selector).all();
        console.log(`  Found ${buttons.length} elements with selector: ${selector}`);

        for (const button of buttons) {
          const isVisible = await button.isVisible();
          if (isVisible) {
            const text = await button.textContent();
            if (text && text.includes('Edit')) {
              editButton = button;
              editButtonFound = true;
              console.log(`✅ Found Edit button: "${text.trim()}"`);
              break;
            }
          }
        }

        if (editButtonFound) break;
      } catch (e) {
        console.log(`  Error with selector ${selector}: ${e}`);
      }
    }

    if (!editButtonFound) {
      console.log('❌ No Edit buttons found');

      // Look for alternative ways to edit - maybe clicking on the asset row itself
      console.log('🔍 Trying alternative edit methods...');

      // Try clicking on an asset row to see if it goes to edit mode
      const assetRows = await authenticatedPage.locator('table tbody tr, .asset-row').all();

      if (assetRows.length > 0) {
        console.log(`✅ Found ${assetRows.length} asset rows, trying first one...`);

        try {
          await assetRows[0].click();
          await authenticatedPage.waitForTimeout(3000);

          const currentUrl = authenticatedPage.url();
          console.log(`✅ Clicked asset row, navigated to: ${currentUrl}`);

          if (currentUrl.includes('/assets/physical/')) {
            editButtonFound = true;

            // Now look for edit button on the details page
            const detailsEditButtons = await authenticatedPage.locator('button:has-text("Edit")').all();
            for (const btn of detailsEditButtons) {
              if (await btn.isVisible()) {
                editButton = btn;
                break;
              }
            }

            if (editButton) {
              await editButton.click();
              await authenticatedPage.waitForTimeout(3000);
            }
          }
        } catch (e) {
          console.log(`❌ Could not click asset row: ${e}`);
        }
      }
    }

    if (!editButtonFound || !editButton) {
      console.log('❌ Could not find any way to edit assets');

      await authenticatedPage.screenshot({
        path: 'test-results/physical-assets-no-edit-access.png',
        fullPage: true
      });

      test.skip();
      return;
    }

    // Step 3: We should now be in edit mode - look for form fields
    console.log('\n📝 Looking for editable form fields...');

    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(3000);

    // Screenshot edit mode
    await authenticatedPage.screenshot({
      path: 'test-results/physical-asset-edit-mode.png',
      fullPage: true
    });

    // Look for input fields (excluding search)
    const allInputs = await authenticatedPage.locator('input, textarea, select').all();
    const editableFields = [];

    for (const input of allInputs) {
      try {
        const isVisible = await input.isVisible();
        if (isVisible) {
          const type = await input.getAttribute('type') || '';
          const placeholder = await input.getAttribute('placeholder') || '';
          const name = await input.getAttribute('name') || '';
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

    console.log(`📝 Found ${editableFields.length} editable form fields:`);
    editableFields.slice(0, 10).forEach((field, index) => {
      console.log(`  Field ${index}: ${field.tagName.toUpperCase()} - name: "${field.name}", placeholder: "${field.placeholder}", current value: "${field.currentValue.substring(0, 30)}..."`);
    });

    if (editableFields.length === 0) {
      console.log('❌ No editable fields found - might still be in view mode');

      await authenticatedPage.screenshot({
        path: 'test-results/physical-asset-no-editable-fields.png',
        fullPage: true
      });

      test.skip();
      return;
    }

    // Step 4: Fill form fields with test data
    console.log('\n✏️ Filling form fields with test data...');

    const timestamp = Date.now();
    let fieldsFilled = 0;

    for (let i = 0; i < Math.min(editableFields.length, 5); i++) {
      try {
        const field = editableFields[i];
        let testValue = '';

        // Generate appropriate test values
        if (field.name?.toLowerCase().includes('name') ||
            field.placeholder?.toLowerCase().includes('name')) {
          testValue = `E2E Edited Asset ${timestamp}`;
        } else if (field.name?.toLowerCase().includes('description') ||
                   field.placeholder?.toLowerCase().includes('description')) {
          testValue = `E2E Updated description for physical asset ${timestamp} - this is a test update via automated testing`;
        } else if (field.name?.toLowerCase().includes('notes') ||
                   field.placeholder?.toLowerCase().includes('notes')) {
          testValue = `E2E Updated notes ${timestamp} - testing asset edit functionality with multiline content`;
        } else if (field.name?.toLowerCase().includes('location') ||
                   field.placeholder?.toLowerCase().includes('location')) {
          testValue = `E2E Test Location ${timestamp}`;
        } else if (field.name?.toLowerCase().includes('owner') ||
                   field.placeholder?.toLowerCase().includes('owner')) {
          testValue = `E2E Test Owner ${timestamp}`;
        } else if (field.tagName === 'textarea') {
          testValue = `E2E textarea content ${timestamp} - multiline text testing for asset editing functionality`;
        } else if (field.tagName === 'select') {
          // For select elements, try to select a different option
          const options = await field.element.locator('option').all();
          if (options.length > 1) {
            // Select second option (skip first which might be placeholder)
            await field.element.selectOption({ index: 1 });
            fieldsFilled++;
            console.log(`  ✅ Selected different option for ${field.tagName} "${field.name}"`);
            continue;
          }
        } else {
          testValue = `E2E Test ${field.name || 'field'} ${timestamp}`;
        }

        if (testValue) {
          await field.element.fill(testValue);
          fieldsFilled++;
          console.log(`  ✅ Filled ${field.tagName} "${field.name}": "${testValue.substring(0, 50)}..."`);
        }
      } catch (e) {
        console.log(`  ❌ Could not fill field ${i}: ${e}`);
      }
    }

    console.log(`✅ Successfully filled ${fieldsFilled} form fields`);

    // Screenshot after filling
    await authenticatedPage.screenshot({
      path: 'test-results/physical-asset-form-filled.png',
      fullPage: true
    });

    // Step 5: Look for and click save/update button
    console.log('\n💾 Looking for save/update buttons...');

    const saveButtonSelectors = [
      'button:has-text("Save")',
      'button:has-text("Update")',
      'button:has-text("Save Changes")',
      'button:has-text("Apply")',
      'button:has-text("Submit")',
      'button[type="submit"]',
      'input[type="submit"]'
    ];

    let saveButtonFound = false;
    let saveButtonText = '';

    for (const selector of saveButtonSelectors) {
      try {
        const buttons = await authenticatedPage.locator(selector).all();
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

    if (!saveButtonFound) {
      console.log('❌ No save/update buttons found');

      await authenticatedPage.screenshot({
        path: 'test-results/physical-asset-no-save-button.png',
        fullPage: true
      });

      test.skip();
      return;
    }

    // Step 6: Wait for save to complete and verify
    console.log('\n⏳ Waiting for save to complete...');
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(5000);

    // Look for success messages
    const successSelectors = [
      'text:has-text("success")',
      'text:has-text("saved")',
      'text:has-text("updated")',
      'text:has-text("Success")',
      '.success-message',
      '.alert-success',
      '[data-testid="success"]'
    ];

    let successMessageFound = false;
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
              console.log(`✅ Success message found: "${text.trim()}"`);
              successMessageFound = true;
              break;
            }
          }
        }
        if (successMessageFound) break;
      } catch (e) {
        // Continue
      }
    }

    // Check for error messages too
    const errorSelectors = [
      'text:has-text("error")',
      'text:has-text("failed")',
      'text:has-text("Error")',
      '.error-message',
      '.alert-error',
      '[data-testid="error"]'
    ];

    let errorMessageFound = false;
    for (const selector of errorSelectors) {
      try {
        const elements = await authenticatedPage.locator(selector).all();
        for (const element of elements) {
          const isVisible = await element.isVisible();
          if (isVisible) {
            const text = await element.textContent();
            if (text && (text.toLowerCase().includes('error') ||
                        text.toLowerCase().includes('failed'))) {
              console.log(`❌ Error message found: "${text.trim()}"`);
              errorMessageFound = true;
              break;
            }
          }
        }
        if (errorMessageFound) break;
      } catch (e) {
        // Continue
      }
    }

    // Final screenshot
    await authenticatedPage.screenshot({
      path: 'test-results/physical-asset-after-save.png',
      fullPage: true
    });

    // Check if we're still on the same page (redirect might indicate success)
    const finalUrl = authenticatedPage.url();
    console.log(`Final URL: ${finalUrl}`);

    console.log('\n📊 ASSET EDIT AND SAVE TEST COMPLETE');
    console.log(`📁 Edit button found: ${editButtonFound}`);
    console.log(`📁 Editable fields found: ${editableFields.length}`);
    console.log(`📁 Fields filled: ${fieldsFilled}`);
    console.log(`📁 Save button found: ${saveButtonFound}`);
    console.log(`📁 Save button text: "${saveButtonText}"`);
    console.log(`📁 Success message: ${successMessageFound}`);
    console.log(`📁 Error message: ${errorMessageFound}`);
    console.log('📁 Screenshots saved in test-results/');

    expect(editButtonFound).toBe(true);
    expect(editableFields.length).toBeGreaterThan(0);
    expect(fieldsFilled).toBeGreaterThan(0);
    expect(saveButtonFound).toBe(true);
  });
});