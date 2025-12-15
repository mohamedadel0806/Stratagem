import { test, expect } from '../fixtures/auth';
import { waitForDialog } from '../utils/helpers';

/**
 * Test using getByLabel selector
 */
test('should fill form using getByLabel', async ({ authenticatedPage }) => {
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

  console.log('Form opened. Testing getByLabel...');
  
  // Try using getByLabel
  const appNameInput = authenticatedPage.getByLabel('Application Name *');
  await appNameInput.waitFor({ state: 'visible', timeout: 5000 });
  await appNameInput.fill('Test App 123');
  console.log('✅ Filled with getByLabel');
  
  // Verify the value was set
  const value = await appNameInput.inputValue();
  console.log(`Current value: "${value}"`);
  
  if (value === 'Test App 123') {
    console.log('✅ Value correctly set!');
  } else {
    console.log('❌ Value not set correctly');
  }

  await authenticatedPage.screenshot({ path: 'test-results/getbylabel-test.png', fullPage: true });
});
