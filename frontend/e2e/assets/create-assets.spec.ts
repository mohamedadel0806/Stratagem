import { test, expect } from '../fixtures/auth';
import { waitForTable } from '../utils/helpers';
import { verifyFieldIsDropdown, selectDropdownOptionByText } from '../utils/dropdown-helpers';

test.describe('Asset Creation E2E Tests', () => {
  test.describe('Physical Assets', () => {
    test('should create a new physical asset', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      // Click "Add New Asset" button
      await authenticatedPage.click('button:has-text("Add New Asset"), button:has-text("Create")');
      await authenticatedPage.waitForSelector('form, [role="dialog"]', { timeout: 5000 });

      // Fill basic information
      await authenticatedPage.fill('input[name="uniqueIdentifier"], input[placeholder*="Unique Identifier"]', 'E2E-TEST-001');
      await authenticatedPage.fill('input[name="assetDescription"], input[placeholder*="Asset Description"]', 'E2E Test Server');
      
      // Verify Asset Type is a dropdown (not text input)
      await verifyFieldIsDropdown(authenticatedPage, 'assetTypeId');
      
      // Select asset type from dropdown if options are available
      const assetTypeField = authenticatedPage.locator('[name="assetTypeId"]').first();
      await assetTypeField.click();
      await authenticatedPage.waitForTimeout(500);
      const assetTypeOptions = authenticatedPage.locator('[role="option"]');
      if (await assetTypeOptions.count() > 0) {
        await assetTypeOptions.first().click();
        await authenticatedPage.waitForTimeout(300);
      } else {
        await authenticatedPage.keyboard.press('Escape');
      }

      // Fill criticality level
      const criticalityField = authenticatedPage.locator('select[name="criticalityLevel"], input[name="criticalityLevel"]').first();
      if (await criticalityField.count() > 0) {
        await criticalityField.selectOption('high');
      }

      // Submit form
      await authenticatedPage.click('button[type="submit"]:has-text("Create"), button:has-text("Save")');
      await authenticatedPage.waitForTimeout(3000);

      // Verify asset appears in list
      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator('text=E2E Test Server').first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Information Assets', () => {
    test('should create a new information asset', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/information');
      await waitForTable(authenticatedPage);

      // Click "Add New Asset" button
      await authenticatedPage.click('button:has-text("Add New Asset"), button:has-text("Create")');
      await authenticatedPage.waitForSelector('form, [role="dialog"]', { timeout: 5000 });

      // Fill required fields
      const assetName = `E2E Test Info Asset ${Date.now()}`;
      await authenticatedPage.fill('input[name="assetName"], input[placeholder*="Asset Name"]', assetName);
      await authenticatedPage.fill('input[name="informationType"], input[placeholder*="Information Type"]', 'Customer Records');
      
      // Select data classification
      const classificationField = authenticatedPage.locator('select[name="dataClassification"], input[name="dataClassification"]').first();
      if (await classificationField.count() > 0) {
        await classificationField.selectOption('confidential');
      }

      // Submit form
      await authenticatedPage.click('button[type="submit"]:has-text("Create"), button:has-text("Save")');
      await authenticatedPage.waitForTimeout(3000);

      // Verify asset appears in list
      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator(`text=${assetName}`).first()).toBeVisible({ timeout: 10000 });
    });

    test('should show validation error if informationType is missing', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/information');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset"), button:has-text("Create")');
      await authenticatedPage.waitForSelector('form, [role="dialog"]', { timeout: 5000 });

      // Fill only assetName, leave informationType empty
      await authenticatedPage.fill('input[name="assetName"]', 'Test Asset');

      // Try to submit
      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(1000);

      // Verify validation error appears
      await expect(authenticatedPage.locator('text=/Information type is required/i')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Software Assets', () => {
    test('should create a new software asset', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/software');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset"), button:has-text("Create")');
      await authenticatedPage.waitForSelector('form, [role="dialog"]', { timeout: 5000 });

      const softwareName = `E2E Test Software ${Date.now()}`;
      await authenticatedPage.fill('input[name="softwareName"], input[placeholder*="Software Name"]', softwareName);
      
      // Fill vendor information
      await authenticatedPage.fill('input[name="vendor"], input[placeholder*="Vendor"]', 'Microsoft');
      await authenticatedPage.fill('input[name="version"], input[placeholder*="Version"]', '2021');

      // Submit form
      await authenticatedPage.click('button[type="submit"]:has-text("Create"), button:has-text("Save")');
      await authenticatedPage.waitForTimeout(3000);

      // Verify asset appears in list
      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator(`text=${softwareName}`).first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Business Applications', () => {
    test('should create a new business application', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/applications');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset"), button:has-text("Create")');
      await authenticatedPage.waitForSelector('form, [role="dialog"]', { timeout: 5000 });

      const appName = `E2E Test App ${Date.now()}`;
      await authenticatedPage.fill('input[name="applicationName"], input[placeholder*="Application Name"]', appName);
      
      await authenticatedPage.fill('input[name="vendor"], input[placeholder*="Vendor"]', 'Salesforce');
      await authenticatedPage.fill('input[name="url"], input[placeholder*="URL"]', 'https://app.example.com');

      // Submit form
      await authenticatedPage.click('button[type="submit"]:has-text("Create"), button:has-text("Save")');
      await authenticatedPage.waitForTimeout(3000);

      // Verify asset appears in list
      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator(`text=${appName}`).first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Suppliers', () => {
    test('should create a new supplier', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/suppliers');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset"), button:has-text("Create")');
      await authenticatedPage.waitForSelector('form, [role="dialog"]', { timeout: 5000 });

      const supplierName = `E2E Test Supplier ${Date.now()}`;
      await authenticatedPage.fill('input[name="supplierName"], input[placeholder*="Supplier Name"]', supplierName);
      
      // Fill contact information
      await authenticatedPage.fill('input[name="primaryContactName"], input[placeholder*="Contact Name"]', 'John Doe');
      await authenticatedPage.fill('input[name="primaryContactEmail"], input[placeholder*="Email"]', 'john@example.com');

      // Submit form
      await authenticatedPage.click('button[type="submit"]:has-text("Create"), button:has-text("Save")');
      await authenticatedPage.waitForTimeout(3000);

      // Verify asset appears in list
      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator(`text=${supplierName}`).first()).toBeVisible({ timeout: 10000 });
    });

    test('should auto-generate uniqueIdentifier if not provided', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/suppliers');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset"), button:has-text("Create")');
      await authenticatedPage.waitForSelector('form, [role="dialog"]', { timeout: 5000 });

      // Don't fill supplierIdentifier, just fill required name
      await authenticatedPage.fill('input[name="supplierName"]', 'Test Supplier');

      // Submit form
      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(3000);

      // Verify success (uniqueIdentifier should be auto-generated)
      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator('text=Test Supplier').first()).toBeVisible({ timeout: 10000 });
    });
  });
});




