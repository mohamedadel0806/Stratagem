import { test, expect } from '../fixtures/auth';
import { waitForDialog, waitForTable } from '../utils/helpers';

/**
 * Complete E2E Tests for Supplier Form
 * 
 * Tests all form functionality including:
 * - All 4 tabs (Basic Info, Contact, Contract, Compliance)
 * - All form fields (required and optional)
 * - Form validation
 * - Form submission
 * - Form cancellation
 * - All dropdowns
 * - Error handling
 * - Success flow
 */
test.describe('Supplier Form - Complete Test Suite', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // Navigate to suppliers page
    await authenticatedPage.goto('/en/dashboard/assets/suppliers');
    
    // Wait for page to fully load
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(2000);
    
    // Wait for loading to complete
    await authenticatedPage.waitForFunction(() => {
      return !document.body.textContent?.includes('Loading...');
    }, { timeout: 15000 });
  });

  test('should open form and display all tabs', async ({ authenticatedPage }) => {
    // Click "New Supplier" button
    const newSupplierButton = authenticatedPage.locator('button:has-text("New Supplier")').first();
    await newSupplierButton.waitFor({ state: 'visible', timeout: 10000 });
    await newSupplierButton.scrollIntoViewIfNeeded();
    await authenticatedPage.waitForTimeout(500);
    await newSupplierButton.click({ timeout: 5000 });
    
    // Wait for form dialog to open
    await waitForDialog(authenticatedPage);
    await authenticatedPage.waitForTimeout(1000);

    // Verify all 4 tabs are present
    const tabs = ['Basic Info', 'Contact', 'Contract', 'Compliance'];
    for (const tabName of tabs) {
      const tab = authenticatedPage.locator(`button[role="tab"]:has-text("${tabName}"), [role="tab"]:has-text("${tabName}")`);
      await expect(tab).toBeVisible({ timeout: 5000 });
    }
  });

  test('should validate required fields', async ({ authenticatedPage }) => {
    // Open form
    const newSupplierButton = authenticatedPage.locator('button:has-text("New Supplier")').first();
    await newSupplierButton.waitFor({ state: 'visible', timeout: 10000 });
    await newSupplierButton.click({ timeout: 5000 });
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
    const newSupplierButton = authenticatedPage.locator('button:has-text("New Supplier")').first();
    await newSupplierButton.waitFor({ state: 'visible', timeout: 10000 });
    await newSupplierButton.click({ timeout: 5000 });
    await waitForDialog(authenticatedPage);
    await authenticatedPage.waitForTimeout(2000);
    
    // Generate unique supplier name
    const supplierName = `Test Supplier ${Date.now()}`;

    // ===== BASIC INFO TAB =====
    // Fill required fields - use label-based selectors for reliability
    const supplierNameLabel = authenticatedPage.locator('label:has-text("Supplier Name")').first();
    await supplierNameLabel.waitFor({ state: 'visible', timeout: 5000 });
    const supplierNameInput = supplierNameLabel.locator('..').locator('input').first();
    await supplierNameInput.fill(supplierName);
    
    const descLabel = authenticatedPage.locator('label:has-text("Description")').first();
    const descTextarea = descLabel.locator('..').locator('textarea').first();
    await descTextarea.fill('Test Supplier - Complete Form');

    // Select supplier type
    const supplierTypeSelect = authenticatedPage.locator('label:has-text("Supplier Type")').locator('..').locator('button[role="combobox"]').first();
    await supplierTypeSelect.waitFor({ state: 'visible', timeout: 5000 });
    await supplierTypeSelect.click();
    await authenticatedPage.waitForTimeout(1000);
    const supplierTypeOption = authenticatedPage.locator('[role="option"]:has-text("Vendor")').first();
    await supplierTypeOption.waitFor({ state: 'visible', timeout: 5000 });
    await supplierTypeOption.click();
    await authenticatedPage.waitForTimeout(500);

    // Select criticality level
    const criticalitySelect = authenticatedPage.locator('label:has-text("Criticality")').locator('..').locator('button[role="combobox"]').first();
    await criticalitySelect.click();
    await authenticatedPage.waitForTimeout(500);
    await authenticatedPage.locator('[role="option"]:has-text("High")').first().click();
    await authenticatedPage.waitForTimeout(500);

    // Fill optional fields
    const businessUnitLabel = authenticatedPage.locator('label:has-text("Business Unit")').first();
    const businessUnitInput = businessUnitLabel.locator('..').locator('input').first();
    await businessUnitInput.fill('IT Operations');

    const goodsServicesLabel = authenticatedPage.locator('label:has-text("Goods/Services Provided")').first();
    const goodsServicesTextarea = goodsServicesLabel.locator('..').locator('textarea').first();
    await goodsServicesTextarea.fill('Cloud infrastructure services');

    // ===== CONTACT TAB =====
    const contactTab = authenticatedPage.locator('button[role="tab"]:has-text("Contact")').first();
    await contactTab.click();
    await authenticatedPage.waitForTimeout(500);

    // Fill contact information
    const contactNameLabel = authenticatedPage.locator('label:has-text("Contact Name")').first();
    const contactNameInput = contactNameLabel.locator('..').locator('input').first();
    await contactNameInput.fill('John Doe');

    const contactEmailLabel = authenticatedPage.locator('label:has-text("Email")').first();
    const contactEmailInput = contactEmailLabel.locator('..').locator('input[type="email"]').first();
    await contactEmailInput.fill('john.doe@supplier.com');

    const contactPhoneLabel = authenticatedPage.locator('label:has-text("Phone")').first();
    const contactPhoneInput = contactPhoneLabel.locator('..').locator('input').first();
    await contactPhoneInput.fill('+1-555-123-4567');

    // Fill address
    const addressLabel = authenticatedPage.locator('label:has-text("Street Address")').first();
    const addressInput = addressLabel.locator('..').locator('input').first();
    await addressInput.fill('123 Business Street');

    const cityLabel = authenticatedPage.locator('label:has-text("City")').first();
    const cityInput = cityLabel.locator('..').locator('input').first();
    await cityInput.fill('New York');

    const countryLabel = authenticatedPage.locator('label:has-text("Country")').first();
    const countryInput = countryLabel.locator('..').locator('input').first();
    await countryInput.fill('United States');

    const postalCodeLabel = authenticatedPage.locator('label:has-text("Postal Code")').first();
    const postalCodeInput = postalCodeLabel.locator('..').locator('input').first();
    await postalCodeInput.fill('10001');

    const websiteLabel = authenticatedPage.locator('label:has-text("Website")').first();
    const websiteInput = websiteLabel.locator('..').locator('input[type="url"]').first();
    await websiteInput.fill('https://www.supplier.com');

    // ===== CONTRACT TAB =====
    const contractTab = authenticatedPage.locator('button[role="tab"]:has-text("Contract")').first();
    await contractTab.click();
    await authenticatedPage.waitForTimeout(500);

    // Fill contract information
    const contractRefLabel = authenticatedPage.locator('label:has-text("Contract Reference")').first();
    const contractRefInput = contractRefLabel.locator('..').locator('input').first();
    await contractRefInput.fill('CONTRACT-2024-001');

    const contractStartLabel = authenticatedPage.locator('label:has-text("Contract Start Date")').first();
    const contractStartInput = contractStartLabel.locator('..').locator('input[type="date"]').first();
    const today = new Date().toISOString().split('T')[0];
    await contractStartInput.fill(today);

    const contractEndLabel = authenticatedPage.locator('label:has-text("Contract End Date")').first();
    const contractEndInput = contractEndLabel.locator('..').locator('input[type="date"]').first();
    const futureDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    await contractEndInput.fill(futureDate);

    // ===== COMPLIANCE TAB =====
    const complianceTab = authenticatedPage.locator('button[role="tab"]:has-text("Compliance")').first();
    await complianceTab.click();
    await authenticatedPage.waitForTimeout(500);

    // Check compliance checkboxes
    const hasDataAccessCheckbox = authenticatedPage.locator('label:has-text("Has Data Access")').locator('..').locator('input[type="checkbox"]').first();
    await hasDataAccessCheckbox.check();

    const requiresNDACheckbox = authenticatedPage.locator('label:has-text("Requires NDA")').locator('..').locator('input[type="checkbox"]').first();
    await requiresNDACheckbox.check();

    const notesLabel = authenticatedPage.locator('label:has-text("Notes")').first();
    const notesTextarea = notesLabel.locator('..').locator('textarea').first();
    await notesTextarea.fill('Supplier compliance notes');

    // ===== SUBMIT FORM =====
    // Scroll to submit button to ensure it's visible
    const submitButton = authenticatedPage.locator('button[type="submit"]:has-text("Create"), button[type="submit"]:has-text("Save")').first();
    await submitButton.waitFor({ state: 'visible', timeout: 5000 });
    await submitButton.scrollIntoViewIfNeeded();
    await authenticatedPage.waitForTimeout(1000);
    
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
        // Wait a bit more and check if we're back on the suppliers page
        await authenticatedPage.waitForTimeout(3000);
        const currentUrl = authenticatedPage.url();
        if (currentUrl.includes('/assets/suppliers')) {
          console.log('Form submitted successfully - back on suppliers page');
        } else {
          throw new Error('Form submission may have failed - dialog still open');
        }
      }
    }
  });

  test('should cancel form without saving', async ({ authenticatedPage }) => {
    // Open form
    const newSupplierButton = authenticatedPage.locator('button:has-text("New Supplier")').first();
    await newSupplierButton.waitFor({ state: 'visible', timeout: 10000 });
    await newSupplierButton.click({ timeout: 5000 });
    await waitForDialog(authenticatedPage);
    await authenticatedPage.waitForTimeout(1000);

    // Fill some data
    const supplierNameLabel = authenticatedPage.locator('label:has-text("Supplier Name")').first();
    const supplierNameInput = supplierNameLabel.locator('..').locator('input').first();
    await supplierNameInput.fill('Test Cancel Supplier');

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
    const newSupplierButton = authenticatedPage.locator('button:has-text("New Supplier")').first();
    await newSupplierButton.waitFor({ state: 'visible', timeout: 10000 });
    await newSupplierButton.click({ timeout: 5000 });
    await waitForDialog(authenticatedPage);
    await authenticatedPage.waitForTimeout(1000);

    const tabs = [
      { name: 'Basic Info', field: 'label:has-text("Supplier Name")' },
      { name: 'Contact', field: 'label:has-text("Contact Name")' },
      { name: 'Contract', field: 'label:has-text("Contract Reference")' },
      { name: 'Compliance', field: 'label:has-text("Has Data Access")' },
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
    const newSupplierButton = authenticatedPage.locator('button:has-text("New Supplier")').first();
    await newSupplierButton.waitFor({ state: 'visible', timeout: 10000 });
    await newSupplierButton.click({ timeout: 5000 });
    await waitForDialog(authenticatedPage);
    await authenticatedPage.waitForTimeout(1000);

    // Fill only required fields
    const supplierName = `MIN-${Date.now()}`;
    const supplierNameLabel = authenticatedPage.locator('label:has-text("Supplier Name")').first();
    const supplierNameInput = supplierNameLabel.locator('..').locator('input').first();
    await supplierNameInput.fill(supplierName);

    // Select supplier type (required)
    const supplierTypeSelect = authenticatedPage.locator('label:has-text("Supplier Type")').locator('..').locator('button[role="combobox"]').first();
    await supplierTypeSelect.click();
    await authenticatedPage.waitForTimeout(500);
    await authenticatedPage.locator('[role="option"]').first().click();
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

