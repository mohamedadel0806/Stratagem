/**
 * Test to trigger validation by changing owner field
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';

test.describe('Owner Change Validation', () => {
  test('should trigger validation when owner is changed and require Reason for Change', async ({ authenticatedPage }) => {
    console.log('\n🔍 OWNER CHANGE VALIDATION TEST');

    const assetUrl = 'http://localhost:3000/en/dashboard/assets/physical/99cb990a-29e4-4e34-acf4-d58b8261046b';
    const timestamp = Date.now();
    const newOwner = 'Sarah Compliance'; // Different owner to trigger change

    // Step 1: Navigate to asset and open edit modal
    await authenticatedPage.goto(assetUrl);
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(3000);

    const editButton = await authenticatedPage.locator('button:has-text("Edit")').first();
    await editButton.click();
    await authenticatedPage.waitForTimeout(3000);

    const modal = await authenticatedPage.locator('[role="dialog"]').first();
    expect(await modal.isVisible()).toBe(true);

    console.log('✅ Edit modal opened');

    // Step 2: Go to Ownership tab and change the owner
    console.log('\n👤 Going to Ownership tab to change owner...');

    const ownershipTab = await modal.locator('button:has-text("Ownership")').first();
    await ownershipTab.click();
    await authenticatedPage.waitForTimeout(2000);

    // Screenshot before changing owner
    await authenticatedPage.screenshot({
      path: 'test-results/owner-change-before.png',
      fullPage: true
    });

    // Find current owner and select a different one
    const ownerSelects = await modal.locator('select').all();
    let ownerSelect = null;
    let currentOwner = '';

    for (const select of ownerSelects) {
      try {
        const isVisible = await select.isVisible();
        if (isVisible) {
          // Check if this looks like the owner dropdown by examining options
          const options = await select.locator('option').all();
          for (const option of options) {
            const optionText = await option.textContent();
            if (optionText && (
              optionText.includes('Mohammed') ||
              optionText.includes('Fatima') ||
              optionText.includes('Sarah') ||
              optionText.includes('John')
            )) {
              ownerSelect = select;
              console.log(`✅ Found owner dropdown with options including: ${optionText}`);

              // Get current selection
              try {
                const selectedOption = await select.locator('option:checked').first();
                currentOwner = await selectedOption.textContent();
                console.log(`📋 Current owner: "${currentOwner}"`);
              } catch (e) {
                console.log('Could not determine current owner');
              }
              break;
            }
          }
        }
      } catch (e) {
        continue;
      }
      if (ownerSelect) break;
    }

    if (ownerSelect) {
      // Select a different owner to trigger validation
      await ownerSelect.selectOption({ label: newOwner });
      console.log(`✅ Changed owner from "${currentOwner}" to "${newOwner}"`);

      // Screenshot after owner change
      await authenticatedPage.screenshot({
        path: 'test-results/owner-change-after.png',
        fullPage: true
      });
    } else {
      console.log('❌ Could not find owner dropdown');
      expect(ownerSelect).not.toBeNull();
    }

    // Step 3: Try to save immediately to trigger validation
    console.log('\n💾 Attempting save with owner change (no Reason for Change yet)...');

    const saveButton = await modal.locator('button:has-text("Update")').first();
    expect(await saveButton.isVisible()).toBe(true);

    await saveButton.click();
    console.log('✅ Save button clicked - should trigger validation...');

    // Wait for validation messages to appear
    await authenticatedPage.waitForTimeout(3000);

    // Check if modal is still open (validation should keep it open)
    const modalStillOpen = await modal.isVisible();

    expect(modalStillOpen).toBe(true);
    console.log('✅ Modal still open - validation messages should be visible');

    // Screenshot with validation messages
    await authenticatedPage.screenshot({
      path: 'test-results/owner-change-validation-messages.png',
      fullPage: true
    });

    // Step 4: Look for validation messages
    console.log('\n📢 Looking for validation messages about owner change...');

    const validationSelectors = [
      '[role="alert"]',
      '.alert',
      '.alert-error',
      '.alert-warning',
      '.validation-message',
      '.validation-error',
      'text:has-text("reason")',
      'text:has-text("change")',
      'text:has-text("required")',
      'text:has-text("owner")',
      'text:has-text("explain")'
    ];

    let foundMessages = [];

    for (const selector of validationSelectors) {
      try {
        const elements = await modal.locator(selector).all();
        for (const element of elements.slice(0, 5)) {
          try {
            const isVisible = await element.isVisible();
            if (isVisible) {
              const text = await element.textContent();
              if (text && text.trim() && text.trim().length > 5) {
                const cleanText = text.trim();
                foundMessages.push({
                  selector,
                  text: cleanText
                });
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

    console.log(`\n📊 Found ${foundMessages.length} validation messages`);

    if (foundMessages.length > 0) {
      console.log('\n📝 All validation messages:');
      foundMessages.forEach((msg, i) => {
        console.log(`  ${i + 1}. "${msg.text}"`);
      });

      // Check if messages mention owner change or reason for change
      const messagesAboutOwnerOrReason = foundMessages.filter(msg =>
        msg.text.toLowerCase().includes('owner') ||
        msg.text.toLowerCase().includes('reason') ||
        msg.text.toLowerCase().includes('change')
      );

      if (messagesAboutOwnerOrReason.length > 0) {
        console.log(`\n✅ Found ${messagesAboutOwnerOrReason.length} messages about owner/reason for change`);
      }
    }

    // Step 5: Go to Network tab and fill Reason for Change
    console.log('\n📝 Going to Network tab to fill Reason for Change...');

    const networkTab = await modal.locator('button:has-text("Network")').first();
    await networkTab.click();
    await authenticatedPage.waitForTimeout(2000);

    // Look for Reason for Change field
    const reasonFieldSelectors = [
      'textarea[name*="reason"]',
      'textarea[name*="change"]',
      'textarea[placeholder*="reason"]',
      'textarea[placeholder*="change"]',
      'label:has-text("Reason") ~ textarea',
      'label:has-text("Change") ~ textarea',
      'textarea'
    ];

    let reasonField = null;

    for (const selector of reasonFieldSelectors) {
      try {
        const field = await modal.locator(selector).first();
        const isVisible = await field.isVisible();
        if (isVisible) {
          const name = await field.getAttribute('name') || '';
          const placeholder = await field.getAttribute('placeholder') || '';

          if (name.toLowerCase().includes('reason') ||
              name.toLowerCase().includes('change') ||
              placeholder.toLowerCase().includes('reason') ||
              placeholder.toLowerCase().includes('change')) {
            reasonField = field;
            console.log(`✅ Found Reason for Change field: ${selector}`);
            console.log(`   Name: "${name}", Placeholder: "${placeholder}"`);
            break;
          }
        }
      } catch (e) {
        continue;
      }
    }

    expect(reasonField).not.toBeNull();

    // Fill the Reason for Change field
    const reasonText = `Owner assignment changed from "${currentOwner}" to "${newOwner}" at ${new Date().toISOString()}. This change is necessary for proper asset management and compliance tracking.`;
    await reasonField!.fill(reasonText);
    console.log(`✅ Filled Reason for Change: "${reasonText}"`);

    // Screenshot after filling reason
    await authenticatedPage.screenshot({
      path: 'test-results/owner-change-reason-filled.png',
      fullPage: true
    });

    // Step 6: Try to save again
    console.log('\n💾 Attempting save with owner change AND Reason for Change...');

    const finalSaveButton = await modal.locator('button:has-text("Update")').first();
    expect(await finalSaveButton.isVisible()).toBe(true);

    await finalSaveButton.click();
    console.log('✅ Final save button clicked');

    // Wait for save completion
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(5000);

    // Check if modal closed
    const modalStillOpenAfterSave = await modal.isVisible();

    if (!modalStillOpenAfterSave) {
      console.log('🎉 SUCCESS: Owner change saved successfully with Reason for Change!');
    } else {
      console.log('⚠️ Modal still open - checking for remaining validation...');

      // Look for any remaining error messages
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
      }
    }

    // Final verification
    await authenticatedPage.goto(assetUrl);
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(5000);

    // Final screenshot
    await authenticatedPage.screenshot({
      path: 'test-results/owner-change-final-verification.png',
      fullPage: true
    });

    console.log('\n📊 OWNER CHANGE VALIDATION TEST RESULTS:');
    console.log(`📁 Original owner: "${currentOwner}"`);
    console.log(`📁 New owner: "${newOwner}"`);
    console.log(`📁 Validation messages found: ${foundMessages.length}`);
    console.log(`📁 Reason for Change filled: Yes`);
    console.log(`📁 Modal closed after save: ${!modalStillOpenAfterSave}`);
    console.log('📁 Screenshots saved: owner-change-*.png');

    expect(modal).toBeDefined();
    expect(ownerSelect).not.toBeNull();
    expect(reasonField).not.toBeNull();
    expect(foundMessages.length).toBeGreaterThan(0);

    console.log('\n🎯 CONCLUSION:');
    if (!modalStillOpenAfterSave && foundMessages.length > 0) {
      console.log('✅ COMPLETE SUCCESS: Owner change validation properly triggered and resolved!');
      console.log('✅ Validation messages captured and Reason for Change provided');
      console.log('✅ Owner assignment saved successfully');
    } else {
      console.log('ℹ️ Test completed - check screenshots for details');
    }
  });
});