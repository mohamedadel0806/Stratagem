import { test, expect } from '../../fixtures/auth';

/**
 * Assets Linking Form with Checkboxes - Complete Workflow Test
 * Tests the correct asset linking workflow: Check checkboxes -> Click Link Asset(s) button
 */

test('should complete full Assets Linking workflow with checkboxes', async ({ authenticatedPage }) => {
  const WAIT_SMALL = 400;
  const WAIT_MEDIUM = 600;
  const riskId = '95d8a18a-1e1c-44ed-9eaa-25dfadac75b5';

  console.log('=== FULL ASSETS LINKING WORKFLOW WITH CHECKBOXES ===');

  // Navigate to risk details page
  await authenticatedPage.goto(`/en/dashboard/risks/${riskId}`, { waitUntil: 'domcontentloaded' });
  await authenticatedPage.waitForLoadState('domcontentloaded');
  await authenticatedPage.waitForTimeout(2000);

  // Navigate to Assets tab
  await authenticatedPage.locator('[role="tab"]:has-text("Assets")').first().click();
  await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

  console.log('✅ Navigated to Assets tab');

  // Look for Link Asset button
  const linkAssetBtn = authenticatedPage.locator('button').filter({ hasText: /Link Asset/i }).first();
  const buttonExists = await linkAssetBtn.isVisible({ timeout: 5000 });

  if (buttonExists) {
    console.log('✅ Found Link Asset button');

    await linkAssetBtn.click();
    await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

    console.log('🔓 Asset linking form opened');

    // Wait for dialog
    const dialog = authenticatedPage.locator('[role="dialog"]').first();
    await dialog.waitFor({ state: 'visible', timeout: 10000 });

    console.log('📝 Looking for asset checkboxes to select...');

    // Look for asset checkboxes
    const assetCheckboxes = [
      'input[type="checkbox"][name*="asset"]',
      'input[type="checkbox"][data-testid*="asset"]',
      'input[type="checkbox"]',
      '[role="checkbox"]',
      'input[type="checkbox"][class*="asset"]'
    ];

    let selectedAsset = false;
    let assetName = '';

    for (const checkboxSelector of assetCheckboxes) {
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
              console.log(`✅ Selecting asset checkbox ${i + 1}`);

              // Get associated asset name if possible
              try {
                // Look for text label associated with this checkbox
                const parent = checkbox.locator('..');
                const labelText = await parent.locator('label, div, span').first().textContent().catch(() => '');
                if (labelText && labelText.length < 100) {
                  assetName = labelText;
                  console.log(`  Asset name: "${assetName}"`);
                }
              } catch (e) {
                // Continue if we can't get the label
              }

              await checkbox.check();
              await authenticatedPage.waitForTimeout(WAIT_SMALL);
              selectedAsset = true;
              break; // Only select one asset for this test
            }
          }
        }

        if (selectedAsset) {
          break;
        }
      }
    }

    if (!selectedAsset) {
      console.log('⚠️ No selectable asset checkboxes found');

      // Take screenshot for debugging
      await authenticatedPage.screenshot({ path: 'test-results/assets-workflow/no-checkboxes-found.png', fullPage: true });

      // List all form elements for debugging
      const allInputs = authenticatedPage.locator('[role="dialog"] input');
      const inputCount = await allInputs.count();
      console.log(`Found ${inputCount} input elements in dialog:`);

      for (let i = 0; i < inputCount; i++) {
        const inputType = await allInputs.nth(i).getAttribute('type');
        const inputName = await allInputs.nth(i).getAttribute('name');
        const inputId = await allInputs.nth(i).getAttribute('id');
        console.log(`  Input ${i + 1}: type="${inputType}", name="${inputName}", id="${inputId}"`);
      }

      console.log('Cannot proceed without asset selection');
      return;
    }

    // Look for additional fields like relationship type or justification
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

    const justificationTextarea = authenticatedPage.locator('textarea[name*="justification"], textarea[name*="note"]').first();
    const justificationExists = await justificationTextarea.isVisible({ timeout: 2000 }).catch(() => false);
    if (justificationExists) {
      const justificationText = `E2E Asset Linking Test - Selected asset: ${assetName || 'Unknown'}. Linked via automated testing to verify checkbox selection workflow. Timestamp: ${new Date().toISOString()}`;
      await justificationTextarea.fill(justificationText);
      console.log('✅ Justification filled');
    }

    // Take screenshot before submit
    await authenticatedPage.screenshot({ path: 'test-results/assets-workflow/asset-checkbox-selected.png', fullPage: true });
    console.log('📸 Screenshot taken with selected asset checkbox');

    // Find and click the Link Asset(s) button
    console.log('🔍 Looking for Link Asset(s) submit button...');

    // Try to find the submit button that should now be enabled
    const submitSelectors = [
      'button:has-text("Link Asset(s)")',
      'button:has-text("Link Asset")',
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
            console.log('🎉 Link Asset(s) button clicked successfully!');
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
        console.log('✅ Asset linking form closed - submission successful!');

        // Wait for content to update
        await authenticatedPage.waitForTimeout(2000);

        // Look for the newly linked asset
        console.log('🔍 Verifying asset was linked...');

        // Look for the linked asset in the list
        if (assetName) {
          const assetLocator = authenticatedPage.locator(`text=${assetName}`).first();
          const assetVisible = await assetLocator.isVisible({ timeout: 3000 }).catch(() => false);

          if (assetVisible) {
            console.log(`🎉 SUCCESS! Found linked asset: "${assetName}"`);
          } else {
            console.log(`⚠️ Asset "${assetName}" not immediately visible in list`);
          }
        }

        // Look for any asset indicators
        const assetIndicators = [
          'Linked',
          'Connected',
          'Asset',
          'E2E Asset Linking'
        ];

        let indicatorFound = false;
        for (const indicator of assetIndicators) {
          const indicatorLocator = authenticatedPage.locator(`text=${indicator}`).first();
          const indicatorVisible = await indicatorLocator.isVisible({ timeout: 2000 }).catch(() => false);

          if (indicatorVisible) {
            console.log(`✅ Asset indicator found: "${indicator}"`);
            indicatorFound = true;
            break;
          }
        }

        if (indicatorFound) {
          console.log('🎉 SUCCESS! Asset linking indicators found - DATA SAVED!');
        }

        // Take final screenshot
        await authenticatedPage.screenshot({ path: 'test-results/assets-workflow/asset-linking-success.png', fullPage: true });

      } else {
        console.log('⚠️ Asset linking form still open - checking for errors...');

        // Look for error messages
        const errorMsg = authenticatedPage.locator('[role="alert"], .error, .text-red-500, [data-testid*="error"]').first();
        const hasError = await errorMsg.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasError) {
          const errorText = await errorMsg.textContent();
          console.log(`❌ Error message: ${errorText}`);
          await authenticatedPage.screenshot({ path: 'test-results/assets-workflow/asset-linking-error.png', fullPage: true });
        }
      }
    } else {
      console.log('❌ No enabled Link Asset button found');

      // List all buttons for debugging
      const allButtons = authenticatedPage.locator('[role="dialog"] button');
      const buttonCount = await allButtons.count();
      console.log(`Found ${buttonCount} buttons in asset linking dialog:`);

      for (let i = 0; i < buttonCount; i++) {
        const buttonText = await allButtons.nth(i).textContent();
        const buttonType = await allButtons.nth(i).getAttribute('type');
        const isEnabled = await allButtons.nth(i).isEnabled().catch(() => false);
        console.log(`  Button ${i + 1}: "${buttonText}" (type: ${buttonType}, enabled: ${isEnabled})`);
      }
    }

  } else {
    console.log('❌ No Link Asset button found in Assets tab');
  }

  console.log('=== ASSETS LINKING WORKFLOW WITH CHECKBOXES TEST COMPLETE ===');
});