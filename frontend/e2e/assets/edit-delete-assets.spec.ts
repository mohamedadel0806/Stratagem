import { test, expect } from '../fixtures/auth';
import {
  waitForTable,
  selectDropdownOption,
  waitForDialog,
  closeDialog,
  navigateToDetails,
  waitForToast,
  generateRandomString,
  generateRandomEmail,
  search
} from '../utils/helpers';

test.describe('Asset Edit and Delete Tests', () => {
  test.describe('Physical Asset Edit/Delete', () => {
    test('should edit physical asset successfully', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      // First create a physical asset to edit
      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      const assetDescription = `Edit Test Server ${generateRandomString()}`;
      await authenticatedPage.fill('input[name="assetDescription"]', assetDescription);
      await authenticatedPage.fill('input[name="uniqueIdentifier"]', 'SRV-EDIT-001');

      // Submit form
      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(3000);

      // Verify asset was created
      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator(`text=${assetDescription}`).first()).toBeVisible({ timeout: 10000 });

      // Navigate to edit the asset
      await search(authenticatedPage, assetDescription);
      await authenticatedPage.waitForTimeout(1000);

      // Find and click edit button
      const editButton = authenticatedPage.locator('button[aria-label*="Edit"], button:has-text("Edit")').first();
      await expect(editButton).toBeVisible({ timeout: 5000 });
      await editButton.click();

      await waitForDialog(authenticatedPage);

      // Edit the asset
      const newDescription = `${assetDescription} - Updated`;
      await authenticatedPage.fill('input[name="assetDescription"]', newDescription);

      // Navigate to Network tab and add information
      await authenticatedPage.click('button:has-text("Network")');
      await authenticatedPage.waitForTimeout(500);

      await authenticatedPage.fill('input[name*="hostname"], input[placeholder*="Hostname"]', 'updated-server.example.com');
      await authenticatedPage.fill('input[name*="ip"], input[placeholder*="IP Address"]', '192.168.1.200');

      // Submit the edit
      await authenticatedPage.click('button[type="submit"]:has-text("Save"), button:has-text("Update")');
      await authenticatedPage.waitForTimeout(3000);

      // Verify the update
      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator(`text=${newDescription}`).first()).toBeVisible({ timeout: 10000 });
    });

    test('should delete physical asset with confirmation', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      // Create an asset to delete
      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      const assetDescription = `Delete Test Server ${generateRandomString()}`;
      await authenticatedPage.fill('input[name="assetDescription"]', assetDescription);
      await authenticatedPage.fill('input[name="uniqueIdentifier"]', 'SRV-DEL-001');

      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(3000);

      // Verify asset exists
      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator(`text=${assetDescription}`).first()).toBeVisible({ timeout: 10000 });

      // Find and delete the asset
      await search(authenticatedPage, assetDescription);
      await authenticatedPage.waitForTimeout(1000);

      const deleteButton = authenticatedPage.locator('button[aria-label*="Delete"], button:has-text("Delete")').first();
      await expect(deleteButton).toBeVisible({ timeout: 5000 });
      await deleteButton.click();

      // Handle confirmation dialog
      await authenticatedPage.waitForSelector('[role="dialog"], .modal', { timeout: 5000 });

      const confirmButton = authenticatedPage.locator('button:has-text("Delete"), button:has-text("Confirm"), button[aria-label*="Confirm"]').first();
      await confirmButton.click();

      await authenticatedPage.waitForTimeout(2000);

      // Verify asset is deleted
      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator(`text=${assetDescription}`)).not.toBeVisible({ timeout: 10000 });
    });

    test('should handle bulk delete operations', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      // Create multiple assets for bulk delete test
      const assetNames = [];
      for (let i = 1; i <= 3; i++) {
        await authenticatedPage.click('button:has-text("Add New Asset")');
        await waitForDialog(authenticatedPage);

        const assetDescription = `Bulk Delete Server ${i}-${generateRandomString()}`;
        assetNames.push(assetDescription);

        await authenticatedPage.fill('input[name="assetDescription"]', assetDescription);
        await authenticatedPage.fill('input[name="uniqueIdentifier"]', `SRV-BULK-${i}`);

        await authenticatedPage.click('button[type="submit"]:has-text("Create")');
        await authenticatedPage.waitForTimeout(2000);

        await waitForTable(authenticatedPage);
      }

      // Verify all assets were created
      for (const name of assetNames) {
        await expect(authenticatedPage.locator(`text=${name}`).first()).toBeVisible({ timeout: 10000 });
      }

      // Test bulk selection if available
      const selectAllCheckbox = authenticatedPage.locator('input[type="checkbox"][aria-label*="Select all"], th input[type="checkbox"]').first();
      if (await selectAllCheckbox.isVisible()) {
        await selectAllCheckbox.check();
        await authenticatedPage.waitForTimeout(1000);

        // Look for bulk actions
        const bulkActionsButton = authenticatedPage.locator('button:has-text("Bulk Actions"), button:has-text("Actions")').first();
        if (await bulkActionsButton.isVisible()) {
          await bulkActionsButton.click();
          await authenticatedPage.waitForTimeout(500);

          const bulkDeleteButton = authenticatedPage.locator('button:has-text("Delete Selected"), button:has-text("Bulk Delete")').first();
          if (await bulkDeleteButton.isVisible()) {
            await bulkDeleteButton.click();

            // Handle bulk delete confirmation
            await authenticatedPage.waitForSelector('[role="dialog"], .modal', { timeout: 5000 });
            const confirmBulkDelete = authenticatedPage.locator('button:has-text("Delete"), button:has-text("Confirm")').first();
            await confirmBulkDelete.click();

            await authenticatedPage.waitForTimeout(3000);

            // Verify all assets are deleted
            await waitForTable(authenticatedPage);
            for (const name of assetNames) {
              await expect(authenticatedPage.locator(`text=${name}`)).not.toBeVisible({ timeout: 10000 });
            }
          }
        }
      }
    });
  });

  test.describe('Information Asset Edit/Delete', () => {
    test('should edit information asset and update classification', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/information');
      await waitForTable(authenticatedPage);

      // Create information asset
      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      const assetName = `Edit Test Document ${generateRandomString()}`;
      await authenticatedPage.fill('input[name="assetName"]', assetName);
      await authenticatedPage.fill('input[name="informationType"]', 'Test Documents');

      // Set initial classification
      const classificationField = authenticatedPage.locator('button[data-testid="dataClassification"], [data-testid="dataClassification"]').first();
      if (await classificationField.isVisible()) {
        await selectDropdownOption(authenticatedPage, classificationField, 'Internal');
      }

      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(3000);

      // Verify creation
      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator(`text=${assetName}`).first()).toBeVisible({ timeout: 10000 });

      // Edit the asset
      await search(authenticatedPage, assetName);
      await authenticatedPage.waitForTimeout(1000);

      const editButton = authenticatedPage.locator('button[aria-label*="Edit"], button:has-text("Edit")').first();
      await editButton.click();

      await waitForDialog(authenticatedPage);

      // Navigate to Classification tab
      await authenticatedPage.click('button:has-text("Classification")');
      await authenticatedPage.waitForTimeout(500);

      // Update classification to Confidential
      const updatedClassificationField = authenticatedPage.locator('button[data-testid="dataClassification"], [data-testid="dataClassification"]').first();
      if (await updatedClassificationField.isVisible()) {
        await selectDropdownOption(authenticatedPage, updatedClassificationField, 'Confidential');
      }

      // Add sensitive data types
      const piiCheckbox = authenticatedPage.locator('input[name*="pii"], input[name*="PII"]').first();
      if (await piiCheckbox.isVisible()) {
        await piiCheckbox.check();
      }

      const financialCheckbox = authenticatedPage.locator('input[name*="financial"], input[name*="Financial"]').first();
      if (await financialCheckbox.isVisible()) {
        await financialCheckbox.check();
      }

      // Save changes
      await authenticatedPage.click('button[type="submit"]:has-text("Save"), button:has-text("Update")');
      await authenticatedPage.waitForTimeout(3000);

      // Verify updates
      await navigateToDetails(authenticatedPage);

      // Look for updated classification indicators
      await expect(authenticatedPage.locator('text=Confidential').first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Software Asset Edit/Delete', () => {
    test('should edit software asset and update license information', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/software');
      await waitForTable(authenticatedPage);

      // Create software asset
      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      const softwareName = `Edit Test Software ${generateRandomString()}`;
      await authenticatedPage.fill('input[name="softwareName"]', softwareName);

      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(3000);

      // Verify creation
      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator(`text=${softwareName}`).first()).toBeVisible({ timeout: 10000 });

      // Edit the software asset
      await search(authenticatedPage, softwareName);
      await authenticatedPage.waitForTimeout(1000);

      const editButton = authenticatedPage.locator('button[aria-label*="Edit"], button:has-text("Edit")').first();
      await editButton.click();

      await waitForDialog(authenticatedPage);

      // Navigate to Licensing tab
      await authenticatedPage.click('button:has-text("Licensing")');
      await authenticatedPage.waitForTimeout(500);

      // Update license information
      const licenseTypeField = authenticatedPage.locator('select[name*="licenseType"], [data-testid="licenseType"]').first();
      if (await licenseTypeField.isVisible()) {
        await selectDropdownOption(authenticatedPage, licenseTypeField, 'Commercial');
      }

      const licenseKeyInput = authenticatedPage.locator('input[name*="licenseKey"], input[placeholder*="License Key"]').first();
      if (await licenseKeyInput.isVisible()) {
        await licenseKeyInput.fill('LICENSE-KEY-123-456');
      }

      const licenseCountInput = authenticatedPage.locator('input[name*="licenseCount"], input[name*="count"]').first();
      if (await licenseCountInput.isVisible()) {
        await licenseCountInput.fill('50');
      }

      // Set future expiry date
      const expiryInput = authenticatedPage.locator('input[name*="expiry"], input[placeholder*="Expiry"]').first();
      if (await expiryInput.isVisible()) {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 2);
        await expiryInput.fill(futureDate.toISOString().split('T')[0]);
      }

      // Save changes
      await authenticatedPage.click('button[type="submit"]:has-text("Save"), button:has-text("Update")');
      await authenticatedPage.waitForTimeout(3000);

      // Verify updates
      await navigateToDetails(authenticatedPage);

      // Look for license information in details
      await expect(authenticatedPage.locator('text=LICENSE-KEY-123-456').first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Business Application Edit/Delete', () => {
    test('should edit business application and update technical details', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/applications');
      await waitForTable(authenticatedPage);

      // Create business application
      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      const appName = `Edit Test App ${generateRandomString()}`;
      await authenticatedPage.fill('input[name="applicationName"]', appName);

      const applicationTypeField = authenticatedPage.locator('button[data-testid="applicationType"], [data-testid="applicationType"]').first();
      if (await applicationTypeField.isVisible()) {
        await selectDropdownOption(authenticatedPage, applicationTypeField, 'Web Application');
      }

      const statusField = authenticatedPage.locator('button[data-testid="status"], [data-testid="status"]').first();
      if (await statusField.isVisible()) {
        await selectDropdownOption(authenticatedPage, statusField, 'Development');
      }

      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(3000);

      // Verify creation
      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator(`text=${appName}`).first()).toBeVisible({ timeout: 10000 });

      // Edit the application
      await search(authenticatedPage, appName);
      await authenticatedPage.waitForTimeout(1000);

      const editButton = authenticatedPage.locator('button[aria-label*="Edit"], button:has-text("Edit")').first();
      await editButton.click();

      await waitForDialog(authenticatedPage);

      // Update status
      const updatedStatusField = authenticatedPage.locator('button[data-testid="status"], [data-testid="status"]').first();
      if (await updatedStatusField.isVisible()) {
        await selectDropdownOption(authenticatedPage, updatedStatusField, 'Production');
      }

      // Navigate to Technical tab
      await authenticatedPage.click('button:has-text("Technical")');
      await authenticatedPage.waitForTimeout(500);

      // Fill technical details
      await authenticatedPage.fill('input[name*="url"], input[placeholder*="URL"]', 'https://updated-app.example.com');

      const frameworkInput = authenticatedPage.locator('input[name*="framework"], input[placeholder*="Framework"]').first();
      if (await frameworkInput.isVisible()) {
        await frameworkInput.fill('React');
      }

      const databaseInput = authenticatedPage.locator('input[name*="database"], input[placeholder*="Database"]').first();
      if (await databaseInput.isVisible()) {
        await databaseInput.fill('PostgreSQL');
      }

      // Save changes
      await authenticatedPage.click('button[type="submit"]:has-text("Save"), button:has-text("Update")');
      await authenticatedPage.waitForTimeout(3000);

      // Verify updates
      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator(`text=${appName}`).first()).toBeVisible({ timeout: 10000 });

      // Check if status is updated in the table
      await expect(authenticatedPage.locator('text=Production').first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Supplier Edit/Delete', () => {
    test('should edit supplier and update contract information', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/suppliers');
      await waitForTable(authenticatedPage);

      // Create supplier
      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      const supplierName = `Edit Test Supplier ${generateRandomString()}`;
      await authenticatedPage.fill('input[name="supplierName"]', supplierName);

      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(3000);

      // Verify creation
      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator(`text=${supplierName}`).first()).toBeVisible({ timeout: 10000 });

      // Edit the supplier
      await search(authenticatedPage, supplierName);
      await authenticatedPage.waitForTimeout(1000);

      const editButton = authenticatedPage.locator('button[aria-label*="Edit"], button:has-text("Edit")').first();
      await editButton.click();

      await waitForDialog(authenticatedPage);

      // Add contact information
      await authenticatedPage.fill('input[name*="primaryContactName"], input[placeholder*="Contact Name"]', 'Jane Doe');
      await authenticatedPage.fill('input[name*="primaryContactEmail"], input[placeholder*="Email"]', generateRandomEmail('contact'));
      await authenticatedPage.fill('input[name*="primaryContactPhone"], input[placeholder*="Phone"]', '+1-555-987-6543');

      // Look for contract tab or section
      const contractTab = authenticatedPage.locator('button:has-text("Contract"), button:has-text("Agreement")').first();
      if (await contractTab.isVisible()) {
        await contractTab.click();
        await authenticatedPage.waitForTimeout(500);

        // Fill contract details
        await authenticatedPage.fill('input[name*="contractNumber"], input[placeholder*="Contract Number"]', 'CONTRACT-2024-001');
        await authenticatedPage.fill('input[name*="contractValue"], input[placeholder*="Value"]', '100000');

        // Set contract dates
        const startDateInput = authenticatedPage.locator('input[name*="startDate"], input[placeholder*="Start Date"]').first();
        if (await startDateInput.isVisible()) {
          const today = new Date();
          await startDateInput.fill(today.toISOString().split('T')[0]);
        }

        const endDateInput = authenticatedPage.locator('input[name*="endDate"], input[placeholder*="End Date"]').first();
        if (await endDateInput.isVisible()) {
          const nextYear = new Date();
          nextYear.setFullYear(nextYear.getFullYear() + 1);
          await endDateInput.fill(nextYear.toISOString().split('T')[0]);
        }
      }

      // Save changes
      await authenticatedPage.click('button[type="submit"]:has-text("Save"), button:has-text("Update")');
      await authenticatedPage.waitForTimeout(3000);

      // Verify updates
      await navigateToDetails(authenticatedPage);

      // Look for updated contact information
      await expect(authenticatedPage.locator('text=Jane Doe').first()).toBeVisible({ timeout: 10000 });
    });

    test('should handle supplier with auto-generated unique identifier', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/suppliers');
      await waitForTable(authenticatedPage);

      // Create supplier without providing uniqueIdentifier
      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      const supplierName = `Auto ID Edit Test ${generateRandomString()}`;
      await authenticatedPage.fill('input[name="supplierName"]', supplierName);

      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(3000);

      // Verify creation
      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator(`text=${supplierName}`).first()).toBeVisible({ timeout: 10000 });

      // Edit the supplier
      await search(authenticatedPage, supplierName);
      await authenticatedPage.waitForTimeout(1000);

      const editButton = authenticatedPage.locator('button[aria-label*="Edit"], button:has-text("Edit")').first();
      await editButton.click();

      await waitForDialog(authenticatedPage);

      // Verify auto-generated identifier is visible and editable
      const uniqueIdField = authenticatedPage.locator('input[name="supplierIdentifier"], input[name*="uniqueIdentifier"]').first();
      if (await uniqueIdField.isVisible()) {
        const currentValue = await uniqueIdField.inputValue();
        expect(currentValue).toBeTruthy(); // Should have an auto-generated value

        // Try to update it
        const newId = `SUP-EDIT-${generateRandomString().toUpperCase()}`;
        await uniqueIdField.fill(newId);

        // Add additional information
        await authenticatedPage.fill('input[name*="primaryContactEmail"], input[placeholder*="Email"]', generateRandomEmail('updated'));

        await authenticatedPage.click('button[type="submit"]:has-text("Save"), button:has-text("Update")');
        await authenticatedPage.waitForTimeout(3000);

        // Verify updates
        await navigateToDetails(authenticatedPage);
        await expect(authenticatedPage.locator(`text=${newId}`).first()).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe('Edit Form Validation', () => {
    test('should validate required fields during edit', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/information');
      await waitForTable(authenticatedPage);

      // Create an asset first
      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      const assetName = `Validation Edit Test ${generateRandomString()}`;
      await authenticatedPage.fill('input[name="assetName"]', assetName);
      await authenticatedPage.fill('input[name="informationType"]', 'Test Data');

      const classificationField = authenticatedPage.locator('button[data-testid="dataClassification"], [data-testid="dataClassification"]').first();
      if (await classificationField.isVisible()) {
        await selectDropdownOption(authenticatedPage, classificationField, 'Internal');
      }

      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(3000);

      // Edit and try to clear required fields
      await search(authenticatedPage, assetName);
      await authenticatedPage.waitForTimeout(1000);

      const editButton = authenticatedPage.locator('button[aria-label*="Edit"], button:has-text("Edit")').first();
      await editButton.click();

      await waitForDialog(authenticatedPage);

      // Clear required field
      await authenticatedPage.fill('input[name="assetName"]', '');

      // Try to save
      await authenticatedPage.click('button[type="submit"]:has-text("Save"), button:has-text("Update")');
      await authenticatedPage.waitForTimeout(1000);

      // Should show validation error
      await expect(authenticatedPage.locator('text=/Asset Name is required/i')).toBeVisible({ timeout: 5000 });
    });
  });
});