import { test, expect } from '../fixtures/auth';
import { waitForDialog } from '../utils/helpers';

/**
 * Simple test to verify business application form opens without errors
 */
test('should open business application form without errors', async ({ authenticatedPage }) => {
  // Navigate to applications page
  await authenticatedPage.goto('/en/dashboard/assets/applications');
  await authenticatedPage.waitForLoadState('networkidle');
  await authenticatedPage.waitForTimeout(2000);

  // Capture any console errors
  const errors: string[] = [];
  authenticatedPage.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.error('Console error:', msg.text());
    }
  });

  authenticatedPage.on('pageerror', (error) => {
    errors.push(error.message);
    console.error('Page error:', error.message);
  });

  // Click "New Application" button
  const newAssetButton = authenticatedPage.locator('button:has-text("New Application")').first();
  await newAssetButton.waitFor({ state: 'visible', timeout: 10000 });
  await newAssetButton.click({ timeout: 5000 });
  
  // Wait for form dialog to open
  await waitForDialog(authenticatedPage);
  await authenticatedPage.waitForTimeout(2000);

  // Take screenshot to verify form opened
  await authenticatedPage.screenshot({ path: 'test-results/form-opened.png', fullPage: true });

  // Check if form is visible
  const formDialog = authenticatedPage.locator('[role="dialog"]');
  await expect(formDialog).toBeVisible();

  // Check for any errors
  if (errors.length > 0) {
    console.error('ERRORS DETECTED:', errors);
    throw new Error(`Errors detected: ${errors.join('; ')}`);
  }

  console.log('✅ Form opened successfully without errors');
});
