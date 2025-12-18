import { test, expect } from '../fixtures/auth';
import { waitForDialog } from '../utils/helpers';

/**
 * Simple focused test: Fill complete form and submit
 * This test fills all form fields across all tabs and submits successfully
 */
test('should fill complete form and submit successfully', async ({ authenticatedPage }) => {
  test.setTimeout(60000); // Increase timeout to 60 seconds to account for dropdown loading
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
  
  // Navigate directly to physical assets page, minimal wait
  await authenticatedPage.goto('/en/dashboard/assets/physical', { waitUntil: 'domcontentloaded' });
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

  const uniqueId = `TEST-${Date.now()}`;

  // ===== BASIC TAB =====
  console.log('Filling Basic tab...');
  
  // Required fields
  const uniqueIdInput = authenticatedPage.locator('label:has-text("Unique Identifier")').locator('..').locator('input').first();
  await uniqueIdInput.fill(uniqueId);
  await checkErrors('after filling unique identifier');
  
  const descInput = authenticatedPage.locator('label:has-text("Asset Description")').locator('..').locator('input').first();
  await descInput.fill('Complete Test Asset');
  await checkErrors('after filling description');
  
  // Criticality
  const criticalitySelect = authenticatedPage.locator('label:has-text("Criticality Level")').locator('..').locator('button[role="combobox"]').first();
  await criticalitySelect.click();
  await authenticatedPage.waitForTimeout(500);
  await authenticatedPage.locator('[role="option"]:has-text("High")').first().click();
  await authenticatedPage.waitForTimeout(500);
  
  // Asset Type - wait for dropdown to be ready
  const assetTypeSelect = authenticatedPage.locator('label:has-text("Asset Type")').locator('..').locator('button[role="combobox"]').first();
  await assetTypeSelect.waitFor({ state: 'visible', timeout: 5000 });
  await assetTypeSelect.click();
  // Wait for dropdown options to appear
  await authenticatedPage.waitForSelector('[role="option"]', { timeout: 10000 });
  // Wait a bit for any loading state to clear
  await authenticatedPage.waitForTimeout(500);
  await authenticatedPage.locator('[role="option"]').first().click();
  await authenticatedPage.waitForTimeout(500);
  
  // Optional fields
  const manufacturerInput = authenticatedPage.locator('label:has-text("Manufacturer")').locator('..').locator('input').first();
  await manufacturerInput.fill('Dell');
  
  const modelInput = authenticatedPage.locator('label:has-text("Model")').locator('..').locator('input').first();
  await modelInput.fill('PowerEdge R740');
  
  const serialInput = authenticatedPage.locator('label:has-text("Serial Number")').locator('..').locator('input').first();
  await serialInput.fill('SN-12345');
  
  const tagInput = authenticatedPage.locator('label:has-text("Asset Tag")').locator('..').locator('input').first();
  await tagInput.fill('TAG-001');

  // ===== LOCATION TAB =====
  console.log('Filling Location tab...');
  const locationTab = authenticatedPage.locator('button[role="tab"]:has-text("Location")').first();
  await locationTab.click();
  await authenticatedPage.waitForTimeout(500);
  
  const locationTextarea = authenticatedPage.locator('label:has-text("Physical Location")').locator('..').locator('textarea').first();
  await locationTextarea.fill('Building A, Floor 3, Room 301');

  // ===== NETWORK TAB =====
  console.log('Filling Network tab...');
  const networkTab = authenticatedPage.locator('button[role="tab"]:has-text("Network")').first();
  await networkTab.click();
  await authenticatedPage.waitForTimeout(500);
  
  // Connectivity
  const connectivitySelect = authenticatedPage.locator('label:has-text("Connectivity Status")').locator('..').locator('button[role="combobox"]').first();
  await connectivitySelect.click();
  await authenticatedPage.waitForTimeout(500);
  await authenticatedPage.locator('[role="option"]:has-text("Connected")').first().click();
  await authenticatedPage.waitForTimeout(500);
  
  // Network Approval
  const approvalSelect = authenticatedPage.locator('label:has-text("Network Approval Status")').locator('..').locator('button[role="combobox"]').first();
  await approvalSelect.click();
  await authenticatedPage.waitForTimeout(500);
  await authenticatedPage.locator('[role="option"]:has-text("Approved")').first().click();
  await authenticatedPage.waitForTimeout(500);
  
  // MAC Address
  const addMacButton = authenticatedPage.locator('button:has-text("Add MAC Address")').first();
  await addMacButton.click();
  await authenticatedPage.waitForTimeout(500);
  const macInputs = authenticatedPage.locator('input[placeholder*="00:1B:44"], input[placeholder*="MAC"]');
  await macInputs.first().fill('00:1B:44:11:3A:B7');
  
  // IP Address
  const addIpButton = authenticatedPage.locator('button:has-text("Add IP Address")').first();
  await addIpButton.click();
  await authenticatedPage.waitForTimeout(500);
  const ipInputs = authenticatedPage.locator('input[placeholder*="192.168.1"], input[placeholder*="IP"]');
  await ipInputs.first().fill('192.168.1.100');

  // ===== OWNERSHIP TAB =====
  console.log('Filling Ownership tab...');
  const ownershipTab = authenticatedPage.locator('button[role="tab"]:has-text("Ownership")').first();
  await ownershipTab.click();
  await authenticatedPage.waitForTimeout(1000);
  
  // Owner - wait for dropdown to be ready and options to load
  const ownerSelect = authenticatedPage.locator('label:has-text("Owner")').locator('..').locator('button[role="combobox"]').first();
  await ownerSelect.waitFor({ state: 'visible', timeout: 5000 });
  await ownerSelect.click();
  // Wait for options to load (dropdown may show "Loading..." initially)
  await authenticatedPage.waitForFunction(
    () => {
      const options = document.querySelectorAll('[role="option"]');
      return options.length > 0 && !options[0].textContent?.includes('Loading');
    },
    { timeout: 10000 }
  );
  await authenticatedPage.waitForTimeout(500);
  // Select first available user (skip "No users available" if present)
  const ownerOptions = authenticatedPage.locator('[role="option"]');
  const ownerOptionCount = await ownerOptions.count();
  if (ownerOptionCount > 0) {
    const firstOptionText = await ownerOptions.first().textContent();
    // Only click if it's not the "No users available" message
    if (firstOptionText && !firstOptionText.toLowerCase().includes('no users available')) {
      await ownerOptions.first().click();
    }
  }
  await authenticatedPage.waitForTimeout(500);
  
  // Business Unit - wait for dropdown to be ready and options to load
  const buSelect = authenticatedPage.locator('label:has-text("Business Unit")').locator('..').locator('button[role="combobox"]').first();
  await buSelect.waitFor({ state: 'visible', timeout: 5000 });
  await buSelect.click();
  // Wait for options to load (dropdown may show "Loading..." initially)
  await authenticatedPage.waitForFunction(
    () => {
      const options = document.querySelectorAll('[role="option"]');
      return options.length > 0 && !options[0].textContent?.includes('Loading');
    },
    { timeout: 10000 }
  );
  await authenticatedPage.waitForTimeout(500);
  // Select first available business unit (skip "No business units available" if present)
  const buOptions = authenticatedPage.locator('[role="option"]');
  const buOptionCount = await buOptions.count();
  if (buOptionCount > 0) {
    const firstBuOptionText = await buOptions.first().textContent();
    // Only click if it's not the "No business units available" message
    if (firstBuOptionText && !firstBuOptionText.toLowerCase().includes('no business units available')) {
      await buOptions.first().click();
    }
  }
  await authenticatedPage.waitForTimeout(500);

  // ===== COMPLIANCE TAB =====
  console.log('Filling Compliance tab...');
  const complianceTab = authenticatedPage.locator('button[role="tab"]:has-text("Compliance")').first();
  await complianceTab.click();
  await authenticatedPage.waitForTimeout(500);
  
  const addComplianceButton = authenticatedPage.locator('button:has-text("Add Compliance Requirement")').first();
  await addComplianceButton.click();
  await authenticatedPage.waitForTimeout(500);
  const complianceInputs = authenticatedPage.locator('input[placeholder*="GDPR"], input[placeholder*="compliance"]');
  await complianceInputs.first().fill('GDPR');

  // ===== METADATA TAB =====
  console.log('Filling Metadata tab...');
  const metadataTab = authenticatedPage.locator('button[role="tab"]:has-text("Metadata")').first();
  await metadataTab.click();
  await authenticatedPage.waitForTimeout(1000);
  
  // Purchase Date
  const purchaseDateLabel = authenticatedPage.locator('label:has-text("Purchase Date")').first();
  await purchaseDateLabel.waitFor({ state: 'visible', timeout: 5000 });
  const purchaseDateInput = purchaseDateLabel.locator('..').locator('input[type="date"]').first();
  const today = new Date().toISOString().split('T')[0];
  await purchaseDateInput.fill(today);
  
  // Warranty Expiry
  const warrantyLabel = authenticatedPage.locator('label:has-text("Warranty Expiry")').first();
  const warrantyInput = warrantyLabel.locator('..').locator('input[type="date"]').first();
  const futureDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  await warrantyInput.fill(futureDate);
  
  // Security Test Results
  console.log('Filling Security Test Results...');
  const lastTestDateLabel = authenticatedPage.locator('label:has-text("Last Test Date")').first();
  await lastTestDateLabel.waitFor({ state: 'visible', timeout: 5000 });
  const lastTestDateInput = lastTestDateLabel.locator('..').locator('input[type="date"]').first();
  await lastTestDateInput.fill(today);
  
  const findingsLabel = authenticatedPage.locator('label:has-text("Findings")').first();
  const findingsTextarea = findingsLabel.locator('..').locator('textarea').first();
  await findingsTextarea.fill('No critical vulnerabilities found');
  
  const severityLabel = authenticatedPage.locator('label:has-text("Severity")').first();
  const severityInput = severityLabel.locator('..').locator('input').first();
  await severityInput.fill('Low');

  // Screenshot before submitting for debugging
  await authenticatedPage.screenshot({ path: 'test-results/before-submit-physical.png', fullPage: true });
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
    expect(currentUrl).toContain('/en/dashboard/assets/physical');
    console.log('✅ Navigated back to /en/dashboard/assets/physical');
  }

  // Cleanup: close page if possible
  if (typeof authenticatedPage.close === 'function') {
    await authenticatedPage.close();
    console.log('✅ Page closed after test');
  }

  console.log('✅ Test completed successfully!');
});

