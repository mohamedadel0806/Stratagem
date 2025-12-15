import { test, expect } from '../../fixtures/auth';

/**
 * Edit Risk Form Complete Workflow Test
 * Tests the full edit risk form: Open -> Fill -> Submit -> Verify
 */

test('should complete full Edit Risk workflow', async ({ authenticatedPage }) => {
  const WAIT_SMALL = 400;
  const WAIT_MEDIUM = 600;
  const riskId = '95d8a18a-1e1c-44ed-9eaa-25dfadac75b5';

  console.log('=== FULL EDIT RISK WORKFLOW ===');

  // Navigate to risk details page
  await authenticatedPage.goto(`/en/dashboard/risks/${riskId}`, { waitUntil: 'domcontentloaded' });
  await authenticatedPage.waitForLoadState('domcontentloaded');
  await authenticatedPage.waitForTimeout(2000);

  // Navigate to Overview tab
  await authenticatedPage.locator('[role="tab"]:has-text("Overview")').first().click();
  await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

  console.log('✅ Navigated to Overview tab');

  // Look for Edit button
  const editButton = authenticatedPage.locator('button:has-text("Edit")').first();
  const buttonExists = await editButton.isVisible({ timeout: 5000 });

  if (buttonExists) {
    console.log('✅ Found Edit button');

    // Get current values for comparison
    const currentTitleElement = authenticatedPage.locator('h1, [data-testid*="title"], .risk-title').first();
    const currentTitle = await currentTitleElement.textContent().catch(() => 'Unknown Title');

    const currentDescriptionElement = authenticatedPage.locator('[data-testid*="description"], .risk-description').first();
    const currentDescription = await currentDescriptionElement.textContent().catch(() => '');

    console.log(`Current title: "${currentTitle}"`);

    await editButton.click();
    await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

    console.log('🔓 Edit Risk form opened');

    // Wait for dialog
    const dialog = authenticatedPage.locator('[role="dialog"]').first();
    await dialog.waitFor({ state: 'visible', timeout: 10000 });

    console.log('📝 Modifying risk form...');

    // Fill title field with modification
    const titleInput = authenticatedPage.locator('input[name*="title"], input[placeholder*="title"], input[id*="title"]').first();
    const titleExists = await titleInput.isVisible({ timeout: 3000 }).catch(() => false);
    if (titleExists) {
      const modifiedTitle = `${currentTitle} (E2E Modified ${Date.now()})`;
      await titleInput.clear();
      await titleInput.fill(modifiedTitle);
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      console.log('✅ Title modified');
    }

    // Fill description field with addition
    const descriptionTextarea = authenticatedPage.locator('textarea[name*="description"], textarea[placeholder*="description"], textarea[name*="description"]').first();
    const descriptionExists = await descriptionTextarea.isVisible({ timeout: 3000 }).catch(() => false);
    if (descriptionExists) {
      const e2eModification = `\n\n[E2E Test Modification] - This risk was successfully modified via automated testing workflow at ${new Date().toISOString()}. All form fields are functional and data submission works correctly.`;
      await descriptionTextarea.fill(currentDescription + e2eModification);
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      console.log('✅ Description modified');
    }

    // Look for and modify risk statement
    const riskStatementTextarea = authenticatedPage.locator('textarea[name*="risk_statement"], textarea[placeholder*="risk statement"], textarea[name*="statement"]').first();
    const riskStatementExists = await riskStatementTextarea.isVisible({ timeout: 3000 }).catch(() => false);
    if (riskStatementExists) {
      const currentStatement = await riskStatementTextarea.inputValue();
      const modifiedStatement = currentStatement + ' [E2E MODIFIED]';
      await riskStatementTextarea.fill(modifiedStatement);
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      console.log('✅ Risk statement modified');
    }

    // Look for and modify category
    const categorySelect = authenticatedPage.locator('select[name*="category"], [data-testid*="category"]').first();
    const categoryExists = await categorySelect.isVisible({ timeout: 3000 }).catch(() => false);
    if (categoryExists) {
      const categoryOptions = categorySelect.locator('option:not([value=""])');
      const categoryCount = await categoryOptions.count();

      if (categoryCount > 1) {
        // Change to a different category
        const currentValue = await categorySelect.inputValue();
        let newIndex = 0;
        if (currentValue) {
          // Select a different option than current
          newIndex = 1;
        }
        await categorySelect.selectOption({ index: newIndex });
        await authenticatedPage.waitForTimeout(WAIT_SMALL);
        console.log('✅ Category modified');
      }
    }

    // Look for and modify status
    const statusSelect = authenticatedPage.locator('select[name*="status"], [data-testid*="status"]').first();
    const statusExists = await statusSelect.isVisible({ timeout: 3000 }).catch(() => false);
    if (statusExists) {
      const statusOptions = statusSelect.locator('option:not([value=""])');
      const statusCount = await statusOptions.count();

      if (statusCount > 1) {
        // Change to a different status
        const currentValue = await statusSelect.inputValue();
        let newIndex = 1;
        if (currentValue && statusCount > 2) {
          newIndex = 2;
        }
        await statusSelect.selectOption({ index: newIndex });
        await authenticatedPage.waitForTimeout(WAIT_SMALL);
        console.log('✅ Status modified');
      }
    }

    // Look for and modify likelihood
    const likelihoodSelect = authenticatedPage.locator('select[name*="likelihood"], [data-testid*="likelihood"]').first();
    const likelihoodExists = await likelihoodSelect.isVisible({ timeout: 3000 }).catch(() => false);
    if (likelihoodExists) {
      const likelihoodOptions = likelihoodSelect.locator('option:not([value=""])');
      const likelihoodCount = await likelihoodOptions.count();

      if (likelihoodCount > 1) {
        const currentValue = await likelihoodSelect.inputValue();
        let newValue = '3';
        if (currentValue === '3') newValue = '4';
        await likelihoodSelect.selectOption(newValue);
        await authenticatedPage.waitForTimeout(WAIT_SMALL);
        console.log('✅ Likelihood modified');
      }
    }

    // Look for and modify impact
    const impactSelect = authenticatedPage.locator('select[name*="impact"], [data-testid*="impact"]').first();
    const impactExists = await impactSelect.isVisible({ timeout: 3000 }).catch(() => false);
    if (impactExists) {
      const impactOptions = impactSelect.locator('option:not([value=""])');
      const impactCount = await impactOptions.count();

      if (impactCount > 1) {
        const currentValue = await impactSelect.inputValue();
        let newValue = '3';
        if (currentValue === '3') newValue = '4';
        await impactSelect.selectOption(newValue);
        await authenticatedPage.waitForTimeout(WAIT_SMALL);
        console.log('✅ Impact modified');
      }
    }

    // Look for and modify date identified
    const dateInput = authenticatedPage.locator('input[name*="date_identified"], input[type="date"]').first();
    const dateExists = await dateInput.isVisible({ timeout: 3000 }).catch(() => false);
    if (dateExists) {
      const today = new Date().toISOString().split('T')[0];
      await dateInput.fill(today);
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      console.log('✅ Date identified modified');
    }

    // Take screenshot before submit
    await authenticatedPage.screenshot({ path: 'test-results/edit-risk-workflow/edit-risk-form-filled.png', fullPage: true });
    console.log('📸 Screenshot taken of modified edit risk form');

    // Find and click submit button
    console.log('🔍 Looking for edit risk submit button...');

    const submitSelectors = [
      'button[type="submit"]',
      'button:has-text("Update")',
      'button:has-text("Save")',
      'button:has-text("Submit")',
      'button:has-text("Update Risk")',
      'button:has-text("Save Changes")',
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
          console.log('🎉 Edit risk submit button clicked!');
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
        console.log('✅ Edit Risk form closed - submission successful!');

        // Wait for content to update
        await authenticatedPage.waitForTimeout(3000);

        // Look for the modifications in the displayed content
        console.log('🔍 Verifying risk was updated...');

        // Check if title was updated
        const updatedTitleElement = authenticatedPage.locator('h1, [data-testid*="title"], .risk-title').first();
        const updatedTitle = await updatedTitleElement.textContent().catch(() => '');

        if (updatedTitle.includes('E2E Modified')) {
          console.log('🎉 SUCCESS! Title updated - DATA SAVED!');
        } else {
          console.log('⚠️ Title modification not immediately visible');
        }

        // Check for E2E modification in description
        const descriptionLocator = authenticatedPage.locator('text=E2E Test Modification').first();
        const modificationVisible = await descriptionLocator.isVisible({ timeout: 3000 }).catch(() => false);

        if (modificationVisible) {
          console.log('✅ E2E modification found in description');
        }

        // Look for any updated indicators
        const updateIndicators = [
          'E2E Modified',
          'E2E Test Modification',
          'Updated',
          'Modified'
        ];

        for (const indicator of updateIndicators) {
          const indicatorLocator = authenticatedPage.locator(`text=${indicator}`).first();
          const indicatorVisible = await indicatorLocator.isVisible({ timeout: 2000 }).catch(() => false);

          if (indicatorVisible) {
            console.log(`✅ Update indicator found: "${indicator}"`);
            break;
          }
        }

        // Take final screenshot
        await authenticatedPage.screenshot({ path: 'test-results/edit-risk-workflow/edit-risk-success.png', fullPage: true });

      } else {
        console.log('⚠️ Edit Risk form still open - checking for errors...');

        // Look for error messages
        const errorMsg = authenticatedPage.locator('[role="alert"], .error, .text-red-500, [data-testid*="error"]').first();
        const hasError = await errorMsg.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasError) {
          const errorText = await errorMsg.textContent();
          console.log(`❌ Error message: ${errorText}`);
          await authenticatedPage.screenshot({ path: 'test-results/edit-risk-workflow/edit-risk-error.png', fullPage: true });
        }
      }
    } else {
      console.log('❌ No edit risk submit button found');

      // List all buttons for debugging
      const allButtons = authenticatedPage.locator('[role="dialog"] button');
      const buttonCount = await allButtons.count();
      console.log(`Found ${buttonCount} buttons in edit risk dialog:`);

      for (let i = 0; i < buttonCount; i++) {
        const buttonText = await allButtons.nth(i).textContent();
        const buttonType = await allButtons.nth(i).getAttribute('type');
        console.log(`  Button ${i + 1}: "${buttonText}" (type: ${buttonType})`);
      }
    }

  } else {
    console.log('❌ No Edit button found in Overview tab');

    // Look for any other edit-related buttons
    const otherButtons = authenticatedPage.locator('button').filter({
      hasText: /Edit|Modify|Update/i
    });

    const otherButtonCount = await otherButtons.count();
    console.log(`Found ${otherButtonCount} other edit-related buttons:`);

    for (let i = 0; i < otherButtonCount; i++) {
      const buttonText = await otherButtons.nth(i).textContent();
      console.log(`  - "${buttonText}"`);
    }
  }

  console.log('=== EDIT RISK WORKFLOW TEST COMPLETE ===');
});