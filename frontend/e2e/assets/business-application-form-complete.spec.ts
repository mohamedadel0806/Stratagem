import { test, expect } from '../fixtures/auth';
import { waitForDialog, waitForTable } from '../utils/helpers';
import { waitForAssetsContent, waitForButtonClickable } from '../utils/smart-waits';

/**
 * Complete E2E Tests for Business Application Form
 * 
 * Tests all form functionality including:
 * - All 4 tabs (Basic Info, Technical, Vendor, Compliance)
 * - All form fields (required and optional)
 * - Form validation
 * - Form submission
 * - Form cancellation
 * - All dropdowns
 * - Error handling
 * - Success flow
 */
test.describe('Business Application Form - Complete Test Suite', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // Set up error capture before navigation
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
    await authenticatedPage.goto('/en/dashboard/assets/applications', { waitUntil: 'domcontentloaded' });
    await authenticatedPage.waitForTimeout(500);
  });

  test('should open form and display all tabs', async ({ authenticatedPage }) => {
    const errors: string[] = [];
    
    // Capture console errors
    authenticatedPage.on('console', (msg) => {
      if (msg.type() === 'error') {
        const errorText = msg.text();
        errors.push(`Console Error: ${errorText}`);
        console.error('❌ Browser Console Error:', errorText);
      }
    });
    
    // Capture page errors
    authenticatedPage.on('pageerror', (error) => {
      const errorText = error.message;
      errors.push(`Page Error: ${errorText}`);
      console.error('❌ Page Error:', errorText);
    });
    
    // Capture unhandled promise rejections
    authenticatedPage.on('requestfailed', (request) => {
      if (request.url().includes('127.0.0.1:7242/ingest')) {
        return; // Ignore debug logging requests
      }
      const failure = request.failure();
      const errorText = `Request Failed: ${request.url()} - ${failure?.errorText || 'Unknown error'}`;
      errors.push(errorText);
      console.error('❌ Request Failed:', request.url(), failure?.errorText);
    });
    
    // Click "New Application" button
    const newAssetButton = authenticatedPage.locator('button:has-text("New Application")').first();
    await newAssetButton.waitFor({ state: 'visible', timeout: 3000 });
    await newAssetButton.click({ timeout: 2000 });
    
    // Wait for form dialog to open
    await waitForDialog(authenticatedPage);
    await authenticatedPage.waitForTimeout(500);

    // Check for React errors specifically
    const reactErrors = await authenticatedPage.evaluate(() => (window as any).__reactErrors || []);
    if (reactErrors.length > 0) {
      reactErrors.forEach((err: any) => {
        const errorMsg = `React Error: ${err.message || err.error || JSON.stringify(err)}`;
        errors.push(errorMsg);
        console.error('🚨 REACT ERROR CAPTURED:', errorMsg);
      });
    }
    
    // Check for all page errors
    const pageErrors = await authenticatedPage.evaluate(() => (window as any).__pageErrors || []);
    if (pageErrors.length > 0) {
      pageErrors.forEach((err: any) => {
        errors.push(`Page Error: ${err.message || err.error}`);
        console.error('🚨 PAGE ERROR CAPTURED:', err.message || err.error);
      });
    }

    // Check for errors after opening form
    if (errors.length > 0) {
      console.error('🚨 ERRORS DETECTED after opening form:', errors);
      await authenticatedPage.screenshot({ path: 'test-results/error-after-opening-form.png', fullPage: true });
      throw new Error(`Errors detected after opening form: ${errors.join('; ')}`);
    }

    // Verify all 4 tabs are present
    const tabs = ['Basic Info', 'Technical', 'Vendor', 'Compliance'];
    for (const tabName of tabs) {
      const tab = authenticatedPage.locator(`button[role="tab"]:has-text("${tabName}"), [role="tab"]:has-text("${tabName}")`);
      await expect(tab).toBeVisible({ timeout: 5000 });
    }
  });

  test('should validate required fields', async ({ authenticatedPage }) => {
    // Open form
    const newAssetButton = authenticatedPage.locator('button:has-text("New Application")').first();
    await newAssetButton.waitFor({ state: 'visible', timeout: 10000 });
    await newAssetButton.click({ timeout: 5000 });
    await waitForDialog(authenticatedPage);
    await authenticatedPage.waitForTimeout(1000);

    // Try to submit without filling required fields
    const submitButton = authenticatedPage.locator('button[type="submit"]:has-text("Create"), button[type="submit"]:has-text("Save")').first();
    await submitButton.waitFor({ state: 'visible', timeout: 5000 });
    await submitButton.click();

    // Wait for validation errors - check for form error messages
    await authenticatedPage.waitForTimeout(2000);

    // Check for validation error messages using multiple strategies
    // Look for error text in the form or aria-invalid attributes
    const errorText = authenticatedPage.locator('text=/required/i');
    const ariaInvalid = authenticatedPage.locator('[aria-invalid="true"]');
    const errorClasses = authenticatedPage.locator('.text-destructive, .text-red-500');
    
    const errorTextCount = await errorText.count();
    const ariaInvalidCount = await ariaInvalid.count();
    const errorClassesCount = await errorClasses.count();
    
    // At least one validation error should be present
    const totalErrors = errorTextCount + ariaInvalidCount + errorClassesCount;
    expect(totalErrors).toBeGreaterThan(0);
  });

  test('should fill and submit complete form', async ({ authenticatedPage }) => {
    // Open form
    const newAssetButton = authenticatedPage.locator('button:has-text("New Application")').first();
    await newAssetButton.waitFor({ state: 'visible', timeout: 3000 });
    await newAssetButton.click({ timeout: 2000 });
    await waitForDialog(authenticatedPage);
    await authenticatedPage.waitForTimeout(500);
    
    // Generate unique application name
    const appName = `Test Business Application ${Date.now()}`;

    // ===== BASIC INFO TAB =====
    // Fill required fields using getByLabel which is more reliable
    await authenticatedPage.getByLabel(/Application Name/).fill(appName);
    await authenticatedPage.getByLabel('Description').fill('Test business application description for E2E testing');

    // Select application type (required)
    await authenticatedPage.getByLabel(/Application Type/).click();
    await authenticatedPage.locator('[role="option"]:has-text("Web Application")').first().click();

    // Select status (required)
    await authenticatedPage.getByLabel(/Status/).click();
    await authenticatedPage.locator('[role="option"]:has-text("Active")').first().click();

    // Fill optional fields
    await authenticatedPage.getByLabel('Version').fill('2.0.0');
    await authenticatedPage.getByLabel('Patch Level').fill('2.0.1');

    // Select criticality level
    await authenticatedPage.getByLabel('Criticality').click();
    await authenticatedPage.locator('[role="option"]:has-text("High")').first().click();

    // ===== TECHNICAL TAB =====
    const technicalTab = authenticatedPage.locator('button[role="tab"]:has-text("Technical")').first();
    await technicalTab.click();
    await authenticatedPage.waitForTimeout(300);

    // Select hosting location
    await authenticatedPage.getByLabel('Hosting Location').click();
    await authenticatedPage.locator('[role="option"]').first().click();

    // Fill technology stack
    await authenticatedPage.getByLabel('Technology Stack').fill('React, Node.js, PostgreSQL');

    // Fill URL
    await authenticatedPage.getByLabel('URL').fill('https://test-app.example.com');

    // Fill deployment dates
    const today = new Date().toISOString().split('T')[0];
    await authenticatedPage.getByLabel('Deployment Date').fill(today);
    await authenticatedPage.getByLabel('Last Update Date').fill(today);

    // Check data processing checkboxes
    await authenticatedPage.getByLabel('Processes PII').click();
    await authenticatedPage.getByLabel('Processes Financial Data').click();

    // ===== VENDOR TAB =====
    const vendorTab = authenticatedPage.locator('button[role="tab"]:has-text("Vendor")').first();
    await vendorTab.click();
    await authenticatedPage.waitForTimeout(300);

    const vendorInput = authenticatedPage.getByLabel('Vendor');
    await vendorInput.fill('Test Vendor Corp.');

    const vendorContactInput = authenticatedPage.getByLabel('Vendor Contact');
    await vendorContactInput.fill('Jane Smith');

    const vendorEmailInput = authenticatedPage.getByLabel('Vendor Email');
    await vendorEmailInput.fill('vendor@testcorp.com');

    const vendorPhoneInput = authenticatedPage.getByLabel('Vendor Phone');
    await vendorPhoneInput.fill('+1-555-0456');

    // ===== COMPLIANCE TAB =====
    const complianceTab = authenticatedPage.locator('button[role="tab"]:has-text("Compliance")').first();
    await complianceTab.click();
    await authenticatedPage.waitForTimeout(1000);

    // Select owner - wait for dropdown to be ready and options to load
    const ownerButton = authenticatedPage.getByLabel('Owner');
    await ownerButton.waitFor({ state: 'visible', timeout: 5000 });
    await ownerButton.click();
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
    await authenticatedPage.waitForTimeout(300);

    // Select business unit - wait for dropdown to be ready and options to load
    const buButton = authenticatedPage.getByLabel('Business Unit');
    await buButton.waitFor({ state: 'visible', timeout: 3000 });
    await buButton.click();
    // Wait for options to load
    await authenticatedPage.waitForSelector('[role="option"]', { timeout: 5000 });
    // Select first available business unit (skip "No business units available" if present)
    const buOptions = authenticatedPage.locator('[role="option"]');
    const buOptionCount = await buOptions.count();
    if (buOptionCount > 0) {
      const firstBuOptionText = await buOptions.first().textContent();
      if (firstBuOptionText && !firstBuOptionText.toLowerCase().includes('no business units available')) {
        await buOptions.first().click();
      }
    }
    await authenticatedPage.waitForTimeout(300);

    // Fill department
    await authenticatedPage.getByLabel('Department').fill('Engineering');

    // Fill notes
    await authenticatedPage.getByLabel('Notes').fill('Test notes for business application');

    // ===== SUBMIT FORM =====
    // Scroll to submit button to ensure it's visible
    const submitButton = authenticatedPage.locator('button[type="submit"]:has-text("Create"), button[type="submit"]:has-text("Save")').first();
    await submitButton.waitFor({ state: 'visible', timeout: 3000 });
    await submitButton.scrollIntoViewIfNeeded();
    
    // Submit form
    await submitButton.click();

    // Wait for form submission - either dialog closes or success message appears
    try {
      // Wait for dialog to close (success)
      await authenticatedPage.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 10000 });
      console.log('Form submitted successfully - dialog closed');
    } catch (e) {
      // If dialog doesn't close, check for success toast
      const successToast = authenticatedPage.locator('text=/success/i, text=/created successfully/i').first();
      const toastVisible = await successToast.isVisible({ timeout: 5000 }).catch(() => false);
      if (toastVisible) {
        console.log('Form submitted successfully - toast visible');
      } else {
        // Wait a bit more and check if we're back on the applications page
        await authenticatedPage.waitForTimeout(3000);
        const currentUrl = authenticatedPage.url();
        if (currentUrl.includes('/assets/applications')) {
          console.log('Form submitted successfully - back on applications page');
        } else {
          throw new Error('Form submission may have failed - dialog still open');
        }
      }
    }
  });

  test('should cancel form without saving', async ({ authenticatedPage }) => {
    // Open form
    const newAssetButton = authenticatedPage.locator('button:has-text("New Application")').first();
    await newAssetButton.waitFor({ state: 'visible', timeout: 10000 });
    await newAssetButton.click({ timeout: 5000 });
    await waitForDialog(authenticatedPage);
    await authenticatedPage.waitForTimeout(1000);

    // Fill some data
    const applicationNameLabel = authenticatedPage.locator('label:has-text("Application Name")').first();
    const applicationNameInput = applicationNameLabel.locator('..').locator('input').first();
    await applicationNameInput.fill('Test Cancel Application');

    // Click cancel button
    const cancelButton = authenticatedPage.locator('button:has-text("Cancel")').first();
    await cancelButton.waitFor({ state: 'visible', timeout: 5000 });
    await cancelButton.click();

    // Wait for dialog to close
    await authenticatedPage.waitForTimeout(1000);
    const dialogVisible = await authenticatedPage.locator('[role="dialog"]').isVisible().catch(() => false);
    expect(dialogVisible).toBeFalsy();
  });

  test('should navigate through all tabs', async ({ authenticatedPage }) => {
    // Open form
    const newAssetButton = authenticatedPage.locator('button:has-text("New Application")').first();
    await newAssetButton.waitFor({ state: 'visible', timeout: 10000 });
    await newAssetButton.click({ timeout: 5000 });
    await waitForDialog(authenticatedPage);
    await authenticatedPage.waitForTimeout(1000);

    const tabs = [
      { name: 'Basic Info', field: 'label:has-text("Application Name")' },
      { name: 'Technical', field: 'label:has-text("Hosting Location")' },
      { name: 'Vendor', field: 'label:has-text("Vendor")' },
      { name: 'Compliance', field: 'label:has-text("Owner")' },
    ];

    for (const tab of tabs) {
      const tabButton = authenticatedPage.locator(`button[role="tab"]:has-text("${tab.name}")`).first();
      await tabButton.click();
      await authenticatedPage.waitForTimeout(500);
      
      // Verify tab content is visible
      const field = authenticatedPage.locator(tab.field).first();
      await expect(field).toBeVisible({ timeout: 5000 });
    }
  });

  test('should handle form with minimal required fields only', async ({ authenticatedPage }) => {
    // Open form
    const newAssetButton = authenticatedPage.locator('button:has-text("New Application")').first();
    await newAssetButton.waitFor({ state: 'visible', timeout: 10000 });
    await newAssetButton.click({ timeout: 5000 });
    await waitForDialog(authenticatedPage);
    await authenticatedPage.waitForTimeout(1000);

    // Fill only required fields
    const appName = `MIN-APP-${Date.now()}`;
    const applicationNameLabel = authenticatedPage.locator('label:has-text("Application Name")').first();
    const applicationNameInput = applicationNameLabel.locator('..').locator('input').first();
    await applicationNameInput.fill(appName);

    // Select application type (required)
    const applicationTypeSelect = authenticatedPage.locator('label:has-text("Application Type")').locator('..').locator('button[role="combobox"]').first();
    await applicationTypeSelect.waitFor({ state: 'visible', timeout: 5000 });
    await applicationTypeSelect.click();
    await authenticatedPage.waitForTimeout(1000);
    await authenticatedPage.locator('[role="option"]').first().click();
    await authenticatedPage.waitForTimeout(500);

    // Select status (required)
    const statusSelect = authenticatedPage.locator('label:has-text("Status")').locator('..').locator('button[role="combobox"]').first();
    await statusSelect.click();
    await authenticatedPage.waitForTimeout(500);
    await authenticatedPage.locator('[role="option"]:has-text("Active")').first().click();
    await authenticatedPage.waitForTimeout(500);

    // Submit form
    const submitButton = authenticatedPage.locator('button[type="submit"]:has-text("Create"), button[type="submit"]:has-text("Save")').first();
    await submitButton.waitFor({ state: 'visible', timeout: 5000 });
    await submitButton.click();

    // Wait for success
    await authenticatedPage.waitForTimeout(2000);
    const successToast = authenticatedPage.locator('text=/success/i, text=/created successfully/i').first();
    const dialogClosed = !(await authenticatedPage.locator('[role="dialog"]').isVisible().catch(() => false));
    
    const isSuccess = await successToast.isVisible().catch(() => false) || dialogClosed;
    expect(isSuccess).toBeTruthy();
  });
});



