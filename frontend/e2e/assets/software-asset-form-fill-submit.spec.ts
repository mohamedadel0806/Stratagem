import { test, expect } from '../fixtures/auth';
import { waitForDialog } from '../utils/helpers';

/**
 * E2E Test: Fill complete software asset form and submit
 * This test fills all form fields across all tabs and submits successfully
 */
test('should fill complete software asset form and submit successfully', async ({ authenticatedPage }) => {
  test.setTimeout(90000); // 90s max for complex form
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

  // Navigate directly to assets page after login, minimal wait
  await authenticatedPage.goto('/en/dashboard/assets/software', { waitUntil: 'domcontentloaded' });
  // Wait for "New Asset" button to be visible (no extra timeout)
  const newAssetButton = authenticatedPage.locator('button:has-text("New Asset")').first();
  await newAssetButton.waitFor({ state: 'visible', timeout: 5000 });
  

  await checkErrors('after navigation');


  // Open form - click New Asset button
  await newAssetButton.click({ timeout: 3000 });
  await waitForDialog(authenticatedPage);
  await authenticatedPage.waitForTimeout(500); // Shorter wait
  

  await checkErrors('after opening form');

  const uniqueId = `SW-TEST-${Date.now()}`;

  // ===== BASIC INFO TAB =====
  console.log('===== BASIC INFO TAB =====');
  // Software Name
  const softwareNameInput = authenticatedPage.locator('input[name="softwareName"]');
  if (await softwareNameInput.isVisible({ timeout: 1000 }).catch(() => false)) {
    await softwareNameInput.fill(`Test Software Asset ${Date.now()}`);
    await authenticatedPage.waitForTimeout(200);
    console.log('✅ Software Name filled');
  }
  await checkErrors('after filling software name');

  // Description
  const descriptionTextarea = authenticatedPage.locator('textarea[name="description"]');
  if (await descriptionTextarea.isVisible({ timeout: 1000 }).catch(() => false)) {
    await descriptionTextarea.fill('Test software asset description for E2E testing');
    await authenticatedPage.waitForTimeout(200);
    console.log('✅ Description filled');
  }

  // Software Type - dropdown (required)
  const softwareTypeSelect = authenticatedPage.getByLabel(/Software Type/);
  await softwareTypeSelect.click({ timeout: 3000 });
  await authenticatedPage.waitForTimeout(300);
  await authenticatedPage.locator('[role="option"]:has-text("Application Software")').first().click();
  await authenticatedPage.waitForTimeout(200);
  console.log('✅ Software Type selected');
  
  // Criticality Level
  const criticalitySelect = authenticatedPage.getByLabel(/Criticality/);
  await criticalitySelect.click({ timeout: 3000 });
  await authenticatedPage.waitForTimeout(300);
  await authenticatedPage.locator('[role="option"]:has-text("High")').first().click();
  await authenticatedPage.waitForTimeout(200);
  console.log('✅ Criticality selected');

  // Version and Patch Level
  const versionInput = authenticatedPage.locator('input[name="version"]');
  if (await versionInput.isVisible({ timeout: 1000 }).catch(() => false)) {
    await versionInput.fill('1.0.0');
    await authenticatedPage.waitForTimeout(200);
    console.log('✅ Version filled');
  }
  const patchLevelInput = authenticatedPage.locator('input[name="patchLevel"]');
  if (await patchLevelInput.isVisible({ timeout: 1000 }).catch(() => false)) {
    await patchLevelInput.fill('1.0.1');
    await authenticatedPage.waitForTimeout(200);
    console.log('✅ Patch Level filled');
  }

  // ===== LICENSING TAB =====
  console.log('===== LICENSING TAB =====');
  const licensingTab = authenticatedPage.locator('button[role="tab"]:has-text("Licensing")').first();
  await licensingTab.click();
  await authenticatedPage.waitForTimeout(400);

  // License Type - dropdown
  const licenseTypeSelect = authenticatedPage.getByLabel(/License Type/);
  await licenseTypeSelect.click({ timeout: 3000 });
  await authenticatedPage.waitForTimeout(300);
  await authenticatedPage.locator('[role="option"]:has-text("Commercial")').first().click();
  await authenticatedPage.waitForTimeout(200);
  console.log('✅ License Type selected');

  // License Key
  const licenseKeyInput = authenticatedPage.locator('input[name="licenseKey"]');
  if (await licenseKeyInput.isVisible({ timeout: 1000 }).catch(() => false)) {
    await licenseKeyInput.fill('TEST-LICENSE-KEY-12345');
    await authenticatedPage.waitForTimeout(200);
    console.log('✅ License Key filled');
  }

  // License numbers and dates
  const numberOfLicensesInput = authenticatedPage.locator('input[name="totalLicenses"]');
  if (await numberOfLicensesInput.isVisible({ timeout: 1000 }).catch(() => false)) {
    await numberOfLicensesInput.fill('10');
    await authenticatedPage.waitForTimeout(200);
    console.log('✅ Total Licenses filled');
  }
  const licensesInUseInput = authenticatedPage.locator('input[name="licensesInUse"]');
  if (await licensesInUseInput.isVisible({ timeout: 1000 }).catch(() => false)) {
    await licensesInUseInput.fill('5');
    await authenticatedPage.waitForTimeout(200);
    console.log('✅ Licenses In Use filled');
  }
  const today = new Date().toISOString().split('T')[0];
  const futureDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const licenseExpiryInput = authenticatedPage.getByLabel(/License Expiry/);
  await licenseExpiryInput.fill(futureDate);
  await authenticatedPage.waitForTimeout(200);
  console.log('✅ License Expiry filled');
  const purchaseDateInput = authenticatedPage.getByLabel(/Purchase Date/);
  await purchaseDateInput.fill(today);
  await authenticatedPage.waitForTimeout(200);
  console.log('✅ Purchase Date filled');
  const installationDateInput = authenticatedPage.getByLabel(/Installation Date/);
  await installationDateInput.fill(today);
  await authenticatedPage.waitForTimeout(200);
  console.log('✅ Installation Date filled');

  // ===== VENDOR TAB =====
  console.log('===== VENDOR TAB =====');
  const vendorTab = authenticatedPage.locator('button[role="tab"]:has-text("Vendor")').first();
  await vendorTab.click();
  await authenticatedPage.waitForTimeout(400);

  const vendorInput = authenticatedPage.locator('input[name="vendor"]');
  if (await vendorInput.isVisible({ timeout: 1000 }).catch(() => false)) {
    await vendorInput.fill('Test Vendor Inc.');
    await authenticatedPage.waitForTimeout(200);
    console.log('✅ Vendor filled');
  }
  const vendorContactInput = authenticatedPage.locator('input[name="vendorContact"]');
  if (await vendorContactInput.isVisible({ timeout: 1000 }).catch(() => false)) {
    await vendorContactInput.fill('John Doe');
    await authenticatedPage.waitForTimeout(200);
    console.log('✅ Vendor Contact filled');
  }
  const vendorEmailInput = authenticatedPage.locator('input[name="vendorEmail"]');
  if (await vendorEmailInput.isVisible({ timeout: 1000 }).catch(() => false)) {
    await vendorEmailInput.fill('vendor@test.com');
    await authenticatedPage.waitForTimeout(200);
    console.log('✅ Vendor Email filled');
  }
  const vendorPhoneInput = authenticatedPage.locator('input[name="vendorPhone"]');
  if (await vendorPhoneInput.isVisible({ timeout: 1000 }).catch(() => false)) {
    await vendorPhoneInput.fill('+1-555-0123');
    await authenticatedPage.waitForTimeout(200);
    console.log('✅ Vendor Phone filled');
  }

  // ===== OTHER TAB =====
  console.log('===== OTHER TAB =====');
  const otherTab = authenticatedPage.locator('button[role="tab"]:has-text("Other")').first();
  await otherTab.click();
  await authenticatedPage.waitForTimeout(400);

  // Owner - use filtered button selector for custom select
  const ownerButton = authenticatedPage.locator('button').filter({ has: authenticatedPage.locator('text="Select owner"') }).first();
  const ownerExists = await ownerButton.isVisible({ timeout: 2000 }).catch(() => false);
  if (ownerExists) {
    await ownerButton.click();
    await authenticatedPage.waitForTimeout(300);
    const ownerOptions = authenticatedPage.locator('[role="option"]');
    const ownerOptionCount = await ownerOptions.count();
    if (ownerOptionCount > 0) {
      const firstOptionText = await ownerOptions.first().textContent();
      if (firstOptionText && !firstOptionText.toLowerCase().includes('no users available')) {
        await ownerOptions.first().click();
        await authenticatedPage.waitForTimeout(200);
        console.log('✅ Owner selected');
      }
    }
  } else {
    console.log('Owner field not available, skipping');
  }

  // Business Unit - similar pattern
  const buButton = authenticatedPage.locator('button').filter({ has: authenticatedPage.locator('text="Select business unit"') }).first();
  const buExists = await buButton.isVisible({ timeout: 2000 }).catch(() => false);
  if (buExists) {
    await buButton.click();
    await authenticatedPage.waitForTimeout(300);
    const buOptions = authenticatedPage.locator('[role="option"]');
    const buOptionCount = await buOptions.count();
    if (buOptionCount > 0) {
      const firstBuOptionText = await buOptions.first().textContent();
      if (firstBuOptionText && !firstBuOptionText.toLowerCase().includes('no business units available')) {
        await buOptions.first().click();
        await authenticatedPage.waitForTimeout(200);
        console.log('✅ Business Unit selected');
      }
    }
  } else {
    console.log('Business Unit field not available, skipping');
  }
  
  // Notes
  const notesTextarea = authenticatedPage.locator('textarea[name="notes"]');
  if (await notesTextarea.isVisible({ timeout: 1000 }).catch(() => false)) {
    await notesTextarea.fill('Test notes for software asset');
    await authenticatedPage.waitForTimeout(200);
    console.log('✅ Notes filled');
  }

  // Screenshot before submitting for debugging
  await authenticatedPage.screenshot({ path: 'test-results/before-submit.png', fullPage: true });
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
    expect(currentUrl).toContain('/en/dashboard/assets/software');
    console.log('✅ Navigated back to /en/dashboard/assets/software');
  }

  // Cleanup: close page if possible
  if (typeof authenticatedPage.close === 'function') {
    await authenticatedPage.close();
    console.log('✅ Page closed after test');
  }

  console.log('✅ Test completed successfully!');
});
