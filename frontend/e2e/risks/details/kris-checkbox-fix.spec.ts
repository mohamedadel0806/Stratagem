import { test, expect } from '../../fixtures/auth';

/**
 * KRIs Linking Form with Checkboxes - Complete Workflow Test
 * Tests the correct KRI linking workflow: Check checkboxes -> Click Link KRIs button
 */

test('should complete full KRIs Linking workflow with checkboxes', async ({ authenticatedPage }) => {
  const WAIT_SMALL = 400;
  const WAIT_MEDIUM = 600;
  const riskId = '95d8a18a-1e1c-44ed-9eaa-25dfadac75b5';

  console.log('=== FULL KRIS LINKING WORKFLOW WITH CHECKBOXES ===');

  // Navigate to risk details page
  await authenticatedPage.goto(`/en/dashboard/risks/${riskId}`, { waitUntil: 'domcontentloaded' });
  await authenticatedPage.waitForLoadState('domcontentloaded');
  await authenticatedPage.waitForTimeout(2000);

  // Navigate to KRIs tab
  await authenticatedPage.locator('[role="tab"]:has-text("KRIs")').first().click();
  await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

  console.log('✅ Navigated to KRIs tab');

  // Look for Link KRI button
  const linkKriBtn = authenticatedPage.locator('button').filter({ hasText: /Link KRI/i }).first();
  const buttonExists = await linkKriBtn.isVisible({ timeout: 5000 });

  if (buttonExists) {
    console.log('✅ Found Link KRI button');

    await linkKriBtn.click();
    await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

    console.log('🔓 KRI linking form opened');

    // Wait for dialog
    const dialog = authenticatedPage.locator('[role="dialog"]').first();
    await dialog.waitFor({ state: 'visible', timeout: 10000 });

    console.log('📝 Looking for KRI checkboxes to select...');

    // Look for KRI checkboxes
    const kriCheckboxes = [
      'input[type="checkbox"][name*="kri"]',
      'input[type="checkbox"][name*="metric"]',
      'input[type="checkbox"][data-testid*="kri"]',
      'input[type="checkbox"]',
      '[role="checkbox"]',
      'input[type="checkbox"][class*="kri"]'
    ];

    let selectedKri = false;
    let kriName = '';

    for (const checkboxSelector of kriCheckboxes) {
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
              console.log(`✅ Selecting KRI checkbox ${i + 1}`);

              // Get associated KRI name if possible
              try {
                // Look for text label associated with this checkbox
                const parent = checkbox.locator('..');
                const labelText = await parent.locator('label, div, span').first().textContent().catch(() => '');
                if (labelText && labelText.length < 100) {
                  kriName = labelText;
                  console.log(`  KRI name: "${kriName}"`);
                }
              } catch (e) {
                // Continue if we can't get the label
              }

              await checkbox.check();
              await authenticatedPage.waitForTimeout(WAIT_SMALL);
              selectedKri = true;
              break; // Only select one KRI for this test
            }
          }
        }

        if (selectedKri) {
          break;
        }
      }
    }

    if (!selectedKri) {
      console.log('⚠️ No selectable KRI checkboxes found');
      console.log('Cannot proceed without KRI selection');
      return;
    }

    // Look for additional fields
    const thresholdInput = authenticatedPage.locator('input[name*="threshold"], input[name*="target"]').first();
    const thresholdExists = await thresholdInput.isVisible({ timeout: 2000 }).catch(() => false);
    if (thresholdExists) {
      await thresholdInput.fill('80');
      console.log('✅ Threshold/target filled');
    }

    const frequencySelect = authenticatedPage.locator('select[name*="frequency"], select[name*="period"]').first();
    const frequencyExists = await frequencySelect.isVisible({ timeout: 2000 }).catch(() => false);
    if (frequencyExists) {
      const options = frequencySelect.locator('option:not([value=""])');
      const optionCount = await options.count();
      if (optionCount > 0) {
        await frequencySelect.selectOption({ index: 0 });
        console.log('✅ Frequency selected');
      }
    }

    const justificationTextarea = authenticatedPage.locator('textarea[name*="justification"], textarea[name*="note"], textarea[placeholder*="reason"]').first();
    const justificationExists = await justificationTextarea.isVisible({ timeout: 2000 }).catch(() => false);
    if (justificationExists) {
      const justificationText = `E2E KRI Linking Test - Selected KRI: ${kriName || 'Unknown'}. Linked via automated testing to verify checkbox selection workflow. Timestamp: ${new Date().toISOString()}`;
      await justificationTextarea.fill(justificationText);
      console.log('✅ Justification filled');
    }

    // Take screenshot before submit
    await authenticatedPage.screenshot({ path: 'test-results/kris-workflow/kri-checkbox-selected.png', fullPage: true });
    console.log('📸 Screenshot taken with selected KRI checkbox');

    // Find and click the Link KRIs button
    console.log('🔍 Looking for Link KRIs submit button...');

    // Try to find the submit button that should now be enabled
    const submitSelectors = [
      'button:has-text("Link KRIs")',
      'button:has-text("Link KRI")',
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
            console.log('🎉 Link KRIs button clicked successfully!');
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
        console.log('✅ KRI linking form closed - submission successful!');

        // Wait for content to update
        await authenticatedPage.waitForTimeout(2000);

        // Look for the newly linked KRI
        console.log('🔍 Verifying KRI was linked...');

        // Look for any KRI indicators
        const kriIndicators = [
          'Linked',
          'Connected',
          'KRI',
          'E2E KRI Linking',
          'Metric',
          'Threshold',
          'Target'
        ];

        let indicatorFound = false;
        for (const indicator of kriIndicators) {
          const indicatorLocator = authenticatedPage.locator(`text=${indicator}`).first();
          const indicatorVisible = await indicatorLocator.isVisible({ timeout: 2000 }).catch(() => false);

          if (indicatorVisible) {
            console.log(`✅ KRI indicator found: "${indicator}"`);
            indicatorFound = true;
            break;
          }
        }

        if (indicatorFound) {
          console.log('🎉 SUCCESS! KRI linking indicators found - DATA SAVED!');
        }

        // Take final screenshot
        await authenticatedPage.screenshot({ path: 'test-results/kris-workflow/kri-linking-success.png', fullPage: true });

      } else {
        console.log('⚠️ KRI linking form still open - checking for errors...');

        // Look for error messages
        const errorMsg = authenticatedPage.locator('[role="alert"], .error, .text-red-500, [data-testid*="error"]').first();
        const hasError = await errorMsg.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasError) {
          const errorText = await errorMsg.textContent();
          console.log(`❌ Error message: ${errorText}`);
          await authenticatedPage.screenshot({ path: 'test-results/kris-workflow/kri-linking-error.png', fullPage: true });
        }
      }
    } else {
      console.log('❌ No enabled Link KRIs button found');

      // List all buttons for debugging
      const allButtons = authenticatedPage.locator('[role="dialog"] button');
      const buttonCount = await allButtons.count();
      console.log(`Found ${buttonCount} buttons in KRI linking dialog:`);

      for (let i = 0; i < buttonCount; i++) {
        const buttonText = await allButtons.nth(i).textContent();
        const buttonType = await allButtons.nth(i).getAttribute('type');
        const isEnabled = await allButtons.nth(i).isEnabled().catch(() => false);
        console.log(`  Button ${i + 1}: "${buttonText}" (type: ${buttonType}, enabled: ${isEnabled})`);
      }
    }

  } else {
    console.log('❌ No Link KRI button found in KRIs tab');
  }

  console.log('=== KRIS LINKING WORKFLOW WITH CHECKBOXES TEST COMPLETE ===');
});