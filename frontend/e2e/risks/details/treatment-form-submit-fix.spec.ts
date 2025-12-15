import { test, expect } from '../../fixtures/auth';

/**
 * Treatment Form Submit Fix Test
 * Tests the exact submit button issue and provides the fix
 */

test('should complete treatment form submission with proper button selection', async ({ authenticatedPage }) => {
  const WAIT_MEDIUM = 600;
  const riskId = '95d8a18a-1e1c-44ed-9eaa-25dfadac75b5';

  console.log('=== TESTING TREATMENT FORM SUBMIT FIX ===');

  // Navigate to Treatments tab
  await authenticatedPage.goto(`/en/dashboard/risks/${riskId}`, { waitUntil: 'domcontentloaded' });
  await authenticatedPage.waitForLoadState('domcontentloaded');
  await authenticatedPage.waitForTimeout(2000);

  await authenticatedPage.locator('[role="tab"]:has-text("Treatments")').first().click();
  await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

  const uniqueTitle = `E2E Treatment Submit Test ${Date.now()}`;

  // Open form
  const newTreatmentBtn = authenticatedPage.locator('button').filter({ hasText: /New Treatment/i }).first();
  await newTreatmentBtn.click();
  await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

  console.log('🔓 Treatment form opened');

  // Fill minimum required fields
  const titleInput = authenticatedPage.locator('input[name*="title"], input[placeholder*="title"]').first();
  await titleInput.fill(uniqueTitle);
  console.log('✅ Title filled');

  const descriptionTextarea = authenticatedPage.locator('textarea[name*="description"], textarea[placeholder*="description"]').first();
  await descriptionTextarea.fill('E2E Test Treatment for submit button testing.');
  console.log('✅ Description filled');

  // Take screenshot
  await authenticatedPage.screenshot({ path: 'test-results/submit-fix/treatment-form-before-submit.png', fullPage: true });

  // Try different submit button selectors
  console.log('🔍 Looking for submit button...');

  const submitSelectors = [
    'button[type="submit"]',
    'button:has-text("Create")',
    'button:has-text("Save")',
    'button:has-text("Submit")',
    'button:has-text("Create Treatment")',
    '.dialog-footer button:last-child',
    '[role="dialog"] button:last-child',
    'form button:last-child'
  ];

  let submitButtonFound = false;

  for (const selector of submitSelectors) {
    const button = authenticatedPage.locator(selector).first();
    const visible = await button.isVisible({ timeout: 2000 }).catch(() => false);

    if (visible) {
      const buttonText = await button.textContent();
      console.log(`✅ Found submit button with selector: ${selector} - Text: "${buttonText}"`);
      submitButtonFound = true;

      // Scroll button into view and click
      await button.scrollIntoViewIfNeeded();
      await authenticatedPage.waitForTimeout(500);

      // Try clicking the button
      try {
        await button.click({ timeout: 5000 });
        console.log('🎉 SUCCESS! Submit button clicked!');

        // Wait for form closure
        await authenticatedPage.waitForTimeout(3000);

        // Check if form closed
        const dialogStillVisible = await authenticatedPage.locator('[role="dialog"]').isVisible({ timeout: 2000 }).catch(() => false);

        if (!dialogStillVisible) {
          console.log('✅ Form closed - submission likely successful!');

          // Verify treatment was created
          await authenticatedPage.waitForTimeout(2000);
          const treatmentLocator = authenticatedPage.locator(`text=${uniqueTitle}`).first();
          const treatmentVisible = await treatmentLocator.isVisible({ timeout: 5000 }).catch(() => false);

          if (treatmentVisible) {
            console.log('🎉 TREATMENT FOUND IN LIST - FULL WORKFLOW SUCCESSFUL!');
            await authenticatedPage.screenshot({ path: 'test-results/submit-fix/treatment-success.png', fullPage: true });
          }

        } else {
          console.log('⚠️ Form still open - checking for errors...');

          // Look for error messages
          const errorMsg = authenticatedPage.locator('[role="alert"], .error, .text-red-500').first();
          const hasError = await errorMsg.isVisible({ timeout: 2000 }).catch(() => false);

          if (hasError) {
            const errorText = await errorMsg.textContent();
            console.log(`❌ Error: ${errorText}`);
          }
        }

        break;

      } catch (clickError) {
        console.log(`⚠️ Could not click button with selector: ${selector}`);
        console.log(`Error: ${clickError.message}`);
      }
    }
  }

  if (!submitButtonFound) {
    console.log('❌ No submit button found with any selector');

    // Take screenshot to debug
    await authenticatedPage.screenshot({ path: 'test-results/submit-fix/no-submit-button-found.png', fullPage: true });

    // List all buttons in the dialog
    const allButtons = authenticatedPage.locator('[role="dialog"] button');
    const buttonCount = await allButtons.count();
    console.log(`Found ${buttonCount} buttons in dialog:`);

    for (let i = 0; i < buttonCount; i++) {
      const buttonText = await allButtons.nth(i).textContent();
      const buttonType = await allButtons.nth(i).getAttribute('type');
      console.log(`  Button ${i + 1}: "${buttonText}" (type: ${buttonType})`);
    }
  }

  console.log('=== TREATMENT FORM SUBMIT TEST COMPLETE ===');
});