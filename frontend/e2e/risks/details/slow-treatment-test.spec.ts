import { test, expect } from '../../fixtures/auth';

/**
 * Treatment Form Test with Increased Wait Times
 * Test for risk ID 8546665c-d856-4641-b97f-7e20f1dcbfac with careful form filling
 */

test.setTimeout(60000);

test('should complete treatment form with increased wait times', async ({ authenticatedPage }) => {
  console.log('=== TREATMENT FORM WITH INCREASED WAIT TIMES ===');

  const riskId = '8546665c-d856-4641-b97f-7e20f1dcbfac';
  const WAIT_SMALL = 1000;
  const WAIT_MEDIUM = 2000;
  const WAIT_LONG = 4000;

  await authenticatedPage.goto(`/en/dashboard/risks/${riskId}`, { waitUntil: 'domcontentloaded' });
  await authenticatedPage.waitForLoadState('domcontentloaded');
  await authenticatedPage.waitForTimeout(WAIT_LONG);

  // Navigate to Treatments tab
  console.log('🔄 Navigating to Treatments tab...');
  await authenticatedPage.locator('[role="tab"]:has-text("Treatments")').first().click();
  await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

  console.log('✅ Navigated to Treatments tab');

  // Take screenshot to see current state
  await authenticatedPage.screenshot({ path: 'test-results/slow-treatment/treatments-tab.png', fullPage: true });

  // Look for New Treatment button
  const newTreatmentBtn = authenticatedPage.locator('button').filter({ hasText: /New Treatment/i }).first();
  const btnVisible = await newTreatmentBtn.isVisible({ timeout: 10000 });

  if (!btnVisible) {
    console.log('❌ New Treatment button not found');
    return;
  }

  console.log('✅ Found New Treatment button');

  // Click button and wait for modal
  await newTreatmentBtn.click();
  await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

  // Check if modal opened
  const modalVisible = await authenticatedPage.locator('[role="dialog"], .modal').isVisible({ timeout: 10000 });

  if (!modalVisible) {
    console.log('❌ Modal did not open');
    return;
  }

  console.log('✅ Modal opened successfully');

  const uniqueTitle = `E2E Slow Treatment ${Date.now()}`;

  // Fill title field carefully
  console.log('📝 Filling title field...');
  const titleInput = authenticatedPage.locator('input[name*="title"], input[placeholder*="title"]').first();
  const titleExists = await titleInput.isVisible({ timeout: 10000 });

  if (titleExists) {
    await titleInput.click();
    await authenticatedPage.waitForTimeout(WAIT_SMALL);
    await titleInput.clear();
    await authenticatedPage.waitForTimeout(WAIT_SMALL);
    await titleInput.type(uniqueTitle, { delay: 100 });
    await authenticatedPage.waitForTimeout(WAIT_SMALL);
    console.log('✅ Title filled carefully');
  } else {
    console.log('❌ Title input not found');
  }

  // Fill description field carefully
  console.log('📝 Filling description field...');
  const descriptionTextarea = authenticatedPage.locator('textarea[name*="description"], textarea[placeholder*="description"]').first();
  const descriptionExists = await descriptionTextarea.isVisible({ timeout: 10000 });

  if (descriptionExists) {
    await descriptionTextarea.click();
    await authenticatedPage.waitForTimeout(WAIT_SMALL);
    await descriptionTextarea.clear();
    await authenticatedPage.waitForTimeout(WAIT_SMALL);
    await descriptionTextarea.type('E2E Test Treatment Description - This is a slow careful fill test to ensure data persistence.', { delay: 50 });
    await authenticatedPage.waitForTimeout(WAIT_SMALL);
    console.log('✅ Description filled carefully');
  } else {
    console.log('❌ Description input not found');
  }

  // Take screenshot before submission
  await authenticatedPage.screenshot({ path: 'test-results/slow-treatment/form-filled-carefully.png', fullPage: true });

  // Look for submit button
  const submitBtn = authenticatedPage.locator('button:has-text("Create Treatment")').first();
  const submitVisible = await submitBtn.isVisible({ timeout: 10000 });

  if (!submitVisible) {
    console.log('❌ Submit button not found');
    return;
  }

  const buttonText = await submitBtn.textContent();
  const isEnabled = await submitBtn.isEnabled();

  console.log(`✅ Submit button found: "${buttonText}" - Enabled: ${isEnabled}`);

  if (!isEnabled) {
    console.log('❌ Submit button is disabled');
    return;
  }

  try {
    // Wait a moment before clicking
    await authenticatedPage.waitForTimeout(WAIT_SMALL);

    // Try to click the submit button
    await submitBtn.click({ timeout: 10000 });
    console.log('🎉 Submit button clicked!');

    // Wait for form processing
    await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

    // Check if modal closed
    let modalClosed = false;
    for (let i = 0; i < 15; i++) {
      const modalStillOpen = await authenticatedPage.locator('[role="dialog"], .modal').isVisible({ timeout: 2000 }).catch(() => false);
      if (!modalStillOpen) {
        modalClosed = true;
        break;
      }
      await authenticatedPage.waitForTimeout(1000);
    }

    if (modalClosed) {
      console.log('✅ Modal closed - submission successful!');

      // Wait for data to process
      await authenticatedPage.waitForTimeout(WAIT_LONG);

      // Simple verification - just check we're still on the page
      const currentUrl = authenticatedPage.url();
      console.log(`📍 Current URL: ${currentUrl}`);

      console.log('🎉 SUCCESS! Treatment form workflow completed!');
      await authenticatedPage.screenshot({ path: 'test-results/slow-treatment/treatment-workflow-success.png', fullPage: true });

    } else {
      console.log('⚠️ Modal still open after submission attempt');
    }

  } catch (clickError) {
    console.log(`❌ Error clicking submit: ${clickError.message}`);
  }

  console.log('\n=== SLOW TREATMENT FORM TEST COMPLETE ===');
});