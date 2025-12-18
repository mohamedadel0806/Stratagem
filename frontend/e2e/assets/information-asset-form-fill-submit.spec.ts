import { test, expect } from '../fixtures/auth';
import { waitForDialog } from '../utils/helpers';

/**
 * E2E Test: Fill complete information asset form and submit
 * This test fills all form fields across all tabs and submits successfully
 */
test('should fill complete information asset form and submit successfully', async ({ authenticatedPage }) => {
  test.setTimeout(90000); // Increase timeout to 90 seconds to account for dropdown loading
  const errors: string[] = [];
  let testFailed = false;
  
  // Helper function to check and throw on errors
  const checkErrors = async (context: string) => {
    if (testFailed || errors.length > 0) {
      await authenticatedPage.screenshot({ path: `test-results/error-${context.replace(/\s+/g, '-')}.png`, fullPage: true });
      const errorMessage = `🚨 ERRORS DETECTED at ${context}: ${errors.join('; ')}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  // Capture console errors
  authenticatedPage.on('console', (msg) => {
    if (msg.type() === 'error') {
      const errorText = msg.text();
      errors.push(`Console Error: ${errorText}`);
      console.error('❌ Browser Console Error:', errorText);
      
      // Stop test if React error detected
      if (errorText.includes('Objects are not valid as a React child') || 
          errorText.includes('React child') ||
          errorText.includes('Cannot read property') ||
          errorText.includes('TypeError') ||
          errorText.includes('Error:')) {
        testFailed = true;
        console.error('🚨 CRITICAL ERROR DETECTED - Test will stop');
      }
    }
  });
  
  // Capture page errors
  authenticatedPage.on('pageerror', (error) => {
    const errorText = error.message;
    errors.push(`Page Error: ${errorText}`);
    console.error('❌ Page Error:', errorText);
    testFailed = true;
  });
  
  // Capture unhandled promise rejections
  authenticatedPage.on('requestfailed', (request) => {
    // Ignore debug logging requests - they may fail if the logging server isn't running
    if (request.url().includes('127.0.0.1:7242/ingest')) {
      return;
    }
    const failure = request.failure();
    const errorText = `Request Failed: ${request.url()} - ${failure?.errorText || 'Unknown error'}`;
    errors.push(errorText);
    console.error('❌ Request Failed:', request.url(), failure?.errorText);
  });
  
  // Navigate directly to information assets page, minimal wait
  await authenticatedPage.goto('/en/dashboard/assets/information', { waitUntil: 'domcontentloaded' });
  // Wait for "New Asset" button to be visible (no extra timeout)
  const newAssetButton = authenticatedPage.locator('button:has-text("New Asset")').first();
  await newAssetButton.waitFor({ state: 'visible', timeout: 10000 });
  
  // Check for React errors specifically
  const reactErrors = await authenticatedPage.evaluate(() => (window as any).__reactErrors || []);
  if (reactErrors.length > 0) {
    reactErrors.forEach((err: any) => {
      const errorMsg = `React Error: ${err.message || err.error || JSON.stringify(err)}`;
      errors.push(errorMsg);
      console.error('🚨 REACT ERROR CAPTURED:', errorMsg);
      testFailed = true;
    });
  }
  
  // Check for all page errors
  const pageErrors = await authenticatedPage.evaluate(() => (window as any).__pageErrors || []);
  if (pageErrors.length > 0) {
    pageErrors.forEach((err: any) => {
      errors.push(`Page Error: ${err.message || err.error}`);
      testFailed = true;
    });
  }
  
  await checkErrors('after navigation');
  
  // Open form
  await newAssetButton.click({ timeout: 5000 });
  await waitForDialog(authenticatedPage);
  await authenticatedPage.waitForTimeout(500);
  
  // Check for errors after opening form
  const formErrors = await authenticatedPage.evaluate(() => (window as any).__pageErrors || []);
  if (formErrors.length > 0) {
    formErrors.forEach((err: any) => {
      errors.push(`Form Error: ${err.message || err.error}`);
      testFailed = true;
    });
  }
  await checkErrors('after opening form');

  const uniqueId = `INFO-TEST-${Date.now()}`;

  // ===== BASIC INFO TAB =====
  console.log('Filling Basic Info tab...');
  
  // Required fields
  const assetNameInput = authenticatedPage.locator('label:has-text("Asset Name")').locator('..').locator('input').first();
  await assetNameInput.fill(`Test Information Asset ${Date.now()}`);
  await checkErrors('after filling asset name');
  
  // Information Type - dropdown
  const informationTypeSelect = authenticatedPage.locator('label:has-text("Information Type")').locator('..').locator('button[role="combobox"]').first();
  await informationTypeSelect.waitFor({ state: 'visible', timeout: 5000 });
  await informationTypeSelect.click();
  await authenticatedPage.waitForSelector('[role="option"]', { timeout: 10000 });
  await authenticatedPage.waitForTimeout(500);
  await authenticatedPage.locator('[role="option"]:has-text("Customer Records")').first().click();
  await authenticatedPage.waitForTimeout(500);
  await checkErrors('after selecting information type');
  
  // Description
  const descriptionTextarea = authenticatedPage.locator('label:has-text("Description")').locator('..').locator('textarea').first();
  await descriptionTextarea.fill('Test information asset description for E2E testing');
  
  // Criticality Level
  const criticalitySelect = authenticatedPage.locator('label:has-text("Criticality Level")').locator('..').locator('button[role="combobox"]').first();
  await criticalitySelect.click();
  await authenticatedPage.waitForTimeout(500);
  await authenticatedPage.locator('[role="option"]:has-text("High")').first().click();
  await authenticatedPage.waitForTimeout(500);

  // ===== CLASSIFICATION TAB =====
  console.log('Filling Classification tab...');
  const classificationTab = authenticatedPage.locator('button[role="tab"]:has-text("Classification")').first();
  await classificationTab.click();
  await authenticatedPage.waitForTimeout(500);
  
  // Data Classification - required dropdown
  const dataClassificationSelect = authenticatedPage.locator('label:has-text("Data Classification")').locator('..').locator('button[role="combobox"]').first();
  await dataClassificationSelect.click();
  await authenticatedPage.waitForTimeout(500);
  await authenticatedPage.locator('[role="option"]:has-text("Confidential")').first().click();
  await authenticatedPage.waitForTimeout(500);
  
  // Classification dates
  const today = new Date().toISOString().split('T')[0];
  const classificationDateInput = authenticatedPage.locator('label:has-text("Classification Date")').locator('..').locator('input[type="date"]').first();
  await classificationDateInput.fill(today);
  
  const reclassificationDateInput = authenticatedPage.locator('label:has-text("Reclassification Date")').locator('..').locator('input[type="date"]').first();
  const futureDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  await reclassificationDateInput.fill(futureDate);
  
  // Sensitive data types - checkboxes
  const containsPII = authenticatedPage.locator('label:has-text("Contains PII")').first();
  await containsPII.click();
  await authenticatedPage.waitForTimeout(300);
  
  const containsFinancialData = authenticatedPage.locator('label:has-text("Contains Financial Data")').first();
  await containsFinancialData.click();
  await authenticatedPage.waitForTimeout(300);

  // ===== OWNERSHIP TAB =====
  console.log('Filling Ownership tab...');
  const ownershipTab = authenticatedPage.locator('button[role="tab"]:has-text("Ownership")').first();
  await ownershipTab.click();
  await authenticatedPage.waitForTimeout(1000);
  
  // Owner - wait for dropdown to be ready and options to load
  const ownerSelect = authenticatedPage.locator('label:has-text("Owner")').locator('..').locator('button[role="combobox"]').first();
  await ownerSelect.waitFor({ state: 'visible', timeout: 5000 });
  await ownerSelect.click();
  // Wait for options to load
  await authenticatedPage.waitForSelector('[role="option"]', { timeout: 10000 });
  await authenticatedPage.waitForTimeout(500);
  // Select first available user (skip "No users available" if present)
  const ownerOptions = authenticatedPage.locator('[role="option"]');
  const ownerOptionCount = await ownerOptions.count();
  if (ownerOptionCount > 0) {
    const firstOptionText = await ownerOptions.first().textContent();
    if (firstOptionText && !firstOptionText.toLowerCase().includes('no users available')) {
      await ownerOptions.first().click();
    }
  }
  await authenticatedPage.waitForTimeout(500);
  
  // Custodian - wait for dropdown to be ready and options to load
  const custodianSelect = authenticatedPage.locator('label:has-text("Custodian")').locator('..').locator('button[role="combobox"]').first();
  await custodianSelect.waitFor({ state: 'visible', timeout: 5000 });
  await custodianSelect.click();
  // Wait for options to load
  await authenticatedPage.waitForSelector('[role="option"]', { timeout: 10000 });
  await authenticatedPage.waitForTimeout(500);
  // Select first available user (skip "No users available" if present)
  const custodianOptions = authenticatedPage.locator('[role="option"]');
  const custodianOptionCount = await custodianOptions.count();
  if (custodianOptionCount > 0) {
    const firstCustodianOptionText = await custodianOptions.first().textContent();
    if (firstCustodianOptionText && !firstCustodianOptionText.toLowerCase().includes('no users available')) {
      await custodianOptions.first().click();
    }
  }
  await authenticatedPage.waitForTimeout(500);
  
  // Business Unit - wait for dropdown to be ready and options to load
  const buSelect = authenticatedPage.locator('label:has-text("Business Unit")').locator('..').locator('button[role="combobox"]').first();
  await buSelect.waitFor({ state: 'visible', timeout: 5000 });
  await buSelect.click();
  // Wait for options to load
  await authenticatedPage.waitForSelector('[role="option"]', { timeout: 10000 });
  await authenticatedPage.waitForTimeout(500);
  // Select first available business unit (skip "No business units available" if present)
  const buOptions = authenticatedPage.locator('[role="option"]');
  const buOptionCount = await buOptions.count();
  if (buOptionCount > 0) {
    const firstBuOptionText = await buOptions.first().textContent();
    if (firstBuOptionText && !firstBuOptionText.toLowerCase().includes('no business units available')) {
      await buOptions.first().click();
    }
  }
  await authenticatedPage.waitForTimeout(500);
  
  // Department
  const departmentInput = authenticatedPage.locator('label:has-text("Department")').locator('..').locator('input').first();
  await departmentInput.fill('IT Department');

  // ===== STORAGE TAB =====
  console.log('Filling Storage tab...');
  const storageTab = authenticatedPage.locator('button[role="tab"]:has-text("Storage")').first();
  await storageTab.click();
  await authenticatedPage.waitForTimeout(500);
  
  // Storage Location
  const storageLocationInput = authenticatedPage.locator('label:has-text("Storage Location")').locator('..').locator('input').first();
  await storageLocationInput.fill('Primary Database Server');
  
  // Storage Type - dropdown
  const storageTypeSelect = authenticatedPage.locator('label:has-text("Storage Type")').locator('..').locator('button[role="combobox"]').first();
  await storageTypeSelect.waitFor({ state: 'visible', timeout: 5000 });
  await storageTypeSelect.click();
  await authenticatedPage.waitForSelector('[role="option"]', { timeout: 10000 });
  await authenticatedPage.waitForTimeout(500);
  await authenticatedPage.locator('[role="option"]:has-text("Database")').first().click();
  await authenticatedPage.waitForTimeout(500);
  
  // Retention Policy
  const retentionPolicyTextarea = authenticatedPage.locator('label:has-text("Retention Policy")').locator('..').locator('textarea').first();
  await retentionPolicyTextarea.fill('7 years from last transaction date');
  
  // Retention Expiry Date
  const retentionExpiryInput = authenticatedPage.locator('label:has-text("Retention Expiry Date")').locator('..').locator('input[type="date"]').first();
  await retentionExpiryInput.fill(futureDate);
  
  // Notes
  const notesTextarea = authenticatedPage.locator('label:has-text("Notes")').locator('..').locator('textarea').first();
  await notesTextarea.fill('Test notes for information asset');

  // Screenshot before submitting for debugging
  await authenticatedPage.screenshot({ path: 'test-results/before-submit-information.png', fullPage: true });
  await checkErrors('before submit');

  // ===== SUBMIT =====
  console.log('===== SUBMITTING FORM =====');
  const submitButton = authenticatedPage.locator('button[type="submit"]:has-text("Create"), button[type="submit"]:has-text("Save")').first();
  await submitButton.scrollIntoViewIfNeeded();
  await authenticatedPage.waitForTimeout(400);

  // Submit and wait for dialog to close
  await Promise.race([
    submitButton.click().then(async () => {
      await authenticatedPage.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 15000 });
      await authenticatedPage.waitForTimeout(500);
      console.log('✅ Form submitted, dialog closed');
    }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Form submission timeout')), 20000))
  ]);

  // Verify success: look for success message or navigation
  const successMsg = authenticatedPage.locator('text=Success').or(authenticatedPage.locator('[role="alert"]:has-text("Success")'));
  if (await successMsg.isVisible({ timeout: 2000 }).catch(() => false)) {
    console.log('✅ Success message visible after submit');
  } else {
    // Fallback: check URL
    await authenticatedPage.waitForTimeout(1000);
    const currentUrl = authenticatedPage.url();
    expect(currentUrl).toContain('/en/dashboard/assets/information');
    console.log('✅ Navigated back to /en/dashboard/assets/information');
  }

  // Cleanup: close page if possible
  if (typeof authenticatedPage.close === 'function') {
    await authenticatedPage.close();
    console.log('✅ Page closed after test');
  }

  console.log('✅ Test completed successfully!');
});

