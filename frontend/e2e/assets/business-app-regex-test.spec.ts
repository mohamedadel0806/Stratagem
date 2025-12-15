import { test, expect } from '../fixtures/auth';
import { waitForDialog } from '../utils/helpers';

/**
 * Test regex label matching
 */
test('should fill with regex labels', async ({ authenticatedPage }) => {
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

  console.log('Form opened. Testing regex labels...');
  
  // Try using regex for labels with asterisks
  const appNameInput = authenticatedPage.getByLabel(/Application Name/);
  await appNameInput.fill('Test App 456');
  console.log('✅ Filled Application Name');
  
  const appTypeButton = authenticatedPage.getByLabel(/Application Type/);
  await appTypeButton.click();
  console.log('✅ Clicked Application Type');

  await authenticatedPage.screenshot({ path: 'test-results/regex-labels-test.png', fullPage: true });
});
