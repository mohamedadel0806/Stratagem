import { test, expect } from '../../fixtures/auth';

/**
 * Manual Treatment Form Test
 * Manually navigate and see what happens with treatment forms
 */

test('manual treatment form investigation', async ({ authenticatedPage }) => {
  console.log('=== MANUAL TREATMENT FORM INVESTIGATION ===');

  const riskId = '8546665c-d856-4641-b97f-7e20f1dcbfac';

  // Navigate to risk details page
  await authenticatedPage.goto(`/en/dashboard/risks/${riskId}`, { waitUntil: 'domcontentloaded' });
  await authenticatedPage.waitForTimeout(3000);

  // Take screenshot of initial page
  await authenticatedPage.screenshot({ path: 'test-results/manual/treatments-initial.png', fullPage: true });

  // Navigate to Treatments tab
  console.log('🔍 Navigating to Treatments tab...');
  await authenticatedPage.locator('[role="tab"]:has-text("Treatments")').first().click();
  await authenticatedPage.waitForTimeout(2000);

  // Take screenshot of Treatments tab
  await authenticatedPage.screenshot({ path: 'test-results/manual/treatments-tab.png', fullPage: true });

  // Look for all treatment-related buttons
  console.log('🔍 Looking for treatment buttons...');
  const treatmentButtons = authenticatedPage.locator('button').filter({
    hasText: /Treatment/i
  });

  const buttonCount = await treatmentButtons.count();
  console.log(`Found ${buttonCount} treatment-related buttons:`);

  for (let i = 0; i < buttonCount; i++) {
    const buttonText = await treatmentButtons.nth(i).textContent();
    const buttonVisible = await treatmentButtons.nth(i).isVisible();
    const isEnabled = await treatmentButtons.nth(i).isEnabled();

    if (buttonText && buttonVisible) {
      console.log(`  Button ${i + 1}: "${buttonText}" - Enabled: ${isEnabled}`);
    }
  }

  // Try to click the first visible treatment button
  let buttonClicked = false;
  for (let i = 0; i < buttonCount; i++) {
    const buttonText = await treatmentButtons.nth(i).textContent();
    const buttonVisible = await treatmentButtons.nth(i).isVisible();
    const isEnabled = await treatmentButtons.nth(i).isEnabled();

    if (buttonText && buttonVisible && isEnabled) {
      console.log(`\n🖱️ Clicking button: "${buttonText}"`);

      // Take screenshot before clicking
      await authenticatedPage.screenshot({ path: 'test-results/manual/before-treatment-click.png', fullPage: true });

      try {
        await treatmentButtons.nth(i).click();
        buttonClicked = true;
        console.log('✅ Button clicked successfully');

        // Wait for potential form to open
        console.log('⏳ Waiting 3 seconds for form to open...');
        await authenticatedPage.waitForTimeout(3000);

        // Check if any form/dialog opened
        const dialogVisible = await authenticatedPage.locator('[role="dialog"], .modal, form').isVisible({ timeout: 2000 }).catch(() => false);
        console.log(`   Form dialog opened: ${dialogVisible}`);

        if (dialogVisible) {
          console.log('✅ Treatment form opened!');
          await authenticatedPage.screenshot({ path: 'test-results/manual/treatment-form-opened.png', fullPage: true });
        } else {
          console.log('❌ No form opened after clicking button');

          // Take screenshot to see what happened
          await authenticatedPage.screenshot({ path: 'test/results/manual/after-treatment-click-no-form.png', fullPage: true });
        }

        break;

      } catch (error) {
        console.log(`❌ Error clicking button: ${error.message}`);
      }
    }
  }

  if (!buttonClicked) {
    console.log('❌ No clickable treatment buttons found');
  }

  // Look for any error messages
  const errorElements = authenticatedPage.locator('[role="alert"], .error, .text-red-500, [data-testid*="error"]').count();
  const errorCount = await errorElements;
  console.log(`\n🚨 Found ${errorCount} error elements on the page`);

  // Check for any loading indicators
  const loadingElements = authenticatedPage.locator('[data-testid*="loading"], .loading, [aria-busy="true"]').count();
  const loadingCount = await loadingElements;
  console.log(`🔄 Found ${loadingCount} loading elements`);

  // Look for any treatment data in the tab
  const treatmentItems = authenticatedPage.locator('[data-testid*="treatment"], .treatment-item, .treatment-row').count();
  console.log(`📊 Found ${treatmentItems} treatment items in the list`);

  // Check for any "no data" messages
  const noDataText = await authenticatedPage.locator('body').textContent();
  const hasNoDataMessage = noDataText.includes('No treatments') || noDataText.includes('No data') || noDataText.includes('No records');
  console.log(`📝 Contains "no data" message: ${hasNoDataMessage}`);

  // Take final screenshot
  await authenticatedPage.screenshot({ path: 'test-results/manual/treatments-final.png', fullPage: true });

  console.log('\n=== MANUAL INVESTIGATION COMPLETE ===');
});