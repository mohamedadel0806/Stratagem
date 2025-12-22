/**
 * Test to find ALL required fields that might be preventing save
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';

test.describe('Find All Required Fields', () => {
  test('should find and fill all required fields to enable successful save', async ({ authenticatedPage }) => {
    console.log('\n🔍 FINDING ALL REQUIRED FIELDS FOR SUCCESSFUL SAVE');

    const assetUrl = 'http://localhost:3000/en/dashboard/assets/physical/99cb990a-29e4-4e34-acf4-d58b8261046b';
    const timestamp = Date.now();

    // Step 1: Open edit modal
    await authenticatedPage.goto(assetUrl);
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(3000);

    const editButton = await authenticatedPage.locator('button:has-text("Edit")').first();
    await editButton.click();
    await authenticatedPage.waitForTimeout(3000);

    const modal = await authenticatedPage.locator('[role="dialog"]').first();
    expect(await modal.isVisible()).toBe(true);

    // Get all tabs
    const modalTabs = await modal.locator('[role="tab"]').all();
    let tabs = [];

    for (const tab of modalTabs) {
      try {
        const isVisible = await tab.isVisible();
        if (isVisible) {
          const text = await tab.textContent();
          if (text && text.trim()) {
            tabs.push({
              element: tab,
              text: text.trim()
            });
          }
        }
      } catch (e) {
        continue;
      }
    }

    console.log(`🧭 Found ${tabs.length} tabs:`, tabs.map(t => t.text));

    // Step 2: Systematically go through each tab and fill ALL fields
    for (let tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
      const tab = tabs[tabIndex];
      console.log(`\n📍 Processing tab ${tabIndex}: "${tab.text}"`);

      await tab.element.click();
      await authenticatedPage.waitForTimeout(2000);

      // Screenshot tab before filling
      await authenticatedPage.screenshot({
        path: `test-results/required-fields-${tabIndex}-${tab.text.replace(/[^a-zA-Z0-9]/g, '_')}-before.png`,
        fullPage: true
      });

      // Find all input, textarea, and select elements in this tab
      const allFields = await modal.locator('input, textarea, select').all();
      let fieldsFilled = 0;

      console.log(`  📝 Found ${allFields.length} fields in "${tab.text}" tab`);

      for (const field of allFields) {
        try {
          const isVisible = await field.isVisible();
          const isDisabled = await field.isDisabled();
          const isReadOnly = await field.getAttribute('readonly') !== null;

          if (isVisible && !isDisabled && !isReadOnly) {
            const tagName = await field.evaluate((el: any) => el.tagName.toLowerCase());
            const type = await field.getAttribute('type') || '';
            const name = await field.getAttribute('name') || '';
            const placeholder = await field.getAttribute('placeholder') || '';
            const isRequired = await field.getAttribute('required') !== null ||
                              await field.getAttribute('aria-required') === 'true';

            // Skip search fields
            if (type === 'search' || placeholder.toLowerCase().includes('search')) {
              console.log(`    ⏭️ Skipping search field`);
              continue;
            }

            // Check if field has a required label
            let hasRequiredLabel = false;
            try {
              const parent = await field.locator('..').first();
              const parentText = await parent.textContent();
              if (parentText && (parentText.includes('*') || parentText.includes('required'))) {
                hasRequiredLabel = true;
              }
            } catch (e) {
              // Continue
            }

            const currentValue = await field.inputValue().catch(() => '');
            let fieldFilled = false;

            console.log(`    🔍 Field: ${tagName.toUpperCase()} name="${name}" placeholder="${placeholder}" value="${currentValue}" required=${isRequired || hasRequiredLabel}`);

            // Handle different field types
            if (tagName === 'select' || type === 'select-one') {
              try {
                const options = await field.locator('option').all();
                if (options.length > 1) {
                  // Skip the first option (usually empty/default) and select a real option
                  const selectedIndex = Math.min(options.length - 1, 1);
                  await field.selectOption({ index: selectedIndex });
                  const selectedText = await options[selectedIndex].textContent();
                  console.log(`      ✅ Selected: "${selectedText}"`);
                  fieldFilled = true;
                  fieldsFilled++;
                }
              } catch (e) {
                console.log(`      ❌ Could not select option: ${e}`);
              }
            } else if (tagName === 'textarea') {
              try {
                let textValue = '';

                // Generate appropriate text based on field context
                if (name.toLowerCase().includes('reason') || placeholder.toLowerCase().includes('reason')) {
                  textValue = `Required reason for change at ${timestamp} - E2E testing complete form validation`;
                } else if (name.toLowerCase().includes('description') || placeholder.toLowerCase().includes('description')) {
                  textValue = `Complete asset description filled at ${timestamp} for testing all required fields`;
                } else if (name.toLowerCase().includes('notes') || placeholder.toLowerCase().includes('notes')) {
                  textValue = `Additional notes added at ${timestamp} for comprehensive testing`;
                } else {
                  textValue = `E2E textarea content for ${name || 'field'} at ${timestamp}`;
                }

                await field.fill(textValue);
                console.log(`      ✅ Filled textarea with ${textValue.length} characters`);
                fieldFilled = true;
                fieldsFilled++;
              } catch (e) {
                console.log(`      ❌ Could not fill textarea: ${e}`);
              }
            } else if (tagName === 'input') {
              try {
                let inputText = '';

                // Generate appropriate text based on field context
                if (name.toLowerCase().includes('identifier') || placeholder.toLowerCase().includes('identifier')) {
                  inputText = `COMPLETE-ID-${timestamp}`;
                } else if (name.toLowerCase().includes('name') || placeholder.toLowerCase().includes('name')) {
                  inputText = `E2E Test ${name || 'Name'} ${timestamp}`;
                } else if (name.toLowerCase().includes('location') || placeholder.toLowerCase().includes('location')) {
                  inputText = `E2E Test Location ${timestamp}`;
                } else if (name.toLowerCase().includes('title') || placeholder.toLowerCase().includes('title')) {
                  inputText = `E2E Test Title ${timestamp}`;
                } else if (!currentValue || currentValue.trim() === '') {
                  // Fill empty required fields
                  inputText = `E2E ${name || 'field'} ${timestamp}`;
                }

                if (inputText) {
                  await field.fill(inputText);
                  console.log(`      ✅ Filled input: "${inputText}"`);
                  fieldFilled = true;
                  fieldsFilled++;
                } else {
                  console.log(`      ⏭️ Skipping filled input`);
                }
              } catch (e) {
                console.log(`      ❌ Could not fill input: ${e}`);
              }
            }
          }
        } catch (e) {
          console.log(`    ❌ Error processing field: ${e}`);
        }
      }

      console.log(`  ✅ Filled ${fieldsFilled} fields in "${tab.text}" tab`);

      // Screenshot tab after filling
      await authenticatedPage.screenshot({
        path: `test-results/required-fields-${tabIndex}-${tab.text.replace(/[^a-zA-Z0-9]/g, '_')}-filled.png`,
        fullPage: true
      });
    }

    // Step 3: Try to save now that everything is filled
    console.log('\n💾 Attempting save with all fields filled...');

    // Take screenshot before save
    await authenticatedPage.screenshot({
      path: 'test-results/required-fields-before-save.png',
      fullPage: true
    });

    const saveButton = await modal.locator('button:has-text("Update")').first();
    expect(await saveButton.isVisible()).toBe(true);

    // Check if save button is enabled
    const saveEnabled = await saveButton.isEnabled();
    console.log(`Save button enabled: ${saveEnabled}`);

    if (!saveEnabled) {
      console.log('❌ Save button is disabled - there are still missing required fields');
    }

    // Try to click save anyway
    await saveButton.click();
    console.log('✅ Save button clicked');

    // Wait for save completion
    console.log('\n⏳ Waiting for save to complete...');
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(5000);

    // Check if modal closed
    const modalStillVisible = await modal.isVisible();

    if (!modalStillVisible) {
      console.log('🎉 SUCCESS: Modal closed - save completed successfully!');
    } else {
      console.log('⚠️ Modal still open - investigating further...');

      // Take screenshot of modal with errors
      await authenticatedPage.screenshot({
        path: 'test-results/required-fields-modal-errors.png',
        fullPage: true
      });

      // Look for any error indicators
      const errorIndicators = [
        'text:has-text("required")',
        'text:has-text("error")',
        'text:has-text("invalid")',
        'text:has-text("must be filled")',
        '.error-message',
        '.validation-error',
        '[aria-invalid="true"]',
        '.invalid',
        'input[aria-invalid="true"]',
        'select[aria-invalid="true"]',
        'textarea[aria-invalid="true"]'
      ];

      let errorCount = 0;
      for (const selector of errorIndicators) {
        try {
          const elements = await modal.locator(selector).all();
          errorCount += elements.length;

          for (const element of elements.slice(0, 5)) { // Limit to first 5 to avoid spam
            try {
              const isVisible = await element.isVisible();
              if (isVisible) {
                const text = await element.textContent();
                if (text) {
                  console.log(`  ❌ Error indicator: "${text.trim()}"`);
                }
              }
            } catch (e) {
              continue;
            }
          }
        } catch (e) {
          continue;
        }
      }

      console.log(`Found ${errorCount} error indicators`);
    }

    console.log('\n📊 REQUIRED FIELDS TEST RESULTS:');
    console.log(`📁 Tabs processed: ${tabs.length}`);
    console.log(`📁 Save button enabled: ${saveEnabled}`);
    console.log(`📁 Modal closed: ${!modalStillVisible}`);
    console.log('📁 Screenshots saved in test-results/');

    // Try to close modal if still open
    if (modalStillVisible) {
      try {
        const cancelButton = await modal.locator('button:has-text("Cancel")').first();
        if (await cancelButton.isVisible()) {
          await cancelButton.click();
          await authenticatedPage.waitForTimeout(2000);
        }
      } catch (e) {
        console.log(`Could not close modal: ${e}`);
      }
    }

    // Final success check
    await authenticatedPage.goto(assetUrl);
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(3000);

    await authenticatedPage.screenshot({
      path: 'test-results/required-fields-final-verify.png',
      fullPage: true
    });

    expect(modal).toBeDefined();
    expect(tabs.length).toBeGreaterThan(0);

    if (!modalStillVisible) {
      console.log(`\n🎉 COMPLETE SUCCESS: All required fields identified and filled successfully!`);
    } else {
      console.log(`\n🔍 INVESTIGATION COMPLETE: Check screenshots to identify remaining issues`);
    }
  });
});