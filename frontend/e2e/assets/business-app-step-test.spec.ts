import { test, expect } from '../fixtures/auth';
import { waitForDialog } from '../utils/helpers';

/**
 * Simplified test to fill form step by step
 */
test('should fill form fields one by one', async ({ authenticatedPage }) => {
  // Navigate to applications page
  await authenticatedPage.goto('/en/dashboard/assets/applications');
  await authenticatedPage.waitForLoadState('networkidle');
  await authenticatedPage.waitForTimeout(2000);

  // Click "New Application" button
  const newAssetButton = authenticatedPage.locator('button:has-text("New Application")').first();
  await newAssetButton.waitFor({ state: 'visible', timeout: 10000 });
  await newAssetButton.click({ timeout: 5000 });
  
  // Wait for form dialog to open
  await waitForDialog(authenticatedPage);
  await authenticatedPage.waitForTimeout(2000);

  console.log('✅ Step 1: Form opened');

  // Step 1: Fill application name
  const appName = `Test App ${Date.now()}`;
  const applicationNameInput = authenticatedPage.locator('label:has-text("Application Name")').locator('~ input').first();
  await applicationNameInput.waitFor({ state: 'visible', timeout: 5000 });
  await applicationNameInput.fill(appName);
  console.log('✅ Step 2: Application name filled');
  await authenticatedPage.screenshot({ path: 'test-results/step2-app-name.png', fullPage: true });

  // Step 2: Fill description
  const descriptionTextarea = authenticatedPage.locator('label:has-text("Description")').locator('~ textarea').first();
  await descriptionTextarea.fill('Test description');
  console.log('✅ Step 3: Description filled');
  await authenticatedPage.screenshot({ path: 'test-results/step3-description.png', fullPage: true });

  // Step 3: Select application type
  const applicationTypeButton = authenticatedPage.locator('label:has-text("Application Type")').locator('~ button[role="combobox"]').first();
  await applicationTypeButton.waitFor({ state: 'visible', timeout: 5000 });
  await applicationTypeButton.click();
  await authenticatedPage.waitForTimeout(500);
  const webAppOption = authenticatedPage.locator('[role="option"]:has-text("Web Application")').first();
  await webAppOption.waitFor({ state: 'visible', timeout: 5000 });
  await webAppOption.click();
  console.log('✅ Step 4: Application type selected');
  await authenticatedPage.screenshot({ path: 'test-results/step4-app-type.png', fullPage: true });

  // Step 4: Select status
  const statusButton = authenticatedPage.locator('label:has-text("Status")').locator('~ button[role="combobox"]').first();
  await statusButton.click();
  await authenticatedPage.waitForTimeout(500);
  const activeOption = authenticatedPage.locator('[role="option"]:has-text("Active")').first();
  await activeOption.click();
  console.log('✅ Step 5: Status selected');
  await authenticatedPage.screenshot({ path: 'test-results/step5-status.png', fullPage: true });

  // Step 5: Try to click submit
  const submitButton = authenticatedPage.locator('button[type="submit"]:has-text("Create"), button[type="submit"]:has-text("Save")').first();
  await submitButton.waitFor({ state: 'visible', timeout: 5000 });
  console.log('✅ Step 6: Submit button found');
  await authenticatedPage.screenshot({ path: 'test-results/step6-before-submit.png', fullPage: true });

  console.log('✅ All steps completed successfully!');
});
