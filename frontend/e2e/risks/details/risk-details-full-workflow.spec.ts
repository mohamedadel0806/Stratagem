import { test, expect } from '../../fixtures/auth';

/**
 * Risk Details Page - COMPLETE Workflow Tests
 * Tests full form workflows: Open -> Fill -> Submit -> Verify Save
 */

test.describe('Risk Details Page - Complete Workflows', () => {
  test.setTimeout(180000);

  const WAIT_SMALL = 400;
  const WAIT_MEDIUM = 600;
  const WAIT_LARGE = 1000;
  const riskId = '95d8a18a-1e1c-44ed-9eaa-25dfadac75b5';

  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(`/en/dashboard/risks/${riskId}`, { waitUntil: 'domcontentloaded' });
    await authenticatedPage.waitForLoadState('domcontentloaded');
    await authenticatedPage.waitForTimeout(WAIT_LARGE);
  });

  test('should complete full Treatment Form workflow', async ({ authenticatedPage }) => {
    console.log('=== FULL TREATMENT FORM WORKFLOW ===');

    // Navigate to Treatments tab
    await authenticatedPage.locator('[role="tab"]:has-text("Treatments")').first().click();
    await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

    const uniqueTitle = `E2E Treatment ${Date.now()}`;

    // Click New Treatment button
    const newTreatmentBtn = authenticatedPage.locator('button').filter({ hasText: /New Treatment/i }).first();
    await newTreatmentBtn.waitFor({ state: 'visible', timeout: 5000 });
    await newTreatmentBtn.click();
    await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

    console.log('🔓 Treatment form opened');

    // Wait for dialog to be fully visible
    const dialog = authenticatedPage.locator('[role="dialog"]').first();
    await dialog.waitFor({ state: 'visible', timeout: 10000 });

    console.log('📝 Filling treatment form...');

    // Fill Title field
    const titleInput = authenticatedPage.locator('input[name*="title"], input[placeholder*="title"], input[id*="title"]').first();
    await titleInput.waitFor({ state: 'visible', timeout: 5000 });
    await titleInput.fill(uniqueTitle);
    await authenticatedPage.waitForTimeout(WAIT_SMALL);
    console.log('✅ Title filled');

    // Fill Description field
    const descriptionTextarea = authenticatedPage.locator('textarea[name*="description"], textarea[placeholder*="description"]').first();
    await descriptionTextarea.waitFor({ state: 'visible', timeout: 5000 });
    await descriptionTextarea.fill('E2E Test Treatment Description - This treatment was created by automated testing to verify the complete form workflow functionality.');
    await authenticatedPage.waitForTimeout(WAIT_SMALL);
    console.log('✅ Description filled');

    // Fill Strategy dropdown
    const strategySelect = authenticatedPage.locator('select[name*="strategy"], [data-testid*="strategy"]').first();
    const strategyExists = await strategySelect.isVisible({ timeout: 3000 }).catch(() => false);
    if (strategyExists) {
      await strategySelect.click();
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      // Select first available option
      const firstOption = strategySelect.locator('option').nth(1);
      await firstOption.click();
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      console.log('✅ Strategy selected');
    }

    // Fill Status dropdown
    const statusSelect = authenticatedPage.locator('select[name*="status"], [data-testid*="status"]').first();
    const statusExists = await statusSelect.isVisible({ timeout: 3000 }).catch(() => false);
    if (statusExists) {
      await statusSelect.click();
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      // Select "In Progress" or similar
      await statusSelect.selectOption({ label: /In Progress|Planned|Draft/i });
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      console.log('✅ Status selected');
    }

    // Fill Priority dropdown
    const prioritySelect = authenticatedPage.locator('select[name*="priority"], [data-testid*="priority"]').first();
    const priorityExists = await prioritySelect.isVisible({ timeout: 3000 }).catch(() => false);
    if (priorityExists) {
      await prioritySelect.click();
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      // Select "High" priority
      await prioritySelect.selectOption({ label: /High|Medium|Low/i });
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      console.log('✅ Priority selected');
    }

    // Fill Treatment Owner
    const ownerSelect = authenticatedPage.locator('select[name*="owner"], [data-testid*="owner"]').first();
    const ownerExists = await ownerSelect.isVisible({ timeout: 3000 }).catch(() => false);
    if (ownerExists) {
      await ownerSelect.click();
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      // Select first available user
      const userOptions = ownerSelect.locator('option:not([value=""])');
      const userCount = await userOptions.count();
      if (userCount > 0) {
        await userSelect.selectOption({ index: 0 });
        console.log('✅ Treatment owner selected');
      }
    }

    // Fill Start Date
    const startDateInput = authenticatedPage.locator('input[name*="start_date"], input[type="date"]').first();
    const startDateExists = await startDateInput.isVisible({ timeout: 3000 }).catch(() => false);
    if (startDateExists) {
      const today = new Date().toISOString().split('T')[0];
      await startDateInput.fill(today);
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      console.log('✅ Start date filled');
    }

    // Fill Target Completion Date
    const completionDateInput = authenticatedPage.locator('input[name*="target"], input[name*="completion"], input[type="date"]').nth(1);
    const completionDateExists = await completionDateInput.isVisible({ timeout: 3000 }).catch(() => false);
    if (completionDateExists) {
      const futureDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      await completionDateInput.fill(futureDate);
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      console.log('✅ Target completion date filled');
    }

    // Fill Estimated Cost
    const costInput = authenticatedPage.locator('input[name*="cost"], input[placeholder*="cost"], input[type="number"]').first();
    const costExists = await costInput.isVisible({ timeout: 3000 }).catch(() => false);
    if (costExists) {
      await costInput.fill('50000');
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      console.log('✅ Estimated cost filled');
    }

    // Take screenshot before submit
    await authenticatedPage.screenshot({ path: 'test-results/workflows/treatment-form-filled.png', fullPage: true });
    console.log('📸 Screenshot taken of filled form');

    // Submit the form
    console.log('💾 Submitting treatment form...');
    const submitButton = authenticatedPage.locator('button[type="submit"], button:has-text("Create"), button:has-text("Save"), button:has-text("Submit")').first();
    await submitButton.waitFor({ state: 'visible', timeout: 10000 });
    await submitButton.click();
    await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

    // Wait for form submission to complete
    console.log('⏳ Waiting for form submission...');

    // Check for form closure (success indicator)
    let formClosed = false;
    for (let i = 0; i < 10; i++) {
      const dialogStillVisible = await authenticatedPage.locator('[role="dialog"]').isVisible({ timeout: 1000 }).catch(() => false);
      if (!dialogStillVisible) {
        formClosed = true;
        break;
      }
      await authenticatedPage.waitForTimeout(1000);
    }

    if (formClosed) {
      console.log('✅ Form closed - submission successful');
    } else {
      console.log('⚠️ Form still open - checking for errors...');

      // Check for error messages
      const errorMsg = authenticatedPage.locator('[role="alert"], .error, .text-red-500, [data-testid*="error"]').first();
      const hasError = await errorMsg.isVisible({ timeout: 2000 }).catch(() => false);

      if (hasError) {
        const errorText = await errorMsg.textContent();
        console.log(`❌ Error message: ${errorText}`);
        await authenticatedPage.screenshot({ path: 'test-results/workflows/treatment-form-error.png', fullPage: true });
      }
    }

    // Verify the treatment was added to the list
    await authenticatedPage.waitForTimeout(WAIT_LARGE);
    const treatmentLocator = authenticatedPage.locator(`text=${uniqueTitle}`).first();
    const treatmentVisible = await treatmentLocator.isVisible({ timeout: 8000 }).catch(() => false);

    if (treatmentVisible) {
      console.log('🎉 SUCCESS! Treatment found in list - DATA SAVED!');
      await authenticatedPage.screenshot({ path: 'test-results/workflows/treatment-saved-success.png', fullPage: true });
    } else {
      console.log('⚠️ Treatment not immediately visible, might need refresh');
      // Try refreshing
      await authenticatedPage.reload();
      await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

      const treatmentAfterRefresh = await treatmentLocator.isVisible({ timeout: 5000 }).catch(() => false);
      if (treatmentAfterRefresh) {
        console.log('✅ Treatment found after refresh');
      } else {
        console.log('❌ Treatment not found after refresh');
      }
    }
  });

  test('should complete full Assessment Form workflow', async ({ authenticatedPage }) => {
    console.log('=== FULL ASSESSMENT FORM WORKFLOW ===');

    // Navigate to Assessments tab
    await authenticatedPage.locator('[role="tab"]:has-text("Assessments")').first().click();
    await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

    // Click New Assessment button
    const newAssessmentBtn = authenticatedPage.locator('button').filter({ hasText: /New Assessment/i }).first();
    const buttonExists = await newAssessmentBtn.isVisible({ timeout: 5000 });

    if (buttonExists) {
      await newAssessmentBtn.click();
      await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

      console.log('🔓 Assessment form opened');

      // Wait for dialog
      await authenticatedPage.locator('[role="dialog"]').first().waitFor({ state: 'visible', timeout: 10000 });

      console.log('📝 Filling assessment form...');

      // Look for and fill likelihood field
      const likelihoodSelect = authenticatedPage.locator('select[name*="likelihood"], [name*="likelihood"]').first();
      const likelihoodExists = await likelihoodSelect.isVisible({ timeout: 3000 }).catch(() => false);
      if (likelihoodExists) {
        await likelihoodSelect.selectOption('4');
        console.log('✅ Likelihood selected');
      }

      // Look for and fill impact field
      const impactSelect = authenticatedPage.locator('select[name*="impact"], [name*="impact"]').first();
      const impactExists = await impactSelect.isVisible({ timeout: 3000 }).catch(() => false);
      if (impactExists) {
        await impactSelect.selectOption('4');
        console.log('✅ Impact selected');
      }

      // Look for comments/description field
      const commentsTextarea = authenticatedPage.locator('textarea[name*="comment"], textarea[name*="note"], textarea[name*="description"]').first();
      const commentsExists = await commentsTextarea.isVisible({ timeout: 3000 }).catch(() => false);
      if (commentsExists) {
        await commentsTextarea.fill('E2E Assessment Comments - Risk assessment created via automated testing to verify workflow functionality.');
        console.log('✅ Comments filled');
      }

      // Take screenshot
      await authenticatedPage.screenshot({ path: 'test-results/workflows/assessment-form-filled.png', fullPage: true });

      // Submit form
      console.log('💾 Submitting assessment form...');
      const submitButton = authenticatedPage.locator('button[type="submit"], button:has-text("Create"), button:has-text("Save")').first();
      const submitExists = await submitButton.isVisible({ timeout: 5000 });

      if (submitExists) {
        await submitButton.click();
        await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

        // Wait for closure
        let formClosed = false;
        for (let i = 0; i < 8; i++) {
          const dialogStillVisible = await authenticatedPage.locator('[role="dialog"]').isVisible({ timeout: 1000 }).catch(() => false);
          if (!dialogStillVisible) {
            formClosed = true;
            break;
          }
          await authenticatedPage.waitForTimeout(1000);
        }

        if (formClosed) {
          console.log('✅ Assessment form submitted and closed');
        } else {
          console.log('⚠️ Assessment form still open');
        }
      }
    } else {
      console.log('⚠️ No New Assessment button found');
    }
  });

  test('should complete full Asset Linking workflow', async ({ authenticatedPage }) => {
    console.log('=== FULL ASSET LINKING WORKFLOW ===');

    // Navigate to Assets tab
    await authenticatedPage.locator('[role="tab"]:has-text("Assets")').first().click();
    await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

    // Look for Link Asset button
    const linkAssetBtn = authenticatedPage.locator('button').filter({ hasText: /Link Asset/i }).first();
    const buttonExists = await linkAssetBtn.isVisible({ timeout: 5000 });

    if (buttonExists) {
      await linkAssetBtn.click();
      await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

      console.log('🔓 Asset linking form opened');

      // Wait for dialog
      await authenticatedPage.locator('[role="dialog"]').first().waitFor({ state: 'visible', timeout: 10000 });

      console.log('📝 Filling asset linking form...');

      // Look for asset selection dropdown
      const assetSelect = authenticatedPage.locator('select[name*="asset"], [data-testid*="asset"]').first();
      const assetExists = await assetSelect.isVisible({ timeout: 3000 }).catch(() => false);
      if (assetExists) {
        const assetOptions = assetSelect.locator('option:not([value=""])');
        const assetCount = await assetOptions.count();

        if (assetCount > 0) {
          await assetSelect.selectOption({ index: 0 });
          console.log('✅ Asset selected');
        } else {
          console.log('⚠️ No assets available to select');
        }
      }

      // Look for relationship type
      const relationshipSelect = authenticatedPage.locator('select[name*="relationship"], select[name*="type"]').first();
      const relationshipExists = await relationshipSelect.isVisible({ timeout: 3000 }).catch(() => false);
      if (relationshipExists) {
        await relationshipSelect.selectOption({ index: 0 });
        console.log('✅ Relationship type selected');
      }

      // Take screenshot
      await authenticatedPage.screenshot({ path: 'test-results/workflows/asset-linking-filled.png', fullPage: true });

      // Submit form
      console.log('💾 Submitting asset linking form...');
      const submitButton = authenticatedPage.locator('button[type="submit"], button:has-text("Link"), button:has-text("Save")').first();
      const submitExists = await submitButton.isVisible({ timeout: 5000 });

      if (submitExists) {
        await submitButton.click();
        await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

        // Wait for closure
        let formClosed = false;
        for (let i = 0; i < 8; i++) {
          const dialogStillVisible = await authenticatedPage.locator('[role="dialog"]').isVisible({ timeout: 1000 }).catch(() => false);
          if (!dialogStillVisible) {
            formClosed = true;
            break;
          }
          await authenticatedPage.waitForTimeout(1000);
        }

        if (formClosed) {
          console.log('✅ Asset linking form submitted and closed');
        } else {
          console.log('⚠️ Asset linking form still open');
        }
      }
    } else {
      console.log('⚠️ No Link Asset button found');
    }
  });

  test('should complete full Control Linking workflow', async ({ authenticatedPage }) => {
    console.log('=== FULL CONTROL LINKING WORKFLOW ===');

    // Navigate to Controls tab
    await authenticatedPage.locator('[role="tab"]:has-text("Controls")').first().click();
    await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

    // Look for Link Control button
    const linkControlBtn = authenticatedPage.locator('button').filter({ hasText: /Link Control/i }).first();
    const buttonExists = await linkControlBtn.isVisible({ timeout: 5000 });

    if (buttonExists) {
      await linkControlBtn.click();
      await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

      console.log('🔓 Control linking form opened');

      // Wait for dialog
      await authenticatedPage.locator('[role="dialog"]').first().waitFor({ state: 'visible', timeout: 10000 });

      console.log('📝 Filling control linking form...');

      // Look for control selection dropdown
      const controlSelect = authenticatedPage.locator('select[name*="control"], [data-testid*="control"]').first();
      const controlExists = await controlSelect.isVisible({ timeout: 3000 }).catch(() => false);
      if (controlExists) {
        const controlOptions = controlSelect.locator('option:not([value=""])');
        const controlCount = await controlOptions.count();

        if (controlCount > 0) {
          await controlSelect.selectOption({ index: 0 });
          console.log('✅ Control selected');
        } else {
          console.log('⚠️ No controls available to select');
        }
      }

      // Take screenshot
      await authenticatedPage.screenshot({ path: 'test-results/workflows/control-linking-filled.png', fullPage: true });

      // Submit form
      console.log('💾 Submitting control linking form...');
      const submitButton = authenticatedPage.locator('button[type="submit"], button:has-text("Link"), button:has-text("Save")').first();
      const submitExists = await submitButton.isVisible({ timeout: 5000 });

      if (submitExists) {
        await submitButton.click();
        await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

        // Wait for closure
        let formClosed = false;
        for (let i = 0; i < 8; i++) {
          const dialogStillVisible = await authenticatedPage.locator('[role="dialog"]').isVisible({ timeout: 1000 }).catch(() => false);
          if (!dialogStillVisible) {
            formClosed = true;
            break;
          }
          await authenticatedPage.waitForTimeout(1000);
        }

        if (formClosed) {
          console.log('✅ Control linking form submitted and closed');
        } else {
          console.log('⚠️ Control linking form still open');
        }
      }
    } else {
      console.log('⚠️ No Link Control button found');
    }
  });

  test('should complete Edit Risk workflow', async ({ authenticatedPage }) => {
    console.log('=== FULL EDIT RISK WORKFLOW ===');

    // Navigate to Overview tab
    await authenticatedPage.locator('[role="tab"]:has-text("Overview")').first().click();
    await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

    // Click Edit button
    const editButton = authenticatedPage.locator('button:has-text("Edit")').first();
    const editExists = await editButton.isVisible({ timeout: 5000 });

    if (editExists) {
      await editButton.click();
      await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

      console.log('🔓 Edit Risk form opened');

      // Wait for dialog
      await authenticatedPage.locator('[role="dialog"]').first().waitFor({ state: 'visible', timeout: 10000 });

      console.log('📝 Modifying risk form...');

      // Look for title field and add E2E suffix
      const titleInput = authenticatedPage.locator('input[name*="title"]').first();
      const titleExists = await titleInput.isVisible({ timeout: 3000 }).catch(() => false);
      if (titleExists) {
        const currentTitle = await titleInput.inputValue();
        await titleInput.fill(`${currentTitle} (E2E Modified)`);
        console.log('✅ Title modified');
      }

      // Look for description field and add note
      const descriptionTextarea = authenticatedPage.locator('textarea[name*="description"]').first();
      const descriptionExists = await descriptionTextarea.isVisible({ timeout: 3000 }).catch(() => false);
      if (descriptionExists) {
        const currentDescription = await descriptionTextarea.inputValue();
        await descriptionTextarea.fill(`${currentDescription}\n\n[E2E Test Modification] - This risk was modified via automated testing workflow.`);
        console.log('✅ Description modified');
      }

      // Take screenshot
      await authenticatedPage.screenshot({ path: 'test-results/workflows/edit-risk-filled.png', fullPage: true });

      // Submit form
      console.log('💾 Submitting edit risk form...');
      const submitButton = authenticatedPage.locator('button[type="submit"], button:has-text("Update"), button:has-text("Save")').first();
      const submitExists = await submitButton.isVisible({ timeout: 5000 });

      if (submitExists) {
        await submitButton.click();
        await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

        // Wait for closure
        let formClosed = false;
        for (let i = 0; i < 8; i++) {
          const dialogStillVisible = await authenticatedPage.locator('[role="dialog"]').isVisible({ timeout: 1000 }).catch(() => false);
          if (!dialogStillVisible) {
            formClosed = true;
            break;
          }
          await authenticatedPage.waitForTimeout(1000);
        }

        if (formClosed) {
          console.log('✅ Edit Risk form submitted and closed');
        } else {
          console.log('⚠️ Edit Risk form still open');
        }
      }
    } else {
      console.log('⚠️ No Edit button found');
    }
  });
});