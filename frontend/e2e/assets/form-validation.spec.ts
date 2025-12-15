import { test, expect } from '../fixtures/auth';
import {
  waitForTable,
  fillForm,
  selectDropdownOption,
  waitForDialog,
  closeDialog,
  waitForToast,
  generateRandomString,
  generateRandomEmail
} from '../utils/helpers';

test.describe('Asset Form Validation Tests', () => {
  test.describe('Physical Asset Form Validation', () => {
    test('should validate all required fields in physical asset form', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset"), button:has-text("Create")');
      await waitForDialog(authenticatedPage);

      // Try to submit empty form
      await authenticatedPage.click('button[type="submit"]:has-text("Create"), button:has-text("Save")');

      // Wait for validation errors
      await authenticatedPage.waitForTimeout(1000);

      // Check for required field validation errors
      await expect(authenticatedPage.locator('text=/Asset Description is required/i')).toBeVisible({ timeout: 5000 });
      await expect(authenticatedPage.locator('text=/Unique Identifier is required/i')).toBeVisible({ timeout: 5000 });
    });

    test('should validate MAC address format', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      // Fill basic required fields
      await authenticatedPage.fill('input[name="assetDescription"]', 'Test Server');
      await authenticatedPage.fill('input[name="uniqueIdentifier"]', 'SRV-001');

      // Navigate to Network tab
      await authenticatedPage.click('button:has-text("Network"), [data-testid="tab-network"]');
      await authenticatedPage.waitForTimeout(500);

      // Try to add invalid MAC address
      const addButton = authenticatedPage.locator('button:has-text("Add"), button:has-text("Add MAC")').first();
      if (await addButton.isVisible()) {
        await addButton.click();
        await authenticatedPage.waitForTimeout(500);

        const macInput = authenticatedPage.locator('input[name*="mac"], input[placeholder*="MAC"]').last();
        if (await macInput.isVisible()) {
          await macInput.fill('invalid-mac-address');

          // Trigger validation by blurring
          await macInput.blur();
          await authenticatedPage.waitForTimeout(1000);

          // Should show validation error
          await expect(authenticatedPage.locator('text=/Invalid MAC address format/i')).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test('should validate port number range', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      // Fill basic fields
      await authenticatedPage.fill('input[name="assetDescription"]', 'Test Server');
      await authenticatedPage.fill('input[name="uniqueIdentifier"]', 'SRV-002');

      // Navigate to Network tab
      await authenticatedPage.click('button:has-text("Network")');
      await authenticatedPage.waitForTimeout(500);

      // Try to add invalid port
      const addPortButton = authenticatedPage.locator('button:has-text("Add Port"), button:has-text("Add Network Port")').first();
      if (await addPortButton.isVisible()) {
        await addPortButton.click();
        await authenticatedPage.waitForTimeout(500);

        const portInput = authenticatedPage.locator('input[name*="port"], input[placeholder*="Port"]').last();
        if (await portInput.isVisible()) {
          await portInput.fill('99999'); // Invalid port number
          await portInput.blur();
          await authenticatedPage.waitForTimeout(1000);

          // Should show validation error
          await expect(authenticatedPage.locator('text=/Port must be between 1 and 65535/i')).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test('should validate email format in contact fields', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      // Fill basic fields
      await authenticatedPage.fill('input[name="assetDescription"]', 'Test Server');
      await authenticatedPage.fill('input[name="uniqueIdentifier"]', 'SRV-003');

      // Navigate to Ownership tab
      await authenticatedPage.click('button:has-text("Ownership")');
      await authenticatedPage.waitForTimeout(500);

      // Try invalid email
      const emailInput = authenticatedPage.locator('input[name*="email"], input[type="email"]').first();
      if (await emailInput.isVisible()) {
        await emailInput.fill('invalid-email');
        await emailInput.blur();
        await authenticatedPage.waitForTimeout(1000);

        await expect(authenticatedPage.locator('text=/Invalid email format/i')).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Information Asset Form Validation', () => {
    test('should validate required fields in information asset form', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/information');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      // Try to submit empty form
      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(1000);

      // Check validation errors
      await expect(authenticatedPage.locator('text=/Asset Name is required/i')).toBeVisible({ timeout: 5000 });
      await expect(authenticatedPage.locator('text=/Information Type is required/i')).toBeVisible({ timeout: 5000 });
      await expect(authenticatedPage.locator('text=/Data Classification is required/i')).toBeVisible({ timeout: 5000 });
    });

    test('should validate retention period format', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/information');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      // Fill required fields
      await authenticatedPage.fill('input[name="assetName"]', 'Test Document');
      await authenticatedPage.fill('input[name="informationType"]', 'Legal Documents');

      // Select classification
      const classificationField = authenticatedPage.locator('button[data-testid="dataClassification"], [data-testid="dataClassification"]').first();
      if (await classificationField.isVisible()) {
        await selectDropdownOption(authenticatedPage, classificationField, 'Internal');
      }

      // Navigate to Storage tab
      await authenticatedPage.click('button:has-text("Storage")');
      await authenticatedPage.waitForTimeout(500);

      // Try invalid retention period
      const retentionInput = authenticatedPage.locator('input[name*="retention"], input[placeholder*="Retention"]').first();
      if (await retentionInput.isVisible()) {
        await retentionInput.fill('invalid-period');
        await retentionInput.blur();
        await authenticatedPage.waitForTimeout(1000);

        await expect(authenticatedPage.locator('text=/Invalid retention period format/i')).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Software Asset Form Validation', () => {
    test('should validate license expiry date', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/software');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      // Fill required fields
      await authenticatedPage.fill('input[name="softwareName"]', 'Test Software');

      // Navigate to Licensing tab
      await authenticatedPage.click('button:has-text("Licensing")');
      await authenticatedPage.waitForTimeout(500);

      // Fill license fields with invalid date
      const expiryInput = authenticatedPage.locator('input[name*="expiry"], input[placeholder*="Expiry"]').first();
      if (await expiryInput.isVisible()) {
        await expiryInput.fill('2020-01-01'); // Past date
        await expiryInput.blur();
        await authenticatedPage.waitForTimeout(1000);

        // Should show warning about expired license
        await expect(authenticatedPage.locator('text=/License expiry date cannot be in the past/i')).toBeVisible({ timeout: 5000 });
      }
    });

    test('should validate license count format', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/software');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      await authenticatedPage.fill('input[name="softwareName"]', 'Test Software 2');

      // Navigate to Licensing tab
      await authenticatedPage.click('button:has-text("Licensing")');
      await authenticatedPage.waitForTimeout(500);

      // Try invalid license count
      const licenseCountInput = authenticatedPage.locator('input[name*="licenseCount"], input[name*="count"]').first();
      if (await licenseCountInput.isVisible()) {
        await licenseCountInput.fill('-5'); // Negative count
        await licenseCountInput.blur();
        await authenticatedPage.waitForTimeout(1000);

        await expect(authenticatedPage.locator('text=/License count must be positive/i')).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Business Application Form Validation', () => {
    test('should validate required fields in business application form', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/applications');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      // Try to submit empty form
      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(1000);

      await expect(authenticatedPage.locator('text=/Application Name is required/i')).toBeVisible({ timeout: 5000 });
      await expect(authenticatedPage.locator('text=/Application Type is required/i')).toBeVisible({ timeout: 5000 });
      await expect(authenticatedPage.locator('text=/Status is required/i')).toBeVisible({ timeout: 5000 });
    });

    test('should validate URL format', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/applications');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      // Fill required fields
      await authenticatedPage.fill('input[name="applicationName"]', 'Test App');

      // Try to set invalid URL
      const urlInput = authenticatedPage.locator('input[name*="url"], input[type="url"]').first();
      if (await urlInput.isVisible()) {
        await urlInput.fill('not-a-valid-url');
        await urlInput.blur();
        await authenticatedPage.waitForTimeout(1000);

        await expect(authenticatedPage.locator('text=/Invalid URL format/i')).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Supplier Form Validation', () => {
    test('should validate required fields in supplier form', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/suppliers');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      // Try to submit empty form
      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(1000);

      await expect(authenticatedPage.locator('text=/Supplier Name is required/i')).toBeVisible({ timeout: 5000 });
    });

    test('should validate phone number format', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/suppliers');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      // Fill required field
      await authenticatedPage.fill('input[name="supplierName"]', 'Test Supplier');

      // Try invalid phone
      const phoneInput = authenticatedPage.locator('input[name*="phone"], input[type="tel"]').first();
      if (await phoneInput.isVisible()) {
        await phoneInput.fill('abc-def-ghij'); // Invalid format
        await phoneInput.blur();
        await authenticatedPage.waitForTimeout(1000);

        await expect(authenticatedPage.locator('text=/Invalid phone number format/i')).toBeVisible({ timeout: 5000 });
      }
    });

    test('should auto-generate unique identifier', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/suppliers');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      // Fill only required field
      await authenticatedPage.fill('input[name="supplierName"]', 'Auto ID Test Supplier');

      // Submit form
      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(3000);

      // Should succeed and auto-generate ID
      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator('text=Auto ID Test Supplier').first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Cross-field Validation', () => {
    test('should validate date ranges in contract information', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/suppliers');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      await authenticatedPage.fill('input[name="supplierName"]', 'Date Range Test Supplier');

      // Navigate to contract section if it exists
      const contractTab = authenticatedPage.locator('button:has-text("Contract"), button:has-text("Agreement")').first();
      if (await contractTab.isVisible()) {
        await contractTab.click();
        await authenticatedPage.waitForTimeout(500);

        // Set end date before start date
        const startDateInput = authenticatedPage.locator('input[name*="startDate"], input[placeholder*="Start Date"]').first();
        const endDateInput = authenticatedPage.locator('input[name*="endDate"], input[placeholder*="End Date"]').first();

        if (await startDateInput.isVisible() && await endDateInput.isVisible()) {
          await startDateInput.fill('2024-12-31');
          await endDateInput.fill('2024-01-01');
          await endDateInput.blur();
          await authenticatedPage.waitForTimeout(1000);

          await expect(authenticatedPage.locator('text=/End date must be after start date/i')).toBeVisible({ timeout: 5000 });
        }
      }
    });
  });
});