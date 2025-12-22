/**
 * Simple test to find validation messages and fill forms
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';

test.describe('Simple Validation Test', () => {
  test('should find and respond to validation messages', async ({ authenticatedPage }) => {
    console.log('\n🔍 SIMPLE VALIDATION TEST');

    // Navigate to asset
    await authenticatedPage.goto('http://localhost:3000/en/dashboard/assets/physical/99cb990a-29e4-4e34-acf4-d58b8261046b');
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(3000);

    // Open edit modal
    const editButton = await authenticatedPage.locator('button:has-text("Edit")').first();
    await editButton.click();
    await authenticatedPage.waitForTimeout(3000);

    const modal = await authenticatedPage.locator('[role="dialog"]').first();
    expect(await modal.isVisible()).toBe(true);

    console.log('✅ Edit modal opened');

    // Try different approaches to trigger validation and find messages

    // Approach 1: Try immediate save without filling anything
    console.log('\n🚨 Approach 1: Try save with empty form...');

    // Take screenshot of empty modal
    await authenticatedPage.screenshot({
      path: 'test-results/validation-simple-empty-modal.png',
      fullPage: true
    });

    // Look for save button
    const saveButtons = await modal.locator('button').all();
    let saveButton = null;

    for (const btn of saveButtons) {
      try {
        const isVisible = await btn.isVisible();
        if (isVisible) {
          const text = await btn.textContent();
          if (text && (text.toLowerCase().includes('save') ||
                      text.toLowerCase().includes('update') ||
                      text.toLowerCase().includes('submit'))) {
            saveButton = btn;
            console.log(`🔘 Found save button: "${text}"`);
            break;
          }
        }
      } catch (e) {
        continue;
      }
    }

    if (saveButton) {
      console.log('💾 Clicking save button...');
      await saveButton.click();
      await authenticatedPage.waitForTimeout(3000);

      // Check for validation messages after save attempt
      console.log('\n📢 Checking for validation messages after save...');

      // Wait a bit more for messages to appear
      await authenticatedPage.waitForTimeout(2000);

      // Look for validation messages with broad selectors
      const validationSelectors = [
        '.error',
        '.alert',
        '[role="alert"]',
        'text:has-text("required")',
        'text:has-text("error")',
        'text:has-text("invalid")',
        'text:has-text("missing")',
        'text:has-text("please")',
        '.validation-error',
        '.field-error',
        '[aria-invalid="true"]'
      ];

      let foundMessages = [];
      let fieldsWithErrors = [];

      for (const selector of validationSelectors) {
        try {
          const elements = await modal.locator(selector).all();
          for (const element of elements.slice(0, 10)) { // Limit to avoid too many
            try {
              const isVisible = await element.isVisible();
              if (isVisible) {
                const text = await element.textContent();
                if (text && text.trim()) {
                  foundMessages.push(text.trim());
                  console.log(`📢 Found: "${text.trim()}"`);
                }
              }
            } catch (e) {
              continue;
            }
          }

          // Check for fields with error states
          const errorFields = await modal.locator('[aria-invalid="true"]').all();
          for (const field of errorFields.slice(0, 5)) {
            try {
              const isVisible = await field.isVisible();
              if (isVisible) {
                const name = await field.getAttribute('name') || '';
                fieldsWithErrors.push(name);
                console.log(`🔴 Field with error: "${name}"`);
              }
            } catch (e) {
              continue;
            }
          }
        } catch (e) {
          continue;
        }
      }

      // Screenshot with validation state
      await authenticatedPage.screenshot({
        path: 'test-results/validation-simple-with-messages.png',
        fullPage: true
      });

      console.log(`\n📊 Results after save attempt:`);
      console.log(`📁 Validation messages found: ${foundMessages.length}`);
      console.log(`📁 Fields with errors: ${fieldsWithErrors.length}`);

      if (foundMessages.length > 0 || fieldsWithErrors.length > 0) {
        console.log('\n🔧 Validation detected! Analyzing messages...');

        // Analyze the validation messages to understand what's required
        const analysis = analyzeValidationMessages(foundMessages, fieldsWithErrors);

        console.log(`📝 Analysis results:`, analysis);

        if (analysis.requiresAction) {
          console.log('\n🛠️ Taking action based on validation...');

          // Go through tabs and fill based on analysis
          const tabs = await modal.locator('[role="tab"]').all();
          let tabNames = [];

          for (const tab of tabs) {
            try {
              const isVisible = await tab.isVisible();
              if (isVisible) {
                const text = await tab.textContent();
                if (text && text.trim()) {
                  tabNames.push(text.trim());
                }
              }
            } catch (e) {
              continue;
            }
          }

          console.log(`📋 Available tabs:`, tabNames);

          // Process each tab and fill required fields
          const timestamp = Date.now();
          let totalFilled = 0;

          for (let i = 0; i < Math.min(tabNames.length, 3); i++) {
            const tabName = tabNames[i];
            console.log(`\n📍 Processing tab: "${tabName}"`);

            // Find and click the tab
            const targetTab = await modal.locator(`[role="tab"]:has-text("${tabName}"), .tab:has-text("${tabName}")`).first();
            if (await targetTab.isVisible()) {
              await targetTab.click();
              await authenticatedPage.waitForTimeout(1000);
            }

            // Look for fillable fields in this tab
            const fillableFields = await modal.locator('input:not([type="search"]):not(:disabled), textarea:not(:disabled), select:not(:disabled)').all();
            console.log(`  📝 Found ${fillableFields.length} fillable fields`);

            for (const field of fillableFields) {
              try {
                const isVisible = await field.isVisible();
                if (isVisible) {
                  const tagName = await field.evaluate((el: any) => el.tagName.toLowerCase());
                  const name = await field.getAttribute('name') || '';
                  const placeholder = await field.getAttribute('placeholder') || '';
                  const currentValue = await field.inputValue().catch(() => '');

                  // Skip if already has a meaningful value
                  if (currentValue && currentValue.length > 2 &&
                      (currentValue !== 'TEST-DETAILS-1766172211990')) { // Skip default test value
                    continue;
                  }

                  console.log(`  🔍 Filling field: ${tagName} name="${name}"`);

                  // Fill based on field type and context
                  if (tagName === 'select') {
                    try {
                      const options = await field.locator('option').all();
                      if (options.length > 1) {
                        await field.selectOption({ index: Math.min(options.length - 1, 2) });
                        const selectedText = await options[Math.min(options.length - 1, 2)].textContent();
                        console.log(`    ✅ Selected: "${selectedText}"`);
                        totalFilled++;
                      }
                    } catch (e) {
                      console.log(`    ❌ Could not select option: ${e}`);
                    }
                  } else if (tagName === 'textarea') {
                    try {
                      let textValue = '';
                      if (name.toLowerCase().includes('reason') || analysis.requiresReason) {
                        textValue = `Validation required field filled at ${new Date().toISOString()}. Reason for change is mandatory.`;
                      } else {
                        textValue = `Field filled to resolve validation - Field: ${name || 'textarea'}. Time: ${timestamp}.`;
                      }
                      await field.fill(textValue);
                      console.log(`    ✅ Filled textarea`);
                      totalFilled++;
                    } catch (e) {
                      console.log(`    ❌ Could not fill textarea: ${e}`);
                    }
                  } else { // input
                    try {
                      let inputText = '';
                      if (name.toLowerCase().includes('identifier') || analysis.requiresIdentifier) {
                        inputText = `VALIDATED-ID-${timestamp}`;
                      } else if (name.toLowerCase().includes('reason') || analysis.requiresReason) {
                        inputText = `VALIDATION_REASON-${timestamp}`;
                      } else if (name.toLowerCase().includes('owner') && analysis.requiresOwner) {
                        // We'll handle owner separately in ownership tab
                        inputText = `VALIDATED_OWNER-${timestamp}`;
                      } else {
                        inputText = `VALIDATED_FIELD-${name || 'input'}-${timestamp}`;
                      }

                      await field.fill(inputText);
                      console.log(`    ✅ Filled input: "${inputText}"`);
                      totalFilled++;
                    } catch (e) {
                      console.log(`    ❌ Could not fill input: ${e}`);
                    }
                  }
                }
              } catch (e) {
                console.log(`    ❌ Error with field: ${e}`);
              }
            }

            console.log(`  ✅ Filled ${totalFilled} fields in "${tabName}" tab`);
          }

          console.log(`\n🎯 Total fields filled across all tabs: ${totalFilled}`);

          // Try save again
          console.log('\n💾 Attempting save after filling required fields...');

          const updatedSaveButton = await modal.locator('button:has-text("Update"), button:has-text("Save")').first();
          if (await updatedSaveButton.isVisible() && await updatedSaveButton.isEnabled()) {
            await updatedSaveButton.click();
            await authenticatedPage.waitForTimeout(5000);

            const modalStillOpen = await modal.isVisible();
            if (!modalStillOpen) {
              console.log('🎉 SUCCESS: Validation resolved and save completed!');
            } else {
              console.log('⚠️ Modal still open - checking for remaining issues...');

              // Look for any remaining error messages
              const remainingMessages = [];
              for (const selector of validationSelectors) {
                try {
                  const elements = await modal.locator(selector).all();
                  for (const element of elements.slice(0, 5)) {
                    try {
                      const isVisible = await element.isVisible();
                      if (isVisible) {
                        const text = await element.textContent();
                        if (text && text.trim()) {
                          remainingMessages.push(text.trim());
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

              if (remainingMessages.length > 0) {
                console.log('❌ Remaining messages:', remainingMessages);
              }
            }
          } else {
            console.log('⚠️ Save button not properly enabled or found');
          }
        }
      } else {
        console.log('ℹ️ No validation messages detected');
      }
    } else {
      console.log('❌ Could not find save button');
    }

    console.log('\n📊 SIMPLE VALIDATION TEST COMPLETE');
  });
});

function analyzeValidationMessages(messages, errorFields) {
  const analysis = {
    requiresAction: false,
    requiresOwner: false,
    requiresReason: false,
    requiresIdentifier: false,
    messageType: 'unknown'
  };

  const messageText = messages.join(' ').toLowerCase();

  // Analyze message content to determine requirements
  if (messageText.length === 0) {
    analysis.messageType = 'no_messages';
  } else if (messageText.includes('owner')) {
    analysis.requiresAction = true;
    analysis.requiresOwner = true;
    analysis.messageType = 'owner_required';
  } else if (messageText.includes('reason') || messageText.includes('change')) {
    analysis.requiresAction = true;
    analysis.requiresReason = true;
    analysis.messageType = 'reason_required';
  } else if (messageText.includes('identifier') || messageText.includes('id')) {
    analysis.requiresAction = true;
    analysis.requiresIdentifier = true;
    analysis.messageType = 'identifier_required';
  } else if (messageText.includes('required') || messageText.includes('missing') || messageText.includes('incomplete')) {
    analysis.requiresAction = true;
    analysis.messageType = 'fields_required';
  } else if (messageText.includes('error') || messageText.includes('invalid')) {
    analysis.messageType = 'general_error';
  } else if (errorFields.length > 0) {
    analysis.requiresAction = true;
    analysis.messageType = 'field_errors';
  }

  return analysis;
}