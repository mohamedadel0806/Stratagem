import { test, expect } from '../../fixtures/auth';

/**
 * Form Submission Diagnosis Test
 * Diagnose why forms are not actually submitting data
 */

test.describe('Form Submission Diagnosis', () => {
  const newRiskId = '8546665c-d856-4641-b97f-7e20f1dcbfac';

  test('diagnose Assessment Form submission issue', async ({ authenticatedPage }) => {
    console.log('=== DIAGNOSING ASSESSMENT FORM SUBMISSION ===');

    await authenticatedPage.goto(`/en/dashboard/risks/${newRiskId}`, { waitUntil: 'domcontentloaded' });
    await authenticatedPage.waitForTimeout(2000);

    await authenticatedPage.locator('[role="tab"]:has-text("Assessments")').first().click();
    await authenticatedPage.waitForTimeout(1000);

    const newAssessmentBtn = authenticatedPage.locator('button').filter({ hasText: /New Assessment/i }).first();
    const btnVisible = await newAssessmentBtn.isVisible({ timeout: 5000 });

    if (btnVisible) {
      console.log('✅ New Assessment button found');
      await newAssessmentBtn.click();
      await authenticatedPage.waitForTimeout(2000);

      const dialogVisible = await authenticatedPage.locator('[role="dialog"], form').isVisible({ timeout: 5000 }).catch(() => false);

      if (dialogVisible) {
        console.log('✅ Assessment form opened');
        await authenticatedPage.screenshot({ path: 'test-results/diagnosis/assessment-form-before.png', fullPage: true });

        // Fill the form properly
        console.log('📝 Filling assessment form...');

        // Fill likelihood
        const likelihoodSelect = authenticatedPage.locator('select[name*="likelihood"], [name*="likelihood"]').first();
        const likelihoodExists = await likelihoodSelect.isVisible({ timeout: 3000 }).catch(() => false);
        if (likelihoodExists) {
          await likelihoodSelect.selectOption('4');
          console.log('✅ Likelihood filled (4 - High)');

          // Verify the value was set
          const selectedValue = await likelihoodSelect.inputValue();
          console.log(`   Actual selected value: "${selectedValue}"`);
        }

        // Fill impact
        const impactSelect = authenticatedPage.locator('select[name*="impact"], [name*="impact"]').first();
        const impactExists = await impactSelect.isVisible({ timeout: 3000 }).catch(() => false);
        if (impactExists) {
          await impactSelect.selectOption('4');
          console.log('✅ Impact filled (4 - High)');

          const selectedValue = await impactSelect.inputValue();
          console.log(`   Actual selected value: "${selectedValue}"`);
        }

        // Fill comments
        const commentsTextarea = authenticatedPage.locator('textarea[name*="comment"], textarea[name*="note"], textarea[name*="description"]').first();
        const commentsExists = await commentsTextarea.isVisible({ timeout: 3000 }).catch(() => false);
        if (commentsExists) {
          await commentsTextarea.fill('E2E Diagnostic Assessment - This should save to database');
          console.log('✅ Comments filled');
        }

        await authenticatedPage.screenshot({ path: 'test-results/diagnosis/assessment-form-filled.png', fullPage: true });

        // Check all possible submit buttons
        console.log('🔍 Looking for submit buttons...');

        const submitButtons = [
          'button[type="submit"]',
          'button:has-text("Create")',
          'button:has-text("Save")',
          'button:has-text("Submit")',
          'button:has-text("Create Assessment")'
        ];

        let workingButtonFound = false;

        for (const selector of submitButtons) {
          const button = authenticatedPage.locator(selector).first();
          const visible = await button.isVisible({ timeout: 2000 }).catch(() => false);

          if (visible) {
            const buttonText = await button.textContent();
            const isEnabled = await button.isEnabled();
            const buttonType = await button.getAttribute('type');

            console.log(`✅ Found button: "${buttonText}" - Type: ${buttonType}, Enabled: ${isEnabled}`);

            if (isEnabled) {
              workingButtonFound = true;

              try {
                // Try clicking with different methods
                console.log('🖱️ Attempting to click submit button...');

                // Method 1: Direct click
                await button.click({ timeout: 3000 });
                console.log('✅ Button clicked (method 1)');

                // Wait a moment to see if anything happens
                await authenticatedPage.waitForTimeout(1000);

                // Check if form is still open
                const stillOpen = await authenticatedPage.locator('[role="dialog"]').isVisible({ timeout: 2000 }).catch(() => false);
                console.log(`   Form still open after click: ${stillOpen}`);

                if (stillOpen) {
                  console.log('⚠️ Form still open - trying alternative click methods...');

                  // Method 2: Force click
                  await button.click({ force: true });
                  await authenticatedPage.waitForTimeout(1000);

                  const stillOpen2 = await authenticatedPage.locator('[role="dialog"]').isVisible({ timeout: 2000 }).catch(() => false);
                  console.log(`   Form still open after force click: ${stillOpen2}`);

                  // Method 3: JavaScript click
                  await button.evaluate((el: HTMLButtonElement) => el.click());
                  await authenticatedPage.waitForTimeout(1000);

                  const stillOpen3 = await authenticatedPage.locator('[role="dialog"]').isVisible({ timeout: 2000 }).catch(() => false);
                  console.log(`   Form still open after JS click: ${stillOpen3}`);
                }

                // Check for any error messages
                const errorMsg = authenticatedPage.locator('[role="alert"], .error, .text-red-500').first();
                const hasError = await errorMsg.isVisible({ timeout: 1000 }).catch(() => false);

                if (hasError) {
                  const errorText = await errorMsg.textContent();
                  console.log(`❌ Error message found: "${errorText}"`);
                }

                // Check for any network activity (this might not work in headless mode but let's try)
                console.log('🌐 Checking for form validation issues...');

                // Check if form is valid by looking for required fields that might be empty
                const requiredFields = authenticatedPage.locator('[required], [aria-required="true"]');
                const requiredCount = await requiredFields.count();
                console.log(`   Found ${requiredCount} required fields`);

                // Check for form validation attributes
                const formElement = authenticatedPage.locator('form').first();
                const formExists = await formElement.isVisible({ timeout: 1000 }).catch(() => false);

                if (formExists) {
                  const isValid = await formElement.evaluate((form: HTMLFormElement) => form.checkValidity()).catch(() => null);
                  console.log(`   Form validity: ${isValid}`);
                }

                break;

              } catch (error) {
                console.log(`❌ Error clicking button: ${error.message}`);
              }
            }
          }
        }

        if (!workingButtonFound) {
          console.log('❌ No enabled submit buttons found');

          // List all buttons for debugging
          const allButtons = authenticatedPage.locator('[role="dialog"] button');
          const buttonCount = await allButtons.count();
          console.log(`Found ${buttonCount} total buttons in dialog:`);

          for (let i = 0; i < buttonCount; i++) {
            const buttonText = await allButtons.nth(i).textContent();
            const isEnabled = await allButtons.nth(i).isEnabled();
            const buttonType = await allButtons.nth(i).getAttribute('type');
            console.log(`  Button ${i + 1}: "${buttonText}" - Type: ${buttonType}, Enabled: ${isEnabled}`);
          }
        }

        await authenticatedPage.screenshot({ path: 'test-results/diagnosis/assessment-form-after-attempt.png', fullPage: true });
      } else {
        console.log('❌ Assessment form did not open');
      }
    } else {
      console.log('❌ New Assessment button not found');
    }

    console.log('=== ASSESSMENT DIAGNOSIS COMPLETE ===');
  });
});