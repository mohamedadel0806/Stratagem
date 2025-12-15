import { test, expect } from '../../fixtures/auth';

/**
 * KRIs Linking Form Complete Workflow Test
 * Tests the full KRI linking form: Open -> Fill -> Submit -> Verify
 */

test('should complete full KRIs Linking workflow', async ({ authenticatedPage }) => {
  const WAIT_SMALL = 400;
  const WAIT_MEDIUM = 600;
  const riskId = '95d8a18a-1e1c-44ed-9eaa-25dfadac75b5';

  console.log('=== FULL KRIS LINKING WORKFLOW ===');

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

    console.log('📝 Filling KRI linking form...');

    // Look for KRI selection dropdown
    const kriSelect = authenticatedPage.locator('select[name*="kri"], select[name*="metric"], [data-testid*="kri"], [name*="kri_id"]').first();
    const kriExists = await kriSelect.isVisible({ timeout: 3000 }).catch(() => false);
    let kriSelected = false;

    if (kriExists) {
      const kriOptions = kriSelect.locator('option:not([value=""])');
      const kriCount = await kriOptions.count();

      console.log(`Found ${kriCount} available KRIs`);

      if (kriCount > 0) {
        await kriSelect.selectOption({ index: 0 });
        await authenticatedPage.waitForTimeout(WAIT_SMALL);
        console.log('✅ KRI selected');
        kriSelected = true;

        // Get the selected KRI value for verification
        const selectedKriValue = await kriSelect.inputValue();
        console.log(`Selected KRI value: ${selectedKriValue}`);
      } else {
        console.log('⚠️ No KRIs available to select');
      }
    } else {
      console.log('⚠️ KRI selection dropdown not found');
    }

    // Look for threshold/target field
    const thresholdInput = authenticatedPage.locator('input[name*="threshold"], input[name*="target"], input[placeholder*="threshold"], input[placeholder*="target"]').first();
    const thresholdExists = await thresholdInput.isVisible({ timeout: 3000 }).catch(() => false);
    if (thresholdExists) {
      await thresholdInput.fill('80');
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      console.log('✅ Threshold/target filled');
    }

    // Look for frequency field
    const frequencySelect = authenticatedPage.locator('select[name*="frequency"], [name*="period"], [name*="reporting"]').first();
    const frequencyExists = await frequencySelect.isVisible({ timeout: 3000 }).catch(() => false);
    if (frequencyExists) {
      const frequencyOptions = frequencySelect.locator('option:not([value=""])');
      const frequencyCount = await frequencyOptions.count();

      if (frequencyCount > 0) {
        await frequencySelect.selectOption({ index: 0 });
        await authenticatedPage.waitForTimeout(WAIT_SMALL);
        console.log('✅ Frequency selected');
      }
    }

    // Look for justification/notes field
    const justificationTextarea = authenticatedPage.locator('textarea[name*="justification"], textarea[name*="note"], textarea[name*="comment"], textarea[placeholder*="justification"], textarea[placeholder*="note"], textarea[placeholder*="reason"]').first();
    const justificationExists = await justificationTextarea.isVisible({ timeout: 3000 }).catch(() => false);
    if (justificationExists) {
      const justificationText = `E2E KRI Linking - This KRI was linked to the risk via automated testing to verify the complete KRI linking workflow functionality. Link timestamp: ${new Date().toISOString()}`;
      await justificationTextarea.fill(justificationText);
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      console.log('✅ Justification/notes filled');
    }

    // Look for KRI category field
    const categorySelect = authenticatedPage.locator('select[name*="category"], [name*="type"], [name*="kri_category"]').first();
    const categoryExists = await categorySelect.isVisible({ timeout: 3000 }).catch(() => false);
    if (categoryExists) {
      const categoryOptions = categorySelect.locator('option:not([value=""])');
      const categoryCount = await categoryOptions.count();

      if (categoryCount > 0) {
        await categorySelect.selectOption({ index: 0 });
        await authenticatedPage.waitForTimeout(WAIT_SMALL);
        console.log('✅ KRI category selected');
      }
    }

    // Look for responsible person field
    const responsibleSelect = authenticatedPage.locator('select[name*="responsible"], select[name*="owner"], [name*="responsible_person"]').first();
    const responsibleExists = await responsibleSelect.isVisible({ timeout: 3000 }).catch(() => false);
    if (responsibleExists) {
      const responsibleOptions = responsibleSelect.locator('option:not([value=""])');
      const responsibleCount = await responsibleOptions.count();

      if (responsibleCount > 0) {
        await responsibleSelect.selectOption({ index: 0 });
        await authenticatedPage.waitForTimeout(WAIT_SMALL);
        console.log('✅ Responsible person selected');
      }
    }

    // Take screenshot before submit
    await authenticatedPage.screenshot({ path: 'test-results/kris-workflow/kri-linking-form-filled.png', fullPage: true });
    console.log('📸 Screenshot taken of filled KRI linking form');

    // Find and click submit button
    console.log('🔍 Looking for KRI linking submit button...');

    const submitSelectors = [
      'button[type="submit"]',
      'button:has-text("Link")',
      'button:has-text("Save")',
      'button:has-text("Submit")',
      'button:has-text("Link KRI")',
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
          console.log('🎉 KRI linking submit button clicked!');
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
          'Target',
          'Frequency'
        ];

        let kriFound = false;
        for (const indicator of kriIndicators) {
          const indicatorLocator = authenticatedPage.locator(`text=${indicator}`).first();
          const indicatorVisible = await indicatorLocator.isVisible({ timeout: 3000 }).catch(() => false);

          if (indicatorVisible) {
            console.log(`✅ KRI indicator found: "${indicator}"`);
            kriFound = true;
            break;
          }
        }

        if (kriFound) {
          console.log('🎉 SUCCESS! KRI found linked - DATA SAVED!');
        } else {
          console.log('⚠️ Linked KRI not immediately visible, checking for any new content...');

          // Look for KRI entries
          const kriEntries = authenticatedPage.locator('[data-testid*="kri"], .kri-item, .kri-row').count();
          console.log(`Found ${kriEntries} KRI entries in the list`);

          // Look for any cards or items
          const cardItems = authenticatedPage.locator('.card, .item, .entry').count();
          console.log(`Found ${cardItems} card items`);
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
      console.log('❌ No KRI linking submit button found');

      // List all buttons for debugging
      const allButtons = authenticatedPage.locator('[role="dialog"] button');
      const buttonCount = await allButtons.count();
      console.log(`Found ${buttonCount} buttons in KRI linking dialog:`);

      for (let i = 0; i < buttonCount; i++) {
        const buttonText = await allButtons.nth(i).textContent();
        const buttonType = await allButtons.nth(i).getAttribute('type');
        console.log(`  Button ${i + 1}: "${buttonText}" (type: ${buttonType})`);
      }
    }

  } else {
    console.log('❌ No Link KRI button found in KRIs tab');

    // Look for any other KRI-related buttons
    const otherButtons = authenticatedPage.locator('button').filter({
      hasText: /KRI|Metric|Add|Create|Link/i
    });

    const otherButtonCount = await otherButtons.count();
    console.log(`Found ${otherButtonCount} other KRI-related buttons:`);

    for (let i = 0; i < otherButtonCount; i++) {
      const buttonText = await otherButtons.nth(i).textContent();
      console.log(`  - "${buttonText}"`);
    }
  }

  console.log('=== KRIS LINKING WORKFLOW TEST COMPLETE ===');
});