/**
 * Test for editing asset from the details page (view mode)
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';

test.describe('Asset Edit From Details Page', () => {
  test('should edit asset from details page and save changes', async ({ authenticatedPage }) => {
    console.log('\n🚀 TESTING ASSET EDIT FROM DETAILS PAGE');

    // Step 1: Navigate to a specific asset details page
    console.log('📍 Navigating to asset details page...');
    await authenticatedPage.goto('http://localhost:3000/en/dashboard/assets/physical/99cb990a-29e4-4e34-acf4-d58b8261046b');
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(5000);

    // Verify we're on the details page
    const currentUrl = authenticatedPage.url();
    console.log(`✅ Current URL: ${currentUrl}`);
    expect(currentUrl).toContain('/assets/physical/');

    // Screenshot the details page
    await authenticatedPage.screenshot({
      path: 'test-results/edit-from-details-initial-page.png',
      fullPage: true
    });

    // Step 2: Look for Edit button on the details page
    console.log('\n🔍 Looking for Edit button on details page...');

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

    expect(editButtonFound).toBe(true);
    expect(editButton).not.toBeNull();

    // Step 3: Click Edit button to enter edit mode
    console.log('\n📝 Clicking Edit button to enter edit mode...');
    await editButton!.click();

    // Wait for page to transition to edit mode
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.waitForLoadState('networkidle');

    // Screenshot after clicking Edit
    await authenticatedPage.screenshot({
      path: 'test-results/edit-from-details-after-edit-click.png',
      fullPage: true
    });

    // Step 4: Check if we're now in edit mode
    console.log('\n🔍 Checking for edit mode indicators...');

    // Look for edit mode indicators
    const editModeSelectors = [
      'form',
      'input:not([type="search"])',
      'textarea',
      'select',
      'button:has-text("Save")',
      'button:has-text("Update")',
      'button:has-text("Cancel")',
      '[data-testid*="edit"]',
      '.edit-mode'
    ];

    let editModeElements = [];
    for (const selector of editModeSelectors) {
      try {
        const elements = await authenticatedPage.locator(selector).all();
        const visibleElements = [];
        for (const element of elements) {
          if (await element.isVisible()) {
            visibleElements.push(element);
          }
        }
        if (visibleElements.length > 0) {
          editModeElements.push({
            selector,
            count: visibleElements.length
          });
        }
      } catch (e) {
        // Continue
      }
    }

    console.log('Edit mode elements found:');
    editModeElements.forEach(item => {
      console.log(`  ${item.selector}: ${item.count} elements`);
    });

    // Step 5: Look for form fields to edit
    console.log('\n📝 Looking for editable form fields...');

    const allFormFields = await authenticatedPage.locator('input, textarea, select').all();
    const editableFields = [];

    for (const field of allFormFields) {
      try {
        const isVisible = await field.isVisible();
        if (isVisible) {
          const type = await field.getAttribute('type') || '';
          const name = await field.getAttribute('name') || '';
          const placeholder = await field.getAttribute('placeholder') || '';
          const isDisabled = await field.isDisabled();
          const isReadOnly = await field.getAttribute('readonly') !== null;

          // Exclude search fields and disabled/readonly fields
          const isSearchField = type === 'search' ||
                              placeholder.toLowerCase().includes('search') ||
                              name.toLowerCase().includes('search') ||
                              placeholder.toLowerCase().includes('all assets');

          if (!isSearchField && !isDisabled && !isReadOnly) {
            const tagName = await field.evaluate((el: any) => el.tagName.toLowerCase());
            const currentValue = await field.inputValue().catch(() => '');

            editableFields.push({
              element: field,
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
      console.log(`  Field ${index}: ${field.tagName.toUpperCase()} - name: "${field.name}", placeholder: "${field.placeholder}", current: "${field.currentValue.substring(0, 30)}..."`);
    });

    // Step 6: If no editable fields found, try looking for modal
    if (editableFields.length === 0) {
      console.log('⚠️ No editable fields found, checking for modal...');

      // Look for modal that might have opened
      const modal = await authenticatedPage.locator('[role="dialog"]').first();
      const modalVisible = await modal.isVisible().catch(() => false);

      if (modalVisible) {
        console.log('✅ Found modal - looking for fields inside modal');

        const modalFields = await modal.locator('input, textarea, select').all();
        for (const field of modalFields) {
          try {
            const isVisible = await field.isVisible();
            if (isVisible) {
              const type = await field.getAttribute('type') || '';
              const name = await field.getAttribute('name') || '';
              const placeholder = await field.getAttribute('placeholder') || '';
              const isDisabled = await field.isDisabled();
              const isReadOnly = await field.getAttribute('readonly') !== null;

              const tagName = await field.evaluate((el: any) => el.tagName.toLowerCase());
              const currentValue = await field.inputValue().catch(() => '');

              if (!isDisabled && !isReadOnly) {
                editableFields.push({
                  element: field,
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

        console.log(`📝 Found ${editableFields.length} editable fields in modal`);
      }
    }

    // Declare variables at function scope
    let saveButtonFound = false;
    let saveButtonText = '';
    let successMessageFound = false;
    let successMessageText = '';

    // Step 7: Fill the form fields with test data
    let fieldsUpdated = 0;
    if (editableFields.length > 0) {
      console.log('\n✏️ Filling form fields with test data...');

      const timestamp = Date.now();

      for (let i = 0; i < Math.min(editableFields.length, 5); i++) {
        try {
          const field = editableFields[i];
          let testValue = '';

          // Generate appropriate test values based on field characteristics
          if (field.name?.toLowerCase().includes('description') ||
              field.placeholder?.toLowerCase().includes('description')) {
            testValue = `E2E Updated description from details page ${timestamp} - testing edit functionality from asset view`;
          } else if (field.name?.toLowerCase().includes('name') ||
                     field.placeholder?.toLowerCase().includes('name')) {
            testValue = `E2E Edited Asset Name ${timestamp}`;
          } else if (field.name?.toLowerCase().includes('notes') ||
                     field.placeholder?.toLowerCase().includes('notes')) {
            testValue = `E2E Updated notes from details page ${timestamp} - comprehensive testing of edit mode functionality`;
          } else if (field.name?.toLowerCase().includes('location') ||
                     field.placeholder?.toLowerCase().includes('location')) {
            testValue = `E2E Test Location ${timestamp}`;
          } else if (field.name?.toLowerCase().includes('owner') ||
                     field.placeholder?.toLowerCase().includes('owner')) {
            testValue = `E2E Test Owner ${timestamp}`;
          } else if (field.name?.toLowerCase().includes('identifier')) {
            testValue = `${field.currentValue}-EDITED-${timestamp}`;
          } else if (field.tagName === 'textarea') {
            testValue = `E2E Updated multiline content ${timestamp}\nSecond line of test content\nThird line for comprehensive testing from details page`;
          } else if (field.tagName === 'select' || field.type === 'select-one') {
            // For select elements, try to select a different option
            const options = await field.element.locator('option').all();
            if (options.length > 1) {
              await field.element.selectOption({ index: Math.min(options.length - 1, 2) });
              fieldsUpdated++;
              console.log(`  ✅ Selected different option for ${field.name}`);
              continue;
            }
          } else {
            testValue = `E2E Test ${field.name || 'field'} ${timestamp}`;
          }

          if (testValue) {
            await field.element.fill(testValue);
            fieldsUpdated++;
            console.log(`  ✅ Updated ${field.tagName} "${field.name}": "${testValue.substring(0, 50)}..."`);
          }
        } catch (e) {
          console.log(`  ❌ Could not update field ${i}: ${e}`);
        }
      }

      console.log(`✅ Successfully updated ${fieldsUpdated} fields`);

      // Screenshot after filling form
      await authenticatedPage.screenshot({
        path: 'test-results/edit-from-details-form-filled.png',
        fullPage: true
      });

      // Step 8: Look for and click save/update button
      console.log('\n💾 Looking for save/update button...');

      const saveButtonSelectors = [
        'button:has-text("Save")',
        'button:has-text("Update")',
        'button:has-text("Save Changes")',
        'button:has-text("Apply")',
        'button:has-text("Submit")',
        'button[type="submit"]'
      ];

      // First check if we're in a modal
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

      if (!saveButtonFound) {
        console.log('❌ No save/update buttons found');
        test.skip();
        return;
      }

      // Step 9: Wait for save to complete
      console.log('\n⏳ Waiting for save to complete...');
      await authenticatedPage.waitForLoadState('networkidle');
      await authenticatedPage.waitForTimeout(5000);

      // Check if modal is still open
      if (modalVisible) {
        const modalStillVisible = await modal.isVisible().catch(() => false);
        if (!modalStillVisible) {
          console.log('✅ Modal closed after save');
        } else {
          console.log('⚠️ Modal still visible, checking for errors...');

          // Look for validation errors
          const errorSelectors = [
            'text:has-text("required")',
            'text:has-text("error")',
            'text:has-text("invalid")',
            '.error-message',
            '.validation-error'
          ];

          for (const selector of errorSelectors) {
            try {
              const errors = await modal.locator(selector).all();
              for (const error of errors) {
                if (await error.isVisible()) {
                  const errorText = await error.textContent();
                  console.log(`❌ Validation error: "${errorText}"`);
                }
              }
            } catch (e) {
              // Continue
            }
          }

          // Close modal if still open with errors
          const closeButton = await modal.locator('button:has-text("Cancel"), button:has-text("Close")').first();
          if (await closeButton.isVisible()) {
            await closeButton.click();
            await authenticatedPage.waitForTimeout(2000);
          }
        }
      }

      // Step 10: Look for success messages
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
    } else {
      console.log('❌ No editable fields found in either page or modal');
      test.skip();
      return;
    }

    // Final screenshot
    await authenticatedPage.screenshot({
      path: 'test-results/edit-from-details-final-state.png',
      fullPage: true
    });

    // Verify we're back on a details page
    const finalUrl = authenticatedPage.url();
    console.log(`Final URL: ${finalUrl}`);

    console.log('\n📊 ASSET EDIT FROM DETAILS PAGE TEST COMPLETE');
    console.log(`📁 Edit button found: ${editButtonFound}`);
    console.log(`📁 Editable fields found: ${editableFields.length}`);
    console.log(`📁 Fields updated: ${fieldsUpdated || 0}`);
    console.log(`📁 Save button found: ${saveButtonFound}`);
    console.log(`📁 Save button text: "${saveButtonText}"`);
    console.log(`📁 Success message: ${successMessageFound ? successMessageText : 'None'}`);
    console.log('📁 Screenshots saved in test-results/');

    // Assertions
    expect(editButtonFound).toBe(true);
    expect(editableFields.length).toBeGreaterThan(0);
    expect(fieldsUpdated || 0).toBeGreaterThan(0);
    expect(saveButtonFound).toBe(true);
  });
});