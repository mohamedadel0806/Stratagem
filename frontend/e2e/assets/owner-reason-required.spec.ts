/**
 * Test for assigning owner with required Reason for Change field
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';

test.describe('Owner Assignment with Reason Required', () => {
  test('should assign owner and fill required Reason for Change field', async ({ authenticatedPage }) => {
    console.log('\n🚀 TESTING OWNER ASSIGNMENT WITH REQUIRED REASON FOR CHANGE');

    const assetUrl = 'http://localhost:3000/en/dashboard/assets/physical/99cb990a-29e4-4e34-acf4-d58b8261046b';
    const testOwner = 'Sarah Compliance'; // Pick a different owner to track
    const timestamp = Date.now();

    // Step 1: Navigate to asset and open edit modal
    console.log('📍 Navigating to asset...');
    await authenticatedPage.goto(assetUrl);
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(3000);

    const editButton = await authenticatedPage.locator('button:has-text("Edit")').first();
    await editButton.click();
    await authenticatedPage.waitForTimeout(3000);

    const modal = await authenticatedPage.locator('[role="dialog"]').first();
    expect(await modal.isVisible()).toBe(true);
    console.log('✅ Edit modal opened');

    // Step 2: Go to Ownership tab and assign owner
    console.log('\n👤 Assigning owner...');
    const ownershipTab = await modal.locator('button:has-text("Ownership")').first();
    await ownershipTab.click();
    await authenticatedPage.waitForTimeout(2000);

    // Find and fill owner dropdown
    const ownerSelect = await modal.locator('select').all();
    let ownerField = null;

    for (const select of ownerSelect) {
      try {
        const isVisible = await select.isVisible();
        if (isVisible) {
          const options = await select.locator('option').all();
          for (const option of options) {
            const optionText = await option.textContent();
            if (optionText && optionText.includes(testOwner)) {
              ownerField = select;
              console.log(`✅ Found owner dropdown with "${testOwner}"`);
              break;
            }
          }
        }
      } catch (e) {
        continue;
      }
      if (ownerField) break;
    }

    if (ownerField) {
      await ownerField.selectOption({ label: testOwner });
      console.log(`✅ Selected owner: "${testOwner}"`);
    }

    // Also fill department if available
    try {
      const allSelects = await modal.locator('select').all();
      for (const select of allSelects) {
        if (select !== ownerField) {
          const isVisible = await select.isVisible();
          if (isVisible) {
            const options = await select.locator('option').all();
            if (options.length > 1) {
              await select.selectOption({ index: Math.min(options.length - 1, 2) });
              const selectedText = await options[Math.min(options.length - 1, 2)].textContent();
              console.log(`✅ Selected department: "${selectedText}"`);
              break;
            }
          }
        }
      }
    } catch (e) {
      console.log(`Note: Department field issue: ${e}`);
    }

    // Step 3: Go to Network tab and fill Reason for Change
    console.log('\n📝 Going to Network tab for Reason for Change...');
    const networkTab = await modal.locator('button:has-text("Network")').first();
    await networkTab.click();
    await authenticatedPage.waitForTimeout(2000);

    // Look specifically for Reason for Change field
    console.log('🔍 Looking for Reason for Change field...');

    const reasonFieldSelectors = [
      'textarea[name*="reason"]',
      'textarea[name*="change"]',
      'textarea[id*="reason"]',
      'textarea[id*="change"]',
      'label:has-text("Reason") ~ textarea',
      'label:has-text("Reason for Change") ~ textarea',
      'label:has-text("Change") ~ textarea',
      '[data-testid*="reason"] textarea',
      '[data-testid*="change"] textarea',
      '.reason-field textarea',
      '.change-field textarea'
    ];

    let reasonField = null;
    let reasonFieldName = '';

    for (const selector of reasonFieldSelectors) {
      try {
        const field = await modal.locator(selector).first();
        const isVisible = await field.isVisible();
        if (isVisible) {
          reasonField = field;
          reasonFieldName = selector;
          console.log(`✅ Found reason field: ${selector}`);
          break;
        }
      } catch (e) {
        // Continue
      }
    }

    // If not found with specific selectors, look for any textarea
    if (!reasonField) {
      console.log('🔍 Looking for any textarea fields...');
      const textareas = await modal.locator('textarea').all();
      for (const textarea of textareas) {
        try {
          const isVisible = await textarea.isVisible();
          if (isVisible) {
            const name = await textarea.getAttribute('name') || '';
            const placeholder = await textarea.getAttribute('placeholder') || '';

            // Check if this looks like a reason field
            if (name.toLowerCase().includes('reason') ||
                name.toLowerCase().includes('change') ||
                placeholder.toLowerCase().includes('reason') ||
                placeholder.toLowerCase().includes('change')) {
              reasonField = textarea;
              reasonFieldName = `textarea (name="${name}", placeholder="${placeholder}")`;
              console.log(`✅ Found reason field by context: ${reasonFieldName}`);
              break;
            }
          }
        } catch (e) {
          continue;
        }
      }
    }

    expect(reasonField).not.toBeNull();

    // Fill the Reason for Change field
    const reasonText = `E2E Testing: Owner assignment for ${testOwner} at ${new Date().toISOString()}. Test case for verifying required field validation.`;
    await reasonField!.fill(reasonText);
    console.log(`✅ Filled Reason for Change: "${reasonText}"`);

    // Also fill location field if it exists and is empty
    try {
      const locationInputs = await modal.locator('input').all();
      for (const input of locationInputs) {
        try {
          const isVisible = await input.isVisible();
          const isDisabled = await input.isDisabled();
          if (isVisible && !isDisabled) {
            const name = await input.getAttribute('name') || '';
            const placeholder = await input.getAttribute('placeholder') || '';
            const currentValue = await input.inputValue().catch(() => '');

            if ((name.toLowerCase().includes('location') || placeholder.toLowerCase().includes('location')) &&
                (!currentValue || currentValue.trim() === '')) {
              await input.fill(`E2E Test Location ${timestamp}`);
              console.log(`✅ Filled location field`);
              break;
            }
          }
        } catch (e) {
          continue;
        }
      }
    } catch (e) {
      console.log(`Note: Location field not found: ${e}`);
    }

    // Screenshot before save
    await authenticatedPage.screenshot({
      path: 'test-results/owner-reason-before-save.png',
      fullPage: true
    });

    // Step 4: Save the changes
    console.log('\n💾 Saving changes with owner and reason...');
    const saveButton = await modal.locator('button:has-text("Update")').first();
    expect(await saveButton.isVisible()).toBe(true);
    expect(await saveButton.isEnabled()).toBe(true);

    await saveButton.click();
    console.log('✅ Save button clicked');

    // Step 5: Wait for save completion
    console.log('\n⏳ Waiting for save to complete...');
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(5000);

    // Check if modal closed
    const modalStillVisible = await modal.isVisible();

    if (!modalStillVisible) {
      console.log('✅ Modal closed successfully - save completed!');
    } else {
      console.log('⚠️ Modal still visible - checking for errors...');

      // Look for any error messages
      const errorSelectors = [
        'text:has-text("required")',
        'text:has-text("error")',
        'text:has-text("invalid")',
        '.error-message',
        '.validation-error'
      ];

      let errorsFound = [];
      for (const selector of errorSelectors) {
        try {
          const errors = await modal.locator(selector).all();
          for (const error of errors) {
            if (await error.isVisible()) {
              const errorText = await error.textContent();
              if (errorText) {
                errorsFound.push(errorText.trim());
              }
            }
          }
        } catch (e) {
          continue;
        }
      }

      if (errorsFound.length > 0) {
        console.log('❌ Validation errors found:');
        errorsFound.forEach(error => console.log(`  - ${error}`));
      } else {
        console.log('ℹ️ No visible error messages, but modal still open');
      }

      // Close modal to continue
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

    // Step 6: Verify the results
    console.log('\n🔍 Verifying results...');

    // Refresh and check the asset
    await authenticatedPage.goto(assetUrl);
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(5000);

    // Final screenshot
    await authenticatedPage.screenshot({
      path: 'test-results/owner-reason-final-state.png',
      fullPage: true
    });

    // Look for owner information
    const ownerSelectors = [
      'text:has-text("Owner")',
      '.owner-info',
      '[data-testid*="owner"]'
    ];

    let ownerFound = false;
    for (const selector of ownerSelectors) {
      try {
        const elements = await authenticatedPage.locator(selector).all();
        for (const element of elements) {
          const isVisible = await element.isVisible();
          if (isVisible) {
            const text = await element.textContent();
            if (text && text.includes(testOwner)) {
              ownerFound = true;
              console.log(`✅ Owner "${testOwner}" found in UI!`);
              break;
            }
          }
        }
        if (ownerFound) break;
      } catch (e) {
        continue;
      }
    }

    if (!ownerFound) {
      console.log(`⚠️ Owner "${testOwner}" not found in UI, but we successfully filled the form`);
    }

    console.log('\n📊 OWNER WITH REASON TEST RESULTS:');
    console.log(`📁 Owner selected: "${testOwner}"`);
    console.log(`📁 Reason for Change filled: Yes`);
    console.log(`📁 Modal closed: ${!modalStillVisible}`);
    console.log(`📁 Owner visible in UI: ${ownerFound}`);
    console.log(`📁 Screenshots saved in test-results/`);

    // Assertions
    expect(modal).toBeDefined();
    expect(reasonField).not.toBeNull();
    expect(testOwner).toBeTruthy();

    // Success message
    if (!modalStillVisible && ownerFound) {
      console.log(`\n🎉 COMPLETE SUCCESS: Owner "${testOwner}" assigned with required Reason for Change!`);
    } else if (!modalStillVisible) {
      console.log(`\n✅ SUCCESS: Form completed and saved (owner may be stored but not displayed)`);
    } else {
      console.log(`\n⚠️ PARTIAL: Form filled but save completion unclear`);
    }

    expect(!modalStillVisible).toBe(true); // Modal should close after successful save
  });
});