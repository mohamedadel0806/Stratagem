import { test, expect } from '../fixtures/auth';
import { waitForDialog } from '../utils/helpers';

/**
 * Test to inspect form DOM structure
 */
test('should inspect form DOM structure', async ({ authenticatedPage }) => {
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

  // Get all labels in the form
  const labels = await authenticatedPage.locator('label').all();
  console.log(`Found ${labels.length} labels`);
  
  for (let i = 0; i < Math.min(5, labels.length); i++) {
    const label = labels[i];
    const text = await label.textContent();
    const parent = label.locator('..');
    const parentHTML = await parent.evaluate(el => el.innerHTML).catch(() => 'error');
    console.log(`\n=== Label ${i}: "${text}" ===`);
    console.log('Parent HTML:', parentHTML?.substring(0, 200));
    
    // Try to find input next to this label
    const input = parent.locator('input').first();
    const inputVisible = await input.isVisible({ timeout: 1000 }).catch(() => false);
    console.log('Input found:', inputVisible);
    
    const textarea = parent.locator('textarea').first();
    const textareaVisible = await textarea.isVisible({ timeout: 1000 }).catch(() => false);
    console.log('Textarea found:', textareaVisible);
    
    const button = parent.locator('button[role="combobox"]').first();
    const buttonVisible = await button.isVisible({ timeout: 1000 }).catch(() => false);
    console.log('Select button found:', buttonVisible);
  }

  await authenticatedPage.screenshot({ path: 'test-results/dom-inspect.png', fullPage: true });
});
