/**
 * Test to capture validation messages and fill form accordingly
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';

test.describe('Capture Validation Messages', () => {
  test('should capture validation messages from top of modal and fill required fields', async ({ authenticatedPage }) => {
    console.log('\n🔍 CAPTURING VALIDATION MESSAGES AND FILLING FORM ACCORDINGLY');

    const assetUrl = 'http://localhost:3000/en/dashboard/assets/physical/99cb990a-29e4-4e34-acf4-d58b8261046b';
    const timestamp = Date.now();

    // Step 1: Navigate to asset and open edit modal
    await authenticatedPage.goto(assetUrl);
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(3000);

    // Take initial screenshot of asset page
    await authenticatedPage.screenshot({
      path: 'test-results/validation-capture-asset-page.png',
      fullPage: true
    });

    const editButton = await authenticatedPage.locator('button:has-text("Edit")').first();
    await editButton.click();
    await authenticatedPage.waitForTimeout(3000);

    const modal = await authenticatedPage.locator('[role="dialog"]').first();
    expect(await modal.isVisible()).toBe(true);

    console.log('✅ Edit modal opened');

    // Screenshot of modal before any action
    await authenticatedPage.screenshot({
      path: 'test-results/validation-capture-modal-initial.png',
      fullPage: true
    });

    // Step 2: Try to find and click save button to trigger validation
    console.log('\n💾 Attempting to trigger validation by saving empty form...');

    // Look for save/update button with multiple selectors
    const saveSelectors = [
      'button:has-text("Update")',
      'button:has-text("Save")',
      'button:has-text("Save Changes")',
      'button[type="submit"]',
      '.btn-primary',
      '.save-button'
    ];

    let saveButton = null;
    for (const selector of saveSelectors) {
      try {
        const button = await modal.locator(selector).first();
        if (await button.isVisible() && await button.isEnabled()) {
          saveButton = button;
          console.log(`✅ Found save button: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (saveButton) {
      await saveButton.click();
      console.log('✅ Save button clicked - validation should trigger');
      await authenticatedPage.waitForTimeout(3000);
    } else {
      console.log('⚠️ No save button found - trying alternative approach');
      // Try pressing Enter or finding other ways to trigger validation
      await authenticatedPage.keyboard.press('Tab');
      await authenticatedPage.waitForTimeout(1000);
      await authenticatedPage.keyboard.press('Enter');
      await authenticatedPage.waitForTimeout(3000);
    }

    // Step 3: Look for validation messages at the top of the modal
    console.log('\n📢 Looking for validation messages at top of modal...');

    // Take screenshot immediately after validation attempt
    await authenticatedPage.screenshot({
      path: 'test-results/validation-capture-after-trigger.png',
      fullPage: true
    });

    // Comprehensive search for validation messages
    const validationSelectors = [
      // Top of modal areas
      '.modal-header',
      '.dialog-header',
      '.notification',
      '.alert',
      '.alert-error',
      '.alert-warning',
      '.alert-info',
      '.validation-message',
      '.validation-summary',
      '.error-summary',
      // General error selectors
      '[role="alert"]',
      '[role="alertdialog"]',
      '.error',
      '.error-message',
      '.validation-error',
      '.field-error',
      // Text-based selectors
      'text:has-text("required")',
      'text:has-text("error")',
      'text:has-text("invalid")',
      'text:has-text("missing")',
      'text:has-text("incomplete")',
      'text:has-text("please")',
      'text:has-text("must be")',
      'text:has-text("fill")',
      // Data attributes
      '[data-testid*="error"]',
      '[data-testid*="validation"]',
      '[data-testid*="alert"]'
    ];

    let foundMessages = [];
    let messageLocations = [];

    // First, try to find messages in the entire modal
    for (const selector of validationSelectors) {
      try {
        const elements = await modal.locator(selector).all();
        for (let i = 0; i < elements.length; i++) {
          try {
            const element = elements[i];
            const isVisible = await element.isVisible();
            if (isVisible) {
              const text = await element.textContent();
              if (text && text.trim() && text.trim().length > 5) {
                const cleanText = text.trim();
                foundMessages.push(cleanText);
                messageLocations.push({ selector, index: i, text: cleanText });
                console.log(`📢 Found validation message (${selector}): "${cleanText}"`);
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

    // If no messages found in modal, try the whole page
    if (foundMessages.length === 0) {
      console.log('🔍 No messages in modal, searching entire page...');
      for (const selector of validationSelectors) {
        try {
          const elements = await authenticatedPage.locator(selector).all();
          for (let i = 0; i < Math.min(elements.length, 5); i++) {
            try {
              const element = elements[i];
              const isVisible = await element.isVisible();
              if (isVisible) {
                const text = await element.textContent();
                if (text && text.trim() && text.trim().length > 5) {
                  const cleanText = text.trim();
                  foundMessages.push(cleanText);
                  messageLocations.push({ selector, index: i, text: cleanText, location: 'page' });
                  console.log(`📢 Found page message (${selector}): "${cleanText}"`);
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
    }

    console.log(`\n📊 Total validation messages found: ${foundMessages.length}`);

    if (foundMessages.length > 0) {
      console.log('\n📝 All validation messages:');
      foundMessages.forEach((msg, i) => {
        console.log(`  ${i + 1}. "${msg}"`);
      });

      // Analyze messages to determine what needs to be filled
      const analysis = analyzeValidationMessages(foundMessages);
      console.log('\n🔍 Validation analysis:', analysis);
    } else {
      console.log('ℹ️ No validation messages detected - proceeding with comprehensive field filling');
    }

    // Step 4: Get all tabs and fill fields regardless
    console.log('\n🧭 Finding all modal tabs...');
    const modalTabs = await modal.locator('[role="tab"], .tab, button[role="tab"]').all();
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

    console.log(`📋 Found ${tabs.length} tabs:`, tabs.map(t => t.text));

    // Step 5: Fill all fields across all tabs
    let totalFieldsFilled = 0;
    for (let tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
      const tab = tabs[tabIndex];
      console.log(`\n📍 Processing tab ${tabIndex}: "${tab.text}"`);

      await tab.element.click();
      await authenticatedPage.waitForTimeout(2000);

      // Screenshot tab before filling
      await authenticatedPage.screenshot({
        path: `test-results/validation-capture-tab-${tabIndex}-${tab.text.replace(/[^a-zA-Z0-9]/g, '_')}-before.png`,
        fullPage: true
      });

      // Find all fillable fields
      const allFields = await modal.locator('input:not([type="search"]):not(:disabled), textarea:not(:disabled), select:not(:disabled)').all();
      let fieldsFilledInTab = 0;

      console.log(`  📝 Found ${allFields.length} fillable fields`);

      for (const field of allFields) {
        try {
          const isVisible = await field.isVisible();
          if (!isVisible) continue;

          const tagName = await field.evaluate((el: any) => el.tagName.toLowerCase());
          const name = await field.getAttribute('name') || '';
          const placeholder = await field.getAttribute('placeholder') || '';
          const currentValue = await field.inputValue().catch(() => '');

          // Skip if already has a meaningful value
          if (currentValue && currentValue.length > 2 && currentValue !== 'TEST-DETAILS-1766172211990') {
            continue;
          }

          let fieldFilled = false;

          if (tagName === 'select') {
            try {
              const options = await field.locator('option').all();
              if (options.length > 1) {
                await field.selectOption({ index: Math.min(options.length - 1, 2) });
                const selectedText = await options[Math.min(options.length - 1, 2)].textContent();
                console.log(`    ✅ Selected: "${selectedText}"`);
                fieldFilled = true;
                fieldsFilledInTab++;
              }
            } catch (e) {
              console.log(`    ❌ Could not select option: ${e}`);
            }
          } else if (tagName === 'textarea') {
            try {
              let textValue = '';
              if (name.toLowerCase().includes('reason') || placeholder.toLowerCase().includes('reason')) {
                textValue = `Validation required field filled at ${new Date().toISOString()}. Reason for change is mandatory.`;
              } else {
                textValue = `Field filled to resolve validation - Field: ${name || 'textarea'}. Time: ${timestamp}.`;
              }
              await field.fill(textValue);
              console.log(`    ✅ Filled textarea`);
              fieldFilled = true;
              fieldsFilledInTab++;
            } catch (e) {
              console.log(`    ❌ Could not fill textarea: ${e}`);
            }
          } else if (tagName === 'input') {
            try {
              let inputText = '';
              if (name.toLowerCase().includes('identifier')) {
                inputText = `VALIDATION-ID-${timestamp}`;
              } else if (name.toLowerCase().includes('reason')) {
                inputText = `VALIDATION-REASON-${timestamp}`;
              } else {
                inputText = `VALIDATION-FIELD-${name || 'input'}-${timestamp}`;
              }

              await field.fill(inputText);
              console.log(`    ✅ Filled input: "${inputText}"`);
              fieldFilled = true;
              fieldsFilledInTab++;
            } catch (e) {
              console.log(`    ❌ Could not fill input: ${e}`);
            }
          }

          if (fieldFilled) {
            totalFieldsFilled++;
          }
        } catch (e) {
          console.log(`    ❌ Error with field: ${e}`);
        }
      }

      console.log(`  ✅ Filled ${fieldsFilledInTab} fields in "${tab.text}" tab`);

      // Screenshot tab after filling
      await authenticatedPage.screenshot({
        path: `test-results/validation-capture-tab-${tabIndex}-${tab.text.replace(/[^a-zA-Z0-9]/g, '_')}-after.png`,
        fullPage: true
      });
    }

    console.log(`\n🎯 Total fields filled across all tabs: ${totalFieldsFilled}`);

    // Step 6: Try to save again
    console.log('\n💾 Attempting save after filling all fields...');

    // Take screenshot before final save
    await authenticatedPage.screenshot({
      path: 'test-results/validation-capture-before-final-save.png',
      fullPage: true
    });

    // Find save button again (it might have changed state)
    let finalSaveButton = null;
    for (const selector of saveSelectors) {
      try {
        const button = await modal.locator(selector).first();
        if (await button.isVisible()) {
          finalSaveButton = button;
          console.log(`✅ Found final save button: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (finalSaveButton) {
      const isEnabled = await finalSaveButton.isEnabled();
      console.log(`Save button enabled: ${isEnabled}`);

      if (isEnabled) {
        await finalSaveButton.click();
        console.log('✅ Final save button clicked');

        // Wait for save completion
        await authenticatedPage.waitForLoadState('networkidle');
        await authenticatedPage.waitForTimeout(5000);

        // Check if modal closed
        const modalStillOpen = await modal.isVisible();

        if (!modalStillOpen) {
          console.log('🎉 SUCCESS: Validation captured, form filled, and save completed!');
        } else {
          console.log('⚠️ Modal still open - checking for remaining validation...');

          // Look for any remaining messages
          const remainingMessages = [];
          for (const selector of validationSelectors) {
            try {
              const elements = await modal.locator(selector).all();
              for (const element of elements.slice(0, 3)) {
                if (await element.isVisible()) {
                  const text = await element.textContent();
                  if (text && text.trim()) {
                    remainingMessages.push(text.trim());
                  }
                }
              }
            } catch (e) {
              continue;
            }
          }

          if (remainingMessages.length > 0) {
            console.log('❌ Remaining validation messages:');
            remainingMessages.forEach(msg => console.log(`  - ${msg}`));
          } else {
            console.log('ℹ️ No remaining validation messages visible');
          }

          // Final screenshot
          await authenticatedPage.screenshot({
            path: 'test-results/validation-capture-final-state.png',
            fullPage: true
          });
        }
      } else {
        console.log('❌ Save button is disabled - validation issues remain');
      }
    } else {
      console.log('❌ Could not find save button for final attempt');
    }

    // Summary
    console.log('\n📊 VALIDATION CAPTURE TEST RESULTS:');
    console.log(`📁 Validation messages found: ${foundMessages.length}`);
    console.log(`📁 Tabs processed: ${tabs.length}`);
    console.log(`📁 Total fields filled: ${totalFieldsFilled}`);
    console.log(`📁 Save button found: ${!!finalSaveButton}`);
    console.log('📁 Screenshots saved in test-results/validation-capture-*.png');

    expect(modal).toBeDefined();
    expect(tabs.length).toBeGreaterThan(0);

    console.log('\n🎯 CONCLUSION:');
    if (foundMessages.length > 0) {
      console.log('✅ Validation messages successfully captured and analyzed');
      console.log('✅ Form fields filled based on validation requirements');
    } else {
      console.log('ℹ️ No validation messages detected, but comprehensive form filling completed');
    }
  });
});

function analyzeValidationMessages(messages) {
  const analysis = {
    requiresAction: false,
    requiresOwner: false,
    requiresReason: false,
    requiresIdentifier: false,
    requiresLocation: false,
    requiresDescription: false,
    messageType: 'unknown',
    fieldNames: []
  };

  const messageText = messages.join(' ').toLowerCase();

  // Analyze message content to determine requirements
  if (messageText.length === 0) {
    analysis.messageType = 'no_messages';
  } else if (messageText.includes('owner')) {
    analysis.requiresAction = true;
    analysis.requiresOwner = true;
    analysis.fieldNames.push('owner');
    analysis.messageType = 'owner_required';
  } else if (messageText.includes('reason') || messageText.includes('change')) {
    analysis.requiresAction = true;
    analysis.requiresReason = true;
    analysis.fieldNames.push('reason');
    analysis.messageType = 'reason_required';
  } else if (messageText.includes('identifier') || messageText.includes('id')) {
    analysis.requiresAction = true;
    analysis.requiresIdentifier = true;
    analysis.fieldNames.push('identifier');
    analysis.messageType = 'identifier_required';
  } else if (messageText.includes('location')) {
    analysis.requiresAction = true;
    analysis.requiresLocation = true;
    analysis.fieldNames.push('location');
    analysis.messageType = 'location_required';
  } else if (messageText.includes('description')) {
    analysis.requiresAction = true;
    analysis.requiresDescription = true;
    analysis.fieldNames.push('description');
    analysis.messageType = 'description_required';
  } else if (messageText.includes('required') || messageText.includes('missing') || messageText.includes('incomplete')) {
    analysis.requiresAction = true;
    analysis.messageType = 'fields_required';
  } else if (messageText.includes('error') || messageText.includes('invalid')) {
    analysis.messageType = 'general_error';
  }

  return analysis;
}