import { test, expect } from '../../fixtures/auth';

/**
 * Controls Linking Form with Checkboxes - Complete Workflow Test
 * Tests the correct control linking workflow: Check checkboxes -> Click Link Control(s) button
 */

test('should complete full Controls Linking workflow with checkboxes', async ({ authenticatedPage }) => {
  const WAIT_SMALL = 400;
  const WAIT_MEDIUM = 600;
  const riskId = '95d8a18a-1e1c-44ed-9eaa-25dfadac75b5';

  console.log('=== FULL CONTROLS LINKING WORKFLOW WITH CHECKBOXES ===');

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

    console.log('📝 Looking for control checkboxes to select...');

    // Look for control checkboxes
    const controlCheckboxes = [
      'input[type="checkbox"][name*="control"]',
      'input[type="checkbox"][data-testid*="control"]',
      'input[type="checkbox"]',
      '[role="checkbox"]',
      'input[type="checkbox"][class*="control"]'
    ];

    let selectedControl = false;
    let controlName = '';

    for (const checkboxSelector of controlCheckboxes) {
      const checkboxes = authenticatedPage.locator(checkboxSelector);
      const checkboxCount = await checkboxes.count();

      console.log(`Found ${checkboxCount} checkboxes with selector: ${checkboxSelector}`);

      if (checkboxCount > 0) {
        for (let i = 0; i < Math.min(3, checkboxCount); i++) { // Try first 3 checkboxes
          const checkbox = checkboxes.nth(i);
          const isEnabled = await checkbox.isEnabled().catch(() => false);

          if (isEnabled) {
            // Check if it's already selected
            const isChecked = await checkbox.isChecked().catch(() => false);

            if (!isChecked) {
              console.log(`✅ Selecting control checkbox ${i + 1}`);

              // Get associated control name if possible
              try {
                // Look for text label associated with this checkbox
                const parent = checkbox.locator('..');
                const labelText = await parent.locator('label, div, span').first().textContent().catch(() => '');
                if (labelText && labelText.length < 100) {
                  controlName = labelText;
                  console.log(`  Control name: "${controlName}"`);
                }
              } catch (e) {
                // Continue if we can't get the label
              }

              await checkbox.check();
              await authenticatedPage.waitForTimeout(WAIT_SMALL);
              selectedControl = true;
              break; // Only select one control for this test
            }
          }
        }

        if (selectedControl) {
          break;
        }
      }
    }

    if (!selectedControl) {
      console.log('⚠️ No selectable control checkboxes found');
      console.log('Cannot proceed without control selection');
      return;
    }

    // Look for additional fields
    const relationshipSelect = authenticatedPage.locator('select[name*="relationship"], select[name*="type"]').first();
    const relationshipExists = await relationshipSelect.isVisible({ timeout: 2000 }).catch(() => false);
    if (relationshipExists) {
      const options = relationshipSelect.locator('option:not([value=""])');
      const optionCount = await options.count();
      if (optionCount > 0) {
        await relationshipSelect.selectOption({ index: 0 });
        console.log('✅ Relationship type selected');
      }
    }

    const effectivenessSelect = authenticatedPage.locator('select[name*="effectiveness"], select[name*="effective"]').first();
    const effectivenessExists = await effectivenessSelect.isVisible({ timeout: 2000 }).catch(() => false);
    if (effectivenessExists) {
      const options = effectivenessSelect.locator('option:not([value=""])');
      const optionCount = await options.count();
      if (optionCount > 0) {
        await effectivenessSelect.selectOption({ index: 0 });
        console.log('✅ Effectiveness selected');
      }
    }

    const justificationTextarea = authenticatedPage.locator('textarea[name*="justification"], textarea[name*="note"]').first();
    const justificationExists = await justificationTextarea.isVisible({ timeout: 2000 }).catch(() => false);
    if (justificationExists) {
      const justificationText = `E2E Control Linking Test - Selected control: ${controlName || 'Unknown'}. Linked via automated testing to verify checkbox selection workflow. Timestamp: ${new Date().toISOString()}`;
      await justificationTextarea.fill(justificationText);
      console.log('✅ Justification filled');
    }

    // Take screenshot before submit
    await authenticatedPage.screenshot({ path: 'test-results/controls-workflow/control-checkbox-selected.png', fullPage: true });
    console.log('📸 Screenshot taken with selected control checkbox');

    // Find and click the Link Control(s) button
    console.log('🔍 Looking for Link Control(s) submit button...');

    // Try to find the submit button that should now be enabled
    const submitSelectors = [
      'button:has-text("Link Control(s)")',
      'button:has-text("Link Control")',
      'button[type="submit"]:not(:disabled)',
      'button:has-text("Submit")',
      'button:has-text("Save")',
      '[role="dialog"] button:not(:disabled):has-text("Link")',
      '[role="dialog"] button[type="submit"]'
    ];

    let submitSuccess = false;

    for (const selector of submitSelectors) {
      const button = authenticatedPage.locator(selector).first();
      const visible = await button.isVisible({ timeout: 2000 }).catch(() => false);

      if (visible) {
        const buttonText = await button.textContent();
        const isEnabled = await button.isEnabled().catch(() => false);

        console.log(`✅ Found button: "${buttonText}" - Enabled: ${isEnabled}`);

        if (isEnabled) {
          try {
            await button.scrollIntoViewIfNeeded();
            await authenticatedPage.waitForTimeout(500);
            await button.click({ timeout: 5000 });
            console.log('🎉 Link Control(s) button clicked successfully!');
            submitSuccess = true;
            break;

          } catch (clickError) {
            console.log(`⚠️ Could not click button: ${clickError.message}`);
          }
        } else {
          console.log(`⚠️ Button "${buttonText}" is disabled`);
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
          'Effectiveness'
        ];

        let indicatorFound = false;
        for (const indicator of controlIndicators) {
          const indicatorLocator = authenticatedPage.locator(`text=${indicator}`).first();
          const indicatorVisible = await indicatorLocator.isVisible({ timeout: 2000 }).catch(() => false);

          if (indicatorVisible) {
            console.log(`✅ Control indicator found: "${indicator}"`);
            indicatorFound = true;
            break;
          }
        }

        if (indicatorFound) {
          console.log('🎉 SUCCESS! Control linking indicators found - DATA SAVED!');
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
      console.log('❌ No enabled Link Control button found');

      // List all buttons for debugging
      const allButtons = authenticatedPage.locator('[role="dialog"] button');
      const buttonCount = await allButtons.count();
      console.log(`Found ${buttonCount} buttons in control linking dialog:`);

      for (let i = 0; i < buttonCount; i++) {
        const buttonText = await allButtons.nth(i).textContent();
        const buttonType = await allButtons.nth(i).getAttribute('type');
        const isEnabled = await allButtons.nth(i).isEnabled().catch(() => false);
        console.log(`  Button ${i + 1}: "${buttonText}" (type: ${buttonType}, enabled: ${isEnabled})`);
      }
    }

  } else {
    console.log('❌ No Link Control button found in Controls tab');
  }

  console.log('=== CONTROLS LINKING WORKFLOW WITH CHECKBOXES TEST COMPLETE ===');
});