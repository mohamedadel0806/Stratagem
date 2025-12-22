import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';
import { waitForTable } from '../utils/helpers';
import { verifyFieldIsDropdown, selectDropdownOptionByText } from '../utils/dropdown-helpers';

test.describe('Asset Creation E2E Tests - Fixed Version', () => {
  test.describe('Physical Assets', () => {
    test('should create a new physical asset', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      // Click "Add New Asset" button
      await authenticatedPage.click('button:has-text("Add New Asset"), button:has-text("Create")');
      await authenticatedPage.waitForSelector('form, [role="dialog"]', { timeout: 5000 });

      // Fill basic information
      await authenticatedPage.fill('input[name="uniqueIdentifier"], input[placeholder*="Unique Identifier"]', 'E2E-FIXED-001');
      await authenticatedPage.fill('input[name="assetDescription"], input[placeholder*="Asset Description"]', 'E2E Fixed Test Server');

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
      await expect(authenticatedPage.locator('text=E2E Fixed Test Server').first()).toBeVisible({ timeout: 10000 });
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
      const assetName = `E2E Fixed Info Asset ${Date.now()}`;
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
  });
});