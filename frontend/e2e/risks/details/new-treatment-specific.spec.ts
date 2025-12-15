import { test, expect } from '../../fixtures/auth';

/**
 * Specific New Treatment Test
 * Test the New Treatment button specifically for risk ID 8546665c-d856-4641-b97f-7e20f1dcbfac
 */

test('test new treatment form specifically', async ({ authenticatedPage }) => {
  console.log('=== NEW TREATMENT FORM SPECIFIC TEST ===');

  const riskId = '8546665c-d856-4641-b97f-7e20f1dcbfac';

  await authenticatedPage.goto(`/en/dashboard/risks/${riskId}`, { waitUntil: 'domcontentloaded' });
  await authenticatedPage.waitForTimeout(2000);

  await authenticatedPage.locator('[role="tab"]:has-text("Treatments")').first().click();
  await authenticatedPage.waitForTimeout(1000);

  console.log('✅ Navigated to Treatments tab');

  // Take screenshot of current state
  await authenticatedPage.screenshot({ path: 'test-results/new-treatment/treatments-tab-current.png', fullPage: true });

  // Look specifically for New Treatment button
  const newTreatmentBtn = authenticatedPage.locator('button').filter({ hasText: /New Treatment/i }).first();
  const btnVisible = await newTreatmentBtn.isVisible({ timeout: 5000 });

  if (btnVisible) {
    console.log('✅ New Treatment button found');

    // Get button details
    const buttonText = await newTreatmentBtn.textContent();
    const isEnabled = await newTreatmentBtn.isEnabled();
    const buttonClasses = await newTreatmentBtn.getAttribute('class');

    console.log(`  Button text: "${buttonText}"`);
    console.log(`  Button enabled: ${isEnabled}`);
    console.log(`  Button classes: ${buttonClasses}`);

    // Take screenshot before clicking
    await authenticatedPage.screenshot({ path: 'test-results/new-treatment/before-click.png', fullPage: true });

    console.log('🖱️ Clicking New Treatment button...');

    try {
      await newTreatmentBtn.click();
      console.log('✅ Button clicked successfully');

      // Wait for potential form to open
      await authenticatedPage.waitForTimeout(3000);

      // Check if form opened
      const dialogVisible = await authenticatedPage.locator('[role="dialog"], .modal, form').isVisible({ timeout: 5000 }).catch(() => false);
      console.log(`   Form dialog opened: ${dialogVisible}`);

      // Check for any overlay/backdrop
      const backdropVisible = await authenticatedPage.locator('[data-state="open"], .backdrop, [role="dialog"]::backdrop').isVisible({ timeout: 2000 }).catch(() => false);
      console.log(`   Backdrop visible: ${backdropVisible}`);

      // Check if there's an error message
      const errorMsg = authenticatedPage.locator('[role="alert"], .error, .text-red-500').first();
      const hasError = await errorMsg.isVisible({ timeout: 2000 }).catch(() => false);

      if (hasError) {
        const errorText = await errorMsg.textContent();
        console.log(`   Error message: "${errorText}"`);
      }

      // Take screenshot after clicking
      await authenticatedPage.screenshot({ path: 'test-results/new-treatment/after-click.png', fullPage: true });

      // Look for any form elements that might be present
      const formElements = [
        'input[type="text"]',
        'textarea',
        'select',
        'input[type="date"]',
        'input[type="number"]'
      ];

      console.log('🔍 Looking for form elements...');
      for (const elementSelector of formElements) {
        const elements = authenticatedPage.locator(elementSelector);
        const elementCount = await elements.count();
        if (elementCount > 0) {
          console.log(`   Found ${elementCount} ${elementSelector} elements`);
        }
      }

      // Check network activity
      console.log('🌐 Checking network requests...');

    } catch (clickError) {
      console.log(`❌ Error clicking button: ${clickError.message}`);
    }

  } else {
    console.log('❌ New Treatment button not found');

    // Look for Create First Treatment button
    const createFirstBtn = authenticatedPage.locator('button').filter({ hasText: /Create First Treatment/i }).first();
    const createFirstVisible = await createFirstBtn.isVisible({ timeout: 2000 }).catch(() => false);

    if (createFirstVisible) {
      console.log('✅ Found "Create First Treatment" button instead');
    }
  }

  // Look for error elements on the page
  const errorElements = authenticatedPage.locator('[role="alert"], .error, .text-red-500').count();
  const errorCount = await errorElements;
  console.log(`\n🚨 Found ${errorCount} error elements on the page`);

  // Check page URL
  const currentUrl = authenticatedPage.url();
  console.log(`📍 Current URL: ${currentUrl}`);

  // Take final screenshot
  await authenticatedPage.screenshot({ path: 'test-results/new-treatment/final-state.png', fullPage: true });

  console.log('\n=== NEW TREATMENT TEST COMPLETE ===');
});