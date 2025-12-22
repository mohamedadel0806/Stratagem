import { test, expect } from '../fixtures/auth';
import { waitForDialog } from '../utils/helpers';

/**
 * Simple focused test: Fill complete supplier form and submit
 * This test fills all form fields across all tabs and submits successfully
 */
test('should fill complete supplier form and submit successfully', async ({ authenticatedPage }) => {
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
  
  // Capture page errors (but ignore hydration errors which are common in Next.js)
  authenticatedPage.on('pageerror', (error) => {
    const errorText = error.message;
    // Ignore hydration errors - they're common in Next.js and don't prevent functionality
    if (errorText.includes('Hydration failed') || errorText.includes('hydration')) {
      console.warn('⚠️ Hydration warning (ignored):', errorText);
      return;
    }
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
  
  // Also capture errors from the page context - MUST be set up before navigation
  await authenticatedPage.addInitScript(() => {
    (window as any).__pageErrors = [];
    (window as any).__reactErrors = [];
    
    // Capture all errors
    window.addEventListener('error', (event) => {
      const errorInfo = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.toString() || String(event.error),
        stack: event.error?.stack
      };
      (window as any).__pageErrors.push(errorInfo);
      
      // Specifically track React errors
      if (errorInfo.message.includes('React child') || 
          errorInfo.message.includes('object with keys')) {
        (window as any).__reactErrors.push(errorInfo);
      }
    });
    
    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const errorInfo = {
        message: 'Unhandled Promise Rejection',
        error: event.reason?.toString() || String(event.reason),
        stack: event.reason?.stack
      };
      (window as any).__pageErrors.push(errorInfo);
    });
    
    // Override console.error to capture React errors
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const errorText = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      if (errorText.includes('React child') || 
          errorText.includes('object with keys') ||
          errorText.includes('Objects are not valid')) {
        (window as any).__reactErrors.push({
          message: errorText,
          timestamp: Date.now()
        });
      }
      
      originalConsoleError.apply(console, args);
    };
  });
  
  // Navigate directly to suppliers page, minimal wait
  await authenticatedPage.goto('/en/dashboard/assets/suppliers', { waitUntil: 'domcontentloaded' });
  // Wait for "New Supplier" button to be visible (no extra timeout)
  const newSupplierButton = authenticatedPage.locator('button:has-text("New Supplier")').first();
  await newSupplierButton.waitFor({ state: 'visible', timeout: 10000 });
  
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
  
  // Check for all page errors (but ignore hydration errors)
  const pageErrors = await authenticatedPage.evaluate(() => (window as any).__pageErrors || []);
  if (pageErrors.length > 0) {
    pageErrors.forEach((err: any) => {
      const errorMsg = err.message || err.error || '';
      // Ignore hydration errors - they're common in Next.js and don't prevent functionality
      if (errorMsg.includes('Hydration failed') || errorMsg.includes('hydration')) {
        console.warn('⚠️ Hydration warning (ignored):', errorMsg);
        return;
      }
      errors.push(`Page Error: ${errorMsg}`);
      testFailed = true;
    });
  }
  
  await checkErrors('after navigation');
  
  // Open form
  await newSupplierButton.click({ timeout: 5000 });
  await authenticatedPage.waitForSelector('[role="dialog"], .modal, [data-testid="dialog"]', { state: 'visible', timeout: 15000 });
  // await waitForDialog(authenticatedPage); // replaced with explicit longer timeout
  await authenticatedPage.waitForTimeout(500);
  
  // Check for errors after opening form (but ignore hydration errors)
  const formErrors = await authenticatedPage.evaluate(() => (window as any).__pageErrors || []);
  if (formErrors.length > 0) {
    formErrors.forEach((err: any) => {
      const errorMsg = err.message || err.error || '';
      // Ignore hydration errors
      if (errorMsg.includes('Hydration failed') || errorMsg.includes('hydration')) {
        console.warn('⚠️ Hydration warning (ignored):', errorMsg);
        return;
      }
      errors.push(`Form Error: ${errorMsg}`);
      testFailed = true;
    });
  }
  await checkErrors('after opening form');

  // ===== BASIC INFO TAB =====
  console.log('Filling Basic Info tab...');
  
  // Required field: Supplier Name
  const supplierNameLabel = authenticatedPage.locator('label:has-text("Supplier Name")').first();
  await supplierNameLabel.waitFor({ state: 'visible', timeout: 5000 });
  const supplierNameInput = supplierNameLabel.locator('..').locator('input').first();
  await supplierNameInput.fill(`Test Supplier ${Date.now()}`);
  await checkErrors('after filling supplier name');
  
  // Description
  const descLabel = authenticatedPage.locator('label:has-text("Description")').first();
  const descTextarea = descLabel.locator('..').locator('textarea').first();
  await descTextarea.fill('Complete test supplier for E2E testing');
  await checkErrors('after filling description');
  
  // Supplier Type - required dropdown
  const supplierTypeSelect = authenticatedPage.locator('label:has-text("Supplier Type")').locator('..').locator('button[role="combobox"]').first();
  await supplierTypeSelect.waitFor({ state: 'visible', timeout: 5000 });
  await supplierTypeSelect.click();
  await authenticatedPage.waitForTimeout(500);
  await authenticatedPage.locator('[role="option"]:has-text("Vendor")').first().click();
  await authenticatedPage.waitForTimeout(500);
  
  // Criticality Level
  const criticalitySelect = authenticatedPage.locator('label:has-text("Criticality")').locator('..').locator('button[role="combobox"]').first();
  await criticalitySelect.click();
  await authenticatedPage.waitForTimeout(500);
  await authenticatedPage.locator('[role="option"]:has-text("High")').first().click();
  await authenticatedPage.waitForTimeout(500);
  
  // Business Unit
  const businessUnitLabel = authenticatedPage.locator('label:has-text("Business Unit")').first();
  const businessUnitInput = businessUnitLabel.locator('..').locator('input').first();
  await businessUnitInput.fill('IT Operations');
  
  // Goods/Services Provided
  const goodsServicesLabel = authenticatedPage.locator('label:has-text("Goods/Services Provided")').first();
  const goodsServicesTextarea = goodsServicesLabel.locator('..').locator('textarea').first();
  await goodsServicesTextarea.fill('Cloud infrastructure services and support');

  // ===== CONTACT TAB =====
  console.log('Filling Contact tab...');
  const contactTab = authenticatedPage.locator('button[role="tab"]:has-text("Contact")').first();
  await contactTab.click();
  await authenticatedPage.waitForTimeout(500);
  
  // Primary Contact Name
  const contactNameLabel = authenticatedPage.locator('label:has-text("Contact Name")').first();
  const contactNameInput = contactNameLabel.locator('..').locator('input').first();
  await contactNameInput.fill('John Doe');
  
  // Primary Contact Email
  const contactEmailLabel = authenticatedPage.locator('label:has-text("Email")').first();
  const contactEmailInput = contactEmailLabel.locator('..').locator('input[type="email"]').first();
  await contactEmailInput.fill('john.doe@supplier.com');
  
  // Primary Contact Phone
  const contactPhoneLabel = authenticatedPage.locator('label:has-text("Phone")').first();
  const contactPhoneInput = contactPhoneLabel.locator('..').locator('input').first();
  await contactPhoneInput.fill('+1-555-123-4567');
  
  // Street Address
  const addressLabel = authenticatedPage.locator('label:has-text("Street Address")').first();
  const addressInput = addressLabel.locator('..').locator('input').first();
  await addressInput.fill('123 Business Street');
  
  // City
  const cityLabel = authenticatedPage.locator('label:has-text("City")').first();
  const cityInput = cityLabel.locator('..').locator('input').first();
  await cityInput.fill('New York');
  
  // Country
  const countryLabel = authenticatedPage.locator('label:has-text("Country")').first();
  const countryInput = countryLabel.locator('..').locator('input').first();
  await countryInput.fill('United States');
  
  // Postal Code
  const postalCodeLabel = authenticatedPage.locator('label:has-text("Postal Code")').first();
  const postalCodeInput = postalCodeLabel.locator('..').locator('input').first();
  await postalCodeInput.fill('10001');
  
  // Website
  const websiteLabel = authenticatedPage.locator('label:has-text("Website")').first();
  const websiteInput = websiteLabel.locator('..').locator('input[type="url"]').first();
  await websiteInput.fill('https://www.supplier.com');

  // ===== CONTRACT TAB =====
  console.log('Filling Contract tab...');
  const contractTab = authenticatedPage.locator('button[role="tab"]:has-text("Contract")').first();
  await contractTab.click();
  await authenticatedPage.waitForTimeout(500);
  
  // Contract Reference
  const contractRefLabel = authenticatedPage.locator('label:has-text("Contract Reference")').first();
  const contractRefInput = contractRefLabel.locator('..').locator('input').first();
  await contractRefInput.fill('CONTRACT-2024-001');
  
  // Contract Start Date
  const contractStartLabel = authenticatedPage.locator('label:has-text("Contract Start Date")').first();
  const contractStartInput = contractStartLabel.locator('..').locator('input[type="date"]').first();
  const today = new Date().toISOString().split('T')[0];
  await contractStartInput.fill(today);
  
  // Contract End Date
  const contractEndLabel = authenticatedPage.locator('label:has-text("Contract End Date")').first();
  const contractEndInput = contractEndLabel.locator('..').locator('input[type="date"]').first();
  const futureDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  await contractEndInput.fill(futureDate);

  // ===== COMPLIANCE TAB =====
  console.log('Filling Compliance tab...');
  const complianceTab = authenticatedPage.locator('button[role="tab"]:has-text("Compliance")').first();
  await complianceTab.click();
  await authenticatedPage.waitForTimeout(1000);
  
  // Wait for compliance tab content to be visible
  await authenticatedPage.waitForSelector('label:has-text("Has Data Access"), label:has-text("Security & Compliance")', { timeout: 5000 });
  await authenticatedPage.waitForTimeout(500);
  
  // Find checkboxes individually by their associated labels
  // The structure is: FormItem (div with flex classes) contains both the checkbox and the label
  
  // Has Data Access checkbox
  const hasDataAccessContainer = authenticatedPage.locator('div:has(label:has-text("Has Data Access"))').first();
  await hasDataAccessContainer.waitFor({ state: 'visible', timeout: 5000 });
  const hasDataAccessCheckbox = hasDataAccessContainer.locator('input[type="checkbox"], button[role="checkbox"]').first();
  await hasDataAccessCheckbox.waitFor({ state: 'visible', timeout: 5000 });
  await hasDataAccessCheckbox.scrollIntoViewIfNeeded();
  await authenticatedPage.waitForTimeout(200);
  await hasDataAccessCheckbox.click();
  await authenticatedPage.waitForTimeout(300);
  console.log('✅ Clicked Has Data Access checkbox');
  
  // Requires NDA checkbox
  const requiresNDAContainer = authenticatedPage.locator('div:has(label:has-text("Requires NDA"))').first();
  await requiresNDAContainer.waitFor({ state: 'visible', timeout: 5000 });
  const requiresNDACheckbox = requiresNDAContainer.locator('input[type="checkbox"], button[role="checkbox"]').first();
  await requiresNDACheckbox.waitFor({ state: 'visible', timeout: 5000 });
  await requiresNDACheckbox.scrollIntoViewIfNeeded();
  await authenticatedPage.waitForTimeout(200);
  await requiresNDACheckbox.click();
  await authenticatedPage.waitForTimeout(300);
  console.log('✅ Clicked Requires NDA checkbox');
  
  // Has Security Assessment checkbox
  const hasSecurityAssessmentContainer = authenticatedPage.locator('div:has(label:has-text("Has Security Assessment"))').first();
  await hasSecurityAssessmentContainer.waitFor({ state: 'visible', timeout: 5000 });
  const hasSecurityAssessmentCheckbox = hasSecurityAssessmentContainer.locator('input[type="checkbox"], button[role="checkbox"]').first();
  await hasSecurityAssessmentCheckbox.waitFor({ state: 'visible', timeout: 5000 });
  await hasSecurityAssessmentCheckbox.scrollIntoViewIfNeeded();
  await authenticatedPage.waitForTimeout(200);
  await hasSecurityAssessmentCheckbox.click();
  await authenticatedPage.waitForTimeout(300);
  console.log('✅ Clicked Has Security Assessment checkbox');
  
  // Notes
  const notesLabel = authenticatedPage.locator('label:has-text("Notes")').first();
  await notesLabel.waitFor({ state: 'visible', timeout: 5000 });
  const notesTextarea = notesLabel.locator('..').locator('textarea').first();
  await notesTextarea.fill('Supplier has passed all security assessments and compliance checks.');
  await authenticatedPage.waitForTimeout(300);

  // Screenshot before submitting for debugging
  await authenticatedPage.screenshot({ path: 'test-results/before-submit-supplier.png', fullPage: true });
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
    expect(currentUrl).toContain('/en/dashboard/assets/suppliers');
    console.log('✅ Navigated back to /en/dashboard/assets/suppliers');
  }

  // Cleanup: close page if possible
  if (typeof authenticatedPage.close === 'function') {
    await authenticatedPage.close();
    console.log('✅ Page closed after test');
  }

  console.log('✅ Test completed successfully!');
});



