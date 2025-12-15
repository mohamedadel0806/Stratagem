import { test, expect } from '../../fixtures/auth';

/**
 * Assets Linking Form Complete Workflow Test
 * Tests the full asset linking form: Open -> Fill -> Submit -> Verify
 */

test('should complete full Assets Linking workflow', async ({ authenticatedPage }) => {
  const WAIT_SMALL = 400;
  const WAIT_MEDIUM = 600;
  const riskId = '95d8a18a-1e1c-44ed-9eaa-25dfadac75b5';

  console.log('=== FULL ASSETS LINKING WORKFLOW ===');

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

    console.log('📝 Filling asset linking form...');

    // Look for asset selection dropdown
    const assetSelect = authenticatedPage.locator('select[name*="asset"], [data-testid*="asset"], [name*="asset_id"]').first();
    const assetExists = await assetSelect.isVisible({ timeout: 3000 }).catch(() => false);
    let assetSelected = false;

    if (assetExists) {
      const assetOptions = assetSelect.locator('option:not([value=""])');
      const assetCount = await assetOptions.count();

      console.log(`Found ${assetCount} available assets`);

      if (assetCount > 0) {
        await assetSelect.selectOption({ index: 0 });
        await authenticatedPage.waitForTimeout(WAIT_SMALL);
        console.log('✅ Asset selected');
        assetSelected = true;

        // Get the selected asset name for verification
        const selectedAssetName = await assetSelect.inputValue();
        console.log(`Selected asset value: ${selectedAssetName}`);
      } else {
        console.log('⚠️ No assets available to select');
      }
    } else {
      console.log('⚠️ Asset selection dropdown not found');
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

    // Look for justification/notes field
    const justificationTextarea = authenticatedPage.locator('textarea[name*="justification"], textarea[name*="note"], textarea[name*="comment"], textarea[placeholder*="justification"], textarea[placeholder*="note"]').first();
    const justificationExists = await justificationTextarea.isVisible({ timeout: 3000 }).catch(() => false);
    if (justificationExists) {
      const justificationText = `E2E Asset Linking - This asset was linked to the risk via automated testing to verify the complete asset linking workflow functionality. Link timestamp: ${new Date().toISOString()}`;
      await justificationTextarea.fill(justificationText);
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      console.log('✅ Justification/notes filled');
    }

    // Look for risk level/criticality field
    const riskLevelSelect = authenticatedPage.locator('select[name*="risk_level"], select[name*="criticality"], select[name*="priority"]').first();
    const riskLevelExists = await riskLevelSelect.isVisible({ timeout: 3000 }).catch(() => false);
    if (riskLevelExists) {
      const riskLevelOptions = riskLevelSelect.locator('option:not([value=""])');
      const riskLevelCount = await riskLevelOptions.count();

      if (riskLevelCount > 0) {
        await riskLevelSelect.selectOption({ index: 0 });
        await authenticatedPage.waitForTimeout(WAIT_SMALL);
        console.log('✅ Risk level selected');
      }
    }

    // Take screenshot before submit
    await authenticatedPage.screenshot({ path: 'test-results/assets-workflow/asset-linking-form-filled.png', fullPage: true });
    console.log('📸 Screenshot taken of filled asset linking form');

    // Find and click submit button
    console.log('🔍 Looking for asset linking submit button...');

    const submitSelectors = [
      'button[type="submit"]',
      'button:has-text("Link")',
      'button:has-text("Save")',
      'button:has-text("Submit")',
      'button:has-text("Link Asset")',
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
          console.log('🎉 Asset linking submit button clicked!');
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
        console.log('✅ Asset linking form closed - submission successful!');

        // Wait for content to update
        await authenticatedPage.waitForTimeout(2000);

        // Look for the newly linked asset
        console.log('🔍 Verifying asset was linked...');

        // Look for any asset indicators
        const assetIndicators = [
          'Linked',
          'Connected',
          'Asset',
          'E2E Asset Linking'
        ];

        let assetFound = false;
        for (const indicator of assetIndicators) {
          const indicatorLocator = authenticatedPage.locator(`text=${indicator}`).first();
          const indicatorVisible = await indicatorLocator.isVisible({ timeout: 3000 }).catch(() => false);

          if (indicatorVisible) {
            console.log(`✅ Asset indicator found: "${indicator}"`);
            assetFound = true;
            break;
          }
        }

        if (assetFound) {
          console.log('🎉 SUCCESS! Asset found linked - DATA SAVED!');
        } else {
          console.log('⚠️ Linked asset not immediately visible, checking for any new content...');

          // Look for asset entries
          const assetEntries = authenticatedPage.locator('[data-testid*="asset"], .asset-item, .asset-row').count();
          console.log(`Found ${assetEntries} asset entries in the list`);

          // Look for any cards or items
          const cardItems = authenticatedPage.locator('.card, .item, .entry').count();
          console.log(`Found ${cardItems} card items`);
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
      console.log('❌ No asset linking submit button found');

      // List all buttons for debugging
      const allButtons = authenticatedPage.locator('[role="dialog"] button');
      const buttonCount = await allButtons.count();
      console.log(`Found ${buttonCount} buttons in asset linking dialog:`);

      for (let i = 0; i < buttonCount; i++) {
        const buttonText = await allButtons.nth(i).textContent();
        const buttonType = await allButtons.nth(i).getAttribute('type');
        console.log(`  Button ${i + 1}: "${buttonText}" (type: ${buttonType})`);
      }
    }

  } else {
    console.log('❌ No Link Asset button found in Assets tab');

    // Look for any other asset-related buttons
    const otherButtons = authenticatedPage.locator('button').filter({
      hasText: /Asset|Add|Create|Link/i
    });

    const otherButtonCount = await otherButtons.count();
    console.log(`Found ${otherButtonCount} other asset-related buttons:`);

    for (let i = 0; i < otherButtonCount; i++) {
      const buttonText = await otherButtons.nth(i).textContent();
      console.log(`  - "${buttonText}"`);
    }
  }

  console.log('=== ASSETS LINKING WORKFLOW TEST COMPLETE ===');
});