import { test, expect } from '../../fixtures/auth';

/**
 * Risk ID Comparison Test
 * Compare behavior between different risk IDs
 */

test.describe('Risk ID Comparison', () => {
  test('compare treatment forms between different risk IDs', async ({ authenticatedPage }) => {
    console.log('=== COMPARING TREATMENT FORMS BETWEEN DIFFERENT RISK IDS ===');

    const riskIds = [
      '95d8a18a-1e1c-44ed-9eaa-25dfadac75b5', // Working risk ID
      '8546665c-d856-4641-b97f-7e20f1dcbfac'  // New risk ID
    ];

    for (let i = 0; i < riskIds.length; i++) {
      const riskId = riskIds[i];
      console.log(`\n--- Testing Risk ID ${i + 1}: ${riskId} ---`);

      await authenticatedPage.goto(`/en/dashboard/risks/${riskId}`, { waitUntil: 'domcontentloaded' });
      await authenticatedPage.waitForTimeout(2000);

      await authenticatedPage.locator('[role="tab"]:has-text("Treatments")').first().click();
      await authenticatedPage.waitForTimeout(1000);

      // Take screenshot of treatments tab
      await authenticatedPage.screenshot({ path: `test-results/risk-comparison/risk-${i + 1}-treatments-tab.png`, fullPage: true });

      // Look for New Treatment button
      const newTreatmentBtn = authenticatedPage.locator('button').filter({ hasText: /New Treatment/i }).first();
      const btnVisible = await newTreatmentBtn.isVisible({ timeout: 5000 });

      if (btnVisible) {
        console.log(`✅ New Treatment button found for Risk ID ${riskId.substring(0, 8)}...`);

        await newTreatmentBtn.click();
        await authenticatedPage.waitForTimeout(2000);

        // Check if treatment form opened
        const dialogVisible = await authenticatedPage.locator('[role="dialog"], form').isVisible({ timeout: 5000 }).catch(() => false);

        if (dialogVisible) {
          console.log(`✅ Treatment form opened for Risk ID ${riskId.substring(0, 8)}...`);

          // Take screenshot of the form
          await authenticatedPage.screenshot({ path: `test-results/risk-comparison/risk-${i + 1}-treatment-form.png`, fullPage: true });

          // Look for submit button
          const submitBtn = authenticatedPage.locator('button[type="submit"], button:has-text("Create Treatment")').first();
          const submitVisible = await submitBtn.isVisible({ timeout: 3000 }).catch(() => false);

          if (submitVisible) {
            const buttonText = await submitBtn.textContent();
            const isEnabled = await submitBtn.isEnabled();
            console.log(`✅ Submit button found: "${buttonText}" - Enabled: ${isEnabled}`);

            if (isEnabled) {
              // Try to click submit button
              try {
                await submitBtn.click();
                console.log('🖱️ Submit button clicked');

                // Wait for form closure
                let formClosed = false;
                for (let j = 0; j < 5; j++) {
                  const stillOpen = await authenticatedPage.locator('[role="dialog"]').isVisible({ timeout: 2000 }).catch(() => false);
                  if (!stillOpen) {
                    formClosed = true;
                    break;
                  }
                  await authenticatedPage.waitForTimeout(1000);
                }

                if (formClosed) {
                  console.log(`✅ Form closed successfully for Risk ID ${riskId.substring(0, 8)}...`);

                  // Wait for list to update
                  await authenticatedPage.waitForTimeout(2000);

                  const uniqueTitle = `E2E Test Treatment ${Date.now()}`;
                  const treatmentFound = await authenticatedPage.locator(`text=${uniqueTitle}`).isVisible({ timeout: 5000 }).catch(() => false);

                  if (treatmentFound) {
                    console.log(`🎉 SUCCESS! Treatment found in list for Risk ID ${riskId.substring(0, 8)}...`);
                  } else {
                    console.log(`⚠️ Treatment not found in list for Risk ID ${riskId.substring(0, 8)}...`);
                  }

                } else {
                  console.log(`⚠️ Form still open after clicking submit for Risk ID ${riskId.substring(0, 8)}...`);

                  // Check for error messages
                  const errorMsg = authenticatedPage.locator('[role="alert"], .error, .text-red-500').first();
                  const hasError = await errorMsg.isVisible({ timeout: 2000 }).catch(() => false);

                  if (hasError) {
                    const errorText = await errorMsg.textContent();
                    console.log(`❌ Error message: "${errorText}"`);
                  }

                  // Take screenshot of the form with potential error
                  await authenticatedPage.screenshot({ path: `test-results/risk-comparison/risk-${i + 1}-form-still-open.png`, fullPage: true });
                }

              } catch (clickError) {
                console.log(`❌ Error clicking submit button: ${clickError.message}`);
              }
            } else {
              console.log(`❌ Submit button is disabled for Risk ID ${riskId.substring(0, 8)}...`);
            }
          } else {
            console.log(`❌ No submit button found for Risk ID ${riskId.substring(0, 8)}...`);
          }

          // Close the form if still open
          const stillOpen = await authenticatedPage.locator('[role="dialog"]').isVisible({ timeout: 1000 }).catch(() => false);
          if (stillOpen) {
            await authenticatedPage.keyboard.press('Escape');
            await authenticatedPage.waitForTimeout(1000);
          }

        } else {
          console.log(`❌ Treatment form did not open for Risk ID ${riskId.substring(0, 8)}...`);
        }
      } else {
        console.log(`❌ New Treatment button not found for Risk ID ${riskId.substring(0, 8)}...`);

        // Look for other buttons
        const allButtons = authenticatedPage.locator('button').filter({
          hasText: /Treatment/i
        });

        const buttonCount = await allButtons.count();
        console.log(`Found ${buttonCount} treatment-related buttons:`);

        for (let j = 0; j < buttonCount; j++) {
          const buttonText = await allButtons.nth(j).textContent();
          if (buttonText) {
            console.log(`  - "${buttonText}"`);
          }
        }
      }
    }

    console.log('\n=== RISK ID COMPARISON COMPLETE ===');
  });
});