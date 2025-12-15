import { test, expect } from '../fixtures/auth';
import { waitForDialog } from '../utils/helpers';

/**
 * Test to debug form filling issues
 */
test('should fill application name field', async ({ authenticatedPage }) => {
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

  console.log('Form opened. Looking for Application Name field...');
  
  // Try to find the application name field - try different selectors
  const selectors = [
    'label:has-text("Application Name")',
    'label:has-text("Application Name") + input',
    'input[placeholder*="application" i]',
    '[role="tabpanel"] input:first-of-type',
  ];

  let foundField = false;
  for (const selector of selectors) {
    try {
      const field = authenticatedPage.locator(selector).first();
      const isVisible = await field.isVisible({ timeout: 2000 }).catch(() => false);
      console.log(`Selector "${selector}": ${isVisible ? 'FOUND' : 'not found'}`);
      
      if (isVisible) {
        foundField = true;
        console.log('Attempting to fill field...');
        await field.fill('Test Application Name');
        console.log('✅ Field filled successfully');
        await authenticatedPage.screenshot({ path: 'test-results/field-filled.png', fullPage: true });
        break;
      }
    } catch (e) {
      console.log(`Selector "${selector}": error - ${e.message}`);
    }
  }

  if (!foundField) {
    // List all inputs and labels in the form
    console.log('❌ Could not find field with any selector');
    const allLabels = await authenticatedPage.locator('label').allTextContents();
    console.log('Available labels:', allLabels);
    
    await authenticatedPage.screenshot({ path: 'test-results/form-structure.png', fullPage: true });
    throw new Error('Could not find Application Name field');
  }
});
