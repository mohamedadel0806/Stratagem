/**
 * Test to investigate validation errors preventing owner assignment
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';

test.describe('Investigate Validation Errors', () => {
  test('should identify what validation errors prevent owner assignment', async ({ authenticatedPage }) => {
    console.log('\n🔍 INVESTIGATING VALIDATION ERRORS FOR OWNER ASSIGNMENT');

    // Step 1: Navigate to asset and open edit modal
    await authenticatedPage.goto('http://localhost:3000/en/dashboard/assets/physical/99cb990a-29e4-4e34-acf4-d58b8261046b');
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(3000);

    const editButton = await authenticatedPage.locator('button:has-text("Edit")').first();
    await editButton.click();
    await authenticatedPage.waitForTimeout(3000);

    const modal = await authenticatedPage.locator('[role="dialog"]').first();
    expect(await modal.isVisible()).toBe(true);

    console.log('✅ Modal opened');

    // Step 2: Go to Ownership tab and select owner
    const ownershipTab = await modal.locator('button:has-text("Ownership")').first();
    await ownershipTab.click();
    await authenticatedPage.waitForTimeout(2000);

    // Take screenshot of empty Ownership tab
    await authenticatedPage.screenshot({
      path: 'test-results/validation-empty-ownership.png',
      fullPage: true
    });

    // Select an owner
    const ownerSelect = await modal.locator('label:has-text("Owner") ~ select').first();
    await ownerSelect.selectOption({ index: 1 }); // Select "Ahmed Risk"
    console.log('✅ Owner selected: Ahmed Risk');

    // Take screenshot after owner selection
    await authenticatedPage.screenshot({
      path: 'test-results/validation-owner-selected.png',
      fullPage: true
    });

    // Step 3: Try to save immediately to see what errors appear
    console.log('\n💾 Attempting to save with only owner selected...');
    const saveButton = await modal.locator('button:has-text("Update")').first();
    await saveButton.click();
    await authenticatedPage.waitForTimeout(2000);

    // Check if modal is still open
    const modalStillOpen = await modal.isVisible();
    console.log(`Modal still open after save attempt: ${modalStillOpen}`);

    if (modalStillOpen) {
      console.log('\n🔍 Looking for validation errors in modal...');

      // Screenshot modal with errors
      await authenticatedPage.screenshot({
        path: 'test-results/validation-errors-modal.png',
        fullPage: true
      });

      // Look for various error indicators
      const errorSelectors = [
        'text:has-text("required")',
        'text:has-text("field is required")',
        'text:has-text("must be filled")',
        'text:has-text("error")',
        'text:has-text("invalid")',
        '.error',
        '.error-message',
        '.validation-error',
        '.field-error',
        '[data-testid*="error"]',
        '.invalid-feedback',
        '.form-error'
      ];

      let foundErrors = [];
      for (const selector of errorSelectors) {
        try {
          const elements = await modal.locator(selector).all();
          for (const element of elements) {
            const isVisible = await element.isVisible();
            if (isVisible) {
              const text = await element.textContent();
              if (text && text.trim()) {
                foundErrors.push({
                  selector,
                  text: text.trim()
                });
              }
            }
          }
        } catch (e) {
          // Continue
        }
      }

      console.log(`Found ${foundErrors.length} error elements:`);
      foundErrors.forEach((error, index) => {
        console.log(`  Error ${index}: "${error.text}" (${error.selector})`);
      });

      // Look for fields with error states (red borders, etc.)
      console.log('\n🔍 Looking for fields with validation states...');

      const fieldErrorSelectors = [
        'input[aria-invalid="true"]',
        'select[aria-invalid="true"]',
        'textarea[aria-invalid="true"]',
        '.error input',
        '.error select',
        '.error textarea',
        '.invalid input',
        '.invalid select',
        '.invalid textarea'
      ];

      let fieldsWithErrors = [];
      for (const selector of fieldErrorSelectors) {
        try {
          const elements = await modal.locator(selector).all();
          for (const element of elements) {
            const isVisible = await element.isVisible();
            if (isVisible) {
              const name = await element.getAttribute('name') || '';
              const placeholder = await element.getAttribute('placeholder') || '';
              fieldsWithErrors.push({
                selector,
                name,
                placeholder
              });
            }
          }
        } catch (e) {
          // Continue
        }
      }

      console.log(`Found ${fieldsWithErrors.length} fields with error states:`);
      fieldsWithErrors.forEach((field, index) => {
        console.log(`  Error field ${index}: name="${field.name}", placeholder="${field.placeholder}" (${field.selector})`);
      });

      // Look for required field indicators
      console.log('\n🔍 Looking for required field indicators...');

      const requiredSelectors = [
        'label:has-text("*")',
        'label[required]',
        '[required]',
        '.required',
        'text:has-text("*")',
        '[aria-required="true"]'
      ];

      let requiredFields = [];
      for (const selector of requiredSelectors) {
        try {
          const elements = await modal.locator(selector).all();
          for (const element of elements) {
            const isVisible = await element.isVisible();
            if (isVisible) {
              const text = await element.textContent();
              requiredFields.push({
                selector,
                text: text?.trim() || ''
              });
            }
          }
        } catch (e) {
          // Continue
        }
      }

      console.log(`Found ${requiredFields.length} required field indicators:`);
      requiredFields.forEach((field, index) => {
        console.log(`  Required ${index}: "${field.text}" (${field.selector})`);
      });

      // Step 4: Try going through all tabs and identifying empty required fields
      console.log('\n🔍 Checking all tabs for empty required fields...');

      const tabs = await modal.locator('[role="tab"]').all();
      for (let tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
        try {
          const tab = tabs[tabIndex];
          const tabText = await tab.textContent();

          if (tabText && tabText.trim()) {
            console.log(`\nChecking tab: "${tabText.trim()}"`);
            await tab.click();
            await authenticatedPage.waitForTimeout(1000);

            // Check for empty required fields in this tab
            const inputs = await modal.locator('input, textarea, select').all();
            for (const input of inputs) {
              try {
                const isVisible = await input.isVisible();
                if (isVisible) {
                  const name = await input.getAttribute('name') || '';
                  const placeholder = await input.getAttribute('placeholder') || '';
                  const isRequired = await input.getAttribute('required') !== null ||
                                   await input.getAttribute('aria-required') === 'true';
                  const currentValue = await input.inputValue().catch(() => '');

                  if (isRequired && (!currentValue || currentValue.trim() === '')) {
                    console.log(`  ⚠️ Empty required field: ${name || placeholder}`);
                  }
                }
              } catch (e) {
                // Continue
              }
            }
          }
        } catch (e) {
          console.log(`Error checking tab ${tabIndex}: ${e}`);
        }
      }
    }

    // Step 5: Try a complete fill based on findings
    console.log('\n🔧 Attempting complete form fill based on investigation...');

    // Go to Basic Info and fill everything
    const basicInfoTab = await modal.locator('button:has-text("Basic Info")').first();
    await basicInfoTab.click();
    await authenticatedPage.waitForTimeout(1000);

    // Fill all inputs in Basic Info
    const basicInputs = await modal.locator('input, textarea, select').all();
    for (const input of basicInputs) {
      try {
        const isVisible = await input.isVisible();
        const isDisabled = await input.isDisabled();
        const isReadOnly = await input.getAttribute('readonly') !== null;

        if (isVisible && !isDisabled && !isReadOnly) {
          const name = await input.getAttribute('name') || '';
          const type = await input.getAttribute('type') || '';
          const currentValue = await input.inputValue().catch(() => '');

          if (type !== 'search') {
            if (name.toLowerCase().includes('identifier')) {
              await input.fill(`COMPLETE-TEST-ID-${Date.now()}`);
            } else if (name.toLowerCase().includes('description')) {
              await input.fill(`Complete test description for validation investigation ${Date.now()}`);
            } else if (!currentValue || currentValue.trim() === '') {
              await input.fill(`Complete test field ${name} ${Date.now()}`);
            } else if (await input.evaluate((el: any) => el.tagName.toLowerCase()) === 'select') {
              const options = await input.locator('option').all();
              if (options.length > 1) {
                await input.selectOption({ index: 1 });
              }
            }
          }
        }
      } catch (e) {
        // Continue
      }
    }

    // Take screenshot after filling Basic Info
    await authenticatedPage.screenshot({
      path: 'test-results/validation-basic-info-filled.png',
      fullPage: true
    });

    // Now try to save again
    console.log('\n💾 Attempting save after filling Basic Info...');
    await saveButton.click();
    await authenticatedPage.waitForTimeout(3000);

    const finalModalState = await modal.isVisible();
    console.log(`Modal state after complete fill: ${finalModalState ? 'Still open' : 'Closed'}`);

    // Final screenshot
    await authenticatedPage.screenshot({
      path: 'test-results/validation-final-state.png',
      fullPage: true
    });

    console.log('\n📊 VALIDATION INVESTIGATION COMPLETE');
    console.log('📁 Check test-results/ folder for detailed screenshots');
    console.log('📁 Screenshots show:');
    console.log('  - validation-empty-ownership.png: Initial empty Ownership tab');
    console.log('  - validation-owner-selected.png: After selecting owner');
    console.log('  - validation-errors-modal.png: Modal with validation errors');
    console.log('  - validation-basic-info-filled.png: After filling Basic Info');
    console.log('  - validation-final-state.png: Final modal state');

    expect(modal).toBeDefined();
  });
});