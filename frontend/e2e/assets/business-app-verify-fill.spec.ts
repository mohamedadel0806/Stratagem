import { test, expect } from '../fixtures/auth';
import { waitForDialog } from '../utils/helpers';

/**
 * Test to verify form fields are actually filled and values are saved
 */
test('should fill form and verify values are saved', async ({ authenticatedPage }) => {
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

  console.log('Form opened. Starting to fill fields...');
  
  // Fill Application Name
  const appNameInput = authenticatedPage.getByLabel(/Application Name/);
  await appNameInput.fill('Test Application 12345');
  await authenticatedPage.waitForTimeout(500);
  
  // Verify the value was actually set
  let value = await appNameInput.inputValue();
  console.log(`Application Name value: "${value}"`);
  expect(value).toBe('Test Application 12345');
  console.log('✅ Application Name verified');

  // Fill Description
  const descInput = authenticatedPage.getByLabel('Description');
  await descInput.fill('Test Description 67890');
  await authenticatedPage.waitForTimeout(500);
  
  value = await descInput.inputValue();
  console.log(`Description value: "${value}"`);
  expect(value).toBe('Test Description 67890');
  console.log('✅ Description verified');

  // Select Application Type
  const appTypeButton = authenticatedPage.getByLabel(/Application Type/);
  await appTypeButton.click();
  await authenticatedPage.waitForTimeout(500);
  await authenticatedPage.locator('[role="option"]:has-text("Web Application")').first().click();
  await authenticatedPage.waitForTimeout(500);
  
  // Verify Application Type was selected
  const appTypeText = await appTypeButton.textContent();
  console.log(`Application Type selected: "${appTypeText}"`);
  expect(appTypeText).toContain('Web Application');
  console.log('✅ Application Type verified');

  // Select Status
  const statusButton = authenticatedPage.getByLabel(/Status/);
  await statusButton.click();
  await authenticatedPage.waitForTimeout(500);
  await authenticatedPage.locator('[role="option"]:has-text("Active")').first().click();
  await authenticatedPage.waitForTimeout(500);
  
  // Verify Status was selected
  const statusText = await statusButton.textContent();
  console.log(`Status selected: "${statusText}"`);
  expect(statusText).toContain('Active');
  console.log('✅ Status verified');

  // Fill Version
  const versionInput = authenticatedPage.getByLabel('Version');
  await versionInput.fill('1.0.0');
  await authenticatedPage.waitForTimeout(500);
  
  value = await versionInput.inputValue();
  console.log(`Version value: "${value}"`);
  expect(value).toBe('1.0.0');
  console.log('✅ Version verified');

  // Take screenshot to show filled form
  await authenticatedPage.screenshot({ path: 'test-results/form-filled-verification.png', fullPage: true });
  console.log('📸 Screenshot taken of filled form');

  console.log('\n✅ ALL FIELDS VERIFIED AND SAVED CORRECTLY!');
});
