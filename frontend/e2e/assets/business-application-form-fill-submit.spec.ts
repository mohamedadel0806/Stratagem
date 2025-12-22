import { test, expect } from '../fixtures/auth';
import { waitForDialog } from '../utils/helpers';

/**
 * E2E Test: Fill complete business application form and submit
 * This test fills all form fields across all tabs and submits successfully
 */
test('should fill complete business application form and submit successfully', async ({ authenticatedPage }) => {
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

  // Navigate to business applications page
  await authenticatedPage.goto('/en/dashboard/assets/applications');
  await authenticatedPage.waitForLoadState('networkidle');
  await authenticatedPage.waitForTimeout(2000);
  
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
  
  // Wait for loading to complete
  await authenticatedPage.waitForFunction(() => {
    return !document.body.textContent?.includes('Loading assets...');
  }, { timeout: 15000 });

  // Open form
  const newAssetButton = authenticatedPage.locator('button:has-text("New Application")').first();
  await newAssetButton.waitFor({ state: 'visible', timeout: 10000 });
  await newAssetButton.click({ timeout: 5000 });
  await waitForDialog(authenticatedPage);
  await authenticatedPage.waitForTimeout(2000);
  
  // Check for errors after opening form
  const formErrors = await authenticatedPage.evaluate(() => (window as any).__pageErrors || []);
  if (formErrors.length > 0) {
    formErrors.forEach((err: any) => {
      errors.push(`Form Error: ${err.message || err.error}`);
      testFailed = true;
    });
  }
  await checkErrors('after opening form');

  const uniqueId = `APP-TEST-${Date.now()}`;

  // ===== BASIC INFO TAB =====
  console.log('Filling Basic Info tab...');
  
  // Required fields
  const applicationNameInput = authenticatedPage.locator('label:has-text("Application Name")').locator('..').locator('input').first();
  await applicationNameInput.fill(`Test Business Application ${Date.now()}`);
  await checkErrors('after filling application name');
  
  // Description
  const descriptionTextarea = authenticatedPage.locator('label:has-text("Description")').locator('..').locator('textarea').first();
  await descriptionTextarea.fill('Test business application description for E2E testing');
  
  // Application Type - dropdown (required)
  const applicationTypeSelect = authenticatedPage.locator('label:has-text("Application Type")').locator('..').locator('button[role="combobox"]').first();
  await applicationTypeSelect.waitFor({ state: 'visible', timeout: 5000 });
  await applicationTypeSelect.click();
  await authenticatedPage.waitForSelector('[role="option"]', { timeout: 10000 });
  await authenticatedPage.waitForTimeout(500);
  await authenticatedPage.locator('[role="option"]:has-text("Web Application")').first().click();
  await authenticatedPage.waitForTimeout(500);
  
  // Status - dropdown (required)
  const statusSelect = authenticatedPage.locator('label:has-text("Status")').locator('..').locator('button[role="combobox"]').first();
  await statusSelect.click();
  await authenticatedPage.waitForTimeout(500);
  await authenticatedPage.locator('[role="option"]:has-text("Active")').first().click();
  await authenticatedPage.waitForTimeout(500);
  
  // Version, Patch Level, Criticality
  const versionInput = authenticatedPage.locator('label:has-text("Version")').locator('..').locator('input').first();
  await versionInput.fill('2.0.0');
  
  const patchLevelInput = authenticatedPage.locator('label:has-text("Patch Level")').locator('..').locator('input').first();
  await patchLevelInput.fill('2.0.1');
  
  const criticalitySelect = authenticatedPage.locator('label:has-text("Criticality")').locator('..').locator('button[role="combobox"]').first();
  await criticalitySelect.click();
  await authenticatedPage.waitForTimeout(500);
  await authenticatedPage.locator('[role="option"]:has-text("High")').first().click();
  await authenticatedPage.waitForTimeout(500);

  // ===== TECHNICAL TAB =====
  console.log('Filling Technical tab...');
  const technicalTab = authenticatedPage.locator('button[role="tab"]:has-text("Technical")').first();
  await technicalTab.click();
  await authenticatedPage.waitForTimeout(500);
  
  // Hosting Location - dropdown
  const hostingLocationSelect = authenticatedPage.locator('label:has-text("Hosting Location")').locator('..').locator('button[role="combobox"]').first();
  await hostingLocationSelect.waitFor({ state: 'visible', timeout: 5000 });
  await hostingLocationSelect.click();
  await authenticatedPage.waitForSelector('[role="option"]', { timeout: 10000 });
  await authenticatedPage.waitForTimeout(500);
  await authenticatedPage.locator('[role="option"]:has-text("Cloud")').first().click();
  await authenticatedPage.waitForTimeout(500);
  
  // Technology Stack
  const technologyStackInput = authenticatedPage.locator('label:has-text("Technology Stack")').locator('..').locator('input').first();
  await technologyStackInput.fill('React, Node.js, PostgreSQL');
  
  // URL
  const urlInput = authenticatedPage.locator('label:has-text("URL")').locator('..').locator('input[type="url"]').first();
  await urlInput.fill('https://test-app.example.com');
  
  // Deployment dates
  const today = new Date().toISOString().split('T')[0];
  const futureDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const deploymentDateInput = authenticatedPage.locator('label:has-text("Deployment Date")').locator('..').locator('input[type="date"]').first();
  await deploymentDateInput.fill(today);
  
  const lastUpdateDateInput = authenticatedPage.locator('label:has-text("Last Update Date")').locator('..').locator('input[type="date"]').first();
  await lastUpdateDateInput.fill(today);
  
  // Data Processing checkboxes
  const processesPII = authenticatedPage.locator('label:has-text("Processes PII")').first();
  await processesPII.click();
  await authenticatedPage.waitForTimeout(300);
  
  const processesFinancialData = authenticatedPage.locator('label:has-text("Processes Financial Data")').first();
  await processesFinancialData.click();
  await authenticatedPage.waitForTimeout(300);

  // ===== VENDOR TAB =====
  console.log('Filling Vendor tab...');
  const vendorTab = authenticatedPage.locator('button[role="tab"]:has-text("Vendor")').first();
  await vendorTab.click();
  await authenticatedPage.waitForTimeout(500);
  
  const vendorInput = authenticatedPage.locator('label:has-text("Vendor")').locator('..').locator('input').first();
  await vendorInput.fill('Test Vendor Corp.');
  
  const vendorContactInput = authenticatedPage.locator('label:has-text("Vendor Contact")').locator('..').locator('input').first();
  await vendorContactInput.fill('Jane Smith');
  
  const vendorEmailInput = authenticatedPage.locator('label:has-text("Vendor Email")').locator('..').locator('input[type="email"]').first();
  await vendorEmailInput.fill('vendor@testcorp.com');
  
  const vendorPhoneInput = authenticatedPage.locator('label:has-text("Vendor Phone")').locator('..').locator('input').first();
  await vendorPhoneInput.fill('+1-555-0456');

  // ===== COMPLIANCE TAB =====
  console.log('Filling Compliance tab...');
  const complianceTab = authenticatedPage.locator('button[role="tab"]:has-text("Compliance")').first();
  await complianceTab.click();
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
  await departmentInput.fill('Engineering');
  
  // Notes
  const notesTextarea = authenticatedPage.locator('label:has-text("Notes")').locator('..').locator('textarea').first();
  await notesTextarea.fill('Test notes for business application');

  // Check for errors before submitting
  const preSubmitErrors = await authenticatedPage.evaluate(() => (window as any).__pageErrors || []);
  const preSubmitReactErrors = await authenticatedPage.evaluate(() => (window as any).__reactErrors || []);
  
  if (preSubmitReactErrors.length > 0) {
    preSubmitReactErrors.forEach((err: any) => {
      const errorMsg = `React Error: ${err.message || err.error || JSON.stringify(err)}`;
      errors.push(errorMsg);
      console.error('🚨 REACT ERROR BEFORE SUBMIT:', errorMsg);
      testFailed = true;
    });
  }
  
  if (preSubmitErrors.length > 0) {
    preSubmitErrors.forEach((err: any) => {
      errors.push(`Pre-submit Error: ${err.message || err.error}`);
      testFailed = true;
    });
  }
  
  if (testFailed || errors.length > 0) {
    await authenticatedPage.screenshot({ path: 'test-results/error-before-submit.png', fullPage: true });
    console.error('❌ ERRORS DETECTED BEFORE SUBMISSION:', errors);
    throw new Error(`Errors detected before submission: ${errors.join('; ')}`);
  }

  // ===== SUBMIT =====
  console.log('Submitting form...');
  const submitButton = authenticatedPage.locator('button[type="submit"]:has-text("Create"), button[type="submit"]:has-text("Save")').first();
  await submitButton.scrollIntoViewIfNeeded();
  await authenticatedPage.waitForTimeout(1000);
  
  // Submit with error monitoring
  await Promise.race([
    submitButton.click().then(async () => {
      // Wait for dialog to close
      await authenticatedPage.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 15000 });
      console.log('✅ Form submitted successfully!');
    }),
    // Timeout after 20 seconds
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Form submission timeout')), 20000)
    )
  ]).catch(async (error) => {
    // Check for errors on timeout/failure
    const submitErrors = await authenticatedPage.evaluate(() => (window as any).__pageErrors || []);
    const submitReactErrors = await authenticatedPage.evaluate(() => (window as any).__reactErrors || []);
    
    if (submitReactErrors.length > 0) {
      submitReactErrors.forEach((err: any) => {
        const errorMsg = `React Error: ${err.message || err.error || JSON.stringify(err)}`;
        errors.push(errorMsg);
        console.error('🚨 REACT ERROR DURING SUBMIT:', errorMsg);
        testFailed = true;
      });
    }
    
    if (submitErrors.length > 0) {
      submitErrors.forEach((err: any) => {
        errors.push(`Submit Error: ${err.message || err.error}`);
        testFailed = true;
      });
    }
    
    await authenticatedPage.screenshot({ path: 'test-results/form-submission-error.png', fullPage: true });
    
    if (testFailed || errors.length > 0) {
      throw new Error(`Form submission failed with errors: ${errors.join('; ')}`);
    }
    
    throw error;
  });
  
  // Final error check
  const finalErrors = await authenticatedPage.evaluate(() => (window as any).__pageErrors || []);
  const finalReactErrors = await authenticatedPage.evaluate(() => (window as any).__reactErrors || []);
  
  if (finalReactErrors.length > 0 || finalErrors.length > 0) {
    finalReactErrors.forEach((err: any) => {
      errors.push(`Final React Error: ${err.message || err.error}`);
      testFailed = true;
    });
    finalErrors.forEach((err: any) => {
      errors.push(`Final Error: ${err.message || err.error}`);
      testFailed = true;
    });
    
    if (testFailed || errors.length > 0) {
      await authenticatedPage.screenshot({ path: 'test-results/error-after-submit.png', fullPage: true });
      throw new Error(`Errors detected after submission: ${errors.join('; ')}`);
    }
  }
  
  // Verify we're back on the assets page
  await authenticatedPage.waitForTimeout(2000);
  const currentUrl = authenticatedPage.url();
  expect(currentUrl).toContain('/assets/applications');
  
  console.log('✅ Test completed successfully!');
});



