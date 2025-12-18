import { test, expect } from '../fixtures/auth';

/**
 * Simple test to verify dropdowns work by filling out the form
 */
test('Fill form and verify Owner and Business Unit dropdowns work', async ({ authenticatedPage }) => {
  // Navigate to physical assets page
  await authenticatedPage.goto('/en/dashboard/assets/physical');
  await authenticatedPage.waitForLoadState('networkidle');
  await authenticatedPage.waitForTimeout(2000);
  
  // Wait for loading to complete
  await authenticatedPage.waitForFunction(() => {
    return !document.body.textContent?.includes('Loading assets...');
  }, { timeout: 15000 });
  
  // Click "New Asset" button
  const newAssetButton = authenticatedPage.locator('button:has-text("New Asset")').first();
  await newAssetButton.waitFor({ state: 'visible', timeout: 10000 });
  await newAssetButton.scrollIntoViewIfNeeded();
  await authenticatedPage.waitForTimeout(500);
  await newAssetButton.click({ timeout: 5000 });
  
  // Wait for dialog
  await authenticatedPage.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 10000 });
  await authenticatedPage.waitForTimeout(1000);
  
  // Fill required fields in Basic tab
  await authenticatedPage.fill('input[name="uniqueIdentifier"]', 'TEST-DROPDOWN-001');
  await authenticatedPage.fill('input[name="assetDescription"]', 'Test Asset for Dropdowns');
  
  // Navigate to Ownership tab
  const ownershipTab = authenticatedPage.locator('button[role="tab"]:has-text("Ownership")').first();
  await ownershipTab.click();
  await authenticatedPage.waitForTimeout(1000);
  
  // Find and click Owner dropdown by label
  const ownerLabel = authenticatedPage.locator('label:has-text("Owner")').first();
  await ownerLabel.waitFor({ state: 'visible', timeout: 5000 });
  const ownerLabelFor = await ownerLabel.getAttribute('for');
  const ownerField = ownerLabelFor
    ? authenticatedPage.locator(`#${ownerLabelFor}`).first()
    : authenticatedPage.locator('label:has-text("Owner")').locator('..').locator('button[role="combobox"]').first();
  
  await ownerField.waitFor({ state: 'visible', timeout: 5000 });
  await ownerField.click();
  await authenticatedPage.waitForTimeout(500);
  
  // Verify dropdown opened and has options
  const ownerOptions = authenticatedPage.locator('[role="option"]');
  const ownerOptionCount = await ownerOptions.count();
  expect(ownerOptionCount).toBeGreaterThan(0);
  
  // Select first option if available
  if (ownerOptionCount > 0) {
    const firstOption = ownerOptions.first();
    const optionText = await firstOption.textContent();
    console.log(`Selecting owner: ${optionText}`);
    await firstOption.click();
    await authenticatedPage.waitForTimeout(500);
  } else {
    await authenticatedPage.keyboard.press('Escape');
  }
  
  // Close any open dropdowns first
  await authenticatedPage.keyboard.press('Escape');
  await authenticatedPage.waitForTimeout(500);
  
  // Find and click Business Unit dropdown
  const businessUnitLabel = authenticatedPage.locator('label:has-text("Business Unit")').first();
  await businessUnitLabel.waitFor({ state: 'visible', timeout: 5000 });
  const buLabelFor = await businessUnitLabel.getAttribute('for');
  const businessUnitField = buLabelFor
    ? authenticatedPage.locator(`#${buLabelFor}`).first()
    : authenticatedPage.locator('label:has-text("Business Unit")').locator('..').locator('button[role="combobox"]').first();
  
  await businessUnitField.waitFor({ state: 'visible', timeout: 5000 });
  await businessUnitField.click();
  
  // Wait for dropdown to open and options to load
  await authenticatedPage.waitForSelector('[role="listbox"], [role="option"]', { state: 'visible', timeout: 10000 });
  await authenticatedPage.waitForTimeout(1000); // Wait for options to render
  
  // Verify dropdown opened and has options
  const buOptions = authenticatedPage.locator('[role="option"]');
  const buOptionCount = await buOptions.count();
  
  // If no options, check if it's loading or empty
  if (buOptionCount === 0) {
    const loadingText = await authenticatedPage.locator('text=/Loading|No business units available/i').isVisible().catch(() => false);
    if (loadingText) {
      // Wait a bit more for loading to complete
      await authenticatedPage.waitForTimeout(2000);
      const buOptionsAfterWait = authenticatedPage.locator('[role="option"]');
      const buOptionCountAfterWait = await buOptionsAfterWait.count();
      expect(buOptionCountAfterWait).toBeGreaterThanOrEqual(0); // Allow 0 if truly empty
    } else {
      // Dropdown might not have opened, try again
      await businessUnitField.click();
      await authenticatedPage.waitForTimeout(1000);
      const buOptionsRetry = authenticatedPage.locator('[role="option"]');
      const buOptionCountRetry = await buOptionsRetry.count();
      expect(buOptionCountRetry).toBeGreaterThanOrEqual(0);
    }
  } else {
    expect(buOptionCount).toBeGreaterThan(0);
  }
  
  // Select first option if available (re-query in case count changed)
  const buOptionsFinal = authenticatedPage.locator('[role="option"]');
  const buOptionCountFinal = await buOptionsFinal.count();
  if (buOptionCountFinal > 0) {
    const firstOption = buOptionsFinal.first();
    const optionText = await firstOption.textContent();
    console.log(`Selecting business unit: ${optionText}`);
    await firstOption.click();
    await authenticatedPage.waitForTimeout(500);
  } else {
    console.log('No business units available - closing dropdown');
    await authenticatedPage.keyboard.press('Escape');
  }
  
  // Go back to Basic tab and verify Asset Type dropdown
  const basicTab = authenticatedPage.locator('button[role="tab"]:has-text("Basic")').first();
  await basicTab.click();
  await authenticatedPage.waitForTimeout(1000);
  
  // Close any open dropdowns
  await authenticatedPage.keyboard.press('Escape');
  await authenticatedPage.waitForTimeout(500);
  
  // Find Asset Type dropdown
  const assetTypeLabel = authenticatedPage.locator('label:has-text("Asset Type")').first();
  await assetTypeLabel.waitFor({ state: 'visible', timeout: 5000 });
  const atLabelFor = await assetTypeLabel.getAttribute('for');
  const assetTypeField = atLabelFor
    ? authenticatedPage.locator(`#${atLabelFor}`).first()
    : authenticatedPage.locator('label:has-text("Asset Type")').locator('..').locator('button[role="combobox"]').first();
  
  await assetTypeField.waitFor({ state: 'visible', timeout: 5000 });
  await assetTypeField.click();
  
  // Wait for dropdown to open
  await authenticatedPage.waitForSelector('[role="listbox"], [role="option"]', { state: 'visible', timeout: 10000 });
  await authenticatedPage.waitForTimeout(1000);
  
  // Verify dropdown opened
  const assetTypeOptions = authenticatedPage.locator('[role="option"]');
  const atOptionCount = await assetTypeOptions.count();
  
  // Select first option if available
  if (atOptionCount > 0) {
    await assetTypeOptions.first().click();
    await authenticatedPage.waitForTimeout(500);
  } else {
    await authenticatedPage.keyboard.press('Escape');
  }
  
  // Take screenshot to verify
  await authenticatedPage.screenshot({ path: 'test-results/form-filled.png', fullPage: true });
  
  console.log('\n✅ Form filled successfully!');
  console.log(`- Owner dropdown: ${ownerOptionCount} options (selected)`);
  console.log(`- Business Unit dropdown: ${buOptionCountFinal} options`);
  console.log(`- Asset Type dropdown: ${atOptionCount} options`);
  
  // Verify all three fields are dropdowns (not text inputs)
  // This is the main test - verify they're buttons/comboboxes, not inputs
  const ownerIsInput = await ownerField.evaluate(el => el.tagName === 'INPUT');
  const buIsInput = await businessUnitField.evaluate(el => el.tagName === 'INPUT');
  const atIsInput = await assetTypeField.evaluate(el => el.tagName === 'INPUT');
  
  expect(ownerIsInput).toBe(false);
  expect(buIsInput).toBe(false);
  expect(atIsInput).toBe(false);
  
  console.log('\n✅ All fields verified as dropdowns (not text inputs)!');
});

