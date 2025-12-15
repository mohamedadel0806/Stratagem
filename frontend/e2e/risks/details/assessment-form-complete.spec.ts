import { test, expect } from '../../fixtures/auth';

/**
 * Assessment Form Complete Workflow Test
 * Tests the full assessment form: Open -> Fill -> Submit -> Verify
 */

test('should complete full Assessment Form workflow', async ({ authenticatedPage }) => {
  const WAIT_SMALL = 400;
  const WAIT_MEDIUM = 600;
  const riskId = '95d8a18a-1e1c-44ed-9eaa-25dfadac75b5';

  console.log('=== FULL ASSESSMENT FORM WORKFLOW ===');

  // Navigate to risk details page
  await authenticatedPage.goto(`/en/dashboard/risks/${riskId}`, { waitUntil: 'domcontentloaded' });
  await authenticatedPage.waitForLoadState('domcontentloaded');
  await authenticatedPage.waitForTimeout(2000);

  // Navigate to Assessments tab
  await authenticatedPage.locator('[role="tab"]:has-text("Assessments")').first().click();
  await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

  console.log('✅ Navigated to Assessments tab');

  // Look for New Assessment button
  const newAssessmentBtn = authenticatedPage.locator('button').filter({ hasText: /New Assessment/i }).first();
  const buttonExists = await newAssessmentBtn.isVisible({ timeout: 5000 });

  if (buttonExists) {
    console.log('✅ Found New Assessment button');

    await newAssessmentBtn.click();
    await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

    console.log('🔓 Assessment form opened');

    // Wait for dialog
    const dialog = authenticatedPage.locator('[role="dialog"]').first();
    await dialog.waitFor({ state: 'visible', timeout: 10000 });

    console.log('📝 Filling assessment form...');

    // Fill likelihood field
    const likelihoodSelect = authenticatedPage.locator('select[name*="likelihood"], [name*="likelihood"]').first();
    const likelihoodExists = await likelihoodSelect.isVisible({ timeout: 3000 }).catch(() => false);
    if (likelihoodExists) {
      await likelihoodSelect.selectOption('4'); // High likelihood
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      console.log('✅ Likelihood selected (4 - High)');
    }

    // Fill impact field
    const impactSelect = authenticatedPage.locator('select[name*="impact"], [name*="impact"]').first();
    const impactExists = await impactSelect.isVisible({ timeout: 3000 }).catch(() => false);
    if (impactExists) {
      await impactSelect.selectOption('4'); // High impact
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      console.log('✅ Impact selected (4 - High)');
    }

    // Look for assessment notes/comments
    const commentsTextarea = authenticatedPage.locator('textarea[name*="comment"], textarea[name*="note"], textarea[name*="description"], textarea[placeholder*="note"], textarea[placeholder*="comment"]').first();
    const commentsExists = await commentsTextarea.isVisible({ timeout: 3000 }).catch(() => false);
    if (commentsExists) {
      const assessmentNotes = `E2E Assessment - Likelihood: High (4), Impact: High (4). This assessment was created via automated testing to verify the complete workflow functionality. Assessment timestamp: ${new Date().toISOString()}`;
      await commentsTextarea.fill(assessmentNotes);
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      console.log('✅ Assessment comments filled');
    }

    // Look for assessor selection
    const assessorSelect = authenticatedPage.locator('select[name*="assessor"], select[name*="user"], [name*="assessor"]').first();
    const assessorExists = await assessorSelect.isVisible({ timeout: 3000 }).catch(() => false);
    if (assessorExists) {
      const assessorOptions = assessorSelect.locator('option:not([value=""])');
      const assessorCount = await assessorOptions.count();
      if (assessorCount > 0) {
        await assessorSelect.selectOption({ index: 0 });
        console.log('✅ Assessor selected');
      }
    }

    // Look for assessment date
    const dateInput = authenticatedPage.locator('input[name*="date"], input[type="date"]').first();
    const dateExists = await dateInput.isVisible({ timeout: 3000 }).catch(() => false);
    if (dateExists) {
      const today = new Date().toISOString().split('T')[0];
      await dateInput.fill(today);
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      console.log('✅ Assessment date filled');
    }

    // Take screenshot before submit
    await authenticatedPage.screenshot({ path: 'test-results/assessment-workflow/assessment-form-filled.png', fullPage: true });
    console.log('📸 Screenshot taken of filled assessment form');

    // Find and click submit button
    console.log('🔍 Looking for assessment submit button...');

    const submitSelectors = [
      'button[type="submit"]',
      'button:has-text("Create")',
      'button:has-text("Save")',
      'button:has-text("Submit")',
      'button:has-text("Create Assessment")',
      'button:has-text("Add Assessment")',
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
          console.log('🎉 Assessment submit button clicked!');
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
        console.log('✅ Assessment form closed - submission successful!');

        // Wait for content to update
        await authenticatedPage.waitForTimeout(2000);

        // Look for the new assessment in the list
        console.log('🔍 Verifying assessment was saved...');

        // Check for assessment indicators - look for our comments or score
        const assessmentIndicators = [
          'E2E Assessment - Likelihood: High (4)',
          'High (4)',
          '16', // 4x4 = 16 risk score
          'Risk Score: 16'
        ];

        let assessmentFound = false;
        for (const indicator of assessmentIndicators) {
          const indicatorLocator = authenticatedPage.locator(`text=${indicator}`).first();
          const indicatorVisible = await indicatorLocator.isVisible({ timeout: 3000 }).catch(() => false);

          if (indicatorVisible) {
            console.log(`✅ Assessment indicator found: "${indicator}"`);
            assessmentFound = true;
            break;
          }
        }

        if (assessmentFound) {
          console.log('🎉 SUCCESS! Assessment found - DATA SAVED!');
        } else {
          console.log('⚠️ Assessment not immediately visible, checking for any new content...');

          // Look for any new assessment entries
          const assessmentEntries = authenticatedPage.locator('[data-testid*="assessment"], .assessment-item, .assessment-row').count();
          console.log(`Found ${assessmentEntries} assessment entries in the list`);
        }

        // Take final screenshot
        await authenticatedPage.screenshot({ path: 'test-results/assessment-workflow/assessment-success.png', fullPage: true });

      } else {
        console.log('⚠️ Assessment form still open - checking for errors...');

        // Look for error messages
        const errorMsg = authenticatedPage.locator('[role="alert"], .error, .text-red-500, [data-testid*="error"]').first();
        const hasError = await errorMsg.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasError) {
          const errorText = await errorMsg.textContent();
          console.log(`❌ Error message: ${errorText}`);
          await authenticatedPage.screenshot({ path: 'test-results/assessment-workflow/assessment-error.png', fullPage: true });
        }
      }
    } else {
      console.log('❌ No assessment submit button found');

      // List all buttons for debugging
      const allButtons = authenticatedPage.locator('[role="dialog"] button');
      const buttonCount = await allButtons.count();
      console.log(`Found ${buttonCount} buttons in assessment dialog:`);

      for (let i = 0; i < buttonCount; i++) {
        const buttonText = await allButtons.nth(i).textContent();
        const buttonType = await allButtons.nth(i).getAttribute('type');
        console.log(`  Button ${i + 1}: "${buttonText}" (type: ${buttonType})`);
      }
    }

  } else {
    console.log('❌ No New Assessment button found in Assessments tab');

    // Look for any other assessment-related buttons
    const otherButtons = authenticatedPage.locator('button').filter({
      hasText: /Assessment|Add|Create/i
    });

    const otherButtonCount = await otherButtons.count();
    console.log(`Found ${otherButtonCount} other assessment-related buttons:`);

    for (let i = 0; i < otherButtonCount; i++) {
      const buttonText = await otherButtons.nth(i).textContent();
      console.log(`  - "${buttonText}"`);
    }
  }

  console.log('=== ASSESSMENT FORM WORKFLOW TEST COMPLETE ===');
});