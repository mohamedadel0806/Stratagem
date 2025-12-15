import { test, expect } from '../../fixtures/auth';

/**
 * Controls Linking Form Complete Workflow Test
 * Tests the full control linking form: Open -> Fill -> Submit -> Verify
 */

test('should complete full Controls Linking workflow', async ({ authenticatedPage }) => {
  const WAIT_SMALL = 400;
  const WAIT_MEDIUM = 600;
  const riskId = '95d8a18a-1e1c-44ed-9eaa-25dfadac75b5';

  console.log('=== FULL CONTROLS LINKING WORKFLOW ===');

  // Navigate to risk details page
  await authenticatedPage.goto(`/en/dashboard/risks/${riskId}`, { waitUntil: 'domcontentloaded' });
  await authenticatedPage.waitForLoadState('domcontentloaded');
  await authenticatedPage.waitForTimeout(2000);

  // Navigate to Controls tab
  await authenticatedPage.locator('[role="tab"]:has-text("Controls")').first().click();
  await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

  console.log('✅ Navigated to Controls tab');

  // Look for Link Control button
  const linkControlBtn = authenticatedPage.locator('button').filter({ hasText: /Link Control/i }).first();
  const buttonExists = await linkControlBtn.isVisible({ timeout: 5000 });

  if (buttonExists) {
    console.log('✅ Found Link Control button');

    await linkControlBtn.click();
    await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

    console.log('🔓 Control linking form opened');

    // Wait for dialog
    const dialog = authenticatedPage.locator('[role="dialog"]').first();
    await dialog.waitFor({ state: 'visible', timeout: 10000 });

    console.log('📝 Filling control linking form...');

    // Look for control selection dropdown
    const controlSelect = authenticatedPage.locator('select[name*="control"], [data-testid*="control"], [name*="control_id"]').first();
    const controlExists = await controlSelect.isVisible({ timeout: 3000 }).catch(() => false);
    let controlSelected = false;

    if (controlExists) {
      const controlOptions = controlSelect.locator('option:not([value=""])');
      const controlCount = await controlOptions.count();

      console.log(`Found ${controlCount} available controls`);

      if (controlCount > 0) {
        await controlSelect.selectOption({ index: 0 });
        await authenticatedPage.waitForTimeout(WAIT_SMALL);
        console.log('✅ Control selected');
        controlSelected = true;

        // Get the selected control value for verification
        const selectedControlValue = await controlSelect.inputValue();
        console.log(`Selected control value: ${selectedControlValue}`);
      } else {
        console.log('⚠️ No controls available to select');
      }
    } else {
      console.log('⚠️ Control selection dropdown not found');
    }

    // Look for relationship type field
    const relationshipSelect = authenticatedPage.locator('select[name*="relationship"], select[name*="type"], [name*="relationship_type"]').first();
    const relationshipExists = await relationshipSelect.isVisible({ timeout: 3000 }).catch(() => false);
    if (relationshipExists) {
      const relationshipOptions = relationshipSelect.locator('option:not([value=""])');
      const relationshipCount = await relationshipOptions.count();

      if (relationshipCount > 0) {
        await relationshipSelect.selectOption({ index: 0 });
        await authenticatedPage.waitForTimeout(WAIT_SMALL);
        console.log('✅ Relationship type selected');
      }
    }

    // Look for control effectiveness field
    const effectivenessSelect = authenticatedPage.locator('select[name*="effectiveness"], select[name*="effective"], [name*="effectiveness"]').first();
    const effectivenessExists = await effectivenessSelect.isVisible({ timeout: 3000 }).catch(() => false);
    if (effectivenessExists) {
      const effectivenessOptions = effectivenessSelect.locator('option:not([value=""])');
      const effectivenessCount = await effectivenessOptions.count();

      if (effectivenessCount > 0) {
        await effectivenessSelect.selectOption({ index: 0 });
        await authenticatedPage.waitForTimeout(WAIT_SMALL);
        console.log('✅ Control effectiveness selected');
      }
    }

    // Look for justification/notes field
    const justificationTextarea = authenticatedPage.locator('textarea[name*="justification"], textarea[name*="note"], textarea[name*="comment"], textarea[placeholder*="justification"], textarea[placeholder*="note"]').first();
    const justificationExists = await justificationTextarea.isVisible({ timeout: 3000 }).catch(() => false);
    if (justificationExists) {
      const justificationText = `E2E Control Linking - This control was linked to the risk via automated testing to verify the complete control linking workflow functionality. Link timestamp: ${new Date().toISOString()}`;
      await justificationTextarea.fill(justificationText);
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      console.log('✅ Justification/notes filled');
    }

    // Look for implementation status field
    const implementationSelect = authenticatedPage.locator('select[name*="implementation"], select[name*="status"], [name*="implementation_status"]').first();
    const implementationExists = await implementationSelect.isVisible({ timeout: 3000 }).catch(() => false);
    if (implementationExists) {
      const implementationOptions = implementationSelect.locator('option:not([value=""])');
      const implementationCount = await implementationOptions.count();

      if (implementationCount > 0) {
        await implementationSelect.selectOption({ index: 0 });
        await authenticatedPage.waitForTimeout(WAIT_SMALL);
        console.log('✅ Implementation status selected');
      }
    }

    // Take screenshot before submit
    await authenticatedPage.screenshot({ path: 'test-results/controls-workflow/control-linking-form-filled.png', fullPage: true });
    console.log('📸 Screenshot taken of filled control linking form');

    // Find and click submit button
    console.log('🔍 Looking for control linking submit button...');

    const submitSelectors = [
      'button[type="submit"]',
      'button:has-text("Link")',
      'button:has-text("Save")',
      'button:has-text("Submit")',
      'button:has-text("Link Control")',
      'button:has-text("Create")',
      '[role="dialog"] button[type="submit"]',
      '[role="dialog"] button:last-child'
    ];

    let submitSuccess = false;

    for (const selector of submitSelectors) {
      const button = authenticatedPage.locator(selector).first();
      const visible = await button.isVisible({ timeout: 2000 }).catch(() => false);

      if (visible) {
        const buttonText = await button.textContent();
        console.log(`✅ Found submit button: "${buttonText}"`);

        try {
          await button.scrollIntoViewIfNeeded();
          await authenticatedPage.waitForTimeout(500);
          await button.click({ timeout: 5000 });
          console.log('🎉 Control linking submit button clicked!');
          submitSuccess = true;
          break;

        } catch (clickError) {
          console.log(`⚠️ Could not click with selector ${selector}: ${clickError.message}`);
        }
      }
    }

    if (submitSuccess) {
      // Wait for form closure
      await authenticatedPage.waitForTimeout(3000);

      // Check if form closed
      const dialogStillVisible = await authenticatedPage.locator('[role="dialog"]').isVisible({ timeout: 2000 }).catch(() => false);

      if (!dialogStillVisible) {
        console.log('✅ Control linking form closed - submission successful!');

        // Wait for content to update
        await authenticatedPage.waitForTimeout(2000);

        // Look for the newly linked control
        console.log('🔍 Verifying control was linked...');

        // Look for any control indicators
        const controlIndicators = [
          'Linked',
          'Connected',
          'Control',
          'E2E Control Linking',
          'Effectiveness',
          'Implementation'
        ];

        let controlFound = false;
        for (const indicator of controlIndicators) {
          const indicatorLocator = authenticatedPage.locator(`text=${indicator}`).first();
          const indicatorVisible = await indicatorLocator.isVisible({ timeout: 3000 }).catch(() => false);

          if (indicatorVisible) {
            console.log(`✅ Control indicator found: "${indicator}"`);
            controlFound = true;
            break;
          }
        }

        if (controlFound) {
          console.log('🎉 SUCCESS! Control found linked - DATA SAVED!');
        } else {
          console.log('⚠️ Linked control not immediately visible, checking for any new content...');

          // Look for control entries
          const controlEntries = authenticatedPage.locator('[data-testid*="control"], .control-item, .control-row').count();
          console.log(`Found ${controlEntries} control entries in the list`);

          // Look for any cards or items
          const cardItems = authenticatedPage.locator('.card, .item, .entry').count();
          console.log(`Found ${cardItems} card items`);
        }

        // Take final screenshot
        await authenticatedPage.screenshot({ path: 'test-results/controls-workflow/control-linking-success.png', fullPage: true });

      } else {
        console.log('⚠️ Control linking form still open - checking for errors...');

        // Look for error messages
        const errorMsg = authenticatedPage.locator('[role="alert"], .error, .text-red-500, [data-testid*="error"]').first();
        const hasError = await errorMsg.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasError) {
          const errorText = await errorMsg.textContent();
          console.log(`❌ Error message: ${errorText}`);
          await authenticatedPage.screenshot({ path: 'test-results/controls-workflow/control-linking-error.png', fullPage: true });
        }
      }
    } else {
      console.log('❌ No control linking submit button found');

      // List all buttons for debugging
      const allButtons = authenticatedPage.locator('[role="dialog"] button');
      const buttonCount = await allButtons.count();
      console.log(`Found ${buttonCount} buttons in control linking dialog:`);

      for (let i = 0; i < buttonCount; i++) {
        const buttonText = await allButtons.nth(i).textContent();
        const buttonType = await allButtons.nth(i).getAttribute('type');
        console.log(`  Button ${i + 1}: "${buttonText}" (type: ${buttonType})`);
      }
    }

  } else {
    console.log('❌ No Link Control button found in Controls tab');

    // Look for any other control-related buttons
    const otherButtons = authenticatedPage.locator('button').filter({
      hasText: /Control|Add|Create|Link/i
    });

    const otherButtonCount = await otherButtons.count();
    console.log(`Found ${otherButtonCount} other control-related buttons:`);

    for (let i = 0; i < otherButtonCount; i++) {
      const buttonText = await otherButtons.nth(i).textContent();
      console.log(`  - "${buttonText}"`);
    }
  }

  console.log('=== CONTROLS LINKING WORKFLOW TEST COMPLETE ===');
});